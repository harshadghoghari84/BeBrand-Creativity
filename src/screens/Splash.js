import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, Text } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useLazyQuery } from "@apollo/client";
import { inject, observer } from "mobx-react";
import { StackActions } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FastImage from "react-native-fast-image";
import * as SplashScreen from "expo-splash-screen";

// relative
import GraphqlQuery from "../utils/GraphqlQuery";
import Constant from "../utils/Constant";
import Color from "../utils/Color";
import client from "../utils/ApolloClient";

const Splash = ({ navigation, userStore }) => {
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  let loading = false;
  useEffect(() => {
    loading = true;
    SplashScreen.preventAutoHideAsync()
      .then((result) => {
        startWithDelay();
      })
      .catch((err) => {});

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
    await SplashScreen.hideAsync();
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
        <FastImage
          source={require("../assets/img/splash.jpg")}
          // source={require("../assets/img/splashscreen_image.gif")}
          style={styles.logoImg}
          resizeMode={FastImage.resizeMode.cover}
        />
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
    backgroundColor: Color.transparent,
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
