import { getEnv() } from '@/config/getEnv()'

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

export const piano: PIANO = {
  core: {
    elcomercio: {
      aid: getEnv().ELCOMERCIO_AID,
      apiToken: getEnv().ELCOMERCIO_API_TOKEN
    },
    gestion: {
      aid: getEnv().GESTION_AID,
      apiToken: getEnv().GESTION_API_TOKEN
    },
    clubelcomercio: {
      aid: getEnv().CLUBELCOMERCIO_AID,
      apiToken: getEnv().CLUBELCOMERCIO_API_TOKEN
    }
  },
  apiVersion: {
    v1: '/id/api/v1',
    v3: '/api/v3'
  },
  fullApiVersion: {
    v1: `${getEnv().PIANO_API}/id/api/v1`,
    v3: `${getEnv().PIANO_API}/api/v3`
  },
  report: {
    api: '/rest',
    fullApi: `${getEnv().PIANO_REPORT_API}/rest`
  }
}
