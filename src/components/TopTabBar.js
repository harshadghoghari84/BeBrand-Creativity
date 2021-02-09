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

import Color from "../utils/Color";

const TopTabBar = ({ arr, navigation, navigationState }) => {
  const [data, setData] = useState(navigationState.routeNames);
  const [active, setActive] = useState(0);
  const [xTab, setxTab] = useState([]);
  const [translateX, settranslateX] = useState(new Animated.Value(0));

  useEffect(() => {
    setxTab(navigationState.routeNames.map((item) => 0));
  }, []);

  useEffect(() => {
    console.log("navigationState.index: ", navigationState.index);
    changeTab(navigationState.index);
  }, [navigationState.index]);

  const changeTab = (currantIndex) => {
    const selectedXTab = xTab[currantIndex] ? xTab[currantIndex] : 0;
    console.log("selectedXTab: ", selectedXTab);
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
  const renderBottom = () => {
    return (
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
    );
  };

  const renderMainview = () => {
    return <View>{renderBottom()}</View>;
  };

  return renderMainview();
};

const styles = StyleSheet.create({
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
});
export default TopTabBar;
