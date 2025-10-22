import { getPianoInfo } from '@/lib/piano'
import { loginSocial } from '@/modules/piano/services/login/login-social'
import { handleCustomError, handleUnexpectedError } from '@/utils/handle-errors'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ provider: string }> }
) {
  const { provider } = await context.params

  const brand = req.headers.get('x-brand')

  const pianoCtx = getPianoInfo(brand)

  const { aid, apiToken } = pianoCtx

  console.log(
    `${req.nextUrl.origin}/api/auth/social/callback?client_id=${brand}`
  )

  try {
    const { success: socialSuccess, error: socialError } = await loginSocial({
      redirect_uri: `${req.nextUrl.origin}/api/auth/social/callback?client_id=${brand}`,
      social_type: provider,
      api_token: apiToken,
      aid: aid
    })

    if (socialError) {
      if (socialError.error_code_list) {
        const { message } = socialError.error_code_list[0] || {}
        if (
          message
            ?.toString()
            .includes('does not match the ones authorized for the OAuth client')
        ) {
          return handleCustomError({
            data: { message: 'Unauthorized for the OAuth client' }
          })
        }
      }

      throw socialError
    }

    return NextResponse.json({
      uri: socialSuccess?.uri
    })
  } catch (error) {
    console.log(error)
    return handleUnexpectedError(error)
  }
}
