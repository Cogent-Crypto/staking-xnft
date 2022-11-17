import React, { useEffect } from "react";
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
import { LAMPORTS_PER_SOL, PublicKey, Transaction } from "@solana/web3.js";
import { PrimaryButton, ButtonStatus } from "../components/PrimaryButton";
import { publicKey } from "@project-serum/anchor/dist/cjs/utils";

export function InstantUnstakeScreen(stakeAccount: StakeAccount) {
  const validators = useValidators();
  const walletPublicKey = usePublicKey();
  const connection = useConnection();

  const PROG_ID = new PublicKey("unpXTU2Ndrc7WWNyEhQWe4udTzSibLPi25SXv2xbCHQ");

  // construct new Program with provider set to anchor's default getProvider()
  const UNSTAKE_PROGRAM: Program<Unstake> = new Program(
    UNSTAKE_IDL_JSON as Unstake,
    PROG_ID
  );

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
//   if (validators == null) {
//     return "Error Loading Validators";
//   }

  let unstakeFees = 0;
  let unstakeLamports = 0;

  useEffect(() => {
    const stakeAccountRent = 2282880;
    

    const fetchData = async () => {
      const fetchedProtoclFeeData =
        await UNSTAKE_PROGRAM.account.protocolFee.fetch(PROTOCOL_FEE_ADDRESS);
      const protocolFee = {
        publicKey: PROTOCOL_FEE_ADDRESS,
        account: fetchedProtoclFeeData,
      };

      let unStakeLamportsWithRent = await previewUnstake(UNSTAKE_PROGRAM, {
        poolAccount: UNSTAKE_POOL_ADDRESS,
        stakeAccount: stakeAccount.accountAddress,
        unstaker: walletPublicKey,
        protocolFee: protocolFee,
      });
      unstakeLamports = unStakeLamportsWithRent - stakeAccountRent;
      unstakeFees = stakeAccount.stakeLamports - unstakeLamports;
    };

    fetchData();
  }, []);

  const instantUnstake = async () => {
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
  };

  const validator = validators[stakeAccount.validatorAddress.toString()];
  let buttonText = "Instant Unstake"
  if(unstakeFees != 0) {
    buttonText += `${(unstakeFees/LAMPORTS_PER_SOL).toFixed(4)} ☉ Fee (${(unstakeFees/unstakeLamports*100).toFixed(2)}%) `
  }

  return (
    <View>
      <StakeAccountDetail stakeAccount={stakeAccount} validator={validator} />
      <PrimaryButton
        status={ButtonStatus.Ok}
        disabled={false}
        text={buttonText}
        onClick={instantUnstake}
      />
    </View>
  );
}
