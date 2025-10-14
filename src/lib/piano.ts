import { Brands, BRANDS } from '@/constants/brands'
import { getPianoAttrs } from '@/constants/piano'

export function getPianoInfo(brand: string | null) {
  console.log('NODE_ENV:', process.env.NODE_ENV)
  console.log('PIANO API', process.env.PIANO_API)
  console.log('ALLOWED_DOMAINS', process.env.ALLOWED_DOMAINS)

  const piano = getPianoAttrs()

  if (brand && brand in BRANDS) {
    return {
      aid: piano.core[brand as Brands].aid,
      apiToken: piano.core[brand as Brands].apiToken,
      brand: brand
    }
  }
  throw { message: 'Not exists Piano Info' }
}
