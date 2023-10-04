import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

function ConfirmPickedUp({
  modalVisible,
  setModalVisible,
  selectedItems,
  pikedUpOrders,
}) {
  return (
    <View className="flex-1 items-center justify-center ">
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View className="flex-1 justify-center  items-center bg-black/50 px-5">
          {/* <Image /> */}
          <View className="bg-white w-full rounded-lg py-4 justify-center">
            <View className=" flex-row justify-center py-3">
              <FontAwesome5 name="truck-loading" size={40} color="#444262" />
            </View>
            <Text className="text-center text-base px-5 leading-6 font-light">
              Please confirm you have picked
              <Text className="font-semibold">
                {" "}
                {selectedItems?.length}
              </Text>{" "}
              Orders
            </Text>

            <View className="flex-row gap-3 justify-center mt-2 px-5">
              <TouchableOpacity
                className="border border-[#444262] flex-1 py-2 rounded-lg"
                onPress={() => {
                  setModalVisible(false);
                }}
              >
                <Text className="font-semibold text-[#444262] text-center">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-[#444262] flex-1 py-2 rounded-lg"
                onPress={pikedUpOrders}
              >
                <Text className="text-white font-semibold text-center">
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  openButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
});

export default ConfirmPickedUp;
