import React, { useEffect, useState, useCallback } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Pressable,
  View,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import LinearGradient from "react-native-linear-gradient";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Icons from "react-native-vector-icons/MaterialCommunityIcons";
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
import { getTodaysDate } from "../../../constant/dateYYYYMMDD";
import { getDateBeforeT } from "../../../common/Functions";

const Home = (props) => {
  const { navigation } = props;

  const windowWidth = Dimensions.get("window").width;
  const focused = useIsFocused();

  //  ==============================   all states  ======================================
  const [items, setItems] = useState([]);
  const [location, setLocation] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so add 1.
  const day = String(currentDate.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;
  console.log("getTodaysDate", getTodaysDate());
  var startDate = `${formattedDate}` + "T00:00:00.000Z";
  var endDate = `${formattedDate}` + "T23:59:59.000Z";
  const [range, setRange] = useState({
    END_DATE: startDate,
    START_DATE: endDate,
  });
  const [filterOrder, setFilterOrder] = useState("ready");

  //  ==============================   Redux Api's  ======================================
  const [apiCall, { isError, isLoading, error }] = useGetOrdersMutation();
  const [piked] = usePikedupMutation();
  const [myOrders] = useGetMyOrderMutation();

  const isPermissionGranted = useSelector(
    (state) => state.cameraPermission.isGranted
  );
  const { token } = useSelector((state) => state.token);
  const { userData } = useSelector((state) => state.user);

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
    console.log("pikedUpOrders");
    setModalVisible(false);
    setLoading(true);
    let orderId = [];
    selectedItems.forEach((data) => orderId.push(data._id));

    // let {
    //   coords: { longitude, latitude },
    // } = await Location.getCurrentPositionAsync({
    //   accuracy: Location.Accuracy.High,
    // });
    let longitude = location?.longitude;
    let latitude = location?.latitude;
    console.log(longitude, latitude);
    if (longitude != null && latitude != null) {
      const pickeStatus = await piked({
        body: { orderId, pickupCords: { latitude, longitude } },
        token,
      });
      console.log(pickeStatus);
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

    setLoading(false);
  };
  const textBoxWidth = 0.3;
  const renderItem = ({ item, index }) => {
    if (filterOrder === "all") {
      // continue
    } else {
      if (filterOrder === "credit" && !item.credit) {
        return null;
      }
      if (filterOrder === "cancel") {
      }

      if (filterOrder === "delivered") {
        if (!item.delivered) return;
      }

      if (filterOrder === "cancelled") {
        if (!item.isCanceled) return;
      }

      if (filterOrder == "pending") {
        if (item.userId) return;
      }
      if (filterOrder === "ready") {
        if (item.dispatched) return;
        if (item.delivered) return;
        if (!item.userId) return;
      }
      // console.log(filterOrder)
      if (filterOrder === "dispatched") {
        if (!item.userId) return;
        if (!item.dispatched) return;
        if (!item.dispatched) return;
        if (item.delivered) return;
      }
    }

    return (
      <>
        {item ? (
          <Pressable
            // onPress={() =>{ navigation.navigate(navigationStrings.DELIVER, { item })  }}
            onPress={() => {
              console.log("item", item);
              !item.dispatched && filterOrder === "ready"
                ? onSelect(item)
                : navigation.navigate(navigationStrings.DELIVER, { item });
            }}
            className={` m-3 p-2 rounded-lg  mx-4 shadow-xl h-60 overflow-auto shadow-black  bg-white  ${
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
              <View
                style={{ marginBottom: 4 }}
                className={`flex-row px-5 py-2 rounded-full items-center ${
                  item.isSelected ? "bg-white" : "bg-slate-200/50"
                }`}
              >
                <FontAwesome5 name={"phone"} size={20} color="#FF7754" />
                <Text className="pl-3">{item.mobile}</Text>
              </View>
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

  const renderFilter = ({ item }) => {
    return userData.role === "Admin" ? (
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
  useEffect(() => {
    if (focused) {
      getOrders(startDate, endDate);
    }
  }, [focused]);
  useEffect(() => {
    getLocation();
  }, [0]);
  const getLocation = async () => {
    await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    }).then((location) => {
      setLocation(location.coords);
      console.log(location);
    });
  };
  const getOrders = async (startDate, endDate) => {
    let response;
    setCalendarVisible(false);
    if (userData.role === "Admin") {
      response = await apiCall({
        body: {
          END_DATE: endDate,
          START_DATE: startDate,
        },
        token,
      });
    } else {
      response = await myOrders({
        body: {
          END_DATE: endDate,
          START_DATE: startDate,
        },
        token,
      });
    }
    if (response.data) {
      if (response.data.success == true) {
        setItems(response.data.data);
      } else {
        showMessage({
          message: error.data.message,
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
  const qrCodeScan = async () => {
    navigation.navigate(
      isPermissionGranted
        ? navigationStrings.SCANQRCODESCREEN
        : navigationStrings.PERMISSIONSCREEN
    );
  };

  const assign = async () => {
    console.log(selectedItems, ">>>>>>>>>>");
    // navigation.navigate(navigationStrings.ASSIGNORDER, selectedItems);
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getOrders(startDate, endDate);
    setRefreshing(false);
  }, []);

  const onConfirm = React.useCallback(
    ({ startDate, endDate }) => {
      setCalendarVisible(false);
      console.log("Calendar", startDate + "YYYY" + endDate);
      setRange({ startDate, endDate });
    },
    [calendarVisible, setRange]
  );

  // ==================================== Destructure ====================================

  return (
    <View className="flex-1 bg-[#F8F8FE] pt-4">
      <View className="flex-row px-2">
        <TouchableOpacity
          onPress={() => setCalendarVisible(true)}
          className=" flex-1 py-2 shadow-lg shadow-black bg-white mb-3 flex-row mx-2 rounded-full items-center justify-between px-4 "
        >
          <View className="flex-row items-center ">
            <Text className="text-slate-400 ">
              {range.START_DATE
                ? getDateBeforeT(range.START_DATE)
                : "Select date"}{" "}
            </Text>
            <Text className="font-bold text-xl text-[#444262]"> - </Text>
            <Text className="text-slate-400 ">
              {range.END_DATE ? getDateBeforeT(range.END_DATE) : "- End date"}
            </Text>
          </View>
          <Entypo name="calendar" size={25} color="#444262" />
        </TouchableOpacity>
        {/* <TouchableOpacity className=" shadow-lg shadow-black bg-white rounded-full w-10 h-10 items-center justify-center  ">
          <AntDesign name="reload1" size={25}
            color="#444262" />
        </TouchableOpacity> */}
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

      {isLoading ? (
        <ActivityIndicator />
      ) : error ? (
        <Text style={{ color: "red", fontSize: 20 }}>
          Error fetching data {error.error}
        </Text>
      ) : (
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
        />
      )}

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
          getOrders={getOrders}
        />
      )}
      <ConfirmPickedUp
        pikedUpOrders={pikedUpOrders}
        setModalVisible={setModalVisible}
        modalVisible={modalVisible}
        selectedItems={selectedItems}
      />
      <LoadingModal loading={loading} />
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
});
