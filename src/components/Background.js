import React, { memo } from "react";
import {
  ImageBackground,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import Color from "../utils/Color";

const Background = ({ children }) => (
  <SafeAreaView style={{ flex: 1 }}>
    <ScrollView style={styles.container}>{children}</ScrollView>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  background: {
    flex: 1,

    backgroundColor: Color.white,
  },
  container: {
    flex: 1,
    marginHorizontal: 20,
  },
});

export default memo(Background);
