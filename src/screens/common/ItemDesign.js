import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import Color from "../../utils/Color";
import Constant from "../../utils/Constant";
import FastImage from "react-native-fast-image";
const imgWidth = (Dimensions.get("window").width - 30) / 2;

const ItemDesign = ({ packageType, design, onDesignClick, designDate }) => (
  <TouchableOpacity
    style={styles.container}
    onPress={() => onDesignClick(packageType, design)}
  >
    <View>
      <FastImage
        style={styles.imgSubCategoryDesign}
        resizeMode={FastImage.resizeMode.contain}
        source={{ uri: design.thumbImage.url }}
      />
      {packageType === Constant.typeDesignPackagePro && (
        <Text style={styles.tagPro}>{packageType}</Text>
      )}

      {designDate && (
        <Text style={styles.txtDesignDate}>{designDate.substring(0, 10)}</Text>
      )}
    </View>
  </TouchableOpacity>
);
export default ItemDesign;

const styles = StyleSheet.create({
  container: { marginLeft: 10, marginBottom: 10 },
  imgSubCategoryDesign: {
    width: imgWidth,
    height: imgWidth,
  },
  tagPro: {
    backgroundColor: Color.tagColor,
    paddingHorizontal: 8,
    marginRight: 5,
    marginTop: 5,
    borderRadius: 5,
    fontSize: 10,
    color: Color.tagTextColor,
    position: "absolute",
    right: 0,
    overflow: "hidden",
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
});
