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
        poolName: "Cogent",
        apy: 0,
        tokenSymbol: "cgntSOL",
        tokenMint: new PublicKey("CgnTSoL3DgY9SFHxcLj6CgCgKKoTBr6tp4CPAEWy25DE"),
        tokenImageURL: "https://cogent-cogs.s3.us-west-2.amazonaws.com/cgntSOL.png",
        poolPublicKey: new PublicKey("CgntPoLka5pD5fesJYhGmUCF8KU1QS1ZmZiuAuMZr2az"),
        MEVDelegation: true,
        website: "https://cogentcrypto.io/app"
    },
    {
        poolName: "Laine",
        apy: 0,
        tokenSymbol: "laineSOL",
        tokenMint: new PublicKey("LAinEtNLgpmCP9Rvsf5Hn8W6EhNiKLZQti1xfWMLy6X"),
        tokenImageURL: "https://shdw-drive.genesysgo.net/4DUkKJB966oMk8zq57KkAUxqg9HpuWtZ3BKobhmYph39/laineSOL.webp",
        poolPublicKey: new PublicKey("2qyEeSAWKfU18AFthrF7JA8z8ZCi1yt76Tqs917vwQTV"),
        MEVDelegation: true,
        website: "https://stake.laine.one/"
    },
    {
        poolName: "Jito",
        apy: 0,
        tokenSymbol: "JitoSOL",
        tokenMint: new PublicKey("J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn"),
        tokenImageURL: "https://storage.googleapis.com/token-metadata/JitoSOL-256.png",
        poolPublicKey: new PublicKey("Jito4APyf642JPZPx3hGc6WWJ8zPKtRbRs4P815Awbb"),
        MEVDelegation: true,
        website: "https://www.jito.network/"
    },
    {
        poolName: "Marinade",
        apy: 0,
        tokenSymbol: "mSOL",
        tokenMint: new PublicKey("mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So"),
        tokenImageURL: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So/logo.png",
        poolPublicKey: new PublicKey("Jito4APyf642JPZPx3hGc6WWJ8zPKtRbRs4P815Awbb"), //TODO: needs to be marinade's contract
        MEVDelegation: false,
        website: "https://marinade.finance/"
    },
    { //TODO finish
        poolName: "BlazeStake",
        apy: 0,
        tokenSymbol: "bSOL",
        tokenMint: new PublicKey("bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1"),
        tokenImageURL: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1/logo.png",
        poolPublicKey: new PublicKey("stk9ApL5HeVAwPLr3TLhDXdZS8ptVu7zp6ov8HFDuMi"),
        MEVDelegation: true,
        website: "https://stake.solblaze.org/"
    },
    {
        poolName: "JPOOL",
        apy: 0,
        tokenSymbol: "jSOL",
        tokenMint: new PublicKey("7Q2afV64in6N6SeZsAAB81TJzwDoD6zpqmHkzi9Dcavn"),
        tokenImageURL: "https://raw.githubusercontent.com/mfactory-lab/jpool-pub/main/assets/images/jsol.png",
        poolPublicKey: new PublicKey("CtMyWsrUtAwXWiGr9WjHT5fC3p3fgV8cyGpLTo2LJzG1"),
        MEVDelegation: false,
        website: "https://jpool.one/"
    },

    { //TODO finish
        poolName: "Socean",
        apy: 0,
        tokenSymbol: "scnSOL",
        tokenMint: new PublicKey("7Q2afV64in6N6SeZsAAB81TJzwDoD6zpqmHkzi9Dcavn"),
        tokenImageURL: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/5oVNBeEEQvYi1cX3ir8Dx5n1P7pdxydbGF2X4TxVusJm/logo.png",
        poolPublicKey: new PublicKey("5oc4nmbNTda9fx8Tw57ShLD132aqDK65vuHH4RU1K4LZ"),
        MEVDelegation: false,
        website: "https://socean.fi/"
    },

]

