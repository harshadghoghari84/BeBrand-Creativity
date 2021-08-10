import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { toJS } from "mobx";
import { inject, observer } from "mobx-react";
import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useState } from "react/cjs/react.development";
import Button from "../components/Button";
import Color from "../utils/Color";
import Common from "../utils/Common";
import GraphqlQuery from "../utils/GraphqlQuery";

const MyReward = ({ userStore }) => {
  const user = toJS(userStore.user);
  const [refPkg, setRefPkg] = useState([]);
  const [remPkg, setRemPkg] = useState("");
  const [totPkg, setTotPkg] = useState("");
  const [ind, setInd] = useState(0);
  const [referralPackages, { loading, data, error }] = useLazyQuery(
    GraphqlQuery.referralPackages,
    {
      variables: { start: 0 },
      errorPolicy: "all",
      fetchPolicy: "no-cache",
    }
  );
  const [
    remRefPkg,
    { loading: rmTRefPkgLoad, data: rmTRefPkgData, error: rmTRefPkgError },
  ] = useLazyQuery(GraphqlQuery.totalReferralPackages, {
    variables: { onlyActive: true },
    errorPolicy: "all",
    fetchPolicy: "no-cache",
  });
  const [
    totalRefPkg,
    { loading: TRefPkgLoad, data: TRefPkgData, error: TRefPkgError },
  ] = useLazyQuery(GraphqlQuery.totalReferralPackages, {
    variables: { onlyActive: false },
    errorPolicy: "all",
    fetchPolicy: "no-cache",
  });
  const [activateRefferal, { loading: actvRefLoad }] = useMutation(
    GraphqlQuery.activateRefferal,
    {
      errorPolicy: "all",
      fetchPolicy: "no-cache",
    }
  );
  useEffect(() => {
    referralPackages();
    totalRefPkg();
    remRefPkg();
  }, []);

  useEffect(() => {
    if (rmTRefPkgData && rmTRefPkgData?.totalReferralPackages !== null) {
      setRemPkg(rmTRefPkgData.totalReferralPackages);
    }
    if (rmTRefPkgError && rmTRefPkgError !== null) {
      Common.showMessage(rmTRefPkgError.message);
    }
  }, [rmTRefPkgData, rmTRefPkgError]);
  useEffect(() => {
    if (TRefPkgData && TRefPkgData?.totalReferralPackages !== null) {
      setTotPkg(TRefPkgData.totalReferralPackages);
    }
    if (TRefPkgError && TRefPkgError !== null) {
      Common.showMessage(TRefPkgError.message);
    }
  }, [TRefPkgData, TRefPkgError]);
  useEffect(() => {
    if (data && data?.referralPackages !== null) {
      console.log("data :", data);
      setRefPkg(data.referralPackages);
    }
    if (error && error !== null) {
      console.log("error :", error);
    }
  }, [data, error, refPkg]);
  const Rwards = () => {
    return (
      <View style={{ backgroundColor: Color.white }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            alignSelf: "center",
            backgroundColor: Color.txtInBgColor,
            paddingHorizontal: 20,
            paddingVertical: 5,
            borderRadius: 50,
            marginVertical: 10,
          }}
        >
          <Image
            source={require("../assets/img/badge.png")}
            style={{ height: 30, width: 30 }}
          />
          <Text style={{ paddingLeft: 10 }}>Total Rewards : {totPkg}</Text>
        </View>
        <View
          style={{
            alignItems: "center",
            alignSelf: "center",
            backgroundColor: Color.txtInBgColor,
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 50,
          }}
        >
          <Text style={{ textAlign: "center" }}>
            Remaining Rewards : {remPkg}
          </Text>
        </View>
      </View>
    );
  };
  const RefPackages = () => {
    return (
      <FlatList
        bounces={false}
        data={refPkg}
        onEndReached={() => {
          if (refPkg.length <= remPkg) {
            referralPackages({ variables: { start: refPkg.length } });
          }
        }}
        contentContainerStyle={{ flex: 1 }}
        renderItem={({ item, index }) => {
          return (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginHorizontal: 10,
              }}
            >
              <View style={[styles.fltContainer]}>
                <Text style={styles.txtlable}>
                  {item?.refUser?.name !== null
                    ? item.refUser.name
                    : item.refUser.mobile}
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.6}
                style={styles.discountView}
                onPress={() => {
                  setInd(index);
                  activateRefferal({
                    variables: { id: item.id },
                  }).then(({ data, errors }) => {
                    if (data && data.activateRefferal !== null) {
                      totalRefPkg();
                      remRefPkg();
                      const newUser = {
                        ...user,
                        designPackage: data.activateRefferal
                          ? data.activateRefferal
                          : user.designPackage,
                      };
                      userStore.setUser(newUser);
                      refPkg.splice(index, 1);
                      setRefPkg(refPkg);
                    }
                    if (errors && errors !== null) {
                      Common.showMessage(errors[0].message);
                      console.log("errors", errors[0].message);
                    }
                  });
                }}
              >
                <Text style={styles.txtdiscount}>
                  {ind == index && actvRefLoad ? (
                    <ActivityIndicator color={Color.white} />
                  ) : (
                    "Activate"
                  )}
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    );
  };
  return (
    <View style={{ flex: 1, backgroundColor: Color.white }}>
      {Rwards()}
      {RefPackages()}

      <Button
        normal={true}
        onPress={() => Common.onShare(user?.refCode && user.refCode)}
      >
        Invite friends
      </Button>
      <SafeAreaView
        style={{
          flex: 0,
          backgroundColor: Color.white,
        }}
      />
    </View>
  );
};
export default inject("userStore")(observer(MyReward));

const styles = StyleSheet.create({
  fltContainer: {
    marginTop: 10,
    marginBottom: 5,
    borderRadius: 50,
    justifyContent: "center",
    backgroundColor: Color.txtInBgColor,
    width: "75%",
    paddingVertical: 8,
  },
  discountView: {
    marginTop: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: Color.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
  innerfitContainer: {
    marginVertical: 5,
    marginLeft: 10,
  },
  descContainer: {
    // marginTop: 5,
  },
  txtlable: {
    fontSize: 16,
    color: Color.darkBlue,
    marginLeft: 20,
  },
  txtdiscount: {
    color: Color.white,
    fontSize: 15,
  },
});
