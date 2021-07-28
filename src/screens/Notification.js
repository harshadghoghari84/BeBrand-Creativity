import { useLazyQuery, useQuery } from "@apollo/client";
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import { format } from "date-fns";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { inject, observer } from "mobx-react";
import FastImage from "react-native-fast-image";
// relative path
import Icon from "../components/svgIcons";
import Color from "../utils/Color";
import Common from "../utils/Common";
import GraphqlQuery from "../utils/GraphqlQuery";
import LangKey from "../utils/LangKey";
import ProgressDialog from "./common/ProgressDialog";
import Constant from "../utils/Constant";
import PopUp from "../components/PopUp";

let notiMsgItem = {};
let iconName = {};
let itmDate = {};
const Notification = ({ designStore }) => {
  const { loading, data, error } = useQuery(GraphqlQuery.notifications, {
    errorPolicy: "all",
    fetchPolicy: "no-cache",
  });

  const [earlIndex, setEarlIndex] = useState("");
  const [layer, setLayer] = useState();
  const [id, setId] = useState([]);
  const [loginTime, setLoginTime] = useState(new Date());

  const [visibleModalMsg, setVisibleModalMsg] = useState(false);
  const toggleVisibleMsg = () => {
    setVisibleModalMsg(!visibleModalMsg);
  };

  useEffect(() => {
    AsyncStorage.getItem(Constant.prfUserloginTime)
      .then(async (res) => {
        res && res !== null && setLoginTime(new Date(res));
        await AsyncStorage.setItem(
          Constant.prfUserloginTime,
          new Date().toString()
        );
        designStore.setUserNotificationTime(new Date().toString());
      })
      .catch((err) => console.log("ERR", err));
  }, []);

  useEffect(() => {
    data &&
      data.notifications.some((item, index) => {
        const itemDate = new Date(item.updatedAt);

        const todayDate = new Date(loginTime);

        if (itemDate.getTime() < todayDate.getTime()) {
          setEarlIndex(index);
          return true;
        }
      });
  }, [data, loginTime]);

  // key extractors
  const keyExtractor = useCallback((item) => item.id.toString(), []);
  const renderNotifications = () => {
    return (
      <View style={{ flex: 1 }}>
        <PopUp
          visible={visibleModalMsg}
          toggleVisibleMsg={toggleVisibleMsg}
          isNotiMsg={true}
          iconName={iconName}
          itmDate={itmDate}
          msgItm={notiMsgItem}
        />
        <ProgressDialog
          visible={loading}
          dismissable={false}
          color={Color.white}
          message={Common.getTranslation(LangKey.labLoading)}
        />
        {data &&
        data.notifications &&
        Array.isArray(data.notifications) &&
        data.notifications.length > 0 ? (
          <FlatList
            data={data && data.notifications}
            showsVerticalScrollIndicator={false}
            keyExtractor={keyExtractor}
            renderItem={({ item, index }) => {
              const itemDate = new Date(item.updatedAt);
              var formattedDate = format(itemDate, "dd MMM yyyy");
              return (
                <View style={styles.itemContainer}>
                  {index === 0 && index !== earlIndex ? (
                    <>
                      <Text
                        style={{
                          marginLeft: 10,
                          paddingVertical: 10,
                          color: Color.black,
                        }}
                      >
                        {Common.getTranslation(LangKey.labNew)}
                      </Text>
                    </>
                  ) : (
                    index === earlIndex && (
                      <>
                        {index !== 0 && (
                          <View
                            style={{
                              height: 5,
                              backgroundColor: Color.txtIntxtcolor,
                            }}
                          />
                        )}
                        <Text
                          style={{
                            marginLeft: 10,
                            marginVertical: 10,
                            color: Color.black,
                          }}
                        >
                          {Common.getTranslation(LangKey.labEarl)}
                        </Text>
                      </>
                    )
                  )}
                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => {
                      setId([...id, item.id]);
                      notiMsgItem = item;
                      itmDate = formattedDate;
                      iconName = item.type;
                      setVisibleModalMsg(true);
                    }}
                    // style={{
                    //   backgroundColor:
                    //     id.includes(item.id) ||
                    //     new Date(loginTime).getTime() >
                    //       new Date(item.updatedAt).getTime()
                    //       ? null
                    //       : Color.layerColor,
                    // }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <View
                        style={{
                          paddingHorizontal: 20,
                          alignSelf: "flex-start",
                          paddingTop: 5,
                        }}
                      >
                        <Icon
                          name={item.type}
                          fill={Color.primary}
                          height={15}
                          width={15}
                        />
                      </View>
                      <View style={{ width: "75%" }}>
                        <Text style={{ color: Color.black, fontSize: 14 }}>
                          {item.title}
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            color: Color.grey,
                            fontFamily: "Nunito-Regular",
                          }}
                        >
                          {item.body}
                        </Text>
                        <Text
                          style={{
                            color: Color.grey,
                            fontSize: 9,
                            paddingVertical: 5,
                            paddingBottom: 10,
                            fontFamily: "Nunito-Light",
                          }}
                        >
                          {formattedDate}
                        </Text>
                      </View>
                      <View
                        style={{
                          height: 10,
                          width: 10,
                          borderRadius: 5,
                          backgroundColor:
                            id.includes(item.id) ||
                            new Date(loginTime).getTime() >
                              new Date(item.updatedAt).getTime()
                              ? null
                              : Color.darkBlue,
                        }}
                      />
                    </View>
                    {earlIndex !== 0
                      ? index !== earlIndex - 1 &&
                        index !== data.notifications.length - 1 && (
                          <View
                            style={{
                              height: 1,
                              width: "85%",
                              alignSelf: "center",
                              backgroundColor: Color.btnborder,
                              opacity: 0.3,
                            }}
                          />
                        )
                      : index !== data.notifications.length - 1 && (
                          <View
                            style={{
                              height: 1,
                              width: "85%",
                              alignSelf: "center",
                              backgroundColor: Color.btnborder,
                              opacity: 0.3,
                            }}
                          />
                        )}
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        ) : loading ? null : (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FastImage
              source={require("../assets/img/NotAvailable.png")}
              style={{ height: "80%", width: "80%" }}
              resizeMode={FastImage.resizeMode.contain}
            />
          </View>
        )}
      </View>
    );
  };
  const renderMainView = () => {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Color.white }}>
        {renderNotifications()}
      </SafeAreaView>
    );
  };
  return renderMainView();
};

export default inject("designStore", "userStore")(observer(Notification));

const styles = StyleSheet.create({
  itemContainer: {
    paddingVertical: 5,

    // marginHorizontal: 10,
    // marginVertical: 10,
    // paddingVertical: 10,
    // paddingHorizontal: 5,
    // borderRadius: 15,
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.22,
    // shadowRadius: 2.22,
    // elevation: 3,
  },
});
