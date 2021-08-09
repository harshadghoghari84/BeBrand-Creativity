import React, { Component, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Modal,
  Platform,
} from "react-native";

import { ProgressBar } from "react-native-paper";
import ICON from "react-native-vector-icons/MaterialCommunityIcons";
import { inject, observer } from "mobx-react";
import FastImage from "react-native-fast-image";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { toJS } from "mobx";

// Relative Path
import Color from "../../utils/Color";
import Constant from "../../utils/Constant";
import Icon from "../../components/svgIcons";
import PopUp from "../../components/PopUp";
import Common from "../../utils/Common";
import Ratings from "../../utils/ratings";
import LangKey from "../../utils/LangKey";
import { StackActions } from "@react-navigation/routers";

class CustomDrawer extends Component {
  state = {
    isSelected: false,
    Activated: Constant.titAccount,
    modalVisible: false,
    modalVisibleforRating: false,
    modalVisibleforreffer: false,
    toggleVisibleImproved: false,
  };

  toggleVisible = () => {
    this.setState({ modalVisible: !this.state.modalVisible });
  };
  toggleVisibleforreffer = () => {
    this.setState({ modalVisibleforreffer: !this.state.modalVisibleforreffer });
  };
  toggleVisibleforRating = () => {
    this.setState({ modalVisibleforRating: !this.state.modalVisibleforRating });
  };
  toggleVisibleforImprove = () => {
    this.setState({ toggleVisibleImproved: !this.state.toggleVisibleImproved });
  };
  getColor = (val) => {
    return val == true ? Color.primary : Color.grey;
  };

