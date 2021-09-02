import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, Text, Platform, Linking } from "react-native";
import { inject, observer } from "mobx-react";
import { StackActions } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FastImage from "react-native-fast-image";
import SplashScreen from "react-native-splash-screen";
import DeviceInfo from "react-native-device-info";
// import * as SplashScreen from "expo-splash-screen";

// relative
import GraphqlQuery from "../utils/GraphqlQuery";
import Constant from "../utils/Constant";
import Color from "../utils/Color";
import client from "../utils/ApolloClient";
import { useQuery } from "@apollo/client";
import PopUp from "../components/PopUp";

const Splash = ({ navigation, userStore, designStore }) => {
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [visibleModal, setVisibleModal] = useState(false);
  const [chkUpdate, setChkUpdate] = useState(false);
  const [appDetails, setAppDetails] = useState({});
  const [imgHeight, setImgHeight] = useState(0);
  const [imgWidth, setImgWidth] = useState(0);
  const toggleVisibleModal = () => {
    setVisibleModal(!visibleModal);
    if (visibleModal) {
      navigation.dispatch(StackActions.replace(Constant.navHomeStack));
      Platform.OS === "android" && SplashScreen.hide();
    }
  };
  const {
    loading: load,
    error,
    data: vData,
  } = useQuery(GraphqlQuery.appVersionDetails);

  useEffect(() => {
    if (chkUpdate) {
      if (vData?.appDetail && vData?.appDetail !== null) {
        designStore.setRatingTime(vData?.appDetail.ratingTime);
        setAppDetails(vData?.appDetail);
        setImgHeight(parseInt(vData?.appDetail?.height));
        setImgWidth(parseInt(vData?.appDetail?.width));

        if (
          DeviceInfo.getVersion() !==
          (Platform.OS === "ios"
            ? vData?.appDetail?.iosVersion
            : vData?.appDetail?.androidVersion)
        ) {
          setVisibleModal(true);
        } else {
          navigation.dispatch(StackActions.replace(Constant.navHomeStack));
          Platform.OS === "android" && SplashScreen.hide();
        }
      }
    }
  }, [vData, chkUpdate]);

  useEffect(() => {
    Platform.OS === "ios" && SplashScreen.hide();

    // loading = true;
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
    console.log("in open screen");
    if (Platform.OS === "ios") {
      setChkUpdate(true);
    } else {
      navigation.dispatch(StackActions.replace(Constant.navHomeStack));
      Platform.OS === "android" && SplashScreen.hide();
    }
    // console.log("vData ::", vData);
    // if (
    //   DeviceInfo.getVersion().toString() < Platform.OS === "ios"
    //     ? vData?.appDetail?.iosVersion
    //     : vData?.appDetail?.androidVersion
    // ) {
    //   setVisibleModal(true);
    // } else {
    //   console.log("in else");
    //   navigation.dispatch(StackActions.replace(Constant.navHomeStack));
    //   Platform.OS === "android" && SplashScreen.hide();
    // }
  };
  // !loading && isTimerRunning === false && openScreen();

  const renderMainView = () => {
    return (
      <View style={styles.container}>
        {Platform.OS === "ios" && (
          <>
            {appDetails != undefined && appDetails !== null ? (
              <PopUp
                visible={visibleModal}
                isModalUpdateApp={true}
                toggleVisibleModal={toggleVisibleModal}
                imgHeight={imgHeight}
                imgWidth={imgWidth}
                appDetails={appDetails}
              />
            ) : null}
            <FastImage
              source={require("../assets/img/splash_image.gif")}
              style={styles.logoImg}
              resizeMode={FastImage.resizeMode.contain}
            />
          </>
        )}
      </View>
    );
  };

  return renderMainView();
};
export default inject("userStore", "designStore")(observer(Splash));
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
