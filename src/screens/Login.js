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
import * as Animatable from "react-native-animatable";

// relative path
import Background from "../components/Background";
import Header from "../components/Header";
import Logo from "../components/Logo";
import Color from "../utils/Color";
import Common from "../utils/Common";
import Constant from "../utils/Constant";
import LangKey from "../utils/LangKey";
import Signin from "./Signin";
import Signup from "./Signup";
import TabsAnimation from "../components/TabsAnimation";

const Login = (props) => {
  /*
  .##....##....###....##.....##.####..######......###....########.####..#######..##....##
  .###...##...##.##...##.....##..##..##....##....##.##......##.....##..##.....##.###...##
  .####..##..##...##..##.....##..##..##.........##...##.....##.....##..##.....##.####..##
  .##.##.##.##.....##.##.....##..##..##...####.##.....##....##.....##..##.....##.##.##.##
  .##..####.#########..##...##...##..##....##..#########....##.....##..##.....##.##..####
  .##...###.##.....##...##.##....##..##....##..##.....##....##.....##..##.....##.##...###
  .##....##.##.....##....###....####..######...##.....##....##....####..#######..##....##
  */

  /*
  ..######...#######..##.....##.########...#######..##....##....###....##....##.########..######.
  .##....##.##.....##.###...###.##.....##.##.....##.###...##...##.##...###...##....##....##....##
  .##.......##.....##.####.####.##.....##.##.....##.####..##..##...##..####..##....##....##......
  .##.......##.....##.##.###.##.########..##.....##.##.##.##.##.....##.##.##.##....##.....######.
  .##.......##.....##.##.....##.##........##.....##.##..####.#########.##..####....##..........##
  .##....##.##.....##.##.....##.##........##.....##.##...###.##.....##.##...###....##....##....##
  ..######...#######..##.....##.##.........#######..##....##.##.....##.##....##....##.....######.
  */
  const renderSelectTabs = () => {
    return (
      <TabsAnimation
        bgColor={Color.blackTransparant}
        AnimbgColor={Color.darkBlue}
        activeColor={Color.white}
        InactiveColor={Color.darkBlue}
        txt1="SignIn"
        txt2="SignUp"
        child1={<Signin />}
        child2={<Signup />}
      />
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
