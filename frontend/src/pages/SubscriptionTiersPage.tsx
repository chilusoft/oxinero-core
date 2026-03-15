import { useNavigate } from 'react-router-dom'
import { Stack, Text, FontWeights, IconButton } from '@fluentui/react'
import { useAuth } from '../context/AuthContext'

export function SubscriptionTiersPage() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const tierName = profile?.current_tier_detail?.name ?? 'Freemium'

  return (
    <Stack
      tokens={{ childrenGap: 24 }}
      styles={{ root: { maxWidth: 560, margin: '0 auto', padding: 24 } }}
    >
      <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 12 }}>
        <IconButton
          iconProps={{ iconName: 'Back' }}
          onClick={() => navigate('/profile')}
          ariaLabel="Back"
        />
        <Text variant="xLarge" styles={{ root: { fontWeight: FontWeights.semibold } }}>
          Subscription tiers
        </Text>
      </Stack>
      <Stack tokens={{ childrenGap: 4 }}>
        <Text variant="medium" styles={{ root: { color: 'var(--neutralSecondary)' } }}>
          Your plan
        </Text>
        <Text variant="xxLarge" styles={{ root: { fontWeight: FontWeights.semibold } }}>
          {tierName}
        </Text>
      </Stack>
      <Text variant="medium" styles={{ root: { color: 'var(--neutralSecondary)' } }}>
        Freemium, Entry, Next, Advanced, and Final tiers. Upgrade from Profile or contact support.
      </Text>
    </Stack>
  )
}
