import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Constant from "../utils/Constant";

import CustomHeader from "../screens/common/CustomHeader";

import UserDesign from "../screens/UserDesign";
import DesignScreen from "../screens/designs/index";

const DesignStack = createStackNavigator();

const MydesignStack = ({ navigation }) => {
  return (
    <DesignStack.Navigator headerMode="screen">
      <DesignStack.Screen
        name={Constant.navDesigns}
        component={UserDesign}
        options={{
          header: (props) => (
            <CustomHeader
              isBackVisible={true}
              menu={true}
              empty={true}
              isShadow={true}
              ScreenTitle={"My Design"}
              {...props}
            />
          ),
        }}
      />
    </DesignStack.Navigator>
  );
};

export default MydesignStack;
