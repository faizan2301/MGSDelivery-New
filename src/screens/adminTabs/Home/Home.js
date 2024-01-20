import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Pressable,
  View,
  ScrollView,
  RefreshControl,
  Modal,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import LinearGradient from "react-native-linear-gradient";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Icons from "react-native-vector-icons/MaterialCommunityIcons";
import Entypo from "react-native-vector-icons/Entypo";
import Octicons from "react-native-vector-icons/Octicons";
import navigationStrings from "../../../constant/navigationStrings";
import { statusArray } from "../../../constant/constantArray";
import { useGetOrdersMutation } from "../../../redux/api/api";
import { useIsFocused } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { showMessage } from "react-native-flash-message";
import LoadingModal from "./../../../components/LoadingModal";
import CalendarModal from "../../../components/CalendarModal";
import { formatDate } from "../../../constant/dateYYYYMMDD";
import * as Linking from "expo-linking";
const Home = (props) => {
  const currentDate = new Date();
  const startOfDay = new Date(currentDate);
  startOfDay.setUTCHours(0, 0, 0, 0); // Set to 12:00:00 AM UTC
  const endOfDay = new Date(currentDate);

  const { navigation } = props;
  const windowWidth = Dimensions.get("window").width;
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [Numbers, setNumbers] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [range, setRange] = useState({
    END_DATE: "End Date",
    START_DATE: " Start Date",
  });
  const [skipno, setskipno] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [startDate, setStartDate] = useState(startOfDay);
  const [endDate, setEndDate] = useState(endOfDay);
  const [filterOrder, setFilterOrder] = useState("pending");

  const startDateMemo = useMemo(() => startDate, [startDate]); // Empty dependency array
  const endDateMemo = useMemo(() => endDate, [endDate]);
  const skipMemo = useMemo(() => skipno, [skipno]);
  const filterMemo = useMemo(() => filterOrder, [filterOrder]);

  const myRef = useRef(true);

  const [apiCall, { data, isSuccess, isError, isLoading, error }] =
    useGetOrdersMutation();
  const focused = useIsFocused();
  const isPermissionGranted = useSelector(
    (state) => state.cameraPermission.isGranted
  );
  const { token } = useSelector((state) => state.token);
  const { userData } = useSelector((state) => state.user);

  const isSelectedAdded = items.map((item, index) => ({
    ...item,
    isSlected: false,
  }));

  const onRefresh = React.useCallback(() => {
    setItems([]);
    setskipno(0);
    setRefreshing(true);
    myRef.current = true;
    apiCall({
      body: {
        END_DATE: endDateMemo,
        START_DATE: startDateMemo,
        skip: 0,
        orderStatus: filterMemo,
      },
      token,
    });
    setRefreshing(false);
  }, []);

  const onSelect = (order) => {
    const temp = [];
    isSelectedAdded.map((data, index) => {
      // console.log(order._id)
      if (order._id === data._id) {
        if (!order.isSelected) {
          temp.push({ ...data, isSelected: true });
        } else {
          temp.push({ ...data, isSelected: false });
        }
      } else {
        temp.push(data);
      }

      setItems(temp);
      setSelectedItems(temp.filter((item, index) => item.isSelected));
    });
  };
  const textBoxWidth = 0.3;

  const renderItem = useMemo(() => {
    return ({ item, index }) => {
      const calculatedAmount =
        item.paid !== undefined
          ? Math.max(item.totalAmount - item.paid, 0)
          : item.totalAmount;
      return (
        <>
          <TouchableOpacity
            // onPress={() => {
            //   if (selectedItems.length > 0) {
            //     onSelect(item);
            //   } else {
            //     setEdit(item);
            //     setModalVisible(true);
            //   }
            // }}
            onLongPress={() => {
              navigation.navigate(navigationStrings.ADMINORDERDETAILS, {
                item,
              });
            }}
            // onLongPress={()=> navigation.navigate(navigationStrings.ADMINEDITORDER,{item })}
            onPress={() =>
              filterOrder === "pending"
                ? onSelect(item)
                : navigation.navigate(navigationStrings.ADMINORDERDETAILS, {
                    item,
                  })
            }
            className={` my-2 mx-4 w-fit p-2 rounded-lg min-h-fit  ${
              item.isSelected ? "  bg-orange-100" : " bg-white"
            }`}
            // onPress={() =>{ item.dispatched ?  navigation.navigate(navigationStrings.DELIVER, { item }) : onSelect(item) }
            // }

            key={index}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              elevation: 10,
            }}
          >
            <View className="flex-row ">
              <View
                style={{ marginBottom: 4 }}
                className={`flex-row px-5 py-2 rounded-full items-center ${
                  item.isSelected ? "bg-white" : "bg-slate-200/50"
                }`}
              >
                <FontAwesome name={"user"} size={20} color="#FF7754" />
                <Text className="pl-3 font-semibold text-[#444262]">
                  {item.name}
                </Text>
              </View>
            </View>
            <View className="flex-row ">
              <TouchableOpacity
                style={{ marginBottom: 4 }}
                className={`flex-row px-5 py-2 rounded-full items-center ${
                  item.isSelected ? "bg-white" : "bg-slate-200/50"
                }`}
                onPress={() => {
                  console.log("first");
                  getNumber(item.mobile);
                }}
              >
                <FontAwesome5 name={"phone"} size={20} color="#FF7754" />
                <Text className="pl-3">{item.mobile}</Text>
              </TouchableOpacity>
            </View>
            <View className="flex-row ">
              <View
                style={{ marginBottom: 4 }}
                className={`flex-row px-5 py-2 rounded-full items-center ${
                  item.isSelected ? "bg-white" : "bg-slate-200/50"
                }`}
              >
                <MaterialIcons name={"date-range"} size={20} color="#FF7754" />
                <Text className="pl-3 font-semibold text-[#444262]">
                  {item.billDate ? item.billDate : item.createdAt.split("T")[0]}
                </Text>
              </View>
            </View>
            <View className="flex-row  gap-2 flex-wrap">
              <View
                style={{ marginBottom: 4 }}
                className={`flex-row px-5 py-2 rounded-full items-center ${
                  item.isSelected ? "bg-white" : "bg-slate-200/50"
                }`}
              >
                <Entypo name={"clipboard"} size={20} color="#FF7754" />
                <Text className="pl-3">{item.billNo}</Text>
              </View>
              <View
                style={{ marginBottom: 4 }}
                className={`flex-row px-5 py-2 rounded-full items-center ${
                  item.isSelected ? "bg-white" : "bg-slate-200/50"
                }`}
              >
                <FontAwesome5 name={"shopping-bag"} size={20} color="#FF7754" />
                <Text className="pl-3">{item.totalBags}</Text>
              </View>
              <View
                style={{ marginBottom: 4 }}
                className={`flex-row px-5 py-2 rounded-full items-center ${
                  item.isSelected ? "bg-white" : "bg-slate-200/50"
                }`}
              >
                <FontAwesome5 name={"rupee-sign"} size={20} color="#FF7754" />
                <Text className="pl-3">
                  {/* {item.totalAmount - item.paid < 0
                    ? 0
                    : item.totalAmount - item.paid} */}
                  {calculatedAmount}
                </Text>
              </View>
            </View>
            <View
              style={{ marginBottom: 4 }}
              className={`flex-row px-5 py-2 rounded-full items-center mb-4 ${
                item.isSelected ? "bg-white" : "bg-slate-200/50"
              }`}
            >
              <Octicons name={"home"} size={20} color="#FF7754" />
              <Text className="pl-3  text-[#444262]">{item.address}</Text>
            </View>
          </TouchableOpacity>
        </>
      );
    };
  }, [skipMemo, filterMemo, selectedItems, items]);

  const renderFilter = useMemo(() => {
    return ({ item }) => {
      //
      return userData.role === "Admin" ? (
        <Pressable
          onPress={() => setFilterOrder((prevState) => item.status)}
          className={` h-12 flex-row items-center justify-center  rounded-full py-2 w-36
         m-2 ${filterOrder === item.status ? "bg-[#444262]" : "bg-[#C1C0C8]"}`}
        >
          <Text
            className={`font-light text-white text-center ${
              filterOrder === item.status ? "text-white" : "text-[#444262]"
            }`}
          >
            {item.name}
          </Text>
        </Pressable>
      ) : (
        !item.admin && (
          <Pressable
            onPress={() => setFilterOrder(item.status)}
            className={` h-12 flex-row items-center justify-center  rounded-full py-2 w-36
         m-2 ${filterOrder === item.status ? "bg-[#444262]" : "bg-[#C1C0C8]"}`}
          >
            <Text
              className={`font-light text-white text-center ${
                filterOrder === item.status ? "text-white" : "text-[#444262]"
              }`}
            >
              {item.name2 ? item.name2 : item.name}
            </Text>
          </Pressable>
        )
      );
    };
  }, [filterMemo]);

  const getOrders = async (startDate, endDate, skipcheck) => {
    setCalendarVisible(false);
    if (items.length % 20 !== 0) return;
    if (isLoading || isLoadingMore) return;
    if (!myRef.current) return;
    const response = await apiCall({
      body: {
        END_DATE: endDateMemo,
        START_DATE: startDateMemo,
        skip: skipMemo,
        orderStatus: filterMemo,
      },
      token,
    });
    setskipno(skipno + 20);
  };

  const loadMoreData = async () => {
    if (items.length % 20 !== 0) return;
    setskipno(skipno + 20);
    if (isLoading || isLoadingMore) return; // Prevent multiple requests
    setIsLoadingMore(true); // Set loading flag/ Increase skip by the desired limit
    await apiCall({
      body: {
        END_DATE: endDateMemo,
        START_DATE: startDateMemo,
        skip: skipMemo,
        orderStatus: filterMemo,
      },
      token,
    });

    setIsLoadingMore(false); // Clear loading flag
  };

  useEffect(() => {
    setCalendarVisible(false);
    if (isLoading || isLoadingMore) return;
    if (focused) {
      setItems([]);
      // setSkip((skip)=>0)
      myRef.current = true;
      getOrders();
    }
  }, [focused]);

  useEffect(() => {
    if (isLoading || isLoadingMore) return;
    setItems([]);
    setskipno(0);
    apiCall({
      body: {
        END_DATE: endDateMemo,
        START_DATE: startDateMemo,
        skip: 0,
        orderStatus: filterMemo,
      },
      token,
    });
  }, [filterMemo, endDateMemo, focused]);

  useEffect(() => {
    if (isLoading || isLoadingMore) return;
    apiCall({
      body: {
        END_DATE: endDateMemo,
        START_DATE: startDateMemo,
        skip: skipMemo,
        orderStatus: filterMemo,
      },
      token,
    });
  }, [filterMemo, endDateMemo]);

  useEffect(() => {
    if (isLoading || isLoadingMore) return;
    if (isSuccess) {
      if (data.data) {
        if (data.data.length === 0) {
          myRef.current = false;
        }
        setItems((prevData) => [...prevData, ...data.data]);
      }
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      if (error.data) {
        showMessage({ message: error.data.message, type: "danger" });
      } else {
        showMessage({ message: error.data.message, type: "danger" });
      }
    }
  }, [isError]);

  const qrCodeScan = async () => {
    navigation.navigate(
      isPermissionGranted
        ? navigationStrings.SCANQRCODESCREEN
        : navigationStrings.PERMISSIONSCREEN
    );
  };

  const assign = async () => {
    navigation.navigate(navigationStrings.ASSIGNORDER, selectedItems);
  };

  const onConfirm = React.useCallback(
    ({ startDate, endDate }) => {
      setCalendarVisible(false);
      setRange({ startDate, endDate });
    },
    [calendarVisible, setRange]
  );
  const callCustomer = async (number) => {
    if (number) {
      try {
        Linking.openURL(`tel:${number}`);
        setModalVisible(false);
      } catch (error) {
        console.log("Error", er);
      }
    }
  };
  const getNumber = async (numbers) => {
    var array = [];
    if (numbers.length > 9) {
      if (numbers.includes(",")) {
        var tNumbers = await numbers.split(",");
        for (let index = 0; index < tNumbers.length; index++) {
          const element = tNumbers[index];
          if (element.length > 9) {
            array.push(element);
          }
        }
        setNumbers(array);
        console.log(tNumbers);
        setModalVisible(true);
      } else if (numbers) {
        console.log(numbers);
        array.push(numbers);
        setNumbers(array);
        setModalVisible(true);
      }
    } else {
      showMessage({ message: "Not valid mobile no", type: "warning" });
    }
  };
  return (
    <View className="flex-1 bg-[#F8F8FE] ">
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        style={{ zIndex: 1100 }}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            {Numbers.length > 0
              ? Numbers.map((item, index) => {
                  return (
                    <TouchableOpacity
                      className={`flex-row my-2 p-2  rounded-full items-center border border-black `}
                      key={index}
                      onPress={() => {
                        callCustomer(item);
                      }}
                    >
                      <FontAwesome5 name={"phone"} size={20} color="#FF7754" />
                      <Text className="text-black mx-2">{item}</Text>
                    </TouchableOpacity>
                  );
                })
              : null}
          </View>
        </View>
      </Modal>
      {userData.role === "Admin" && (
        <View className="flex-row justify-between p-4">
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(navigationStrings.ADMINMYCUSTOMER)
            }
            className="bg-green-200 shadow-2xl  shadow-green-900 rounded-xl overflow-hidden border border-white"
          >
            <LinearGradient
              colors={["#fff", "#00755E"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.linearGradient}
            >
              <FontAwesome name="users" size={40} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              console.log("Navigation string");
              navigation.navigate(navigationStrings.ADMINMYCREDITS);
            }}
            className="shadow-2xl bg-red-300 shadow-red-900 rounded-xl overflow-hidden border border-white"
          >
            <LinearGradient
              colors={["#fff", "#E50815"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.linearGradient}
            >
              <MaterialIcons name="pending-actions" size={40} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={qrCodeScan}
            className="bg-blue-300 shadow-2xl  shadow-blue-900 rounded-xl overflow-hidden border border-white"
          >
            <LinearGradient
              colors={["#CAF6FF", "#37A2FF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.linearGradient}
            >
              <Icons name="qrcode-scan" size={40} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
      <View className="flex-row px-1 ">
        <TouchableOpacity
          onPress={() => setCalendarVisible(true)}
          className=" flex-1 shadow-lg shadow-black bg-white mb-3 py-1 flex-row mx-2 rounded-full items-center justify-between px-4 "
        >
          <View className="flex-row items-center ">
            <Text className="text-slate-400 ">
              {formatDate(startDateMemo)}{" "}
            </Text>
            <Text className="font-bold text-xl text-[#444262]"> - </Text>
            <Text className="text-slate-400 ">{formatDate(endDateMemo)}</Text>
          </View>
          <Entypo name="calendar" size={25} color="#444262" />
        </TouchableOpacity>
        {/* <TouchableOpacity className=" shadow-lg shadow-black bg-white rounded-full w-10 h-10 items-center justify-center  ">
          <AntDesign name="reload1" size={25} color="#444262" />
        </TouchableOpacity> */}
      </View>
      <View>
        <FlatList
          data={statusArray}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={renderFilter}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
      {
        <FlatList
          data={isSelectedAdded}
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
      {selectedItems.length > 0 && userData.role === "Admin" ? (
        <TouchableOpacity
          onPress={assign}
          className="flex justify-center items-center w-16 h-16 z-30 rounded-full absolute bottom-5 right-5 bg-[#444262]"
        >
          <MaterialIcons
            name={"assignment-turned-in"}
            size={30}
            color="white"
          />
        </TouchableOpacity>
      ) : null}

      {isLoading && skipMemo === 0 && <LoadingModal loading={isLoading} />}
      {calendarVisible && (
        <CalendarModal
          setCalendarVisible={setCalendarVisible}
          calendarVisible={calendarVisible}
          range={range}
          setRange={setRange}
          onConfirm={onConfirm}
          getOrders={getOrders}
          setEndDate={setEndDate}
          setStartDate={setStartDate}
        />
      )}
    </View>
  );
};
//#c5d8e7
//#0081CD
export default Home;
export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  linearGradient: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  rightContainer: {
    flex: 1,
    marginLeft: 12,
    paddingVertical: 8,
  },
  modalBackground: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-around",
    backgroundColor: "#rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
  },
  activityIndicatorWrapper: {
    backgroundColor: "white",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 200,
  },
});
