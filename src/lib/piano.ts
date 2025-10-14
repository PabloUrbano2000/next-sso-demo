import { Brands, BRANDS } from '@/constants/brands'
import { getPianoAttrs } from '@/constants/piano'

export function getPianoInfo(brand: string | null) {
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
