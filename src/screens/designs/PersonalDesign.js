import { toJS } from "mobx";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ToastAndroid,
  Platform,
  FlatList,
  ScrollView,
  TouchableOpacity,
  PixelRatio,
} from "react-native";

import ViewShot from "react-native-view-shot";
import { SvgCss } from "react-native-svg";
import { inject, observer } from "mobx-react";
import * as MediaLibrary from "expo-media-library";
import * as Permissions from "expo-permissions";
import * as Sharing from "expo-sharing";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { useMutation } from "@apollo/client";
import FastImage from "react-native-fast-image";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ICON from "react-native-vector-icons/MaterialCommunityIcons";
import BottomSheet from "reanimated-bottom-sheet";
import Animated from "react-native-reanimated";
import { AdMobRewarded, AdMobInterstitial } from "expo-ads-admob";
import { InterstitialAdManager, AdSettings } from "react-native-fbads";
import { Pagination } from "react-native-snap-carousel";

// relative path
import Icon from "../../components/svgIcons";
import Color from "../../utils/Color";
import Common from "../../utils/Common";
import Constant from "../../utils/Constant";
import Button from "../../components/Button";
import LangKey from "../../utils/LangKey";
import GraphqlQuery from "../../utils/GraphqlQuery";
import PopUp from "../../components/PopUp";
import SvgConstant from "../../utils/SvgConstant";
import MuktaText from "../../components/MuktaText";

const { width, height } = Dimensions.get("window");

let isShareClick = false;
let msg = "";
let adAvilable = false;
let adCounter = 0;
let setCurLayout = {};
let firstTime = true;

