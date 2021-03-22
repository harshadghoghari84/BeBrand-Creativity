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
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useLazyQuery, useQuery } from "@apollo/client";
import ItemSubCategory from "./ItemSubCategory";
import Constant from "../../utils/Constant";
import Color from "../../utils/Color";
import Common from "../../utils/Common";
import ItemDesign from "../common/ItemDesign";
import PopUp from "../../components/PopUp";
import Carousel, { Pagination } from "react-native-snap-carousel";
import FastImage from "react-native-fast-image";
import ProgressDialog from "../common/ProgressDialog";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GraphqlQuery from "../../utils/GraphqlQuery";
import LangKey from "../../utils/LangKey";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { SvgCss } from "react-native-svg";
import SvgConstant from "../../utils/SvgConstant";
const windowWidth = Dimensions.get("window").width;
const imgWidth = (windowWidth - 30) / 2;

let isFirstTimeListLoad = true;

const data = [
  {
    image:
      "https://images.unsplash.com/photo-1567226475328-9d6baaf565cf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60",
  },
  {
    image:
      "https://images.unsplash.com/photo-1455620611406-966ca6889d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1130&q=80",
  },
  {
    image:
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
  },
  {
    image:
      "https://images.unsplash.com/photo-1568700942090-19dc36fab0c4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
  },
  {
    image:
      "https://images.unsplash.com/photo-1584271854089-9bb3e5168e32?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1051&q=80",
  },
];

const Home = ({ navigation, designStore, userStore }) => {
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
  const { loading, error, data: imageData } = useQuery(GraphqlQuery.offers);

  const [activeSlide, setActiveSlide] = useState(0);
  const [modalVisible, setmodalVisible] = useState(false);
  const toggleVisible = () => {
    setmodalVisible(!modalVisible);
  };
  const [hasPro, sethasPro] = useState(false);
  const homeDataLoading = toJS(designStore.hdLoading);
  const designPackages = toJS(designStore.designPackages);
  const userSubCategoriesHome = toJS(designStore.userSubCategoriesHome);
  const [userSubCategoriesAfter, setUserSubCategoriesAfter] = useState([]);
  const [userSubCategoriesBefore, setUserSubCategoriesBefore] = useState([]);
  const [userSubCategories, setUserSubCategories] = useState([]);
  const [
    totalUserSubCategoriesAfter,
    setTotalUserSubCategoriesAfter,
  ] = useState(0);
  const [
    totalUserSubCategoriesBefore,
    setTotalUserSubCategoriesBefore,
  ] = useState(0);

  const [selectedSubCategory, setSelectedSubCategory] = useState();

  const refCategoryList = useRef(null);
  const isMountedRef = Common.useIsMountedRef();

  useEffect(() => {
    isMountedRef.current && sethasPro(userStore.hasPro);
  }, [userStore.hasPro]);

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
      setUserSubCategoriesAfter(afterCategory);
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
      if (userSubCategoriesBefore) {
        setUserSubCategories([...userSubCategoriesBefore]);
      }
      if (userSubCategoriesAfter) {
        setUserSubCategories([...userSubCategoriesAfter]);
      }
      if (userSubCategoriesBefore && userSubCategoriesAfter) {
        setUserSubCategories([
          ...userSubCategoriesBefore,
          ...userSubCategoriesAfter,
        ]);
      }
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

  const loadMoreBeforeSubCategories = () => {
    if (designStore.ahdLoading === false) {
      const length = userSubCategoriesBefore.length;
      totalUserSubCategoriesBefore > length &&
        designStore.loadMoreBeforeSubCategories(length);
      [];
    }
  };

  const loadMoreDesigns = (subCategoryId) => {
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
      designStore.loaduserDesigns(subCategory.id, designLen, type, hasPro);
  };

  // key extractors
  const keyExtractor = useCallback((item) => item.id.toString(), []);

  // getItemLayouts for flatlists
  const getItemLayoutsCategory = useCallback(
    (data, index) => ({
      length: Constant.homeItemSubCategoryHeight,
      offset: Constant.homeItemSubCategoryHeight * index,
      index,
    }),
    []
  );

  const onDesignClick = (packageType, design) => {
    if (packageType === Constant.typeDesignPackageVip && hasPro === false) {
      setmodalVisible(true);
    } else {
      navigation.navigate(Constant.navDesign, {
        designs: userSubCategories[selectedSubCategory].designs,
        curDesign: design,
      });
    }
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
      <FastImage
        source={{ uri: item.image.url }}
        style={{ height: wp(25) }}
        resizeMode={FastImage.resizeMode.cover}
      />
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
            loop
            onSnapToItem={(index) => setActiveSlide(index)}
            inactiveSlideScale={1}
          />
        </View>
        {pagination()}
      </>
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
                setSelectedSubCategory(itemId);
                item.totalDesign > 0 &&
                  item.designs.length === 0 &&
                  loadMoreDesigns(item.id);
              }}
            />
          )}
        />
      </View>

      <View style={styles.containerDesignList}>
        {userSubCategories &&
        selectedSubCategory &&
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
              data={userSubCategories[selectedSubCategory].designs}
              keyExtractor={keyExtractor}
              maxToRenderPerBatch={6}
              windowSize={10}
              onEndReached={() =>
                loadMoreDesigns(userSubCategories[selectedSubCategory].id)
              }
              renderItem={({ item: design, index: desIndex }) => {
                const designPackage = designPackages.find(
                  (item) => item.id === design.package
                );
                return (
                  <ItemDesign
                    design={design}
                    packageType={designPackage.type}
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
                source={require("../../assets/img/NotAvailable.png")}
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
