import { View, Text, Button, useNavigation, Image } from "react-xnft";
import React from "react";

export enum ButtonStatus {
    Ok = "ok",
    Error = "error",
    Warn = "warn",
}
export function PrimaryButton({status, disabled, onClick, text}:{status: ButtonStatus, disabled: Boolean, onClick: CallableFunction, text: String}) {
    
    const buttonStyle = {
      width: "100%",
      height: "48px",
      borderRadius: "12px",
      cursor: "pointer",
      color: "white"

    } as any

    if (status == ButtonStatus.Error) {
      
        buttonStyle.backgroundColor = "rgb(233, 80, 80)";  //Red
        
       
    }

    if(status == ButtonStatus.Warn) {
        buttonStyle.backgroundColor = "#ffc209"; //Yellow 
        buttonStyle.color = "black";
        buttonStyle.opacity = "0.75";
    }


    if (disabled) {
        buttonStyle.opacity = "0.5";
    } 
    console.log("Disabled", disabled);


    return (
        <View
            style={{
            display: "flex",
            paddingTop: "25px",
            paddingLeft: "12px",
            paddingRight: "12px",
            paddingBottom: "24px",
            justifyContent: "space-between",
            }}
        >   
        <Button
            key={disabled}
            style={buttonStyle}
            onClick={onClick}
            disabled={disabled}
        >
                {text}
        </Button>

           
        </View>
    )

}