import { toJS } from "mobx";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ToastAndroid,
  Platform,
  FlatList,
  ScrollView,
  TouchableOpacity,
  PixelRatio,
  ActivityIndicator,
} from "react-native";

import ViewShot from "react-native-view-shot";
import { SvgCss } from "react-native-svg";
import { inject, observer } from "mobx-react";
import * as MediaLibrary from "expo-media-library";
import * as Permissions from "expo-permissions";
import * as Sharing from "expo-sharing";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { useMutation } from "@apollo/client";
import FastImage from "react-native-fast-image";
import AsyncStorage from "@react-native-async-storage/async-storage";

// relative path
import Icon from "../../components/svgIcons";
import Color from "../../utils/Color";
import Common from "../../utils/Common";
import Constant from "../../utils/Constant";
import Button from "../../components/Button";
import LangKey from "../../utils/LangKey";
import GraphqlQuery from "../../utils/GraphqlQuery";
import PopUp from "../../components/PopUp";
import SvgConstant from "../../utils/SvgConstant";
import MuktaText from "../../components/MuktaText";
import CustomHeader from "../common/CustomHeader";

const { width } = Dimensions.get("window");
let isShareClick = false;
let msg = "";

const PersonalDesign = ({ route, designStore, userStore, navigation }) => {
  const designPackages = toJS(designStore.designPackages);
  const user = toJS(userStore.user);
  const { designs: designsArr, curDesign, curScreen } = route.params;

  const allLayouts = toJS(designStore.designLayouts);

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
  const [visibleModalMsg, setVisibleModalMsg] = useState(false);
  const toggleVisibleMsg = () => {
    setVisibleModalMsg(!visibleModalMsg);
  };
  const [visiblePicker, setVisiblePicker] = useState(false);
  const [selectedPicker, setSelectedPicker] = useState(false);

  const toggleVisibleColorPicker = () => {
    return setVisiblePicker(!visiblePicker);
  };

  const [loadingImage, setLoadingImage] = useState(false);
  const [hasPro, sethasPro] = useState(false);
  const [designs, setDesigns] = useState([]);
  const [currentDesign, setCurrentDesign] = useState(curDesign);

  const [layouts, setLayouts] = useState([]);

  const [currentLayout, setCurrentLayout] = useState(null);

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

  const [footerColor, setFooterColor] = useState();
  const [footerTextColor, setFooterTextColor] = useState(Color.black);
  const [selected, setSelected] = useState(0);

  const [userDataPersonal, setUserDataPersonal] = useState();

  const isMountedRef = Common.useIsMountedRef();

  const fiilterLayouts = () => {
    let filterArr = allLayouts.filter(
      (item) =>
        item.layoutType === Constant.layoutTypePERSONAL ||
        item.layoutType === Constant.layoutTypeALL
    );

    setLayouts(filterArr);

    checkLayout(filterArr);
  };
  const onReset = () => {
    // let filterArr = allLayouts.filter((item) =>
    //   currentDesign.layouts.includes(item.id)
    // );

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
  }, [currentDesign]);

  useEffect(() => {
    if (isMountedRef.current) {
      let filterArr = [];
      filterArr = designsArr.filter(
        (ele) =>
          ele.designType !== null &&
          (ele.designType === Constant.designTypePERSONAL ||
            ele.designType === Constant.designTypeALL)
      );
      setDesigns(filterArr);
    }
  }, []);

  useEffect(() => {
    isMountedRef.current && sethasPro(userStore.hasPro);
  }, [userStore.hasPro]);

  useEffect(() => {
    if (isMountedRef.current) {
      setUserDataPersonal(
        user && user != null
          ? {
              name:
                user?.userInfo?.personal?.name && user.userInfo.personal.name,

              mobile:
                user?.userInfo?.personal?.mobile &&
                user.userInfo.personal.mobile,

              designation:
                user?.userInfo?.personal?.designation &&
                user.userInfo.personal.designation,

              email:
                user?.userInfo?.personal?.email && user.userInfo.personal.email,

              website:
                user?.userInfo?.personal?.website &&
                user.userInfo.personal.website,

              socialMedia:
                user?.userInfo?.personal?.socialMediaId &&
                user.userInfo.personal.socialMediaId,

              image:
                user?.userInfo?.personal?.image.length > 0
                  ? user?.userInfo?.personal?.image.find(
                      (item) => item.isDefault === true
                    ).url
                  : null,
            }
          : Constant.dummyUserData[1]
      );
    }
  }, [userStore.user]);

  useEffect(() => {
    fiilterLayouts();
  }, [userDataPersonal]);

  const viewRef = useRef(null);

  const pixels = Common.getPixels(Constant.designPixel);

  const onClickDownload = async () => {
    if (user && user !== null) {
      if (currentLayout && currentLayout !== null) {
        await saveDesign();
      } else {
        Common.showMessage(Common.getTranslation(LangKey.msgSelectLayout));
      }
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
    const { status } = await Permissions.getAsync(Permissions.MEDIA_LIBRARY);
    console.log("sts", status);
    if (status !== Permissions.PermissionStatus.GRANTED) {
      const { status: newStatus } = await Permissions.askAsync(
        Permissions.MEDIA_LIBRARY
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
    const currentDesignCredit = toJS(userStore.currentDesignCredit);
    console.log("currentDesignCredit", currentDesignCredit);
    if (currentDesignCredit > 0) {
      const { data, errors, loading } = await addUserDesign({
        variables: { designId: currentDesign.id },
      });

      if (data !== null && !errors) {
        setLoadingImage(true);
        userStore.updateCurrantDesignCredit(currentDesignCredit - 1);
      } else if (errors && errors !== null && errors.length > 0) {
        setLoadingImage(false);
        Common.showMessage(errors[0].message);
        return;
      }

      const uri = await viewRef.current.capture();
      console.log("uri", uri);
      try {
        const asset = await MediaLibrary.createAssetAsync(uri);
        console.log("assets", asset);
        const album = await MediaLibrary.getAlbumAsync(
          Constant.designAlbumName
        );
        console.log("scb", album);

        album && album !== null
          ? await MediaLibrary.addAssetsToAlbumAsync(asset, album, false)
          : await MediaLibrary.createAlbumAsync(
              Constant.designAlbumName,
              asset,
              false
            )
              .then((res) => console.log("res: ", res))
              .catch((err) => console.log("err: ", err));
      } catch (error) {
        console.log("err", error);
      }

      setLoadingImage(false);
      Common.showMessage(Common.getTranslation(LangKey.msgDesignDownload));

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

  const plusBTN = () => {
    return (
      <View
        style={[
          styles.plusButton,
          {
            borderColor: selectedPicker ? Color.primary : null,
            borderWidth: selectedPicker ? 2 : null,
          },
        ]}
      >
        <TouchableOpacity
          disabled={currentLayout == null}
          activeOpacity={0.6}
          onPress={() => {
            setVisiblePicker(true);
          }}
          style={{
            backgroundColor: Color.txtIntxtcolor,
            padding: 5,
            borderRadius: 20,
          }}
        >
          <Icon name="plus" fill={Color.white} height={13} width={13} />
        </TouchableOpacity>
      </View>
    );
  };

  const checkLayout = (layouts) => {
    if (userDataPersonal) {
      let isSet = false;
      layouts.some((layout) => {
        switch (layout.id) {
          case Constant.personalLay1Id:
            if (
              userDataPersonal.name &&
              userDataPersonal.name !== "" &&
              userDataPersonal.designation &&
              userDataPersonal.designation !== "" &&
              userDataPersonal.website &&
              userDataPersonal.website !== "" &&
              userDataPersonal.email &&
              userDataPersonal.email !== "" &&
              userDataPersonal.mobile &&
              userDataPersonal.mobile !== "" &&
              userDataPersonal.socialMedia &&
              userDataPersonal.socialMedia !== ""
            ) {
              setCurrentLayout(layout);
              isSet = true;
              return true;
            }
            break;
          case Constant.personalLay2Id:
            if (
              userDataPersonal.name &&
              userDataPersonal.name !== "" &&
              userDataPersonal.designation &&
              userDataPersonal.designation !== "" &&
              userDataPersonal.socialMedia &&
              userDataPersonal.socialMedia !== "" &&
              userDataPersonal.image &&
              userDataPersonal.image !== "" &&
              userDataPersonal.image.length > 0
            ) {
              setCurrentLayout(layout);
              isSet = true;
              return true;
            }
            break;
          case Constant.personalLay3Id:
            if (
              userDataPersonal.name &&
              userDataPersonal.name !== "" &&
              userDataPersonal.designation &&
              userDataPersonal.designation !== "" &&
              userDataPersonal.socialMedia &&
              userDataPersonal.socialMedia !== "" &&
              userDataPersonal.image &&
              userDataPersonal.image !== "" &&
              userDataPersonal.image.length > 0
            ) {
              setCurrentLayout(layout);
              isSet = true;
            }
            break;
          case Constant.personalLay4Id:
            if (
              userDataPersonal.name &&
              userDataPersonal.name !== "" &&
              userDataPersonal.designation &&
              userDataPersonal.designation !== "" &&
              userDataPersonal.website &&
              userDataPersonal.website !== "" &&
              userDataPersonal.socialMedia &&
              userDataPersonal.socialMedia !== ""
            ) {
              setCurrentLayout(layout);
              isSet = true;
              return true;
            }
            break;
          case Constant.personalLay5Id:
            if (
              userDataPersonal.name &&
              userDataPersonal.name !== "" &&
              userDataPersonal.designation &&
              userDataPersonal.designation !== "" &&
              userDataPersonal.email &&
              userDataPersonal.email !== "" &&
              userDataPersonal.socialMedia &&
              userDataPersonal.socialMedia !== ""
            ) {
              setCurrentLayout(layout);
              isSet = true;
              return true;
            }
            break;
          case Constant.personalLay6Id:
            if (
              userDataPersonal.name &&
              userDataPersonal.name !== "" &&
              userDataPersonal.designation &&
              userDataPersonal.designation !== "" &&
              userDataPersonal.mobile &&
              userDataPersonal.mobile !== "" &&
              userDataPersonal.socialMedia &&
              userDataPersonal.socialMedia !== "" &&
              userDataPersonal.image &&
              userDataPersonal.image !== "" &&
              userDataPersonal.image.length > 0
            ) {
              setCurrentLayout(layout);
              isSet = true;
              return true;
            }
            break;
          case Constant.personalLay7Id:
            if (
              userDataPersonal.name &&
              userDataPersonal.name !== "" &&
              userDataPersonal.designation &&
              userDataPersonal.designation !== "" &&
              userDataPersonal.mobile &&
              userDataPersonal.mobile !== "" &&
              userDataPersonal.socialMedia &&
              userDataPersonal.socialMedia !== "" &&
              userDataPersonal.image &&
              userDataPersonal.image !== "" &&
              userDataPersonal.image.length > 0
            ) {
              setCurrentLayout(layout);
              isSet = true;
              return true;
            }
            break;
        }
      });

      if (isSet == false && curScreen === Constant.navPersonalProfile) {
        msg = Common.getTranslation(LangKey.nolayout);
        setVisibleModalMsg(true);
      }
    }
  };
  const checkAndSetLayout = (layout) => {
    console.log("layout_id", layout.id);
    switch (layout.id) {
      case Constant.personalLay1Id:
        if (
          !userDataPersonal.name ||
          userDataPersonal.name === "" ||
          !userDataPersonal.designation ||
          userDataPersonal.designation === "" ||
          !userDataPersonal.website ||
          userDataPersonal.website === "" ||
          !userDataPersonal.email ||
          userDataPersonal.email === "" ||
          !userDataPersonal.mobile ||
          userDataPersonal.mobile === "" ||
          !userDataPersonal.socialMedia ||
          userDataPersonal.socialMedia === ""
        ) {
          msg = Common.getTranslation(LangKey.personalLay1Msg);
          setVisibleModalMsg(true);
        } else {
          setCurrentLayout(layout);
        }
        break;
      case Constant.personalLay2Id:
        if (
          !userDataPersonal.name ||
          userDataPersonal.name === "" ||
          !userDataPersonal.designation ||
          userDataPersonal.designation === "" ||
          !userDataPersonal.socialMedia ||
          userDataPersonal.socialMedia === "" ||
          !userDataPersonal.image ||
          userDataPersonal.image === "" ||
          userDataPersonal.image.length < 0
        ) {
          msg = Common.getTranslation(LangKey.personalLay2Msg);
          setVisibleModalMsg(true);
        } else {
          setCurrentLayout(layout);
        }
        break;
      case Constant.personalLay3Id:
        if (
          !userDataPersonal.name ||
          userDataPersonal.name === "" ||
          !userDataPersonal.designation ||
          userDataPersonal.designation === "" ||
          !userDataPersonal.socialMedia ||
          userDataPersonal.socialMedia === "" ||
          !userDataPersonal.image ||
          userDataPersonal.image === "" ||
          userDataPersonal.image.length < 0
        ) {
          msg = Common.getTranslation(LangKey.personalLay3Msg);
          setVisibleModalMsg(true);
        } else {
          setCurrentLayout(layout);
        }
        break;
      case Constant.personalLay4Id:
        if (
          !userDataPersonal.name ||
          userDataPersonal.name === "" ||
          !userDataPersonal.designation ||
          userDataPersonal.designation === "" ||
          !userDataPersonal.website ||
          userDataPersonal.website === "" ||
          !userDataPersonal.socialMedia ||
          userDataPersonal.socialMedia === ""
        ) {
          msg = Common.getTranslation(LangKey.personalLay4Msg);
          setVisibleModalMsg(true);
        } else {
          setCurrentLayout(layout);
        }
        break;
      case Constant.personalLay5Id:
        if (
          !userDataPersonal.name ||
          userDataPersonal.name === "" ||
          !userDataPersonal.designation ||
          userDataPersonal.designation === "" ||
          !userDataPersonal.email ||
          userDataPersonal.email === "" ||
          !userDataPersonal.socialMedia ||
          userDataPersonal.socialMedia === ""
        ) {
          msg = Common.getTranslation(LangKey.personalLay5Msg);
          setVisibleModalMsg(true);
        } else {
          msg = "";
          setCurrentLayout(layout);
        }
        break;
      case Constant.personalLay6Id:
        if (
          !userDataPersonal.name ||
          userDataPersonal.name === "" ||
          !userDataPersonal.designation ||
          userDataPersonal.designation === "" ||
          !userDataPersonal.mobile ||
          userDataPersonal.mobile === "" ||
          !userDataPersonal.socialMedia ||
          userDataPersonal.socialMedia === "" ||
          !userDataPersonal.image ||
          userDataPersonal.image === "" ||
          userDataPersonal.image.length < 0
        ) {
          msg = Common.getTranslation(LangKey.personalLay6Msg);
          setVisibleModalMsg(true);
        } else {
          setCurrentLayout(layout);
        }
        break;
      case Constant.personalLay7Id:
        if (
          !userDataPersonal.name ||
          userDataPersonal.name === "" ||
          !userDataPersonal.designation ||
          userDataPersonal.designation === "" ||
          !userDataPersonal.mobile ||
          userDataPersonal.mobile === "" ||
          !userDataPersonal.socialMedia ||
          userDataPersonal.socialMedia === "" ||
          !userDataPersonal.image ||
          userDataPersonal.image === "" ||
          userDataPersonal.image.length < 0
        ) {
          msg = Common.getTranslation(LangKey.personalLay7Msg);
          setVisibleModalMsg(true);
        } else {
          setCurrentLayout(layout);
        }
        break;
    }
  };

  const getLayout = () => {
    switch (currentLayout.id) {
      case Constant.personalLay1Id:
        return getLayout1();
        break;
      case Constant.personalLay2Id:
        return getLayout2();
        break;
      case Constant.personalLay3Id:
        return getLayout3();
        break;
      case Constant.personalLay4Id:
        return getLayout4();
        break;
      case Constant.personalLay5Id:
        return getLayout5();
        break;
      case Constant.personalLay6Id:
        return getLayout6();
        break;
      case Constant.personalLay7Id:
        return getLayout7();
        break;
    }
  };

  // key extractors
  const keyExtractor = useCallback((item) => item.id.toString(), []);

  /*
  .##..........###....##....##..#######..##.....##.##....##.########..######.
  .##.........##.##....##..##..##.....##.##.....##..##..##.....##....##....##
  .##........##...##....####...##.....##.##.....##...####......##....##......
  .##.......##.....##....##....##.....##.##.....##....##.......##.....######.
  .##.......#########....##....##.....##.##.....##....##.......##..........##
  .##.......##.....##....##....##.....##.##.....##....##.......##....##....##
  .########.##.....##....##.....#######...#######.....##.......##.....######.
  */

  const getLayout1 = () => (
    <View style={styles.lay1ViewFooter}>
      <SvgCss
        xml={SvgConstant.footerPersonalLayout1}
        width="100%"
        height="100%"
        fill={footerColor}
      />

      <View style={styles.lay1ViewName}>
        <MuktaText style={[styles.lay1TxtName, { color: footerTextColor }]}>
          {userDataPersonal.name}
        </MuktaText>

        <MuktaText
          style={[styles.lay1TxtDesignation, { color: footerTextColor }]}
        >
          {userDataPersonal.designation}
        </MuktaText>
      </View>

      <View style={styles.lay1ViewWebsiteEmail}>
        <View style={styles.layViewIconRoot}>
          <View
            style={[styles.layViewIcon, { backgroundColor: footerTextColor }]}
          >
            <Icon
              name="website"
              height={Constant.layIconHeight}
              width={Constant.layIconWidth}
              fill={footerColor}
            />
          </View>
          <MuktaText style={[styles.layTxtIcon, { color: footerTextColor }]}>
            {userDataPersonal.website}
          </MuktaText>
        </View>
        <View style={styles.layViewIconRoot}>
          <View
            style={[styles.layViewIcon, { backgroundColor: footerTextColor }]}
          >
            <Icon
              name="email"
              height={Constant.layIconHeight}
              width={Constant.layIconWidth}
              fill={footerColor}
            />
          </View>
          <MuktaText style={[styles.layTxtIcon, { color: footerTextColor }]}>
            {userDataPersonal.email}
          </MuktaText>
        </View>
      </View>

      <View style={styles.lay1ViewMobile}>
        <View style={styles.layViewIconRoot}>
          <View
            style={[styles.layViewIcon, { backgroundColor: footerTextColor }]}
          >
            <Icon
              name="phone"
              height={Constant.layIconHeight}
              width={Constant.layIconWidth}
              fill={footerColor}
            />
          </View>

          <MuktaText style={[styles.layTxtIcon, { color: footerTextColor }]}>
            {userDataPersonal.mobile}
          </MuktaText>
        </View>
      </View>

      <View
        style={[
          styles.lay1ViewSocialMedia,
          {
            color: footerTextColor,
          },
        ]}
      >
        {socialIconList &&
          socialIconList.map((item) => (
            <View style={styles.layViewSocialIconRoot}>
              <View
                style={[
                  styles.layViewIcon,
                  { backgroundColor: footerTextColor },
                ]}
              >
                <Icon
                  key={item}
                  name={item}
                  height={Constant.layIconHeight}
                  width={Constant.layIconWidth}
                  fill={footerColor}
                />
              </View>
            </View>
          ))}

        <MuktaText style={[styles.layTxtIcon, { color: footerTextColor }]}>
          {userDataPersonal.socialMedia}
        </MuktaText>
      </View>
    </View>
  );

  const getLayout2 = () => (
    <View style={styles.lay2ViewFooter}>
      <SvgCss
        xml={SvgConstant.footerPersonalLayout2}
        width="100%"
        height="100%"
        fill={footerColor}
      />

      <FastImage
        source={{ uri: userDataPersonal.image }}
        style={styles.lay2ImgUser}
        resizeMode={FastImage.resizeMode.contain}
      />

      <MuktaText style={[styles.lay2TxtName, { color: footerTextColor }]}>
        {userDataPersonal.name}
      </MuktaText>

      <MuktaText
        style={[styles.lay2TxtDesignation, { color: footerTextColor }]}
      >
        {userDataPersonal.designation}
      </MuktaText>

      <View
        style={[
          styles.lay2ViewSocialMedia,
          {
            color: footerTextColor,
          },
        ]}
      >
        {socialIconList &&
          socialIconList.map((item) => (
            <View style={styles.layViewSocialIconRoot}>
              <View
                style={[
                  styles.layViewIcon,
                  { backgroundColor: footerTextColor },
                ]}
              >
                <Icon
                  key={item}
                  name={item}
                  height={Constant.layIconHeight}
                  width={Constant.layIconWidth}
                  fill={footerColor}
                />
              </View>
            </View>
          ))}

        <MuktaText style={[styles.layTxtIcon, { color: footerTextColor }]}>
          {userDataPersonal.socialMedia}
        </MuktaText>
      </View>
    </View>
  );

  const getLayout3 = () => (
    <View style={styles.lay3ViewFooter}>
      <SvgCss
        xml={SvgConstant.footerPersonalLayout2}
        width="100%"
        height="100%"
        fill={footerColor}
      />

      <FastImage
        source={{ uri: userDataPersonal.image }}
        style={styles.lay3ImgUser}
        resizeMode={FastImage.resizeMode.contain}
      />

      <MuktaText style={[styles.lay3TxtName, { color: footerTextColor }]}>
        {userDataPersonal.name}
      </MuktaText>

      <MuktaText
        style={[styles.lay3TxtDesignation, { color: footerTextColor }]}
      >
        {userDataPersonal.designation}
      </MuktaText>

      <View
        style={[
          styles.lay3ViewSocialMedia,
          {
            color: footerTextColor,
          },
        ]}
      >
        {socialIconList &&
          socialIconList.map((item) => (
            <View style={styles.layViewSocialIconRoot}>
              <View
                style={[
                  styles.layViewIcon,
                  { backgroundColor: footerTextColor },
                ]}
              >
                <Icon
                  key={item}
                  name={item}
                  height={Constant.layIconHeight}
                  width={Constant.layIconWidth}
                  fill={footerColor}
                />
              </View>
            </View>
          ))}

        <MuktaText style={[styles.layTxtIcon, { color: footerTextColor }]}>
          {userDataPersonal.socialMedia}
        </MuktaText>
      </View>
    </View>
  );

  const getLayout4 = () => (
    <View style={styles.lay4ViewFooter}>
      <SvgCss
        xml={SvgConstant.footerPersonalLayout2}
        width="100%"
        height="100%"
        fill={footerColor}
      />

      <View style={styles.lay4ViewNameDesignation}>
        <MuktaText style={[styles.lay4TxtName, { color: footerTextColor }]}>
          {userDataPersonal.name}
        </MuktaText>

        <MuktaText
          style={[styles.lay4TxtDesignation, { color: footerTextColor }]}
        >
          {userDataPersonal.designation}
        </MuktaText>
      </View>

      <View style={styles.lay4ViewWebsite}>
        <View style={styles.layViewIconRoot}>
          <View
            style={[styles.layViewIcon, { backgroundColor: footerTextColor }]}
          >
            <Icon
              name="website"
              height={Constant.layIconHeight}
              width={Constant.layIconWidth}
              fill={footerColor}
            />
          </View>
          <MuktaText style={[styles.layTxtIcon, { color: footerTextColor }]}>
            {userDataPersonal.website}
          </MuktaText>
        </View>
      </View>

      <View
        style={[
          styles.lay4ViewSocialMedia,
          {
            color: footerTextColor,
          },
        ]}
      >
        {socialIconList &&
          socialIconList.map((item) => (
            <View style={styles.layViewSocialIconRoot}>
              <View
                style={[
                  styles.layViewIcon,
                  { backgroundColor: footerTextColor },
                ]}
              >
                <Icon
                  key={item}
                  name={item}
                  height={Constant.layIconHeight}
                  width={Constant.layIconWidth}
                  fill={footerColor}
                />
              </View>
            </View>
          ))}

        <MuktaText style={[styles.layTxtIcon, { color: footerTextColor }]}>
          {userDataPersonal.socialMedia}
        </MuktaText>
      </View>
    </View>
  );

  const getLayout5 = () => (
    <View style={styles.lay4ViewFooter}>
      <SvgCss
        xml={SvgConstant.footerPersonalLayout2}
        width="100%"
        height="100%"
        fill={footerColor}
      />

      <View style={styles.lay4ViewNameDesignation}>
        <MuktaText style={[styles.lay4TxtName, { color: footerTextColor }]}>
          {userDataPersonal.name}
        </MuktaText>

        <MuktaText
          style={[styles.lay4TxtDesignation, { color: footerTextColor }]}
        >
          {userDataPersonal.designation}
        </MuktaText>
      </View>

      <View style={styles.lay4ViewWebsite}>
        <View style={styles.layViewIconRoot}>
          <View
            style={[styles.layViewIcon, { backgroundColor: footerTextColor }]}
          >
            <Icon
              name="email"
              height={Constant.layIconHeight}
              width={Constant.layIconWidth}
              fill={footerColor}
            />
          </View>
          <MuktaText style={[styles.layTxtIcon, { color: footerTextColor }]}>
            {userDataPersonal.email}
          </MuktaText>
        </View>
      </View>

      <View
        style={[
          styles.lay4ViewSocialMedia,
          {
            color: footerTextColor,
          },
        ]}
      >
        {socialIconList &&
          socialIconList.map((item) => (
            <View style={styles.layViewSocialIconRoot}>
              <View
                style={[
                  styles.layViewIcon,
                  { backgroundColor: footerTextColor },
                ]}
              >
                <Icon
                  key={item}
                  name={item}
                  height={Constant.layIconHeight}
                  width={Constant.layIconWidth}
                  fill={footerColor}
                />
              </View>
            </View>
          ))}

        <MuktaText style={[styles.layTxtIcon, { color: footerTextColor }]}>
          {userDataPersonal.socialMedia}
        </MuktaText>
      </View>
    </View>
  );

  const getLayout6 = () => (
    <View style={styles.lay2ViewFooter}>
      <SvgCss
        xml={SvgConstant.footerPersonalLayout2}
        width="100%"
        height="100%"
        fill={footerColor}
      />

      <FastImage
        source={{ uri: userDataPersonal.image }}
        style={styles.lay2ImgUser}
        resizeMode={FastImage.resizeMode.contain}
      />

      <MuktaText style={[styles.lay2TxtName, { color: footerTextColor }]}>
        {userDataPersonal.name}
      </MuktaText>

      <MuktaText
        style={[styles.lay2TxtDesignation, { color: footerTextColor }]}
      >
        {userDataPersonal.designation}
      </MuktaText>

      <View style={styles.lay6ViewMobile}>
        <View style={styles.layViewIconRoot}>
          <View
            style={[styles.layViewIcon, { backgroundColor: footerTextColor }]}
          >
            <Icon
              name="phone"
              height={Constant.layIconHeight}
              width={Constant.layIconWidth}
              fill={footerColor}
            />
          </View>

          <MuktaText style={[styles.layBigTxtIcon, { color: footerTextColor }]}>
            {userDataPersonal.mobile}
          </MuktaText>
        </View>
      </View>

      <View
        style={[
          styles.lay2ViewSocialMedia,
          {
            color: footerTextColor,
          },
        ]}
      >
        {socialIconList &&
          socialIconList.map((item) => (
            <View style={styles.layViewSocialIconRoot}>
              <View
                style={[
                  styles.layViewIcon,
                  { backgroundColor: footerTextColor },
                ]}
              >
                <Icon
                  key={item}
                  name={item}
                  height={Constant.layIconHeight}
                  width={Constant.layIconWidth}
                  fill={footerColor}
                />
              </View>
            </View>
          ))}

        <MuktaText style={[styles.layTxtIcon, { color: footerTextColor }]}>
          {userDataPersonal.socialMedia}
        </MuktaText>
      </View>
    </View>
  );

  const getLayout7 = () => (
    <View style={styles.lay3ViewFooter}>
      <SvgCss
        xml={SvgConstant.footerPersonalLayout2}
        width="100%"
        height="100%"
        fill={footerColor}
      />
      <FastImage
        source={{ uri: userDataPersonal.image }}
        style={styles.lay3ImgUser}
        resizeMode={FastImage.resizeMode.contain}
      />

      <MuktaText
        style={[styles.lay3TxtName, { color: footerTextColor }]}
        adjustsFontSizeToFit
      >
        {userDataPersonal.name}
      </MuktaText>
      <MuktaText
        style={[styles.lay3TxtDesignation, { color: footerTextColor }]}
        adjustsFontSizeToFit
      >
        {userDataPersonal.designation}
      </MuktaText>
      <View style={styles.lay7ViewMobile}>
        <View style={styles.layViewIconRoot}>
          <View
            style={[styles.layViewIcon, { backgroundColor: footerTextColor }]}
          >
            <Icon
              name="phone"
              height={Constant.layIconHeight}
              width={Constant.layIconWidth}
              fill={footerColor}
            />
          </View>

          <MuktaText style={[styles.layBigTxtIcon, { color: footerTextColor }]}>
            {userDataPersonal.mobile}
          </MuktaText>
        </View>
      </View>
      <View
        style={[
          styles.lay3ViewSocialMedia,
          {
            color: footerTextColor,
          },
        ]}
      >
        {socialIconList &&
          socialIconList.map((item) => (
            <View style={styles.layViewSocialIconRoot}>
              <View
                style={[
                  styles.layViewIcon,
                  { backgroundColor: footerTextColor },
                ]}
              >
                <Icon
                  key={item}
                  name={item}
                  height={Constant.layIconHeight}
                  width={Constant.layIconWidth}
                  fill={footerColor}
                />
              </View>
            </View>
          ))}

        <MuktaText style={[styles.layTxtIcon, { color: footerTextColor }]}>
          {userDataPersonal.socialMedia}
        </MuktaText>
      </View>
    </View>
  );

  /*
..######...#######..##.....##.########...#######..##....##.########.##....##.########..######.
.##....##.##.....##.###...###.##.....##.##.....##.###...##.##.......###...##....##....##....##
.##.......##.....##.####.####.##.....##.##.....##.####..##.##.......####..##....##....##......
.##.......##.....##.##.###.##.########..##.....##.##.##.##.######...##.##.##....##.....######.
.##.......##.....##.##.....##.##........##.....##.##..####.##.......##..####....##..........##
.##....##.##.....##.##.....##.##........##.....##.##...###.##.......##...###....##....##....##
..######...#######..##.....##.##.........#######..##....##.########.##....##....##.....######.
*/

  const layout = () => {
    return (
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={layouts}
        contentContainerStyle={{ paddingHorizontal: 5 }}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.flatlist}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.6}
            key={item.id}
            style={styles.listLayoutView}
            onPress={() => {
              if (
                item.package.type === Constant.typeDesignPackageVip &&
                hasPro === false
              ) {
                setVisibleModal(true);
              } else {
                checkAndSetLayout(item);
                // setCurrentLayout(item);
              }
            }}
          >
            <>
              <FastImage
                source={{ uri: item.layoutImage.url }}
                style={{
                  width: width / 2.5,
                  height: 40,
                }}
                resizeMode={FastImage.resizeMode.contain}
              />
              {currentLayout && item.id === currentLayout.id && (
                <View
                  style={[
                    styles.icnCheck,
                    {
                      backgroundColor: Color.blackTransparant,
                      opacity: 0.5,
                      borderRadius: 4,
                      overflow: "hidden",
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
            </>
          </TouchableOpacity>
        )}
      />
    );
  };

  const colorCode = () => {
    return (
      <>
        <FlatList
          contentContainerStyle={styles.colorCodeList}
          data={currentDesign?.colorCodes ? currentDesign.colorCodes : []}
          horizontal
          showsHorizontalScrollIndicator={false}
          ListFooterComponent={plusBTN()}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              activeOpacity={0.6}
              key={index}
              style={{
                ...styles.colorCode,
                backgroundColor: item.code,
              }}
              onPress={() => {
                setSelectedPicker(false);
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
                      borderColor: Color.primary,
                      borderWidth: 2,
                      margin: 10,
                      height: 33,
                      width: 33,
                      borderRadius: 20,
                    },
                  ]}
                />
              ) : null}
            </TouchableOpacity>
          )}
        />
        {selectedPicker && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              width: "60%",
              paddingBottom: 10,
            }}
          >
            <View
              style={{
                height: 28,
                width: 28,
                borderRadius: 20,
                borderColor:
                  footerTextColor === Color.black ? Color.primary : null,
                borderWidth: footerTextColor === Color.black ? 2 : null,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  height: 20,
                  width: 20,
                  borderRadius: 20,
                  backgroundColor: Color.black,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}
                onPress={() => setFooterTextColor(Color.black)}
              />
            </View>

            <View
              style={{
                height: 28,
                width: 28,
                borderRadius: 20,
                borderColor:
                  footerTextColor === Color.white ? Color.primary : null,
                borderWidth: footerTextColor === Color.white ? 2 : null,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  height: 20,
                  width: 20,
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
                }}
                onPress={() => setFooterTextColor(Color.white)}
              />
            </View>
          </View>
        )}
      </>
    );
  };

  const socialIcons = () => {
    return (
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
                console.log("remove icons", addIcons);

                setSocialIconList(socialIconList.filter((val) => val !== item));
              } else if (socialIconList.length < Constant.socialIconLimit) {
                addIcons.push(...socialIconList, item);

                setSocialIconList([...socialIconList, item]);
                console.log("add icons", addIcons);
              } else {
                Platform.OS == "android"
                  ? ToastAndroid.show(
                      Common.getTranslation(LangKey.msgSocialIconLimit),
                      ToastAndroid.LONG
                    )
                  : alert(Common.getTranslation(LangKey.msgSocialIconLimit));
              }
              await AsyncStorage.setItem(
                Constant.prfIcons,
                JSON.stringify(addIcons)
              );
            }}
          >
            <View
              style={{
                height: 45,
                width: 45,
                backgroundColor:
                  socialIconList && socialIconList.indexOf(item) < 0
                    ? null
                    : Color.white,
                opacity: 0.3,
                position: "absolute",
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
    );
  };

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
      >
        <PopUp
          visible={visibleModal}
          toggleVisible={toggleVisible}
          isPurchased={true}
        />
        <PopUp
          visible={visiblePicker}
          initialColor={footerColor}
          setPickerColor={setFooterColor}
          setSelectedPicker={setSelectedPicker}
          toggleVisibleColorPicker={toggleVisibleColorPicker}
          isPicker={true}
        />

        <PopUp
          visible={visibleModalMsg}
          toggleVisibleMsg={toggleVisibleMsg}
          isLayout={true}
          msg={msg}
        />
        <View style={styles.container}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={designs}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.flatlist}
            renderItem={({ item }) => {
              const designPackage = designPackages.find(
                (pkg) => pkg.id === item.package
              );
              return (
                <TouchableOpacity
                  activeOpacity={0.6}
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
                            width: 75,
                            height: 75,
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
            <View
              style={{
                flex: 1,
              }}
            >
              <FastImage
                source={{
                  uri: currentDesign.designImage.url,
                }}
                style={{ flex: 1 }}
              >
                {currentLayout && getLayout()}
              </FastImage>
            </View>
          </ViewShot>

          <View
            style={{
              height: 80,
              marginTop: 10,
            }}
          >
            {selected == 0 && layout()}
            {selected == 1 && colorCode()}
            {selected == 2 && socialIcons()}
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "90%",
            }}
          >
            <TouchableOpacity onPress={() => setSelected(0)}>
              <Text
                style={{
                  backgroundColor:
                    selected === 0 ? Color.darkBlue : Color.txtInBgColor,
                  color: selected === 0 ? Color.white : Color.darkBlue,
                  paddingHorizontal: 20,
                  paddingVertical: 5,
                  borderRadius: 15,
                  overflow: "hidden",
                }}
              >
                {Common.getTranslation(LangKey.labLayouts)}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSelected(1)}>
              <Text
                style={{
                  backgroundColor:
                    selected === 1 ? Color.darkBlue : Color.txtInBgColor,
                  color: selected === 1 ? Color.white : Color.darkBlue,
                  paddingHorizontal: 20,
                  paddingVertical: 5,
                  borderRadius: 15,
                  overflow: "hidden",
                }}
              >
                {Common.getTranslation(LangKey.labColorCodeList)}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSelected(2)}>
              <Text
                style={{
                  backgroundColor:
                    selected === 2 ? Color.darkBlue : Color.txtInBgColor,
                  color: selected === 2 ? Color.white : Color.darkBlue,
                  paddingHorizontal: 20,
                  paddingVertical: 5,
                  borderRadius: 15,
                  overflow: "hidden",
                }}
              >
                {Common.getTranslation(LangKey.labSocialMediaIcons)}
              </Text>
            </TouchableOpacity>
          </View>

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
                onPress={() => {
                  if (user && user !== null) {
                    navigation.navigate(Constant.navProfile, {
                      title: Constant.titPersonalProfile,
                    });
                  } else {
                    Common.showMessage(
                      Common.getTranslation(LangKey.msgCreateAccEdit)
                    );
                  }
                }}
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
                  fiilterLayouts();
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
              {/* <Button
                disable={designs == null || designs == undefined}
                style={{ margin: 5 }}
                icon={
                  <Icon
                    name="share"
                    height={15}
                    width={15}
                    fill={Color.white}
                  />
                }
                onPress={onClickShare}
              >
                {Common.getTranslation(LangKey.txtShare)}
              </Button> */}

              <Button
                disable={loadingImage}
                style={{ margin: 5 }}
                icon={
                  <Icon
                    name="download"
                    height={15}
                    width={15}
                    fill={Color.white}
                  />
                }
                onPress={onClickDownload}
              >
                {loadingImage ? (
                  <ActivityIndicator color={Color.white} size={15} />
                ) : (
                  Common.getTranslation(LangKey.txtDownload)
                )}
              </Button>
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};
export default inject("designStore", "userStore")(observer(PersonalDesign));

