import Common from "./Common";
// import moment from "moment";

import LangKey from "./LangKey";

export const mobileValidator = (mobileNo) => {
  const re = /^[0]?[6789]\d{9}$/;

  if (!mobileNo || mobileNo.length <= 0)
    return Common.getTranslation(LangKey.errorMobileNo);
  if (!re.test(mobileNo)) return Common.getTranslation(LangKey.errorMobileNo);

  return "";
};

export const emailValidator = (email) => {
  const re = /\S+@\S+\.\S+/;

  if (!email || email.length <= 0)
    return Common.getTranslation(LangKey.errorEmail);
  if (!re.test(email)) return Common.getTranslation(LangKey.errorEmail);

  return "";
};

export const passwordValidator = (password) => {
  if (!password || password.length <= 0)
    return Common.getTranslation(LangKey.errorPassword);

  return "";
};

export const nameValidator = (name) => {
  if (!name || name.length <= 0)
    return Common.getTranslation(LangKey.errorName);

  return "";
};

export const emptyValidator = (name) => {
  if (!name || name.length <= 0)
    return true;

  return false;
};

// export const dateValidator = (date) => {
//   if (!date || date.length <= 0) return Constant.errorDate;

//   const curDate = moment(Date.now()).format("YYYY/MM/DD");
//   const dt = moment(date).isSameOrAfter(curDate);
//   // console.log("date validation:", dt, ", curDate: ", curDate, ", selDate: ", date);
//   if (dt) return Constant.errorDate;

//   return "";
// };

export const genderValidator = (gender) => {
  if (gender < 0 || gender > 2)
    return Common.getTranslation(LangKey.errorGender);

  return "";
};
