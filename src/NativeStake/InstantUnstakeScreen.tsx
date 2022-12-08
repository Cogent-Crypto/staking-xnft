import React, { useEffect, useState } from "react";
import {
  Button,
  View,
  Text,
  usePublicKey,
  useConnection,
  useNavigation,
} from "react-xnft";
import {
  IDL_JSON as UNSTAKE_IDL_JSON,
  findProtocolFeeAccount,
  previewUnstake,
  unstakeTx,
  deactivateStakeAccountTx,
} from "@unstake-it/sol";
import type { Unstake } from "@unstake-it/sol";
import { Program, AnchorProvider, Wallet } from "@project-serum/anchor";
import type { StakeAccount } from "../hooks/useStakeAccounts";
import { StakeAccountDetail } from "../components/StakeAccountDetail";
import { useValidators } from "../hooks/useValidators";
import { LAMPORTS_PER_SOL, PublicKey, Transaction, Connection } from "@solana/web3.js";
import { PrimaryButton, ButtonStatus } from "../components/PrimaryButton";
import { publicKey } from "@project-serum/anchor/dist/cjs/utils";

export function InstantUnstakeScreen({stakeAccount}:{stakeAccount: StakeAccount}) {
  const validators = useValidators();
  const walletPublicKey = usePublicKey();
  const nav = useNavigation();
  const connection = new Connection("https://patient-aged-voice.solana-mainnet.quiknode.pro/bbaca28510a593ccd2b18cb59460f7a43a1f6a36/");
  //unstakeFee
  const [unstakeFee, setUnstakeFee] = useState<number>(0);
  //unstakeLamports
  const [unstakeLamports, setUnstakeLamports] = useState<number>(0);

  const PROG_ID = new PublicKey("unpXTU2Ndrc7WWNyEhQWe4udTzSibLPi25SXv2xbCHQ");
  console.log("here")
  // construct new Program with provider set to anchor's default getProvider()
  const UNSTAKE_PROGRAM: Program<Unstake> = new Program(
    UNSTAKE_IDL_JSON as Unstake,
    PROG_ID,
    /* @ts-ignore */
    new AnchorProvider(connection, {publicKey:walletPublicKey, signTransaction:()=>{return true}}, {})
  );

  
  console.log("here 2")
  const PROTOCOL_FEE_ADDRESS = new PublicKey(
    "2hN9UhvRFVfPYKL6rZJ5YiLEPCLTpN755pgwDJHWgFbU"
  );
  const FETCHED_PROTOCOL_FEE_DATA = new PublicKey(
    "GnRGTBrFuEwb85Zs4zeZWUzQYfTwmPxCPYmQQodDzYUK"
  );

  const UNSTAKE_POOL_ADDRESS = new PublicKey(
    "FypPtwbY3FUfzJUtXHSyVRokVKG2jKtH29FmK4ebxRSd"
  );
  const POOL_RESERVES_ADDRESS = new PublicKey(
    "3rBnnH9TTgd3xwu48rnzGsaQkSr1hR64nY71DrDt6VrQ"
  );

  let availableLiquidityLamports: number = 0;
  let unStakeLamportsWithRent: number;
  

  console.log("here 6")

  useEffect(() => {
    const stakeAccountRent = 2282880;
    console.log("here 7")

    const fetchData = async () => {
      console.log("here5")
      const fetchedProtoclFeeData =
        await UNSTAKE_PROGRAM.account.protocolFee.fetch(PROTOCOL_FEE_ADDRESS);
      const protocolFee = {
        publicKey: PROTOCOL_FEE_ADDRESS,
        account: fetchedProtoclFeeData,
      };
      console.log("here3")
      let unStakeLamportsWithRent = await previewUnstake(UNSTAKE_PROGRAM, {
        poolAccount: UNSTAKE_POOL_ADDRESS,
        stakeAccount: stakeAccount.accountAddress,
        unstaker: walletPublicKey,
        protocolFee: protocolFee,
      });
      let unstakeLamports_temp = unStakeLamportsWithRent - stakeAccountRent;
      setUnstakeLamports(unstakeLamports_temp);
      setUnstakeFee(stakeAccount.stakeLamports - unstakeLamports_temp);
    };

    fetchData();
    return () => {setUnstakeLamports(0), setUnstakeFee(0)};
  }, []);

  const instantUnstake = async () => {
    console.log("instant unstake")
        const fetchedProtoclFeeData = await UNSTAKE_PROGRAM.account.protocolFee.fetch(PROTOCOL_FEE_ADDRESS);
        const protocolFee = {
            publicKey: PROTOCOL_FEE_ADDRESS,
            account: fetchedProtoclFeeData,
        };

        const recentBlockhash = await connection.getLatestBlockhash();
        const transaction = new Transaction({
            feePayer: walletPublicKey,
            blockhash: recentBlockhash.blockhash,
            lastValidBlockHeight: recentBlockhash.lastValidBlockHeight
        });
        const tx = await unstakeTx(UNSTAKE_PROGRAM, {
            stakeAccount: stakeAccount.accountAddress,
            poolAccount: UNSTAKE_POOL_ADDRESS,
            unstaker: walletPublicKey,
            protocolFee: protocolFee,
            referrer: "GxHamnPVxsBaWdbUSjR4C5izhMv2snriGyYtjCkAVzze",
        });
        transaction.add(tx);

        // crank stake acccount deactivation
        if (stakeAccount.status === "active" || stakeAccount.status === "activating") {
            transaction.add(
                await deactivateStakeAccountTx(UNSTAKE_PROGRAM, {
                    stakeAccount: stakeAccount.accountAddress,
                    poolAccount: UNSTAKE_POOL_ADDRESS,
                })
            );
        }

        try {
          await window.xnft.solana.sendAndConfirm(transaction,);
      } catch (error) {
          console.log("error",error);
          return
      }   
      nav.pop()
      nav.pop()
      nav.push("overview",{expectingStakeAccountsToUpdate: true})
  };

  if (validators == null) {
    return <View>"Error Loading Validators"</View>;
  }
  console.log("stakeaccount",stakeAccount)
  const validator = validators[stakeAccount.validatorAddress.toString()];
  let buttonText = "Instant Unstake"
  if(unstakeFee != 0) {
    buttonText += ` (Recieve ${(unstakeLamports/LAMPORTS_PER_SOL).toFixed(4)} SOL) `
  }

  

  return (
    <View>
      <StakeAccountDetail stakeAccount={stakeAccount} validator={validator} />
      <Text tw="px-4">Instant Unstake Fee: {(unstakeFee/LAMPORTS_PER_SOL).toFixed(4)} SOL ({(unstakeFee/unstakeLamports*100).toFixed(2)}%)</Text>
      <PrimaryButton
        status={ButtonStatus.Ok}
        disabled={false}
        text={buttonText}
        onClick={instantUnstake}
      />
    </View>
  );
}
