import React, { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Color from "../utils/Color";

const Button = ({ style, normal, labelColor, children, icon, ...props }) => (
  <TouchableOpacity
    style={[
      normal ? styles.normalbutton : styles.smallbutton,
      { backgroundColor: Color.primary },
      style,
    ]}
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
      <Text style={normal ? styles.normaltext : styles.smalltext}>
        {children}
      </Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  smallbutton: {
    // width: 100,
    // height: 30,
    // alignItems: "center",
    // justifyContent: "center",
    marginVertical: 10,
    borderRadius: 50,
  },
  smalltext: {
    fontWeight: "bold",
    fontSize: 15,
    paddingLeft: 5,
    textTransform: "capitalize",
    color: Color.white,
  },
  normaltext: {
    fontWeight: "bold",
    fontSize: 15,
    paddingHorizontal: 20,
    textTransform: "capitalize",
    color: Color.white,
  },
  normalbutton: {
    backgroundColor: Color.primary,
    alignItems: "center",
    borderRadius: 50,
    height: 35,
    alignSelf: "center",
    justifyContent: "center",
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});

export default memo(Button);
