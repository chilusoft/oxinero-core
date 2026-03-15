import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Stack, Text, IconButton, FontWeights, Spinner } from '@fluentui/react'
import { api } from '../api/client'

interface PaymentRecord {
  id: number
  type_display: string
  amount: string
  currency: string
  date: string
  status_display: string
}

export function PaymentHistoryPage() {
  const navigate = useNavigate()
  const [payments, setPayments] = useState<PaymentRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get<PaymentRecord[]>('/payments/')
      .then(setPayments)
      .catch(() => setPayments([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Stack
      tokens={{ childrenGap: 24 }}
      styles={{ root: { maxWidth: 560, margin: '0 auto', padding: 24 } }}
    >
      <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 12 }}>
        <IconButton iconProps={{ iconName: 'Back' }} onClick={() => navigate('/profile')} ariaLabel="Back" />
        <Text variant="xLarge" styles={{ root: { fontWeight: FontWeights.semibold } }}>
          Payment history
        </Text>
      </Stack>
      {loading ? (
        <Spinner label="Loading…" />
      ) : payments.length === 0 ? (
        <Text variant="medium" styles={{ root: { color: 'var(--neutralSecondary)' } }}>
          No payments yet.
        </Text>
      ) : (
        <Stack tokens={{ childrenGap: 8 }}>
          {payments.map((p) => (
            <Stack
              key={p.id}
              horizontal horizontalAlign="space-between"
              tokens={{ padding: 16 }}
              styles={{
                root: {
                  backgroundColor: 'var(--neutralLighter)',
                  borderRadius: 12,
                },
              }}
            >
              <Stack tokens={{ childrenGap: 2 }}>
                <Text variant="medium">{p.type_display}</Text>
                <Text variant="small" styles={{ root: { color: 'var(--neutralSecondary)' } }}>
                  {p.date} · {p.status_display}
                </Text>
              </Stack>
              <Text variant="medium" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                {p.currency} {p.amount}
              </Text>
            </Stack>
          ))}
        </Stack>
      )}
    </Stack>
  )
}
