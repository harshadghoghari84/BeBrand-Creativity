import React, { useRef, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  SafeAreaView,
  Platform,
  StatusBar,
  Keyboard,
  TouchableOpacity,
  Text,
} from "react-native";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { inject, observer } from "mobx-react";

import Color from "../utils/Color";
import Button from "../components/Button";
import GraphqlQuery from "../utils/GraphqlQuery";
import Constant from "../utils/Constant";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "../components/svgIcons";
import Common from "../utils/Common";
import LangKey from "../utils/LangKey";
import ProgressDialog from "./common/ProgressDialog";
import FastImage from "react-native-fast-image";
import Logo from "../components/Logo";

let myInterval;

const Otp = ({ route, navigation, userStore }) => {
  // state for textInput
  const [firstVal, setFirstVal] = useState("");
  const [secondVal, setSecondVal] = useState("");
  const [thirdVal, setThirdVal] = useState("");
  const [fourVal, setFourVal] = useState("");
  const [fiveVal, setFiveVal] = useState("");
  const [sixVal, setSixVal] = useState("");

  const [time, setTime] = useState({ minutes: 2, seconds: 0 });

  const [disable, setDisable] = useState(true);

  useEffect(() => {
    startInterval();

    return () => {
      setTime({ seconds: 0, minutes: 0 });
    };
  }, []);
  useEffect(() => {
    if (time.minutes <= 2 && (time.seconds > 0 || time.minutes > 0)) {
      console.log("inside");
      startInterval();
    }
  }, [time.seconds, time.minutes]);

  const startInterval = () => {
    setTimeout(() => {
      if (time.seconds > 0) {
        setTime({ seconds: time.seconds - 1, minutes: time.minutes });
      } else if (time.seconds === 0) {
        if (time.minutes > 0) {
          setTime({ minutes: time.minutes - 1, seconds: 59 });
        }
      }
    }, 1000);
  };

  // refes for textInput
  const firstRef = useRef(null);
  const secondRef = useRef(null);
  const thirdRef = useRef(null);
  const fourRef = useRef(null);
  const fiveRef = useRef(null);
  const sixRef = useRef(null);

  const { mobile, password } = route.params;

  const [sendUserOtp, { loading: otpLoading, data: otpData }] = useMutation(
    GraphqlQuery.sendUserOtp,
    {
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    }
  );
  const [verifyUserOtp, { loading, data, error }] = useLazyQuery(
    password ? GraphqlQuery.resetUserPassword : GraphqlQuery.verifyUserOtp,
    {
      errorPolicy: "all",
    }
  );

  useEffect(() => {
    firstRef.current.focus();
  }, []);

  useEffect(() => {
    if (data) {
      if (data != null) {
        // set user to userStore
        if (password) {
          data?.resetUserPassword?.msg &&
            Common.showMessage(data.resetUserPassword.msg);
          data?.resetUserPassword?.user &&
            userStore.setUser(data.resetUserPassword.user);

          const token = data.resetUserPassword.token;
          AsyncStorage.setItem(Constant.prfUserToken, token).then(() => {
            navigation.navigate(Constant.navHome);
          });
        } else {
          data?.verifyUserOtp?.msg &&
            Common.showMessage(data.verifyUserOtp.msg);
          data?.verifyUserOtp?.user &&
            userStore.setUser(data.verifyUserOtp.user);
          const token = data.verifyUserOtp.token;
          AsyncStorage.setItem(Constant.prfUserToken, token).then(() => {
            navigation.navigate(Constant.navHome);
          });
        }
      } else {
      }
    }
  }, [data]);

  useEffect(() => {
    if (error && error.graphQLErrors.length > 0) {
      const errorMsg = error.graphQLErrors[0].message;
      Common.showMessage(errorMsg);
    }
  }, [error]);

  useEffect(() => {
    chkOtp();
  }, [firstVal, secondVal, thirdVal, fourVal, fiveVal, sixVal]);

  const chkOtp = () => {
    const otp = `${firstVal}${secondVal}${thirdVal}${fourVal}${fiveVal}${sixVal}`;
    if (otp !== undefined && otp !== null) {
      if (otp.length >= 6) {
        if (disable === true) {
          setDisable(false);
        }
      } else {
        setDisable(true);
      }
    }
  };
  const getFullOtp = () => {
    const otp = `${firstVal}${secondVal}${thirdVal}${fourVal}${fiveVal}${sixVal}`;
    return otp;
  };

  const _onVerifyPressed = async () => {
    try {
      const otp = getFullOtp();
      const data = {
        mobile: mobile,
        otp: otp,
      };
      password &&
        password !== null &&
        password !== "" &&
        (data.password = password);
      verifyUserOtp({
        variables: data,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const onResendOTP = () => {
    sendUserOtp({
      variables: {
        mobile: mobile,
      },
    })
      .then(({ data, errors }) => {
        if (errors && errors !== null) {
          Common.showMessage(errors[0].message);
        } else if (data && data.sendUserOtp && data.sendUserOtp !== null) {
          setTime({ seconds: 0, minutes: 2 });
          Common.showMessage(data.sendUserOtp);
        }
      })
      .catch((err) => console.log("catch er", err));
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ProgressDialog
          visible={loading}
          color={Color.white}
          dismissable={false}
          message={Common.getTranslation(LangKey.labLoading)}
        />
        <View style={styles.filedsIcon}>
          <TouchableOpacity
            style={styles.icons}
            onPress={() => navigation.goBack()}
          >
            <Icon name="back" fill={Color.white} height={15} width={15} />
          </TouchableOpacity>
        </View>

        <View style={[styles.container, { alignItems: "center" }]}>
          <View style={[styles.container, { marginTop: 50 }]}>
            <View style={{ alignSelf: "center", marginVertical: 40 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: Color.darkBlue,
                }}
              >
                {Common.getTranslation(LangKey.labOtpVarification)}
              </Text>
            </View>
            <View style={{ alignSelf: "center", marginBottom: 20 }}>
              <Text
                style={{
                  fontSize: 15,
                  color: Color.darkBlue,
                }}
              >
                {Common.getTranslation(LangKey.labEnterOtp)}
                {mobile}
              </Text>
            </View>
            <View style={styles.otpContainer}>
              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                maxLength={1}
                ref={firstRef}
                value={firstVal}
                onSubmitEditing={() => secondRef.current.focus()}
                onChangeText={(text) => {
                  setFirstVal(text);
                  if (text.length > 0) secondRef.current.focus();
                }}
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key != "Backspace" && firstVal.length > 0) {
                    setFirstVal(nativeEvent.key);
                    secondRef.current.focus();
                  }
                }}
              />
              <TextInput
                style={[styles.textInput, { marginLeft: 10 }]}
                maxLength={1}
                keyboardType="numeric"
                ref={secondRef}
                onSubmitEditing={() => thirdRef.current.focus()}
                onChangeText={(text) => {
                  setSecondVal(text);
                  if (text.length > 0) thirdRef.current.focus();
                }}
                value={secondVal}
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key === "Backspace") {
                    if (secondVal == "") firstRef.current.focus();
                  } else if (secondVal.length > 0) {
                    setSecondVal(nativeEvent.key);
                    thirdRef.current.focus();
                  }
                }}
              />
              <TextInput
                style={[styles.textInput, { marginLeft: 10 }]}
                maxLength={1}
                keyboardType="numeric"
                ref={thirdRef}
                onSubmitEditing={() => fourRef.current.focus()}
                onChangeText={(text) => {
                  setThirdVal(text);
                  if (text.length > 0) fourRef.current.focus();
                }}
                value={thirdVal}
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key === "Backspace") {
                    if (thirdVal == "") secondRef.current.focus();
                  } else if (thirdVal.length > 0) {
                    setThirdVal(nativeEvent.key);
                    fourRef.current.focus();
                  }
                }}
              />
              <TextInput
                style={[styles.textInput, { marginLeft: 10 }]}
                keyboardType="numeric"
                maxLength={1}
                ref={fourRef}
                onSubmitEditing={() => fiveRef.current.focus()}
                onChangeText={(text) => {
                  setFourVal(text);
                  if (text.length > 0) fiveRef.current.focus();
                }}
                value={fourVal}
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key === "Backspace") {
                    if (fourVal == "") thirdRef.current.focus();
                  } else if (fourVal.length > 0) {
                    setFourVal(nativeEvent.key);
                    fiveRef.current.focus();
                  }
                }}
              />
              <TextInput
                style={[styles.textInput, { marginLeft: 10 }]}
                keyboardType="numeric"
                maxLength={1}
                ref={fiveRef}
                onSubmitEditing={() => sixRef.current.focus()}
                onChangeText={(text) => {
                  setFiveVal(text);
                  if (text.length > 0) sixRef.current.focus();
                }}
                value={fiveVal}
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key === "Backspace") {
                    if (fiveVal == "") fourRef.current.focus();
                  } else if (fiveVal.length > 0) {
                    setFiveVal(nativeEvent.key);
                    sixRef.current.focus();
                  }
                }}
              />
              <TextInput
                style={[styles.textInput, { marginLeft: 10 }]}
                keyboardType="numeric"
                maxLength={1}
                ref={sixRef}
                onSubmitEditing={() => Keyboard.dismiss()}
                onChangeText={(text) => {
                  setSixVal(text);
                  if (text.length > 0) Keyboard.dismiss();
                }}
                value={sixVal}
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key === "Backspace") {
                    if (sixVal == "") fiveRef.current.focus();
                  } else if (sixVal.length > 0) {
                    setSixVal(nativeEvent.key);
                    dismissKeyboard();
                  }
                }}
              />
            </View>

            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                marginVertical: 30,
                flexDirection: "row",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: Color.darkBlue,
                }}
              >
                {Common.getTranslation(LangKey.labDidnotReciveOtp)}
              </Text>

              {time.minutes === 0 && time.seconds === 0 ? (
                <TouchableOpacity
                  onPress={() => {
                    onResendOTP();
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "700",
                      color: Color.primary,
                    }}
                  >
                    {Common.getTranslation(LangKey.labResend)}
                  </Text>
                </TouchableOpacity>
              ) : (
                <Text style={{ color: Color.red }}>
                  {time.minutes}:
                  {time.seconds < 10 ? `0${time.seconds}` : time.seconds}
                </Text>
              )}
            </View>
            {disable === false && (
              <Button
                style={styles.btn}
                normal="normal"
                loading={loading}
                disabled={loading}
                onPress={_onVerifyPressed}
              >
                {Common.getTranslation(LangKey.labVarifyOTP)}
              </Button>
            )}
          </View>
          <Logo />
        </View>
      </SafeAreaView>
    </>
  );
};
export default inject("userStore")(observer(Otp));

const getStatusBarHeight = () => {
  let height = 0;

  if (Platform.OS == "android") height = StatusBar.currentHeight;

  return height;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
  },
  otpContainer: {
    // marginTop: 50 + getStatusBarHeight(),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    width: 45,
    height: 45,
    borderColor: Color.darkBlue,
    borderWidth: 2,
    borderRadius: 10,
    justifyContent: "center",
    textAlign: "center",
  },
  btn: {
    marginTop: 30,
  },
  icons: {
    paddingHorizontal: 10,
  },
  filedsIcon: {
    marginTop: 20,
    marginHorizontal: 20,
    marginRight: 10,
    backgroundColor: Color.txtIntxtcolor,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },
  image: {
    width: "100%",
    height: 60,
    marginTop: 30,
    marginBottom: 12,
  },
});
