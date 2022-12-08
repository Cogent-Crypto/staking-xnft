import { View, Text, Image, LocalStorage, Button, Loading } from "react-xnft";
import React from "react";
import { Connection, PublicKey } from "@solana/web3.js";

const connection = new Connection("https://patient-aged-voice.solana-mainnet.quiknode.pro/bbaca28510a593ccd2b18cb59460f7a43a1f6a36/");

type reward = { value: number, epoch: number }
type fetchedRewards = Array<reward>;

const getStakeReward = (cacheKey: string, stakeaccount, epoch) => {
    return LocalStorage.get(cacheKey).then((val) => {

        if (val !== undefined) {
            const resp = JSON.parse(val);

            return Promise.resolve({ value: resp.value, epoch: epoch });
        }

        return connection.getInflationReward([stakeaccount], epoch).then((result) => {
            LocalStorage.set(cacheKey, JSON.stringify({
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

    React.useEffect(() => {
        async function fetchRewards() {
            let res = await getLastFiveStakeRewardsFromEpoch(stakeAccountPK, null, 1);

            setRewardHistory((history) => [...res, ...history]);
        }

        fetchRewards()
    }, []);

    const loadMoreRewards = () => {
        return getLastFiveStakeRewardsFromEpoch(stakeAccountPK, rewardHistory[rewardHistory.length - 1].epoch - 1).then((res) => {
            setRewardHistory((history) => [...history, ...res]);
        })
    }

    return (
        <View tw="mt-6">
            <Text tw="font-medium">Recent Rewards</Text>
            {rewardHistory.length > 0 &&
                <ShowRewardHistory loadMoreRewards={loadMoreRewards} rewardHistory={rewardHistory} />
            }
        </View>)
}

const ShowRewardHistory = ({ rewardHistory, loadMoreRewards }: { rewardHistory: fetchedRewards, loadMoreRewards: () => Promise<any> }) => {
    const [isLoading, setIsLoading] = React.useState(false);

    const handleViewMore = () => {
        setIsLoading(true);

        loadMoreRewards().then(() => {
            setIsLoading(false);
        })
    }

    return (
        <View tw="flex flex-col justify-center mb-12">
            {rewardHistory.map((reward, index) => {
                return (
                    <View key={index} tw="flex mb-1 mx-auto">
                        <Text tw="font-bold">{reward.epoch}:</Text>
                        <Text tw="ml-2 font-bold text-teal-500">{reward.value / 1000000000}</Text>
                    </View>
                )
            })}
            <View tw="mx-auto">
                {/* If Loading show loading indicator */}
                {isLoading && <Loading />}
                {/* If not Loading and last fetched value isn't undefined show Button */}
                {!isLoading && rewardHistory[rewardHistory.length - 1]?.value && <View tw="text-sm cursor-pointer" onClick={() => handleViewMore()}>More</View>}
            </View>
        </View >
    )
}