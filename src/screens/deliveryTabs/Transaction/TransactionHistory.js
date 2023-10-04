import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {
  useTransactionMutation,
  useTransactionpostMutation,
} from "../../../redux/api/api";
import { useSelector } from "react-redux";
import { formatDate } from "./../../../common/Functions";
import LoadingModal from "./../../../components/LoadingModal";
import { showMessage } from "react-native-flash-message";

const TransactionHistory = () => {
  const { token } = useSelector((state) => state.token);
  const [history, setHistory] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [skip, setSkip] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [endData, setEndData] = useState(true);

  // const [transactionApi , { data , isSuccess , error , isError , isLoading }] = useTransactionMutation();
  const [transactionApi, { data, isSuccess, error, isError, isLoading }] =
    useTransactionpostMutation();

  const MyTransaction = async () => {
    if (endData) {
      await transactionApi({ body: { skip }, token });
      setSkip(skip + 20);
    }
  };

  const loadMoreData = async () => {
    if (isLoading || isLoadingMore) return; // Prevent multiple requests
    setIsLoadingMore(true); // Set loading flag/ Increase skip by the desired limit
    await MyTransaction();
    setSkip(skip + 20);
    setIsLoadingMore(false); // Clear loading flag
  };

  // get transaction api
  useEffect(() => {
    if (isLoading || isLoadingMore) return;
    MyTransaction();
  }, [0]);

  useEffect(() => {
    if (isLoading || isLoadingMore) return;
    if (isSuccess) {
      // setHistory(data.data);
      if (data.data) {
        if (data.data.length === 0) {
          setEndData(false);
        }
        setHistory((prevData) => [...prevData, ...data.data]);
      }
    }
  }, [isSuccess]);
  useEffect(() => {
    if (isError) {
      if (error.data) {
        showMessage({ message: error.data.message, type: "danger" });
      } else {
        showMessage({
          message: "Something went wrong while feching transaction history",
          type: "danger",
        });
      }
    }
  }, [isError]);

  const renderItem = useCallback((item) => {
    const {
      order,
      userId,
      orderId,
      recivedBySuperAdmin,
      superAdmin,
      paymentMethod,
    } = item.item;

    return (
      <View className=" flex-row brder px-4 py-2 justify-between">
        <View className="flex-row">
          <View className="bg-slate-200 rounded-lg w-12 h-12 my-auto items-center justify-center">
            <MaterialIcons
              name={"swap-horiz"}
              size={40}
              color={order ? "#444262" : "#FF7754"}
            />
          </View>
          <View className=" px-4 py-2">
            <Text className="font-semibold text-gray-700">
              {order
                ? orderId?.name
                : recivedBySuperAdmin
                ? superAdmin.userName
                : userId?.userName}
            </Text>
            <Text className="text-xs font-light text-gray-700">
              {paymentMethod && paymentMethod}
            </Text>
            <Text className="text-xs font-light text-gray-700 ">
              {formatDate(item?.item?.createdAt)}
            </Text>
          </View>
        </View>
        <Text
          className={`text-base my-auto font-bold ${
            order ? "text-green-600" : "text-red-600"
          }`}
        >
          {order ? "+" : "-"} {item?.item?.amountRecived}
        </Text>
      </View>
    );
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setSkip(0);
    setHistory([]);
    MyTransaction();
    setRefreshing(false);
  }, []);

  return (
    <View className="bg-[#F8F8FE] flex-1 px-3">
      <FlatList
        data={history}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        // ListFooterComponent={
        //   <Button title="Load more data" onPress={loadMoreData}/>
        // }
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.3}
      />
      {isLoading && skip === 0 && <LoadingModal loading={isLoading} />}
    </View>
  );
};

export default TransactionHistory;
