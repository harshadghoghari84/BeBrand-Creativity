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
import {
  emailValidator,
  emptyValidator,
  mobileValidator,
  nameValidator,
} from "../../utils/Validator";

const generateRNFile = (uri, name) => {
  return uri
    ? new ReactNativeFile({
        uri,
        type: mime.lookup(uri) || "image",
        name,
      })
    : null;
};

const PersonalProfile = ({ navigation, userStore }) => {
  const user = toJS(userStore.user);
  const personalImageLimit = userStore.personalImageLimit;

  const [defaultImageUrl, setDefaultImageUrl] = useState(null);

  useEffect(() => {
    user?.userInfo?.personal?.image && user.userInfo.personal.image.length > 0
      ? setDefaultImageUrl(
          user.userInfo.personal.image.find((item) => item.isDefault === true)
            .url
        )
      : setDefaultImageUrl(null);
  }, [toJS(userStore.user)]);

  const [errorUserName, setErrorUserName] = useState("");
  const [errorMobile, setErrorMobile] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorDesignation, setErrorDesignation] = useState("");
  const [errorSocialMediaId, setErrorSocailMediaId] = useState("");
  const [errorWebsite, setErrorWebsite] = useState("");

  const [userName, setUserName] = useState(
    user?.userInfo?.personal?.name ? user.userInfo.personal.name : ""
  );
  const [mobile, setMobile] = useState(
    user?.userInfo?.personal?.mobile
      ? user.userInfo.personal.mobile
      : user?.mobile
      ? user.mobile
      : ""
  );
  const [email, setEmail] = useState(
    user?.userInfo?.personal?.email ? user.userInfo.personal.email : ""
  );
  const [designation, setDesignation] = useState(
    user?.userInfo?.personal?.designation
      ? user.userInfo.personal.designation
      : ""
  );
  const [website, setWebsite] = useState(
    user?.userInfo?.personal?.website ? user.userInfo.personal.website : ""
  );
  const [socialMediaId, setSocialMediaId] = useState(
    user?.userInfo?.personal?.socialMediaId
      ? user.userInfo.personal.socialMediaId
      : ""
  );

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

  const getImagePickerView = () => {
    return (
      <View style={styles.toProfileImage}>
        <TouchableOpacity
          onPress={() => onClickImageSelect()}
          style={styles.plusBtn}
        >
          <Icon name="plus" fill={Color.white} height={25} width={25} />
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

        if (!errors) {
          userStore.addPersonalImage(data.addPersonalImage);
        } else {
          Common.showMessage(errors[0].message);
        }
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const onClickSave = () => {
    //  validation
    console.log("userName.length", userName.length);
    if (!userName || userName.length <= 0 || userName.length > 25) {
      setErrorUserName(Common.getTranslation(LangKey.personalUserNameErr));
      return;
    }

    setErrorUserName("");
    const reMobile = /^[0]?[6789]\d{9}$/;
    if (
      !mobile ||
      !reMobile.test(mobile) ||
      mobile.length <= 0 ||
      mobile.length > 10
    ) {
      setErrorMobile(Common.getTranslation(LangKey.personalMobileErr));
      return;
    }

    setErrorMobile("");
    const re = /\S+@\S+\.\S+/;
    if (!email || !re.test(email) || email.length <= 0 || email.length > 26) {
      setErrorEmail(Common.getTranslation(LangKey.personalEmailErr));
      return;
    }

    setErrorEmail("");

    if (!designation || designation.length <= 0 || designation.length > 18) {
      setErrorDesignation(
        Common.getTranslation(LangKey.personalDesignationErr)
      );
      return;
    }

    setErrorDesignation("");

    if (
      !socialMediaId ||
      socialMediaId.length <= 0 ||
      socialMediaId.length > 20
    ) {
      setErrorSocailMediaId(
        Common.getTranslation(LangKey.personalSocialMediaIdErr)
      );
      return;
    }

    setErrorSocailMediaId("");

    if (!website || website.length <= 0 || website.length > 26) {
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
    console.log("curUrl", curUrl);
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
          console.log("data", data.deletePersonalImage);
          let imgArr = [];
          imgArr = user?.userInfo?.personal?.image.filter(
            (val) => val.url !== curUrl
          );

          console.log("imgArr", imgArr);

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

  console.log("loadingDeleteImage", loadingDeleteImage);

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
            onChangeText={(text) => setUserName(text)}
            autoCapitalize="none"
            error={!!errorUserName}
            errorText={errorUserName}
          />

          <TextInput
            placeholder={Common.getTranslation(LangKey.labMobile)}
            placeholderTextColor={Color.txtIntxtcolor}
            returnKeyType="next"
            iconName="phone"
            value={mobile}
            keyboardType="phone-pad"
            onChangeText={(text) => setMobile(text)}
            autoCapitalize="none"
            error={!!errorMobile}
            errorText={errorMobile}
          />

          <TextInput
            placeholder={Common.getTranslation(LangKey.labEmail)}
            placeholderTextColor={Color.txtIntxtcolor}
            returnKeyType="next"
            iconName="email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            autoCapitalize="none"
            error={!!errorEmail}
            errorText={errorEmail}
          />

          <TextInput
            placeholder={Common.getTranslation(LangKey.labDesignation)}
            placeholderTextColor={Color.txtIntxtcolor}
            returnKeyType="next"
            iconName="designation"
            value={designation}
            onChangeText={(text) => setDesignation(text)}
            autoCapitalize="none"
            error={!!errorDesignation}
            errorText={errorDesignation}
          />

          <TextInput
            placeholder={Common.getTranslation(LangKey.labSocialMediaId)}
            placeholderTextColor={Color.txtIntxtcolor}
            returnKeyType="next"
            iconName="social_id"
            value={socialMediaId}
            onChangeText={(text) => setSocialMediaId(text)}
            autoCapitalize="none"
            error={!!errorSocialMediaId}
            errorText={errorSocialMediaId}
          />

          <TextInput
            placeholder={Common.getTranslation(LangKey.labWebsite)}
            placeholderTextColor={Color.txtIntxtcolor}
            returnKeyType="next"
            iconName="website"
            value={website}
            onChangeText={(text) => setWebsite(text)}
            autoCapitalize="none"
            error={!!errorWebsite}
            errorText={errorWebsite}
          />
        </View>
        <View style={styles.containerProfile}>
          <FlatList
            horizontal
            ListHeaderComponent={
              personalImageLimit > 0 &&
              (Array.isArray(user?.userInfo?.personal?.image)
                ? user.userInfo.personal.image.length < personalImageLimit &&
                  getImagePickerView()
                : getImagePickerView())
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
                      source={{ uri: item.url, width: 100, height: 100 }}
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
                          opacity: 0.3,
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
    alignItems: "center",
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
    flex: 1,
  },
  toProfileImage: {
    width: 80,
    height: 95,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
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
});
