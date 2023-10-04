import { View, Text, StyleSheet, Vibration } from "react-native";
import React, { useState } from "react";
import QrCodeScanner from "../../../components/QrCodeScanner";
import { BarCodeScanner, BarCodeScannerResult } from "expo-barcode-scanner";
import { useScanOrderMutation } from "../../../redux/api/api";

import { showMessage, hideMessage } from "react-native-flash-message";
import { useSelector } from "react-redux";
const QrCodeScannerScreen = (props) => {
  const { navigation } = props;
  const [boundOrigin, setBoundOrigin] = useState({ x: 0, y: 0 });
  const [boundSize, setBoundSize] = useState({ x: 0, y: 0 });
  const [textValue, setTextValue] = useState("null");
  const [scanned, setScanned] = useState(false);
  const [scanOrder, { data, isError, error }] = useScanOrderMutation();
  const [scanProcess, setScanProcess] = useState("Scan now");
  const { token } = useSelector((state) => state.token);
  const fun = async (scanData) => {
    var body = {
      body: scanData,
      token,
    };
    var response = await scanOrder(body);
    console.log(response);
    if (response.data?.success) {
      Vibration.vibrate();
      showMessage({
        message: "Successfully added ",
        type: "success",
      });
    } else if (isError) {
      showMessage({
        message: error.data.message,
        type: "danger",
      });
    }
    setScanProcess("Scan now");

    setScanned(false);
  };
  const handleBarCodeScanned = (scanningResult) => {
    if (!scanned) {
      const { type, data, bounds } = scanningResult;
      console.log("Type" + type, "Data" + data);
      setScanProcess("Wait...");
      fun(data);
      // setTextValue(data);

      if (bounds) {
        setBoundOrigin({ x: bounds.origin.x, y: bounds.origin.y });
        setBoundSize({ width: bounds.size.width, height: bounds.size.height });
      }

      setScanned(true);

      setTimeout(() => {
        // setScanned(false);
      }, 1000);
    }
  };
  return (
    <View className="flex-1 bg-white">
      <Text className="text-black text-2xl">{scanProcess}</Text>
      <BarCodeScanner
        barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={[StyleSheet.absoluteFill, styles.scan]}
      ></BarCodeScanner>
      <QrCodeScanner
        cornerLength={30}
        color="blue"
        borderSize={5}
        radius={30}
        shape="corners"
        origin={boundOrigin}
        size={boundSize}
        borderOffSet={10}
      />
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
});
export default QrCodeScannerScreen;
