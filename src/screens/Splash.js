import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, Text } from "react-native";
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

  // return (
  //   <View style={styles.container}>
  //     <Image
  //       source={require("../assets/logo.png")}
  //       style={{ width: 250, height: 150, marginBottom: 20 }}
  //       resizeMode="center"
  //     />
  //     <ActivityIndicator animating={true} />
  //   </View>
  // );

  const renderMainView = () => {
    return <View style={styles.container}>{renderSplash()}</View>;
  };

  const renderSplash = () => {
    return (
      <View>
        <View style={styles.round} />
        <Image
          source={require("../assets/DFS.png")}
          style={styles.logoImg}
          resizeMode="center"
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
    backgroundColor: Color.primary,
  },
  round: {
    height: 800,
    width: 800,
    left: 460,
    backgroundColor: Color.darkBlue,
    borderRadius: 400,
  },
  logoImg: {
    width: "70%",
    height: "20%",
    alignSelf: "center",
    justifyContent: "center",
    position: "absolute",
    top: 320,
  },
});

// return (
//   <View style={styles.container}>
//     <Image
//       source={require("../assets/logo.png")}
//       style={{ width: 250, height: 150, marginBottom: 20 }}
//       resizeMode="center"
//     />
//     <ActivityIndicator animating={true} />
//   </View>
// );
