import React, { memo } from "react";
import { Image, StyleSheet } from "react-native";

const Logo = () => (
  <Image
    resizeMode="center"
    source={require("../assets/bdt.png")}
    style={styles.image}
  />
);

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 100,
    marginTop: 30,
    marginBottom: 12,
  },
});

export default memo(Logo);
