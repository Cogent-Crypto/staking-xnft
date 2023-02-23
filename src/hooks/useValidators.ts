import { useState, useEffect } from 'react';
import ReactXnft, { LocalStorage } from "react-xnft";

ReactXnft.events.on("connect", () => {
  fetchValidators();
});

export type Validator = {
  identity: string;
  vote_identity: string;
  last_vote: number;
  root_slot: number;
  credits: number;
  epoch_credits: number;
  activated_stake: number;
  version: string;
  delinquent: boolean;
  skip_rate: number;
  updated_at: string;
  first_epoch_with_stake: number;
  name: string;
  keybase: string;
  description: string;
  website: string;
  commission: number;
  image: string;
  ip_latitude: string;
  ip_longitude: string;
  ip_city: string;
  ip_country: string;
  ip_asn: string;
  ip_org: string;
  mod: boolean;
  vote_success: number;
  vote_success_score: number;
  wiz_skip_rate: number;
  skip_rate_score: number;
  info_score: number;
  commission_score: number;
  first_epoch_distance: number;
  epoch_distance_score: number;
  stake_weight: number;
  above_halt_line: boolean;
  stake_weight_score: number;
  withdraw_authority_score: number;
  asn: string;
  asn_concentration: number;
  asn_concentration_score: number;
  uptime: number;
  uptime_score: number;
  wiz_score: number;
  version_valid: boolean;
  city_concentration: number;
  city_concentration_score: number;
  invalid_version_score: number;
  superminority_penalty: number;
  score_version: number;
  no_voting_override: boolean;
  epoch: number;
  epoch_slot_height: number;
  asncity_concentration: number;
  asncity_concentration_score: number;
  skip_rate_ignored: boolean;
  stake_ratio: number;
  credit_ratio: number;
  apy_estimate: number;
  rank: number;
  commission_rugger: boolean;
  mev_commission: number;
}

export function useValidators() {
  const [validators, setValidators] = useState<{ [key: string]: Validator } | null>(null);

  useEffect(() => {
    console.log("fetching validators 1");
    fetchValidators().then((validators) => {
      console.log("fetched validators");
      setValidators(validators);
    })
  }, []);

  return validators;
}



async function fetchValidators() {
  const cacheKey = "validatorsWithMEVinfo2"
  console.log("fetching validators 2");
  const val = await LocalStorage.get(cacheKey);

  console.log("fetching validators 3");
  if (val) {
    console.log("fetching validators 4");
    const resp = JSON.parse(val);
    if (
      Object.keys(resp.value).length > 0 &&
      Date.now() - resp.ts < 1000 * 60 * 60 * 24 // 24 hours
    ) {
      return await resp.value;
    }
  }
  console.log("val",val)
  console.log("fetching jito validators ");
  
  const jito_validators = await fetchJitoValidators()
  console.log("fetched jito validators");
  console.log("fetching validator info from stakewiz")
  const validator_list = await fetch("https://api.stakewiz.com/validators").then((res) => res.json())
  console.log("fetched validator info from stakewiz")
  console.log("formmating validator list")
  const convertArrayToObject = (array, key) => {
    const initialValue = {};
    return array.reduce((obj, item) => {
      return {
        ...obj,
        [item[key]]: item
      };
    }, initialValue);
  };
  console.log("formmatted validator list")
  console.log("modifying validator list")
  let validators = validator_list.map((validator) => { return { ...validator, commission_rugger: rugging_validators.has(validator.vote_identity), mev_commission: jito_validators[validator.vote_identity] ? jito_validators[validator.vote_identity].mev_commission_bps/100:null  } })
  validators = convertArrayToObject(validators, "vote_identity");
  console.log("modified validator list")
  console.log("making validator string")
  let stored_value = JSON.stringify({
    ts: Date.now(),
    value: validators,
  })
  console.log("made validator string 2")
  console.log("saving validator list to local storage")
  await LocalStorage.set(cacheKey,stored_value)
  console.log("saved validator list to local storage")
  return validators;
}

