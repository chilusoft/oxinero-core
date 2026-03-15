"""
DRF serializers for core models (aligned with Flutter app models).
"""
from rest_framework import serializers
from django.contrib.auth import get_user_model

from .models import (
    UserLocation,
    UserRegion,
    SubscriptionTier,
    Profile,
    PaymentRecord,
    PaymentType,
    PaymentStatus,
    PaymentGateway,
    TierId,
)

User = get_user_model()


class UserLocationSerializer(serializers.ModelSerializer):
    region_display = serializers.CharField(source="get_region_display", read_only=True)

    class Meta:
        model = UserLocation
        fields = [
            "id",
            "region",
            "region_display",
            "country",
            "state",
            "city",
        ]


class SubscriptionTierSerializer(serializers.ModelSerializer):
    tier_id_display = serializers.CharField(source="get_tier_id_display", read_only=True)

    class Meta:
        model = SubscriptionTier
        fields = [
            "id",
            "tier_id",
            "tier_id_display",
            "name",
            "purpose",
            "price_africa",
            "price_usa",
            "limit_africa",
            "limit_usa",
            "perks",
        ]


class ProfileSerializer(serializers.ModelSerializer):
    location_detail = UserLocationSerializer(source="location", read_only=True)
    current_tier_detail = SubscriptionTierSerializer(source="current_tier", read_only=True)
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Profile
        fields = [
            "id",
            "username",
            "full_name",
            "email",
            "phone",
            "date_of_birth",
            "address_line1",
            "address_line2",
            "city",
            "postal_code",
            "location",
            "location_detail",
            "current_tier",
            "current_tier_detail",
            "theme_mode",
            "updated_at",
        ]
        read_only_fields = ["updated_at"]


class ProfileUpdateSerializer(serializers.ModelSerializer):
    """Minimal serializer for PATCH (personal details + location + tier)."""

    class Meta:
        model = Profile
        fields = [
            "full_name",
            "email",
            "phone",
            "date_of_birth",
            "address_line1",
            "address_line2",
            "city",
            "postal_code",
            "location",
            "current_tier",
            "theme_mode",
        ]


class PaymentRecordSerializer(serializers.ModelSerializer):
    type_display = serializers.CharField(source="get_type_display", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    gateway_display = serializers.CharField(source="get_gateway_display", read_only=True)

    class Meta:
        model = PaymentRecord
        fields = [
            "id",
            "type",
            "type_display",
            "amount",
            "currency",
            "gateway",
            "gateway_display",
            "date",
            "status",
            "status_display",
            "description",
            "created_at",
        ]
        read_only_fields = ["created_at"]


class PaymentRecordCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentRecord
        fields = [
            "type",
            "amount",
            "currency",
            "gateway",
            "date",
            "status",
            "description",
        ]

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)
