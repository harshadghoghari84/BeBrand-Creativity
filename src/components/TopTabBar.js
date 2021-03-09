import React, { Component, useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
} from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

import Color from "../utils/Color";
import Common from "../utils/Common";

const TopTabBar = ({ arr, navigation, navigationState, isShadow }) => {
  console.log("isShadow", isShadow);
  const isMountedRef = Common.useIsMountedRef();

  const [data, setData] = useState(navigationState.routeNames);
  const [active, setActive] = useState(0);
  const [xTab, setxTab] = useState([]);
  const [translateX, settranslateX] = useState(new Animated.Value(0));

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
      <View style={{ overflow: "hidden", paddingBottom: 5 }}>
        <View
          style={[
            isShadow ? styles.shadow : null,
            {
              height: 50,
            },
          ]}
        >
          <View
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              backgroundColor: Color.txtInBgColor,
              padding: 3,
              borderRadius: 50,
              marginTop: 10,
              marginBottom: 5,
            }}
          >
            <View style={styles.selecteTabs}>
              <Animated.View
                style={{
                  position: "absolute",
                  width: "50%",
                  height: "100%",
                  backgroundColor: Color.darkBlue,
                  borderRadius: 50,
                  transform: [{ translateX }],
                }}
              />
              {data.map((item, index) => {
                return (
                  <TouchableOpacity
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
                        color:
                          navigationState.index === index
                            ? Color.white
                            : Color.darkBlue,
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
        </View>
      </View>
    );
  };

  const renderMainview = () => {
    return <View>{renderTop()}</View>;
  };

  return renderMainview();
};

const styles = StyleSheet.create({
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
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 50,
    position: "relative",
  },
  tabsView: {
    color: Color.white,
    fontSize: 15,
    fontWeight: "700",
  },
  shadow: {
    backgroundColor: "#fff",
    width: "100%",
    height: 60,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});
export default TopTabBar;
