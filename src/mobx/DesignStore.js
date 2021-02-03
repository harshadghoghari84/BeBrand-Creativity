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
  hdLoading = false;
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
      query: hasPro ? GraphqlQuery.userDesignsP : GraphqlQuery.userDesignsF,
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

          const ud = hasPro ? data.userDesignsP : data.userDesignsF;
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
    console.log("currDesignCode", currDesignCode);
    const designAfter = toJS(this.globleUserSubCategoriesAfter);
    console.log("____After >", designAfter);
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
    console.log("____Before >", designBefore);

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
}

decorate(DesignStore, {
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
});

export default new DesignStore();
