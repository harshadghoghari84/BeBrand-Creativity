import React, { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Color from "../utils/Color";

const Button = ({ style, labelColor, children, icon, ...props }) => (
  <TouchableOpacity
    style={[styles.button, { backgroundColor: Color.primary }, style]}
    {...props}
  >
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 15,
        paddingVertical: 5,
      }}
    >
      {icon && icon}
      <Text style={styles.text}>{children}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    // width: 100,
    // height: 30,
    // alignItems: "center",
    // justifyContent: "center",
    marginVertical: 10,
    borderRadius: 50,
  },
  text: {
    fontWeight: "bold",
    fontSize: 12,
    paddingLeft: 5,
    textTransform: "capitalize",
    color: Color.white,
  },
});

export default memo(Button);
