import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Color from "../utils/Color";

const ListTags = ({ item }) => (
  <View style={styles.imgTagContainer}>
    <View style={styles.redTagContainer}>
      <Text style={styles.redTagText}>
        {getDiscountPercentage(item.act_price, item.dis_price)} off
      </Text>
    </View>
    {item.status == 0 ? (
      <View style={styles.greenTagContainer}>
        <Text style={styles.greenTagText}>In Stock</Text>
      </View>
    ) : (
      <View style={styles.grayTagContainer}>
        <Text style={styles.grayTagText}>Out of Stock</Text>
      </View>
    )}
  </View>
);

const getDiscountPercentage = (mrp, price) => {
  const fMrp = parseFloat(mrp);
  const fPrice = parseFloat(price);

  const discount = fMrp - fPrice;
  const disPer = (discount / fMrp) * 100;

  return `${disPer.toFixed()}%`;
};

export default ListTags;

const styles = StyleSheet.create({
  imgTagContainer: {
    position: "absolute",
    flexDirection: "row",
    marginLeft: 5,
    marginTop: 5,
  },
  greenTagContainer: {
    backgroundColor: Color.greenLight,
    paddingHorizontal: 5,
    paddingHorizontal: 3,
    paddingVertical: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 5,
    borderRadius: 4,
  },
  redTagContainer: {
    backgroundColor: Color.redLight,
    paddingHorizontal: 3,
    paddingVertical: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 5,
    borderRadius: 4,
  },
  grayTagContainer: {
    backgroundColor: Color.grayLight,
    paddingHorizontal: 3,
    paddingVertical: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 5,
    borderRadius: 4,
  },
  greenTagText: {
    color: Color.black,
    fontWeight: "100",
    fontSize: 10,
  },
  redTagText: {
    color: Color.white,
    fontWeight: "100",
    fontSize: 10,
  },
  grayTagText: {
    color: Color.black,
    fontWeight: "100",
    fontSize: 10,
  },
});
