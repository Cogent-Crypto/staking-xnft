import {useState, useEffect} from 'react';
import ReactXnft, {LocalStorage, useConnection, usePublicKey} from "react-xnft";
import { PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import type { Connection } from "@solana/web3.js";
import { Axios } from "axios";
import { programs } from "@metaplex/js";
import { publicKey } from '@project-serum/anchor/dist/cjs/utils';

const {
  metadata: { Metadata },
} = programs;

export type NFT = {
  mint: PublicKey;
  first_verified_creator: string;
};

export function useNFTCreators() { 
  const connection = useConnection();
  const publicKey = usePublicKey();
  const [nftCreators, setNFTCreators] = useState<Set<string> | null>(null);
  useEffect(() => {
    console.log("fetching nft creators");
    fetchCreators(connection, publicKey).then((creators) => {
        console.log("fetched validators");
        setNFTCreators(creators);
      })
  }, [publicKey]);

  return nftCreators; 
}

//consider storing all mints to avoid extra lookups
export let fetchCreators = async (
  connection: Connection,
  publicKey: PublicKey
): Promise<Set<string>> => {

  const cacheKey = "creatorsheld" + publicKey.toString()
  const val = await LocalStorage.get(cacheKey);
  if (val) {
    const resp = JSON.parse(val);
    if (
      Object.keys(resp.value).length > 0 &&
      Date.now() - resp.ts < 1000 * 60* 60 // 1 hour
    ) {
      return new Set(await resp.value);
    }
  }

  const tokensInWallet = await connection.getParsedTokenAccountsByOwner(
    publicKey,
    {
      programId: TOKEN_PROGRAM_ID,
    }
  );

  // initial filter - only tokens with 0 decimals & of which 1 is present in the wallet
  const tokensWhereThereIsOnlyOne = tokensInWallet.value
    .filter((t) => {
      const amount = t.account.data.parsed.info.tokenAmount;
      return amount.decimals === 0 && amount.uiAmount === 1;
    })
    .map((t) => {
      return { pubkey: t.pubkey, mint: t.account.data.parsed.info.mint, t: t };
    });

  const updateAuthorities = new Set<string>();

  const promises: Promise<any | undefined>[] = [];
  tokensWhereThereIsOnlyOne.forEach((t) =>
    promises.push(
      (async (
        mint: string,
        conn: Connection,
        pubkey?: PublicKey
      ): Promise<any> => {
        try {
          const metadataPDA = await Metadata.getPDA(mint);
          const onchainMetadata = (await Metadata.load(conn, metadataPDA)).data;
          if (onchainMetadata == null) {
            return;
          }
          return onchainMetadata.data.creators!.filter((creator) => creator.verified)[0]
            .address;
        } catch (e) {
          console.log(`failed to pull metadata for token ${mint}`);
        }
      })(t.mint, connection, t.pubkey)
    )
  );
  let creators = new Set(await Promise.all(promises).then((tokens) => {
    return tokens.filter((t) => t != undefined);
  }));
  LocalStorage.set(cacheKey,JSON.stringify({
    ts: Date.now(),
    value: creators,
  })
);
  return creators
};
