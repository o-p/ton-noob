import { CompilerConfig } from '@ton/blueprint'

export const compile: CompilerConfig = {
  lang: 'func',
  targets: [
    'contracts/imports/stdlib.fc',
    'contracts/tep74-jetton/jetton-utils.fc',
    'contracts/tep74-jetton/jetton-params.fc',
    'contracts/tep74-jetton/jetton-op-codes.fc',
    'contracts/tep74-jetton/minter/jetton-minter-params.fc',
    'contracts/tep74-jetton/minter/jetton-minter-discoverable.fc',
  ],
}
