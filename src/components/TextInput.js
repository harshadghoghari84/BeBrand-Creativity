import React, { memo } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput as Input,
  Image as Icon,
} from "react-native";
import Color from "../utils/Color";

import { paperTheme as theme } from "../utils/Theme";

const TextInput = ({ errorText, ...props }) => (
  <>
    <Input style={styles.input} {...props} />
    {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
  </>
);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 12,
  },
  input: {
    height: 40,
    fontSize: 13,
    color: Color.darkBlue,
    fontWeight: "700",
    width: "80%",
  },
  error: {
    fontSize: 14,
    color: theme.colors.error,
    paddingLeft: 30,
  },
  socialBTNView: {
    height: 55,
    borderRadius: 50,
    marginHorizontal: 20,
    borderColor: Color.darkBlue,
    borderWidth: 3,
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
  },
});

export default memo(TextInput);
