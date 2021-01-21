import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
} from "react-native";
import { inject, observer } from "mobx-react";
import { useMutation } from "@apollo/client";
import { toJS } from "mobx";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { ReactNativeFile } from "apollo-upload-client";
import * as mime from "react-native-mime-types";

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
      <TouchableOpacity
        style={styles.toProfileImage}
        onPress={onClickImageSelect}
      >
        <Icon name="plus" color={Color.grey} size={34} />
      </TouchableOpacity>
    );
  };

  const onClickImageSelect = async () => {
    const { status } = await ImagePicker.getCameraRollPermissionsAsync();
    if (status !== ImagePicker.PermissionStatus.GRANTED) {
      const {
        status: newStatus,
      } = await ImagePicker.requestCameraRollPermissionsAsync(
        Permissions.CAMERA_ROLL
      );

      if (newStatus !== ImagePicker.PermissionStatus.GRANTED)
        Common.showMessage(
          Common.getTranslation(LangKey.msgCameraRollPermission)
        );
      else await pickImage();
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
      // check and add all variables
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
        {/* loading dialog */}
        <ProgressDialog
          visible={loadingUserImage}
          dismissable={false}
          message="Uploading Image"
        />

        <ProgressDialog
          visible={loading}
          dismissable={false}
          message="Saving Data"
        />

        <TouchableOpacity style={styles.toUserImage}>
          <View>
            {defaultImageUrl &&
              defaultImageUrl !== null &&
              defaultImageUrl !== "" && (
                <Image
                  source={{ uri: defaultImageUrl, width: 100, height: 100 }}
                  resizeMode="contain"
                />
              )}
          </View>
        </TouchableOpacity>

        <View style={styles.containerTil}>
          <View style={styles.socialBTNView}>
            <Image
              source={require("../../assets/call.png")}
              style={styles.filedsIcon}
            />

            <TextInput
              placeholder={Common.getTranslation(LangKey.labUserName)}
              placeholderTextColor={Color.darkBlue}
              returnKeyType="next"
              value={userName}
              onChangeText={(text) => setUserName(text)}
              autoCapitalize="none"
              style={styles.tiCommon}
              error={!!errorUserName}
              errorText={errorUserName}
            />
          </View>
          <View style={styles.socialBTNView}>
            <Image
              source={require("../../assets/call.png")}
              style={styles.filedsIcon}
            />
            <TextInput
              placeholder={Common.getTranslation(LangKey.labMobile)}
              placeholderTextColor={Color.darkBlue}
              returnKeyType="next"
              value={mobile}
              keyboardType="phone-pad"
              onChangeText={(text) => setMobile(text)}
              autoCapitalize="none"
              style={styles.tiCommon}
            />
          </View>
          <View style={styles.socialBTNView}>
            <Image
              source={require("../../assets/call.png")}
              style={styles.filedsIcon}
            />
            <TextInput
              placeholder={Common.getTranslation(LangKey.labEmail)}
              placeholderTextColor={Color.darkBlue}
              returnKeyType="next"
              value={email}
              onChangeText={(text) => setEmail(text)}
              autoCapitalize="none"
              style={styles.tiCommon}
            />
          </View>
          <View style={styles.socialBTNView}>
            <Image
              source={require("../../assets/call.png")}
              style={styles.filedsIcon}
            />
            <TextInput
              placeholder={Common.getTranslation(LangKey.labAddress)}
              placeholderTextColor={Color.darkBlue}
              returnKeyType="next"
              value={address}
              onChangeText={(text) => setAddress(text)}
              autoCapitalize="none"
              style={styles.tiCommon}
            />
          </View>
          <View style={styles.socialBTNView}>
            <Image
              source={require("../../assets/call.png")}
              style={styles.filedsIcon}
            />
            <TextInput
              placeholder={Common.getTranslation(LangKey.labSocialMediaId)}
              placeholderTextColor={Color.darkBlue}
              returnKeyType="next"
              value={socialMediaId}
              onChangeText={(text) => setSocialMediaId(text)}
              autoCapitalize="none"
              style={styles.tiCommon}
            />
          </View>
          <View style={styles.socialBTNView}>
            <Image
              source={require("../../assets/call.png")}
              style={styles.filedsIcon}
            />
            <TextInput
              placeholder={Common.getTranslation(LangKey.labWebsite)}
              placeholderTextColor={Color.darkBlue}
              returnKeyType="next"
              value={website}
              onChangeText={(text) => setWebsite(text)}
              autoCapitalize="none"
              style={styles.tiCommon}
            />
          </View>
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
                    <Image
                      source={{ uri: item.url, width: 100, height: 100 }}
                      style={styles.toProfileImage}
                    />
                  )}

                  {defaultImageUrl === item.url && (
                    <Icon
                      name="checkbox-marked-circle"
                      color={Color.primary}
                      size={20}
                      style={styles.icnCheck}
                    />
                  )}
                </TouchableOpacity>
              );
            }}
          />
        </View>

        <Button
          mode="contained"
          loading={loading}
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
export default inject("userStore")(observer(BusinessProfile));

const styles = StyleSheet.create({
  sv: {
    flex: 1,
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
  containerTil: { width: "90%" },
  tiCommon: {
    // marginTop: -5,
    // backgroundColor: Color.white,
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
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  btnSave: {
    width: "60%",
  },
  icnCheck: {
    position: "absolute",
    top: 2,
    right: 3,
  },
  socialBTNView: {
    height: 50,
    borderRadius: 50,
    marginHorizontal: 10,
    borderColor: Color.darkBlue,
    borderWidth: 3,
    flexDirection: "row",
    alignItems: "center",
    margin: 7,
  },
  filedsIcon: { height: 35, width: 35, marginHorizontal: 5, marginRight: 10 },
});
