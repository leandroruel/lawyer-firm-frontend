import { create } from 'zustand'

interface User {
  id: string
  name: string
  email: string
  tenantId: string
  emailVerified: boolean
}

interface AuthStore {
  user: User | null
  isLoading: boolean
  error: string | null
  fetchUser: () => Promise<void>
  setUser: (user: User | null) => void
  clearUser: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  
  fetchUser: async () => {
    try {
      set({ isLoading: true, error: null })
      const response = await fetch('/api/whoami')
      
      if (!response.ok) {
        throw new Error('Falha ao carregar usuário')
      }
      
      const user = await response.json()
      set({ user, isLoading: false })
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
    }
  },
  
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null })
})) 