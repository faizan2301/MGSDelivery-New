"use strict";
import AsyncStorage from "@react-native-async-storage/async-storage";
export const saveCredentials = async (value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem("credentials", jsonValue);
    return true;
  } catch (e) {
    console.log(e.toString());
    return false;
  }
};
export const saveTokentoAsync = async (token) => {
  try {
    await AsyncStorage.setItem("token", token);
    return true;
  } catch (e) {
    console.log(e.toString());
    return false;
  }
};
export const saveRole = async (role) => {
  try {
    await AsyncStorage.setItem("role", role);
    return true;
  } catch (e) {
    console.log(e.toString());
    return false;
  }
};
export const getCredentials = async () => {
  try {
    const value = await AsyncStorage.getItem("credentials");
    if (value != null) {
      return JSON.parse(value);
    } else {
      return false;
    }
  } catch (e) {
    console.log(e.toString());
    return false;
  }
};
export const getToken = async () => {
  try {
    const value = await AsyncStorage.getItem("token");
    if (value != null) {
      return value;
    } else {
      return false;
    }
  } catch (e) {
    console.log(e.toString());
    return false;
  }
};
export const getRole = async () => {
  try {
    const value = await AsyncStorage.getItem("role");
    if (value != null) {
      return value;
    } else {
      return false;
    }
  } catch (e) {
    console.log(e.toString());
    return false;
  }
};
export const saveChildDetails = async (value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem("child", jsonValue);
    return true;
  } catch (e) {
    console.log(e.toString());
    return false;
  }
};
export const getChildDetails = async () => {
  try {
    const value = await AsyncStorage.getItem("child");
    if (value != null) {
      return JSON.parse(value);
    } else {
      return false;
    }
  } catch (e) {
    console.log(e.toString());
    return false;
  }
};
export const saveFirebaseToken = async (token) => {
  try {
    await AsyncStorage.setItem("firebase_token", token);
    return true;
  } catch (e) {
    console.log(e.toString());
    return false;
  }
};
export const getFirebaseToken = async () => {
  try {
    const value = await AsyncStorage.getItem("firebase_token");
    if (value != null) {
      return value;
    } else {
      return false;
    }
  } catch (e) {
    console.log(e.toString());
    return false;
  }
};
