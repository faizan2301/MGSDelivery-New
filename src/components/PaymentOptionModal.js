import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
} from "react-native";
import navigationStrings from "../constant/navigationStrings";
import Entypo from "react-native-vector-icons/Entypo";

function PaymentOptionModal({
  item,
  navigation,
  openList,
  setOpenList,
  paymentMethod,
  setPaymentMethod,
}) {
  return (
    <View className="flex-1 items-center justify-center ">
      <Modal
        animationType="slide"
        transparent={true}
        visible={openList}
        onRequestClose={() => {}}
      >
        <View className="flex-1  bg-black/50">
          {/* <Image /> */}
          {
            <View
              className={`bg-white w-full absolute bottom-0
           rounded-lg py-4 justify-center border duration-500`}
            >
              <Text className="text-xl font-light text-center text-[#444262]">
                Payment Options
              </Text>
              <View className=" px-5">
                <TouchableOpacity
                  onPress={() => {
                    setPaymentMethod("UPI");
                    setOpenList(false);
                  }}
                  className="py-2 border-b px-3 border-slate-500"
                >
                  <Text className="font-light text-base text-slate-700 ">
                    UPI
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setPaymentMethod("Cash");
                    setOpenList(false);
                  }}
                  className="py-2 border-b px-3 border-slate-500"
                >
                  <Text className="font-light text-base text-slate-700 ">
                    Cash
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setPaymentMethod("Card");
                    setOpenList(false);
                  }}
                  className="py-2 border-b px-3 border-slate-500"
                >
                  <Text className="font-light text-base text-slate-700 ">
                    Card
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setPaymentMethod("Split");
                    // navigation.navigate(navigationStrings.DELIVERYAPPROVECREDITYSCREEN, { item })
                    setOpenList(false);
                  }}
                  className="py-2 border-b px-3 border-slate-500"
                >
                  <Text className="font-light text-base text-slate-700 ">
                    Split
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setPaymentMethod("Credit");
                    navigation.navigate(
                      navigationStrings.DELIVERYAPPROVECREDITYSCREEN,
                      { item }
                    );
                    // setOpenList(false)
                  }}
                  className="py-2 border-b px-3 border-slate-500"
                >
                  <Text className="font-light text-base text-slate-700 ">
                    Credit
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="flex-row gap-3 justify-center mt-4 px-5">
                <TouchableOpacity
                  className="border border-[#444262] flex-1 py-2 rounded-lg"
                  onPress={() => setOpenList(false)}
                >
                  <Text className="font-semibold text-[#444262] text-center">
                    Cancel
                  </Text>
                </TouchableOpacity>
                {/* <TouchableOpacity
            className="bg-[#00619A] flex-1 py-2 rounded-lg"

            >
              <Text className="text-white font-semibold text-center"></Text>
            </TouchableOpacity> */}
              </View>
            </View>
          }
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

export default PaymentOptionModal;
