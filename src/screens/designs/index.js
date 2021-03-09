import React, { Component } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
// relative path
import Constant from "../../utils/Constant";
import PersonalDesign from "./PersonalDesign";
import BussinessDesign from "./BussinessDesign";
import TopTabBar from "../../components/TopTabBar";
import CustomHeader from "../common/CustomHeader";

const Tab = createMaterialTopTabNavigator();

const MyTabs = ({ route }) => {
  const { designs, curDesign } = route.params;
  return (
    <Tab.Navigator
      initialRouteName={
        curDesign.designType === Constant.designTypeBUSINESS
          ? Constant.navBusinessProfile
          : Constant.navPersonalProfile
      }
      tabBar={(props) => <TopTabBar {...props} isShadow={true} />}
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
        }}
      />
    </Tab.Navigator>
  );
};

export default MyTabs;
