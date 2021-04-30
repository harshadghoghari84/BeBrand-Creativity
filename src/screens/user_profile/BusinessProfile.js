import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  Text,
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

// relative path
import Icon from "../../components/svgIcons";
import Color from "../../utils/Color";
import Common from "../../utils/Common";
import LangKey from "../../utils/LangKey";
import TextInput from "../../components/TextInput";
import Button from "../../components/Button";
import GraphqlQuery from "../../utils/GraphqlQuery";
import ProgressDialog from "../common/ProgressDialog";
import { AddressValidatorPro, emptyValidator } from "../../utils/Validator";
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
import { FileSystem } from "react-native-unimodules";

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

const BusinessProfile = ({ userStore }) => {
  const businessImageLimit = userStore.businessImageLimit;

  const [user, setUser] = useState();
  const [userName, setUserName] = useState();
  const [mobile, setMobile] = useState();
  const [email, setEmail] = useState();
  const [address, setAddress] = useState();
  const [website, setWebsite] = useState();
  const [socialMediaId, setSocialMediaId] = useState();
  const [defaultImageUrl, setDefaultImageUrl] = useState(null);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const [errorUserName, setErrorUserName] = useState("");
  const [errorMobile, setErrorMobile] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorAddress, setErrorAddress] = useState("");
  const [errorSocialMediaId, setErrorSocailMediaId] = useState("");
  const [errorWebsite, setErrorWebsite] = useState("");

  useEffect(() => {
    isUpdated = true;
  }, []);

  useEffect(() => {
    const user = toJS(userStore.user);
    if (!user || user == null) {
      navigation.goBack();
    }
    setUser(user);
    if (user?.userInfo?.business) {
      if (isUpdated && isUpdated === true) {
        setUserName(
          user?.userInfo?.business?.name ? user.userInfo.business.name : ""
        );
        setMobile(
          user?.userInfo?.business?.mobile
            ? user.userInfo.business.mobile
            : user?.mobile
            ? user.mobile
            : ""
        );
        setEmail(
          user?.userInfo?.business?.email ? user.userInfo.business.email : ""
        );
        setAddress(
          user?.userInfo?.business?.address
            ? user.userInfo.business.address
            : ""
        );
        setWebsite(
          user?.userInfo?.business?.website
            ? user.userInfo.business.website
            : ""
        );
        setSocialMediaId(
          user?.userInfo?.business?.socialMediaId
            ? user.userInfo.business.socialMediaId
            : ""
        );
      }
    }

    isUpdated = false;

    user?.userInfo?.business?.image && user.userInfo.business.image.length > 0
      ? setDefaultImageUrl(
          user.userInfo.business.image.find((item) => item.isDefault === true)
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

  const [updateBusinessUserInfo, { loading }] = useMutation(
    GraphqlQuery.updateBusinessUserInfo,
    {
      errorPolicy: "all",
    }
  );

  const [addBusinessImage, { loading: loadingUserImage }] = useMutation(
    GraphqlQuery.addBusinessImage,
    {
      errorPolicy: "all",
    }
  );

  const [deleteBusinessImage, { loading: loadingDeleteImage }] = useMutation(
    GraphqlQuery.deleteBusinessImage,
    {
      errorPolicy: "all",
    }
  );

  const toggleVisible = () => {
    setModalVisible(!modalVisible);
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

    let fileInfo = await FileSystem.getInfoAsync(result.uri);
    if (fileInfo.size > Constant.profileImageSize) {
      Common.showMessage(Common.getTranslation(LangKey.labProfileImageSize));
    } else {
      try {
        if (!result.cancelled) {
          const file = generateRNFile(result.uri, `${Date.now()}`);
          const { data, errors } = await addBusinessImage({
            variables: { image: file },
          });

          if (!errors) {
            userStore.addBusinessImage(data.addBusinessImageV2);
          } else {
            console.log("error", errors);
            Common.showMessage(errors[0].message);
          }
        }
      } catch (error) {
        console.log("error", error);
      }
    }
  };

  const onClickSave = () => {
    //  validation

    let type = Constant.titBusinessProfile;

    const errUserName = nameValidatorPro(userName, type);
    if (errUserName) {
      setErrorUserName(errUserName);
      return;
    }
    setErrorUserName("");
    const re = /^[0]?[6789]\d{9}$/;
    if (!mobile || mobile == null || mobile == "") {
    } else if (mobile.length > 10 || !re.test(mobile)) {
      setErrorMobile(Common.getTranslation(LangKey.bussinessMobileErr));
      return;
    }
    setErrorMobile("");
    const emailre = /\S+@\S+\.\S+/;

    if (!email || email == null || email == "") {
    } else if (!emailre.test(email) || email.length > 26) {
      setErrorEmail(Common.getTranslation(LangKey.bussinessEmailErr));
      return;
    }
    setErrorEmail("");
    if (!address || address == null || address == "") {
    } else if (address.length > 41) {
      setErrorAddress(Common.getTranslation(LangKey.bussinessAddressErr));
      return;
    }
    setErrorAddress("");
    if (!socialMediaId || socialMediaId == null || socialMediaId == "") {
    } else if (socialMediaId.length > 20) {
      setErrorSocailMediaId(
        Common.getTranslation(LangKey.bussinessSocialMediaIdErr)
      );
      return;
    }
    setErrorSocailMediaId("");
    if (!website || website == null || website == "") {
    } else if (website.length > 26) {
      setErrorWebsite(Common.getTranslation(LangKey.bussinessWebsiteErr));
      return;
    }
    setErrorWebsite("");

    try {
      updateBusinessUserInfo({
        variables: {
          name: userName,
          mobile: mobile,
          email: email,
          address: address,
          website: website,
          socialMediaId: socialMediaId,
          defaultImageUrl: defaultImageUrl,
        },
      })
        .then(({ data, errors }) => {
          if (data) {
            let newImage = [];
            if (defaultImageUrl && defaultImageUrl !== "") {
              newImage = user?.userInfo?.business?.image.map((item) => {
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
                business: {
                  name: userName,
                  mobile: mobile,
                  email: email,
                  address: address,
                  website: website,
                  socialMediaId: socialMediaId,
                  image: newImage,
                },
              },
            };

            userStore.setOnlyUserDetail(newUser);
            Common.showMessage(data.updateBusinessUserInfo);
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
    deleteBusinessImage({
      variables: {
        image: curUrl,
      },
    })
      .then(({ data, errors }) => {
        if (errors && errors !== null) {
          Common.showMessage(errors[0].message);
        } else {
          let imgArr = [];
          imgArr = user?.userInfo?.business?.image.filter(
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
              business: {
                ...user?.userInfo.business,
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
          dismissable={false}
          message={Common.getTranslation(LangKey.labLoading)}
        />
        <PopUp
          visible={modalVisible}
          toggleVisible={toggleVisible}
          isPurchased={true}
        />
        {/* {businessImageLimit > 0 && (
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
            placeholder={Common.getTranslation(LangKey.labUserName)}
            placeholderTextColor={Color.txtIntxtcolor}
            iconName="user"
            returnKeyType="next"
            value={userName}
            maxLength={35}
            onChangeText={(text) => {
              setUserName(text), setErrorUserName("");
            }}
            autoCapitalize="none"
            error={!!errorUserName}
            errorText={errorUserName}
            marked={
              !nameValidatorPro(userName, Constant.titBusinessProfile) && "mark"
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
              !mobileValidatorPro(mobile, Constant.titBusinessProfile) && "mark"
            }
          />

          <TextInput
            placeholder={Common.getTranslation(LangKey.labEmail)}
            placeholderTextColor={Color.txtIntxtcolor}
            returnKeyType="next"
            iconName="email"
            maxLength={26}
            value={email}
            onChangeText={(text) => {
              setEmail(text), setErrorEmail("");
            }}
            autoCapitalize="none"
            error={!!errorEmail}
            errorText={errorEmail}
            marked={
              !emailValidatorPro(email, Constant.titBusinessProfile) && "mark"
            }
          />

          <TextInput
            placeholder={Common.getTranslation(LangKey.labAddress)}
            placeholderTextColor={Color.txtIntxtcolor}
            returnKeyType="next"
            iconName="location"
            value={address}
            maxLength={41}
            onChangeText={(text) => {
              setAddress(text), setErrorAddress("");
            }}
            autoCapitalize="none"
            error={!!errorAddress}
            errorText={errorAddress}
            marked={
              !AddressValidatorPro(address, Constant.titBusinessProfile) &&
              "mark"
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
                Constant.titBusinessProfile
              ) && "mark"
            }
          />

          <TextInput
            placeholder={Common.getTranslation(LangKey.labWebsite)}
            placeholderTextColor={Color.txtIntxtcolor}
            returnKeyType="next"
            iconName="website"
            maxLength={26}
            value={website}
            onChangeText={(text) => {
              setWebsite(text), setErrorWebsite("");
            }}
            autoCapitalize="none"
            error={!!errorWebsite}
            errorText={errorWebsite}
            marked={
              !websiteValidatorPro(website, Constant.titBusinessProfile) &&
              "mark"
            }
          />
        </View>

        <View style={styles.containerProfile}>
          <FlatList
            horizontal
            contentContainerStyle={{ padding: 5, marginTop: 5 }}
            ListHeaderComponent={
              isFirstTime &&
              user?.userInfo?.business?.image &&
              user.userInfo.business.image.length <=
                Constant.freeUserProfileImageLimit
                ? getImagePickerView()
                : businessImageLimit > 0 &&
                  Array.isArray(user?.userInfo?.business?.image) &&
                  user.userInfo.business.image.length < businessImageLimit &&
                  getImagePickerView()
            }
            showsHorizontalScrollIndicator={false}
            data={
              Array.isArray(user?.userInfo?.business?.image)
                ? user.userInfo.business.image
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
                      style={[
                        styles.toProfileImage,
                        {
                          backgroundColor: Color.blackTransparant,
                          position: "absolute",
                          opacity: 0.5,
                        },
                      ]}
                    />
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
              {Common.getTranslation(LangKey.txtUploadLogoHere)}
            </Text>
          </View>
          <View style={styles.UploadPng}>
            <Text style={styles.txtUploadImage1}>
              {Common.getTranslation(LangKey.txtUploadPNG)}
            </Text>
          </View>
        </View>
        <Button
          loading={loading}
          disabled={loading}
          normal={true}
          style={styles.btnSave}
          onPress={onClickSave}
        >
          {Common.getTranslation(LangKey.txtSave)}
        </Button>
      </View>
    </ScrollView>
  );
};
export default inject("userStore")(observer(BusinessProfile));

const styles = StyleSheet.create({
  sv: {
    backgroundColor: Color.white,
  },
  container: {
    flex: 1,
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
    borderColor: Color.blackTransTagFree,
    borderWidth: 2,
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
    borderRightColor: Color.blackTransTagFree,
    borderRightWidth: 2,
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
    borderRadius: 50,
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
  addimageContainer: { alignSelf: "center", position: "absolute", top: -10 },
  txtUploadImage: {
    paddingHorizontal: 20,
    backgroundColor: Color.white,
  },
  txtUploadImage1: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    backgroundColor: Color.white,
  },
  UploadPng: { alignSelf: "center" },
});
