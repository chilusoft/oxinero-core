import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { Stack, Nav, Text, IconButton } from '@fluentui/react'
import type { INavLink } from '@fluentui/react'

const STORAGE_KEY = 'monexo-nav-collapsed'

const navLinks: INavLink[] = [
  { key: 'home', name: 'Home', url: '/home', icon: 'Home' },
  { key: 'ladder', name: 'Ladder', url: '/ladder', icon: 'MountainClimbing' },
  { key: 'learn', name: 'Learn', url: '/learn', icon: 'ReadingMode' },
  { key: 'profile', name: 'Profile', url: '/profile', icon: 'Contact' },
]

export function Shell() {
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true'
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(collapsed))
    } catch {
      /* ignore */
    }
  }, [collapsed])

  const onNavClick = (ev?: React.MouseEvent<HTMLElement>, item?: INavLink) => {
    if (ev?.defaultPrevented || !item?.url) return
    ev?.preventDefault()
    navigate(item.url)
  }

  const navWidth = collapsed ? 48 : 260

  return (
    <Stack horizontal styles={{ root: { height: '100vh', overflow: 'hidden' } }}>
      <Stack
        styles={{
          root: {
            width: navWidth,
            minWidth: navWidth,
            borderRight: '1px solid var(--neutralLight)',
            backgroundColor: 'var(--neutralLighter)',
            flexShrink: 0,
            transition: 'width 0.2s ease, min-width 0.2s ease',
          },
        }}
      >
        <Stack
          horizontal
          horizontalAlign="space-between"
          verticalAlign="center"
          tokens={{ padding: collapsed ? 12 : 20 }}
          styles={{ root: { borderBottom: '1px solid var(--neutralLight)' } }}
        >
          {!collapsed && (
            <Text variant="xLarge" styles={{ root: { fontWeight: 600 } }}>
              Monexo
            </Text>
          )}
          <IconButton
            iconProps={{ iconName: collapsed ? 'GlobalNavButton' : 'ChevronLeft' }}
            onClick={() => setCollapsed((c) => !c)}
            ariaLabel={collapsed ? 'Expand navigation' : 'Collapse navigation'}
            styles={{
              root: collapsed ? { margin: '0 auto' } : undefined,
            }}
          />
        </Stack>
        <Nav
          groups={[{ links: navLinks }]}
          selectedKey={navLinks.find((l) => location.pathname === l.url)?.key ?? 'home'}
          onLinkClick={onNavClick}
          styles={{
            root: { width: '100%' },
            link: {
              marginLeft: 0,
              paddingLeft: collapsed ? 12 : 20,
              paddingRight: collapsed ? 12 : 16,
            },
            compositeLink: { marginLeft: 0 },
            linkText: collapsed
              ? { overflow: 'hidden', width: 0, padding: 0, margin: 0 }
              : undefined,
          }}
        />
      </Stack>
      <Stack
        grow
        styles={{
          root: {
            overflow: 'auto',
            backgroundColor: 'var(--neutralLighterAlt)',
          },
        }}
      >
        <div className="shell-content">
          <Outlet />
        </div>
      </Stack>
    </Stack>
  )
}
