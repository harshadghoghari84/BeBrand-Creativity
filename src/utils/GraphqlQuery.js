import { gql } from "@apollo/client";

export default {
  userLogin: gql`
    mutation userLogin($userId: String!, $password: String!) {
      userLogin(userId: $userId, password: $password) {
        token
        msg
        user {
          id
          name
          mobile
          whatsappNo
          isWhatsappUpdateEnable
          birthDate
          anniversaryDate
          state
          city
          refCode
          parentRefCode
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
              image {
                url
              }
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
  sendUserOtp: gql`
    mutation sendUserOtp($mobile: String!) {
      sendUserOtp(mobile: $mobile)
    }
  `,
  updateAnltData: gql`
    mutation updateAnltData($imperssion: [String]!, $view: [String]!) {
      updateAnltData(imperssion: $imperssion, view: $view)
    }
  `,
  generateRefCode: gql`
    mutation {
      generateRefCode
    }
  `,
  addRefCode: gql`
    mutation addRefCode($refCode: String!) {
      addRefCode(refCode: $refCode) {
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
  totalReferralPackages: gql`
    query totalReferralPackages($onlyActive: Boolean!) {
      totalReferralPackages(onlyActive: $onlyActive)
    }
  `,
  userSignupSocial: gql`
    mutation userSignupSocial($token: String!) {
      userSignupSocial(token: $token) {
        token
        msg
        user {
          id
          name
          mobile
          whatsappNo
          isWhatsappUpdateEnable
          birthDate
          anniversaryDate
          state
          city
          refCode
          parentRefCode
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
              image {
                url
              }
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
          id
          name
          mobile
          whatsappNo
          isWhatsappUpdateEnable
          birthDate
          anniversaryDate
          state
          city
          refCode
          parentRefCode
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
              image {
                url
              }
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
  resetUserPassword: gql`
    query resetUserPassword(
      $mobile: String!
      $password: String!
      $otp: String!
    ) {
      resetUserPassword(mobile: $mobile, password: $password, otp: $otp) {
        token
        msg
        user {
          id
          name
          mobile
          whatsappNo
          isWhatsappUpdateEnable
          birthDate
          anniversaryDate
          state
          city
          refCode
          parentRefCode
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
              image {
                url
              }
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
  referralPackages: gql`
    query ($start: Int!) {
      referralPackages(start: $start) {
        id
        refUser {
          id
          name
          mobile
        }
        status
        createdAt
      }
    }
  `,
  verifyUserToken: gql`
    query {
      verifyUserToken
    }
  `,
  notifications: gql`
    query {
      notifications {
        id
        title
        body
        type
        status
        updatedAt
      }
    }
  `,
  user: gql`
    query {
      user(id: "") {
        id
        name
        mobile
        whatsappNo
        isWhatsappUpdateEnable
        birthDate
        anniversaryDate
        state
        city
        refCode
        parentRefCode
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
            image {
              url
            }
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
      languages {
        code
        name
      }

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

      designLayouts {
        id

        layoutType
      }

      designPackages {
        id
        name
        type
        actualPrice
        discountPrice
        designCredit
        description
        businessImageLimit
        personalImageLimit
        validity
        features
        image {
          url
        }
      }
      designPackagesIos {
        id
        name
        type
        actualPrice
        discountPrice
        designCredit
        description
        businessImageLimit
        personalImageLimit
        validity
        features
        image {
          url
        }
      }
      lastNotificationTime
      modalOffers {
        id
        width
        height
        image {
          url
        }
        status
      }
    }
  `,
  offers: gql`
    query {
      offers {
        id
        title
        message
        image {
          url
        }
        link {
          linkType
          linkData
        }
      }
    }
  `,
  appVersionDetails: gql`
    query {
      appDetail {
        androidVersion
        iosVersion
        androidPackage
        iosBundle
        width
        height
        isDismissible
        ratingTime
        image {
          url
        }
      }
    }
  `,
  userOtherSubCategories: gql`
    query userOtherSubCategories(
      $OtherStart: Int!
      $OtherType: UserOtherSubCategoryType!
    ) {
      userOtherSubCategories: userOtherSubCategories(
        start: $OtherStart
        type: $OtherType
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
          designType
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
        designType
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
          designType
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
          designType
          subCategory
          package
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

      totalPerchasedDesigns
    }
  `,
  initPerchasedPackages: gql`
    query perchasedPackages($start: Int!) {
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
    query perchasedPackages($start: Int!) {
      perchasedPackagesV2(start: $start) {
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
      addUserDesignV2(designId: $designId)
    }
  `,
  addPersonalImage: gql`
    mutation ($image: GraphQLUpload!) {
      addPersonalImageV2(image: $image)
    }
  `,
  addBusinessImage: gql`
    mutation ($image: GraphQLUpload!) {
      addBusinessImageV2(image: $image)
    }
  `,
  addRequestFeature: gql`
    mutation ($feature: String!) {
      addRequestFeature(feature: $feature)
    }
  `,
  deletePersonalImage: gql`
    mutation ($image: String!) {
      deletePersonalImage(image: $image)
    }
  `,
  deleteBusinessImage: gql`
    mutation ($image: String!) {
      deleteBusinessImage(image: $image)
    }
  `,
  deleteBusinessImage: gql`
    mutation ($image: String!) {
      deleteBusinessImage(image: $image)
    }
  `,
  addOrder: gql`
    mutation ($packageId: String!) {
      addOrder(packageId: $packageId)
    }
  `,
  activateRefferal: gql`
    mutation ($id: ID!) {
      activateRefferal(id: $id) {
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

  updateWhatsappInfo: gql`
    mutation ($whatsappNo: String!, $isUpdateEnable: Boolean!) {
      updateWhatsappInfo(
        whatsappNo: $whatsappNo
        isUpdateEnable: $isUpdateEnable
      )
    }
  `,
  addUserDesignPackage: gql`
    mutation (
      $packageId: String!
      $androidPerchaseToken: String
      $iosPerchaseReceipt: String
    ) {
      addUserDesignPackage(
        packageId: $packageId
        androidPerchaseToken: $androidPerchaseToken
        iosPerchaseReceipt: $iosPerchaseReceipt
      ) {
        id
        package {
          id
          name
          description
          type
          actualPrice
          discountPrice
          designCredit
          businessImageLimit
          personalImageLimit
          validity
          image {
            url
          }
          features
          status
          updatedAt
          createdAt
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
  `,
  addUserDesignPackageRzp: gql`
    mutation (
      $orderId: String!
      $paymentId: String!
      $paymentSignature: String!
    ) {
      addUserDesignPackageRzp(
        orderId: $orderId
        paymentId: $paymentId
        paymentSignature: $paymentSignature
      ) {
        id
        package {
          id
          name
          description
          type
          actualPrice
          discountPrice
          designCredit
          businessImageLimit
          personalImageLimit
          validity
          image {
            url
          }
          features
          status
          updatedAt
          createdAt
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
  `,

  updatePersonalUserInfo: gql`
    mutation (
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
    mutation (
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
