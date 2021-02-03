import React, { useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  Text,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "../../components/svgIcons";
import FastImage from "react-native-fast-image";
import Color from "../../utils/Color";
import ProgressDialog from "./ProgressDialog";
import Modal from "../../components/modal";

const CustomHeader = ({
  langauge = false,
  isBackVisible = false,
  navigation,
  search = false,
  empty = false,
}) => {
  // const { backKey } = route.params;

  const [visibleModal, setVisibleModal] = useState(false);

  const toggleVisible = () => {
    setVisibleModal(!visibleModal);
  };
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
      <StatusBar
        barStyle="light-content"
        translucent={Platform.OS === "ios" ? true : false}
      />
      <Modal visible={visibleModal} toggleVisible={toggleVisible} />

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
            style={styles.companyLogo}
            resizeMode={FastImage.resizeMode.contain}
          />
          {search === true && (
            <View style={styles.containerSearchIcon}>
              <TouchableOpacity onPress={() => navigation.openDrawer()}>
                <Icon name="search" fill={Color.white} height={20} width={20} />
              </TouchableOpacity>
            </View>
          )}
          {langauge === true && (
            <View style={styles.containerSearchIcon}>
              <TouchableOpacity
                onPress={() => {
                  setVisibleModal(true);
                }}
              >
                <Icon
                  name="language"
                  fill={Color.white}
                  height={20}
                  width={20}
                />
              </TouchableOpacity>
            </View>
          )}
          {empty === true && (
            <View style={styles.containerSearchIcon}>
              <Icon
                name="language"
                fill={"transparent"}
                height={20}
                width={20}
              />
            </View>
          )}
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
  companyLogo: {
    width: "65%",
    height: 40,
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
