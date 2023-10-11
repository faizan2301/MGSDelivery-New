import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import React, { useState } from "react";
import {
  useCollectMonyFromDeliveryMutation,
  useGetAllDeliveryBoysMutation,
  usePayDeliveryCostMutation,
} from "../../../redux/api/api";
import { useSelector } from "react-redux";
import { showMessage } from "react-native-flash-message";
import { useEffect } from "react";
import { FlatList } from "react-native";
import navigationStrings from "../../../constant/navigationStrings";
import CollectMony from "../../../components/CollectMony";
import LoadingModal from "./../../../components/LoadingModal";

const Payments = ({ navigation }) => {
  const { token } = useSelector((state) => state.token);

  const [deliveryEmploy, setDeliveryEmploy] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoadin] = useState(false);
  const [user, setUser] = useState({});
  const [payDeliveryCostState, setPayDeliveryCostState] = useState();
  const [amount, setAmount] = useState();

  const [getalldeliveryboys] = useGetAllDeliveryBoysMutation();
  const [collectMonyFromDelivery] = useCollectMonyFromDeliveryMutation();
  const [payDeliveryPerson, { data, isSuccess, isError, error }] =
    usePayDeliveryCostMutation();

  const getAllDeliveryBoysList = async () => {
    const response = await getalldeliveryboys(token);
    if (response.data) {
      if (response.data.data) {
        setDeliveryEmploy(response.data.data);
      } else {
        console.log(response);
        showMessage({
          message: error?.data?.message,
          type: "danger",
        });
      }
    } else {
      console.log(response);
      showMessage({
        message: response.error.data.message,
        type: "danger",
      });
    }
  };

  useEffect(() => {
    getAllDeliveryBoysList();
  }, []);

  const payDeliveryCosts = async () => {
    console.log(payDeliveryCostState, "Delivery Payments", user);
    await payDeliveryPerson({
      body: { amount: payDeliveryCostState, userId: user._id },
      token,
    });
    setModalVisible(false);
  };

  useEffect(() => {
    if (isSuccess) {
      getAllDeliveryBoysList();
      console.log;
      showMessage({ message: data.message, type: "success" });
    }
  }, [isSuccess]);
  useEffect(() => {
    if (isError) {
      console.log(error);
      if (isError) {
        showMessage({ message: error.data.message, type: "danger" });
      }
    }
  }, [isError]);

  const Items = async ({ item }) => {
    return (
      <View className="px-3 border">
        <View>{/* <Image/> */}</View>
        <View>
          <Text>Name name</Text>
          <Text>2000</Text>
        </View>
      </View>
    );
  };

  const Collect = async () => {
    setModalVisible(false);
    setLoadin(true);
    const res = await collectMonyFromDelivery({
      body: {
        deliveryBoyId: user._id,
        amountRecived: amount,
      },
      token,
    });
    if (res.data) {
      showMessage({
        message: `collected ${amount} from ${user.userName} .`,
        type: "success",
      });
    } else {
      showMessage({ message: `something went wrong`, type: "danger" });
    }
    getAllDeliveryBoysList();
    setLoadin(false);
  };

  return (
    <View className="flex-1 px-3 mt-2">
      {/* {deliveryEmploy.length > 0 && <FlatList
        data={deliveryEmploy}
        keyExtractor={item => item._id}
        renderItem={Items}
      />} */}
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {deliveryEmploy.map((data, index) => (
          <TouchableOpacity
            key={data._id}
            onPress={() => {
              setUser(data);
              setModalVisible(true);
            }}
            className="px-3 flex-row shadow-lg justify-between items-center shadow-black bg-white py-2 rounded-md mt-2"
          >
            <View className="flex-row">
              <View className="h-20 w-20 ">
                <Image source={{ uri: data.avatar }} className="flex-1" />
              </View>
              <View className="ml-3">
                <Text className="text-base font-semibold">{data.userName}</Text>
                <Text className=" font-bold mt-2"> {data.phoneNumber}</Text>
              </View>
            </View>
            <View className="">
              <Text className="text-green-500 text-base font-bold">
                ₹{data.pendingBalance}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {modalVisible && (
        <CollectMony
          Collect={Collect}
          setAmount={setAmount}
          amount={amount}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          payDeliveryCosts={payDeliveryCosts}
          setPayDeliveryCostState={setPayDeliveryCostState}
          user={user}
        />
      )}
      {loading && <LoadingModal loading={loading} />}
    </View>
  );
};

export default Payments;
