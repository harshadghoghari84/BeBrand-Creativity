import React, { useCallback, useEffect, useRef, useState } from "react";
import { toJS } from "mobx";
import { inject, observer } from "mobx-react";
import {
  StyleSheet,
  View,
  FlatList,
  Image,
  Dimensions,
  Text,
  Animated,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  findNodeHandle,
  ScrollView,
  InteractionManager,
  StatusBar,
} from "react-native";
import { useMutation, useQuery } from "@apollo/client";
import Carousel, { Pagination } from "react-native-snap-carousel";
import FastImage from "react-native-fast-image";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { AdMobInterstitial } from "expo-ads-admob";
import { InterstitialAdManager, AdSettings } from "react-native-fbads";
import { isIphoneX, getStatusBarHeight } from "react-native-iphone-x-helper";
import moment from "moment";

// relative path
import GraphqlQuery from "../../utils/GraphqlQuery";
import LangKey from "../../utils/LangKey";
import ProgressDialog from "../common/ProgressDialog";
import Constant from "../../utils/Constant";
import Color from "../../utils/Color";
import Common from "../../utils/Common";
import PopUp from "../../components/PopUp";
import Modal from "../../components/modal";
import Icon from "../../components/svgIcons";
import { fcmService } from "../../FCM/FCMService";
import { localNotificationService } from "../../FCM/LocalNotificationService";
import CustomHeader from "../common/CustomHeader";
import HomeItemDesign from "../common/HomeItemDesign";

const imgWidth = (Dimensions.get("window").width - 50) / 3;

let isFirstTimeListLoad = true;
let adCounter = 0;
let impression = [];
let catTxtMeasure = {};
let txtWidth = [];
let actCat = "FESTIVALS";
let offset = 0;
let CurrentSlide = 0;
let IntervalTime = 6000;
let isFirstTimeIndex = true;
let timerId = true;
let scrollVal = true;

