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
  TouchableHighlight,
  TouchableWithoutFeedback,
  Platform,
  FlatList,
  ToastAndroid,
  Linking,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
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
import {
  AddressValidatorPro,
  designationValidatorPro,
  emailValidatorPro,
  mobileValidatorPro,
  nameValidatorPro,
  SocailMediaValidatorPro,
  websiteValidatorPro,
} from "../utils/Validator";
import { inject, observer } from "mobx-react";
import { toJS } from "mobx";
import { format } from "date-fns";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SvgCss } from "react-native-svg";
import SvgConstant from "../utils/SvgConstant";

const { height, width } = Dimensions.get("screen");

let isUpdated = false;
let changedColor;

const PopUp = ({
  visible,
  toggleVisible,
  isPurchased,
  isPurchasedPrem,
  toggleVisibleForPkgPrem,
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
  designStore,
  isGoback,
  isVisibleAd,
  toggleVisibleAd,
  isModalOffers,
  isModalUpdateApp,
  imgHeight,
  imgWidth,
  appDetails,
  toggleVisibleModal,
  toggleVisibleForModaloffer,
  modalOfferData,
  isVisiblePersonalInfo,
  toggleVisibleModalForEditPersonalInfo,
  isVisibleBusinessInfo,
  toggleVisibleModalForEditBussinessInfo,
}) => {
  // const user = toJS(userStore.user);
  const navigation = useNavigation();
  const [user, setUser] = useState();
  const [feture, setFeture] = useState("");
  const [mobile, setMobile] = useState("");
  const [errorMobile, setErrorMobile] = useState("");
  const [refferCode, setRefferCode] = useState("");
  const [isEnabled, setIsEnabled] = useState(true);

  const [userName, setUserName] = useState();
  const [mobileNo, setMobileNo] = useState();
  const [email, setEmail] = useState();
  const [designation, setDesignation] = useState();
  const [website, setWebsite] = useState();
  const [socialMediaId, setSocialMediaId] = useState();

  const [errorUserName, setErrorUserName] = useState("");
  const [errorMobileNo, setErrorMobileNo] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorDesignation, setErrorDesignation] = useState("");
  const [errorSocialMediaId, setErrorSocailMediaId] = useState("");
  const [errorWebsite, setErrorWebsite] = useState("");

  const [userNameB, setUserNameB] = useState();
  const [mobileNoB, setMobileNoB] = useState();
  const [emailB, setEmailB] = useState();
  const [addressB, setAddressB] = useState();
  const [websiteB, setWebsiteB] = useState();
  const [socialMediaIdB, setSocialMediaIdB] = useState();

  const [errorUserNameB, setErrorUserNameB] = useState("");
  const [errorMobileNoB, setErrorMobileNoB] = useState("");
  const [errorEmailB, setErrorEmailB] = useState("");
  const [errorAddressB, setErrorAddressB] = useState("");
  const [errorSocialMediaIdB, setErrorSocailMediaIdB] = useState("");
  const [errorWebsiteB, setErrorWebsiteB] = useState("");

  const [defaultImageUrl, setDefaultImageUrl] = useState(null);
  const [defaultImageUrlB, setDefaultImageUrlB] = useState(null);
  const [updateApp, setUpdateApp] = useState({});
  const [buttonvisible, setButtonVisible] = useState(false);

  const [socialIconList, setSocialIconList] = useState(
    Constant.defSocialIconList
  );
  const [socialIconListB, setSocialIconListB] = useState(
    Constant.defSocialIconList
  );

  const isMountedRef = Common.useIsMountedRef();

  useEffect(() => {
    AsyncStorage.getItem(Constant.prfIcons)
      .then((res) => {
        if (res && res !== null) {
          setSocialIconList(JSON.parse(res));
        }
      })
      .catch((err) => console.log("async err", err));
    AsyncStorage.getItem(Constant.prfIconsB)
      .then((res) => {
        if (res && res !== null) {
          setSocialIconListB(JSON.parse(res));
        }
      })
      .catch((err) => console.log("async err", err));
  }, []);

  useEffect(() => {
    isUpdated = true;
  }, []);
  useEffect(() => {
    if (appDetails != undefined) {
      setUpdateApp(appDetails);
    }
  }, [appDetails, imgWidth, imgHeight]);
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
    if (user?.userInfo?.personal) {
      if (isUpdated && isUpdated === true) {
        setUserName(
          user?.userInfo?.personal?.name ? user.userInfo.personal.name : ""
        );
        setMobileNo(
          user?.userInfo?.personal?.mobile
            ? user.userInfo.personal.mobile
            : user?.mobile
            ? user.mobile
            : ""
        );
        setEmail(
          user?.userInfo?.personal?.email ? user.userInfo.personal.email : ""
        );
        setDesignation(
          user?.userInfo?.personal?.designation
            ? user.userInfo.personal.designation
            : ""
        );
        setWebsite(
          user?.userInfo?.personal?.website
            ? user.userInfo.personal.website
            : ""
        );
        setSocialMediaId(
          user?.userInfo?.personal?.socialMediaId
            ? user.userInfo.personal.socialMediaId
            : ""
        );
      }
    }
    if (user?.userInfo?.business) {
      if (isUpdated && isUpdated === true) {
        setUserNameB(
          user?.userInfo?.business?.name ? user.userInfo.business.name : ""
        );
        setMobileNoB(
          user?.userInfo?.business?.mobile
            ? user.userInfo.business.mobile
            : user?.mobile
            ? user.mobile
            : ""
        );
        setEmailB(
          user?.userInfo?.business?.email ? user.userInfo.business.email : ""
        );
        setAddressB(
          user?.userInfo?.business?.address
            ? user.userInfo.business.address
            : ""
        );
        setWebsiteB(
          user?.userInfo?.business?.website
            ? user.userInfo.business.website
            : ""
        );
        setSocialMediaIdB(
          user?.userInfo?.business?.socialMediaId
            ? user.userInfo.business.socialMediaId
            : ""
        );
      }
    }
    isUpdated = false;

    user?.userInfo?.personal?.image && user.userInfo.personal.image.length > 0
      ? setDefaultImageUrl(
          user.userInfo.personal.image.find((item) => item.isDefault === true)
            .url
        )
      : setDefaultImageUrl(null);

    user?.userInfo?.business?.image && user.userInfo.business.image.length > 0
      ? setDefaultImageUrlB(
          user.userInfo.business.image.find((item) => item.isDefault === true)
            .url
        )
      : setDefaultImageUrlB(null);
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

  const [updatePersonalUserInfo, { loading: perLoading }] = useMutation(
    GraphqlQuery.updatePersonalUserInfo,
    {
      errorPolicy: "all",
    }
  );
  const [updateBusinessUserInfo, { loading: busLoading }] = useMutation(
    GraphqlQuery.updateBusinessUserInfo,
    {
      errorPolicy: "all",
    }
  );
  const [addRefCode, { loading: adRefLoading }] = useMutation(
    GraphqlQuery.addRefCode,
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

  const onClickSavePersonal = () => {
    //  validation
    let type = Constant.titPersonalProfile;
    const errUserName = nameValidatorPro(userName, type);
    if (errUserName) {
      setErrorUserName(errUserName);
      return;
    }
    setErrorUserName("");
    const re = /^[0]?[6789]\d{9}$/;
    if (!mobile || mobile == null || mobile == "") {
    } else if (mobile.length > 10 || !re.test(mobile)) {
      setErrorMobile(Common.getTranslation(LangKey.personalMobileErr));
      return;
    }
    setErrorMobile("");
    const emailre = /\S+@\S+\.\S+/;

    if (!email || email == null || email == "") {
    } else if (!emailre.test(email) || email.length > 26) {
      setErrorEmail(Common.getTranslation(LangKey.personalEmailErr));
      return;
    }
    setErrorEmail("");
    if (!designation || designation == null || designation == "") {
    } else if (designation.length > 18) {
      setErrorDesignation(
        Common.getTranslation(LangKey.personalDesignationErr)
      );
      return;
    }
    setErrorDesignation("");
    if (!socialMediaId || socialMediaId == null || socialMediaId == "") {
    } else if (socialMediaId.length > 20) {
      setErrorSocailMediaId(
        Common.getTranslation(LangKey.personalSocialMediaIdErr)
      );
      return;
    }
    setErrorSocailMediaId("");
    if (!website || website == null || website == "") {
    } else if (website.length > 26) {
      setErrorWebsite(Common.getTranslation(LangKey.personalWebsiteErr));
      return;
    }
    setErrorWebsite("");

    try {
      updatePersonalUserInfo({
        variables: {
          name: userName,
          mobile: mobile,
          email: email,
          designation: designation,
          website: website,
          socialMediaId: socialMediaId,
          defaultImageUrl: defaultImageUrl,
        },
      })
        .then(({ data, errors }) => {
          if (data) {
            let newImage = [];
            if (defaultImageUrl && defaultImageUrl !== "") {
              newImage = user?.userInfo?.personal?.image.map((item) => {
                if (item.url == defaultImageUrl) {
                  item.isDefault = true;
                } else {
                  item.isDefault = false;
                }
                return item;
              });
            }
            const newUser = {
              ...user,
              userInfo: {
                ...user?.userInfo,
                personal: {
                  name: userName,
                  mobile: mobile,
                  email: email,
                  designation: designation,
                  website: website,
                  socialMediaId: socialMediaId,
                  image: newImage,
                },
              },
            };

            userStore.setOnlyUserDetail(newUser);
            Common.showMessage(data.updatePersonalUserInfo);
            toggleVisibleModalForEditPersonalInfo();
          } else {
            Common.showMessage(errors[0].message);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const onClickSaveBusiness = () => {
    //  validation

    let type = Constant.titBusinessProfile;

    const errUserName = nameValidatorPro(userNameB, type);
    if (errUserName) {
      setErrorUserNameB(errUserName);
      return;
    }
    setErrorUserNameB("");
    const re = /^[0]?[6789]\d{9}$/;
    if (!mobile || mobile == null || mobile == "") {
    } else if (mobile.length > 10 || !re.test(mobileNoB)) {
      setErrorMobileNoB(Common.getTranslation(LangKey.bussinessMobileErr));
      return;
    }
    setErrorMobileNoB("");
    const emailre = /\S+@\S+\.\S+/;

    if (!emailB || emailB == null || emailB == "") {
    } else if (!emailre.test(emailB) || emailB.length > 26) {
      setErrorEmailB(Common.getTranslation(LangKey.bussinessEmailErr));
      return;
    }
    setErrorEmailB("");
    if (!addressB || addressB == null || addressB == "") {
    } else if (addressB.length > 41) {
      setErrorAddressB(Common.getTranslation(LangKey.bussinessAddressErr));
      return;
    }
    setErrorAddressB("");
    if (!socialMediaIdB || socialMediaIdB == null || socialMediaIdB == "") {
    } else if (socialMediaIdB.length > 20) {
      setErrorSocailMediaIdB(
        Common.getTranslation(LangKey.bussinessSocialMediaIdErr)
      );
      return;
    }
    setErrorSocailMediaIdB("");
    if (!websiteB || websiteB == null || websiteB == "") {
    } else if (websiteB.length > 26) {
      setErrorWebsiteB(Common.getTranslation(LangKey.bussinessWebsiteErr));
      return;
    }
    setErrorWebsiteB("");

    try {
      updateBusinessUserInfo({
        variables: {
          name: userNameB,
          mobile: mobileNoB,
          email: emailB,
          address: addressB,
          website: websiteB,
          socialMediaId: socialMediaIdB,
          defaultImageUrl: defaultImageUrlB,
        },
      })
        .then(({ data, errors }) => {
          if (data) {
            let newImage = [];
            if (defaultImageUrlB && defaultImageUrlB !== "") {
              newImage = user?.userInfo?.business?.image.map((item) => {
                if (item.url == defaultImageUrlB) {
                  item.isDefault = true;
                } else {
                  item.isDefault = false;
                }
                return item;
              });
            }
            const newUser = {
              ...user,
              userInfo: {
                ...user?.userInfo,
                business: {
                  name: userNameB,
                  mobile: mobileNoB,
                  email: emailB,
                  address: addressB,
                  website: websiteB,
                  socialMediaId: socialMediaIdB,
                  image: newImage,
                },
              },
            };

            userStore.setOnlyUserDetail(newUser);
            Common.showMessage(data.updateBusinessUserInfo);
            toggleVisibleModalForEditBussinessInfo();
          } else {
            Common.showMessage(errors[0].message);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={() => {
        toggleVisible();
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        keyboardVerticalOffset={-50}
        style={styles.centeredView}
      >
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
            <View style={[styles.innerView, { minWidth: "60%" }]}>
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
            </View>
          </View>
        )}
        {isLayout && (
          <View
            style={[styles.mainView, { backgroundColor: Color.blackTrans }]}
          >
            <View
              style={{
                backgroundColor: Color.transparent,
              }}
            >
              <TouchableOpacity
                activeOpacity={0.3}
                onPress={() => toggleVisibleMsg()}
                style={{
                  width: 30,
                  height: 30,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: Color.white,
                  borderRadius: 15,
                  position: "absolute",
                  right: 28,
                  top: 5,
                  zIndex: 1,
                  borderColor: "black",
                  borderWidth: 0.5,
                }}
              >
                <ICON name="close" size={18} color={Color.darkBlue} />
              </TouchableOpacity>

              <FastImage
                source={require("../assets/img/15.jpg")}
                resizeMode={FastImage.resizeMode.contain}
                style={{
                  height: width - 20,
                  width: width - 20,
                  marginHorizontal: 23,
                  borderRadius: 5,
                }}
              />
              <View
                style={{
                  flexDirection: "row",
                  alignSelf: "center",
                  justifyContent: "space-between",
                  position: "absolute",
                  bottom: 5,
                }}
              >
                <Button
                  style={{ margin: 5 }}
                  onPress={() => toggleVisibleMsg("edit")}
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
                <Button
                  style={{ margin: 5 }}
                  onPress={() => {
                    toggleVisibleMsg(true);
                  }}
                >
                  {Common.getTranslation(LangKey.txtNext)}
                </Button>
              </View>
            </View>
          </View>
        )}
        {isLayoutBussiness && (
          <View
            style={[styles.mainView, { backgroundColor: Color.blackTrans }]}
          >
            <View
              style={{
                backgroundColor: Color.transparent,
              }}
            >
              <TouchableOpacity
                activeOpacity={0.3}
                onPress={() => toggleVisibleMsgBussiness()}
                style={{
                  width: 30,
                  height: 30,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: Color.white,
                  borderRadius: 15,
                  position: "absolute",
                  right: 28,
                  top: 5,
                  zIndex: 1,
                  borderColor: "black",
                  borderWidth: 0.5,
                }}
              >
                <ICON name="close" size={18} color={Color.darkBlue} />
              </TouchableOpacity>

              <FastImage
                source={require("../assets/img/15.jpg")}
                resizeMode={FastImage.resizeMode.contain}
                style={{
                  height: width - 20,
                  width: width - 20,
                  marginHorizontal: 23,
                  borderRadius: 5,
                }}
              />
              <View
                style={{
                  flexDirection: "row",
                  alignSelf: "center",
                  justifyContent: "space-between",
                  position: "absolute",
                  bottom: 5,
                }}
              >
                <Button
                  style={{ margin: 5 }}
                  onPress={() => {
                    toggleVisibleMsgBussiness("edit");
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
                <Button
                  style={{ margin: 5 }}
                  onPress={() => {
                    toggleVisibleMsgBussiness(true);
                  }}
                >
                  {Common.getTranslation(LangKey.txtNext)}
                </Button>
              </View>
            </View>
          </View>
          // <View style={styles.mainView}>
          //   <KeyboardAvoidingView style={styles.innerView}>
          //     <TouchableOpacity
          //       onPress={() => toggleVisibleMsgBussiness()}
          //       style={styles.btnClose}
          //     >
          //       <ICON name="close" size={22} color={Color.darkBlue} />
          //     </TouchableOpacity>
          //     <View style={{ marginHorizontal: 20 }}>
          //       <Text style={{ textAlign: "center" }}>{msg}</Text>
          //     </View>
          //     <View
          //       style={{
          //         marginTop: 5,
          //         alignSelf: "center",
          //         flexDirection: "row",
          //       }}
          //     >
          //       <Button
          //         style={{ margin: 5 }}
          //         onPress={() => {
          //           toggleVisibleMsgBussiness("edit");
          //         }}
          //         icon={
          //           <Icon
          //             name="edit"
          //             height={15}
          //             width={15}
          //             fill={Color.white}
          //           />
          //         }
          //       >
          //         {Common.getTranslation(LangKey.labEdit)}
          //       </Button>
          //       <Button
          //         style={{ margin: 5 }}
          //         onPress={() => {
          //           toggleVisibleMsgBussiness(true);
          //         }}
          //       >
          //         {Common.getTranslation(LangKey.txtNext)}
          //       </Button>
          //     </View>
          //   </KeyboardAvoidingView>
          // </View>
        )}
        {other && (
          <View style={styles.mainView}>
            <View style={styles.innerView}>
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
            </View>
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
                      navigation.navigate(
                        Platform.OS === "android"
                          ? Constant.titPrimium
                          : Constant.titPrimiumIos
                      );
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
        {isVisibleAd && (
          <View
            style={[styles.mainView, { backgroundColor: Color.blackTrans }]}
          >
            <View
              style={{
                backgroundColor: Color.transparent,
              }}
            >
              <TouchableOpacity
                activeOpacity={0.3}
                onPress={() => toggleVisibleAd()}
                style={{
                  width: 20,
                  height: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: Color.white,
                  borderRadius: 15,
                  position: "absolute",
                  right: 28,
                  top: 5,
                  zIndex: 1,
                  borderColor: "black",
                  borderWidth: 0.5,
                }}
              >
                <ICON name="close" size={18} color={Color.darkBlue} />
              </TouchableOpacity>

              <FastImage
                source={require("../assets/img/32.jpg")}
                resizeMode={FastImage.resizeMode.contain}
                style={{
                  height: width - 20,
                  width: width - 20,
                  marginHorizontal: 23,
                  borderRadius: 5,
                }}
              />
              <View
                style={{
                  flexDirection: "row",
                  alignSelf: "center",
                  justifyContent: "space-between",
                  position: "absolute",
                  bottom: 5,
                }}
              >
                <Button
                  style={{ margin: 5 }}
                  normal={true}
                  txtSize={true}
                  onPress={() => {
                    navigation.navigate(
                      Platform.OS === "android"
                        ? Constant.titPrimium
                        : Constant.titPrimiumIos
                    );
                    toggleVisibleAd();
                  }}
                >
                  {Common.getTranslation(LangKey.titleBePremium)}
                </Button>
                <Button
                  style={{ margin: 5 }}
                  normal={true}
                  txtSize={true}
                  onPress={() => {
                    toggleVisibleAd(true);
                  }}
                >
                  {Common.getTranslation(LangKey.labWatchAds)}
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
                      navigation.navigate(
                        Platform.OS === "android"
                          ? Constant.titPrimium
                          : Constant.titPrimiumIos
                      );
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
        {isPurchasedPrem && (
          <View
            style={[styles.mainView, { backgroundColor: Color.blackTrans }]}
          >
            <View
              style={{
                backgroundColor: Color.transparent,
              }}
            >
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => toggleVisibleForPkgPrem()}
                style={{
                  width: 20,
                  height: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: Color.white,
                  borderRadius: 15,
                  position: "absolute",
                  right: 28,
                  top: 5,
                  zIndex: 1,
                  borderColor: "black",
                  borderWidth: 0.5,
                }}
              >
                <ICON name="close" size={18} color={Color.darkBlue} />
              </TouchableOpacity>

              <FastImage
                source={require("../assets/img/33.jpg")}
                resizeMode={FastImage.resizeMode.contain}
                style={{
                  height: width - 20,
                  width: width - 20,
                  marginHorizontal: 23,
                  borderRadius: 5,
                }}
              />
              <View
                style={{
                  flexDirection: "row",
                  alignSelf: "center",
                  justifyContent: "space-between",
                  position: "absolute",
                  bottom: 5,
                }}
              >
                <Button
                  style={{ margin: 5 }}
                  normal={true}
                  onPress={() => {
                    navigation.navigate(
                      Platform.OS === "android"
                        ? Constant.titPrimium
                        : Constant.titPrimiumIos
                    );
                    toggleVisibleForPkgPrem();
                  }}
                >
                  {Common.getTranslation(LangKey.labPremium)}
                </Button>
              </View>
            </View>
          </View>
        )}
        {isPicker && (
          <View style={styles.mainView}>
            <View style={styles.innerView}>
              <TouchableOpacity
                onPress={() => toggleVisibleColorPicker(changedColor)}
                style={styles.btnClose}
              >
                <ICON name="close" size={22} color={Color.darkBlue} />
              </TouchableOpacity>
              <View style={{ height: 300, width: "90%" }}>
                <ColorPicker
                  color={initialColor}
                  onColorChange={(color) => {
                    changedColor = color;
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
          <View style={[styles.modalView, { height: 300, width: "90%" }]}>
            {/* <TouchableOpacity
              onPress={() => toggleVisible()}
              style={[styles.btnClose, { margin: 5 }]}
            >
              <ICON name="close" size={22} color={Color.darkBlue} />
            </TouchableOpacity> */}
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SvgCss xml={SvgConstant.invite} width="50%" height={200} />

              <TextInput
                placeholder={Common.getTranslation(LangKey.titleAddReffercode)}
                placeholderTextColor={Color.grey}
                value={refferCode}
                onChangeText={(val) => setRefferCode(val)}
                style={{
                  // flex: 1,
                  height: 40,
                  width: "90%",
                  borderRadius: 10,
                  paddingHorizontal: 20,

                  backgroundColor: Color.txtInBgColor,
                }}
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  width: "90%",
                }}
              >
                <Button
                  normal={true}
                  onPress={() => {
                    addRefCode({ variables: { refCode: refferCode } }).then(
                      ({ data, errors }) => {
                        if (errors && errors !== null) {
                          Common.showMessage(errors[0].message);
                        }
                        if (data && data?.addRefCode !== null) {
                          console.log("addRefCode", data.addRefCode);
                          const newUser = {
                            ...user,
                            parentRefCode: refferCode,
                            designPackage: data.addRefCode
                              ? data.addRefCode
                              : user.designPackage,
                          };
                          userStore.setUser(newUser);
                          toggleVisible(true);
                        }
                      }
                    );
                  }}
                >
                  {adRefLoading ? (
                    <ActivityIndicator color={Color.white} />
                  ) : (
                    Common.getTranslation(LangKey.labSubmit)
                  )}
                </Button>
                <Button
                  normal={true}
                  onPress={() => {
                    toggleVisible();
                  }}
                >
                  Cancel
                </Button>
              </View>
            </View>
          </View>
        )}
        {isModalOffers && (
          <View
            style={[
              styles.mainView,
              { backgroundColor: Color.blackTransModal },
            ]}
          >
            <View
              style={{
                backgroundColor: Color.transparent,
              }}
            >
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => toggleVisibleForModaloffer()}
                style={{
                  width: 25,
                  height: 25,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: Color.white,
                  borderRadius: 15,
                  position: "absolute",
                  right: 14,
                  top: -10,
                  zIndex: 1,
                  borderColor: "black",
                  borderWidth: 0.5,
                }}
              >
                <Image
                  source={require("../assets/img/close.png")}
                  style={{ height: 20, width: 20 }}
                />
                {/* <ICON name="close" size={18} color={Color.darkBlue} /> */}
              </TouchableOpacity>

              {modalOfferData.map((item, index) => {
                return (
                  <TouchableWithoutFeedback
                    onPress={() => {
                      navigation.navigate(Constant.navShareandEarn);
                      toggleVisibleForModaloffer();
                    }}
                  >
                    <FastImage
                      source={{ uri: item.image.url }}
                      resizeMode={FastImage.resizeMode.contain}
                      style={{
                        height: parseInt(item.height),
                        width: parseInt(item.width),
                        marginHorizontal: 23,
                        borderRadius: 5,
                      }}
                    />
                  </TouchableWithoutFeedback>
                );
              })}
            </View>
          </View>
        )}
        {isModalUpdateApp && (
          <View
            style={[
              styles.mainView,
              { backgroundColor: Color.blackTransModal },
            ]}
          >
            <View
              style={{
                backgroundColor: Color.transparent,
              }}
            >
              {/* <TouchableOpacity
             activeOpacity={0.6}
             onPress={() => toggleVisibleForModaloffer()}
             style={{
               width: 25,
               height: 25,
               alignItems: "center",
               justifyContent: "center",
               backgroundColor: Color.white,
               borderRadius: 15,
               position: "absolute",
               right: 14,
               top: -10,
               zIndex: 1,
               borderColor: "black",
               borderWidth: 0.5,
             }}
           >
             <ICON name="close" size={18} color={Color.darkBlue} />
           </TouchableOpacity> */}

              {updateApp && updateApp?.image !== null ? (
                <>
                  <FastImage
                    onLoadEnd={() => setButtonVisible(true)}
                    source={{ uri: updateApp?.image?.url }}
                    resizeMode={FastImage.resizeMode.contain}
                    style={{
                      height: imgHeight,
                      width: imgWidth,
                      marginHorizontal: 23,
                      borderRadius: 5,
                    }}
                  />
                  {buttonvisible && (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        alignSelf: "center",
                        position: "absolute",
                        bottom: 25,
                        width: imgWidth,
                        // backgroundColor: "pink",
                      }}
                    >
                      {updateApp?.isDismissible ? (
                        <TouchableOpacity
                          activeOpacity={0.6}
                          onPress={() => {
                            toggleVisibleModal();
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 16,
                              color: Color.white,
                              paddingHorizontal: 30,
                              textDecorationLine: "underline",
                              // textTransform: "uppercase",
                              fontFamily: "Nunito-Light",
                            }}
                          >
                            skip
                          </Text>
                        </TouchableOpacity>
                      ) : null}
                      <Button
                        style={{
                          backgroundColor: Color.darkBlue,
                        }}
                        normal={true}
                        onPress={() => {
                          Linking.openURL(
                            Platform.OS === "ios"
                              ? updateApp?.iosBundle
                              : updateApp?.androidPackage
                          );
                        }}
                      >
                        {Common.getTranslation(LangKey.labUpdate)}
                      </Button>
                    </View>
                  )}
                </>
              ) : (
                <ActivityIndicator size="large" color={Color.white} />
              )}
            </View>
          </View>
        )}
        {isVisiblePersonalInfo && (
          <View
            style={{
              height: 570,
              width: "85%",
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
            }}
          >
            <TouchableOpacity
              onPress={() => toggleVisibleModalForEditPersonalInfo()}
              style={[styles.btnClose, { marginRight: 5, marginTop: 5 }]}
            >
              <ICON name="close" size={22} color={Color.darkBlue} />
            </TouchableOpacity>
            <View
              style={{
                flex: 1,
              }}
            >
              <Text
                style={{
                  alignSelf: "center",
                  paddingBottom: 20,
                  color: Color.black,
                  fontSize: 16,
                  textDecorationLine: "underline",
                }}
              >
                Edit Personal
              </Text>
              <TxtInput
                placeholder={Common.getTranslation(LangKey.labUser)}
                placeholderTextColor={Color.txtIntxtcolor}
                returnKeyType="next"
                iconName="user"
                value={userName}
                maxLength={25}
                onChangeText={(text) => {
                  setUserName(text);
                  setErrorUserName("");
                }}
                autoCapitalize="none"
                // error={!!errorUserName}
                errorText={errorUserName}
                marked={
                  !nameValidatorPro(userName, Constant.titPersonalProfile) &&
                  "mark"
                }
              />

              <TxtInput
                placeholder={Common.getTranslation(LangKey.labMobile)}
                placeholderTextColor={Color.txtIntxtcolor}
                returnKeyType="next"
                iconName="phone"
                value={mobileNo}
                maxLength={10}
                keyboardType="phone-pad"
                onChangeText={(text) => {
                  setMobileNo(text), setErrorMobileNo("");
                }}
                autoCapitalize="none"
                error={!!errorMobileNo}
                errorText={errorMobileNo}
                marked={
                  !mobileValidatorPro(mobileNo, Constant.titPersonalProfile) &&
                  "mark"
                }
              />

              <TxtInput
                placeholder={Common.getTranslation(LangKey.labEmail)}
                placeholderTextColor={Color.txtIntxtcolor}
                returnKeyType="next"
                iconName="email"
                value={email}
                maxLength={26}
                onChangeText={(text) => {
                  setEmail(text), setErrorEmail("");
                }}
                autoCapitalize="none"
                error={!!errorEmail}
                errorText={errorEmail}
                marked={
                  !emailValidatorPro(email, Constant.titPersonalProfile) &&
                  "mark"
                }
              />

              <TxtInput
                placeholder={Common.getTranslation(LangKey.labDesignation)}
                placeholderTextColor={Color.txtIntxtcolor}
                returnKeyType="next"
                iconName="designation"
                value={designation}
                maxLength={18}
                onChangeText={(text) => {
                  setDesignation(text), setErrorDesignation("");
                }}
                autoCapitalize="none"
                error={!!errorDesignation}
                errorText={errorDesignation}
                marked={
                  !designationValidatorPro(
                    designation,
                    Constant.titPersonalProfile
                  ) && "mark"
                }
              />

              <TxtInput
                placeholder={Common.getTranslation(LangKey.labSocialMediaId)}
                placeholderTextColor={Color.txtIntxtcolor}
                returnKeyType="next"
                iconName="social_id"
                maxLength={20}
                value={socialMediaId}
                onChangeText={(text) => {
                  setSocialMediaId(text), setErrorSocailMediaId("");
                }}
                autoCapitalize="none"
                error={!!errorSocialMediaId}
                errorText={errorSocialMediaId}
                marked={
                  !SocailMediaValidatorPro(
                    socialMediaId,
                    Constant.titPersonalProfile
                  ) && "mark"
                }
              />

              <TxtInput
                placeholder={Common.getTranslation(LangKey.labWebsite)}
                placeholderTextColor={Color.txtIntxtcolor}
                returnKeyType="next"
                iconName="website"
                value={website}
                maxLength={26}
                onChangeText={(text) => {
                  setWebsite(text), setErrorWebsite("");
                }}
                autoCapitalize="none"
                error={!!errorWebsite}
                errorText={errorWebsite}
                marked={
                  !websiteValidatorPro(website, Constant.titPersonalProfile) &&
                  "mark"
                }
              />
              <View style={{ marginVertical: 5 }}>
                <Text style={{ marginLeft: 15, marginTop: 10 }}>
                  Social Icons
                </Text>
                <FlatList
                  style={styles.socialIconList}
                  data={Constant.socialIconList}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      activeOpacity={0.6}
                      style={{
                        height: 35,
                        width: 35,
                        margin: 3,
                        backgroundColor: Color.darkBlue,
                        borderRadius: 50,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onPress={async () => {
                        let addIcons = [];
                        if (socialIconList.indexOf(item) >= 0) {
                          addIcons = socialIconList.filter(
                            (val) => val !== item
                          );

                          setSocialIconList(
                            socialIconList.filter((val) => val !== item)
                          );
                        } else if (
                          socialIconList.length < Constant.socialIconLimit
                        ) {
                          addIcons.push(...socialIconList, item);

                          setSocialIconList([...socialIconList, item]);
                        } else {
                          Platform.OS == "android"
                            ? ToastAndroid.show(
                                Common.getTranslation(
                                  LangKey.msgSocialIconLimit
                                ),
                                ToastAndroid.LONG
                              )
                            : alert(
                                Common.getTranslation(
                                  LangKey.msgSocialIconLimit
                                )
                              );
                        }
                        designStore.updateSocialIconsPersonal(addIcons);
                        await AsyncStorage.setItem(
                          Constant.prfIcons,
                          JSON.stringify(addIcons)
                        );
                      }}
                    >
                      <View
                        style={{
                          height: 35,
                          width: 35,
                          backgroundColor:
                            socialIconList && socialIconList.indexOf(item) < 0
                              ? null
                              : Color.white,
                          opacity: 0.3,
                          position: "absolute",
                          borderRadius: 50,
                        }}
                      />

                      <Icon
                        name={item}
                        height={20}
                        width={20}
                        fill={Color.white}
                        key={index}
                      />
                    </TouchableOpacity>
                  )}
                />
              </View>
              <View
                style={{
                  marginTop: 20,
                }}
              >
                <Button
                  style={{ margin: 5 }}
                  normal={true}
                  onPress={() => onClickSavePersonal()}
                >
                  {perLoading ? (
                    <ActivityIndicator size={18} color={Color.white} />
                  ) : (
                    Common.getTranslation(LangKey.labSubmit)
                  )}
                </Button>
              </View>
            </View>
          </View>
        )}
        {isVisibleBusinessInfo && (
          <View
            style={{
              height: 570,
              width: "85%",
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
            }}
          >
            <TouchableOpacity
              onPress={() => toggleVisibleModalForEditBussinessInfo()}
              style={[styles.btnClose, { marginRight: 5, marginTop: 5 }]}
            >
              <ICON name="close" size={22} color={Color.darkBlue} />
            </TouchableOpacity>
            <View
              style={{
                flex: 1,
              }}
            >
              <Text
                style={{
                  alignSelf: "center",
                  paddingVertical: 20,
                  color: Color.black,
                  fontSize: 16,
                  textDecorationLine: "underline",
                }}
              >
                Edit Business
              </Text>
              <TxtInput
                placeholder={Common.getTranslation(LangKey.labUserName)}
                placeholderTextColor={Color.txtIntxtcolor}
                iconName="user"
                returnKeyType="next"
                value={userNameB}
                maxLength={35}
                onChangeText={(text) => {
                  setUserNameB(text), setErrorUserNameB("");
                }}
                autoCapitalize="none"
                error={!!errorUserNameB}
                errorText={errorUserNameB}
                marked={
                  !nameValidatorPro(userNameB, Constant.titBusinessProfile) &&
                  "mark"
                }
              />

              <TxtInput
                placeholder={Common.getTranslation(LangKey.labMobile)}
                placeholderTextColor={Color.txtIntxtcolor}
                returnKeyType="next"
                iconName="phone"
                value={mobileNoB}
                maxLength={10}
                keyboardType="phone-pad"
                onChangeText={(text) => {
                  setMobileNoB(text), setErrorMobileNoB("");
                }}
                autoCapitalize="none"
                error={!!errorMobileNoB}
                errorText={errorMobileNoB}
                marked={
                  !mobileValidatorPro(mobileNoB, Constant.titBusinessProfile) &&
                  "mark"
                }
              />

              <TxtInput
                placeholder={Common.getTranslation(LangKey.labEmail)}
                placeholderTextColor={Color.txtIntxtcolor}
                returnKeyType="next"
                iconName="email"
                maxLength={26}
                value={emailB}
                onChangeText={(text) => {
                  setEmailB(text), setErrorEmailB("");
                }}
                autoCapitalize="none"
                error={!!errorEmailB}
                errorText={errorEmailB}
                marked={
                  !emailValidatorPro(emailB, Constant.titBusinessProfile) &&
                  "mark"
                }
              />

              <TxtInput
                placeholder={Common.getTranslation(LangKey.labAddress)}
                placeholderTextColor={Color.txtIntxtcolor}
                returnKeyType="next"
                iconName="location"
                value={addressB}
                maxLength={41}
                onChangeText={(text) => {
                  setAddressB(text), setErrorAddressB("");
                }}
                autoCapitalize="none"
                error={!!errorAddressB}
                errorText={errorAddressB}
                marked={
                  !AddressValidatorPro(addressB, Constant.titBusinessProfile) &&
                  "mark"
                }
              />

              <TxtInput
                placeholder={Common.getTranslation(LangKey.labSocialMediaId)}
                placeholderTextColor={Color.txtIntxtcolor}
                returnKeyType="next"
                iconName="social_id"
                maxLength={20}
                value={socialMediaIdB}
                onChangeText={(text) => {
                  setSocialMediaIdB(text), setErrorSocailMediaIdB("");
                }}
                autoCapitalize="none"
                error={!!errorSocialMediaIdB}
                errorText={errorSocialMediaIdB}
                marked={
                  !SocailMediaValidatorPro(
                    socialMediaIdB,
                    Constant.titBusinessProfile
                  ) && "mark"
                }
              />

              <TxtInput
                placeholder={Common.getTranslation(LangKey.labWebsite)}
                placeholderTextColor={Color.txtIntxtcolor}
                returnKeyType="next"
                iconName="website"
                maxLength={26}
                value={websiteB}
                onChangeText={(text) => {
                  setWebsiteB(text), setErrorWebsiteB("");
                }}
                autoCapitalize="none"
                error={!!errorWebsiteB}
                errorText={errorWebsiteB}
                marked={
                  !websiteValidatorPro(websiteB, Constant.titBusinessProfile) &&
                  "mark"
                }
              />
              <View style={{ marginVertical: 5 }}>
                <Text style={{ marginLeft: 15 }}>Social Icons</Text>
                <FlatList
                  style={styles.socialIconList}
                  data={Constant.socialIconList}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      activeOpacity={0.6}
                      style={{
                        height: 35,
                        width: 35,
                        margin: 3,
                        backgroundColor: Color.darkBlue,
                        borderRadius: 50,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onPress={async () => {
                        let addIcons = [];
                        if (socialIconListB.indexOf(item) >= 0) {
                          addIcons = socialIconListB.filter(
                            (val) => val !== item
                          );

                          setSocialIconListB(
                            socialIconListB.filter((val) => val !== item)
                          );
                        } else if (
                          socialIconListB.length < Constant.socialIconLimit
                        ) {
                          addIcons.push(...socialIconListB, item);

                          setSocialIconListB([...socialIconListB, item]);
                        } else {
                          Platform.OS == "android"
                            ? ToastAndroid.show(
                                Common.getTranslation(
                                  LangKey.msgSocialIconLimit
                                ),
                                ToastAndroid.LONG
                              )
                            : alert(
                                Common.getTranslation(
                                  LangKey.msgSocialIconLimit
                                )
                              );
                        }
                        designStore.updateSocialIconsBusiness(addIcons);

                        await AsyncStorage.setItem(
                          Constant.prfIconsB,
                          JSON.stringify(addIcons)
                        );
                      }}
                    >
                      <View
                        style={{
                          height: 35,
                          width: 35,
                          backgroundColor:
                            socialIconListB && socialIconListB.indexOf(item) < 0
                              ? null
                              : Color.white,
                          opacity: 0.3,
                          position: "absolute",
                          borderRadius: 50,
                        }}
                      />

                      <Icon
                        name={item}
                        height={20}
                        width={20}
                        fill={Color.white}
                        key={index}
                      />
                    </TouchableOpacity>
                  )}
                />
              </View>
              <View
                style={{
                  marginTop: 20,
                }}
              >
                <Button
                  style={{ margin: 5 }}
                  normal={true}
                  onPress={() => onClickSaveBusiness()}
                >
                  {busLoading ? (
                    <ActivityIndicator size={18} color={Color.white} />
                  ) : (
                    Common.getTranslation(LangKey.labSubmit)
                  )}
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
export default inject("userStore", "designStore")(observer(PopUp));

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mainView: {
    flex: 1,
    width: "100%",
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
  containerTil: { width: "100%" },
  socialIconList: {
    marginTop: 10,
    marginHorizontal: 5,
  },
});
