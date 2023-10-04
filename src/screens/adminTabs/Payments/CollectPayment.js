import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import React from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const CollectPayment = ({ navigation, route }) => {

  const { avatar, userName, phoneNumber, pendingBalance } = route.params.item;
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, paddingBottom: 20 }}
    >
      <ScrollView
        contentContainerStyle={{ alignItems: "center" }}
        className="flex-1  p-4  "
      >
        <View className="bg-orange-50 flex-1  rounded-md py-8 self-center w-full  ">
          <View className="w-32 h-32 mx-auto rounded-full">
            <Image source={{ uri: avatar }} className="flex-1" />
          </View>
          <View className="px-4 ">
            <View className="flex-row  mt-4 rounded-md bg-white shadow-lg shadow-black py-3 px-4">
              <FontAwesome name={"user"} size={25} color="#444262" />
              <Text className=" text-base font-bold pl-4">{userName}</Text>
            </View>
          </View>
          <View className="px-4 ">
            <View className="flex-row  mt-4 rounded-md bg-white shadow-lg shadow-black py-3 px-4">
              <FontAwesome name={"phone"} size={25} color="#444262" />
              <Text className=" text-base font-bold pl-4">{phoneNumber}</Text>
            </View>
          </View>
          <View className="px-4 ">
            <View className="flex-row  mt-4 rounded-md bg-white shadow-lg shadow-black py-3 px-4">
              <FontAwesome name={"rupee"} size={25} color="#444262" />
              <Text className=" text-base font-bold pl-4 text-green-500">
                {pendingBalance}
              </Text>
            </View>
          </View>
          <View className="px-4 ">
            <View className="flex-row  mt-4 rounded-md bg-white shadow-lg shadow-black py-3 px-4">
              <FontAwesome name={"rupee"} size={25} color="#444262" />
              <TextInput
                placeholder="Enter  the Amount"
                className="px-4"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View className=" flex-row gap-3 px-4 mt-4">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="border border-[#444262] flex-1 py-3 rounded-md"
            >
              <Text className="text-[#444262] font-semibold text-center">
                Collected
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-[#444262] flex-1 py-3 rounded-md">
              <Text className="text-white font-semibold text-center">
                Collected
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CollectPayment;
