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
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useMutation, useQuery } from "@apollo/client";
import Carousel, { Pagination } from "react-native-snap-carousel";
import FastImage from "react-native-fast-image";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { AdMobInterstitial } from "expo-ads-admob";
import { InterstitialAdManager, AdSettings } from "react-native-fbads";

// relative path
import GraphqlQuery from "../../utils/GraphqlQuery";
import LangKey from "../../utils/LangKey";
import ProgressDialog from "../common/ProgressDialog";
import ItemSubCategory from "./ItemSubCategory";
import Constant from "../../utils/Constant";
import Color from "../../utils/Color";
import Common from "../../utils/Common";
import ItemDesign from "../common/ItemDesign";
import PopUp from "../../components/PopUp";
import { fcmService } from "../../FCM/FCMService";
import { localNotificationService } from "../../FCM/LocalNotificationService";

const windowWidth = Dimensions.get("window").width;
const imgWidth = (windowWidth - 30) / 2;

let isFirstTimeListLoad = true;
let adCounter = 0;
let impression = [];
const Home = ({ navigation, designStore, userStore }) => {
  const user = toJS(userStore.user);

  const [modalVisibleForModalOffers, setModalVisibleForModalOffers] =
    useState(false);
  const toggleVisibleForModalOffers = () => {
    setModalVisibleForModalOffers(!modalVisibleForModalOffers);
  };

  const [scrollY, setScrollY] = useState();
  const [activeSlide, setActiveSlide] = useState(0);
  const [modalVisible, setmodalVisible] = useState(false);
  const toggleVisible = () => {
    setmodalVisible(!modalVisible);
  };
  const [hasPro, sethasPro] = useState(false);
  const homeDataLoading = toJS(designStore.hdLoading);
  const designPackages = toJS(designStore.designPackages);
  const userSubCategoriesHome = toJS(designStore.userSubCategoriesHome);
  const [modalOffer, setModalOffer] = useState([]);
  const [userSubCategoriesAfter, setUserSubCategoriesAfter] = useState([]);
  const [userSubCategoriesBefore, setUserSubCategoriesBefore] = useState([]);
  const [userSubCategories, setUserSubCategories] = useState([]);
  const [totalUserSubCategoriesAfter, setTotalUserSubCategoriesAfter] =
    useState(0);
  const [totalUserSubCategoriesBefore, setTotalUserSubCategoriesBefore] =
    useState(0);

  const [selectedSubCategory, setSelectedSubCategory] = useState();

  const refCategoryList = useRef(null);

  const isMountedRef = Common.useIsMountedRef();

  const { loading, error, data: imageData } = useQuery(GraphqlQuery.offers);
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

  const [
    updateAnltData,
    { data: anlData, loading: anlLoading, error: anlErr },
  ] = useMutation(GraphqlQuery.updateAnltData, {
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  useEffect(() => {
    AsyncStorage.getItem(Constant.labPurchasedTKNandProdId).then((response) => {
      if (response) {
        console.log("RESPONSE", response);
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
    fcmService.registerAppWithFCM();
    fcmService.register(onRegister, onNotification, onOpenNotification);
    localNotificationService.configure(onOpenNotification);
    localNotificationService.subscribeToTopics(Constant.Offer);
    localNotificationService.subscribeToTopics(Constant.SpecialOffer);
    localNotificationService.subscribeToTopics(Constant.Wishes);
    localNotificationService.subscribeToTopics(Constant.Information);
    function onRegister(token) {
      console.log("on register token: ", token);
    }
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
      setUserSubCategories([
        ...userSubCategoriesBefore,
        ...userSubCategoriesAfter,
      ]);
      // if (userSubCategoriesBefore && userSubCategoriesAfter) {
      //   console.log("main if");
      //   setUserSubCategories([
      //     ...userSubCategoriesBefore,
      //     ...userSubCategoriesAfter,
      //   ]);
      // } else if (userSubCategoriesBefore) {
      //   console.log("else if 1");
      //   setUserSubCategories([...userSubCategoriesBefore]);
      // } else if (userSubCategoriesAfter) {
      //   console.log("else if 2");
      //   setUserSubCategories([...userSubCategoriesAfter]);
      // }
    }
  }, [userSubCategoriesAfter, userSubCategoriesBefore]);

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
    console.log("AdSettings.currentDeviceHash", AdSettings.currentDeviceHash);
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

  const onFetchMorePressed = async () => {
    designStore.loadHomeData();
  };

  const loadMoreAfterSubCategories = () => {
    if (designStore.ahdLoading === false) {
      const length = userSubCategoriesAfter.length;
      totalUserSubCategoriesAfter > length &&
        designStore.loadMoreAfterSubCategories(length);
      [];
    }
  };

  const loadMoreBeforeSubCategories = (topNum) => {
    if (topNum === 0) {
      if (designStore.ahdLoading === false) {
        const length = userSubCategoriesBefore.length;
        totalUserSubCategoriesBefore > length &&
          designStore.loadMoreBeforeSubCategories(length);
        [];
      }
    }
  };

  const loadMoreDesigns = async (subCategoryId) => {
    const index = userSubCategories.findIndex(
      (item) => item.id === subCategoryId
    );

    const subCategory = userSubCategories[index];
    const type =
      index < userSubCategoriesBefore.length
        ? Constant.userSubCategoryTypeBefore
        : Constant.userSubCategoryTypeAfter;

    const designLen = subCategory.designs.length;
    subCategory.totalDesign > designLen &&
      (await designStore.loaduserDesigns(
        subCategory.id,
        designLen,
        type,
        hasPro
      ));
  };

  // key extractors
  const keyExtractor = useCallback((item) => item.id.toString(), []);

  // getItemLayouts for flatlists
  const getItemLayoutsCategory = useCallback(
    (data, index) => ({
      length: Constant.homeItemSubCategoryWidth,
      offset: Constant.homeItemSubCategoryWidth * index,
      index,
    }),
    []
  );

  const showAd = () => {
    console.log("adCounter", adCounter);

    if (hasPro === false && adCounter && adCounter >= Constant.addCounter) {
      console.log("inside if");
      AdMobInterstitial.showAdAsync().catch((error) => fbShowAd());
      adCounter = 0;
    }
  };

  const onDesignClick = async (packageType, design, desIndex) => {
    hasPro === false && adCounter++;
    showAd();
    // if (packageType === Constant.typeDesignPackageFree) {
    //   // setmodalVisible(true);
    // }

    navigation.navigate(Constant.navDesign, {
      designs: userSubCategories[selectedSubCategory].designs,
      curDesign: design,
      curPackageType: packageType,
      curItemIndex: desIndex,
    });
  };

  const setSubCategoryindex = () => {
    if (
      refCategoryList &&
      refCategoryList.current.scrollToIndex &&
      userSubCategoriesBefore &&
      userSubCategoriesBefore.length > 0
    ) {
      const index =
        userSubCategories.length > userSubCategoriesBefore.length
          ? userSubCategoriesBefore.length
          : userSubCategoriesBefore.length - 1;

      refCategoryList.current.scrollToIndex({
        index: index,
      });
      setSelectedSubCategory(index);
    }
  };

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
          style={{ height: wp(25) }}
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

  const slider = () => {
    return (
      <>
        <View
          style={{
            marginVertical: 10,
            marginHorizontal: 10,
            height: wp(25),
            borderRadius: 5,
            overflow: "hidden",
          }}
        >
          <Carousel
            data={imageData?.offers}
            renderItem={renderImages}
            sliderWidth={SLIDER_WIDTH}
            itemWidth={SLIDER_WIDTH}
            autoplay={true}
            autoplayInterval={6000}
            loop
            onSnapToItem={(index) => setActiveSlide(index)}
            inactiveSlideScale={1}
          />
        </View>
        {pagination()}
      </>
    );
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
      <ProgressDialog
        visible={homeDataLoading}
        dismissable={false}
        message={Common.getTranslation(LangKey.labLoading)}
      />
      <PopUp
        visible={modalVisible}
        toggleVisible={toggleVisible}
        isPurchased={true}
      />
      <PopUp
        visible={modalVisibleForModalOffers}
        modalOfferData={modalOffer}
        toggleVisibleForModaloffer={toggleVisibleForModalOffers}
        isModalOffers={true}
      />

      <View
        style={{
          backgroundColor: Color.white,
          width: "100%",
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
        <FlatList
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
          contentContainerStyle={{
            paddingHorizontal: 10,
          }}
          onEndReached={() => loadMoreAfterSubCategories()}
          keyExtractor={keyExtractor}
          onContentSizeChange={() => {
            if (isFirstTimeListLoad) {
              isFirstTimeListLoad = false;
              setSubCategoryindex();
            }
          }}
          onScroll={(e) => {
            loadMoreBeforeSubCategories(e.nativeEvent.contentOffset.x);
          }}
          onLayout={() => {
            if (isFirstTimeListLoad === false) {
              setSubCategoryindex();
            }
          }}
          getItemLayout={getItemLayoutsCategory}
          renderItem={({ item, index }) => (
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
          )}
        />
      </View>
      <View style={styles.containerDesignList}>
        {userSubCategories &&
        selectedSubCategory !== undefined &&
        userSubCategories[selectedSubCategory].totalDesign > 0 &&
        userSubCategories[selectedSubCategory].designs.length > 0 ? (
          <>
            <FlatList
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
              style={styles.listSubCategoryDesign}
              onViewableItemsChanged={onViewRef.current}
              viewabilityConfig={viewConfigRef.current}
              data={userSubCategories[selectedSubCategory].designs}
              keyExtractor={keyExtractor}
              maxToRenderPerBatch={6}
              windowSize={10}
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
      </View>
    </SafeAreaView>
  );
};
export default inject("designStore", "userStore")(observer(Home));

const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    backgroundColor: Color.bgcColor,
  },
  containerSub: {
    // flex: 1,
    backgroundColor: Color.bgcColor,
  },
  containerDesignList: {
    flex: 1,
    backgroundColor: Color.bgcColor,
  },
  containerNoDesign: {
    flex: 1,
    backgroundColor: Color.bgcColor,

    justifyContent: "center",
    alignItems: "center",
  },
  listAllDesign: { paddingTop: 10 },
  listHorizontalDesign: { marginBottom: 10 },

  listSubCategoryDesign: { marginBottom: 10 },
  imgAllDesign: {
    width: 150,
    height: 150,
    marginLeft: 10,
  },
  imgSubCategoryDesign: {
    width: imgWidth,
    height: imgWidth,
    marginLeft: 10,
    marginBottom: 10,
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
});

// const data = [
//   {
//     image:
//       "https://images.unsplash.com/photo-1567226475328-9d6baaf565cf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60",
//   },
//   {
//     image:
//       "https://images.unsplash.com/photo-1455620611406-966ca6889d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1130&q=80",
//   },
//   {
//     image:
//       "https://images.unsplash.com/photo-1477587458883-47145ed94245?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
//   },
//   {
//     image:
//       "https://images.unsplash.com/photo-1568700942090-19dc36fab0c4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
//   },
//   {
//     image:
//       "https://images.unsplash.com/photo-1584271854089-9bb3e5168e32?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1051&q=80",
//   },
// ];
