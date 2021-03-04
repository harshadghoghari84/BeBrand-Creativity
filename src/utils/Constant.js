import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default {
  dummyUserData: [
    {
      name: "NARENDRA MODI",
      designation: "Prime Minister of India",
      mobile: "9876543210",
      email: "narendramodi@gmail.com",
      website: "narendramodi.com",
      socialMedia: "@narendramodi",
      image:
        "https://www.freepnglogos.com/uploads/modi-png/texas-india-forum-howdy-modi-23.png",
    },
    {
      name: "ABCDEFGHJKLMNOPQRSTUVWXYZ",
      designation: "ABCDEFGHJKLMNOPQRS",
      mobile: "9876543210",
      email: "ABCDEFGHJKLMNOPQRSTUVWXYZZ",
      website: "ABCDEFGHJKLMNOPQRSTUVWXYZZ",
      socialMedia: "ABCDEFGHJKLMNOPQRSTU",
      image:
        "https://www.freepnglogos.com/uploads/modi-png/texas-india-forum-howdy-modi-23.png",
    },
  ],

  dummyCompnyData: [
    {
      name: "HARSHADHGHOGHARIANDCOMPANYZXCVBNMLK",
      address: "HARSHADHGHOGHARIANDCOMPANYZXCVHARSHADHGHA",
      mobile: "9876543210",
      email: "HARSHADHGHOGHARI1234@GMAIL.COM",
      website: "HARSHADHGHOGHARI1234MYWE",
      socialMedia: "@HARSHADGHOGHARIAKAG",
      image: "https://image.flaticon.com/icons/png/512/174/174855.png",
    },
    {
      name: "1234567890123456789012345",
      address: "3rd Floor, Soham Apartments,Hirabaug, Surat 395 004",
      mobile: "9876543210",
      email: "123456789012345678901234567890",
      website: "123456789012345678901234567890",
      socialMedia: "@1234567890123456789012345",
      image: "http://assets.stickpng.com/images/580b57fcd9996e24bc43c521.png",
    },
  ],

  // ServerUrl: "192.168.0.222:5000/gql",
  serverUrl: "https://admin.branddot.in/gql",
  // ServerUrl: "http://192.168.100.4:5000/graphql",

  playStoreURL:
    "https://play.google.com/store/apps/details?id=com.bebrandd.branddottu&hl=en",
  splashTime: 500,

  defLangCode: "en",
  defUserName: "Guest",
  prfUserToken: "userToken",
  prfUserloginTime: "userLoginTime",
  prfLangCode: "langCode",
  prfIcons: "setSocialIcons",

  branddotLegalUrl: "https://branddot.in/?page_id=559",

  dummyUserImage:
    "https://cdn.pixabay.com/photo/2015/03/04/22/35/head-659652_960_720.png",
  webClientId:
    "600189297260-84i8k158h4i6s8elhu4hh9pa4cdbpn8j.apps.googleusercontent.com",
  // navigation names
  navSplash: "splash",
  navLangSelection: "langaugeSelection",
  navLogin: "Login",
  navSignIn: "signIn",
  navSignUp: "signUp",
  navForgetPassword: "forgotPassword",
  navOtp: "otp",
  navHomeStack: "homeStack",
  navHome: "home",
  navDesign: "design",
  navPro: "bePro",
  navNotification: "notifications",
  navWishlist: "wishlist",
  navRateApp: "rateapp",
  navShareApp: "shareapp",
  navReportIssue: "reportIssue",
  navRequestFeature: "requestFeature",
  navAccount: "account",
  navProfile: "userProfile",
  navProfileUser: "profileUser",
  navPersonalProfile: "personal",
  navBusinessProfile: "business",
  navPackage: "userPackage",
  navDesigns: "userDesigns",
  navWhatsAppUs: "whatsAppUs",
  navFaq: "faq",
  navWorkCulture: "workCulture",
  navTermCondition: "termCondition",
  navDisclamer: "disclamer",
  navPrivacyPolicy: "privacyPolicy",
  navCopyright: "copyright",
  navSignOut: "logOut",
  navWebView: "WebView",
  navReferandEarn: "Refer and Earn",

  // titles
  titHome: "Home",
  titPro: "Be Premium",
  titNotification: "Notifications",
  titWishlist: "Wishlist",
  titRateApp: "Rate Us",
  titShareApp: "Share App",
  titReportIssue: "Report Issue",
  titRequestFeature: "Request Feature",
  titAccount: "Account",
  titProfile: "Profile",
  titPackage: "Package",
  titDesigns: "Designs",
  titPersonalProfile: "Personal",
  titBusinessProfile: "Business",
  titWhatsAppUs: "WhatsApp Updates",
  titLegal: "Legal",
  titReferandEarn: "Refer & Earn",
  titFaq: "Support System(FAQ)",
  titWorkCulture: "Our Work Culture",
  titTermCondition: "Term & Condition",
  titDisclamer: "Disclamer",
  titPrivacyPolicy: "Privacy Policy",
  titCopyright: "Copyright",
  titSignOut: "Log Out",
  titSignIn: "Log In",

  //design constants
  designPixel: 1500,
  socialIconLimit: 4,
  socialIconList: [
    "facebook",
    "instagram",
    "twitter",
    "youtube",
    "linkedin",
    "googlePlus",
    "pintrest",
    "behance",
    // "github",
    "skype",
    "snapchat",
    "dribble",
    "dropbox",
    "vimio",
  ],
  defSocialIconList: ["facebook", "linkedin", "twitter", "youtube"],

  designAlbumName: "Brand Dot",

  // Home Constants
  defHomeSubCategory: "All",

  // Home ItemSubCategory
  homeItemSubCategoryHeight: 100,

  // mobx/DesignStore constants
  designLangCodeAll: "all",
  userSubCategoryTypeAfter: "AFTER",
  userSubCategoryTypeBefore: "BEFORE",
  globleuserSubCategoryTypeAfter: "AFTER",
  globleuserSubCategoryTypeBefore: "BEFORE",

  typeDesignPackageFree: "FREE",
  typeDesignPackagePro: "PRO",
  typeDesignPackageVip: "VIP",

  // userDesign types
  designTypeALL: "ALL",
  designTypePERSONAL: "PERSONAL",
  designTypeBUSINESS: "BUSINESS",

  // Layout types
  layoutTypeALL: "ALL",
  layoutTypePERSONAL: "PERSONAL",
  layoutTypeBUSINESS: "BUSINESS",

  // design page
  txtEdit: "Edit",
  txtReset: "Reset",

  // modal placeholder text

  modalTxtPlaceHolder: "Write here...",

  // signin
  userNotVerify: "USER_NOT_VERIFIED",

  // design pkg type
  free: "FREE",
  vip: "VIP",

  // Rating POPup
  titAppleIdForAppStore: "2193813192",
  titPkgnameForAndroidPlayStore: "com.bebrandd.branddot",
  OtherAndroidURL: "http://www.randomappstore.com/app/47172391",
  fallbackPlatformURL: "http://www.mywebsite.com/myapp.html",

  // pkg name
  titFree: "free",
  titPrimium: "Premium",

  // Topics and Channels for notification
  topics: "topics",
  Default: "Default",
  Offer: "Offer",
  SpecialOffer: "SpecialOffer",
  Wishes: "Wishes",
  Information: "Information",

  // personalDesign.js constants
  layIconViewPadding: wp(0.22),
  layIconViewBorderRadius: 2,
  layIconHeight: wp(2),
  layIconWidth: wp(2),
  layBigFontSize: wp(3),
  laySmallFontSize: wp(2.2),
  personalLay1Id: "601283dce5dffb0b08a1bd6b",
  personalLay2Id: "601284b0e5dffb0b08a1bd6c",
  personalLay3Id: "603dc5d760fd045d1a40ee6d",
  personalLay4Id: "603dc5e160fd045d1a40ee6e",
  personalLay5Id: "603dc5e560fd045d1a40ee6f",
  personalLay6Id: "603dc5ea60fd045d1a40ee70",
  personalLay7Id: "603dc5ef60fd045d1a40ee71",

  // bussinessDesign.js constants
  businessLay1Id: "603dd20160fd045d1a40ee72",
  businessLay2Id: "603dd20660fd045d1a40ee73",
  businessLay3Id: "603dd20a60fd045d1a40ee74",
  businessLay4Id: "603dd20e60fd045d1a40ee75",
  businessLay5Id: "603dd21260fd045d1a40ee76",
  businessLay6Id: "603dd21660fd045d1a40ee77",
  businessLay7Id: "603dd21a60fd045d1a40ee78",
  businessLay8Id: "603dd21e60fd045d1a40ee79",
  businessLay9Id: "603dd22160fd045d1a40ee7a",
  businessLay10Id: "603dd22660fd045d1a40ee7b",
};
