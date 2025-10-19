'use client'

import { createContext, ReactNode, useContext, useState } from 'react'

type User = { uid: string; firstName: string; lastName: string; email: string }

type UserContextType = {
  email: string
  user: User | null
  clientId: string
  redirectUri: string
  channel: string
  setEmail: (email: string) => void
  setUser: (data: User | null) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function AuthProvider({
  children,
  initialClientId,
  initialRedirectUri,
  initialChannel
}: {
  children: ReactNode
  initialClientId: string
  initialRedirectUri: string
  initialChannel: string
}) {
  const [email, setEmail] = useState('')
  const [user, setUser] = useState<User | null>(null)
  const [clientId] = useState(initialClientId)
  const [redirectUri] = useState(initialRedirectUri)
  const [channel] = useState(initialChannel)

  return (
    <UserContext.Provider
      value={{
        email,
        user,
        clientId,
        redirectUri,
        channel,
        setEmail,
        setUser
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
