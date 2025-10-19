import { NextRequest, NextResponse } from 'next/server'

import { getPianoInfo } from '@/lib/piano'
import { CheckEmailDto } from '@/modules/auth/dtos/check-email.dto'
import { getUsers } from '@/modules/piano/services/identity/get-users.service'
import { socialAccountDetails } from '@/modules/piano/services/social/get-social-account-details.service'
import { handleUnexpectedError } from '@/utils/handle-errors'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const brand = req.headers.get('x-brand')

  const pianoCtx = getPianoInfo(brand)

  const body = await req.json()

  const parsed = CheckEmailDto.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const { aid, apiToken } = pianoCtx
  const { email } = body as CheckEmailDto

  try {
    const { success: getUserSuccess, error: getUserError } = await getUsers({
      email,
      api_token: apiToken,
      aid: aid
    })

    if (getUserError) {
      if (getUserError.error_code_list) {
        const { message } = getUserError.error_code_list[0] || {}
        if (message?.toString().includes('User with email')) {
          return NextResponse.json(
            {
              message: 'User not found'
            },
            { status: 200 }
          )
        }
      }

      throw getUserError
    }

    const { success: socialSuccess, error: socialError } =
      await socialAccountDetails({
        email: email,
        api_token: apiToken,
        aid: aid
      })

    if (socialError) throw socialError

    return NextResponse.json({
      uid: getUserSuccess?.uid,
      first_name: getUserSuccess?.first_name,
      last_name: getUserSuccess?.last_name,
      email: getUserSuccess?.email,
      socials: socialSuccess?.social_accounts.map((data) => ({
        provider: data.provider_name,
        email: data.user_email
      }))
    })
  } catch (error) {
    console.log(error)
    return handleUnexpectedError(error)
  }
}
