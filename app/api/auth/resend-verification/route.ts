import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    const { email } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    if (!email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      )
    }
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/send-email-verification`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email })
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Erro na resposta do backend:', data)
      return NextResponse.json(
        { error: data.message || 'Erro ao reenviar email de verificação' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Erro ao processar a requisição:', error)
    return NextResponse.json(
      { error: 'Erro ao processar a requisição' },
      { status: 500 }
    )
  }
}