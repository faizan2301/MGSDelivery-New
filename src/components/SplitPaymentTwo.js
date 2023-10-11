import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from "react-native";


function SplitPaymentModalTwo({ splitPaymentModalTwo, setSplitPaymentModalTwo, setPaymentMethodTwo,setPaymentTwo }) {

  return (
    <View className="flex-1 items-center justify-center ">
      <Modal
        animationType="slide"
        transparent={true}
        visible={splitPaymentModalTwo}
        onRequestClose={() => {
        }}
      >
        <View className="flex-1  bg-black/50">
          {/* <Image /> */}
          {<View className={`bg-white w-full absolute bottom-0
           rounded-lg py-4 justify-center border duration-500`}>
            <Text className="text-xl font-light text-center text-[#444262]">
              Split Payment options 2
            </Text>
            <View className=" px-5">
              <TouchableOpacity
                onPress={() => {
                  setPaymentMethodTwo("UPI");
                  setSplitPaymentModalTwo(false);
                }}
                className="py-2 border-b px-3 border-slate-500"
              >
                <Text className="font-light text-base text-slate-700 ">
                  UPI
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setPaymentMethodTwo("Card");
                  setSplitPaymentModalTwo(false);
                }}
                className="py-2 border-b px-3 border-slate-500"
              >
                <Text className="font-light text-base text-slate-700 ">
                  Card
                </Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row gap-3 justify-center mt-4 px-5">
              <TouchableOpacity
                className="border border-[#444262] flex-1 py-2 rounded-lg"
                onPress={() => setSplitPaymentModalTwo(false)}
              >
                <Text className="font-semibold text-[#444262] text-center">
                  Cancel
                </Text>
              </TouchableOpacity>

            </View>
          </View>}
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

export default SplitPaymentModalTwo;
