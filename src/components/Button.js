import React, { memo } from "react";
import { StyleSheet } from "react-native";
import { Button as PaperButton, Colors } from "react-native-paper";
import { paperTheme as theme } from "../utils/Theme";

const Button = ({ mode, style, labelColor, children, ...props }) => (
  <PaperButton
    style={[
      styles.button,
      mode === "outlined" && { backgroundColor: theme.colors.surface },
      style,
    ]}
    labelStyle={[
      styles.text,
      mode === "contained" && {
        color: labelColor != undefined ? labelColor : theme.colors.surface,
      },
    ]}
    mode={mode}
    {...props}
  >
    {children}
  </PaperButton>
);

const styles = StyleSheet.create({
  button: {
    width: "100%",
    marginVertical: 10,
    borderRadius: 50,
  },
  text: {
    fontWeight: "bold",
    fontSize: 15,
    lineHeight: 26,
  },
});

export default memo(Button);
