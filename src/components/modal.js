import { toJS } from "mobx";
import { inject, observer } from "mobx-react";
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  Text,
  Easing,
  Platform,
  Dimensions,
} from "react-native";
import Popover, {
  Rect,
  PopoverMode,
  PopoverPlacement,
} from "react-native-popover-view";
// relative Path
import Color from "../utils/Color";
import Common from "../utils/Common";
import LangKey from "../utils/LangKey";

const lng = [{ code: "all", name: "All" }];
const { width, height } = Dimensions.get("screen");
const Modal = ({ visible, toggleVisible, designStore, bottom, ref }) => {
  const [lang, setLang] = useState(lng[0].code);
  const [languages, setLanguages] = useState(lng);

  useEffect(() => {
    console.log("bottom", bottom);
  }, [bottom]);
  useEffect(() => {
    setLang(toJS(designStore.designLang));
  }, [designStore.designLang]);

  useEffect(() => {
    const lData = toJS(designStore.languages);
    if (lData && Array.isArray(lData) && lData.length > 0)
      setLanguages([...lng, ...lData]);
  }, [designStore.languages]);

  const animating = {
    duration: 200,
    easing: Easing.inOut(Easing.cubic),
  };

  return (
    <Popover
      from={
        Platform.OS === "android"
          ? new Rect(200, 50, 310, 1350)
          : new Rect(200, 50, 310, 1350)
      }
      arrowShift={0.5}
      isVisible={visible}
      animationConfig={animating}
      placement={PopoverPlacement.BOTTOM}
      onRequestClose={() => toggleVisible()}
    >
      <View style={{ height: 200, width: 150, backgroundColor: Color.white }}>
        <View style={{ padding: 10 }}>
          <Text>{Common.getTranslation(LangKey.labSelecteLang)}</Text>
        </View>
        <FlatList
          data={languages}
          keyExtractor={(item) => item.key}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  designStore.setDesignLang(item.code);
                  toggleVisible();
                }}
              >
                <View
                  style={{
                    paddingHorizontal: 20,
                    paddingVertical: 5,
                    margin: 5,
                    borderRadius: 3,
                  }}
                >
                  <Text
                    style={{
                      color:
                        item.code === lang ? Color.primary : Color.darkBlue,
                    }}
                  >
                    {item.name}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </Popover>
  );
};

export default inject("designStore", "userStore")(observer(Modal));
