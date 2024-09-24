import { compile, NetworkProvider } from '@ton/blueprint'
import {
  toNano,
  TonClient,
  Address,
  address,
  WalletContractV5R1,
  beginCell,
  Cell,
  Slice,
  internal,
  SendMode,
} from '@ton/ton'
import { mnemonicToPrivateKey } from '@ton/crypto'

// const to = address('UQDVLSLr31to8UIdXWFgeiJarZR7Jmkvy8NjVIfbr10s0Pmf')

const receivers = [
  address('UQD7FZ5o7m68UUY0guNQNVJ5JwgK50ZXAjiLuHjNH52dZQLf'),
  address('UQDVLSLr31to8UIdXWFgeiJarZR7Jmkvy8NjVIfbr10s0Pmf'),
]

const comment = '🧘🧘 𑖌𑖼𑖦𑖜𑖰𑖢𑖟𑖿𑖦𑖸𑖮𑖳𑖽 🧘🧘'

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
      value: 0n,
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

/**
 * @notice The transaction is sent but the tx history is marked as `SUSPICIOUS` in Tonviewer
 */
const badExample = () => {
  // const body = beginCell()
  //   .storeUint(0, 32) // OP code
  //   .storeStringTail('🧘🧘 𑖌𑖼𑖦𑖜𑖰𑖢𑖟𑖿𑖦𑖸𑖮𑖳𑖽 🧘🧘')
  //   .endCell()

  // const result = await sender.send({
  //   to: sender.address!,
  //   value: 0n,
  //   // bounce: true, -> blueprint's Sender does not support `bounce` flag, because it is ignored by all used Sender APIs
  //   body,
  //   // sendMode?: Maybe<SendMode>; // note 這邊可以決定 gas 要怎麼帶
  //   // init?: Maybe<StateInit>;
  // })
}
