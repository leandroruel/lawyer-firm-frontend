"use client"

import { useEffect } from 'react'
import { useAuthStore } from '@/stores/useAuthStore'

export function useUser() {
  const { user, isLoading, error, fetchUser } = useAuthStore()

  useEffect(() => {
    if (!user && !isLoading) {
      fetchUser()
    }
  }, [user, isLoading])

  return { user, isLoading, error }
} 