import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import React, { useEffect ,useCallback, useState } from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useSelector } from "react-redux";
import { useTransactionMutation } from "../../../redux/api/api";
import { formatDate } from './../../../common/Functions';
import LoadingModal from "../../../components/LoadingModal";

const AdminTransaction = () => {
  const { token } = useSelector(state => state.token);

  const [history, setHistory] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading , setLoading] = React.useState(false)


  const [transactionApi] = useTransactionMutation();

  const MyTransaction = async () => {
    setLoading(true)
    const res = await transactionApi(token);
    if (res.data) {
      setHistory(res.data.data);
    }
    setLoading(false)
  };

  useEffect(() => {
    MyTransaction();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    MyTransaction()
      setRefreshing(false);

  }, []);



  const renderItem = item => {
    // console.log(item.item.createdAt)
    const {order , userId  ,orderId ,deliveryBoyId} = item.item
    return (
      <View className=" flex-row brder px-4 py-2 justify-between mt-2">
        <View className="flex-row">
          <View className="bg-slate-200 rounded-lg p-2">
            <MaterialIcons
              name={"swap-horiz"}
              size={40}
              color={!order ? "#444262" : "#FF7754"}
            />
          </View>
          <View className=" px-4 py-2">
            <Text className="font-semibold text-gray-700">
              {order ? orderId.name : deliveryBoyId?.userName}
            </Text>
            <Text className="text-xs font-light text-gray-700 ">
              {formatDate(item.item.createdAt)}
            </Text>
          </View>
        </View>
        <Text
          className={`text-base my-auto font-bold ${
            !order ? "text-green-600" : "text-red-600"
          }`}
        >
          {!order ? "+" : "-"} {item.item.amountRecived}
        </Text>
      </View>
    );
  };

  return (
    <View className="bg-[#F8F8FE] flex-1 px-3">
    <FlatList
      data={history}
      keyExtractor={item => item._id}
      showsVerticalScrollIndicator={false}
      renderItem={renderItem}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  {loading && <LoadingModal loading={loading}/>}
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
