'use client'

// React Imports
import { useEffect } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// Type Imports
import type { Locale } from '@configs/i18n'
import type { ChildrenType } from '@core/types'

// Context Imports
import { useAuth } from '@/contexts/AuthContext'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

export default function AuthGuard({ children, locale }: ChildrenType & { locale: Locale }) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const redirectUrl = getLocalizedUrl('/login', locale)

      router.replace(redirectUrl)
    }
  }, [isAuthenticated, isLoading, router, locale])

  // Show loading state while checking authentication
  if (isLoading) {
    return null
  }

  // Only render children if authenticated
  return <>{isAuthenticated ? children : null}</>
}
