import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "i18n-js";
import { useEffect, useRef } from "react";
import {
  Linking,
  PixelRatio,
  Platform,
  Share,
  ToastAndroid,
} from "react-native";
import {} from "react-native-vector-icons/";
import Constant from "./Constant";

const useIsMountedRef = () => {
  const isMountedRef = useRef(null);
  useEffect(() => {
    isMountedRef.current = true;
    return () => (isMountedRef.current = false);
  });
  return isMountedRef;
};

const setTranslationInit = () => {
  // Set the key-value pairs for the different languages you want to support.
  i18n.translations = {
    en: require("../languages/en.json"),
    hi: require("../languages/hi.json"),
  };

  // When a value is missing from a language it'll fallback to another language with the key present.
  i18n.fallbacks = true;
};

const setTranslationLanguage = async (langCode) => {
  await AsyncStorage.setItem(Constant.prfLangCode, langCode);
  // Set the locale once at the beginning of your app.
  i18n.locale = langCode;
};

const getTranslation = (key) => {
  return i18n.t(key);
};

const convertStringToObject = (string) => {
  return JSON.parse(JSON.parse(string));
};

const convertIsoToDate = (string) => {
  return string.substring(0, 10);
};
const openWhatsApp = (mobile, msg) => {
  Linking.openURL(`whatsapp://send?phone=91${mobile}&text=${msg}`)
    .then((data) => console.log(data))
    .catch(() => {
      alert("Make sure Whatsapp installed on your device");
    });
};

const getPixels = (targetPixelCount) => {
  const pixelRatio = PixelRatio.get(); // The pixel ratio of the device
  // pixels * pixelratio = targetPixelCount, so pixels = targetPixelCount / pixelRatio
  const pixels = targetPixelCount / pixelRatio;

  return pixels;
};

const showMessage = (message) => {
  Platform.OS == "android"
    ? ToastAndroid.show(message, ToastAndroid.LONG)
    : alert(message);
};

const onShare = async () => {
  try {
    const result = await Share.share(
      {
        title: "App link",
        message:
          "Please install this app and stay safe , AppLink :https://play.google.com/store/apps/details?id=nic.goi.aarogyasetu&hl=en",
        url: Platform.OS === "ios" ? null : Constant.playStoreURL,
      },
      {
        excludedActivityTypes: [
          "com.apple.UIKit.activity.Print",
          "com.apple.UIKit.activity.Message",
          "com.apple.UIKit.activity.CopyToPasteboard",
          "com.apple.UIKit.activity.AssignToContact",
          "com.apple.UIKit.activity.SaveToCameraRoll",
          "com.apple.UIKit.activity.AddToReadingList",
          "com.apple.UIKit.activity.PostToFlickr",
          "com.apple.UIKit.activity.PostToVimeo",
          "com.apple.UIKit.activity.PostToTencentWeibo",
          "com.apple.UIKit.activity.AirDrop",
          "com.apple.UIKit.activity.OpenInIBooks",
          "com.apple.UIKit.activity.MarkupAsPDF",
          // "com.apple.reminders.RemindersEditorExtension",
          "com.apple.mobilenotes.SharingExtension",
          "com.apple.mobileslideshow.StreamShareService",
          "com.linkedin.LinkedIn.ShareExtension",
          "pinterest.ShareExtension",
          "com.google.GooglePlus.ShareExtension",
          "com.tumblr.tumblr.Share-With-Tumblr",
          "net.whatsapp.WhatsApp.ShareExtension", //WhatsApp
          "com.apple.UIKit.activity.PostToFacebook", //FaceBook
          "com.apple.UIKit.activity.PostToTwitter", //Twitter
        ],
      }
    );
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
      } else {
      }
    } else if (result.action === Share.dismissedAction) {
    }
  } catch (error) {
    alert(error.message);
  }
};

export default {
  useIsMountedRef,
  setTranslationInit,
  setTranslationLanguage,
  getTranslation,
  convertStringToObject,
  getPixels,
  convertIsoToDate,
  showMessage,
  openWhatsApp,
  onShare,
};
