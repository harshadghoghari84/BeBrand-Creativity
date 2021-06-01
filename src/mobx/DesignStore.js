import "mobx-react/batchingForReactNative";
import { observable, action, decorate, toJS } from "mobx";
import ApolloClient from "../utils/ApolloClient";
import GraphqlQuery from "../utils/GraphqlQuery";
import Constant from "../utils/Constant";
import AsyncStorage from "@react-native-async-storage/async-storage";

const assignPackageToSubCategory = (subCategoryArray, packageArray) => {
  subCategoryArray.map((item) => {
    const designs = item.designs;
    item.designs = assignPackageToDesign(designs, packageArray);
    return item;
  });

  return subCategoryArray;
};

const assignPackageToDesign = (designArray, packageArray) => {
  designArray.map((item) => {
    const packageId = item.package;
    const pkg = packageArray.find((item) => item.id === packageId);
    item.package = pkg;
    return item;
  });

  return designArray;
};

class DesignStore {
  isDownloadStartedPersonal = false;
  isDownloadStartedBusiness = false;
  isPersonalDesignLoad = false;
  isBusinessDesignLoad = false;
  hdLoading = true;
  ahdLoading = false;
  bhdLoading = false;
  designLang = Constant.designLangCodeAll;
  userSubCategoriesHome = [];
  userSubCategoriesAfter = [];
  userSubCategoriesBefore = [];
  globleUserSubCategoriesAfter = [];
  globleUserSubCategoriesBefore = [];
  totalUserSubCategoriesAfter = 0;
  totalUserSubCategoriesBefore = 0;
  designLayouts = [];
  designPackages = [];
  designPackagesIos = [];
  languages = [];
  isNewNotification = false;
  lastNotificationTime = undefined;
  userNotificationTime = new Date();
  modalOffers = [];
  anltDataObj = {};
  socialIconsPersonal = [];
  socialIconsBusiness = [];

  udLoading = false;
  userDesignsF = [];

  loadHomeData = () => {
    this.hdLoading = true;
    ApolloClient.query({
      query: GraphqlQuery.homeData,
      variables: {
        afterStart: 0,
        beforeStart: 0,
        afterType: Constant.userSubCategoryTypeAfter,
        beforeType: Constant.userSubCategoryTypeBefore,
      },
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    })
      .then(({ data, error }) => {
        this.hdLoading = false;

        if (data) {
          this.designPackages = data.designPackages;
          this.designPackagesIos = data.designPackagesIos;
          this.userSubCategoriesHome = data.userSubCategoriesAfter;
          this.globleUserSubCategoriesAfter = data.userSubCategoriesAfter;
          this.globleUserSubCategoriesBefore = data.userSubCategoriesBefore;
          this.changeDesignByLanguage();
          this.designLayouts = data.designLayouts;
          this.totalUserSubCategoriesAfter = data.totalUserSubCategoriesAfter;
          this.totalUserSubCategoriesBefore = data.totalUserSubCategoriesBefore;
          this.lastNotificationTime = new Date(data.lastNotificationTime);
          this.languages = data.languages;
          this.calcualteNotificationTime();
          this.anlticData();
          this.modalOffers = data.modalOffers;
        }
      })
      .catch((error) => {
        this.hdLoading = false;
        console.error(error);
      });
  };

  loadMoreAfterSubCategories = (start) => {
    this.ahdLoading = true;
    ApolloClient.query({
      query: GraphqlQuery.userSubCategoriesAfter,
      variables: {
        afterStart: start,
        afterType: Constant.userSubCategoryTypeAfter,
      },
      fetchPolicy: "cache-first",
      errorPolicy: "all",
    })
      .then(({ data, error }) => {
        this.ahdLoading = false;

        if (data) {
          // const afterData = assignPackageToSubCategory(
          //   data.userSubCategoriesAfter,
          //   this.designPackages
          // );
          this.userSubCategoriesAfter = [
            ...toJS(this.userSubCategoriesAfter),
            ...data.userSubCategoriesAfter,
          ];
          this.globleUserSubCategoriesAfter = [
            ...toJS(this.globleUserSubCategoriesAfter),
            ...data.userSubCategoriesAfter,
          ];
        }
      })
      .catch((error) => {
        this.ahdLoading = false;
        console.error(error);
      });
  };

