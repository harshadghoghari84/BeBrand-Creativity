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
import { useMutation } from "@apollo/client";
import GraphqlQuery from "../../utils/GraphqlQuery";
import ProgressDialog from "../common/ProgressDialog";

const Packages = ({ navigation, designStore, userStore, route }) => {
  const isMountedRef = Common.useIsMountedRef();
  const { isGoback } = route.params;

  const [user, setUser] = useState();
  const [filteredData, setFilteredData] = useState([]);
  const [currentItem, setCurrentItem] = useState();

  useEffect(() => {
    if (isMountedRef.current) {
      const user = toJS(userStore.user);
      setUser(user);
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

  const [addUserDesignPackage, { data, loading, error }] = useMutation(
    GraphqlQuery.addUserDesignPackage,
    {
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    }
  );

  // key extractors
  const keyExtractor = useCallback((item) => item.id.toString(), []);

  const onPurchase = (pkgId) => {
    if (user && user !== null) {
      try {
        addUserDesignPackage({
          variables: {
            packageId: pkgId,
          },
        })
          .then(({ data, errors }) => {
            if (errors && errors !== null) {
              Common.showMessage(errors[0].message);
            }
            if (
              data.addUserDesignPackage &&
              data.addUserDesignPackage !== null &&
              Array.isArray(data.addUserDesignPackage)
            ) {
              console.log("DATA", data);
              const newUser = {
                ...user,
                designPackage: data.addUserDesignPackage
                  ? data.addUserDesignPackage
                  : user.designPackage,
              };
              userStore.setUser(newUser);
              Common.showMessage(
                Common.getTranslation(LangKey.msgPkgPurchaseSucess)
              );
              isGoback && navigation.goBack();
            }
          })
          .catch((err) => {
            console.log("err", err);
          });
      } catch (error) {
        Common.showMessage(error.message);
      }
    } else {
      Common.showMessage(Common.getTranslation(LangKey.msgCreateAccForPKg));
    }
  };

  const headerComponant = () => {
    return (
      <>
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
      </>
    );
  };

  return (
    <View style={styles.container}>
      <ProgressDialog
        visible={loading}
        dismissable={false}
        message={Common.getTranslation(LangKey.labLoading)}
      />
      <FlatList
        data={filteredData}
        ListHeaderComponent={headerComponant()}
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

      <Button
        onPress={() => onPurchase(currentItem.id)}
        style={{ marginTop: 5, marginBottom: Platform.OS === "ios" ? 20 : 5 }}
        normal={true}
      >
        {Common.getTranslation(LangKey.labPerchaseFree)}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
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

export default inject("designStore", "userStore")(observer(Packages));
