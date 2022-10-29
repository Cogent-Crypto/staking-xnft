import { View, Text, Image, TextField, Button, useNavigation } from "react-xnft";
import type { StakeAccount } from "../hooks/useStakeAccounts";
import React, { useState } from "react";
import { useValidators } from "../hooks/useValidators";
import { useCustomTheme } from "../hooks/useCustomTheme";
import type { Validator } from "../hooks/useValidators";
import { useSolBalance } from "../hooks/useSolBalance";

export function SelectValidatorScreen(onSelectScreen="") {
  const validators = useValidators();
  const [searchText, setSearchText] = useState("");
  const [validatorRenderCount, setValidatorRenderCount] = useState(20)

  if (!validators) {
    return <Text>Loading...</Text>;
  }

  const helpfulInTheCommunity = [
    "CogentC52e7kktFfWHwsqSmr8LiS1yAtfqhHcftCPcBJ",
    "GE6atKoWiQ2pt3zL7N13pjNHjdLVys8LinG8qeJLcAiL",
    "BLADE1qNA1uNjRgER6DtUFf7FU3c1TWLLdpPeEcKatZ2",
    "EARNynHRWg6GfyJCmrrizcZxARB3HVzcaasvNa8kBS72",
    "AS3nKBQfKs8fJ8ncyHrdvo4FDT6S8HMRhD75JjCcyr1t",
    "juicQdAnksqZ5Yb8NQwCLjLWhykvXGktxnQCDvMe6Nx",
    "NoRDTy8jpkpjPR7yxahVdoEUPngbojPhFU5jb8TtY4m",
  ];
  const nftValidators = [
    {
      voteAddress: "CogentC52e7kktFfWHwsqSmr8LiS1yAtfqhHcftCPcBJ",
      nft_group: "Cogent",
    },
    {
      voteAddress: "DeNodee9LR1WPokmRqidmAQEq8UbBqNCv6QfFTvU6k69",
      nft_group: "DeGods",
    },
    {
      voteAddress: "4qvFxnUXYjBdcviCwVV7gKcGJMCENEBfS82hSLJUhyvu",
      nft_group: "Degen Infrastructure",
    },
    {
      voteAddress: "DfpdmTsSCBPxCDwZwgBMfjjV8mF8xHkGRcXP8dJBVmrq",
      nft_group: "MonkeDAO",
    },
    {
      voteAddress: "5yHqB3NxovCEMUniQCboaPRMyyQ7kQQF4QqvC4vaz78z",
      nft_group: "Node Monkey",
    },
    {
      voteAddress: "AKoVXpZmi8wSz3sGvCYEygbpdHvSRysWsh36b97iPvKh",
      nft_group: "Shadowy Super Coder",
    },
    {
      voteAddress: "LodezVTbz3v5GK6oULfWNFfcs7D4rtMZQkmRjnh65gq",
      nft_group: "Sentries",
    },
    {
      voteAddress: "2ayMCC4aizr8RGg5ptXYqu8uoxW1whNek1hE1zaAd58z",
      nft_group: "Lifinity",
    },
    {
      voteAddress: "ChaossQVry9AgexbXooZoWUTDfhT1x5zsAmTbBqa5142",
      nft_group: "UdderChaos",
    },
  ];

  const onSearchBarChange = (e) => {
    const text = e.target.value;
    setSearchText(text);
  }; 

  let searchResults: Validator[] = [];
  if (searchText != "") {
    searchResults = Object.values(validators).filter((validator) => { return validator.name?.toLowerCase().includes(searchText.toLowerCase())}).slice(0, validatorRenderCount);

  } else {
    searchResults = Object.values(validators).slice(0, validatorRenderCount);
  }
  
  
  return (
    <View style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <View style={{ margin: "0px 5px", textAlign: "center" }}>
        <TextField
          onChange={onSearchBarChange}
          value={searchText}
          style={{ width: "100%" }}
        ></TextField>
        { searchText == "" ? 
          <View>
            <Text style={{ marginTop: "8px" }}>Helpful in the Community</Text>
            {helpfulInTheCommunity.map((voteAccount) => {
              let validator = validators[voteAccount];
              return <ValidatorListItem key={voteAccount} validator={validator} 
              onSelectScreen={onSelectScreen}/>;
            })}
            <Text style={{ marginTop: "8px" }}>NFT Project Validators</Text>
            {nftValidators.map((nft_val) => {
              let validator = validators[nft_val.voteAddress];
              return (
                <ValidatorListItem
                  key={nft_val.voteAddress}
                  validator={validator}
                  onSelectScreen={onSelectScreen}
                />
              );
            })}
            <Text>
              <Text style={{ marginTop: "8px" }}>All Validators</Text>
              {searchResults.map((validator) => {
                return <ValidatorListItem key={validator.vote_identity} validator={validator}
                onSelectScreen={onSelectScreen} />;
              })}
              <Button style={{ marginTop: "8px", cursor:"pointer", width:"100%" }} onClick={()=> {console.log("hi"); setValidatorRenderCount(validatorRenderCount + 20)}}>
                Show More Validators
                </Button>
            </Text>
          </View>
          : <View> 
            <Text style={{ marginTop: "8px" }}>Search Results</Text>
              { searchResults.length > 0 ?
              <View>
               {searchResults.map((validator) => {
                return ( 
                  // <Text>a</Text>
                  <ValidatorListItem
                  key={validator.vote_identity}
                  validator={validator}
                  onSelectScreen={onSelectScreen}
                  
                />
                )})}
                {
                  searchResults.length == validatorRenderCount ? 
                  <Button style={{ marginTop: "8px", cursor:"pointer", width:"100%" }} onClick={()=> {console.log("hi"); setValidatorRenderCount(validatorRenderCount + 20)}}>
                Show More Validators
                </Button> : ""
                }
              </View>
               
              : <Text>No Results</Text>
              }
          </View>
        }
      </View>
    </View>
  );
}

function ValidatorListItem({ validator, onSelectScreen }: { validator: Validator, onSelectScreen: string }) {
  const nav = useNavigation();
  const clickValidator = () => {
    nav.push(onSelectScreen, validator);
  };
  const THEME = useCustomTheme();
  return (
    <View
      style={{
        padding: "4px",
        paddingTop: "3px",
        paddingBottom: "3px",
        width: "100%",
      }}
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
        <Image
          src={validator.image}
          style={{ height: "44px", borderRadius: "9999px" }}
        ></Image>
        <View style={{ paddingLeft: "4px", width: "100%", paddingTop: "3px" }}>
          <Text>{validator.name}</Text>
          <View
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "-3px",
            }}
          >
            <Text>
              {Math.round(validator.activated_stake).toLocaleString()} SOL
              Staked
            </Text>
            <Text style={{ float: "right" }}>
              {validator.apy_estimate}% APY
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
