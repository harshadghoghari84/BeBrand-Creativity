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
} from "react-native";
import Popover, { Rect, PopoverMode } from "react-native-popover-view";
// relative Path
import Color from "../utils/Color";
import Common from "../utils/Common";
import LangKey from "../utils/LangKey";

const Modal = ({ visible, toggleVisible, designStore }) => {
  const [lang, setLang] = useState([
    { code: "all", name: "All", isSelected: true },
    { code: "en", name: "English", isSelected: false },
    { code: "hi", name: "हिन्दी", isSelected: false },
    { code: "gu", name: "ગુજરાતી", isSelected: false },
    { code: "ma", name: "मराठी", isSelected: false },
  ]);
  const selectLanguage = (currantIndex, langcode) => {
    let tmpArr = lang;
    tmpArr.forEach((ele, index) => {
      if (index == currantIndex) {
        tmpArr[currantIndex].isSelected = true;
      } else {
        tmpArr[index].isSelected = false;
      }
    });
    setLang(tmpArr);

    designStore.setDesignLang(langcode);
    designStore.changeDesignByLanguage();
  };
  const animating = {
    duration: 300,
    easing: Easing.inOut(Easing.cubic),
  };
  return (
    <Popover
      from={
        Platform.OS === "android"
          ? new Rect(200, 50, 310, 0)
          : new Rect(200, 50, 350, 50)
      }
      isVisible={visible}
      animationConfig={animating}
      placement="bottom"
      onRequestClose={() => toggleVisible()}
    >
      <View style={{ height: 200, width: 150, backgroundColor: "white" }}>
        <View style={{ padding: 10 }}>
          <Text>{Common.getTranslation(LangKey.labSelecteLang)}</Text>
        </View>
        <FlatList
          data={lang}
          keyExtractor={(item) => item.key}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  selectLanguage(index, item.code);
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
                      color: item.isSelected ? Color.primary : Color.darkBlue,
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
