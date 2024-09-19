import { CompilerConfig } from '@ton/blueprint'

export const compile: CompilerConfig = {
  lang: 'func',
  targets: [
    'contracts/tep74-jetton/wallet/jetton-wallet.fc',
  ],
}
