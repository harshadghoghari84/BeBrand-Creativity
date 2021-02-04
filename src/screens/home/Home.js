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
  ScrollView,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";

import Button from "../../components/Button";
import ItemSubCategory from "./ItemSubCategory";
import Constant from "../../utils/Constant";
import { TouchableOpacity } from "react-native-gesture-handler";
import Color from "../../utils/Color";
import Common from "../../utils/Common";
import FlatListSlider from "../../components/flatlist_carousel/FlatListSlider";
import Preview from "../sample/Preview";
import ItemDesign from "../common/ItemDesign";
import PopUp from "../../components/PopUp";

const windowWidth = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
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
  const [modalVisible, setmodalVisible] = useState(false);
  const toggleVisible = () => {
    setmodalVisible(!modalVisible);
  };

  const [hasPro, sethasPro] = useState(false);
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

  const [selectedSubCategory, setSelectedSubCategory] = useState(
    Constant.defHomeSubCategory
  );

  const refCategoryList = useRef(null);
  const isMountedRef = Common.useIsMountedRef();

  useEffect(() => {
    isMountedRef.current && sethasPro(userStore.hasPro);
  }, [userStore.hasPro]);

  useEffect(() => {
    designStore.loadHomeData();
  }, []);

  useEffect(() => {
    if (isMountedRef.current) {
      const afterCategory = toJS(designStore.userSubCategoriesAfter);
      console.log("afterCategory", afterCategory);
      setUserSubCategoriesAfter(afterCategory);
    }
  }, [designStore.userSubCategoriesAfter]);

  useEffect(() => {
    if (isMountedRef.current) {
      const beforeCatragory = toJS(designStore.userSubCategoriesBefore);
      console.log("beforeCatragory", beforeCatragory);
      setUserSubCategoriesBefore(beforeCatragory);
    }
  }, [designStore.userSubCategoriesBefore]);

  useEffect(() => {
    if (isMountedRef.current) {
      // console.log("updated");
      console.log("chk___before__", userSubCategoriesBefore);
      console.log("chk___After__", userSubCategoriesAfter);
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

  const scrollY = new Animated.Value(0);

  const diffClamp = Animated.diffClamp(scrollY, 0, 100);
  const translateY = diffClamp.interpolate({
    inputRange: [0, 120],
    outputRange: [0, -120],
  });
  const translateYforHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -100],
  });

  const diffClampForSlider = Animated.diffClamp(scrollY, 0, 70);
  const translateYForSlider = diffClampForSlider.interpolate({
    inputRange: [0, 70],
    outputRange: [0, -70],
  });
  let scrollValue = 0;
  return (
    <View contentContainerStyle={[styles.containerMain]}>
      <PopUp visible={modalVisible} toggleVisible={toggleVisible} />
      <Animated.View
        style={{
          transform: [
            {
              translateY: translateYForSlider,
            },
          ],
          position: "absolute",
          // zIndex: 1,
        }}
      >
        <View
          style={{
            marginHorizontal: 10,
            marginVertical: 10,
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          <FlatListSlider
            data={data}
            timer={5000}
            height={150}
            onPress={(item) => alert(JSON.stringify(item))}
            indicatorContainerStyle={{ position: "absolute", bottom: 20 }}
            indicatorActiveColor={Color.primary}
            animation
          />
        </View>

        <Animated.View
          style={[styles.containerSubCatList, { transform: [{ translateY }] }]}
        >
          {/* <View style={{ marginTop: 10 }}>
            <ItemSubCategory
              item={{ id: Constant.defHomeSubCategory }}
              isSelectedId={selectedSubCategory}
              index={Constant.defHomeSubCategory}
              onSelect={(itemId) => setSelectedSubCategory(itemId)}
            />
          </View> */}
          <FlatList
            horizontal
            ref={refCategoryList}
            data={userSubCategories}
            extraData={selectedSubCategory}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 8,
              height: 100,
              backgroundColor: "pink",
            }}
            onEndReached={() => loadMoreAfterSubCategories()}
            keyExtractor={keyExtractor}
            onContentSizeChange={() => {
              if (
                isFirstTimeListLoad === true &&
                refCategoryList &&
                refCategoryList.current.scrollToIndex &&
                userSubCategoriesBefore &&
                userSubCategoriesBefore.length > 0
              ) {
                isFirstTimeListLoad = false;
                const index =
                  userSubCategories.length > userSubCategoriesBefore.length
                    ? userSubCategoriesBefore.length
                    : userSubCategoriesBefore.length - 1;
                refCategoryList.current.scrollToIndex({
                  index: index,
                });
                setSelectedSubCategory(index);
              }
            }}
            onScrollToIndexFailed={() => {}}
            getItemLayout={getItemLayoutsCategory}
            renderItem={({ item, index }) => (
              <ItemSubCategory
                item={item}
                index={index}
                isSelectedId={selectedSubCategory}
                onSelect={(itemId) => {
                  console.log("itemId: ", itemId);
                  setSelectedSubCategory(itemId);
                  item.totalDesign > 0 &&
                    item.designs.length === 0 &&
                    loadMoreDesigns(item.id);
                }}
              />
            )}
          />
        </Animated.View>
      </Animated.View>

      <Animated.View
        style={[styles.containerSub, { transform: [{ translateY }] }]}
      >
        {selectedSubCategory ===
        Constant.defHomeSubCategory ? null : userSubCategories[ // /> //   }} //     ) : null; //       /> //         }} //           ); //             /> //               onDesignClick={onDesignClick} //               packageType={designPackage.type} //               design={design} //             <ItemDesign //           return ( //           ); //             (item) => item.id === design.package //           const designPackage = designPackages.find( //         renderItem={({ item: design }) => { //         windowSize={7} //         maxToRenderPerBatch={5} //         // onEndReached={() => loadMoreDesigns(item.id)} //         keyExtractor={keyExtractor} //         data={item.designs} //         style={styles.listHorizontalDesign} //         showsHorizontalScrollIndicator={false} //         horizontal //         key={index} //       <FlatList //     return item.designs.length > 0 ? ( //   renderItem={({ item, index }) => { //   windowSize={10} //   maxToRenderPerBatch={6} //   keyExtractor={keyExtractor} //   data={userSubCategoriesHome} //   style={styles.listAllDesign} // <FlatList
            selectedSubCategory
          ].totalDesign > 0 ? (
          <>
            <Animated.View
              style={{
                height: 200,
                marginTop: 50,
                backgroundColor: "red",
              }}
            />
            <Animated.FlatList
              key={2}
              numColumns={2}
              onScroll={(e) => {
                // scrollY.setValue(e.nativeEvent.contentOffset.y);
                if (scrollValue < e.nativeEvent.contentOffset.y) {
                  console.log("up=====>", e.nativeEvent.contentOffset.y);
                  scrollValue = e.nativeEvent.contentOffset.y;
                  scrollY.setValue(scrollValue);
                }
                // else if (scrollValue > e.nativeEvent.contentOffset.y) {
                //   console.log("=====>", e.nativeEvent.contentOffset.y);
                //   scrollValue = scrollValue - 3;
                //   scrollY.setValue(scrollValue);
                // }
              }}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[styles.listSubCategoryDesign]}
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
                  <>
                    <ItemDesign
                      dummyView={true}
                      design={design}
                      packageType={designPackage.type}
                      onDesignClick={onDesignClick}
                    />
                  </>
                );
              }}
            />
          </>
        ) : (
          <View style={styles.containerNoDesign}>
            <Text>No Designs Availlable</Text>
          </View>
        )}
      </Animated.View>
    </View>
  );
};
export default inject("designStore", "userStore")(observer(Home));

const styles = StyleSheet.create({
  containerMain: {
    flexGrow: 1,
    backgroundColor: "white",
  },
  containerSub: {
    zIndex: -1,

    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "green",
  },
  containerSubCatList: {
    backgroundColor: "white",
    // position: "absolute",
    // zIndex: 1,
    top: 0,
    left: 0,
    right: 0,
  },
  containerDesignList: {
    flex: 1,
  },
  containerNoDesign: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listAllDesign: { paddingTop: 10 },
  listHorizontalDesign: { marginBottom: 10 },
  listSubCategoryDesign: {
    // position: "absolute",
    marginTop: 10,
    marginBottom: 10,
  },
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
