// Type Imports
export interface User {
  id: string
  name: string
  email: string
  role?: string
  [key: string]: any
}

// Local Storage Keys
const ACCESS_TOKEN_KEY = 'accessToken'
const USER_DATA_KEY = 'userData'

/**
 * Store access token in local storage
 */
export const setAccessToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ACCESS_TOKEN_KEY, token)
  }
}

/**
 * Retrieve access token from local storage
 */
export const getAccessToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(ACCESS_TOKEN_KEY)
  }

  return null
}

/**
 * Remove access token from local storage
 */
export const removeAccessToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
  }
}

/**
 * Store user data in local storage
 */
export const setUser = (user: User): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(user))
  }
}

/**
 * Retrieve user data from local storage
 */
export const getUser = (): User | null => {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem(USER_DATA_KEY)

    if (userData) {
      try {
        return JSON.parse(userData)
      } catch (error) {
        console.error('Error parsing user data:', error)

        return null
      }
    }
  }

  return null
}

/**
 * Remove user data from local storage
 */
export const removeUser = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_DATA_KEY)
  }
}

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getAccessToken()
}

/**
 * Clear all authentication data
 */
export const clearAuthData = (): void => {
  removeAccessToken()
  removeUser()
}
