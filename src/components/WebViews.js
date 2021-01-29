import React, { Component, memo, useEffect } from "react";
import { Text, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import CustomHeader from "../screens/common/CustomHeader";

const WebViews = (props) => {
  useEffect(() => {
    console.log("object", props.route.params.uri);
  }, []);
  return (
    // <View style={{ flex: 1 }}>
    //   {/* <CustomHeader isBackVisible={true} /> */}
    // </View>
    <WebView source={{ uri: props.route.params.uri }} />
  );
};

export default WebViews;
