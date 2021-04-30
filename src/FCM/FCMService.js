import { Platform } from "react-native";
import messaging from "@react-native-firebase/messaging";

class FcmService {
  register = (onRegister, onNotification, onOpenNotification) => {
    this.checkPermission(onRegister);
    // when register function call that time we create notification listener
    this.createNoitificationListeners(
      onRegister,
      onNotification,
      onOpenNotification
    );
  };

  registerAppWithFCM = async () => {
    if (Platform.OS === "ios") {
      await messaging().registerDeviceForRemoteMessages();
      await messaging().setAutoInitEnabled(true);
    }
  };

  checkPermission = (onRegister) => {
    messaging()
      .hasPermission()
      .then((enabled) => {
        if (enabled) {
          //user has permission
          this.getToken(onRegister);
        } else {
          //user don't have permission
          this.requestPermission(onRegister);
        }
      })
      .catch((error) => {
        console.log("Permission rejected", error);
      });
  };

  getToken = (onRegister) => {
    messaging()
      .getToken()
      .then((fcmToken) => {
        if (fcmToken) {
          onRegister(fcmToken);
        } else {
          console.log("User does not have a device token");
        }
      })
      .catch((error) => {
        console.log("getToken rejected ", error);
      });
  };

  requestPermission = (onRegister) => {
    messaging()
      .requestPermission()
      .then(() => {
        this.getToken(onRegister);
      })
      .catch((error) => {
        console.log("Requested persmission rejected ", error);
      });
  };

  deleteToken = () => {
    console.log("deleteToken");
    messaging()
      .deleteToken()
      .catch((error) => {
        console.log("Delected token error ", error);
      });
  };

  createNoitificationListeners = (
    onRegister,
    onNotification,
    onOpenNotification
  ) => {
    messaging().onNotificationOpenedApp((remoteMessage) => {
      // Alert.alert(remoteMessage)
      console.log(
        "[FCMService] onNotificationOpenedApp Notification caused app to open from background state:",
        remoteMessage
      );
      if (remoteMessage) {
        const notification = remoteMessage.notification;
        onOpenNotification(notification);
      }
    });

    // when the application is opened form a quit state
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        //Alert.alert(remoteMessage)
        console.log(
          "[FCMService] getInitialNotification Notification caused app to open from quit state:",
          remoteMessage
        );
        if (remoteMessage) {
          const notification = remoteMessage.notification;
          onOpenNotification(notification);
        }
      });

    // Foreground state messages
    this.messageListener = messaging().onMessage(async (remoteMessage) => {
      //Alert.alert(remoteMessage)
      console.log("[FCMService] A new FCM message arrived", remoteMessage);
      if (remoteMessage) {
        let notification = null;
        if (Platform.OS === "ios") {
          notification = remoteMessage;
        } else {
          notification = remoteMessage;
        }
        onNotification(notification);
      }
    });

    // Triggered when have new token
    messaging().onTokenRefresh((fcmToken) => {
      console.log("New token refresh: ", fcmToken);
      onRegister(fcmToken);
    });
  };

  unRegister = () => {
    this.messageListener();
  };
}
export const fcmService = new FcmService();
