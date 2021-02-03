import React from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Modal,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Color from "../utils/Color";

const PopUp = ({ visible, toggleVisible }) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={() => toggleVisible()}
    >
      <KeyboardAvoidingView style={styles.centeredView}>
        <View style={styles.modalView}>
          <View>
            <Text>please purchase primium package</Text>
          </View>
          <TouchableOpacity
            onPress={() => toggleVisible()}
            style={{ ...styles.openButton, backgroundColor: Color.primary }}
          >
            <Text style={styles.textStyle}>close</Text>
          </TouchableOpacity>
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
    alignItems: "center",
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
    paddingHorizontal: 40,
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
