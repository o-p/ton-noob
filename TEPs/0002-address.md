- **TEP**: [2](https://github.com/ton-blockchain/TEPs/pull/2)
- **title**: TON Addresses
- **status**: Active
- **type**: Core
- **authors**: -
- **created**: 07.09.2019
- **replaces**: -
- **replaced by**: -

# Summary

This document describes TON addresses and their representation.

# Specification

## Smart-contract addresses

Smart-contract addresses in the TON Network consist of two parts:

(a) the workchain ID (a signed 32-bit integer) and

> 第一部分，32-bit 正負整數，代表其工作鏈

(b) the address inside the workchain (64-512 bits depending on the workchain).

> 第二部分，依工作鏈設定，可能為 64 至 512 bits 的實際地址

Currently, only the masterchain (workchain_id=-1) and the basic workchain (workchain_id=0) are running in the TON Blockchain Network. Both of them have 256-bit addresses, so until a new different workchains appears we assume that workchain_id is either 0 or -1 and that the address inside the workchain is exactly 256-bit.

> 目前只有兩條工作鏈， `-1` masterchain、 `0` basic chain，都是採用 256 bits 地址

Under the conditions stated above, the smart-contract address can be represented in the following forms:

A) "Raw": <decimal workchain_id>:<64 hexadecimal digits with address>

> __Raw 格式__
>
> $$
> \overbrace{ \mathtt{ -1 } }^{ Chain\ ID } : \underbrace{ \mathtt{ e56754f83426f69b09267bd876ac97c44821345b7e266bd956a7bfbfb98df35c } }_{ Hex\ 格式地址，目前有使用的兩條鏈都是 \ 256\ bits \ (64\ Hex \ digits) }
> $$

B) "User-friendly", which is obtained by first generating:
- one tag byte (0x11 for "bounceable" addresses, 0x51 for "non-bounceable"; add +0x80 if the address should not be accepted by software running in the mainnet network)
- one byte containing a signed 8-bit integer with the workchain_id (0x00 for the basic workchain, 0xff for the masterchain)
- 32 bytes containing 256 bits of the smart-contract address inside the workchain (big-endian)
- 2 bytes containing CRC16-CCITT of the previous 34 bytes

> __使用者友善格式__
>
> - 標籤位  1 byte，0x11 代表 tx 會 bounce，0x51 則否。兩者可加上 0x80 表現不用於 mainnet。(加上後: 0x91 & 0xD1)
> - 工作鏈  1 byte，0x00 為 basic workchain，0xFF 為 masterchain。
> - 地址位 32 bytes
> - 檢查碼  2 bytes，以 CRC16-CCITT 計算前面 34 bytes 的結果。
>
> 共 36 bytes，以 base64 或 base64url 編碼表示，後者以 `_` & `-` 替換前者的 `/` & `+`，生成共 48 個大小寫有別的拉丁字母。
> 錢包是以 base64url 呈現，但規則上是兩種格式都必須支援。
>
> | Bounceable          | Workchain | Test Only | Hex Prefix | Base64 Prefix |
> | :-----------------: | :-------: | :-------: | :--------: | :-----------: |
> | :white_check_mark:  |   basic   |           |  `0x1100`  | `EQ`          |
> | :x:                 |   basic   |           |  `0x5100`  | `UQ`          |
> | :white_check_mark:  |  master   |           |  `0x11FF`  | `Ef`          |
> | :x:                 |  master   |           |  `0x51FF`  | `Uf`          |
> | :white_check_mark:  |   basic   | :u7981:   |  `0x9100`  | `kQ`          |
> | :x:                 |   basic   | :u7981:   |  `0xD100`  | `0Q`          |
> | :white_check_mark:  |  master   | :u7981:   |  `0x91FF`  | `kf`          |
> | :x:                 |  master   | :u7981:   |  `0xD1FF`  | `0f`          |

In case B), the 36 bytes thus obtained are then encoded using base64 (i.e., with digits, upper- and lowercase Latin letters, '/' and '+') or base64url (with '_' and '-' instead of '/' and '+'), yielding 48 printable non-space characters.

Example:

The "root dns" (a special smart contract residing in the masterchain) has the address

`-1:e56754f83426f69b09267bd876ac97c44821345b7e266bd956a7bfbfb98df35c`

in the "raw" form (notice that uppercase Latin letters 'A'..'F' may be used instead of 'a'..'f')

and

