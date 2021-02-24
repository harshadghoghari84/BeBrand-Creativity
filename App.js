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
import SplashScreen from "./src/screens/Splash";

import SignupScreen from "./src/screens/Signup";
import LanguageSelectionScreen from "./src/screens/LanguageSelection";
import OtpScreen from "./src/screens/Otp";
import Constant from "./src/utils/Constant";
import client from "./src/utils/ApolloClient";
import CustomDrawer from "./src/screens/common/CustomDrawer";
import HomeStackComponent from "./src/stacks/HomeStack";
import Login from "./src/screens/Login";
import WebViews from "./src/components/WebViews";
// import * as SplashScreen from "expo-splash-screen";
import GraphqlQuery from "./src/utils/GraphqlQuery";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Signin from "./src/screens/Signin";

import { fcmService } from "./src/FCM/FCMService";
import { localNotificationService } from "./src/FCM/LocalNotificationService";
import { Platform } from "react-native";

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

  useEffect(() => {
    fcmService.registerAppWithFCM();
    fcmService.register(onRegister, onNotification, onOpenNotification);
    localNotificationService.configure(onOpenNotification);
    localNotificationService.subscribeToTopics(Constant.Offer);
    localNotificationService.subscribeToTopics(Constant.SpecialOffer);
    localNotificationService.subscribeToTopics(Constant.Wishes);
    localNotificationService.subscribeToTopics(Constant.Information);
    function onRegister(token) {
      console.log("[App] onRegister:", token);
    }
    function onNotification(remotMessage) {
      console.log("[App] onNotification:", remotMessage);
      console.log("chk ____:", remotMessage);

      let notify = null;
      if (Platform.OS === "ios") {
        notify = remotMessage.data.notification;
      } else {
        notify = remotMessage.notification;
      }
      console.log("notify", notify);
      const options = {
        soundName: "default",
        playSound: true,
        bigPictureUrl: notify.android.imageUrl,
      };

      if (Platform.OS === "android") {
        options.channelId = Constant.Default;
        if (remotMessage.from.includes(Constant.topics)) {
          if (remotMessage.from.includes(Constant.Offer)) {
            options.channelId = Constant.Offer;
          } else if (remotMessage.from.includes(Constant.SpecialOffer)) {
            options.channelId = Constant.SpecialOffer;
          } else if (remotMessage.from.includes(Constant.Wishes)) {
            options.channelId = Constant.Wishes;
          } else if (remotMessage.from.includes(Constant.Information)) {
            options.channelId = Constant.Information;
          }
        }
      }
      console.log("options", options);
      localNotificationService.showNotification(
        0,
        notify.title,
        notify.body,
        notify,
        options
      );
    }
    function onOpenNotification(notify) {
      console.log("[App] onOpenNotification:", notify);
      alert("[App] Open Notification:" + notify.body);
    }
    return () => {
      console.log("[App] unRegister");
      fcmService.unRegister();
      localNotificationService.unregister();
    };
  }, []);
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
}
