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
      const { data, errors } = await addPersonalImage({
        variables: { image: file },
      });

      if (!errors) {
        userStore.addPersonalImage(data.addPersonalImage);
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

  // key extractors
  const keyExtractor = useCallback((item, index) => index.toString(), []);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: Color.white }}
    >
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
              placeholder={Common.getTranslation(LangKey.labDesignation)}
              placeholderTextColor={Color.darkBlue}
              returnKeyType="next"
              value={designation}
              onChangeText={(text) => setDesignation(text)}
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
          {personalImageLimit > 0 &&
            (Array.isArray(user?.userInfo?.personal?.image)
              ? user.userInfo.personal.image.length < personalImageLimit &&
                getImagePickerView()
              : getImagePickerView())}
          <FlatList
            horizontal
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
        <View style={{ width: "90%" }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: Color.darkBlue,
              paddingVertical: 5,
            }}
          >
            Profile Image
          </Text>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View
              style={{
                height: 90,
                width: "30%",
                backgroundColor: "pink",
                borderRadius: 10,
              }}
            ></View>
            <View
              style={{
                height: 90,
                width: "30%",
                backgroundColor: "pink",
                borderRadius: 10,
              }}
            ></View>
            <View
              style={{
                height: 90,
                width: "30%",
                backgroundColor: "pink",
                borderRadius: 10,
              }}
            ></View>
          </View>
        </View>

        <Button
          // mode=""
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
export default inject("userStore")(observer(PersonalProfile));

const styles = StyleSheet.create({
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
    width: "80%",
    marginTop: 10,
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
