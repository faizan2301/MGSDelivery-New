import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useCustomerOrdersMutation } from "../../redux/api/api";
import { useSelector } from "react-redux";
import { showMessage } from "react-native-flash-message";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Entypo from "react-native-vector-icons/Entypo";
import navigationStrings from "../../constant/navigationStrings";
import CollectCreditAmount from "../../components/CollectCreditAmount";
import { useIsFocused } from "@react-navigation/native";

const CustomerDetailsScreen = ({ route, navigation }) => {
  const { item } = route.params;
  const { token } = useSelector((state) => state.token);
  const isFocused = useIsFocused();
  const [skip, setSkip] = useState(0);
  const [orders, setOrders] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const myRef = useRef(false);
  const [customerOrders, { data, isSuccess, isError, error, isLoading }] =
    useCustomerOrdersMutation();
  useEffect(() => {
    customerOrders({ body: { customerId: item?.customerId, skip }, token });
  }, []);

  useEffect(() => {
    if (isSuccess) {
      console.log(data.data);
      setOrders(data?.data);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      if (error.data) {
        showMessage({ message: error.data.message, type: "danger" });
      } else {
        showMessage({
          message: "Something went wrong while fetching orders",
          type: "danger",
        });
      }
    }
  }, [isError]);

  const onRefresh = React.useCallback(() => {
    setOrders([]);
    setSkip(0);
    setRefreshing(true);
    myRef.current = true;
    customerOrders({ body: { customerId: item?.customerId, skip }, token });
    setRefreshing(false);
  }, []);

  const loadMoreData = async () => {
    if (!myRef.current) return;
    if (isLoading || isLoadingMore) return; // Prevent multiple requests
    setIsLoadingMore(true); // Set loading flag/ Increase skip by the desired limit
    customerOrders({ body: { customerId: item?.customerId, skip }, token });
    setSkip(skip + 20);
    setIsLoadingMore(false); // Clear loading flag
  };

  const collectCreditAmount = async (amount) => {
    setModalVisible(false);
  };

  const renderItem = useMemo(() => {
    return ({ item, index }) => {
      return (
        <>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(
                navigationStrings.ADMINMYCUSTOMERORDERDETAILS,
                { item }
              )
            }
            className={` my-2  w-fit p-2 rounded-lg  ${" bg-white"}`}
            key={index}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              elevation: 10,
            }}
          >
            <View className="flex-row justify-between  gap-2 flex-wrap px-2">
              <View
                style={{ marginBottom: 4 }}
                className={`flex-row px-5 py-2 rounded-full items-center ${"bg-slate-200/50"}`}
              >
                <Entypo name={"clipboard"} size={20} color="#FF7754" />
                <Text className="pl-3">{item?.orderId?.billNo}</Text>
              </View>

              <View
                style={{ marginBottom: 4 }}
                className={`flex-row px-5 py-2 rounded-full items-center ${"bg-slate-200/50"}`}
              >
                <FontAwesome5 name={"rupee-sign"} size={20} color="#FF7754" />
                <Text className="pl-3">{item?.orderId?.totalAmount}</Text>
              </View>
              <View className=" items-center justify-center">
                {item?.orderId?.paid ? (
                  <View className="bg-green-600 w-4 h-4 rounded-full"></View>
                ) : (
                  <View className="bg-red-600 w-4 h-4 rounded-full"></View>
                )}
              </View>
            </View>

            <View className="flex-row  gap-2 flex-wrap">
              <View
                style={{ marginBottom: 4 }}
                className={`flex-row px-5 py-2 rounded-full items-center ${"bg-slate-200/50"}`}
              >
                <FontAwesome name={"calendar"} size={20} color="#FF7754" />

                <Text className="pl-3">
                  {new Date(item?.orderId?.createdAt).toLocaleString()}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </>
      );
    };
  }, [refreshing, isFocused]);

  return (
    <View className="px-2 py-2">
      <View className=" px-5 overflow-auto py-3 rounded-lg shadow-lg shadow-black bg-white">
        <View className="flex-row gap-3 items-center">
          <Text className="font-semibold">CustomerId : </Text>
          <Text className="font-semibold ">{item?.customerId}</Text>
        </View>
        <View className="flex-row gap-3 items-center mt-1">
          <FontAwesome name={"user"} size={20} color="#444262" />
          <Text className="font-semibold ">{item?.customer}</Text>
        </View>
        <View className="flex-row gap-3 items-center mt-1">
          <FontAwesome name={"phone"} size={20} color="#444262" />
          <Text className="font-semibold ">{item?.mobile}</Text>
        </View>
        <View className="flex-row gap-3 items-center mt-1">
          <Ionicons name={"location-sharp"} size={20} color="#444262" />
          <Text className="font-semibold ">{item?.address}</Text>
        </View>
        <View className="px-2 py-2">
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            className="shadow-lg shadow-black py-2 rounded-md mt-2 text-center bg-[#444262]"
          >
            <Text className=" font-bold text-center text-white">Collect</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className="">
        {
          <FlatList
            data={orders}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            renderItem={renderItem}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            onEndReached={loadMoreData}
            onEndReachedThreshold={0.5}
          />
        }
      </View>
      <CollectCreditAmount
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        item={item}
        navigation={navigation}
      />
    </View>
  );
};

export default CustomerDetailsScreen;

const styles = StyleSheet.create({});
