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
  ScrollView,
  SafeAreaView,
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
import { inject, observer } from "mobx-react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import auth from "@react-native-firebase/auth";
// Relative path
import TextInput from "../components/TextInput";
import { paperTheme as theme } from "../utils/Theme";
import {
  mobileValidator,
  passwordValidator,
  confirmPasswordValidator,
} from "../utils/Validator";
import GraphqlQuery from "../utils/GraphqlQuery";
import Constant from "../utils/Constant";
import LangKey from "../utils/LangKey";
import Common from "../utils/Common";
import Color from "../utils/Color";
import Icon from "../components/svgIcons";
import ProgressDialog from "./common/ProgressDialog";
import Button from "../components/Button";
import Logo from "../components/Logo";

const RegisterScreen = ({ userStore }) => {
  const navigation = useNavigation();
  const [loader, setLoader] = useState(false);

  const [mobileNo, setMobileNo] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [confirmPassword, setConfirmPassword] = useState({
    value: "",
    error: "",
  });
  const [referrCode, setReferrCode] = useState("");
  const [otp, setOtp] = useState("");
  const [otpVisible, setOtpVisible] = useState(false);

  const [userSignup, { loading }] = useMutation(GraphqlQuery.userSignup, {
    errorPolicy: "all",
  });

  const [userSignupSocial, { loading: mutLoading }] = useMutation(
    GraphqlQuery.userSignupSocial,
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

  const sendTokentoServer = (response) => {
    try {
      auth()
        .currentUser?.getIdToken()
        .then((token) => {
          return userSignupSocial({
            variables: {
              token: token,
            },
          })
            .then(({ data, errors }) => {
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
      setLoader(true);
      const isSignedIn = await GoogleSignin.isSignedIn();
      if (isSignedIn) {
        try {
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
        const { idToken } = await GoogleSignin.signIn();

        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        return auth()
          .signInWithCredential(googleCredential)
          .then((res) => {
            sendTokentoServer(res);
          });
      }
    } catch (error) {
      console.log("===>", error);
    }
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
      return auth()
        .signInWithCredential(facebookCredential)
        .then((res) => {
          sendTokentoServer(res);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const _onSendOtp = async () => {
    const mobileError = mobileValidator(mobileNo.value);
    const passwordError = passwordValidator(password.value);
    const confirmPasswordError = confirmPasswordValidator(
      password.value,
      confirmPassword.value
    );

    if (mobileError || passwordError || confirmPasswordError) {
      setMobileNo({ ...mobileNo, error: mobileError });
      setPassword({ ...password, error: passwordError });
      setConfirmPassword({ ...confirmPassword, error: confirmPasswordError });
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
        console.log("data", data);
        if (data !== null) {
          navigation.navigate(Constant.navOtp, { mobile: mobileNo.value });
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
    const confirmPasswordError = confirmPasswordValidator(
      password.value,
      confirmPassword.value
    );

    if (mobileError || passwordError || confirmPasswordError) {
      setMobileNo({ ...mobileNo, error: mobileError });
      setPassword({ ...password, error: passwordError });
      setConfirmPassword({ ...confirmPassword, error: confirmPasswordError });
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
        if (data !== null) {
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

  const onLegal = () => {
    Common.openWeb();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <ProgressDialog
          color={Color.white}
          visible={loader ? loader : mutLoading ? mutLoading : loading}
          dismissable={false}
          message={Common.getTranslation(LangKey.labLoading)}
        />
        <Logo />

        <View style={{ flex: 1 }}>
          <Text
            style={{
              marginLeft: 30,
              fontSize: 18,
              fontWeight: "700",
              marginBottom: 20,
            }}
          >
            {Common.getTranslation(LangKey.labGetStarted)}
          </Text>

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
            placeholder={Common.getTranslation(LangKey.labPassword)}
            placeholderTextColor={Color.txtIntxtcolor}
            returnKeyType="done"
            iconName="lock"
            value={password.value}
            onChangeText={(text) => setPassword({ value: text, error: "" })}
            error={!!password.error}
            errorText={password.error}
            secureTextEntry
            marked={!passwordValidator(password.value) && "mark"}
          />

          <TextInput
            placeholder={Common.getTranslation(LangKey.labConfirmPassword)}
            placeholderTextColor={Color.txtIntxtcolor}
            returnKeyType="done"
            iconName="lock"
            value={confirmPassword.value}
            onChangeText={(text) =>
              setConfirmPassword({ value: text, error: "" })
            }
            error={!!confirmPassword.error}
            errorText={confirmPassword.error}
            secureTextEntry
            marked={
              !confirmPasswordValidator(
                password.value,
                confirmPassword.value
              ) && "mark"
            }
          />
          {/* <TextInput
            placeholder={Common.getTranslation(LangKey.labReferralcode)}
            placeholderTextColor={Color.txtIntxtcolor}
            returnKeyType="done"
            iconName="refferfilld"
            value={referrCode}
            onChangeText={(text) => setReferrCode(text)}
            // error={!!confirmPassword.error}
            // errorText={confirmPassword.error}
          /> */}

          <View style={{ marginVertical: 20 }}>
            <Button
              normal={true}
              onPress={() => _onSendOtp()}
              disabled={loading}
            >
              {Common.getTranslation(LangKey.labSendOTP)}
            </Button>
          </View>

          <View
            style={{
              alignSelf: "center",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
            }}
          >
            <Text>Already have an Account ! </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate(Constant.navSignIn)}
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
          </View>

          {/* {otpVisible && (
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
                {Common.getTranslation(LangKey.labAnOtpSent)}
              </Text>
            </Animatable.View>
          )} */}
          {/* {password.value.length > 0 ? (
            <>
              {otp !== null && otp.length > 5 ? (
                <Button
                  normal={true}
                  onPress={() => verifyOtp()}
                  disabled={loading}
                >
                  {Common.getTranslation(LangKey.labSignup)}
                </Button>
              ) : (
                <Button
                  normal={true}
                  onPress={() => _onSignUpPressed()}
                  disabled={loading}
                >
                  {Common.getTranslation(LangKey.labSendOTP)}
                </Button>
              )}
            </>
          ) : null} */}
        </View>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: 20,
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Text style={{ color: Color.txtIntxtcolor }}>
              By Signing Up You Accept The
            </Text>
            <TouchableOpacity activeOpacity={0.6} onPress={() => onLegal()}>
              <Text
                style={{
                  color: Color.accent,
                  textDecorationLine: "underline",
                }}
              >
                Terms &
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: "row",
            }}
          >
            <TouchableOpacity activeOpacity={0.6} onPress={() => onLegal()}>
              <Text
                style={{
                  color: Color.accent,
                  textDecorationLine: "underline",
                }}
              >
                Condition
              </Text>
            </TouchableOpacity>

            <Text
              style={{
                color: Color.txtIntxtcolor,
                marginHorizontal: 5,
              }}
            >
              and
            </Text>
            <TouchableOpacity activeOpacity={0.6} onPress={() => onLegal()}>
              <Text
                style={{
                  color: Color.accent,
                  textDecorationLine: "underline",
                }}
              >
                Privacy Policy
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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

  socialTXT: {
    height: 48,
    fontSize: 13,
    fontWeight: "700",
    color: Color.darkBlue,
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
