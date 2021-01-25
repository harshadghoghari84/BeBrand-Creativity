import { toJS } from "mobx";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ImageBackground,
  ToastAndroid,
  Platform,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import ViewShot from "react-native-view-shot";
import { SvgUri } from "react-native-svg";
import { inject, observer } from "mobx-react";
import * as MediaLibrary from "expo-media-library";
import * as Permissions from "expo-permissions";
import * as Sharing from "expo-sharing";

import Color from "../utils/Color";
import Common from "../utils/Common";
import Constant from "../utils/Constant";
import Button from "../components/Button";
import LangKey from "../utils/LangKey";
import { useMutation } from "@apollo/client";
import GraphqlQuery from "../utils/GraphqlQuery";
import TabsAnimation from "../components/TabsAnimation";

const { width } = Dimensions.get("window");
let localUri = "";

const Design = ({ route, designStore, userStore, navigation }) => {
  const designPackages = toJS(designStore.designPackages);
  const user = toJS(userStore.user);

  const { designs, curDesign } = route.params;

  // useEffect(() => {
  //   console.log("==", designs);
  //   console.log("=>", curDesign);
  // }, []);

  const filterdDesignsPersonal = designs.filter(
    (ele) => ele.designType !== null && (ele.designType === "ALL" || "PERSONAL")
  );
  const filterdDesignsBussiness = designs.filter(
    (ele) =>
      ele.designType !== null && (ele.designType === "ALL" || "BUSSINESS")
  );
  // useEffect(() => {
  //   console.log("filterData", filterdDesigns);
  // }, [filterdDesigns]);

  const allLayouts = toJS(designStore.designLayouts);
  // useEffect(() => {
  //   console.log("Alllayouts", allLayouts);
  // }, [allLayouts]);

  const [addUserDesign, { loading }] = useMutation(GraphqlQuery.addUserDesign, {
    errorPolicy: "all",
  });

  const [hasPro, sethasPro] = useState(false);
  const [currentDesign, setCurrentDesign] = useState(curDesign);

  const [layouts, setLayouts] = useState([]);

  const filterdLayoutPersonal = layouts.filter(
    (ele) => ele.layoutType !== null && ele.layoutType === "PERSONAL"
  );
  const filterdLayoutBussiness = layouts.filter(
    (ele) => ele.layoutType !== null && ele.layoutType === "BUSSINESS"
  );

  // useEffect(() => {
  //   console.log("layouts", layouts);
  // }, [allLayouts]);

  const [currentLayout, setCurrentLayout] = useState(
    allLayouts.length > 0
      ? hasPro === true
        ? allLayouts[0]
        : allLayouts.find(
            (item) => item.package.type === Constant.typeDesignPackageFree
          )
      : null
  );

  const [socialIconList, setSocialIconList] = useState(
    Constant.defSocialIconList
  );

  const [footerColor, setFooterColor] = useState(Color.white);
  const [footerTextColor, setFooterTextColor] = useState(Color.black);

  const isMountedRef = Common.useIsMountedRef();

  useEffect(() => {
    if (isMountedRef.current) {
      const filter = allLayouts.filter((item) =>
        currentDesign.layouts.includes(item.id)
      );
      setLayouts(filter);
    }
  }, [currentDesign]);

  useEffect(() => {
    isMountedRef.current && sethasPro(userStore.hasPro);
  }, [userStore.hasPro]);

  //setting layoutFields to JSX object
  const objFooter = currentLayout?.layoutFields?.footer
    ? Common.convertStringToObject(currentLayout?.layoutFields?.footer)
    : undefined;
  const objName = currentLayout?.layoutFields?.name
    ? Common.convertStringToObject(currentLayout?.layoutFields?.name)
    : undefined;
  const objMobile = currentLayout?.layoutFields?.mobile
    ? Common.convertStringToObject(currentLayout?.layoutFields?.mobile)
    : undefined;
  const objDesignation = currentLayout?.layoutFields?.designation
    ? Common.convertStringToObject(currentLayout?.layoutFields?.designation)
    : undefined;
  const objImage = currentLayout?.layoutFields?.image
    ? Common.convertStringToObject(currentLayout?.layoutFields?.image)
    : undefined;
  const objSocialMediaView = currentLayout?.layoutFields?.socialMediaView
    ? Common.convertStringToObject(currentLayout?.layoutFields?.socialMediaView)
    : undefined;
  const objSocialMediaLabel = currentLayout?.layoutFields?.socialMediaLabel
    ? Common.convertStringToObject(
        currentLayout?.layoutFields?.socialMediaLabel
      )
    : undefined;
  const objSocialMediaName = currentLayout?.layoutFields?.socialMediaName
    ? Common.convertStringToObject(currentLayout?.layoutFields?.socialMediaName)
    : undefined;
  const objSocialIcon = currentLayout?.layoutFields?.socialIcon
    ? Common.convertStringToObject(currentLayout?.layoutFields?.socialIcon)
    : undefined;

  const userData =
    user && user != null
      ? {
          name: user.name,
          mobile: user.mobile,
          designation: user?.designation ? user.designation : null,
          socialMedia: user?.socialMediaInfo?.name
            ? user.socialMediaInfo.name
            : null,
          image:
            user?.imageInfo?.profile.length > 0
              ? user.imageInfo.profile.find((item) => item.isDefault === true)
                  .url
              : null,
        }
      : Constant.dummyUserData[0];

  const viewRef = useRef(null);

  const pixels = Common.getPixels(Constant.designPixel);

  const onClickDownload = async () => {
    if (user && user !== null) {
      await saveDesign();
      Common.showMessage(Common.getTranslation(LangKey.msgDesignDownload));
    } else {
      Common.showMessage(Common.getTranslation(LangKey.msgCreateAcc));
    }
  };

  const onClickShare = async () => {
    if (user && user !== null) {
      await saveDesign();
      await openShareDialogAsync();
    } else {
      Common.showMessage(Common.getTranslation(LangKey.msgCreateAcc));
    }
  };

  const saveDesign = async () => {
    const { status } = await Permissions.getAsync(Permissions.CAMERA_ROLL);
    if (status !== Permissions.PermissionStatus.GRANTED) {
      const { status: newStatus } = await Permissions.askAsync(
        Permissions.CAMERA_ROLL
      );
      if (newStatus !== Permissions.PermissionStatus.GRANTED) {
        Common.showMessage(
          Common.getTranslation(LangKey.msgCameraRollPermission)
        );
      } else {
        await takeDesignShot();
      }
    } else {
      await takeDesignShot();
    }
  };

  const takeDesignShot = async () => {
    await addUserDesign({
      variables: { designId: currentDesign.id },
    });

    const uri = await viewRef.current.capture();
    localUri = uri;

    if (Platform.OS === "android") {
      await MediaLibrary.saveToLibraryAsync(uri);
    } else {
      const asset = await MediaLibrary.createAssetAsync(uri);
      const album = await MediaLibrary.getAlbumAsync(Constant.designAlbumName);
      album && album !== null
        ? await MediaLibrary.addAssetsToAlbumAsync(asset, album, false)
        : await MediaLibrary.createAlbumAsync(
            Constant.designAlbumName,
            asset,
            false
          );
    }
  };

  let openShareDialogAsync = async () => {
    if (!(await Sharing.isAvailableAsync())) {
      Common.showMessage(Common.getTranslation(LangKey.msgShareNotAvaillable));
      return;
    }

    let filePath = localUri;
    !localUri.includes("file:///") && (filePath = "file:///" + localUri);

    await Sharing.shareAsync(filePath, {
      mimeType: "image/jpeg", // Android
      dialogTitle: "share-dialog title", // Android and Web
      UTI: "image/jpeg", // iOS
    });
  };

  // key extractors
  const keyExtractor = useCallback((item) => item.id.toString(), []);

  return (
    <>
      <TabsAnimation
        flex={1}
        bgColor={Color.blackTransparant}
        AnimbgColor={Color.darkBlue}
        activeColor={Color.white}
        InactiveColor={Color.darkBlue}
        txt1="Personal"
        txt2="Bussiness"
        /*
      .########..########.########...######...#######..##....##....###....##......
      .##.....##.##.......##.....##.##....##.##.....##.###...##...##.##...##......
      .##.....##.##.......##.....##.##.......##.....##.####..##..##...##..##......
      .########..######...########...######..##.....##.##.##.##.##.....##.##......
      .##........##.......##...##.........##.##.....##.##..####.#########.##......
      .##........##.......##....##..##....##.##.....##.##...###.##.....##.##......
      .##........########.##.....##..######...#######..##....##.##.....##.########
      */
        child1={
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.container}>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={filterdDesignsPersonal}
                keyExtractor={keyExtractor}
                style={styles.flatlist}
                renderItem={({ item }) => {
                  const designPackage = designPackages.find(
                    (pkg) => pkg.id === item.package
                  );
                  return (
                    <TouchableOpacity
                      style={styles.listDesignView}
                      onPress={() => {
                        if (
                          designPackage.type ===
                            Constant.typeDesignPackagePro &&
                          hasPro === false
                        ) {
                        } else {
                          setCurrentDesign(item);
                        }
                      }}
                    >
                      <View>
                        <Image
                          source={{ uri: item.thumbImage.url }}
                          style={{ width: 75, height: 75 }}
                        />

                        {item.id === currentDesign.id && (
                          <Icon
                            name="ios-checkmark-circle"
                            color={Color.primary}
                            size={20}
                            style={styles.icnCheck}
                          />
                        )}
                        {designPackage.type ===
                          Constant.typeDesignPackagePro && (
                          <Text style={styles.tagPro}>
                            {designPackage.type}
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />

              <ViewShot
                style={styles.designView}
                ref={viewRef}
                options={{
                  format: "jpg",
                  quality: 1,
                  width: pixels,
                  height: pixels,
                }}
              >
                <View style={{ flex: 1 }}>
                  <ImageBackground
                    source={{ uri: currentDesign.thumbImage.url }}
                    style={{ flex: 1 }}
                  >
                    {objFooter && (
                      <View style={{ ...objFooter }}>
                        <SvgUri
                          uri={currentLayout.footerImage.url}
                          width="100%"
                          height="100%"
                          fill={footerColor}
                        />

                        <Text style={{ ...objName, color: footerTextColor }}>
                          {userData.name}
                        </Text>
                        <Text
                          style={{ ...objDesignation, color: footerTextColor }}
                        >
                          {userData.designation}
                        </Text>
                        <Text style={{ ...objMobile, color: footerTextColor }}>
                          {userData.mobile}
                        </Text>

                        <View
                          style={{
                            ...objSocialMediaView,
                            color: footerTextColor,
                          }}
                        >
                          <Text
                            style={{
                              ...objSocialMediaLabel,
                              color: footerTextColor,
                            }}
                          >
                            {Common.getTranslation(LangKey.labFollowUs)}
                          </Text>
                          {socialIconList.map((item) => (
                            <Icon
                              key={item}
                              name={item}
                              size={currentLayout.socialIconSize}
                              color={footerTextColor}
                              style={{ ...objSocialIcon }}
                            />
                          ))}

                          <Text
                            style={{
                              ...objSocialMediaName,
                              color: footerTextColor,
                            }}
                          >
                            {userData.socialMedia}
                          </Text>
                        </View>

                        {userData?.image && (
                          <Image
                            source={{ uri: userData.image }}
                            style={{ ...objImage }}
                            resizeMode="cover"
                          />
                        )}
                      </View>
                    )}
                  </ImageBackground>
                </View>
              </ViewShot>

              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={filterdLayoutPersonal}
                keyExtractor={keyExtractor}
                style={styles.flatlist}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.listLayoutView}
                    onPress={() => {
                      if (
                        item.package.type === Constant.typeDesignPackagePro &&
                        hasPro === false
                      ) {
                      } else {
                        setCurrentLayout(item);
                      }
                    }}
                  >
                    <View>
                      <Image
                        source={{ uri: item.layoutImage.url }}
                        style={{ width: 75, height: 75 }}
                      />
                      {item.id === currentLayout.id && (
                        <Icon
                          name="ios-checkmark-circle"
                          color={Color.primary}
                          size={20}
                          style={styles.icnCheck}
                        />
                      )}

                      {item.package.type === Constant.typeDesignPackagePro && (
                        <Text style={styles.tagPro}>{item.package.type}</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                )}
              />

              <FlatList
                style={styles.colorCodeList}
                data={currentDesign?.colorCodes ? currentDesign.colorCodes : []}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    key={index}
                    style={{ ...styles.colorCode, backgroundColor: item.code }}
                    onPress={() => {
                      setFooterColor(item.code);
                      item.isLight == true
                        ? setFooterTextColor(Color.darkTextColor)
                        : setFooterTextColor(Color.lightTextColor);
                    }}
                  />
                )}
              />

              <FlatList
                style={styles.socialIconList}
                data={Constant.socialIconList}
                horizontal
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                  <Icon
                    name={item}
                    size={40}
                    color={
                      socialIconList.indexOf(item) < 0
                        ? Color.grey
                        : Color.black
                    }
                    key={index}
                    style={styles.socialIcon}
                    onPress={() => {
                      if (socialIconList.indexOf(item) >= 0) {
                        setSocialIconList(
                          socialIconList.filter((val) => val !== item)
                        );
                      } else if (
                        socialIconList.length < Constant.socialIconLimit
                      ) {
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
                    }}
                  />
                )}
              />

              <View
                style={{
                  justifyContent: "center",
                  marginTop: 15,
                  paddingHorizontal: 15,
                  flexDirection: "row",
                }}
              >
                <View style={{ flex: 1, marginRight: 5 }}>
                  <Button
                    mode="contained"
                    onPress={onClickShare}
                    disabled={designs == null}
                  >
                    {Common.getTranslation(LangKey.txtShare)}
                  </Button>
                </View>
                <View style={{ flex: 1, marginLeft: 5 }}>
                  <Button
                    mode="contained"
                    onPress={onClickDownload}
                    disabled={designs == null}
                  >
                    {Common.getTranslation(LangKey.txtDownload)}
                  </Button>
                </View>
              </View>
            </View>
          </ScrollView>
        }
        /*
      .########..##.....##..######...######..####.##....##.########..######...######.
      .##.....##.##.....##.##....##.##....##..##..###...##.##.......##....##.##....##
      .##.....##.##.....##.##.......##........##..####..##.##.......##.......##......
      .########..##.....##..######...######...##..##.##.##.######....######...######.
      .##.....##.##.....##.......##.......##..##..##..####.##.............##.......##
      .##.....##.##.....##.##....##.##....##..##..##...###.##.......##....##.##....##
      .########...#######...######...######..####.##....##.########..######...######.
      */
        child2={
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.container}>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={filterdDesignsBussiness}
                keyExtractor={keyExtractor}
                style={styles.flatlist}
                renderItem={({ item }) => {
                  const designPackage = designPackages.find(
                    (pkg) => pkg.id === item.package
                  );
                  return (
                    <TouchableOpacity
                      style={styles.listDesignView}
                      onPress={() => {
                        if (
                          designPackage.type ===
                            Constant.typeDesignPackagePro &&
                          hasPro === false
                        ) {
                        } else {
                          setCurrentDesign(item);
                        }
                      }}
                    >
                      <View>
                        <Image
                          source={{ uri: item.thumbImage.url }}
                          style={{ width: 75, height: 75 }}
                        />
                        {item.id === currentDesign.id && (
                          <Icon
                            name="ios-checkmark-circle"
                            color={Color.primary}
                            size={20}
                            style={styles.icnCheck}
                          />
                        )}
                        {designPackage.type ===
                          Constant.typeDesignPackagePro && (
                          <Text style={styles.tagPro}>
                            {designPackage.type}
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />

              <ViewShot
                style={styles.designView}
                ref={viewRef}
                options={{
                  format: "jpg",
                  quality: 1,
                  width: pixels,
                  height: pixels,
                }}
              >
                <View style={{ flex: 1 }}>
                  <ImageBackground
                    source={{ uri: currentDesign.thumbImage.url }}
                    style={{ flex: 1 }}
                  >
                    {objFooter && (
                      <View style={{ ...objFooter }}>
                        <SvgUri
                          uri={currentLayout.footerImage.url}
                          width="100%"
                          height="100%"
                          fill={footerColor}
                        />

                        <Text style={{ ...objName, color: footerTextColor }}>
                          {userData.name}
                        </Text>
                        <Text
                          style={{ ...objDesignation, color: footerTextColor }}
                        >
                          {userData.designation}
                        </Text>
                        <Text style={{ ...objMobile, color: footerTextColor }}>
                          {userData.mobile}
                        </Text>

                        <View
                          style={{
                            ...objSocialMediaView,
                            color: footerTextColor,
                          }}
                        >
                          <Text
                            style={{
                              ...objSocialMediaLabel,
                              color: footerTextColor,
                            }}
                          >
                            {Common.getTranslation(LangKey.labFollowUs)}
                          </Text>
                          {socialIconList.map((item) => (
                            <Icon
                              key={item}
                              name={item}
                              size={currentLayout.socialIconSize}
                              color={footerTextColor}
                              style={{ ...objSocialIcon }}
                            />
                          ))}

                          <Text
                            style={{
                              ...objSocialMediaName,
                              color: footerTextColor,
                            }}
                          >
                            {userData.socialMedia}
                          </Text>
                        </View>

                        {userData?.image && (
                          <Image
                            source={{ uri: userData.image }}
                            style={{ ...objImage }}
                            resizeMode="cover"
                          />
                        )}
                      </View>
                    )}
                  </ImageBackground>
                </View>
              </ViewShot>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={filterdLayoutBussiness}
                keyExtractor={keyExtractor}
                style={styles.flatlist}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.listLayoutView}
                    onPress={() => {
                      if (
                        item.package.type === Constant.typeDesignPackagePro &&
                        hasPro === false
                      ) {
                      } else {
                        setCurrentLayout(item);
                      }
                    }}
                  >
                    <View>
                      <Image
                        source={{ uri: item.layoutImage.url }}
                        style={{ width: 75, height: 75 }}
                      />
                      {item.id === currentLayout.id && (
                        <Icon
                          name="ios-checkmark-circle"
                          color={Color.primary}
                          size={20}
                          style={styles.icnCheck}
                        />
                      )}

                      {item.package.type === Constant.typeDesignPackagePro && (
                        <Text style={styles.tagPro}>{item.package.type}</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                )}
              />
              <FlatList
                style={styles.colorCodeList}
                data={currentDesign?.colorCodes ? currentDesign.colorCodes : []}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    key={index}
                    style={{ ...styles.colorCode, backgroundColor: item.code }}
                    onPress={() => {
                      setFooterColor(item.code);
                      item.isLight == true
                        ? setFooterTextColor(Color.darkTextColor)
                        : setFooterTextColor(Color.lightTextColor);
                    }}
                  />
                )}
              />
              <FlatList
                style={styles.socialIconList}
                data={Constant.socialIconList}
                horizontal
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                  <Icon
                    name={item}
                    size={40}
                    color={
                      socialIconList.indexOf(item) < 0
                        ? Color.grey
                        : Color.black
                    }
                    key={index}
                    style={styles.socialIcon}
                    onPress={() => {
                      if (socialIconList.indexOf(item) >= 0) {
                        setSocialIconList(
                          socialIconList.filter((val) => val !== item)
                        );
                      } else if (
                        socialIconList.length < Constant.socialIconLimit
                      ) {
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
                    }}
                  />
                )}
              />
              <View
                style={{
                  justifyContent: "center",
                  marginTop: 15,
                  paddingHorizontal: 15,
                  flexDirection: "row",
                }}
              >
                <View style={{ flex: 1, marginRight: 5 }}>
                  <Button
                    mode="contained"
                    onPress={onClickShare}
                    disabled={designs == null}
                  >
                    {Common.getTranslation(LangKey.txtShare)}
                  </Button>
                </View>
                <View style={{ flex: 1, marginLeft: 5 }}>
                  <Button
                    mode="contained"
                    onPress={onClickDownload}
                    disabled={designs == null}
                  >
                    {Common.getTranslation(LangKey.txtDownload)}
                  </Button>
                </View>
              </View>
            </View>
          </ScrollView>
        }
      />
    </>
  );
};
export default inject("designStore", "userStore")(observer(Design));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  flatlist: {
    marginTop: 10,
    height: 85,
  },
  listLayoutView: {
    marginLeft: 5,
    marginVertical: 5,
    borderRadius: 4,
    overflow: "hidden",
  },
  listDesignView: {
    marginLeft: 5,
    marginVertical: 5,
    overflow: "hidden",
  },
  icnCheck: {
    position: "absolute",
    top: 2,
    right: 3,
  },
  designView: { marginTop: 10, width: width - 20, height: width - 20 },
  colorCodeList: {
    marginTop: 15,
    marginRight: 15,
  },
  colorCode: {
    marginLeft: 10,
    height: 25,
    width: 25,
    borderRadius: 20,
    elevation: 5,
    marginVertical: 5,
  },
  socialIconList: {
    marginTop: 15,
    marginRight: 15,
  },
  socialIcon: { marginLeft: 10 },
  tagPro: {
    backgroundColor: Color.tagColor,
    paddingHorizontal: 4,
    marginRight: 5,
    borderRadius: 3,
    fontSize: 9,
    color: Color.tagTextColor,
    position: "absolute",
    top: 5,
    left: 5,
    overflow: "hidden",
  },
});
