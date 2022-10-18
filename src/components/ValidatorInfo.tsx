import { View, Text, Button, useNavigation, Image } from "react-xnft";
import React from "react";
import type { Validator } from "../hooks/useValidators";

export function ValidatorInfo(validator: Validator) {
    return (
        <View style={{
            fontSize: 20,
            fontWeight: "bold",
            color: "white",
            textAlign: "center",
        }}>
             <Image style={{height:"50px", borderRadius:"999px"}} src={validator.image} />
            <Text>
                {validator.name}
            </Text>
            {validator.website ?  
                (<Text>
                    {validator.website}
                </Text>) : 
                ""}
            <Text>
                {validator.apy_estimate}% APY
            </Text> 
           
        </View>
    )
}