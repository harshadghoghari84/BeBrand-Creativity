import React, { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { inject, observer } from "mobx-react";

import Common from "../utils/Common";
import Color from "../utils/Color";
import LangKey from "../utils/LangKey";
import { toJS } from "mobx";
import { TouchableOpacity } from "react-native-gesture-handler";

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
            <View
              style={{
                flexDirection: "column",
                marginTop: 10,
                marginBottom: 5,
                borderRadius: 5,
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
                backgroundColor: Color.white,
                marginStart: 5,
                marginLeft: 10,
                marginRight: 10,
                paddingVertical: 10,
                paddingLeft: 20,
                paddingRight: 10,
                elevation: 10,
              }}
            >
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
                    fontSize: 20,
                    color: Color.darkBlue,
                    fontWeight: "700",
                  }}
                >
                  {item.name}
                </Text>
                <Text
                  style={{
                    fontSize: 20,
                    color: Color.primary,
                    fontWeight: "700",
                    marginLeft: 10,
                  }}
                >
                  ₹ {item.discountPrice}
                </Text>
              </View>

              <TouchableOpacity style={styles.btnPerchase}>
                <Text style={styles.txtPerchase}>
                  {Common.getTranslation(LangKey.labPerchase)}
                </Text>
              </TouchableOpacity>
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
  listDesign: {
    marginTop: 10,
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
    textTransform: "uppercase",
  },
});

export default inject("designStore")(observer(Packages));
