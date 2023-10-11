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
import MyCredits from "../screens/adminTabs/Credit/MyCredits";
import ApprveCredit from "../screens/adminTabs/Credit/CreditOrderDetails";
import CreditAuthorizedAdmin from "./../screens/deliveryTabs/Deliver/CreditAuthorizedAdmin";
import Customers from "../screens/customers/Customer";
import CustomerDetailsScreen from "../screens/customers/CustomerDetailsScreen";
import CustomerOrderDetails from "../screens/customers/CustomerOrderDetails";

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
        name={navigationStrings.ADMINMYCUSTOMER}
        component={Customers}
        options={({ navigation }) => {
          console.log("Customer");
          return {
            headerShown: true,
            headerTitle: () => (
              <Header
                navigation={navigation}
                title={"Customer"}
                isBack={false}
              />
            ),
          };
        }}
      />
      <Stack.Screen
        name={navigationStrings.ADMINMYCUSTOMERDETAILS}
        component={CustomerDetailsScreen}
        options={({ navigation }) => {
          console.log("Customer Details");
          return {
            headerShown: true,
            headerTitle: () => (
              <Header
                navigation={navigation}
                title={"Customer Orders"}
                isBack={false}
              />
            ),
          };
        }}
      />
      <Stack.Screen
        name={navigationStrings.ADMINMYCUSTOMERORDERDETAILS}
        component={CustomerOrderDetails}
        options={({ navigation }) => {
          console.log("Order Details");
          return {
            headerShown: true,
            headerTitle: () => (
              <Header
                navigation={navigation}
                title={"Order Details"}
                isBack={false}
              />
            ),
          };
        }}
      />
      <Stack.Screen
        name={navigationStrings.ADMINMYCREDITS}
        component={MyCredits}
        options={({ navigation }) => {
          console.log("nav Credit List");
          return {
            headerShown: true,
            headerTitle: () => (
              <Header
                navigation={navigation}
                title={"My Credits"}
                isBack={false}
              />
            ),
          };
        }}
      />
      <Stack.Screen
        name={navigationStrings.DELIVERYAPPROVECREDITYSCREEN}
        component={CreditAuthorizedAdmin}
        options={({ navigation }) => {
          console.log("Delivery Credit approve admins");
          return {
            headerShown: true,
            headerTitle: () => (
              <Header
                navigation={navigation}
                title={"Credit Approval"}
                isBack={false}
              />
            ),
          };
        }}
      />
      <Stack.Screen
        name={navigationStrings.ADMINAPPROVECREDIT}
        component={ApprveCredit}
        // options={({ navigation }) => {
        //   console.log("nav Approve Credit");
        //   // return {
        //   //   headerShown: true,
        //   //   // headerTitle: () => (
        //   //   //   <Header
        //   //   //     navigation={navigation}
        //   //   //     title={"Order"}
        //   //   //     isBack={false}
        //   //   //   />
        //   //   // ),
        //   // };
        // }}
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
