import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, Text, Platform } from "react-native";
import { inject, observer } from "mobx-react";
import { StackActions } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FastImage from "react-native-fast-image";
import SplashScreen from "react-native-splash-screen";
// import * as SplashScreen from "expo-splash-screen";

// relative
import GraphqlQuery from "../utils/GraphqlQuery";
import Constant from "../utils/Constant";
import Color from "../utils/Color";
import client from "../utils/ApolloClient";

const Splash = ({ navigation, userStore }) => {
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  let loading = false;
  useEffect(() => {
    Platform.OS === "ios" && SplashScreen.hide();

    loading = true;
    // SplashScreen.preventAutoHideAsync()
    //   .then((result) => {
    //     startWithDelay();
    //   })
    //   .catch((err) => {});

    startWithDelay();

    getUserData();
  }, []);

  const getUserData = () => {
    AsyncStorage.getItem(Constant.prfUserToken).then(async (token) => {
      token &&
        client
          .query({
            query: GraphqlQuery.user,
            errorPolicy: {
              errorPolicy: "all",
            },
          })
          .then(async ({ data, errors }) => {
            !errors && data?.user && userStore.setUser(data.user);
            // loading = false;
            // !isTimerRunning && (await openScreen());
          })
          .catch((err) => {
            loading = false;
          });
    });
  };

  const startWithDelay = () => {
    setTimeout(async () => {
      setIsTimerRunning(false);
      // !loading && (await openScreen());
      await openScreen();
    }, Constant.splashTime);
  };
  const openScreen = async () => {
    navigation.dispatch(StackActions.replace(Constant.navHomeStack));

    Platform.OS === "android" && SplashScreen.hide();
  };
  // !loading && isTimerRunning === false && openScreen();

  const renderSplash = () => {
    return (
      <>
        <View style={styles.round} />
        <FastImage
          source={require("../assets/img/DFS.png")}
          style={styles.logoImg}
          resizeMode={FastImage.resizeMode.contain}
        />
      </>
    );
  };

  const renderMainView = () => {
    return (
      <View style={styles.container}>
        {Platform.OS === "ios" && (
          <FastImage
            source={require("../assets/img/splash_image.gif")}
            style={styles.logoImg}
            resizeMode={FastImage.resizeMode.contain}
          />
        )}
      </View>
    );
  };

  return renderMainView();
};
export default inject("userStore")(observer(Splash));
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Color.splashColor,
  },
  round: {
    height: 800,
    width: 800,
    left: 460,
    backgroundColor: Color.darkBlue,
    borderRadius: 400,
  },
  logoImg: {
    width: "100%",
    height: "100%",
  },
});
