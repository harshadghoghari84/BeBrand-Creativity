import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  Text,
  Platform,
  ToastAndroid,
} from "react-native";
import { inject, observer } from "mobx-react";
import { useMutation } from "@apollo/client";
import { toJS } from "mobx";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { ReactNativeFile } from "apollo-upload-client";
import * as mime from "react-native-mime-types";
import FastImage from "react-native-fast-image";
import ICON from "react-native-vector-icons/MaterialCommunityIcons";
import { FileSystem } from "react-native-unimodules";

// relative path
import Icon from "../../components/svgIcons";
import Color from "../../utils/Color";
import Common from "../../utils/Common";
import LangKey from "../../utils/LangKey";
import TextInput from "../../components/TextInput";
import Button from "../../components/Button";
import GraphqlQuery from "../../utils/GraphqlQuery";
import ProgressDialog from "../common/ProgressDialog";
import PopUp from "../../components/PopUp";
import {
  nameValidatorPro,
  mobileValidatorPro,
  emailValidatorPro,
  designationValidatorPro,
  SocailMediaValidatorPro,
  websiteValidatorPro,
} from "../../utils/Validator";
import Constant from "../../utils/Constant";
import AsyncStorage from "@react-native-async-storage/async-storage";

const generateRNFile = (uri, name) => {
  return uri
    ? new ReactNativeFile({
        uri,
        type: mime.lookup(uri) || "image",
        name,
      })
    : null;
};

let isUpdated = false;

