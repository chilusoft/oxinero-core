from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r"locations", views.UserLocationViewSet, basename="location")
router.register(r"tiers", views.SubscriptionTierViewSet, basename="tier")
router.register(r"payments", views.PaymentRecordViewSet, basename="payment")

urlpatterns = [
    path("", include(router.urls)),
    path("profile/", views.ProfileViewSet.as_view({"get": "list", "patch": "partial_update"}), name="profile"),
    path("auth/csrf/", views.auth_csrf, name="auth-csrf"),
    path("auth/login/", views.auth_login, name="auth-login"),
    path("auth/logout/", views.auth_logout, name="auth-logout"),
]
