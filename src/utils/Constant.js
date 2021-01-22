export default {
  dummyUserData: [
    {
      name: "Narendra Modi",
      designation: "Prime Minister of India",
      mobile: "+919876543210",
      socialMedia: "@narendramodi",
      image:
        "https://www.freepnglogos.com/uploads/modi-png/texas-india-forum-howdy-modi-23.png",
    },
  ],

  // ServerUrl: "http://192.168.0.104:5000/graphql",
  serverUrl: "http://192.168.0.111:5000/gql",
  // ServerUrl: "http://192.168.100.4:5000/graphql",

  splashTime: 1000,

  defLangCode: "en",

  prfUserToken: "userToken",
  prfLangCode: "langCode",

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

  // titles
  titHome: "Home",
  titPro: "Be VIP",
  titNotification: "Notifications",
  titWishlist: "Wishlist",
  titRateApp: "Rate App",
  titShareApp: "Share App",
  titReportIssue: "Report Issue",
  titRequestFeature: "Request Feature",
  titAccount: "Account",
  titProfile: "Profile",
  titPackage: "Package",
  titDesigns: "Designs",
  titWhatsAppUs: "WhatsApp Us",
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
    "logo-facebook",
    "logo-instagram",
    "logo-twitter",
    "logo-youtube",
    "logo-linkedin",
    "logo-github",
    "logo-pinterest",
  ],
  defSocialIconList: [
    "logo-facebook",
    "logo-linkedin",
    "logo-twitter",
    "logo-youtube",
  ],
  designAlbumName: "Be Brandd",

  // Home Constants
  defHomeSubCategory: "All",

  // Home ItemSubCategory
  homeItemSubCategoryHeight: 100,

  // mobx/DesignStore constants
  userSubCategoryTypeAfter: "AFTER",
  userSubCategoryTypeBefore: "BEFORE",

  typeDesignPackageFree: "FREE",
  typeDesignPackagePro: "PRO",
};
