import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Constant from "../utils/Constant";
import HomeScreen from "../screens/home/Home";
import CustomHeader from "../screens/common/CustomHeader";

const HomeScreenStack = createStackNavigator();

const HomeScreenStackComponent = ({ navigation }) => {
  return (
    <HomeScreenStack.Navigator
      headerMode="screen"
      // initialRouteName={Constant.navHome}
    >
      <HomeScreenStack.Screen
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
    </HomeScreenStack.Navigator>
  );
};

export default HomeScreenStackComponent;
