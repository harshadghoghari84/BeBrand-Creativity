import React, { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Color from "../utils/Color";
import ICON from "react-native-vector-icons/MaterialCommunityIcons";
import Ratings from "../utils/ratings";
import Common from "../utils/Common";
import LangKey from "../utils/LangKey";
import { useMutation } from "@apollo/client";
import GraphqlQuery from "../utils/GraphqlQuery";
import Constant from "../utils/Constant";

const PopUp = ({ visible, toggleVisible, isPurchased, other, isRating }) => {
  const navigation = useNavigation();
  const [feture, setFeture] = useState();

  const [userRequestFeture, { loading }] = useMutation(
    GraphqlQuery.addRequestFeature,
    {
      errorPolicy: "all",
    }
  );

  const onsubmit = () => {
    userRequestFeture({
      variables: {
        feature: feture,
      },
    })
      .then((result) => {
        console.log("reslut", result);
        toggleVisible();
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={() => toggleVisible()}
    >
      <KeyboardAvoidingView style={styles.centeredView}>
        <View style={styles.modalView}>
          {isRating && (
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                onPress={() => toggleVisible()}
                style={{ alignItems: "flex-end", padding: 5 }}
              >
                <ICON name="close" size={30} color="#E53A40" />
              </TouchableOpacity>
              <Ratings />
            </View>
          )}
          {other && (
            <KeyboardAvoidingView
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TextInput
                placeholder={Common.getTranslation(LangKey.modalTxtPlaceHolder)}
                placeholderTextColor={Color.grey}
                multiline={true}
                value={feture}
                onChangeText={(val) => setFeture(val)}
                style={{
                  // flex: 1,
                  height: 100,
                  width: "90%",
                  borderRadius: 10,
                  paddingHorizontal: 20,
                  backgroundColor: Color.txtInBgColor,
                }}
              />
              <View
                style={{
                  marginTop: 5,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  onPress={() => toggleVisible()}
                  style={{
                    ...styles.openButton,
                    backgroundColor: Color.primary,
                    marginHorizontal: 5,
                  }}
                >
                  <Text style={styles.textStyle}>close</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onsubmit()}
                  style={{
                    ...styles.openButton,
                    backgroundColor: Color.primary,
                    marginHorizontal: 5,
                  }}
                >
                  <Text style={styles.textStyle}>Submit</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          )}
          {isPurchased && (
            <View
              style={{
                flex: 1,

                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View>
                <Text>please purchase primium package</Text>
              </View>
              <View
                style={{
                  marginTop: 20,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    toggleVisible();
                    navigation.navigate(Constant.navPro);
                  }}
                  style={{
                    ...styles.openButton,
                    backgroundColor: Color.primary,
                    margin: 5,
                  }}
                >
                  <Text style={styles.textStyle}>Purchase</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => toggleVisible()}
                  style={{
                    ...styles.openButton,
                    backgroundColor: Color.primary,
                    margin: 5,
                  }}
                >
                  <Text style={styles.textStyle}>close</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default PopUp;
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
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
  openButton: {
    borderRadius: 20,
    paddingHorizontal: 30,
    paddingVertical: 5,
    elevation: 2,
    alignSelf: "center",
    marginTop: 20,
  },
  textStyle: {
    color: Color.white,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
