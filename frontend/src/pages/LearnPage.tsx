import { useNavigate } from 'react-router-dom'
import { Stack, Text, FontWeights } from '@fluentui/react'
import { Icon } from '@fluentui/react/lib/Icon'

const sprints = [
  { title: 'Budget in 2 minutes', done: true, duration: '2 min' },
  { title: 'Why on-time payments matter', done: true, duration: '2 min' },
  { title: 'Your Monexo score', done: false, duration: '2 min' },
  { title: 'Essential-first credit', done: false, duration: '2 min' },
]

export function LearnPage() {
  const navigate = useNavigate()

  return (
    <Stack tokens={{ childrenGap: 32 }} styles={{ root: { maxWidth: 720 } }}>
      <Stack tokens={{ childrenGap: 4 }}>
        <Text variant="medium" styles={{ root: { color: 'var(--neutralSecondary)' } }}>
          Rehabilitation Center
        </Text>
        <Text variant="xxLarge" styles={{ root: { fontWeight: FontWeights.semibold } }}>
          Financial literacy sprints
        </Text>
      </Stack>
      <Text variant="medium" styles={{ root: { color: 'var(--neutralSecondary)' } }}>
        Short 2-minute lessons that build your habits and score.
      </Text>

      <div className="learn-cards">
        <Stack
          tokens={{ padding: 20, childrenGap: 8 }}
          styles={{
            root: {
              backgroundColor: 'var(--neutralLighter)',
              borderRadius: 16,
            },
          }}
        >
          <Text variant="small" styles={{ root: { color: 'var(--neutralSecondary)' } }}>
            Monexo score
          </Text>
          <Text variant="xLarge" styles={{ root: { fontWeight: FontWeights.semibold } }}>
            —
          </Text>
        </Stack>
        <Stack
          tokens={{ padding: 20, childrenGap: 8 }}
          styles={{
            root: {
              backgroundColor: 'var(--neutralLighter)',
              borderRadius: 16,
            },
          }}
        >
          <Text variant="small" styles={{ root: { color: 'var(--neutralSecondary)' } }}>
            Sprints done
          </Text>
          <Text variant="xLarge" styles={{ root: { fontWeight: FontWeights.semibold } }}>
            2 / 4
          </Text>
        </Stack>
      </div>

      <Stack
        horizontal
        verticalAlign="center"
        tokens={{ padding: 20, childrenGap: 16 }}
        styles={{
          root: {
            backgroundColor: 'var(--neutralLighter)',
            borderRadius: 16,
            cursor: 'pointer',
          },
        }}
        onClick={() => navigate('/coaching')}
      >
        <Icon iconName="Contact" style={{ fontSize: 28 }} />
        <Stack grow tokens={{ childrenGap: 2 }}>
          <Text variant="medium" styles={{ root: { fontWeight: FontWeights.semibold } }}>
            Coaching
          </Text>
          <Text variant="small" styles={{ root: { color: 'var(--neutralSecondary)' } }}>
            Consistency · grace period · support
          </Text>
        </Stack>
        <Icon iconName="ChevronRight" style={{ fontSize: 14, color: 'var(--neutralSecondary)' }} />
      </Stack>

      <Stack tokens={{ childrenGap: 12 }}>
        <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold } }}>
          Sprints
        </Text>
        <Stack tokens={{ childrenGap: 12 }}>
          {sprints.map((s) => (
            <Stack
              key={s.title}
              horizontal
              verticalAlign="center"
              tokens={{ padding: 16, childrenGap: 16 }}
              styles={{
                root: {
                  backgroundColor: 'var(--neutralLighter)',
                  borderRadius: 16,
                  cursor: 'pointer',
                },
              }}
            >
              <Stack
                horizontalAlign="center"
                verticalAlign="center"
                styles={{
                  root: {
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: s.done ? 'var(--themePrimary)' : 'var(--neutralLight)',
                  },
                }}
              >
                {s.done ? (
                  <Icon iconName="CheckMark" styles={{ root: { color: 'white', fontSize: 18 } }} />
                ) : (
                  <Icon iconName="Play" style={{ fontSize: 20, color: 'var(--neutralSecondary)' }} />
                )}
              </Stack>
              <Stack grow tokens={{ childrenGap: 2 }}>
                <Text variant="medium" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                  {s.title}
                </Text>
                <Text variant="small" styles={{ root: { color: 'var(--neutralSecondary)' } }}>
                  {s.duration}
                </Text>
              </Stack>
              <Icon iconName="ChevronRight" style={{ fontSize: 14, color: 'var(--neutralSecondary)' }} />
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Stack>
  )
}
