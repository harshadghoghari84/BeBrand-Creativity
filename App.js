import React, { useEffect, useState } from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { Provider as PaperProvider } from "react-native-paper";
import { ApolloProvider, useLazyQuery } from "@apollo/client";
import { Provider } from "mobx-react";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View } from "react-native";

// relative path
import Common from "./src/utils/Common";
import { paperTheme } from "./src/utils/Theme";
import UserStore from "./src/mobx/UserStore";
import DesignStore from "./src/mobx/DesignStore";
import SplashScreen from "./src/screens/Splash";
import SignupScreen from "./src/screens/Signup";
import LanguageSelectionScreen from "./src/screens/LanguageSelection";
import OtpScreen from "./src/screens/Otp";
import Constant from "./src/utils/Constant";
import client from "./src/utils/ApolloClient";
import CustomDrawer from "./src/screens/common/CustomDrawer";
import HomeStackComponent from "./src/stacks/HomeStack";
import Signin from "./src/screens/Signin";
import BottomBar from "./src/screens/common/BottomBar";
import Home from "./src/screens/home/Home";
import UserDesign from "./src/screens/UserDesign";
import UserPackage from "./src/screens/UserPackage";
import Notification from "./src/screens/Notification";
import MydesignStack from "./src/stacks/MydesignStack";
import MyPackageStack from "./src/stacks/MypackageStack";
import HomeScreenStackComponent from "./src/stacks/HomeScreenStack";
import NotificationStack from "./src/stacks/NotificationStack";

Common.setTranslationInit();

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

// const BottomTabs = () => {
//   return (
//     <Tab.Navigator
//       initialRouteName={Constant.navHome}
//       tabBar={(props) => <BottomBar {...props} />}
//     >
//       <Tab.Screen name={Constant.navHome} component={HomeStackComponent} />
//       {/* <Tab.Screen name={Constant.navDesign} component={MydesignStack} />
//       <Tab.Screen name={Constant.navPackage} component={MyPackageStack} />
//       <Tab.Screen
//         name={Constant.navNotification}
//         component={NotificationStack}
//       /> */}
//     </Tab.Navigator>
//   );
// };

const DrawerScreen = () => {
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawer {...props} />}>
      <Drawer.Screen
        name={Constant.navHomeStack}
        component={HomeStackComponent}
      />
    </Drawer.Navigator>
  );
};

const App = () => {
  return (
    <Provider designStore={DesignStore} userStore={UserStore}>
      <ApolloProvider client={client}>
        <PaperProvider theme={paperTheme}>
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{ headerShown: false }}
              initialRouteName={Constant.navSplash}
            >
              <Stack.Screen
                name={Constant.navSplash}
                component={SplashScreen}
              />
              <Stack.Screen name={Constant.navSignIn} component={Signin} />

              <Stack.Screen
                name={Constant.navLangSelection}
                component={LanguageSelectionScreen}
              />
              {/* <Stack.Screen
                name={Constant.navSignIn}
                component={SigninScreen}
              /> */}
              <Stack.Screen
                name={Constant.navSignUp}
                component={SignupScreen}
              />
              <Stack.Screen name={Constant.navOtp} component={OtpScreen} />

              <Stack.Screen
                name={Constant.navHomeStack}
                component={DrawerScreen}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </ApolloProvider>
    </Provider>
  );
};

export default App;
