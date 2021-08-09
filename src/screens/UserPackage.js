import React, { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View, SafeAreaView } from "react-native";
import { useLazyQuery } from "@apollo/client";
import { inject, observer } from "mobx-react";
import FastImage from "react-native-fast-image";
import { SvgUri } from "react-native-svg";
import { format } from "date-fns";
// relative path
import GraphqlQuery from "../utils/GraphqlQuery";
import Common from "../utils/Common";
import Constant from "../utils/Constant";
import Color from "../utils/Color";
import LangKey from "../utils/LangKey";
import ProgressDialog from "./common/ProgressDialog";

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
      data?.perchasedPackagesV2 &&
        setPerchasedPackages([
          ...perchasedPackages,
          ...data.perchasedPackagesV2,
        ]);

      data?.totalPerchasedPackages &&
        setTotalPerchasedPackages(data.totalPerchasedPackages);
    }
  }, [data]);
  useEffect(() => {
    console.log("perchasedPackages", perchasedPackages);
  }, [perchasedPackages]);

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
    <SafeAreaView style={styles.container}>
      {perchasedPackages &&
      perchasedPackages !== null &&
      perchasedPackages.length > 0 ? (
        <FlatList
          contentContainerStyle={styles.listDesign}
          data={perchasedPackages}
          keyExtractor={keyExtractor}
          onEndReached={() => loadMoreUserPackages()}
          renderItem={({ item }) => {
            const currantDate = new Date().getTime();
            const curDate = new Date();
            curDate.setDate(curDate.getDate() + 365 * 10);
            const chkDate = curDate.getTime();
            const expDate = new Date(item.expiryDate).getTime();
            return (
              <View
                style={{
                  marginTop: 10,
                  marginBottom: 5,
                  borderRadius: 13,
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
                    borderTopLeftRadius: 13,
                    borderTopRightRadius: 13,
                  }}
                >
                  <Text style={{ paddingLeft: 10 }}>{item.package.name}</Text>
                  {currantDate > expDate || item.currentDesignCredit <= 0 ? (
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
                            "dd/MM/yyyy"
                          )} to ${format(
                            new Date(item.expiryDate),
                            "dd/MM/yyyy"
                          )}`}
                        </Text>
                      ) : (
                        <Text style={{ fontSize: 12, color: Color.grey }}>
                          {chkDate > expDate
                            ? `Validity : ${format(
                                new Date(item.expiryDate),
                                "dd/MM/yyyy"
                              )}`
                            : `${Common.getTranslation(LangKey.txtExpiredAt)}`}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
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
              <FastImage
                source={require("../assets/img/NotAvailable.png")}
                style={{ height: "80%", width: "80%" }}
                resizeMode={FastImage.resizeMode.contain}
              />
              {/* <Text>{Common.getTranslation(LangKey.labNoPkgAvailable)}</Text> */}
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  loading: {
    marginTop: 10,
  },
  listDesign: {
    paddingTop: 10,
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
