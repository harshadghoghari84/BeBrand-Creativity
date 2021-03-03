import React from "react";
import { View, Text } from "react-native";

const MuktaText = ({ children, ...props }) => {
  return (
    <Text style={{ fontFamily: "Mukta-SemiBold" }} {...props}>
      {children}
    </Text>
  );
};

export default MuktaText;
