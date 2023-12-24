import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Pressable,
  View,
  RefreshControl,
  Modal,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Entypo from "react-native-vector-icons/Entypo";
import Octicons from "react-native-vector-icons/Octicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import navigationStrings from "../../../constant/navigationStrings";
import { statusArray } from "../../../constant/constantArray";
import {
  useGetMyOrderMutation,
  useGetOrdersMutation,
  usePikedupMutation,
} from "../../../redux/api/api";
import { useIsFocused } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { showMessage } from "react-native-flash-message";
import ConfirmPickedUp from "../../../components/ConfirmPickedUp";
import LoadingModal from "./../../../components/LoadingModal";
import * as Location from "expo-location";
import CalendarModal from "../../../components/CalendarModal";
import { formatDate } from "../../../helper/formatDate";
import * as Linking from "expo-linking";
const Home = (props) => {
  const { navigation } = props;

  const currentDate = new Date();
  const startOfDay = new Date(currentDate);
  startOfDay.setUTCHours(0, 0, 0, 0); // Set to 12:00:00 AM UTC
  const endOfDay = new Date(currentDate);

  const windowWidth = Dimensions.get("window").width;
  const focused = useIsFocused();

  //  ==============================   all states  ======================================
  const [items, setItems] = useState([]);
  const [location, setLocation] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [numbermodalVisible, setNumberModalVisible] = useState(false);
  const [Numbers, setNumbers] = useState([]);
  const [startDate, setStartDate] = useState(startOfDay);
  const [endDate, setEndDate] = useState(endOfDay);
  const [skip, setSkip] = useState(0);
  const [filterOrder, setFilterOrder] = useState("ready");

  const startDateMemo = useMemo(() => startDate, [startDate]); // Empty dependency array
  const endDateMemo = useMemo(() => endDate, [endDate]);
  const skipMemo = useMemo(() => skip, [skip]);
  const filterMemo = useMemo(() => filterOrder, [filterOrder]);

  const dataIsEnded = useRef(true);

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [endData, setEndData] = useState(true);

  const [range, setRange] = useState({
    END_DATE: endOfDay,
    START_DATE: startOfDay,
  });

  //  ==============================   Redux Api's  ======================================
  const [piked] = usePikedupMutation();
  const [myOrders, { data, isSuccess, IsError, error, isLoading }] =
    useGetMyOrderMutation();

  const isPermissionGranted = useSelector(
    (state) => state.cameraPermission.isGranted
  );
  const { token } = useSelector((state) => state.token);
  const { userData } = useSelector((state) => state.user);

  const getOrdersByDate = async (filter) => {
    var filterStatus = filter == "" ? filterMemo : filter;

    setSkip(0);
    dataIsEnded.current = true;
    setCalendarVisible(false);
    await myOrders({
      body: {
        END_DATE: endDateMemo,
        START_DATE: startDateMemo,
        skip: skipMemo,
        orderStatus: filterStatus,
      },
      token,
    });
  };

  const getOrders = async () => {
    setCalendarVisible(false);

    if (!dataIsEnded.current) return;
    await myOrders({
      body: {
        END_DATE: endDateMemo,
        START_DATE: startDateMemo,
        skip: skipMemo,
        orderStatus: filterMemo,
      },
      token,
    });
    setSkip(skip + 20);
  };

  useEffect(() => {
    if (isLoading || isLoadingMore) return;

    if (focused) {
      getOrders(startOfDay, endOfDay);
    }
  }, [focused, filterOrder]);

  useEffect(() => {
    if (isSuccess) {
      if (isLoading || isLoadingMore) return;
      if (isSuccess) {
        if (data.data.length === 0) {
          dataIsEnded.current = false;
        }
        // setHistory(data.data);
        if (data.data) {
          if (data.data.length === 0) {
            setEndData(false);
          }
          setItems((prevData) => [...prevData, ...data.data]);
        }
      }
    }
  }, [isSuccess]);

  useEffect(() => {
    if (IsError) {
      if (error.data) {
        showMessage({
          message: error.data.message,
          type: "danger",
        });
      } else {
        showMessage({
          message: "Something went wrong while fetching orders",
          type: "danger",
        });
      }
    }
  }, [IsError]);

  const loadMoreData = async () => {
    if (!dataIsEnded) return;
    if (items.length % 20 !== 0) return;
    if (isLoading || isLoadingMore) return; // Prevent multiple requests
    setIsLoadingMore(true); // Set loading flag/ Increase skip by the desired limit
    await getOrders();
    setSkip(skip + 20);
    setIsLoadingMore(false); // Clear loading flag
  };

  const isSelectedAdded = items.map((item, index) => ({
    ...item,
    isSlected: false,
  }));

  const onSelect = (order) => {
    const temp = [];
    isSelectedAdded.map((data, index) => {
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

  const pikedUpOrders = async () => {
    setModalVisible(false);
    let orderId = [];
    selectedItems.forEach((data) => orderId.push(data._id));

    // let {
    //   coords: { longitude, latitude },
    // } = await Location.getCurrentPositionAsync({
    //   accuracy: Location.Accuracy.High,
    // });
    let longitude = location?.longitude;
    let latitude = location?.latitude;
    // console.log(longitude, latitude);
    if (longitude != null && latitude != null) {
      const pickeStatus = await piked({
        body: { orderId, pickupCords: { latitude, longitude } },
        token,
      });
      // console.log(pickeStatus);
      if (pickeStatus.data) {
        showMessage({ message: pickeStatus.data.data, type: "success" });
        getOrders();
      } else {
        showMessage({
          message: "something went wrong please try again",
          type: "danger",
        });
      }
      setFilterOrder("dispatched");
    } else {
      getLocation();
      showMessage({
        message: "Check your gps and try again",
        type: "warning",
      });
    }
  };
  const textBoxWidth = 0.3;
  const renderItem = useMemo(() => {
    return ({ item, index }) => {
      return (
        <>
          {item ? (
            <Pressable
              // onPress={() =>{ navigation.navigate(navigationStrings.DELIVER, { item })  }}
              onPress={() => {
                !item.dispatched && filterOrder === "ready"
                  ? onSelect(item)
                  : navigation.navigate(navigationStrings.DELIVER, { item });
              }}
              className={` m-3 p-2 rounded-lg  mx-4 shadow-xl min-h-60  overflow-auto shadow-black  bg-white  ${
                item.isSelected ? "  bg-orange-100" : " "
              }`}
              key={index}
            >
              <View className="flex-row ">
                <View className="flex-row w-full justify-between ">
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
                  {!item.creditApproved && item.credit && (
                    <View className="flex-row px-5 py-2  bg-slate-200/50 rounded-full items-center ">
                      <FontAwesome name={"history"} size={25} color="#FF7754" />
                    </View>
                  )}
                  {item.creditApproved && (
                    <View className="flex-row px-5 py-2  bg-green-200/50 rounded-full items-center ">
                      <FontAwesome name={"check"} size={25} color="#2E8B57" />
                    </View>
                  )}
                </View>
              </View>
              <View className="flex-row ">
                <TouchableOpacity
                  style={{ marginBottom: 4 }}
                  className={`flex-row px-5 py-2 rounded-full items-center ${
                    item.isSelected ? "bg-white" : "bg-slate-200/50"
                  }`}
                  onPress={() => {
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
                  <Entypo name={"clipboard"} size={20} color="#FF7754" />
                  <Text className="pl-3">{item.billNo}</Text>
                </View>
                <View
                  style={{ marginBottom: 4 }}
                  className={`flex-row px-5 py-2 rounded-full items-center ${
                    item.isSelected ? "bg-white" : "bg-slate-200/50"
                  }`}
                >
                  <FontAwesome5
                    name={"shopping-bag"}
                    size={20}
                    color="#FF7754"
                  />
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
                    {item.totalAmount - item.paid < 0
                      ? 0
                      : item.totalAmount - item.paid}
                  </Text>
                </View>
              </View>
              <View className=" flex-1 ">
                <View
                  style={{ marginBottom: 4 }}
                  className={`flex-row px-5 py-2 rounded-full items-center ${
                    item.isSelected ? "bg-white" : "bg-slate-200/50"
                  }`}
                >
                  <Octicons name={"home"} size={20} color="#FF7754" />
                  <Text className="pl-3  text-[#444262]">{item.address}</Text>
                </View>
              </View>
            </Pressable>
          ) : (
            <Text></Text>
          )}
        </>
      );
    };
  }, [skip, filterOrder, items, refreshing]);

  const renderFilter = useMemo(() => {
    return ({ item }) => {
      return userData.role === "Admin" ? (
        <Pressable
          onPress={() => {
            setFilterOrder(item.status);
            setItems([]);
            getOrdersByDate();
          }}
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
            onPress={() => {
              setItems([]);
              setSkip(0);
              setFilterOrder(item.status);
              getOrdersByDate(item.status);
            }}
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
  }, [filterOrder, skip]);

  useEffect(() => {
    if (focused) {
      getLocation();
    }
  }, [0]);
  const getLocation = async () => {
    await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    }).then((location) => {
      setLocation(location.coords);
    });
  };

  const onRefresh = React.useCallback(() => {
    setSkip(0);
    setItems([]);
    setRefreshing(true);
    setFilterOrder((prevFilter) => prevFilter);
    getOrders(startOfDay, endOfDay);
    setRefreshing(false);
  }, []);

  const onConfirm = React.useCallback(
    ({ startOfDay, endOfDay }) => {
      setCalendarVisible(false);
      setEndDate(endOfDay);
      setStartDate(startOfDay);
    },
    [calendarVisible]
  );
  const callCustomer = async (number) => {
    if (number) {
      try {
        Linking.openURL(`tel:${number}`);
        setNumberModalVisible(false);
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
        setNumberModalVisible(true);
      } else if (numbers) {
        array.push(numbers);
        setNumbers(array);
        setNumberModalVisible(true);
      }
    } else {
      showMessage({ message: "Not valid mobile no", type: "warning" });
    }
  };
  return (
    <View className="flex-1 bg-[#F8F8FE] pt-4">
      <Modal
        transparent={true}
        animationType="slide"
        visible={numbermodalVisible}
        style={{ zIndex: 1100 }}
        onRequestClose={() => {
          setNumberModalVisible(!numbermodalVisible);
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
      <View className="flex-row px-2">
        <TouchableOpacity
          onPress={() => setCalendarVisible(true)}
          className=" flex-1 py-2 shadow-lg shadow-black bg-white mb-3 flex-row mx-2 rounded-full items-center justify-between px-4 "
        >
          <View className="flex-row items-center ">
            <Text className="text-slate-400 ">{formatDate(startDateMemo)}</Text>
            <Text className="font-bold text-lg text-[#444262]"> - </Text>
            <Text className="text-slate-400 ">{formatDate(endDateMemo)}</Text>
          </View>
          <Entypo name="calendar" size={25} color="#444262" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSkip(0)}
          className=" shadow-lg shadow-black bg-white rounded-full w-10 h-10 items-center justify-center  "
        >
          <AntDesign name="reload1" size={25} color="#444262" />
        </TouchableOpacity>
      </View>

      <View className="">
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
          // showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          // style={{ backgroundColor :"green"}}
          className="h-full w-full"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onEndReached={loadMoreData}
          onEndReachedThreshold={0.3}
        />
      }

      {selectedItems.length > 0 && filterOrder === "ready" ? (
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="flex justify-center items-center w-16 h-16 z-30 rounded-full absolute bottom-5 right-5 bg-[#444262]"
        >
          <MaterialIcons
            name={"assignment-turned-in"}
            size={30}
            color="white"
          />
        </TouchableOpacity>
      ) : null}

      {calendarVisible && (
        <CalendarModal
          setCalendarVisible={setCalendarVisible}
          calendarVisible={calendarVisible}
          range={range}
          setRange={setRange}
          onConfirm={onConfirm}
          getOrders={getOrdersByDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
      )}
      <ConfirmPickedUp
        pikedUpOrders={pikedUpOrders}
        setModalVisible={setModalVisible}
        modalVisible={modalVisible}
        selectedItems={selectedItems}
      />
      {isLoading && <LoadingModal loading={isLoading} />}
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
