/* eslint-disable react/no-unstable-nested-components */
import React from "react";
import navigationStrings from "../constant/navigationStrings";
import {
  AssignOrders,
  CollectPayment,
  Deliver,
  LoginScreen,
  QrCodeScanScreen,
  SplashScreen,
} from "../screens";
import DeliveryTabRoutes from "./DeliveryTabRoutes";
import AdminTabRoutes from "./AdminTabRoutes";
import Permission from "../common/screens/Permission";
import Header from "../components/Header";
import OrderDetails from "../screens/adminTabs/Home/OrderDetails";

const MainStack = (Stack) => {
  return (
    <>
      <Stack.Screen
        name={navigationStrings.SPLASHSCREEN}
        component={SplashScreen}
      />
      <Stack.Screen
        name={navigationStrings.LOGINSCREEN}
        component={LoginScreen}
      />
      <Stack.Screen
        name={navigationStrings.DELIVEYBOTTOMTAB}
        component={DeliveryTabRoutes}
      />
      <Stack.Screen
        name={navigationStrings.ADMINBOTTOMTAB}
        component={AdminTabRoutes}
      />
      <Stack.Screen
        name={navigationStrings.ADMINORDERDETAILS}
        component={OrderDetails}
      />
      <Stack.Screen
        name={navigationStrings.ADMINCOLLECTPAYMENT}
        component={CollectPayment}
      />
      <Stack.Screen
        name={navigationStrings.PERMISSIONSCREEN}
        component={Permission}
      />
      <Stack.Screen name={navigationStrings.DELIVER} component={Deliver} />
      <Stack.Screen
        name={navigationStrings.SCANQRCODESCREEN}
        component={QrCodeScanScreen}
        options={({ navigation }) => {
          console.log("nav", navigation);
          return {
            headerShown: true,
            headerTitle: () => (
              <Header
                navigation={navigation}
                title={"Qr Code Scanner"}
                isBack={false}
              />
            ),
          };
        }}
      />
      <Stack.Screen
        name={navigationStrings.ASSIGNORDER}
        component={AssignOrders}
        options={({ navigation }) => {
          console.log("nav", navigation);
          return {
            headerShown: true,
            headerTitle: () => (
              <Header
                navigation={navigation}
                title={"Assign Orders"}
                isBack={false}
              />
            ),
          };
        }}
      />
    </>
  );
};

export default MainStack;
