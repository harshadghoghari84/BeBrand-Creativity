import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "i18n-js";
import { useEffect, useRef } from "react";
import { PixelRatio, Platform, ToastAndroid } from "react-native";
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

export default {
  useIsMountedRef,
  setTranslationInit,
  setTranslationLanguage,
  getTranslation,
  convertStringToObject,
  getPixels,
  convertIsoToDate,
  showMessage,
};
