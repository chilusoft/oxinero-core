import { Stack, Text, FontWeights } from '@fluentui/react'
import { Icon } from '@fluentui/react/lib/Icon'

const tiers = [
  { id: 'freemium', name: 'Freemium', purpose: 'Start your footprint', limit: '$3 airtime / $10 bill', done: true, current: false },
  { id: 'entry', name: 'Entry', purpose: 'Stabilization', limit: '$50 (Africa) / $200 (US)', done: false, current: true },
  { id: 'next', name: 'Next', purpose: 'Recovery', limit: '$150 / $700', done: false, current: false },
  { id: 'advanced', name: 'Advanced', purpose: 'Reintegration', limit: '$500 / $2,000', done: false, current: false },
  { id: 'final', name: 'Final', purpose: 'Bankability', limit: '$1,000+ / $5,000+', done: false, current: false },
]

export function LadderPage() {
  return (
    <div className="ladder-content">
      <Stack tokens={{ childrenGap: 24 }}>
        <Stack tokens={{ childrenGap: 4 }}>
          <Text variant="medium" styles={{ root: { color: 'var(--neutralSecondary)' } }}>
            Your progress
          </Text>
          <Text variant="xxLarge" styles={{ root: { fontWeight: FontWeights.semibold } }}>
            The Ladder
          </Text>
        </Stack>
        <Text variant="medium" styles={{ root: { color: 'var(--neutralSecondary)' } }}>
          3 months of successful subscription unlocks Entry.
        </Text>
        <Stack tokens={{ childrenGap: 16 }}>
          {tiers.map((tier, i) => (
            <TierRow
              key={tier.id}
              tier={tier}
              hasConnector={i < tiers.length - 1}
            />
          ))}
        </Stack>
      </Stack>
    </div>
  )
}

function TierRow({
  tier,
  hasConnector,
}: {
  tier: (typeof tiers)[0]
  hasConnector: boolean
}) {
  return (
    <Stack horizontal tokens={{ childrenGap: 16 }}>
      <Stack horizontalAlign="center" tokens={{ childrenGap: 4 }}>
        <Stack
          horizontalAlign="center"
          verticalAlign="center"
          styles={{
            root: {
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: tier.done
                ? 'var(--themePrimary)'
                : tier.current
                  ? 'var(--neutralTertiary)'
                  : 'var(--neutralLight)',
              border: tier.current ? '2px solid var(--themePrimary)' : undefined,
            },
          }}
        >
          {tier.done ? (
            <Icon iconName="CheckMark" styles={{ root: { color: 'white', fontSize: 18 } }} />
          ) : null}
        </Stack>
        {hasConnector && (
          <div
            style={{
              width: 2,
              height: 32,
              backgroundColor: 'var(--neutralTertiary)',
              marginTop: 4,
            }}
          />
        )}
      </Stack>
      <Stack tokens={{ childrenGap: 2 }} styles={{ root: { paddingTop: 6 } }}>
        <Text variant="medium" styles={{ root: { fontWeight: FontWeights.semibold } }}>
          {tier.name}
        </Text>
        <Text variant="small" styles={{ root: { color: 'var(--neutralSecondary)' } }}>
          {tier.purpose}
        </Text>
        <Text variant="small" styles={{ root: { color: 'var(--neutralSecondary)' } }}>
          {tier.limit}
        </Text>
      </Stack>
    </Stack>
  )
}
