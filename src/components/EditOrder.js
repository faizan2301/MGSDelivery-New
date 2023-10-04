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
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useEditOrderInfoMutation } from "../redux/api/api";
import { useSelector } from "react-redux";
import { showMessage } from "react-native-flash-message";

function EditOrder({ modalVisible, setModalVisible, edit ,setLoading ,navigation}) {

  const { name, mobile, address } = edit;
  const [newData, setNewData] = useState({ name, mobile, address  });
  const { token } = useSelector(state => state.token);


  const [editInfo] = useEditOrderInfoMutation()
  const EditOrderDetails = async () =>{
    setModalVisible(false)
    setLoading(true)

    const response = await editInfo({body : {
        id: edit._id,
        newAddress : newData.address,
        newPhoneNumber : newData.mobile
    } , token})
    setLoading(false)
    if(response.data){
        showMessage({message :"Information edited successfull" , type:"success"})
    }else{
        showMessage({message :"Something went wrong" , type:"danger"})
    
    }
    navigation.goBack()
 

  }
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
            <View className=" flex-row justify-center my-3">
              <FontAwesome5 name="user-edit" size={50} color="#444262" />
            </View>
            <View className="px-4">
              <View className="flex-row mt-3 px-4 py-3 rounded-md border items-end">
                <FontAwesome name={"user"} size={25} color="#FF7754" />
                <View className="border border-slate-500 ml-3  h-full" />
                <Text className=" ml-4 font-medium text-gray-600">{newData?.name}</Text>
              </View>
              <View className="flex-row mt-3 px-4 py-3 rounded-md border items-end bg-slate-100 focus:border-2 focus:border-orange-400">
                <FontAwesome5 name={"phone"} size={20} color="#FF7754" />
                <View className="border border-slate-500 ml-3  h-full" />
                <TextInput
                  className="px-3 "
                  keyboardType="text"
                  placeholder="Enter the new Phone number"
                  value={`${newData.mobile}`}
                  onChangeText={text =>
                    setNewData({ ...newData, mobile: text })
                  }
                />
              </View>
              <View className="flex-row mt-3 px-4 py-3 rounded-md border items-end bg-slate-100 focus:border-2 focus:border-orange-400">
                <View className=" my-auto">
                  <Ionicons name={"location"} size={25} color="#FF7754" />
                </View>
                <View className="border border-slate-500 ml-3  h-full" />
                <TextInput
                  className="px-3 overflow-auto flex-1"
                  multiline={true}
                  placeholder="Enter the new Phone number"
                  value={`${newData.address}`}
                  onChangeText={text =>
                    setNewData({ ...newData, address: text })
                  }
                />
              </View>
            </View>
            <View className="flex-row gap-3 justify-center mt-2 px-5">
              <TouchableOpacity
                className="border border-[#444262] flex-1 py-4 rounded-lg"
                onPress={() => {
                  setModalVisible(false);
                }}
              >
                <Text className="font-semibold text-[#444262] text-center">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-[#444262] flex-1 py-4 rounded-lg"
                onPress={EditOrderDetails}
              >
                <Text className="text-white font-semibold text-center">
                  Edit
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

export default EditOrder;
