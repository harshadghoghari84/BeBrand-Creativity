import React, { useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  Image,
  Text,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
// relative Path
import Icon from "../../components/svgIcons";
import Color from "../../utils/Color";
import Modal from "../../components/modal";
import Constant from "../../utils/Constant";
import FastImage from "react-native-fast-image";

const CustomHeader = ({
  langauge = false,
  isBackVisible = false,
  navigation,
  search = false,
  notification = false,
  empty = false,
  menu = false,
  isTtileImage = false,
  ScreenTitle,
  isShadow = false,
}) => {
  const [visibleModal, setVisibleModal] = useState(false);

  const toggleVisible = () => {
    setVisibleModal(!visibleModal);
  };
  return (
    <View style={[styles.container, isShadow && styles.shadow]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Color.primary}
        translucent={Platform.OS === "ios" ? true : false}
      />
      <Modal visible={visibleModal} toggleVisible={toggleVisible} />
      <SafeAreaView style={styles.safeArea}>
        <View style={{ ...styles.header }}>
          <View
            style={{
              flexDirection: "row",
            }}
          >
            {isBackVisible === true && (
              <TouchableOpacity
                style={styles.icons}
                onPress={() => navigation.goBack()}
              >
                <Icon name="back" fill={Color.white} height={20} width={20} />
              </TouchableOpacity>
            )}
            {menu === true && (
              <TouchableOpacity
                style={[styles.icons, { paddingLeft: 10 }]}
                onPress={() => navigation.openDrawer()}
              >
                <Icon name="menu" fill={Color.white} height={20} width={20} />
              </TouchableOpacity>
            )}
          </View>
          {isTtileImage === true ? (
            <FastImage
              source={require("../../assets/img/LOGO2.png")}
              resizeMode={FastImage.resizeMode.contain}
              style={styles.companyLogo}
            />
          ) : (
            <Text
              style={{
                fontSize: 18,
                color: Color.white,
              }}
            >
              {ScreenTitle}
            </Text>
          )}

          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            {search === true && (
              <View style={styles.icons}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                  <Icon
                    name="search"
                    fill={Color.white}
                    height={20}
                    width={20}
                  />
                </TouchableOpacity>
              </View>
            )}
            {notification === true && (
              <TouchableOpacity
                onPress={() => navigation.navigate(Constant.navNotification)}
                style={[styles.icons, { paddingRight: 10 }]}
              >
                <Icon
                  name="notification"
                  fill={Color.white}
                  height={20}
                  width={20}
                />
              </TouchableOpacity>
            )}
            {langauge === true && (
              <View style={[styles.icons, { paddingRight: 10 }]}>
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
              <View style={styles.icons}>
                <Icon
                  name="notification"
                  fill={"transparent"}
                  height={20}
                  width={30}
                />
              </View>
            )}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 3,
    backgroundColor: Color.primary,
  },
  safeArea: {
    backgroundColor: Color.primary,
  },
  header: {
    height: 50,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  companyLogo: {
    flex: 1,
    height: 18,
  },
  icons: {
    paddingLeft: 5,
  },
  shadow: {
    shadowColor: Color.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
});

export default CustomHeader;
