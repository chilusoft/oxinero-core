import { useState } from 'react'
import { Stack, TextField, PrimaryButton, FontWeights, Text as FUIText } from '@fluentui/react'
import { api } from '../api/client'
import type { Profile } from '../api/types'

export function LoginPage({
  onSuccess,
  onError,
}: {
  onSuccess: (profile: Profile) => void
  onError: (message: string) => void
}) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !password) {
      onError('Username and password are required.')
      return
    }
    setLoading(true)
    onError('')
    try {
      const profile = await api.post<Profile>('/auth/login/', { username: username.trim(), password })
      onSuccess(profile)
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Login failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack tokens={{ childrenGap: 16 }} styles={{ root: { maxWidth: 320, margin: '0 auto', padding: 24 } }}>
        <FUIText variant="xxLarge" styles={{ root: { fontWeight: FontWeights.semibold } }}>
          Monexo
        </FUIText>
        <TextField
          label="Username"
          value={username}
          onChange={(_e, v) => setUsername(v || '')}
          disabled={loading}
          autoComplete="username"
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(_e, v) => setPassword(v || '')}
          disabled={loading}
          autoComplete="current-password"
        />
        <PrimaryButton type="submit" text="Sign in" disabled={loading} allowDisabledFocus />
      </Stack>
    </form>
  )
}