  render() {
    const user = toJS(this.props.userStore.user);

    const startDesignCreditPro = toJS(
      this.props.userStore.startProDesignCredit
    );

    const currentDesignCreditPro = toJS(
      this.props.userStore.currentProDesignCredit
    );
    const calculate =
      100 - (currentDesignCreditPro * 100) / startDesignCreditPro;
    const progressLimit = calculate / 100;

    return (
      <View style={styles.container}>
        <PopUp
          visible={this.state.modalVisible}
          toggleVisible={this.toggleVisible}
          wpNum={user?.whatsappNo && user.whatsappNo}
          toggle={true}
        />
        <PopUp
          visible={this.state.modalVisibleforreffer}
          toggleVisible={this.toggleVisibleforreffer}
          reffer={true}
        />
        <PopUp
          visible={this.state.toggleVisibleImproved}
          toggleVisible={this.toggleVisibleforImprove}
          other={true}
        />
        <Modal
          transparent={true}
          visible={this.state.modalVisibleforRating}
          animationType="slide"
          onRequestClose={() => this.toggleVisibleforRating()}
        >
          <View style={styles.centeredView}>
            <View
              style={{
                padding: 10,
                backgroundColor: Color.white,
                borderRadius: 20,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
                marginHorizontal: 20,
                minWidth: "80%",
              }}
            >
              <TouchableOpacity
                onPress={() => this.setState({ modalVisibleforRating: false })}
                style={{
                  width: 25,
                  height: 25,
                  margin: 10,
                  alignItems: "center",
                  justifyContent: "center",
                  alignSelf: "flex-end",

                  borderRadius: 20,
                }}
              >
                <ICON name="close" size={22} color={Color.darkBlue} />
              </TouchableOpacity>
              <Ratings
                toggleforRating={this.toggleVisibleforRating}
                toggleVisibleforImprove={this.toggleVisibleforImprove}
              />
            </View>
          </View>
        </Modal>

        <View style={styles.container}>
          <SafeAreaView
            style={{
              backgroundColor: Color.primary,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <View style={styles.containerUserDetails}>
              <FastImage
                source={{
                  uri: user?.userInfo?.personal?.image[0]?.url
                    ? user.userInfo.personal?.image[0].url
                    : Constant.dummyUserImage,
                }}
                style={{ height: 60, width: 60, borderRadius: 50 }}
              />
              <View style={styles.containerSubUserDetails}>
                <Text style={styles.txtUserName}>
                  {user?.name
                    ? user.name
                    : user?.userInfo?.personal?.name
                    ? user.userInfo.personal.name
                    : user?.userInfo?.business?.name
                    ? user.userInfo.business.name
                    : Constant.defUserName}
                </Text>
                {user?.designPackage &&
                  user.designPackage !== null &&
                  user.designPackage.length > 0 && (
                    <View style={{ width: "80%" }}>
                      <ProgressBar
                        progress={Math.abs(progressLimit)}
                        color={Color.white}
                        style={{
                          height: 7,
                          marginTop: 5,
                          borderRadius: 5,
                          overflow: "hidden",
                        }}
                      />
                    </View>
                  )}
              </View>
            </View>
          </SafeAreaView>
          <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
            <View>
              <TouchableOpacity
                onPress={() =>
                  // this.setState({ Activated: Constant.titHome }, () =>
                  // )
                  this.props.navigation.navigate(Constant.navHome)
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
                  {Common.getTranslation(LangKey.titleHome)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  // this.setState({ Activated: Constant.titPro }, () =>
                  // )
                  this.props.navigation.navigate(
                    Platform.OS === "ios"
                      ? Constant.titPrimiumIos
                      : Constant.titPrimium
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
                    name="Premium"
                    fill={this.getColor(
                      // this.state.Activated === Constant.titPro
                      true
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
                  {Common.getTranslation(LangKey.titleBePremium)}
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
                onPress={() => this.setState({ modalVisibleforRating: true })}
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
                  {Common.getTranslation(LangKey.titleRateUs)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate(Constant.navShareandEarn);
                  // Common.onShare()
                }}
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
                  {Common.getTranslation(LangKey.titleShareAndEarn)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => Common.openWhatsApp(Constant.whatsAppNumber, "")}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 10,
                  // borderBottomWidth: 1,
                  // borderBottomColor: Color.dividerColor,
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
                  {Common.getTranslation(LangKey.titleReportIssue)}
                </Text>
              </TouchableOpacity>
            </View>
            <View>
              {this.props.userStore.user !== null && (
                <View>
                  {this.props.userStore.user?.parentRefCode == null && (
                    <TouchableOpacity
                      onPress={() =>
                        this.setState({ modalVisibleforreffer: true })
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
                          name="reffer"
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
                        {Common.getTranslation(LangKey.titleAddReffercode)}
                      </Text>
                    </TouchableOpacity>
                  )}
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
                        {Common.getTranslation(LangKey.titleAccount)}
                      </Text>
                    </View>
                    {this.state.Activated === Constant.titAccount ? (
                      <Icon
                        name="up"
                        height={15}
                        width={15}
                        fill={this.getColor(false)}
                        style={{
                          marginRight: 20,
                        }}
                      />
                    ) : (
                      <Icon
                        name="down"
                        height={15}
                        width={15}
                        fill={this.getColor(false)}
                        style={{
                          marginRight: 20,
                        }}
                      />
                    )}
                  </TouchableOpacity>
                  {this.state.Activated === Constant.titAccount ? (
                    <>
                      {/* <TouchableOpacity
                        onPress={() =>
                          this.props.navigation.navigate(
                            Constant.navProfileUser
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
                          {Common.getTranslation(LangKey.titleProfile)}
                        </Text>
                      </TouchableOpacity> */}
                      <TouchableOpacity
                        onPress={() =>
                          this.props.navigation.navigate(Constant.navProfile)
                        }
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          paddingVertical: 10,
                        }}
                      >
                        <View style={{ paddingHorizontal: 30 }}>
                          <Icon
                            name="postprofile"
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
                          {Common.getTranslation(LangKey.titlePostProfile)}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          // this.setState(
                          //   { Activated: Constant.titPackage },
                          //   () =>
                          //   )
                          this.props.navigation.navigate(Constant.navPackage)
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
                          {Common.getTranslation(LangKey.titlePackage)}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          // this.setState(
                          //   { Activated: Constant.titDesigns },
                          //   () =>
                          //   )
                          this.props.navigation.navigate(Constant.navDesigns)
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
                          {Common.getTranslation(LangKey.titleDesign)}
                        </Text>
                      </TouchableOpacity>
                    </>
                  ) : null}
                </View>
              )}
              {/* <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate(Constant.navReferandEarn)
                }
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 10,
                  // borderBottomWidth: 1,
                  // borderBottomColor: Color.dividerColor,
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
                  {Common.getTranslation(LangKey.titReferandEarn)}
                </Text>
              </TouchableOpacity> */}
              {this.props.userStore.user !== null && (
                <TouchableOpacity
                  onPress={() => this.setState({ modalVisible: true })}
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
                    {Common.getTranslation(LangKey.titleWhatsAppUpdates)}
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate(Constant.navWebView, {
                    uri: "https://branddot.in/?page_id=559",
                  })
                }
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 10,
                }}
              >
                <View style={{ paddingHorizontal: 30 }}>
                  <Icon
                    name="legal"
                    fill={this.getColor(
                      this.state.Activated === Constant.titLegal
                    )}
                    height={22}
                    width={22}
                  />
                </View>
                <Text
                  style={{
                    color: this.getColor(
                      this.state.Activated === Constant.titLegal
                    ),
                  }}
                >
                  {Common.getTranslation(LangKey.titLegal)}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
        <View>
          <View
            style={{ borderTopColor: Color.dividerColor, borderTopWidth: 1 }}
          >
            <Text
              style={{
                alignSelf: "center",
                paddingVertical: 10,
                color: Color.grey,
              }}
            >
              {Common.getTranslation(LangKey.titMadeWithLoveInIndia)}
            </Text>
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
                    name="signout"
                    fill={this.getColor(false)}
                    height={22}
                    width={22}
                  />
                </View>
                <Text
                  style={{
                    paddingLeft: 30,
                    color: this.getColor(false),
                  }}
                >
                  {Common.getTranslation(LangKey.titSignOut)}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate(Constant.navSignIn)
                }
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 10,
                }}
              >
                <View style={{ marginLeft: 30 }}>
                  <Icon
                    name="signin"
                    fill={this.getColor(false)}
                    height={22}
                    width={22}
                  />
                </View>
                <Text
                  style={{
                    paddingLeft: 30,
                    color: this.getColor(false),
                  }}
                >
                  {Common.getTranslation(LangKey.titSignIn)}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  }
}
export default inject("userStore")(observer(CustomDrawer));

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    paddingVertical: 10,
    backgroundColor: Color.primary,
  },
  containerSubUserDetails: { width: "60%", left: 15 },
  txtUserName: { color: Color.drawerTextColor, fontSize: 17 },
  cover: {
    backgroundColor: "rgba(0,0,0,.5)",
    flex: 1,
  },
  sheet: {
    top: Platform.OS === "ios" ? "95%" : "100%",
    left: 0,
    right: 0,
    height: "100%",
    justifyContent: "flex-end",
  },
  popup: {
    backgroundColor: "#090707",
    marginHorizontal: 10,
    borderRadius: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: Color.white,
    borderRadius: 20,
    height: 200,
    width: "80%",
    // alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
