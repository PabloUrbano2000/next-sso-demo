export function appendQueryParams(
  urlString: string,
  params: Record<string, string>
) {
  try {
    const url = new URL(urlString)
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value)
    })
    return url.toString()
  } catch (err) {
    console.error('URL inválida:', urlString)
    return urlString
  }
}

export function appendPianoQueryParams(
  urlString: string,
  token: string,
  isRegister: 'true' | 'false'
) {
  return appendQueryParams(urlString, {
    token: token,
    registration: isRegister,
    gm_sso_redirect: 'true'
  })
}
