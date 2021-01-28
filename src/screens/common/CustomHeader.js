import React from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "../../components/svgIcons";
import FastImage from "react-native-fast-image";
import Color from "../../utils/Color";

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
              <Icon name="back" fill={Color.white} height={20} width={20} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={{
              ...styles.menuIcon,
              marginLeft: isBackVisible === true ? 5 : 15,
            }}
            onPress={() => navigation.openDrawer()}
          >
            <Icon name="menu" fill={Color.white} height={20} width={20} />
          </TouchableOpacity>
          <FastImage
            source={require("../../assets/DFS.png")}
            style={{ height: 40, width: 200 }}
            resizeMode={FastImage.resizeMode.contain}
          />
          <View style={styles.containerSearchIcon}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Icon name="search" fill={Color.white} height={20} width={20} />
            </TouchableOpacity>
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
    justifyContent: "space-between",
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
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginRight: 15,
    marginLeft: 15,
  },
  searchIcon: {},
});

export default CustomHeader;
