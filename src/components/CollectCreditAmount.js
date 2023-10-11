import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useCollectCreditAmountMutation } from "../redux/api/api";
import { useSelector } from "react-redux";
import { showMessage } from "react-native-flash-message";
function CollectCreditAmount({
  modalVisible,
  setModalVisible,
  item,
  navigation,
}) {
  const [collectedAmount, setCollectedAmount] = useState();
  const { token } = useSelector((state) => state.token);
  const [collectAmount, { data, isError, isLoading, isSuccess, error }] =
    useCollectCreditAmountMutation();
  useEffect(() => {
    console.log("item", item);
  }, [0]);
  const collectAmountCall = async () => {
    if (collectedAmount) {
      if (collectedAmount > item.creditAmount) {
        setModalVisible(false);
        showMessage({
          message: "Collect amount can't be greater than credited amount",
          type: "warning",
        });
      } else {
        var body = {
          customerId: item.customerId,
          amountRecived: collectedAmount,
        };
        var args = { body, token };
        var response = await collectAmount(args);
        console.log(response);
        if (response?.data?.success) {
          setModalVisible(false);
          navigation.goBack();
        } else {
          setModalVisible(false);
          const errorMessage =
            response?.error?.data?.message || "Something went wrong";
          showMessage({
            message: errorMessage,
            type: "danger",
          });
        }
      }
    } else {
      setModalVisible(false);
      showMessage({
        message: "Please enter amount to be collected.",
        type: "warning",
      });
    }
  };
  return (
    <View className="flex-1  ">
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
        style={{ zIndex: 1000, alignSelf: "center", flex: 1 }}
      >
        <View className="flex-1 bg-black/50 ">
          {/* <Image /> */}
          <View className="bg-white w-full absolute bottom-0 rounded-lg pb-2 justify-center">
            <View className=" rounded-md pb-2 self-center w-full  ">
              <View className="flex-row items-center  px-4 py-2">
                <View className="pl-3">
                  <Text className=" text-base font-bold pl-4  mt-2">
                    {item?.customer}
                  </Text>
                  <View className="flex-row  pl-2 shadow-black items-center">
                    <FontAwesome name={"phone"} size={18} color="#444262" />
                    <Text className=" text-sm font-semibold pl-1">
                      {item?.mobile}
                    </Text>
                  </View>
                  <View className="flex-row  pl-2 shadow-black items-center">
                    <Text className=" text-sm font-semibold pl-1">
                      Credit Amount : {item?.creditAmount}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="px-4 ">
                {
                  <View className="flex-row  mt-4 rounded-md bg-white shadow-lg shadow-black py-3 px-4">
                    <FontAwesome name={"rupee"} size={25} color="#444262" />
                    <TextInput
                      placeholder="Enter the amount"
                      className="px-4"
                      keyboardType="numeric"
                      onChangeText={(text) => setCollectedAmount(text)}
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
                <TouchableOpacity
                  onPress={collectAmountCall}
                  className="bg-[#444262] flex-1 py-3 rounded-md"
                >
                  <Text className="text-white font-semibold text-center">
                    Collected
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default CollectCreditAmount;
