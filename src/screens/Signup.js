import React, { memo, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ToastAndroid,
  Image,
  TextInput as TEXTINPUT,
} from "react-native";
import { useMutation, useLazyQuery } from "@apollo/client";
import * as Animatable from "react-native-animatable";
import { useNavigation } from "@react-navigation/native";

import Background from "../components/Background";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import BackButton from "../components/BackButton";
import { paperTheme as theme } from "../utils/Theme";
import { mobileValidator, passwordValidator } from "../utils/Validator";
import GraphqlQuery from "../utils/GraphqlQuery";
import Constant from "../utils/Constant";
import LangKey from "../utils/LangKey";
import Common from "../utils/Common";
import Color from "../utils/Color";

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [mobileNo, setMobileNo] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [otp, setOtp] = useState("");
  const [otpVisible, setOtpVisible] = useState(false);

  const [userSignup, { loading }] = useMutation(GraphqlQuery.userSignup, {
    errorPolicy: "all",
  });

  useEffect(() => {
    console.log("chk", mobileNo.value, otp);
  }, []);

  const _onSignUpPressed = async () => {
    const mobileError = mobileValidator(mobileNo.value);
    const passwordError = passwordValidator(password.value);

    if (mobileError || passwordError) {
      setMobileNo({ ...mobileNo, error: mobileError });
      setPassword({ ...password, error: passwordError });
      return;
    }

    try {
      userSignup({
        variables: {
          mobile: mobileNo.value,
          password: password.value,
        },
      }).then((result) => {
        const data = result.data;
        console.log("response", result);
        if (data !== null) {
          // const token = data.userSignup.token;
          // console.log(data.userSignup.token);
          // AsyncStorage.setItem(
          //   Constant.prfUserToken,
          //   token
          // ).then(() => {
          // navigation.navigate(Constant.navOtp, { mobile: mobileNo.value });
          navigation.navigate(Constant.navHome);

          // });
        } else {
          const errorMsg = result.errors[0].message;
          Common.showMessage(errorMsg);
        }
      });
    } catch (err) {
      console.log("ERROR", err);
    }
  };

  const [verifyUserOtp, { error, data }] = useLazyQuery(
    GraphqlQuery.verifyUserOtp
  );

  const varifyOtp = () => {
    if (otp.length < 5) {
      return false;
    } else {
      try {
        verifyUserOtp({
          variables: {
            mobile: mobileNo.value,
            otp: otp,
          },
        });
      } catch (err) {
        console.log(err);
      }
    }
  };

  const makeFadeInTranslation = (translationType, fromValue) => {
    return {
      from: {
        opacity: 0,
        [translationType]: fromValue,
      },
      to: {
        opacity: 1,
        [translationType]: 0,
      },
    };
  };

  const fadeInDown = makeFadeInTranslation("translateY", -30);
  return (
    // <Background>
    //   <BackButton goBack={() => navigation.goBack()} />

    //   <Logo />

    //   <Header>{Common.getTranslation(LangKey.txtCreateAccount)}</Header>
    <View style={{ flex: 1 }}>
      <TouchableOpacity style={styles.socialBTNView}>
        <Image
          source={require("../assets/google.png")}
          style={{ height: 35, width: 35, marginHorizontal: 10 }}
        />
        <Text
          style={{ fontSize: 13, fontWeight: "700", color: Color.darkBlue }}
        >
          Sign in With Google
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.socialBTNView}>
        <Image
          source={require("../assets/fb.png")}
          style={{ height: 35, width: 35, marginHorizontal: 10 }}
        />
        <Text
          style={{ fontSize: 13, fontWeight: "700", color: Color.darkBlue }}
        >
          Sign in With FaceBook
        </Text>
      </TouchableOpacity>
      <View style={styles.sapratorView}>
        <View style={styles.sapratorLines} />
        <View style={styles.orView}>
          <Text style={styles.orTXT}>or</Text>
        </View>
        <View style={styles.sapratorLines} />
      </View>
      <View style={styles.socialBTNView}>
        <Image
          source={require("../assets/call.png")}
          style={{ height: 35, width: 35, marginHorizontal: 10 }}
        />
        <TextInput
          placeholder={Common.getTranslation(LangKey.labMobile)}
          placeholderTextColor={Color.darkBlue}
          returnKeyType="next"
          value={mobileNo.value}
          onChangeText={(text) => setMobileNo({ value: text, error: "" })}
          error={!!mobileNo.error}
          errorText={mobileNo.error}
          autoCapitalize="none"
          keyboardType="numeric"
        />
      </View>
      {mobileNo.error ? (
        <Text style={styles.error}>{mobileNo.error}</Text>
      ) : null}
      {mobileNo.value.length > 9 && (
        <Animatable.View
          animation={fadeInDown}
          direction="normal"
          duration={500}
        >
          <View style={styles.socialBTNView}>
            <Image
              source={require("../assets/lock.png")}
              style={{ height: 35, width: 35, marginHorizontal: 10 }}
            />
            <TextInput
              placeholder={Common.getTranslation(LangKey.labPassword)}
              placeholderTextColor={Color.darkBlue}
              returnKeyType="done"
              value={password.value}
              onChangeText={(text) => setPassword({ value: text, error: "" })}
              error={!!password.error}
              errorText={password.error}
              secureTextEntry
            />
          </View>
          {password.error ? (
            <Text style={styles.error}>{password.error}</Text>
          ) : null}
        </Animatable.View>
      )}
      {otpVisible && (
        <Animatable.View
          animation={fadeInDown}
          direction="normal"
          duration={500}
          style={{
            width: "95%",
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
          }}
        >
          <View
            style={[
              styles.socialBTNView,
              {
                width: "90%",
                alignItems: "center",
                justifyContent: "center",
                marginHorizontal: 0,
              },
            ]}
          >
            <TEXTINPUT
              style={[
                styles.socialTXT,
                {
                  width: "30%",
                  textAlign: "center",
                  letterSpacing: 5,
                },
              ]}
              placeholder="______"
              placeholderTextColor={Color.darkBlue}
              keyboardType="number-pad"
              maxLength={6}
              value={otp}
              onChangeText={(val) => setOtp(val)}
              onEndEditing={varifyOtp}
            />
          </View>
          <Text
            style={{
              alignSelf: "center",
              color: Color.darkBlue,
              fontSize: 12,
              paddingVertical: 8,
            }}
          >
            An OTP was sent your phone
          </Text>
        </Animatable.View>
      )}
      {password.value.length > 0 ? (
        <>
          {otp !== null && otp.length > 5 ? (
            <TouchableOpacity
              style={{
                backgroundColor: Color.primary,
                alignItems: "center",
                borderRadius: 50,
                marginHorizontal: 20,
                marginVertical: 8,
              }}
              onPress={() => _onSignUpPressed()}
              // loading={loading}
              // disabled={loading}
            >
              <Text style={styles.txtSignin}>
                {Common.getTranslation(LangKey.labSignup)}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.btnLoginView}
              onPress={() => setOtpVisible(true)}
              loading={loading}
              disabled={loading}
            >
              <Text style={styles.txtSignin}>get OTP</Text>
            </TouchableOpacity>
          )}
        </>
      ) : null}
      {/* <View style={styles.row}>
        <Text style={styles.label}>
          {Common.getTranslation(LangKey.labAlreadyAcc)}
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate(Constant.navSignIn)}
        >
          <Text style={styles.link}>
            {Common.getTranslation(LangKey.labSignin)}
          </Text>
        </TouchableOpacity>
      </View> */}
    </View>
    // </Background>
  );
};

