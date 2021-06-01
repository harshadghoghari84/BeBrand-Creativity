import { toJS } from "mobx";
import { inject, observer } from "mobx-react";
import React, { Component, useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
  SafeAreaView,
  ActivityIndicator,
  StatusBar,
  Platform,
} from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

import Color from "../utils/Color";
import Common from "../utils/Common";
import Constant from "../utils/Constant";
import Button from "./Button";
import Icon from "./svgIcons";

const TopTabBar = ({
  navigation,
  navigationState,
  isShadow,
  isBgcColor,
  isDownload,
  designStore,
  isBackVisible,
  isPackageScreen,
}) => {
  const isMountedRef = Common.useIsMountedRef();

  const [data, setData] = useState(navigationState.routeNames);
  const [active, setActive] = useState(0);
  const [xTab, setxTab] = useState([]);
  const [translateX, settranslateX] = useState(new Animated.Value(0));

  const isDownloadingP = toJS(designStore.isDownloadStartedPersonal);
  const isDownloadingB = toJS(designStore.isDownloadStartedBusiness);
  const isPersonalDesignLoad = toJS(designStore.isPersonalDesignLoad);
  const isBusinessDesignLoad = toJS(designStore.isBusinessDesignLoad);

  useEffect(() => {
    setxTab(navigationState.routeNames.map((item) => 0));
  }, []);

  useEffect(() => {
    if (isMountedRef.current) {
      changeTab(navigationState.index);
    }
  }, [navigationState.index]);

  const changeTab = (currantIndex) => {
    const selectedXTab = xTab[currantIndex] ? xTab[currantIndex] : 0;
    Animated.spring(translateX, {
      toValue: selectedXTab,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  /*
  ..######...#######..##.....##.########...#######..##....##....###....##....##.########
  .##....##.##.....##.###...###.##.....##.##.....##.###...##...##.##...###...##....##...
  .##.......##.....##.####.####.##.....##.##.....##.####..##..##...##..####..##....##...
  .##.......##.....##.##.###.##.########..##.....##.##.##.##.##.....##.##.##.##....##...
  .##.......##.....##.##.....##.##........##.....##.##..####.#########.##..####....##...
  .##....##.##.....##.##.....##.##........##.....##.##...###.##.....##.##...###....##...
  ..######...#######..##.....##.##.........#######..##....##.##.....##.##....##....##...
  */
  const renderTop = () => {
    return (
      <View
        style={[styles.container, Platform.OS === "android" && styles.shadow]}
      >
        {isBackVisible === true && (
          <TouchableOpacity
            style={styles.icons}
            onPress={() => navigation.goBack()}
          >
            <Icon name="back" fill={Color.darkBlue} height={17} width={17} />
          </TouchableOpacity>
        )}
        {/* <View
          style={[
            isShadow ? styles.shadow : null,
            {
              // backgroundColor: Color.bgcColor,
            },
          ]}
        > */}
        <View
          style={{
            // marginLeft: "auto",
            // marginRight: "auto",
            backgroundColor: Color.txtInBgColor,
            padding: 3,
            borderRadius: 50,
            marginHorizontal: isPackageScreen ? 70 : 100,
          }}
        >
          <View style={styles.selecteTabs}>
            <Animated.View
              style={{
                position: "absolute",
                width: "50%",
                height: "100%",
                backgroundColor: Color.white,
                borderRadius: 50,
                transform: [{ translateX }],
              }}
            />
            {data.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  disabled={navigationState.index == index}
                  onLayout={(event) => {
                    const currentTab = xTab;
                    currentTab[index] = event.nativeEvent.layout.x;
                    setxTab(currentTab);
                    navigationState?.index > 0 &&
                      navigationState?.index === index &&
                      changeTab(index);
                  }}
                  onPress={() =>
                    navigation.navigate(navigationState.routeNames[index])
                  }
                  style={{
                    flexDirection: "row",
                    width: "50%",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 50,
                  }}
                >
                  <Text
                    style={{
                      color: Color.darkBlue,
                      fontSize: 15,
                      textTransform: "capitalize",
                      fontWeight: "700",
                    }}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        {/* </View> */}

        {/* {isDownload && (
          <TouchableOpacity
            disabled={
              (isDownloadingP && isDownloadingP === true) ||
              (isDownloadingB && isDownloadingB === true) ||
              isPersonalDesignLoad === true ||
              isBusinessDesignLoad === true
            }
            style={{ position: "absolute", right: 20 }}
            onPress={() => {
              if (data[navigationState.index] === Constant.navPersonalProfile) {
                designStore.setIsDownloadStartedPersonal(true);
              } else {
                designStore.setIsDownloadStartedBusiness(true);
              }
            }}
          >
            {(isDownloadingP && isDownloadingP === true) ||
            (isDownloadingB && isDownloadingB === true) ||
            isPersonalDesignLoad === true ||
            isBusinessDesignLoad === true ? (
              <ActivityIndicator size={18} color={Color.darkBlue} />
            ) : (
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Icon
                  name="download"
                  height={14}
                  width={14}
                  fill={Color.grey}
                />
                <Text style={{ color: Color.grey, fontFamily: "Nunito-Light" }}>
                  save
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )} */}
      </View>
    );
  };

  const renderMainview = () => {
    return (
      <SafeAreaView
        style={[
          { backgroundColor: Color.white },
          Platform.OS === "ios" && styles.shadow,
        ]}
      >
        {/* {isDownload && (
          <StatusBar
            barStyle="dark-content"
            backgroundColor={Color.white}
            translucent={Platform.OS === "ios" ? true : false}
          />
        )} */}
        {renderTop()}
      </SafeAreaView>
    );
  };

  return renderMainview();
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    backgroundColor: Color.white,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderBottomColor: Color.txtIntxtcolor,
    borderBottomWidth: 1,
  },
  mainView: {
    width: "100%",
  },
  bottomStyle: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  selecteTabs: {
    height: 30,
    // width: "50%",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 50,
  },
  tabsView: {
    color: Color.white,
    fontSize: 15,
    fontWeight: "700",
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
  icons: {
    position: "absolute",
    left: 20,
  },
});
// export default TopTabBar;
export default inject("designStore", "userStore")(observer(TopTabBar));
