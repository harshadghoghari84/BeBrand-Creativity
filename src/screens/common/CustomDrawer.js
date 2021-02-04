import React, { Component, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from "react-native";
import { DrawerItem } from "@react-navigation/drawer";
import { Drawer, List, ProgressBar } from "react-native-paper";
// import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { inject, observer } from "mobx-react";
import FastImage from "react-native-fast-image";

import Color from "../../utils/Color";
import Constant from "../../utils/Constant";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { toJS } from "mobx";
import Icon from "../../components/svgIcons";
import WebViews from "../../components/WebViews";

class CustomDrawer extends Component {
  state = {
    isSelected: false,
    Activated: Constant.titHome,
  };

  getColor = (val) => {
    return val == true ? Color.primary : Color.grey;
  };

  render() {
    const user = toJS(this.props.userStore.user);
    const startDesignCredit = toJS(this.props.userStore.startDesignCredit);
    const currentDesignCredit = toJS(this.props.userStore.currentDesignCredit);
    const calculate = 100 - (currentDesignCredit * 100) / startDesignCredit;
    const progressLimit = calculate / 100;

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <View style={styles.containerUserDetails}>
            <FastImage
              source={{
                uri: user?.userInfo?.personal?.image[0]?.url
                  ? user.userInfo.personal?.image[0].url
                  : "https://cdn.pixabay.com/photo/2015/03/04/22/35/head-659652_960_720.png",
              }}
              style={{ height: 60, width: 60, borderRadius: 50 }}
            />
            <View style={styles.containerSubUserDetails}>
              <Text style={styles.txtUserName}>
                {user?.userInfo?.personal?.name
                  ? user.userInfo.personal.name
                  : Constant.defUserName}
              </Text>
              <View style={{ width: "80%" }}>
                <ProgressBar
                  progress={Math.abs(progressLimit)}
                  color={Color.primary}
                  style={{
                    height: 7,
                    marginTop: 5,
                    borderRadius: 5,
                    overflow: "hidden",
                  }}
                />
              </View>
            </View>
          </View>
          <ScrollView style={{ flex: 1 }}>
            <View>
              <TouchableOpacity
                onPress={() =>
                  this.setState({ Activated: Constant.titHome }, () =>
                    this.props.navigation.navigate(Constant.navHome)
                  )
                }
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 10,
                }}
              >
                <View style={{ paddingHorizontal: 30 }}>
                  <Icon
                    name="home"
                    fill={this.getColor(
                      this.state.Activated === Constant.titHome
                    )}
                    height={20}
                    width={20}
                  />
                </View>
                <Text
                  style={{
                    color: this.getColor(
                      this.state.Activated === Constant.titHome
                    ),
                  }}
                >
                  {Constant.titHome}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  this.setState({ Activated: Constant.titPro }, () =>
                    this.props.navigation.navigate(Constant.navPro)
                  )
                }
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: Color.dividerColor,
                }}
              >
                <View style={{ paddingHorizontal: 30 }}>
                  <Icon
                    name="vip"
                    fill={this.getColor(
                      this.state.Activated === Constant.titPro
                    )}
                    height={20}
                    width={20}
                  />
                </View>
                <Text
                  style={{
                    color: this.getColor(
                      this.state.Activated === Constant.titPro
                    ),
                  }}
                >
                  {Constant.titPro}
                </Text>
              </TouchableOpacity>
              {/* <TouchableOpacity
                onPress={() =>
                  this.setState({ Activated: Constant.titNotification }, () =>
                    this.props.navigation.navigate(Constant.navNotification)
                  )
                }
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: Color.dividerColor,
                }}
              >
                <View style={{ paddingHorizontal: 30 }}>
                  <Icon
                    name="notification"
                    fill={this.getColor(
                      this.state.Activated === Constant.titNotification
                    )}
                    height={20}
                    width={20}
                  />
                </View>
                <Text
                  style={{
                    color: this.getColor(
                      this.state.Activated === Constant.titNotification
                    ),
                  }}
                >
                  {Constant.titNotification}
                </Text>
              </TouchableOpacity> */}
            </View>
            <View>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 10,
                }}
              >
                <View style={{ paddingHorizontal: 30 }}>
                  <Icon
                    name="rate"
                    fill={this.getColor(false)}
                    height={20}
                    width={20}
                  />
                </View>
                <Text
                  style={{
                    color: this.getColor(false),
                  }}
                >
                  {Constant.titRateApp}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 10,
                }}
              >
                <View style={{ paddingHorizontal: 30 }}>
                  <Icon
                    name="share"
                    fill={this.getColor(false)}
                    height={20}
                    width={20}
                  />
                </View>
                <Text
                  style={{
                    color: this.getColor(false),
                  }}
                >
                  {Constant.titShareApp}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 10,
                }}
              >
                <View style={{ paddingHorizontal: 30 }}>
                  <Icon
                    name="report"
                    fill={this.getColor(false)}
                    height={20}
                    width={20}
                  />
                </View>
                <Text
                  style={{
                    color: this.getColor(false),
                  }}
                >
                  {Constant.titReportIssue}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: Color.dividerColor,
                }}
              >
                <View style={{ paddingHorizontal: 30 }}>
                  <Icon
                    name="request"
                    fill={this.getColor(false)}
                    height={20}
                    width={20}
                  />
                </View>
                <Text
                  style={{
                    color: this.getColor(false),
                  }}
                >
                  {Constant.titRequestFeature}
                </Text>
              </TouchableOpacity>
            </View>
            <View>
              {this.props.userStore.user !== null && (
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      if (this.state.Activated === Constant.titAccount) {
                        this.setState({ Activated: "" });
                      } else {
                        this.setState({ Activated: Constant.titAccount });
                      }
                    }}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingVertical: 10,
                      borderBottomWidth: 1,
                      borderBottomColor: Color.dividerColor,
                    }}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <View style={{ paddingHorizontal: 30 }}>
                        <Icon
                          name="account"
                          fill={this.getColor(
                            this.state.Activated === Constant.titAccount
                          )}
                          height={20}
                          width={20}
                        />
                      </View>
                      <Text
                        style={{
                          color: this.getColor(
                            this.state.Activated === Constant.titAccount
                          ),
                        }}
                      >
                        {Constant.titAccount}
                      </Text>
                    </View>
                    {this.state.Activated === Constant.titAccount ? (
                      <Icon
                        name="up"
                        height={15}
                        width={15}
                        fill={this.getColor(
                          this.state.Activated === Constant.titAccount
                        )}
                        style={{
                          marginRight: 20,
                        }}
                      />
                    ) : (
                      <Icon
                        name="down"
                        height={15}
                        width={15}
                        fill={this.getColor(
                          this.state.Activated === Constant.titAccount
                        )}
                        style={{
                          marginRight: 20,
                        }}
                      />
                    )}
                  </TouchableOpacity>
                  {this.state.Activated === Constant.titAccount ? (
                    <>
                      <TouchableOpacity
                        onPress={() =>
                          this.setState(
                            { Activated: Constant.titProfile },
                            () =>
                              this.props.navigation.navigate(
                                Constant.navProfile
                              )
                          )
                        }
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          paddingVertical: 10,
                        }}
                      >
                        <View style={{ paddingHorizontal: 30 }}>
                          <Icon
                            name="profile"
                            fill={this.getColor(
                              this.state.Activated === Constant.titProfile
                            )}
                            height={20}
                            width={20}
                          />
                        </View>
                        <Text
                          style={{
                            color: this.getColor(
                              this.state.Activated === Constant.titProfile
                            ),
                          }}
                        >
                          {Constant.titProfile}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          this.setState(
                            { Activated: Constant.titPackage },
                            () =>
                              this.props.navigation.navigate(
                                Constant.navPackage
                              )
                          )
                        }
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          paddingVertical: 10,
                        }}
                      >
                        <View style={{ paddingHorizontal: 30 }}>
                          <Icon
                            name="package"
                            fill={this.getColor(
                              this.state.Activated === Constant.titPackage
                            )}
                            height={20}
                            width={20}
                          />
                        </View>
                        <Text
                          style={{
                            color: this.getColor(
                              this.state.Activated === Constant.titPackage
                            ),
                          }}
                        >
                          {Constant.titPackage}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          this.setState(
                            { Activated: Constant.titDesigns },
                            () =>
                              this.props.navigation.navigate(
                                Constant.navDesigns
                              )
                          )
                        }
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          paddingVertical: 10,
                          borderBottomWidth: 1,
                          borderBottomColor: Color.dividerColor,
                        }}
                      >
                        <View style={{ paddingHorizontal: 30 }}>
                          <Icon
                            name="design"
                            fill={this.getColor(
                              this.state.Activated === Constant.titDesigns
                            )}
                            height={20}
                            width={20}
                          />
                        </View>
                        <Text
                          style={{
                            color: this.getColor(
                              this.state.Activated === Constant.titDesigns
                            ),
                          }}
                        >
                          {Constant.titDesigns}
                        </Text>
                      </TouchableOpacity>
                    </>
                  ) : null}
                </View>
              )}
              <TouchableOpacity
                onPress={() =>
                  this.setState({ Activated: Constant.titWhatsAppUs }, () =>
                    this.props.navigation.navigate(Constant.navWebView, {
                      uri: "https://infinite.red",
                    })
                  )
                }
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 10,
                }}
              >
                <View style={{ paddingHorizontal: 30 }}>
                  <Icon
                    name="whatsapp"
                    fill={this.getColor(
                      this.state.Activated === Constant.titWhatsAppUs
                    )}
                    height={20}
                    width={20}
                  />
                </View>
                <Text
                  style={{
                    color: this.getColor(
                      this.state.Activated === Constant.titWhatsAppUs
                    ),
                  }}
                >
                  {Constant.titWhatsAppUs}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.setState({ Activated: Constant.titLegal })}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: Color.dividerColor,
                }}
              >
                <View style={{ paddingHorizontal: 30 }}>
                  <Icon
                    name="report"
                    fill={this.getColor(
                      this.state.Activated === Constant.titLegal
                    )}
                    height={20}
                    width={20}
                  />
                </View>
                <Text
                  style={{
                    color: this.getColor(
                      this.state.Activated === Constant.titLegal
                    ),
                  }}
                >
                  {Constant.titLegal}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
        <View style={styles.bottomDrawerSection}>
          {user && user !== null ? (
            <TouchableOpacity
              onPress={() => {
                AsyncStorage.removeItem(Constant.prfUserToken);
                this.props.userStore.setUser(null);
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 10,
              }}
            >
              <View style={{ marginLeft: 30 }}>
                <Icon
                  name="logout"
                  fill={this.getColor(false)}
                  height={20}
                  width={20}
                />
              </View>
              <Text
                style={{
                  paddingLeft: 30,
                  color: this.getColor(false),
                }}
              >
                {Constant.titSignOut}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate(Constant.navLogin)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 10,
              }}
            >
              <View style={{ marginLeft: 30 }}>
                <Icon
                  name="logout"
                  fill={this.getColor(false)}
                  height={20}
                  width={20}
                />
              </View>
              <Text
                style={{
                  paddingLeft: 30,
                  color: this.getColor(false),
                }}
              >
                {Constant.titSignIn}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  }
}
export default inject("userStore")(observer(CustomDrawer));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  drawerSection: {
    borderBottomColor: Color.dividerColor,
    borderBottomWidth: 0.5,
  },
  bottomDrawerSection: {
    height: 55,
    justifyContent: "center",
    borderTopColor: Color.dividerColor,
    borderTopWidth: 1,
  },
  containerUserDetails: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 10,
  },
  containerSubUserDetails: { width: "60%", left: 15 },
  txtUserName: { color: Color.drawerTextColor, fontSize: 17 },
});
