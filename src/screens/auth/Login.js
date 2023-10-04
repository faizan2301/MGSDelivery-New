import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput,
  View,
  Modal,
  ActivityIndicator,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import * as Animatable from "react-native-animatable";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import BackGround from "../../components/Background";
import LottieView from "lottie-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import imageConstant from "../../constant/imageConstant";

import navigationStrings from "../../constant/navigationStrings";
import { useLoginApiMutation, useMeMutation } from "../../redux/api/api";
import { showMessage } from "react-native-flash-message";
import { useDispatch } from "react-redux";
import { saveToken } from "../../redux/slice/tokenSlice";
import { saveUserData } from "../../redux/slice/authSlice";
import {
  saveCredentials,
  saveTokentoAsync,
} from "../../common/AsyncStorageFunctions";
import MultipleCheckboxes from "../../components/MultipleCheckbox";
const Login = (props) => {
  const { navigation } = props;
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mobileError, setMobileError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [focusedInput, setFocusedInput] = useState("");
  const [modalVal, setModalVal] = useState(false);
  const dispatch = useDispatch();
  const [login, { isError, error, isLoading }] = useLoginApiMutation();
  const [me] = useMeMutation();
  const bounceAniref = useRef();

  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [labels, setLabels] = useState([
    "Permission for location",
    "Permission for camera",
    "Permission for notification",
    // Add more labels as needed
  ]);
  const handleCheckboxChange = (label, checked) => {
    // Update the selected checkboxes array based on the checkbox label and checked state
    if (checked) {
      setSelectedCheckboxes([...selectedCheckboxes, label]);
    } else {
      setSelectedCheckboxes(
        selectedCheckboxes.filter((item) => item !== label)
      );
    }
  };
  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem("token", JSON.stringify(value));
    } catch (e) {
      // saving error
      console.log(e, "async storage error");
    }
  };

  const onLogin = () => {
    // Validate mobile number
    if (!/^\d{10}$/.test(mobileNumber)) {
      setMobileError("Please enter a valid 10-digit mobile number");
      animate();
      return;
    }

    // Validate password
    if (password.length < 4) {
      setPasswordError("Password must be at least 4 characters long");
      animate();
      return;
    }
    console.log("lenght", selectedCheckboxes.length);
    if (selectedCheckboxes.length < 2) {
      showMessage({
        message: "Please grant all the permissions",
        type: "warning",
      });
      return;
    }
    setModalVal(true);
    loginWithMobileandPassword();
  };

  const loginWithMobileandPassword = async () => {
    const fcmToken = await AsyncStorage.getItem("fcmToken");
    var body = { phoneNumber: mobileNumber, password, fcmToken };
    var response = await login(body);
    setModalVal(false);
    if (response?.data?.access_token) {
      await storeData(response.data.access_token);
      dispatch(saveToken(response.data.access_token));
      dispatch(saveUserData(response.data.data));
      await saveCredentials(response.data.data);
      await saveTokentoAsync(response.data.access_token);
      if (response.data.data.role === "Admin") {
        navigation.replace(navigationStrings.ADMINBOTTOMTAB);
      } else {
        navigation.replace(navigationStrings.DELIVEYBOTTOMTAB);
      }
    } else if (response?.error?.data?.message) {
      showMessage({
        message: `${response?.error?.data?.message}`,
        type: "danger",
      });
    } else {
      console.log("Error", response.error.error);
      showMessage({
        message: `${response?.error?.error}`,
        type: "danger",
      });
    }
  };

  const animate = () => {
    bounceAniref.current.shake(800);
  };
  return (
    <BackGround>
      <Modal
        transparent={true}
        animationType={"none"}
        visible={modalVal}
        style={{ zIndex: 1100 }}
        onRequestClose={() => {}}
      >
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            {/* <ActivityIndicator animating={true} color="black" /> */}
            <LottieView
              style={styles.lottieStyle}
              source={imageConstant.lottieLoader}
              autoPlay
              loop
            />
          </View>
        </View>
      </Modal>
      <Text className="text-black text-xl  mb-2">Mobile number</Text>
      <TextInput
        style={[
          styles.input,
          focusedInput === "mobile" && styles.inputFocused,
          mobileError && styles.inputError,
        ]}
        placeholder="Mobile Number"
        keyboardType="numeric"
        maxLength={10}
        value={mobileNumber}
        onFocus={() => setFocusedInput("mobile")}
        onBlur={() => setFocusedInput("")}
        onChangeText={(text) => {
          setMobileNumber(text);
          setMobileError("");
        }}
      />
      {mobileError ? <Text style={styles.errorText}>{mobileError}</Text> : null}
      <Text className="text-black text-xl my-2">Password</Text>
      <View
        style={[
          styles.input,
          focusedInput === "password" && styles.inputFocused,
          passwordError && styles.inputError,
        ]}
      >
        <TextInput
          style={styles.password}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onFocus={() => setFocusedInput("password")}
          onBlur={() => setFocusedInput("")}
          onChangeText={(text) => {
            setPassword(text);
            setPasswordError("");
          }}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          className="self-center"
        >
          <MaterialIcons
            name={showPassword ? "visibility" : "visibility-off"}
            size={24}
            color="gray"
          />
        </TouchableOpacity>
      </View>
      {passwordError ? (
        <Text style={styles.errorText}>{passwordError}</Text>
      ) : null}

      <MultipleCheckboxes
        selectedCheckboxes={selectedCheckboxes}
        onCheckboxChange={handleCheckboxChange}
        labels={labels}
      />
      <Animatable.View ref={bounceAniref}>
        <TouchableOpacity
          onPress={onLogin}
          className="w-full bg-[#444262] p-4 mt-6 rounded-lg items-center justify-center"
        >
          <Text className="text-[#fff] text-xl">Login</Text>
        </TouchableOpacity>
      </Animatable.View>
    </BackGround>
  );
};
const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    backgroundColor: "white",
  },

  container: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  input: {
    height: 50,
    fontSize: 18,
    borderColor: "gray",
    borderWidth: 2,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: "black",
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 8,
  },
  password: { color: "black", flex: 1, fontSize: 18 },
  inputFocused: {
    borderColor: "#00619A", // Change to your desired color
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  loginButtonContainer: {
    alignSelf: "center",
    width: "100%",
  },
  modalBackground: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-around",
    backgroundColor: "#rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
  },
  activityIndicatorWrapper: {
    backgroundColor: "white",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 200,
  },
  lottieStyle: { height: 200, width: 200, alignSelf: "center" },
});
export default Login;