const Home = ({ navigation, designStore, userStore }) => {
  const user = toJS(userStore.user);
  const scrollY = new Animated.Value(0);

  const diffClamp = Animated.diffClamp(scrollY, 0, 40);

  const translateY = diffClamp.interpolate({
    inputRange: [0, 38],
    outputRange: [0, -38],
    extrapolate: "clamp",
  });
  const transY = diffClamp.interpolate({
    inputRange: [0, 40],
    outputRange: [0, -40],
    extrapolate: "clamp",
  });
  const opacity = diffClamp.interpolate({
    inputRange: [0, 40],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const homeDataLoading = toJS(designStore.hdLoading);
  const otherCatLoading = toJS(designStore.uoscLoading);
  const designPackages = toJS(designStore.designPackages);
  // const [scrollVal, setScrollVal] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [modalVisible, setmodalVisible] = useState(false);
  const toggleVisible = () => {
    setmodalVisible(!modalVisible);
  };
  const [hasPro, sethasPro] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [userSubCategoriesAfter, setUserSubCategoriesAfter] = useState([]);
  const [userSubCategoriesBefore, setUserSubCategoriesBefore] = useState([]);
  const [userOtherSubCategoryes, setUserOtherSubCategoryes] = useState([]);
  const [userSubCategories, setUserSubCategories] = useState([]);
  const [totalUserSubCategoriesAfter, setTotalUserSubCategoriesAfter] =
    useState(0);
  const [totalUserSubCategoriesBefore, setTotalUserSubCategoriesBefore] =
    useState(0);

  const [selectedSubCategory, setSelectedSubCategory] = useState();
  const [modalVisibleForModalOffers, setModalVisibleForModalOffers] =
    useState(false);
  const [modalOffer, setModalOffer] = useState([]);
  const [isNewNotification, setIsNewNotification] = useState(false);
  const toggleVisibleForModalOffers = () => {
    setModalVisibleForModalOffers(!modalVisibleForModalOffers);
  };
  const topCatagory = [
    { name: "Festivals", tit: "FESTIVALS" },
    { name: "Quotes", tit: "QUOTES" },
    // { name: "Quote" },
    // { name: "Kids" },
    // { name: "Frame" },
  ];
  const [activeCat, setActiveCat] = useState("Festivals");

  const refCategoryList = useRef(null);
  const catRef = useRef(null);
  const caraRef = useRef(null);

  const isMountedRef = Common.useIsMountedRef();

  const { loading, error, data: imageData } = useQuery(GraphqlQuery.offers);

  useEffect(() => {
    const val = toJS(designStore.isNewNotification);
    setIsNewNotification(val);
  }, [designStore.isNewNotification]);

  const [
    updateAnltData,
    { data: anlData, loading: anlLoading, error: anlErr },
  ] = useMutation(GraphqlQuery.updateAnltData, {
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  const [
    addUserDesignPackage,
    { data: dpkgData, loading: dpkgLoading, error: dpkgErr },
  ] = useMutation(
    Platform.OS === "ios"
      ? GraphqlQuery.addUserDesignPackage
      : GraphqlQuery.addUserDesignPackageRzp,
    {
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    }
  );
  useEffect(() => {
    // stopAutoPlay();
    startAutoPlay();
    return () => {
      stopAutoPlay();
    };
  }, []);

  const startAutoPlay = () => {
    setInterval(() => {
      goToNextPage();
    }, IntervalTime);
  };

  const stopAutoPlay = () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  };

  const goToNextPage = () => {
    if (scrollVal) {
      if (CurrentSlide >= 2) {
        isFirstTimeIndex = true;
        CurrentSlide = 0;
      }
      let index = 0;
      if (isFirstTimeIndex) {
        isFirstTimeIndex = false;
        index = CurrentSlide;
      } else {
        index = ++CurrentSlide;
      }
      caraRef?.current?.scrollToIndex({
        index: index,
        animated: true,
      });

      setActiveSlide(index);
    }
  };

  useEffect(() => {
    AsyncStorage.getItem(Constant.labPurchasedTKNandProdId).then((response) => {
      if (response) {
        let res = JSON.parse(response);
        const obj =
          Platform.OS === "ios"
            ? {
                packageId: res.itemId,
                iosPerchaseReceipt: res.P_recipt,
              }
            : {
                orderId: res.orderId,
                paymentId: res.paymentId,
                paymentSignature: res.paymentSignature,
              };

        addUserDesignPackage({
          variables: obj,
        })
          .then(async ({ data, errors }) => {
            if (errors && errors !== null) {
              Common.showMessage(errors[0].message);
            } else if (
              Platform.OS === "ios"
                ? data.addUserDesignPackage &&
                  data.addUserDesignPackage !== null &&
                  Array.isArray(data.addUserDesignPackage)
                : data.addUserDesignPackageRzp &&
                  data.addUserDesignPackageRzp !== null &&
                  Array.isArray(data.addUserDesignPackageRzp)
            ) {
              await AsyncStorage.removeItem(Constant.labPurchasedTKNandProdId);

              const newUserIos = {
                ...user,

                designPackage: data.addUserDesignPackage
                  ? data.addUserDesignPackage
                  : user.designPackage,
              };
              const newUserAndroid = {
                ...user,

                designPackage: data.addUserDesignPackageRzp
                  ? data.addUserDesignPackageRzp
                  : user.designPackage,
              };
              userStore.setUser(
                Platform.OS === "ios" ? newUserIos : newUserAndroid
              );
              // Common.showMessage(
              //   Common.getTranslation(LangKey.msgPkgPurchaseSucess)
              // );
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  }, []);

  useEffect(() => {
    const mOffer = toJS(designStore.modalOffers);
    if (
      mOffer &&
      mOffer !== null &&
      Array.isArray(mOffer) &&
      mOffer.length > 0
    ) {
      setModalVisibleForModalOffers(true);
      setModalOffer(mOffer);
    }
  }, [designStore.modalOffers]);

  useEffect(() => {
    fcmService.registerAppWithFCM();
    fcmService.register(onRegister, onNotification, onOpenNotification);
    localNotificationService.configure(onOpenNotification);
    localNotificationService.subscribeToTopics(Constant.Offer);
    localNotificationService.subscribeToTopics(Constant.SpecialOffer);
    localNotificationService.subscribeToTopics(Constant.Wishes);
    localNotificationService.subscribeToTopics(Constant.Information);
    function onRegister(token) {}
    function onNotification(remotMessage) {
      let notify = null;
      if (Platform.OS === "ios") {
        notify = remotMessage.data.notification;
      } else {
        notify = remotMessage.notification;
      }

      const options = {
        soundName: "default",
        playSound: true,
        bigPictureUrl: notify.android.imageUrl,
      };

      if (Platform.OS === "android") {
        options.channelId = Constant.Default;
        if (remotMessage.from.includes(Constant.topics)) {
          if (remotMessage.from.includes(Constant.Offer)) {
            options.channelId = Constant.Offer;
          } else if (remotMessage.from.includes(Constant.SpecialOffer)) {
            options.channelId = Constant.SpecialOffer;
          } else if (remotMessage.from.includes(Constant.Wishes)) {
            options.channelId = Constant.Wishes;
          } else if (remotMessage.from.includes(Constant.Information)) {
            options.channelId = Constant.Information;
          }
        }
      }

      localNotificationService.showNotification(
        0,
        notify.title,
        notify.body,
        notify,
        options
      );
    }

    function onOpenNotification(notify) {
      navigation.navigate(Constant.navNotification);
    }
    return () => {
      fcmService.unRegister();
      localNotificationService.unregister();
    };
  }, []);

  useEffect(() => {
    const analtdata = toJS(designStore.anltDataObj);

    if (user && user !== null) {
      if (
        analtdata.imp &&
        analtdata.imp !== null &&
        analtdata.imp.length > 0 &&
        analtdata.vie &&
        analtdata.vie !== null &&
        analtdata.vie.length > 0
      ) {
        updateAnltData({
          variables: {
            imperssion: analtdata.imp,
            view: analtdata.vie,
          },
        })
          .then(({ data, errors }) => {
            if (errors && errors !== null) {
            }
            if (data && data !== null) {
              AsyncStorage.removeItem(Constant.prfImpression);
              AsyncStorage.removeItem(Constant.prfViewDesigns);
            }
          })
          .catch((erre) => {
            console.log(erre);
          });
      }
    }
  }, [designStore.anltDataObj]);

  useEffect(() => {
    AsyncStorage.getItem(Constant.prfUserloginTime)
      .then((res) => {
        if (res && res !== null) {
          designStore.setUserNotificationTime(res);
          return;
        } else {
          AsyncStorage.setItem(Constant.prfUserloginTime, new Date().toString())
            .then(() => {
              designStore.setUserNotificationTime(new Date().toString());
            })
            .catch((err) => console.log("err", err));
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    isMountedRef.current && sethasPro(userStore.hasPro);
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

  useEffect(() => {
    if (isMountedRef.current) {
      if (isFirstTimeListLoad) {
        designStore.loadHomeData();
      }
    }
  }, []);

  useEffect(() => {
    if (isMountedRef.current) {
      const afterCategory = toJS(designStore.userSubCategoriesAfter);

      if (userSubCategoriesAfter.length <= afterCategory.length) {
        setUserSubCategoriesAfter(afterCategory);
      }
    }
  }, [designStore.userSubCategoriesAfter]);

  useEffect(() => {
    if (isMountedRef.current) {
      const beforeCatragory = toJS(designStore.userSubCategoriesBefore);
      setUserSubCategoriesBefore(beforeCatragory);
    }
  }, [designStore.userSubCategoriesBefore]);

  useEffect(() => {
    if (isMountedRef.current) {
      const otherSubCatagory = toJS(designStore.userOtherSubCategories);

      setUserOtherSubCategoryes(otherSubCatagory);
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
  }, [userSubCategoriesAfter, userSubCategoriesBefore, userOtherSubCategoryes]);

  useEffect(() => {
    isMountedRef.current &&
      setTotalUserSubCategoriesAfter(designStore.totalUserSubCategoriesAfter);
  }, [designStore.totalUserSubCategoriesAfter]);

  useEffect(() => {
    isMountedRef.current &&
      setTotalUserSubCategoriesBefore(designStore.totalUserSubCategoriesBefore);
  }, [designStore.totalUserSubCategoriesBefore]);

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

  const fbAd = async () => {
    AdSettings.setLogLevel("debug");

    AdSettings.addTestDevice(AdSettings.currentDeviceHash);
    const requestedStatus = await AdSettings.requestTrackingPermission();

    if (requestedStatus === "authorized" || requestedStatus === "unavailable") {
      AdSettings.setAdvertiserIDCollectionEnabled(true);

      // Both calls are not related to each other
      // FB won’t deliver any ads if this is set to false or not called at all.
      AdSettings.setAdvertiserTrackingEnabled(true);
    }
  };

  const fbShowAd = () => {
    InterstitialAdManager.showAd(Constant.InterstitialAdPlacementId)
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
  };

  // const onFetchMorePressed = async () => {
  //   designStore.loadHomeData();
  // };

  // const loadMoreAfterSubCategories = () => {
  //   if (designStore.ahdLoading === false) {
  //     if (activeCat === "Festivals") {
  //       const length = userSubCategoriesAfter.length;
  //       totalUserSubCategoriesAfter > length &&
  //         designStore.loadMoreAfterSubCategories(length);
  //       [];
  //     }
  //   }
  // };

  // const loadMoreBeforeSubCategories = (topNum) => {
  //   if (topNum === 0) {
  //     if (designStore.ahdLoading === false) {
  //       const length = userSubCategoriesBefore.length;
  //       totalUserSubCategoriesBefore > length &&
  //         designStore.loadMoreBeforeSubCategories(length);
  //       [];
  //     }
  //   }
  // };

  const loadMoreDesigns = async (subCategoryId) => {
    const index = userSubCategories.findIndex(
      (item) => item.id === subCategoryId
    );
    const subCategory = userSubCategories[index];
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
      const type =
        index < userSubCategoriesBefore.length
          ? Constant.userSubCategoryTypeBefore
          : Constant.userSubCategoryTypeAfter;

      subCategory.totalDesign > designLen &&
        (await designStore.loaduserDesigns(
          subCategory.id,
          designLen,
          type,
          hasPro
        ));
    }
  };

  // getItemLayouts for flatlists
  // const getItemLayoutsCategory = useCallback((data, index) => {
  //   return {
  //     length: Constant.homeItemSubCategoryWidth,
  //     offset: Constant.homeItemSubCategoryWidth * index,
  //     index,
  //   };
  // }, []);

  const getItemLayoutsCaraousal = useCallback((data, index) => {
    return {
      length: SLIDER_WIDTH,
      offset: SLIDER_WIDTH * index,
      index,
    };
  }, []);

  // const onLayoutCats = useCallback((event) => {
  //   catTxtMeasure = event.nativeEvent.layout;
  //   txtWidth.push(catTxtMeasure);
  // }, []);

  const showAd = () => {
    console.log("adCounter", adCounter);

    if (hasPro === false && adCounter && adCounter >= Constant.addCounter) {
      AdMobInterstitial.showAdAsync().catch((error) => {
        Platform.OS === "android" ? fbShowAd() : null;
      });
      adCounter = 0;
    }
  };

  const onDesignClick = async (designs, packageType, design, desIndex) => {
    hasPro === false && adCounter++;
    showAd();
    // if (packageType === Constant.typeDesignPackageFree) {
    //   // setmodalVisible(true);
    // }

    navigation.navigate(Constant.navDesign, {
      designs: designs,
      curDesign: design,
      curPackageType: packageType,
      curItemIndex: desIndex,
    });
  };

  // const setSubCategoryindex = () => {
  //   if (activeCat === "Quotes") {
  //     if (
  //       refCategoryList &&
  //       refCategoryList.current.scrollToIndex &&
  //       userSubCategories &&
  //       userSubCategories.length > 0
  //     ) {
  //       const index =
  //         userSubCategories.length > userOtherSubCategoryes.length
  //           ? userOtherSubCategoryes.length
  //           : userOtherSubCategoryes.length - 1;

  //       refCategoryList.current.scrollToIndex({
  //         index: 0,
  //       });

  //       setSelectedSubCategory(0);

  //       if (
  //         !userSubCategories[0]?.totalDesign.length > 0 &&
  //         !userSubCategories[0]?.designs.length > 0
  //       ) {
  //         loadMoreDesigns(userSubCategories[0]?.id);
  //       }
  //     }
  //   } else {
  //     if (
  //       refCategoryList &&
  //       refCategoryList.current.scrollToIndex &&
  //       userSubCategoriesBefore &&
  //       userSubCategoriesBefore.length > 0
  //     ) {
  //       const index =
  //         userSubCategories.length > userSubCategoriesBefore.length
  //           ? userSubCategoriesBefore.length
  //           : userSubCategoriesBefore.length - 1;

  //       console.log("scrioll in");

  //       refCategoryList.current.scrollToIndex({
  //         index: index,
  //       });

  //       console.log("scrioll out");
  //       setSelectedSubCategory(index);
  //     }
  //   }
  // };

  const SLIDER_WIDTH = Dimensions.get("window").width;

  const renderImages = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (item.link.linkType === Constant.navPro) {
            navigation.navigate(
              Platform.OS === "android"
                ? Constant.titPrimium
                : Constant.titPrimiumIos
            );
          } else {
            navigation.navigate(item.link.linkType, {
              title: item.link.linkData,
            });
          }
        }}
        activeOpacity={0.8}
      >
        <FastImage
          source={{ uri: item.image.url }}
          style={{ height: wp(25), width: SLIDER_WIDTH }}
          resizeMode={FastImage.resizeMode.cover}
        />
      </TouchableOpacity>
    );
  };

  const pagination = () => {
    return (
      <Pagination
        dotsLength={imageData?.offers ? imageData.offers.length : 0}
        activeDotIndex={activeSlide}
        containerStyle={{
          alignSelf: "center",
          paddingTop: 1,
          paddingBottom: 5,
          position: "absolute",
          bottom: -15,
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

  const keyGenerator = Math.random().toString(36).substr(2, 9);
  const slider = () => {
    return (
      <View
        style={{
          // borderTopColor: Color.bgcColor,
          // borderTopWidth: 5,
          backgroundColor: Color.white,
          marginBottom: 10,
        }}
      >
        <View
          style={{
            marginVertical: 5,
            marginHorizontal: 20,
            height: wp(25),
            borderRadius: 5,
            overflow: "hidden",
          }}
        >
          <FlatList
            ref={caraRef}
            data={imageData?.offers}
            keyExtractor={(item, index) => keyGenerator}
            pagingEnabled
            horizontal={true}
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            getItemLayout={getItemLayoutsCaraousal}
            renderItem={(item, index) => renderImages(item)}
          />
          {/* <Carousel
            data={imageData?.offers}
            renderItem={renderImages}
            initialNumToRender={1}
            maxToRenderPerBatch={1}
            keyExtractor={() => keyGenerator}
            sliderWidth={SLIDER_WIDTH}
            itemWidth={SLIDER_WIDTH}
            autoplay={true}
            autoplayInterval={6000}
            loop
            onSnapToItem={(index) => setActiveSlide(index)}
            inactiveSlideScale={1}
          /> */}
        </View>
        {pagination()}
      </View>
    );
  };

  const bottom = [
    { icon: "postprofile" },
    { icon: "design" },
    { icon: "package" },
    { icon: "notification" },
    { icon: "language" },
  ];

  const toggleVisibleLanguage = () => {
    setVisibleModal(!visibleModal);
  };

  const onPressName = (curIndex) => {
    if (curIndex === 0) {
      if (user && user !== null) {
        navigation.navigate(Constant.navProfile, {
          title: Constant.titPersonalProfile,
        });
      } else {
        Common.showMessage(Common.getTranslation(LangKey.msgCreateAcc));
      }
    } else if (curIndex === 1) {
      if (user && user !== null) {
        navigation.navigate(Constant.navDesigns);
      } else {
        Common.showMessage(Common.getTranslation(LangKey.msgCreateAcc));
      }
    } else if (curIndex === 2) {
      if (user && user !== null) {
        navigation.navigate(Constant.navPackage);
      } else {
        Common.showMessage(Common.getTranslation(LangKey.msgCreateAcc));
      }
    } else if (curIndex === 3) {
      if (user && user !== null) {
        navigation.navigate(Constant.navNotification);
      } else {
        Common.showMessage(Common.getTranslation(LangKey.msgCreateAcc));
      }
    } else if (curIndex === 4) {
      setVisibleModal(true);
    }
  };

  // key extractors
  const keyExtractor = useCallback((item) => item.id.toString(), []);

  const renderBottom = () => {
    return (
      <View
        style={{
          backgroundColor: Color.bgcColor,
          borderTopColor: Color.blackTrans,
          borderTopWidth: 0.7,
        }}
      >
        <Modal visible={visibleModal} toggleVisible={toggleVisibleLanguage} />

        <FlatList
          bounces={false}
          data={bottom}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.bottomStyle}
          horizontal={true}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                activeOpacity={0.6}
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => {
                  onPressName(index);
                }}
              >
                <Icon
                  name={item.icon}
                  fill={Color.borderColor}
                  height={22}
                  width={22}
                />
                {item.icon === "notification" && (
                  <>
                    {isNewNotification && (
                      <View
                        style={{
                          height: 9,
                          width: 9,
                          backgroundColor: Color.primary,
                          borderRadius: 5,
                          borderColor: Color.bgcColor,
                          borderWidth: 1,
                          position: "absolute",
                          top: 10,
                          right: 2,
                        }}
                      />
                    )}
                  </>
                )}
              </TouchableOpacity>
            );
          }}
        />
      </View>
    );
  };
  const onPressCat = (curCat, tit) => {
    setActiveCat(curCat);
    actCat = curCat;
    designStore.loadUserOtherSubCategories(0, Constant.topCatQuotes);
    if (actCat == curCat) {
      isFirstTimeListLoad = true;

      if (tit === Constant.topCatQuotes) {
        if (
          userOtherSubCategoryes &&
          userOtherSubCategoryes !== null &&
          userOtherSubCategoryes.length > 0
        ) {
          setUserSubCategories(userOtherSubCategoryes);
        }
      } else if (tit === Constant.topCatFestival) {
        setUserSubCategories([
          // ...userSubCategoriesBefore,
          ...userSubCategoriesAfter,
        ]);
      }
    }
  };
  const viewMoreDesigns = (designs, desIndex) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(Constant.navMoreDesigns, {
            designs: designs,
            curItemIndex: desIndex,
            activeCat: activeCat,
          });
        }}
        style={{
          height: imgWidth,
          width: imgWidth,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            height: 50,
            width: 50,
            borderRadius: 25,
            backgroundColor: Color.bgcColor,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text>{">>"}</Text>
        </View>
        <Text>View More</Text>
      </TouchableOpacity>
    );
  };
  const itemSaprater = () => {
    return (
      <View
        style={{
          backgroundColor: Color.bgcColor,
          height: 5,
        }}
      />
    );
  };
  /*
  ..######...#######..##.....##.########...#######..##....##....###....##....##.########
  .##....##.##.....##.###...###.##.....##.##.....##.###...##...##.##...###...##....##...
  .##.......##.....##.####.####.##.....##.##.....##.####..##..##...##..####..##....##...
  .##.......##.....##.##.###.##.########..##.....##.##.##.##.##.....##.##.##.##....##...
  .##.......##.....##.##.....##.##........##.....##.##..####.#########.##..####....##...
  .##....##.##.....##.##.....##.##........##.....##.##...###.##.....##.##...###....##...
  ..######...#######..##.....##.##.........#######..##....##.##.....##.##....##....##...
  */
  return (
    <SafeAreaView style={styles.containerMain}>
      <PopUp
        visible={modalVisible}
        toggleVisible={toggleVisible}
        isPurchased={true}
      />
      <ProgressDialog
        visible={homeDataLoading ? homeDataLoading : otherCatLoading}
        dismissable={false}
        message={Common.getTranslation(LangKey.labLoading)}
      />
      <PopUp
        visible={modalVisibleForModalOffers}
        modalOfferData={modalOffer}
        toggleVisibleForModaloffer={toggleVisibleForModalOffers}
        isModalOffers={true}
      />
      {/* <SafeAreaView
        style={{
          // backgroundColor: Color.white,
          height: Platform.OS === "ios" ? 70 : 40,
        }}
      > */}
      <Animated.View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: Platform.OS === "ios" ? getStatusBarHeight() : 0,
          zIndex: 9999,
          opacity,
          transform: [{ translateY }],
        }}
      >
        <CustomHeader
          langauge={true}
          notification={true}
          // position={true}
          bottomBorder={true}
          bePrem={true}
          menu={true}
          isTtileImage={true}
          navigation={navigation}
        />
      </Animated.View>
      {/* </SafeAreaView> */}
      <Animated.View
        style={{
          transform: [{ translateY: transY }],
          position: "absolute",
          left: 0,
          right: 0,
          top: Platform.OS === "ios" ? getStatusBarHeight() + 40 : 40,
          zIndex: 999,
        }}
      >
        <View
          style={{
            backgroundColor: Color.white,
            borderBottomColor: Color.blackTrans,
            borderBottomWidth: 0.5,
          }}
        >
          <FlatList
            ref={catRef}
            data={topCatagory}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            contentContainerStyle={{
              flex: 1,
            }}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  disabled={activeCat === item.name}
                  onPress={() => onPressCat(item.name, item.tit)}
                >
                  <View style={{ alignItems: "center" }}>
                    <View
                      onLayout={(event) => {
                        if (!txtWidth[index]) {
                          let catTxtMeasure = {};
                          catTxtMeasure = event.nativeEvent.layout;
                          txtWidth[index] = catTxtMeasure;
                        }
                      }}
                      style={{ marginHorizontal: 15 }}
                    >
                      <Text
                        style={{
                          fontSize: 15,
                          color:
                            activeCat === item.name
                              ? Color.darkBlue
                              : Color.grey,
                          paddingVertical: 8,
                        }}
                      >
                        {item.name}
                      </Text>
                      {activeCat === item.name ? (
                        <View
                          style={{
                            height: 3,
                            borderTopLeftRadius: 5,
                            borderTopRightRadius: 5,
                            width: txtWidth[index]?.width,
                            // width: 82.5,
                            backgroundColor:
                              activeCat === item.name
                                ? Color.darkBlue
                                : Color.grey,
                          }}
                        />
                      ) : null}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
        {/* <FlatList
          horizontal
          ref={refCategoryList}
          data={userSubCategories}
          extraData={selectedSubCategory}
          showsHorizontalScrollIndicator={false}
          ListFooterComponent={
            designStore.ahdLoading ? (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ActivityIndicator size={20} color={Color.primary} />
              </View>
            ) : null
          }
          style={{
            paddingHorizontal: 10,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.18,
            shadowRadius: 1.0,
            elevation: 1,
            backgroundColor: Color.white,
          }}
          maxToRenderPerBatch={3}
          windowSize={10}
          bounces={false}
          onEndReached={() => loadMoreAfterSubCategories()}
          keyExtractor={keyExtractor}
          onContentSizeChange={() => {
            if (isFirstTimeListLoad) {
              isFirstTimeListLoad = false;
              setSubCategoryindex();
            }
          }}
          onLayout={() => {
            if (isFirstTimeListLoad === false) {
              setSubCategoryindex();
            }
          }}
          getItemLayout={getItemLayoutsCategory}
          renderItem={({ item, index }) => {
            return (
              <ItemSubCategory
                item={item}
                index={index}
                isSelectedId={selectedSubCategory}
                onSelect={(itemId) => {
                  adCounter++;
                  setSelectedSubCategory(itemId);
                  item.totalDesign > 0 &&
                    item.designs.length === 0 &&
                    loadMoreDesigns(item.id);
                  designStore.setDesignLang(Constant.designLangCodeAll);
                  showAd();
                }}
              />
            );
          }}
        /> */}
      </Animated.View>
      <Animated.FlatList
        ListHeaderComponent={
          imageData?.offers &&
          imageData?.offers !== null &&
          imageData?.offers.length > 0
            ? slider()
            : null
        }
        ref={refCategoryList}
        data={userSubCategories}
        bounces={false}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => itemSaprater()}
        contentContainerStyle={styles.listSubCategoryDesign}
        // onScroll={Animated.event(
        //   [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        //   { useNativeDriver: true }
        // )}
        onScroll={(e) => {
          var currentOffset = e.nativeEvent.contentOffset.y;
          var direction = currentOffset > offset ? "down" : "up";
          if (offset < currentOffset) {
            scrollVal = false;
          } else {
            scrollVal = true;
          }
          // offset = currentOffset;
          scrollY.setValue(e.nativeEvent.contentOffset.y);
        }}
        keyExtractor={(item, index) => `${item.id + index}`}
        renderItem={({ item, index }) => {
          return (
            <View
              style={{
                // marginHorizontal: 10,
                backgroundColor: "white",
                marginVertical: 5,
              }}
            >
              {index === 0 && (
                <View style={{ backgroundColor: Color.bgcColor, height: 5 }} />
              )}
              <Text style={{ ...styles.date, color: Color.black }}>
                {`${moment(new Date(item.endDate)).format("DD MMM")} - ${
                  item.name
                }`}
              </Text>

              <FlatList
                data={item.designs}
                keyExtractor={keyExtractor}
                bounces={false}
                horizontal
                contentContainerStyle={{ paddingHorizontal: 10 }}
                ListFooterComponent={viewMoreDesigns(item.designs, index)}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item: design, index: desIndex }) => {
                  const designPackage = designPackages.find(
                    (item) => item.id === design.package
                  );
                  return (
                    <HomeItemDesign
                      designs={item.designs}
                      design={design}
                      packageType={designPackage.type}
                      desIndex={desIndex}
                      onDesignClick={onDesignClick}
                    />
                  );
                }}
              />
            </View>
          );
        }}
      />
      {/* <View style={styles.containerDesignList}>
        {userSubCategories &&
        selectedSubCategory !== undefined &&
        userSubCategories[selectedSubCategory]?.totalDesign > 0 &&
        userSubCategories[selectedSubCategory].designs.length > 0 ? (
          <>
            <Animated.FlatList
              key={2}
              numColumns={2}
              ListHeaderComponent={
                imageData?.offers &&
                imageData?.offers !== null &&
                imageData?.offers.length > 0
                  ? slider()
                  : null
              }
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listSubCategoryDesign}
              onViewableItemsChanged={onViewRef.current}
              viewabilityConfig={viewConfigRef.current}
              data={userSubCategories[selectedSubCategory].designs}
              keyExtractor={keyExtractor}
              legacyImplementation={false}
              maxToRenderPerBatch={6}
              windowSize={10}
              bounces={false}
              scrollEventThrottle={16}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: true }
              )}
              // onScroll={(e) => {
              //   // setScrollVal(e.nativeEvent.contentOffset.y);
              //   var currentOffset = e.nativeEvent.contentOffset.y;
              //   var direction = currentOffset > offset ? "down" : "up";
              //   if (direction === "down") {
              //     setScrollVal(false);
              //   } else if (direction === "up") {
              //     setScrollVal(true);
              //   }
              //   offset = currentOffset;
              //   scrollY.setValue(e.nativeEvent.contentOffset.y);
              // }}
              onEndReached={() => {
                !designStore.udLoading &&
                  loadMoreDesigns(userSubCategories[selectedSubCategory].id);
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
            {designStore.udLoading || otherCatLoading ? (
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
        ) : (
          <View style={styles.containerNoDesign}>
            {homeDataLoading ? null : designStore.udLoading ? (
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
        )}
      </View> */}
      {renderBottom()}
    </SafeAreaView>
  );
};
export default inject("designStore", "userStore")(observer(Home));

const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    backgroundColor: Color.white,
  },
  containerSub: {
    // flex: 1,
    backgroundColor: Color.white,
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
  listAllDesign: { paddingTop: 10 },
  listHorizontalDesign: { marginBottom: 10 },

  listSubCategoryDesign: {
    backgroundColor: Color.white,
    flexGrow: 1,
    paddingTop:
      Platform.OS === "ios"
        ? isIphoneX()
          ? getStatusBarHeight() + 40
          : getStatusBarHeight() + 40
        : 85,
  },
  imgAllDesign: {
    width: 150,
    height: 150,
    marginLeft: 10,
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
  bottomStyle: {
    flex: 1,
    height: 50,
    justifyContent: "space-around",
    flexDirection: "row",
  },
  image: {
    width: Constant.ItemSubCategoryWidth,
    height: 60,
    borderRadius: 5,
    alignItems: "center",
    // alignSelf: "center",
  },
  date: {
    fontSize: 12,
    paddingVertical: 8,
    marginLeft: 10,
  },
});
