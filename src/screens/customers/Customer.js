import {
  Image,
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  RefreshControl,
} from "react-native";
import React, { useMemo, useRef, useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { showMessage } from "react-native-flash-message";
import navigationStrings from "../../constant/navigationStrings";
import LoadingModal from "../../components/LoadingModal";
import { useCustomersMutation } from "../../redux/api/api";
import { useIsFocused } from "@react-navigation/native";

const Customers = ({ route, navigation }) => {
  // console.log(route.params,">>>>>>>>>>>")
  const { token } = useSelector((state) => state.token);
  const [customers, setCustomers] = useState([]);
  const [skip, setSkip] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const dataIsEnded = useRef(true);
  const isFocused = useIsFocused();
  // console.log(array)
  const [allCustomer, { data, error, isError, isSuccess, isLoading }] =
    useCustomersMutation();

  useEffect(() => {
    if (isLoading || isLoadingMore) return;
    allCustomer({
      body: {
        skip: skip,
      },
      token,
    });
    setSkip(skip + 20);
  }, [isFocused]);

  useEffect(() => {
    if (isSuccess) {
      if (data.data.length === 0) {
        dataIsEnded.current = false;
      }
      setCustomers((prevData) => [...prevData, ...data?.data]);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      if (error.data) {
        showMessage({ message: error.data.message, type: " danger" });
      } else {
        showMessage({
          message: "Somrthing went wrong while get customers",
          type: " danger",
        });
      }
    }
  }, [isError]);

  const loadMoreData = async () => {
    if (!dataIsEnded.current) return;
    if (isLoading || isLoadingMore) return; // Prevent multiple requests
    setIsLoadingMore(true); // Set loading flag/ Increase skip by the desired limit
    allCustomer({
      body: {
        skip: skip,
      },
      token,
    });
    setSkip(skip + 20);
    setIsLoadingMore(false); // Clear loading flag
  };

  const onRefresh = React.useCallback(() => {
    setSkip(0);
    setCustomers([]);
    setRefreshing(true);
    allCustomer({
      body: {
        skip: 0,
      },
      token,
    });
    setRefreshing(false);
  }, []);

  const renderItem = useMemo(() => {
    return ({ item }) => {
      if (!item) return;
      return (
        <>
          <Pressable
            onPress={() => {
              //   setSkip(0);
              navigation.navigate(navigationStrings.ADMINMYCUSTOMERDETAILS, {
                item,
              });
            }}
            className="bg-white text-[#444262]  flex-row justify-between  items-center py-3 mt-2 rounded-lg px-3"
          >
            <View className="px-3">
              <Text className="font-semibold">{item?.customer}</Text>
              <Text className="text-gray-600">{item?.mobile}</Text>
            </View>
            <View className="">
              <Text className="text-green-600">₹ {item.creditAmount}</Text>
            </View>
          </Pressable>
        </>
      );
    };
  }, [customers]);
  return (
    <View className="bg-slate-100 flex-1 px-3">
      <FlatList
        data={customers}
        keyExtractor={(item) => item?._id}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.3}
      />
      {isLoading && <LoadingModal loading={isLoading} />}
    </View>
  );
};

export default Customers;

const styles = StyleSheet.create({});
