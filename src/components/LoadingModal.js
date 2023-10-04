import {
  StyleSheet,
  View,
  Modal,
} from "react-native";
import React from 'react'
import imageConstant from '../constant/imageConstant'
import LottieView from "lottie-react-native";

const LoadingModal = ({ loading  }) => {
  return (
    <View  className="flex-1 items-center justify-center ">
    <Modal
        transparent={true}
        animationType={"none"}
        visible={loading}
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
      </View>
  )
}

export default LoadingModal

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