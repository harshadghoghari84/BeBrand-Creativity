import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useLazyQuery } from "@apollo/client";
import { inject, observer } from "mobx-react";

import GraphqlQuery from "../utils/GraphqlQuery";
import Constant from "../utils/Constant";
import { StackActions } from "@react-navigation/native";
import Color from "../utils/Color";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Splash = ({ navigation, userStore }) => {
  const [getUserData, { loading, data, error }] = useLazyQuery(
    GraphqlQuery.user,
    {
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    }
  );

  const [isTimerRunning, setIsTimerRunning] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(Constant.prfUserToken).then((token) => {
      token && getUserData();
      startWithDelay();
    });
  }, []);

  const startWithDelay = () => {
    setTimeout(() => {
      setIsTimerRunning(false);
      !loading && openScreen();
    }, Constant.splashTime);
  };

  const openScreen = () => {
    !error && data?.user && userStore.setUser(data.user);

    navigation.dispatch(StackActions.replace(Constant.navHomeStack));
  };

  !loading && isTimerRunning === false && openScreen();

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/logo.png")}
        style={{ width: 250, height: 150, marginBottom: 20 }}
        resizeMode="center"
      />
      <ActivityIndicator animating={true} />
    </View>
  );
};
export default inject("userStore")(observer(Splash));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Color.accent,
  },
});
