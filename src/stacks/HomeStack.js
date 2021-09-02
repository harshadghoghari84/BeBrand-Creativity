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
import PremiumPkg from "../screens/pacakges/PremiumPkg";
import PremiumPkgIos from "../screens/pacakges/PremiumPkgIos";
import ViewMoreDesign from "../screens/home/ViewMoreDesign";
import ShareAndEarn from "../screens/ShareAndEarn";
import MyReward from "../screens/MyReward";
import KnowMore from "../screens/KnowMore";

const HomeStack = createStackNavigator();

const HomeStackComponent = ({ navigation }) => {
  return (
    <HomeStack.Navigator
      headerMode="screen"
      initialRouteName={Constant.navHome}
    >
      <HomeStack.Screen
        name={Constant.navHome}
        component={HomeScreen}
        options={{
          headerShown: false,

          // header: (props) => (
          //   <CustomHeader
          //     langauge={true}
          //     notification={true}
          //     isShadow={true}
          //     bePrem={true}
          //     menu={true}
          //     isTtileImage={true}
          //     {...props}
          //   />
          // ),
        }}
      />

      <HomeStack.Screen
        name={Constant.titPrimium}
        component={PremiumPkg}
        options={{
          header: (props) => (
            <CustomHeader
              isBackVisible={true}
              // menu={true}
              empty={true}
              isShadow={true}
              ScreenTitle={"Packages"}
              {...props}
            />
          ),
        }}
      />
      <HomeStack.Screen
        name={Constant.titPrimiumIos}
        component={PremiumPkgIos}
        options={{
          header: (props) => (
            <CustomHeader
              isBackVisible={true}
              // menu={true}
              isShadow={true}
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
              // menu={true}
              empty={true}
              isShadow={true}
              ScreenTitle={"My Design"}
              {...props}
            />
          ),
        }}
      />
      <HomeStack.Screen
        name={Constant.navMoreDesigns}
        component={ViewMoreDesign}
        options={{
          header: (props) => (
            <CustomHeader
              isBackVisible={true}
              // menu={true}
              empty={true}
              isShadow={true}
              langauge={true}
              ScreenTitle={"All Designs"}
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
              // menu={true}
              empty={true}
              isShadow={true}
              ScreenTitle={"My Package"}
              {...props}
            />
          ),
        }}
      />

      <HomeStack.Screen
        name={Constant.navDesign}
        component={DesignScreen}
        options={{
          headerShown: false,
          // header: (props) => (
          //   <CustomHeader
          //     isBackVisible={true}
          // menu={true}
          //     empty={true}
          //     ScreenTitle={"Designs"}
          //     {...props}
          //   />
          // ),
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
              // menu={true}
              isShadow={true}
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
              // empty={true}
              isShadow={true}
              ScreenTitle={"Notification"}
              {...props}
            />
          ),
        }}
      />
      <HomeStack.Screen
        name={Constant.navShareandEarn}
        component={ShareAndEarn}
        options={{
          header: (props) => (
            <CustomHeader
              isBackVisible={true}
              // menu={true}
              empty={true}
              isShadow={true}
              ScreenTitle={"Share & Earn"}
              {...props}
            />
          ),
        }}
      />
      <HomeStack.Screen
        name={Constant.navMyReward}
        component={MyReward}
        options={{
          header: (props) => (
            <CustomHeader
              isBackVisible={true}
              // menu={true}
              empty={true}
              isShadow={true}
              ScreenTitle={Constant.navMyReward}
              {...props}
            />
          ),
        }}
      />
      <HomeStack.Screen
        name={Constant.navKnowMore}
        component={KnowMore}
        options={{
          header: (props) => (
            <CustomHeader
              isBackVisible={true}
              // menu={true}
              empty={true}
              isShadow={true}
              ScreenTitle={"How referral work ?"}
              {...props}
            />
          ),
        }}
      />
    </HomeStack.Navigator>
  );
};

export default HomeStackComponent;
