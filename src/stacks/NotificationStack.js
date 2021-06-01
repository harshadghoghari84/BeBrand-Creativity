import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Constant from "../utils/Constant";

import CustomHeader from "../screens/common/CustomHeader";

import Notification from "../screens/Notification";

const NotiStack = createStackNavigator();

const NotificationStack = ({ navigation }) => {
  return (
    <NotiStack.Navigator
      headerMode="screen"
      initialRouteName={Constant.navHome}
    >
      <NotiStack.Screen
        name={Constant.navNotification}
        component={Notification}
        options={{
          header: (props) => (
            <CustomHeader
              isBackVisible={true}
              isShadow={true}
              ScreenTitle={"Notification"}
              {...props}
            />
          ),
        }}
      />
    </NotiStack.Navigator>
  );
};

export default NotificationStack;
