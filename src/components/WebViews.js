import React from "react";
import { ActivityIndicator, View } from "react-native";
import { WebView } from "react-native-webview";
import Color from "../utils/Color";

const WebViews = (props) => {
  if (props?.route?.params?.uri && props.route.params.uri !== null) {
    return (
      <WebView style={{ flex: 1 }} source={{ uri: props.route.params.uri }} />
    );
  }
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator size={"large"} color={Color.primary} />
    </View>
  );
};

export default WebViews;
