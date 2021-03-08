import React, { useState } from "react";
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
} from "react-native";
import { StackActions, useNavigation } from "@react-navigation/native";
import Color from "../utils/Color";
import ICON from "react-native-vector-icons/MaterialCommunityIcons";
import Ratings from "../utils/ratings";
import Common from "../utils/Common";
import LangKey from "../utils/LangKey";
import { useMutation } from "@apollo/client";
import GraphqlQuery from "../utils/GraphqlQuery";
import Constant from "../utils/Constant";
import Button from "./Button";
import Icon from "./svgIcons";
import { ColorPicker } from "react-native-color-picker";
import FastImage from "react-native-fast-image";

const { height, width } = Dimensions.get("screen");
const PopUp = ({
  visible,
  toggleVisible,
  isPurchased,
  other,
  isPicker,
  toggleVisibleColorPicker,
  toggleVisibleforRating,
  setPickerColor,
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
}) => {
  const navigation = useNavigation();
  const [feture, setFeture] = useState("");
  const [mobile, setMobile] = useState("");
  const [refferCode, setRefferCode] = useState("");

  const [isEnabled, setIsEnabled] = useState(true);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const [userRequestFeture, { error }] = useMutation(
    GraphqlQuery.addRequestFeature,
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
                onPress={() => toggleVisible()}
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
                    height={50}
                    width={50}
                    fill={Color.green}
                  />
                </View>
                <Text style={{ fontSize: 20, fontWeight: "700" }}>
                  Know What’s Up{"\n"}
                  on Brand Dot !
                </Text>
              </View>
              <View style={{ alignItems: "center", marginVertical: 10 }}>
                <Text>get all updates and Best offers on WhatsApp</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-around",
                  marginVertical: 15,
                }}
              >
                <Text style={{ fontWeight: "700" }}>
                  Stay Update on Whatsapp
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
                Unsubscribe to these notification any time.
              </Text>
            </View>
          </View>
        )}
        {isNotiMsg && (
          <View style={styles.mainView}>
            <KeyboardAvoidingView style={styles.innerView}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ marginLeft: 10 }}>{msgItm.title}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => toggleVisibleMsg()}
                  style={styles.btnClose}
                >
                  <ICON name="close" size={22} color={Color.darkBlue} />
                </TouchableOpacity>
              </View>

              <Text style={{ paddingHorizontal: 10 }}>{msgItm.body}</Text>
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
                    navigation.dispatch(
                      StackActions.replace(Constant.navProfile, {
                        title: Constant.titPersonalProfile,
                      })
                    );
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
                    navigation.dispatch(
                      StackActions.replace(Constant.navProfile, {
                        title: Constant.titBusinessProfile,
                      })
                    );
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
                  {Common.getTranslation(LangKey.labSubmit)}
                </Button>
              </View>
            </KeyboardAvoidingView>
          </View>
        )}
        {isfree && (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => toggleVisible()}
              style={styles.btnClose}
            >
              <ICON name="close" size={22} color={Color.darkBlue} />
            </TouchableOpacity>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "700",
                    marginBottom: 10,
                  }}
                >
                  {Common.getTranslation(LangKey.labPurchasePremiumPkg)}
                </Text>
              </View>
              <FastImage
                source={require("../assets/img/Select.png")}
                resizeMode={FastImage.resizeMode.contain}
                style={{ height: 100, width: 100 }}
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
                    toggleVisible();
                    navigation.navigate(Constant.navPro, {
                      screen: Constant.titFree,
                    });
                  }}
                >
                  {Common.getTranslation(LangKey.labFree)}
                </Button>
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
          <View
            style={[
              styles.modalView,
              { height: 300, backgroundColor: Color.blackTrans },
            ]}
          >
            <TouchableOpacity
              onPress={() => toggleVisibleColorPicker()}
              style={styles.btnClose}
            >
              <ICON name="close" size={22} color={Color.white} />
            </TouchableOpacity>
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View style={{ height: 250, width: "90%" }}>
                <ColorPicker
                  onColorSelected={(color) => setPickerColor(color)}
                  style={{ flex: 1 }}
                />
              </View>
              <Text
                style={{
                  position: "absolute",
                  bottom: 160,
                  color: Color.white,
                  fontWeight: "700",
                  fontSize: 18,
                }}
              >
                select
              </Text>
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

export default PopUp;
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
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginHorizontal: 20,
    minHeight: 100,
    minWidth: "80%",
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
