import { useNavigate } from 'react-router-dom'
import { Stack, Text, FontWeights, PrimaryButton } from '@fluentui/react'
import { Icon } from '@fluentui/react/lib/Icon'
import { useAuth } from '../context/AuthContext'

const profileLinks = [
  { icon: 'Contact', label: 'Personal details', subtitle: 'Name, email, phone', path: '/personal-details' },
  { icon: 'MapPin', label: 'Location', subtitle: 'Region & address', path: '/select-location' },
  { icon: 'PaymentCard', label: 'Subscription & tier', subtitle: '', path: '/subscription-tiers' },
  { icon: 'VerifiedBrand', label: 'Income verification', subtitle: 'Required for higher tiers · 25% of income', path: '/income-verification' },
  { icon: 'ClearNight', label: 'Appearance', subtitle: 'Theme', path: '#' },
  { icon: 'Lock', label: 'Security', path: '#' },
  { icon: 'Help', label: 'Help & support', path: '#' },
  { icon: 'ProtectedDocument', label: 'Privacy policy', path: '/privacy-policy' },
  { icon: 'History', label: 'Payment history', path: '/payment-history' },
  { icon: 'PaymentCard', label: 'Payment gateways', path: '/payment-gateways' },
]

export function ProfilePage() {
  const navigate = useNavigate()
  const { profile, logout } = useAuth()
  const tierName = profile?.current_tier_detail?.name ?? '—'
  const locationSummary = profile?.location_detail
    ? `${(profile.location_detail as { region_display?: string }).region_display ?? '—'}`
    : '—'

  return (
    <div className="profile-layout" style={{ maxWidth: '100%' }}>
      <Stack tokens={{ childrenGap: 0 }}>
        <Stack tokens={{ childrenGap: 4 }} styles={{ root: { marginBottom: 24 } }}>
          <Text variant="medium" styles={{ root: { color: 'var(--neutralSecondary)' } }}>
            Account
          </Text>
          <Text variant="xxLarge" styles={{ root: { fontWeight: FontWeights.semibold } }}>
            Profile
          </Text>
        </Stack>

        <Stack
          tokens={{ childrenGap: 0 }}
          styles={{
            root: {
              backgroundColor: 'var(--neutralLighter)',
              borderRadius: 12,
              overflow: 'hidden',
            },
          }}
        >
          {profileLinks.map((link) => (
            <Stack
              key={link.path + link.label}
              horizontal
              verticalAlign="center"
              tokens={{ padding: '16px 20px', childrenGap: 16 }}
              styles={{
                root: {
                  cursor: 'pointer',
                  borderBottom: '1px solid var(--neutralLight)',
                },
              }}
              onClick={() => link.path !== '#' && navigate(link.path)}
            >
              <Icon iconName={link.icon as any} style={{ fontSize: 20, color: 'var(--neutralSecondary)' }} />
              <Stack grow tokens={{ childrenGap: 2 }}>
                <Text variant="medium" styles={{ root: { fontWeight: FontWeights.regular } }}>
                  {link.label}
                </Text>
                {(link.subtitle || (link.label === 'Subscription & tier' && tierName)) && (
                  <Text variant="small" styles={{ root: { color: 'var(--neutralSecondary)' } }}>
                    {link.label === 'Subscription & tier' ? tierName : link.subtitle}
                  </Text>
                )}
              </Stack>
              <Icon iconName="ChevronRight" style={{ fontSize: 12, color: 'var(--neutralSecondary)' }} />
            </Stack>
          ))}
        </Stack>

        <Stack
          tokens={{ padding: '24px 0', childrenGap: 12 }}
          styles={{ root: { marginTop: 24 } }}
        >
          <Text variant="small" styles={{ root: { color: 'var(--neutralSecondary)' } }}>
            Region: {locationSummary}
          </Text>
          <PrimaryButton text="Sign out" onClick={logout} style={{ maxWidth: 160 }} />
        </Stack>
      </Stack>

      {/* Desktop: summary card on the right */}
      <Stack
        tokens={{ padding: 24, childrenGap: 12 }}
        styles={{
          root: {
            backgroundColor: 'var(--neutralLighter)',
            borderRadius: 12,
            alignSelf: 'start',
          },
        }}
      >
        <Text variant="medium" styles={{ root: { fontWeight: FontWeights.semibold } }}>
          Account summary
        </Text>
        <Stack tokens={{ childrenGap: 8 }}>
          <Text variant="small" styles={{ root: { color: 'var(--neutralSecondary)' } }}>
            {profile?.username && `Signed in as ${profile.username}`}
          </Text>
          <Text variant="small" styles={{ root: { color: 'var(--neutralSecondary)' } }}>
            Tier: {tierName}
          </Text>
        </Stack>
      </Stack>
    </div>
  )
}
