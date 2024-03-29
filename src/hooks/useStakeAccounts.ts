import { AccountInfo, LAMPORTS_PER_SOL, ParsedAccountData, PublicKey } from "@solana/web3.js";
import { StakeProgram, Connection, } from "@solana/web3.js";
import { useState, useEffect } from "react";
import ReactXnft, { usePublicKey, useConnection, LocalStorage } from "react-xnft";
import { useValidators } from "./useValidators";
import { useCustomConnection } from "../hooks/useCustomConnection";

export type StakeAccount = {
    accountAddress: PublicKey;
    accountLamports: number;
    stakeLamports: number; //lamports
    stakeSol: number;
    excessLamports: number;
    activationEpoch: number;
    deactivationEpoch: number;
    status: string;
    validatorAddress: PublicKey; //vote account address
}

export const stakeAccountRentExempt = 2282880;

export type fetchedStakeAccounts = {
    stakeAccounts: StakeAccount[];
    cached: boolean;
}

export const stakeAccountCacheKey = "stakeaccountss" // + publicKey.toString();

export function useStakeAccounts() {

    const publicKey = usePublicKey();
    // const connection = useConnection(); 
    const connection = useCustomConnection();
    const validators = useValidators();

    const [stakeAccounts, setStakeAccounts] = useState<fetchedStakeAccounts | null>(null);

    useEffect(() => {
        if (publicKey && validators) {

            console.log("fetching stake accounts for public key", publicKey.toString());
            const cacheKey = stakeAccountCacheKey + publicKey.toString();
            LocalStorage.get(cacheKey).then((val) => {
                let accounts;
                if (val) {
                    const resp = JSON.parse(val);
                    if (
                        Object.keys(resp.value).length > 0 &&
                        Date.now() - resp.ts < 1000 * 60 * 5 * 60 // 5 hours
                    ) {
                        accounts = resp.value;

                        for (const account of accounts) {
                            account.accountAddress = new PublicKey(account.accountAddress);
                            account.validatorAddress = new PublicKey(account.validatorAddress);
                            account.accountLamports = parseInt(account.accountLamports);
                            account.stakeLamports = parseInt(account.stakeLamports);
                            account.activationEpoch = parseInt(account.activationEpoch);
                            account.deactivationEpoch = parseInt(account.deactivationEpoch);
                            account.excessLamports = parseInt(account.excessLamports);
                        }
                        setStakeAccounts({
                            stakeAccounts: accounts,
                            cached: true
                        })
                    }
                }

                fetchStakeAndPopulateAccountsWithValidatorInfo(validators, publicKey, connection).then((newStakeAccounts) => {

                    if (JSON.stringify(accounts) != JSON.stringify(newStakeAccounts)) {
                        for (const account of newStakeAccounts) {
                            account.accountAddress = new PublicKey(account.accountAddress);
                            account.validatorAddress = new PublicKey(account.validatorAddress);
                        }
                        console.log("new stake accounts", JSON.stringify(newStakeAccounts));
                        console.log("old stake accounts", JSON.stringify(accounts));
                        setStakeAccounts(null)
                        setStakeAccounts({
                            stakeAccounts: newStakeAccounts,
                            cached: false
                        });
                    }


                })

            })


        }


    }, [validators, publicKey]);

    return stakeAccounts;
}

async function fetchStakeAndPopulateAccountsWithValidatorInfo(validators, publicKey: PublicKey, connection: Connection) {
    const accounts = await connection.getParsedProgramAccounts(StakeProgram.programId, {
        commitment: "processed",
        filters: [
            {
                memcmp: {
                    offset: 44,
                    bytes: publicKey.toString()
                }
            },
            {
                dataSize: 200
            }
        ]
    });

    console.log("accounts", accounts);

    if (accounts.length === 0) {
        console.log("No stake accounts found for ad dress:", publicKey.toString);
        return [];
    }

    const epoch_info = await connection.getEpochInfo();
    const current_epoch = epoch_info.epoch;
    console.log("adding validator info to accounts");
    let accountsWithInfo = accounts.filter((account)=>{return account.account.data.parsed.info.stake != null }).map((account) => {
        let stakeAccount = {} as StakeAccount;
        
        if (!account.account.data.parsed.info.stake) {
            //TODO: handle this case. For now we are filtering out accounts that don't have a stake field
        }
        let activationEpoch = account.account.data.parsed.info.stake.delegation.activationEpoch;
        let deactivationEpoch = account.account.data.parsed.info.stake.delegation.deactivationEpoch;

        stakeAccount.accountAddress = account.pubkey;
        stakeAccount.accountLamports = account.account.lamports;
        stakeAccount.stakeLamports = account.account.data.parsed.info.stake.delegation.stake
        stakeAccount.stakeSol = stakeAccount.stakeLamports / LAMPORTS_PER_SOL
        stakeAccount.activationEpoch = activationEpoch;
        stakeAccount.deactivationEpoch = deactivationEpoch;
        stakeAccount.excessLamports = stakeAccount.accountLamports-stakeAccount.stakeLamports-stakeAccountRentExempt


        if (deactivationEpoch < current_epoch) {
            stakeAccount.status = "inactive";
        }
        if (deactivationEpoch == current_epoch) {
            stakeAccount.status = "deactivating";
        }
        if (activationEpoch == current_epoch) {
            stakeAccount.status = "activating";
        }
        if (activationEpoch < current_epoch && deactivationEpoch > current_epoch) {
            stakeAccount.status = "active";
        }

        let validatorAddress = account.account.data.parsed.info.stake.delegation.voter;
        stakeAccount.validatorAddress = validatorAddress;

        return stakeAccount as StakeAccount;
    });

    console.log("Got all stake accounts for address, loading validator data for each stake account");
    //Sort stake accounts by apy, then lamports, then address alphabetically

    accountsWithInfo.sort((a, b) => {
        const aValidatorAPY = validators[a.validatorAddress.toString()].apy_estimate;
        const bValidatorAPY = validators[b.validatorAddress.toString()].apy_estimate;
        if (aValidatorAPY == bValidatorAPY) {
            if (b.stakeLamports == a.stakeLamports) {
                return b.accountAddress < a.accountAddress ? 1 : -1;
            }
            return b.stakeLamports - a.stakeLamports;
        }
        return bValidatorAPY - aValidatorAPY;
    });

    const cacheKey = stakeAccountCacheKey + publicKey.toString();
    LocalStorage.set(cacheKey, JSON.stringify({
        ts: Date.now(),
        value: accountsWithInfo,
    })
    );
    return accountsWithInfo;

}

