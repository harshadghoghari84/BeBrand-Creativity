import React from "react";
import { TouchableWithoutFeedback, StyleSheet } from "react-native";
import FastImage from "react-native-fast-image";
export default ChildItem = ({
  item,
  style,
  onPress,
  index,
  imageKey,
  local,
  height,
}) => {
  return (
    <TouchableWithoutFeedback
      style={styles.container}
      onPress={() => onPress(index)}
    >
      <FastImage
        style={[styles.image, style, { height: height }]}
        source={local ? item[imageKey] : { uri: item[imageKey] }}
      />
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {},
  image: {
    height: 230,
    resizeMode: "stretch",
  },
});
