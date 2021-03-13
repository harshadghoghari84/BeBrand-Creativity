import React from "react";
import { WebView } from "react-native-webview";

const WebViews = (props) => {
  return (
    <WebView style={{ flex: 1 }} source={{ uri: props.route.params.uri }} />
  );
};

export default WebViews;
