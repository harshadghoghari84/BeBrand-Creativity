import React from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import Color from "../utils/Color";
import ICON from "react-native-vector-icons/MaterialCommunityIcons";
import Ratings from "../utils/ratings";

const PopUp = ({ visible, toggleVisible, isPurchased, other, isRating }) => {
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
                placeholder="write here..."
                multiline={true}
                style={{
                  flex: 1,
                  // height: 60,
                  // width: "80%",
                  borderRadius: 10,
                  paddingLeft: 20,
                  backgroundColor: Color.txtInBgColor,
                }}
              />
              <View
                style={{
                  marginTop: 20,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
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
                <TouchableOpacity
                  onPress={() => toggleVisible()}
                  style={{
                    ...styles.openButton,
                    backgroundColor: Color.darkBlue,
                    margin: 5,
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
                  onPress={() => toggleVisible()}
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