const PersonalDesign = ({ route, designStore, userStore, navigation }) => {
  const isMountedRef = Common.useIsMountedRef();
  const designPackages = toJS(designStore.designPackages);

  const user = toJS(userStore.user);
  const {
    designs: designsArr,
    curDesign,
    curScreen,
    curPackageType,
    curItemIndex,
  } = route.params;
  const allLayouts = toJS(designStore.designLayouts);
  const viewRef = useRef(null);

  const pixels = Common.getPixels(Constant.designPixel);
  /*
  ..######..########....###....########.########
  .##....##....##......##.##......##....##......
  .##..........##.....##...##.....##....##......
  ..######.....##....##.....##....##....######..
  .......##....##....#########....##....##......
  .##....##....##....##.....##....##....##......
  ..######.....##....##.....##....##....########
  */

  const [activeSlide, setActiveSlide] = useState(0);

  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleModalForPkg, setVisibleModalForPkg] = useState(false);
  const [visibleFreeModal, setVisibleFreeModal] = useState(false);
  const [visibleModalMsg, setVisibleModalMsg] = useState(false);
  const [visibleModalAd, setVisibleModalAd] = useState(false);
  const [visiblePicker, setVisiblePicker] = useState(false);
  const [selectedPicker, setSelectedPicker] = useState(false);
  const [hasPro, sethasPro] = useState(false);
  const [designs, setDesigns] = useState([]);
  const [currentDesign, setCurrentDesign] = useState(curDesign);
  const [layouts, setLayouts] = useState([]);
  const [viewableItem, setViewableItem] = useState([]);
  const [currentLayout, setCurrentLayout] = useState(null);
  const [socialIconList, setSocialIconList] = useState(
    Constant.defSocialIconList
  );

  const [Pkgtype, setPkgType] = useState();
  const [adReady, setAdReady] = useState(false);

  const [footerColor, setFooterColor] = useState();
  const [footerTextColor, setFooterTextColor] = useState(Color.black);

  const [userDataPersonal, setUserDataPersonal] = useState();

  const [addUserDesign, { loading }] = useMutation(GraphqlQuery.addUserDesign, {
    errorPolicy: "all",
  });

  const toggleVisible = () => {
    designStore.setIsDownloadStartedPersonal(false);
    setVisibleModal(!visibleModal);
  };

  const toggleVisibleForPkg = () => {
    designStore.setIsDownloadStartedPersonal(false);
    setVisibleModalForPkg(!visibleModalForPkg);
  };
  const toggleFreeVisible = () => {
    setVisibleFreeModal(!visibleFreeModal);
  };

  const toggleVisibleMsg = (val) => {
    if (val === true) {
      let findIndex = layouts.findIndex((ele) => ele.id === setCurLayout.id);
      setActiveSlide(findIndex);
      setCurLayout !== undefined &&
        setCurLayout !== null &&
        setCurrentLayout(setCurLayout);
    }
    setVisibleModalMsg(!visibleModalMsg);
  };

  const toggleVisibleColorPicker = () => {
    return setVisiblePicker(!visiblePicker);
  };

  const toggleVisibleAd = (isDownload) => {
    if (isDownload) {
      setTimeout(() => {
        AdMobRewarded.showAdAsync().catch((error) => {
          fbShowAd();
        });
      }, 1000);
    } else {
      designStore.setIsDownloadStartedPersonal(false);
    }
    setVisibleModalAd(!visibleModalAd);
  };

  const scrollTodesign = () => {
    designRef.current.scrollToIndex({
      animated: true,
      index: curItemIndex && curItemIndex,
    });
  };

  const getItemLayoutsCategory = useCallback(
    (data, index) => ({
      length: 75,
      offset: 85 * index,
      index,
    }),
    []
  );

  const googleAdListners = () => {
    // AdMobRewarded.setTestDevices([AdMobRewarded.simulatorId]);

    AdMobRewarded.setAdUnitID(Constant.rewardAdunitId);

    AdMobRewarded.addEventListener(
      "rewardedVideoUserDidEarnReward",
      (reward) => {
        console.log("AdMobRewarded => rewarded", reward);
        adAvilable = true;
      }
    );
    AdMobRewarded.addEventListener("rewardedVideoDidLoad", () =>
      console.log("AdMobRewarded adLoaded")
    );
    AdMobRewarded.addEventListener("rewardedVideoDidFailToLoad", (error) =>
      console.log("AdFailedToLoad", error)
    );
    AdMobRewarded.addEventListener("rewardedVideoDidPresent", () =>
      console.log("AdMobRewarded => adOpened")
    );
    AdMobRewarded.addEventListener("rewardedVideoDidFailToPresent", () =>
      console.log("AdMobRewarded => FailToPresent")
    );
    AdMobRewarded.addEventListener("rewardedVideoDidDismiss", () => {
      console.log("AdMobRewarded => adClosed");
      console.log("adAvilable", adAvilable);
      if (adAvilable) {
        setAdReady(true);
      } else {
        designStore.setIsDownloadStartedPersonal(false);
      }
      AdMobRewarded.requestAdAsync().catch((error) => console.warn(error));
    });

    AdMobRewarded.requestAdAsync().catch((error) => console.warn(error));
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
    if (
      viewableItem !== null &&
      Array.isArray(viewableItem) &&
      viewableItem.length > 0
    ) {
      AsyncStorage.setItem(
        Constant.prfViewDesigns,
        JSON.stringify(viewableItem)
      );
    }
  }, [viewableItem]);

  const adsInterstitialListner = () => {
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
    // AdMobInterstitial.addEventListener(
    //   "interstitialWillLeaveApplication",
    //   () => console.log("AdMobInterstitial => adLeftApplication")
    // );
    AdMobInterstitial.requestAdAsync().catch((error) => console.warn(error));
  };

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

  const fbShowAd = () => {
    InterstitialAdManager.showAd(Constant.InterstitialAdPlacementIdVideo)
      .then((res) => {
        setAdReady(true),
          AdMobRewarded.requestAdAsync().catch((error) => console.warn(error));
      })
      .catch((err) => {
        console.log(err);
        setAdReady(true),
          AdMobRewarded.requestAdAsync().catch((error) => console.warn(error));
      });
  };

  const showAd = () => {
    if (hasPro === false && adCounter && adCounter >= Constant.addCounter) {
      AdMobInterstitial.showAdAsync().catch((error) => fbShowAd());
      adCounter = 0;
    }
  };

  useEffect(() => {
    if (isMountedRef.current) {
      setPkgType(curPackageType);
    }
  }, []);
  useEffect(() => {
    googleAdListners();
    return () => {
      AdMobRewarded.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    fbAd();
    return () => {
      AdSettings.clearTestDevices();
    };
  }, []);

  useEffect(() => {
    if (adReady) {
      setAdReady(false);
      adAvilable = false;
      if (designStore.isDownloadStartedPersonal === true) {
        onClickDownload();
      }
    }
  }, [adReady]);

  useEffect(() => {
    const isDownloadStartedPersonal = toJS(
      designStore.isDownloadStartedPersonal
    );

    if (isDownloadStartedPersonal && isDownloadStartedPersonal === true) {
      if (hasPro === true) {
        onClickDownload();
      } else {
        if (Pkgtype === Constant.typeDesignPackageVip) {
          setVisibleModal(true);
        } else {
          setVisibleModalAd(true);
        }
        //AdMobRewarded.showAd().catch((error) => console.warn(error));
      }
    }
  }, [designStore.isDownloadStartedPersonal]);

  useEffect(() => {
    AsyncStorage.getItem(Constant.prfIcons)
      .then((res) => {
        if (res && res !== null) {
          setSocialIconList(JSON.parse(res));
        }
      })
      .catch((err) => console.log("async err", err));
  }, []);

  useEffect(() => {
    if (isMountedRef.current) {
      onReset();
    }
  }, [currentDesign]);

  useEffect(() => {
    if (isMountedRef.current) {
      let filterArr = [];
      filterArr = designsArr.filter(
        (ele) =>
          ele.designType !== null &&
          (ele.designType === Constant.designTypePERSONAL ||
            ele.designType === Constant.designTypeALL)
      );
      setDesigns(filterArr);
    }
  }, []);

  useEffect(() => {
    isMountedRef.current && sethasPro(userStore.hasPro);
  }, [userStore.hasPro]);

  useEffect(() => {
    if (isMountedRef.current) {
      setUserDataPersonal(
        user && user != null
          ? {
              name:
                user?.userInfo?.personal?.name && user.userInfo.personal.name,

              mobile:
                user?.userInfo?.personal?.mobile &&
                user.userInfo.personal.mobile,

              designation:
                user?.userInfo?.personal?.designation &&
                user.userInfo.personal.designation,

              email:
                user?.userInfo?.personal?.email && user.userInfo.personal.email,

              website:
                user?.userInfo?.personal?.website &&
                user.userInfo.personal.website,

              socialMedia:
                user?.userInfo?.personal?.socialMediaId &&
                user.userInfo.personal.socialMediaId,

              image:
                user?.userInfo?.personal?.image.length > 0
                  ? user?.userInfo?.personal?.image.find(
                      (item) => item.isDefault === true
                    ).url
                  : null,
            }
          : Constant.dummyUserData[0]
      );
    }
  }, [userStore.user]);

  useEffect(() => {
    fiilterLayouts();
  }, [userDataPersonal]);

  const fiilterLayouts = () => {
    let filterArr = allLayouts.filter(
      (item) =>
        item.layoutType === Constant.layoutTypePERSONAL ||
        item.layoutType === Constant.layoutTypeALL
    );

    setLayouts(filterArr);
    // checkLayout(filterArr);
  };
  const onReset = () => {
    if (currentDesign?.colorCodes && currentDesign.colorCodes.length > 0) {
      setFooterColor(currentDesign.colorCodes[0].code);
      currentDesign.colorCodes[0].isLight == true
        ? setFooterTextColor(currentDesign.darkTextColor)
        : setFooterTextColor(currentDesign.lightTextColor);
    }
  };

  const onClickDownload = async () => {
    if (user && user !== null) {
      await saveDesign();
      // if (currentLayout && currentLayout !== null) {
      // } else {
      //   designStore.setIsDownloadStartedPersonal(false);
      //   Common.showMessage(Common.getTranslation(LangKey.msgSelectLayout));
      // }
    } else {
      designStore.setIsDownloadStartedPersonal(false);
      Common.showMessage(Common.getTranslation(LangKey.msgCreateAcc));
    }
  };

  const onClickShare = async () => {
    if (user && user !== null) {
      isShareClick = true;
      await saveDesign();
    } else {
      Common.showMessage(Common.getTranslation(LangKey.msgCreateAcc));
    }
  };

  const saveDesign = async () => {
    const { status } = await Permissions.getAsync(Permissions.MEDIA_LIBRARY);

    if (status !== Permissions.PermissionStatus.GRANTED) {
      const { status: newStatus } = await Permissions.askAsync(
        Permissions.MEDIA_LIBRARY
      );
      if (newStatus !== Permissions.PermissionStatus.GRANTED) {
        designStore.setIsDownloadStartedPersonal(false);

        Common.showMessage(
          Common.getTranslation(LangKey.msgCameraRollPermission)
        );
      } else {
        await takeDesignShot();
      }
    } else {
      await takeDesignShot();
    }
  };

  const takeDesignShot = async () => {
    // const currentDesignCreditFree = toJS(userStore.currentFreeDesignCredit);
    const currentDesignCreditPro = toJS(userStore.currentProDesignCredit);

    const designPackage = designPackages.find(
      (pkg) => pkg.id === currentDesign.package
    );

    if (
      designPackage.type !== Constant.typeDesignPackageVip ||
      (designPackage.type === Constant.typeDesignPackageVip &&
        currentDesignCreditPro > 0)
    ) {
      const { data, errors, loading } = await addUserDesign({
        variables: { designId: currentDesign.id },
      });

      if (data !== null && !errors) {
        if (designPackage.type === Constant.typeDesignPackageVip) {
          currentDesignCreditPro > 0 &&
            userStore.updateCurrantDesignCreditPro(currentDesignCreditPro - 1);
        }
      } else if (errors && errors !== null && errors.length > 0) {
        console.log("error", errors[0].extensions.code);
        if (errors[0].extensions.code === Constant.userDesignExits) {
        } else if (errors[0].extensions.code === Constant.userFreeDesignLimit) {
          setVisibleModalForPkg(true);
          return;
        } else if (errors[0].extensions.code === Constant.userFreeDesignCut) {
          userStore.updateCurrantDesignCreditPro(currentDesignCreditPro - 1);
        } else {
          designStore.setIsDownloadStartedPersonal(false);

          Common.showMessage(errors[0].message);
          return;
        }
      }

      const uri = await viewRef.current.capture();

      try {
        const asset = await MediaLibrary.createAssetAsync(uri);

        const album = await MediaLibrary.getAlbumAsync(
          Constant.designAlbumName
        );

        album && album !== null
          ? await MediaLibrary.addAssetsToAlbumAsync(asset, album, false)
          : await MediaLibrary.createAlbumAsync(
              Constant.designAlbumName,
              asset,
              false
            )
              .then((res) => {})
              .catch((err) => {});
      } catch (error) {
        console.log("err", error);
      }

      Common.showMessage(Common.getTranslation(LangKey.msgDesignDownload));
      designStore.setIsDownloadStartedPersonal(false);

      if (isShareClick === true) {
        isShareClick = false;
        await openShareDialogAsync(uri);
      }
    } else {
      designStore.setIsDownloadStartedPersonal(false);

      setVisibleModal(true);
      // setVisibleFreeModal(true);
    }
  };

  let openShareDialogAsync = async (localUri) => {
    if (!(await Sharing.isAvailableAsync())) {
      Common.showMessage(Common.getTranslation(LangKey.msgShareNotAvaillable));
      return;
    }

    let filePath = localUri;
    !localUri.includes("file:///") && (filePath = "file:///" + localUri);

    await Sharing.shareAsync(filePath, {
      mimeType: "image/jpeg", // Android
      dialogTitle: "share-dialog title", // Android and Web
      UTI: "image/jpeg", // iOS
    });
  };

  const plusBTN = () => {
    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={{ paddingRight: 10, fontFamily: "Nunito-Regular" }}>
          {Common.getTranslation(LangKey.LayoutColor)}
        </Text>
        <View
          style={[
            styles.plusButton,
            {
              borderColor: selectedPicker ? Color.primary : null,
              borderWidth: selectedPicker ? 2 : null,
            },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              setVisiblePicker(true);
            }}
            style={{
              backgroundColor: Color.txtIntxtcolor,
              padding: 5,
              borderRadius: 20,
            }}
          >
            <Icon name="plus" fill={Color.white} height={13} width={13} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const checkLayout = (layouts) => {
    if (userDataPersonal) {
      let isSet = false;
      layouts.some((layout) => {
        switch (layout.id) {
          case Constant.personalLay1Id:
            if (
              userDataPersonal.name &&
              userDataPersonal.name !== "" &&
              userDataPersonal.designation &&
              userDataPersonal.designation !== "" &&
              userDataPersonal.website &&
              userDataPersonal.website !== "" &&
              userDataPersonal.email &&
              userDataPersonal.email !== "" &&
              userDataPersonal.mobile &&
              userDataPersonal.mobile !== "" &&
              userDataPersonal.socialMedia &&
              userDataPersonal.socialMedia !== ""
            ) {
              let findInd = layouts.findIndex((ele) => ele.id === layout.id);
              setActiveSlide(findInd);
              setCurrentLayout(layout);
              isSet = true;
              return true;
            }
            break;
          case Constant.personalLay2Id:
            if (
              userDataPersonal.name &&
              userDataPersonal.name !== "" &&
              userDataPersonal.designation &&
              userDataPersonal.designation !== "" &&
              userDataPersonal.socialMedia &&
              userDataPersonal.socialMedia !== "" &&
              userDataPersonal.image &&
              userDataPersonal.image !== "" &&
              userDataPersonal.image.length > 0
            ) {
              let findInd = layouts.findIndex((ele) => ele.id === layout.id);
              setActiveSlide(findInd);
              setCurrentLayout(layout);
              isSet = true;
              return true;
            }
            break;
          case Constant.personalLay3Id:
            if (
              userDataPersonal.name &&
              userDataPersonal.name !== "" &&
              userDataPersonal.designation &&
              userDataPersonal.designation !== "" &&
              userDataPersonal.socialMedia &&
              userDataPersonal.socialMedia !== "" &&
              userDataPersonal.image &&
              userDataPersonal.image !== "" &&
              userDataPersonal.image.length > 0
            ) {
              let findInd = layouts.findIndex((ele) => ele.id === layout.id);
              setActiveSlide(findInd);
              setCurrentLayout(layout);
              isSet = true;
            }
            break;
          case Constant.personalLay4Id:
            if (
              userDataPersonal.name &&
              userDataPersonal.name !== "" &&
              userDataPersonal.designation &&
              userDataPersonal.designation !== "" &&
              userDataPersonal.website &&
              userDataPersonal.website !== "" &&
              userDataPersonal.socialMedia &&
              userDataPersonal.socialMedia !== ""
            ) {
              let findInd = layouts.findIndex((ele) => ele.id === layout.id);
              setActiveSlide(findInd);
              setCurrentLayout(layout);
              isSet = true;
              return true;
            }
            break;
          case Constant.personalLay5Id:
            if (
              userDataPersonal.name &&
              userDataPersonal.name !== "" &&
              userDataPersonal.designation &&
              userDataPersonal.designation !== "" &&
              userDataPersonal.email &&
              userDataPersonal.email !== "" &&
              userDataPersonal.socialMedia &&
              userDataPersonal.socialMedia !== ""
            ) {
              let findInd = layouts.findIndex((ele) => ele.id === layout.id);
              setActiveSlide(findInd);
              setCurrentLayout(layout);
              isSet = true;
              return true;
            }
            break;
          case Constant.personalLay6Id:
            if (
              userDataPersonal.name &&
              userDataPersonal.name !== "" &&
              userDataPersonal.designation &&
              userDataPersonal.designation !== "" &&
              userDataPersonal.mobile &&
              userDataPersonal.mobile !== "" &&
              userDataPersonal.socialMedia &&
              userDataPersonal.socialMedia !== "" &&
              userDataPersonal.image &&
              userDataPersonal.image !== "" &&
              userDataPersonal.image.length > 0
            ) {
              let findInd = layouts.findIndex((ele) => ele.id === layout.id);
              setActiveSlide(findInd);
              setCurrentLayout(layout);
              isSet = true;
              return true;
            }
            break;
          case Constant.personalLay7Id:
            if (
              userDataPersonal.name &&
              userDataPersonal.name !== "" &&
              userDataPersonal.designation &&
              userDataPersonal.designation !== "" &&
              userDataPersonal.mobile &&
              userDataPersonal.mobile !== "" &&
              userDataPersonal.socialMedia &&
              userDataPersonal.socialMedia !== "" &&
              userDataPersonal.image &&
              userDataPersonal.image !== "" &&
              userDataPersonal.image.length > 0
            ) {
              let findInd = layouts.findIndex((ele) => ele.id === layout.id);
              setActiveSlide(findInd);
              setCurrentLayout(layout);
              isSet = true;
              return true;
            }
            break;
          case Constant.personalLay8Id:
            if (
              userDataPersonal.name &&
              userDataPersonal.name !== "" &&
              userDataPersonal.designation &&
              userDataPersonal.designation !== ""
            ) {
              let findInd = layouts.findIndex((ele) => ele.id === layout.id);
              setActiveSlide(findInd);
              setCurrentLayout(layout);
              isSet = true;
              return true;
            }
            break;
          case Constant.personalLay9Id:
            let findInd = layouts.findIndex((ele) => ele.id === layout.id);
            setActiveSlide(findInd);
            setCurrentLayout(layout);
            isSet = true;
            return true;
        }
      });

      if (isSet == false && curScreen === Constant.navPersonalProfile) {
        msg = Common.getTranslation(LangKey.nolayout);
        setVisibleModalMsg(true);
      }
    }
  };
  const checkAndSetLayout = (layout) => {
    console.log("layout", layout);
    switch (layout.id) {
      case Constant.personalLay1Id:
        if (
          !userDataPersonal.name ||
          userDataPersonal.name === "" ||
          !userDataPersonal.designation ||
          userDataPersonal.designation === "" ||
          !userDataPersonal.website ||
          userDataPersonal.website === "" ||
          !userDataPersonal.email ||
          userDataPersonal.email === "" ||
          !userDataPersonal.mobile ||
          userDataPersonal.mobile === "" ||
          !userDataPersonal.socialMedia ||
          userDataPersonal.socialMedia === ""
        ) {
          msg = Common.getTranslation(LangKey.personalLay1Msg);
          setVisibleModalMsg(true);
          setCurLayout = layout;
        } else {
          let findIndex = layouts.findIndex((ele) => ele.id === layout.id);
          setActiveSlide(findIndex);
          setCurrentLayout(layout);
        }
        break;
      case Constant.personalLay2Id:
        if (
          !userDataPersonal.name ||
          userDataPersonal.name === "" ||
          !userDataPersonal.designation ||
          userDataPersonal.designation === "" ||
          !userDataPersonal.socialMedia ||
          userDataPersonal.socialMedia === "" ||
          !userDataPersonal.image ||
          userDataPersonal.image === "" ||
          userDataPersonal.image.length < 0
        ) {
          msg = Common.getTranslation(LangKey.personalLay2Msg);
          setVisibleModalMsg(true);
          setCurLayout = layout;
        } else {
          let findIndex = layouts.findIndex((ele) => ele.id === layout.id);
          setActiveSlide(findIndex);
          setCurrentLayout(layout);
        }
        break;
      case Constant.personalLay3Id:
        if (
          !userDataPersonal.name ||
          userDataPersonal.name === "" ||
          !userDataPersonal.designation ||
          userDataPersonal.designation === "" ||
          !userDataPersonal.socialMedia ||
          userDataPersonal.socialMedia === "" ||
          !userDataPersonal.image ||
          userDataPersonal.image === "" ||
          userDataPersonal.image.length < 0
        ) {
          msg = Common.getTranslation(LangKey.personalLay3Msg);
          setVisibleModalMsg(true);
          setCurLayout = layout;
        } else {
          let findIndex = layouts.findIndex((ele) => ele.id === layout.id);
          setActiveSlide(findIndex);
          setCurrentLayout(layout);
        }
        break;
      case Constant.personalLay4Id:
        if (
          !userDataPersonal.name ||
          userDataPersonal.name === "" ||
          !userDataPersonal.designation ||
          userDataPersonal.designation === "" ||
          !userDataPersonal.website ||
          userDataPersonal.website === "" ||
          !userDataPersonal.socialMedia ||
          userDataPersonal.socialMedia === ""
        ) {
          msg = Common.getTranslation(LangKey.personalLay4Msg);
          setVisibleModalMsg(true);
          setCurLayout = layout;
        } else {
          let findIndex = layouts.findIndex((ele) => ele.id === layout.id);
          setActiveSlide(findIndex);
          setCurrentLayout(layout);
        }
        break;
      case Constant.personalLay5Id:
        if (
          !userDataPersonal.name ||
          userDataPersonal.name === "" ||
          !userDataPersonal.designation ||
          userDataPersonal.designation === "" ||
          !userDataPersonal.email ||
          userDataPersonal.email === "" ||
          !userDataPersonal.socialMedia ||
          userDataPersonal.socialMedia === ""
        ) {
          msg = Common.getTranslation(LangKey.personalLay5Msg);
          setVisibleModalMsg(true);
          setCurLayout = layout;
        } else {
          msg = "";
          let findIndex = layouts.findIndex((ele) => ele.id === layout.id);
          setActiveSlide(findIndex);
          setCurrentLayout(layout);
        }
        break;
      case Constant.personalLay6Id:
        if (
          !userDataPersonal.name ||
          userDataPersonal.name === "" ||
          !userDataPersonal.designation ||
          userDataPersonal.designation === "" ||
          !userDataPersonal.mobile ||
          userDataPersonal.mobile === "" ||
          !userDataPersonal.socialMedia ||
          userDataPersonal.socialMedia === "" ||
          !userDataPersonal.image ||
          userDataPersonal.image === "" ||
          userDataPersonal.image.length < 0
        ) {
          msg = Common.getTranslation(LangKey.personalLay6Msg);
          setVisibleModalMsg(true);
          setCurLayout = layout;
        } else {
          let findIndex = layouts.findIndex((ele) => ele.id === layout.id);
          setActiveSlide(findIndex);
          setCurrentLayout(layout);
        }
        break;
      case Constant.personalLay7Id:
        if (
          !userDataPersonal.name ||
          userDataPersonal.name === "" ||
          !userDataPersonal.designation ||
          userDataPersonal.designation === "" ||
          !userDataPersonal.mobile ||
          userDataPersonal.mobile === "" ||
          !userDataPersonal.socialMedia ||
          userDataPersonal.socialMedia === "" ||
          !userDataPersonal.image ||
          userDataPersonal.image === "" ||
          userDataPersonal.image.length < 0
        ) {
          msg = Common.getTranslation(LangKey.personalLay7Msg);
          setVisibleModalMsg(true);
          setCurLayout = layout;
        } else {
          let findIndex = layouts.findIndex((ele) => ele.id === layout.id);
          setActiveSlide(findIndex);
          setCurrentLayout(layout);
        }
        break;
      case Constant.personalLay8Id:
        if (
          !userDataPersonal.name &&
          userDataPersonal.name === "" &&
          !userDataPersonal.designation &&
          userDataPersonal.designation === ""
        ) {
          msg = Common.getTranslation(LangKey.personalLay8Msg);
          setVisibleModalMsg(true);
          setCurLayout = layout;
        } else {
          let findIndex = layouts.findIndex((ele) => ele.id === layout.id);
          setActiveSlide(findIndex);
          setCurrentLayout(layout);
        }
        break;
      case Constant.personalLay9Id:
        let findIndex = layouts.findIndex((ele) => ele.id === layout.id);
        setActiveSlide(findIndex);
        setCurrentLayout(layout);
        break;
    }
  };

  const getLayout = (curLayId, index) => {
    switch (curLayId) {
      case Constant.personalLay1Id:
        return GetLayout1();
      case Constant.personalLay2Id:
        return GetLayout2();
      case Constant.personalLay3Id:
        return GetLayout3();
      case Constant.personalLay4Id:
        return GetLayout4();
      case Constant.personalLay5Id:
        return GetLayout5();
      case Constant.personalLay6Id:
        return GetLayout6();
      case Constant.personalLay7Id:
        return GetLayout7();
      case Constant.personalLay8Id:
        return GetLayout8();
      case Constant.personalLay9Id:
        return <></>;
    }
  };

  // key extractors
  const keyExtractor = useCallback((item) => item.id.toString(), []);

  /*
  .##..........###....##....##..#######..##.....##.##....##.########..######.
  .##.........##.##....##..##..##.....##.##.....##..##..##.....##....##....##
  .##........##...##....####...##.....##.##.....##...####......##....##......
  .##.......##.....##....##....##.....##.##.....##....##.......##.....######.
  .##.......#########....##....##.....##.##.....##....##.......##..........##
  .##.......##.....##....##....##.....##.##.....##....##.......##....##....##
  .########.##.....##....##.....#######...#######.....##.......##.....######.
  */

  const GetLayout1 = () => (
    <View style={styles.lay1ViewFooter}>
      <SvgCss
        xml={SvgConstant.footerPersonalLayout1}
        width="100%"
        height="100%"
        fill={footerColor}
      />
      <View style={styles.lay1ViewName}>
        {userDataPersonal.name ? (
          <MuktaText style={[styles.lay1TxtName, { color: footerTextColor }]}>
            {userDataPersonal.name}
          </MuktaText>
        ) : null}
        {userDataPersonal.designation ? (
          <MuktaText
            style={[styles.lay1TxtDesignation, { color: footerTextColor }]}
          >
            {userDataPersonal.designation}
          </MuktaText>
        ) : null}
      </View>

      <View style={styles.lay1ViewWebsiteEmail}>
        {userDataPersonal.website ? (
          <View style={styles.layViewIconRoot}>
            <View
              style={[styles.layViewIcon, { backgroundColor: footerTextColor }]}
            >
              <Icon
                name="website"
                height={Constant.layIconHeight}
                width={Constant.layIconWidth}
                fill={footerColor}
              />
            </View>
            <MuktaText style={[styles.layTxtIcon, { color: footerTextColor }]}>
              {userDataPersonal.website}
            </MuktaText>
          </View>
        ) : null}
        {userDataPersonal.email ? (
          <View style={styles.layViewIconRoot}>
            <View
              style={[styles.layViewIcon, { backgroundColor: footerTextColor }]}
            >
              <Icon
                name="email"
                height={Constant.layIconHeight}
                width={Constant.layIconWidth}
                fill={footerColor}
              />
            </View>
            <MuktaText style={[styles.layTxtIcon, { color: footerTextColor }]}>
              {userDataPersonal.email}
            </MuktaText>
          </View>
        ) : null}
      </View>

      <View style={styles.lay1ViewMobile}>
        {userDataPersonal.mobile ? (
          <View style={styles.layViewIconRoot}>
            <View
              style={[styles.layViewIcon, { backgroundColor: footerTextColor }]}
            >
              <Icon
                name="phone"
                height={Constant.layIconHeight}
                width={Constant.layIconWidth}
                fill={footerColor}
              />
            </View>

            <MuktaText style={[styles.layTxtIcon, { color: footerTextColor }]}>
              {userDataPersonal.mobile}
            </MuktaText>
          </View>
        ) : null}
      </View>
      {userDataPersonal.socialMedia ? (
        <View
          style={[
            styles.lay1ViewSocialMedia,
            {
              color: footerTextColor,
            },
          ]}
        >
          {socialIconList &&
            socialIconList.map((item) => (
              <View style={styles.layViewSocialIconRoot}>
                <View
                  style={[
                    styles.layViewIcon,
                    { backgroundColor: footerTextColor },
                  ]}
                >
                  <Icon
                    key={item}
                    name={item}
                    height={Constant.layIconHeight}
                    width={Constant.layIconWidth}
                    fill={footerColor}
                  />
                </View>
              </View>
            ))}
          <MuktaText style={[styles.layTxtIcon, { color: footerTextColor }]}>
            {userDataPersonal.socialMedia}
          </MuktaText>
        </View>
      ) : null}
    </View>
  );

  const GetLayout2 = () => (
    <View style={styles.lay2ViewFooter}>
      <SvgCss
        xml={SvgConstant.footerPersonalLayout2}
        width="100%"
        height="100%"
        fill={footerColor}
      />
      {userDataPersonal.image ? (
        <FastImage
          onLoadStart={() => designStore.setIsPersonalDesignLoad(true)}
          onLoadEnd={() => designStore.setIsPersonalDesignLoad(false)}
          source={{ uri: userDataPersonal.image }}
          style={styles.lay2ImgUser}
          resizeMode={FastImage.resizeMode.contain}
        />
      ) : null}
      {userDataPersonal.name ? (
        <MuktaText style={[styles.lay2TxtName, { color: footerTextColor }]}>
          {userDataPersonal.name}
        </MuktaText>
      ) : null}
      {userDataPersonal.designation ? (
        <MuktaText
          style={[styles.lay2TxtDesignation, { color: footerTextColor }]}
        >
          {userDataPersonal.designation}
        </MuktaText>
      ) : null}
      {userDataPersonal.socialMedia ? (
        <View
          style={[
            styles.lay2ViewSocialMedia,
            {
              color: footerTextColor,
            },
          ]}
        >
          {socialIconList &&
            socialIconList.map((item) => (
              <View style={styles.layViewSocialIconRoot}>
                <View
                  style={[
                    styles.layViewIcon,
                    { backgroundColor: footerTextColor },
                  ]}
                >
                  <Icon
                    key={item}
                    name={item}
                    height={Constant.layIconHeight}
                    width={Constant.layIconWidth}
                    fill={footerColor}
                  />
                </View>
              </View>
            ))}

          <MuktaText style={[styles.layTxtIcon, { color: footerTextColor }]}>
            {userDataPersonal.socialMedia}
          </MuktaText>
        </View>
      ) : null}
    </View>
  );

  const GetLayout3 = () => (
    <View style={styles.lay3ViewFooter}>
      <SvgCss
        xml={SvgConstant.footerPersonalLayout2}
        width="100%"
        height="100%"
        fill={footerColor}
      />

      {userDataPersonal.image ? (
        <FastImage
          onLoadStart={() => designStore.setIsPersonalDesignLoad(true)}
          onLoadEnd={() => designStore.setIsPersonalDesignLoad(false)}
          source={{ uri: userDataPersonal.image }}
          style={styles.lay3ImgUser}
          resizeMode={FastImage.resizeMode.contain}
        />
      ) : null}
      {userDataPersonal.name ? (
        <MuktaText style={[styles.lay3TxtName, { color: footerTextColor }]}>
          {userDataPersonal.name}
        </MuktaText>
      ) : null}
      {userDataPersonal.designation ? (
        <MuktaText
          style={[styles.lay3TxtDesignation, { color: footerTextColor }]}
        >
          {userDataPersonal.designation}
        </MuktaText>
      ) : null}
      {userDataPersonal.socialMedia ? (
        <View
          style={[
            styles.lay3ViewSocialMedia,
            {
              color: footerTextColor,
            },
          ]}
        >
          {socialIconList &&
            socialIconList.map((item) => (
              <View style={styles.layViewSocialIconRoot}>
                <View
                  style={[
                    styles.layViewIcon,
                    { backgroundColor: footerTextColor },
                  ]}
                >
                  <Icon
                    key={item}
                    name={item}
                    height={Constant.layIconHeight}
                    width={Constant.layIconWidth}
                    fill={footerColor}
                  />
                </View>
              </View>
            ))}

          <MuktaText style={[styles.layTxtIcon, { color: footerTextColor }]}>
            {userDataPersonal.socialMedia}
          </MuktaText>
        </View>
      ) : null}
    </View>
  );

  const GetLayout4 = () => (
    <View style={styles.lay4ViewFooter}>
      <SvgCss
        xml={SvgConstant.footerPersonalLayout2}
        width="100%"
        height="100%"
        fill={footerColor}
      />

      <View style={styles.lay4ViewNameDesignation}>
        {userDataPersonal.name ? (
          <MuktaText style={[styles.lay4TxtName, { color: footerTextColor }]}>
            {userDataPersonal.name}
          </MuktaText>
        ) : null}
        {userDataPersonal.designation ? (
          <MuktaText
            style={[styles.lay4TxtDesignation, { color: footerTextColor }]}
          >
            {userDataPersonal.designation}
          </MuktaText>
        ) : null}
      </View>

      <View style={styles.lay4ViewWebsite}>
        {userDataPersonal.website ? (
          <View style={styles.layViewIconRoot}>
            <View
              style={[styles.layViewIcon, { backgroundColor: footerTextColor }]}
            >
              <Icon
                name="website"
                height={Constant.layIconHeight}
                width={Constant.layIconWidth}
                fill={footerColor}
              />
            </View>
            <MuktaText style={[styles.layTxtIcon, { color: footerTextColor }]}>
              {userDataPersonal.website}
            </MuktaText>
          </View>
        ) : null}
      </View>
      {userDataPersonal.socialMedia ? (
        <View
          style={[
            styles.lay4ViewSocialMedia,
            {
              color: footerTextColor,
            },
          ]}
        >
          {socialIconList &&
            socialIconList.map((item) => (
              <View style={styles.layViewSocialIconRoot}>
                <View
                  style={[
                    styles.layViewIcon,
                    { backgroundColor: footerTextColor },
                  ]}
                >
                  <Icon
                    key={item}
                    name={item}
                    height={Constant.layIconHeight}
                    width={Constant.layIconWidth}
                    fill={footerColor}
                  />
                </View>
              </View>
            ))}

          <MuktaText style={[styles.layTxtIcon, { color: footerTextColor }]}>
            {userDataPersonal.socialMedia}
          </MuktaText>
        </View>
      ) : null}
    </View>
  );

  const GetLayout5 = () => (
    <View style={styles.lay4ViewFooter}>
      <SvgCss
        xml={SvgConstant.footerPersonalLayout2}
        width="100%"
        height="100%"
        fill={footerColor}
      />

      <View style={styles.lay4ViewNameDesignation}>
        {userDataPersonal.name ? (
          <MuktaText style={[styles.lay4TxtName, { color: footerTextColor }]}>
            {userDataPersonal.name}
          </MuktaText>
        ) : null}
        {userDataPersonal.designation ? (
          <MuktaText
            style={[styles.lay4TxtDesignation, { color: footerTextColor }]}
          >
            {userDataPersonal.designation}
          </MuktaText>
        ) : null}
      </View>

      <View style={styles.lay4ViewWebsite}>
        {userDataPersonal.email ? (
          <View style={styles.layViewIconRoot}>
            <View
              style={[styles.layViewIcon, { backgroundColor: footerTextColor }]}
            >
              <Icon
                name="email"
                height={Constant.layIconHeight}
                width={Constant.layIconWidth}
                fill={footerColor}
              />
            </View>
            <MuktaText style={[styles.layTxtIcon, { color: footerTextColor }]}>
              {userDataPersonal.email}
            </MuktaText>
          </View>
        ) : null}
      </View>
      {userDataPersonal.socialMedia ? (
        <View
          style={[
            styles.lay4ViewSocialMedia,
            {
              color: footerTextColor,
            },
          ]}
        >
          {socialIconList &&
            socialIconList.map((item) => (
              <View style={styles.layViewSocialIconRoot}>
                <View
                  style={[
                    styles.layViewIcon,
                    { backgroundColor: footerTextColor },
                  ]}
                >
                  <Icon
                    key={item}
                    name={item}
                    height={Constant.layIconHeight}
                    width={Constant.layIconWidth}
                    fill={footerColor}
                  />
                </View>
              </View>
            ))}

          <MuktaText style={[styles.layTxtIcon, { color: footerTextColor }]}>
            {userDataPersonal.socialMedia}
          </MuktaText>
        </View>
      ) : null}
    </View>
  );

  const GetLayout6 = () => (
    <View style={styles.lay2ViewFooter}>
      <SvgCss
        xml={SvgConstant.footerPersonalLayout2}
        width="100%"
        height="100%"
        fill={footerColor}
      />
      {userDataPersonal.image ? (
        <FastImage
          onLoadStart={() => designStore.setIsPersonalDesignLoad(true)}
          onLoadEnd={() => designStore.setIsPersonalDesignLoad(false)}
          source={{ uri: userDataPersonal.image }}
          style={styles.lay2ImgUser}
          resizeMode={FastImage.resizeMode.contain}
        />
      ) : null}
      {userDataPersonal.name ? (
        <MuktaText style={[styles.lay2TxtName, { color: footerTextColor }]}>
          {userDataPersonal.name}
        </MuktaText>
      ) : null}
      {userDataPersonal.designation ? (
        <MuktaText
          style={[styles.lay2TxtDesignation, { color: footerTextColor }]}
        >
          {userDataPersonal.designation}
        </MuktaText>
      ) : null}

      <View style={styles.lay6ViewMobile}>
        {userDataPersonal.mobile ? (
          <View style={styles.layViewIconRoot}>
            <View
              style={[styles.layViewIcon, { backgroundColor: footerTextColor }]}
            >
              <Icon
                name="phone"
                height={Constant.layIconHeight}
                width={Constant.layIconWidth}
                fill={footerColor}
              />
            </View>

            <MuktaText
              style={[styles.layBigTxtIcon, { color: footerTextColor }]}
            >
              {userDataPersonal.mobile}
            </MuktaText>
          </View>
        ) : null}
      </View>
      {userDataPersonal.socialMedia ? (
        <View
          style={[
            styles.lay2ViewSocialMedia,
            {
              color: footerTextColor,
            },
          ]}
        >
          {socialIconList &&
            socialIconList.map((item) => (
              <View style={styles.layViewSocialIconRoot}>
                <View
                  style={[
                    styles.layViewIcon,
                    { backgroundColor: footerTextColor },
                  ]}
                >
                  <Icon
                    key={item}
                    name={item}
                    height={Constant.layIconHeight}
                    width={Constant.layIconWidth}
                    fill={footerColor}
                  />
                </View>
              </View>
            ))}

          <MuktaText style={[styles.layTxtIcon, { color: footerTextColor }]}>
            {userDataPersonal.socialMedia}
          </MuktaText>
        </View>
      ) : null}
    </View>
  );

  const GetLayout7 = () => (
    <View style={styles.lay3ViewFooter}>
      <SvgCss
        xml={SvgConstant.footerPersonalLayout2}
        width="100%"
        height="100%"
        fill={footerColor}
      />
      {userDataPersonal.image ? (
        <FastImage
          onLoadStart={() => designStore.setIsPersonalDesignLoad(true)}
          onLoadEnd={() => designStore.setIsPersonalDesignLoad(false)}
          source={{ uri: userDataPersonal.image }}
          style={styles.lay3ImgUser}
          resizeMode={FastImage.resizeMode.contain}
        />
      ) : null}
      {userDataPersonal.name ? (
        <MuktaText
          style={[styles.lay3TxtName, { color: footerTextColor }]}
          adjustsFontSizeToFit
        >
          {userDataPersonal.name}
        </MuktaText>
      ) : null}
      {userDataPersonal.designation ? (
        <MuktaText
          style={[styles.lay3TxtDesignation, { color: footerTextColor }]}
          adjustsFontSizeToFit
        >
          {userDataPersonal.designation}
        </MuktaText>
      ) : null}

      <View style={styles.lay7ViewMobile}>
        {userDataPersonal.mobile ? (
          <View style={styles.layViewIconRoot}>
            <View
              style={[styles.layViewIcon, { backgroundColor: footerTextColor }]}
            >
              <Icon
                name="phone"
                height={Constant.layIconHeight}
                width={Constant.layIconWidth}
                fill={footerColor}
              />
            </View>

            <MuktaText
              style={[styles.layBigTxtIcon, { color: footerTextColor }]}
            >
              {userDataPersonal.mobile}
            </MuktaText>
          </View>
        ) : null}
      </View>
      {userDataPersonal.socialMedia ? (
        <View
          style={[
            styles.lay3ViewSocialMedia,
            {
              color: footerTextColor,
            },
          ]}
        >
          {socialIconList &&
            socialIconList.map((item) => (
              <View style={styles.layViewSocialIconRoot}>
                <View
                  style={[
                    styles.layViewIcon,
                    { backgroundColor: footerTextColor },
                  ]}
                >
                  <Icon
                    key={item}
                    name={item}
                    height={Constant.layIconHeight}
                    width={Constant.layIconWidth}
                    fill={footerColor}
                  />
                </View>
              </View>
            ))}

          <MuktaText style={[styles.layTxtIcon, { color: footerTextColor }]}>
            {userDataPersonal.socialMedia}
          </MuktaText>
        </View>
      ) : null}
    </View>
  );

  const GetLayout8 = () => (
    <View
      style={[
        styles.lay4ViewFooter,
        { justifyContent: "center", alignItems: "center" },
      ]}
    >
      <SvgCss
        xml={SvgConstant.footerPersonalLayout2}
        width="100%"
        height="100%"
        fill={footerColor}
      />

      <View style={styles.lay8ViewNameDesignation}>
        {userDataPersonal.name ? (
          <MuktaText style={[styles.lay4TxtName, { color: footerTextColor }]}>
            {userDataPersonal.name}
          </MuktaText>
        ) : null}
        {userDataPersonal.designation ? (
          <MuktaText
            style={[styles.lay4TxtDesignation, { color: footerTextColor }]}
          >
            {userDataPersonal.designation}
          </MuktaText>
        ) : null}
      </View>
    </View>
  );

  /*
..######...#######..##.....##.########...#######..##....##.########.##....##.########..######.
.##....##.##.....##.###...###.##.....##.##.....##.###...##.##.......###...##....##....##....##
.##.......##.....##.####.####.##.....##.##.....##.####..##.##.......####..##....##....##......
.##.......##.....##.##.###.##.########..##.....##.##.##.##.######...##.##.##....##.....######.
.##.......##.....##.##.....##.##........##.....##.##..####.##.......##..####....##..........##
.##....##.##.....##.##.....##.##........##.....##.##...###.##.......##...###....##....##....##
..######...#######..##.....##.##.........#######..##....##.########.##....##....##.....######.
*/

  const layout = () => {
    return (
      <FlatList
        horizontal
        ref={layRef}
        showsHorizontalScrollIndicator={false}
        data={layouts}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.flatlist}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            activeOpacity={0.6}
            key={item.id}
            style={styles.listLayoutView}
            onPress={() => {
              if (
                item.package.type === Constant.typeDesignPackageVip &&
                hasPro === false
              ) {
                setVisibleModal(true);
              } else {
                flatlistSliderRef.current.scrollToIndex({
                  index: index,
                });
                // checkAndSetLayout(item);
              }
            }}
          >
            <>
              <FastImage
                source={{ uri: item.layoutImage.url }}
                style={{
                  width: width / 2.5,
                  height: 40,
                }}
                resizeMode={FastImage.resizeMode.contain}
              />
              {index === activeSlide && (
                <View
                  style={[
                    styles.icnCheck,
                    {
                      backgroundColor: Color.blackTransparant,
                      opacity: 0.5,
                      borderRadius: 4,
                      overflow: "hidden",
                    },
                  ]}
                />
              )}

              {item.package.type === Constant.typeDesignPackageVip && (
                <Icon
                  style={styles.tagPro}
                  name="Premium"
                  height={18}
                  width={10}
                  fill={Color.primary}
                />
              )}
            </>
          </TouchableOpacity>
        )}
      />
    );
  };

  const colorCode = () => {
    return (
      <View style={{ width: "94%" }}>
        <FlatList
          contentContainerStyle={styles.colorCodeList}
          data={currentDesign?.colorCodes ? currentDesign.colorCodes : []}
          horizontal
          showsHorizontalScrollIndicator={false}
          ListHeaderComponent={plusBTN()}
          keyExtractor={keyExtractor}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              activeOpacity={0.6}
              key={index}
              style={{
                ...styles.colorCode,
                backgroundColor: item.code,
              }}
              onPress={() => {
                setSelectedPicker(false);
                setFooterColor(item.code);
                item.isLight == true
                  ? setFooterTextColor(currentDesign.darkTextColor)
                  : setFooterTextColor(currentDesign.lightTextColor);
              }}
            >
              {selectedPicker !== true && (
                <>
                  {item.code === footerColor ? (
                    <View
                      style={[
                        {
                          borderColor: Color.primary,
                          borderWidth: 2,
                          margin: 10,
                          height: 33,
                          width: 33,
                          borderRadius: 20,
                        },
                      ]}
                    />
                  ) : null}
                </>
              )}
            </TouchableOpacity>
          )}
        />
        {selectedPicker && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingBottom: 10,
            }}
          >
            <Text style={{ paddingRight: 10, fontFamily: "Nunito-Regular" }}>
              {Common.getTranslation(LangKey.FontColor)}
            </Text>
            <View
              style={{
                height: 28,
                width: 28,
                borderRadius: 20,
                borderColor:
                  footerTextColor === Color.black ? Color.primary : null,
                borderWidth: footerTextColor === Color.black ? 2 : null,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  height: 20,
                  width: 20,
                  borderRadius: 20,
                  backgroundColor: Color.black,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}
                onPress={() => setFooterTextColor(Color.black)}
              />
            </View>

            <View
              style={{
                height: 28,
                width: 28,
                borderRadius: 20,
                borderColor:
                  footerTextColor === Color.white ? Color.primary : null,
                borderWidth: footerTextColor === Color.white ? 2 : null,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  height: 20,
                  width: 20,
                  borderRadius: 20,
                  backgroundColor: Color.white,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}
                onPress={() => setFooterTextColor(Color.white)}
              />
            </View>
          </View>
        )}
      </View>
    );
  };

  const socialIcons = () => {
    return (
      <FlatList
        style={styles.socialIconList}
        data={Constant.socialIconList}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            activeOpacity={0.6}
            style={{
              height: 35,
              width: 35,
              margin: 3,
              backgroundColor: Color.darkBlue,
              borderRadius: 50,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={async () => {
              let addIcons = [];
              if (socialIconList.indexOf(item) >= 0) {
                addIcons = socialIconList.filter((val) => val !== item);

                setSocialIconList(socialIconList.filter((val) => val !== item));
              } else if (socialIconList.length < Constant.socialIconLimit) {
                addIcons.push(...socialIconList, item);

                setSocialIconList([...socialIconList, item]);
              } else {
                Platform.OS == "android"
                  ? ToastAndroid.show(
                      Common.getTranslation(LangKey.msgSocialIconLimit),
                      ToastAndroid.LONG
                    )
                  : alert(Common.getTranslation(LangKey.msgSocialIconLimit));
              }
              await AsyncStorage.setItem(
                Constant.prfIcons,
                JSON.stringify(addIcons)
              );
            }}
          >
            <View
              style={{
                height: 35,
                width: 35,
                backgroundColor:
                  socialIconList && socialIconList.indexOf(item) < 0
                    ? null
                    : Color.white,
                opacity: 0.3,
                position: "absolute",
                borderRadius: 50,
              }}
            />

            <Icon
              name={item}
              height={20}
              width={20}
              fill={Color.white}
              key={index}
            />
          </TouchableOpacity>
        )}
      />
    );
  };

  const layoutRef = React.useRef(null);
  const colorRef = React.useRef(null);
  const socialRef = React.useRef(null);
  const fall = new Animated.Value(1);
  const renderContentLayout = () => (
    <View
      style={{
        backgroundColor: Color.white,
        padding: 5,
        height: 100,
      }}
    >
      <TouchableOpacity
        onPress={() => layoutRef.current.snapTo(2)}
        style={styles.btnClose}
      >
        <ICON name="close" size={22} color={Color.darkBlue} />
      </TouchableOpacity>
      {layout()}
    </View>
  );
  const renderContentColor = () => (
    <View
      style={{
        backgroundColor: Color.white,
        padding: 5,
        height: 100,
        flexDirection: "row",
      }}
    >
      {colorCode()}
      <TouchableOpacity
        onPress={() => colorRef.current.snapTo(2)}
        style={[styles.btnClose, { alignSelf: "flex-start" }]}
      >
        <ICON name="close" size={22} color={Color.darkBlue} />
      </TouchableOpacity>
    </View>
  );
  const renderContentSocial = () => (
    <View
      style={{
        backgroundColor: Color.white,
        padding: 5,
        height: 100,
      }}
    >
      <TouchableOpacity
        onPress={() => socialRef.current.snapTo(2)}
        style={styles.btnClose}
      >
        <ICON name="close" size={22} color={Color.darkBlue} />
      </TouchableOpacity>
      {socialIcons()}
    </View>
  );
  const pagination = () => {
    return (
      <Pagination
        dotsLength={layouts ? layouts.length : 0}
        activeDotIndex={activeSlide}
        containerStyle={{
          alignSelf: "center",
          paddingTop: 5,
          paddingBottom: 10,
        }}
        dotStyle={{
          width: 7,
          height: 7,
          marginHorizontal: -8,
          backgroundColor: Color.primary,
        }}
        inactiveDotStyle={{
          backgroundColor: Color.txtIntxtcolor,
        }}
        inactiveDotOpacity={0.6}
        inactiveDotScale={0.8}
      />
    );
  };

  const onViewRef = React.useRef((viewableItems) => {
    if (
      viewableItems &&
      viewableItems.viewableItems !== null &&
      viewableItems.viewableItems.length > 0
    ) {
      layRef.current.scrollToIndex({
        index: viewableItems.viewableItems[0].index,
      });
      setActiveSlide(viewableItems.viewableItems[0].index);
    }
  });
  const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 50 });
  const flatlistSliderRef = useRef();
  const layRef = useRef();

  const designRef = useRef();
  return (
    <>
      <BottomSheet
        ref={layoutRef}
        snapPoints={[100, 100, 0]}
        borderRadius={10}
        initialSnap={2}
        enabledInnerScrolling={true}
        enabledGestureInteraction={false}
        callbackNode={fall}
        renderContent={renderContentLayout}
      />
      <BottomSheet
        ref={colorRef}
        snapPoints={[100, 100, 0]}
        borderRadius={10}
        initialSnap={2}
        enabledGestureInteraction={false}
        callbackNode={fall}
        renderContent={renderContentColor}
      />
      <BottomSheet
        ref={socialRef}
        snapPoints={[100, 100, 0]}
        borderRadius={10}
        initialSnap={2}
        enabledGestureInteraction={false}
        callbackNode={fall}
        renderContent={renderContentSocial}
      />
      <View
        style={{
          flex: 1,
          backgroundColor: Color.bgcColor,
        }}
      >
        <ScrollView
          contentContainerStyle={{
            flex: 1,
          }}
          showsVerticalScrollIndicator={false}
        >
          <PopUp
            visible={visibleFreeModal}
            toggleVisible={toggleFreeVisible}
            isfree={true}
          />

          <PopUp
            visible={visibleModal}
            toggleVisible={toggleVisible}
            isPurchased={true}
          />
          <PopUp
            visible={visibleModalForPkg}
            toggleVisibleForPkgPrem={toggleVisibleForPkg}
            isPurchasedPrem={true}
          />

          <PopUp
            visible={visiblePicker}
            initialColor={footerColor}
            setPickerColor={setFooterColor}
            setSelectedPicker={setSelectedPicker}
            toggleVisibleColorPicker={toggleVisibleColorPicker}
            isPicker={true}
          />

          <PopUp
            visible={visibleModalMsg}
            toggleVisibleMsg={toggleVisibleMsg}
            isLayout={true}
            msg={msg}
          />
          <PopUp
            visible={visibleModalAd}
            toggleVisibleAd={toggleVisibleAd}
            isVisibleAd={true}
          />

          <View style={styles.container}>
            <FlatList
              horizontal
              ref={designRef}
              showsHorizontalScrollIndicator={false}
              data={designs}
              onContentSizeChange={() => {
                scrollTodesign();
              }}
              getItemLayout={getItemLayoutsCategory}
              keyExtractor={keyExtractor}
              contentContainerStyle={styles.flatlist}
              renderItem={({ item }) => {
                const designPackage = designPackages.find(
                  (pkg) => pkg.id === item.package
                );

                return (
                  <TouchableOpacity
                    activeOpacity={0.6}
                    style={styles.listDesignView}
                    onPress={() => {
                      // designPackage.type === Constant.typeDesignPackageFree &&
                      hasPro === false && adCounter++;
                      console.log("adCounter", adCounter);
                      showAd();
                      setPkgType(designPackage.type);
                      // if (
                      //   designPackage.type === Constant.typeDesignPackageVip &&
                      //   hasPro === false
                      // ) {
                      //   setVisibleModal(true);
                      // } else {
                      // }
                      setCurrentDesign(item);
                    }}
                  >
                    <View>
                      <FastImage
                        source={{ uri: item.thumbImage.url }}
                        style={{ width: 75, height: 75 }}
                      />

                      {item.id === currentDesign.id && (
                        <View
                          style={[
                            styles.icnCheck,
                            {
                              backgroundColor: Color.blackTransparant,
                              opacity: 0.6,
                              width: 75,
                              height: 75,
                            },
                          ]}
                        />
                      )}
                      {designPackage.type === Constant.typeDesignPackageVip ? (
                        <Icon
                          style={styles.tagPro}
                          name="Premium"
                          height={18}
                          width={10}
                          fill={Color.primary}
                        />
                      ) : (
                        <View style={styles.tagfree}>
                          <Text
                            style={{
                              color: Color.white,
                              fontSize: 6,
                            }}
                          >
                            {Common.getTranslation(LangKey.free)}
                          </Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
            <View
              style={{
                height: 1,
                width: "95%",
                backgroundColor: Color.txtIntxtcolor,
                marginVertical: 10,
              }}
            />

            <ViewShot
              style={styles.designView}
              ref={viewRef}
              options={{
                format: "jpg",
                quality: 1,
                // width: pixels,
                // height: pixels,
              }}
            >
              <View
                style={{
                  flex: 1,
                }}
              >
                <FastImage
                  onLoadStart={() => designStore.setIsPersonalDesignLoad(true)}
                  onLoadEnd={() => {
                    designStore.setIsPersonalDesignLoad(false);
                    if (!viewableItem.includes(currentDesign.id)) {
                      if (user && user !== null) {
                        setViewableItem([...viewableItem, currentDesign.id]);
                      }
                    }
                  }}
                  source={{
                    uri: currentDesign.designImage.url,
                  }}
                  style={{ flex: 1 }}
                >
                  <FlatList
                    ref={flatlistSliderRef}
                    data={layouts}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    onViewableItemsChanged={onViewRef.current}
                    viewabilityConfig={viewConfigRef.current}
                    keyExt={keyExtractor}
                    renderItem={({ item, index }) => {
                      return (
                        <View
                          style={{
                            width: width - 25,
                          }}
                        >
                          {getLayout(item.id, index)}
                        </View>
                      );
                    }}
                  />
                </FastImage>
              </View>
            </ViewShot>
            {pagination()}
          </View>
        </ScrollView>
        <View
          style={{
            borderTopColor: Color.txtIntxtcolor,
            borderTopWidth: 1,
            backgroundColor: Color.white,
          }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              marginBottom: Platform.OS === "ios" ? 10 : 0,
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
            }}
          >
            <View
              style={{
                justifyContent: "space-between",
                flexDirection: "row",
                flex: 1,
                marginHorizontal: 10,
              }}
            >
              <Button
                style={{ margin: 5, backgroundColor: Color.transparent }}
                isVertical={true}
                onPress={() => layoutRef.current.snapTo(0)}
                icon={
                  <Icon
                    name="layout"
                    height={14}
                    width={14}
                    fill={Color.grey}
                  />
                }
                textColor={true}
              >
                {Common.getTranslation(LangKey.labLayouts)}
              </Button>
              <Button
                style={{ margin: 5, backgroundColor: Color.transparent }}
                isVertical={true}
                onPress={() => colorRef.current.snapTo(0)}
                icon={
                  <Icon name="color" height={15} width={15} fill={Color.grey} />
                }
                textColor={true}
              >
                {Common.getTranslation(LangKey.labColorCodeList)}
              </Button>
              <Button
                style={{ margin: 5, backgroundColor: Color.transparent }}
                isVertical={true}
                onPress={() => socialRef.current.snapTo(0)}
                icon={
                  <Icon
                    name="socialicon"
                    height={15}
                    width={15}
                    fill={Color.grey}
                  />
                }
                textColor={true}
              >
                {Common.getTranslation(LangKey.labSocialMediaIcons)}
              </Button>
              <Button
                disable={designs == null || designs == undefined}
                style={{ margin: 5, backgroundColor: Color.transparent }}
                isVertical={true}
                onPress={() => {
                  if (user && user !== null) {
                    navigation.navigate(Constant.navProfile, {
                      title: Constant.titPersonalProfile,
                    });
                  } else {
                    Common.showMessage(
                      Common.getTranslation(LangKey.msgCreateAccEdit)
                    );
                  }
                }}
                icon={
                  <Icon name="edit" height={14} width={14} fill={Color.grey} />
                }
                textColor={true}
              >
                {Common.getTranslation(LangKey.txtEdit)}
              </Button>

              <Button
                disable={designs == null || designs == undefined}
                style={{ margin: 5, backgroundColor: Color.transparent }}
                isVertical={true}
                onPress={() => {
                  // if (currentDesign.id === curDesign.id) {
                  //   onReset();
                  // } else {
                  //   setCurrentDesign(curDesign);
                  // }
                  onReset();
                  fiilterLayouts();
                  setSelectedPicker(false);
                }}
                icon={
                  <Icon name="reset" height={14} width={14} fill={Color.grey} />
                }
                textColor={true}
              >
                {Common.getTranslation(LangKey.txtReset)}
              </Button>
            </View>
          </ScrollView>
        </View>
      </View>
    </>
  );
};
export default inject("designStore", "userStore")(observer(PersonalDesign));

function actuatedNormalize(size) {
  const scale = width / 320;
  const newSize = size * scale;
  if (Platform.OS === "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}

/*
..######..########.##....##.##.......########..######.
.##....##....##.....##..##..##.......##.......##....##
.##..........##......####...##.......##.......##......
..######.....##.......##....##.......######....######.
.......##....##.......##....##.......##.............##
.##....##....##.......##....##.......##.......##....##
..######.....##.......##....########.########..######.
*/

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 10,
  },
  flatlist: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    paddingHorizontal: 5,
  },
  listLayoutView: {
    marginLeft: 5,
    marginVertical: 5,
    borderRadius: 4,
    overflow: "hidden",
  },
  listDesignView: {
    marginHorizontal: 5,
    marginVertical: 5,
    borderRadius: 5,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  icnCheck: {
    position: "absolute",
    width: width / 2.5,
    height: 40,
  },

  designView: {
    margin: 10,
    width: width - 25,
    height: width - 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 1.22,
    elevation: 2,
    backgroundColor: Color.white,
  },
  colorCodeList: {
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: "100%",
  },
  colorCode: {
    height: 25,
    width: 25,
    borderRadius: 20,
    marginVertical: 10,
    marginHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  socialIconList: {
    marginTop: 15,
    marginHorizontal: 10,
  },
  socialIcon: { marginLeft: 10 },
  tagPro: {
    paddingHorizontal: 4,
    color: Color.tagTextColor,
    position: "absolute",
    right: 5,
    overflow: "hidden",
  },
  tagfree: {
    paddingHorizontal: 3,
    marginTop: 3,
    backgroundColor: Color.blackTransTagFree,
    position: "absolute",
    right: 5,
    borderRadius: 5,
    overflow: "hidden",
  },
  plusButton: {
    marginRight: 10,
    padding: 2,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },

  //common personal layout styles
  layViewIconRoot: {
    flexDirection: "row",
    alignItems: "center",
  },
  layViewIcon: {
    padding: Constant.layIconViewPadding,
    borderRadius: Constant.layIconViewBorderRadius,
    overflow: "hidden",
  },
  layTxtIcon: {
    fontSize: Constant.laySmallFontSize,
    paddingLeft: wp(0.5),
  },
  layBigTxtIcon: {
    fontSize: Constant.layBigFontSize,
    marginLeft: wp(0.5),
  },
  layViewSocialIconRoot: {
    marginRight: wp(0.5),
    alignContent: "center",
    alignItems: "center",
  },

  // layout-1 styles
  lay1ViewFooter: {
    width: "100%",
    height: "14.70%",
    bottom: 0,
    position: "absolute",
  },
  lay1ViewName: {
    width: "100%",
    position: "absolute",
    top: "10%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  lay1TxtName: { fontSize: Constant.layBigFontSize },
  lay1TxtDesignation: {
    fontSize: Constant.laySmallFontSize,
    marginLeft: wp(1.35),
  },
  lay1ViewWebsiteEmail: {
    position: "absolute",
    top: "41%",
    left: "2.50%",
    width: "95%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lay1ViewMobile: {
    position: "absolute",
    left: "2.50%",
    bottom: "7%",
    flexDirection: "row",
    alignItems: "center",
  },
  lay1ViewSocialMedia: {
    bottom: "7%",
    right: "2.50%",
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },

  //layout-2 styles
  lay2ViewFooter: {
    width: "100%",
    height: "10.50%",
    bottom: 0,
    position: "absolute",
  },
  lay2ImgUser: {
    left: "1.93%",
    position: "absolute",
    bottom: 0,
    width: "16.67%",
    height: "160%",
  },
  lay2TxtName: {
    fontSize: Constant.layBigFontSize,
    left: "21%",
    position: "absolute",
    top: "15%",
  },
  lay2TxtDesignation: {
    fontSize: Constant.laySmallFontSize,
    left: "21%",
    position: "absolute",
    bottom: "7%",
  },
  lay2ViewSocialMedia: {
    bottom: "7%",
    right: "2.50%",
    position: "absolute",
    alignItems: "center",
    flexDirection: "row",
  },

  // layout-3 styles
  lay3ViewFooter: {
    width: "100%",
    height: "10.50%",
    bottom: 0,
    position: "absolute",
  },
  lay3ImgUser: {
    right: "1.93%",
    position: "absolute",
    bottom: 0,
    width: "16.67%",
    height: "160%",
  },
  lay3TxtName: {
    fontSize: Constant.layBigFontSize,
    right: "21%",
    position: "absolute",
    top: "15%",
  },
  lay3TxtDesignation: {
    fontSize: Constant.laySmallFontSize,
    right: "21%",
    position: "absolute",
    bottom: "7%",
  },
  lay3ViewSocialMedia: {
    bottom: "7%",
    left: "2.50%",
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },

  //layout-4 styles
  lay4ViewFooter: {
    width: "100%",
    height: "10.50%",
    bottom: 0,
    position: "absolute",
  },
  lay4ViewNameDesignation: {
    width: "100%",
    position: "absolute",
    top: "10%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  lay4TxtName: { fontSize: Constant.layBigFontSize },
  lay4TxtDesignation: {
    fontSize: Constant.laySmallFontSize,
    marginLeft: wp(1.35),
  },
  lay4ViewWebsite: {
    bottom: "9%",
    left: "2.50%",
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  lay4ViewSocialMedia: {
    bottom: "9%",
    right: "2.50%",
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },

  // layout-6 styles other styles same as layout-2
  lay6ViewMobile: {
    position: "absolute",
    right: "2.50%",
    top: "15%",
    flexDirection: "row",
    alignItems: "center",
  },

  // layout-7 styles other styles same as layout-3
  lay7ViewMobile: {
    position: "absolute",
    left: "2.50%",
    top: "15%",
    flexDirection: "row",
    alignItems: "center",
  },
  btnClose: {
    width: 25,
    height: 25,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
  },

  //layout-8 styles other styles same as layout-4
  lay8ViewNameDesignation: {
    width: "100%",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
});

{
  /* <Button
                disable={designs == null || designs == undefined}
                style={{ margin: 5 }}
                icon={
                  <Icon
                    name="share"
                    height={15}
                    width={15}
                    fill={Color.white}
                  />
                }
                onPress={onClickShare}
              >
                {Common.getTranslation(LangKey.txtShare)}
              </Button> */
}
{
  /* <Button
              disable={
                isdesignImageLoad
                  ? isdesignImageLoad
                  : isUserDesignImageLoad
                  ? isUserDesignImageLoad
                  : loadingImage
              }
              style={{
                margin: 5,
                backgroundColor: Color.transparent,
              }}
              icon={
                <Icon
                  name="download"
                  height={15}
                  width={15}
                  fill={Color.darkBlue}
                />
              }
              textColor={true}
              onPress={onClickDownload}
            >
              {isdesignImageLoad ? (
                isdesignImageLoad
              ) : isUserDesignImageLoad ? (
                isUserDesignImageLoad
              ) : loadingImage ? (
                <ActivityIndicator color={Color.darkBlue} size={15} />
              ) : (
                Common.getTranslation(LangKey.txtDownload)
              )}
            </Button> */
}
