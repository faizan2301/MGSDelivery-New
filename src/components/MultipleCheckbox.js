import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Checkbox } from "react-native-paper";
import Permissions from "react-native-permissions";
import * as Location from "expo-location";
import { BarCodeScanner } from "expo-barcode-scanner";
import {
  requestUserPermission,
  creatingChannel,
} from "../helper/NotificationService";
function MultipleCheckboxes({ selectedCheckboxes, onCheckboxChange, labels }) {
  const [checkboxes, setCheckboxes] = useState(
    labels.map((label) => ({ label, checked: false }))
  );

  const handleCheckboxToggle = async (index) => {
    const updatedCheckboxes = [...checkboxes];
    updatedCheckboxes[index].checked = !updatedCheckboxes[index].checked;

    const checkbox = updatedCheckboxes[index];

    if (checkbox.label === "Permission for location" && checkbox.checked) {
      console.log(checkbox.label, checkbox.checked);
      try {
        Location.requestForegroundPermissionsAsync()
          .then(({ status }) => {
            // Handle the status
            console.log("Loaction status", status);
            if (status != "denied") {
              setCheckboxes(updatedCheckboxes);
              onCheckboxChange(checkbox.label, checkbox.checked);
            }
          })
          .catch((error) => {
            console.error("Error requesting location permissions:", error);
          });
      } catch (error) {
        console.log(error);
      }
    } else if (checkbox.label === "Permission for camera" && checkbox.checked) {
      try {
        const result = await Permissions.check("android.permission.CAMERA");
        if (result === "granted") {
          setCheckboxes(updatedCheckboxes);
          onCheckboxChange(checkbox.label, checkbox.checked);
        } else {
          const { status } = await BarCodeScanner.requestPermissionsAsync();
          if (status == "granted") {
            setCheckboxes(updatedCheckboxes);
            onCheckboxChange(checkbox.label, checkbox.checked);
          } else {
            console.log("Else camera denied");
          }
        }
      } catch (error) {
        console.log(error);
      }
      console.log("camera" + checkbox.label, checkbox.checked);
    } else if (
      checkbox.label === "Permission for notification" &&
      checkbox.checked
    ) {
      console.log("notification" + checkbox.label, checkbox.checked);
      try {
        requestUserPermission().then((value) => {
          if (value) {
            creatingChannel();
            setCheckboxes(updatedCheckboxes);
            onCheckboxChange(checkbox.label, checkbox.checked);
          } else {
            console.log("Else notification");
          }
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Else block");
      // setCheckboxes(updatedCheckboxes);
      // onCheckboxChange(checkbox.label, !checkbox.checked);
    }
  };

  return (
    <View style={styles.container}>
      {checkboxes.map((checkbox, index) => (
        <View key={index} style={styles.checkboxContainer}>
          <Checkbox.Android
            status={checkbox.checked ? "checked" : "unchecked"}
            onPress={() => handleCheckboxToggle(index)}
          />
          <Text className="text-black text-lg">{checkbox.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
});

export default MultipleCheckboxes;
