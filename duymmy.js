// // import React, { useEffect, useState } from "react";
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   Platform,
// //   TouchableOpacity,
// //   Image,
// //   Alert,
// // } from "react-native";
// // import IAP from "react-native-iap";
// // const items = Platform.select({
// //   ios: ["rt_699_1m"],
// //   android: ["android.test.purchase", "item_1"],
// // });
// // let purchaseUpdateListener = null;
// // let purchaseErrorListener = null;
// // const App = () => {
// //   const [purchased, setPurchased] = useState(false);
// //   const [products, setProducts] = useState([]);
// //   const [checking, setChecking] = useState(true);
// //   const validate = async (receipt) => {
// //     setChecking(true);
// //     const receiptBody = {
// //       "receipt-data": receipt,
// //       //App-Specific Shared Secret
// //       password: "a9c0c0ad98e34e248662d61ead87825a",
// //     };
// //     const result = await IAP.validateReceiptIos(receiptBody, true)
// //       .catch(() => {})
// //       .then((receipt) => {
// //         try {
// //           //console.log(receipt)
// //           const renewalHistory = receipt.latest_receipt_info;
// //           const expiration =
// //             renewalHistory[renewalHistory.length - 1].expires_data_ms;
// //           let expired = Date.now() > expiration;
// //           if (!expired) {
// //             setPurchased(true);
// //           } else {
// //             Alert.alert("Purchse Expired", "your subscription has expired");
// //           }
// //           setChecking(false);
// //         } catch (error) {}
// //       });
// //   };
// //   useEffect(() => {
// //     IAP.initConnection()
// //       .catch(() => {
// //         console.log("Error connecting to store");
// //       })
// //       .then(() => {
// //         console.log("connected to store...");
// //         IAP.getSubscriptions(items)
// //           .catch(() => {
// //             console.log("error finding purchase");
// //           })
// //           // all the details of app purchase
// //           .then((res) => {
// //             console.log("got products");
// //             // fetch details app created in apple  developer account
// //             console.log(res);
// //             setProducts(res);
// //             //console.log(products)
// //           });
// //         IAP.getPurchaseHistory()
// //           .catch(() => {
// //             setChecking(false);
// //           })
// //           .then((res) => {
// //             const receipt = res[res.length - 1].transactionReceipt;
// //             if (receipt) {
// //               validate(receipt);
// //               //console.log(receipt)
// //             }
// //           });
// //       });
// //     purchaseErrorListener = IAP.purchaseErrorListener((error) => {
// //       if (error["responseCode"] === "2") {
// //         //user cancelled
// //       } else {
// //         Alert.alert(
// //           "Error",
// //           "There has been an error with your purachase, error code="
// //         );
// //       }
// //     });
// //     purchaseUpdateListener = IAP.purchaseUpdatedListener((purchased) => {
// //       try {
// //         const reqeipt = purchased.transactionReceipt;

