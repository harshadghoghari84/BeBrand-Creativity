import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Animated,
  ScrollView,
} from "react-native";
import { inject, observer } from "mobx-react";
import { toJS } from "mobx";

// Relative Path
import Common from "../../utils/Common";
import Color from "../../utils/Color";
import LangKey from "../../utils/LangKey";
import Button from "../../components/Button";
import Constant from "../../utils/Constant";
import Icon from "../../components/svgIcons";
import FastImage from "react-native-fast-image";
import { SvgUri } from "react-native-svg";

const Packages = ({ navigation, designStore }) => {
  const isMountedRef = Common.useIsMountedRef();

  const [filteredData, setFilteredData] = useState([]);
  const [currentItem, setCurrentItem] = useState();

  useEffect(() => {
    if (isMountedRef.current) {
      const designPackages = toJS(designStore.designPackages);
      const filterData = designPackages.filter(
        (ele) => ele.type === Constant.free
      );
      setFilteredData(filterData);
      filterData.length > 0
        ? setCurrentItem(filterData[0])
        : setCurrentItem(null);
    }
  }, [designStore.designPackages]);

  console.log("curr", currentItem);

  // key extractors
  const keyExtractor = useCallback((item) => item.id.toString(), []);

  return (
    <View style={styles.secondContainer}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <View>
          {currentItem && currentItem !== null && (
            <>
              <Text style={styles.txtFeaturetitle}>
                {Common.getTranslation(LangKey.labfreeFeature)}
              </Text>
              <ScrollView contentContainerStyle={styles.scrollView}>
                {currentItem.features.map((i) => {
                  return (
                    <View style={styles.featureItems}>
                      <View style={{ paddingHorizontal: 10 }}>
                        <Icon name="bullatin" height={10} width={10} />
                      </View>
                      <Text style={styles.txtFeaturesList}>{i}</Text>
                    </View>
                  );
                })}
              </ScrollView>
            </>
          )}
          <FlatList
            data={filteredData}
            keyExtractor={keyExtractor}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setCurrentItem(item);
                  }}
                  style={[
                    styles.fltContainer,
                    {
                      backgroundColor:
                        currentItem.id === item.id ? Color.primary : null,
                    },
                  ]}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginHorizontal: 10,
                    }}
                  >
                    <SvgUri
                      uri={item.image.url}
                      width={32}
                      height={32}
                      fill={
                        currentItem.id === item.id ? Color.white : Color.primary
                      }
                    />
                    <View
                      style={{
                        flex: 1,
                        paddingHorizontal: 10,
                      }}
                    >
                      <View style={styles.innerfitContainer}>
                        <Text style={styles.txtlable}>{item.name}</Text>
                      </View>
                      <View style={styles.innerfitContainer}>
                        <Text style={styles.txtdes}>{item.description}</Text>
                      </View>
                    </View>
                    <View style={styles.discountView}>
                      <Text style={styles.txtdiscount}>₹ 0</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </ScrollView>

      <Button
        style={{ marginTop: 0, marginBottom: Platform.OS === "ios" ? 10 : 0 }}
        normal={true}
      >
        {Common.getTranslation(LangKey.labPerchase)}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  secondContainer: {
    flex: 1,
    paddingBottom: 10,
  },
  txtFeaturetitle: { fontSize: 16, fontWeight: "700", marginVertical: 8 },
  scrollView: { marginHorizontal: 20 },
  featureItems: { margin: 5, flexDirection: "row", alignItems: "center" },
  txtFeaturesList: { fontSize: 15, fontWeight: "500" },
  fltContainer: {
    marginTop: 10,
    marginBottom: 5,
    borderRadius: 15,
    justifyContent: "center",
    backgroundColor: Color.white,
    marginHorizontal: 5,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  discountView: {
    minWidth: 80,
    paddingHorizontal: 8,
    height: 50,
    backgroundColor: Color.white,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  txtdiscount: {
    color: Color.primary,
    fontSize: 15,
    fontWeight: "700",
  },
  innerfitContainer: {
    marginVertical: 3,
    paddingHorizontal: 3,
  },
  txtlable: {
    fontSize: 18,
    color: Color.darkBlue,
    fontWeight: "700",
  },
  txtdes: {
    fontSize: 13,
    color: Color.darkBlue,
    fontWeight: "600",
  },
  txtPrice: {
    paddingLeft: 10,
    fontSize: 18,
    color: Color.white,
    fontWeight: "700",
  },
  btnPerchase: {
    backgroundColor: Color.primary,
    alignItems: "center",
    borderRadius: 50,
    height: 27,
    width: 110,
    justifyContent: "center",
    marginHorizontal: 20,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    color: Color.white,
  },
  txtPerchase: {
    fontSize: 13,
    fontWeight: "700",
    color: Color.white,
    textTransform: "capitalize",
  },
});

export default inject("designStore")(observer(Packages));
