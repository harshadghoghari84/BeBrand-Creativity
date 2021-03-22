import React, { Component } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
// relative path
import TopTabBar from "../../components/TopTabBar";
import Packages from "./Packages";
import FreePkg from "./FreePkg";
import PremiumPkg from "./PremiumPkg";
import { ScrollView } from "react-native";
import Constant from "../../utils/Constant";

const Tab = createMaterialTopTabNavigator();

const MyTabs = ({ route }) => {
  return (
    <Tab.Navigator
      initialRouteName={
        route?.params?.title && route?.params?.title !== null
          ? route.params.title
          : Constant.titFree
      }
      tabBar={(props) => <TopTabBar {...props} arr={2} isShadow={true} />}
    >
      <Tab.Screen
        name={Constant.titFree}
        component={FreePkg}
        initialParams={{
          isGoback:
            route?.params?.isGoback && route?.params?.isGoback !== null
              ? route.params.isGoback
              : null,
        }}
      />
      <Tab.Screen
        name={Constant.titPrimium}
        component={PremiumPkg}
        initialParams={{
          isGoback:
            route?.params?.isGoback && route?.params?.isGoback !== null
              ? route.params.isGoback
              : null,
        }}
      />
    </Tab.Navigator>
  );
};

export default MyTabs;
