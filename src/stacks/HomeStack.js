import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Constant from "../utils/Constant";
import HomeScreen from "../screens/home/Home";
import CustomHeader from "../screens/common/CustomHeader";
import DesignScreen from "../screens/Design";
// import CarouselSample from "../screens/sample/CarouselSample";
import UserDesign from "../screens/UserDesign";
import UserPackage from "../screens/UserPackage";
import UserProfile from "../screens/user_profile";

const HomeStack = createStackNavigator();

const HomeStackComponent = ({ navigation }) => {
  return (
    <HomeStack.Navigator initialRouteName={Constant.navHome}>
      <HomeStack.Screen
        name={Constant.navHome}
        component={HomeScreen}
        options={{ header: (props) => <CustomHeader {...props} /> }}
      />

      <HomeStack.Screen
        name={Constant.navDesigns}
        component={UserDesign}
        options={{ header: (props) => <CustomHeader {...props} /> }}
      />

      <HomeStack.Screen
        name={Constant.navPackage}
        component={UserPackage}
        options={{ header: (props) => <CustomHeader {...props} /> }}
      />
      {/* <HomeStack.Screen
        name={Constant.navHome}
        component={CarouselSample}
        options={{
          header: (props) => <CustomHeader isBackVisible={true} {...props} />,
        }}
      /> */}
      <HomeStack.Screen
        name={Constant.navDesign}
        component={DesignScreen}
        options={{
          header: (props) => <CustomHeader isBackVisible={true} {...props} />,
        }}
      />

      <HomeStack.Screen
        name={Constant.navProfile}
        component={UserProfile}
        options={{
          header: (props) => <CustomHeader isBackVisible={true} {...props} />,
        }}
      />
    </HomeStack.Navigator>
  );
};

export default HomeStackComponent;
