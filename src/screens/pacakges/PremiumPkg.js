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
} from "react-native";
import { inject, observer } from "mobx-react";
import { toJS } from "mobx";
import RNIap, {
  InAppPurchase,
  PurchaseError,
  SubscriptionPurchase,
  acknowledgePurchaseAndroid,
  consumePurchaseAndroid,
  finishTransaction,
  finishTransactionIOS,
  purchaseErrorListener,
  purchaseUpdatedListener,
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

const Packages = ({ navigation, designStore }) => {
  let itemSkus = {};
  const isMountedRef = Common.useIsMountedRef();

  const [filteredData, setFilteredData] = useState([]);
  const [currentItem, setCurrentItem] = useState();
  const [recipt, setRecipt] = useState();
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    if (isMountedRef.current) {
      const designPackages = toJS(designStore.designPackages);
      const filterData = designPackages.filter(
        (ele) => ele.type === Constant.vip
      );
      console.log("filterData", filterData);
      setFilteredData(filterData);
      filterData.length > 0
        ? setCurrentItem(filterData[0])
        : setCurrentItem(null);

      const filterId = filterData.map((ele) => ele.id);

      itemSkus = Platform.select({
        ios: filterId,
        android: [
          "android.test.purchased",
          "android.test.canceled",
          "android.test.refunded",
          "android.test.item_unavailable",
        ],
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
      const products = await RNIap.getProducts(itemSkus);
      console.log("Products", products);
      setProductList(products);
    } catch (err) {
      console.log("error", err.code, err.message);
    }
  };

  useEffect(() => {
    if (isMountedRef.current) {
      (async () => {
        try {
          const result = await RNIap.initConnection();
          await RNIap.flushFailedPurchasesCachedAsPendingAndroid();
          console.log("result", result);
        } catch (err) {
          console.warn(err.code, err.message);
        }
        purchaseUpdateSubscription = purchaseUpdatedListener(
          async (purchase) => {
            console.log("purchase listner", purchase);
            const receipt = purchase.transactionReceipt;
            console.log("recipts", receipt);
            if (receipt) {
              try {
                if (Platform.OS === "ios") {
                  finishTransactionIOS(purchase.transactionId);
                } else if (Platform.OS === "android") {
                  // If consumable (can be purchased again)
                  consumePurchaseAndroid(purchase.purchaseToken);
                  // If not consumable
                  acknowledgePurchaseAndroid(purchase.purchaseToken);
                }
                const ackResult = await finishTransaction(purchase);
              } catch (ackErr) {
                console.warn("ackErr", ackErr);
              }
              setRecipt(receipt), () => goNext();
            }
          }
        );

        purchaseErrorSubscription = purchaseErrorListener((error) => {
          console.log("purchaseErrorListener", error);
          Alert.alert("purchase error", JSON.stringify(error));
        });
        return (
          purchaseUpdateSubscription.remove(),
          purchaseErrorSubscription.remove()
        );
      })();
    }
  }, []);

  // key extractors
  const keyExtractor = useCallback((item) => item.id.toString(), []);

  const requestSubscription = async (sku) => {
    try {
      RNIap.requestSubscription(sku)
        .then((res) => {
          console.log("RESPONSE", res);
        })
        .catch((err) => Common.showMessage(err.message));
    } catch (err) {
      Alert.alert("error", err.message);
    }
  };
  const prodId =
    productList &&
    productList !== null &&
    productList.map((prod) => prod.productId);

  console.log("prodId", prodId);

  return (
    <View style={styles.mainContainer}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <View style={{ flex: 1 }}>
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
          <FlatList
            data={filteredData}
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
                      <Text style={styles.txtdiscount}>
                        ₹ {item.discountPrice}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
          <View style={{ marginVertical: 20 }}></View>
          <View
            style={{
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
              subscriptions will autometically renew unless Auto renew is turn
              off atlist 24 hours before the end of currant period
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
              your account will be charged according to your Plan for renewal
              within 24 hours Prior to the end of the currant period you can
              manage or turn off auto-renew in your account settings at any time
              after purchase
            </Text>
          </View>
        </View>
      </ScrollView>
      <Button
        style={{ marginTop: 0, marginBottom: Platform.OS === "ios" ? 10 : 0 }}
        normal={true}
        onPress={() => requestSubscription("android.test.purchased")}
      >
        {Common.getTranslation(LangKey.labPerchase)}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingBottom: 10,
  },
  container: {
    flex: 1,
    marginBottom: 10,
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

export default inject("designStore")(observer(Packages));
