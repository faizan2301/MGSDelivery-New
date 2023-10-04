/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import navigationStrings from '../constant/navigationStrings';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {AdminHomeScreen, AdminProfileScreen, AdminTransaction, Payments} from '../screens';
import Header from '../components/Header';
const Tab = createBottomTabNavigator();
const AdminTabRoutes = () => {
  return (
    <Tab.Navigator
      initialRouteName={navigationStrings.DELIVERYHOMESCREEN}
      screenOptions={{
        tabBarActiveTintColor: '#444262',
        headerShown: true,
        headerShadowVisible : true,
        headerStyle: {
          elevation: 10, // Add elevation for Android
          shadowColor: 'rgba(0, 0, 0, 0.8)', // Shadow color for iOS
          shadowOffset: { width: 0, height: 4 }, // Shadow offset for iOS
          shadowOpacity: 1, // Shadow opacity for iOS
          shadowRadius: 10, // Shadow radius for iOS
        }
        
      }}>
      <Tab.Screen
        name={navigationStrings.ADMINHOMESCREEN}
        component={AdminHomeScreen}
        
        options={({navigation}) => {
          return {
            headerTitle: () => (
              <Header navigation={navigation} title={'Home'} isBack={false} />
            ),
            tabBarLabel: 'Home',
            tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons name="home" color={color} size={size} />
            ),
            headerTitleAlign:"center",
          };
        }}
      />
      <Tab.Screen
        name={navigationStrings.ADMINPAYMENT}
        component={Payments}
        options={({navigation}) => {
          return {
            headerTitle: () => (
              <Header navigation={navigation} title={'Payment'} isBack={false} />
            ),
            tabBarLabel: 'Payment',
            headerTitleAlign:"center",
            tabBarIcon: ({color, size}) => (
              <FontAwesome
              name="rupee"
              color={color}
              size={size}
            />
            ),
          };
        }}
      />
      <Tab.Screen
        name={navigationStrings.ADMINTRANSACTIONSCREEN}
        component={AdminTransaction}
        options={({navigation}) => {
          return {
            headerTitle: () => (
              <Header navigation={navigation} title={'Transaction'} isBack={false} />
            ),
            tabBarLabel: 'History',
            headerTitleAlign:"center",
            tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons
              name="history"
              color={color}
              size={size}
            />
            ),
          };
        }}
      />
      
      <Tab.Screen
        name={navigationStrings.ADMINPROFILESCREEN}
        component={AdminProfileScreen}
        options={({navigation}) => {
          return {
            headerTitle: () => (
              <Header navigation={navigation} title={'Profile'} isBack={false} />
            ),
            tabBarLabel: 'Profile',
            headerTitleAlign:"center",
            tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons
                name="account"
                color={color}
                size={size}
              />
            ),
          };
        }}
      />
    </Tab.Navigator>
  );
};

export default AdminTabRoutes;