// //         if (reqeipt) {
// //           validate(reqeipt);
// //         }
// //       } catch (error) {}
// //     });
// //   }, []);
// //   if (checking) {
// //     <View style={styles.container}>
// //       <Text style={styles.txt}>Checking for previous Purchase...</Text>
// //     </View>;
// //   } else {
// //     if (purchased) {
// //       return (
// //         <View style={styles.container}>
// //           <Text style={styles.txt}>Welcome to the app</Text>
// //         </View>
// //       );
// //     } else {
// //       if (products.length > 0) {
// //         return (
// //           <View style={styles.container}>
// //             {/* {Subcription Display name} */}
// //             <Text style={styles.txt}>
// //               {/* {products[0]["title"]} */}
// //               RNIap Test Premium Access
// //             </Text>
// //             <Text style={styles.txt}>
// //               {/*  {products[0]["LocalizedPrice"]} */}1 Month $6.99
// //             </Text>
// //             <View style={{ height: 4, width: 50, backgroundColor: "#fff" }} />
// //             <View
// //               style={{
// //                 backgroundColor: "rgba(150,150,150,0.25)",
// //                 borderRadius: 10,
// //                 padding: 10,
// //                 marginTop: 15,
// //               }}
// //             >
// //               <Text style={styles.txt_View}>Features:</Text>
// //               <Text style={styles.txt_View}>
// //                 {"\u2B24"} Ad-free access to the entire app{"\n"}
// //                 {"\u2B24"} Not Complicated{"\n"}
// //                 {"\u2B24"} Easy to access {"\n"}
// //               </Text>
// //             </View>
// //             <TouchableOpacity
// //               onPress={() => {
// //                 console.log("Pressed");
// //                 IAP.requestSubscription(products[0]["productId"]);
// //               }}
// //             >
// //               <Text>Purchase</Text>
// //             </TouchableOpacity>
// //           </View>
// //         );
// //       } else {
// //         //if still loading
// //         return (
// //           <View style={styles.container}>
// //             <Text style={styles.txt}>Fetching products please wait...</Text>
// //           </View>
// //         );
// //       }
// //     }
// //   }

// //   return (
// //     <></>
// //     // <View style={styles.container}>
// //     //   {/* {Subcription Display name} */}
// //     //   <Text style={styles.txt}>
// //     //     {/* {products[0]["title"]} */}
// //     //     RNIap Test Premium Access
// //     //   </Text>
// //     //   <Text style={styles.txt}>
// //     //     {/*  {products[0]["LocalizedPrice"]} */}1 Month $6.99
// //     //   </Text>
// //     //   <View style={{ height: 4, width: 50, backgroundColor: "#fff" }} />
// //     //   <View
// //     //     style={{
// //     //       backgroundColor: "rgba(150,150,150,0.25)",
// //     //       borderRadius: 10,
// //     //       padding: 10,
// //     //       marginTop: 15,
// //     //     }}
// //     //   >
// //     //     <Text style={styles.txt_View}>Features:</Text>
// //     //     <Text style={styles.txt_View}>
// //     //       {"\u2B24"}Ad-free access to the entire app{"\n"}
// //     //       {"\u2B24"}Not Complicated{"\n"}
// //     //       {"\u2B24"}Easy to access {"\n"}
// //     //     </Text>
// //     //   </View>
// //     //   <TouchableOpacity
// //     //     onPress={() => {
// //     //       console.log("Pressed");
// //     //       IAP.requestSubscription(products[0]["productId"]);
// //     //     }}
// //     //   >
// //     //     <Text style={{ color: "#30A9DE", fontSize: 20, marginVertical: 5 }}>
// //     //       Purchase
// //     //     </Text>
// //     //   </TouchableOpacity>
// //     // </View>
// //   );
// // };
// // export default App;
// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     backgroundColor: "#000",
// //   },
// //   txt: {
// //     color: "#fff",
// //     fontSize: 30,
// //     paddingBottom: 10,
// //   },
// //   txt_View: {
// //     color: "#fff",
// //     fontSize: 16,
// //   },
// // });

// import {
//   Alert,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import RNIap, {
//   InAppPurchase,
//   PurchaseError,
//   SubscriptionPurchase,
//   acknowledgePurchaseAndroid,
//   consumePurchaseAndroid,
//   finishTransaction,
//   finishTransactionIOS,
//   purchaseErrorListener,
//   purchaseUpdatedListener,
// } from "react-native-iap";
// import React, { Component } from "react";
// // App Bundle > com.dooboolab.test
// const itemSkus = Platform.select({
//   ios: [
//     "com.cooni.point1000",
//     "com.cooni.point5000", // dooboolab
//   ],
//   android: [
//     "android.test.purchased",
//     "android.test.canceled",
//     "android.test.refunded",
//     "android.test.item_unavailable",
//     // 'point_1000', '5000_point', // dooboolab
//   ],
// });
// const itemSubs = Platform.select({
//   ios: [
//     "com.cooni.point1000",
//     "com.cooni.point5000", // dooboolab
//   ],
//   android: [
//     "test.sub1", // subscription
//   ],
// });
// let purchaseUpdateSubscription;
// let purchaseErrorSubscription;

