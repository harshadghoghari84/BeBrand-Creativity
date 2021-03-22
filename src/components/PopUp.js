import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Switch,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { StackActions, useNavigation } from "@react-navigation/native";
import ICON from "react-native-vector-icons/MaterialCommunityIcons";
import ColorPicker from "react-native-wheel-color-picker";
import FastImage from "react-native-fast-image";
import { useMutation } from "@apollo/client";
// relative path
import Color from "../utils/Color";
import Ratings from "../utils/ratings";
import Common from "../utils/Common";
import LangKey from "../utils/LangKey";
import GraphqlQuery from "../utils/GraphqlQuery";
import Constant from "../utils/Constant";
import Button from "./Button";
import Icon from "./svgIcons";
import TxtInput from "../components/TextInput";
import { mobileValidatorPro } from "../utils/Validator";
import { inject, observer } from "mobx-react";
import { toJS } from "mobx";
import { format } from "date-fns";

const { height, width } = Dimensions.get("screen");
const PopUp = ({
  visible,
  toggleVisible,
  isPurchased,
  isFirstPurchase,
  other,
  isPicker,
  initialColor,
  toggleVisibleColorPicker,
  toggleVisibleforRating,
  setPickerColor,
  setSelectedPicker,
  reffer,
  isRating,
  toggle,
  isfree,
  isLayout,
  isLayoutBussiness,
  msg,
  toggleVisibleMsg,
  toggleVisibleMsgBussiness,
  isNotiMsg,
  msgItm,
  itmDate,
  iconName,
  userStore,
  isGoback,
}) => {
  // const user = toJS(userStore.user);
  const navigation = useNavigation();
  const [user, setUser] = useState();
  const [feture, setFeture] = useState("");
  const [mobile, setMobile] = useState("");
  const [errorMobile, setErrorMobile] = useState("");
  const [refferCode, setRefferCode] = useState("");
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    const user = toJS(userStore.user);
    setUser(user);
    setMobile(user?.whatsappNo ? user.whatsappNo : "");
    if (
      user &&
      user !== null &&
      user.isWhatsappUpdateEnable !== undefined &&
      user.isWhatsappUpdateEnable !== null
    ) {
      setIsEnabled(user.isWhatsappUpdateEnable);
    }
  }, [userStore.user]);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const [userRequestFeture, { loading: rFLoading }] = useMutation(
    GraphqlQuery.addRequestFeature,
    {
      errorPolicy: "all",
    }
  );
  const [updateWhatsappInfo, { loading }] = useMutation(
    GraphqlQuery.updateWhatsappInfo,
    {
      errorPolicy: "all",
    }
  );

  const onsubmit = () => {
    userRequestFeture({
      variables: {
        feature: feture,
      },
    })
      .then((result) => {
        console.log("reslut", result);
        if (result.errors) {
        }
        if (result.data) {
          if (result.data !== null) {
            console.log("result.data", result.data);
            Common.showMessage(Common.getTranslation(LangKey.labSubmitSucess));
            setFeture("");
            toggleVisible();
          }
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const onWhatsappSubmit = () => {
    const errMobile = mobileValidatorPro(mobile, Constant.titPersonalProfile);
    if (errMobile) {
      setErrorMobile(errMobile);
      return;
    }
    setErrorMobile("");

    try {
      updateWhatsappInfo({
        variables: {
          whatsappNo: mobile,
          isUpdateEnable: isEnabled,
        },
      })
        .then((result) => {
          if (result.errors) {
            Common.showMessage(result.errors[0].message);
          }
          if (result.data && result.data !== null) {
            const newUser = {
              ...user,
              whatsappNo: mobile,
              isWhatsappUpdateEnable: isEnabled,
            };

            userStore.setOnlyUserDetail(newUser);
            Common.showMessage(Common.getTranslation(LangKey.labSubmitSucess));
            toggleVisible();
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={() => toggleVisible()}
    >
      <KeyboardAvoidingView style={styles.centeredView}>
        {toggle && (
          <View style={styles.mainView}>
            <View style={styles.innerView}>
              <TouchableOpacity
                onPress={() => {
                  setMobile(user?.whatsappNo ? user.whatsappNo : "");
                  if (
                    user &&
                    user !== null &&
                    user.isWhatsappUpdateEnable !== undefined &&
                    user.isWhatsappUpdateEnable !== null
                  ) {
                    setIsEnabled(user.isWhatsappUpdateEnable);
                  }
                  toggleVisible();
                }}
                style={styles.btnClose}
              >
                <ICON name="close" size={22} color={Color.darkBlue} />
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: "row",
                  marginHorizontal: 20,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View style={{ paddingRight: 20 }}>
                  <Icon
                    name="whatsapp"
                    height={35}
                    width={35}
                    fill={Color.green}
                  />
                </View>
                <Text style={{ fontSize: 18, fontWeight: "700" }}>
                  {Common.getTranslation(LangKey.labWhatsApp)}
                </Text>
              </View>
              <View style={{ alignItems: "center", marginVertical: 10 }}>
                <Text>{Common.getTranslation(LangKey.labUpdateWhatsApp)}</Text>
              </View>
              <TxtInput
                placeholder={Common.getTranslation(LangKey.labMobile)}
                placeholderTextColor={Color.txtIntxtcolor}
                returnKeyType="next"
                iconName="phone"
                value={mobile}
                maxLength={10}
                keyboardType="phone-pad"
                onChangeText={(text) => {
                  setMobile(text), setErrorMobile("");
                }}
                autoCapitalize="none"
                errorText={errorMobile}
                marked={
                  !mobileValidatorPro(mobile, Constant.titPersonalProfile) &&
                  "mark"
                }
              />
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-around",
                  marginVertical: 15,
                }}
              >
                <Text style={{ fontWeight: "700" }}>
                  {Common.getTranslation(LangKey.labStayonWp)}
                </Text>
                <Switch
                  trackColor={{ false: Color.grey, true: Color.primary }}
                  thumbColor={Color.white}
                  onValueChange={toggleSwitch}
                  value={isEnabled}
                />
              </View>
              <Text
                style={{
                  color: Color.grey,
                  alignSelf: "center",
                }}
              >
                {Common.getTranslation(LangKey.labUnsubscribeNoti)}
              </Text>
              <Button
                style={{ margin: 5 }}
                normal={true}
                onPress={() => onWhatsappSubmit()}
                style={{ alignItems: "center", justifyContent: "center" }}
              >
                {loading ? (
                  <ActivityIndicator size={18} color={Color.white} />
                ) : (
                  Common.getTranslation(LangKey.labSubmit)
                )}
              </Button>
            </View>
          </View>
        )}
        {isNotiMsg && (
          <View style={styles.mainView}>
            <KeyboardAvoidingView
              style={[styles.innerView, { minWidth: "60%" }]}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View />
                <Icon
                  name={iconName}
                  fill={Color.primary}
                  height={30}
                  width={30}
                />
                <TouchableOpacity
                  onPress={() => toggleVisibleMsg()}
                  style={[styles.btnClose, { alignSelf: "flex-start" }]}
                >
                  <ICON name="close" size={22} color={Color.darkBlue} />
                </TouchableOpacity>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View style={{ flex: 1, marginTop: 10 }}>
                  <Text
                    style={{
                      marginLeft: 10,
                      fontSize: 14,
                      fontWeight: "800",
                      color: Color.black,
                    }}
                  >
                    {msgItm.title}
                  </Text>
                </View>
              </View>

              <Text
                style={{
                  paddingHorizontal: 10,
                  color: Color.grey,
                  fontSize: 12,
                  fontFamily: "Nunito-Regular",
                }}
              >
                {msgItm.body}
              </Text>
              <Text
                style={{
                  color: Color.grey,
                  fontSize: 10,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  fontFamily: "Nunito-Light",
                }}
              >
                {itmDate}
              </Text>
            </KeyboardAvoidingView>
          </View>
        )}
        {isLayout && (
          <View style={styles.mainView}>
            <KeyboardAvoidingView style={styles.innerView}>
              <TouchableOpacity
                onPress={() => toggleVisibleMsg()}
                style={styles.btnClose}
              >
                <ICON name="close" size={22} color={Color.darkBlue} />
              </TouchableOpacity>
              <View style={{ marginHorizontal: 20 }}>
                <Text style={{ textAlign: "center" }}>{msg}</Text>
              </View>
              <View
                style={{
                  marginTop: 5,
                  alignSelf: "center",
                }}
              >
                <Button
                  style={{ margin: 5 }}
                  onPress={() => {
                    navigation.navigate(Constant.navProfile, {
                      title: Constant.titPersonalProfile,
                    });
                    toggleVisibleMsg();
                  }}
                  icon={
                    <Icon
                      name="edit"
                      height={15}
                      width={15}
                      fill={Color.white}
                    />
                  }
                >
                  {Common.getTranslation(LangKey.txtEdit)}
                </Button>
              </View>
            </KeyboardAvoidingView>
          </View>
        )}
        {isLayoutBussiness && (
          <View style={styles.mainView}>
            <KeyboardAvoidingView style={styles.innerView}>
              <TouchableOpacity
                onPress={() => toggleVisibleMsgBussiness()}
                style={styles.btnClose}
              >
                <ICON name="close" size={22} color={Color.darkBlue} />
              </TouchableOpacity>
              <View style={{ marginHorizontal: 20 }}>
                <Text style={{ textAlign: "center" }}>{msg}</Text>
              </View>
              <View
                style={{
                  marginTop: 5,
                  alignSelf: "center",
                }}
              >
                <Button
                  style={{ margin: 5 }}
                  onPress={() => {
                    navigation.navigate(Constant.navProfile, {
                      title: Constant.titBusinessProfile,
                    });
                    toggleVisibleMsgBussiness();
                  }}
                  icon={
                    <Icon
                      name="edit"
                      height={15}
                      width={15}
                      fill={Color.white}
                    />
                  }
                >
                  {Common.getTranslation(LangKey.labEdit)}
                </Button>
              </View>
            </KeyboardAvoidingView>
          </View>
        )}
        {other && (
          <View style={styles.mainView}>
            <KeyboardAvoidingView style={styles.innerView}>
              <TouchableOpacity
                onPress={() => toggleVisible()}
                style={styles.btnClose}
              >
                <ICON name="close" size={22} color={Color.darkBlue} />
              </TouchableOpacity>

              <TextInput
                placeholder={Common.getTranslation(LangKey.modalTxtPlaceHolder)}
                placeholderTextColor={Color.grey}
                multiline={true}
                value={feture}
                onChangeText={(val) => setFeture(val)}
                style={{
                  height: 100,
                  borderRadius: 10,
                  paddingHorizontal: 20,
                  backgroundColor: Color.txtInBgColor,
                }}
              />
              <View
                style={{
                  marginTop: 5,
                  alignSelf: "center",
                }}
              >
                <Button
                  disabled={feture == null || feture.length <= 0}
                  style={{ margin: 5 }}
                  normal={true}
                  onPress={() => onsubmit()}
                >
                  {rFLoading ? (
                    <ActivityIndicator size={18} color={Color.white} />
                  ) : (
                    Common.getTranslation(LangKey.labSubmit)
                  )}
                </Button>
              </View>
            </KeyboardAvoidingView>
          </View>
        )}
        {isfree && (
          <View style={styles.mainView}>
            <View style={styles.innerView}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "700",
                    paddingLeft: 20,
                  }}
                >
                  {Common.getTranslation(LangKey.labPurchasePremiumPkg)}
                </Text>
                <TouchableOpacity
                  onPress={() => toggleVisible()}
                  style={styles.btnClose}
                >
                  <ICON name="close" size={22} color={Color.darkBlue} />
                </TouchableOpacity>
              </View>
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <FastImage
                  source={require("../assets/img/Select.png")}
                  resizeMode={FastImage.resizeMode.contain}
                  style={{ height: 100, width: 100, margin: 10 }}
                />
                <View
                  style={{
                    marginTop: 10,
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    style={{ margin: 5 }}
                    normal={true}
                    onPress={() => {
                      navigation.navigate(Constant.navPro, {
                        screen: Constant.titFree,
                      });
                      toggleVisible();
                    }}
                  >
                    {Common.getTranslation(LangKey.labFree)}
                  </Button>
                  <Button
                    style={{ margin: 5 }}
                    normal={true}
                    onPress={() => {
                      navigation.navigate(Constant.navPro, {
                        screen: Constant.titPrimium,
                      });
                      toggleVisible();
                    }}
                  >
                    {Common.getTranslation(LangKey.labPremium)}
                  </Button>
                </View>
              </View>
            </View>
          </View>
        )}
        {isPurchased && (
          <View style={styles.mainView}>
            <View style={styles.innerView}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "700",
                    paddingLeft: 20,
                  }}
                >
                  {Common.getTranslation(LangKey.labPurchasePremiumPkg)}
                </Text>
                <TouchableOpacity
                  onPress={() => toggleVisible()}
                  style={styles.btnClose}
                >
                  <ICON name="close" size={22} color={Color.darkBlue} />
                </TouchableOpacity>
              </View>
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <FastImage
                  source={require("../assets/img/Select.png")}
                  resizeMode={FastImage.resizeMode.contain}
                  style={{ height: 100, width: 100, margin: 10 }}
                />
                <View
                  style={{
                    marginTop: 10,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    style={{ margin: 5 }}
                    normal={true}
                    onPress={() => {
                      navigation.navigate(Constant.navPro, {
                        screen: Constant.titPrimium,
                      });
                      toggleVisible();
                    }}
                  >
                    {Common.getTranslation(LangKey.labPremium)}
                  </Button>
                </View>
              </View>
            </View>
          </View>
        )}
        {isPicker && (
          <View style={styles.mainView}>
            <View style={styles.innerView}>
              <TouchableOpacity
                onPress={() => toggleVisibleColorPicker()}
                style={styles.btnClose}
              >
                <ICON name="close" size={22} color={Color.darkBlue} />
              </TouchableOpacity>
              <View style={{ height: 300, width: "90%" }}>
                <ColorPicker
                  color={initialColor}
                  onColorChange={(color) => {
                    setPickerColor(color), setSelectedPicker(true);
                  }}
                  thumbSize={30}
                  sliderSize={40}
                />
              </View>
            </View>
          </View>
        )}
        {reffer && (
          <View style={styles.modalView}>
            <TouchableOpacity
              onPress={() => toggleVisible()}
              style={styles.btnClose}
            >
              <ICON name="close" size={22} color={Color.darkBlue} />
            </TouchableOpacity>
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TextInput
                placeholder={Common.getTranslation(LangKey.titleAddReffercode)}
                placeholderTextColor={Color.grey}
                multiline={true}
                value={refferCode}
                onChangeText={(val) => setRefferCode(val)}
                style={{
                  // flex: 1,
                  height: 50,
                  width: "90%",
                  borderRadius: 10,
                  paddingHorizontal: 20,
                  backgroundColor: Color.txtInBgColor,
                }}
              />
              <View
                style={{
                  marginTop: 20,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Button
                  style={{ margin: 5 }}
                  normal={true}
                  onPress={() => toggleVisible()}
                >
                  {Common.getTranslation(LangKey.labSubmit)}
                </Button>
              </View>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
};

// export default PopUp;
export default inject("userStore")(observer(PopUp));

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mainView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  innerView: {
    padding: 10,
    backgroundColor: Color.white,
    borderRadius: 8,
    marginHorizontal: 20,
    minHeight: 100,
    minWidth: "80%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  btnClose: {
    width: 25,
    height: 25,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
  },
  modalView: {
    height: 200,
    width: "80%",
    // alignItems: "center",
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  openButton: {
    borderRadius: 20,
    paddingHorizontal: 30,
    paddingVertical: 5,
    elevation: 2,
    alignSelf: "center",
    marginTop: 20,
  },
  textStyle: {
    color: Color.white,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
