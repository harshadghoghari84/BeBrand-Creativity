import React, { Component, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
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

export const get_Icon = (title, color) => {
  switch (title) {
    case Constant.titHome:
      return <Icon name="home" fill={color} height={20} width={20} />;
    case Constant.titPro:
      return <Icon name="vip" fill={color} height={20} width={20} />;
    case Constant.titNotification:
      return <Icon name="notification" fill={color} height={20} width={20} />;
    case Constant.titRateApp:
      return <Icon name="rate" fill={color} height={20} width={20} />;
    case Constant.titShareApp:
      return <Icon name="share" fill={color} height={20} width={20} />;
    case Constant.titReportIssue:
      return <Icon name="report" fill={color} height={20} width={20} />;
    case Constant.titRequestFeature:
      return <Icon name="request" fill={color} height={20} width={20} />;
    case Constant.titAccount:
      return <Icon name="account" fill={color} height={20} width={20} />;
    case Constant.titWhatsAppUs:
      return <Icon name="whatsapp" fill={color} height={20} width={20} />;
    default:
      break;
  }
};

// const FAQ = <Icon name="information-outline" size={23} />;
// const OUR_WORK_CULTURE = <Icon name="basketball-hoop-outline" size={23} />;

class CustomDrawer extends Component {
  state = {
    DrawerItemsSection1: [
      { title: Constant.titHome, isSelected: true },
      { title: Constant.titPro, isSelected: false },
      {
        title: Constant.titNotification,
        isSelected: false,
        devider: true,
      },
      { title: Constant.titRateApp, isSelected: false },
      { title: Constant.titShareApp, isSelected: false },
      {
        title: Constant.titReportIssue,
        isSelected: false,
      },
      {
        title: Constant.titRequestFeature,
        isSelected: false,
        devider: true,
      },
      {
        title: Constant.titAccount,
        isSelected: false,
        devider: true,
      },
      { title: Constant.titWhatsAppUs, isSelected: false },
      { title: Constant.titFaq, isSelected: false },
      {
        title: Constant.titWorkCulture,
        isSelected: false,
        devider: true,
      },
      { title: Constant.titTermCondition, isSelected: false },
      { title: Constant.titDisclamer, isSelected: false },
      { title: Constant.titPrivacyPolicy, isSelected: false },
      { title: Constant.titCopyright, isSelected: false },
    ],
    TOKEN: "",
    startDesignCredit: "",
    currentDesignCredit: "",
  };

  componentDidMount() {
    const user = toJS(this.props.userStore.user);
    try {
      var val =
        user?.designPackage &&
        user.designPackage.reduce(function (previousValue, currentValue) {
          return {
            startDesignCredit:
              previousValue.startDesignCredit + currentValue.startDesignCredit,
            currentDesignCredit:
              previousValue.currentDesignCredit +
              currentValue.currentDesignCredit,
          };
        });
      this.setState({
        startDesignCredit: val.startDesignCredit,
        currentDesignCredit: val.currentDesignCredit,
      });
    } catch (error) {
      console.log(error);
    }
  }

  componentDidUpdate() {
    AsyncStorage.getItem(Constant.prfUserToken).then((res) =>
      this.setState({ TOKEN: res })
    );
  }

  onDSection1 = (currantIndex) => {
    const { DrawerItemsSection1 } = this.state;
    let tmpArr = DrawerItemsSection1;

    tmpArr.forEach((ele, index) => {
      if (index == currantIndex) {
        if (ele.title == Constant.titAccount) {
          tmpArr[currantIndex].isSelected = !tmpArr[currantIndex].isSelected;
        } else {
          tmpArr[currantIndex].isSelected = true;
        }
      } else {
        tmpArr[index].isSelected = false;
      }
    });
    this.setState({ DrawerItemsSection1: tmpArr });

    if (currantIndex == 0) {
      this.props.navigation.navigate(Constant.navHome);
    } else if (currantIndex == 1) {
      this.props.navigation.navigate(Constant.navPro);
    } else if (currantIndex == 2) {
      this.props.navigation.navigate(Constant.navNotification);
    } else if (currantIndex == 3) {
      this.props.navigation.navigate(Constant.navRateApp);
    } else if (currantIndex == 4) {
      this.props.navigation.navigate(Constant.navShareApp);
    } else if (currantIndex == 5) {
      this.props.navigation.navigate(Constant.navReportIssue);
    } else if (currantIndex == 6) {
      this.props.navigation.navigate(Constant.navRequestFeature);
    } else if (currantIndex == 7) {
      // this.props.navigation.navigate(Constant.navAccount);
    } else if (currantIndex == 8) {
      this.props.navigation.navigate(Constant.navWhatsAppUs);
    } else if (currantIndex == 9) {
      this.props.navigation.navigate(Constant.navFaq);
    } else if (currantIndex == 10) {
      this.props.navigation.navigate(Constant.navWorkCulture);
    } else if (currantIndex == 11) {
      // this.props.navigation.navigate(Constant.navTermCondition);
      this.props.navigation.navigate(Constant.navWebView, {
        uri: "https://infinite.red",
      });
    } else if (currantIndex == 12) {
      // this.props.navigation.navigate(Constant.navDisclamer);
      this.props.navigation.navigate(Constant.navWebView, {
        uri: "https://infinite.red",
      });
    } else if (currantIndex == 13) {
      // this.props.navigation.navigate(Constant.navPrivacyPolicy);
      this.props.navigation.navigate(Constant.navWebView, {
        uri: "https://infinite.red",
      });
    } else if (currantIndex == 14) {
      // this.props.navigation.navigate(Constant.navCopyright);
      this.props.navigation.navigate(Constant.navWebView, {
        uri: "https://infinite.red",
      });
    }
  };

  render() {
    const user = toJS(this.props.userStore.user);
    const calculate =
      100 -
      (this.state.currentDesignCredit * 100) / this.state.startDesignCredit;
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
                  : "Guest"}
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
          <FlatList
            showsVerticalScrollIndicator={false}
            data={this.state.DrawerItemsSection1}
            keyExtractor={(item) => item.key}
            renderItem={({ item, index }) => {
              if (index == 7) {
                return (
                  <>
                    {this.state.TOKEN !== null && (
                      <TouchableOpacity
                        onPress={() => this.onDSection1(index)}
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          borderBottomWidth: item.devider ? 1 : null,
                          borderBottomColor: item.devider
                            ? Color.dividerColor
                            : null,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            paddingVertical: 10,
                          }}
                        >
                          <Text
                            style={{
                              paddingHorizontal: 30,
                              color: item.isSelected
                                ? Color.primary
                                : Color.grey,
                            }}
                          >
                            {get_Icon(
                              item.title,
                              item.isSelected ? Color.primary : Color.grey
                            )}
                          </Text>
                          <Text
                            style={{
                              color: item.isSelected
                                ? Color.primary
                                : Color.grey,
                            }}
                          >
                            {item.title}
                          </Text>
                        </View>
                        {item.isSelected ? (
                          <Icon
                            name="up"
                            height={15}
                            width={15}
                            fill={item.isSelected ? Color.primary : Color.grey}
                            style={{
                              marginRight: 20,
                            }}
                          />
                        ) : (
                          <Icon
                            name="down"
                            height={15}
                            width={15}
                            fill={item.isSelected ? Color.primary : Color.grey}
                            style={{
                              marginRight: 20,
                            }}
                          />
                        )}
                      </TouchableOpacity>
                    )}

                    {item.isSelected ? (
                      <>
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
                          <View style={{ marginLeft: 30 }}>
                            <Icon
                              name="profile"
                              fill={Color.txtIntxtcolor}
                              height={20}
                              width={20}
                            />
                          </View>
                          <Text
                            style={{
                              paddingLeft: 30,
                              color: Color.grey,
                            }}
                          >
                            {Constant.titProfile}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            this.props.navigation.navigate(Constant.navPackage)
                          }
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            paddingVertical: 10,
                          }}
                        >
                          <View style={{ marginLeft: 30 }}>
                            <Icon
                              name="package"
                              fill={Color.txtIntxtcolor}
                              height={20}
                              width={20}
                            />
                          </View>
                          <Text
                            style={{
                              paddingLeft: 30,
                              color: Color.grey,
                            }}
                          >
                            {Constant.titPackage}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            this.props.navigation.navigate(Constant.navDesigns)
                          }
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            paddingVertical: 10,
                            borderBottomWidth: item.devider ? 1 : null,
                            borderBottomColor: item.devider
                              ? Color.dividerColor
                              : null,
                          }}
                        >
                          <View style={{ marginLeft: 30 }}>
                            <Icon
                              name="design"
                              fill={Color.txtIntxtcolor}
                              height={20}
                              width={20}
                            />
                          </View>
                          <Text
                            style={{
                              paddingLeft: 30,
                              color: Color.grey,
                            }}
                          >
                            {Constant.titDesigns}
                          </Text>
                        </TouchableOpacity>
                      </>
                    ) : null}
                  </>
                );
              } else {
                return (
                  <>
                    <TouchableOpacity
                      onPress={() => this.onDSection1(index)}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingVertical: 10,
                        borderBottomWidth: item.devider ? 1 : null,
                        borderBottomColor: item.devider
                          ? Color.dividerColor
                          : null,
                      }}
                    >
                      <Text
                        style={{
                          paddingHorizontal: 30,
                          color: item.isSelected ? Color.primary : Color.grey,
                        }}
                      >
                        {get_Icon(
                          item.title,
                          item.isSelected ? Color.primary : Color.grey
                        )}
                      </Text>

                      <Text
                        style={{
                          color: item.isSelected ? Color.primary : Color.grey,
                        }}
                      >
                        {item.title}
                      </Text>
                    </TouchableOpacity>
                  </>
                );
              }
            }}
          />
        </View>

        <Drawer.Section style={styles.bottomDrawerSection}>
          {user && user !== null ? (
            <DrawerItem
              icon={({ color, size }) => (
                <Icon
                  name="logout"
                  fill={Color.txtIntxtcolor}
                  height={20}
                  width={20}
                />
              )}
              label={Constant.titSignOut}
              onPress={() => {
                AsyncStorage.removeItem(Constant.prfUserToken);
                // props.navigation.navigate(Constant.navSignIn);
                this.props.userStore.setUser(null);
              }}
            />
          ) : (
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="login-variant" color={color} size={size} />
              )}
              label={Constant.titSignIn}
              onPress={() => {
                this.props.navigation.navigate(Constant.navLogin);
              }}
            />
          )}
        </Drawer.Section>
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

