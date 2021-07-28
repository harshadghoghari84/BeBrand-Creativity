import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  Text,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import FastImage from "react-native-fast-image";
import { inject, observer } from "mobx-react";
import { toJS } from "mobx";
import Ionicons from "react-native-vector-icons/Ionicons";
// relative Path
import Icon from "../../components/svgIcons";
import Color from "../../utils/Color";
import Modal from "../../components/modal";
import Constant from "../../utils/Constant";

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
  designStore,
  bePrem = false,
  bottomBorder = false,
  position = false,
  scrollUp = false,
}) => {
  const [visibleModal, setVisibleModal] = useState(false);
  const [isNewNotification, setIsNewNotification] = useState(false);

  useEffect(() => {
    const val = toJS(designStore.isNewNotification);
    setIsNewNotification(val);
  }, [designStore.isNewNotification]);
  useEffect(() => {
    console.log("scrollUp", scrollUp);
  }, [scrollUp]);

  const toggleVisible = () => {
    setVisibleModal(!visibleModal);
  };

  return (
    <View
      style={[
        styles.container,
        position && styles.posAbs,
        isShadow && styles.shadow,
        bottomBorder && styles.borderBottom,
      ]}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Color.white}
        // translucent={false}
      />
      <Modal visible={visibleModal} toggleVisible={toggleVisible} />
      <SafeAreaView style={styles.safeArea}>
        <View style={{ ...styles.header }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {isBackVisible === true && (
              <TouchableOpacity
                style={styles.icons}
                onPress={() => navigation.goBack()}
              >
                {Platform.OS === "ios" ? (
                  <View
                    style={{
                      // backgroundColor: "green",
                      height: 25,
                      alignItems: "center",
                      justifyContent: "center",
                      // marginBottom: 20,
                    }}
                  >
                    <Ionicons
                      name="chevron-back"
                      color={Color.darkBlue}
                      size={25}
                    />
                  </View>
                ) : (
                  <Icon
                    name="back"
                    fill={Color.darkBlue}
                    height={17}
                    width={17}
                  />
                )}
              </TouchableOpacity>
            )}
            {menu === true && (
              <TouchableOpacity
                style={[
                  styles.icons,
                  { paddingLeft: Platform.OS === "ios" ? 5 : 10 },
                ]}
                onPress={() => navigation.openDrawer()}
              >
                <Icon
                  name="menu"
                  fill={Color.darkBlue}
                  height={17}
                  width={17}
                />
              </TouchableOpacity>
            )}
            {isTtileImage === true ? (
              <FastImage
                source={require("../../assets/img/headerlogo.png")}
                resizeMode={FastImage.resizeMode.contain}
                style={styles.companyLogo}
              />
            ) : null}
          </View>
          {isTtileImage === true ? null : (
            <Text
              style={{
                fontSize: 18,
                color: Color.darkBlue,
              }}
            >
              {ScreenTitle}
            </Text>
          )}

          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            {/* {notification === true && (
              <TouchableOpacity
                onPress={() => navigation.navigate(Constant.navNotification)}
                style={[styles.icons, { paddingRight: 10 }]}
              >
                <Icon
                  name="notification"
                  fill={Color.darkBlue}
                  height={17}
                  width={17}
                />
                {isNewNotification && (
                  <View
                    style={{
                      height: 9,
                      width: 9,
                      backgroundColor: "red",
                      borderRadius: 5,
                      borderColor: "darkBlue",
                      borderWidth: 1,
                      position: "absolute",
                      top: 0.5,
                      right: 10,
                    }}
                  />
                )}
              </TouchableOpacity>
            )} */}
            {/* {langauge === true && (
              <View style={[styles.icons, { paddingRight: 10 }]}>
                <TouchableOpacity
                  onPress={() => {
                    setVisibleModal(true);
                  }}
                >
                  <Icon
                    name="language"
                    fill={Color.darkBlue}
                    height={17}
                    width={17}
                  />
                </TouchableOpacity>
              </View>
            )} */}
            {bePrem === true && (
              <View style={[styles.icons, { paddingRight: 10 }]}>
                <TouchableOpacity
                  style={{
                    borderColor: Color.darkBlue,
                    borderWidth: 1,
                    borderRadius: 15,
                    flexDirection: "row",
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                  }}
                  onPress={() =>
                    navigation.navigate(
                      Platform.OS === "ios"
                        ? Constant.titPrimiumIos
                        : Constant.titPrimium
                    )
                  }
                >
                  <Icon
                    name="Premium"
                    fill={Color.primary}
                    height={13}
                    width={13}
                  />
                  <Text
                    style={{
                      color: Color.darkBlue,
                      fontSize: 10,
                      paddingLeft: 5,
                    }}
                  >
                    Be Premium
                  </Text>
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
    backgroundColor: Color.white,
  },
  safeArea: {
    backgroundColor: Color.white,
  },
  header: {
    height: 45,
    paddingLeft: 10,
    paddingRight: 1,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  companyLogo: {
    // flex: 1,
    width: 150,
    height: 18,
  },
  icons: {
    paddingLeft: 5,
    // backgroundColor: "red",
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  borderBottom: {
    borderBottomColor: Color.blackTransBorder,
    borderBottomWidth: 0.5,
  },
  posAbs: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
  },
});

// export default CustomHeader;
export default inject("designStore", "userStore")(observer(CustomHeader));
