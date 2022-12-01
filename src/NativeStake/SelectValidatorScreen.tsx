import {
  View,
  Text,
  Image,
  TextField,
  Button,
  useNavigation,
} from "react-xnft";
import React, { useState } from "react";
import { useValidators } from "../hooks/useValidators";
import { useCustomTheme } from "../hooks/useCustomTheme";
import type { Validator } from "../hooks/useValidators";
import { ExpandIcon } from "../components/Icons"
import { LoadingScreen } from "../components/LoadingScreen";

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

export function SelectValidatorScreen({
  onSelectScreen,
  data,
}: {
  onSelectScreen: string;
  data: any;
}) {
  const validators = useValidators();
  const [searchText, setSearchText] = useState("");
  const [validatorRenderCount, setValidatorRenderCount] = useState(20);


  if (!validators) {
    return <LoadingScreen />;
  }

  const communityValidators = helpfulInTheCommunity.map(voteAccount => validators[voteAccount])
  const nftProjectValidators = nftValidators.map(({ voteAddress }) => validators[voteAddress])

  const onSearchBarChange = (e) => {
    const text = e.target.value;
    setSearchText(text);
  };

  let searchResults: Validator[] = [];
  if (searchText != "") {
    searchResults = Object.values(validators)
      .filter((validator) => {
        return validator.name?.toLowerCase().includes(searchText.toLowerCase());
      })
      .slice(0, validatorRenderCount);
  } else {
    searchResults = Object.values(validators).slice(0, validatorRenderCount);
  }

  return (
    <View style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <View style={{ margin: "0px 5px" }}>
        <TextField
          onChange={onSearchBarChange}
          value={searchText}
          style={{ width: "100%" }}
        ></TextField>
        {searchText == "" ? (
          <View>
            <ValidatorListContainer title={"Helpful in the Community"} onSelectScreen={onSelectScreen} selectScreenData={data} validators={communityValidators} />
            <ValidatorListContainer title={"NFT Project Validators"} onSelectScreen={onSelectScreen} selectScreenData={data} validators={nftProjectValidators} />
            <ValidatorListContainer title="All Validators" onSelectScreen={onSelectScreen} selectScreenData={data} validators={searchResults} />
            <Button
              style={{ marginTop: "8px", cursor: "pointer", width: "100%" }}
              onClick={() => {
                console.log("hi");
                setValidatorRenderCount(validatorRenderCount + 20);
              }}
            >
              Show More Validators
            </Button>
          </View>
        ) : (
          <View>
            {searchResults.length > 0 ? (
              <View>
                <ValidatorListContainer title="Search Results" onSelectScreen={onSelectScreen} selectScreenData={data} validators={searchResults} />
                {searchResults.length == validatorRenderCount && (
                  <Button
                    style={{
                      marginTop: "8px",
                      cursor: "pointer",
                      width: "100%",
                    }}
                    onClick={() => {
                      setValidatorRenderCount(validatorRenderCount + 20);
                    }}
                  >
                    Show More Validators
                  </Button>
                )}
              </View>
            ) : (
              <Text tw="mt-2">No Results</Text>
            )}
          </View>
        )}
      </View>
    </View>
  );
}


const ValidatorListContainer = ({ validators, onSelectScreen, selectScreenData, title }: {
  validators: Validator[];
  onSelectScreen: string;
  selectScreenData: any;
  title: any
}) => {
  const [currentIndex, setCurrentIndex] = useState(null);

  const handleExpandClick = (id: any) => {
    currentIndex === id ? setCurrentIndex(() => null) : setCurrentIndex(() => id);
  };

  return (
    <View>
      <Text style={{ marginTop: "8px" }}>{title}</Text>
      {validators.map((validator: Validator, idx: number) => {
        return (
          <ValidatorListItem
            key={idx}
            index={idx}
            handleExpandClick={handleExpandClick}
            isExpanded={currentIndex === idx}
            validator={validator}
            onSelectScreen={onSelectScreen}
            selectScreenData={selectScreenData}
          />
        );
      })}
    </View>
  )
}


const ValidatorListItem = ({
  validator,
  onSelectScreen,
  selectScreenData,
  handleExpandClick,
  index,
  isExpanded,
}: {
  validator: Validator;
  onSelectScreen: string;
  selectScreenData: any;
  index: number;
  isExpanded: boolean;
  handleExpandClick: (index: any) => void;
}) => {
  const nav = useNavigation();
  const THEME = useCustomTheme();

  const handleExpand = () => {
    handleExpandClick(index);
  }

  const clickValidator = () => {
    console.log("onSelectScreen", onSelectScreen);
    if (onSelectScreen == "create") {
      nav.push(onSelectScreen, { validator: validator });
    } else {
      nav.push(onSelectScreen, { validator: validator, stakeAccount: selectScreenData });
    }

  };
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
        tw="flex items-center"
        style={{
          backgroundColor: THEME.colors?.bg2,
          width: "100%",
          cursor: "pointer",
          padding: "3px",
          paddingTop: "4px",
          paddingBottom: "4px",
          borderRadius: "5px",
        }}
      >
        <Image
          tw="mr-2"
          src={validator.image}
          onClick={clickValidator}
          style={{ height: "44px", borderRadius: "9999px" }}
        />
        <View tw="w-full"
          onClick={clickValidator} >
          <Text>{validator.name}</Text>

          <View
            tw="flex mt--2 text-sm justify-between"
          >
            <Text tw="font-light">
              {Math.round(validator.activated_stake).toLocaleString()} SOL
              Staked
            </Text>
            <Text tw="font-light">
              {validator.apy_estimate}% APY
            </Text>
          </View>
          {isExpanded &&
            <View tw="py-2 py-1 text-white text-xs">
              {validator.website &&
                <View onClick={() => window.xnft.openWindow(validator.website)} tw="py-1">
                  {validator.website}
                </View>}
              <View tw="py-1">
                {validator.description}
              </View>
            </View>
          }
        </View>

        <ExpandIcon expanded={isExpanded} onClick={() => handleExpand()} tw={`transition-transform ml-auto min-w-[24px]`} />
      </View>
    </View>
  );
}
