import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Stack, Text, TextField, PrimaryButton, IconButton, FontWeights } from '@fluentui/react'
import { useAuth } from '../context/AuthContext'
import { api } from '../api/client'

export function PersonalDetailsPage() {
  const navigate = useNavigate()
  const { profile, refreshProfile } = useAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? '')
      setEmail(profile.email ?? '')
      setPhone(profile.phone ?? '')
    }
  }, [profile])

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.patch('/profile/', {
        full_name: fullName || undefined,
        email: email || undefined,
        phone: phone || undefined,
      })
      await refreshProfile()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Stack
      tokens={{ childrenGap: 16 }}
      styles={{ root: { maxWidth: 480, margin: '0 auto', padding: 24 } }}
    >
      <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 12 }}>
        <IconButton iconProps={{ iconName: 'Back' }} onClick={() => navigate('/profile')} ariaLabel="Back" />
        <Text variant="xLarge" styles={{ root: { fontWeight: FontWeights.semibold } }}>
          Personal details
        </Text>
      </Stack>
      <TextField label="Full name" value={fullName} onChange={(_e, v) => setFullName(v || '')} />
      <TextField label="Email" type="email" value={email} onChange={(_e, v) => setEmail(v || '')} />
      <TextField label="Phone" value={phone} onChange={(_e, v) => setPhone(v || '')} />
      <Stack horizontal tokens={{ childrenGap: 12 }}>
        <PrimaryButton text="Save" onClick={handleSave} disabled={saving} />
      </Stack>
    </Stack>
  )
}