function actuatedNormalize(size) {
  const scale = width / 320;
  const newSize = size * scale;
  if (Platform.OS === "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}

/*
..######..########.##....##.##.......########..######.
.##....##....##.....##..##..##.......##.......##....##
.##..........##......####...##.......##.......##......
..######.....##.......##....##.......######....######.
.......##....##.......##....##.......##.............##
.##....##....##.......##....##.......##.......##....##
..######.....##.......##....########.########..######.
*/

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  flatlist: {
    alignSelf: "center",
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
    width: width / 2.5,
    height: 40,
  },
  designView: {
    margin: 10,
    width: width - 15,
    height: width - 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    backgroundColor: Color.white,
  },
  colorCodeList: {
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  colorCode: {
    height: 25,
    width: 25,
    borderRadius: 20,
    marginVertical: 10,
    marginHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
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
  plusButton: {
    marginTop: 10,
    marginLeft: 10,
    padding: 2,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },

  //common personal layout styles
  layViewIconRoot: {
    flexDirection: "row",
    alignItems: "center",
  },
  layViewIcon: {
    padding: Constant.layIconViewPadding,
    borderRadius: Constant.layIconViewBorderRadius,
    overflow: "hidden",
  },
  layTxtIcon: {
    fontSize: Constant.laySmallFontSize,
    paddingLeft: wp(0.5),
  },
  layBigTxtIcon: {
    fontSize: Constant.layBigFontSize,
    marginLeft: wp(0.5),
  },
  layViewSocialIconRoot: {
    marginRight: wp(0.5),
    alignContent: "center",
    alignItems: "center",
  },

  // layout-1 styles
  lay1ViewFooter: {
    width: "100%",
    height: "14.70%",
    bottom: 0,
    position: "absolute",
  },
  lay1ViewName: {
    width: "100%",
    position: "absolute",
    top: "10%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  lay1TxtName: { fontSize: Constant.layBigFontSize },
  lay1TxtDesignation: {
    fontSize: Constant.laySmallFontSize,
    marginLeft: wp(1.35),
  },
  lay1ViewWebsiteEmail: {
    position: "absolute",
    top: "41%",
    left: "2.50%",
    width: "95%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lay1ViewMobile: {
    position: "absolute",
    left: "2.50%",
    bottom: "7%",
    flexDirection: "row",
    alignItems: "center",
  },
  lay1ViewSocialMedia: {
    bottom: "7%",
    right: "2.50%",
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },

  //layout-2 styles
  lay2ViewFooter: {
    width: "100%",
    height: "10.50%",
    bottom: 0,
    position: "absolute",
  },
  lay2ImgUser: {
    left: "1.93%",
    position: "absolute",
    bottom: 0,
    width: "16.67%",
    height: "160%",
  },
  lay2TxtName: {
    fontSize: Constant.layBigFontSize,
    left: "21%",
    position: "absolute",
    top: "15%",
  },
  lay2TxtDesignation: {
    fontSize: Constant.laySmallFontSize,
    left: "21%",
    position: "absolute",
    bottom: "7%",
  },
  lay2ViewSocialMedia: {
    bottom: "7%",
    right: "2.50%",
    position: "absolute",
    alignItems: "center",
    flexDirection: "row",
  },

  // layout-3 styles
  lay3ViewFooter: {
    width: "100%",
    height: "10.50%",
    bottom: 0,
    position: "absolute",
  },
  lay3ImgUser: {
    right: "1.93%",
    position: "absolute",
    bottom: 0,
    width: "16.67%",
    height: "160%",
  },
  lay3TxtName: {
    fontSize: Constant.layBigFontSize,
    right: "21%",
    position: "absolute",
    top: "15%",
  },
  lay3TxtDesignation: {
    fontSize: Constant.laySmallFontSize,
    right: "21%",
    position: "absolute",
    bottom: "7%",
  },
  lay3ViewSocialMedia: {
    bottom: "7%",
    left: "2.50%",
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },

  //layout-4 styles
  lay4ViewFooter: {
    width: "100%",
    height: "10.50%",
    bottom: 0,
    position: "absolute",
  },
  lay4ViewNameDesignation: {
    width: "100%",
    position: "absolute",
    top: "10%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  lay4TxtName: { fontSize: Constant.layBigFontSize },
  lay4TxtDesignation: {
    fontSize: Constant.laySmallFontSize,
    marginLeft: wp(1.35),
  },
  lay4ViewWebsite: {
    bottom: "9%",
    left: "2.50%",
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  lay4ViewSocialMedia: {
    bottom: "9%",
    right: "2.50%",
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },

  // layout-6 styles other styles same as layout-2
  lay6ViewMobile: {
    position: "absolute",
    right: "2.50%",
    top: "15%",
    flexDirection: "row",
    alignItems: "center",
  },

  // layout-7 styles other styles same as layout-3
  lay7ViewMobile: {
    position: "absolute",
    left: "2.50%",
    top: "15%",
    flexDirection: "row",
    alignItems: "center",
  },
});
