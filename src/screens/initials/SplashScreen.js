/* eslint-disable react-hooks/exhaustive-deps */
import { Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import LottieView from "lottie-react-native";
import imageConstant from "../../constant/imageConstant";
import navigationStrings from "../../constant/navigationStrings";
import Permissions from "react-native-permissions";
import { useDispatch, useSelector } from "react-redux";
import { savePermission } from "../../redux/slice/cameraPermissionSlice";
import { getCredentials, getToken } from "../../common/AsyncStorageFunctions";
import { saveToken } from "../../redux/slice/tokenSlice";
import { saveUserData } from "../../redux/slice/authSlice";
import { useMeMutation } from "../../redux/api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from 'expo-location';
const SplashScreen = props => {
  const { navigation } = props;
  const [token, setToken] = useState();
  const dispatch = useDispatch();
  const [me] = useMeMutation();


  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("token");
      return value;
    } catch (e) {
      // error reading value
    }
  };


  useEffect(() => {
    const fetchDataAndNavigate = async () => {
      try {
        const result = await Permissions.check("android.permission.CAMERA");
        if (result === "granted") {
          dispatch(savePermission(true));
        }

        // let { status } = await Location.requestForegroundPermissionsAsync();
        
        // console.log(status,"Spalsh ")
        // if (status !== 'granted') {
        //   setErrorMsg('Permission to access location was denied');
        //   return;
        // }else{
        //   console.log(status , "location status")
        // }
        Location.requestForegroundPermissionsAsync()
  .then(({ status }) => {
    // Handle the status
    console.log("Loaction status" , status)
  })
  .catch(error => {
    console.error('Error requesting location permissions:', error);
  });
        navigate(); // After fetching data and checking permissions, navigate
      } catch (error) {
        console.error(error);
      }
    };

    fetchDataAndNavigate(); // Call the async function

    const interval = setInterval(() => {
      clearInterval(interval);
    }, 5000);

    // Return a cleanup function to clear the interval when the component unmounts
    return () => {
      clearInterval(interval);
    };
  }, []); // Pass an empty dependency array to run this effect only once when the component mounts

  const navigate = async () => {

    const token = await getData();
    if (token) {
      dispatch(saveToken(token));
      const res = await me(token);
      if (res.data) {
        dispatch(saveUserData(res.data.data));
        if (res.data.data.role === "Admin") {
          navigation.replace(navigationStrings.ADMINBOTTOMTAB);
        } else {
          navigation.replace(navigationStrings.DELIVEYBOTTOMTAB);
        }
      }

      if (res.error) {
        navigation.replace(navigationStrings.LOGINSCREEN);
      }
    } else {
      navigation.replace(navigationStrings.LOGINSCREEN);
    }
    // const aToken = await getToken();
    // console.log(aToken)
    // aToken
    // ? navigation.replace(navigationStrings.ADMINBOTTOMTAB)
    // :
  };
  return (
    <View className="flex-1 bg-white items-center justify-center p-1">
      <LottieView
        source={imageConstant.splash}
        autoPlay
        loop
        className="h-56 w-full"
      />
      <Text className="text-black text-3xl font-bold">MGSDelivery app</Text>
    </View>
  );
};

export default SplashScreen;
