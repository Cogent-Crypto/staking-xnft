import { PublicKey } from "@solana/web3.js";
export type StakePool = {
    poolName: String,
    apy: number,
    tokenSymbol: String,
    tokenMint: PublicKey,
    tokenImageURL: String,
    poolPublicKey: PublicKey,
    MEVDelegation: Boolean,
    website: String
}

export let stakePools: Array<StakePool> = [
    {
        poolName: "Jito",
        apy: 0,
        tokenSymbol: "JitoSOL",
        tokenMint: new PublicKey("J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn"),
        tokenImageURL: "https://storage.googleapis.com/token-metadata/JitoSOL.json",
        poolPublicKey: new PublicKey("Jito4APyf642JPZPx3hGc6WWJ8zPKtRbRs4P815Awbb"),
        MEVDelegation: true,
        website: "https://www.jito.network/"
    },
    {
        poolName: "Marinade",
        apy: 0,
        tokenSymbol: "mSOL",
        tokenMint: new PublicKey("J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn"),
        tokenImageURL: "https://storage.googleapis.com/token-metadata/JitoSOL-256.png",
        poolPublicKey: new PublicKey("Jito4APyf642JPZPx3hGc6WWJ8zPKtRbRs4P815Awbb"),
        MEVDelegation: false,
        website: "https://marinade.finance/"
    },
    {
        poolName: "Laine Stake Token",
        apy: 0,
        tokenSymbol: "laineSOL",
        tokenMint: new PublicKey("LAinEtNLgpmCP9Rvsf5Hn8W6EhNiKLZQti1xfWMLy6X"),
        tokenImageURL: "https://shdw-drive.genesysgo.net/4DUkKJB966oMk8zq57KkAUxqg9HpuWtZ3BKobhmYph39/laineSOL.json",
        poolPublicKey: new PublicKey("2qyEeSAWKfU18AFthrF7JA8z8ZCi1yt76Tqs917vwQTV"),
        MEVDelegation: true,
        website: "https://stake.laine.one/"
    },
    {
        poolName: "JPOOL Solana Token",
        apy: 0,
        tokenSymbol: "jSOL",
        tokenMint: new PublicKey("7Q2afV64in6N6SeZsAAB81TJzwDoD6zpqmHkzi9Dcavn"),
        tokenImageURL: "https://raw.githubusercontent.com/mfactory-lab/jpool-pub/main/assets/images/jsol.png",
        poolPublicKey: new PublicKey("CtMyWsrUtAwXWiGr9WjHT5fC3p3fgV8cyGpLTo2LJzG1"),
        MEVDelegation: false,
        website: "https://jpool.one/"
    },
    { //TODO finish
        poolName: "Socean staked SOL",
        apy: 0,
        tokenSymbol: "scnSOL",
        tokenMint: new PublicKey("7Q2afV64in6N6SeZsAAB81TJzwDoD6zpqmHkzi9Dcavn"),
        tokenImageURL: "https://raw.githubusercontent.com/mfactory-lab/jpool-pub/main/assets/images/jsol.png",
        poolPublicKey: new PublicKey("5oc4nmbNTda9fx8Tw57ShLD132aqDK65vuHH4RU1K4LZ"),
        MEVDelegation: false,
        website: "https://socean.fi/"
    },
]

