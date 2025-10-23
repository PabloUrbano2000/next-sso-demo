import { getPianoInfo } from '@/lib/piano'
import { authSocialState } from '@/modules/piano/services/identity/auth-social-state'
import { loginSocialState } from '@/modules/piano/services/identity/login-social-state'
import { anonUserGet } from '@/modules/piano/services/user/anon-user-get.service'
import { handleUnexpectedError } from '@/utils/handle-errors'
import { type NextRequest, NextResponse } from 'next/server'

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

// export async function GET(req: NextRequest) {
//   const search = req.nextUrl.searchParams
//   const clientId = req.nextUrl.hash

//   const responseId = search.get('response_id')

//   const pianoCtx = getPianoInfo(clientId)

//   const { aid, apiToken } = pianoCtx
//   try {
//     const { success: socialSuccess, error: socialError } =
//       await loginSocialCode({
//         response_id: responseId || '',
//         aid: aid,
//         api_token: apiToken
//       })

//     if (socialError) {
//       if (socialError.error_code_list) {
//         const { message } = socialError.error_code_list[0] || {}
//         if (message?.toString().includes('Invalid social response id')) {
//           return handleCustomError({
//             data: { message: 'Invalid social response id' }
//           })
//         }
//       }

//       throw socialError
//     }

//     const payload: GetResponse = {
//       status: 'error'
//     }

//     switch (socialSuccess?.status) {
//       case 'ok': {
//         const { success: userGet, error: userGetError } = await anonUserGet({
//           user_token: socialSuccess?.access_token || '',
//           aid: aid
//         })

//         if (userGetError) throw userGetError

//         payload.status = 'success'
//         payload.user = {
//           uid: userGet?.user.uid || '',
//           email: userGet?.user.email || '',
//           first_name: userGet?.user.first_name || '',
//           last_name: userGet?.user.last_name || ''
//         }
//         payload.access_token = socialSuccess.access_token ?? ''
//         payload.refresh_token = socialSuccess.refresh_token ?? ''
//         payload.redirect_uri = socialSuccess.redirect_uri ?? ''
//         break
//       }

//       case 'confirm':
//         payload.status = 'confirm'
//         payload.linking_state = socialSuccess.linking_state ?? ''
//         payload.social_type = socialSuccess.social_type ?? ''
//         payload.user = {
//           email: socialSuccess?.email || '',
//           first_name: socialSuccess?.first_name || '',
//           last_name: socialSuccess?.last_name || ''
//         }
//         payload.has_password = socialSuccess.password_confirmation_available
//         payload.linked_social_accounts = socialSuccess.linked_social_accounts
//         payload.redirect_uri = socialSuccess.redirect_uri ?? ''
//         break

//       case 'additional_input':
//         payload.status = socialSuccess.status
//         payload.social_type = socialSuccess.social_type
//         payload.response_type = socialSuccess.response_type
//         payload.additional_input_state = socialSuccess.additional_input_state
//         payload.need_email = socialSuccess.need_email
//         payload.redirect_uri = socialSuccess.redirect_uri
//         break

//       case 'error':
//         {
//           payload.status = 'error'
//           payload.message =
//             socialSuccess?.error_message || socialSuccess?.warn_message || ''
//         }
//         break
//       default:
//     }

//     console.log(socialSuccess)

//     const html = `
//       <html lang="es">
//         <body>
//           <script>
//             const payload = JSON.parse(decodeURIComponent('${encodeURIComponent(
//               JSON.stringify(payload)
//             )}'));
//             if (window.opener) {
//               window.opener.postMessage({ eventName: 'auth-login-callback', payload }, '*');
//               window.close();
//             } else {
//               window.location.href = '/auth/callback';
//             }
//           </script>
//         </body>
//       </html>
//     `

//     return new NextResponse(html, {
//       headers: { 'Content-Type': 'text/html' }
//     })
//   } catch (error) {
//     console.log(error)
//     return handleUnexpectedError(error)
//   }
// }

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams
  const clientId = search.get('state')
  const code = decodeURIComponent(search.get('code') || '')

  const pianoCtx = getPianoInfo(clientId)

  console.log(clientId)

  const { aid } = pianoCtx

  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID ?? '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET ?? '',
        redirect_uri: `${process.env.BASE_URL}/api/auth/social/callback`,
        grant_type: 'authorization_code'
      })
    })

    const tokens = await response.json()

    console.log('res google backend:', tokens)
    console.log('res google backend:', response)

    const { success: getStateSuccess, error: getStateError } =
      await loginSocialState({
        aid: aid,
        social_type: 'GOOGLE'
      })

    if (getStateError) throw getStateError

    const { success: postStateSuccess, error: postStateError } =
      await authSocialState({
        aid: aid,
        provider_access_token: tokens.id_token,
        state: getStateSuccess?.state || ''
      })

    if (postStateError) throw postStateError

    const payload: GetResponse = {
      status: 'error'
    }

    switch (postStateSuccess?.status) {
      case 'ok': {
        const { success: userGet, error: userGetError } = await anonUserGet({
          user_token: postStateSuccess?.access_token || '',
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
        payload.access_token = postStateSuccess.access_token ?? ''
        payload.refresh_token = postStateSuccess.refresh_token ?? ''
        payload.redirect_uri = postStateSuccess.redirect_uri ?? ''
        break
      }

      case 'confirm':
        payload.status = 'confirm'
        payload.linking_state = postStateSuccess.linking_state ?? ''
        payload.social_type = postStateSuccess.social_type ?? ''
        payload.user = {
          email: postStateSuccess?.email || '',
          first_name: postStateSuccess?.first_name || '',
          last_name: postStateSuccess?.last_name || ''
        }
        payload.has_password = postStateSuccess.password_confirmation_available
        payload.linked_social_accounts = postStateSuccess.linked_social_accounts
        payload.redirect_uri = postStateSuccess.redirect_uri ?? ''
        break

      case 'additional_input':
        payload.status = postStateSuccess.status
        payload.social_type = postStateSuccess.social_type
        payload.response_type = postStateSuccess.response_type
        payload.additional_input_state = postStateSuccess.additional_input_state
        payload.need_email = postStateSuccess.need_email
        payload.redirect_uri = postStateSuccess.redirect_uri
        break

      case 'error':
        {
          payload.status = 'error'
          payload.message =
            postStateSuccess?.error_message ||
            postStateSuccess?.warn_message ||
            ''
        }
        break
      default:
    }

    console.log(postStateSuccess)

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
