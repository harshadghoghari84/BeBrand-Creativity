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
} from "react-native";
import { useLazyQuery, useQuery } from "@apollo/client";
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

const Otp = ({ route, navigation, userStore }) => {
  // state for textInput
  const [firstVal, setFirstVal] = useState("");
  const [secondVal, setSecondVal] = useState("");
  const [thirdVal, setThirdVal] = useState("");
  const [fourVal, setFourVal] = useState("");
  const [fiveVal, setFiveVal] = useState("");
  const [sixVal, setSixVal] = useState("");

  // refes for textInput
  const firstRef = useRef(null);
  const secondRef = useRef(null);
  const thirdRef = useRef(null);
  const fourRef = useRef(null);
  const fiveRef = useRef(null);
  const sixRef = useRef(null);

  const { mobile, password } = route.params;

  const [verifyUserOtp, { loading, data, error }] = useLazyQuery(
    password ? GraphqlQuery.resetUserPassword : GraphqlQuery.verifyUserOtp,
    {
      errorPolicy: "all",
    }
  );

  useEffect(() => {
    firstRef.current.focus();
  }, []);

  const getFullOtp = () => {
    const otp = `${firstVal}${secondVal}${thirdVal}${fourVal}${fiveVal}${sixVal}`;

    return otp;
  };

  if (error && error.graphQLErrors.length > 0) {
    const errorMsg = error.graphQLErrors[0].message;
    Common.showMessage(errorMsg);
  }

  if (data) {
    if (data != null) {
      // set user to userStore
      if (password) {
        data?.resetUserPassword?.user &&
          userStore.setUser(data.resetUserPassword.user);

        const token = data.resetUserPassword.token;
        AsyncStorage.setItem(Constant.prfUserToken, token).then(() => {
          navigation.navigate(Constant.navHome);
        });
      } else {
        data?.verifyUserOtp?.user && userStore.setUser(data.verifyUserOtp.user);
        const token = data.verifyUserOtp.token;
        AsyncStorage.setItem(Constant.prfUserToken, token).then(() => {
          navigation.navigate(Constant.navHome);
        });
      }
    } else {
    }
  }

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

      console.log("chk obj", data);
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

        <View
          style={[styles.container, { alignItems: "center" }]}
          // onPress={() => dismissKeyboard()}
        >
          <View style={styles.container}>
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

            <Button
              style={styles.btn}
              normal="normal"
              loading={loading}
              disabled={loading}
              onPress={_onVerifyPressed}
            >
              {Common.getTranslation(LangKey.labVarifyOTP)}
            </Button>
          </View>
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
    justifyContent: "center",
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
    backgroundColor: Color.txtIntxtcolor,
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
});
