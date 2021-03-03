import { toJS } from "mobx";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
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
import { SvgCss, SvgUri } from "react-native-svg";
import { inject, observer } from "mobx-react";
import * as MediaLibrary from "expo-media-library";
import * as Permissions from "expo-permissions";
import * as Sharing from "expo-sharing";
import { useMutation } from "@apollo/client";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
// relative path
import Icon from "../../components/svgIcons";
import Color from "../../utils/Color";
import Common from "../../utils/Common";
import Constant from "../../utils/Constant";
import Button from "../../components/Button";
import LangKey from "../../utils/LangKey";
import GraphqlQuery from "../../utils/GraphqlQuery";
import FastImage from "react-native-fast-image";
import PopUp from "../../components/PopUp";
import SvgConstant from "../../utils/SvgConstant";
import Text from "../../components/MuktaText";
import { el } from "date-fns/locale";

const { width } = Dimensions.get("window");
let isShareClick = false;

let msg = "";

const BussinessDesign = ({ route, designStore, userStore, navigation }) => {
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
  const [visiblePicker, setVisiblePicker] = useState(false);

  const toggleVisibleColorPicker = () => {
    return setVisiblePicker(!visiblePicker);
  };

  // const [visibleModalMsg, setVisibleModalMsg] = useState(false);
  // const toggleVisibleMsg = () => {
  //   setVisibleModalMsg(!visibleModalMsg);
  // };
  const [visibleModalMsgbussiness, setVisibleModalMsgbussiness] = useState(
    false
  );
  const toggleVisibleMsgBussiness = () => {
    setVisibleModalMsgbussiness(!visibleModalMsgbussiness);
  };

  const [hasPro, sethasPro] = useState(false);
  const [designs, setDesigns] = useState([]);
  const [currentDesign, setCurrentDesign] = useState(curDesign);
  const [selectedTab, setSelectedTab] = useState(0);
  const [userDataBussiness, setUserDataBussiness] = useState();

  const [layouts, setLayouts] = useState([]);

  const [currentLayout, setCurrentLayout] = useState(null);

  const [socialIconList, setSocialIconList] = useState(
    Constant.defSocialIconList
  );

  const [footerColor, setFooterColor] = useState();
  const [footerTextColor, setFooterTextColor] = useState(Color.black);

  const isMountedRef = Common.useIsMountedRef();

  const fiilterLayouts = () => {
    let filterArr = allLayouts.filter(
      (item) =>
        item.layoutType === Constant.layoutTypeBUSINESS ||
        item.layoutType === Constant.layoutTypeALL
    );

    console.log("filterArr", filterArr);
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
          (ele.designType === Constant.designTypeBUSINESS ||
            ele.designType === Constant.designTypeALL)
      );

      setDesigns(filterArr);
    }
  }, []);

  useEffect(() => {
    isMountedRef.current && sethasPro(userStore.hasPro);
  }, [userStore.hasPro]);

  //setting layoutFields to JSX object
  // const objFooter = currentLayout?.layoutFields?.footer
  //   ? Common.convertStringToObject(currentLayout?.layoutFields?.footer)
  //   : undefined;
  // const objName = currentLayout?.layoutFields?.name
  //   ? Common.convertStringToObject(currentLayout?.layoutFields?.name)
  //   : undefined;
  // const objMobile = currentLayout?.layoutFields?.mobile
  //   ? Common.convertStringToObject(currentLayout?.layoutFields?.mobile)
  //   : undefined;
  // const objDesignation = currentLayout?.layoutFields?.designation
  //   ? Common.convertStringToObject(currentLayout?.layoutFields?.designation)
  //   : undefined;
  // const objAddress = currentLayout?.layoutFields?.address
  //   ? Common.convertStringToObject(currentLayout?.layoutFields?.address)
  //   : undefined;
  // const objImage = currentLayout?.layoutFields?.image
  //   ? Common.convertStringToObject(currentLayout?.layoutFields?.image)
  //   : undefined;
  // const objSocialMediaView = currentLayout?.layoutFields?.socialMediaView
  //   ? Common.convertStringToObject(currentLayout?.layoutFields?.socialMediaView)
  //   : undefined;
  // const objSocialMediaLabel = currentLayout?.layoutFields?.socialMediaLabel
  //   ? Common.convertStringToObject(
  //       currentLayout?.layoutFields?.socialMediaLabel
  //     )
  //   : undefined;
  // const objSocialMediaName = currentLayout?.layoutFields?.socialMediaName
  //   ? Common.convertStringToObject(currentLayout?.layoutFields?.socialMediaName)
  //   : undefined;
  // const objSocialIcon = currentLayout?.layoutFields?.socialIcon
  //   ? Common.convertStringToObject(currentLayout?.layoutFields?.socialIcon)
  //   : undefined;

  useEffect(() => {
    if (isMountedRef.current) {
      console.log("user", user);
      setUserDataBussiness(
        user && user != null
          ? {
              name:
                user?.userInfo?.business?.name && user.userInfo.business.name,

              mobile:
                user?.userInfo?.business?.mobile &&
                user.userInfo.business.mobile,

              address:
                user?.userInfo?.business?.address &&
                user.userInfo.business.address,

              email:
                user?.userInfo?.business?.email && user.userInfo.business.email,

              website:
                user?.userInfo?.business?.website &&
                user.userInfo.business.website,

              socialMedia:
                user?.userInfo?.business?.socialMediaId &&
                user.userInfo.business.socialMediaId,

              image:
                user?.userInfo?.business.image.length > 0
                  ? user?.userInfo?.business.image.find(
                      (item) => item.isDefault === true
                    ).url
                  : null,
            }
          : Constant.dummyCompnyData[0]
      );
    }
  }, [userStore.user]);

  useEffect(() => {
    fiilterLayouts();
  }, [userDataBussiness]);

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
      const { data, errors } = await addUserDesign({
        variables: { designId: currentDesign.id },
      });

      if (data !== null && !errors) {
        userStore.updateCurrantDesignCredit(currentDesignCredit - 1);
      } else if (errors && errors !== null && errors.length > 0) {
        Common.showMessage(errors[0].message);
        return;
      }

      const uri = await viewRef.current.capture();
      console.log("uri", uri);

      if (Platform.OS === "android") {
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

  const plusBTN = () => {
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => setVisiblePicker(true)}
        style={styles.plusButton}
      >
        <Icon name="plus" fill={Color.white} height={15} width={15} />
      </TouchableOpacity>
    );
  };

  const checkLayout = (layouts) => {
    if (userDataBussiness) {
      let isSet = false;
      layouts.some((layout) => {
        switch (layout.id) {
          case Constant.businessLay1Id:
            if (
              userDataBussiness.name &&
              userDataBussiness.name !== "" &&
              userDataBussiness.address &&
              userDataBussiness.address !== "" &&
              userDataBussiness.mobile &&
              userDataBussiness.mobile !== "" &&
              userDataBussiness.socialMedia &&
              userDataBussiness.socialMedia !== ""
            ) {
              setCurrentLayout(layout);
              isSet = true;
              return true;
            }
            break;
          case Constant.businessLay2Id:
            if (
              userDataBussiness.name &&
              userDataBussiness.name !== "" &&
              userDataBussiness.address &&
              userDataBussiness.address !== "" &&
              userDataBussiness.mobile &&
              userDataBussiness.mobile !== "" &&
              userDataBussiness.socialMedia &&
              userDataBussiness.socialMedia !== ""
            ) {
              setCurrentLayout(layout);
              isSet = true;
              return true;
            }
            break;
          case Constant.businessLay3Id:
            if (
              userDataBussiness.name &&
              userDataBussiness.name !== "" &&
              userDataBussiness.mobile &&
              userDataBussiness.mobile !== "" &&
              userDataBussiness.website &&
              userDataBussiness.website !== "" &&
              userDataBussiness.socialMedia &&
              userDataBussiness.socialMedia !== ""
            ) {
              setCurrentLayout(layout);
              isSet = true;
            }
            break;
          case Constant.businessLay4Id:
            if (
              userDataBussiness.name &&
              userDataBussiness.name !== "" &&
              userDataBussiness.mobile &&
              userDataBussiness.mobile !== "" &&
              userDataBussiness.website &&
              userDataBussiness.website !== "" &&
              userDataBussiness.email &&
              userDataBussiness.email !== "" &&
              userDataBussiness.socialMedia &&
              userDataBussiness.socialMedia !== ""
            ) {
              setCurrentLayout(layout);
              isSet = true;
              return true;
            }
            break;
          case Constant.businessLay5Id:
            if (
              userDataBussiness.name &&
              userDataBussiness.name !== "" &&
              userDataBussiness.mobile &&
              userDataBussiness.mobile !== "" &&
              userDataBussiness.email &&
              userDataBussiness.email !== "" &&
              userDataBussiness.socialMedia &&
              userDataBussiness.socialMedia !== ""
            ) {
              setCurrentLayout(layout);
              isSet = true;
              return true;
            }
            break;
          case Constant.businessLay6Id:
            if (
              userDataBussiness.name &&
              userDataBussiness.name !== "" &&
              userDataBussiness.address &&
              userDataBussiness.address !== "" &&
              userDataBussiness.mobile &&
              userDataBussiness.mobile !== "" &&
              userDataBussiness.website &&
              userDataBussiness.website !== "" &&
              userDataBussiness.socialMedia &&
              userDataBussiness.socialMedia !== ""
            ) {
              setCurrentLayout(layout);
              isSet = true;
              return true;
            }
            break;
          case Constant.businessLay7Id:
            if (
              userDataBussiness.name &&
              userDataBussiness.name !== "" &&
              userDataBussiness.mobile &&
              userDataBussiness.mobile !== "" &&
              userDataBussiness.website &&
              userDataBussiness.website !== "" &&
              userDataBussiness.socialMedia &&
              userDataBussiness.socialMedia !== ""
            ) {
              setCurrentLayout(layout);
              isSet = true;
              return true;
            }
            break;
          case Constant.businessLay8Id:
            if (
              userDataBussiness.name &&
              userDataBussiness.name !== "" &&
              userDataBussiness.mobile &&
              userDataBussiness.mobile !== "" &&
              userDataBussiness.email &&
              userDataBussiness.email !== "" &&
              userDataBussiness.socialMedia &&
              userDataBussiness.socialMedia !== ""
            ) {
              setCurrentLayout(layout);
              isSet = true;
              return true;
            }
            break;
          case Constant.businessLay9Id:
            if (
              userDataBussiness.name &&
              userDataBussiness.name !== "" &&
              userDataBussiness.website &&
              userDataBussiness.website !== "" &&
              userDataBussiness.mobile &&
              userDataBussiness.mobile !== "" &&
              userDataBussiness.socialMedia &&
              userDataBussiness.socialMedia !== ""
            ) {
              setCurrentLayout(layout);
              isSet = true;
              return true;
            }
            break;
          case Constant.businessLay10Id:
            if (
              userDataBussiness.name &&
              userDataBussiness.name !== "" &&
              userDataBussiness.email &&
              userDataBussiness.email !== "" &&
              userDataBussiness.mobile &&
              userDataBussiness.mobile !== "" &&
              userDataBussiness.socialMedia &&
              userDataBussiness.socialMedia !== ""
            ) {
              setCurrentLayout(layout);
              isSet = true;
              return true;
            }
            break;
        }
      });

      if (isSet == false && curScreen === Constant.navBusinessProfile) {
        msg = Common.getTranslation(LangKey.nolayoutBussiness);
        setVisibleModalMsgbussiness(true);
      }
    }
  };

  const checkAndSetLayout = (layout) => {
    console.log("layout_id", layout.id);
    switch (layout.id) {
      case Constant.businessLay1Id:
        if (
          !userDataBussiness.name ||
          userDataBussiness.name === "" ||
          !userDataBussiness.address ||
          userDataBussiness.address === "" ||
          !userDataBussiness.mobile ||
          userDataBussiness.mobile === "" ||
          !userDataBussiness.socialMedia ||
          userDataBussiness.socialMedia === ""
        ) {
          msg = Common.getTranslation(LangKey.businessLay1Msg);
          setVisibleModalMsgbussiness(true);
        } else {
          setCurrentLayout(layout);
        }
        break;
      case Constant.businessLay2Id:
        if (
          !userDataBussiness.name ||
          userDataBussiness.name === "" ||
          !userDataBussiness.address ||
          userDataBussiness.address === "" ||
          !userDataBussiness.mobile ||
          userDataBussiness.mobile === "" ||
          !userDataBussiness.socialMedia ||
          userDataBussiness.socialMedia === ""
        ) {
          msg = Common.getTranslation(LangKey.businessLay2Msg);
          setVisibleModalMsgbussiness(true);
        } else {
          setCurrentLayout(layout);
        }
        break;
      case Constant.businessLay3Id:
        if (
          !userDataBussiness.name ||
          userDataBussiness.name === "" ||
          !userDataBussiness.mobile ||
          userDataBussiness.mobile === "" ||
          !userDataBussiness.website ||
          userDataBussiness.website === "" ||
          !userDataBussiness.socialMedia ||
          userDataBussiness.socialMedia === ""
        ) {
          msg = Common.getTranslation(LangKey.businessLay3Msg);
          setVisibleModalMsgbussiness(true);
        } else {
          setCurrentLayout(layout);
        }
        break;
      case Constant.businessLay4Id:
        if (
          !userDataBussiness.name ||
          userDataBussiness.name === "" ||
          !userDataBussiness.mobile ||
          userDataBussiness.mobile === "" ||
          !userDataBussiness.website ||
          userDataBussiness.website === "" ||
          !userDataBussiness.email ||
          userDataBussiness.email === "" ||
          !userDataBussiness.socialMedia ||
          userDataBussiness.socialMedia === ""
        ) {
          msg = Common.getTranslation(LangKey.businessLay4Msg);
          setVisibleModalMsgbussiness(true);
        } else {
          setCurrentLayout(layout);
        }
        break;
      case Constant.businessLay5Id:
        if (
          !userDataBussiness.name ||
          userDataBussiness.name === "" ||
          !userDataBussiness.mobile ||
          userDataBussiness.mobile === "" ||
          !userDataBussiness.email ||
          userDataBussiness.email === "" ||
          !userDataBussiness.socialMedia ||
          userDataBussiness.socialMedia === ""
        ) {
          msg = Common.getTranslation(LangKey.businessLay5Msg);
          setVisibleModalMsgbussiness(true);
        } else {
          setCurrentLayout(layout);
        }
        break;
      case Constant.businessLay6Id:
        if (
          !userDataBussiness.name ||
          userDataBussiness.name === "" ||
          !userDataBussiness.mobile ||
          userDataBussiness.mobile === "" ||
          !userDataBussiness.website ||
          userDataBussiness.website === "" ||
          !userDataBussiness.address ||
          userDataBussiness.address === "" ||
          !userDataBussiness.socialMedia ||
          userDataBussiness.socialMedia === ""
        ) {
          msg = Common.getTranslation(LangKey.businessLay6Msg);
          setVisibleModalMsgbussiness(true);
        } else {
          setCurrentLayout(layout);
        }
        break;
      case Constant.businessLay7Id:
        if (
          !userDataBussiness.name ||
          userDataBussiness.name === "" ||
          !userDataBussiness.mobile ||
          userDataBussiness.mobile === "" ||
          !userDataBussiness.website ||
          userDataBussiness.website === "" ||
          !userDataBussiness.socialMedia ||
          userDataBussiness.socialMedia === ""
        ) {
          msg = Common.getTranslation(LangKey.businessLay7Msg);
          setVisibleModalMsgbussiness(true);
        } else {
          setCurrentLayout(layout);
        }
        break;
      case Constant.businessLay8Id:
        if (
          !userDataBussiness.name ||
          userDataBussiness.name === "" ||
          !userDataBussiness.mobile ||
          userDataBussiness.mobile === "" ||
          !userDataBussiness.email ||
          userDataBussiness.email === "" ||
          !userDataBussiness.socialMedia ||
          userDataBussiness.socialMedia === ""
        ) {
          msg = Common.getTranslation(LangKey.businessLay8Msg);
          setVisibleModalMsgbussiness(true);
        } else {
          setCurrentLayout(layout);
        }
        break;
      case Constant.businessLay9Id:
        if (
          !userDataBussiness.name ||
          userDataBussiness.name === "" ||
          !userDataBussiness.mobile ||
          userDataBussiness.mobile === "" ||
          !userDataBussiness.website ||
          userDataBussiness.website === "" ||
          !userDataBussiness.socialMedia ||
          userDataBussiness.socialMedia === ""
        ) {
          msg = Common.getTranslation(LangKey.businessLay9Msg);
          setVisibleModalMsgbussiness(true);
        } else {
          setCurrentLayout(layout);
        }
        break;
      case Constant.businessLay10Id:
        if (
          !userDataBussiness.name ||
          userDataBussiness.name === "" ||
          !userDataBussiness.mobile ||
          userDataBussiness.mobile === "" ||
          !userDataBussiness.email ||
          userDataBussiness.email === "" ||
          !userDataBussiness.socialMedia ||
          userDataBussiness.socialMedia === ""
        ) {
          msg = Common.getTranslation(LangKey.businessLay10Msg);
          setVisibleModalMsgbussiness(true);
        } else {
          setCurrentLayout(layout);
        }
        break;
    }
  };

  const getLayout = () => {
    switch (currentLayout.id) {
      case Constant.businessLay1Id:
        return getLayout1();
        break;
      case Constant.businessLay2Id:
        return getLayout2();
        break;
      case Constant.businessLay3Id:
        return getLayout3();
        break;
      case Constant.businessLay4Id:
        return getLayout4();
        break;
      case Constant.businessLay5Id:
        return getLayout5();
        break;
      case Constant.businessLay6Id:
        return getLayout6();
        break;
      case Constant.businessLay7Id:
        return getLayout7();
        break;
      case Constant.businessLay8Id:
        return getLayout8();
        break;
      case Constant.businessLay9Id:
        return getLayout9();
        break;
      case Constant.businessLay10Id:
        return getLayout10();
        break;
    }
  };

  /*
  .##..........###....##....##..#######..##.....##.########..######.
  .##.........##.##....##..##..##.....##.##.....##....##....##....##
  .##........##...##....####...##.....##.##.....##....##....##......
  .##.......##.....##....##....##.....##.##.....##....##.....######.
  .##.......#########....##....##.....##.##.....##....##..........##
  .##.......##.....##....##....##.....##.##.....##....##....##....##
  .########.##.....##....##.....#######...#######.....##.....######.
  */

  const getLayout1 = () => (
    <View style={styles.lay1ViewFooter}>
      <SvgCss
        xml={SvgConstant.footerBusinessLayout1}
        width="100%"
        height="100%"
        fill={footerColor}
      />

      <FastImage
        source={{ uri: userDataBussiness.image }}
        style={styles.lay1ImgLogo}
        resizeMode={FastImage.resizeMode.contain}
      />

      <Text
        style={[
          styles.lay1TxtName,
          {
            color: footerTextColor,
            position: "absolute",
            left: "23%",
            top: "22%",
          },
        ]}
      >
        {userDataBussiness.name}
      </Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          position: "absolute",
          top: "50%",
          left: "23%",
          width: "70%",
        }}
      >
        <View
          style={[styles.layViewIcon, { backgroundColor: footerTextColor }]}
        >
          <Icon
            name="lock"
            height={Constant.layIconHeight}
            width={Constant.layIconWidth}
            fill={footerColor}
          />
        </View>
        <Text style={[styles.lay1TxtAddress, { color: footerTextColor }]}>
          {userDataBussiness.address}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          bottom: "5%",
          left: "23%",
        }}
      >
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
        <Text
          style={[
            styles.lay1TxtMobile,
            { color: footerTextColor, paddingLeft: wp(1) },
          ]}
        >
          {userDataBussiness.mobile}
        </Text>
      </View>

      <View
        style={[
          styles.lay1ViewSocialMedia,
          {
            color: footerTextColor,
            bottom: "5%",
            right: "2%",
            position: "absolute",
          },
        ]}
      >
        {socialIconList.map((item) => (
          <View
            style={{
              padding: Constant.layIconViewPadding,
              borderRadius: Constant.layIconViewBorderRadius,
              marginRight: wp(0.5),
              alignContent: "center",
              alignItems: "center",
              backgroundColor: footerTextColor,
            }}
          >
            <Icon
              key={item}
              name={item}
              height={Constant.layIconHeight}
              width={Constant.layIconWidth}
              fill={footerColor}
            />
          </View>
        ))}

        <Text
          style={[
            { fontSize: Constant.laySmallFontSize },
            { color: footerTextColor, paddingLeft: wp(0.5) },
          ]}
        >
          {userDataBussiness.socialMedia}
        </Text>
      </View>
    </View>
  );
  const getLayout2 = () => (
    <View style={styles.lay2ViewFooter}>
      <SvgCss
        xml={SvgConstant.footerBusinessLayout2}
        width="100%"
        height="100%"
        fill={footerColor}
      />

      <Text
        style={[
          styles.lay2TxtName,
          {
            color: footerTextColor,
            right: "25%",
            position: "absolute",
            top: "25%",
          },
        ]}
      >
        {userDataBussiness.name}
      </Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
          right: "25%",
          position: "absolute",
          top: "53%",
        }}
      >
        <Text style={[styles.lay2TxtAddress, { color: footerTextColor }]}>
          {userDataBussiness.address}
        </Text>
        <View
          style={[
            styles.layViewIcon,
            { backgroundColor: footerTextColor, marginLeft: wp(1) },
          ]}
        >
          <Icon
            name="lock"
            height={Constant.layIconHeight}
            width={Constant.layIconWidth}
            fill={footerColor}
          />
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          bottom: "5%",
          left: "1%",
          position: "absolute",
        }}
      >
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
        <Text
          style={[
            styles.lay2TxtMobile,
            { color: footerTextColor, paddingLeft: wp(2) },
          ]}
        >
          {userDataBussiness.mobile}
        </Text>
      </View>
      <View
        style={[
          styles.lay2ViewSocialMedia,
          {
            color: footerTextColor,
            bottom: "5%",
            right: "25%",
            position: "absolute",
          },
        ]}
      >
        {socialIconList.map((item) => (
          <View
            style={{
              padding: Constant.layIconViewPadding,
              borderRadius: Constant.layIconViewBorderRadius,
              marginRight: wp(0.5),
              alignContent: "center",
              alignItems: "center",
              backgroundColor: footerTextColor,
            }}
          >
            <Icon
              key={item}
              name={item}
              height={Constant.layIconHeight}
              width={Constant.layIconWidth}
              fill={footerColor}
            />
          </View>
        ))}

        <Text
          style={[
            { fontSize: Constant.laySmallFontSize },
            { color: footerTextColor, paddingLeft: wp(1) },
          ]}
        >
          {userDataBussiness.socialMedia}
        </Text>
      </View>

      <FastImage
        source={{ uri: userDataBussiness.image }}
        style={styles.lay2ImgLogo}
        resizeMode={FastImage.resizeMode.contain}
      />
    </View>
  );

  const getLayout3 = () => (
    <View style={styles.lay3ViewFooter}>
      <SvgCss
        xml={SvgConstant.footerPersonalLayout1}
        width="100%"
        height="100%"
        fill={footerColor}
      />

      <Text
        style={[
          styles.lay3TxtName,
          {
            color: footerTextColor,
            position: "absolute",
            left: "2%",
            top: "12%",
          },
        ]}
      >
        {userDataBussiness.name}
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          left: "2%",
          position: "absolute",
          bottom: "5%",
        }}
      >
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
        <Text style={[styles.lay3TxtWebsite, { color: footerTextColor }]}>
          {userDataBussiness.website}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          top: "45%",
          left: "2%",
          position: "absolute",
        }}
      >
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
        <Text
          style={[
            styles.lay3TxtMobile,
            { color: footerTextColor, paddingLeft: wp(2) },
          ]}
        >
          {userDataBussiness.mobile}
        </Text>
      </View>
      <View
        style={[
          styles.lay3ViewSocialMedia,
          {
            color: footerTextColor,
            bottom: "8%",
            right: "2%",
            position: "absolute",
          },
        ]}
      >
        {socialIconList.map((item) => (
          <View
            style={{
              padding: Constant.layIconViewPadding,
              borderRadius: Constant.layIconViewBorderRadius,
              marginRight: wp(0.5),
              alignContent: "center",
              alignItems: "center",
              backgroundColor: footerTextColor,
            }}
          >
            <Icon
              key={item}
              name={item}
              height={Constant.layIconHeight}
              width={Constant.layIconWidth}
              fill={footerColor}
            />
          </View>
        ))}

        <Text
          style={[
            { fontSize: Constant.laySmallFontSize },
            { color: footerTextColor, paddingLeft: wp(1) },
          ]}
        >
          {userDataBussiness.socialMedia}
        </Text>
      </View>
    </View>
  );
  const getLayout4 = () => (
    <View style={styles.lay4ViewFooter}>
      <SvgCss
        xml={SvgConstant.footerPersonalLayout1}
        width="100%"
        height="100%"
        fill={footerColor}
      />

      <View style={styles.lay1ViewName}>
        <Text style={[styles.lay1TxtName, { color: footerTextColor }]}>
          {userDataBussiness.name}
        </Text>

        <Text style={[styles.lay1TxtDesignation, { color: footerTextColor }]}>
          {userDataBussiness.designation}
        </Text>
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
          <Text style={[styles.layTxtIcon, { color: footerTextColor }]}>
            {userDataBussiness.website}
          </Text>
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
          <Text style={[styles.layTxtIcon, { color: footerTextColor }]}>
            {userDataBussiness.email}
          </Text>
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

          <Text style={[styles.layTxtIcon, { color: footerTextColor }]}>
            {userDataBussiness.mobile}
          </Text>
        </View>
      </View>
      <View
        style={[
          styles.lay5ViewSocialMedia,
          {
            color: footerTextColor,
            position: "absolute",
            bottom: "9%",
            right: "2%",
          },
        ]}
      >
        {socialIconList.map((item) => (
          <View
            style={{
              padding: Constant.layIconViewPadding,
              borderRadius: Constant.layIconViewBorderRadius,
              marginRight: wp(0.5),
              alignContent: "center",
              alignItems: "center",
              backgroundColor: footerTextColor,
            }}
          >
            <Icon
              key={item}
              name={item}
              height={Constant.layIconHeight}
              width={Constant.layIconWidth}
              fill={footerColor}
            />
          </View>
        ))}

        <Text
          style={[
            { fontSize: Constant.laySmallFontSize },
            { color: footerTextColor, paddingLeft: wp(1) },
          ]}
        >
          {userDataBussiness.socialMedia}
        </Text>
      </View>
    </View>
  );
  const getLayout5 = () => (
    <View style={styles.lay5ViewFooter}>
      <SvgCss
        xml={SvgConstant.footerPersonalLayout1}
        width="100%"
        height="100%"
        fill={footerColor}
      />

      <Text
        style={[
          styles.lay5TxtName,
          {
            color: footerTextColor,
            left: "2%",
            position: "absolute",
            top: "12%",
          },
        ]}
      >
        {userDataBussiness.name}
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          position: "absolute",
          left: "2%",
          bottom: "5%",
        }}
      >
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
        <Text style={[styles.lay5TxtEmail, { color: footerTextColor }]}>
          {userDataBussiness.email}
        </Text>
      </View>

      <View
        style={{
          position: "absolute",
          top: "45%",
          left: "2%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
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
        <Text
          style={[
            styles.lay5TxtMobile,
            { color: footerTextColor, paddingLeft: wp(2) },
          ]}
        >
          {userDataBussiness.mobile}
        </Text>
      </View>
      <View
        style={[
          styles.lay5ViewSocialMedia,
          {
            color: footerTextColor,
            position: "absolute",
            bottom: "8%",
            right: "2%",
          },
        ]}
      >
        {socialIconList.map((item) => (
          <View
            style={{
              padding: Constant.layIconViewPadding,
              borderRadius: Constant.layIconViewBorderRadius,
              marginRight: wp(0.5),
              alignContent: "center",
              alignItems: "center",
              backgroundColor: footerTextColor,
            }}
          >
            <Icon
              key={item}
              name={item}
              height={Constant.layIconHeight}
              width={Constant.layIconWidth}
              fill={footerColor}
            />
          </View>
        ))}

        <Text
          style={[
            { fontSize: Constant.laySmallFontSize },
            { color: footerTextColor, paddingLeft: wp(1) },
          ]}
        >
          {userDataBussiness.socialMedia}
        </Text>
      </View>
    </View>
  );
  const getLayout6 = () => (
    <View style={styles.lay6ViewFooter}>
      <SvgCss
        xml={SvgConstant.footerPersonalLayout1}
        width="100%"
        height="100%"
        fill={footerColor}
      />

      <Text
        style={[
          styles.lay6TxtName,
          {
            color: footerTextColor,
            left: "2%",
            position: "absolute",
            top: "12%",
          },
        ]}
      >
        {userDataBussiness.name}
      </Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          position: "absolute",
          left: "2%",
          top: "43%",
        }}
      >
        <View
          style={[styles.layViewIcon, { backgroundColor: footerTextColor }]}
        >
          <Icon
            name="lock"
            height={Constant.layIconHeight}
            width={Constant.layIconWidth}
            fill={footerColor}
          />
        </View>
        <Text
          style={[
            styles.lay6TxtAddress,
            { color: footerTextColor, paddingLeft: wp(1) },
          ]}
        >
          {userDataBussiness.address}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          right: "2%",
          top: "12%",
        }}
      >
        <View
          style={[
            styles.layViewIcon,
            {
              backgroundColor: footerTextColor,
            },
          ]}
        >
          <Icon
            name="phone"
            height={Constant.layIconHeight}
            width={Constant.layIconWidth}
            fill={footerColor}
          />
        </View>
        <Text
          style={[
            styles.lay6TxtMobile,
            { color: footerTextColor, paddingLeft: wp(2) },
          ]}
        >
          {userDataBussiness.mobile}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          left: "2%",
          bottom: "8%",
          position: "absolute",
        }}
      >
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
        <Text style={[styles.lay6TxtWebsite, { color: footerTextColor }]}>
          {userDataBussiness.website}
        </Text>
      </View>

      <View
        style={[
          styles.lay6ViewSocialMedia,
          {
            color: footerTextColor,
            position: "absolute",
            bottom: "8%",
            right: "2%",
          },
        ]}
      >
        {socialIconList.map((item) => (
          <View
            style={{
              padding: Constant.layIconViewPadding,
              borderRadius: Constant.layIconViewBorderRadius,
              marginRight: wp(0.5),
              alignContent: "center",
              alignItems: "center",
              backgroundColor: footerTextColor,
            }}
          >
            <Icon
              key={item}
              name={item}
              height={Constant.layIconHeight}
              width={Constant.layIconWidth}
              fill={footerColor}
            />
          </View>
        ))}

        <Text
          style={[
            { fontSize: Constant.laySmallFontSize },
            { color: footerTextColor, paddingLeft: wp(0.5) },
          ]}
        >
          {userDataBussiness.socialMedia}
        </Text>
      </View>
    </View>
  );

  const getLayout7 = () => (
    <View style={styles.lay7ViewFooter}>
      <SvgCss
        xml={SvgConstant.footerBusinessLayout7}
        width="100%"
        height="100%"
        fill={footerColor}
      />

      <FastImage
        source={{ uri: userDataBussiness.image }}
        style={styles.lay7ImgLogo}
        resizeMode={FastImage.resizeMode.contain}
      />

      <Text
        style={[
          styles.lay1TxtName,
          {
            color: footerTextColor,
            position: "absolute",
            left: "23%",
            top: "25%",
          },
        ]}
      >
        {userDataBussiness.name}
      </Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          left: "23%",
          top: "53%",
          position: "absolute",
        }}
      >
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
        <Text style={[styles.lay7TxtWebsite, { color: footerTextColor }]}>
          {userDataBussiness.website}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          bottom: "5%",
          left: "23%",
        }}
      >
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
        <Text
          style={[
            styles.lay1TxtMobile,
            { color: footerTextColor, paddingLeft: wp(1) },
          ]}
        >
          {userDataBussiness.mobile}
        </Text>
      </View>

      <View
        style={[
          styles.lay1ViewSocialMedia,
          {
            color: footerTextColor,
            bottom: "5%",
            right: "2%",
            position: "absolute",
          },
        ]}
      >
        {socialIconList.map((item) => (
          <View
            style={{
              padding: Constant.layIconViewPadding,
              borderRadius: Constant.layIconViewBorderRadius,
              marginRight: wp(0.5),
              alignContent: "center",
              alignItems: "center",
              backgroundColor: footerTextColor,
            }}
          >
            <Icon
              key={item}
              name={item}
              height={Constant.layIconHeight}
              width={Constant.layIconWidth}
              fill={footerColor}
            />
          </View>
        ))}

        <Text
          style={[
            { fontSize: Constant.laySmallFontSize },
            { color: footerTextColor, paddingLeft: wp(0.5) },
          ]}
        >
          {userDataBussiness.socialMedia}
        </Text>
      </View>
    </View>
  );
  const getLayout8 = () => (
    <View style={styles.lay8ViewFooter}>
      <SvgCss
        xml={SvgConstant.footerBusinessLayout8}
        width="100%"
        height="100%"
        fill={footerColor}
      />

      <FastImage
        source={{ uri: userDataBussiness.image }}
        style={styles.lay8ImgLogo}
        resizeMode={FastImage.resizeMode.contain}
      />

      <Text
        style={[
          styles.lay8TxtName,
          {
            color: footerTextColor,
            position: "absolute",
            left: "23%",
            top: "25%",
          },
        ]}
      >
        {userDataBussiness.name}
      </Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          position: "absolute",
          left: "23%",
          top: "53%",
        }}
      >
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
        <Text style={[styles.lay5TxtEmail, { color: footerTextColor }]}>
          {userDataBussiness.email}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          bottom: "5%",
          left: "23%",
        }}
      >
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
        <Text
          style={[
            styles.lay8TxtMobile,
            { color: footerTextColor, paddingLeft: wp(1) },
          ]}
        >
          {userDataBussiness.mobile}
        </Text>
      </View>

      <View
        style={[
          styles.lay8ViewSocialMedia,
          {
            color: footerTextColor,
            bottom: "5%",
            right: "2%",
            position: "absolute",
          },
        ]}
      >
        {socialIconList.map((item) => (
          <View
            style={{
              padding: Constant.layIconViewPadding,
              borderRadius: Constant.layIconViewBorderRadius,
              marginRight: wp(0.5),
              alignContent: "center",
              alignItems: "center",
              backgroundColor: footerTextColor,
            }}
          >
            <Icon
              key={item}
              name={item}
              height={Constant.layIconHeight}
              width={Constant.layIconWidth}
              fill={footerColor}
            />
          </View>
        ))}

        <Text
          style={[
            { fontSize: Constant.laySmallFontSize },
            { color: footerTextColor, paddingLeft: wp(0.5) },
          ]}
        >
          {userDataBussiness.socialMedia}
        </Text>
      </View>
    </View>
  );

  const getLayout9 = () => (
    <View style={styles.lay9ViewFooter}>
      <SvgCss
        xml={SvgConstant.footerBusinessLayout2}
        width="100%"
        height="100%"
        fill={footerColor}
      />

      <Text
        style={[
          styles.lay9TxtName,
          {
            color: footerTextColor,
            right: "25%",
            position: "absolute",
            top: "28%",
          },
        ]}
      >
        {userDataBussiness.name}
      </Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          right: "25%",
          top: "53%",
          position: "absolute",
        }}
      >
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
        <Text style={[styles.lay9TxtWebsite, { color: footerTextColor }]}>
          {userDataBussiness.website}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          bottom: "5%",
          left: "2%",
          position: "absolute",
        }}
      >
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
        <Text
          style={[
            styles.lay9TxtMobile,
            { color: footerTextColor, paddingLeft: wp(2) },
          ]}
        >
          {userDataBussiness.mobile}
        </Text>
      </View>
      <View
        style={[
          styles.lay9ViewSocialMedia,
          {
            color: footerTextColor,
            bottom: "5%",
            right: "25%",
            position: "absolute",
          },
        ]}
      >
        {socialIconList.map((item) => (
          <View
            style={{
              padding: Constant.layIconViewPadding,
              borderRadius: Constant.layIconViewBorderRadius,
              marginRight: wp(0.5),
              alignContent: "center",
              alignItems: "center",
              backgroundColor: footerTextColor,
            }}
          >
            <Icon
              key={item}
              name={item}
              height={Constant.layIconHeight}
              width={Constant.layIconWidth}
              fill={footerColor}
            />
          </View>
        ))}

        <Text
          style={[
            { fontSize: Constant.laySmallFontSize },
            { color: footerTextColor, paddingLeft: wp(1) },
          ]}
        >
          {userDataBussiness.socialMedia}
        </Text>
      </View>

      <FastImage
        source={{ uri: userDataBussiness.image }}
        style={styles.lay9ImgLogo}
        resizeMode={FastImage.resizeMode.contain}
      />
    </View>
  );
  const getLayout10 = () => (
    <View style={styles.lay9ViewFooter}>
      <SvgCss
        xml={SvgConstant.footerBusinessLayout2}
        width="100%"
        height="100%"
        fill={footerColor}
      />

      <Text
        style={[
          styles.lay9TxtName,
          {
            color: footerTextColor,
            right: "25%",
            position: "absolute",
            top: "28%",
          },
        ]}
      >
        {userDataBussiness.name}
      </Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          bottom: "5%",
          left: "2%",
          position: "absolute",
        }}
      >
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
        <Text
          style={[
            styles.lay9TxtMobile,
            { color: footerTextColor, paddingLeft: wp(2) },
          ]}
        >
          {userDataBussiness.mobile}
        </Text>
      </View>
      <View
        style={[
          styles.lay9ViewSocialMedia,
          {
            color: footerTextColor,
            bottom: "5%",
            right: "25%",
            position: "absolute",
          },
        ]}
      >
        {socialIconList.map((item) => (
          <View
            style={{
              padding: Constant.layIconViewPadding,
              borderRadius: Constant.layIconViewBorderRadius,
              marginRight: wp(0.5),
              alignContent: "center",
              alignItems: "center",
              backgroundColor: footerTextColor,
            }}
          >
            <Icon
              key={item}
              name={item}
              height={Constant.layIconHeight}
              width={Constant.layIconWidth}
              fill={footerColor}
            />
          </View>
        ))}

        <Text
          style={[
            { fontSize: Constant.laySmallFontSize },
            { color: footerTextColor, paddingLeft: wp(1) },
          ]}
        >
          {userDataBussiness.socialMedia}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          right: "25%",
          top: "53%",
          position: "absolute",
        }}
      >
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
        <Text style={[styles.lay9TxtWebsite, { color: footerTextColor }]}>
          {userDataBussiness.email}
        </Text>
      </View>

      <FastImage
        source={{ uri: userDataBussiness.image }}
        style={styles.lay9ImgLogo}
        resizeMode={FastImage.resizeMode.contain}
      />
    </View>
  );

  // key extractors
  const keyExtractor = useCallback((item) => item.id.toString(), []);
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
        <PopUp
          visible={visiblePicker}
          setPickerColor={setFooterColor}
          toggleVisibleColorPicker={toggleVisibleColorPicker}
          isPicker={true}
        />

        <PopUp
          visible={visibleModalMsgbussiness}
          toggleVisibleMsgBussiness={toggleVisibleMsgBussiness}
          isLayoutBussiness={true}
          msg={msg}
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
                {currentLayout && getLayout()}
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
                <View>
                  <FastImage
                    source={{ uri: item.layoutImage.url }}
                    style={{ width: 75, height: 75 }}
                  />
                  {currentLayout && item.id === currentLayout.id && (
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
            ListFooterComponent={plusBTN()}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                activeOpacity={0.6}
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

          <FlatList
            style={styles.socialIconList}
            data={Constant.socialIconList}
            showsHorizontalScrollIndicator={false}
            horizontal
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                activeOpacity={0.6}
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
                onPress={() =>
                  navigation.navigate(Constant.navProfile, {
                    title: Constant.titBusinessProfile,
                  })
                }
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
                disable={designs == null || designs == undefined}
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
                {Common.getTranslation(LangKey.txtDownload)}
              </Button>
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    );
  };

  return <View style={{ flex: 1 }}>{bussiness()}</View>;
};
export default inject("designStore", "userStore")(observer(BussinessDesign));

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
  designView: { marginTop: 10, width: width, height: width },
  colorCodeList: {
    marginVertical: 10,
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
    padding: 5,
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
  layTxtIcon: { fontSize: Constant.laySmallFontSize, left: 3 },
  layViewSocialIconRoot: {
    marginRight: 2,
    alignContent: "center",
    alignItems: "center",
  },

  // layout 1 styles
  lay1ViewFooter: {
    width: "100%",
    height: "18%",
    bottom: 0,
    position: "absolute",
  },
  lay1ImgLogo: {
    left: "4%",
    width: "16.67%",
    height: "83.34%",
    position: "absolute",
    bottom: "4.62%",
  },
  lay1TxtName: {
    fontSize: Constant.layBigFontSize,
  },
  lay1TxtMobile: {
    fontSize: Constant.laySmallFontSize,
  },
  lay1TxtAddress: {
    fontSize: Constant.laySmallFontSize,
    maxHeight: wp(5),
    paddingLeft: wp(1),
    lineHeight: 10,
  },
  lay1ViewName: {
    left: "2.50%",
    position: "absolute",
    top: "10%",
    flexDirection: "row",
    alignItems: "baseline",
  },

  lay1TxtDesignation: { fontSize: Constant.laySmallFontSize, left: 5 },
  lay1ViewWebsiteEmail: {
    position: "absolute",
    top: "42%",
    left: "2.50%",
    width: "95%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lay1ViewMobile: {
    position: "absolute",
    left: "2.50%",
    bottom: "9%",
    flexDirection: "row",
    alignItems: "center",
  },
  lay1ViewSocialMedia: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },

  //  layout 2
  lay2ViewFooter: {
    width: "100%",
    height: "18%",
    bottom: 0,
    position: "absolute",
  },
  lay2ImgLogo: {
    right: "6%",
    width: "16.67%",
    height: "83.34%",
    position: "absolute",
    bottom: "7%",
  },
  lay2TxtName: {
    fontSize: Constant.layBigFontSize,
    textAlign: "right",
  },
  lay2TxtMobile: {
    fontSize: Constant.laySmallFontSize,
  },
  lay2TxtAddress: {
    fontSize: Constant.laySmallFontSize,
    maxWidth: wp(70),
    lineHeight: 10,
    textAlign: "right",
  },
  lay2ViewSocialMedia: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  // layout 3 styles
  lay3ViewFooter: {
    width: "100%",
    height: "15%",
    bottom: 0,
    position: "absolute",
  },
  lay3TxtWebsite: {
    fontSize: Constant.laySmallFontSize,
    paddingLeft: wp(2),
  },
  lay3TxtName: {
    fontSize: Constant.layBigFontSize,
  },
  lay3TxtMobile: {
    fontSize: Constant.laySmallFontSize,
  },
  lay3ViewSocialMedia: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  // layout 4 styles
  lay4ViewFooter: {
    width: "100%",
    height: "15%",
    bottom: 0,
    position: "absolute",
  },
  lay4TxtWebsite: {
    fontSize: Constant.laySmallFontSize,
    paddingLeft: wp(2),
  },
  lay4TxtEmail: {
    fontSize: Constant.laySmallFontSize,
    paddingLeft: wp(2),
  },
  lay4TxtName: {
    fontSize: Constant.layBigFontSize,
  },
  lay4TxtMobile: {
    fontSize: Constant.layBigFontSize,
  },
  lay4ViewSocialMedia: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  // layout 5 styles
  lay5ViewFooter: {
    width: "100%",
    height: "15%",
    bottom: 0,
    position: "absolute",
  },
  lay5TxtEmail: {
    fontSize: Constant.laySmallFontSize,
    paddingLeft: 5,
  },
  lay5TxtName: {
    fontSize: Constant.layBigFontSize,
  },
  lay5TxtMobile: {
    fontSize: Constant.laySmallFontSize,
  },
  lay5ViewSocialMedia: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  // layout 6 styles
  lay6ViewFooter: {
    width: "100%",
    height: "15%",
    bottom: 0,
    position: "absolute",
  },
  lay6TxtEmail: {
    fontSize: Constant.laySmallFontSize,
    paddingLeft: wp(0.5),
  },
  lay6TxtName: {
    fontSize: Constant.layBigFontSize,
  },
  lay6TxtMobile: {
    fontSize: Constant.laySmallFontSize,
  },
  lay6TxtWebsite: {
    fontSize: Constant.laySmallFontSize,
    paddingLeft: wp(0.5),
  },
  lay6TxtAddress: {
    fontSize: Constant.laySmallFontSize,

    maxWidth: wp(100),
  },
  lay6ViewSocialMedia: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  // layout 7 styles
  lay7ViewFooter: {
    width: "100%",
    height: "17%",
    bottom: 0,
    position: "absolute",
  },
  lay7ImgLogo: {
    left: "4%",
    width: "16.67%",
    height: "83.34%",
    position: "absolute",
    bottom: "4.62%",
  },
  lay17TxtName: {
    fontSize: Constant.layBigFontSize,
  },
  lay7TxtMobile: {
    fontSize: Constant.laySmallFontSize,
  },
  lay7TxtAddress: {
    fontSize: Constant.laySmallFontSize,
    maxHeight: wp(5),
    paddingLeft: wp(0.5),
  },
  lay7ViewName: {
    left: "2.50%",
    position: "absolute",
    top: "10%",
    flexDirection: "row",
    alignItems: "baseline",
  },
  lay7TxtWebsite: {
    fontSize: Constant.laySmallFontSize,
    paddingLeft: wp(0.5),
  },
  // layout 8 styles
  lay8ViewFooter: {
    width: "100%",
    height: "17%",
    bottom: 0,
    position: "absolute",
  },
  lay8ImgLogo: {
    left: "4%",
    width: "16.67%",
    height: "83.34%",
    position: "absolute",
    bottom: "4.62%",
  },
  lay8TxtName: {
    fontSize: Constant.layBigFontSize,
  },
  lay8TxtMobile: {
    fontSize: Constant.laySmallFontSize,
  },
  lay8TxtAddress: {
    fontSize: Constant.laySmallFontSize,
    maxHeight: wp(5),
    paddingLeft: wp(0.5),
  },
  lay8ViewName: {
    left: "2.50%",
    position: "absolute",
    top: "10%",
    flexDirection: "row",
    alignItems: "baseline",
  },
  lay8TxtWebsite: {
    fontSize: Constant.laySmallFontSize,
    paddingLeft: wp(0.5),
  },
  lay8ViewSocialMedia: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  //  layout 9
  lay9ViewFooter: {
    width: "100%",
    height: "17.34%",
    bottom: 0,
    position: "absolute",
  },
  lay9ImgLogo: {
    right: "5.5%",
    width: "16.67%",
    height: "83.34%",
    position: "absolute",
    bottom: "7%",
  },
  lay9TxtName: {
    fontSize: Constant.layBigFontSize,
    textAlign: "right",
  },
  lay9TxtMobile: {
    fontSize: Constant.laySmallFontSize,
  },
  lay9TxtAddress: {
    fontSize: Constant.laySmallFontSize,
    maxHeight: wp(5),
    textAlign: "right",
  },
  lay9ViewSocialMedia: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  lay9TxtWebsite: {
    fontSize: Constant.laySmallFontSize,
    paddingLeft: wp(0.5),
  },
  //  layout 10
  lay10ViewFooter: {
    width: "100%",
    height: "17.34%",
    bottom: 0,
    position: "absolute",
  },
  lay10ImgLogo: {
    right: "4%",
    width: "16.67%",
    height: "83.34%",
    position: "absolute",
    bottom: "4.62%",
  },
  lay10TxtName: {
    fontSize: Constant.layBigFontSize,
    textAlign: "right",
  },
  lay10TxtAddress: {
    fontSize: Constant.laySmallFontSize,
    maxHeight: wp(5),
    textAlign: "right",
  },
  lay10ViewSocialMedia: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  lay10TxtWebsite: {
    fontSize: Constant.laySmallFontSize,
    paddingLeft: wp(0.5),
  },
  lay10TxtEmail: {
    fontSize: Constant.laySmallFontSize,
    paddingLeft: wp(0.5),
  },
});
