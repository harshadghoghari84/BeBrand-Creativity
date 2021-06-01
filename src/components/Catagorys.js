import React, {
  createRef,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  findNodeHandle,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Festivals from "../screens/home/Festivals";

const Catagorys = {
  Festivals: "Festivals",
  Wishes: "Wishes",
  Quates: "Quates",
  Kids: "Kids",
  // Hello: "Hello",
  // hello2: "hello2",
  // hello3: "hello3",
  // hello4: "hello4",
  // hello5: "hello5",
};
const data = Object.keys(Catagorys).map((i) => ({
  key: i,
  title: i,
  ref: createRef(),
}));

const { width, height } = Dimensions.get("screen");

const Tab = forwardRef(({ item, onItemPress, activeCat, index }, ref) => {
  return (
    <TouchableOpacity onPress={onItemPress}>
      <View ref={ref}>
        <Text
          style={{
            fontSize: 20,
            paddingHorizontal: 10,
            color: activeCat === index ? "orange" : "black",
            color: "black",
          }}
        >
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

const Tabs = ({
  data,
  scrollX,
  containerRef,
  measures,
  onItemPress,
  activeCat,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{
        width,
        height: 40,
        borderBottomColor: "grey",
        borderBottomWidth: 0.5,
      }}
    >
      <View
        style={[
          {
            height: 32,
          },
          {
            width: data.length <= 4 ? width : null,
          },
        ]}
      >
        <View
          ref={containerRef}
          style={{
            justifyContent: "space-evenly",
            flex: 1,
            flexDirection: "row",
          }}
        >
          {data.map((item, index) => {
            return (
              <Tab
                key={item.key}
                item={item}
                index={index}
                activeCat={activeCat}
                ref={item.ref}
                onItemPress={() => onItemPress(index)}
              />
            );
          })}
        </View>
        {measures && measures.length > 0 && (
          <Indicator
            measures={measures}
            scrollX={scrollX}
            activeCat={activeCat}
          />
        )}
      </View>
    </ScrollView>
  );
};

const Indicator = ({ measures, scrollX, activeCat }) => {
  const inputRange = data.map((_, i) => i * width);

  const indicatorWidth = scrollX.interpolate({
    inputRange,
    outputRange: measures.map((mes) => mes.width),
  });
  const translateX = scrollX.interpolate({
    inputRange,
    outputRange: measures.map((mes) => mes.x),
  });
  return (
    <Animated.View
      style={{
        height: 4,
        width: indicatorWidth,
        backgroundColor: "black",
        transform: [{ translateX }],
        // marginBottom: 15,
        borderRadius: 5,
      }}
    />
  );
};
export default function App() {
  const scrollX = useRef(new Animated.Value(0)).current;
  const containerRef = useRef();
  const ref = useRef();
  const [measures, setMeasures] = useState();
  const [activeCat, setActiveCat] = useState(0);
  useEffect(() => {
    const m = [];
    data.forEach((item) => {
      item.ref.current.measureLayout(
        containerRef && containerRef.current,
        (x, y, width, height) => {
          m.push({
            x,
            y,
            width,
            height,
          });
          if (m.length === data.length) {
            setMeasures(m);
          }
        }
      );
    });
  }, []);

  const onItemPress = useCallback((itemIndex) => {
    setActiveCat(itemIndex);
    ref?.current?.scrollToOffset({
      offset: itemIndex * width,
    });
  });

  return (
    <SafeAreaView style={styles.container}>
      <Tabs
        scrollX={scrollX}
        data={data}
        containerRef={containerRef}
        measures={measures}
        activeCat={activeCat}
        onItemPress={onItemPress}
      />
      <Animated.FlatList
        ref={ref}
        data={data}
        keyExtractor={(item) => item.key}
        // horizontal
        // showsHorizontalScrollIndicator={false}
        // pagingEnabled
        bounces={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        renderItem={({ item }) => {
          if (item.title === "Festivals") {
            return <Festivals />;
          }
        }}
      />
    </SafeAreaView>
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
