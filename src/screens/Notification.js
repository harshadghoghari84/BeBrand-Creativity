import { useLazyQuery, useQuery } from "@apollo/client";
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { format } from "date-fns";

// relative path
import Icon from "../components/svgIcons";
import Color from "../utils/Color";
import Common from "../utils/Common";
import GraphqlQuery from "../utils/GraphqlQuery";
import LangKey from "../utils/LangKey";
import ProgressDialog from "./common/ProgressDialog";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constant from "../utils/Constant";
const Notification = () => {
  const { loading, data, error } = useQuery(GraphqlQuery.notifications, {
    errorPolicy: "all",
  });

  const [earlIndex, setEarlIndex] = useState("");
  const [layer, setLayer] = useState();
  const [id, setId] = useState([]);
  const [loginTime, setLoginTime] = useState(new Date());

  useEffect(() => {
    AsyncStorage.getItem(Constant.prfUserloginTime)
      .then(async (res) => {
        console.log("login time :", res);
        res && res !== null && setLoginTime(res);
        await AsyncStorage.setItem(Constant.prfUserloginTime, new Date());
      })
      .catch((err) => console.log("ERR", err));
  }, []);

  useEffect(() => {
    data &&
      data.notifications.some((item, index) => {
        const itemDate = new Date(item.updatedAt);
        const todayDate = new Date();
        todayDate.setHours(0, 0, 0, 0);

        if (itemDate.getTime() < todayDate.getTime()) {
          console.log("_____", item.updatedAt);
          console.log(
            "date comparision: ",
            new Date(loginTime).getTime() > new Date(item.updatedAt).getTime()
          );
          setEarlIndex(index);
          return true;
        }
      });
  }, [data]);

  // key extractors
  const keyExtractor = useCallback((item) => item.id.toString(), []);
  const renderNotifications = () => {
    return (
      <View style={{ flex: 1 }}>
        <ProgressDialog
          visible={loading}
          dismissable={false}
          color={Color.white}
          message={Common.getTranslation(LangKey.labLoading)}
        />
        <FlatList
          data={data && data.notifications}
          keyExtractor={keyExtractor}
          renderItem={({ item, index }) => {
            const itemDate = new Date(item.updatedAt);
            var formattedDate = format(itemDate, "dd MMM yyyy");
            return (
              <View style={styles.itemContainer}>
                {index === 0 && index !== earlIndex ? (
                  <Text
                    style={{
                      marginLeft: 10,
                      marginVertical: 10,
                      color: Color.grey,
                    }}
                  >
                    {Common.getTranslation(LangKey.labNew)}
                  </Text>
                ) : (
                  index === earlIndex && (
                    <Text
                      style={{
                        marginLeft: 10,
                        marginVertical: 10,
                        color: Color.grey,
                      }}
                    >
                      {Common.getTranslation(LangKey.labEarl)}
                    </Text>
                  )
                )}
                <TouchableOpacity
                  onPress={() => setId([...id, item.id])}
                  style={{
                    height: 65,
                    backgroundColor:
                      id.includes(item.id) ||
                      new Date(loginTime).getTime() >
                        new Date(item.updatedAt).getTime()
                        ? null
                        : Color.layerColor,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <View style={{ paddingHorizontal: 20 }}>
                      <Icon
                        name={item.type}
                        fill={Color.primary}
                        height={20}
                        width={20}
                      />
                    </View>
                    <View>
                      <Text>{item.title}</Text>
                      <Text>{item.body}</Text>
                      <Text
                        style={{ color: Color.txtIntxtcolor, fontSize: 12 }}
                      >
                        {formattedDate}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      </View>
    );
  };
  const renderMainView = () => {
    return <View style={{ flex: 1 }}>{renderNotifications()}</View>;
  };
  return renderMainView();
};

export default Notification;

const styles = StyleSheet.create({
  itemContainer: {
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
