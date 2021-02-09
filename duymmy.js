// import React, { Component } from "react";
// import {
//   StyleSheet,
//   View,
//   Text,
//   TouchableOpacity,
//   Linking,
// } from "react-native";
// import SplashScreen from "react-native-splash-screen";

// export default class App extends Component {
//   componentDidMount() {
//     SplashScreen.hide();
//   }

//   render() {
//     return (
//       <TouchableOpacity
//         style={styles.container}
//         onPress={(e) => {
//           Linking.openURL("https://coding.imooc.com/class/304.html");
//         }}
//       >
//         <View>
//           <Text style={styles.item}>SplashScreen 启动屏</Text>
//           <Text style={styles.item}>@：http://www.devio.org/</Text>
//           <Text style={styles.item}>
//             GitHub:https://github.com/crazycodeboy
//           </Text>
//           <Text style={styles.item}>Email:crazycodeboy@gmail.com</Text>
//         </View>
//       </TouchableOpacity>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f3f2f2",
//     marginTop: 30,
//   },
//   item: {
//     fontSize: 20,
//   },
//   line: {
//     flex: 1,
//     height: 0.3,
//     backgroundColor: "darkgray",
//   },
// });

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";

export default class App extends React.Component {
  state = {
    appIsReady: false,
  };

  async componentDidMount() {
    // Prevent native splash screen from autohiding
    try {
      await SplashScreen.preventAutoHideAsync();
    } catch (e) {
      console.warn(e);
    }
    this.prepareResources();
  }

  /**
   * Method that serves to load resources and make API calls
   */
  prepareResources = async () => {
    console.log("object");

    this.setState({ appIsReady: true }, async () => {
      await SplashScreen.hideAsync();
    });
  };

  render() {
    if (!this.state.appIsReady) {
      return null;
    }

    return (
      <View style={styles.container}>
        <Text style={styles.text}>SplashScreen Demo! 👋</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#aabbcc",
  },
  text: {
    color: "white",
    fontWeight: "bold",
  },
});