{
  /* <Drawer.Section style={styles.drawerSection}>
              <DrawerItem
                icon={({ color, size }) => (
                  <Icon name="home-outline" color={color} size={size} />
                )}
                label={Constant.titHome}
                onPress={() => {
                  this.props.navigation.navigate(Constant.navHome);
                }}
              />
              <DrawerItem
                icon={({ color, size }) => (
                  <Icon name="star-circle-outline" color={color} size={size} />
                )}
                label={Constant.titPro}
                onPress={() => {
                  this.props.navigation.navigate(Constant.navPro);
                }}
              />
              <DrawerItem
                icon={({ color, size }) => (
                  <Icon name="bell-alert-outline" color={color} size={size} />
                )}
                label={Constant.titNotification}
                onPress={() => {
                  this.props.navigation.navigate(Constant.navNotification);
                }}
              />
              <DrawerItem
                icon={({ color, size }) => (
                  <Icon name="heart-outline" color={color} size={size} />
                )}
                label={Constant.titWishlist}
                onPress={() => {
                  this.props.navigation.navigate(Constant.navWishlist);
                }}
              />
            </Drawer.Section> */
}

{
  /* suggestion section */
}
{
  /* <Drawer.Section style={styles.drawerSection}>
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="thumb-up-outline" color={color} size={size} />
              )}
              label={Constant.titRateApp}
              onPress={() => {
                props.navigation.navigate(Constant.navRateApp);
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="share-outline" color={color} size={size} />
              )}
              label={Constant.titShareApp}
              onPress={() => {
                props.navigation.navigate(Constant.navShareApp);
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="chat-outline" color={color} size={size} />
              )}
              label={Constant.titReportIssue}
              onPress={() => {
                props.navigation.navigate(Constant.navReportIssue);
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="book-search-outline" color={color} size={size} />
              )}
              label={Constant.titRequestFeature}
              onPress={() => {
                props.navigation.navigate(Constant.navRequestFeature);
              }}
            />
          </Drawer.Section> */
}

