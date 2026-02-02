'use client'

// React Imports
import { useRouter } from 'next/navigation'

// MUI Imports
import Button from '@mui/material/Button'

// Context Imports
import { useAuth } from '@/contexts/AuthContext'

// Utils Imports
import { getLocalizedUrl } from '@/utils/i18n'

interface LogoutButtonProps {
  locale?: string
}

/**
 * Example Logout Button Component
 *
 * Usage:
 * import LogoutButton from '@/components/LogoutButton'
 *
 * <LogoutButton locale="en" />
 */
export default function LogoutButton({ locale = 'en' }: LogoutButtonProps) {
  const { logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push(getLocalizedUrl('/login', locale as any))
  }

  return (
    <Button variant='outlined' color='error' onClick={handleLogout}>
      Logout
    </Button>
  )
}
