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
        MEVDelegation: true,
        website: "https://www.jito.network/"
    },
]

