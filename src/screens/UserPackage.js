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
import ProgressDialog from "./common/ProgressDialog";
import { SvgUri } from "react-native-svg";
import { format } from "date-fns";

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
    loading === false &&
      totalPerchasedPackages > perchasedPackages.length &&
      fetchPerchasedPackages({
        variables: { start: perchasedPackages.length },
      });
  };

  return (
    <View style={styles.container}>
      {perchasedPackages &&
      perchasedPackages !== null &&
      perchasedPackages.length > 0 ? (
        <FlatList
          contentContainerStyle={styles.listDesign}
          data={perchasedPackages}
          keyExtractor={keyExtractor}
          onEndReached={() => loadMoreUserPackages()}
          renderItem={({ item }) => {
            console.log("item", item);
            const curDate = new Date().getTime();
            const expDate = new Date(item.expiryDate).getTime();
            return (
              <View
                style={{
                  marginTop: 10,
                  marginBottom: 5,
                  borderRadius: 15,
                  backgroundColor: Color.white,
                  marginHorizontal: 5,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 1,
                  },
                  shadowOpacity: 0.22,
                  shadowRadius: 2.22,
                  elevation: 3,
                }}
              >
                <View
                  style={{
                    backgroundColor: Color.bgcColor,
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingVertical: 3,
                    borderTopLeftRadius: 15,
                    borderTopRightRadius: 15,
                  }}
                >
                  <Text style={{ paddingLeft: 10 }}>{item.package.name}</Text>
                  {curDate > expDate || item.currentDesignCredit <= 0 ? (
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <View
                        style={{
                          height: 10,
                          width: 10,
                          borderRadius: 5,
                          backgroundColor: Color.red,
                        }}
                      />
                      <Text style={styles.txtExpired}>
                        {Common.getTranslation(LangKey.labExpired)}
                      </Text>
                    </View>
                  ) : (
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <View
                        style={{
                          height: 10,
                          width: 10,
                          borderRadius: 5,
                          backgroundColor: Color.green,
                        }}
                      />
                      <Text style={styles.txtExpired}>
                        {Common.getTranslation(LangKey.labActive)}
                      </Text>
                    </View>
                  )}
                </View>
                <View
                  style={{
                    marginVertical: 15,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View style={{ marginHorizontal: 10 }}>
                    <SvgUri
                      uri={item?.package?.image?.url}
                      width={32}
                      height={32}
                      fill={Color.primary}
                    />
                  </View>
                  <View style={{ width: "80%" }}>
                    <View
                      style={{
                        flexDirection: "row",
                        borderBottomColor: Color.grey,
                        borderBottomWidth: 1,
                        alignItems: "center",
                        justifyContent: "space-around",
                        paddingBottom: 5,
                      }}
                    >
                      <Text
                        style={{ fontSize: 12, color: Color.grey }}
                      >{`${Common.getTranslation(LangKey.txtDesignCredit)} : ${
                        item.startDesignCredit
                      }`}</Text>
                      <Text
                        style={{ fontSize: 12, color: Color.grey }}
                      >{`${Common.getTranslation(
                        LangKey.txtRemainingCredit
                      )} : ${item.currentDesignCredit}`}</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        paddingTop: 5,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {item.package.type === Constant.typeDesignPackageFree ? (
                        <Text style={{ fontSize: 12, color: Color.grey }}>
                          {`${Common.getTranslation(
                            LangKey.txtExpiredAtFree
                          )} ${format(
                            new Date(item.purchaseDate),
                            "dd MMM yyyy"
                          )} To ${format(
                            new Date(item.expiryDate),
                            "dd MMM yyyy"
                          )}`}
                        </Text>
                      ) : (
                        <Text
                          style={{ fontSize: 12, color: Color.grey }}
                        >{`${Common.getTranslation(
                          LangKey.txtExpiredAt
                        )}`}</Text>
                      )}
                    </View>
                  </View>
                </View>

                {/* <View
                  style={{
                    flex: 1,
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "pink",
                  }}
                >
                  <Text style={{ fontSize: 12 }}>{`${Common.getTranslation(
                    LangKey.txtDesignCredit
                  )} ${item.startDesignCredit}`}</Text>
                  <Text style={{ fontSize: 12 }}>{`${Common.getTranslation(
                    LangKey.txtRemainingCredit
                  )} ${item.currentDesignCredit}`}</Text>
                  <Text style={{ fontSize: 12 }}>{`${Common.getTranslation(
                    LangKey.txtPerchsedAt
                  )} ${Common.convertIsoToDate(item.purchaseDate)}`}</Text>
                  {item.package.type === Constant.typeDesignPackageFree ? (
                    <Text style={{ fontSize: 12 }}>{`${Common.getTranslation(
                      LangKey.txtExpiredAtFree
                    )} ${Common.convertIsoToDate(item.expiryDate)}`}</Text>
                  ) : (
                    <Text style={{ fontSize: 12 }}>{`${Common.getTranslation(
                      LangKey.txtExpiredAt
                    )}`}</Text>
                  )}
                </View> */}
                {/* <View>
                  {curDate > expDate || item.currentDesignCredit <= 0 ? (
                    <Text style={styles.txtExpired}>
                      {Common.getTranslation(LangKey.labExpired)}
                    </Text>
                  ) : (
                    <Text style={styles.txtActive}>
                      {Common.getTranslation(LangKey.labActive)}
                    </Text>
                  )}
                  <View
                    style={{
                      minWidth: 80,
                      height: 50,
                      backgroundColor: Color.white,
                      flexDirection: "row",
                      alignItems: "center",
                      alignSelf: "center",
                      justifyContent: "center",
                      borderRadius: 10,
                      shadowColor: "#000",
                      shadowOffset: {
                        width: 0,
                        height: 1,
                      },
                      shadowOpacity: 0.22,
                      shadowRadius: 2.22,
                      elevation: 3,
                    }}
                  >
                    <Text style={styles.txtPrice}>₹{item.price}</Text>
                  </View>
                </View> */}

                {/* {item?.package?.type === Constant.typeDesignPackagePro && (
                  <Text style={styles.tagPro}>{item.package.type}</Text>
                )} */}
              </View>
            );
          }}
        />
      ) : (
        <>
          {loading ? (
            <ProgressDialog
              visible={loading}
              dismissable={false}
              message={Common.getTranslation(LangKey.labLoading)}
            />
          ) : (
            <View style={styles.containerNoDesign}>
              <Text>{Common.getTranslation(LangKey.labNoPkgAvailable)}</Text>
            </View>
          )}
        </>
      )}
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
    marginHorizontal: 10,
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
    paddingHorizontal: 10,
    fontSize: 15,
    fontWeight: "bold",
    color: Color.txtIntxtcolor,
  },
  txtActive: {
    paddingHorizontal: 10,
    fontSize: 15,
    fontWeight: "bold",
    color: Color.txtIntxtcolor,
  },
  containerNoDesign: {
    flex: 1,
    backgroundColor: Color.white,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default inject("designStore")(observer(UserPackage));
