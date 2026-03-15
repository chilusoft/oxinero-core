"""
API views for core models.
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import get_user_model, authenticate, login, logout
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.views.decorators.http import require_GET
from django.http import HttpResponse

from .models import UserLocation, SubscriptionTier, Profile, PaymentRecord
from .serializers import (
    UserLocationSerializer,
    SubscriptionTierSerializer,
    ProfileSerializer,
    ProfileUpdateSerializer,
    PaymentRecordSerializer,
    PaymentRecordCreateSerializer,
)

User = get_user_model()


class UserLocationViewSet(viewsets.ModelViewSet):
    """CRUD for user locations (e.g. onboarding)."""
    queryset = UserLocation.objects.all()
    serializer_class = UserLocationSerializer
    permission_classes = [IsAuthenticated]


class SubscriptionTierViewSet(viewsets.ReadOnlyModelViewSet):
    """List and retrieve subscription tiers."""
    queryset = SubscriptionTier.objects.all()
    serializer_class = SubscriptionTierSerializer
    permission_classes = [IsAuthenticated]


class ProfileViewSet(viewsets.GenericViewSet):
    """Current user profile: get/update."""
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Profile.objects.filter(user=self.request.user)

    def list(self, request):
        profile, _ = Profile.objects.get_or_create(
            user=request.user,
            defaults={
                "current_tier": SubscriptionTier.objects.filter(tier_id="freemium").first(),
            },
        )
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    def partial_update(self, request):
        profile, _ = Profile.objects.get_or_create(
            user=request.user,
            defaults={
                "current_tier": SubscriptionTier.objects.filter(tier_id="freemium").first(),
            },
        )
        serializer = ProfileUpdateSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(ProfileSerializer(profile).data)


class PaymentRecordViewSet(viewsets.ModelViewSet):
    """List and create payment records for current user."""
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PaymentRecord.objects.filter(user=self.request.user).order_by("-date")

    def get_serializer_class(self):
        if self.action == "create":
            return PaymentRecordCreateSerializer
        return PaymentRecordSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(
            PaymentRecordSerializer(serializer.instance).data,
            status=status.HTTP_201_CREATED,
        )


@require_GET
@ensure_csrf_cookie
def auth_csrf(request):
    """Ensure CSRF cookie is set for SPA (call once on app load)."""
    return HttpResponse(status=204)


@api_view(["POST"])
@permission_classes([AllowAny])
def auth_login(request):
    """Login with username/password. Returns profile on success."""
    username = request.data.get("username")
    password = request.data.get("password")
    if not username or not password:
        return Response(
            {"detail": "username and password required"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    user = authenticate(request, username=username, password=password)
    if user is None:
        return Response(
            {"detail": "Invalid credentials"},
            status=status.HTTP_401_UNAUTHORIZED,
        )
    login(request, user)
    profile, _ = Profile.objects.get_or_create(
        user=user,
        defaults={
            "current_tier": SubscriptionTier.objects.filter(tier_id="freemium").first(),
        },
    )
    return Response(ProfileSerializer(profile).data)


@csrf_exempt
@api_view(["GET", "POST"])
@permission_classes([AllowAny])
def auth_logout(request):
    """Logout current user. Accepts GET and POST; no auth required so the route always works."""
    if request.user.is_authenticated:
        logout(request)
    return Response({"detail": "Logged out"})
