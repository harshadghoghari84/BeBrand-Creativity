import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { View } from "react-native";
// relative path
import Constant from "../../utils/Constant";
import PersonalProfile from "./PersonalProfile";
import BusinessProfile from "./BusinessProfile";
import TopTabBar from "../../components/TopTabBar";
import Color from "../../utils/Color";
import Common from "../../utils/Common";
import LangKey from "../../utils/LangKey";

const Tab = createMaterialTopTabNavigator();

const UserProfile = ({ route }) => {
  return (
    <View style={{ flex: 1, backgroundColor: Color.white }}>
      <Tab.Navigator
        initialRouteName={
          route?.params?.title && route?.params?.title !== null
            ? route.params.title
            : Constant.titPersonalProfile
        }
        tabBar={(props) => <TopTabBar {...props} />}
      >
        <Tab.Screen
          name={Constant.titPersonalProfile}
          component={PersonalProfile}
        />
        <Tab.Screen
          name={Constant.titBusinessProfile}
          component={BusinessProfile}
        />
      </Tab.Navigator>
    </View>
  );
};

export default UserProfile;
