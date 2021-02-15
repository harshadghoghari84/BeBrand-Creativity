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
  PermissionsAndroid,
} from "react-native";
// import Icon from "react-native-vector-icons/Ionicons";
import ViewShot from "react-native-view-shot";
import { SvgUri } from "react-native-svg";
import { inject, observer } from "mobx-react";
import * as MediaLibrary from "expo-media-library";
import * as Permissions from "expo-permissions";
import * as Sharing from "expo-sharing";

import Icon from "../components/svgIcons";
import Color from "../utils/Color";
import Common from "../utils/Common";
import Constant from "../utils/Constant";
import Button from "../components/Button";
import LangKey from "../utils/LangKey";
import { useMutation } from "@apollo/client";
import GraphqlQuery from "../utils/GraphqlQuery";
import TabsAnimation from "../components/TabsAnimation";
import FastImage from "react-native-fast-image";
import PopUp from "../components/PopUp";

const { width } = Dimensions.get("window");
let isShareClick = false;

const Design = ({ route, designStore, userStore, navigation }) => {
  const designPackages = toJS(designStore.designPackages);
  const user = toJS(userStore.user);
  const { designs: designsArr, curDesign } = route.params;
  const allLayouts = toJS(designStore.designLayouts);

  useEffect(() => {
    console.log("user", user);
  }, [user]);
  /*
  ..######..########....###....########.########
  .##....##....##......##.##......##....##......
  .##..........##.....##...##.....##....##......
  ..######.....##....##.....##....##....######..
  .......##....##....#########....##....##......
  .##....##....##....##.....##....##....##......
  ..######.....##....##.....##....##....########
  */

  const [addUserDesign, { loading }] = useMutation(GraphqlQuery.addUserDesign, {
    errorPolicy: "all",
  });

  const [visibleModal, setVisibleModal] = useState(false);
  const toggleVisible = () => {
    setVisibleModal(!visibleModal);
  };
  const [hasPro, sethasPro] = useState(false);
  const [designs, setDesigns] = useState([]);
  const [currentDesign, setCurrentDesign] = useState(curDesign);
  const [selectedTab, setSelectedTab] = useState(0);

  const [layouts, setLayouts] = useState([]);

  const [currentLayout, setCurrentLayout] = useState(null);

  const [socialIconList, setSocialIconList] = useState(
    Constant.defSocialIconList
  );

  const [footerColor, setFooterColor] = useState();
  const [footerTextColor, setFooterTextColor] = useState(Color.black);

  const isMountedRef = Common.useIsMountedRef();

  const onReset = () => {
    let filterArr = allLayouts.filter((item) =>
      currentDesign.layouts.includes(item.id)
    );

    if (selectedTab === 0) {
      filterArr = filterArr.filter(
        (item) =>
          item.layoutType === Constant.layoutTypePERSONAL ||
          item.layoutType === Constant.layoutTypeALL
      );
    } else {
      filterArr = filterArr.filter(
        (item) =>
          item.layoutType === Constant.layoutTypeBUSINESS ||
          item.layoutType === Constant.layoutTypeALL
      );
    }

    setLayouts(filterArr);
    setCurrentLayout(
      filterArr.length > 0
        ? hasPro === true
          ? filterArr[0]
          : filterArr.find(
              (item) => item.package.type === Constant.typeDesignPackageFree
            )
        : null
    );

    if (currentDesign?.colorCodes && currentDesign.colorCodes.length > 0) {
      setFooterColor(currentDesign.colorCodes[0].code);
      currentDesign.colorCodes[0].isLight == true
        ? setFooterTextColor(currentDesign.darkTextColor)
        : setFooterTextColor(currentDesign.lightTextColor);
    }
  };

  useEffect(() => {
    if (isMountedRef.current) {
      onReset();
    }
  }, [currentDesign, selectedTab]);

  useEffect(() => {
    let filterArr = [];
    if (selectedTab === 0)
      filterArr = designsArr.filter(
        (ele) =>
          ele.designType !== null &&
          (ele.designType === Constant.designTypeALL ||
            ele.designType === Constant.designTypePERSONAL)
      );
    else if (selectedTab === 1)
      filterArr = designsArr.filter(
        (ele) =>
          ele.designType !== null &&
          (ele.designType === Constant.designTypeALL ||
            ele.designType === Constant.designTypeBUSINESS)
      );

    setDesigns(filterArr);
  }, [selectedTab]);

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
  const objAddress = currentLayout?.layoutFields?.address
    ? Common.convertStringToObject(currentLayout?.layoutFields?.address)
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

  const userDataPersonal =
    user && user != null
      ? {
          name: user?.userInfo?.personal && user.userInfo.personal.name,

          mobile: user?.userInfo?.personal && user.userInfo.personal.mobile,

          designation:
            user?.userInfo?.personal && user.userInfo.personal.designation,

          socialMedia:
            user?.userInfo?.personal && user.userInfo.personal.socialMediaId,

          image:
            user?.userInfo?.personal.image.length > 0
              ? user?.userInfo?.personal.image.find(
                  (item) => item.isDefault === true
                ).url
              : null,
        }
      : Constant.dummyUserData[0];
  const userDataBussiness =
    user && user != null
      ? {
          name: user?.userInfo?.business && user.userInfo.business.name,

          mobile: user?.userInfo?.business && user.userInfo.business.mobile,

          address: user?.userInfo?.business && user.userInfo.business.address,

          socialMedia:
            user?.userInfo?.business && user.userInfo.business.socialMediaId,

          image:
            user?.userInfo?.business?.image.length > 0
              ? user?.userInfo?.business?.image.find(
                  (item) => item.isDefault === true
                ).url
              : null,
        }
      : Constant.dummyUserData[0];

  const viewRef = useRef(null);

  const pixels = Common.getPixels(Constant.designPixel);

  const onClickDownload = async () => {
    if (user && user !== null) {
      await saveDesign();
    } else {
      Common.showMessage(Common.getTranslation(LangKey.msgCreateAcc));
    }
  };

  const onClickShare = async () => {
    if (user && user !== null) {
      isShareClick = true;
      await saveDesign();
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
    // // const permissionRead = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
    // const permissionWrite =
    //   PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
    // // const hasPermissionRead = await PermissionsAndroid.check(permissionRead);
    // const hasPermissionWrite = await PermissionsAndroid.check(permissionWrite);
    // // console.log(hasPermissionRead, hasPermissionWrite);
    // if (hasPermissionWrite === false) {
    //   const status = await PermissionsAndroid.request(permissionWrite);
    //   console.log("status: ", status);
    //   if (status !== "granted") {
    //     Common.showMessage(
    //       Common.getTranslation(LangKey.msgCameraRollPermission)
    //     );
    //   } else {
    //     await takeDesignShot();
    //   }
    // } else {
    //   await takeDesignShot();
    // }
  };

  const takeDesignShot = async () => {
    const currentDesignCredit = toJS(userStore.currentDesignCredit);
    if (currentDesignCredit.length > 0) {
      const { data, errors } = await addUserDesign({
        variables: { designId: currentDesign.id },
      });

      if (data !== null && !errors) {
        userStore.updateCurrantDesignCredit(currentDesignCredit - 1);
      } else {
      }

      const uri = await viewRef.current.capture();

      // await CameraRoll.save(uri, { type: "photo", album: "Brand Dot" })
      //   .then((res) => console.log("res: ", res))
      //   .catch((err) => console.log("err: ", err));

      if (Platform.OS === "android") {
        // await MediaLibrary.saveToLibraryAsync(uri)
        //   .then((res) => console.log("res: ", res))
        //   .catch((err) => console.log("err: ", err));
        const asset = await MediaLibrary.createAssetAsync(uri);
        if (asset && asset !== null) {
          const album = await MediaLibrary.getAlbumAsync(
            Constant.designAlbumName
          );
          album && album !== null
            ? await MediaLibrary.addAssetsToAlbumAsync(asset, album, false)
            : await MediaLibrary.createAlbumAsync(
                Constant.designAlbumName,
                asset,
                false
              );
        }
        Common.showMessage(Common.getTranslation(LangKey.msgDesignDownload));
      } else {
        const asset = await MediaLibrary.createAssetAsync(uri);
        const album = await MediaLibrary.getAlbumAsync(
          Constant.designAlbumName
        );
        album && album !== null
          ? await MediaLibrary.addAssetsToAlbumAsync(asset, album, false)
          : await MediaLibrary.createAlbumAsync(
              Constant.designAlbumName,
              asset,
              false
            );
        Common.showMessage(Common.getTranslation(LangKey.msgDesignDownload));
      }

      if (isShareClick === true) {
        isShareClick = false;
        await openShareDialogAsync(uri);
      }
    } else {
      setVisibleModal(true);
    }
  };

  let openShareDialogAsync = async (localUri) => {
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
  /*
      .########..########.########...######...#######..##....##....###....##......
      .##.....##.##.......##.....##.##....##.##.....##.###...##...##.##...##......
      .##.....##.##.......##.....##.##.......##.....##.####..##..##...##..##......
      .########..######...########...######..##.....##.##.##.##.##.....##.##......
      .##........##.......##...##.........##.##.....##.##..####.#########.##......
      .##........##.......##....##..##....##.##.....##.##...###.##.....##.##......
      .##........########.##.....##..######...#######..##....##.##.....##.########
      */
  const Personal = () => {
    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <PopUp
          visible={visibleModal}
          toggleVisible={toggleVisible}
          isPurchased={true}
        />
        <View style={styles.container}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={designs}
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
                      designPackage.type === Constant.typeDesignPackageVip &&
                      hasPro === false
                    ) {
                      setVisibleModal(true);
                    } else {
                      setCurrentDesign(item);
                    }
                  }}
                >
                  <View>
                    <FastImage
                      source={{ uri: item.thumbImage.url }}
                      style={{ width: 75, height: 75 }}
                    />

                    {item.id === currentDesign.id && (
                      <View
                        style={[
                          styles.icnCheck,
                          {
                            backgroundColor: Color.blackTransparant,
                            opacity: 0.6,
                          },
                        ]}
                      />
                    )}
                    {designPackage.type === Constant.typeDesignPackageVip && (
                      <Icon
                        style={styles.tagPro}
                        name="Premium"
                        height={18}
                        width={10}
                        fill={Color.primary}
                      />
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
              <FastImage
                source={{
                  uri: currentDesign.designImage.url,
                }}
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
                      {userDataPersonal.name}
                    </Text>
                    <Text style={{ ...objDesignation, color: footerTextColor }}>
                      {userDataPersonal.designation}
                    </Text>
                    <Text style={{ ...objMobile, color: footerTextColor }}>
                      {userDataPersonal.mobile}
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
                          height={12}
                          width={12}
                          size={currentLayout.socialIconSize}
                          fill={footerTextColor}
                          style={{ ...objSocialIcon }}
                        />
                      ))}

                      <Text
                        style={{
                          ...objSocialMediaName,
                          color: footerTextColor,
                        }}
                      >
                        {userDataPersonal.socialMedia}
                      </Text>
                    </View>

                    {userDataPersonal?.image && (
                      <FastImage
                        source={{ uri: userDataPersonal.image }}
                        style={{ ...objImage }}
                        resizeMode={FastImage.resizeMode.contain}
                      />
                    )}
                  </View>
                )}
              </FastImage>
            </View>
          </ViewShot>

          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={layouts}
            keyExtractor={keyExtractor}
            style={styles.flatlist}
            renderItem={({ item }) => (
              <TouchableOpacity
                key={item.id}
                style={styles.listLayoutView}
                onPress={() => {
                  if (
                    item.package.type === Constant.typeDesignPackageVip &&
                    hasPro === false
                  ) {
                    setVisibleModal(true);
                  } else {
                    setCurrentLayout(item);
                  }
                }}
              >
                <View>
                  <FastImage
                    source={{ uri: item.layoutImage.url }}
                    style={{ width: 75, height: 75 }}
                  />
                  {item.id === currentLayout.id && (
                    <View
                      style={[
                        styles.icnCheck,
                        {
                          backgroundColor: Color.blackTransparant,
                          opacity: 0.5,
                        },
                      ]}
                    />
                  )}

                  {item.package.type === Constant.typeDesignPackageVip && (
                    <Icon
                      style={styles.tagPro}
                      name="Premium"
                      height={18}
                      width={10}
                      fill={Color.primary}
                    />
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
                    ? setFooterTextColor(currentDesign.darkTextColor)
                    : setFooterTextColor(currentDesign.lightTextColor);
                }}
              >
                {item.code === footerColor ? (
                  <View
                    style={[
                      {
                        backgroundColor: Color.white,
                        opacity: 0.5,
                        position: "absolute",
                        height: 25,
                        width: 25,
                        borderRadius: 20,
                      },
                    ]}
                  />
                ) : null}
              </TouchableOpacity>
            )}
          />

          <FlatList
            style={styles.socialIconList}
            data={Constant.socialIconList}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={{
                  height: 40,
                  width: 40,
                  margin: 3,
                  backgroundColor: Color.darkBlue,
                  borderRadius: 50,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => {
                  if (socialIconList.indexOf(item) >= 0) {
                    setSocialIconList(
                      socialIconList.filter((val) => val !== item)
                    );
                  } else if (socialIconList.length < Constant.socialIconLimit) {
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
              >
                <View
                  style={{
                    height: 45,
                    width: 45,
                    backgroundColor:
                      socialIconList.indexOf(item) < 0 ? null : Color.white,
                    opacity: 0.3,
                    position: "absolute",
                  }}
                />

                <Icon
                  name={item}
                  height={25}
                  width={25}
                  fill={Color.white}
                  key={index}
                />
              </TouchableOpacity>
            )}
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{
              marginHorizontal: 10,
              marginVertical: 10,
              marginBottom: 10,
            }}
          >
            <View
              style={{
                justifyContent: "space-between",
                flexDirection: "row",
              }}
            >
              <Button
                disable={designs == null || designs == undefined}
                style={{ margin: 5 }}
                onPress={() => navigation.navigate(Constant.navProfile)}
                icon={
                  <Icon name="edit" height={15} width={15} fill={Color.white} />
                }
              >
                {Common.getTranslation(LangKey.txtEdit)}
              </Button>

              <Button
                disable={designs == null || designs == undefined}
                style={{ margin: 5 }}
                onPress={() => {
                  if (currentDesign.id === curDesign.id) {
                    onReset();
                  } else {
                    setCurrentDesign(curDesign);
                  }
                }}
                icon={
                  <Icon
                    name="reset"
                    height={15}
                    width={15}
                    fill={Color.white}
                  />
                }
              >
                {Common.getTranslation(LangKey.txtReset)}
              </Button>
              <Button
                disable={designs == null || designs == undefined}
                style={{ margin: 5 }}
                onPress={onClickShare}
              >
                {Common.getTranslation(LangKey.txtShare)}
              </Button>

              <Button
                disable={designs == null || designs == undefined}
                style={{ margin: 5 }}
                onPress={onClickDownload}
              >
                {Common.getTranslation(LangKey.txtDownload)}
              </Button>
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    );
  };
  /*
      .########..##.....##..######...######..####.##....##.########..######...######.
      .##.....##.##.....##.##....##.##....##..##..###...##.##.......##....##.##....##
      .##.....##.##.....##.##.......##........##..####..##.##.......##.......##......
      .########..##.....##..######...######...##..##.##.##.######....######...######.
      .##.....##.##.....##.......##.......##..##..##..####.##.............##.......##
      .##.....##.##.....##.##....##.##....##..##..##...###.##.......##....##.##....##
      .########...#######...######...######..####.##....##.########..######...######.
      */
  const bussiness = () => {
    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <PopUp
          visible={visibleModal}
          toggleVisible={toggleVisible}
          isPurchased={true}
        />
        <View style={styles.container}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={designs}
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
                      designPackage.type === Constant.typeDesignPackageVip &&
                      hasPro === false
                    ) {
                      setVisibleModal(true);
                    } else {
                      setCurrentDesign(item);
                    }
                  }}
                >
                  <View>
                    <FastImage
                      source={{ uri: item.thumbImage.url }}
                      style={{ width: 75, height: 75 }}
                    />
                    {item.id === currentDesign.id && (
                      <View
                        style={[
                          styles.icnCheck,
                          {
                            backgroundColor: Color.blackTransparant,
                            opacity: 0.6,
                          },
                        ]}
                      />
                    )}
                    {designPackage.type === Constant.typeDesignPackageVip && (
                      <Icon
                        style={styles.tagPro}
                        name="Premium"
                        height={18}
                        width={10}
                        fill={Color.primary}
                      />
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
              <FastImage
                source={{
                  uri: currentDesign.designImage.url,
                }}
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
                      {userDataBussiness.name}
                    </Text>
                    <Text style={{ ...objAddress, color: footerTextColor }}>
                      {userDataBussiness.address}
                    </Text>
                    <Text style={{ ...objMobile, color: footerTextColor }}>
                      {userDataBussiness.mobile}
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
                          height={12}
                          width={12}
                          size={currentLayout.socialIconSize}
                          fill={footerTextColor}
                          style={{ ...objSocialIcon }}
                        />
                      ))}

                      <Text
                        style={{
                          ...objSocialMediaName,
                          color: footerTextColor,
                        }}
                      >
                        {userDataBussiness.socialMedia}
                      </Text>
                    </View>

                    {userDataBussiness?.image && (
                      <FastImage
                        source={{ uri: userDataBussiness.image }}
                        style={{ ...objImage }}
                        resizeMode={FastImage.resizeMode.contain}
                      />
                    )}
                  </View>
                )}
              </FastImage>
            </View>
          </ViewShot>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={layouts}
            keyExtractor={keyExtractor}
            style={styles.flatlist}
            renderItem={({ item }) => (
              <TouchableOpacity
                key={item.id}
                style={styles.listLayoutView}
                onPress={() => {
                  if (
                    item.package.type === Constant.typeDesignPackageVip &&
                    hasPro === false
                  ) {
                    setVisibleModal(true);
                  } else {
                    setCurrentLayout(item);
                  }
                }}
              >
                <View>
                  <FastImage
                    source={{ uri: item.layoutImage.url }}
                    style={{ width: 75, height: 75 }}
                  />
                  {item.id === currentLayout.id && (
                    <View
                      style={[
                        styles.icnCheck,
                        {
                          backgroundColor: Color.blackTransparant,
                          opacity: 0.6,
                        },
                      ]}
                    />
                  )}

                  {item.package.type === Constant.typeDesignPackageVip && (
                    <Icon
                      style={styles.tagPro}
                      name="Premium"
                      height={18}
                      width={10}
                      fill={Color.primary}
                    />
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
                    ? setFooterTextColor(currentDesign.darkTextColor)
                    : setFooterTextColor(currentDesign.lightTextColor);
                }}
              >
                {item.code === footerColor ? (
                  <View
                    style={[
                      {
                        backgroundColor: Color.white,
                        opacity: 0.5,
                        position: "absolute",
                        height: 25,
                        width: 25,
                        borderRadius: 20,
                      },
                    ]}
                  />
                ) : null}
              </TouchableOpacity>
            )}
          />

          <FlatList
            style={styles.socialIconList}
            data={Constant.socialIconList}
            showsHorizontalScrollIndicator={false}
            horizontal
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={{
                  height: 40,
                  width: 40,
                  margin: 3,
                  backgroundColor: Color.darkBlue,
                  borderRadius: 50,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => {
                  if (socialIconList.indexOf(item) >= 0) {
                    setSocialIconList(
                      socialIconList.filter((val) => val !== item)
                    );
                  } else if (socialIconList.length < Constant.socialIconLimit) {
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
              >
                <View
                  style={{
                    height: 45,
                    width: 45,
                    backgroundColor:
                      socialIconList.indexOf(item) < 0 ? null : Color.white,
                    opacity: 0.3,
                    position: "absolute",
                  }}
                />
                <Icon
                  name={item}
                  height={25}
                  width={25}
                  fill={Color.white}
                  key={index}
                />
              </TouchableOpacity>
            )}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{
              marginHorizontal: 10,
              marginVertical: 10,
              marginBottom: 10,
            }}
          >
            <View
              style={{
                justifyContent: "space-between",
                flexDirection: "row",
              }}
            >
              <Button
                disable={designs == null || designs == undefined}
                style={{ margin: 5 }}
                onPress={() => navigation.navigate(Constant.navProfile)}
                icon={
                  <Icon name="edit" height={15} width={15} fill={Color.white} />
                }
              >
                {Common.getTranslation(LangKey.txtEdit)}
              </Button>

              <Button
                disable={designs == null || designs == undefined}
                style={{ margin: 5 }}
                onPress={() => {
                  if (currentDesign.id === curDesign.id) {
                    onReset();
                  } else {
                    setCurrentDesign(curDesign);
                  }
                }}
                icon={
                  <Icon
                    name="reset"
                    height={15}
                    width={15}
                    fill={Color.white}
                  />
                }
              >
                {Common.getTranslation(LangKey.txtReset)}
              </Button>
              <Button
                disable={designs == null || designs == undefined}
                style={{ margin: 5 }}
                onPress={onClickShare}
              >
                {Common.getTranslation(LangKey.txtShare)}
              </Button>

              <Button
                disable={designs == null || designs == undefined}
                style={{ margin: 5 }}
                onPress={onClickDownload}
              >
                {Common.getTranslation(LangKey.txtDownload)}
              </Button>
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <TabsAnimation
        flex={1}
        bgColor={Color.blackTransparant}
        AnimbgColor={Color.darkBlue}
        activeColor={Color.white}
        InactiveColor={Color.darkBlue}
        defaultTab={
          currentDesign.designType === Constant.designTypeBUSINESS ? 1 : 0
        }
        onTabChange={(val) => setSelectedTab(val)}
        txt1="Personal"
        txt2="Bussiness"
        child1={Personal()}
        child2={bussiness()}
      />
    </View>
  );
};
export default inject("designStore", "userStore")(observer(Design));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  flatlist: {
    height: 85,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  listLayoutView: {
    marginLeft: 5,
    marginVertical: 5,
    borderRadius: 4,
    overflow: "hidden",
  },
  listDesignView: {
    marginHorizontal: 5,
    marginVertical: 5,
    borderRadius: 5,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  icnCheck: {
    position: "absolute",
    width: 75,
    height: 75,
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
    marginVertical: 10,
  },
  socialIconList: {
    marginTop: 15,
    marginHorizontal: 10,
  },
  socialIcon: { marginLeft: 10 },
  tagPro: {
    paddingHorizontal: 4,
    marginRight: 5,
    color: Color.tagTextColor,
    position: "absolute",
    left: 5,
    overflow: "hidden",
  },
});