const styles = StyleSheet.create({
  label: {
    color: theme.colors.secondary,
  },
  button: {
    marginTop: 24,
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
    marginBottom: 10,
  },
  link: {
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  socialBTNView: {
    height: 55,
    borderRadius: 50,
    marginHorizontal: 20,
    borderColor: Color.darkBlue,
    borderWidth: 3,
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
  },
  sapratorView: {
    flexDirection: "row",
    alignItems: "center",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 30,
    marginVertical: 20,
  },
  sapratorLines: {
    borderBottomColor: Color.darkBlue,
    borderBottomWidth: 1,
    opacity: 0.6,
    width: "40%",
  },
  orView: {
    height: 30,
    width: 30,
    backgroundColor: Color.blackTransparant,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  orTXT: {
    color: Color.darkBlue,
    fontSize: 14,
    fontWeight: "700",
  },
  txtSignin: {
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 50,
    fontSize: 18,
    fontWeight: "700",
    color: Color.white,
  },
  socialBTNView: {
    height: 55,
    borderRadius: 50,
    marginHorizontal: 20,
    borderColor: Color.darkBlue,
    borderWidth: 3,
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
  },
  socialTXT: {
    height: 50,
    fontSize: 13,
    fontWeight: "700",
    color: Color.darkBlue,
    width: "80%",
  },
  btnLoginView: {
    backgroundColor: Color.primary,
    alignItems: "center",
    borderRadius: 50,
    marginHorizontal: 20,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
});

export default memo(RegisterScreen);
