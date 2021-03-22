import { toJS } from "mobx";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ToastAndroid,
  Platform,
  FlatList,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
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
import FastImage from "react-native-fast-image";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomSheet from "reanimated-bottom-sheet";
import Animated from "react-native-reanimated";
import ICON from "react-native-vector-icons/MaterialCommunityIcons";

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
import Text from "../../components/MuktaText";
import { StackActions } from "@react-navigation/routers";

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

  const [visibleModalMsgbussiness, setVisibleModalMsgbussiness] = useState(
    false
  );
  const toggleVisibleMsgBussiness = () => {
    setVisibleModalMsgbussiness(!visibleModalMsgbussiness);
  };

  const [hasPro, sethasPro] = useState(false);
  const [designs, setDesigns] = useState([]);
  const [currentDesign, setCurrentDesign] = useState(curDesign);
  const [userDataBussiness, setUserDataBussiness] = useState();
  const [layouts, setLayouts] = useState([]);
  const [currentLayout, setCurrentLayout] = useState(null);
  const [socialIconList, setSocialIconList] = useState(
    Constant.defSocialIconList
  );
  const [isdesignImageLoad, setIsdesignImageLoad] = useState(false);
  const [selectedPicker, setSelectedPicker] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [footerColor, setFooterColor] = useState();
  const [footerTextColor, setFooterTextColor] = useState(Color.black);
  const isMountedRef = Common.useIsMountedRef();

  const fiilterLayouts = () => {
    let filterArr = allLayouts.filter(
      (item) =>
        item.layoutType === Constant.layoutTypeBUSINESS ||
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
    const isDownloadStartedBusiness = toJS(
      designStore.isDownloadStartedBusiness
    );
    if (isDownloadStartedBusiness && isDownloadStartedBusiness === true) {
      onClickDownload();
    }
  }, [designStore.isDownloadStartedBusiness]);

  useEffect(() => {
    AsyncStorage.getItem(Constant.prfIcons)
      .then((res) => {
        if (res && res !== null) {
          setSocialIconList(JSON.parse(res));
        }
      })
      .catch((err) => console.log(err));
  }, []);

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

  useEffect(() => {
    if (isMountedRef.current) {
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
      designStore.setIsDownloadStartedBusiness(false);
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

    if (status !== Permissions.PermissionStatus.GRANTED) {
      const { status: newStatus } = await Permissions.askAsync(
        Permissions.MEDIA_LIBRARY
      );
      if (newStatus !== Permissions.PermissionStatus.GRANTED) {
        designStore.setIsDownloadStartedBusiness(false);
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
    const currentDesignCreditFree = toJS(userStore.currentFreeDesignCredit);
    const currentDesignCreditPro = toJS(userStore.currentProDesignCredit);

    const designPackage = designPackages.find(
      (pkg) => pkg.id === currentDesign.package
    );

    let currentDesignCredit = currentDesignCreditFree;
    if (designPackage.type === Constant.typeDesignPackageVip) {
      currentDesignCredit = currentDesignCreditPro;
    }
    if (currentDesignCredit > 0) {
      const { data, errors } = await addUserDesign({
        variables: { designId: currentDesign.id },
      });

      if (data !== null && !errors) {
        setLoadingImage(true);
        if (designPackage.type === Constant.typeDesignPackageFree) {
          userStore.updateCurrantDesignCreditFree(currentDesignCredit - 1);
        } else {
          userStore.updateCurrantDesignCreditPro(currentDesignCredit - 1);
        }
      } else if (errors && errors !== null && errors.length > 0) {
        if (errors[0].extensions.code === Constant.userDesignExits) {
          setLoadingImage(true);
        } else {
          designStore.setIsDownloadStartedBusiness(false);
          setLoadingImage(false);
          Common.showMessage(errors[0].message);
          return;
        }
      }

      const uri = await viewRef.current.capture();

      try {
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
            )
              .then((res) => console.log("res: ", res))
              .catch((err) => console.log("err: ", err));
      } catch (error) {
        console.log("err", error);
      }
      setLoadingImage(false);
      Common.showMessage(Common.getTranslation(LangKey.msgDesignDownload));
      designStore.setIsDownloadStartedBusiness(false);

      if (isShareClick === true) {
        isShareClick = false;
        await openShareDialogAsync(uri);
      }
    } else {
      designStore.setIsDownloadStartedBusiness(false);
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

  // const plusBTN = () => {
  //   return (
  //     <TouchableOpacity
  //       activeOpacity={0.6}
  //       onPress={() => setVisiblePicker(true)}
  //       style={styles.plusButton}
  //     >
  //       <Icon name="plus" fill={Color.white} height={15} width={15} />
  //     </TouchableOpacity>
  //   );
  // };

  const plusBTN = () => {
    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={{ paddingRight: 10, fontFamily: "Nunito-Regular" }}>
          {Common.getTranslation(LangKey.LayoutColor)}
        </Text>
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
      </View>
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
              userDataBussiness.socialMedia !== "" &&
              userDataBussiness.image &&
              userDataBussiness.image !== "" &&
              userDataBussiness.image.length > 0
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
              userDataBussiness.socialMedia !== "" &&
              userDataBussiness.image &&
              userDataBussiness.image !== "" &&
              userDataBussiness.image.length > 0
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
              userDataBussiness.socialMedia !== "" &&
              userDataBussiness.image &&
              userDataBussiness.image !== "" &&
              userDataBussiness.image.length > 0
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
              userDataBussiness.socialMedia !== "" &&
              userDataBussiness.image &&
              userDataBussiness.image !== "" &&
              userDataBussiness.image.length > 0
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
              userDataBussiness.socialMedia !== "" &&
              userDataBussiness.image &&
              userDataBussiness.image !== "" &&
              userDataBussiness.image.length > 0
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
              userDataBussiness.socialMedia !== "" &&
              userDataBussiness.image &&
              userDataBussiness.image !== "" &&
              userDataBussiness.image.length > 0
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
          userDataBussiness.socialMedia === "" ||
          !userDataBussiness.image ||
          userDataBussiness.image === "" ||
          userDataBussiness.image.length < 0
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
          userDataBussiness.socialMedia === "" ||
          !userDataBussiness.image ||
          userDataBussiness.image === "" ||
          userDataBussiness.image.length < 0
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
          userDataBussiness.socialMedia === "" ||
          !userDataBussiness.image ||
          userDataBussiness.image === "" ||
          userDataBussiness.image.length < 0
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
          userDataBussiness.socialMedia === "" ||
          !userDataBussiness.image ||
          userDataBussiness.image === "" ||
          userDataBussiness.image.length < 0
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
          userDataBussiness.socialMedia === "" ||
          !userDataBussiness.image ||
          userDataBussiness.image === "" ||
          userDataBussiness.image.length < 0
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
          userDataBussiness.socialMedia === "" ||
          !userDataBussiness.image ||
          userDataBussiness.image === "" ||
          userDataBussiness.image.length < 0
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
    <View style={styles.layLeftViewFooter}>
      <SvgCss
        xml={SvgConstant.leftFooterLayout}
        width="100%"
        height="100%"
        fill={footerColor}
      />

      <FastImage
        onLoadStart={() => designStore.setIsBusinessDesignLoad(true)}
        onLoadEnd={() => designStore.setIsBusinessDesignLoad(false)}
        source={{ uri: userDataBussiness.image }}
        style={styles.layLeftImgLogo}
        resizeMode={FastImage.resizeMode.contain}
      />

      <Text style={[styles.layLeftTxtName, { color: footerTextColor }]}>
        {userDataBussiness.name}
      </Text>

      <View style={styles.layLeftRoot}>
        <View
          style={[styles.layViewIcon, { backgroundColor: footerTextColor }]}
        >
          <Icon
            name="location"
            height={Constant.layIconHeight}
            width={Constant.layIconWidth}
            fill={footerColor}
          />
        </View>
        <Text style={[styles.layLeftTxtAddress, { color: footerTextColor }]}>
          {userDataBussiness.address}
        </Text>
      </View>

      <View style={styles.layLeftBottomMobile}>
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

      <View
        style={[
          styles.layLeftViewSocialMedia,
          {
            color: footerTextColor,
          },
        ]}
      >
        {socialIconList.map((item) => (
          <View
            key={item}
            style={[
              styles.layLeftSocialIconView,
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
        ))}

        <Text style={[styles.layTxtIcon, { color: footerTextColor }]}>
          {userDataBussiness.socialMedia}
        </Text>
      </View>
    </View>
  );
  const getLayout2 = () => (
    <View style={styles.layRightViewFooter}>
      <SvgCss
        xml={SvgConstant.rightFooterLayout}
        width="100%"
        height="100%"
        fill={footerColor}
      />

      <Text style={[styles.layRightTxtName, { color: footerTextColor }]}>
        {userDataBussiness.name}
      </Text>

      <View style={styles.layRightRoot}>
        <Text style={[styles.layRightTxtAddress, { color: footerTextColor }]}>
          {userDataBussiness.address}
        </Text>
        <View
          style={[styles.layViewIcon, { backgroundColor: footerTextColor }]}
        >
          <Icon
            name="location"
            height={Constant.layIconHeight}
            width={Constant.layIconWidth}
            fill={footerColor}
          />
        </View>
      </View>

      <View style={styles.layRightBottom}>
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

      <View
        style={[
          styles.layRightViewSocialMedia,
          {
            color: footerTextColor,
          },
        ]}
      >
        {socialIconList.map((item) => (
          <View
            style={[
              styles.layRightSocialIconView,
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
        ))}

        <Text style={[styles.layTxtIcon, { color: footerTextColor }]}>
          {userDataBussiness.socialMedia}
        </Text>
      </View>

      <FastImage
        onLoadStart={() => designStore.setIsBusinessDesignLoad(true)}
        onLoadEnd={() => designStore.setIsBusinessDesignLoad(false)}
        source={{ uri: userDataBussiness.image }}
        style={styles.layRightImgLogo}
        resizeMode={FastImage.resizeMode.contain}
      />
    </View>
  );

  const getLayout3 = () => (
    <View style={styles.layFlatViewFooter}>
      <SvgCss
        xml={SvgConstant.flatFooterLayout}
        width="100%"
        height="100%"
        fill={footerColor}
      />

      <Text style={[styles.layFlatTxtName, { color: footerTextColor }]}>
        {userDataBussiness.name}
      </Text>

      <View style={styles.layFlatRoot}>
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

      <View style={styles.layFlatBottomMobile}>
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

      <View
        style={[
          styles.layFlatViewSocialMedia,
          {
            color: footerTextColor,
          },
        ]}
      >
        {socialIconList.map((item) => (
          <View
            style={[
              styles.layFlatSocialView,
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
        ))}

        <Text style={[styles.layTxtIcon, { color: footerTextColor }]}>
          {userDataBussiness.socialMedia}
        </Text>
      </View>
    </View>
  );

  const getLayout4 = () => (
    <View style={styles.layFlatViewFooter}>
      <SvgCss
        xml={SvgConstant.flatFooterLayout}
        width="100%"
        height="100%"
        fill={footerColor}
      />
      <View
        style={{
          position: "absolute",
          left: "2%",
          top: "12%",
          width: wp(96),
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontSize: Constant.layBigFontSize,
            color: footerTextColor,
          }}
        >
          {userDataBussiness.name}
        </Text>
      </View>

      <View
        style={[
          styles.layFlatRoot,
          {
            width: "96%",
            justifyContent: "space-between",
          },
        ]}
      >
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
        <View style={[styles.layViewIconRoot]}>
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

      <View style={styles.layFlatBottomMobile}>
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

      <View
        style={[
          styles.layFlatViewSocialMedia,
          {
            color: footerTextColor,
          },
        ]}
      >
        {socialIconList.map((item) => (
          <View
            style={[
              styles.layFlatSocialView,
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
        ))}

        <Text style={[styles.layTxtIcon, { color: footerTextColor }]}>
          {userDataBussiness.socialMedia}
        </Text>
      </View>
    </View>
  );
  const getLayout5 = () => (
    <View style={styles.layFlatViewFooter}>
      <SvgCss
        xml={SvgConstant.flatFooterLayout}
        width="100%"
        height="100%"
        fill={footerColor}
      />

      <Text style={[styles.layFlatTxtName, { color: footerTextColor }]}>
        {userDataBussiness.name}
      </Text>

      <View style={styles.layFlatRoot}>
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

      <View style={styles.layFlatBottomMobile}>
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

      <View
        style={[
          styles.layFlatViewSocialMedia,
          {
            color: footerTextColor,
          },
        ]}
      >
        {socialIconList.map((item) => (
          <View
            style={[
              styles.layFlatSocialView,
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
        ))}

        <Text style={[styles.layTxtIcon, { color: footerTextColor }]}>
          {userDataBussiness.socialMedia}
        </Text>
      </View>
    </View>
  );
  const getLayout6 = () => (
    <View style={styles.layFlatViewFooter}>
      <SvgCss
        xml={SvgConstant.flatFooterLayout}
        width="100%"
        height="100%"
        fill={footerColor}
      />

      <Text style={[styles.layFlatTxtName, { color: footerTextColor }]}>
        {userDataBussiness.name}
      </Text>

      <View style={styles.layFlatTopMobile}>
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
        <Text style={[styles.layTxtIcon, { color: footerTextColor }]}>
          {userDataBussiness.mobile}
        </Text>
      </View>

      <View style={styles.layFlatRoot}>
        <View
          style={[styles.layViewIcon, { backgroundColor: footerTextColor }]}
        >
          <Icon
            name="location"
            height={Constant.layIconHeight}
            width={Constant.layIconWidth}
            fill={footerColor}
          />
        </View>
        <Text style={[styles.layTxtIcon, { color: footerTextColor }]}>
          {userDataBussiness.address}
        </Text>
      </View>

      <View style={styles.layFlatBottomMobile}>
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

      <View
        style={[
          styles.layFlatViewSocialMedia,
          {
            color: footerTextColor,
          },
        ]}
      >
        {socialIconList.map((item) => (
          <View
            style={[
              styles.layFlatSocialView,
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
        ))}

        <Text style={[styles.layTxtIcon, { color: footerTextColor }]}>
          {userDataBussiness.socialMedia}
        </Text>
      </View>
    </View>
  );

  const getLayout7 = () => (
    <View style={styles.layLeftViewFooter}>
      <SvgCss
        xml={SvgConstant.leftFooterLayout}
        width="100%"
        height="100%"
        fill={footerColor}
      />

      <FastImage
        onLoadStart={() => designStore.setIsBusinessDesignLoad(true)}
        onLoadEnd={() => designStore.setIsBusinessDesignLoad(false)}
        source={{ uri: userDataBussiness.image }}
        style={styles.layLeftImgLogo}
        resizeMode={FastImage.resizeMode.contain}
      />

      <Text style={[styles.layLeftTxtName, { color: footerTextColor }]}>
        {userDataBussiness.name}
      </Text>

      <View style={styles.layLeftRoot}>
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

      <View style={styles.layLeftBottomMobile}>
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

      <View
        style={[
          styles.layLeftViewSocialMedia,
          {
            color: footerTextColor,
          },
        ]}
      >
        {socialIconList.map((item) => (
          <View
            style={[
              styles.layLeftSocialIconView,
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
        ))}

        <Text style={[styles.layTxtIcon, { color: footerTextColor }]}>
          {userDataBussiness.socialMedia}
        </Text>
      </View>
    </View>
  );
  const getLayout8 = () => (
    <View style={styles.layLeftViewFooter}>
      <SvgCss
        xml={SvgConstant.leftFooterLayout}
        width="100%"
        height="100%"
        fill={footerColor}
      />

      <FastImage
        onLoadStart={() => designStore.setIsBusinessDesignLoad(true)}
        onLoadEnd={() => designStore.setIsBusinessDesignLoad(false)}
        source={{ uri: userDataBussiness.image }}
        style={styles.layLeftImgLogo}
        resizeMode={FastImage.resizeMode.contain}
      />

      <Text style={[styles.layLeftTxtName, { color: footerTextColor }]}>
        {userDataBussiness.name}
      </Text>

      <View style={styles.layLeftRoot}>
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

      <View style={styles.layLeftBottomMobile}>
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

      <View
        style={[
          styles.layLeftViewSocialMedia,
          {
            color: footerTextColor,
          },
        ]}
      >
        {socialIconList.map((item) => (
          <View
            style={[
              styles.layLeftSocialIconView,
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
        ))}

        <Text style={[styles.layTxtIcon, { color: footerTextColor }]}>
          {userDataBussiness.socialMedia}
        </Text>
      </View>
    </View>
  );

  const getLayout9 = () => (
    <View style={styles.layRightViewFooter}>
      <SvgCss
        xml={SvgConstant.rightFooterLayout}
        width="100%"
        height="100%"
        fill={footerColor}
      />

      <Text style={[styles.layRightTxtName, { color: footerTextColor }]}>
        {userDataBussiness.name}
      </Text>

      <View style={styles.layRightRoot}>
        <Text
          style={[
            styles.layTxtIcon,
            { color: footerTextColor, marginRight: wp(1.5) },
          ]}
        >
          {userDataBussiness.website}
        </Text>
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
      </View>

      <View style={styles.layRightBottom}>
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

      <View
        style={[
          styles.layRightViewSocialMedia,
          {
            color: footerTextColor,
          },
        ]}
      >
        {socialIconList.map((item) => (
          <View
            style={[
              styles.layRightSocialIconView,
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
        ))}

        <Text style={[styles.layTxtIcon, { color: footerTextColor }]}>
          {userDataBussiness.socialMedia}
        </Text>
      </View>

      <FastImage
        onLoadStart={() => designStore.setIsBusinessDesignLoad(true)}
        onLoadEnd={() => designStore.setIsBusinessDesignLoad(false)}
        source={{ uri: userDataBussiness.image }}
        style={styles.layRightImgLogo}
        resizeMode={FastImage.resizeMode.contain}
      />
    </View>
  );
  const getLayout10 = () => (
    <View style={styles.layRightViewFooter}>
      <SvgCss
        xml={SvgConstant.rightFooterLayout}
        width="100%"
        height="100%"
        fill={footerColor}
      />

      <Text style={[styles.layRightTxtName, { color: footerTextColor }]}>
        {userDataBussiness.name}
      </Text>

      <View style={styles.layRightRoot}>
        <Text
          style={[
            styles.layTxtIcon,
            { color: footerTextColor, marginRight: wp(1.5) },
          ]}
        >
          {userDataBussiness.email}
        </Text>
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
      </View>

      <View style={styles.layRightBottom}>
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

      <View
        style={[
          styles.layRightViewSocialMedia,
          {
            color: footerTextColor,
          },
        ]}
      >
        {socialIconList.map((item) => (
          <View
            style={[
              styles.layRightSocialIconView,
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
        ))}

        <Text style={[styles.layTxtIcon, { color: footerTextColor }]}>
          {userDataBussiness.socialMedia}
        </Text>
      </View>

      <FastImage
        onLoadStart={() => designStore.setIsBusinessDesignLoad(true)}
        onLoadEnd={() => designStore.setIsBusinessDesignLoad(false)}
        source={{ uri: userDataBussiness.image }}
        style={styles.layRightImgLogo}
        resizeMode={FastImage.resizeMode.contain}
      />
    </View>
  );

  // key extractors
  const keyExtractor = useCallback((item) => item.id.toString(), []);

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
        keyExtractor={keyExtractor}
        contentContainerStyle={{}}
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
            <View>
              <FastImage
                source={{ uri: item.layoutImage.url }}
                style={{ width: width / 2.5, height: 40 }}
                resizeMode={FastImage.resizeMode.contain}
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
    );
  };

  const colorCode = () => {
    return (
      <View style={{ width: "94%" }}>
        <FlatList
          contentContainerStyle={styles.colorCodeList}
          data={currentDesign?.colorCodes ? currentDesign.colorCodes : []}
          horizontal
          keyExtractor={keyExtractor}
          showsHorizontalScrollIndicator={false}
          ListHeaderComponent={plusBTN()}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              activeOpacity={0.6}
              key={index}
              style={{ ...styles.colorCode, backgroundColor: item.code }}
              onPress={() => {
                setSelectedPicker(false);
                setFooterColor(item.code);
                item.isLight == true
                  ? setFooterTextColor(currentDesign.darkTextColor)
                  : setFooterTextColor(currentDesign.lightTextColor);
              }}
            >
              {selectedPicker !== true && (
                <>
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
                </>
              )}
            </TouchableOpacity>
          )}
        />
        {selectedPicker && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingBottom: 10,
            }}
          >
            <Text style={{ paddingRight: 10, fontFamily: "Nunito-Regular" }}>
              {Common.getTranslation(LangKey.FontColor)}
            </Text>
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
      </View>
    );
  };
  const socialIcon = () => {
    return (
      <FlatList
        contentContainerStyle={styles.socialIconList}
        data={Constant.socialIconList}
        showsHorizontalScrollIndicator={false}
        horizontal
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
                setSocialIconList(socialIconList.filter((val) => val !== item));
              } else if (socialIconList.length < Constant.socialIconLimit) {
                addIcons.push(...socialIconList, item);
                setSocialIconList([...socialIconList, item]);
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
                height: 35,
                width: 35,
                backgroundColor:
                  socialIconList.indexOf(item) < 0 ? null : Color.white,
                opacity: 0.3,
                position: "absolute",
                borderRadius: 50,
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
    );
  };

  const layoutRef = React.useRef(null);
  const colorRef = React.useRef(null);
  const socialRef = React.useRef(null);
  const fall = new Animated.Value(1);
  const renderContentLayout = () => (
    <View
      style={{
        backgroundColor: Color.white,
        padding: 5,
        height: 100,
      }}
    >
      <TouchableOpacity
        onPress={() => layoutRef.current.snapTo(2)}
        style={styles.btnClose}
      >
        <ICON name="close" size={22} color={Color.darkBlue} />
      </TouchableOpacity>
      {layout()}
    </View>
  );
  const renderContentColor = () => (
    <View
      style={{
        backgroundColor: Color.white,
        padding: 5,
        height: 100,
        flexDirection: "row",
      }}
    >
      {colorCode()}
      <TouchableOpacity
        onPress={() => colorRef.current.snapTo(2)}
        style={[styles.btnClose, { alignSelf: "flex-start" }]}
      >
        <ICON name="close" size={22} color={Color.darkBlue} />
      </TouchableOpacity>
    </View>
  );
  const renderContentSocial = () => (
    <View
      style={{
        backgroundColor: Color.white,
        padding: 5,
        height: 100,
      }}
    >
      <TouchableOpacity
        onPress={() => socialRef.current.snapTo(2)}
        style={styles.btnClose}
      >
        <ICON name="close" size={22} color={Color.darkBlue} />
      </TouchableOpacity>
      {socialIcon()}
    </View>
  );

  const bussiness = () => {
    return (
      <>
        <BottomSheet
          ref={layoutRef}
          snapPoints={[100, 100, 0]}
          borderRadius={10}
          initialSnap={2}
          enabledInnerScrolling={true}
          enabledGestureInteraction={false}
          callbackNode={fall}
          renderContent={renderContentLayout}
        />
        <BottomSheet
          ref={colorRef}
          snapPoints={[100, 100, 0]}
          borderRadius={10}
          initialSnap={2}
          enabledGestureInteraction={false}
          callbackNode={fall}
          renderContent={renderContentColor}
        />
        <BottomSheet
          ref={socialRef}
          snapPoints={[100, 100, 0]}
          borderRadius={10}
          initialSnap={2}
          enabledGestureInteraction={false}
          callbackNode={fall}
          renderContent={renderContentSocial}
        />
        <View
          style={{
            flex: 1,
            backgroundColor: Color.bgcColor,
          }}
        >
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
              initialColor={footerColor}
              setPickerColor={setFooterColor}
              setSelectedPicker={setSelectedPicker}
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
                          designPackage.type ===
                            Constant.typeDesignPackageVip &&
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
                        {designPackage.type ===
                          Constant.typeDesignPackageVip && (
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

              <View
                style={{
                  height: 1,
                  width: "95%",
                  backgroundColor: Color.txtIntxtcolor,
                  marginVertical: 10,
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
                    onLoadStart={() =>
                      designStore.setIsBusinessDesignLoad(true)
                    }
                    onLoadEnd={() => designStore.setIsBusinessDesignLoad(false)}
                    source={{
                      uri: currentDesign.designImage.url,
                    }}
                    style={{ flex: 1 }}
                  >
                    {currentLayout && getLayout()}
                  </FastImage>
                </View>
              </ViewShot>

              {/* <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: Color.bgcColor,
                  marginBottom: 10,
                  marginTop: 10,
                  borderTopWidth: 5,
                  borderTopColor: Color.txtIntxtcolor,
                }}
              >
                <View style={{ height: 80, marginTop: 10 }}>
                  {selected == 0 && layout()}
                  {selected == 1 && colorCode()}
                  {selected == 2 && socialIcon()}
                </View>
                <View
                  style={{
                    backgroundColor: Color.txtIntxtcolor,
                    height: 1,
                    width: wp(90),
                    marginBottom: 15,
                  }}
                />
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-evenly",
                    width: "100%",
                  }}
                >
                  <TouchableOpacity onPress={() => setSelected(0)}>
                    <Text
                      style={{
                        backgroundColor:
                          selected === 0 ? Color.txtIntxtcolor : null,
                        // borderColor: Color.txtIntxtcolor,
                        // borderWidth: 2,
                        color:
                          selected === 0 ? Color.white : Color.txtIntxtcolor,
                        borderRadius: Platform.OS === "ios" ? 16 : 20,
                        overflow: "hidden",
                        paddingHorizontal: 20,
                        paddingVertical: 5,
                      }}
                    >
                      {Common.getTranslation(LangKey.labLayouts)}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setSelected(1)}>
                    <Text
                      style={{
                        backgroundColor:
                          selected === 1 ? Color.txtIntxtcolor : null,
                        // borderColor: Color.txtIntxtcolor,
                        // borderWidth: 2,
                        color:
                          selected === 1 ? Color.white : Color.txtIntxtcolor,
                        borderRadius: Platform.OS === "ios" ? 16 : 20,
                        overflow: "hidden",
                        paddingHorizontal: 20,
                        paddingVertical: 5,
                      }}
                    >
                      {Common.getTranslation(LangKey.labColorCodeList)}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setSelected(2)}>
                    <Text
                      style={{
                        backgroundColor:
                          selected === 2 ? Color.txtIntxtcolor : null,
                        // borderColor: Color.txtIntxtcolor,
                        // borderWidth: 2,
                        color:
                          selected === 2 ? Color.white : Color.txtIntxtcolor,
                        borderRadius: Platform.OS === "ios" ? 16 : 20,
                        overflow: "hidden",
                        paddingHorizontal: 20,
                        paddingVertical: 5,
                      }}
                    >
                      {Common.getTranslation(LangKey.labSocialMediaIcons)}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View> */}
            </View>
          </ScrollView>
          <View
            style={{
              borderTopColor: Color.txtIntxtcolor,
              borderTopWidth: 1,
              backgroundColor: Color.white,
            }}
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                marginBottom: Platform.OS === "ios" ? 10 : 0,
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
              }}
            >
              <View
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",
                  flex: 1,
                  marginHorizontal: 20,
                }}
              >
                <Button
                  style={{ margin: 5, backgroundColor: Color.transparent }}
                  onPress={() => layoutRef.current.snapTo(0)}
                  isVertical={true}
                  icon={
                    <Icon
                      name="layout"
                      height={14}
                      width={14}
                      fill={Color.grey}
                    />
                  }
                  textColor={true}
                >
                  {Common.getTranslation(LangKey.labLayouts)}
                </Button>
                <Button
                  style={{ margin: 5, backgroundColor: Color.transparent }}
                  onPress={() => colorRef.current.snapTo(0)}
                  isVertical={true}
                  icon={
                    <Icon
                      name="color"
                      height={15}
                      width={15}
                      fill={Color.grey}
                    />
                  }
                  textColor={true}
                >
                  {Common.getTranslation(LangKey.labColorCodeList)}
                </Button>
                <Button
                  style={{ margin: 5, backgroundColor: Color.transparent }}
                  onPress={() => socialRef.current.snapTo(0)}
                  isVertical={true}
                  icon={
                    <Icon
                      name="socialicon"
                      height={15}
                      width={15}
                      fill={Color.grey}
                    />
                  }
                  textColor={true}
                >
                  {Common.getTranslation(LangKey.labSocialMediaIcons)}
                </Button>
                <Button
                  disable={designs == null || designs == undefined}
                  isVertical={true}
                  style={{ margin: 5, backgroundColor: Color.transparent }}
                  onPress={() => {
                    if (user && user !== null) {
                      navigation.navigate(Constant.navProfile, {
                        title: Constant.titBusinessProfile,
                      });
                    } else {
                      Common.showMessage(
                        Common.getTranslation(LangKey.msgCreateAccEdit)
                      );
                    }
                  }}
                  icon={
                    <Icon
                      name="edit"
                      height={14}
                      width={14}
                      fill={Color.grey}
                    />
                  }
                  textColor={true}
                >
                  {Common.getTranslation(LangKey.txtEdit)}
                </Button>

                <Button
                  disable={designs == null || designs == undefined}
                  style={{ margin: 5, backgroundColor: Color.transparent }}
                  isVertical={true}
                  onPress={() => {
                    // if (currentDesign.id === curDesign.id) {
                    //   onReset();
                    // } else {
                    //   setCurrentDesign(curDesign);
                    // }
                    onReset();
                    fiilterLayouts();
                    setSelectedPicker(false);
                  }}
                  icon={
                    <Icon
                      name="reset"
                      height={14}
                      width={14}
                      fill={Color.grey}
                    />
                  }
                  textColor={true}
                >
                  {Common.getTranslation(LangKey.txtReset)}
                </Button>
              </View>
            </ScrollView>
          </View>
        </View>
      </>
    );
  };

  return <View style={{ flex: 1 }}>{bussiness()}</View>;
};
export default inject("designStore", "userStore")(observer(BussinessDesign));

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
    marginTop: 10,
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
    paddingHorizontal: 5,
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
    width: width - 25,
    height: width - 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 1.22,
    elevation: 2,
    backgroundColor: Color.white,
  },
  colorCodeList: {
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: "100%",
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
    marginRight: 10,
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
  layTxtIcon: { fontSize: Constant.laySmallFontSize, marginLeft: wp(1) },
  // common layout left
  layLeftViewFooter: {
    width: "100%",
    height: "18%",
    bottom: 0,
    position: "absolute",
  },
  layLeftImgLogo: {
    left: "4%",
    width: "16.67%",
    height: "83.34%",
    position: "absolute",
    bottom: "4.62%",
  },
  layLeftTxtName: {
    fontSize: Constant.layBigFontSize,
    position: "absolute",
    left: "23%",
    top: "25%",
  },
  layLeftRoot: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    left: "23%",
    top: "53%",
    width: "70%",
  },
  layLeftTxtAddress: {
    fontSize: Constant.laySmallFontSize,
    maxHeight: "100%",
    paddingLeft: wp(1),
  },
  layLeftBottomMobile: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: "5%",
    left: "23%",
  },
  layLeftViewName: {
    left: "2.50%",
    position: "absolute",
    top: "10%",
    flexDirection: "row",
    alignItems: "baseline",
  },
  layLeftTxtDesignation: { fontSize: Constant.laySmallFontSize, left: 5 },
  layLeftViewWebsiteEmail: {
    position: "absolute",
    left: "2%",
    top: "43%",
    width: "95%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  layLeftViewMobile: {
    position: "absolute",
    bottom: "8%",
    left: "2%",
    flexDirection: "row",
    alignItems: "center",
  },
  layLeftViewSocialMedia: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    bottom: "5%",
    right: "2%",
    position: "absolute",
  },
  layLeftSocialIconView: {
    padding: Constant.layIconViewPadding,
    borderRadius: Constant.layIconViewBorderRadius,
    marginRight: wp(0.5),
    alignContent: "center",
    alignItems: "center",
  },

  // common layout Right
  layRightViewFooter: {
    width: "100%",
    height: "18%",
    bottom: 0,
    position: "absolute",
  },
  layRightTxtName: {
    fontSize: Constant.layBigFontSize,
    textAlign: "right",
    position: "absolute",
    right: "24%",
    top: "28%",
  },
  layRightRoot: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    right: "24%",
    position: "absolute",
    top: "53%",
  },
  layRightTxtAddress: {
    fontSize: Constant.laySmallFontSize,
    maxWidth: "100%",
    textAlign: "right",
    paddingRight: wp(1),
  },
  layRightBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    bottom: "5%",
    left: wp(2),
    position: "absolute",
  },
  layRightTxtMobile: {
    fontSize: Constant.laySmallFontSize,
    paddingLeft: wp(1),
  },
  layRightViewSocialMedia: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    bottom: "5%",
    right: "24%",
    position: "absolute",
  },
  layRightSocialIconView: {
    padding: Constant.layIconViewPadding,
    borderRadius: Constant.layIconViewBorderRadius,
    marginRight: wp(0.5),
    alignContent: "center",
    alignItems: "center",
  },
  layRightImgLogo: {
    right: "4%",
    width: "16.67%",
    height: "83.34%",
    position: "absolute",
    bottom: "4.62%",
  },

  // layout flat styles
  layFlatViewFooter: {
    width: "100%",
    height: "15%",
    bottom: 0,
    position: "absolute",
  },
  layFlatTxtName: {
    fontSize: Constant.layBigFontSize,
    position: "absolute",
    left: "2%",
    top: "12%",
  },
  layFlatRoot: {
    flexDirection: "row",
    alignItems: "center",
    left: "2%",
    position: "absolute",
    top: "43%",
  },
  layFlatBottomMobile: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    bottom: "8%",
    left: "2%",
    position: "absolute",
  },
  layFlatViewSocialMedia: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    bottom: "8%",
    right: "2%",
    position: "absolute",
  },
  layFlatSocialView: {
    padding: Constant.layIconViewPadding,
    borderRadius: Constant.layIconViewBorderRadius,
    marginRight: wp(0.5),
    alignContent: "center",
    alignItems: "center",
  },
  layFlatTopMobile: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: "2%",
    top: "16%",
  },
  btnClose: {
    width: 25,
    height: 25,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
  },
});

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

{
  /* <Button
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
        </Button> */
}

{
  /* <Button
                disable={
                  isdesignImageLoad
                    ? isdesignImageLoad
                    : isUserDesignImageLoad
                    ? isUserDesignImageLoad
                    : loadingImage
                }
                style={{
                  margin: 5,
                  backgroundColor: Color.transparent,
                }}
                icon={
                  <Icon
                    name="download"
                    height={15}
                    width={15}
                    fill={Color.darkBlue}
                  />
                }
                textColor={true}
                onPress={onClickDownload}
              >
                {isdesignImageLoad ? (
                  isdesignImageLoad
                ) : isUserDesignImageLoad ? (
                  isUserDesignImageLoad
                ) : loadingImage ? (
                  <ActivityIndicator color={Color.darkBlue} size={15} />
                ) : (
                  Common.getTranslation(LangKey.txtDownload)
                )}
              </Button> */
}