type JitoValidatorRes = {
  "validators":
    {
      "vote_account": string,
      "mev_commission_bps": number
      "running_jito": boolean
    }[]
  }

async function fetchJitoValidators() {

  const res_json = await fetch("https://kobe.mainnet.jito.network/api/v1/validators").then((res) => res.json()) as JitoValidatorRes
  const jito_validators = res_json.validators.reduce((acc, cur) => {
    acc[cur.vote_account] = cur
    return acc
  })
  return jito_validators
}

const rugging_validators = new Set([
  "rep1xGEJzUiQCQgnYjNn76mFRpiPaZaKRwc13wm8mNr",
  "AxP8nEVvay26BvFqSVWFC73ciQ4wVtmhNjAkUz5szjCg",
  "DeFiDeAgFR29GgKdyyVZdvsELbDR8k4WqprWGtgtbi1o",
  "8Pep3GmYiijRALqrMKpez92cxvF4YPTzoZg83uXh14pW",
  "GBU4potq4TjsmXCUSJXbXwnkYZP8725ZEaeDrLrdQhbA",
  "5wNag8umJhaaj9gGdqmBz7Xwwy1NL5yQ1QbvPdQrDd3h",
  "7oX5QSP9yBjT1F1sRSDCX91ZxibETqemDM4WLDju5rTM",
  "Cva4NEnBRYfFv8i3RtcMTbEYgyVNmewk2aAgh4fco2mP",
  "2vxNDV7aAbrb4Whnxs9LiuxCsm9oubX3c1hozXPsoD97",
  "42GfJFeWySe1zt7xYxXNFK1E2V7xXnf1Jpc6B4g63QTm",
  "DpvUS8Losp2UGGaSGyupyKwQqHkmruzfwrZg2VYK7Zg7",
  "GUTjLTQTCmeBzTrBgCsWSM7G2JrsLvwXbXdafWvicqbr",
  "G2v6wsh4xVHj1xMLtLFzX2hP6T1TTxti5ZxK3iv8TJQZ",
  "4hDeRsRJBsvbA1KNjGmZ9zB1Nv3Cn2KbANNUCQwjBh29",
  "65U5oJPjCpQPuLSUPJZVFWSQgRmVtgcZwo6fJREFiYoz",
  "GUTjLTQTCmeBzTrBgCsWSM7G2JrsLvwXbXdafWvicqbr",
  "3Ueg3qrAVv95tJzTiKM2dd33NswZT77yRf9wXcBDCn2c",
  "ND5jXgjtiPC34Qf71oEiDrcim4hPhyPdhBrqeZidUxF",
  "7zx69bryF4TnqRGTzE7CJkSXUZ495nFFZk4RCkXQEcgH",
  "A5G8TTnkxPqTDkpeM9LPjwvE4mQ8E7vTzdBNvLqs1pTg",
  "DdiWSFE9u9Gu1GqGVaPWqAAk6TuYA7t35tb54fCu37uS",
  "DWCLHn3hzmru2K8Lg2MFhsBABPmEGDkd664V9z77NjCt",
  "61rPRUxuPb4xy6X6AmKcSf4CiNaerttpaFC3GLvUu2Ba",
  "auzyWJi8E1NVBEUYZezBc8bS1GZYTVnhpdc53zH7PPH",
  "tnaKD5evRkBonwyW5n5yKoJrt7H871Aboh1AWXH9AFj",
  "AJGaXvnzDEGxjcDX9nYSWQj8urAdtTmgCuwD1TtF97yz",
  "4Ucwi2DKML7jBzDDTpiZ46vq7jQAHb93ZAFkYnT9TTyq",
  "CfLRV8ZS41ksYMUzcQ8joz3ruPBLTv8LmRHtNCj15ovf",
  "9DLtFk37Nxr9CbJAvxKnjEpCzCdyjtNcD6juCYdYktTM",
  "JAvknH4Pn9b8jqGg5rpkGAFrnXRFcrmL5kumTXyacy5u",
  "5Mergmrmd1XFeDRMHbzS4XLiorfG3Qsddwff9RkX4Lup",
  "AkVoTV14wHZVB7sNiLxGCiE4tS1mXG2CkZSuqLzxHS2V",
  "DEmZmtt9bDeDcBMExjKhpCFnA5yj46XbAkzu61CXPKFh",
  "5maAYsh7z7iikpZs7x89wx1QsxXe8rpF7B5cvrDvWCej",
  "BK8YruGZQMFmbKn8CcLL5i3UqVwmACnc77YhgPYqGkNh",
  "Dhs6P4kjtszfhaLeZGbVZrFgPcimgQ91SGZXkAxcx1tp",
  "9zdVCLZqSRR26Emy5su23P2yHwX5DF9doS462yjcNnHm",
  "JBvqybAVc98GrvhjF7EXVdrgaZAEyy3Gi6D7uT3qsFwr",
  "Ap3wiVMh2BJDvvvUPQMWMBCZCPeyxVhf8xjCWASoFWUa",
  "BF2gZDHXdtxxzNU18qcme89zexND41yohyaLg5xytdg1",
  "DM7agS8XHMXqxsT7BXxAPKzJ54JSEDTK59HtrQfEKJGa",
  "2R2H7wHcCKwEq85HuScU3xvR9Rf1WJuAhGtpuUzUGhGJ",
  "3vFELvmvHdkobLmgMCiXKqTFWwrbEWyxVX1uyMXFm6n8",
  "DVD9Q9yZ8n9iWaqCCP7y6tf461aZTCshsaj5zm9aE7WV",
  "B5a4ywXhokofcZDsdVT7RH64HiqW7WxvG9hMxQYgHzZL",
  "GuPYoGPCQDp1bJ3A6ALzcHik6ziu6CX95ADHeQvbzMfQ",
  "AiseS95iZjWhP8qowrg3efLxcDq5JWuGVVkyr5nG5osj",
  "B5a4ywXhokofcZDsdVT7RH64HiqW7WxvG9hMxQYgHzZL",
  "AG781KzvU89JSu9W69adSLkaVW11g9L3HNxYyuePrfrk",
  "4tdrCXpoqAdSR7Zqbow6ikL1BGLHV2SK9XpwYsXvWGCW",
  "8VNKjGimak6Y53b2vHfcg2fFZMN7gWM1DLm9bhDXw8QS",
  "3vFELvmvHdkobLmgMCiXKqTFWwrbEWyxVX1uyMXFm6n8",
  "8T8Lj1WEqEDuJAP1RJ6Wmm5aLJJyCPPnxjwwSZMngNaz",
  "G1pTmMKhNFEP1QpG7qnzQ8znZe7VZba4mntCd5z9i1Qo",
  "G3S7AjkVSEX47HzEYfKasjMX1dRueJusKsgg8ceTmtfT",
  "ATAQXMLxTz8rqTKVvuPiyzkPsbFxtwfdhYwGUnzurwGA",
  "AqU2ZDF88mkdc7SRE9a7pQGZricwdsqy61sf4xjJ5Bpy",
  "UZFxLfrRxbB4VnMj1HWMSLfMcA3fNP3AfxnaBGmJpH5",
  "8UE5sUmwGtwYBX4wL9GKPBV755V9kiTq7wnjy5WtWckd",
  "BfUy6zGqC7vW2SqTrxismVXRgTH5FiMKKPaMxcYDshMq",
  "FRnrA49NcN1nBfaR9BhcYoZwZiDh5Cup4d1gqhy99o44",
  "6c2FJC1NfzNvivapAzPW8vj9TW63dpHCVh7zzehwnNLH",
  "2KRUKzCXCuHbyL5QGERMpwsH9tgAdwGpeDXkRMm5gpZm",
  "J75kdoVKTTN8JNv2raUDKhFXGUokFxrZ4yfb3z5iUred",
  "6ksBdjCJbuX58KLD6H1wJ9NpmLi6qVezWFhVeXLPZCfo",
  "4fBWWrBQhaQdFiLwPr8RfG4mYsjTRGRX58CRKNtFHgLD",
  "CHZwfXZXMUXaES6LevEs1g9RCykMnRYmn8qHM43Vh5Cx",
  "Bzgg5GLA2H5ksyNLf2YQjzWEyvcExHo21nNYPkaHiLZW",
  "JBjqqaDq5N16VW5J8UGMpYvkxCYNRFixBgdAefeJj6iv",
  "2tCoK3hcQhRvrtTJCtL84Pu2J5V7wtVQt5MH1uMzp4XX",
  "7X39mPcpoDkb5pQ9XFkWN1Y2BAQxygDHgaz4K5KNRRuy",
  "9CCjy6LzcpkfCzVgnXzfoofKt7J6wZrATPR7ywovhWoc",
  "D71SXconcGZfftDKVJ5ksWD512QALK3hsBvyzvhEMxsb",
  "8BqUmPfVZrYrNL82UMn8Qyrg3bmryukk7kKPoCwkMPx3",
  "5eb7FxPo4gdtFTUMNQLeFqWLhRKMjdiu7dyXt7Anp5J4",
  "GATwWi9S9Y9RV7GjUubyxAe4bFjrbmVbUvsg5jnfjWEB",
  "8CB5nGGW1kRZaHAHmsq1c1kxvvFSPK6chgSn5CU2h7C9",
  "Dn2cRSWAfQpb3NyUJ2q33t1scBLxzo8TZBAyKsWhX7zh",
  "GQ6qBT1uvf5pXnvFc5C5jm9DeeFCSxgyXfUKigvkJCTp",
  "Dtwjm5bmZcpXY1YeTQ6cUhuyUXSasSjLUdcYMkY3o8ef",
  "5KQQUBxyCNJtCWAN5dxFWmBmYfZsKn27XhcKBqvwsVpG",
  "GaFBPJtPNqFaSuhc4rQNp4VwjjgYfRfHhaxYWze2Quaw",
  "6VcHke5SeCLSwwbYpHe5u9Hnx7S9RrLgqqj4uVj8dgzT",
  "HXj2GeMSxFh7qywqsE3m7CGtxhyZGHjufyM1ZKoAiYjF",
  "97MMdGkcDBPCgTbrqGyS4UCbZBPHHwGA2dxEVgQnCixj",
  "5j9mHgcsRTqsmqeaSNCfhzcEAzpz8YejQoHtpuxoF9hb",
  "8hpaVczvUK24kogYWxV6s3hajDAbaHb6KGZsVRLDoksi",
  "2wnbjxUJaosewQV2Ti49PDVzFLB5k8FznyGwc37h2JBn",
  "TomHwzaaYkX3wgXFVU7aaJHs9uxkL9M3Gcp3zZuMWJJ",
  "HB9mUjrtPof9YoNhxPKe62mzvSVZeM2PPnp5Ns4uLAnh",
  "9278wVShBFgF5JyDbivorgcCuvdP5J4gfMDBp6vpgb2X",
  "5tKVdfSjikqPUrYxYYTVqciTetXcCzy5y61jRjohuk4u",
  "CP99unpGKUeY4TwaMJYkArFwPsDWLTSMKo3pEWxjiWmZ",
  "6JjyRSGWNQKnrXV6CVnrH8obL6rTUZV7BjFD54WbF4V1",
  "TxDx1cjjxb15qEUSZWDpHyRnPb1vkYB8djt1scaFfhm",
  "6KmmUrKqxrogcXb1yefm975ovuhyoPfyJjVnQ7KsrqYu",
  "AdWoQBvHGj2u2Mb5bi7SppVrcVU4wRu12auVtdNjZpzt",
  "CLheCY8APDtyeT9ipzY23dkLxB3efaLEvS93w6RTfw6L",
  "4WYnyFxFczX52uGKt8ZDpjS6HsX13oLyQfbGCuKRa3A6",
  "6ABYDxLq9w8kFJYmoR1FfsUhxjRLPgHRTXoL2dk1QRBQ",
  "6jRRQHGTBa88VnmgrkXHTTyEcuak28J5AV2FAP4WFU86",
  "DZVbCCRTbSdyhRBa96rKh3CmX31TFi38CtVZpmoPLzBR",
  "HRDjVXVUfqgmPQn45cxaiECU6ZVx9SNxTC9NGPVkMCoj",
  "CtPVrVHadXPy6EJcs4sPSS6EWm8bF7uM9DSuCxf6PP8g",
  "HLgNQEwEC1jQ2HgmBRvmfap5MhnfadcxfXY9tmmhJ2mB",
  "HdLojNZAUDFYBQz6to3TwhiFRspAbLZyy7QTYCPbs5Mp",
  "6dpXz896kcPcx8vYpXPCqTjLcHEnEX3VbvFemkz7sck4",
  "2tiNTQ8a7QLTCivwMu1At5GoqoJRPvMpwmrLKdSdmNg6",
  "4FaZw6e4VTrnAb1Ua6VefVYSn8YFiC6jZ8kT9Ld6GBxW",
  "DEaLiXYzAMDYEwA9nUEXKndrNs4dkW9VSa5GmKhhfNot",
  "DL18yy8NUSQWTwUhk6MTg4v9njxg1oRnvQuLfEq2RmQq",
  "wHJqM9cri8Hss9tkPsZe4tMD9Zrbp3GH39VYUvfpmSp",
  "9hNNHBwm6BC5DSmQBp3hKKNL8paDMt6kW5q7J7oC2VJZ",
  "2Ka1ox6B4yse6QQMXotB9gRTF3ZmPynn1DuNfGLXZyey",
  "AruoPzGrtfAaqUFPUDVmzUHDBjxFJLD8nodzArr346yR",
  "Foo9xhhkDqP24egwYNaWcTh2ZdAAV79UJSuemrsMisLt",
  "5sJPiR5pbxkYwCKCeoWHU65nxYX3acAueXUGv4BLyboz",
  "HMadUcegZc1hsfuki1mnGmq6bjJcRBK9V3dnuBzxfmb4",
  "9UToETxJBEszyJxDtmXiPLdpYNUizUyZyJrPjBqHfm2c",
  "FF4mDqzcP7YQgaBnoqkYsP8KFDfMsQV3mtESkch1U8bw",
  "6cGL7sSyrmMnrpmckb7y5MJz3sDuNsxMvyyBfbMnQnex",
  "JEChFiyPuyRPqJZdhFqVgrzSmtE5buA5NvGesPQLXKQf",
  "6v3hEkQ89u9cchjFYp2ZLeHFspQcWmJVLmp2aStB5nEt",
  "AFPhtNfns7wHz1gJcVGt4SqbKsPt14YShywa75QGTJ97",
  "EmXn9UUNxkXZyKZJHFoVmBK9ETFrfTtFmmEY4U4RfbAH",
  "9Gy7YX8S3C2df5ghdQQuspRYw5rJMns1ZhSxeYNkmdwP",
  "CZw1sSfjZbCccsk2kTjbFeVSgfzEgV1JxHEsEW69Qce9",
  "C2Ky72Dr2V8Jz7Vbp5YJw6kTiH5cn7n8sYWJo8bbjPtR",
  "3JDvbUoSpaSv8FwPCRJm5DB8Mt3qckxFHNoGdLd7Zd1k",
  "9MqENXVpBBPTs4XbVK7TfqCCmBfJCxV1GYnPKmDSXjpo",
  "4GL3rCXPpvu9TePSEzVetJwAMhztHENWJ1bWtX5s6isc",
  "EH6FCQGTGrwnUcgApM7gyzBggAEGCYQZa61ku6jhGkhi",
  "8RWnrqVrZXXckoqfXz41uvzmbtREeLFaAquRwq3yQAd1",
])