// class Page extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       productList: [],
//       receipt: "",
//       availableItemsMessage: "",
//     };
//   }

//   async componentDidMount() {
//     try {
//       const result = await RNIap.initConnection();
//       await RNIap.flushFailedPurchasesCachedAsPendingAndroid();
//       console.log("result", result);
//     } catch (err) {
//       console.warn(err.code, err.message);
//     }

//     purchaseUpdateSubscription = purchaseUpdatedListener(
//       async (purchase: InAppPurchase | SubscriptionPurchase) => {
//         console.log("purchase listner", purchase);
//         const receipt = purchase.transactionReceipt;
//         console.log("recipts", receipt);
//         if (receipt) {
//           try {
//             if (Platform.OS === "ios") {
//               finishTransactionIOS(purchase.transactionId);
//             } else if (Platform.OS === "android") {
//               // If consumable (can be purchased again)
//               consumePurchaseAndroid(purchase.purchaseToken);
//               // If not consumable
//               acknowledgePurchaseAndroid(purchase.purchaseToken);
//             }
//             const ackResult = await finishTransaction(purchase);
//           } catch (ackErr) {
//             console.warn("ackErr", ackErr);
//           }
//           this.setState({ receipt }, () => this.goNext());
//         }
//       }
//     );

//     purchaseErrorSubscription = purchaseErrorListener(
//       (error: PurchaseError) => {
//         console.log("purchaseErrorListener", error);
//         Alert.alert("purchase error", JSON.stringify(error));
//       }
//     );
//   }

