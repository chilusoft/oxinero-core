import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import {
  ThemeProvider,
  Stack,
  MessageBar,
  MessageBarType,
  Spinner,
} from '@fluentui/react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { Shell } from './components/Shell'
import { LoginPage } from './pages/LoginPage'
import { HomePage } from './pages/HomePage'
import { LadderPage } from './pages/LadderPage'
import { LearnPage } from './pages/LearnPage'
import { ProfilePage } from './pages/ProfilePage'
import { SubscriptionTiersPage } from './pages/SubscriptionTiersPage'
import { PersonalDetailsPage } from './pages/PersonalDetailsPage'
import { PaymentHistoryPage } from './pages/PaymentHistoryPage'
import { PlaceholderPage } from './pages/PlaceholderPage'
import './App.css'

function AppRoutesWithLogin({ onError }: { onError: (msg: string) => void }) {
  const { profile, setProfile } = useAuth()

  if (profile === undefined) {
    return (
      <Stack horizontalAlign="center" verticalAlign="center" styles={{ root: { minHeight: '100vh' } }}>
        <Spinner label="Loading…" />
      </Stack>
    )
  }

  if (profile === null) {
    return (
      <Stack horizontalAlign="center" verticalAlign="center" styles={{ root: { minHeight: '100vh' } }}>
        <LoginPage onSuccess={setProfile} onError={onError} />
      </Stack>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<Shell />}>
        <Route index element={<Navigate to="/home" replace />} />
        <Route path="home" element={<HomePage />} />
        <Route path="ladder" element={<LadderPage />} />
        <Route path="learn" element={<LearnPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="subscription-tiers" element={<SubscriptionTiersPage />} />
        <Route path="personal-details" element={<PersonalDetailsPage />} />
        <Route path="payment-history" element={<PaymentHistoryPage />} />
        <Route path="payment-gateways" element={<PlaceholderPage title="Payment gateways" />} />
        <Route path="income-verification" element={<PlaceholderPage title="Income verification" />} />
        <Route path="budget-cashflow" element={<PlaceholderPage title="Budget & cash flow" />} />
        <Route path="coaching" element={<PlaceholderPage title="Coaching" backTo="/learn" />} />
        <Route path="freemium-airtime" element={<PlaceholderPage title="Freemium airtime" backTo="/home" />} />
        <Route path="freemium-billpay" element={<PlaceholderPage title="Freemium bill pay" backTo="/home" />} />
        <Route path="klarna-bnpl" element={<PlaceholderPage title="Klarna BNPL" backTo="/home" />} />
        <Route path="privacy-policy" element={<PlaceholderPage title="Privacy policy" />} />
        <Route path="select-location" element={<PlaceholderPage title="Select location" />} />
      </Route>
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  )
}

function App() {
  const [error, setError] = useState('')

  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <Stack styles={{ root: { minHeight: '100vh' } }}>
            {error && (
              <MessageBar
                messageBarType={MessageBarType.error}
                onDismiss={() => setError('')}
                dismissButtonAriaLabel="Close"
              >
                {error}
              </MessageBar>
            )}
            <AppRoutesWithLogin onError={setError} />
          </Stack>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
