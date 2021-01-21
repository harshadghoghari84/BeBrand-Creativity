import React from "react";
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Ionicons";

import Color from "../../utils/Color";
import Constant from "../../utils/Constant";

const CustomHeader = ({ isBackVisible = false, navigation }) => {
  // const { backKey } = route.params;

  return (
    <View
      style={{
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 3,
        backgroundColor: Color.primary,
        shadowColor: "black",
        shadowOpacity: 0.2,
        elevation: 7,
      }}
    >
      <SafeAreaView
        style={{
          backgroundColor: Color.primary,
        }}
      >
        <View style={{ ...styles.header }}>
          {isBackVisible === true && (
            <TouchableOpacity
              style={styles.backIcon}
              onPress={() => navigation.goBack()}
            >
              <Icon name="ios-arrow-back" size={30} color={Color.accent} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={{
              ...styles.menuIcon,
              marginLeft: isBackVisible === true ? 5 : 15,
            }}
            onPress={() => navigation.openDrawer()}
          >
            <Icon name="ios-menu" size={30} color={Color.accent} />
          </TouchableOpacity>
          <Text style={styles.companyName}>BE BRANDD</Text>
          <View style={styles.containerSearchIcon}>
            <Icon
              name="ios-search"
              size={20}
              color={Color.accent}
              onPress={() => navigation.openDrawer()}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    marginTop: Platform.OS === "ios" ? StatusBar.currentHeight : 0,
    width: "100%",
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
  },
  backIcon: {
    marginLeft: 10,
    width: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  menuIcon: {
    width: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  companyName: {
    fontSize: 24,
    fontWeight: "700",
    color: Color.accent,
    textAlign: "center",
    flex: 1,
  },
  containerSearchIcon: {
    backgroundColor: Color.white,
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginRight: 15,
    marginLeft: 15,
  },
  searchIcon: {},
});

export default CustomHeader;
