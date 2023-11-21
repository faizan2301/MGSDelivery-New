import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect } from "react";
import FlashMessage from "react-native-flash-message";
import Routes from "./src/navigations/Routes";
import { Provider } from "react-redux";
import { store } from "./src/redux/store/store";
import { StatusBar } from "expo-status-bar";
import * as Notifications from "expo-notifications";
import { View } from "react-native";
import messaging from "@react-native-firebase/messaging";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    priority: Notifications.AndroidNotificationPriority.HIGH,
  }),
});
const App = () => {
  useEffect(() => {
    // requestUserPermission();
    // creatingChannel();
    messaging().onMessage(async (remoteMessage) => {
      console.log(remoteMessage);
      const { notification, messageId } = remoteMessage;

      await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
        },
        trigger: null,
      });
    });
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      const { notification, messageId } = remoteMessage;

      await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
        },
        trigger: null,
      });
    });
  }, [0]);
  return (
    <Provider store={store}>
      <SafeAreaView className="flex-1 bg-white">
        <Routes />
        <StatusBar style="auto" />
        <FlashMessage position="center" />
      </SafeAreaView>
    </Provider>
  );
};
export default App;
