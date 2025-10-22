import { getPianoInfo } from '@/lib/piano'
import { loginSocialCode } from '@/modules/piano/services/login/login-social-code'
import { anonUserGet } from '@/modules/piano/services/user/anon-user-get.service'
import { handleCustomError, handleUnexpectedError } from '@/utils/handle-errors'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface GetResponse {
  status: 'error' | 'confirm' | 'additional_input' | 'success'
  message?: string
  // success or confirm
  user?: {
    uid?: string
    first_name: string
    last_name: string
    email: string
  }
  access_token?: string
  refresh_token?: string

  // confirm
  linking_state?: string
  social_type?: string
  has_password?: boolean
  linked_social_accounts?: []

  // additional input
  response_type?: string
  additional_input_state?: string
  need_email?: boolean

  // all
  redirect_uri?: string
}

export async function GET(req: NextRequest) {
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

    const payload: GetResponse = {
      status: 'error'
    }

    switch (socialSuccess?.status) {
      case 'ok':
        const { success: userGet, error: userGetError } = await anonUserGet({
          user_token: socialSuccess?.access_token || '',
          aid: aid
        })

        if (userGetError) throw userGetError

        payload.status = 'success'
        payload.user = {
          uid: userGet?.user.uid || '',
          email: userGet?.user.email || '',
          first_name: userGet?.user.first_name || '',
          last_name: userGet?.user.last_name || ''
        }
        payload.access_token = socialSuccess.access_token ?? ''
        payload.refresh_token = socialSuccess.refresh_token ?? ''
        payload.redirect_uri = socialSuccess.redirect_uri ?? ''
        break

      case 'confirm':
        payload.status = 'confirm'
        payload.linking_state = socialSuccess.linking_state ?? ''
        payload.social_type = socialSuccess.social_type ?? ''
        payload.user = {
          email: socialSuccess?.email || '',
          first_name: socialSuccess?.first_name || '',
          last_name: socialSuccess?.last_name || ''
        }
        payload.has_password = socialSuccess.password_confirmation_available
        payload.linked_social_accounts = socialSuccess.linked_social_accounts
        payload.redirect_uri = socialSuccess.redirect_uri ?? ''
        break

      case 'additional_input':
        payload.status = socialSuccess.status
        payload.social_type = socialSuccess.social_type
        payload.response_type = socialSuccess.response_type
        payload.additional_input_state = socialSuccess.additional_input_state
        payload.need_email = socialSuccess.need_email
        payload.redirect_uri = socialSuccess.redirect_uri
        break

      case 'error':
        payload.status = 'error'
        payload.message =
          socialSuccess?.error_message || socialSuccess?.warn_message || ''
      default:
    }

    console.log(socialSuccess)

    const html = `
      <html lang="es">
        <body>
          <script>
            const payload = JSON.parse(decodeURIComponent('${encodeURIComponent(
              JSON.stringify(payload)
            )}'));
            if (window.opener) {
              window.opener.postMessage({ eventName: 'auth-login-callback', payload }, '*');
              window.close();
            } else {
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
