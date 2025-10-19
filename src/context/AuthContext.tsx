'use client'

import { createContext, ReactNode, useContext, useState } from 'react'

type User = { uid: string; firstName: string; lastName: string; email: string }

export type Channel = 'organic' | 'newsletters' | 'landing' | 'premium'

type UserContextType = {
  email: string
  user: User | null
  token: string
  clientId: string
  redirectUri: string
  channel: Channel
  setEmail: (email: string) => void
  setUser: (data: User | null) => void
  setToken: (data: string) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function isValidChannel(channel: string) {
  if (['organic', 'landing', 'newsletters', 'premium'].includes(channel))
    return true
  false
}

export function AuthProvider({
  children,
  initialClientId,
  initialRedirectUri,
  initialChannel
}: {
  children: ReactNode
  initialClientId: string
  initialRedirectUri: string
  initialChannel: Channel
}) {
  const [email, setEmail] = useState('')
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState('')
  const [clientId] = useState(initialClientId)
  const [redirectUri] = useState(initialRedirectUri)
  const [channel] = useState<Channel>(initialChannel)

  return (
    <UserContext.Provider
      value={{
        email,
        user,
        token,
        clientId,
        redirectUri,
        channel,
        setEmail,
        setUser,
        setToken
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}
