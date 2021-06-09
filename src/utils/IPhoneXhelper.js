import { Dimensions, Platform, StatusBar } from 'react-native';

const isIphoneX = () => {
  const dimen = Dimensions.get('window');
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    ((dimen.height === 812 || dimen.width === 812) || (dimen.height === 896 || dimen.width === 896))
  );
};

const ifIphoneX = (iphoneXStyle, regularStyle) => {
  if (isIphoneX()) {
    return iphoneXStyle;
  }
  return regularStyle;
};

const getStatusBarHeight = (safe) => {
  return Platform.select({
    ios: ifIphoneX(safe ? 44 : 30, 8),
    android: 0,//StatusBar.currentHeight
  });
};

const getBottomSpace = () => {
  return isIphoneX() ? 34 : 0;
};

const iPhoneXHelper = {
  isIphoneX,
  ifIphoneX,
  getStatusBarHeight,
  getBottomSpace
};

export default iPhoneXHelper;
