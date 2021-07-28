import React, { useCallback, useEffect, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, View } from "react-native";
import { useLazyQuery } from "@apollo/client";
import { inject, observer } from "mobx-react";
import { toJS } from "mobx";
import { StackActions } from "@react-navigation/native";
import { AdMobInterstitial } from "expo-ads-admob";
import { InterstitialAdManager, AdSettings } from "react-native-fbads";
import { format } from "date-fns";

// relative path
import GraphqlQuery from "../utils/GraphqlQuery";
import ItemDesign from "./common/ItemDesign";
import Common from "../utils/Common";
import Constant from "../utils/Constant";
import ProgressDialog from "./common/ProgressDialog";
import LangKey from "../utils/LangKey";
import Color from "../utils/Color";
import FastImage from "react-native-fast-image";
import PopUp from "../components/PopUp";

let adCounter = 0;

const UserDesign = ({ navigation, designStore, userStore }) => {
  const [hasPro, sethasPro] = useState(false);
  const designPackages = toJS(designStore.designPackages);

  const isMountedRef = Common.useIsMountedRef();

  const [modalVisible, setmodalVisible] = useState(false);
  const toggleVisible = () => {
    setmodalVisible(!modalVisible);
  };
  const [perchasedDesigns, { loading, data, error }] = useLazyQuery(
    GraphqlQuery.perchasedDesigns,
    {
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    }
  );

  useEffect(() => {
    isMountedRef.current && perchasedDesigns({ variables: { start: 0 } });
  }, []);
  const googleAdListners = async () => {
    // AdMobInterstitial.setTestDevices([AdMobInterstitial.simulatorId]);

    AdMobInterstitial.setAdUnitID(Constant.interstitialAdunitId);
    // AdMobInterstitial.addEventListener("interstitialDidLoad", () =>
    //   console.log("AdMobInterstitial adLoaded")
    // );
    // AdMobInterstitial.addEventListener("interstitialDidFailToLoad", (error) =>
    //   console.log("adFailedToLoad err", error)
    // );
    // AdMobInterstitial.addEventListener("interstitialDidOpen", () =>
    //   console.log("AdMobInterstitial => adOpened")
    // );
    AdMobInterstitial.addEventListener("interstitialDidClose", () => {
      console.log("AdMobInterstitial => adClosed");
      AdMobInterstitial.requestAdAsync().catch((error) => console.warn(error));
    });
    // AdMobInterstitial.addEventListener("interstitialWillLeaveApplication", () =>
    //   console.log("AdMobInterstitial => adLeftApplication")
    // );
    AdMobInterstitial.requestAdAsync().catch((error) => console.warn(error));
  };

  useEffect(() => {
    if (isMountedRef.current) {
      googleAdListners();
      return () => {
        AdMobInterstitial.removeAllListeners();
      };
    }
  }, []);

  useEffect(() => {
    fbAd();
    return () => {
      AdSettings.clearTestDevices();
    };
  }, []);

  const fbAd = async () => {
    // AdSettings.setLogLevel("debug");
    // console.log("AdSettings.currentDeviceHash", AdSettings.currentDeviceHash);
    // AdSettings.addTestDevice(AdSettings.currentDeviceHash);
    const requestedStatus = await AdSettings.requestTrackingPermission();
    console.log(requestedStatus);
    if (requestedStatus === "authorized" || requestedStatus === "unavailable") {
      AdSettings.setAdvertiserIDCollectionEnabled(true);

      // Both calls are not related to each other
      // FB won’t deliver any ads if this is set to false or not called at all.
      AdSettings.setAdvertiserTrackingEnabled(true);
    }
  };

  const fbShowAd = async () => {
    InterstitialAdManager.showAd(Constant.InterstitialAdPlacementId)
      .then((res) => {
        console.log("res", res);
        setAdReady(true),
          AdMobInterstitial.requestAdAsync().catch((error) =>
            console.warn(error)
          );
      })
      .catch((err) => {
        console.log(err);
        setAdReady(true),
          AdMobInterstitial.requestAdAsync().catch((error) =>
            console.warn(error)
          );
      });
  };

  useEffect(() => {
    isMountedRef.current && sethasPro(userStore.hasPro);
  }, [userStore.hasPro]);

  // key extractors
  const keyExtractor = useCallback((item) => item.id.toString(), []);

  const showAd = async () => {
    if (hasPro === false) {
      AdMobInterstitial.showAdAsync().catch((error) => fbShowAd());
    }
  };

  const onDesignClick = (packageType, design, desIndex) => {
    if (packageType === Constant.typeDesignPackageFree) {
      showAd();
      // setmodalVisible(true);
    }
    const designs = data?.perchasedDesigns.map((item) => {
      return item.design;
    });

    navigation.dispatch(
      StackActions.replace(Constant.navDesign, {
        designs: designs,
        curDesign: design,
        curItemIndex: desIndex,
      })
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <PopUp
        visible={modalVisible}
        toggleVisible={toggleVisible}
        isPurchased={true}
      />
      {data?.perchasedDesigns && data?.perchasedDesigns.length > 0 ? (
        <FlatList
          style={styles.listDesign}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          data={data?.perchasedDesigns ? data.perchasedDesigns : []}
          keyExtractor={keyExtractor}
          renderItem={({ item, index }) => {
            const designPackage = designPackages.find(
              (pkg) => pkg.id === item.design.package
            );

            const formatDate = format(
              new Date(item.purchaseDate),
              "dd-MM-yyyy"
            );
            return (
              <ItemDesign
                design={item.design}
                desIndex={index}
                packageType={designPackage.type}
                onDesignClick={onDesignClick}
                designDate={formatDate}
              />
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
              {/* <Text>{Common.getTranslation(LangKey.labNoDesignAvailable)}</Text> */}
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
  listDesign: {
    paddingTop: 10,
  },
  containerNoDesign: {
    flex: 1,
    backgroundColor: Color.white,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default inject("designStore", "userStore")(observer(UserDesign));
