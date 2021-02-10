import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { inject, observer } from "mobx-react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

// relative path
import Background from "../components/Background";
import Logo from "../components/Logo";
import Color from "../utils/Color";
import Common from "../utils/Common";
import Constant from "../utils/Constant";
import LangKey from "../utils/LangKey";
import Signin from "./Signin";
import Signup from "./Signup";

import TopTabBar from "../components/TopTabBar";

const Tab = createMaterialTopTabNavigator();

const Login = (props) => {
  const renderSelectTabs = () => {
    return (
      <Tab.Navigator tabBar={(props) => <TopTabBar {...props} arr={2} />}>
        <Tab.Screen name="Signin" component={Signin} />
        <Tab.Screen name="Signup" component={Signup} />
      </Tab.Navigator>
    );
  };
  const renderMainView = () => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <Background>
          <Logo />
          {renderSelectTabs()}
        </Background>
      </ScrollView>
    );
  };
  return renderMainView();
};

export default inject("userStore")(observer(Login));

const style = StyleSheet.create({
  selecteTabs: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: Color.blackTransparant,
    borderRadius: 50,
    position: "relative",
  },
  tabsView: {
    color: Color.white,
    fontSize: 18,
    fontWeight: "700",
  },
});
