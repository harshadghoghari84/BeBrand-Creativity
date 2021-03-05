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
import { emptyValidator } from "../../utils/Validator";

const generateRNFile = (uri, name) => {
  return uri
    ? new ReactNativeFile({
        uri,
        type: mime.lookup(uri) || "image",
        name,
      })
    : null;
};

const BusinessProfile = ({ userStore }) => {
  const user = toJS(userStore.user);
  const businessImageLimit = userStore.businessImageLimit;

  const [defaultImageUrl, setDefaultImageUrl] = useState(null);

  useEffect(() => {
    console.log("object", user?.userInfo?.business?.image);
    user?.userInfo?.business?.image && user.userInfo.business.image.length > 0
      ? setDefaultImageUrl(
          user.userInfo.business.image.find((item) => item.isDefault === true)
            .url
        )
      : setDefaultImageUrl(null);
  }, [user?.userInfo?.business?.image]);

  const [errorUserName, setErrorUserName] = useState("");
  const [errorMobile, setErrorMobile] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorAddress, setErrorAddress] = useState("");
  const [errorSocialMediaId, setErrorSocailMediaId] = useState("");
  const [errorWebsite, setErrorWebsite] = useState("");

  const [userName, setUserName] = useState(
    user?.userInfo?.business?.name ? user.userInfo.business.name : ""
  );
  const [mobile, setMobile] = useState(
    user?.userInfo?.business?.mobile
      ? user.userInfo.business.mobile
      : user?.mobile
      ? user.mobile
      : ""
  );
  const [email, setEmail] = useState(
    user?.userInfo?.business?.email ? user.userInfo.business.email : ""
  );
  const [address, setAddress] = useState(
    user?.userInfo?.business?.address ? user.userInfo.business.address : ""
  );
  const [website, setWebsite] = useState(
    user?.userInfo?.business?.website ? user.userInfo.business.website : ""
  );
  const [socialMediaId, setSocialMediaId] = useState(
    user?.userInfo?.business?.socialMediaId
      ? user.userInfo.business.socialMediaId
      : ""
  );

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

  const getImagePickerView = () => {
    return (
      <View style={styles.toProfileImage}>
        <TouchableOpacity
          style={styles.toProfileImage}
          onPress={onClickImageSelect}
          style={{
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
          }}
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

    if (!result.cancelled) {
      const file = generateRNFile(result.uri, `${Date.now()}`);
      const { data, errors } = await addBusinessImage({
        variables: { image: file },
      });

      if (!errors) {
        userStore.addBusinessImage(data.addBusinessImage);
      } else {
        console.error(errors);
      }
    }
  };

  const onClickSave = () => {
    //  validation
    if (!userName || userName.length <= 0 || userName.length > 35) {
      setErrorUserName(Common.getTranslation(LangKey.bussinessUserNameErr));
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
      setErrorMobile(Common.getTranslation(LangKey.bussinessMobileErr));
      return;
    }

    setErrorMobile("");
    const re = /\S+@\S+\.\S+/;
    if (!email || !re.test(email) || email.length <= 0 || email.length > 26) {
      setErrorEmail(Common.getTranslation(LangKey.bussinessEmailErr));
      return;
    }

    setErrorEmail("");

    if (!address || address.length <= 0 || address.length > 41) {
      setErrorAddress(Common.getTranslation(LangKey.bussinessAddressErr));
      return;
    }

    setErrorAddress("");

    if (
      !socialMediaId ||
      socialMediaId.length <= 0 ||
      socialMediaId.length > 20
    ) {
      setErrorSocailMediaId(
        Common.getTranslation(LangKey.bussinessSocialMediaIdErr)
      );
      return;
    }

    setErrorSocailMediaId("");

    if (!website || website.length <= 0 || website.length > 26) {
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
          console.log("data", data);
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

            console.log("===> user :", newUser);

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
    deleteBusinessImage({
      variables: {
        image: curUrl,
      },
    })
      .then(({ data, errors }) => {
        if (errors && errors !== null) {
          Common.showMessage(errors[0].message);
        } else {
          console.log("data", data.deleteBusinessImage);
          let imgArr = [];
          imgArr = user?.userInfo?.business?.image.filter(
            (val) => val.url !== curUrl
          );

          console.log("imgArr", imgArr);

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
            placeholder={Common.getTranslation(LangKey.labAddress)}
            placeholderTextColor={Color.txtIntxtcolor}
            returnKeyType="next"
            iconName="location"
            value={address}
            onChangeText={(text) => setAddress(text)}
            autoCapitalize="none"
            error={!!errorAddress}
            errorText={errorAddress}
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
              businessImageLimit > 0 &&
              (Array.isArray(user?.userInfo?.business?.image)
                ? user.userInfo.business.image.length < businessImageLimit &&
                  getImagePickerView()
                : getImagePickerView())
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
});
