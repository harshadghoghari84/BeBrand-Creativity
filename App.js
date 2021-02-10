import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider as PaperProvider } from "react-native-paper";
import { ApolloProvider, useLazyQuery } from "@apollo/client";
import { Provider } from "mobx-react";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { MenuProvider } from "react-native-popup-menu";

import Common from "./src/utils/Common";
import { paperTheme } from "./src/utils/Theme";
import UserStore from "./src/mobx/UserStore";
import DesignStore from "./src/mobx/DesignStore";
// import SplashScreen from "./src/screens/Splash";
import SigninScreen from "./src/screens/Signin";
import SignupScreen from "./src/screens/Signup";
import LanguageSelectionScreen from "./src/screens/LanguageSelection";
import OtpScreen from "./src/screens/Otp";
import Constant from "./src/utils/Constant";
import client from "./src/utils/ApolloClient";
import CustomDrawer from "./src/screens/common/CustomDrawer";
import HomeStackComponent from "./src/stacks/HomeStack";
import Login from "./src/screens/Login";
import WebViews from "./src/components/WebViews";
import * as SplashScreen from "expo-splash-screen";
import GraphqlQuery from "./src/utils/GraphqlQuery";
import AsyncStorage from "@react-native-async-storage/async-storage";

Common.setTranslationInit();

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerScreen = () => (
  <Drawer.Navigator drawerContent={(props) => <CustomDrawer {...props} />}>
    <Drawer.Screen
      name={Constant.navHomeStack}
      component={HomeStackComponent}
    />
    {/* <Drawer.Screen name={Constant.navDesign} component={DesignScreen} /> */}
  </Drawer.Navigator>
);

export default function App() {
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  let Loading = false;
  useEffect(() => {
    SplashScreen.preventAutoHideAsync()
      .then((result) => {})
      .catch((err) => {});
    AsyncStorage.getItem(Constant.prfUserToken).then(async (token) => {
      token &&
        client
          .query({
            query: GraphqlQuery.user,
            errorPolicy: {
              errorPolicy: "all",
            },
          })
          .then(async (data, error) => {
            Loading = true;
            !error && data?.user && userStore.setUser(data.user);
            !isTimerRunning && (await openScreen());
          })
          .catch((err) => (Loading = true));
      startWithDelay();
    });
  }, []);
  const startWithDelay = () => {
    setTimeout(async () => {
      setIsTimerRunning(false);
      !Loading && (await openScreen());
    }, Constant.splashTime);
  };
  const openScreen = async () => {
    await SplashScreen.hideAsync();

    // navigation.dispatch(StackActions.replace(Constant.navHomeStack));
  };
  !Loading && isTimerRunning === false && openScreen();

  return (
    <Provider designStore={DesignStore} userStore={UserStore}>
      <ApolloProvider client={client}>
        <PaperProvider theme={paperTheme}>
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{ headerShown: false }}
              initialRouteName={Constant.navHomeStack}
            >
              {/* <Stack.Screen
                  name={Constant.navSplash}
                  component={SplashScreen}
                /> */}
              <Stack.Screen name={Constant.navLogin} component={Login} />
              {/* <Stack.Screen name={Constant.navWebView} component={WebViews} /> */}
              <Stack.Screen
                name="langaugeSelection"
                component={LanguageSelectionScreen}
              />
              <Stack.Screen
                name={Constant.navSignIn}
                component={SigninScreen}
              />
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
}
