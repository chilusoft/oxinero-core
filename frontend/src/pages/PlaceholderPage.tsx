import { useNavigate } from 'react-router-dom'
import { Stack, Text, IconButton, FontWeights } from '@fluentui/react'

export function PlaceholderPage({
  title,
  backTo = '/profile',
}: {
  title: string
  backTo?: string
}) {
  const navigate = useNavigate()
  return (
    <Stack
      tokens={{ childrenGap: 24 }}
      styles={{ root: { maxWidth: 560, margin: '0 auto', padding: 24 } }}
    >
      <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 12 }}>
        <IconButton iconProps={{ iconName: 'Back' }} onClick={() => navigate(backTo)} ariaLabel="Back" />
        <Text variant="xLarge" styles={{ root: { fontWeight: FontWeights.semibold } }}>
          {title}
        </Text>
      </Stack>
      <Text variant="medium" styles={{ root: { color: 'var(--neutralSecondary)' } }}>
        This screen is coming soon.
      </Text>
    </Stack>
  )
}
