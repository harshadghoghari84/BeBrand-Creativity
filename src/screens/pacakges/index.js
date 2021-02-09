import React, { Component } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
// relative path
import TopTabBar from "../../components/TopTabBar";
import Packages from "./Packages";

const Tab = createMaterialTopTabNavigator();

export default function MyTabs() {
  return (
    <Tab.Navigator tabBar={(props) => <TopTabBar {...props} arr={3} />}>
      <Tab.Screen name="free" component={Packages} />
      <Tab.Screen name="monthly" component={Packages} />
      <Tab.Screen name="extra" component={Packages} />
    </Tab.Navigator>
  );
}
