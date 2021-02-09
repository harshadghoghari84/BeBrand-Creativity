import React, { useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  FlatList,
  Animated,
  Image,
  Dimensions,
} from "react-native";

const { width, height } = Dimensions.get("screen");

const images = {
  man:
    "https://images.pexels.com/photos/3147528/pexels-photo-3147528.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
  women:
    "https://images.pexels.com/photos/2552130/pexels-photo-2552130.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
  kids:
    "https://images.pexels.com/photos/5080167/pexels-photo-5080167.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
  skullcandy:
    "https://images.pexels.com/photos/5602879/pexels-photo-5602879.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
  help:
    "https://images.pexels.com/photos/2552130/pexels-photo-2552130.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
};

const data = Object.keys(images).map((i) => ({
  key: i,
  title: i,
  image: images[i],
}));

const Tab = ({ item }) => {
  return (
    <View>
      <Text style={{ color: "white", fontSize: 84 / data.length }}>
        {item.title}
      </Text>
    </View>
  );
};
const Indicator = () => {
  return (
    <View
      style={{
        position: "absolute",
        height: 4,
        width: 100,
        backgroundColor: "white",
        bottom: -10,
      }}
    />
  );
};
const Tabs = ({ data, scrollX }) => {
  return (
    <View style={{ position: "absolute", top: 100, width }}>
      <View
        style={{
          justifyContent: "space-evenly",
          flex: 1,
          flexDirection: "row",
        }}
      >
        {data.map((item) => {
          return <Tab key={item.key} item={item} />;
        })}
      </View>
      <Indicator />
    </View>
  );
};

export default function App() {
  const scrollX = useRef(new Animated.Value(0)).current;
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Animated.FlatList
        data={data}
        keyExtractor={(item) => item.key}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        bounces={false}
        renderItem={({ item }) => {
          return (
            <View style={{ height, width }}>
              <Image
                source={{ uri: item.image }}
                style={{ flex: 1, resizeMode: "cover" }}
              />
              <View
                style={[
                  StyleSheet.absoluteFillObject,
                  { backgroundColor: "rgba(0,0,0,0.3)" },
                ]}
              />
            </View>
          );
        }}
      />
      <Tabs scrollX={scrollX} data={data} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
