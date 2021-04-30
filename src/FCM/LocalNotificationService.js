import { Platform } from "react-native";
import PushNotification from "react-native-push-notification";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import Constant from "../utils/Constant";

class LocalNotificationService {
  configure = (onOpenNotification) => {
    // Must be outside of any component LifeCycle (such as `componentDidMount`).
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log("TOKEN:", token);
      },

      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification: function (notification) {
        console.log("NOTIFICATION:", notification);
        if (!notification?.data) {
          return;
        }

        notification.userInteraction = true;
        onOpenNotification(
          Platform.OS === "ios" ? notification.data.item : notification.data
        );

        // process the notification

        // (required) Called when a remote is received or opened, or local notification is opened
        if (Platform.OS === "ios") {
          notification.finish(PushNotificationIOS.FetchResult.NoData);
        }
      },

      // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
      //   onAction: function (notification) {
      //     console.log('ACTION:', notification.action)
      //     console.log('NOTIFICATION:', notification)

      //     // process the action
      //   },

      // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      // onRegistrationError: function (err) {
      //   console.error(err.message, err)
      // },

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       * - if you are not using remote notification or do not have Firebase installed, use this:
       *     requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: true,
    });
  };

  unregister = () => {
    PushNotification.unregister();
  };

  showNotification = async (id, title, message, data = {}, options = {}) => {
    // console.log('show notification called')
    await PushNotification.channelExists(
      options.channelId,
      async function (exists) {
        if (!exists) {
          await PushNotification.createChannel(
            {
              channelId: options.channelId,
              channelName: options.channelId,
              channelDescription: "A channel to categorise your notifications",
              playSound: false,
              soundName: "default",
              importance: 4,
              vibrate: true,
            },
            (created) => console.log(`createChannel returned '${created}'`)
          );
        }
      }
    );

    PushNotification.localNotification({
      /*Android only properties*/

      ...this.buildAndroidNotification(id, title, message, data, options),
      /*Ios only properties*/
      ...this.buildIOSNotification(id, title, message, data, options),
      /*Ios only properties*/
      title: title || "",
      message: message || "",
      playSound: options.playSound || false,
      soundName: options.soundName || "default",
      userInteraction: false,
    });
  };

  subscribeToTopics = (val) => {
    PushNotification.subscribeToTopic(val);
  };

  unsubscribeFromTopic = (val) => {
    PushNotification.unsubscribeFromTopic(val);
  };

  buildAndroidNotification = (id, title, message, data = {}, options = {}) => {
    return {
      id: id,
      channelId: options.channelId,
      autoCancel: true,
      largeIcon: "",
      smallIcon: "ic_notification",
      bigPictureUrl: options.bigPictureUrl,
      bigText: message || "",
      subText: title || "",
      vibrate: options.vibrate || true,
      vibration: options.vibration || 300,
      priority: options.priority || "high",
      importance: options.importance || "high",
      data: data,
    };
  };

  buildIOSNotification = (id, title, message, data = {}, options = {}) => {
    return {
      alertAction: options.alertAction || "view",
      category: options.category || "",
      userInfo: {
        id: id,
        item: data,
      },
    };
  };

  cancelAllLocalNotification = () => {
    if (Platform.OS === "ios") {
      PushNotificationIOS.removeAllDeliveredNotifications();
    } else {
      PushNotification.cancelAllLocalNotifications();
    }
  };

  removeAllDeliveredNotificationByID = (notificationId) => {
    console.log(
      "[LocalNotificationService] removeAllDeliveredNotificationByID",
      notificationId
    );
    PushNotification.cancelLocalNotifications({ id: `${notificationId}` });
  };
}

export const localNotificationService = new LocalNotificationService();
