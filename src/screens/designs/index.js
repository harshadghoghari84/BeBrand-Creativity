import React, { Component, useState } from "react";
import { View } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
// relative path
import Constant from "../../utils/Constant";
import PersonalDesign from "./PersonalDesign";
import BussinessDesign from "./BussinessDesign";
import TopTabBar from "../../components/TopTabBar";
import CustomHeader from "../common/CustomHeader";

const Tab = createMaterialTopTabNavigator();

const MyTabs = ({ route }) => {
  const { designs, curDesign, curItemIndex, curPackageType } = route.params;
  return (
    <Tab.Navigator
      initialRouteName={
        curDesign.designType === Constant.designTypeBUSINESS
          ? Constant.navBusinessProfile
          : Constant.navPersonalProfile
      }
      tabBar={(props) => (
        <TopTabBar
          {...props}
          isShadow={true}
          isBgcColor={true}
          isDownload={true}
          isBackVisible={true}
        />
      )}
    >
      <Tab.Screen
        name={Constant.navPersonalProfile}
        component={PersonalDesign}
        initialParams={{
          designs: designs,
          curDesign: curDesign,
          curScreen:
            curDesign.designType === Constant.designTypeBUSINESS
              ? Constant.navBusinessProfile
              : Constant.navPersonalProfile,
          curItemIndex: curItemIndex,
          curPackageType: curPackageType,
        }}
      />
      <Tab.Screen
        name={Constant.navBusinessProfile}
        component={BussinessDesign}
        initialParams={{
          designs: designs,
          curDesign: curDesign,
          curScreen:
            curDesign.designType === Constant.designTypeBUSINESS
              ? Constant.navBusinessProfile
              : Constant.navPersonalProfile,
          curItemIndex: curItemIndex,
          curPackageType: curPackageType,
        }}
      />
    </Tab.Navigator>
  );
};

export default MyTabs;
