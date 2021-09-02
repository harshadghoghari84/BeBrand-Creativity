import { useMutation, useQuery } from "@apollo/client";
import { toJS } from "mobx";
import { inject, observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import FastImage from "react-native-fast-image";
import { FlatList } from "react-native-gesture-handler";
import { ActivityIndicator } from "react-native-paper";
import { SvgCss } from "react-native-svg";
import Button from "../components/Button";
import Color from "../utils/Color";
import Common from "../utils/Common";
import Constant from "../utils/Constant";
import GraphqlQuery from "../utils/GraphqlQuery";
import LangKey from "../utils/LangKey";
import SvgConstant from "../utils/SvgConstant";

const ShareAndEarn = ({ navigation, userStore }) => {
  const user = toJS(userStore.user);

  return (
    <View style={{ flex: 1, backgroundColor: Color.white }}>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, backgroundColor: Color.white }}
      >
        <SvgCss
          xml={SvgConstant.invite}
          width="100%"
          height={200}
          style={{ marginTop: 10 }}
        />

        <View
          style={{
            marginTop: 20,
            alignSelf: "center",
            paddingVertical: 10,
            paddingHorizontal: 10,
            borderRadius: 10,
            backgroundColor: Color.white,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,
            elevation: 3,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontFamily: "Nunito-Regular",
              marginTop: 20,
            }}
          >
            Invite a friends & get
          </Text>
          <View style={{ paddingVertical: 20 }}>
            <Text
              style={{
                fontSize: 22,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Unlimited premium Design
            </Text>
            <Text
              style={{
                textAlign: "center",
                fontFamily: "Nunito-Regular",
              }}
            >
              (5 design per sharing)
            </Text>
          </View>
          <Text
            style={{
              textAlign: "center",
              fontFamily: "Nunito-Regular",
            }}
          >
            And your friends also gets 5 Premium design
          </Text>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => navigation.navigate(Constant.navKnowMore)}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 16,
                color: Color.primary,
                textDecorationLine: "underline",
              }}
            >
              Know more
            </Text>
          </TouchableOpacity>
        </View>
        <Text
          style={{
            textAlign: "center",
            fontSize: 30,
            fontWeight: "bold",
            paddingVertical: 20,
          }}
        >
          Max share.Max design
        </Text>
      </ScrollView>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-evenly",
        }}
      >
        <Button
          normal={true}
          onPress={() => Common.onShare(user?.refCode && user.refCode)}
        >
          Invite friend
        </Button>

        <Button
          normal={true}
          onPress={() => {
            if (user && user !== null) {
              navigation.navigate(Constant.navMyReward);
            } else {
              Common.showMessage("you have to login first!");
            }
          }}
        >
          My reward
        </Button>
      </View>
      <SafeAreaView
        style={{
          flex: 0,
          backgroundColor: Color.white,
        }}
      />
    </View>
  );
};

export default inject("userStore")(observer(ShareAndEarn));

const styles = StyleSheet.create({
  fltContainer: {
    marginTop: 10,
    marginBottom: 5,
    borderRadius: 10,
    justifyContent: "center",
    backgroundColor: Color.white,
    marginHorizontal: 20,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  discountView: {
    minWidth: 80,
    paddingHorizontal: 8,
    height: 40,
    backgroundColor: Color.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  innerfitContainer: {
    marginVertical: 5,
    marginLeft: 10,
  },
  descContainer: {
    // marginTop: 5,
  },
  txtlable: {
    fontSize: 18,
    color: Color.darkBlue,
    marginLeft: 10,
  },
  txtdiscount: {
    color: Color.white,
    fontSize: 15,
  },
});
