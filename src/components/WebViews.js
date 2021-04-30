import React, { useState } from "react";
import { WebView } from "react-native-webview";
import ProgressDialog from "../screens/common/ProgressDialog";

import Common from "../utils/Common";
import LangKey from "../utils/LangKey";

const WebViews = (props) => {
  const [loading, setLoading] = useState(false);
  return (
    <>
      <ProgressDialog
        visible={loading}
        dismissable={true}
        message={Common.getTranslation(LangKey.labLoading)}
      />
      <WebView
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        style={{ flex: 1 }}
        source={{ uri: props.route.params.uri }}
      />
    </>
  );
};

export default WebViews;
