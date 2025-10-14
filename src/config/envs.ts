import { get } from 'env-var'

export interface AppEnv {
  NODE_ENV?: string
  ALLOWED_DOMAINS: string[]
  PIANO_API: string
  PIANO_REPORT_API: string
  ELCOMERCIO_AID: string
  GESTION_AID: string
  CLUBELCOMERCIO_AID: string
  ELCOMERCIO_API_TOKEN: string
  GESTION_API_TOKEN: string
  CLUBELCOMERCIO_API_TOKEN: string
  JWT_SECRET: string
  SENTRY_DNS: string
}

// export const envs(): AppEnv = {
//   NODE_ENV: get('NODE_ENV').default('development').asString(),
//   ALLOWED_DOMAINS: get('ALLOWED_DOMAINS').default('').asArray(),
//   PIANO_API: get('PIANO_API').required().asString(),
//   PIANO_REPORT_API: get('PIANO_REPORT_API').required().asString(),
//   ELCOMERCIO_AID: get('ELCOMERCIO_AID').required().asString(),
//   GESTION_AID: get('GESTION_AID').required().asString(),
//   CLUBELCOMERCIO_AID: get('CLUBELCOMERCIO_AID').required().asString(),
//   ELCOMERCIO_API_TOKEN: get('ELCOMERCIO_API_TOKEN').required().asString(),
//   GESTION_API_TOKEN: get('GESTION_API_TOKEN').required().asString(),
//   CLUBELCOMERCIO_API_TOKEN: get('CLUBELCOMERCIO_API_TOKEN')
//     .required()
//     .asString(),
//   JWT_SECRET: get('JWT_SECRET').required().asString(),
//   SENTRY_DNS: get('SENTRY_DNS').required().asString()
// }

export function getEnv(): AppEnv {
  return {
    NODE_ENV: get('NODE_ENV').default('development').asString(),
    ALLOWED_DOMAINS: get('ALLOWED_DOMAINS').default('').asArray(),
    PIANO_API: get('PIANO_API').required().asString(),
    PIANO_REPORT_API: get('PIANO_REPORT_API').required().asString(),
    ELCOMERCIO_AID: get('ELCOMERCIO_AID').required().asString(),
    GESTION_AID: get('GESTION_AID').required().asString(),
    CLUBELCOMERCIO_AID: get('CLUBELCOMERCIO_AID').required().asString(),
    ELCOMERCIO_API_TOKEN: get('ELCOMERCIO_API_TOKEN').required().asString(),
    GESTION_API_TOKEN: get('GESTION_API_TOKEN').required().asString(),
    CLUBELCOMERCIO_API_TOKEN: get('CLUBELCOMERCIO_API_TOKEN')
      .required()
      .asString(),
    JWT_SECRET: get('JWT_SECRET').required().asString(),
    SENTRY_DNS: get('SENTRY_DNS').required().asString()
  }
}
