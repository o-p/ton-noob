import { NetworkProvider } from '@ton/blueprint'
import {
  address,
  internal,
  SendMode,
  toNano,
  TonClient,
  WalletContractV5R1,
} from '@ton/ton'
import { mnemonicToPrivateKey } from '@ton/crypto'

const receivers = [
  address('UQD7FZ5o7m68UUY0guNQNVJ5JwgK50ZXAjiLuHjNH52dZQLf'),
  address('UQAxOQ9bNVjw_xaZIH1ALpK0mDbadeWIAKfsj0oOEij6Qe6h'),
  address('UQDiw5GsEekvI7OSP6oOp6itZB2VTV37314ZSC3M0RpED1CW'),
]

const comment = '🐣'
const value = toNano('0.1')

const mnemonic = process.env.WALLET_MNEMONIC!

export async function run(provider: NetworkProvider) {
  const ui = provider.ui()
  const sender = provider.sender()
  const network = provider.network() // 'mainnet' | 'testnet' | 'custom';
  const api = provider.api() as TonClient

  const keyPair = await mnemonicToPrivateKey(mnemonic.split(' '))

  const wallet = await WalletContractV5R1.create({
    workchain: 0, // basic workchain
    publicKey: keyPair.publicKey,
  })

  const seqno = await wallet.getSeqno(provider.provider(wallet.address))

  console.log('Wallet v5r1 seqno:', seqno)
  console.log('Wallet v5r1 address:', wallet.address.toRawString())

  const messages = receivers.map((to) => internal({
      to,
      value,
      bounce: true,
      body: comment,
  }))

  const msg = await wallet.createTransfer({
    messages,
    sendMode: SendMode.PAY_GAS_SEPARATELY + SendMode.IGNORE_ERRORS,
    seqno,
    authType: 'external',
    secretKey: keyPair.secretKey,
  })

  await api.sendExternalMessage(wallet, msg)
  console.log('Done')
}
