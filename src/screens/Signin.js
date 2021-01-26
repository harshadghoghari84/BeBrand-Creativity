import React, { memo, useEffect, useState } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  ToastAndroid,
  Image,
} from "react-native";
import { useMutation } from "@apollo/client";
import { inject, observer } from "mobx-react";
import { useNavigation } from "@react-navigation/native";
import * as Animatable from "react-native-animatable";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import Color from "../utils/Color";

const LoginScreen = ({ userStore }) => {
  const navigation = useNavigation();

  const [mobileNo, setMobileNo] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });

  const [userLogin, { loading }] = useMutation(GraphqlQuery.userLogin, {
    errorPolicy: "all",
  });

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "145083857360-h33qlqtc5v4f8jl7ou1rl8n52s4464l5.apps.googleusercontent.com",
      offlineAccess: true,
    });
  }, []);

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

  const onLoginPressed = async () => {
    const mobileError = mobileValidator(mobileNo.value);
    const passwordError = passwordValidator(password.value);

    if (mobileError || passwordError) {
      setMobileNo({ ...mobileNo, error: mobileError });
      setPassword({ ...password, error: passwordError });
      return;
    }

    try {
      userLogin({
        variables: {
          userId: mobileNo.value,
          password: password.value,
        },
      }).then((result) => {
        console.log(result.data);
        const data = result.data;

        if (data != null) {
          // set user to userStore
          data?.userLogin?.user && userStore.setUser(data.userLogin.user);

          AsyncStorage.setItem(
            Constant.prfUserToken,
            data.userLogin.token
          ).then(() => {
            navigation.navigate(Constant.navHome);
          });
        } else {
          const errorMsg = result.errors[0].message;
          Common.showMessage(errorMsg);
        }
      });
    } catch (err) {
      console.error("error=>", err);
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
    // <BackButton
    //   goBack={() => navigation.navigate(Constant.navLangSelection)}
    // />

    // <Logo />
    //<Header>{Common.getTranslation(LangKey.txtWelcome)}</Header>
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        // onPress={() => onGoogleLogin()}
        style={styles.socialBTNView}
      >
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
      <TouchableOpacity
        // onPress={() => onFaceBookLogin()}
        style={styles.socialBTNView}
      >
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
      <>
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
      </>
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

          <View style={styles.forgotPassword}>
            <TouchableOpacity
              onPress={() => navigation.navigate(Constant.navForgetPassword)}
            >
              <Text style={styles.label}>
                {Common.getTranslation(LangKey.labForgetPassword)}
              </Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      )}
      <TouchableOpacity
        style={styles.btnLoginView}
        onPress={onLoginPressed}
        loading={loading}
        disabled={loading}
      >
        <Text style={styles.txtSignin}>
          {Common.getTranslation(LangKey.labSignin)}
        </Text>
      </TouchableOpacity>
    </View>
    // {/* <View style={styles.row}>
    //   <Text style={styles.label}>
    //     {Common.getTranslation(LangKey.labNothaveAcc)}
    //   </Text>
    //   <TouchableOpacity
    //     onPress={() => navigation.navigate(Constant.navSignUp)}
    //   >
    //     <Text style={styles.link}>
    //       {Common.getTranslation(LangKey.labSignup)}
    //     </Text>
    //   </TouchableOpacity>
    // </View> */}

    //</Background>
  );
};

const styles = StyleSheet.create({
  forgotPassword: {
    width: "100%",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  label: {
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  socialBTNView: {
    height: 48,
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
    // paddingVertical: 10,
    // borderRadius: 50,
    fontSize: 18,
    fontWeight: "700",
    color: Color.white,
  },
  error: {
    fontSize: 14,
    color: theme.colors.error,
    paddingLeft: 30,
  },
  btnLoginView: {
    backgroundColor: Color.primary,
    alignItems: "center",
    borderRadius: 50,
    height: 40,
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

export default inject("userStore")(observer(LoginScreen));
