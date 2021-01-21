import React from "react";
import { Text, StyleSheet } from "react-native";

import Color from "../utils/Color";

const IconBadge = ({ count }) =>
  count > 0 ? <Text style={styles.badge}>{count}</Text> : null;
export default IconBadge;

const styles = StyleSheet.create({
  badge: {
    color: Color.white,
    position: "absolute",
    top: 1,
    right: 1,
    margin: -3,
    minWidth: 14,
    height: 14,
    overflow: "hidden",    
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Color.red,
    textAlign: "center",
    fontSize: 10,
  },
});
