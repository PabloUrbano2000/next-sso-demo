import { getPianoInfo } from '@/lib/piano'
import { loginSocialCode } from '@/modules/piano/services/login/login-social-code'
import { handleCustomError, handleUnexpectedError } from '@/utils/handle-errors'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  /*
  http://localhost:3000/api/auth/social/callback?response_id=SAROeypM4Bqu52t9MN6CjLVhx6vgZHUei74oNCuT15k7t4ibtg&internal_redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fsocial%2Fcallback&social_type=GOOGLE
*/
  const search = req.nextUrl.searchParams

  const client_id = search.get('client_id')
  const responseId = search.get('response_id')
  const pianoCtx = getPianoInfo(client_id)

  const { aid, apiToken } = pianoCtx
  try {
    const { success: socialSuccess, error: socialError } =
      await loginSocialCode({
        response_id: responseId || '',
        aid: aid,
        api_token: apiToken
      })

    if (socialError) {
      if (socialError.error_code_list) {
        const { message } = socialError.error_code_list[0] || {}
        if (message?.toString().includes('Invalid social response id')) {
          return handleCustomError({
            data: { message: 'Invalid social response id' }
          })
        }
      }

      throw socialError
    }

    console.log(socialSuccess)

    const html = `
      <html>
        <body>
          <script>
            const payload = ${JSON.stringify(socialSuccess)};
            if (window.opener) {
              window.opener.postMessage({ type: 'PIANO_LOGIN_SUCCESS', payload }, '*');
              window.close();
            } else {
              // fallback si no hay opener
              window.location.href = '/auth/callback';
            }
          </script>
        </body>
      </html>
    `

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' }
    })
  } catch (error) {
    console.log(error)
    return handleUnexpectedError(error)
  }
}
