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
  ActivityIndicator,
  SafeAreaView,
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
let defaultImg = "";
let uDataPer = {};
let curLayoutId = "";
let firstTimeColor = true;
let colorArr = [];
let isFirstTimeLoad = true;
const PersonalDesign = ({ route, designStore, userStore, navigation }) => {
  const isMountedRef = Common.useIsMountedRef();
  const designPackages = toJS(designStore.designPackages);

  const user = toJS(userStore.user);
  const {
    curDesign,
    curScreen,
    curPackageType,
    curItemIndex,
    curDesignId,
    curCatId,
    activeCat,
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
  const [visibleModalForEditPersonalInfo, setModalForEditPersonalInfo] =
    useState(false);
  const [visibleModalForPkg, setVisibleModalForPkg] = useState(false);
  const [visibleFreeModal, setVisibleFreeModal] = useState(false);
  const [visibleModalMsg, setVisibleModalMsg] = useState(false);
  const [visibleModalAd, setVisibleModalAd] = useState(false);
  const [visiblePicker, setVisiblePicker] = useState(false);
  const [selectedPicker, setSelectedPicker] = useState(false);
  const [hasPro, sethasPro] = useState(false);
  const [currentDesign, setCurrentDesign] = useState(curDesign);
  const [layouts, setLayouts] = useState([]);
  const [viewableItem, setViewableItem] = useState([]);
  const [currentLayout, setCurrentLayout] = useState(null);
  const [socialIconList, setSocialIconList] = useState(
    Constant.defSocialIconList
  );
  const [defaultImageUrl, setDefaultImageUrl] = useState(null);
  const [Pkgtype, setPkgType] = useState();
  const [adReady, setAdReady] = useState(false);

  const [footerColor, setFooterColor] = useState();
  const [footerTextColor, setFooterTextColor] = useState(Color.black);

  const [userDataPersonal, setUserDataPersonal] = useState();

  const [isdesignImageLoad, setIsdesignImageLoad] = useState(false);
  const [isUserDesignImageLoad, setIsUserDesignImageLoad] = useState(false);
  const [dess, setDess] = useState([]);
  const [userSubCategories, setUserSubCategories] = useState([]);
  const [userSubCategoriesAfter, setUserSubCategoriesAfter] = useState([]);
  const [userOtherSubCategoryes, setUserOtherSubCategoryes] = useState([]);
  useEffect(() => {
    return () => {
      console.log("leave personal design");
      isFirstTimeLoad = true;
    };
  }, []);
  useEffect(() => {
    dess && dess !== null && console.log("dess", dess);
  }, [dess]);

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
    if (
      userSubCategories &&
      userSubCategories !== null &&
      userSubCategories.length > 0
    ) {
      const index = userSubCategories.findIndex((item) => item.id === curCatId);
      setDess(userSubCategories[index]?.designs);
    }
  }, [userSubCategories]);

  const [addUserDesign, { loading }] = useMutation(GraphqlQuery.addUserDesign, {
    errorPolicy: "all",
  });

  const toggleVisible = () => {
    setIsdesignImageLoad(false);
    setVisibleModal(!visibleModal);
  };

  const toggleVisibleForPkg = () => {
    setIsdesignImageLoad(false);
    setVisibleModalForPkg(!visibleModalForPkg);
  };
  const toggleFreeVisible = () => {
    setVisibleFreeModal(!visibleFreeModal);
  };
  const toggleVisibleModalForEditPersonalInfo = () => {
    setModalForEditPersonalInfo(!visibleModalForEditPersonalInfo);
  };

  const toggleVisibleMsg = (val) => {
    if (val === true) {
      let findIndex = layouts.findIndex((ele) => ele.id === setCurLayout.id);

      setActiveSlide(findIndex);
      flatlistSliderRef.current.scrollToIndex({
        index: findIndex,
      });
      setCurLayout !== undefined &&
        setCurLayout !== null &&
        setCurrentLayout(setCurLayout);
    }
    if (val === "edit") {
      setModalForEditPersonalInfo(true);
    }
    setVisibleModalMsg(!visibleModalMsg);
  };

  const toggleVisibleColorPicker = (color) => {
    colorArr = [
      ...colorArr,
      {
        selectedFooterColor: color,
        selectedFooterTxtColor: footerTextColor,
      },
    ];
    return setVisiblePicker(!visiblePicker);
  };

  const toggleVisibleAd = (isDownload) => {
    if (isDownload) {
      setTimeout(() => {
        AdMobRewarded.showAdAsync().catch((error) => {
          Platform.OS === "android" ? fbShowAd() : setAdReady(true);
        });
      }, 1000);
    } else {
      setIsdesignImageLoad(false);
    }
    setVisibleModalAd(!visibleModalAd);
  };

  const scrollTodesign = () => {
    if (dess && dess !== null && dess.length > 0) {
      designRef.current.scrollToIndex({
        index: curItemIndex,
      });
      isFirstTimeLoad = false;
    }
  };

  const getItemLayoutsCategory = useCallback(
    (data, index) => ({
      length: 85,
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
        setIsdesignImageLoad(false);
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
      AdMobInterstitial.showAdAsync().catch((error) => {
        Platform.OS === "android" ? fbShowAd() : null;
      });
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
      saveDesign();
    }
  }, [adReady]);

  // useEffect(() => {
  //   const isDownloadStartedPersonal = toJS(
  //     designStore.isDownloadStartedPersonal
  //   );

  //   if (isDownloadStartedPersonal && isDownloadStartedPersonal === true) {
  //     if (hasPro === true) {
  //       onClickDownload();
  //     } else {
  //       if (Pkgtype === Constant.typeDesignPackageVip) {
  //         setVisibleModal(true);
  //       } else {
  //         setVisibleModalAd(true);
  //       }
  //     }
  //   }
  // }, [designStore.isDownloadStartedPersonal]);

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
    const socialIconsP = toJS(designStore.socialIconsPersonal);
    if (user && user !== null) {
      if (socialIconsP && socialIconsP !== null && socialIconsP.length > 0) {
        setSocialIconList(socialIconsP);
      } else {
        setSocialIconList(Constant.defSocialIconList);
      }
    }
  }, [designStore.socialIconsPersonal]);

  useEffect(() => {
    if (isMountedRef.current) {
      onReset();
    }
  }, [currentDesign]);

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
      user?.userInfo?.personal?.image && user.userInfo.personal.image.length > 0
        ? setDefaultImageUrl(
            user.userInfo.personal.image.find((item) => item.isDefault === true)
              .url
          )
        : setDefaultImageUrl(null);
    }
  }, [userStore.user]);

  useEffect(() => {
    fiilterLayouts();
    uDataPer = userDataPersonal;
  }, [userDataPersonal]);

  const fiilterLayouts = () => {
    let filterArr = allLayouts.filter(
      (item) =>
        item.layoutType === Constant.layoutTypePERSONAL ||
        item.layoutType === Constant.layoutTypeALL
    );

    setLayouts(filterArr);
    checkLayout(filterArr);
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
      if (hasPro === true) {
        await saveDesign();
      } else {
        if (Pkgtype === Constant.typeDesignPackageVip) {
          setVisibleModal(true);
        } else {
          setVisibleModalAd(true);
        }
      }
    } else {
      setTimeout(() => {
        setIsdesignImageLoad(false);
      }, 1000);
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
        setIsdesignImageLoad(false);

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
        if (errors[0].extensions.code === Constant.userDesignExits) {
        } else if (errors[0].extensions.code === Constant.userFreeDesignLimit) {
          setVisibleModalForPkg(true);
          return;
        } else if (errors[0].extensions.code === Constant.userFreeDesignCut) {
          userStore.updateCurrantDesignCreditPro(currentDesignCreditPro - 1);
        } else {
          setIsdesignImageLoad(false);

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
      setIsdesignImageLoad(false);

      if (isShareClick === true) {
        isShareClick = false;
        await openShareDialogAsync(uri);
      }
    } else {
      setIsdesignImageLoad(false);
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
    if (uDataPer) {
      let isSet = false;
      layouts.some((layout) => {
        switch (layout.id) {
          case Constant.personalLay1Id:
            if (
              uDataPer.name &&
              uDataPer.name !== "" &&
              uDataPer.designation &&
              uDataPer.designation !== "" &&
              uDataPer.website &&
              uDataPer.website !== "" &&
              uDataPer.email &&
              uDataPer.email !== "" &&
              uDataPer.mobile &&
              uDataPer.mobile !== "" &&
              uDataPer.socialMedia &&
              uDataPer.socialMedia !== ""
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
              uDataPer.name &&
              uDataPer.name !== "" &&
              uDataPer.designation &&
              uDataPer.designation !== "" &&
              uDataPer.socialMedia &&
              uDataPer.socialMedia !== "" &&
              uDataPer.image &&
              uDataPer.image !== "" &&
              uDataPer.image.length > 0
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
              uDataPer.name &&
              uDataPer.name !== "" &&
              uDataPer.designation &&
              uDataPer.designation !== "" &&
              uDataPer.socialMedia &&
              uDataPer.socialMedia !== "" &&
              uDataPer.image &&
              uDataPer.image !== "" &&
              uDataPer.image.length > 0
            ) {
              let findInd = layouts.findIndex((ele) => ele.id === layout.id);
              setActiveSlide(findInd);
              setCurrentLayout(layout);
              isSet = true;
            }
            break;
          case Constant.personalLay4Id:
            if (
              uDataPer.name &&
              uDataPer.name !== "" &&
              uDataPer.designation &&
              uDataPer.designation !== "" &&
              uDataPer.website &&
              uDataPer.website !== "" &&
              uDataPer.socialMedia &&
              uDataPer.socialMedia !== ""
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
              uDataPer.name &&
              uDataPer.name !== "" &&
              uDataPer.designation &&
              uDataPer.designation !== "" &&
              uDataPer.email &&
              uDataPer.email !== "" &&
              uDataPer.socialMedia &&
              uDataPer.socialMedia !== ""
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
              uDataPer.name &&
              uDataPer.name !== "" &&
              uDataPer.designation &&
              uDataPer.designation !== "" &&
              uDataPer.mobile &&
              uDataPer.mobile !== "" &&
              uDataPer.socialMedia &&
              uDataPer.socialMedia !== "" &&
              uDataPer.image &&
              uDataPer.image !== "" &&
              uDataPer.image.length > 0
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
              uDataPer.name &&
              uDataPer.name !== "" &&
              uDataPer.designation &&
              uDataPer.designation !== "" &&
              uDataPer.mobile &&
              uDataPer.mobile !== "" &&
              uDataPer.socialMedia &&
              uDataPer.socialMedia !== "" &&
              uDataPer.image &&
              uDataPer.image !== "" &&
              uDataPer.image.length > 0
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
              uDataPer.name &&
              uDataPer.name !== "" &&
              uDataPer.designation &&
              uDataPer.designation !== ""
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
    if (uDataPer && uDataPer !== null) {
      switch (layout.id) {
        case Constant.personalLay1Id:
          if (
            !uDataPer.name ||
            uDataPer.name === "" ||
            !uDataPer.designation ||
            uDataPer.designation === "" ||
            !uDataPer.website ||
            uDataPer.website === "" ||
            !uDataPer.email ||
            uDataPer.email === "" ||
            !uDataPer.mobile ||
            uDataPer.mobile === "" ||
            !uDataPer.socialMedia ||
            uDataPer.socialMedia === ""
          ) {
            msg = Common.getTranslation(LangKey.personalLay1Msg);
            setVisibleModalMsg(true);
            setCurLayout = layout;
          } else {
            setCurrentLayout(layout);
          }
          break;
        case Constant.personalLay2Id:
          if (
            !uDataPer.name ||
            uDataPer.name === "" ||
            !uDataPer.designation ||
            uDataPer.designation === "" ||
            !uDataPer.socialMedia ||
            uDataPer.socialMedia === "" ||
            !uDataPer.image ||
            uDataPer.image === "" ||
            uDataPer.image.length < 0
          ) {
            msg = Common.getTranslation(LangKey.personalLay2Msg);
            setVisibleModalMsg(true);
            setCurLayout = layout;
          } else {
            setCurrentLayout(layout);
          }
          break;
        case Constant.personalLay3Id:
          if (
            !uDataPer.name ||
            uDataPer.name === "" ||
            !uDataPer.designation ||
            uDataPer.designation === "" ||
            !uDataPer.socialMedia ||
            uDataPer.socialMedia === "" ||
            !uDataPer.image ||
            uDataPer.image === "" ||
            uDataPer.image.length < 0
          ) {
            msg = Common.getTranslation(LangKey.personalLay3Msg);
            setVisibleModalMsg(true);
            setCurLayout = layout;
          } else {
            setCurrentLayout(layout);
          }
          break;
        case Constant.personalLay4Id:
          if (
            !uDataPer.name ||
            uDataPer.name === "" ||
            !uDataPer.designation ||
            uDataPer.designation === "" ||
            !uDataPer.website ||
            uDataPer.website === "" ||
            !uDataPer.socialMedia ||
            uDataPer.socialMedia === ""
          ) {
            msg = Common.getTranslation(LangKey.personalLay4Msg);
            setVisibleModalMsg(true);
            setCurLayout = layout;
          } else {
            setCurrentLayout(layout);
          }
          break;
        case Constant.personalLay5Id:
          if (
            !uDataPer.name ||
            uDataPer.name === "" ||
            !uDataPer.designation ||
            uDataPer.designation === "" ||
            !uDataPer.email ||
            uDataPer.email === "" ||
            !uDataPer.socialMedia ||
            uDataPer.socialMedia === ""
          ) {
            msg = Common.getTranslation(LangKey.personalLay5Msg);
            setVisibleModalMsg(true);
            setCurLayout = layout;
          } else {
            msg = "";

            setCurrentLayout(layout);
          }
          break;
        case Constant.personalLay6Id:
          if (
            !uDataPer.name ||
            uDataPer.name === "" ||
            !uDataPer.designation ||
            uDataPer.designation === "" ||
            !uDataPer.mobile ||
            uDataPer.mobile === "" ||
            !uDataPer.socialMedia ||
            uDataPer.socialMedia === "" ||
            !uDataPer.image ||
            uDataPer.image === "" ||
            uDataPer.image.length < 0
          ) {
            msg = Common.getTranslation(LangKey.personalLay6Msg);
            setVisibleModalMsg(true);
            setCurLayout = layout;
          } else {
            setCurrentLayout(layout);
          }
          break;
        case Constant.personalLay7Id:
          if (
            !uDataPer.name ||
            uDataPer.name === "" ||
            !uDataPer.designation ||
            uDataPer.designation === "" ||
            !uDataPer.mobile ||
            uDataPer.mobile === "" ||
            !uDataPer.socialMedia ||
            uDataPer.socialMedia === "" ||
            !uDataPer.image ||
            uDataPer.image === "" ||
            uDataPer.image.length < 0
          ) {
            msg = Common.getTranslation(LangKey.personalLay7Msg);
            setVisibleModalMsg(true);
            setCurLayout = layout;
          } else {
            setCurrentLayout(layout);
          }
          break;
        case Constant.personalLay8Id:
          if (
            !uDataPer.name &&
            uDataPer.name === "" &&
            !uDataPer.designation &&
            uDataPer.designation === ""
          ) {
            msg = Common.getTranslation(LangKey.personalLay8Msg);
            setVisibleModalMsg(true);
            setCurLayout = layout;
          } else {
            setCurrentLayout(layout);
          }
          break;
        case Constant.personalLay9Id:
          setCurrentLayout(layout);
          break;
      }
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
        <View style={styles.lay2ImgUser}>
          <FastImage
            onLoadStart={() => {
              if (Constant.personalLay2Id === curLayoutId) {
                setIsUserDesignImageLoad(true);
              }
            }}
            onLoadEnd={() => {
              if (Constant.personalLay2Id === curLayoutId) {
                setIsUserDesignImageLoad(false);
              }
            }}
            source={{ uri: userDataPersonal.image }}
            style={{
              height: "100%",
              width: "100%",
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>
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
          onLoadStart={() => {
            if (Constant.personalLay3Id === curLayoutId) {
              setIsUserDesignImageLoad(true);
            }
          }}
          onLoadEnd={() => {
            if (Constant.personalLay3Id === curLayoutId) {
              setIsUserDesignImageLoad(false);
            }
          }}
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
          onLoadStart={() => {
            if (Constant.personalLay6Id === curLayoutId) {
              setIsUserDesignImageLoad(true);
            }
          }}
          onLoadEnd={() => {
            if (Constant.personalLay6Id === curLayoutId) {
              setIsUserDesignImageLoad(false);
            }
          }}
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
          onLoadStart={() => {
            if (Constant.personalLay7Id === curLayoutId) {
              setIsUserDesignImageLoad(true);
            }
          }}
          onLoadEnd={() => {
            if (Constant.personalLay7Id === curLayoutId) {
              setIsUserDesignImageLoad(false);
            }
          }}
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
  const loadMoreDesigns = async (subCategoryId) => {
    // const index = designs.findIndex((item) => item.id === subCategoryId);
    // const subCategory = designs[index];
    // const designLen = dess.length;
    // console.log("designLen", designLen);

    if (activeCat === "Quotes") {
      const type = Constant.topCatQuotes;

      await designStore.loaduserDesigns(subCategoryId, type, hasPro);
    } else {
      const type = Constant.userSubCategoryTypeAfter;

      await designStore.loaduserDesigns(subCategoryId, type, hasPro);
    }
  };

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
                if (firstTimeColor === true) {
                  colorArr = [
                    ...colorArr,
                    {
                      selectedFooterColor: currentDesign?.colorCodes[0].code,
                      selectedFooterTxtColor:
                        currentDesign?.colorCodes[0].isLight == true
                          ? currentDesign.darkTextColor
                          : currentDesign.lightTextColor,
                    },
                  ];
                }
                firstTimeColor = false;

                colorArr = [
                  ...colorArr,
                  {
                    selectedFooterColor: item.code,
                    selectedFooterTxtColor:
                      item.isLight == true
                        ? currentDesign.darkTextColor
                        : currentDesign.lightTextColor,
                  },
                ];
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
                onPress={() => {
                  setFooterTextColor(Color.black);
                  colorArr = [
                    ...colorArr,
                    {
                      selectedFooterColor: footerColor,
                      selectedFooterTxtColor: Color.black,
                    },
                  ];
                }}
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
                onPress={() => {
                  setFooterTextColor(Color.white);
                  colorArr = [
                    ...colorArr,
                    {
                      selectedFooterColor: footerColor,
                      selectedFooterTxtColor: Color.white,
                    },
                  ];
                }}
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
      curLayoutId = viewableItems.viewableItems[0].item.id;

      setTimeout(() => {
        // navigation.addListener("focus", (e) => {
        //   console.log("focus personal");
        // });
        checkAndSetLayout(viewableItems.viewableItems[0].item);
      }, 1000);
      // layRef.current.scrollToIndex({
      //   index: viewableItems.viewableItems[0].index,
      // });
      setActiveSlide(viewableItems.viewableItems[0].index);
    }
  });
  const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 50 });
  const flatlistSliderRef = useRef();
  const layRef = useRef();

  const designRef = useRef();
  const onPressBack = () => {
    if (colorArr.length > 1) {
      colorArr.pop();
      setFooterColor(
        colorArr && colorArr.length > 0
          ? colorArr[colorArr.length - 1].selectedFooterColor
          : null
      );
      setFooterTextColor(
        colorArr && colorArr.length > 0
          ? colorArr[colorArr.length - 1].selectedFooterTxtColor
          : currentDesign?.colorCodes[0].isLight === true
          ? currentDesign.darkTextColor
          : currentDesign.lightTextColor
      );
    } else {
      Common.showMessage("there is no changes");
    }
  };
  return (
    <>
      {/* <BottomSheet
        ref={layoutRef}
        snapPoints={[100, 100, 0]}
        borderRadius={10}
        initialSnap={2}
        enabledInnerScrolling={true}
        enabledGestureInteraction={false}
        callbackNode={fall}
        renderContent={renderContentLayout}
      /> */}
      <BottomSheet
        ref={colorRef}
        snapPoints={[100, 100, 0]}
        borderRadius={10}
        initialSnap={2}
        enabledGestureInteraction={false}
        callbackNode={fall}
        renderContent={renderContentColor}
      />
      {/* <BottomSheet
        ref={socialRef}
        snapPoints={[100, 100, 0]}
        borderRadius={10}
        initialSnap={2}
        enabledGestureInteraction={false}
        callbackNode={fall}
        renderContent={renderContentSocial}
      /> */}
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: Color.white,
        }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
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

          {/* <PopUp
            visible={visibleModalMsg}
            toggleVisibleMsg={toggleVisibleMsg}
            isLayout={true}
            msg={msg}
          /> */}
          <PopUp
            visible={visibleModalAd}
            toggleVisibleAd={toggleVisibleAd}
            isVisibleAd={true}
          />
          <PopUp
            visible={visibleModalForEditPersonalInfo}
            toggleVisibleModalForEditPersonalInfo={
              toggleVisibleModalForEditPersonalInfo
            }
            isVisiblePersonalInfo={true}
          />

          <View style={styles.container}>
            <FlatList
              horizontal
              ref={designRef}
              showsHorizontalScrollIndicator={false}
              data={dess}
              ListFooterComponent={
                designStore.udLoading || designStore.uoscLoading ? (
                  <ActivityIndicator size={25} color={Color.primary} />
                ) : null
              }
              ListFooterComponentStyle={{
                alignItems: "center",
                justifyContent: "center",
              }}
              onContentSizeChange={() => {
                if (isFirstTimeLoad) {
                  scrollTodesign();
                }
              }}
              getItemLayout={getItemLayoutsCategory}
              keyExtractor={keyExtractor}
              onEndReached={() => {
                !designStore.udLoading && loadMoreDesigns(curDesignId);
              }}
              contentContainerStyle={styles.flatlist}
              renderItem={({ item }) => {
                const designPackage = designPackages.find(
                  (pkg) => pkg.id === item.package
                );

                return (
                  <>
                    <TouchableOpacity
                      activeOpacity={0.6}
                      style={styles.listDesignView}
                      onPress={() => {
                        firstTimeColor = true;
                        colorArr = [];
                        hasPro === false && adCounter++;
                        console.log("adCounter", adCounter);
                        showAd();
                        setPkgType(designPackage.type);

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
                        {designPackage.type ===
                        Constant.typeDesignPackageVip ? (
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
                  </>
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
                  onLoadStart={() => setIsdesignImageLoad(true)}
                  onLoadEnd={() => {
                    setIsdesignImageLoad(false);
                    if (!viewableItem.includes(currentDesign.id)) {
                      if (user && user !== null) {
                        setViewableItem([...viewableItem, currentDesign.id]);
                      }
                    }
                  }}
                  source={{
                    uri: currentDesign?.designImage?.url,
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
          <View
            style={{
              flex: 1,
              alignItems: "center",
            }}
          >
            {user?.userInfo?.personal?.image &&
            user.userInfo.personal.image.length > 0 ? (
              <View
                style={{
                  borderColor: Color.blackTransBorder,
                  borderWidth: 1,
                  borderRadius: 10,
                  height: 116,
                  maxWidth: width - 10,
                  marginBottom: 10,
                }}
              >
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={
                    Array.isArray(user?.userInfo?.personal?.image)
                      ? user.userInfo.personal.image
                      : []
                  }
                  keyExtractor={(index) => index.toString()}
                  renderItem={({ item }) => {
                    return (
                      <TouchableOpacity
                        style={styles.toProfileImage}
                        onPress={async () => {
                          await setDefaultImageUrl(item.url);
                          defaultImg = item.url;
                          setTimeout(() => {
                            let newImage = [];
                            if (defaultImg && defaultImg !== "") {
                              newImage = user?.userInfo?.personal?.image.map(
                                (item) => {
                                  if (item.url == defaultImg) {
                                    item.isDefault = true;
                                  } else {
                                    item.isDefault = false;
                                  }
                                  return item;
                                }
                              );
                            }
                            const newUser = {
                              ...user,
                              userInfo: {
                                ...user?.userInfo,
                                personal: {
                                  ...user?.userInfo.personal,
                                  image: newImage,
                                },
                              },
                            };
                            userStore.setOnlyUserDetail(newUser);
                          }, 1000);
                        }}
                      >
                        {item.url && item.url !== "" && (
                          <FastImage
                            source={{ uri: item.url }}
                            style={styles.toProfileImage}
                          />
                        )}

                        {defaultImageUrl === item.url && (
                          <View
                            style={{
                              position: "absolute",
                              zIndex: 1,
                              bottom: 5,
                              backgroundColor: Color.blackTransTagFree,
                              width: "90%",
                              alignItems: "center",
                              paddingVertical: 2,
                              borderRadius: 5,
                            }}
                          >
                            <Icon
                              name="mark"
                              height={18}
                              width={18}
                              fill={Color.primary}
                            />
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
            ) : null}
          </View>
        </ScrollView>
        <View
          style={{
            borderTopColor: Color.txtIntxtcolor,
            borderTopWidth: 1,
            backgroundColor: Color.white,
            height: 50,
          }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
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
                marginTop: 5,
                marginHorizontal: 20,
                alignItems: "center",
              }}
            >
              {/* <Button
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
              </Button> */}
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
              {/* <Button
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
              </Button> */}
              <Button
                disable={dess == null || dess == undefined}
                style={{ backgroundColor: Color.transparent }}
                isVertical={true}
                onPress={() => {
                  if (user && user !== null) {
                    setModalForEditPersonalInfo(true);
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
                {Common.getTranslation(LangKey.txtProfile)}
              </Button>

              <Button
                disable={dess == null || dess == undefined}
                style={{ backgroundColor: Color.transparent }}
                isVertical={true}
                onPress={
                  () => onPressBack()
                  // if (currentDesign.id === curDesign.id) {
                  //   onReset();
                  // } else {
                  //   setCurrentDesign(curDesign);
                  // }
                  // onReset();
                  // fiilterLayouts();
                  // setSelectedPicker(false);

                  // colorArr.pop()
                }
                icon={
                  <Icon name="reset" height={14} width={14} fill={Color.grey} />
                }
                textColor={true}
              >
                {Common.getTranslation(LangKey.txtBack)}
              </Button>
              <View
                style={{
                  width: 50,
                  height: 50,
                  marginVertical: Platform.OS === "android" ? 5 : 0,
                }}
              >
                <Button
                  disable={isdesignImageLoad || isUserDesignImageLoad}
                  style={{ backgroundColor: Color.transparent }}
                  isVertical={true}
                  onPress={() => {
                    setIsdesignImageLoad(true);
                    onClickDownload();
                  }}
                  icon={
                    <Icon
                      name="download"
                      height={14}
                      width={14}
                      fill={Color.grey}
                    />
                  }
                  textColor={true}
                >
                  {isdesignImageLoad || isUserDesignImageLoad ? (
                    <ActivityIndicator size={20} color={Color.darkBlue} />
                  ) : (
                    Common.getTranslation(LangKey.txtSave)
                  )}
                </Button>
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
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
  toProfileImage: {
    width: 80,
    height: 95,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
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
    fontSize: Constant.laySmallFontSize,
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
    left: 0,
    position: "absolute",
    bottom: 0,
    width: "18%",
    height: "190%",
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
    right: 0,
    position: "absolute",
    bottom: 0,
    width: "21%",
    height: "180%",
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
