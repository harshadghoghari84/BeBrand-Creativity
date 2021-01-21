import React from "react";
import { View, Text } from "react-native";
import TabsAnimation from "./src/components/TabsAnimation";

const dummy = () => {
  return (
    <View style={{ flex: 1 }}>
      <TabsAnimation
        bgColor="pink"
        AnimbgColor="darkred"
        activeColor="white"
        InactiveColor="darkred"
        txt1="one"
        txt2="two"
      />
    </View>
  );
};

export default dummy;
