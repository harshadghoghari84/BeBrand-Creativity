import "mobx-react/batchingForReactNative";
import { observable, action, decorate, toJS } from "mobx";
import Constant from "../utils/Constant";

class UserStore {
  user = null;
  hasPro = false;
  personalImageLimit = 0;
  businessImageLimit = 0;
  // startDesignCredit = 0;
  // currentDesignCredit = 0;
  startFreeDesignCredit = 0;
  currentFreeDesignCredit = 0;
  startProDesignCredit = 0;
  currentProDesignCredit = 0;

  setToDefault = () => {
    this.hasPro = false;
    this.personalImageLimit = 0;
    this.businessImageLimit = 0;
    // this.startDesignCredit = 0;
    // this.currentDesignCredit = 0;
    this.startFreeDesignCredit = 0;
    this.currentFreeDesignCredit = 0;
    this.startProDesignCredit = 0;
    this.currentProDesignCredit = 0;
  };

  setUser = (user) => {
    console.log("user", user);
    this.user = user;
    let personalImageLimit = 0;
    let businessImageLimit = 0;

    if (!user || user == undefined) {
      this.setToDefault();
    }

    if (
      user &&
      user !== null &&
      Array.isArray(user.designPackage) &&
      user.designPackage.length > 0
    ) {
      user.designPackage.forEach((item) => {
        if (
          item.package.type === Constant.typeDesignPackageVip &&
          this.hasPro === false
        ) {
          this.hasPro = true;
        }

        // set personal image limits
        const personalLimit = item.personalImageLimit
          ? item.personalImageLimit
          : 0;
        if (personalLimit > personalImageLimit) {
          personalImageLimit = personalLimit;
        }

        // set business image limits
        const businessLimit = item.businessImageLimit
          ? item.businessImageLimit
          : 0;
        if (businessLimit > businessImageLimit) {
          businessImageLimit = businessLimit;
        }
      });
      this.designCraditsCalculate();

      this.personalImageLimit = personalImageLimit;
      this.businessImageLimit = businessImageLimit;
    } else {
      this.hasPro = false;
    }
  };

  setOnlyUserDetail = (user) => {
    console.log("new user", user);

    if (!user || user == undefined) {
      this.setToDefault();
    }
    this.user = user;
  };

  addPersonalImage = (profileImage) => {
    const user = toJS(this.user);
    if (
      user?.userInfo?.personal?.image &&
      Array.isArray(user.userInfo.personal.image) &&
      user.userInfo.personal.image.length > 0
    ) {
      user.userInfo.personal.image = [
        ...user.userInfo.personal.image,
        { url: profileImage, isDefault: false },
      ];
    } else {
      const data = user?.userInfo?.personal ? user.userInfo.personal : {};
      user.userInfo = {
        ...user.userInfo,
        personal: {
          ...data,
          image: [{ url: profileImage, isDefault: true }],
        },
      };
    }

    this.user = user;
  };

  addBusinessImage = (profileImage) => {
    const user = toJS(this.user);
    if (
      user?.userInfo?.business?.image &&
      Array.isArray(user.userInfo.business.image) &&
      user.userInfo.business.image.length > 0
    ) {
      user.userInfo.business.image = [
        ...user.userInfo.business.image,
        { url: profileImage, isDefault: false },
      ];
    } else {
      const data = user?.userInfo?.business ? user.userInfo.business : {};
      user.userInfo = {
        ...user.userInfo,
        business: {
          ...data,
          image: [{ url: profileImage, isDefault: true }],
        },
      };
    }

    console.log("user chk else", user);
    this.user = user;
  };
  designCraditsCalculate = () => {
    try {
      // let startFreeDesignCredit = 0;
      // let currentFreeDesignCredit = 0;
      let startProDesignCredit = 0;
      let currentProDesignCredit = 0;

      this.user?.designPackage &&
        this.user.designPackage.forEach((item) => {
          if (item.package.type === Constant.typeDesignPackageVip) {
            startProDesignCredit += item.startDesignCredit;
            currentProDesignCredit += item.currentDesignCredit;
          }
        });

      // this.startFreeDesignCredit = startFreeDesignCredit;
      // this.currentFreeDesignCredit = currentFreeDesignCredit;
      this.startProDesignCredit = startProDesignCredit;
      this.currentProDesignCredit = currentProDesignCredit;
    } catch (error) {
      console.log(error);
    }
  };

  // updateCurrantDesignCreditFree = (updatedCredit) => {
  //   this.currentFreeDesignCredit = updatedCredit;
  // };
  updateCurrantDesignCreditPro = (updatedCredit) => {
    if (updatedCredit <= 0) {
      this.hasPro = false;
    }
    this.currentProDesignCredit = updatedCredit;
  };
}

decorate(UserStore, {
  user: observable,
  hasPro: observable,
  startFreeDesignCredit: observable,
  startProDesignCredit: observable,
  currentFreeDesignCredit: observable,
  currentProDesignCredit: observable,
  personalImageLimit: observable,
  businessImageLimit: observable,
  setUser: action,
  setOnlyUserDetail: action,
  addPersonalImage: action,
  addBusinessImage: action,
  updateCurrantDesignCredit: action,
});

export default new UserStore();
