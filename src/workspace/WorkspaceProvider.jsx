import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from '../auth/useAuth.js'
import { createClient as postClient, deleteClient as deleteClientRequest, getClients, updateClient as updateClientRequest } from '../services/clients.js'
import { WorkspaceContext } from './workspaceContext.js'

function userKey(user) {
  return String(user?.id ?? user?.username ?? user?.email ?? 'workspace')
}

export function WorkspaceProvider({ children }) {
  const { currentUser } = useAuth()
  const key = userKey(currentUser)
  const [snapshot, setSnapshot] = useState({ key: null, status: 'loading', clients: [], error: '' })
  const isCurrentSnapshot = snapshot.key === key
  const clients = useMemo(
    () => isCurrentSnapshot ? snapshot.clients : [],
    [isCurrentSnapshot, snapshot.clients],
  )
  const isLoading = !currentUser || !isCurrentSnapshot || snapshot.status === 'loading'
  const error = isCurrentSnapshot ? snapshot.error : ''

  const reloadClients = useCallback(async (signal) => {
    const nextClients = await getClients(signal)
    setSnapshot({ key, status: 'ready', clients: nextClients, error: '' })
    return nextClients
  }, [key])

  useEffect(() => {
    if (!currentUser) return undefined
    const controller = new AbortController()
    let active = true
    getClients(controller.signal)
      .then((nextClients) => {
        if (active) setSnapshot({ key, status: 'ready', clients: nextClients, error: '' })
      })
      .catch((loadError) => {
        if (!active || controller.signal.aborted) return
        setSnapshot({
          key,
          status: 'error',
          clients: [],
          error: loadError instanceof Error ? loadError.message : 'Unable to load clients.',
        })
      })
    return () => {
      active = false
      controller.abort()
    }
  }, [currentUser, key])

  const createClient = useCallback(async (client) => {
    const createdResponse = await postClient(client)
    const nextClients = await getClients()
    setSnapshot({ key, status: 'ready', clients: nextClients, error: '' })
    if (createdResponse?.id) {
      return nextClients.find((item) => item.id === createdResponse.id) || createdResponse
    }
    const created = [...nextClients].reverse().find((item) => item.name === client.name.trim())
    if (!created) throw new Error('The client was created, but could not be found in the client list.')
    return created
  }, [key])

  const updateClient = useCallback(async (clientId, changes) => {
    await updateClientRequest(clientId, changes)
    await reloadClients()
  }, [reloadClients])

  const deleteClient = useCallback(async (clientId) => {
    await deleteClientRequest(clientId)
    setSnapshot((current) => current.key === key
      ? { ...current, clients: current.clients.filter((client) => client.id !== clientId) }
      : current)
  }, [key])

  const value = useMemo(() => ({
    clients,
    isLoading,
    error,
    reloadClients,
    createClient,
    updateClient,
    deleteClient,
  }), [clients, isLoading, error, reloadClients, createClient, updateClient, deleteClient])

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
}
