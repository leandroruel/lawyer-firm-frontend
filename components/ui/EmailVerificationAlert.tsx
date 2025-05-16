"use client"

import { Alert, AlertDescription, AlertTitle } from "./alert"
import { Button } from "../Button"
import { useAuthStore } from "@/stores/useAuthStore"
import { useState, useEffect } from "react"
import { toast } from "sonner"

export function EmailVerificationAlert() {
  const { user, fetchUser } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)

  // Busca o usuário quando o componente montar
  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const handleResendVerification = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user?.email })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Falha ao reenviar email de verificação')
      }

      toast.success('Email de verificação reenviado com sucesso!')
      // Atualiza o estado do usuário após reenviar o email
      await fetchUser()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao reenviar email de verificação')
    } finally {
      setIsLoading(false)
    }
  }

  if (!user || user.emailVerified === true) {
    return null
  }

  return (
    <Alert className="mb-4 bg-yellow-50 dark:bg-yellow-950">
      <AlertTitle className="text-yellow-800 dark:text-yellow-200">
        Verificação de Email Pendente
      </AlertTitle>
      <AlertDescription className="mt-2 text-yellow-700 dark:text-yellow-300">
        Alguns recursos podem não estar dispóníveis até que seu email seja verificado. Não recebeu o email?
        <Button
          variant="ghost"
          className="ml-2 p-0 text-yellow-800 dark:text-yellow-200"
          onClick={handleResendVerification}
          disabled={isLoading}
        >
          {isLoading ? 'Enviando...' : 'Reenviar email'}
        </Button>
      </AlertDescription>
    </Alert>
  )
} 