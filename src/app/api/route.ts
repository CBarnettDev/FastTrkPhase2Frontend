import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = cookies()
  const token = (await cookieStore).get('token')?.value

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
    const response = await fetch(`${baseUrl}/vehicles`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch vehicles')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error : any) {
    return NextResponse.json(
      { message: error.message || 'Failed to fetch vehicles' },
      { status: 500 }
    )
  }
}