import React, { Component, useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
} from "react-native";
import { StackActions, useRoute } from "@react-navigation/native";
import Color from "../../utils/Color";
import Icon from "../../components/svgIcons";
import Constant from "../../utils/Constant";
import Modal from "../../components/modal";
const BottomBar = ({ navigation, state, curRoute }) => {
  const [activeBottom, setActiveBottom] = useState();
  const route = useRoute();
  useEffect(() => {
    console.log("curRoute", bottom[0].tit === curRoute);

    // setActiveBottom(curRoute);
  }, [curRoute]);
  const [visibleModal, setVisibleModal] = useState(false);
  const bottomName = [
    "home",
    "homeStack",
    "userDesigns",
    "userPackage",
    "notifications",
  ];
  const bottom = [
    { icon: "home", tit: "homeStack" || "design" },
    { icon: "design", tit: "userDesigns" },
    { icon: "package", tit: "userPackage" },
    { icon: "notification", tit: "notifications" },
    { icon: "language" },
  ];
  const getColor = (val) => {
    return val == true ? Color.primary : Color.grey;
  };
  const toggleVisible = () => {
    setVisibleModal(!visibleModal);
  };

  const onPressName = (curIndex) => {
    if (curIndex === 0) {
      // navigation.navigate(Constant.navHomeStack);
      navigation.dispatch(StackActions.push(Constant.navHomeStack));
    } else if (curIndex === 1) {
      navigation.navigate(Constant.navDesigns);
    } else if (curIndex === 2) {
      navigation.navigate(Constant.navPackage);
    } else if (curIndex === 3) {
      navigation.navigate(Constant.navNotification);
    } else if (curIndex === 4) {
      setVisibleModal(true);
    }
  };

  const renderBottom = () => {
    return (
      <View
        style={{
          backgroundColor: Color.white,
          borderTopColor: Color.blackTrans,
          borderTopWidth: 1,
        }}
      >
        <Modal visible={visibleModal} toggleVisible={toggleVisible} />

        <FlatList
          bounces={false}
          data={bottom}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.bottomStyle}
          horizontal={true}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                activeOpacity={0.6}
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => {
                  onPressName(index);
                }}
              >
                <Icon
                  name={item.icon}
                  fill={
                    item.icon === "language"
                      ? getColor(false)
                      : getColor(item.tit === curRoute)
                  }
                  height={22}
                  width={22}
                />
              </TouchableOpacity>
            );
          }}
        />
      </View>
    );
  };

  const renderMainview = () => {
    return <View>{renderBottom()}</View>;
  };

  return renderMainview();
};

const styles = StyleSheet.create({
  bottomStyle: {
    flex: 1,
    height: 50,
    justifyContent: "space-around",
    flexDirection: "row",
  },
});
export default BottomBar;
