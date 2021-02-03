import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from "react-native";
import * as Animatable from "react-native-animatable";
import Color from "../utils/Color";

const TabsAnimation = (props) => {
  const [active, setActive] = useState(props.defaultTab ? props.defaultTab : 0);
  const [xTabOne, setxTabOne] = useState(0);
  const [xTabTwo, setxTabTwo] = useState(0);
  const [translateX, settranslateX] = useState(new Animated.Value(0));

  useEffect(() => {
    if (props.onTabChange)
      props.onTabChange(props.defaultTab ? props.defaultTab : 0);
  }, []);

  const handleSlide = (type) => {
    if (active == 0) {
      setActive(1);
      if (props.onTabChange) props.onTabChange(1);
    } else {
      setActive(0);
      if (props.onTabChange) props.onTabChange(0);
    }
    Animated.spring(translateX, {
      toValue: type,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (active === 0 && xTabOne > 0) {
      Animated.spring(translateX, {
        toValue: xTabOne,
        duration: 100,
        useNativeDriver: true,
      }).start();
    } else if (active === 1 && xTabTwo > 0) {
      Animated.spring(translateX, {
        toValue: xTabTwo,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  }, [xTabOne, xTabTwo, props.defaultTab]);

  const renderBody = () => {
    return (
      <>
        {active === 0 ? (
          <View
            // animation="slideInLeft"
            // direction="normal"
            // duration={300}
            style={{
              flex: 1,
            }}
          >
            {props.child1}
          </View>
        ) : (
          <View
            // animation="slideInRight"
            // direction="normal"
            // duration={300}
            style={{
              flex: 1,
            }}
          >
            {props.child2}
          </View>
        )}
      </>
    );
  };
  const renderSelectionTab = () => {
    return (
      <View
        style={{
          width: "90%",
          marginLeft: "auto",
          marginRight: "auto",
          backgroundColor: props.bgColor,
          padding: 5,
          borderRadius: 50,
          marginTop: 10,
          // marginVertical: 10,
        }}
      >
        <View style={style.selecteTabs}>
          <Animated.View
            style={{
              position: "absolute",
              width: "50%",
              height: "100%",
              backgroundColor: props.AnimbgColor,
              borderRadius: 50,
              transform: [{ translateX }],
            }}
          />
          <TouchableOpacity
            disabled={active == 0}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
            onLayout={(event) => setxTabOne(event.nativeEvent.layout.x)}
            onPress={() => handleSlide(xTabOne)}
          >
            <Text
              style={[
                style.tabsView,
                {
                  color: active == 0 ? props.activeColor : props.InactiveColor,
                },
              ]}
            >
              {props.txt1}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={active == 1}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
            onLayout={(event) => setxTabTwo(event.nativeEvent.layout.x)}
            onPress={() => handleSlide(xTabTwo)}
          >
            <Text
              style={[
                style.tabsView,
                {
                  color: active == 1 ? props.activeColor : props.InactiveColor,
                },
              ]}
            >
              {props.txt2}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const renderMainView = () => {
    return (
      <View style={{ flex: props.flex }}>
        {renderSelectionTab()}
        {renderBody()}
      </View>
    );
  };
  return renderMainView();
};

export default TabsAnimation;

const style = StyleSheet.create({
  selecteTabs: {
    height: 35,
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: Color.blackTransparant,
    borderRadius: 50,
    position: "relative",
  },
  tabsView: {
    color: Color.white,
    fontSize: 16,
    fontWeight: "700",
  },
});
