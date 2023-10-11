import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  Platform,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as Location from "expo-location";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import Octicons from "react-native-vector-icons/Octicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import imageConstant from "../../../constant/imageConstant";
import { useSelector } from "react-redux";
import navigationStrings from "../../../constant/navigationStrings";
import { showMessage } from "react-native-flash-message";
import LoadingModal from "../../../components/LoadingModal";
import EditOrder from "../../../components/EditOrder";

const OrderDetails = ({ navigation, route }) => {
  const { item } = route.params;
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.token);
  const [modalVisible, setModalVisible] = useState(false);
  const [amount, setAmount] = useState();
  const [payDeliveryCostState, setPayDeliveryCostState] = useState();
  const [edit, setEdit] = useState();

  const payDeliveryCosts = async () => {
    console.log(payDeliveryCostState, "Delivery Payments", user);
    await payDeliveryPerson({
      body: { amount: payDeliveryCostState, userId: itmen._id },
      token,
    });
    setModalVisible(false);
  };

  const Collect = async () => {
    setModalVisible(false);
    const res = await collectMonyFromDelivery({
      body: {
        deliveryBoyId: item._id,
        amountRecived: amount,
      },
      token,
    });
    if (res.data) {
      showMessage({
        message: `collected ${amount} from ${item.itemName} .`,
        type: "success",
      });
    } else {
      showMessage({ message: `something went wrong`, type: "danger" });
    }
    getAllDeliveryBoysList();
  };

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, paddingBottom: 20 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 bg-white   px-2  py-4">
            <ScrollView
              className="flex-1 bg-[#F4F4FB] rounded-xl px-4"
              style={{ elevation: 10 }}
              contentContainerStyle={{
                justifyContent: "space-between",
                flex: 1,
              }}
            >
              <View className="flex-1 f-full justify-between">
                <View className=" ">
                  <Image
                    source={imageConstant.invoice}
                    className="w-20 h-20 self-center mt-4"
                    style={{ tintColor: "#444262" }}
                  />
                  <Text className="text-center text-2xl font-light border-b my-2 pb-2">
                    * Mahaveer Ghr Sansar *
                  </Text>
                  <View className="flex-row mt-3 px-4 py-3 rounded-md border items-end">
                    <FontAwesome name={"user"} size={25} color="#444262" />
                    <View className="border border-slate-500 ml-3  h-full" />
                    <Text className=" ml-4 font-medium text-gray-600">
                      {item.name}
                    </Text>
                  </View>
                  <View className="flex-row mt-3 px-4 py-3 rounded-md border items-end">
                    <FontAwesome5 name={"phone"} size={25} color="#444262" />
                    <View className="border border-slate-500 ml-3  h-full" />
                    <Text className=" ml-4 font-medium text-gray-600">
                      {item.mobile}
                    </Text>
                  </View>
                  <View className="flex-row mt-3 px-4 py-3 rounded-md border items-end">
                    <Octicons name={"home"} size={25} color="#444262" />
                    <View className="border border-slate-500 ml-3  h-full" />
                    <Text className=" ml-4 font-medium text-gray-600">
                      {item.address}
                    </Text>
                  </View>

                  <View className="flex-row gap-3 mt-1">
                    <View className="flex-row flex-1 mt-3 px-4 py-3 rounded-md border items-end">
                      <Entypo name={"clipboard"} size={25} color="#444262" />
                      <View className="border border-slate-500 ml-3  h-full" />
                      <Text className=" ml-4 font-medium text-gray-600">
                        {item.billNo}
                      </Text>
                    </View>

                    <View className="flex-row flex-1 mt-3 px-4 py-3 rounded-md border items-end">
                      <FontAwesome5
                        name={"shopping-bag"}
                        size={25}
                        color="#444262"
                      />
                      <View className="border border-slate-500 ml-3  h-full" />
                      <Text className=" ml-4 font-medium text-gray-600">
                        {item.totalBags}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row gap-2 mt-2">
                    <View className="flex-row flex-1 mt-3 px-4 py-3 rounded-md border items-center  ">
                      <FontAwesome5
                        name={"rupee-sign"}
                        size={25}
                        color="#FF7754"
                      />
                      <View className="border border-slate-500 ml-3  h-full" />
                      <Text className=" ml-4 font-medium text-gray-600">
                        {item.totalAmount ? item.totalAmount : "-"}
                      </Text>
                    </View>
                  </View>
                  {item?.userId?.userName && (
                    <View className="flex-row gap-3 mt-1">
                      <View className="flex-row flex-1 mt-3 px-4 py-3 rounded-md border items-center  ">
                        <MaterialIcons
                          name={"delivery-dining"}
                          size={25}
                          color="#FF7754"
                        />
                        <View className="border border-slate-500 ml-3  h-full" />
                        <Text className=" ml-4 font-medium text-gray-600">
                          {item?.userId?.userName}
                        </Text>
                      </View>
                    </View>
                  )}
                  {item.userId && (
                    <View className="flex-row gap-3 mt-1">
                      <View className="flex-row flex-1 mt-3 px-4 py-3 rounded-md border items-center  ">
                        <FontAwesome
                          name={"mobile-phone"}
                          size={25}
                          color="#FF7754"
                        />
                        <View className="border border-slate-500 ml-3  h-full" />
                        <Text className=" ml-4 font-medium text-gray-600">
                          {item?.userId?.phoneNumber}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
                {loading && <LoadingModal loading={loading} />}
                <View className=" mb-4">
                  <View className="flex flex-row gap-3">
                    <Pressable
                      onPress={() => setModalVisible(true)}
                      className="bg-[#444262] px-4 py-3 rounded-md mb-3  flex-1"
                    >
                      <Text className="text-center font-medium text-white">
                        Edit
                      </Text>
                    </Pressable>
                    {!item.dispatched && (
                      <Pressable
                        onPress={() => {
                          navigation.navigate(navigationStrings.ASSIGNORDER, [
                            item,
                          ]);
                        }}
                        className="bg-[#444262] px-4 py-3 rounded-md mb-3 flex-1"
                      >
                        <Text className="text-center font-medium text-white">
                          Assig Order
                        </Text>
                      </Pressable>
                    )}
                  </View>
                  <Pressable
                    onPress={() => navigation.goBack()}
                    className="bg-[#FF7754] px-4 py-3 rounded-md mb-3 "
                  >
                    <Text className="text-center font-medium text-white">
                      Back
                    </Text>
                  </Pressable>
                </View>
              </View>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {modalVisible && (
        <EditOrder
          setModalVisible={setModalVisible}
          modalVisible={modalVisible}
          edit={item}
          setLoading={setLoading}
          navigation={navigation}
          // getOrders={getOrders}
        />
      )}
    </>
  );
};

export default OrderDetails;

const styles = StyleSheet.create({});
