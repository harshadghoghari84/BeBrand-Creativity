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
    isMountedRef.current &&
      setUserSubCategoriesAfter(toJS(designStore.userSubCategoriesAfter));
  }, [designStore.userSubCategoriesAfter]);

  useEffect(() => {
    isMountedRef.current &&
      setUserSubCategoriesBefore(toJS(designStore.userSubCategoriesBefore));
  }, [designStore.userSubCategoriesBefore]);

  useEffect(() => {
    if (isMountedRef.current) {
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
    if (packageType === Constant.typeDesignPackagePro && hasPro === false) {
      // show popup to user for pro
    } else {
      navigation.navigate(Constant.navDesign, {
        designs: userSubCategories[selectedSubCategory].designs,
        curDesign: design,
      });
    }
  };

  return (
    <View style={styles.containerMain}>
      {/* <ActivityIndicator animating={designStore.hdLoading} />
      <Button mode="contained" onPress={onFetchMorePressed}>
        FetchMore
      </Button> */}

      {/* <Carousel data={dummyData} /> */}

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

      <View style={styles.containerSub}>
        <View style={styles.containerSubCatList}>
          <View style={{ marginTop: 10 }}>
            <ItemSubCategory
              item={{ id: Constant.defHomeSubCategory }}
              isSelectedId={selectedSubCategory}
              index={Constant.defHomeSubCategory}
              onSelect={(itemId) => setSelectedSubCategory(itemId)}
            />
          </View>
          <FlatList
            horizontal
            ref={refCategoryList}
            data={userSubCategories}
            extraData={selectedSubCategory}
            showsHorizontalScrollIndicator={false}
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
                refCategoryList.current.scrollToIndex({
                  index:
                    userSubCategories.length > userSubCategoriesBefore.length
                      ? userSubCategoriesBefore.length
                      : userSubCategoriesBefore.length - 1,
                });
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
          {selectedSubCategory === Constant.defHomeSubCategory ? (
            <FlatList
              style={styles.listAllDesign}
              data={userSubCategoriesHome}
              keyExtractor={keyExtractor}
              maxToRenderPerBatch={6}
              windowSize={10}
              renderItem={({ item, index }) => {
                return item.designs.length > 0 ? (
                  <FlatList
                    key={index}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.listHorizontalDesign}
                    data={item.designs}
                    keyExtractor={keyExtractor}
                    // onEndReached={() => loadMoreDesigns(item.id)}
                    maxToRenderPerBatch={5}
                    windowSize={7}
                    renderItem={({ item: design }) => {
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
                ) : null;
              }}
            />
          ) : userSubCategories[selectedSubCategory].totalDesign > 0 ? (
            <FlatList
              key={2}
              numColumns={2}
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
          ) : (
            <View style={styles.containerNoDesign}>
              <Text>No Designs Availlable</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};
export default inject("designStore", "userStore")(observer(Home));

const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
  },
  containerSub: {
    flex: 1,
    width: "100%",
  },
  containerSubCatList: {
    flexDirection: "row",
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
  listSubCategoryDesign: { marginBottom: 10, marginRight: 10 },
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