const PersonalProfile = ({ navigation, userStore }) => {
  const personalImageLimit = userStore.personalImageLimit;

  const [user, setUser] = useState();
  const [userName, setUserName] = useState();
  const [mobile, setMobile] = useState();
  const [email, setEmail] = useState();
  const [designation, setDesignation] = useState();
  const [website, setWebsite] = useState();
  const [socialMediaId, setSocialMediaId] = useState();
  const [defaultImageUrl, setDefaultImageUrl] = useState(null);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [modalVisible, setmodalVisible] = useState(false);

  const [errorUserName, setErrorUserName] = useState("");
  const [errorMobile, setErrorMobile] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorDesignation, setErrorDesignation] = useState("");
  const [errorSocialMediaId, setErrorSocailMediaId] = useState("");
  const [errorWebsite, setErrorWebsite] = useState("");

  const [socialIconList, setSocialIconList] = useState(
    Constant.defSocialIconList
  );

  useEffect(() => {
    AsyncStorage.getItem(Constant.prfIcons)
      .then((res) => {
        if (res && res !== null) {
          setSocialIconList(JSON.parse(res));
        }
      })
      .catch((err) => console.log("async err", err));
  }, []);

  useEffect(() => {
    isUpdated = true;
  }, []);

  useEffect(() => {
    const user = toJS(userStore.user);

    if (!user || user == null) {
      Common.showMessage(Common.getTranslation(LangKey.msgCreateAcc));
      navigation.goBack();
    }

    setUser(user);
    if (user?.userInfo?.personal) {
      if (isUpdated && isUpdated === true) {
        setUserName(
          user?.userInfo?.personal?.name ? user.userInfo.personal.name : ""
        );
        setMobile(
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
    isUpdated = false;

    user?.userInfo?.personal?.image && user.userInfo.personal.image.length > 0
      ? setDefaultImageUrl(
          user.userInfo.personal.image.find((item) => item.isDefault === true)
            .url
        )
      : setDefaultImageUrl(null);

    if (
      user?.designPackage &&
      user.designPackage !== null &&
      user.designPackage.length > 0
    ) {
      setIsFirstTime(false);
    } else {
      setIsFirstTime(true);
    }
  }, [userStore.user]);

  const [updatePersonalUserInfo, { loading }] = useMutation(
    GraphqlQuery.updatePersonalUserInfo,
    {
      errorPolicy: "all",
    }
  );

  const [addPersonalImage, { loading: loadingUserImage }] = useMutation(
    GraphqlQuery.addPersonalImage,
    {
      errorPolicy: "all",
    }
  );

  const [deletePersonalImage, { loading: loadingDeleteImage }] = useMutation(
    GraphqlQuery.deletePersonalImage,
    {
      errorPolicy: "all",
    }
  );

  const toggleVisible = () => {
    setmodalVisible(!modalVisible);
  };

  const getImagePickerView = () => {
    return (
      <View style={styles.addImage}>
        <TouchableOpacity
          onPress={() => {
            onClickImageSelect();
          }}
          // style={styles.plusBtn}
        >
          <Icon name="addImg" fill={Color.white} height={35} width={35} />
        </TouchableOpacity>
      </View>
    );
  };

  const onClickImageSelect = async () => {
    const { status } = await Permissions.getAsync(Permissions.MEDIA_LIBRARY);
    if (status !== Permissions.PermissionStatus.GRANTED) {
      const { status: newStatus } = await Permissions.askAsync(
        Permissions.MEDIA_LIBRARY
      );
      if (newStatus !== Permissions.PermissionStatus.GRANTED) {
        Common.showMessage(
          Common.getTranslation(LangKey.msgCameraRollPermission)
        );
      } else {
        await pickImage();
      }
    } else {
      await pickImage();
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [3, 4],
      quality: 1,
    });

    try {
      if (!result.cancelled) {
        const file = generateRNFile(result.uri, `${Date.now()}`);

        const { data, errors } = await addPersonalImage({
          variables: { image: file },
        });
        console.log("data", data);
        if (!errors) {
          userStore.addPersonalImage(data.addPersonalImageV2);
        } else {
          console.log("error", errors);
          Common.showMessage(errors[0].message);
        }
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const onClickSave = () => {
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

  const onCloseBTN = (curUrl) => {
    deletePersonalImage({
      variables: {
        image: curUrl,
      },
    })
      .then(({ data, errors }) => {
        if (errors && errors !== null) {
          Common.showMessage(errors[0].message);
        }

        if (data && data !== null) {
          let imgArr = [];
          imgArr = user?.userInfo?.personal?.image.filter(
            (val) => val.url !== curUrl
          );

          imgArr.forEach((val) => {
            if (val.isDefault === true) {
              imgArr[val];
            } else {
              imgArr[0].isDefault = true;
            }
          });

          const newUser = {
            ...user,
            userInfo: {
              ...user?.userInfo,
              personal: {
                ...user?.userInfo.personal,
                image: imgArr,
              },
            },
          };
          userStore.setOnlyUserDetail(newUser);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // key extractors
  const keyExtractor = useCallback((item, index) => index.toString(), []);

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.sv}>
      <View style={styles.container}>
        <ProgressDialog
          visible={loadingUserImage}
          dismissable={false}
          message={Common.getTranslation(LangKey.labUploadingImage)}
        />
        <ProgressDialog
          visible={loading}
          dismissable={false}
          message={Common.getTranslation(LangKey.labsSaving)}
        />
        <ProgressDialog
          visible={loadingDeleteImage}
          dismissable={true}
          message={Common.getTranslation(LangKey.labLoading)}
        />
        <PopUp
          visible={modalVisible}
          toggleVisible={toggleVisible}
          isPurchased={true}
          isGoback={true}
        />
        {/* {personalImageLimit > 0 && (
          <TouchableOpacity style={styles.toUserImage}>
            <View>
              {defaultImageUrl &&
                defaultImageUrl !== null &&
                defaultImageUrl !== "" && (
                  <FastImage
                    style={{ width: 100, height: 100 }}
                    source={{ uri: defaultImageUrl }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                )}
            </View>
          </TouchableOpacity>
        )} */}

        <View style={styles.containerTil}>
          <TextInput
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
              !nameValidatorPro(userName, Constant.titPersonalProfile) && "mark"
            }
          />

          <TextInput
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
            error={!!errorMobile}
            errorText={errorMobile}
            marked={
              !mobileValidatorPro(mobile, Constant.titPersonalProfile) && "mark"
            }
          />

          <TextInput
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
              !emailValidatorPro(email, Constant.titPersonalProfile) && "mark"
            }
          />

          <TextInput
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

          <TextInput
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

          <TextInput
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
        </View>
        <View style={{ marginVertical: 10 }}>
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
                  if (socialIconList.indexOf(item) >= 0) {
                    addIcons = socialIconList.filter((val) => val !== item);

                    setSocialIconList(
                      socialIconList.filter((val) => val !== item)
                    );
                  } else if (socialIconList.length < Constant.socialIconLimit) {
                    addIcons.push(...socialIconList, item);

                    setSocialIconList([...socialIconList, item]);
                  } else {
                    Platform.OS == "android"
                      ? ToastAndroid.show(
                          Common.getTranslation(LangKey.msgSocialIconLimit),
                          ToastAndroid.LONG
                        )
                      : alert(
                          Common.getTranslation(LangKey.msgSocialIconLimit)
                        );
                  }
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
        <View style={styles.containerProfile}>
          <FlatList
            horizontal
            contentContainerStyle={{ padding: 5, marginTop: 5 }}
            ListHeaderComponent={
              isFirstTime &&
              user?.userInfo?.personal?.image &&
              user.userInfo.personal.image.length <=
                Constant.freeUserProfileImageLimit
                ? getImagePickerView()
                : personalImageLimit > 0 &&
                  Array.isArray(user?.userInfo?.personal?.image) &&
                  user.userInfo.personal.image.length < personalImageLimit &&
                  getImagePickerView()
            }
            showsHorizontalScrollIndicator={false}
            data={
              Array.isArray(user?.userInfo?.personal?.image)
                ? user.userInfo.personal.image
                : []
            }
            keyExtractor={keyExtractor}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  style={styles.toProfileImage}
                  onPress={() => {
                    setDefaultImageUrl(item.url);
                  }}
                >
                  {item.url && item.url !== "" && (
                    <FastImage
                      source={{ uri: item.url }}
                      style={styles.toProfileImage}
                    />
                  )}

                  {defaultImageUrl === item.url && (
                    <View
                      style={{
                        position: "absolute",
                        zIndex: 1,
                        bottom: 5,
                        backgroundColor: Color.blackTransTagFree,
                        width: "90%",
                        alignItems: "center",
                        paddingVertical: 2,
                        borderRadius: 5,
                      }}
                    >
                      <Icon
                        name="mark"
                        height={18}
                        width={18}
                        fill={Color.primary}
                      />
                    </View>
                  )}
                  <TouchableOpacity
                    onPress={() => onCloseBTN(item.url)}
                    activeOpacity={0.6}
                    style={styles.closeBtn}
                  >
                    <ICON name="close" size={18} color={Color.darkBlue} />
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            }}
          />

          <View style={styles.addimageContainer}>
            <Text style={styles.txtUploadImage}>
              {Common.getTranslation(LangKey.txtUploadPhotoHere)}
            </Text>
          </View>
          <View style={styles.UploadPng}>
            <Text style={styles.txtUploadImage1}>
              {Common.getTranslation(LangKey.txtUploadPNG)}
            </Text>
            <Text style={styles.txtUploadImage1}>
              {Common.getTranslation(LangKey.txtPhotoSize)}
            </Text>
          </View>
        </View>
        <Button
          loading={loading}
          normal={true}
          disabled={loading}
          style={styles.btnSave}
          onPress={onClickSave}
        >
          {Common.getTranslation(LangKey.txtSave)}
        </Button>
      </View>
    </ScrollView>
  );
};
export default inject("userStore")(observer(PersonalProfile));

const styles = StyleSheet.create({
  sv: {
    backgroundColor: Color.white,
  },
  container: {
    flex: 1,
    // alignItems: "center",
  },
  toUserImage: {
    width: 100,
    height: 100,
    borderRadius: 100,
    overflow: "hidden",
    marginVertical: 15,
    backgroundColor: Color.lightGrey,
  },
  containerTil: { width: "100%" },
  tiCommon: {
    color: Color.darkBlue,
  },
  containerProfile: {
    marginTop: 20,
    flex: 1,
    marginHorizontal: 20,
    borderColor: Color.blackTransBorder,
    borderRadius: 5,
    borderWidth: 1,
  },
  toProfileImage: {
    width: 80,
    height: 95,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  addImage: {
    width: 100,
    height: 90,
    borderRightColor: Color.blackTransBorder,
    borderRightWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  btnSave: {
    width: "30%",
    marginTop: 10,
  },
  icnCheck: {
    position: "absolute",
    top: 2,
    right: 3,
  },
  socialBTNView: {
    height: 40,
    borderRadius: 50,
    marginHorizontal: 10,
    backgroundColor: Color.txtInBgColor,
    flexDirection: "row",
    alignItems: "center",
    margin: 7,
  },
  filedsIcon: {
    marginHorizontal: 5,
    marginRight: 10,
    backgroundColor: Color.txtIntxtcolor,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  plusBtn: {
    padding: 10,
    backgroundColor: Color.txtIntxtcolor,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeBtn: {
    position: "absolute",
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    top: 0,
    right: 0,
    margin: 3,
    borderRadius: 20,
    backgroundColor: Color.white,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addimageContainer: { alignSelf: "center", position: "absolute", top: -10 },
  txtUploadImage: {
    paddingHorizontal: 20,
    backgroundColor: Color.white,
    color: Color.txtIntxtcolor,
    fontSize: 12,
  },
  txtUploadImage1: {
    fontSize: 12,
    color: Color.txtIntxtcolor,
  },
  UploadPng: { alignSelf: "center", paddingVertical: 5, alignItems: "center" },
  socialIconList: {
    marginTop: 10,
    marginHorizontal: 10,
  },
});