  loadMoreBeforeSubCategories = (start) => {
    this.bhdLoading = true;
    ApolloClient.query({
      query: GraphqlQuery.userSubCategoriesBefore,
      variables: {
        afterStart: start,
        afterType: Constant.userSubCategoryTypeAfter,
      },
      fetchPolicy: "cache-first",
      errorPolicy: "all",
    })
      .then(({ data, error }) => {
        this.ahdLoading = false;

        if (data) {
          // const afterData = assignPackageToSubCategory(
          //   data.userSubCategoriesAfter,
          //   this.designPackages
          // );
          this.userSubCategoriesBefore = [
            ...this.userSubCategoriesBefore,
            ...data.userSubCategoriesBefore,
          ];
          this.globleUserSubCategoriesBefore = [
            ...this.globleUserSubCategoriesBefore,
            ...data.userSubCategoriesBefore,
          ];
        }
      })
      .catch((error) => {
        this.bhdLoading = false;
        console.error(error);
      });
  };

  loaduserDesigns = async (subCategory, start, type, hasPro) => {
    if (!this.udLoading) {
      this.udLoading = true;
      ApolloClient.query({
        query: GraphqlQuery.userDesignsP,
        variables: { subCategory: subCategory, start: parseInt(start) },
        fetchPolicy: "cache-first",
        errorPolicy: "all",
      })
        .then(({ data, error }) => {
          if (data) {
            const ud = data.userDesignsP;
            if (ud.length > 0) {
              const globleUserSubCategoriesAfter = toJS(
                this.globleUserSubCategoriesAfter
              );
              const globleUserSubCategoriesBefore = toJS(
                this.globleUserSubCategoriesBefore
              );

              let userSubCategories = [];
              if (type === Constant.userSubCategoryTypeAfter) {
                userSubCategories = globleUserSubCategoriesAfter;
              } else {
                userSubCategories = globleUserSubCategoriesBefore;
              }

              const index = userSubCategories.findIndex(
                (item) => item.id === subCategory
              );
              let subItem = userSubCategories[index];

              const tempArray = [...subItem.designs, ...ud];

              if (tempArray.length <= subItem.totalDesign) {
                subItem.designs = tempArray;

                userSubCategories[index] = subItem;

                type === Constant.globleuserSubCategoryTypeAfter
                  ? (this.globleUserSubCategoriesAfter = [...userSubCategories])
                  : (this.globleUserSubCategoriesBefore = [
                      ...userSubCategories,
                    ]);
              }
            }
            this.udLoading = false;

            this.changeDesignByLanguage();

            // if (ud.length > 0) {
            //   this.userSubCategoriesAfter.map((item) => {
            //     if (item.id === subCategory) {
            //       item.designs = [...item.designs, ...ud];
            //     }
            //     return item;
            //   });
            // }
          }
        })
        .catch((error) => {
          this.udLoading = false;
          console.error(error);
        });
    }
  };

  setDesignLang = (code) => {
    this.designLang = code;
    this.changeDesignByLanguage();
  };

