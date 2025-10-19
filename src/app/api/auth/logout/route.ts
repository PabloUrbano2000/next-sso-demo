import { NextRequest, NextResponse } from 'next/server'

import { getPianoInfo } from '@/lib/piano'
import { LogoutDto } from '@/modules/auth/dtos/logout.dto'
import { handleUnexpectedError } from '@/utils/handle-errors'
import { cookies } from 'next/headers'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const brand = req.headers.get('x-brand')

  const pianoCtx = getPianoInfo(brand)

  const body = await req.json()

  const parsed = LogoutDto.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const { aid, apiToken } = pianoCtx
  const { token } = body as LogoutDto

  try {
    // const { success: logoutSuccess, error: logoutError } = await logout({
    //   api_token: apiToken,
    //   aid: aid,
    //   token: token
    // })

    // if (logoutError) throw logoutError

    const navCookies = await cookies()

    navCookies.set({
      name: 'token-sso',
      value: '',
      httpOnly: true,
      // secure: true,     // requiere HTTPS en prod
      path: '/',
      maxAge: 0,
      sameSite: 'lax'
    })

    return NextResponse.json({
      message: 'Logout success'
      // ...logoutSuccess
    })
  } catch (error) {
    console.log(error)
    return handleUnexpectedError(error)
  }
}
