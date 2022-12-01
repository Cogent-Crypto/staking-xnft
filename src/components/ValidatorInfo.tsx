import { View, Text, Image } from "react-xnft";
import React from "react";
import type { Validator } from "../hooks/useValidators";

export function ValidatorInfo(validator: Validator) {
    return (
        <View style={{
            fontSize: "18px",
            fontWeight: "bold",
            color: "white",
            textAlign: "center",
            margin: "auto",
            display: "flex",
            flexDirection: "column"
        }}>
            <View tw="flex items-center justify-center">
                <Image style={{ height: "40px", maxWidth: "unset", borderRadius: "999px", marginRight: 5 }} src={validator.image} />
                <Text>
                    {validator.name}
                </Text>
            </View>
            {/* <View tw="flex-1">
                </View> */}
            {validator.delinquent && <View tw="text-red-500">Validator is currently delinquent.</View>}
            {/* {
                validator.website ?
                    (<Text>
                        {validator.website}
                    </Text>) :
                    ""
            } */}
        </View>
    )
}