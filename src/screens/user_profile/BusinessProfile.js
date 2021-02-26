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
    user?.userInfo?.business?.image && user.userInfo.business.image.length > 0
      ? setDefaultImageUrl(
          user.userInfo.business.image.find((item) => item.isDefault === true)
            .url
        )
      : setDefaultImageUrl(null);
  }, [user?.userInfo?.business?.image]);

  const [errorUserName, setErrorUserName] = useState("");
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
    try {
      //check and add all variables
      if (emptyValidator(userName)) {
        setErrorUserName(Common.getTranslation(LangKey.errUserName));
        return;
      }

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
                if (item.url === defaultImageUrl) {
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
        {businessImageLimit > 0 && (
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
        )}
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
          />

          <TextInput
            placeholder={Common.getTranslation(LangKey.labEmail)}
            placeholderTextColor={Color.txtIntxtcolor}
            returnKeyType="next"
            iconName="email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            autoCapitalize="none"
          />

          <TextInput
            placeholder={Common.getTranslation(LangKey.labAddress)}
            placeholderTextColor={Color.txtIntxtcolor}
            returnKeyType="next"
            iconName="designation"
            value={address}
            onChangeText={(text) => setAddress(text)}
            autoCapitalize="none"
          />

          <TextInput
            placeholder={Common.getTranslation(LangKey.labSocialMediaId)}
            placeholderTextColor={Color.txtIntxtcolor}
            returnKeyType="next"
            iconName="social_id"
            value={socialMediaId}
            onChangeText={(text) => setSocialMediaId(text)}
            autoCapitalize="none"
          />

          <TextInput
            placeholder={Common.getTranslation(LangKey.labWebsite)}
            placeholderTextColor={Color.txtIntxtcolor}
            returnKeyType="next"
            iconName="website"
            value={website}
            onChangeText={(text) => setWebsite(text)}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.containerProfile}>
          {businessImageLimit > 0 &&
            (Array.isArray(user?.userInfo?.business?.image)
              ? user.userInfo.business.image.length < businessImageLimit &&
                getImagePickerView()
              : getImagePickerView())}
          <FlatList
            horizontal
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
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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
    // paddingVertical: 8,
    // paddingHorizontal: 8,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },
});
