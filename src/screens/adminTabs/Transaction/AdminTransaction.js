import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useCallback, useState } from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useSelector } from "react-redux";
import { useTransactionpostMutation } from "../../../redux/api/api";
import { formatDate } from "./../../../common/Functions";
import LoadingModal from "../../../components/LoadingModal";

const AdminTransaction = () => {
  const { token } = useSelector((state) => state.token);

  const [history, setHistory] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const [skip, setSkip] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [endData, setEndData] = useState(true);

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

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setSkip(0);
    setHistory([]);
    MyTransaction();
    setRefreshing(false);
  }, []);

  const renderItem = useCallback((item) => {
    const {
      order,
      deliveryBoyId,
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
              color={!recivedBySuperAdmin ? "#444262" : "#FF7754"}
            />
          </View>
          <View className=" px-4 py-2">
            <Text className="font-semibold text-gray-700">
              {recivedBySuperAdmin
                ? superAdmin?.userName
                : deliveryBoyId?.userName}
            </Text>
            <Text className="text-xs font-light text-gray-700">
              {paymentMethod ? paymentMethod : "Cash"}
            </Text>
            <Text className="text-xs font-light text-gray-700 ">
              {formatDate(item?.item?.createdAt)}
            </Text>
          </View>
        </View>
        <Text
          className={`text-base my-auto font-bold ${
            recivedBySuperAdmin ? "text-red-600" : "text-green-600"
          }`}
        >
          {superAdmin ? "-" : "+"} {item?.item?.amountRecived}
        </Text>
      </View>
    );
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
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.3}
      />
      {isLoading && skip === 0 && <LoadingModal loading={isLoading} />}
    </View>
    // <View className="bg-[#F8F8FE] flex-1 px-3">

    //   <View className=" flex-row brder px-4 py-2 justify-between">
    //     <View className="flex-row">
    //       <View className="bg-slate-200 rounded-lg p-2">
    //         <MaterialIcons name={"swap-horiz"} size={40} color="#444262" />
    //       </View>
    //       <View className=" px-4 py-2">
    //         <Text className="font-semibold text-gray-700">
    //           Moksha solutions
    //         </Text>
    //         <Text className="text-xs font-light text-gray-700  mt-1">
    //           20/04/2022 3:45 PM
    //         </Text>
    //       </View>
    //     </View>
    //     <Text className="text-base my-auto font-bold text-green-600">+ 3000</Text>
    //   </View>

    //   <View className=" flex-row brder px-4 py-2 justify-between">
    //     <View className="flex-row">
    //       <View className="bg-slate-200 rounded-lg p-2">
    //         <MaterialIcons name={"swap-horiz"} size={40} color="#FF7754" />
    //       </View>
    //       <View className=" px-4 py-2">
    //         <Text className="font-semibold text-gray-700">
    //           Mahaveer Ghr sansar
    //         </Text>
    //         <Text className="text-xs font-light text-gray-700 mt-1">
    //           20/04/2022 3:45 PM
    //         </Text>
    //         <Text className="text-xs font-light text-gray-700 mt-1">
    //           20/04/2022 3:45 PM
    //         </Text>
    //       </View>
    //     </View>
    //     <Text className="text-base my-auto font-bold text-red-600">- 3000</Text>
    //   </View>
    // </View>
  );
};

export default AdminTransaction;

const styles = StyleSheet.create({});
