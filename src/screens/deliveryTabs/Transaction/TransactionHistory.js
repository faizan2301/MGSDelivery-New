import { Button, FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState ,useCallback} from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useTransactionMutation } from "../../../redux/api/api";
import { useSelector } from "react-redux";
import { formatDate } from "./../../../common/Functions";
import LoadingModal from './../../../components/LoadingModal';
import { showMessage } from "react-native-flash-message";

const TransactionHistory = () => {
  const { token } = useSelector(state => state.token);

  const [history, setHistory] = useState([]);
  const [loading , setLoading] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [skip , setSkip] = useState(0)


  const [transactionApi , { data , isSuccess , error , isError , isLoading }] = useTransactionMutation();

  const MyTransaction = async () => {
  await transactionApi(token);
  };


  // get transaction api
  useEffect(() => {
    if(isLoading) return
    MyTransaction()
  }, []);

  useEffect(()=>{
    if(isSuccess){
      setHistory(data.data);
    }
  },[isSuccess])
  useEffect(()=>{
    if(isError){
if(error.data){
showMessage({message : error.data.message,type:"danger"})
}else{
  showMessage({message : "Something went wrong while feching transaction history",type:"danger"})
}
    }
  },[isError])

  const handleNearEndReached = () => {
    setSkip(skip + 10); // Increase skip by the desired limit
    console.log(skip , "Skip added")
  };

  const renderItem = item => {
    // console.log(item.item.createdAt)
    const {order , userId  ,orderId , recivedBySuperAdmin , superAdmin , paymentMethod} = item.item

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
              {order ? orderId?.name :recivedBySuperAdmin ? superAdmin.userName : userId?.userName}
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
  };

  
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    MyTransaction()
    setSkip(0)
      setRefreshing(false);

  }, []);
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
        // ListFooterComponent={
        //   <Button title="Load more data" onPress={loadMoreData}/>
        // }
        onEndReached={handleNearEndReached}
        onEndReachedThreshold={1}
      />
      {isLoading && <LoadingModal loading={isLoading}/>}
    </View>
  );
};

export default TransactionHistory;

const styles = StyleSheet.create({});
