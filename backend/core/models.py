"""
Core models aligned with the Monexo Flutter app (lib/core).
"""
from django.conf import settings
from django.db import models


class UserRegion(models.TextChoices):
    AFRICA = "africa", "Africa"
    USA = "usa", "USA"


class PaymentType(models.TextChoices):
    FREEMIUM_AIRTIME = "freemium_airtime", "Freemium airtime"
    FREEMIUM_BILL_PAY = "freemium_bill_pay", "Freemium bill pay"
    SUBSCRIPTION = "subscription", "Subscription"
    KLARNA_BNPL = "klarna_bnpl", "Klarna BNPL"


class PaymentStatus(models.TextChoices):
    COMPLETED = "completed", "Completed"
    FAILED = "failed", "Failed"
    CANCELLED = "cancelled", "Cancelled"


class PaymentGateway(models.TextChoices):
    PAWA_PAY = "pawa_pay", "PawaPay"
    CELLULANT = "cellulant", "Cellulant"
    PAYPAL = "pay_pal", "PayPal"
    KLARNA = "klarna", "Klarna"


class TierId(models.TextChoices):
    FREEMIUM = "freemium", "Freemium"
    ENTRY = "entry", "Entry"
    NEXT = "next", "Next"
    ADVANCED = "advanced", "Advanced"
    FINAL_TIER = "final_tier", "Final"


class UserLocation(models.Model):
    """User's selected location. Africa = country; USA = state + city."""

    region = models.CharField(
        max_length=10,
        choices=UserRegion.choices,
        default=UserRegion.AFRICA,
    )
    country = models.CharField(max_length=100, blank=True)  # Africa
    state = models.CharField(max_length=100, blank=True)   # USA
    city = models.CharField(max_length=100, blank=True)    # USA

    class Meta:
        ordering = ["id"]

    def __str__(self):
        if self.region == UserRegion.AFRICA and self.country:
            return self.country
        if self.region == UserRegion.USA and self.state and self.city:
            return f"{self.state}, {self.city}"
        return self.get_region_display()


class SubscriptionTier(models.Model):
    """One subscription tier: pricing and limits by region (from subscription_tiers.dart)."""

    tier_id = models.CharField(
        max_length=20,
        unique=True,
        choices=TierId.choices,
    )
    name = models.CharField(max_length=64)
    purpose = models.CharField(max_length=128)
    price_africa = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
    )
    price_usa = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
    )
    limit_africa = models.CharField(max_length=32, blank=True)
    limit_usa = models.CharField(max_length=32, blank=True)
    perks = models.JSONField(default=list)  # List[str]

    class Meta:
        ordering = ["tier_id"]

    def __str__(self):
        return f"{self.name} ({self.tier_id})"


class Profile(models.Model):
    """
    User profile: personal details and location (PersonalDetails + UserLocation + current tier).
    One-to-one with Django User.
    """

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile",
    )
    # PersonalDetails fields
    full_name = models.CharField(max_length=255, blank=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=32, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    address_line1 = models.CharField(max_length=255, blank=True)
    address_line2 = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100, blank=True)
    postal_code = models.CharField(max_length=20, blank=True)
    # Location
    location = models.ForeignKey(
        UserLocation,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="profiles",
    )
    # Current subscription tier
    current_tier = models.ForeignKey(
        SubscriptionTier,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="profiles",
    )
    theme_mode = models.CharField(
        max_length=10,
        choices=[("light", "Light"), ("dark", "Dark"), ("system", "System")],
        default="light",
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["user__username"]

    def __str__(self):
        return f"Profile: {self.user.username}"


class PaymentRecord(models.Model):
    """A single payment record for history (from payment_record.dart)."""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="payment_records",
    )
    type = models.CharField(
        max_length=24,
        choices=PaymentType.choices,
    )
    amount = models.DecimalField(max_digits=14, decimal_places=2)
    currency = models.CharField(max_length=6, default="USD")
    gateway = models.CharField(
        max_length=24,
        choices=PaymentGateway.choices,
    )
    date = models.DateTimeField()
    status = models.CharField(
        max_length=16,
        choices=PaymentStatus.choices,
    )
    description = models.CharField(max_length=512, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-date", "-created_at"]

    def __str__(self):
        return f"{self.get_type_display()} {self.amount} {self.currency} ({self.get_status_display()})"
