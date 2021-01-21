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
      <ScrollView style={{ flex: 1, marginTop: 30, width: "40%" }}>
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
            <Text style={styles.text}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Button
        mode="contained"
        style={{ marginBottom: 30, width: "60%" }}
        labelColor={Colors.black}
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
    color: "#191919",
    fontSize: 30,
    textAlign: "center",
  },
  elementContainer: {
    width: "100%",
    height: 60,
    padding: 10,
    marginTop: 25,
    backgroundColor: Colors.grey200,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  elementContainerActive: {
    width: "100%",
    height: 60,
    padding: 10,
    marginTop: 25,
    backgroundColor: Colors.yellow700,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#191919",
    fontSize: 25,
  },
});

export default LanguageSelection;
