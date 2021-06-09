import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import FastImage from "react-native-fast-image";
// relative path
import Color from "../../utils/Color";
import Constant from "../../utils/Constant";
import Icon from "../../components/svgIcons";
import Common from "../../utils/Common";
import LangKey from "../../utils/LangKey";

const imgWidth = (Dimensions.get("window").width - 45) / 2;

const ItemDesign = ({
  packageType,
  design,
  onDesignClick,
  designDate,
  desIndex,
}) => (
  <>
    <TouchableOpacity
      activeOpacity={0.6}
      style={styles.container}
      onPress={() => onDesignClick(packageType, design, desIndex)}
    >
      <View style={styles.innContainer}>
        <FastImage
          style={styles.imgSubCategoryDesign}
          resizeMode={FastImage.resizeMode.contain}
          source={{
            uri: design?.thumbImage?.url ? design.thumbImage.url : null,
          }}
        />

        {packageType === Constant.typeDesignPackageVip ? (
          <Icon
            style={styles.tagPro}
            name="Premium"
            height={18}
            width={10}
            fill={Color.primary}
          />
        ) : (
          <View style={styles.tagfree}>
            <Text
              style={{
                color: Color.white,
                fontSize: 11,
                fontFamily: "Nunito-Regular",
              }}
            >
              {Common.getTranslation(LangKey.free)}
            </Text>
          </View>
        )}

        {designDate && (
          <Text style={styles.txtDesignDate}>
            {designDate.substring(0, 10)}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  </>
);
export default ItemDesign;

const styles = StyleSheet.create({
  container: {
    marginLeft: 15,
    marginBottom: 15,
    borderRadius: 3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 3,
    shadowColor: "black",
    shadowOpacity: 0.2,
    elevation: Platform.OS === "ios" ? 7 : 2,
  },
  innContainer: { borderRadius: 3, overflow: "hidden" },
  imgSubCategoryDesign: {
    width: imgWidth,
    height: imgWidth,
  },
  tagPro: {
    paddingHorizontal: 8,
    marginRight: 5,
    marginTop: 5,
    color: Color.white,
    position: "absolute",
    right: 0,
    overflow: "hidden",
  },

  tagfree: {
    paddingHorizontal: 5,
    marginRight: 5,
    marginTop: 5,
    backgroundColor: Color.blackTransTagFree,
    borderRadius: 5,
    position: "absolute",
    right: 0,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  txtDesignDate: {
    backgroundColor: Color.bkgDesignDate,
    paddingHorizontal: 6,
    fontSize: 10,
    color: Color.txtDesignDate,
    position: "absolute",
    right: 0,
    bottom: 0,
    overflow: "hidden",
  },
  imghewi: {
    height: 70,
    width: "100%",
  },
});
