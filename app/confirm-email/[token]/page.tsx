"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/Card"
import { toast } from "sonner"
import { RiLoaderLine } from "@remixicon/react"
import { use } from "react"
import { useAuthStore } from "@/stores/useAuthStore"

export default function ConfirmEmailPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const router = useRouter()
  const { user } = useAuthStore()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { token } = use(params)

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const response = await fetch('/api/auth/confirm-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        })

        const data = await response.json()

        if (!response.ok) {
          if (response.status === 400 && data.message === 'Email já foi verificado anteriormente') {
            throw new Error('Este link de confirmação já foi utilizado. Você já pode fazer login normalmente.')
          }
          throw new Error(data.error || 'Erro ao confirmar email')
        }

        toast.success('Email confirmado com sucesso!')
        router.push(user ? '/dashboard' : '/login')
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Erro ao confirmar email')
        toast.error(error instanceof Error ? error.message : 'Erro ao confirmar email')
      } finally {
        setIsLoading(false)
      }
    }

    confirmEmail()
  }, [token, router, user])

  const handleNavigation = () => {
    router.push(user ? '/dashboard' : '/login')
  }

  console.log(user)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 dark:bg-gray-900">
      <Card className="w-full max-w-md px-6 py-12 sm:rounded-lg sm:px-12">
        <div className="text-center">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <RiLoaderLine className="h-8 w-8 animate-spin text-gray-400" />
              <p className="text-sm text-gray-500">Confirmando seu email...</p>
            </div>
          ) : error ? (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-yellow-600">Atenção</h2>
              <p className="text-gray-600">{error}</p>
              <button
                onClick={handleNavigation}
                className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
              >
                {Boolean(user) ? 'Voltar para home' : 'Voltar para login'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-green-600">Sucesso!</h2>
              <p className="text-gray-600">
                Seu email foi confirmado com sucesso. Você será redirecionado para a {user ? 'home' : 'página de login'}.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}