import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Constant from "../utils/Constant";
import HomeScreen from "../screens/home/Home";
import CustomHeader from "../screens/common/CustomHeader";
import DesignScreen from "../screens/designs/index";
// import CarouselSample from "../screens/sample/CarouselSample";
import UserDesign from "../screens/UserDesign";
import UserPackage from "../screens/UserPackage";
import UserProfile from "../screens/user_profile";
import ProfileUser from "../screens/ProfileUser";
import WebViews from "../components/WebViews";
import Notification from "../screens/Notification";
import Packages from "../screens/pacakges/Packages";
import MyTabs from "../screens/pacakges";
import Otp from "../screens/Otp";
import ReferAndEarn from "../screens/ReferAndEarn";

const HomeStack = createStackNavigator();

const HomeStackComponent = ({ navigation }) => {
  return (
    <HomeStack.Navigator initialRouteName={Constant.navHome}>
      <HomeStack.Screen
        name={Constant.navHome}
        component={HomeScreen}
        options={{
          header: (props) => (
            <CustomHeader
              langauge={true}
              notification={true}
              menu={true}
              isTtileImage={true}
              {...props}
            />
          ),
        }}
      />

      <HomeStack.Screen
        name={Constant.navPro}
        component={MyTabs}
        options={{
          header: (props) => (
            <CustomHeader
              isBackVisible={true}
              menu={true}
              empty={true}
              ScreenTitle={"Packages"}
              {...props}
            />
          ),
        }}
      />

      <HomeStack.Screen
        name={Constant.navWebView}
        component={WebViews}
        options={{
          header: (props) => (
            <CustomHeader
              isBackVisible={true}
              empty={true}
              ScreenTitle={"Legal"}
              {...props}
            />
          ),
        }}
      />

      <HomeStack.Screen
        name={Constant.navDesigns}
        component={UserDesign}
        options={{
          header: (props) => (
            <CustomHeader
              isBackVisible={true}
              menu={true}
              empty={true}
              isShadow={true}
              ScreenTitle={"User Design"}
              {...props}
            />
          ),
        }}
      />

      <HomeStack.Screen
        name={Constant.navPackage}
        component={UserPackage}
        options={{
          header: (props) => (
            <CustomHeader
              isBackVisible={true}
              menu={true}
              empty={true}
              isShadow={true}
              ScreenTitle={"User Package"}
              {...props}
            />
          ),
        }}
      />

      <HomeStack.Screen
        name={Constant.navDesign}
        component={DesignScreen}
        options={{
          header: (props) => (
            <CustomHeader
              isBackVisible={true}
              menu={true}
              empty={true}
              ScreenTitle={"Designs"}
              {...props}
            />
          ),
        }}
      />

      <HomeStack.Screen
        name={Constant.navProfile}
        component={UserProfile}
        options={{
          header: (props) => (
            <CustomHeader
              isBackVisible={true}
              empty={true}
              menu={true}
              // isShadow={true}
              ScreenTitle={"PostProfile"}
              {...props}
            />
          ),
        }}
      />
      <HomeStack.Screen
        name={Constant.navProfileUser}
        component={ProfileUser}
        options={{
          header: (props) => (
            <CustomHeader
              isBackVisible={true}
              empty={true}
              ScreenTitle={"ProfileUser"}
              {...props}
            />
          ),
        }}
      />
      <HomeStack.Screen
        name={Constant.navNotification}
        component={Notification}
        options={{
          header: (props) => (
            <CustomHeader
              isBackVisible={true}
              empty={true}
              isShadow={true}
              ScreenTitle={"Notification"}
              {...props}
            />
          ),
        }}
      />
      <HomeStack.Screen
        name={Constant.navReferandEarn}
        component={ReferAndEarn}
        options={{
          header: (props) => (
            <CustomHeader
              isBackVisible={true}
              menu={true}
              empty={true}
              ScreenTitle={"Reffer & Earn"}
              {...props}
            />
          ),
        }}
      />
    </HomeStack.Navigator>
  );
};

export default HomeStackComponent;
