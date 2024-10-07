import { Buffer } from 'buffer'
import { NetworkProvider } from '@ton/blueprint'
import{ TonApiClient, Api } from '@ton-api/client'
import { crc16 } from '@ton/ton'

const apiKey = process.env.TON_API_KEY!

const tonApi = (function () {
  // Configure the client
  const http = new TonApiClient({
    // baseUrl: 'https://tonapi.io',
    apiKey,
  })

  const api = new Api(http)

  return api
})() as Api<unknown>

export async function run(provider: NetworkProvider) {
  const sender = provider.sender()
  console.log('Raw addr: %s', sender.address!.toRawString())

  const pub = await tonApi.accounts.getAccountPublicKey(sender.address!) as unknown as { publicKey: string }
  console.log('Raw public key: %s', pub)

  console.log(
    'Friendly public key: %s',
    friendlyPubKey(pub.publicKey)
  )
}

function friendlyPubKey(pubKey: string) {
  const TAG_PUBLIC_KEY = `3E`
  const TAG_Ed25519_PUBLIC_KEY = `E6`

  const head = `${TAG_PUBLIC_KEY}${TAG_Ed25519_PUBLIC_KEY}`
  const body = pubKey.startsWith('0x') ? pubKey.slice(2) : pubKey

  const buffer = Buffer.from(`${head}${body}`, 'hex')
  const checksum = crc16(buffer).toString('hex')

  const complete36Bytes = `${head}${body}${checksum}`

  console.log('36 Hex bytes: %s', complete36Bytes)

  return Buffer.from(complete36Bytes, 'hex').toString('base64url')
}
