from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth import get_user_model

from .models import UserLocation, SubscriptionTier, Profile, PaymentRecord

User = get_user_model()


@admin.register(UserLocation)
class UserLocationAdmin(admin.ModelAdmin):
    list_display = ("id", "region", "country", "state", "city")
    list_filter = ("region",)


@admin.register(SubscriptionTier)
class SubscriptionTierAdmin(admin.ModelAdmin):
    list_display = ("tier_id", "name", "purpose", "price_africa", "price_usa")
    list_filter = ("tier_id",)


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "full_name", "email", "current_tier", "theme_mode")
    list_filter = ("theme_mode", "current_tier")
    raw_id_fields = ("user", "location", "current_tier")


@admin.register(PaymentRecord)
class PaymentRecordAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "type", "amount", "currency", "gateway", "date", "status")
    list_filter = ("type", "status", "gateway")
    raw_id_fields = ("user",)
    date_hierarchy = "date"
