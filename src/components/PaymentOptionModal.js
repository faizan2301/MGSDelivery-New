import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";

function PaymentOptionModal({ openList, setOpenList, setPaymentMethod ,setCreditTo}) {
  const [credit, setCredit] = useState(false);
  return (
    <View className="flex-1 items-center justify-center ">
      <Modal
        animationType="slide"
        transparent={true}
        visible={openList}
        // visible={true}
        onRequestClose={() => {
          //   setModalVisible(false);
        }}
      >
        <View className="flex-1  bg-black/50">
          {/* <Image /> */}
          <View className={`bg-white w-full h-80 absolute bottom-0
           rounded-lg py-4 justify-center border duration-500 ${credit ? "hidden" : ""}  `}>
            <Text className="text-xl font-light text-center text-[#444262]">
              Payment Options
            </Text>
            <View className=" px-5">
              <TouchableOpacity
                onPress={() => {
                  setCreditTo("")
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
                  setCreditTo("")
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
                  setCreditTo("")
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
                  setPaymentMethod("Credit");
                  setCredit(true);
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
          <View className={`bg-white w-full absolute bottom-0 justify-between rounded-lg py-4  duration-500 px-3  ${!credit ? "hidden" : "h-52"}`}>
          <Text className="text-xl font-light text-center text-[#444262]">Credit</Text>
         
         
         <Text className=" text-lg font-light text-center text-[#444262]">Make a request for Credit Approval</Text>
            <View className="flex-row gap-3">
            <TouchableOpacity onPress={()=> setCredit(false) } className="mt-4 flex-1 bg-[#FF7754] mx-auto py-4 px-10  rounded-md">
              <Text className="text-center text-white font-medium ">
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> {setCredit(false)
            setCreditTo("Request")
            setOpenList(false)
            } } className="mt-4 flex-1 border border-[#444262] mx-auto py-4 px-10  rounded-md">
              <Text className="text-center text-[#444262] font-medium ">
                Request
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

export default PaymentOptionModal;
