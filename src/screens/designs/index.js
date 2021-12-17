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

const MyTabs = ({ route, navigation }) => {
  const {
    designs,
    curDesign,
    curItemIndex,
    curPackageType,
    curDesignId,
    curCatId,
    activeCat,
  } = route.params;

  return (
    <Tab.Navigator
      swipeEnabled={false}
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
          curDesignId: curDesignId,
          curCatId: curCatId,
          activeCat: activeCat,
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
          curDesignId: curDesignId,
          curCatId: curCatId,
          activeCat: activeCat,
        }}
      />
    </Tab.Navigator>
  );
};

export default MyTabs;
