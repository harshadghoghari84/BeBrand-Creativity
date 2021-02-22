import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
import { inject, observer } from "mobx-react";
import { toJS } from "mobx";

// Relative Path
import Common from "../../utils/Common";
import Color from "../../utils/Color";
import LangKey from "../../utils/LangKey";
import Button from "../../components/Button";

const Packages = ({ navigation, designStore }) => {
  const designPackages = toJS(designStore.designPackages);
  console.log("designPackages: ", designPackages);

  // key extractors
  const keyExtractor = useCallback((item) => item.id.toString(), []);

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.listDesign}
        data={designPackages}
        keyExtractor={keyExtractor}
        renderItem={({ item }) => {
          return (
            <View style={styles.fltContainer}>
              <View
                style={{
                  backgroundColor: Color.primary,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderRadius: 3,
                  overflow: "hidden",
                  position: "absolute",
                  right: 0,
                  top: 0,
                }}
              >
                <Text
                  style={{
                    color: Color.white,
                    fontSize: 15,
                    fontWeight: "700",
                  }}
                >
                  SAVE 85%
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    color: Color.darkBlue,
                    fontWeight: "700",
                  }}
                >
                  {item.name}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text>DiscountPrice :</Text>
                <Text
                  style={{
                    fontSize: 18,
                    color: Color.primary,
                    fontWeight: "700",
                    marginLeft: 10,
                  }}
                >
                  ₹ {item.discountPrice}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text>ActualPrice :</Text>
                <Text
                  style={{
                    fontSize: 18,
                    color: Color.txtIntxtcolor,
                    fontWeight: "700",
                    marginLeft: 10,
                    textDecorationLine: "line-through",
                  }}
                >
                  ₹ {item.actualPrice}
                </Text>
              </View>

              {item.features.map((ele) => {
                return (
                  <View style={{ flexDirection: "row" }}>
                    <Text>{`\u2B22 ${ele}`}</Text>
                  </View>
                );
              })}

              <Button>{Common.getTranslation(LangKey.labPerchase)}</Button>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listDesign: {},
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
  fltContainer: {
    marginTop: 10,
    marginBottom: 5,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Color.white,
    marginStart: 5,
    marginLeft: 10,
    marginRight: 10,
    paddingVertical: 10,
    paddingLeft: 20,
    paddingRight: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
});

export default inject("designStore")(observer(Packages));
