'use client'

// React Imports
import { createContext, useContext, useState, useEffect, useCallback } from 'react'

import type { ReactNode } from 'react'

// Utils Imports
import {
  getAccessToken,
  setAccessToken as saveAccessToken,
  getUser as getUserFromStorage,
  setUser as saveUser,
  clearAuthData,
  isAuthenticated as checkIsAuthenticated
} from '@/utils/authUtils'

import type { User } from '@/utils/authUtils'

// Types
interface AuthContextType {
  user: User | null
  accessToken: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  setUserData: (user: User, token: string) => void
}

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Provider Props
interface AuthProviderProps {
  children: ReactNode
}

// Auth Provider Component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check authentication on mount
  useEffect(() => {
    const initAuth = () => {
      const token = getAccessToken()
      const userData = getUserFromStorage()

      if (token && userData) {
        setAccessToken(token)
        setUser(userData)
      }

      setIsLoading(false)
    }

    initAuth()
  }, [])

  // Set user data and token
  const setUserData = useCallback((userData: User, token: string) => {
    saveAccessToken(token)
    saveUser(userData)
    setAccessToken(token)
    setUser(userData)
  }, [])

  // Login function
  const login = useCallback(
    async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
      try {
        // Call your login API
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api'}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        })

        const data = await res.json()

        if (res.status === 401 || !res.ok) {
          return {
            success: false,
            error: data.message || 'Invalid credentials'
          }
        }

        if (res.status === 200 && data.accessToken) {
          // Store token and user data
          const { accessToken: token, ...userData } = data

          setUserData(userData, token)

          return { success: true }
        }

        return {
          success: false,
          error: 'Login failed'
        }
      } catch (error: any) {
        console.error('Login error:', error)

        return {
          success: false,
          error: error.message || 'An error occurred during login'
        }
      }
    },
    [setUserData]
  )

  // Logout function
  const logout = useCallback(() => {
    clearAuthData()
    setAccessToken(null)
    setUser(null)
  }, [])

  const value: AuthContextType = {
    user,
    accessToken,
    isLoading,
    isAuthenticated: checkIsAuthenticated(),
    login,
    logout,
    setUserData
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
