import { getEnv } from '@/config/envs'

interface Keys {
  aid: string
  apiToken: string
}

interface PIANO {
  core: {
    elcomercio: Keys
    gestion: Keys
    clubelcomercio: Keys
  }
  apiVersion: {
    v1: string
    v3: string
  }
  fullApiVersion: {
    v1: string
    v3: string
  }
  report: {
    api: string
    fullApi: string
  }
}

export const getPianoAttrs = (): PIANO => {
  const envs = getEnv()
  return {
    core: {
      elcomercio: {
        aid: envs.ELCOMERCIO_AID,
        apiToken: envs.ELCOMERCIO_API_TOKEN
      },
      gestion: {
        aid: envs.GESTION_AID,
        apiToken: envs.GESTION_API_TOKEN
      },
      clubelcomercio: {
        aid: envs.CLUBELCOMERCIO_AID,
        apiToken: envs.CLUBELCOMERCIO_API_TOKEN
      }
    },
    apiVersion: {
      v1: '/id/api/v1',
      v3: '/api/v3'
    },
    fullApiVersion: {
      v1: `${envs.PIANO_API}/id/api/v1`,
      v3: `${envs.PIANO_API}/api/v3`
    },
    report: {
      api: '/rest',
      fullApi: `${envs.PIANO_REPORT_API}/rest`
    }
  }
}
