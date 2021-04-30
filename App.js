import React, { useEffect, useState } from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { Provider as PaperProvider } from "react-native-paper";
import { ApolloProvider, useLazyQuery } from "@apollo/client";
import { Provider } from "mobx-react";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Platform } from "react-native";

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

Common.setTranslationInit();

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const DrawerScreen = () => {
  return (
    <Drawer.Navigator
      // initialRouteName={initScreen}
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      <Drawer.Screen
        name={Constant.navHomeStack}
        component={HomeStackComponent}
      />
      {/* <Drawer.Screen name={Constant.navDesign} component={DesignStack} /> */}
    </Drawer.Navigator>
  );
};

const App = () => {
  // const navigation = useNavigation();

  // const [isTimerRunning, setIsTimerRunning] = useState(true);

  // let loading = false;
  // useEffect(() => {
  //   loading = true;
  //   SplashScreen.preventAutoHideAsync()
  //     .then((result) => {})
  //     .catch((err) => {});
  //   AsyncStorage.getItem(Constant.prfUserToken).then(async (token) => {
  //     console.log("==>toen", token);
  //     token &&
  //       client
  //         .query({
  //           query: GraphqlQuery.user,
  //           errorPolicy: {
  //             errorPolicy: "all",
  //           },
  //         })
  //         .then(async ({ data, errors }) => {
  //           console.log("data", data);
  //           console.log("err", errors);
  //           !errors && data?.user && userStore.setUser(data.user);
  //           loading = false;

  //           !isTimerRunning && (await openScreen());
  //         })
  //         .catch((err) => (loading = false));
  //     startWithDelay();
  //   });
  // }, []);
  // const startWithDelay = () => {
  //   setTimeout(async () => {
  //     setIsTimerRunning(false);
  //     !loading && (await openScreen());
  //   }, Constant.splashTime);
  // };
  // const openScreen = async () => {
  //   await SplashScreen.hideAsync();

  //   // navigation.dispatch(StackActions.replace(Constant.navHomeStack));
  // };
  // !loading && isTimerRunning === false && openScreen();

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
