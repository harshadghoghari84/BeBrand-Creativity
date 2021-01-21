import React, { memo } from "react";
import {
  ImageBackground,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Color from "../utils/Color";

const Background = ({ children }) => (
  <SafeAreaView style={{ flex: 1 }}>
    {/* <ImageBackground
      source={require("../assets/background_dot.png")}
      resizeMode="repeat"
      style={styles.background}
    >
      </ImageBackground> */}
    {/* <KeyboardAwareScrollView
        style={styles.container}
        // contentContainerStyle={{}}
        showsVerticalScrollIndicator={false}
        behavior="padding"
      >
        {children}
      </KeyboardAwareScrollView> */}

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
