import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
import { inject, observer } from "mobx-react";
import { toJS } from "mobx";

// Relative Path
import Common from "../../utils/Common";
import Color from "../../utils/Color";
import LangKey from "../../utils/LangKey";

// const App = ({ navigation, designStore }) => {
//   const { width, height } = Dimensions.get("screen");

//   const myPkg = {
//     Free: <Packages designStore={designStore} />,
//     Monthly: <Packages designStore={designStore} />,
//   };

//   const data = Object.keys(myPkg).map((i) => ({
//     key: i,
//     title: i,
//     pkg: myPkg[i],
//     ref: React.createRef(),
//   }));

//   const Tab = React.forwardRef(
//     ({ item, onItemPress, measures, scrollX }, ref) => {
//       const inputRange = data.map((_, i) => i * width);
//       const indicatorWidth = scrollX.interpolate({
//         inputRange,
//         outputRange: measures.map((measures) => measures.width),
//       });
//       const translateX = scrollX.interpolate({
//         inputRange,
//         outputRange: measures.map((measures) => measures.x),
//       });
//       return (
//         <TouchableOpacity onPress={onItemPress}>
//           <View
//             style={{
//               position: "absolute",

//               width: indicatorWidth,
//               backgroundColor: Color.darkBlue,
//               // bottom: -10,
//               borderRadius: 8,
//               transform: [{ translateX }],
//             }}
//           >
//             <View ref={ref} styles={{ backgroundColor: "green" }}>
//               <Text
//                 style={{
//                   color: Color.darkBlue,
//                   fontSize: 18,
//                 }}
//               >
//                 {item.title}
//               </Text>
//             </View>
//           </View>
//         </TouchableOpacity>
//       );
//     }
//   );
//   const Indicator = ({ measures, scrollX }) => {
//     const inputRange = data.map((_, i) => i * width);
//     const indicatorWidth = scrollX.interpolate({
//       inputRange,
//       outputRange: measures.map((measures) => measures.width),
//     });
//     const translateX = scrollX.interpolate({
//       inputRange,
//       outputRange: measures.map((measures) => measures.x),
//     });
//     return (
//       <Animated.View
//         style={{
//           position: "absolute",
//           height: 4,
//           width: indicatorWidth,
//           backgroundColor: Color.darkBlue,
//           bottom: -10,
//           borderRadius: 8,
//           transform: [{ translateX }],
//         }}
//       />
//     );
//   };
//   const Tabs = ({ data, scrollX, onItemPress }) => {
//     const containerRef = useRef();
//     const [measures, setMeasures] = useState([]);
//     useEffect(() => {
//       let m = [];
//       data.forEach((item) => {
//         item.ref.current.measureLayout(
//           containerRef.current,
//           (x, y, width, height) => {
//             m.push({
//               x,
//               y,
//               width,
//               height,
//             });
//             if (m.length === data.length) {
//               setMeasures(m);
//             }
//           }
//         );
//       });
//     }, []);
//     return (
//       <View style={{ position: "absolute", width }}>
//         <View
//           ref={containerRef}
//           style={{
//             justifyContent: "space-evenly",
//             flex: 1,
//             flexDirection: "row",
//           }}
//         >
//           {data.map((item, index) => {
//             return (
//               <>
//                 {measures.length > 0 && (
//                   <Tab
//                     key={item.key}
//                     item={item}
//                     ref={item.ref}
//                     measures={measures}
//                     scrollX={scrollX}
//                     onItemPress={() => onItemPress(index)}
//                   />
//                 )}
//               </>
//             );
//           })}
//         </View>
//         {/* {measures.length > 0 && (   )} */}
//         {/* <Indicator measures={measures} scrollX={scrollX} /> */}
//       </View>
//     );
//   };

//   const scrollX = useRef(new Animated.Value(0)).current;

//   const ref = useRef();
//   const onItemPress = useCallback((itemIndex) => {
//     ref?.current?.scrollToOffset({
//       offset: itemIndex * width,
//     });
//   });
//   return (
//     <View style={styles.container}>
//       <Animated.FlatList
//         ref={ref}
//         data={data}
//         keyExtractor={(item) => item.key}
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         pagingEnabled
//         onScroll={Animated.event(
//           [{ nativeEvent: { contentOffset: { x: scrollX } } }],
//           { useNativeDriver: false }
//         )}
//         bounces={false}
//         renderItem={({ item }) => {
//           return (
//             <View style={{ height, width }}>
//               {item.pkg}
//               {/* <View
//                 style={[
//                   StyleSheet.absoluteFillObject,
//                   { backgroundColor: "rgba(0,0,0,0.3)" },
//                 ]}
//               /> */}
//             </View>
//           );
//         }}
//       />
//       <Tabs scrollX={scrollX} data={data} onItemPress={onItemPress} />
//     </View>
//   );
// };

// export default inject("designStore")(observer(App));

const Packages = ({ navigation, designStore }) => {
  const designPackages = toJS(designStore.designPackages);
  console.log("designPackages: ", designPackages);

  // key extractors
  const keyExtractor = useCallback((item) => item.id.toString(), []);

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.listDesign}
        data={designPackages}
        keyExtractor={keyExtractor}
        renderItem={({ item }) => {
          return (
            <View style={styles.fltContainer}>
              <View
                style={{
                  backgroundColor: Color.primary,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderRadius: 3,
                  overflow: "hidden",
                  position: "absolute",
                  right: 0,
                  top: 0,
                }}
              >
                <Text
                  style={{
                    color: Color.white,
                    fontSize: 15,
                    fontWeight: "700",
                  }}
                >
                  SAVE 85%
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    color: Color.darkBlue,
                    fontWeight: "700",
                  }}
                >
                  {item.name}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text>DiscountPrice :</Text>
                <Text
                  style={{
                    fontSize: 18,
                    color: Color.primary,
                    fontWeight: "700",
                    marginLeft: 10,
                  }}
                >
                  ₹ {item.discountPrice}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text>ActualPrice :</Text>
                <Text
                  style={{
                    fontSize: 18,
                    color: Color.txtIntxtcolor,
                    fontWeight: "700",
                    marginLeft: 10,
                    textDecorationLine: "line-through",
                  }}
                >
                  ₹ {item.actualPrice}
                </Text>
              </View>

              {item.features.map((ele) => {
                return (
                  <View style={{ flexDirection: "row" }}>
                    <Text style={{ marginHorizontal: 5 }}>O</Text>
                    <Text>{ele}</Text>
                  </View>
                );
              })}

              <TouchableOpacity style={styles.btnPerchase}>
                <Text style={styles.txtPerchase}>
                  {Common.getTranslation(LangKey.labPerchase)}
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listDesign: {},
  btnPerchase: {
    backgroundColor: Color.primary,
    alignItems: "center",
    borderRadius: 50,
    height: 27,
    width: 110,
    justifyContent: "center",
    marginHorizontal: 20,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    color: Color.white,
  },
  txtPerchase: {
    fontSize: 13,
    fontWeight: "700",
    color: Color.white,
    textTransform: "capitalize",
  },
  fltContainer: {
    marginTop: 10,
    marginBottom: 5,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Color.white,
    marginStart: 5,
    marginLeft: 10,
    marginRight: 10,
    paddingVertical: 10,
    paddingLeft: 20,
    paddingRight: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
});

export default inject("designStore")(observer(Packages));
