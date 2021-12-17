import React, { memo } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput as Input,
  TouchableOpacity,
} from "react-native";
import Color from "../utils/Color";
import Icon from "./svgIcons";

const TextInput = ({
  iconName,
  eyeOn,
  marked,
  toggleSecureText,
  secureTextEntry,
  errorText,
  setError,
  stylee,
  ...props
}) => (
  <>
    <View style={[styles.socialBTNView, { stylee }]}>
      <View style={styles.filedsIcon}>
        <Icon
          name={iconName}
          fill={Color.white}
          height={iconName === "refferfilld" ? 22 : 15}
          width={iconName === "refferfilld" ? 22 : 15}
        />
      </View>
      <Input
        style={styles.input}
        secureTextEntry={secureTextEntry}
        {...props}
      />
      <Icon name={`${marked}`} fill={Color.green} height={15} width={15} />
      <TouchableOpacity
        style={styles.iconView}
        onPress={() => toggleSecureText()}
      >
        <Icon
          name={`${eyeOn}`}
          fill={secureTextEntry ? Color.grey : Color.primary}
          height={18}
          width={18}
        />
      </TouchableOpacity>
    </View>
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
    flex: 1,
  },
  error: {
    marginHorizontal: 30,
    fontSize: 12,
    color: Color.red,
    textAlign: "left",
  },
  socialBTNView: {
    height: 40,
    borderRadius: 50,
    marginHorizontal: 20,
    backgroundColor: Color.txtInBgColor,
    flexDirection: "row",
    alignItems: "center",
    margin: 7,
  },
  filedsIcon: {
    marginHorizontal: 5,
    backgroundColor: Color.txtIntxtcolor,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },
  iconView: {
    paddingRight: 15,
  },
});

export default memo(TextInput);
