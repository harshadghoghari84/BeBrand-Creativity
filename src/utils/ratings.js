import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Linking,
  TouchableOpacity,
} from "react-native";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import PopUp from "../components/PopUp";
import Color from "./Color";
import Rate, { AndroidMarket } from "react-native-rate";

const Ratings = ({ toggleforRating }) => {
  const [defaultRating, setDefaultRating] = useState(0);

  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);

  const [visible, setVisible] = useState(false);
  const toggleVisible = () => {
    setVisible(!visible);
    toggleforRating();
  };
  const [rated, setRated] = useState(false);

  const CustomRatingBar = () => {
    return (
      <View style={styles.container}>
        {maxRating.map((item, key) => {
          return (
            <TouchableOpacity
              key={item}
              onPress={() => {
                setDefaultRating(item);
                item >= 4 ? open_Store() : null;
                if (item <= 3) {
                  setVisible(true);
                  // toggleforRating();
                }
              }}
            >
              <Icon
                name={item <= defaultRating ? "star" : "star-outline"}
                size={32}
                color={Color.primary}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const open_Store = () => {
    const options = {
      AppleAppID: "2193813192",
      GooglePackageName: "nic.goi.aarogyasetu",
      OtherAndroidURL: "http://www.randomappstore.com/app/47172391",
      preferredAndroidMarket: AndroidMarket.Google,
      preferInApp: false,
      openAppStoreIfInAppFails: true,
      fallbackPlatformURL: "http://www.mywebsite.com/myapp.html",
    };
    Rate.rate(options, (success) => {
      if (success) {
        setRated(true);
      }
    });
  };

  return (
    <View style={{ flex: 1, marginHorizontal: 20 }}>
      <PopUp visible={visible} toggleVisible={toggleVisible} other={true} />
      <Text style={styles.txt}>How was your experience with us</Text>
      <Text style={[styles.txt, { marginVertical: 5 }]}>Please Rate Us</Text>
      <Text style={styles.txt}>
        {defaultRating} / {Math.max.apply(null, maxRating)}
      </Text>

      <CustomRatingBar />
    </View>
  );
};

export default Ratings;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 10,
  },
  txt: {
    color: Color.black,
    paddingLeft: 10,
    fontSize: 15,
  },
});
