import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Animated,
  ScrollView,
  Platform,
  Linking,
  Alert,
} from "react-native";
import { inject, observer } from "mobx-react";
import { toJS } from "mobx";
import RNIap, {
  InAppPurchase,
  PurchaseError,
  SubscriptionPurchase,
  acknowledgePurchaseAndroid,
  finishTransaction,
  finishTransactionIOS,
  purchaseErrorListener,
  purchaseUpdatedListener,
  initConnection,
  getProducts as rnIapProducts,
  flushFailedPurchasesCachedAsPendingAndroid,
  consumePurchaseAndroid,
  requestSubscription as rnIapRequestSubscription,
} from "react-native-iap";

// Relative Path
import Common from "../../utils/Common";
import Color from "../../utils/Color";
import LangKey from "../../utils/LangKey";
import Button from "../../components/Button";
import Constant from "../../utils/Constant";
import Icon from "../../components/svgIcons";
import FastImage from "react-native-fast-image";
import { SvgUri } from "react-native-svg";
import { useMutation } from "@apollo/client";
import GraphqlQuery from "../../utils/GraphqlQuery";
import ProgressDialog from "../common/ProgressDialog";

let isGetProducts = false;

const Packages = ({ navigation, designStore, userStore }) => {
  const user = toJS(userStore.user);

  let itemSkus = {};
  const isMountedRef = Common.useIsMountedRef();

  const [filteredData, setFilteredData] = useState([]);
  const [currentItem, setCurrentItem] = useState();
  const [recipt, setRecipt] = useState();
  const [productList, setProductList] = useState([]);

  const [addUserDesignPackage, { data, loading, error }] = useMutation(
    GraphqlQuery.addUserDesignPackage,
    {
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    }
  );

  useEffect(() => {
    if (isMountedRef.current) {
      const designPackages = toJS(designStore.designPackages);
      const filterData = designPackages.filter(
        (ele) => ele.type === Constant.vip
      );

      setFilteredData(filterData);
      filterData.length > 0
        ? setCurrentItem(filterData[0])
        : setCurrentItem(null);

      const filterId = filterData.map((ele) => ele.id);

      itemSkus = Platform.select({
        ios: filterId,
        android: filterId,
      });

      console.log("itemSkus", itemSkus);
      getProducts();
    }
  }, [designStore.designPackages]);

  let purchaseUpdateSubscription;
  let purchaseErrorSubscription;
  const goNext = () => {
    alert("Receipt", this.state.receipt);
  };

  const getProducts = async () => {
    try {
      rnIapProducts(itemSkus)
        .then((res) => {
          isGetProducts = true;
        })
        .catch((err) => {
          isGetProducts = false;
        });
    } catch (err) {
      isGetProducts = false;
    }
  };

  useEffect(() => {
    if (isMountedRef.current) {
      (async () => {
        try {
          const result = await initConnection();
          await flushFailedPurchasesCachedAsPendingAndroid();
          console.log("result", result);
        } catch (err) {
          console.warn(err.code, err.message);
        }
      })();
      purchaseUpdateSubscription = purchaseUpdatedListener(async (purchase) => {
        console.log("purchase listner", purchase);
        const receipt = purchase.transactionReceipt;
        console.log("recipts", receipt);
        if (receipt) {
          try {
            if (Platform.OS === "ios") {
              finishTransactionIOS(purchase.transactionId);
            } else if (Platform.OS === "android") {
              // If consumable (can be purchased again)
              // consumePurchaseAndroid(purchase.purchaseToken);
              await consumePurchaseAndroid(
                purchase.purchaseToken,
                purchase.developerPayloadAndroid
              );
              // // If not consumable
              // acknowledgePurchaseAndroid(purchase.purchaseToken);
              await finishTransaction(purchase);
            }
          } catch (ackErr) {
            console.warn("ackErr", ackErr);
          }
          setRecipt(receipt), () => goNext();
        }
      });

      purchaseErrorSubscription = purchaseErrorListener((error) => {
        console.log("purchaseErrorListener", error);
      });
      return () => {
        purchaseUpdateSubscription.remove(), purchaseErrorSubscription.remove();
      };
    }
  }, []);

  // key extractors
  const keyExtractor = useCallback((item) => item.id.toString(), []);

  const requestSubscription = async (sku) => {
    if (user && user !== null) {
      if (isGetProducts === false) {
        const res = await rnIapProducts(itemSkus);
      }

      try {
        rnIapRequestSubscription(sku)
          .then((res) => {
            console.log("RESPONSE", res);
            if (res && res !== null) {
              addUserDesignPackage({
                variables: {
                  packageId: sku,
                  androidPerchaseToken: res.purchaseToken,
                },
              })
                .then(({ data, errors }) => {
                  if (errors && errors !== null) {
                    Common.showMessage(errors[0].message);
                  } else if (
                    data.addUserDesignPackage &&
                    data.addUserDesignPackage !== null &&
                    Array.isArray(data.addUserDesignPackage)
                  ) {
                    console.log("DATA", data);
                    const newUser = {
                      ...user,
                      designPackage: data.addUserDesignPackage
                        ? data.addUserDesignPackage
                        : user.designPackage,
                    };
                    userStore.setUser(newUser);
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          })
          .catch((err) => Common.showMessage(err.message));
      } catch (err) {
        Common.showMessage(err.message);
      }
    } else {
      Common.showMessage(Common.getTranslation(LangKey.msgCreateAccForPKg));
    }
  };
  const prodId =
    productList &&
    productList !== null &&
    productList.map((prod) => prod.productId);

  console.log("prodId", prodId);

  const headerComponant = () => {
    return (
      <>
        {currentItem && currentItem !== null && (
          <>
            <Text style={styles.txtFeaturetitle}>
              {Common.getTranslation(LangKey.labPremiumFeature)}
            </Text>
            <ScrollView contentContainerStyle={styles.scrollView}>
              {currentItem.features.map((i) => {
                return (
                  <View style={styles.featureItems}>
                    <View style={{ paddingHorizontal: 10 }}>
                      <Icon name="bullatin" height={10} width={10} />
                    </View>
                    <Text style={styles.txtFeaturesList}>{i}</Text>
                  </View>
                );
              })}
            </ScrollView>
          </>
        )}
      </>
    );
  };
  const footerComponant = () => {
    return (
      <View
        style={{
          marginTop: 10,
          marginHorizontal: 20,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            textTransform: "capitalize",
            textAlign: "justify",
            fontSize: 9,
            color: Color.accent,
          }}
        >
          {/* {Common.getTranslation(LangKey.lab1pkg)} */}
          Payment will be charged to your Store at confirmation of Purchase
          subscriptions will autometically renew unless Auto renew is turn off
          atlist 24 hours before the end of currant period.
        </Text>
        <Text
          style={{
            textTransform: "capitalize",
            textAlign: "justify",
            marginTop: 10,
            fontSize: 9,
            color: Color.accent,
          }}
        >
          {/* {Common.getTranslation(LangKey.lab1pkg)} */}
          your account will be charged according to your Plan for renewal within
          24 hours Prior to the end of the currant period you can manage or turn
          off auto-renew in your account settings at any time after purchase.
        </Text>
      </View>
    );
  };
  return (
    <View style={styles.mainContainer}>
      <ProgressDialog
        visible={loading}
        dismissable={false}
        message={Common.getTranslation(LangKey.labLoading)}
      />
      <FlatList
        data={filteredData}
        contentContainerStyle={{ paddingBottom: 10 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={headerComponant()}
        ListFooterComponent={footerComponant()}
        keyExtractor={keyExtractor}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                setCurrentItem(item);
              }}
              style={[
                styles.fltContainer,
                {
                  backgroundColor:
                    currentItem.id === item.id
                      ? Color.primary
                      : Color.txtInBgColor,
                },
              ]}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginHorizontal: 10,
                }}
              >
                <SvgUri
                  uri={item.image.url}
                  width={32}
                  height={32}
                  fill={
                    currentItem.id === item.id ? Color.white : Color.primary
                  }
                />
                <View style={{ flex: 1, paddingHorizontal: 10 }}>
                  <View style={styles.innerfitContainer}>
                    <Text style={styles.txtlable}>{item.name}</Text>
                  </View>
                  <View style={styles.innerfitContainer}>
                    <Text style={styles.txtdes}>{item.description}</Text>
                  </View>
                </View>
                <View style={styles.discountView}>
                  <Text style={styles.txtdiscount}>₹ {item.discountPrice}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      <Button
        // disabled={isGetProducts}
        style={{ marginTop: 5, marginBottom: Platform.OS === "ios" ? 20 : 5 }}
        normal={true}
        onPress={() => requestSubscription(currentItem.id)}
      >
        {Common.getTranslation(LangKey.labPerchase)}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },

  txtFeaturetitle: { fontSize: 16, fontWeight: "700", marginVertical: 8 },
  scrollView: { marginHorizontal: 10, paddingBottom: 10 },
  featureItems: {
    margin: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  txtFeaturesList: { fontSize: 15, fontWeight: "500" },
  fltContainer: {
    marginTop: 10,
    marginBottom: 5,
    borderRadius: 15,
    justifyContent: "center",
    backgroundColor: Color.white,
    marginHorizontal: 5,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  discountView: {
    minWidth: 80,
    paddingHorizontal: 8,
    height: 50,
    backgroundColor: Color.white,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  txtdiscount: {
    color: Color.primary,
    fontSize: 15,
    fontWeight: "700",
  },
  innerfitContainer: {
    marginVertical: 5,
  },
  txtlable: {
    fontSize: 18,
    color: Color.darkBlue,
    fontWeight: "700",
  },
  txtdes: {
    fontSize: 13,
    color: Color.darkBlue,
    fontWeight: "600",
  },
  txtPrice: {
    paddingLeft: 10,
    fontSize: 18,
    color: Color.white,
    fontWeight: "700",
  },
  btnPerchase: {
    backgroundColor: Color.primary,
    alignItems: "center",
    borderRadius: 50,
    height: 27,
    width: 110,
    justifyContent: "center",
    marginHorizontal: 20,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    color: Color.white,
  },
  txtPerchase: {
    fontSize: 13,
    fontWeight: "700",
    color: Color.white,
    textTransform: "capitalize",
  },
});

export default inject("designStore", "userStore")(observer(Packages));
