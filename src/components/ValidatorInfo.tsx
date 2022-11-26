import { View, Text, Button, useNavigation, Image } from "react-xnft";
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
            <View style={{ display: "flex", alignItems: "center", margin: "0 3px" }}>
                <View tw="flex-1">
                    <Image style={{ height: "40px", maxWidth: "unset", borderRadius: "999px", alignSelf: "center" }} src={validator.image} />
                </View>
                <Text>
                    {validator.name}
                </Text>
                <View tw="flex-1">
                </View>
            </View>
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