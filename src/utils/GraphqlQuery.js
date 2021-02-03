import { gql } from "@apollo/client";

export default {
  userLogin: gql`
    mutation userLogin($userId: String!, $password: String!) {
      userLogin(userId: $userId, password: $password) {
        token
        msg
        user {
          mobile
          userInfo {
            personal {
              name
              mobile
              email
              designation
              website
              socialMediaId
              image {
                url
                isDefault
              }
            }
            business {
              name
              mobile
              email
              address
              website
              socialMediaId
              image {
                url
                isDefault
              }
            }
          }
          designPackage {
            package {
              id
              type
              name
            }
            startDesignCredit
            currentDesignCredit
            personalImageLimit
            businessImageLimit
            price
            purchaseDate
            expiryDate
          }
        }
      }
    }
  `,
  userSignup: gql`
    mutation userSignup($mobile: String!, $password: String!) {
      userSignup(mobile: $mobile, password: $password)
    }
  `,
  userSignupSocial: gql`
    mutation userSignupSocial(
      $token: String!
      $name: String!
      $email: String!
      $mobile: String!
    ) {
      userSignupSocial(
        token: $token
        name: $name
        email: $email
        mobile: $mobile
      ) {
        token
        msg
        user {
          mobile
          userInfo {
            personal {
              name
              mobile
              email
              designation
              website
              socialMediaId
              image {
                url
                isDefault
              }
            }
            business {
              name
              mobile
              email
              address
              website
              socialMediaId
              image {
                url
                isDefault
              }
            }
          }
          designPackage {
            package {
              id
              type
              name
            }
            startDesignCredit
            currentDesignCredit
            personalImageLimit
            businessImageLimit
            price
            purchaseDate
            expiryDate
          }
        }
      }
    }
  `,

  verifyUserOtp: gql`
    query verifyUserOtp($mobile: String!, $otp: String!) {
      verifyUserOtp(mobile: $mobile, otp: $otp) {
        token
        msg
        user {
          mobile
          userInfo {
            personal {
              name
              mobile
              email
              designation
              website
              socialMediaId
              image {
                url
                isDefault
              }
            }
            business {
              name
              mobile
              email
              address
              website
              socialMediaId
              image {
                url
                isDefault
              }
            }
          }
          designPackage {
            package {
              id
              type
              name
            }
            startDesignCredit
            currentDesignCredit
            personalImageLimit
            businessImageLimit
            price
            purchaseDate
            expiryDate
          }
        }
      }
    }
  `,
  verifyUserToken: gql`
    query {
      verifyUserToken
    }
  `,
  user: gql`
    query {
      user(id: "") {
        mobile
        userInfo {
          personal {
            name
            mobile
            email
            designation
            website
            socialMediaId
            image {
              url
              isDefault
            }
          }
          business {
            name
            mobile
            email
            address
            website
            socialMediaId
            image {
              url
              isDefault
            }
          }
        }
        designPackage {
          package {
            id
            type
            name
          }
          startDesignCredit
          currentDesignCredit
          personalImageLimit
          businessImageLimit
          price
          purchaseDate
          expiryDate
        }
      }
    }
  `,
  homeData: gql`
    query UserSubCategories(
      $afterStart: Int!
      $beforeStart: Int!
      $afterType: UserSubCategoryType!
      $beforeType: UserSubCategoryType!
    ) {
      userSubCategoriesAfter: userSubCategories(
        start: $afterStart
        type: $afterType
      ) {
        id
        name
        startDate
        endDate
        totalDesign
        image {
          url
        }
        designs {
          id
          layouts
          designType
          subCategory
          package
          language {
            code
          }
          thumbImage {
            url
          }
          designImage {
            url
          }
          colorCodes {
            code
            isLight
          }
          darkTextColor
          lightTextColor
          categoryRank
        }
      }

      userSubCategoriesBefore: userSubCategories(
        start: $beforeStart
        type: $beforeType
      ) {
        id
        name
        startDate
        endDate
        totalDesign
        image {
          url
        }
        designs {
          id
        }
      }

      totalUserSubCategoriesAfter: totalUserSubCategories(type: $afterType)

      totalUserSubCategoriesBefore: totalUserSubCategories(type: $beforeType)

      designLayouts {
        id
        layoutName
        layoutType
        package {
          id
          type
        }
        layoutFields {
          name
          designation
          mobile
          image
          footer
          socialMediaView
          socialMediaLabel
          socialMediaName
          socialIcon
        }
        layoutImage {
          url
        }
        footerImage {
          url
        }
      }

      designPackages {
        id
        type
        name
        actualPrice
        discountPrice
      }
    }
  `,
  userSubCategoriesAfter: gql`
    query userSubCategories(
      $afterStart: Int!
      $afterType: UserSubCategoryType!
    ) {
      userSubCategoriesAfter: userSubCategories(
        start: $afterStart
        type: $afterType
      ) {
        id
        name
        startDate
        endDate
        totalDesign
        image {
          url
        }
        designs {
          id
          layouts
          subCategory
          package
          thumbImage {
            url
          }
          colorCodes {
            code
            isLight
          }
          darkTextColor
          lightTextColor
          categoryRank
        }
      }
    }
  `,
  userSubCategoriesBefore: gql`
    query userSubCategories(
      $beforeStart: Int!
      $beforeType: UserSubCategoryType!
    ) {
      userSubCategoriesBefore: userSubCategories(
        start: $beforeStart
        type: $beforeType
      ) {
        id
        name
        startDate
        endDate
        totalDesign
        image {
          url
        }
        designs {
          id
        }
      }
    }
  `,
  userDesignsF: gql`
    query UserDesignsF($subCategory: String!, $start: Int!) {
      userDesignsF(subCategory: $subCategory, start: $start) {
        id
        layouts
        designType
        subCategory
        package
        language {
          code
        }
        thumbImage {
          url
        }
        designImage {
          url
        }
        colorCodes {
          code
          isLight
        }
        darkTextColor
        lightTextColor
        categoryRank
      }
    }
  `,
  userDesignsP: gql`
    query UserDesignsP($subCategory: String!, $start: Int!) {
      userDesignsP(subCategory: $subCategory, start: $start) {
        id
        layouts
        subCategory
        package
        language {
          code
        }
        thumbImage {
          url
        }
        designImage {
          url
        }
        colorCodes {
          code
          isLight
        }
        darkTextColor
        lightTextColor
        categoryRank
      }
    }
  `,
  initPerchasedDesigns: gql`
    query PerchasedDesigns($start: Int!) {
      perchasedDesigns(start: $start) {
        id
        purchaseDate
        design {
          id
          layouts
          subCategory
          package
          thumbImage {
            url
          }
          colorCodes {
            code
            isLight
          }
          darkTextColor
          lightTextColor
          categoryRank
        }
      }

      totalPerchasedDesigns
    }
  `,
  perchasedDesigns: gql`
    query PerchasedDesigns($start: Int!) {
      perchasedDesigns(start: $start) {
        id
        purchaseDate
        design {
          id
          layouts
          subCategory
          package
          thumbImage {
            url
          }
          colorCodes {
            code
            isLight
          }
          darkTextColor
          lightTextColor
          categoryRank
        }
      }

      totalPerchasedDesigns
    }
  `,
  initPerchasedPackages: gql`
    query PerchasedPackages($start: Int!) {
      totalPerchasedPackages

      perchasedPackages(start: $start) {
        id
        startDesignCredit
        currentDesignCredit
        price
        purchaseDate
        expiryDate
        package {
          id
          name
          type
          image {
            url
          }
        }
      }
    }
  `,
  perchasedPackages: gql`
    query PerchasedPackages($start: Int!) {
      perchasedPackages(start: $start) {
        id
        startDesignCredit
        currentDesignCredit
        price
        purchaseDate
        expiryDate
        package {
          id
          name
          type
          image {
            url
          }
        }
      }
    }
  `,
  addUserDesign: gql`
    mutation AddUserDesign($designId: String!) {
      addUserDesign(designId: $designId)
    }
  `,
  addPersonalImage: gql`
    mutation($image: GraphQLUpload!) {
      addPersonalImage(image: $image)
    }
  `,
  addBusinessImage: gql`
    mutation($image: GraphQLUpload!) {
      addBusinessImage(image: $image)
    }
  `,
  updatePersonalUserInfo: gql`
    mutation(
      $name: String!
      $mobile: String
      $email: String
      $designation: String
      $website: String
      $socialMediaId: String
      $defaultImageUrl: String
    ) {
      updatePersonalUserInfo(
        name: $name
        mobile: $mobile
        email: $email
        designation: $designation
        website: $website
        socialMediaId: $socialMediaId
        defaultImageUrl: $defaultImageUrl
      )
    }
  `,
  updateBusinessUserInfo: gql`
    mutation(
      $name: String!
      $mobile: String
      $email: String
      $address: String
      $website: String
      $socialMediaId: String
      $defaultImageUrl: String
    ) {
      updateBusinessUserInfo(
        name: $name
        mobile: $mobile
        email: $email
        address: $address
        website: $website
        socialMediaId: $socialMediaId
        defaultImageUrl: $defaultImageUrl
      )
    }
  `,
};
