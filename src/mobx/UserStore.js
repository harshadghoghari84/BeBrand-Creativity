import "mobx-react/batchingForReactNative";
import { observable, action, decorate } from "mobx";
import Constant from "../utils/Constant";

class UserStore {
  user = null;
  hasPro = false;
  personalImageLimit = 0;
  businessImageLimit = 0;
  startDesignCredit = 0;
  currentDesignCredit = 0;

  setUser = (user) => {
    console.log("new USER", user);
    this.user = user;
    let personalImageLimit = 0;
    let businessImageLimit = 0;

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
    this.user = user;
  };

  addPersonalImage = (profileImage) => {
    const user = this.user;
    if (
      user?.userInfo?.personal?.image &&
      Array.isArray(user.userInfo.personal.image) &&
      user.userInfo.personal.image.length > 0
    ) {
      console.log("inside if");
      user.userInfo.personal.image = [
        ...user.userInfo.personal.image,
        { url: profileImage, isDefault: false },
      ];
    } else {
      console.log("inside else");
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
    const user = this.user;
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

    this.user = user;
  };
  designCraditsCalculate = () => {
    try {
      var val =
        this.user?.designPackage &&
        this.user.designPackage.reduce(function (previousValue, currentValue) {
          return {
            startDesignCredit:
              previousValue.startDesignCredit + currentValue.startDesignCredit,
            currentDesignCredit:
              previousValue.currentDesignCredit +
              currentValue.currentDesignCredit,
          };
        });
      this.startDesignCredit = val.startDesignCredit;
      this.currentDesignCredit = val.currentDesignCredit;
    } catch (error) {
      console.log(error);
    }
  };

  updateCurrantDesignCredit = (updatedCredit) => {
    this.currentDesignCredit = updatedCredit;
  };
}

decorate(UserStore, {
  user: observable,
  hasPro: observable,
  startDesignCredit: observable,
  currentDesignCredit: observable,
  personalImageLimit: observable,
  businessImageLimit: observable,
  setUser: action,
  setOnlyUserDetail: action,
  addPersonalImage: action,
  addBusinessImage: action,
  updateCurrantDesignCredit: action,
});

export default new UserStore();
