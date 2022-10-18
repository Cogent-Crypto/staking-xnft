
import { View, Text, Image, useNavigation } from "react-xnft";
import type { StakeAccount } from "../hooks/useStakeAccounts";
import React from "react";
import { useValidators } from "../hooks/useValidators";
import { useCustomTheme } from "../hooks/useCustomTheme";
import type { Validator } from "../hooks/useValidators";
import { useSolBalance } from '../hooks/useSolBalance';

export function SelectValidatorScreen() {
    const validators = useValidators()
    
    if (!validators) {
        return <Text>Loading...</Text>
    } 
    
    const helpfulInTheCommunity = ["CogentC52e7kktFfWHwsqSmr8LiS1yAtfqhHcftCPcBJ","GE6atKoWiQ2pt3zL7N13pjNHjdLVys8LinG8qeJLcAiL","BLADE1qNA1uNjRgER6DtUFf7FU3c1TWLLdpPeEcKatZ2","EARNynHRWg6GfyJCmrrizcZxARB3HVzcaasvNa8kBS72","AS3nKBQfKs8fJ8ncyHrdvo4FDT6S8HMRhD75JjCcyr1t","juicQdAnksqZ5Yb8NQwCLjLWhykvXGktxnQCDvMe6Nx", "NoRDTy8jpkpjPR7yxahVdoEUPngbojPhFU5jb8TtY4m" ]

    

    return (
        <View style={{ height: "100%" }}>
            {helpfulInTheCommunity.map((voteAccount) => {
                let validator = validators[voteAccount]
                return (
                    <ValidatorListItem key={voteAccount} validator={validator} />
                )
                })
            }
        </View>
    )
}

function ValidatorListItem({validator}: {validator: Validator}) {
  const nav = useNavigation();
    const clickValidator = () => {
      nav.push("create", validator);
    }
    const THEME = useCustomTheme();
    return (
        <View
              style={{ padding: "4px", paddingTop:"3px", paddingBottom:"3px", width: "100%" }}
            >
              <View
                style={{
                  display: "flex",
                  backgroundColor: THEME.colors?.bg2,
                  height: "100%",
                  cursor: "pointer",
                  width: "100%",
                  padding: "3px",
                  paddingTop: "4px",
                  paddingBottom: "4px",
                  borderRadius: "5px",
                }}
                onClick={() => clickValidator()}
              >
                  <Image  src={validator.image} style={{height:"44px", borderRadius:"9999px"}}></Image>
                <View style={{ paddingLeft: "4px", width:"100%", paddingTop:"3px"}}>
                  <Text >{validator.name}</Text> 
                  <View style={{display:"flex", justifyContent:"space-between", marginTop:"-3px"}}>
                    <Text>{Math.round(validator.activated_stake).toLocaleString()} SOL Staked</Text>
                    <Text style={{float:"right"}}>{validator.apy_estimate}% APY</Text>
                    </View>
                </View>
              </View>
            </View>
          );
}