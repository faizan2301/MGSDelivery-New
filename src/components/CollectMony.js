import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

function CollectMony({ modalVisible, setModalVisible, user, setAmount, payDeliveryCosts, setPayDeliveryCostState, amount, Collect }) {
  const { userName, avatar, phoneNumber, pendingBalance, deliveryCost } = user;
  const [payAmount, setPayAmount] = useState(false)


  return (
    <View className="flex-1  ">
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View className="flex-1 bg-black/50 ">
          {/* <Image /> */}
          <View className="bg-white w-full absolute bottom-0 rounded-lg pb-2 justify-center">
            <View className=" rounded-md pb-2 self-center w-full  ">
              <View className="flex-row items-center  px-4 py-2">
                <View className="w-24 h-24  rounded-full">
                  <Image source={{ uri: avatar }} className="flex-1" />
                </View>
                <View className="pl-3">
                  <Text className=" text-base font-bold pl-4  mt-2">{userName}</Text>
                  <View className="flex-row  justify-center shadow-black items-center">
                    <FontAwesome name={"phone"} size={18} color="#444262" />
                    <Text className=" text-sm font-semibold pl-1">
                      {phoneNumber}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="px-4 flex-row gap-2">
                <TouchableOpacity onPress={() => setPayAmount(false)} className={`flex-row  mt-4 flex-1 rounded-md shadow-lg shadow-black border py-3 px-4 ${payAmount ? "border-[#444262] bg-white" : " bg-[#444262] text-white"}`}>
                  {/* <FontAwesome name={"rupee"} size={25} color="#444262" /> */}
                  <Text className={`text-base font-bold pl-4 ${payAmount ? " text-[#444262]" : "text-white "}`}>
                    Collect
                  </Text>
                  <Text className={`text-base font-bold pl-4 ${payAmount ? "  text-[#444262] bg-white" : "text-white"}`}>
                    {parseInt(pendingBalance)}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setPayAmount(true)} className={`flex-row  mt-4 flex-1 rounded-md shadow-lg shadow-black border py-3 px-4 ${payAmount ? "bg-[#444262] text-white" : "border-[#444262] bg-white"}`}>
                  {/* <FontAwesome name={"rupee"} size={25} color="#444262" /> */}
                  <Text className={` text-base font-bold pl-4 ${payAmount ? " text-white" : "text-[#444262]"}`}>
                    Pay
                  </Text>
                  <Text className={`text-base font-bold pl-4 ${payAmount ? " text-white" : "text-[#444262]"}`}>
                    {deliveryCost ? parseInt(deliveryCost) : "-"}
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="px-4 ">
                {payAmount ? <View className="flex-row  mt-4 rounded-md bg-white shadow-lg shadow-black py-3 px-4">
                  <FontAwesome name={"rupee"} size={25} color="#444262" />
                  <TextInput
                    placeholder="Pay Delivery Cost"
                    className="px-4"
                    keyboardType="numeric"
                    onChangeText={(text) => setPayDeliveryCostState(text)}
                  />
                </View> :
                  <View className="flex-row  mt-4 rounded-md bg-white shadow-lg shadow-black py-3 px-4">
                    <FontAwesome name={"rupee"} size={25} color="#444262" />
                    <TextInput
                      placeholder="Collect Amount from Delivery Person"
                      className="px-4"
                      keyboardType="numeric"
                      onChangeText={(text) => setAmount(text)}
                    />
                  </View>

                }
              </View>

              <View className=" flex-row gap-3 px-4 mt-4">
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  className="border border-[#444262] flex-1 py-3 rounded-md"
                >
                  <Text className="text-[#444262] font-semibold text-center">
                    Cancel
                  </Text>
                </TouchableOpacity>
                {payAmount ? <TouchableOpacity onPress={payDeliveryCosts} className="bg-[#444262] flex-1 py-3 rounded-md">
                  <Text className="text-white font-semibold text-center">
                    Pay
                  </Text>
                </TouchableOpacity> :
                  <TouchableOpacity onPress={Collect} className="bg-[#444262] flex-1 py-3 rounded-md">
                    <Text className="text-white font-semibold text-center">
                      Collected
                    </Text>
                  </TouchableOpacity>}
              </View>
            </View>
          </View>
        </View>


      </Modal>
    </View>
  );
}

export default CollectMony;
