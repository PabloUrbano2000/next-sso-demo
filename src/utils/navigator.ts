export const getDeviceCategory = (): 'mobile' | 'tablet' | 'desktop' => {
  if (typeof window === 'undefined') return 'desktop'

  const ua = navigator.userAgent || navigator.vendor || (window as any).opera

  if (
    /iPad|Tablet|Nexus 7|Nexus 10|KFAPWI/i.test(ua) ||
    (/Android/i.test(ua) && !/Mobile/i.test(ua)) ||
    (/Macintosh/i.test(ua) && 'ontouchend' in document)
  ) {
    return 'tablet'
  }

  if (/Mobi|Android|iPhone|iPod|Windows Phone/i.test(ua)) {
    return 'mobile'
  }

  return 'desktop'
}
