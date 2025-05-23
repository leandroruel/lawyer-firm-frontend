import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ 
        message: 'Não autorizado', 
        code: 'UNAUTHORIZED' 
      }, { status: 401 })
    }

    const body = await request.json()
    const { currentPassword, newPassword } = body

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/change-password`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
      body: JSON.stringify({
        currentPassword,
        newPassword
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      switch (data.code) {
        case 'INVALID_CURRENT_PASSWORD':
          return NextResponse.json(
            { message: 'Senha atual incorreta', code: data.code }, 
            { status: 401 }
          )
        case 'SAME_PASSWORD':
          return NextResponse.json(
            { message: 'A nova senha não pode ser igual à senha atual', code: data.code }, 
            { status: 400 }
          )
        case 'USER_NOT_FOUND':
          return NextResponse.json(
            { message: 'Usuário não encontrado', code: data.code }, 
            { status: 404 }
          )
        case 'UNAUTHORIZED':
          return NextResponse.json(
            { message: 'Não autorizado', code: data.code }, 
            { status: 401 }
          )
        case 'INTERNAL_ERROR':
        default:
          return NextResponse.json(
            { message: 'Erro interno do servidor', code: 'INTERNAL_ERROR' }, 
            { status: 500 }
          )
      }
    }

    return NextResponse.json({ 
      message: 'Senha alterada com sucesso',
      code: 'SUCCESS'
    })
  } catch (error) {
    return NextResponse.json(
      { 
        message: 'Erro ao processar a requisição', 
        code: 'INTERNAL_ERROR' 
      }, 
      { status: 500 }
    )
  }
}
