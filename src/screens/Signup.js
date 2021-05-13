import React, { memo, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput as TEXTINPUT,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { inject, observer } from "mobx-react";

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
  /*
  ..######..########....###....########.########
  .##....##....##......##.##......##....##......
  .##..........##.....##...##.....##....##......
  ..######.....##....##.....##....##....######..
  .......##....##....#########....##....##......
  .##....##....##....##.....##....##....##......
  ..######.....##....##.....##....##....########
  */
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

        if (data !== null) {
          Common.showMessage(data.userSignup);
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

  const onLegal = () => {
    Common.openWeb();
  };

  /*
  ..######...#######..##.....##.########...#######..##....##.########.##....##.########..######.
  .##....##.##.....##.###...###.##.....##.##.....##.###...##.##.......###...##....##....##....##
  .##.......##.....##.####.####.##.....##.##.....##.####..##.##.......####..##....##....##......
  .##.......##.....##.##.###.##.########..##.....##.##.##.##.######...##.##.##....##.....######.
  .##.......##.....##.##.....##.##........##.....##.##..####.##.......##..####....##..........##
  .##....##.##.....##.##.....##.##........##.....##.##...###.##.......##...###....##....##....##
  ..######...#######..##.....##.##.........#######..##....##.########.##....##....##.....######.
  */

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <ProgressDialog
          color={Color.white}
          visible={loader ? loader : loading}
          dismissable={false}
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
            maxLength={10}
            onChangeText={(text) => setMobileNo({ value: text, error: "" })}
            error={!!mobileNo.error}
            errorText={mobileNo.error}
            autoCapitalize="none"
            keyboardType="numeric"
            marked={!mobileValidator(mobileNo.value) && "mark"}
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
  icons: {
    position: "absolute",
    left: 25,
    top: 20,
  },
});
