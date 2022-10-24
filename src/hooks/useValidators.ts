import {useState, useEffect} from 'react';
import ReactXnft, {LocalStorage} from "react-xnft";

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
}

export function useValidators() { 

    const [validators, setValidators] = useState(null);

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
    const cacheKey = "validators" 
    console.log("fetching validators 2");
    const val = await LocalStorage.get(cacheKey);

    console.log("fetching validators 3");
    if (val) {
        const resp = JSON.parse(val);
        if (
          Object.keys(resp.value).length > 0 &&
          Date.now() - resp.ts < 1000 * 60* 60 * 24 // 24 hours
        ) {
          return await resp.value;
        }
      }

    const validator_list = await fetch("https://api.stakewiz.com/validators").then((res) => res.json())
    
    const convertArrayToObject = (array, key) => {
        const initialValue = {};
        return array.reduce((obj, item) => {
            return {
            ...obj,
            [item[key]]: item
            };
        }, initialValue);
    };

    let validators = convertArrayToObject(validator_list, "vote_identity");

    LocalStorage.set(cacheKey,JSON.stringify({
        ts: Date.now(),
        value: validators,
      })
    );
    return validators;
}