//   componentWillUnmount() {
//     if (purchaseUpdateSubscription) {
//       purchaseUpdateSubscription.remove();
//       purchaseUpdateSubscription = null;
//     }
//     if (purchaseErrorSubscription) {
//       purchaseErrorSubscription.remove();
//       purchaseErrorSubscription = null;
//     }
//     RNIap.endConnection();
//   }
//   goNext = () => {
//     Alert.alert("Receipt", this.state.receipt);
//   };
//   getItems = async () => {
//     try {
//       const products = await RNIap.getProducts(itemSkus);
//       // const products = await RNIap.getSubscriptions(itemSkus);
//       console.log("Products", products);
//       this.setState({ productList: products });
//     } catch (err) {
//       alert(err.code, err.message);
//       console.log(err.code, err.message);
//     }
//   };
//   getSubscriptions = async () => {
//     try {
//       const products = await RNIap.getSubscriptions(itemSubs);
//       console.log("Products", products);
//       this.setState({ productList: products });
//     } catch (err) {
//       console.warn(err.code, err.message);
//     }
//   };
//   getAvailablePurchases = async () => {
//     try {
//       console.info(
//         "Get available purchases (non-consumable or unconsumed consumable)"
//       );
//       console.log("object");
//       const purchase = await RNIap.getAvailablePurchases();
//       console.log("Available purchase :: ", purchase);
//       if (purchase && purchase.length > 0) {
//         this.setState({
//           availableItemsMessage: `Got ${purchase.length} items.`,
//           receipt: purchase[0].transactionReceipt,
//         });
//       }
//     } catch (err) {
//       console.warn(err.code, err.message);
//       Alert.alert("hello", err.message);
//     }
//   };
//   // Version 3 apis
//   requestPurchase = async (sku) => {
//     try {
//       RNIap.requestPurchase(sku);
//     } catch (err) {
//       alert("er", err);
//       // console.warn(err.code, err.message);
//     }
//   };
//   requestSubscription = async (sku) => {
//     try {
//       RNIap.requestSubscription(sku)
//         .then((res) => {
//           console.log("RESPONSE", res);
//         })
//         .catch((err) => console.log("ERROR", err));
//     } catch (err) {
//       Alert.alert("error", err.message);
//     }
//   };
//   render() {
//     const { productList, receipt, availableItemsMessage } = this.state;
//     const receipt100 = receipt.substring(0, 100);
//     return (
//       <View style={styles.container}>
//         <View style={styles.header}>
//           <Text style={styles.headerTxt}>react-native-iap V3</Text>
//         </View>
//         <View style={styles.content}>
//           <ScrollView style={{ alignSelf: "stretch" }}>
//             <View style={{ height: 50 }} />
//             <TouchableOpacity
//               onPress={this.getAvailablePurchases}
//               activeOpacity={0.5}
//               style={styles.btn}
//             >
//               <Text style={styles.txt}>Get available purchases</Text>
//             </TouchableOpacity>
//             <Text style={{ margin: 5, fontSize: 15, alignSelf: "center" }}>
//               {availableItemsMessage}
//             </Text>
//             <Text
//               style={{
//                 margin: 5,
//                 fontSize: 9,
//                 alignSelf: "center",
//                 color: "red",
//               }}
//             >
//               {receipt100}
//             </Text>
//             <TouchableOpacity
//               onPress={() => this.getItems()}
//               activeOpacity={0.5}
//               style={styles.btn}
//             >
//               <Text style={styles.txt}>
//                 Get Products ({productList.length})
//               </Text>
//             </TouchableOpacity>
//             {productList.map((product, i) => {
//               console.log("product.productId :", product.productId);
//               return (
//                 <View
//                   key={i}
//                   style={{
//                     flexDirection: "column",
//                   }}
//                 >
//                   <Text
//                     style={{
//                       marginTop: 20,
//                       fontSize: 12,
//                       color: "black",
//                       minHeight: 100,
//                       alignSelf: "center",
//                       paddingHorizontal: 20,
//                     }}
//                   >
//                     {JSON.stringify(product)}
//                   </Text>
//                   <TouchableOpacity
//                     // onPress={() => this.requestPurchase(product.productId)}
//                     onPress={() => this.requestSubscription(product.productId)}
//                     activeOpacity={0.5}
//                     style={styles.btn}
//                   >
//                     <Text style={styles.txt}>
//                       Request purchase for above product
//                     </Text>
//                   </TouchableOpacity>
//                 </View>
//               );
//             })}
//           </ScrollView>
//         </View>
//       </View>
//     );
//   }
// }
// export default Page;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: Platform.select({
//       ios: 0,
//       android: 24,
//     }),
//     paddingTop: Platform.select({
//       ios: 0,
//       android: 24,
//     }),
//     backgroundColor: "white",
//   },
//   header: {
//     flex: 20,
//     flexDirection: "row",
//     alignSelf: "stretch",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   headerTxt: {
//     fontSize: 26,
//     color: "green",
//   },
//   content: {
//     flex: 80,
//     flexDirection: "column",
//     justifyContent: "center",
//     alignSelf: "stretch",
//     alignItems: "center",
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//   },
//   btn: {
//     height: 48,
//     width: 240,
//     alignSelf: "center",
//     backgroundColor: "#00c40f",
//     borderRadius: 0,
//     borderWidth: 0,
//   },
//   txt: {
//     fontSize: 16,
//     color: "white",
//   },
// });

import React, { useState } from "react";
import { View, Button, Platform, SafeAreaView } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Color from "./src/utils/Color";

const App = () => {
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View>
        <Button onPress={showDatepicker} title="Show date picker!" />
      </View>
      <View>
        <Button onPress={showTimepicker} title="Show time picker!" />
      </View>
      <View style={{ flex: 1, backgroundColor: "pink" }}>
        {show && (
          <DateTimePicker
            style={{ backgroundColor: Color.txtInBgColor }}
            testID="dateTimePicker"
            value={date}
            mode={"date"}
            is24Hour={true}
            display="spinner"
            onChange={onChange}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default App;
