import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLazyQuery } from "@apollo/client";
import { inject, observer } from "mobx-react";

import GraphqlQuery from "../utils/GraphqlQuery";
import ItemDesign from "./common/ItemDesign";
import Common from "../utils/Common";
import Constant from "../utils/Constant";
import Color from "../utils/Color";
import { color } from "react-native-reanimated";
import LangKey from "../utils/LangKey";
import FastImage from "react-native-fast-image";

let isFirstTime = true;

const UserPackage = ({ navigation, designStore }) => {
  const [perchasedPackages, setPerchasedPackages] = useState([]);
  const [totalPerchasedPackages, setTotalPerchasedPackages] = useState(0);

  const isMountedRef = Common.useIsMountedRef();

  const [fetchPerchasedPackages, { loading, data, error }] = useLazyQuery(
    isFirstTime
      ? GraphqlQuery.initPerchasedPackages
      : GraphqlQuery.perchasedPackages,
    {
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    }
  );

  useEffect(() => {
    isMountedRef.current && fetchPerchasedPackages({ variables: { start: 0 } });
    isFirstTime = false;
  }, []);

  useEffect(() => {
    if (isMountedRef.current) {
      data?.perchasedPackages &&
        setPerchasedPackages([...perchasedPackages, ...data.perchasedPackages]);

      data?.totalPerchasedPackages &&
        setTotalPerchasedPackages(data.totalPerchasedPackages);
    }
  }, [data]);

  // key extractors
  const keyExtractor = useCallback((item) => item.id.toString(), []);

  //loadMore UserPackages
  const loadMoreUserPackages = () => {
    console.log("totalPerchasedPackages: ", totalPerchasedPackages);
    loading === false &&
      totalPerchasedPackages > perchasedPackages.length &&
      fetchPerchasedPackages({
        variables: { start: perchasedPackages.length },
      });
  };

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator style={styles.loading} animating={true} />}

      <FlatList
        style={styles.listDesign}
        data={perchasedPackages}
        keyExtractor={keyExtractor}
        onEndReached={() => loadMoreUserPackages()}
        renderItem={({ item }) => {
          const curDate = new Date().getTime();
          const expDate = new Date(item.expiryDate).getTime();
          return (
            <View
              style={{
                flexDirection: "row",
                marginTop: 10,
                paddingBottom: 10,
                borderBottomWidth: 1,
                borderColor: Color.borderColor,
              }}
            >
              <FastImage
                source={{ uri: item?.package?.image?.url }}
                resizeMode="contain"
                style={{
                  width: 70,
                  height: 70,
                  justifyContent: "center",
                  alignItems: "center",
                  marginLeft: 15,
                }}
              />

              <View
                style={{
                  flex: 1,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>{`${Common.getTranslation(LangKey.txtDesignCredit)}: ${
                  item.startDesignCredit
                }`}</Text>
                <Text>{`${Common.getTranslation(LangKey.txtRemainingCredit)}: ${
                  item.currentDesignCredit
                }`}</Text>
                <Text>{`${Common.getTranslation(
                  LangKey.txtPerchsedAt
                )}: ${Common.convertIsoToDate(item.purchaseDate)}`}</Text>
                <Text>{`${Common.getTranslation(
                  LangKey.txtExpiredAt
                )}: ${Common.convertIsoToDate(item.expiryDate)}`}</Text>
              </View>

              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  paddingHorizontal: 10,
                }}
              >
                <Text style={styles.txtPrice}>₹</Text>
                <Text style={styles.txtPrice}>{item.price}</Text>
              </View>

              {item?.package?.type === Constant.typeDesignPackagePro && (
                <Text style={styles.tagPro}>{item.package.type}</Text>
              )}

              {curDate > expDate || item.currentDesignCredit <= 0 ? (
                <Text style={styles.txtExpired}>Expired</Text>
              ) : (
                <Text style={styles.txtActive}>Active</Text>
              )}
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    marginTop: 10,
  },
  listDesign: {
    marginTop: 10,
  },
  txtPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: Color.accent,
  },
  tagPro: {
    backgroundColor: Color.tagColor,
    paddingHorizontal: 8,
    marginRight: 5,
    marginTop: 5,
    borderRadius: 5,
    fontSize: 10,
    color: Color.tagTextColor,
    position: "absolute",
    right: 0,
    overflow: "hidden",
  },
  txtExpired: {
    position: "absolute",
    top: 0,
    left: 10,
    paddingHorizontal: 10,
    fontSize: 15,
    fontWeight: "bold",
    backgroundColor: Color.red,
    color: Color.white,
    overflow: "hidden",
    borderRadius: 7,
  },
  txtActive: {
    position: "absolute",
    top: 0,
    left: 10,
    paddingHorizontal: 10,
    fontSize: 15,
    fontWeight: "bold",
    backgroundColor: Color.green,
    color: Color.white,
    overflow: "hidden",
    borderRadius: 7,
  },
});

export default inject("designStore")(observer(UserPackage));
