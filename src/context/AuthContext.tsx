'use client'

import { createContext, ReactNode, useContext, useState } from 'react'

type User = { uid: string; firstName: string; lastName: string; email: string }

type UserContextType = {
  email: string
  user: User | null
  clientId: string
  redirectUri: string
  setEmail: (email: string) => void
  setUser: (data: User | null) => void
  setClientId: (id: string) => void
  setRedirectUri: (uri: string) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function AuthProvider({
  children,
  initialClientId,
  initialRedirectUri
}: {
  children: ReactNode
  initialClientId: string
  initialRedirectUri: string
}) {
  const [email, setEmail] = useState('')
  const [user, setUser] = useState<User | null>(null)
  const [clientId, setClientId] = useState(initialClientId)
  const [redirectUri, setRedirectUri] = useState(initialRedirectUri)

  return (
    <UserContext.Provider
      value={{
        email,
        user,
        clientId,
        redirectUri,
        setEmail,
        setUser,
        setClientId,
        setRedirectUri
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
