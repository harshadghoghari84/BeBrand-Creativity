import { registerRootComponent } from "expo";
import { LogBox } from "react-native";
import messaging from "@react-native-firebase/messaging";
import App from "./App";

LogBox.ignoreAllLogs(true);

// Register background handler
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("Message handled in the background!", remoteMessage);
});

registerRootComponent(App);
