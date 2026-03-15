import { useNavigate } from 'react-router-dom'
import { Stack, Text, FontWeights, ProgressIndicator } from '@fluentui/react'
import { useAuth } from '../context/AuthContext'

const quickActions = [
  { label: 'Top up $3', subtitle: 'PawaPay / Cellulant', path: '/freemium-airtime' },
  { label: '$10 bill pay', subtitle: 'PayPal', path: '/freemium-billpay' },
  { label: 'Klarna BNPL', subtitle: 'Pay later', path: '/klarna-bnpl' },
  { label: 'Budget & cash flow', subtitle: 'Plan essentials', path: '/budget-cashflow' },
  { label: 'My score', subtitle: 'Monexo score', path: '/learn' },
  { label: 'Learn', subtitle: '2‑min sprints', path: '/learn' },
]

export function HomePage() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const tierName = profile?.current_tier_detail?.name ?? 'Freemium'
  const freemiumOffer = '$3 airtime or data'

  return (
    <div className="home-layout" style={{ maxWidth: '100%' }}>
      <Stack tokens={{ childrenGap: 24 }}>
        <Stack tokens={{ childrenGap: 4 }}>
          <Text variant="medium" styles={{ root: { color: 'var(--neutralSecondary)' } }}>
            Welcome back
          </Text>
          <Text variant="xxLarge" styles={{ root: { fontWeight: FontWeights.semibold } }}>
            Your Ladder
          </Text>
        </Stack>

        <Stack
          tokens={{ padding: 20 }}
          styles={{
            root: {
              backgroundColor: 'var(--neutralLighter)',
              borderRadius: 16,
              cursor: 'pointer',
            },
          }}
          onClick={() => navigate('/freemium-airtime')}
        >
          <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
            <Text variant="xLarge" styles={{ root: { fontWeight: FontWeights.semibold } }}>
              Freemium
            </Text>
            <Text variant="small" styles={{ root: { color: 'var(--neutralSecondary)' } }}>
              →
            </Text>
          </Stack>
          <Text variant="medium" styles={{ root: { color: 'var(--neutralSecondary)', marginTop: 6 } }}>
            Start with {freemiumOffer}
          </Text>
          <ProgressIndicator
            percentComplete={0.25}
            styles={{ root: { marginTop: 16 }, progressBar: { borderRadius: 4 } }}
          />
        </Stack>

        <Stack tokens={{ childrenGap: 8 }}>
          <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold } }}>
            Your impact
          </Text>
          <Stack
            tokens={{ childrenGap: 12, padding: 20 }}
            styles={{
              root: {
                backgroundColor: 'var(--neutralLighter)',
                borderRadius: 16,
              },
            }}
          >
            <ImpactRow icon="📈" label="Building credit" value="—" />
            <ImpactRow icon="💰" label="Borrowing cost saved" value="—" />
            <ImpactRow icon="🪜" label="Tier progress" value={tierName} />
          </Stack>
        </Stack>
      </Stack>

      <Stack tokens={{ childrenGap: 16 }}>
        <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold } }}>
          Quick actions
        </Text>
        <div className="quick-actions-grid">
          {quickActions.map((a) => (
            <Stack
              key={a.path}
              tokens={{ padding: 20, childrenGap: 8 }}
              styles={{
                root: {
                  backgroundColor: 'var(--neutralLighter)',
                  borderRadius: 16,
                  cursor: 'pointer',
                  minHeight: 100,
                },
              }}
              onClick={() => navigate(a.path)}
            >
              <Text variant="medium" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                {a.label}
              </Text>
              <Text variant="small" styles={{ root: { color: 'var(--neutralSecondary)' } }}>
                {a.subtitle}
              </Text>
            </Stack>
          ))}
        </div>
      </Stack>
    </div>
  )
}

function ImpactRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
      <Stack horizontal tokens={{ childrenGap: 12 }} verticalAlign="center">
        <span>{icon}</span>
        <Text variant="medium" styles={{ root: { color: 'var(--neutralSecondary)' } }}>
          {label}
        </Text>
      </Stack>
      <Text variant="medium" styles={{ root: { fontWeight: FontWeights.semibold } }}>
        {value}
      </Text>
    </Stack>
  )
}
