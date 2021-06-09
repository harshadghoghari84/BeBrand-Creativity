import { toJS } from "mobx";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ToastAndroid,
  Platform,
  FlatList,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
// import Icon from "react-native-vector-icons/Ionicons";
import ViewShot from "react-native-view-shot";
import { SvgCss } from "react-native-svg";
import { inject, observer } from "mobx-react";
import * as MediaLibrary from "expo-media-library";
import * as Permissions from "expo-permissions";
import * as Sharing from "expo-sharing";
import { useMutation } from "@apollo/client";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import FastImage from "react-native-fast-image";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomSheet from "reanimated-bottom-sheet";
import Animated from "react-native-reanimated";
import ICON from "react-native-vector-icons/MaterialCommunityIcons";
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
import Text from "../../components/MuktaText";

const { width } = Dimensions.get("window");
let isShareClick = false;

let msg = "";
let adAvilable = false;
let adCounter = 0;
let setCurLayout = {};
let defaultImg = "";
let uDataBus = {};
let curLayoutId = "";
let firstTimeColor = true;
let colorArr = [];

const BussinessDesign = ({ route, designStore, userStore, navigation }) => {
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
  const designRef = useRef();
  const layRef = useRef();
  const isMountedRef = Common.useIsMountedRef();
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
  const [viewableItem, setViewableItem] = useState([]);
  const [visibleModalForEditBusinessInfo, setModalForEditBusinessInfo] =
    useState(false);
  const [defaultImageUrl, setDefaultImageUrl] = useState(null);

  const [visibleModalAd, setVisibleModalAd] = useState(false);
  const [visibleFreeModal, setVisibleFreeModal] = useState(false);
  const [visiblePicker, setVisiblePicker] = useState(false);
  const [visibleModalMsgbussiness, setVisibleModalMsgbussiness] =
    useState(false);
  const [hasPro, sethasPro] = useState(false);
  const [designs, setDesigns] = useState([]);
  const [currentDesign, setCurrentDesign] = useState(curDesign);
  const [userDataBussiness, setUserDataBussiness] = useState();
  const [layouts, setLayouts] = useState([]);
  const [currentLayout, setCurrentLayout] = useState(null);
  const [socialIconList, setSocialIconList] = useState(
    Constant.defSocialIconList
  );

  const [isdesignImageLoad, setIsdesignImageLoad] = useState(false);
  const [isUserDesignImageLoad, setIsUserDesignImageLoad] = useState(false);

  const [Pkgtype, setPkgType] = useState();
  const [adReady, setAdReady] = useState(false);

  const [selectedPicker, setSelectedPicker] = useState(false);

  const [footerColor, setFooterColor] = useState();
  const [footerTextColor, setFooterTextColor] = useState(Color.black);

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

  const toggleVisibleModalForEditBussinessInfo = () => {
    setModalForEditBusinessInfo(!visibleModalForEditBusinessInfo);
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

  const toggleVisibleMsgBussiness = (val) => {
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
      setModalForEditBusinessInfo(true);
    }
    setVisibleModalMsgbussiness(!visibleModalMsgbussiness);
  };

  const fiilterLayouts = () => {
    let filterArr = allLayouts.filter(
      (item) =>
        item.layoutType === Constant.layoutTypeBUSINESS ||
        item.layoutType === Constant.layoutTypeALL
    );

    setLayouts(filterArr);
    checkLayout(filterArr);
  };

  const onReset = () => {
    // let filterArr = allLayouts.filter((item) =>
    //   currentDesign.layouts.includes(item.id)
    // );
    if (currentDesign?.colorCodes && currentDesign.colorCodes.length > 0) {
      setFooterColor(currentDesign.colorCodes[0].code);
      currentDesign.colorCodes[0].isLight == true
        ? setFooterTextColor(currentDesign.darkTextColor)
        : setFooterTextColor(currentDesign.lightTextColor);
    }
  };

  const scrollTodesign = () => {
    designRef.current.scrollToIndex({
      animated: true,
      index:  curItemIndex,
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
  const showAd = () => {
    console.log("show ad google");
    if (hasPro === false && adCounter && adCounter >= Constant.addCounter) {
      console.log("inside if");

      AdMobInterstitial.showAdAsync().catch((error) => fbShowAd());
      adCounter = 0;
    }
  };

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
  useEffect(() => {
    if (
      viewableItem !== null &&
      Array.isArray(viewableItem) &&
      viewableItem.length > 0
    ) {
      AsyncStorage.setItem(
        Constant.prfViewDesignsBusiness,
        JSON.stringify(viewableItem)
      );
    }
  }, [viewableItem]);

  useEffect(() => {
    if (adReady) {
      setAdReady(false);
      adAvilable = false;
      if (designStore.isDownloadStartedBusiness === true) {
        onClickDownload();
      }
    }
  }, [adReady]);

  // useEffect(() => {
  //   const isDownloadStartedBusiness = toJS(
  //     designStore.isDownloadStartedBusiness
  //   );
  //   if (isDownloadStartedBusiness && isDownloadStartedBusiness === true) {
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
  // }, [designStore.isDownloadStartedBusiness]);

  useEffect(() => {
    AsyncStorage.getItem(Constant.prfIconsB)
      .then((res) => {
        if (res && res !== null) {
          setSocialIconList(JSON.parse(res));
        }
      })
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => {
    const socialIconsB = toJS(designStore.socialIconsBusiness);
    setSocialIconList(socialIconsB);
  }, [designStore.socialIconsBusiness]);

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
          (ele.designType === Constant.designTypeBUSINESS ||
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
      setUserDataBussiness(
        user && user != null
          ? {
              name:
                user?.userInfo?.business?.name && user.userInfo.business.name,

              mobile:
                user?.userInfo?.business?.mobile &&
                user.userInfo.business.mobile,

              address:
                user?.userInfo?.business?.address &&
                user.userInfo.business.address,

              email:
                user?.userInfo?.business?.email && user.userInfo.business.email,

              website:
                user?.userInfo?.business?.website &&
                user.userInfo.business.website,

              socialMedia:
                user?.userInfo?.business?.socialMediaId &&
                user.userInfo.business.socialMediaId,

              image:
                user?.userInfo?.business.image.length > 0
                  ? user?.userInfo?.business.image.find(
                      (item) => item.isDefault === true
                    ).url
                  : null,
            }
          : Constant.dummyCompnyData[0]
      );
      user?.userInfo?.business?.image && user.userInfo.business.image.length > 0
        ? setDefaultImageUrl(
            user.userInfo.business.image.find((item) => item.isDefault === true)
              .url
          )
        : setDefaultImageUrl(null);
    }
  }, [userStore.user]);

  useEffect(() => {
    fiilterLayouts();
    uDataBus = userDataBussiness;
  }, [userDataBussiness]);

  const onClickDownload = async () => {
    if (user && user !== null) {
      setIsdesignImageLoad(true);
      await saveDesign();
      // if (currentLayout && currentLayout !== null) {
      // } else {
      //   setIsdesignImageLoad(false);
      //   Common.showMessage(Common.getTranslation(LangKey.msgSelectLayout));
      // }
    } else {
      setTimeout(() => {
        setIsdesignImageLoad(false);
      }, 1000);
      setIsdesignImageLoad(false);
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
      const { data, errors } = await addUserDesign({
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
    if (uDataBus) {
      let isSet = false;
      layouts.some((layout) => {
        switch (layout.id) {
          case Constant.businessLay1Id:
            if (
              uDataBus.name &&
              uDataBus.name !== "" &&
              uDataBus.address &&
              uDataBus.address !== "" &&
              uDataBus.mobile &&
              uDataBus.mobile !== "" &&
              uDataBus.socialMedia &&
              uDataBus.socialMedia !== "" &&
              uDataBus.image &&
              uDataBus.image !== "" &&
              uDataBus.image.length > 0
            ) {
              setCurrentLayout(layout);
              isSet = true;
              return true;
            }
            break;
          case Constant.businessLay2Id:
            if (
              uDataBus.name &&
              uDataBus.name !== "" &&
              uDataBus.address &&
              uDataBus.address !== "" &&
              uDataBus.mobile &&
              uDataBus.mobile !== "" &&
              uDataBus.socialMedia &&
              uDataBus.socialMedia !== "" &&
              uDataBus.image &&
              uDataBus.image !== "" &&
              uDataBus.image.length > 0
            ) {
              setCurrentLayout(layout);
              isSet = true;
              return true;
            }
            break;
          case Constant.businessLay3Id:
            if (
              uDataBus.name &&
              uDataBus.name !== "" &&
              uDataBus.mobile &&
              uDataBus.mobile !== "" &&
              uDataBus.website &&
              uDataBus.website !== "" &&
              uDataBus.socialMedia &&
              uDataBus.socialMedia !== ""
            ) {
              setCurrentLayout(layout);
              isSet = true;
            }
            break;
          case Constant.businessLay4Id:
            if (
              uDataBus.name &&
              uDataBus.name !== "" &&
              uDataBus.mobile &&
              uDataBus.mobile !== "" &&
              uDataBus.website &&
              uDataBus.website !== "" &&
              uDataBus.email &&
              uDataBus.email !== "" &&
              uDataBus.socialMedia &&
              uDataBus.socialMedia !== ""
            ) {
              setCurrentLayout(layout);
              isSet = true;
              return true;
            }
            break;
          case Constant.businessLay5Id:
            if (
              uDataBus.name &&
              uDataBus.name !== "" &&
              uDataBus.mobile &&
              uDataBus.mobile !== "" &&
              uDataBus.email &&
              uDataBus.email !== "" &&
              uDataBus.socialMedia &&
              uDataBus.socialMedia !== ""
            ) {
              setCurrentLayout(layout);
              isSet = true;
              return true;
            }
            break;
          case Constant.businessLay6Id:
            if (
              uDataBus.name &&
              uDataBus.name !== "" &&
              uDataBus.address &&
              uDataBus.address !== "" &&
              uDataBus.mobile &&
              uDataBus.mobile !== "" &&
              uDataBus.website &&
              uDataBus.website !== "" &&
              uDataBus.socialMedia &&
              uDataBus.socialMedia !== ""
            ) {
              setCurrentLayout(layout);
              isSet = true;
              return true;
            }
            break;
          case Constant.businessLay7Id:
            if (
              uDataBus.name &&
              uDataBus.name !== "" &&
              uDataBus.mobile &&
              uDataBus.mobile !== "" &&
              uDataBus.website &&
              uDataBus.website !== "" &&
              uDataBus.socialMedia &&
              uDataBus.socialMedia !== "" &&
              uDataBus.image &&
              uDataBus.image !== "" &&
              uDataBus.image.length > 0
            ) {
              setCurrentLayout(layout);
              isSet = true;
              return true;
            }
            break;
          case Constant.businessLay8Id:
            if (
              uDataBus.name &&
              uDataBus.name !== "" &&
              uDataBus.mobile &&
              uDataBus.mobile !== "" &&
              uDataBus.email &&
              uDataBus.email !== "" &&
              uDataBus.socialMedia &&
              uDataBus.socialMedia !== "" &&
              uDataBus.image &&
              uDataBus.image !== "" &&
              uDataBus.image.length > 0
            ) {
              setCurrentLayout(layout);
              isSet = true;
              return true;
            }
            break;
          case Constant.businessLay9Id:
            if (
              uDataBus.name &&
              uDataBus.name !== "" &&
              uDataBus.website &&
              uDataBus.website !== "" &&
              uDataBus.mobile &&
              uDataBus.mobile !== "" &&
              uDataBus.socialMedia &&
              uDataBus.socialMedia !== "" &&
              uDataBus.image &&
              uDataBus.image !== "" &&
              uDataBus.image.length > 0
            ) {
              setCurrentLayout(layout);
              isSet = true;
              return true;
            }
            break;
          case Constant.businessLay10Id:
            if (
              uDataBus.name &&
              uDataBus.name !== "" &&
              uDataBus.email &&
              uDataBus.email !== "" &&
              uDataBus.mobile &&
              uDataBus.mobile !== "" &&
              uDataBus.socialMedia &&
              uDataBus.socialMedia !== "" &&
              uDataBus.image &&
              uDataBus.image !== "" &&
              uDataBus.image.length > 0
            ) {
              setCurrentLayout(layout);
              isSet = true;
              return true;
            }
            break;
          case Constant.businessLay11Id:
            if (uDataBus.name && uDataBus.name !== "") {
              setCurrentLayout(layout);
              isSet = true;
              return true;
            }
            break;
        }
      });

      if (isSet == false && curScreen === Constant.navBusinessProfile) {
        msg = Common.getTranslation(LangKey.nolayoutBussiness);
        setVisibleModalMsgbussiness(true);
      }
    }
  };

  const checkAndSetLayout = (layout) => {
    switch (layout.id) {
      case Constant.businessLay1Id:
        if (
          !uDataBus.name ||
          uDataBus.name === "" ||
          !uDataBus.address ||
          uDataBus.address === "" ||
          !uDataBus.mobile ||
          uDataBus.mobile === "" ||
          !uDataBus.socialMedia ||
          uDataBus.socialMedia === "" ||
          !uDataBus.image ||
          uDataBus.image === "" ||
          uDataBus.image.length < 0
        ) {
          msg = Common.getTranslation(LangKey.businessLay1Msg);
          setVisibleModalMsgbussiness(true);
          setCurLayout = layout;
          let findIndex = layouts.findIndex((ele) => ele.id === layout.id);
          setActiveSlide(findIndex);
        } else {
          let findIndex = layouts.findIndex((ele) => ele.id === layout.id);
          setActiveSlide(findIndex);
          setCurrentLayout(layout);
        }
        break;
      case Constant.businessLay2Id:
        if (
          !uDataBus.name ||
          uDataBus.name === "" ||
          !uDataBus.address ||
          uDataBus.address === "" ||
          !uDataBus.mobile ||
          uDataBus.mobile === "" ||
          !uDataBus.socialMedia ||
          uDataBus.socialMedia === "" ||
          !uDataBus.image ||
          uDataBus.image === "" ||
          uDataBus.image.length < 0
        ) {
          msg = Common.getTranslation(LangKey.businessLay2Msg);
          setVisibleModalMsgbussiness(true);
          setCurLayout = layout;
          let findIndex = layouts.findIndex((ele) => ele.id === layout.id);
          setActiveSlide(findIndex);
        } else {
          let findIndex = layouts.findIndex((ele) => ele.id === layout.id);
          setActiveSlide(findIndex);
          setCurrentLayout(layout);
        }
        break;
      case Constant.businessLay3Id:
        if (
          !uDataBus.name ||
          uDataBus.name === "" ||
          !uDataBus.mobile ||
          uDataBus.mobile === "" ||
          !uDataBus.website ||
          uDataBus.website === "" ||
          !uDataBus.socialMedia ||
          uDataBus.socialMedia === ""
        ) {
          msg = Common.getTranslation(LangKey.businessLay3Msg);
          setVisibleModalMsgbussiness(true);
          setCurLayout = layout;
          let findIndex = layouts.findIndex((ele) => ele.id === layout.id);
          setActiveSlide(findIndex);
        } else {
          let findIndex = layouts.findIndex((ele) => ele.id === layout.id);
          setActiveSlide(findIndex);
          setCurrentLayout(layout);
        }
        break;
      case Constant.businessLay4Id:
        if (
          !uDataBus.name ||
          uDataBus.name === "" ||
          !uDataBus.mobile ||
          uDataBus.mobile === "" ||
          !uDataBus.website ||
          uDataBus.website === "" ||
          !uDataBus.email ||
          uDataBus.email === "" ||
          !uDataBus.socialMedia ||
          uDataBus.socialMedia === ""
        ) {
          msg = Common.getTranslation(LangKey.businessLay4Msg);
          setVisibleModalMsgbussiness(true);
          setCurLayout = layout;
          let findIndex = layouts.findIndex((ele) => ele.id === layout.id);
          setActiveSlide(findIndex);
        } else {
          let findIndex = layouts.findIndex((ele) => ele.id === layout.id);
          setActiveSlide(findIndex);
          setCurrentLayout(layout);
        }
        break;
      case Constant.businessLay5Id:
        if (
          !uDataBus.name ||
          uDataBus.name === "" ||
          !uDataBus.mobile ||
          uDataBus.mobile === "" ||
          !uDataBus.email ||
          uDataBus.email === "" ||
          !uDataBus.socialMedia ||
          uDataBus.socialMedia === ""
        ) {
          msg = Common.getTranslation(LangKey.businessLay5Msg);
          setVisibleModalMsgbussiness(true);
          setCurLayout = layout;
          let findIndex = layouts.findIndex((ele) => ele.id === layout.id);
          setActiveSlide(findIndex);
        } else {
          let findIndex = layouts.findIndex((ele) => ele.id === layout.id);
          setActiveSlide(findIndex);
          setCurrentLayout(layout);
        }
        break;
      case Constant.businessLay6Id:
        if (
          !uDataBus.name ||
          uDataBus.name === "" ||
          !uDataBus.mobile ||
          uDataBus.mobile === "" ||
          !uDataBus.website ||
          uDataBus.website === "" ||
          !uDataBus.address ||
          uDataBus.address === "" ||
          !uDataBus.socialMedia ||
          uDataBus.socialMedia === ""
        ) {
          msg = Common.getTranslation(LangKey.businessLay6Msg);
          setVisibleModalMsgbussiness(true);
          setCurLayout = layout;
          let findIndex = layouts.findIndex((ele) => ele.id === layout.id);
          setActiveSlide(findIndex);
        } else {
          let findIndex = layouts.findIndex((ele) => ele.id === layout.id);
          setActiveSlide(findIndex);
          setCurrentLayout(layout);
        }
        break;
      case Constant.businessLay7Id:
        if (
          !uDataBus.name ||
          uDataBus.name === "" ||
          !uDataBus.mobile ||
          uDataBus.mobile === "" ||
          !uDataBus.website ||
          uDataBus.website === "" ||
          !uDataBus.socialMedia ||
          uDataBus.socialMedia === "" ||
          !uDataBus.image ||
          uDataBus.image === "" ||
          uDataBus.image.length < 0
        ) {
          msg = Common.getTranslation(LangKey.businessLay7Msg);
          setVisibleModalMsgbussiness(true);
          setCurLayout = layout;
          let findIndex = layouts.findIndex((ele) => ele.id === layout.id);
          setActiveSlide(findIndex);
        } else {
          let findIndex = layouts.findIndex((ele) => ele.id === layout.id);
          setActiveSlide(findIndex);
          setCurrentLayout(layout);
        }
        break;
      case Constant.businessLay8Id:
        if (
          !uDataBus.name ||
          uDataBus.name === "" ||
          !uDataBus.mobile ||
          uDataBus.mobile === "" ||
          !uDataBus.email ||
          uDataBus.email === "" ||
          !uDataBus.socialMedia ||
          uDataBus.socialMedia === "" ||
          !uDataBus.image ||
          uDataBus.image === "" ||
          uDataBus.image.length < 0
        ) {
          msg = Common.getTranslation(LangKey.businessLay8Msg);
          setVisibleModalMsgbussiness(true);
          setCurLayout = layout;
          let findIndex = layouts.findIndex((ele) => ele.id === layout.id);
          setActiveSlide(findIndex);
        } else {
          let findIndex = layouts.findIndex((ele) => ele.id === layout.id);
          setActiveSlide(findIndex);
          setCurrentLayout(layout);
        }
        break;
      case Constant.businessLay9Id:
        if (
          !uDataBus.name ||
          uDataBus.name === "" ||
          !uDataBus.mobile ||
          uDataBus.mobile === "" ||
          !uDataBus.website ||
          uDataBus.website === "" ||
          !uDataBus.socialMedia ||
          uDataBus.socialMedia === "" ||
          !uDataBus.image ||
          uDataBus.image === "" ||
          uDataBus.image.length < 0
        ) {
          msg = Common.getTranslation(LangKey.businessLay9Msg);
          setVisibleModalMsgbussiness(true);
          setCurLayout = layout;
          let findIndex = layouts.findIndex((ele) => ele.id === layout.id);
          setActiveSlide(findIndex);
        } else {
          let findIndex = layouts.findIndex((ele) => ele.id === layout.id);
          setActiveSlide(findIndex);
          setCurrentLayout(layout);
        }
        break;
      case Constant.businessLay10Id:
        if (
          !uDataBus.name ||
          uDataBus.name === "" ||
          !uDataBus.mobile ||
          uDataBus.mobile === "" ||
          !uDataBus.email ||
          uDataBus.email === "" ||
          !uDataBus.socialMedia ||
          uDataBus.socialMedia === "" ||
          !uDataBus.image ||
          uDataBus.image === "" ||
          uDataBus.image.length < 0
        ) {
          msg = Common.getTranslation(LangKey.businessLay10Msg);
          setVisibleModalMsgbussiness(true);
          setCurLayout = layout;
          let findIndex = layouts.findIndex((ele) => ele.id === layout.id);
          setActiveSlide(findIndex);
        } else {
          let findIndex = layouts.findIndex((ele) => ele.id === layout.id);
          setActiveSlide(findIndex);
          setCurrentLayout(layout);
        }
        break;
      case Constant.businessLay11Id:
        if (!uDataBus.name || uDataBus.name === "") {
          msg = Common.getTranslation(LangKey.businessLay11Msg);
          setVisibleModalMsgbussiness(true);
          setCurLayout = layout;
          let findIndex = layouts.findIndex((ele) => ele.id === layout.id);
          setActiveSlide(findIndex);
        } else {
          let findIndex = layouts.findIndex((ele) => ele.id === layout.id);
          setActiveSlide(findIndex);
          setCurrentLayout(layout);
        }
        break;
    }
  };

  const getLayout = (curLayoutId) => {
    switch (curLayoutId) {
      case Constant.businessLay1Id:
        return getLayout1();
      case Constant.businessLay2Id:
        return getLayout2();
      case Constant.businessLay3Id:
        return getLayout3();
      case Constant.businessLay4Id:
        return getLayout4();
      case Constant.businessLay5Id:
        return getLayout5();
      case Constant.businessLay6Id:
        return getLayout6();
      case Constant.businessLay7Id:
        return getLayout7();
      case Constant.businessLay8Id:
        return getLayout8();
      case Constant.businessLay9Id:
        return getLayout9();
      case Constant.businessLay10Id:
        return getLayout10();
      case Constant.businessLay11Id:
        return getLayout11();
    }
  };

  /*
  .##..........###....##....##..#######..##.....##.########..######.
  .##.........##.##....##..##..##.....##.##.....##....##....##....##
  .##........##...##....####...##.....##.##.....##....##....##......
  .##.......##.....##....##....##.....##.##.....##....##.....######.
  .##.......#########....##....##.....##.##.....##....##..........##
  .##.......##.....##....##....##.....##.##.....##....##....##....##
  .########.##.....##....##.....#######...#######.....##.....######.
  */

  const getLayout1 = () => (
    <View style={styles.layLeftViewFooter}>
      <SvgCss
        xml={SvgConstant.leftFooterLayout}
        width="100%"
        height="100%"
        fill={footerColor}
      />

      {userDataBussiness.image ? (
        <FastImage
          onLoadStart={() => {
            if (Constant.businessLay1Id === curLayoutId) {
              setIsUserDesignImageLoad(true);
            }
          }}
          onLoadEnd={() => {
            if (Constant.businessLay1Id === curLayoutId) {
              setIsUserDesignImageLoad(false);
            }
          }}
          source={{ uri: userDataBussiness.image }}
          style={styles.layLeftImgLogo}
          resizeMode={FastImage.resizeMode.contain}
        />
      ) : null}
      {userDataBussiness.name ? (
        <Text style={[styles.layLeftTxtName, { color: footerTextColor }]}>
          {userDataBussiness.name}
        </Text>
      ) : null}
      {userDataBussiness.address ? (
        <View style={styles.layLeftRoot}>
          <View
            style={[styles.layViewIcon, { backgroundColor: footerTextColor }]}
          >
            <Icon
              name="location"
              height={Constant.layIconHeight}
              width={Constant.layIconWidth}
              fill={footerColor}
            />
          </View>
          <Text style={[styles.layLeftTxtAddress, { color: footerTextColor }]}>
            {userDataBussiness.address}
          </Text>
        </View>
      ) : null}
      {userDataBussiness.mobile ? (
        <View style={styles.layLeftBottomMobile}>
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
          <Text style={[styles.layTxtIcon, { color: footerTextColor }]}>
            {userDataBussiness.mobile}
          </Text>
        </View>
      ) : null}
      {userDataBussiness.socialMedia ? (
        <View
          style={[
            styles.layLeftViewSocialMedia,
            {
              color: footerTextColor,
            },
          ]}
        >
          {socialIconList.map((item) => (
            <View
              key={item}
              style={[
                styles.layLeftSocialIconView,
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
          ))}

          <Text style={[styles.layTxtIcon, { color: footerTextColor }]}>
            {userDataBussiness.socialMedia}
          </Text>
        </View>
      ) : null}
    </View>
  );
  const getLayout2 = () => (
    <View style={styles.layRightViewFooter}>
      <SvgCss
        xml={SvgConstant.rightFooterLayout}
        width="100%"
        height="100%"
        fill={footerColor}
      />

      {userDataBussiness.name ? (
        <Text style={[styles.layRightTxtName, { color: footerTextColor }]}>
          {userDataBussiness.name}
        </Text>
      ) : null}

      {userDataBussiness.address ? (
        <View style={styles.layRightRoot}>
          <Text style={[styles.layRightTxtAddress, { color: footerTextColor }]}>
            {userDataBussiness.address}
          </Text>
          <View
            style={[styles.layViewIcon, { backgroundColor: footerTextColor }]}
          >
            <Icon
              name="location"
              height={Constant.layIconHeight}
              width={Constant.layIconWidth}
              fill={footerColor}
            />
          </View>
        </View>
      ) : null}

      {userDataBussiness.mobile ? (
        <View style={styles.layRightBottom}>
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
          <Text style={[styles.layTxtIcon, { color: footerTextColor }]}>
            {userDataBussiness.mobile}
          </Text>
        </View>
      ) : null}

      {userDataBussiness.socialMedia ? (
        <View
          style={[
            styles.layRightViewSocialMedia,
            {
              color: footerTextColor,
            },
          ]}
        >
          {socialIconList.map((item) => (
            <View
              style={[
                styles.layRightSocialIconView,
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
          ))}

          <Text style={[styles.layTxtIcon, { color: footerTextColor }]}>
            {userDataBussiness.socialMedia}
          </Text>
        </View>
      ) : null}
      {userDataBussiness.image ? (
        <FastImage
          onLoadStart={() => {
            if (Constant.businessLay2Id === curLayoutId) {
              setIsUserDesignImageLoad(true);
            }
          }}
          onLoadEnd={() => {
            if (Constant.businessLay2Id === curLayoutId) {
              setIsUserDesignImageLoad(false);
            }
          }}
          source={{ uri: userDataBussiness.image }}
          style={styles.layRightImgLogo}
          resizeMode={FastImage.resizeMode.contain}
        />
      ) : null}
    </View>
  );

  const getLayout3 = () => (
    <View style={styles.layFlatViewFooter}>
      <SvgCss
        xml={SvgConstant.flatFooterLayout}
        width="100%"
        height="100%"
        fill={footerColor}
      />
      {userDataBussiness.name ? (
        <Text style={[styles.layFlatTxtName, { color: footerTextColor }]}>
          {userDataBussiness.name}
        </Text>
      ) : null}
      {userDataBussiness.website ? (
        <View style={styles.layFlatRoot}>
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
          <Text style={[styles.layTxtIcon, { color: footerTextColor }]}>
            {userDataBussiness.website}
          </Text>
        </View>
      ) : null}
      {userDataBussiness.mobile ? (
        <View style={styles.layFlatBottomMobile}>
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
          <Text style={[styles.layTxtIcon, { color: footerTextColor }]}>
            {userDataBussiness.mobile}
          </Text>
        </View>
      ) : null}
      {userDataBussiness.socialMedia ? (
        <View
          style={[
            styles.layFlatViewSocialMedia,
            {
              color: footerTextColor,
            },
          ]}
        >
          {socialIconList.map((item) => (
            <View
              style={[
                styles.layFlatSocialView,
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
          ))}

          <Text style={[styles.layTxtIcon, { color: footerTextColor }]}>
            {userDataBussiness.socialMedia}
          </Text>
        </View>
      ) : null}
    </View>
  );

  const getLayout4 = () => (
    <View style={styles.layFlatViewFooter}>
      <SvgCss
        xml={SvgConstant.flatFooterLayout}
        width="100%"
        height="100%"
        fill={footerColor}
      />

      <View
        style={{
          position: "absolute",
          left: "2%",
          top: "12%",
          width: wp(96),
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {userDataBussiness.name ? (
          <Text
            style={{
              fontSize: Constant.layBigFontSize,
              color: footerTextColor,
            }}
          >
            {userDataBussiness.name}
          </Text>
        ) : null}
      </View>

      <View
        style={[
          styles.layFlatRoot,
          {
            width: "96%",
            justifyContent: "space-between",
          },
        ]}
      >
        {userDataBussiness.website ? (
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
            <Text style={[styles.layTxtIcon, { color: footerTextColor }]}>
              {userDataBussiness.website}
            </Text>
          </View>
        ) : null}
        {userDataBussiness.email ? (
          <View style={[styles.layViewIconRoot]}>
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
            <Text style={[styles.layTxtIcon, { color: footerTextColor }]}>
              {userDataBussiness.email}
            </Text>
          </View>
        ) : null}
      </View>
      {userDataBussiness.mobile ? (
        <View style={styles.layFlatBottomMobile}>
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
          <Text style={[styles.layTxtIcon, { color: footerTextColor }]}>
            {userDataBussiness.mobile}
          </Text>
        </View>
      ) : null}
      {userDataBussiness.socialMedia ? (
        <View
          style={[
            styles.layFlatViewSocialMedia,
            {
              color: footerTextColor,
            },
          ]}
        >
          {socialIconList.map((item) => (
            <View
              style={[
                styles.layFlatSocialView,
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
          ))}

          <Text style={[styles.layTxtIcon, { color: footerTextColor }]}>
            {userDataBussiness.socialMedia}
          </Text>
        </View>
      ) : null}
    </View>
  );
  const getLayout5 = () => (
    <View style={styles.layFlatViewFooter}>
      <SvgCss
        xml={SvgConstant.flatFooterLayout}
        width="100%"
        height="100%"
        fill={footerColor}
      />
      {userDataBussiness.name ? (
        <Text style={[styles.layFlatTxtName, { color: footerTextColor }]}>
          {userDataBussiness.name}
        </Text>
      ) : null}
      {userDataBussiness.email ? (
        <View style={styles.layFlatRoot}>
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
          <Text style={[styles.layTxtIcon, { color: footerTextColor }]}>
            {userDataBussiness.email}
          </Text>
        </View>
      ) : null}

      {userDataBussiness.mobile ? (
        <View style={styles.layFlatBottomMobile}>
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
          <Text style={[styles.layTxtIcon, { color: footerTextColor }]}>
            {userDataBussiness.mobile}
          </Text>
        </View>
      ) : null}
      {userDataBussiness.socialMedia ? (
        <View
          style={[
            styles.layFlatViewSocialMedia,
            {
              color: footerTextColor,
            },
          ]}
        >
          {socialIconList.map((item) => (
            <View
              style={[
                styles.layFlatSocialView,
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
          ))}

          <Text style={[styles.layTxtIcon, { color: footerTextColor }]}>
            {userDataBussiness.socialMedia}
          </Text>
        </View>
      ) : null}
    </View>
  );
  const getLayout6 = () => (
    <View style={styles.layFlatViewFooter}>
      <SvgCss
        xml={SvgConstant.flatFooterLayout}
        width="100%"
        height="100%"
        fill={footerColor}
      />
      {userDataBussiness.name ? (
        <Text style={[styles.layFlatTxtName, { color: footerTextColor }]}>
          {userDataBussiness.name}
        </Text>
      ) : null}
      {userDataBussiness.mobile ? (
        <View style={styles.layFlatTopMobile}>
          <View
            style={[
              styles.layViewIcon,
              {
                backgroundColor: footerTextColor,
              },
            ]}
          >
            <Icon
              name="phone"
              height={Constant.layIconHeight}
              width={Constant.layIconWidth}
              fill={footerColor}
            />
          </View>
          <Text style={[styles.layTxtIcon, { color: footerTextColor }]}>
            {userDataBussiness.mobile}
          </Text>
        </View>
      ) : null}
      {userDataBussiness.address ? (
        <View style={styles.layFlatRoot}>
          <View
            style={[styles.layViewIcon, { backgroundColor: footerTextColor }]}
          >
            <Icon
              name="location"
              height={Constant.layIconHeight}
              width={Constant.layIconWidth}
              fill={footerColor}
            />
          </View>
          <Text style={[styles.layTxtIcon, { color: footerTextColor }]}>
            {userDataBussiness.address}
          </Text>
        </View>
      ) : null}
      {userDataBussiness.website ? (
        <View style={styles.layFlatBottomMobile}>
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
          <Text style={[styles.layTxtIcon, { color: footerTextColor }]}>
            {userDataBussiness.website}
          </Text>
        </View>
      ) : null}
      {userDataBussiness.socialMedia ? (
        <View
          style={[
            styles.layFlatViewSocialMedia,
            {
              color: footerTextColor,
            },
          ]}
        >
          {socialIconList.map((item) => (
            <View
              style={[
                styles.layFlatSocialView,
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
          ))}

          <Text style={[styles.layTxtIcon, { color: footerTextColor }]}>
            {userDataBussiness.socialMedia}
          </Text>
        </View>
      ) : null}
    </View>
  );

  const getLayout7 = () => (
    <View style={styles.layLeftViewFooter}>
      <SvgCss
        xml={SvgConstant.leftFooterLayout}
        width="100%"
        height="100%"
        fill={footerColor}
      />
      {userDataBussiness.image ? (
        <FastImage
          onLoadStart={() => {
            if (Constant.businessLay7Id === curLayoutId) {
              setIsUserDesignImageLoad(true);
            }
          }}
          onLoadEnd={() => {
            if (Constant.businessLay7Id === curLayoutId) {
              setIsUserDesignImageLoad(false);
            }
          }}
          source={{ uri: userDataBussiness.image }}
          style={styles.layLeftImgLogo}
          resizeMode={FastImage.resizeMode.contain}
        />
      ) : null}
      {userDataBussiness.name ? (
        <Text style={[styles.layLeftTxtName, { color: footerTextColor }]}>
          {userDataBussiness.name}
        </Text>
      ) : null}
      {userDataBussiness.website ? (
        <View style={styles.layLeftRoot}>
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
          <Text style={[styles.layTxtIcon, { color: footerTextColor }]}>
            {userDataBussiness.website}
          </Text>
        </View>
      ) : null}
      {userDataBussiness.mobile ? (
        <View style={styles.layLeftBottomMobile}>
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
          <Text style={[styles.layTxtIcon, { color: footerTextColor }]}>
            {userDataBussiness.mobile}
          </Text>
        </View>
      ) : null}
      {userDataBussiness.socialMedia ? (
        <View
          style={[
            styles.layLeftViewSocialMedia,
            {
              color: footerTextColor,
            },
          ]}
        >
          {socialIconList.map((item) => (
            <View
              style={[
                styles.layLeftSocialIconView,
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
          ))}

          <Text style={[styles.layTxtIcon, { color: footerTextColor }]}>
            {userDataBussiness.socialMedia}
          </Text>
        </View>
      ) : null}
    </View>
  );

  const getLayout8 = () => (
    <View style={styles.layLeftViewFooter}>
      <SvgCss
        xml={SvgConstant.leftFooterLayout}
        width="100%"
        height="100%"
        fill={footerColor}
      />
      {userDataBussiness.image ? (
        <FastImage
          onLoadStart={() => {
            if (Constant.businessLay8Id === curLayoutId) {
              setIsUserDesignImageLoad(true);
            }
          }}
          onLoadEnd={() => {
            if (Constant.businessLay8Id === curLayoutId) {
              setIsUserDesignImageLoad(false);
            }
          }}
          source={{ uri: userDataBussiness.image }}
          style={styles.layLeftImgLogo}
          resizeMode={FastImage.resizeMode.contain}
        />
      ) : null}
      {userDataBussiness.name ? (
        <Text style={[styles.layLeftTxtName, { color: footerTextColor }]}>
          {userDataBussiness.name}
        </Text>
      ) : null}
      {userDataBussiness.email ? (
        <View style={styles.layLeftRoot}>
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
          <Text style={[styles.layTxtIcon, { color: footerTextColor }]}>
            {userDataBussiness.email}
          </Text>
        </View>
      ) : null}
      {userDataBussiness.mobile ? (
        <View style={styles.layLeftBottomMobile}>
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
          <Text style={[styles.layTxtIcon, { color: footerTextColor }]}>
            {userDataBussiness.mobile}
          </Text>
        </View>
      ) : null}
      {userDataBussiness.socialMedia ? (
        <View
          style={[
            styles.layLeftViewSocialMedia,
            {
              color: footerTextColor,
            },
          ]}
        >
          {socialIconList.map((item) => (
            <View
              style={[
                styles.layLeftSocialIconView,
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
          ))}

          <Text style={[styles.layTxtIcon, { color: footerTextColor }]}>
            {userDataBussiness.socialMedia}
          </Text>
        </View>
      ) : null}
    </View>
  );

  const getLayout9 = () => (
    <View style={styles.layRightViewFooter}>
      <SvgCss
        xml={SvgConstant.rightFooterLayout}
        width="100%"
        height="100%"
        fill={footerColor}
      />
      {userDataBussiness.name ? (
        <Text style={[styles.layRightTxtName, { color: footerTextColor }]}>
          {userDataBussiness.name}
        </Text>
      ) : null}

      {userDataBussiness.website ? (
        <View style={styles.layRightRoot}>
          <Text
            style={[
              styles.layTxtIcon,
              { color: footerTextColor, marginRight: wp(1.5) },
            ]}
          >
            {userDataBussiness.website}
          </Text>
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
        </View>
      ) : null}
      {userDataBussiness.mobile ? (
        <View style={styles.layRightBottom}>
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
          <Text style={[styles.layTxtIcon, { color: footerTextColor }]}>
            {userDataBussiness.mobile}
          </Text>
        </View>
      ) : null}
      {userDataBussiness.socialMedia ? (
        <View
          style={[
            styles.layRightViewSocialMedia,
            {
              color: footerTextColor,
            },
          ]}
        >
          {socialIconList.map((item) => (
            <View
              style={[
                styles.layRightSocialIconView,
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
          ))}

          <Text style={[styles.layTxtIcon, { color: footerTextColor }]}>
            {userDataBussiness.socialMedia}
          </Text>
        </View>
      ) : null}
      {userDataBussiness.image ? (
        <FastImage
          onLoadStart={() => {
            if (Constant.businessLay9Id === curLayoutId) {
              setIsUserDesignImageLoad(true);
            }
          }}
          onLoadEnd={() => {
            if (Constant.businessLay9Id === curLayoutId) {
              setIsUserDesignImageLoad(false);
            }
          }}
          source={{ uri: userDataBussiness.image }}
          style={styles.layRightImgLogo}
          resizeMode={FastImage.resizeMode.contain}
        />
      ) : null}
    </View>
  );
  const getLayout10 = () => (
    <View style={styles.layRightViewFooter}>
      <SvgCss
        xml={SvgConstant.rightFooterLayout}
        width="100%"
        height="100%"
        fill={footerColor}
      />
      {userDataBussiness.name ? (
        <Text style={[styles.layRightTxtName, { color: footerTextColor }]}>
          {userDataBussiness.name}
        </Text>
      ) : null}
      {userDataBussiness.email ? (
        <View style={styles.layRightRoot}>
          <Text
            style={[
              styles.layTxtIcon,
              { color: footerTextColor, marginRight: wp(1.5) },
            ]}
          >
            {userDataBussiness.email}
          </Text>
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
        </View>
      ) : null}
      {userDataBussiness.mobile ? (
        <View style={styles.layRightBottom}>
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
          <Text style={[styles.layTxtIcon, { color: footerTextColor }]}>
            {userDataBussiness.mobile}
          </Text>
        </View>
      ) : null}
      {userDataBussiness.socialMedia ? (
        <View
          style={[
            styles.layRightViewSocialMedia,
            {
              color: footerTextColor,
            },
          ]}
        >
          {socialIconList.map((item) => (
            <View
              style={[
                styles.layRightSocialIconView,
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
          ))}

          <Text style={[styles.layTxtIcon, { color: footerTextColor }]}>
            {userDataBussiness.socialMedia}
          </Text>
        </View>
      ) : null}
      {userDataBussiness.image ? (
        <FastImage
          onLoadStart={() => {
            if (Constant.businessLay10Id === curLayoutId) {
              setIsUserDesignImageLoad(true);
            }
          }}
          onLoadEnd={() => {
            if (Constant.businessLay10Id === curLayoutId) {
              setIsUserDesignImageLoad(false);
            }
          }}
          source={{ uri: userDataBussiness.image }}
          style={styles.layRightImgLogo}
          resizeMode={FastImage.resizeMode.contain}
        />
      ) : null}
    </View>
  );

  const getLayout11 = () => (
    <View style={styles.layFlatSmallViewFooter}>
      <SvgCss
        xml={SvgConstant.flatFooterSmallLayout}
        width="100%"
        height="100%"
        fill={footerColor}
      />
      {userDataBussiness.name ? (
        <Text style={[styles.lay11TxtName, { color: footerTextColor }]}>
          {userDataBussiness.name}
        </Text>
      ) : null}
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

  // key extractors
  const keyExtractor = useCallback((item) => item.id.toString(), []);

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
        contentContainerStyle={{}}
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
                // setCurrentLayout(item);
              }
            }}
          >
            <View>
              <FastImage
                source={{ uri: item.layoutImage.url }}
                style={{ width: width / 2.5, height: 40 }}
                resizeMode={FastImage.resizeMode.contain}
              />
              {index === activeSlide && (
                <View
                  style={[
                    styles.icnCheck,
                    {
                      backgroundColor: Color.blackTransparant,
                      opacity: 0.6,
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
            </View>
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
          keyExtractor={keyExtractor}
          showsHorizontalScrollIndicator={false}
          ListHeaderComponent={plusBTN()}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              activeOpacity={0.6}
              key={index}
              style={{ ...styles.colorCode, backgroundColor: item.code }}
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
  const socialIcon = () => {
    return (
      <FlatList
        style={styles.socialIconList}
        data={Constant.socialIconList}
        showsHorizontalScrollIndicator={false}
        horizontal
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
                  socialIconList.indexOf(item) < 0 ? null : Color.white,
                opacity: 0.3,
                position: "absolute",
                borderRadius: 50,
              }}
            />
            <Icon
              name={item}
              height={25}
              width={25}
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
      {socialIcon()}
    </View>
  );
  const onViewRef = React.useRef((viewableItems) => {
    if (
      viewableItems &&
      viewableItems.viewableItems !== null &&
      viewableItems.viewableItems.length > 0
    ) {
      curLayoutId = viewableItems.viewableItems[0].item.id;
      checkAndSetLayout(viewableItems.viewableItems[0].item);
      // layRef.current.scrollToIndex({
      //   index: viewableItems.viewableItems[0].index,
      // });
      setActiveSlide(viewableItems.viewableItems[0].index);
    }
  });
  const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 50 });
  const flatlistSliderRef = useRef();

  const onPressBack = () => {
    console.log("colorArr.length", colorArr.length);
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
          : null
      );
    } else {
      Common.showMessage("there is no changes");
    }
    console.log("colorArrcolorArrcolorArrcolorArrcolorArr", colorArr);
  };

  const bussiness = () => {
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
        <View
          style={{
            flex: 1,
            backgroundColor: Color.bgcColor,
          }}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              // marginHorizontal: 6,
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
              visible={visibleModalMsgbussiness}
              toggleVisibleMsgBussiness={toggleVisibleMsgBussiness}
              isLayoutBussiness={true}
              msg={msg}
            />

            <PopUp
              visible={visibleModalAd}
              toggleVisibleAd={toggleVisibleAd}
              isVisibleAd={true}
            />

            <PopUp
              visible={visibleModalForEditBusinessInfo}
              toggleVisibleModalForEditBussinessInfo={
                toggleVisibleModalForEditBussinessInfo
              }
              isVisibleBusinessInfo={true}
            />
            <View style={styles.container}>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                ref={designRef}
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
                        firstTimeColor = true;
                        colorArr = [];
                        // designPackage.type === Constant.typeDesignPackageFree &&
                        hasPro === false && adCounter++;
                        console.log("adCounter", adCounter);
                        showAd();
                        setPkgType(designPackage.type);
                        // if (
                        //   designPackage.type ===
                        //     Constant.typeDesignPackageVip &&
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
                <View style={{ flex: 1 }}>
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
            <View style={{ flex: 1, alignItems: "center" }}>
              {user?.userInfo?.business?.image &&
              user.userInfo.business.image.length > 0 ? (
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
                      Array.isArray(user?.userInfo?.business?.image)
                        ? user.userInfo.business.image
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
                                newImage = user?.userInfo?.business?.image.map(
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
                                  business: {
                                    ...user?.userInfo.business,
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
                  marginHorizontal: 20,
                  marginBottom: Platform.OS === "ios" ? 10 : null,
                }}
              >
                {/* <Button
                  style={{ margin: 5, backgroundColor: Color.transparent }}
                  onPress={() => layoutRef.current.snapTo(0)}
                  isVertical={true}
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
                  onPress={() => colorRef.current.snapTo(0)}
                  isVertical={true}
                  icon={
                    <Icon
                      name="color"
                      height={15}
                      width={15}
                      fill={Color.grey}
                    />
                  }
                  textColor={true}
                >
                  {Common.getTranslation(LangKey.labColorCodeList)}
                </Button>
                {/* <Button
                  style={{ margin: 5, backgroundColor: Color.transparent }}
                  onPress={() => socialRef.current.snapTo(0)}
                  isVertical={true}
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
                  disable={designs == null || designs == undefined}
                  isVertical={true}
                  style={{ margin: 5, backgroundColor: Color.transparent }}
                  onPress={() => {
                    if (user && user !== null) {
                      setModalForEditBusinessInfo(true);
                    } else {
                      Common.showMessage(
                        Common.getTranslation(LangKey.msgCreateAccEdit)
                      );
                    }
                  }}
                  icon={
                    <Icon
                      name="edit"
                      height={14}
                      width={14}
                      fill={Color.grey}
                    />
                  }
                  textColor={true}
                >
                  {Common.getTranslation(LangKey.txtProfile)}
                </Button>

                <Button
                  disable={designs == null || designs == undefined}
                  style={{ margin: 5, backgroundColor: Color.transparent }}
                  isVertical={true}
                  onPress={() => {
                    onPressBack();
                    // if (currentDesign.id === curDesign.id) {
                    //   onReset();
                    // } else {
                    //   setCurrentDesign(curDesign);
                    // }
                    // onReset();
                    // fiilterLayouts();
                    // setSelectedPicker(false);
                  }}
                  icon={
                    <Icon
                      name="reset"
                      height={14}
                      width={14}
                      fill={Color.grey}
                    />
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
                    disable={
                      isdesignImageLoad === true ||
                      isUserDesignImageLoad === true
                    }
                    style={{ backgroundColor: Color.transparent }}
                    isVertical={true}
                    onPress={() => {
                      onClickDownload();
                      setIsdesignImageLoad(true);
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
                    {isdesignImageLoad === true ||
                    isUserDesignImageLoad === true ? (
                      <ActivityIndicator
                        style={{ margin: 5 }}
                        size={20}
                        color={Color.darkBlue}
                      />
                    ) : (
                      Common.getTranslation(LangKey.txtSave)
                    )}
                  </Button>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </>
    );
  };

  return <View style={{ flex: 1 }}>{bussiness()}</View>;
};
export default inject("designStore", "userStore")(observer(BussinessDesign));

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
    alignSelf: "center",
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
    marginHorizontal: 5,
    marginVertical: 5,
    borderRadius: 4,
    overflow: "hidden",
  },
  toProfileImage: {
    width: 80,
    height: 95,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
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
  layTxtIcon: { fontSize: Constant.laySmallFontSize, marginLeft: wp(0.5) },
  // common layout left
  layLeftViewFooter: {
    width: "100%",
    height: "18%",
    bottom: 0,
    position: "absolute",
  },
  layLeftImgLogo: {
    left: "4%",
    width: "16.67%",
    height: "83.34%",
    position: "absolute",
    bottom: "4.62%",
  },
  layLeftTxtName: {
    fontSize: Constant.layBigFontSize,
    position: "absolute",
    left: "23%",
    top: "25%",
  },
  layLeftRoot: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    left: "23%",
    top: "53%",
    width: "70%",
  },
  layLeftTxtAddress: {
    fontSize: Constant.laySmallFontSize,
    maxHeight: "100%",
    paddingLeft: wp(1),
  },
  layLeftBottomMobile: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: "5%",
    left: "23%",
  },
  layLeftViewName: {
    left: "2.50%",
    position: "absolute",
    top: "10%",
    flexDirection: "row",
    alignItems: "baseline",
  },
  layLeftTxtDesignation: { fontSize: Constant.laySmallFontSize, left: 5 },
  layLeftViewWebsiteEmail: {
    position: "absolute",
    left: "2%",
    top: "43%",
    width: "95%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  layLeftViewMobile: {
    position: "absolute",
    bottom: "8%",
    left: "2%",
    flexDirection: "row",
    alignItems: "center",
  },
  layLeftViewSocialMedia: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    bottom: "5%",
    right: "2%",
    position: "absolute",
  },
  layLeftSocialIconView: {
    padding: Constant.layIconViewPadding,
    borderRadius: Constant.layIconViewBorderRadius,
    marginRight: wp(0.5),
    alignContent: "center",
    alignItems: "center",
  },

  // common layout Right
  layRightViewFooter: {
    width: "100%",
    height: "18%",
    bottom: 0,
    position: "absolute",
  },
  layRightTxtName: {
    fontSize: Constant.layBigFontSize,
    textAlign: "right",
    position: "absolute",
    right: "24%",
    top: "28%",
  },
  layRightRoot: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    right: "24%",
    position: "absolute",
    top: "53%",
  },
  layRightTxtAddress: {
    fontSize: Constant.laySmallFontSize,
    maxWidth: "100%",
    textAlign: "right",
    paddingRight: wp(1),
  },
  layRightBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    bottom: "5%",
    left: wp(2),
    position: "absolute",
  },
  layRightTxtMobile: {
    fontSize: Constant.laySmallFontSize,
    paddingLeft: wp(1),
  },
  layRightViewSocialMedia: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    bottom: "5%",
    right: "24%",
    position: "absolute",
  },
  layRightSocialIconView: {
    padding: Constant.layIconViewPadding,
    borderRadius: Constant.layIconViewBorderRadius,
    marginRight: wp(0.5),
    alignContent: "center",
    alignItems: "center",
  },
  layRightImgLogo: {
    right: "4%",
    width: "16.67%",
    height: "83.34%",
    position: "absolute",
    bottom: "4.62%",
  },

  // layout flat styles
  layFlatViewFooter: {
    width: "100%",
    height: "15%",
    bottom: 0,
    position: "absolute",
  },
  layFlatSmallViewFooter: {
    width: "100%",
    height: "10.50%",
    bottom: 0,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  layFlatTxtName: {
    fontSize: Constant.layBigFontSize,
    position: "absolute",
    left: "2%",
    top: "12%",
  },
  layFlatRoot: {
    flexDirection: "row",
    alignItems: "center",
    left: "2%",
    position: "absolute",
    top: "43%",
  },
  layFlatBottomMobile: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    bottom: "8%",
    left: "2%",
    position: "absolute",
  },
  layFlatViewSocialMedia: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    bottom: "8%",
    right: "2%",
    position: "absolute",
  },
  layFlatSocialView: {
    padding: Constant.layIconViewPadding,
    borderRadius: Constant.layIconViewBorderRadius,
    marginRight: wp(0.5),
    alignContent: "center",
    alignItems: "center",
  },
  layFlatTopMobile: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: "2%",
    top: "16%",
  },
  btnClose: {
    width: 25,
    height: 25,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
  },
  lay11TxtName: {
    fontSize: Constant.layBigFontSize,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
});

//setting layoutFields to JSX object
// const objFooter = currentLayout?.layoutFields?.footer
//   ? Common.convertStringToObject(currentLayout?.layoutFields?.footer)
//   : undefined;
// const objName = currentLayout?.layoutFields?.name
//   ? Common.convertStringToObject(currentLayout?.layoutFields?.name)
//   : undefined;
// const objMobile = currentLayout?.layoutFields?.mobile
//   ? Common.convertStringToObject(currentLayout?.layoutFields?.mobile)
//   : undefined;
// const objDesignation = currentLayout?.layoutFields?.designation
//   ? Common.convertStringToObject(currentLayout?.layoutFields?.designation)
//   : undefined;
// const objAddress = currentLayout?.layoutFields?.address
//   ? Common.convertStringToObject(currentLayout?.layoutFields?.address)
//   : undefined;
// const objImage = currentLayout?.layoutFields?.image
//   ? Common.convertStringToObject(currentLayout?.layoutFields?.image)
//   : undefined;
// const objSocialMediaView = currentLayout?.layoutFields?.socialMediaView
//   ? Common.convertStringToObject(currentLayout?.layoutFields?.socialMediaView)
//   : undefined;
// const objSocialMediaLabel = currentLayout?.layoutFields?.socialMediaLabel
//   ? Common.convertStringToObject(
//       currentLayout?.layoutFields?.socialMediaLabel
//     )
//   : undefined;
// const objSocialMediaName = currentLayout?.layoutFields?.socialMediaName
//   ? Common.convertStringToObject(currentLayout?.layoutFields?.socialMediaName)
//   : undefined;
// const objSocialIcon = currentLayout?.layoutFields?.socialIcon
//   ? Common.convertStringToObject(currentLayout?.layoutFields?.socialIcon)
//   : undefined;

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
