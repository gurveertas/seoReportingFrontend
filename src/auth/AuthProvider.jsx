import { useCallback, useRef, useState } from 'react'
import { AuthContext } from './authContext.js'
import { getCurrentUser } from '../services/auth.js'

async function readAuthState() {
  try {
    const user = await getCurrentUser()
    return user === null
      ? { status: 'unauthenticated', user: null, error: null }
      : { status: 'authenticated', user, error: null }
  } catch (error) {
    return {
      status: 'error',
      user: null,
      error: error instanceof Error ? error.message : 'Unable to verify your session.',
    }
  }
}

export default function AuthProvider({ children }) {
  const authRequestId = useRef(0)
  const [authState, setAuthState] = useState({
    status: 'idle',
    user: null,
    error: null,
  })

  const refreshAuth = useCallback(async () => {
    const requestId = authRequestId.current + 1
    authRequestId.current = requestId
    setAuthState({ status: 'checking', user: null, error: null })
    const nextState = await readAuthState()

    if (requestId === authRequestId.current) {
      setAuthState(nextState)
    }

    return {
      authenticated: requestId === authRequestId.current
        && nextState.status === 'authenticated',
      error: requestId === authRequestId.current ? nextState.error : null,
    }
  }, [])

  const signOut = useCallback(() => {
    authRequestId.current += 1
    setAuthState({ status: 'unauthenticated', user: null, error: null })
  }, [])

  return (
    <AuthContext.Provider
      value={{
        authStatus: authState.status,
        authError: authState.error,
        currentUser: authState.user,
        isAuthenticated: authState.status === 'authenticated',
        refreshAuth,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