`Ef_lZ1T4NCb2mwkme9h2rJfESCE0W34ma9lWp7-_uY3zXDvq` (bounceable)

`Uf_lZ1T4NCb2mwkme9h2rJfESCE0W34ma9lWp7-_uY3zXGYv` (non-bounceable)

in the "user-friendly" form (to be displayed by user-friendly clients).

Notice that both forms (base64 and base64url) are valid and must be accepted.

## Wallets applications

At the moment, TON wallets work with addresses as follows:

For receiving:

- Wallets display the user's address in a user-friendly bounceable or non-bounceable form (at the moment, the majority of wallet apps display bounceable form).

When sending:

1) The wallet app checks the validity of the destination address representation - its length, valid characters, prefix and checksum. If the address is not valid, then an alert is shown and the sending operation is not performed.

2) If the address has a testnet flag, and the wallet app works with the mainnet network, then an alert is shown and the sending operation is not performed.

3) The wallet app retrieve from address bounceable flag.

4) The wallet app check the destination address - if it has `unitialized` state wallet force set `bounce` field of sending message to `false` and ignore bounceable/non-bounceable flag from address representation.

    > 發交易至未初始化過的錢包地址時，會強制將交易的 bounce 設定為 false。
    > 反之，則會以地址表示式為準，設定交易的 bounce 選項。

5) If destination is not `unitialized` then wallet app uses the bounceable/non-bounceable flag from the address representation for the `bounce` field of sending message.

## Public keys

The ubiquitous 256-bit Ed25519 public keys can be represented in the following forms:

> 256-bit Ed25519 公鑰也有 Raw & Friendly 兩種型式

A) "Raw": <64 hexadecimal digits with address>

B) "User-friendly" or "armored", which is obtained by first generating:

- one tag byte 0x3E, meaning that this is a public key
- one tag byte 0xE6, meaning that this is a Ed25519 public key
- 32 bytes containing the standard binary representation of the Ed25519 public key
- 2 bytes containing the big-endian representation of CRC16-CCITT of the previous 34 bytes.

> - 0x3E 開頭標示這是公鑰
> - 0xE6 代表這是 Ed25519 演算法的公鑰
> - 接著 32 bytes 公鑰本體
> - 最後 2 bytes 以 CRC16-CCITT checksum 前面 34 bytes
>
> 這種表示法會是 Pu 開頭的 48 位大小寫有別拉丁字母。

The resulting 36-byte sequence is converted into a 48-character base64 or base64url string in the standard fashion.

For example, the Ed25519 public key `E39ECDA0A7B0C60A7107EC43967829DBE8BC356A49B9DFC6186B3EAC74B5477D` (usually represented by a sequence of 32 bytes `0xE3, 0x9E, ..., 0x7D`) has the following "armored" representation:

`Pubjns2gp7DGCnEH7EOWeCnb6Lw1akm538YYaz6sdLVHfRB2`

> [!TIP]
> JS Script 測試參考 [Print Public Key](../scripts/printPublicKey.ts)

## ADNL address

The ADNL protocol based on 256-bit abstract addresses.

The ADNL address can be represented in the following forms:

A) "Raw": <64 hexadecimal digits with address>

B) "User-friendly" or "armored", which is obtained by first generating:

- one tag byte 0x2d, meaning that this is a ADNL address
- 32 bytes containing 256 bits of the ADNL address (big-endian)
- 2 bytes containing the big-endian representation of CRC16-CCITT of the previous 34 bytes.

The resulting 35-byte sequence is converted into a 55-character base32 string in the standard fashion.

Example:

For example ADNL address `45061C1D4EC44A937D0318589E13C73D151D1CEF5D3C0E53AFBCF56A6C2FE2BD` has the following "armored" representation:

`vcqmha5j3ceve35ammfrhqty46rkhi455otydstv66pk2tmf7rl25f3`

# Drawbacks

- It is impossible to extract the public key from the address, which is needed for some tasks (for example, to send an encrypted message to this address).
   Thus, until the smart contract is deployed for this address, there is no way to get the public key on-chain.

- (UI) Most OS do not allow you to select an address with double click because of '_', '-', '/', '+' base64 symbols.

# Rationale and alternatives

- The prefix (the first byte(s)) allows you to understand exactly what type this address or key is.

- The checksum built into the address prevents the loss of funds due to a user typo.

- Built-in testnet flag prevents loss of funds by a user who mistakenly tries to send real coins to a testnet address.

- A different form of address than most other blockchains allows the user to more easily identify the TON address.
