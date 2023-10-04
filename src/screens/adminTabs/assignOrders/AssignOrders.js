import {
  Image,
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import {
  useAssignOrderApiMutation,
  useGetAllDeliveryBoysMutation,
} from "../../../redux/api/api";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { showMessage } from "react-native-flash-message";
import ConformDelivery from "../../../components/ConformDelivery";
import navigationStrings from "../../../constant/navigationStrings";
import LoadingModal from '../../../components/LoadingModal';

const AssignOrders = ({ route, navigation }) => {
  // console.log(route.params,">>>>>>>>>>>")
  const { token } = useSelector(state => state.token);
  const [deliveryEmploy, setDeliveryEmploy] = useState();
  const [getalldeliveryboys] = useGetAllDeliveryBoysMutation();
  const [assign] = useAssignOrderApiMutation();
  const [selectDelivery, setSlectDelivery] = useState();
  const [loading , setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false);
let orderArray = [];
  route.params?.forEach(element => {
    if(!element) return
    // array.push(element?._id)
    orderArray.push(element._id)
    // console.log(element._id ,">>>>>>>>>")
  });
  // console.log(array)

  const getAllDeliveryBoysList = async () => {
    const response = await getalldeliveryboys(token);
    if (response.data) {
      if (response.data.data) {
        setDeliveryEmploy(response.data.data);
      } else {
        showMessage({
          message: error.data.message,
          type: "danger",
        });
      }
    } else {
      showMessage({
        message: response.error.data.message,
        type: "danger",
      });
    }
  };

  useEffect(() => {
    getAllDeliveryBoysList();
  }, []);

  const conformDeliveryBoy = async () => {
    setModalVisible(false)
    setLoading(true)
    const res = await assign({
      body: { orderId: orderArray , userId: selectDelivery._id },
      token,
    });
    if(res.data){
      navigation.navigate(navigationStrings.ADMINHOMESCREEN)
      showMessage({
        message: res.data?.data,
        type: "success",
      });
    }else{
      showMessage({
        message: res.error.data.message,
        type: "danger",
      });
    }
  };

  const renderItem = ({ item }) => {
    if (!item) return;
    return (
      <>
        <Pressable
          onPress={() => {
            setSlectDelivery(item);
            setModalVisible(true);
          }}
          className="bg-white flex-row  items-center py-2 mt-2 rounded-lg px-3"
        >
          <Image source={{ uri: item?.avatar }} className="w-20 h-20" />
          <View className="px-3">
            <Text className="font-semibold">{item?.userName}</Text>
            <Text className="text-gray-600">{item?.phoneNumber}</Text>
          </View>
        </Pressable>
      </>
    );
  };
  return (
    <View className="bg-slate-100 flex-1 px-3">
      <FlatList
        data={deliveryEmploy}
        keyExtractor={item => item?._id}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
      />
      <ConformDelivery
        selectDelivery={selectDelivery}
        setModalVisible={setModalVisible}
        modalVisible={modalVisible}
        conformDeliveryBoy={conformDeliveryBoy}
      />
      <LoadingModal loading={loading}/>
    </View>
  );
};

export default AssignOrders;

const styles = StyleSheet.create({});
