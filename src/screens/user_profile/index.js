import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { View } from "react-native";
// relative path
import Constant from "../../utils/Constant";
import PersonalProfile from "./PersonalProfile";
import BusinessProfile from "./BusinessProfile";
import TopTabBar from "../../components/TopTabBar";
import Color from "../../utils/Color";

const Tab = createMaterialTopTabNavigator();

const UserProfile = (props) => {
  const renderMainView = () => {
    return (
      <View style={{ flex: 1, backgroundColor: Color.white }}>
        <Tab.Navigator tabBar={(props) => <TopTabBar {...props} arr={2} />}>
          <Tab.Screen
            name={Constant.navPersonalProfile}
            component={PersonalProfile}
          />
          <Tab.Screen
            name={Constant.navBusinessProfile}
            component={BusinessProfile}
          />
        </Tab.Navigator>
      </View>
    );
  };
  return renderMainView();
};

export default UserProfile;
