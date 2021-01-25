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
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-community/google-signin";
import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager,
} from "react-native-fbsdk";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { inject, observer } from "mobx-react";

const RegisterScreen = ({ userStore }) => {
  const navigation = useNavigation();
  const [mobileNo, setMobileNo] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [otp, setOtp] = useState("");
  const [otpVisible, setOtpVisible] = useState(false);

  const [userSignup, { loading }] = useMutation(GraphqlQuery.userSignup, {
    errorPolicy: "all",
  });

  /*
  .##....##....###....##.....##.####..######......###....########.####..#######..##....##
  .###...##...##.##...##.....##..##..##....##....##.##......##.....##..##.....##.###...##
  .####..##..##...##..##.....##..##..##.........##...##.....##.....##..##.....##.####..##
  .##.##.##.##.....##.##.....##..##..##...####.##.....##....##.....##..##.....##.##.##.##
  .##..####.#########..##...##...##..##....##..#########....##.....##..##.....##.##..####
  .##...###.##.....##...##.##....##..##....##..##.....##....##.....##..##.....##.##...###
  .##....##.##.....##....###....####..######...##.....##....##....####..#######..##....##
  */

  const onGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log(userInfo);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      } else if (error.code === statusCodes.IN_PROGRESS) {
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      } else {
        console.log(error);
      }
    }
  };

  const getInfoFromToken = (token) => {
    const PROFILE_REQ_PARAMS = {
      fileds: {
        string: "id,name,first_name,last_name",
      },
    };
    const ProfileRequest = new GraphRequest(
      "/me",
      { token, parameters: PROFILE_REQ_PARAMS },
      (error, user) => {
        if (error) {
          console.log("login info has error", error);
        } else {
          console.log("result user", user.name);
        }
      }
    );
    new GraphRequestManager().addRequest(ProfileRequest).start();
  };

  const onFaceBookLogin = async () => {
    LoginManager.logInWithPermissions(["public_profile"]).then(
      (login) => {
        if (login.isCancelled) {
          console.log("login cancelled");
        } else {
          AccessToken.getCurrentAccessToken().then((data) => {
            const accessToken = data.accessToken.toString();
            getInfoFromToken(accessToken);
          });
        }
      },
      (error) => {
        console.log("login fail with error", error);
      }
    );
  };

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
          // navigation.navigate(Constant.navHome);
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

  if (error && error.length > 0) {
    const errorMsg = result.errors[0].message;
    Common.showMessage(errorMsg);
  }

  if (data) {
    if (data != null) {
      // set user to userStore
      data?.verifyUserOtp?.user && userStore.setUser(data.verifyUserOtp.user);

      const token = data.verifyUserOtp.token;

      AsyncStorage.setItem(Constant.prfUserToken, token).then(() => {
        navigation.navigate(Constant.navHome);
      });
    } else {
    }
  }

  const verifyOtp = () => {
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
  };

  const onPressGetOtp = () => {
    setOtpVisible(true);

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
          // navigation.navigate(Constant.navHome);
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
          style={{
            fontSize: 13,
            fontWeight: "700",
            color: Color.txtIntxtcolor,
          }}
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
          style={{
            fontSize: 13,
            fontWeight: "700",
            color: Color.txtIntxtcolor,
          }}
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
          placeholderTextColor={Color.txtIntxtcolor}
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
              placeholderTextColor={Color.txtIntxtcolor}
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
                width: "50%",
                alignItems: "center",
                justifyContent: "center",
              },
            ]}
          >
            <TEXTINPUT
              style={[
                styles.socialTXT,
                {
                  width: "100%",
                  textAlign: "center",
                  letterSpacing: 5,
                },
              ]}
              placeholder="______"
              placeholderTextColor={Color.txtIntxtcolor}
              keyboardType="number-pad"
              maxLength={6}
              value={otp}
              onChangeText={(val) => setOtp(val)}
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
              style={styles.btnLoginView}
              onPress={() => verifyOtp()}
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
              onPress={() => onPressGetOtp()}
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

export default inject("userStore")(observer(RegisterScreen));

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
    backgroundColor: Color.txtInBgColor,
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
    borderBottomColor: Color.txtIntxtcolor,
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
    // paddingHorizontal: 40,
    // paddingVertical: 8,
    // borderRadius: 50,
    fontSize: 18,
    fontWeight: "700",
    color: Color.white,
  },

  socialTXT: {
    height: 48,
    fontSize: 13,
    fontWeight: "700",
    color: Color.darkBlue,
    // width: "80%",
  },
  btnLoginView: {
    backgroundColor: Color.primary,
    alignItems: "center",
    borderRadius: 50,
    height: 35,
    justifyContent: "center",
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
