import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Constant from "../utils/Constant";

import CustomHeader from "../screens/common/CustomHeader";

import UserPackage from "../screens/UserPackage";

const PackageStack = createStackNavigator();

const MyPackageStack = ({ navigation }) => {
  return (
    <PackageStack.Navigator headerMode="screen">
      <PackageStack.Screen
        name={Constant.navPackage}
        component={UserPackage}
        options={{
          header: (props) => (
            <CustomHeader
              isBackVisible={true}
              menu={true}
              empty={true}
              isShadow={true}
              ScreenTitle={"My Package"}
              {...props}
            />
          ),
        }}
      />
    </PackageStack.Navigator>
  );
};

export default MyPackageStack;
