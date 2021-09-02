import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Alert,
  ScrollView,
} from "react-native";
import FastImage from "react-native-fast-image";
import { SvgCss } from "react-native-svg";
import Button from "../components/Button";
import Color from "../utils/Color";
import SvgConstant from "../utils/SvgConstant";

const KnowMore = () => {
  return (
    <ScrollView
      bounces={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        flex: 1,
        backgroundColor: Color.white,
        alignItems: "center",
        // justifyContent: "center",
      }}
    >
      {/* <SvgCss xml={SvgConstant.knowmore} width="95%" height="100%" /> */}
      <FastImage
        source={require("../assets/img/know.png")}
        style={{ height: "80%", width: "88%" }}
        resizeMode={FastImage.resizeMode.contain}
      />
    </ScrollView>
  );
};

export default KnowMore;
