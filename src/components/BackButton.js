import React, { memo } from "react";
import { TouchableOpacity, Image, StyleSheet, StatusBar } from "react-native";
import FastImage from "react-native-fast-image";

const BackButton = ({ goBack }) => (
  <TouchableOpacity onPress={goBack} style={styles.container}>
    <FastImage
      style={styles.image}
      source={require("../assets/arrow_back.png")}
    />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 10 + StatusBar.currentHeight,
    left: -5,
  },
  image: {
    width: 24,
    height: 24,
  },
});

export default memo(BackButton);
