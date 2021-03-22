import React, { memo, useEffect, useState } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  ToastAndroid,
  Image,
  ScrollView,
  SafeAreaView,
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
import {
  mobileValidator,
  passwordValidator,
  reTypePassValidator,
} from "../utils/Validator";
import GraphqlQuery from "../utils/GraphqlQuery";
import Constant from "../utils/Constant";
import LangKey from "../utils/LangKey";
import Common from "../utils/Common";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Color from "../utils/Color";
import Icon from "../components/svgIcons";
import auth from "@react-native-firebase/auth";
import ProgressDialog from "./common/ProgressDialog";
import Button from "../components/Button";
import Logo from "../components/Logo";
import { tr } from "date-fns/locale";

const SignInScreen = ({ userStore }) => {
  const navigation = useNavigation();

  const [loader, setLoader] = useState(false);
  const [secureText, setSecureText] = useState(true);
  const toggleSecureText = () => {
    setSecureText(!secureText);
  };
  const [mobileNo, setMobileNo] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [userNotVerify, setUserNotVerify] = useState(false);
  const [reTypePass, setreTypePass] = useState({
    value: "",
    error: "",
  });
  const [isForgotPass, setIsForgotPass] = useState(false);
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
  const [sendUserOtp, { loading: otpLoading, data: otpData }] = useMutation(
    GraphqlQuery.sendUserOtp,
    {
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    }
  );

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: Constant.webClientId,
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

  const sendTokentoServer = () => {
    try {
      auth()
        .currentUser?.getIdToken()
        .then((token) => {
          userSignupSocial({
            variables: {
              token: token,
            },
          })
            .then(({ data, errors }) => {
              if (errors && errors.length > 0) {
                const errorMsg = errors[0].message;
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
      const isSignedIn = await GoogleSignin.isSignedIn();
      if (isSignedIn) {
        try {
          setLoader(true);

          const userInfo = await GoogleSignin.signInSilently();
          const googleCredential = auth.GoogleAuthProvider.credential(
            userInfo.idToken
          );

          auth()
            .signInWithCredential(googleCredential)
            .then((res) => {
              sendTokentoServer(res);
              setLoader(false);
            });
        } catch (error) {
          setLoader(false);
          console.log(error);
        }
      } else {
        setLoader(true);
        const { idToken } = await GoogleSignin.signIn();
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        return auth()
          .signInWithCredential(googleCredential)
          .then((res) => {
            sendTokentoServer(res);
            setLoader(false);
          })
          .catch((err) => {
            console.log("err", err);
            setLoader(false);
          });
      }
    } catch (error) {
      console.log("===>", error);
      setLoader(false);
    }
  };

  const onFaceBookLogin = async () => {
    try {
      setLoader(true);
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

      return auth()
        .signInWithCredential(facebookCredential)
        .then((res) => {
          sendTokentoServer(res);
          setLoader(false);
        });
    } catch (error) {
      console.log(error);
      setLoader(false);
    }
  };

  const onLoginPressed = async () => {
    const mobileError = mobileValidator(mobileNo.value);
    const passwordError = passwordValidator(password.value);

    if (mobileError) {
      setMobileNo({ ...mobileNo, error: mobileError });
      return;
    } else if (passwordError) {
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
        const data = result.data;
        if (data != null) {
          data?.userLogin?.msg && Common.showMessage(data.userLogin.msg);
          // set user to userStore
          data?.userLogin?.user && userStore.setUser(data.userLogin.user);

          AsyncStorage.setItem(
            Constant.prfUserToken,
            data.userLogin.token
          ).then(() => {
            navigation.navigate(Constant.navHome);
          });
        } else {
          if (result.errors[0].extensions.code === Constant.userNotVerify) {
            Common.showMessage(result.errors[0].message);
            setUserNotVerify(true);
          } else {
            Common.showMessage(result.errors[0].message);
          }
        }
      });
    } catch (err) {
      console.error("error=>", err);
    }
  };

  const onSendOTPUserNotVerify = () => {
    sendUserOtp({
      variables: {
        mobile: mobileNo.value,
      },
    }).then(({ data, errors }) => {
      if (errors && errors.length > 0) {
        const errorMsg = errors[0].message;
        Common.showMessage(errorMsg);
      }
      if (data.sendUserOtp && data.sendUserOtp !== null) {
        Common.showMessage(data.sendUserOtp);
        navigation.navigate(Constant.navOtp, {
          mobile: mobileNo.value,
        });
      }
    });
  };

  const onSendOTP = () => {
    const mobileError = mobileValidator(mobileNo.value);
    const passwordError = passwordValidator(password.value);
    const reTypePassError = reTypePassValidator(
      password.value,
      reTypePass.value
    );

    if (mobileError) {
      setMobileNo({ ...mobileNo, error: mobileError });
      return;
    } else if (passwordError) {
      setPassword({ ...password, error: passwordError });
      return;
    } else if (reTypePassError) {
      setreTypePass({ ...reTypePass, error: reTypePassError });
      return;
    }

    sendUserOtp({
      variables: {
        mobile: mobileNo.value,
      },
    })
      .then(({ data, errors }) => {
        if (errors && errors.length > 0) {
          const errorMsg = errors[0].message;
          Common.showMessage(errorMsg);
        }
        if (data.sendUserOtp && data.sendUserOtp !== null) {
          Common.showMessage(data.sendUserOtp);
          navigation.navigate(Constant.navOtp, {
            mobile: mobileNo.value,
            password: reTypePass.value,
          });
          setIsForgotPass(false);
        }
      })
      .catch((error) => {
        console.log("___eerro____", error);
      });
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
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <ProgressDialog
          visible={
            loader
              ? loader
              : otpLoading
              ? otpLoading
              : mutLoading
              ? mutLoading
              : loading
          }
          dismissable={false}
          color={Color.white}
          message={Common.getTranslation(LangKey.labLoading)}
        />

        <Logo />
        <TouchableOpacity
          style={styles.icons}
          onPress={() => navigation.goBack()}
        >
          <Icon name="back" fill={Color.darkBlue} height={17} width={17} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          {!isForgotPass && (
            <Text
              style={{
                marginLeft: 30,
                fontSize: 18,
                fontWeight: "700",
                marginBottom: 20,
              }}
            >
              {Common.getTranslation(LangKey.labWelcomeBack)}
            </Text>
          )}
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

          <TextInput
            placeholder={
              isForgotPass
                ? Common.getTranslation(LangKey.newPass)
                : Common.getTranslation(LangKey.labPassword)
            }
            placeholderTextColor={Color.txtIntxtcolor}
            returnKeyType="done"
            iconName="lock"
            eyeOn={
              isForgotPass ? null : secureText === true ? "eyeclose" : "eye"
            }
            value={password.value}
            onChangeText={(text) => setPassword({ value: text, error: "" })}
            error={!!password.error}
            errorText={password.error}
            secureTextEntry={secureText}
            toggleSecureText={toggleSecureText}
          />

          {isForgotPass && (
            <TextInput
              placeholder={Common.getTranslation(LangKey.reTypePass)}
              placeholderTextColor={Color.txtIntxtcolor}
              returnKeyType="done"
              iconName="lock"
              value={reTypePass.value}
              onChangeText={(text) => setreTypePass({ value: text, error: "" })}
              error={!!reTypePass.error}
              errorText={reTypePass.error}
              secureTextEntry
            />
          )}
          {!isForgotPass && (
            <View style={styles.forgotPassword}>
              <TouchableOpacity
                onPress={() => {
                  // const mobileError = mobileValidator(mobileNo.value);
                  // if (mobileError) {
                  //   setMobileNo({ ...mobileNo, error: mobileError });
                  //   return;
                  // }
                  setIsForgotPass(true);
                  setPassword({ value: "", error: "" });
                }}
              >
                <Text style={styles.label}>
                  {Common.getTranslation(LangKey.labForgetPassword)}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {!isForgotPass && !userNotVerify ? (
            <Button
              normal={true}
              style={{ margin: 5 }}
              onPress={onLoginPressed}
            >
              {Common.getTranslation(LangKey.labSignin)}
            </Button>
          ) : null}
          {userNotVerify && (
            <TouchableOpacity
              style={styles.btnLoginView}
              onPress={() => onSendOTPUserNotVerify()}
              loading={loading}
              disabled={loading}
            >
              <Text style={styles.txtSignin}>
                {Common.getTranslation(LangKey.labSendOTP)}
              </Text>
            </TouchableOpacity>
          )}
          {isForgotPass && (
            <View style={{ marginVertical: 10 }}>
              <Button
                normal={true}
                onPress={() => onSendOTP()}
                disabled={loading}
              >
                {Common.getTranslation(LangKey.labSendOTP)}
              </Button>
            </View>
          )}
          <View
            style={{
              alignSelf: "center",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              marginVertical: 20,
            }}
          >
            <Text>Don't have an Account ? </Text>
            {isForgotPass ? (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate(Constant.navSignIn);
                  setIsForgotPass(false);
                  setPassword({ value: "", error: "" });
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "700",
                    color: Color.primary,
                  }}
                >
                  {Common.getTranslation(LangKey.labSignin)}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate(Constant.navSignUp);
                  setIsForgotPass(false);
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "700",
                    color: Color.primary,
                  }}
                >
                  {Common.getTranslation(LangKey.labSignup)}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.sapratorView}>
            <View style={styles.sapratorLines} />
            <View style={styles.orView}>
              <Text style={styles.orTXT}>or</Text>
            </View>
            <View style={styles.sapratorLines} />
          </View>

          <View style={{ flexDirection: "row", alignSelf: "center" }}>
            <TouchableOpacity
              activeOpacity={0.6}
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
                <Icon
                  name="google"
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
                  paddingRight: 10,
                }}
              >
                {Common.getTranslation(LangKey.labSignInWithGoogle)}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
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
                  paddingRight: 10,
                }}
              >
                {Common.getTranslation(LangKey.labSignInWithFacebook)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
    marginHorizontal: 5,
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
    marginVertical: 40,
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
    paddingHorizontal: 40,
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
  icons: {
    position: "absolute",
    left: 25,
    top: 20,
  },
});

export default inject("userStore")(observer(SignInScreen));
