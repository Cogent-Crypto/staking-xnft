
// import React from "react";
// import { View, Text, Button, useConnection } from "react-native";
// import { useNavigation } from '@react-navigation/native';

// import type { Transaction } from "@solana/web3.js";
// import { useEffect, useState } from 'react';

// export function ConfirmationScreen({txnSignature, txnDescription, onConfirm=()=>{}} : {txnSignature: string, txnDescription:string, onConfirm: () => void}) {

//     const navigation = useNavigation();
//     const connection = useConnection();
//     const [txnStatus, setTxnStatus] = useState("Pending");

//     useEffect(() => {
//         connection.confirmTransaction(txnSignature, "confirmed").then(() => {
//                 setTxnStatus("Confirmed");
//                 onConfirm();
//             }
//         ).catch((error) => {
//             console.log("error", error);
//             setTxnStatus("Failed");
//         })
//     }, [])

//     return (
//         <View style={{ height: "100%" }}>
//             <Text>Confirming {txnSignature}</Text>
//             <Text>Transaction Signature: {txnSignature}</Text>
//         </View>
//     )
// }