import { Image, Keyboard, KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import React from 'react'
import imageConstant from '../../constant/imageConstant'
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Octicons from "react-native-vector-icons/Octicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const CustomerOrderDetails = ({route , navigation}) => {
    const {item} = route.params

    return (
        <>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1, paddingBottom: 2 }}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View className="flex-1 bg-white   px-2  pt-4 pb-2">
    
                <ScrollView className="flex-1 bg-[#F4F4FB] rounded-xl px-4" style={{ elevation: 10 }} contentContainerStyle={{ justifyContent: "space-between" , flex : 1}}>
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
                          {item.orderId.name}
                        </Text>
                      </View>
                      <View className="flex-row mt-3 px-4 py-3 rounded-md border items-end">
                        <FontAwesome5 name={"phone"} size={25} color="#444262" />
                        <View className="border border-slate-500 ml-3  h-full" />
                        <Text className=" ml-4 font-medium text-gray-600">
                          {item.orderId.mobile}
                        </Text>
                      </View>
                      <View className="flex-row mt-3 px-4 py-3 rounded-md border items-end">
                        <Octicons name={"home"} size={25} color="#444262" />
                        <View className="border border-slate-500 ml-3  h-full" />
                        <Text className=" ml-4 font-medium text-gray-600">
                          {item.orderId.address}
                        </Text>
                      </View>
    
                      <View className="flex-row gap-3 mt-1">
                        <View className="flex-row flex-1 mt-3 px-4 py-3 rounded-md border items-end">
                          <Entypo name={"clipboard"} size={25} color="#444262" />
                          <View className="border border-slate-500 ml-3  h-full" />
                          <Text className=" ml-4 font-medium text-gray-600">
                            {item.orderId.billNo}
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
                            {item.orderId.totalBags}
                          </Text>
                        </View>
                      </View>
                      <View className="flex-row gap-2 mt-2">
                        <View className="flex-row flex-1 mt-3 px-4 py-3 rounded-md border items-center  ">
                          <FontAwesome5 name={"rupee-sign"} size={25} color="#FF7754" />
                          <View className="border border-slate-500 ml-3  h-full" />
                          <Text className=" ml-4 font-medium text-gray-600">
                            {item.orderId.totalAmount ? item.orderId.totalAmount : "-"}
                          </Text>
                        </View>
                      </View>
                     
                      
                     
                    </View>
                    <View className=" mb-4">
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
    
         
    
    
        </>
      );
}

export default CustomerOrderDetails

const styles = StyleSheet.create({})