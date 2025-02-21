import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    // Cria a resposta
    const nextResponse = NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })

    // Se a autenticação foi bem sucedida, configura o cookie
    if (response.ok && data.token) {
      nextResponse.cookies.set({
        name: 'token',
        value: data.token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        // Defina maxAge baseado na expiração do seu token
        maxAge: 60 * 60 * 24 * 7 // 7 dias como exemplo
      })
    }

    return nextResponse
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao processar a requisição' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
} 