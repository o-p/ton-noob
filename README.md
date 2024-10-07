# TON Noob

+ TVM

  + 生成 __TVM assembly__ 的程式語言：

    + __FunC__

    + __Fift__

      + 轉譯成 FunC 後再編譯成 assembly，但最終 verifier 上應該都是以 FunC 呈現，
              因此目前先不研究。

+ TON 生態系

  + 規範，[TEPs](https://github.com/ton-blockchain/TEPs)、TON Enhancement Proposals，相當於 EVM 的 EIP、ERC

    + `TEP-74`: Jettons，Fungible tokens，TON 的 ERC-20

      + `TEP-89`: Jetton Wallet Discovery

    + `TEP-62`: NFT

    + `TEP-81`: DNS，*.ton domain，如果要 subdomain 需要自己部署合約並設置在主要 DNS 中，還沒玩過。

    + `TEP-2`: Address

  + API & SDK

    + Core Lib，包含 `@ton/ton` & `@ton/core`，主要是 RPC 的操作

    + [TON API](https://tonapi.io)，JS 開發者安裝 `@ton-api/client`

      + TON API Doc

        + [TON API Doc - Gitbook UI](https://docs.tonconsole.com/tonapi)
        + [TON API Doc - Swagger UI](https://tonapi.io//api-v2)

      + 比較多特殊功能，像是查 account 登記過的 public key (開啟 Wallet 合約需要)
      + TON Console 成員之一，必須先連接 TG 生成 API Key 才能試用

    + TON Adapter， `@ton-api/ton-adapter` 把上面兩個整合在一起

  + Tools

    + Explorers

      如果要發出有 __疑慮__ 的交易，建議是直接發到 mainnet 確認效果，並且兩家都看。
      主網上才會被標示 SPAM、另外交易所錢包也會主動回報 SPAM，這些在測試網上都不會觸發。

      + [TONScan](https://tonscan.org) ([Testnet ver.](https://testnet.tonscan.org/)) 首頁有一堆生態系的 link

      + [Tonviewer](https://tonviewer.com) ([Testnet ver.](https://testnet.tonviewer.com)) 主要錢包 TON Keeper 交易 link 導向這個網站

    + [TON Console](https://tonconsole.com) 生態大禮包，要連 TG

    + [TVM Retracer](https://retracer.ton.org) 交易解析工具

+ 其他

  + [目錄結構](#project-structure)

> [!IMPORTANT]
> 希望這是一篇看完 outline 就好的 README，
> 下面有一些額外資訊，對大多數人來說應該是可以跳過的廢話。

----

## About

> [!TIP]
> 所有文件都可能包含我自己方便檢索的中英混合註解（繁體中文），如果要使用在產品版本中，
> 建議自行替換成純英文版的，或是完全移除註解。

### Project Structure

> [!NOTE]
> 基本的目錄結構以 TON Blueprint 生成。

+ `contracts` - source code of all the smart contracts of the project and their dependencies.
+ `wrappers` - wrapper classes (implementing `Contract` from ton-core) for the contracts, including any [de]serialization primitives and compilation functions.
+ `tests` - tests for the contracts.
+ `scripts` - scripts used by the project, mainly the deployment scripts.

## How to use

### Build

`npx blueprint build` or `yarn blueprint build`

### Test

`npx blueprint test` or `yarn blueprint test`

### Deploy or run another script

`npx blueprint run` or `yarn blueprint run`

### Add a new contract

`npx blueprint create ContractName` or `yarn blueprint create ContractName`
