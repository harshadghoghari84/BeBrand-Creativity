import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Animated,
  SafeAreaView,
  Platform,
} from "react-native";

const list = [
  "https://images.unsplash.com/photo-1622248382646-b7439ba4abb6?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
  "https://images.unsplash.com/photo-1622248382646-b7439ba4abb6?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
  "https://images.unsplash.com/photo-1622248382646-b7439ba4abb6?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
  "https://images.unsplash.com/photo-1622248382646-b7439ba4abb6?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
  "https://images.unsplash.com/photo-1622248382646-b7439ba4abb6?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
  "https://images.unsplash.com/photo-1622248382646-b7439ba4abb6?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
  "https://images.unsplash.com/photo-1622248382646-b7439ba4abb6?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
  "https://images.unsplash.com/photo-1622248382646-b7439ba4abb6?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
];

const HEADER_HEIGHT = 100;

function App() {
  const scrollY = new Animated.Value(0);

  const diffClamp = Animated.diffClamp(scrollY, 0, 100);
  const headerHeight = diffClamp.interpolate({
    inputRange: [0, 50],
    outputRange: [50, 0],
    extrapolate: "clamp",
  });
  const translateY = diffClamp.interpolate({
    inputRange: [0, 50],
    outputRange: [0, -50],
    extrapolate: "clamp",
  });
  const tranY = diffClamp.interpolate({
    inputRange: [0, 50],
    outputRange: [0, -50],
    extrapolate: "clamp",
  });
  const transY = diffClamp.interpolate({
    inputRange: [0, 40],
    outputRange: [0, -40],
    extrapolate: "clamp",
  });
  const opacity = diffClamp.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });
  const renderList = ({ item }) => {
    return (
      <Image
        source={{ uri: item }}
        style={{
          height: 300,
          marginVertical: 10,
          marginHorizontal: 10,
        }}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[
          styles.header,
          {
            transform: [{ translateY }],
          },
        ]}
      >
        <Text style={styles.headerText}>HEADER</Text>
      </Animated.View>
      <Animated.View
        style={{
          height: 150,
          backgroundColor: "green",
          transform: [{ translateY: tranY }],
          position: "absolute",
          left: 0,
          right: 0,
          top: 50,
          zIndex: 9999,
        }}
      >
        <Text>dljfgdiufgbc</Text>
      </Animated.View>
      <Animated.FlatList
        // contentInset={{ top: 50 }}
        // contentOffset={{ y: -50 }}
        bounces={false}
        scrollEventThrottle={16}
        style={{ flex: 1, width: "100%", paddingTop: 150 }}
        data={list}
        renderItem={renderList}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "white",
  },
  header: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
    opacity: 0.3,
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    zIndex: 999,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 20,
  },
});

export default App;
