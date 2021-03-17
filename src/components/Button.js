import React, { memo } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Color from "../utils/Color";

const Button = ({
  style,
  normal,
  big,
  border,
  disabled,
  labelColor,
  children,
  icon,
  textColor,
  isVertical,
  ...props
}) => (
  <TouchableOpacity
    disabled={disabled}
    activeOpacity={0.8}
    style={[
      border
        ? [styles.borderButton]
        : big
        ? styles.bigButton
        : normal
        ? styles.normalbutton
        : styles.smallbutton,
      { backgroundColor: border ? null : Color.primary },
      style,
    ]}
    {...props}
  >
    {isVertical === true ? (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          // paddingHorizontal: 5,
        }}
      >
        {icon && icon}
        <Text
          style={
            border
              ? styles.bordertext
              : big
              ? styles.bigtext
              : normal
              ? styles.normaltext
              : [
                  styles.smalltext,
                  {
                    color: textColor ? Color.grey : Color.white,
                    fontWeight: "normal",
                    fontFamily: "Nunito-Light",
                    fontSize: 14,
                    paddingHorizontal: 0,
                    paddingTop: 5,
                  },
                ]
          }
        >
          {children}
        </Text>
      </View>
    ) : (
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
        <Text
          style={
            border
              ? styles.bordertext
              : big
              ? styles.bigtext
              : normal
              ? styles.normaltext
              : [
                  styles.smalltext,
                  { color: textColor ? Color.darkBlue : Color.white },
                ]
          }
        >
          {children}
        </Text>
      </View>
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  smallbutton: {
    marginVertical: 10,
    borderRadius: 50,
    maxHeight: Platform.OS === "ios" ? 30 : null,
    alignItems: "center",
    justifyContent: "center",
  },
  smalltext: {
    fontWeight: "bold",
    fontSize: 12,
    paddingHorizontal: 10,
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
  normaltext: {
    fontWeight: "bold",
    fontSize: 17,
    paddingHorizontal: 20,
    color: Color.white,
  },
  bigButton: {
    backgroundColor: Color.primary,
    alignItems: "center",
    borderRadius: 50,
    height: 35,
    width: "100%",
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
  bigtext: {
    fontWeight: "bold",
    fontSize: 17,
    color: Color.white,
  },
  borderButton: {
    borderColor: Color.dividerColor,
    borderWidth: 2,
    alignItems: "center",
    borderRadius: 50,
    height: 35,
    width: "100%",
    alignSelf: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  bordertext: {
    fontWeight: "bold",
    fontSize: 17,
    color: Color.btnborder,
  },
});

export default memo(Button);
