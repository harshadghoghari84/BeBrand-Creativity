import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Linking,
  TouchableOpacity,
} from "react-native";

import PopUp from "../components/PopUp";
import Color from "./Color";
import Rate, { AndroidMarket } from "react-native-rate";
import Constant from "./Constant";
import Button from "../components/Button";
import Icon from "../components/svgIcons";
import FastImage from "react-native-fast-image";

const Ratings = ({ toggleforRating, toggleVisibleforImprove }) => {
  const open_Store = () => {
    const options = {
      AppleAppID: Constant.titAppleIdForAppStore,
      GooglePackageName: Constant.titPkgnameForAndroidPlayStore,
      OtherAndroidURL: Constant.OtherAndroidURL,
      preferredAndroidMarket: AndroidMarket.Google,
      preferInApp: false,
      openAppStoreIfInAppFails: true,
      fallbackPlatformURL: Constant.fallbackPlatformURL,
    };
    Rate.rate(options, (success) => {
      if (success) {
        toggleforRating();
      }
    });
  };

  return (
    <View style={{ flex: 1, marginHorizontal: 20 }}>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            alignSelf: "center",
            fontWeight: "700",
            fontSize: 18,
            color: Color.darkBlue,
            marginVertical: 5,
          }}
        >
          Share Your Experiance
        </Text>
        <Text
          style={{
            alignSelf: "center",
            fontWeight: "700",
            fontSize: 15,
            color: Color.darkBlue,
          }}
        >
          we love to here from you !
        </Text>

        <View style={{ alignItems: "center" }}>
          <FastImage
            source={require("../assets/Rating.png")}
            resizeMode={FastImage.resizeMode.contain}
            style={{ height: 200, width: "70%" }}
          />
        </View>
        <View style={{ marginBottom: 10 }}>
          <Button onPress={() => open_Store()} big={true}>
            I Love it!
          </Button>
          <Button
            onPress={() => {
              toggleforRating();
              toggleVisibleforImprove();
            }}
            border={true}
          >
            It needs to be improved
          </Button>
        </View>
      </View>
    </View>
  );
};

export default Ratings;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 10,
  },
  txt: {
    color: Color.black,
    paddingLeft: 10,
    fontSize: 15,
  },
});
