import React from "react";
import { View, StyleSheet, Text, ActivityIndicator } from "react-native";
import { Modal, Portal } from "react-native-paper";
import ColorPropType from "react-native/Libraries/DeprecatedPropTypes/DeprecatedColorPropType";
import Color from "../../utils/Color";

const ProgressDialog = ({ visible, dismissable, title, message, color }) => (
  <Portal>
    <Modal
      visible={visible}
      dismissable={dismissable}
      contentContainerStyle={styles.container}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          {title && <Text style={styles.title}>{title}</Text>}
          <View style={styles.loading}>
            <View style={styles.loader}>
              <ActivityIndicator size="large" color={Color.black} />
            </View>
            <View>
              <Text style={[styles.loadingContent, { color: color }]}>
                {message}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  </Portal>
);

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    padding: 35,
    backgroundColor: Color.transparent,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  loading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loader: {},
  loadingContent: {
    fontSize: 20,
    marginLeft: 10,
  },
});

export default ProgressDialog;
