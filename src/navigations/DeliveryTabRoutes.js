/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import navigationStrings from '../constant/navigationStrings';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DeliveryHomeScreen, DeliveryProfileScreen, TransactionHistory} from '../screens';
import Header from '../components/Header';
const Tab = createBottomTabNavigator();
const DeliveryTabRoutes = () => {
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
      }}
      
      >
      <Tab.Screen
        name={navigationStrings.DELIVERYHOMESCREEN}
        component={DeliveryHomeScreen}
        options={({navigation}) => {
          return {
            // headerLeft: () => <HeaderLeft navigation={navigation} />,
            headerTitle: () => (
              <Header navigation={navigation} title={'My Orders'} isBack={false} />
            ),
            tabBarLabel: 'Home',
            tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons name="home" color={color} size={size} />
            ),
            headerTitleAlign:"center",
            
            
            //headerRight: () => <HeaderRight navigation={navigation} />,
          };
        }}
      />
      <Tab.Screen
        name={navigationStrings.DELIVERYTRANSACTIONHISTORYSCREEN}
        component={TransactionHistory}
        options={({navigation}) => {
          return {
            // headerLeft: () => <HeaderLeft navigation={navigation} />,
            headerTitle: () => (
              <Header navigation={navigation} title={'Transactions'} isBack={false} />
            ),
            tabBarLabel: 'Transactions',
            headerTitleAlign:"center",
            tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons
                name="history"
                color={color}
                size={size}
              />
            ),
            //headerRight: () => <HeaderRight navigation={navigation} />,
          };
        }}
      />
      <Tab.Screen
        name={navigationStrings.DELIVERYPROFILESCREEN}
        component={DeliveryProfileScreen}
        options={({navigation}) => {
          return {
            // headerLeft: () => <HeaderLeft navigation={navigation} />,
            headerTitle: () => (
              <Header navigation={navigation} title={'Profile'} isBack={false} />
            ),
            tabBarLabel: 'Profile',
            tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons
                name="account"
                color={color}
                size={size}
              />
            ),
            //headerRight: () => <HeaderRight navigation={navigation} />,
          };
        }}
      />
    </Tab.Navigator>
  );
};

export default DeliveryTabRoutes;
