import { View, Text } from "react-native";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import React from "react";
import { PublicKey } from "@solana/web3.js";
import { useCustomTheme } from "../hooks/useCustomTheme";
import { useCustomConnection } from "../hooks/useCustomConnection";

import AsyncStorage from '@react-native-async-storage/async-storage';
import tw from 'twrnc';

const connection = useCustomConnection()
type reward = { value: number, epoch: number }
type fetchedRewards = Array<reward>;

const getStakeReward = (cacheKey: string, stakeaccount, epoch) => {
    return AsyncStorage.getItem(cacheKey).then((val) => {

        if (val !== undefined) {
            const resp = JSON.parse(val);

            return Promise.resolve({ value: resp.value, epoch: epoch });
        }

        return connection.getInflationReward([stakeaccount], epoch).then((result) => {
            AsyncStorage.setItem(cacheKey, JSON.stringify({
                ts: Date.now(),
                value: result[0]?.amount,
            }));

            return Promise.resolve({ value: result[0]?.amount, epoch: epoch });
        })
    });
}



const getLastFiveStakeRewardsFromEpoch = (stakeAccountPK, epoch: null | number = null, limit: number = 5) => {
    return connection.getEpochInfo().then((epochInfo) => {
        const lastCompletedEpoch = epoch ?? epochInfo.epoch - 1;

        const stakeaccount = new PublicKey(stakeAccountPK);

        let rewardPromises: Promise<any>[] = [];
        for (let i = 0; i < limit; i++) {
            let requestEpoch = lastCompletedEpoch - i;
            const cacheKey = "stake-reward-" + stakeAccountPK + "-" + requestEpoch;

            rewardPromises.push(getStakeReward(cacheKey, stakeaccount, requestEpoch))
        }


        return Promise.all(rewardPromises)
    });
}

export function StakeRewardHistory({ stakeAccountPK }: { stakeAccountPK: any }) {
    const [rewardHistory, setRewardHistory] = React.useState<fetchedRewards | []>([])
    const [allRewardsLoaded, setAllRewardsLoaded] = React.useState(false);

    React.useEffect(() => {
        async function fetchRewards() {
            let res = await getLastFiveStakeRewardsFromEpoch(stakeAccountPK, null, 1);
            if (res.map((r) => r.value).some((v) => v === undefined)) {
                setAllRewardsLoaded(true);
            }
            setRewardHistory((history) => [...res, ...history]);
        }

        fetchRewards()
    }, []);

    const loadMoreRewards = () => {
        return getLastFiveStakeRewardsFromEpoch(stakeAccountPK, rewardHistory[rewardHistory.length - 1].epoch - 1).then((res) => {
            setRewardHistory((history) => [...history, ...res]);
        })
    }
    if (rewardHistory.length === 0) {
        return <View></View>;
    }
    if (isNaN(rewardHistory[0].value)) {
        return <View></View>;
    }

    return (
        <View>
            <View style={tw`mt-6`}>
                <Text style={tw`font-medium text-base`}>Recent Rewards</Text>
                {rewardHistory.length > 0 &&
                    <ShowRewardHistory loadMoreRewards={loadMoreRewards} rewardHistory={rewardHistory} allRewardsLoaded={allRewardsLoaded} />
                }
            </View>
        </View>)
}

const ShowRewardHistory = ({ rewardHistory, loadMoreRewards, allRewardsLoaded }: { rewardHistory: fetchedRewards, loadMoreRewards: () => Promise<any>, allRewardsLoaded: Boolean }) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const THEME = useCustomTheme();

    const handleViewMore = () => {
        setIsLoading(true);

        loadMoreRewards().then(() => {
            setIsLoading(false);
        })
    }

    return (
        <View style={tw`flex flex-col justify-center mb-4`}>
            {rewardHistory.map((reward, index) => {
                return (reward.value !== undefined &&
                    <View key={index} style={tw`flex mb-1 mx-auto`}>
                        <Text style={tw`font-bold text-base`}>{reward.epoch}:</Text>
                        <Text style={tw`ml-2 font-bold text-teal-500 text-base`}>{reward.value / LAMPORTS_PER_SOL}</Text>
                    </View>
                )
            })}
            <View style={tw`mx-auto`}>
                {/* If Loading show loading indicator */}
                {isLoading && "Loading..."}
                {/* If not Loading and last fetched value isn't undefined show Button */}
                {!allRewardsLoaded && !isLoading && rewardHistory[rewardHistory.length - 1]?.value && <View style={tw`text-sm cursor-pointer text-[${THEME?.colors?.secondary}]`} onPress={() => handleViewMore()}>More</View>}
            </View>
        </View >
    )
}