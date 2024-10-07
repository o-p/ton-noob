import { Config } from '@ton/blueprint'

const customNetwork = process.env.API_KEY ? {
  network: {
    type: 'mainnet',
    endpoint: 'https://toncenter.com/api/v2/jsonRPC',
    version: 'v2',
    key: process.env.API_KEY,
  } as Config['network'],
} : null

export const config: Config = {
    // Compiler configurations: compilables/*.compile.ts
    separateCompilables: true,
    ...customNetwork,
}
