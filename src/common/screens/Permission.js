import { View, Text, StyleSheet, Button } from "react-native";
import React, { useState, useEffect } from "react";
import navigationStrings from "../../constant/navigationStrings";
import { BarCodeScanner, BarCodeScannerResult } from "expo-barcode-scanner";
const Permission = (props) => {
  const { navigation } = props;
  const [hasPermission, setHasPermission] = useState(false);
  useEffect(() => {
    askForCameraPermission();
  });
  const askForCameraPermission = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status == "granted");
    if (status == "granted") {
      navigation.navigate(navigationStrings.SCANQRCODESCREEN);
    }
  };
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting for camera permission</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={{ margin: 10 }}>No access to camera</Text>
        <Button onPress={() => askForCameraPermission()} title="Test">
          Allow Camera
        </Button>
      </View>
    );
  }
  return (
    <View>
      <Text>Permission</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
    padding: 8,
  },
  textStyle: {
    color: "#000",
    fontSize: 20,
  },
});
export default Permission;
