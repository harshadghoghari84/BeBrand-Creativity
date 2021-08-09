import { useMutation, useQuery } from "@apollo/client";
import { toJS } from "mobx";
import { inject, observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { ActivityIndicator } from "react-native-paper";
import Button from "../components/Button";
import Color from "../utils/Color";
import Common from "../utils/Common";
import GraphqlQuery from "../utils/GraphqlQuery";
import LangKey from "../utils/LangKey";

const ShareAndEarn = ({ userStore }) => {
  const user = toJS(userStore.user);
  const [refCode, setRefCode] = useState("");
  const [refPkg, setRefPkg] = useState([]);
  const { loading, data, error } = useQuery(GraphqlQuery.referralPackages, {
    variables: { start: 0 },
    errorPolicy: "all",
    fetchPolicy: "no-cache",
  });
  const [generateRefCode] = useMutation(GraphqlQuery.generateRefCode, {
    errorPolicy: "all",
    fetchPolicy: "no-cache",
  });
  const [activateRefferal, { loading: actvRefLoad }] = useMutation(
    GraphqlQuery.activateRefferal,
    {
      errorPolicy: "all",
      fetchPolicy: "no-cache",
    }
  );
  useEffect(() => {
    if (data && data?.referralPackages !== null) {
      console.log("data :", data);
      setRefPkg(data.referralPackages);
    }
    if (error && error !== null) {
      console.log("error :", error);
    }
  }, [data, error, refPkg]);
  useEffect(() => {
    console.log("refPkg  : : : ", refPkg);
  }, [refPkg]);
  return (
    <View style={{ flex: 1, backgroundColor: Color.white }}>
      {user && user !== null ? (
        <>
          {!user.refCode ? (
            <Button
              normal={true}
              onPress={() => {
                generateRefCode()
                  .then(({ data, errors }) => {
                    if (data && data?.generateRefCode !== null) {
                      console.log("data", data.generateRefCode);
                      setRefCode(data.generateRefCode);
                    }
                    if (errors && errors !== null) {
                      Common.showMessage(errors[0].message);
                      console.log("errors", errors[0].message);
                    }
                  })

                  .catch((err) => console.log("err", err));
              }}
            >
              {Common.getTranslation(LangKey.genRefCode)}
            </Button>
          ) : (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
              }}
            >
              <Text>{`your Reffer Code : ${
                refCode && refCode !== null ? refCode : user?.refCode
              }`}</Text>
              <Button normal={true} onPress={() => Common.onShare()}>
                {Common.getTranslation(LangKey.txtShare)}
              </Button>
            </View>
          )}
          <FlatList
            bounces={false}
            data={refPkg}
            contentContainerStyle={{ flex: 1 }}
            renderItem={({ item, index }) => {
              return (
                <View style={[styles.fltContainer]}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginHorizontal: 10,
                    }}
                  >
                    <Text style={styles.txtlable}>
                      {item?.refUser?.name !== null
                        ? item.refUser.name
                        : item.refUser.mobile}
                    </Text>

                    <TouchableOpacity
                      activeOpacity={0.6}
                      style={styles.discountView}
                      onPress={() => {
                        activateRefferal({
                          variables: { id: item.id },
                        }).then(({ data, errors }) => {
                          if (data && data.activateRefferal !== null) {
                            const newUser = {
                              ...user,
                              designPackage: data.activateRefferal
                                ? data.activateRefferal
                                : user.designPackage,
                            };
                            userStore.setUser(newUser);
                            refPkg.splice(index, 1);
                            setRefPkg(refPkg);
                          }
                          if (errors && errors !== null) {
                            Common.showMessage(errors[0].message);
                            console.log("errors", errors[0].message);
                          }
                        });
                      }}
                    >
                      <Text style={styles.txtdiscount}>
                        {actvRefLoad ? (
                          <ActivityIndicator color={Color.white} />
                        ) : (
                          "Activate"
                        )}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
          />
        </>
      ) : (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <Button normal={true} onPress={() => Common.onShare()}>
            {Common.getTranslation(LangKey.txtShare)}
          </Button>
        </View>
      )}

      {/* <Button
        normal={true}
        onPress={() => {
          generateRefCode()
            .then(({ data, errors }) => {
              if (data && data?.generateRefCode !== null) {
                console.log("data", data);
              }
              if (errors && errors !== null) {
                console.log("errors", errors[0].message);
                Common.showMessage(errors[0].message);
              }
            })

            .catch((err) => console.log("err", err));
        }}
      >
        {Common.getTranslation(LangKey.genRefCode)}
      </Button> */}
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