  changeDesignByLanguage = () => {
    const currDesignCode = toJS(this.designLang);

    let designAfter = toJS(this.globleUserSubCategoriesAfter);
    let designBefore = toJS(this.globleUserSubCategoriesBefore);

    if (currDesignCode !== Constant.designLangCodeAll) {
      designAfter = designAfter.map((ele, index) => {
        if (
          ele.designs !== undefined &&
          ele.designs !== null &&
          currDesignCode !== Constant.designLangCodeAll &&
          ele.designs.length > 0
        ) {
          ele.designs = ele.designs.filter(
            (item) => item.language.code === currDesignCode
          );
        }
        return ele;
      });

      designBefore = designBefore.map((ele, index) => {
        if (
          ele.designs !== undefined &&
          ele.designs !== null &&
          currDesignCode !== Constant.designLangCodeAll &&
          ele.designs.length > 0
        ) {
          ele.designs = ele.designs.filter(
            (item) => item.language.code === currDesignCode
          );
        }
        return ele;
      });
    }

    this.userSubCategoriesAfter = [...designAfter];
    this.userSubCategoriesBefore = [...designBefore];
  };

  setIsDownloadStartedPersonal = (val) => {
    this.isDownloadStartedPersonal = val;
  };
  setIsDownloadStartedBusiness = (val) => {
    this.isDownloadStartedBusiness = val;
  };
  setIsPersonalDesignLoad = (val) => {
    this.isPersonalDesignLoad = val;
  };
  setIsBusinessDesignLoad = (val) => {
    this.isBusinessDesignLoad = val;
  };

  setUserNotificationTime = (val) => {
    this.userNotificationTime = new Date(val);

    if (this.lastNotificationTime && this.lastNotificationTime !== null) {
      this.calcualteNotificationTime();
    }
  };

  calcualteNotificationTime = () => {
    this.isNewNotification =
      this.userNotificationTime.getTime() < this.lastNotificationTime.getTime();
  };
  updateSocialIconsPersonal = (val) => {
    this.socialIconsPersonal = val;
  };
  updateSocialIconsBusiness = (val) => {
    this.socialIconsBusiness = val;
  };
  anlticData = async () => {
    let obj = {
      imp: [],
      vie: [],
    };
    await AsyncStorage.getItem(Constant.prfImpression)
      .then((res) => {
        if (res && res !== null) {
          obj.imp = JSON.parse(res);
        }
      })
      .catch((err) => console.log(err));
    await AsyncStorage.getItem(Constant.prfViewDesigns)
      .then((res) => {
        if (res && res !== null) {
          obj.vie = JSON.parse(res);
        }
      })
      .catch((err) => console.log(err));
    // await AsyncStorage.getItem(Constant.prfViewDesignsBusiness)
    //   .then((res) => {
    //     if (res && res !== null) {
    //       obj.vie = [...obj.vie, JSON.parse(res)];
    //     }
    //   })
    //   .catch((err) => console.log(err));
    this.anltDataObj = toJS(obj);
  };
}

decorate(DesignStore, {
  isDownloadStartedPersonal: observable,
  isDownloadStartedBusiness: observable,
  isPersonalDesignLoad: observable,
  isBusinessDesignLoad: observable,
  isNewNotification: observable,
  hdLoading: observable,
  ahdLoading: observable,
  bhdLoading: observable,
  udLoading: observable,
  designPackages: observable,
  designPackagesIos: observable,
  modalOffers: observable,
  userSubCategoriesAfter: observable,
  totalUserSubCategoriesAfter: observable,
  userSubCategoriesBefore: observable,
  totalUserSubCategoriesBefore: observable,
  globleUserSubCategoriesAfter: observable,
  globleUserSubCategoriesBefore: observable,
  designLayouts: observable,
  anltDataObj: observable,
  languages: observable,
  socialIconsPersonal: observable,
  socialIconsBusiness: observable,
  updateSocialIconsPersonal: action,
  updateSocialIconsBusiness: action,
  loadHomeData: action,
  loadMoreAfterSubCategories: action,
  loadMoreBeforeSubCategories: action,
  loaduserDesigns: action,
  setDesignLang: action,
  changeDesignByLanguage: action,
  setIsDownloadStartedPersonal: action,
  setIsDownloadStartedBusiness: action,
  setIsPersonalDesignLoad: action,
  setIsBusinessDesignLoad: action,
  setUserNotificationTime: action,
  anlticData: action,
});

export default new DesignStore();
