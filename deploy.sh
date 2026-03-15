#!/bin/bash

# Deployment script for Monexo (Oxinero)
# This script deploys the application to oxinero.chilusoft.dev
# Backend API is at oxinero.chilusoft.dev/backend/api
# (SSH connection is to chilusoft.dev server)

set -e  # Exit on error

SERVER_HOST="chilusoft.dev"
SERVER_USER="chilusoft"
CODEBASE_PATH="/opt/chilusoft/monexo-core"
BUILD_PATH="/var/www/oxinero"

# Get password from environment variable (reused throughout)
DEPLOY_PASS="${CHILUSOFT_SERVER_PASS:-${SERVER_PASS}}"

if [ -z "$DEPLOY_PASS" ]; then
    echo "Error: Server password not found in environment variables"
    echo "Please set CHILUSOFT_SERVER_PASS or SERVER_PASS"
    exit 1
fi

# Export for use in subprocesses
export DEPLOY_PASS

echo "🚀 Starting deployment to $SERVER_HOST (oxinero.chilusoft.dev)..."

# Build frontend locally
echo "📦 Building frontend locally..."
cd frontend

# Read REMOTE_API_URL from .env file if it exists
if [ -f .env ] || [ -f ../.env ]; then
  ENV_FILE=$([ -f .env ] && echo ".env" || echo "../.env")
  REMOTE_API_URL=$(grep "^REMOTE_API_URL=" "$ENV_FILE" 2>/dev/null | cut -d '=' -f2- | tr -d '"' | tr -d "'" | xargs)
  
  # Check if backend has DJANGO_URL_BASE_PREFIX configured
  BACKEND_PREFIX=""
  if [ -f ../backend/.env ]; then
    DJANGO_PREFIX=$(grep "^DJANGO_URL_BASE_PREFIX=" ../backend/.env 2>/dev/null | cut -d '=' -f2- | tr -d '"' | tr -d "'" | xargs)
    if [ -n "$DJANGO_PREFIX" ]; then
      DJANGO_PREFIX=$(echo "$DJANGO_PREFIX" | tr -d '/')
      BACKEND_PREFIX="/$DJANGO_PREFIX"
    fi
  fi
  
  if [ -n "$REMOTE_API_URL" ]; then
    # Ensure URL has protocol
    if [[ ! "$REMOTE_API_URL" =~ ^https?:// ]]; then
      REMOTE_API_URL="https://$REMOTE_API_URL"
    fi
    # Add backend prefix if configured and not already present
    if [ -n "$BACKEND_PREFIX" ] && [[ ! "$REMOTE_API_URL" =~ $BACKEND_PREFIX ]]; then
      # Insert backend prefix before /api
      if [[ "$REMOTE_API_URL" =~ /api ]]; then
        REMOTE_API_URL=$(echo "$REMOTE_API_URL" | sed "s|/api|$BACKEND_PREFIX/api|")
      else
        REMOTE_API_URL="$REMOTE_API_URL$BACKEND_PREFIX/api"
      fi
    elif [[ ! "$REMOTE_API_URL" =~ /api ]]; then
      # Ensure /api is at the end if not already present
      REMOTE_API_URL="$REMOTE_API_URL/api"
    fi
    export VITE_API_BASE_URL="$REMOTE_API_URL"
    echo "✅ Using API URL from .env: $VITE_API_BASE_URL"
  else
    # Default: oxinero.chilusoft.dev/backend/api
    DEFAULT_URL="https://oxinero.chilusoft.dev/backend/api"
    if [ -n "$BACKEND_PREFIX" ]; then
      DEFAULT_URL="https://oxinero.chilusoft.dev$BACKEND_PREFIX/api"
    fi
    export VITE_API_BASE_URL="$DEFAULT_URL"
    echo "⚠️  REMOTE_API_URL not found in .env, using default: $VITE_API_BASE_URL"
  fi
else
  export VITE_API_BASE_URL="https://oxinero.chilusoft.dev/backend/api"
  echo "⚠️  No .env file found, using default API URL: $VITE_API_BASE_URL"
fi

npm ci
npm run build
cd ..

# Upload frontend build to server
echo "📤 Uploading frontend build to server..."
# Create build directory on server with sudo and set permissions (reusing password)
sshpass -p "$DEPLOY_PASS" ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_HOST "SUDO_PASS='$DEPLOY_PASS' && echo \"\$SUDO_PASS\" | sudo -S mkdir -p $BUILD_PATH && echo \"\$SUDO_PASS\" | sudo -S chown -R $SERVER_USER:$SERVER_USER $BUILD_PATH && echo \"\$SUDO_PASS\" | sudo -S rm -rf $BUILD_PATH/*"

# Upload files using rsync (better for directories)
if command -v rsync &> /dev/null; then
  sshpass -p "$DEPLOY_PASS" rsync -avz --delete -e "ssh -o StrictHostKeyChecking=no" frontend/dist/ $SERVER_USER@$SERVER_HOST:$BUILD_PATH/
else
  # Fallback to scp if rsync is not available
  cd frontend/dist
  sshpass -p "$DEPLOY_PASS" scp -o StrictHostKeyChecking=no -r . $SERVER_USER@$SERVER_HOST:$BUILD_PATH/
  cd ../..
fi

# Deploy backend: pull code first so codebase exists for .env copy
echo "📤 Deploying backend to server..."
sshpass -p "$DEPLOY_PASS" ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_HOST "set -e && echo '📥 Pulling latest code...' && mkdir -p $CODEBASE_PATH && cd $CODEBASE_PATH && ( [ -d .git ] && ( git fetch origin main && git reset --hard origin/main ) || git clone https://github.com/chilusoft/monexo-core.git . )"

# Copy .env files to server (project-specific config)
echo "📋 Copying .env files to server..."
if [ -f .env ]; then
  sshpass -p "$DEPLOY_PASS" scp -o StrictHostKeyChecking=no .env $SERVER_USER@$SERVER_HOST:$CODEBASE_PATH/.env
  echo "  ✅ Copied .env"
fi
if [ -f backend/.env ]; then
  sshpass -p "$DEPLOY_PASS" scp -o StrictHostKeyChecking=no backend/.env $SERVER_USER@$SERVER_HOST:$CODEBASE_PATH/backend/.env
  echo "  ✅ Copied backend/.env"
fi
if [ ! -f .env ] && [ ! -f backend/.env ]; then
  echo "  ⚠️  No .env or backend/.env found locally; using existing server config if any."
fi

# Backend setup and service restart
sshpass -p "$DEPLOY_PASS" ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_HOST << ENDSSH
    set -e
    
    CODEBASE_PATH="$CODEBASE_PATH"
    BUILD_PATH="$BUILD_PATH"
    SUDO_PASS="$DEPLOY_PASS"
    
    # Helper function for sudo commands
    sudo_cmd() {
      echo "\$SUDO_PASS" | sudo -S \$@
    }
    
    echo "🔧 Setting up backend..."
    cd backend
    
    # Try to use existing virtual environment or create new one
    if [ -d "/home/chilusoft/.local/share/virtualenvs/monexo-core-"* ] 2>/dev/null; then
        VENV_PATH=\$(ls -d /home/chilusoft/.local/share/virtualenvs/monexo-core-* 2>/dev/null | head -1)
        source "\$VENV_PATH/bin/activate"
    elif [ -f "Pipfile" ]; then
        # Try pipenv, but fall back to venv if it fails
        if pipenv install 2>/dev/null; then
            pipenv run python manage.py migrate --noinput
            pipenv run python manage.py collectstatic --noinput || true
            echo "✅ Backend deployment complete!"
            exit 0
        else
            echo "⚠️ pipenv failed, falling back to venv..."
        fi
    fi
    
    # Use venv (fallback or primary method)
    if [ ! -d "venv" ]; then
        # Use whatever Python version is available
        PYTHON_CMD=\$(which python3 || which python)
        \$PYTHON_CMD -m venv venv
    fi
    source venv/bin/activate
    pip install -r requirements.txt 2>/dev/null || pip install django djangorestframework django-cors-headers
    python manage.py migrate --noinput
    python manage.py collectstatic --noinput || true
    
    echo "🔄 Restarting services..."
    # Try different service managers (using sudo)
    sudo_cmd systemctl restart oxinero-backend 2>/dev/null || true
    sudo_cmd systemctl restart oxinero-frontend 2>/dev/null || true
    sudo_cmd systemctl restart gunicorn 2>/dev/null || true
    sudo_cmd systemctl restart nginx 2>/dev/null || true
    sudo_cmd supervisorctl restart oxinero:* 2>/dev/null || true
    
    echo "✅ Deployment complete!"
ENDSSH

echo "✅ Deployment finished successfully!"
