"""
URL configuration for config project (Monexo / Oxinero).

Production is served at oxinero.chilusoft.dev/backend/api; set DJANGO_URL_BASE_PREFIX=backend in .env.
"""
import os
from pathlib import Path

from django.contrib import admin
from django.urls import path, include
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
env_file = BASE_DIR / ".env"
if env_file.exists():
    load_dotenv(env_file)

# URL prefix for production (e.g. "backend" -> /backend/admin/, /backend/api/)
DJANGO_URL_BASE_PREFIX = os.getenv("DJANGO_URL_BASE_PREFIX", "").strip().strip('"').strip("'")
if DJANGO_URL_BASE_PREFIX:
    DJANGO_URL_BASE_PREFIX = DJANGO_URL_BASE_PREFIX.strip("/")
    url_prefix = f"{DJANGO_URL_BASE_PREFIX}/"
else:
    url_prefix = ""

urlpatterns = [
    path(f"{url_prefix}admin/", admin.site.urls),
    path(f"{url_prefix}api/", include("core.urls")),
]
