import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PermissionsAndroid } from "react-native";
import * as Notifications from "expo-notifications";
export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  if (enabled) {
    console.log("Authorization status:", authStatus);
    var token = await getFcmToken();

    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    return token;
  }
}

const getFcmToken = async () => {
  // let checkToken = await AsyncStorage.getItem("fcmToken");
  // console.log("the old token", checkToken);
  // if (!checkToken) {
  //   try {
  //     const fcmToken = await messaging().getToken();
  //     console.log(fcmToken , "new fcm token")
  //     if (fcmToken) {
  //       console.log("fcme token generated", fcmToken);
  //       await AsyncStorage.setItem("fcmToken", fcmToken);
  //     }
  //     return fcmToken;
  //   } catch (error) {
  //     console.log("error in fcmToken", error);
  //     alert(error?.message);
  //   }
  // }
  try {
    const fcmToken = await messaging().getToken();
    console.log(fcmToken, "new fcm token");
    if (fcmToken) {
      console.log("fcme token generated", fcmToken);
      await AsyncStorage.setItem("fcmToken", fcmToken);
    }
    return fcmToken;
  } catch (error) {
    console.log("error in fcmToken", error);
    alert(error?.message);
    return "";
  }
};
export const creatingChannel = async () => {
  var channel = await Notifications.setNotificationChannelAsync("mgsdelivery", {
    name: "mgsdelivery",
    importance: Notifications.AndroidImportance.HIGH,
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    showBadge: true,
  });
};

export const foregroundNotification = () => {
  const unsubscribe = messaging().onMessage(async (remoteMessage) => {
    const { notification, messageId } = remoteMessage;
    console.log("onMessage", notification);
    // console.log(notification.body, notification.title);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: notification.title,
        body: notification.body,
      },
      trigger: { seconds: 1 },
    });
  });
  return unsubscribe;
};
export const backgroundNotification = () => {
  const unsubscribe = messaging().setBackgroundMessageHandler(
    async (remoteMessage) => {
      const { notification, messageId } = remoteMessage;
      console.log("setBackgroundMessageHandler", notification);
      // console.log(notification.body, notification.title);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
        },
        trigger: null,
      });
    }
  );
  return unsubscribe;
};
export const notificationListenerCall = async () => {
  messaging().onNotificationOpenedApp(async (remoteMessage) => {
    console.log(
      "Notification caused app to open from background state:",
      remoteMessage.notification
    );
    console.log("backgrund state", remoteMessage.notification);
  });
  // Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        console.log(
          "Notification caused app to open from quit state:",
          remoteMessage.notification
        );
        console.log("remote message", remoteMessage.notification);
      }
    });
};
