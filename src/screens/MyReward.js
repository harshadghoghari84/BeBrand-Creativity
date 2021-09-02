import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { toJS } from "mobx";
import { inject, observer } from "mobx-react";
import React, { useEffect, useState } from "react";
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
import Button from "../components/Button";
import Color from "../utils/Color";
import Common from "../utils/Common";
import GraphqlQuery from "../utils/GraphqlQuery";
import LangKey from "../utils/LangKey";
import ProgressDialog from "./common/ProgressDialog";

const MyReward = ({ userStore }) => {
  const user = toJS(userStore.user);
  const [refPkg, setRefPkg] = useState([]);
  const [remPkg, setRemPkg] = useState(0);
  const [totPkg, setTotPkg] = useState(0);
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
      console.log(
        "rmTRefPkgData.totalReferralPackages",
        rmTRefPkgData.totalReferralPackages
      );
      setRemPkg(rmTRefPkgData.totalReferralPackages);
    }
    if (rmTRefPkgError && rmTRefPkgError !== null) {
      console.log("rmTRefPkgError :", rmTRefPkgError);
    }
  }, [rmTRefPkgData, rmTRefPkgError]);
  useEffect(() => {
    if (TRefPkgData && TRefPkgData?.totalReferralPackages !== null) {
      console.log(
        "TRefPkgData.totalReferralPackages",
        TRefPkgData.totalReferralPackages
      );
      setTotPkg(TRefPkgData.totalReferralPackages);
    }
    if (TRefPkgError && TRefPkgError !== null) {
      console.log("TRefPkgError :", TRefPkgError);
    }
  }, [TRefPkgData, TRefPkgError]);
  useEffect(() => {
    if (data && data?.referralPackages !== null) {
      console.log("data :", data);
      setRefPkg(data.referralPackages);
    }
    if (error && error !== null) {
      // Common.showMessage(error);
      console.log("error :", error);
    }
  }, [data, error, refPkg]);
  const Rwards = () => {
    return (
      <View
        style={{
          backgroundColor: Color.white,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            // backgroundColor: Color.txtInBgColor,
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 50,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* <Image
            source={require("../assets/img/badge.png")}
            style={{ height: 30, width: 30 }}
          /> */}
          <Text style={{ paddingLeft: 10 }}>Total Rewards</Text>
          {TRefPkgLoad ? (
            <ActivityIndicator color={Color.primary} />
          ) : (
            <Text style={{ paddingLeft: 10 }}>{totPkg}</Text>
          )}
        </View>
        <View
          style={{ height: 35, width: 1, backgroundColor: Color.blackTrans }}
        />
        <View
          style={{
            // backgroundColor: Color.txtInBgColor,
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 50,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{}}>Remaining Rewards</Text>
          {rmTRefPkgLoad ? (
            <ActivityIndicator color={Color.primary} />
          ) : (
            <Text style={{}}>{remPkg}</Text>
          )}
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
          if (refPkg.length < remPkg) {
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
      <ProgressDialog
        visible={loading}
        dismissable={false}
        message={Common.getTranslation(LangKey.labLoading)}
      />
      {Rwards()}
      <View style={{ height: 0.3, backgroundColor: Color.blackTrans }} />
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
