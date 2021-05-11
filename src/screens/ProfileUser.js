import { useMutation } from "@apollo/client";
import { toJS } from "mobx";
import { inject, observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import ICON from "react-native-vector-icons/MaterialCommunityIcons";
import { format } from "date-fns";
// relative Path
import Button from "../components/Button";
import Icon from "../components/svgIcons";
import TextInput from "../components/TextInput";
import Color from "../utils/Color";
import Common from "../utils/Common";
import GraphqlQuery from "../utils/GraphqlQuery";
import LangKey from "../utils/LangKey";
import ProgressDialog from "./common/ProgressDialog";
import { emptyValidator } from "../utils/Validator";

const UserProfile = ({ userStore }) => {
  const user = toJS(userStore.user);

  const [userName, setUserName] = useState(user?.name ? user.name : "");
  const [errorUserName, setErrorUserName] = useState("");

  const [mobile, setMobile] = useState(user?.mobile ? user.mobile : "");

  const [state, setState] = useState(user?.state ? user.state : "");
  const [city, setCity] = useState(user?.city ? user.city : "");

  let todayDate = new Date();
  const [birthDate, setBirthDate] = useState(
    user?.birthDate ? new Date(user.birthDate) : ""
  );
  const [errBirthDate, setErrBirthDate] = useState("");
  const [avDate, setAvDate] = useState(
    user?.anniversaryDate ? new Date(user.anniversaryDate) : ""
  );
  const [showBD, setShowBD] = useState(false);
  const [showAD, setShowAD] = useState(false);

  const [updateUserProfile, { loading }] = useMutation(
    GraphqlQuery.updateUserProfile,
    {
      errorPolicy: "all",
    }
  );

  const onSave = () => {
    if (emptyValidator(userName)) {
      setErrorUserName(Common.getTranslation(LangKey.errUserName));
      return;
    } else if (birthDate == null && birthDate === "") {
      setErrBirthDate("invalid input");
      return;
    }
    updateUserProfile({
      variables: {
        name: userName,
        birthDate: birthDate,
        anniversaryDate: avDate,
        state: state,
        city: city,
      },
    })
      .then(({ data, errors }) => {
        if (errors && errors && errors !== null) {
          console.log("error", errors);
        }
        if (data && data && data !== null) {
          console.log("data", data);

          const newUser = {
            ...user,
            name: userName,
            mobile: mobile,
            birthDate: birthDate,
            anniversaryDate: avDate,
            state: state,
            city: city,
          };
          userStore.setOnlyUserDetail(newUser);
        }
      })
      .catch((err) => {
        console.log("ERR", err);
      });
  };

  const onChange = (event, selectedDate) => {
    console.log("object", selectedDate);

    const currentDate = selectedDate;
    if (showBD) {
      setBirthDate(new Date(currentDate));
      // setShowBD(false);
    }

    if (showAD) {
      setAvDate(new Date(currentDate));
      // setShowAD(false);
    }
  };

  useEffect(() => {
    console.log("userName :", userName);
    console.log("avDate :", avDate);
    console.log("birthDate :", birthDate);
  }, [avDate, birthDate, userName]);
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.sv}>
      <ProgressDialog
        visible={loading}
        dismissable={false}
        message={Common.getTranslation(LangKey.labsSaving)}
      />

      <View style={styles.container}>
        <View style={styles.containerTil}>
          <TextInput
            placeholder={Common.getTranslation(LangKey.labUser)}
            placeholderTextColor={Color.txtIntxtcolor}
            returnKeyType="next"
            iconName="user"
            value={userName}
            onChangeText={(text) => setUserName(text)}
            autoCapitalize="none"
            error={!!errorUserName}
            errorText={errorUserName}
          />
          <TextInput
            placeholder={Common.getTranslation(LangKey.labMobile)}
            placeholderTextColor={Color.txtIntxtcolor}
            returnKeyType="next"
            iconName="phone"
            value={mobile}
            keyboardType="phone-pad"
            onChangeText={(text) => setMobile(text)}
            autoCapitalize="none"
          />
          <TouchableOpacity
            onPress={() => setShowBD(true)}
            activeOpacity={0.6}
            style={styles.socialBTNView}
          >
            <View
              style={{
                backgroundColor: Color.txtIntxtcolor,
                height: 30,
                width: 30,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 50,
                marginHorizontal: 5,
              }}
            >
              <Icon
                name="designation"
                fill={Color.white}
                height={"60%"}
                width={"60%"}
              />
            </View>
            <Text
              style={{
                fontSize: 13,
                fontWeight: "700",
                color: Color.darkBlue,
                paddingHorizontal: 8,
              }}
            >
              {birthDate && birthDate !== null && birthDate !== "" ? (
                format(birthDate, "dd MMM yyyy")
              ) : (
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "700",
                    color: Color.txtIntxtcolor,
                    paddingHorizontal: 8,
                  }}
                >
                  {Common.getTranslation(LangKey.labDob)}
                </Text>
              )}
            </Text>
          </TouchableOpacity>
          {errBirthDate ? (
            <Text style={styles.error}>{errBirthDate}</Text>
          ) : null}
          {showBD && (
            <>
              {Platform.OS === "ios" && (
                <TouchableOpacity
                  onPress={() => setShowBD(false)}
                  style={{
                    height: 25,
                    margin: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingHorizontal: 20,

                    borderRadius: 20,
                  }}
                >
                  <Text>pick Birth Date here</Text>
                  <ICON name="close" size={22} color={Color.darkBlue} />
                </TouchableOpacity>
              )}
              {showBD && (
                <DateTimePicker
                  style={{
                    marginHorizontal: 20,
                    backgroundColor: Color.txtInBgColor,
                    borderRadius: 20,
                    overflow: "hidden",
                  }}
                  textColor={Color.darkBlue}
                  testID="dateTimePicker"
                  value={birthDate ? birthDate : todayDate}
                  mode={"date"}
                  display="spinner"
                  onChange={onChange}
                />
              )}
            </>
          )}

          <TouchableOpacity
            onPress={() => setShowAD(true)}
            activeOpacity={0.6}
            style={styles.socialBTNView}
          >
            <View
              style={{
                backgroundColor: Color.txtIntxtcolor,
                height: 30,
                width: 30,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 50,
                marginHorizontal: 5,
              }}
            >
              <Icon
                name="social_id"
                fill={Color.white}
                height={"60%"}
                width={"60%"}
              />
            </View>
            <Text
              style={{
                fontSize: 13,
                fontWeight: "700",
                color: Color.darkBlue,
                paddingHorizontal: 8,
              }}
            >
              {avDate && avDate !== null && avDate !== "" ? (
                format(avDate, "dd MMM yyyy")
              ) : (
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "700",
                    color: Color.txtIntxtcolor,
                    paddingHorizontal: 8,
                  }}
                >
                  {Common.getTranslation(LangKey.labAvDate)}
                </Text>
              )}
            </Text>
          </TouchableOpacity>
          {showAD && (
            <>
              {Platform.OS === "ios" && (
                <TouchableOpacity
                  onPress={() => setShowAD(false)}
                  style={{
                    height: 25,
                    margin: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingHorizontal: 20,
                    borderRadius: 20,
                  }}
                >
                  <Text>pick Anivarsary Date here</Text>
                  <ICON name="close" size={22} color={Color.darkBlue} />
                </TouchableOpacity>
              )}
              {showAD && (
                <DateTimePicker
                  style={{
                    marginHorizontal: 20,
                    backgroundColor: Color.txtInBgColor,
                    borderRadius: 20,
                    overflow: "hidden",
                  }}
                  onTouchCancel={false}
                  textColor={Color.darkBlue}
                  testID="dateTimePicker"
                  value={avDate ? avDate : todayDate}
                  mode={"date"}
                  display="spinner"
                  onChange={onChange}
                />
              )}
            </>
          )}
          <TextInput
            placeholder={Common.getTranslation(LangKey.labState)}
            placeholderTextColor={Color.txtIntxtcolor}
            returnKeyType="next"
            iconName="social_id"
            value={state}
            onChangeText={(text) => setState(text)}
            autoCapitalize="none"
          />
          <TextInput
            placeholder={Common.getTranslation(LangKey.labCity)}
            placeholderTextColor={Color.txtIntxtcolor}
            returnKeyType="next"
            iconName="social_id"
            value={city}
            onChangeText={(text) => setCity(text)}
            autoCapitalize="none"
          />
        </View>
        <Button normal={true} style={styles.btnSave} onPress={() => onSave()}>
          {Common.getTranslation(LangKey.txtSave)}
        </Button>
      </View>
    </ScrollView>
  );
};

export default inject("userStore")(observer(UserProfile));

const styles = StyleSheet.create({
  sv: {
    backgroundColor: Color.white,
  },
  container: {
    flex: 1,
    alignItems: "center",
  },
  containerTil: { width: "100%", marginTop: 20 },
  btnSave: {
    width: "30%",
    marginTop: 10,
  },
  socialBTNView: {
    height: 40,
    borderRadius: 50,
    marginHorizontal: 20,
    backgroundColor: Color.txtInBgColor,
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
  },
  error: {
    fontSize: 14,
    color: Color.red,
    paddingLeft: 30,
  },
});
