import React, { memo } from "react";
import moment from "moment";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Color from "../../utils/Color";
import Common from "../../utils/Common";
import LangKey from "../../utils/LangKey";
import Constant from "../../utils/Constant";

const ItemSubCategory = ({ item, index, isSelectedId, onSelect }) => {
  const color = isSelectedId === index ? Color.primary : Color.black;

  return (
    <TouchableOpacity
      key={index}
      style={styles.mainContainer}
      onPress={() => {
        onSelect(
          item.id !== Constant.defHomeSubCategory
            ? index
            : Constant.defHomeSubCategory
        );
      }}
    >
      <View style={styles.container}>
        {item.id !== Constant.defHomeSubCategory && (
          <Text style={{ ...styles.name, color: color }}>{item.name}</Text>
        )}
        {item.id === Constant.defHomeSubCategory ? (
          <View style={styles.allNameContainer}>
            <Text style={{ ...styles.allName, color: color }}>
              {Common.getTranslation(LangKey.labAll)}
            </Text>
          </View>
        ) : (
          <Image
            source={{ uri: item.image.url }}
            resizeMode="cover"
            style={styles.image}
          />
        )}
        {item.id !== Constant.defHomeSubCategory && (
          <Text style={{ ...styles.date, color: color }}>
            {moment(new Date(item.endDate)).format("DD MMM")}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};
export default memo(ItemSubCategory);

const styles = StyleSheet.create({
  mainContainer: {
    height: Constant.homeItemSubCategoryHeight,
    marginLeft: 10,
    alignItems: "center",
    flexDirection: "column",
  },
  container: { flex: 1 },
  image: {
    width: 75,
    height: 55,
    borderRadius: 10,
    alignItems: "center",
    alignSelf: "center",
  },
  date: {
    textAlign: "center",
    fontSize: 10,
    marginTop: 3,
  },
  name: {
    textAlign: "center",
    fontSize: 12,
    marginBottom: 2,
    fontWeight: "bold",
  },
  allNameContainer: {
    width: 75,
    height: 75,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Color.lightGrey,
  },
  allName: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
  },
});
