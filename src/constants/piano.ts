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
}

export function getPianoAttrs(): PIANO {
  return {
    core: {
      elcomercio: {
        aid: process.env.ELCOMERCIO_AID ?? '',
        apiToken: process.env.ELCOMERCIO_API_TOKEN ?? ''
      },
      gestion: {
        aid: process.env.GESTION_AID ?? '',
        apiToken: process.env.GESTION_API_TOKEN ?? ''
      },
      clubelcomercio: {
        aid: process.env.CLUBELCOMERCIO_AID ?? '',
        apiToken: process.env.CLUBELCOMERCIO_API_TOKEN ?? ''
      }
    },
    apiVersion: {
      v1: '/id/api/v1',
      v3: '/api/v3'
    },
    fullApiVersion: {
      v1: `${process.env.PIANO_API}/id/api/v1`,
      v3: `${process.env.PIANO_API}/api/v3`
    }
  }
}
