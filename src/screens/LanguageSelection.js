import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Colors } from "react-native-paper";

import Common from "../utils/Common";
import Button from "../components/Button";
import Constant from "../utils/Constant";
import Color from "../utils/Color";

const lang = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिन्दी" },
  { code: "gu", name: "ગુજરાતી" },
  { code: "ma", name: "मराठी" },
];

const LanguageSelection = ({ navigation }) => {
  const [langCode, setLangCode] = useState(lang[0].code);

  const onBtnPress = () => {
    Common.setTranslationLanguage(langCode);
    navigation.navigate(Constant.navSignIn);
  };

  return (
    <View style={styles.MainContainer}>
      <View style={{ marginTop: 60 }}>
        <Text style={styles.textHeading}>Please Select Preferred Language</Text>
      </View>
      <ScrollView style={{ flex: 1, marginTop: 30, width: "50%" }}>
        {lang.map((item, key) => (
          <TouchableOpacity
            key={key}
            style={
              item.code === langCode
                ? styles.elementContainerActive
                : styles.elementContainer
            }
            onPress={() => setLangCode(item.code)}
          >
            <Text
              style={[
                styles.text,
                {
                  color:
                    item.code === langCode ? Color.white : Color.txtIntxtcolor,
                },
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Button
        style={{ marginBottom: 30, width: "60%" }}
        labelColor={Color.white}
        onPress={onBtnPress}
      >
        Set Language
      </Button>
    </View>
  );
};
const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },
  textHeading: {
    color: Color.darkBlue,
    fontSize: 30,
    textAlign: "center",
  },
  elementContainer: {
    width: "100%",
    height: 50,
    padding: 10,
    marginTop: 25,
    backgroundColor: Colors.grey200,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  elementContainerActive: {
    width: "100%",
    height: 50,
    padding: 10,
    marginTop: 25,
    backgroundColor: Color.darkBlue,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: Color.txtIntxtcolor,
    fontSize: 25,
  },
});

export default LanguageSelection;
