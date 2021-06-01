import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Animated,
  SafeAreaView,
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
  const [scrollAnim] = useState(new Animated.Value(0));
  const [offsetAnim] = useState(new Animated.Value(0));
  const [clampedScroll, setClampedScroll] = useState(
    Animated.diffClamp(
      Animated.add(
        scrollAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
          extrapolateLeft: "clamp",
        }),
        offsetAnim
      ),
      0,
      1
    )
  );

  const navbarTranslate = clampedScroll.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT],
    extrapolate: "clamp",
  });

  const renderList = ({ item }) => {
    return (
      <Image source={{ uri: item }} style={{ width: "100%", height: 300 }} />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[
          styles.header,
          {
            transform: [{ translateY: navbarTranslate }],
          },
        ]}
        onLayout={(event) => {
          let { height } = event.nativeEvent.layout;
          setClampedScroll(
            Animated.diffClamp(
              Animated.add(
                scrollAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                  extrapolateLeft: "clamp",
                }),
                offsetAnim
              ),
              0,
              height
            )
          );
        }}
      >
        <Text style={styles.headerText}>HEADER</Text>
      </Animated.View>
      <View style={{ height: 40, borderRightColor: "green" }}>
        <Text>dljfgdiufgbc</Text>
      </View>
      <Animated.FlatList
        // contentInset={{ top: HEADER_HEIGHT }}
        // contentOffset={{ y: -HEADER_HEIGHT }}
        bounces={false}
        scrollEventThrottle={16}
        // style={{ flexGrow: 1, width: "100%" }}
        data={list}
        renderItem={renderList}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: { y: scrollAnim },
              },
            },
          ],
          { useNativeDriver: true }
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
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
