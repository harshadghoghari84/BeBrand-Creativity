import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
} from "react-native";
import Constant from "../../utils/Constant";
import PersonalProfile from "./PersonalProfile";
import BusinessProfile from "./BusinessProfile";
import TabsAnimation from "../../components/TabsAnimation";
import Color from "../../utils/Color";

const Tab = createMaterialTopTabNavigator();

const UserProfile = (props) => {
  const renderSelectTab = () => {
    return (
      <TabsAnimation
        bgColor={Color.blackTransparant}
        AnimbgColor={Color.darkBlue}
        activeColor={Color.white}
        InactiveColor={Color.darkBlue}
        txt1="Personal"
        txt2="Bussiness"
        child1={<PersonalProfile />}
        child2={<BusinessProfile />}
      />
    );
  };
  const renderMainView = () => {
    return (
      <View
        style={{ flex: 1, paddingHorizontal: 10, backgroundColor: Color.white }}
      >
        {renderSelectTab()}
      </View>
    );
  };
  return renderMainView();
};

export default UserProfile;

{
  /* <Tab.Navigator>
      <Tab.Screen
        name={Constant.navPersonalProfile}
        component={PersonalProfile}
      />
      <Tab.Screen
        name={Constant.navBusinessProfile}
        component={BusinessProfile}
      />
    </Tab.Navigator> */
}
