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

import TextInput from "../components/TextInput";
import { paperTheme as theme } from "../utils/Theme";
import { mobileValidator, passwordValidator } from "../utils/Validator";
import GraphqlQuery from "../utils/GraphqlQuery";
import Constant from "../utils/Constant";
import LangKey from "../utils/LangKey";
import Common from "../utils/Common";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Color from "../utils/Color";
import Icon from "../components/svgIcons";
import auth from "@react-native-firebase/auth";

const LoginScreen = ({ userStore }) => {
  const navigation = useNavigation();

  const [mobileNo, setMobileNo] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [user, setUser] = useState();
  const [initializing, setInitializing] = useState(true);

  const [userLogin, { loading }] = useMutation(GraphqlQuery.userLogin, {
    errorPolicy: "all",
  });
  const [userSignupSocial, { loading: mutLoading, data }] = useMutation(
    GraphqlQuery.userSignupSocial,
    {
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    }
  );

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

  const sendTokentoServer = (response) => {
    try {
      auth()
        .currentUser?.getIdToken()
        .then((token) => {
          console.log("auth token", token);
          userSignupSocial({
            variables: {
              token: token,
              name: response?.user?._user?.displayName
                ? response.user._user.displayName
                : "",
              email: response?.user?._user?.email
                ? response.user._user.email
                : "",
              mobile: response?.user?._user?.phoneNumber
                ? response.user._user.phoneNumber
                : "",
            },
          })
            .then(({ data, errors }) => {
              console.log("my last data ", data);
              if (errors && errors.length > 0) {
                const errorMsg = data.errors[0].message;
                Common.showMessage(errorMsg);
              }

              if (data) {
                if (data != null) {
                  // set user to userStore
                  data?.userSignupSocial?.user &&
                    userStore.setUser(data.userSignupSocial.user);

                  const token = data.userSignupSocial.token;

                  AsyncStorage.setItem(Constant.prfUserToken, token).then(
                    () => {
                      navigation.navigate(Constant.navHome);
                    }
                  );
                }
              }
            })
            .catch((error) => {
              console.log("catch error", error);
            });
        });
    } catch (err) {
      console.log("=======>err", err);
    }
  };

  const onGoogleLogin = async () => {
    try {
      const { idToken } = await GoogleSignin.signIn();
      console.log("idToken", idToken);
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      return auth()
        .signInWithCredential(googleCredential)
        .then((res) => {
          console.log("myResponse", res);
          sendTokentoServer(res);
        });
    } catch (error) {
      console.log("===>", error);
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
    try {
      const result = await LoginManager.logInWithPermissions([
        "public_profile",
        "email",
      ]);
      if (result.isCancelled) {
        throw "User cancelled the login process";
      }
      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
        throw "Something went wrong obtaining access token";
      }
      const facebookCredential = auth.FacebookAuthProvider.credential(
        data.accessToken
      );
      console.log("data", data);
      return auth()
        .signInWithCredential(facebookCredential)
        .then((res) => {
          console.log("facebook response==>", res);
          sendTokentoServer(res);
        });
    } catch (error) {
      console.log(error);
    }
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
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        onPress={() => onGoogleLogin()}
        style={styles.socialBTNView}
      >
        <View
          style={{
            backgroundColor: Color.txtIntxtcolor,
            height: 30,
            width: 30,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 50,
            marginHorizontal: 8,
          }}
        >
          <Icon name="google" fill={Color.white} height={"60%"} width={"60%"} />
        </View>
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
        onPress={() => onFaceBookLogin()}
        style={styles.socialBTNView}
      >
        <View
          style={{
            backgroundColor: Color.txtIntxtcolor,
            height: 30,
            width: 30,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 50,
            marginHorizontal: 8,
          }}
        >
          <Icon
            name="facebook"
            fill={Color.white}
            height={"60%"}
            width={"60%"}
          />
        </View>
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
        <TextInput
          placeholder={Common.getTranslation(LangKey.labMobile)}
          placeholderTextColor={Color.txtIntxtcolor}
          returnKeyType="next"
          iconName="phone"
          value={mobileNo.value}
          onChangeText={(text) => setMobileNo({ value: text, error: "" })}
          error={!!mobileNo.error}
          errorText={mobileNo.error}
          autoCapitalize="none"
          keyboardType="numeric"
        />
      </>
      {mobileNo.value.length > 9 && (
        <Animatable.View
          animation={fadeInDown}
          direction="normal"
          duration={500}
        >
          <TextInput
            placeholder={Common.getTranslation(LangKey.labPassword)}
            placeholderTextColor={Color.txtIntxtcolor}
            returnKeyType="done"
            iconName="lock"
            value={password.value}
            onChangeText={(text) => setPassword({ value: text, error: "" })}
            error={!!password.error}
            errorText={password.error}
            secureTextEntry
          />

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
      {password.value.length > 0 && (
        <Animatable.View
          animation={fadeInDown}
          direction="normal"
          duration={500}
        >
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
        </Animatable.View>
      )}
    </View>
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
    height: 40,
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
    height: 35,
    width: "50%",
    alignSelf: "center",
    justifyContent: "center",
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});

export default inject("userStore")(observer(LoginScreen));
