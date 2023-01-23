import { PublicKey } from "@solana/web3.js"
let stake_pool_data = [
    {
    poolName: "Cogent",
    apy: 7.331625,
    exchangeRate: 1,
    tokenSymbol: "cgntSOL",
    tokenMint: "CgnTSoL3DgY9SFHxcLj6CgCgKKoTBr6tp4CPAEWy25DE",
    tokenImageURL: "https://cogent-cogs.s3.us-west-2.amazonaws.com/cgntSOL.png",
    poolPublicKey: "CgntPoLka5pD5fesJYhGmUCF8KU1QS1ZmZiuAuMZr2az",
    MEVDelegation: true,
    website: "https://cogentcrypto.io/app"
    },
    {
    poolName: "Laine",
    apy: 7.16,
    exchangeRate: 0.9850201708373778,
    tokenSymbol: "laineSOL",
    tokenMint: "LAinEtNLgpmCP9Rvsf5Hn8W6EhNiKLZQti1xfWMLy6X",
    tokenImageURL: "https://shdw-drive.genesysgo.net/4DUkKJB966oMk8zq57KkAUxqg9HpuWtZ3BKobhmYph39/laineSOL.webp",
    poolPublicKey: "2qyEeSAWKfU18AFthrF7JA8z8ZCi1yt76Tqs917vwQTV",
    MEVDelegation: true,
    website: "https://stake.laine.one/"
    },
    {
    poolName: "Jito",
    apy: 7.11781728204716,
    exchangeRate: 0.9853242865876993,
    tokenSymbol: "JitoSOL",
    tokenMint: "J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn",
    tokenImageURL: "https://storage.googleapis.com/token-metadata/JitoSOL-256.png",
    poolPublicKey: "Jito4APyf642JPZPx3hGc6WWJ8zPKtRbRs4P815Awbb",
    MEVDelegation: true,
    website: "https://www.jito.network/"
    },
    {
    poolName: "BlazeStake",
    apy: 7.532306834212202,
    exchangeRate: 0.9641864839547365,
    tokenSymbol: "bSOL",
    tokenMint: "bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1",
    tokenImageURL: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1/logo.png",
    poolPublicKey: "stk9ApL5HeVAwPLr3TLhDXdZS8ptVu7zp6ov8HFDuMi",
    MEVDelegation: true,
    website: "https://stake.solblaze.org/"
    },
    {
    poolName: "JPOOL",
    apy: 7.539841064738625,
    exchangeRate: 0.9256508665501934,
    tokenSymbol: "jSOL",
    tokenMint: "7Q2afV64in6N6SeZsAAB81TJzwDoD6zpqmHkzi9Dcavn",
    tokenImageURL: "https://raw.githubusercontent.com/mfactory-lab/jpool-pub/main/assets/images/jsol.png",
    poolPublicKey: "CtMyWsrUtAwXWiGr9WjHT5fC3p3fgV8cyGpLTo2LJzG1",
    MEVDelegation: false,
    website: "https://jpool.one/"
    },
    {
    poolName: "Socean",
    apy: 7.746324517740279,
    exchangeRate: 0.9161338214519077,
    tokenSymbol: "scnSOL",
    tokenMint: "7Q2afV64in6N6SeZsAAB81TJzwDoD6zpqmHkzi9Dcavn",
    tokenImageURL: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/5oVNBeEEQvYi1cX3ir8Dx5n1P7pdxydbGF2X4TxVusJm/logo.png",
    poolPublicKey: "5oc4nmbNTda9fx8Tw57ShLD132aqDK65vuHH4RU1K4LZ",
    MEVDelegation: false,
    website: "https://socean.fi/"
    },
    {
    poolName: "DAO Pool",
    apy: 6.941370849589776,
    exchangeRate: 0.9495460399641966,
    tokenSymbol: "daoSOL",
    tokenMint: "GEJpt3Wjmr628FqXxTgxMce1pLntcPV4uFi8ksxMyPQh",
    tokenImageURL: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/GEJpt3Wjmr628FqXxTgxMce1pLntcPV4uFi8ksxMyPQh/logo.png",
    poolPublicKey: "7ge2xKsZXmqPxa3YmXxXmzCp9Hc2ezrTxh6PECaxCwrL",
    MEVDelegation: false,
    website: "https://socean.fi/"
    },
    {
    poolName: "Marinade",
    apy: 6.826891329017507,
    exchangeRate: 1.0894405727740377,
    tokenSymbol: "mSOL",
    tokenMint: "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So",
    tokenImageURL: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So/logo.png",
    poolPublicKey: "Jito4APyf642JPZPx3hGc6WWJ8zPKtRbRs4P815Awbb",
    MEVDelegation: false,
    website: "https://marinade.finance/"
    }
    ]
    

export let stakepoolinfostatic = stake_pool_data.map((pool) => {
    return {
        ...pool,
        tokenMint: new PublicKey(pool.tokenMint),
        poolPublicKey: new PublicKey(pool.poolPublicKey)
    }
})