# Generated data migration: seed subscription tiers from Flutter app

from django.db import migrations


def seed_tiers(apps, schema_editor):
    SubscriptionTier = apps.get_model("core", "SubscriptionTier")
    tiers = [
        {
            "tier_id": "freemium",
            "name": "Freemium",
            "purpose": "Start your footprint",
            "price_africa": None,
            "price_usa": None,
            "limit_africa": "",
            "limit_usa": "",
            "perks": [
                "Africa: $3 airtime or data",
                "USA: $10 toward a utility bill",
                "Basic dashboard",
                "View-only credit profile",
            ],
        },
        {
            "tier_id": "entry",
            "name": "Entry",
            "purpose": "Stabilization",
            "price_africa": 4.99,
            "price_usa": 9.99,
            "limit_africa": "$50",
            "limit_usa": "$200",
            "perks": [
                "Essential-first BNPL (utilities, rent, groceries, medicine)",
                "On-time payments reported to bureaus / profile",
                "Budgeting and cash-flow tools",
                "Basic in-app coaching",
            ],
        },
        {
            "tier_id": "next",
            "name": "Next",
            "purpose": "Recovery",
            "price_africa": 9.99,
            "price_usa": 19.99,
            "limit_africa": "$150",
            "limit_usa": "$700",
            "perks": [
                "Higher essential BNPL limits",
                "Small cash loans (US) or working capital (Africa)",
                "Faster credit line increases with good behavior",
                "Priority support · monthly coaching calls",
            ],
        },
        {
            "tier_id": "advanced",
            "name": "Advanced",
            "purpose": "Reintegration",
            "price_africa": 19.99,
            "price_usa": 29.99,
            "limit_africa": "$500",
            "limit_usa": "$2,000",
            "perks": [
                "Larger cash loans for major expenses",
                "SME business tools (Africa) · Rent/credit reporting (US)",
                "Savings tools and emergency reserves",
                "Weekly financial coaching",
            ],
        },
        {
            "tier_id": "final_tier",
            "name": "Final",
            "purpose": "Bankability & graduation",
            "price_africa": 29.99,
            "price_usa": 39.99,
            "limit_africa": "$1,000+",
            "limit_usa": "$5,000+",
            "perks": [
                "Highest credit limits",
                "Best rates · graduation to partner banks",
                "Dedicated account manager",
                "Exportable financial profile",
            ],
        },
    ]
    for t in tiers:
        SubscriptionTier.objects.get_or_create(tier_id=t["tier_id"], defaults=t)


def reverse_tiers(apps, schema_editor):
    SubscriptionTier = apps.get_model("core", "SubscriptionTier")
    SubscriptionTier.objects.filter(
        tier_id__in=["freemium", "entry", "next", "advanced", "final_tier"]
    ).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed_tiers, reverse_tiers),
    ]
