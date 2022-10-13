import React from "react";
import { View, Text } from "react-xnft";

export enum ToastType {
  error,
  warn,
  success,
}

export function Toast({
  message,
  status=ToastType.error,
}: {
  message: string;
  status: ToastType;
}) {
  return (
    <View
      style={{
        textAlign: "center",
        height: "28px",
        width: message.length-1 + "ch",
        position: "absolute",
        bottom: "12px",
        backgroundColor: ToastType.error == status ? "red": ToastType.warn == status ? "yellow" : "green",
        marginRight: "auto",
        marginLeft: "auto",
        right: "0",
        left: "0",
        borderRadius: "8px"
      }}
    >
      <Text>{message}</Text>
    </View>
  );
}
