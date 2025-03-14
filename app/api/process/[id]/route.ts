import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { id } = await params

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/process/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { error: errorData.message || 'Erro ao buscar processo' },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    return NextResponse.json(data)
  } catch (error) {
    console.error("Erro na API:", error)
    return NextResponse.json(
      { error: 'Erro ao processar a requisição' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { id } = params
    const data = await request.json()

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/process/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const responseData = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: responseData.message || 'Erro ao atualizar processo' },
        { status: response.status }
      )
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.error("Erro na API:", error)
    return NextResponse.json(
      { error: 'Erro ao processar a requisição' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { id } = params

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/process/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { error: errorData.message || 'Erro ao excluir processo' },
        { status: response.status }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro na API:", error)
    return NextResponse.json(
      { error: 'Erro ao processar a requisição' },
      { status: 500 }
    )
  }
} 