import "mobx-react/batchingForReactNative";
import { observable, action, decorate, toJS } from "mobx";
import ApolloClient from "../utils/ApolloClient";
import GraphqlQuery from "../utils/GraphqlQuery";
import Constant from "../utils/Constant";

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
  isNewNotification = false;
  lastNotificationTime = undefined;
  userNotificationTime = new Date();

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
          this.userSubCategoriesHome = data.userSubCategoriesAfter;
          this.globleUserSubCategoriesAfter = data.userSubCategoriesAfter;
          this.globleUserSubCategoriesBefore = data.userSubCategoriesBefore;
          this.changeDesignByLanguage();
          this.designLayouts = data.designLayouts;
          this.totalUserSubCategoriesAfter = data.totalUserSubCategoriesAfter;
          this.totalUserSubCategoriesBefore = data.totalUserSubCategoriesBefore;
          this.lastNotificationTime = new Date(data.lastNotificationTime);
          this.calcualteNotificationTime();
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
            ...this.userSubCategoriesAfter,
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
        }
      })
      .catch((error) => {
        this.bhdLoading = false;
        console.error(error);
      });
  };

  loaduserDesigns = (subCategory, start, type, hasPro) => {
    this.udLoading = true;
    ApolloClient.query({
      query: GraphqlQuery.userDesignsP,
      variables: { subCategory: subCategory, start: parseInt(start) },
      fetchPolicy: "cache-first",
      errorPolicy: "all",
    })
      .then(({ data, error }) => {
        this.udLoading = false;

        if (data) {
          // const ud = assignPackageToDesign(
          //   data.userDesignsF,
          //   this.designPackages
          // );

          const ud = data.userDesignsP;
          if (ud.length > 0) {
            const globleUserSubCategoriesAfter = toJS(
              this.globleUserSubCategoriesAfter
            );
            const globleUserSubCategoriesBefore = toJS(
              this.globleUserSubCategoriesBefore
            );
            const userSubCategories =
              type === Constant.userSubCategoryTypeAfter
                ? globleUserSubCategoriesAfter
                : globleUserSubCategoriesBefore;
            const index = userSubCategories.findIndex(
              (item) => item.id === subCategory
            );
            const filterUserSubCategories = userSubCategories;
            const subItem = userSubCategories[index];

            const tempArray = [...subItem.designs, ...ud];
            if (tempArray.length <= subItem.totalDesign) {
              subItem.designs = tempArray;

              let filterSubItem = subItem;
              if (this.designLang !== Constant.designLangCodeAll) {
                filterSubItem.designs = tempArray.filter(
                  (item) => item.language.code === this.designLang
                );
              }

              userSubCategories[index] = subItem;
              filterUserSubCategories[index] = filterSubItem;

              type === Constant.globleuserSubCategoryTypeAfter
                ? (this.globleUserSubCategoriesAfter = [...userSubCategories])
                : (this.globleUserSubCategoriesBefore = [...userSubCategories]);

              type === Constant.userSubCategoryTypeAfter
                ? (this.userSubCategoriesAfter = [...filterUserSubCategories])
                : (this.userSubCategoriesBefore = [...filterUserSubCategories]);
            }
          }

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
  };

  setDesignLang = (code) => {
    this.designLang = code;
  };

  changeDesignByLanguage = () => {
    const currDesignCode = toJS(this.designLang);

    const designAfter = toJS(this.globleUserSubCategoriesAfter);

    const userDesignAfter = designAfter.map((ele, index) => {
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
    const designBefore = toJS(this.globleUserSubCategoriesBefore);

    const userDesignBefore = designBefore.map((ele, index) => {
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

    this.userSubCategoriesAfter = [...userDesignAfter];
    this.userSubCategoriesBefore = [...userDesignBefore];
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
  userSubCategoriesAfter: observable,
  totalUserSubCategoriesAfter: observable,
  userSubCategoriesBefore: observable,
  totalUserSubCategoriesBefore: observable,
  globleUserSubCategoriesAfter: observable,
  globleUserSubCategoriesBefore: observable,
  designLayouts: observable,
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
});

export default new DesignStore();