{
  /* user section */
}
{
  /* <Drawer.Section style={styles.drawerSection}>
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="account-outline" color={color} size={size} />
              )}
              label={Constant.titAccount}
              onPress={() => {
                props.navigation.navigate(Constant.navAccount);
              }}
            />
            <List.Accordion
              title={Constant.titAccount}
              left={(props) => (
                <Icon name="account-outline" {...props} size={24} />
              )}
            >
              <DrawerItem
                label={Constant.titProfile}
                onPress={() => {
                  props.navigation.navigate(Constant.navProfile);
                }}
              />
              <DrawerItem
                label={Constant.titPackage}
                onPress={() => {
                  props.navigation.navigate(Constant.navPackage);
                }}
              />
              <DrawerItem
                label={Constant.titDesigns}
                onPress={() => {
                  props.navigation.navigate(Constant.navDesigns);
                }}
              />
            </List.Accordion>
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="whatsapp" color={color} size={size} />
              )}
              label={Constant.titWhatsAppUs}
              onPress={() => {
                props.navigation.navigate(Constant.navWhatsAppUs);
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="information-outline" color={color} size={size} />
              )}
              label={Constant.titFaq}
              onPress={() => {
                props.navigation.navigate(Constant.navFaq);
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon
                  name="basketball-hoop-outline"
                  color={color}
                  size={size}
                />
              )}
              label={Constant.titWorkCulture}
              onPress={() => {
                props.navigation.navigate(Constant.navWorkCulture);
              }}
            />
          </Drawer.Section> */
}

{
  /* Legal Condition section */
}
{
  /* <View>
            <DrawerItem
              label={Constant.titTermCondition}
              onPress={() => {
                props.navigation.navigate(Constant.navTermCondition);
              }}
            />
            <DrawerItem
              label={Constant.titDisclamer}
              onPress={() => {
                props.navigation.navigate(Constant.navDisclamer);
              }}
            />
            <DrawerItem
              label={Constant.titPrivacyPolicy}
              onPress={() => {
                props.navigation.navigate(Constant.navPrivacyPolicy);
              }}
            />
            <DrawerItem
              label={Constant.titCopyright}
              onPress={() => {
                props.navigation.navigate(Constant.navCopyright);
              }}
            />
          </View> */
}
