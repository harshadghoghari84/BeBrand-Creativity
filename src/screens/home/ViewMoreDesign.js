import AsyncStorage from "@react-native-async-storage/async-storage";
import { toJS } from "mobx";
import { inject, observer } from "mobx-react";
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
} from "react-native";
import { AdMobInterstitial } from "expo-ads-admob";
import { InterstitialAdManager, AdSettings } from "react-native-fbads";
import FastImage from "react-native-fast-image";
import Color from "../../utils/Color";
import Common from "../../utils/Common";
import Constant from "../../utils/Constant";
import LangKey from "../../utils/LangKey";
import ItemDesign from "../common/ItemDesign";
let impression = [];
let adCounter = 0;

const ViewMoreDesign = ({ navigation, route, designStore, userStore }) => {
  const { usubCat, designs, curItemIndex, activeCat, curCatId } = route.params;
  const designPackages = toJS(designStore.designPackages);
  const isMountedRef = Common.useIsMountedRef();
  const user = toJS(userStore.user);
  const [userSubCategoriesAfter, setUserSubCategoriesAfter] = useState([]);
  const [userOtherSubCategoryes, setUserOtherSubCategoryes] = useState([]);
  const [userSubCategories, setUserSubCategories] = useState([]);
  const [dess, setDess] = useState([]);
  const [hasPro, sethasPro] = useState(false);

  useEffect(() => {
    if (
      userSubCategories &&
      userSubCategories !== null &&
      userSubCategories.length > 0
    ) {
      const index = userSubCategories.findIndex((item) => item.id === curCatId);
      setDess(userSubCategories[index]?.designs);
    }
  }, [userSubCategories]);

  useEffect(() => {
    if (isMountedRef.current) {
      let afterCategory = toJS(designStore.userSubCategoriesAfter);

      let onlyDesignArr = [];

      if (userSubCategoriesAfter.length <= afterCategory.length) {
        afterCategory.forEach((ele) => {
          if (ele.designs.length > 0 && ele.totalDesign > 0) {
            onlyDesignArr.push(ele);
          }
        });

        setUserSubCategoriesAfter(onlyDesignArr);
      }
    }
  }, [designStore.userSubCategoriesAfter]);

  useEffect(() => {
    if (isMountedRef.current) {
      const otherSubCatagory = toJS(designStore.userOtherSubCategories);
      console.log("otherSubCatagory", otherSubCatagory);
      let onlyDesignArr = [];
      otherSubCatagory.forEach((ele) => {
        if (ele.designs.length > 0 && ele.totalDesign > 0) {
          onlyDesignArr.push(ele);
        }
      });

      setUserOtherSubCategoryes(onlyDesignArr);
    }
  }, [designStore.userOtherSubCategories]);

  useEffect(() => {
    if (isMountedRef.current) {
      if (activeCat !== "Quotes") {
        setUserSubCategories([
          // ...userSubCategoriesBefore,
          ...userSubCategoriesAfter,
        ]);
      } else {
        setUserSubCategories(userOtherSubCategoryes);
      }
    }
  }, [userSubCategoriesAfter, userOtherSubCategoryes]);

  useEffect(() => {
    if (isMountedRef.current) {
      const hasPro = toJS(userStore.hasPro);
      sethasPro(hasPro);
    }
  }, [userStore.hasPro]);
  useEffect(() => {
    if (
      impression !== null &&
      Array.isArray(impression) &&
      impression.length > 0
    ) {
      AsyncStorage.setItem(Constant.prfImpression, JSON.stringify(impression))
        .then((res) => {})
        .catch((err) => {});
    }
  }, [impression]);
  const keyExtractor = useCallback((item) => item.id.toString(), []);

  const loadMoreDesigns = async (subCategoryId) => {
    const index = usubCat.findIndex((item) => item.id === subCategoryId);
    const subCategory = usubCat[index];
    const designLen = subCategory.designs.length;

    if (activeCat === "Quotes") {
      const type = Constant.topCatQuotes;
      subCategory.totalDesign > designLen &&
        (await designStore.loaduserDesigns(
          subCategory.id,
          designLen,
          type,
          hasPro
        ));
    } else {
      const type = Constant.userSubCategoryTypeAfter;
      // index < userSubCategoriesBefore.length
      //   ? Constant.userSubCategoryTypeBefore
      //   : Constant.userSubCategoryTypeAfter;

      subCategory.totalDesign > designLen &&
        (await designStore.loaduserDesigns(
          subCategory.id,
          designLen,
          type,
          hasPro
        ));
    }
  };
  const showAd = () => {
    console.log("adCounter", adCounter);

    if (hasPro === false && adCounter && adCounter >= Constant.addCounter) {
      AdMobInterstitial.showAdAsync().catch((error) => {
        Platform.OS === "android" ? fbShowAd() : null;
      });
      adCounter = 0;
    }
  };
  useEffect(() => {
    if (isMountedRef.current) {
      adsInterstitialListner();
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

  const adsInterstitialListner = () => {
    // AdMobInterstitial.setTestDevices([AdMobInterstitial.simulatorId]);

    AdMobInterstitial.setAdUnitID(Constant.interstitialAdunitId);
    AdMobInterstitial.addEventListener("interstitialDidLoad", () =>
      console.log("AdMobInterstitial adLoaded")
    );
    AdMobInterstitial.addEventListener("interstitialDidFailToLoad", (error) =>
      console.log("adFailedToLoad err", error)
    );
    AdMobInterstitial.addEventListener("interstitialDidOpen", () =>
      console.log("AdMobInterstitial => adOpened")
    );
    AdMobInterstitial.addEventListener("interstitialDidClose", () => {
      console.log("AdMobInterstitial => adClosed");
      AdMobInterstitial.requestAdAsync().catch((error) => console.warn(error));
    });
    // AdMobInterstitial.addEventListener("interstitialWillLeaveApplication", () =>
    //   console.log("AdMobInterstitial => adLeftApplication")
    // );
    AdMobInterstitial.requestAdAsync().catch((error) => console.warn(error));
  };

  const fbAd = async () => {
    AdSettings.setLogLevel("debug");

    AdSettings.addTestDevice(AdSettings.currentDeviceHash);
    const requestedStatus = await AdSettings.requestTrackingPermission();
    console.log(requestedStatus);
    if (requestedStatus === "authorized" || requestedStatus === "unavailable") {
      AdSettings.setAdvertiserIDCollectionEnabled(true);

      // Both calls are not related to each other
      // FB won’t deliver any ads if this is set to false or not called at all.
      AdSettings.setAdvertiserTrackingEnabled(true);
    }
  };

  const fbShowAd = () => {
    InterstitialAdManager.showAd(Constant.InterstitialAdPlacementId)
      .then((res) => {
        console.log("res", res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onDesignClick = async (packageType, design, desIndex) => {
    hasPro === false && adCounter++;
    showAd();
    // if (packageType === Constant.typeDesignPackageFree) {
    //   // setmodalVisible(true);
    // }

    navigation.navigate(Constant.navDesign, {
      designs: dess,
      curDesign: design,
      curPackageType: packageType,
      curItemIndex: desIndex,
    });
  };
  const onViewRef = React.useRef(({ viewableItems }) => {
    viewableItems.forEach((ele) => {
      if (!impression.includes(ele.item.id)) {
        if (user && user !== null) {
          impression = [...impression, ele.item.id];
        }
      }
    });

    // Use viewable items in state or as intended
  });
  const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 50 });
  return (
    <SafeAreaView style={styles.containerDesignList}>
      {/* {designs &&
      curItemIndex !== undefined &&
      designs.totalDesign > 0 &&
      designs.length > 0 ? ( */}
      <>
        <FlatList
          key={2}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listSubCategoryDesign}
          onViewableItemsChanged={onViewRef.current}
          viewabilityConfig={viewConfigRef.current}
          data={dess}
          keyExtractor={keyExtractor}
          legacyImplementation={false}
          maxToRenderPerBatch={6}
          windowSize={10}
          bounces={false}
          scrollEventThrottle={16}
          onEndReached={() => {
            console.log("called", curCatId);
            !designStore.udLoading && loadMoreDesigns(curCatId);
          }}
          renderItem={({ item: design, index: desIndex }) => {
            const designPackage = designPackages.find(
              (item) => item.id === design.package
            );
            return (
              <ItemDesign
                design={design}
                packageType={designPackage.type}
                desIndex={desIndex}
                onDesignClick={onDesignClick}
              />
            );
          }}
        />
        {designStore.udLoading ? (
          <View
            style={{
              flex: 1,
              alignItems: "center",
            }}
          >
            <ActivityIndicator size={25} color={Color.primary} />
            <Text style={{ color: Color.txtIntxtcolor, fontSize: 22 }}>
              {Common.getTranslation(LangKey.labLoading)}
            </Text>
          </View>
        ) : null}
      </>
      {/* ) : (
        <View style={styles.containerNoDesign}>
          {designStore.udLoading ? (
            <>
              <ActivityIndicator size={25} color={Color.primary} />
              <Text style={{ color: Color.txtIntxtcolor, fontSize: 22 }}>
                {Common.getTranslation(LangKey.labLoading)}
              </Text>
            </>
          ) : (
            <FastImage
              source={require("../../assets/img/soon.png")}
              style={{ height: "80%", width: "80%" }}
              resizeMode={FastImage.resizeMode.contain}
            />
            // <SvgCss xml={SvgConstant.noContent} width="100%" height="100%" />
            // <Text>{Common.getTranslation(LangKey.labNoDesignAvailable)}</Text>
          )}
        </View>
      )} */}
    </SafeAreaView>
  );
};

export default inject("designStore", "userStore")(observer(ViewMoreDesign));

const styles = StyleSheet.create({
  listSubCategoryDesign: {
    backgroundColor: Color.white,
    flexGrow: 1,
    paddingTop: 10,
  },
  containerDesignList: {
    flex: 1,
    backgroundColor: Color.white,
  },
  containerNoDesign: {
    flex: 1,
    backgroundColor: Color.white,

    justifyContent: "center",
    alignItems: "center",
  },
});
