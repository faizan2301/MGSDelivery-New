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
  ScrollView,
  RefreshControl,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import LinearGradient from "react-native-linear-gradient";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Icons from "react-native-vector-icons/MaterialCommunityIcons";
import Entypo from "react-native-vector-icons/Entypo";
import AntDesign from "react-native-vector-icons/AntDesign";
import Octicons from "react-native-vector-icons/Octicons";
import navigationStrings from "../../../constant/navigationStrings";
import { statusArray } from "../../../constant/constantArray";
import {
  useGetMyOrderMutation,
  useGetOrdersMutation,
} from "../../../redux/api/api";
import { useIsFocused } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { showMessage } from "react-native-flash-message";
import EditOrder from "../../../components/EditOrder";
import LoadingModal from "./../../../components/LoadingModal";
import CalendarModal from "../../../components/CalendarModal";
import { formatDate } from "../../../constant/dateYYYYMMDD";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Home = (props) => {

  const currentDate = new Date();
  const startOfDay = new Date(currentDate);
  startOfDay.setHours(0, 0, 0, 0); // Set to 12:00:00 AM
  const endOfDay = new Date(currentDate);

  console.log("rerendering")
  const { navigation } = props;
  const windowWidth = Dimensions.get("window").width;
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [range, setRange] = useState({
    END_DATE: "End Date",
    START_DATE: " Start Date",
  });
  const [edit, setEdit] = useState();
  const [filterOrder, setFilterOrder] = useState("pending");
  const [apiCall, { isError, isLoading, error }] = useGetOrdersMutation();
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
    setRefreshing(true);
    getOrders();
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
      }
    }

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
 navigation.navigate(navigationStrings.ADMINORDERDETAILS, { item });
          }}
          // onLongPress={()=> navigation.navigate(navigationStrings.ADMINEDITORDER,{item })}
          onPress={() => filterOrder === "pending" ? onSelect(item) : navigation.navigate(navigationStrings.ADMINORDERDETAILS, { item }) }
          className={` my-2 mx-4 w-fit p-2 rounded-lg h-60 ${
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

          <View className="flex-row  gap-2">
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
        </TouchableOpacity>
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
      getOrders();
    }
  }, [focused, modalVisible]);
  const getOrders = async (startDate, endDate) => {
    if (startDate) {
      console.log(
        JSON.stringify(startDate)
          .split("T")[0]
          .replace('"', "")
          .replace("\\", "")
          .replace('"', "")
      );
    }

    let response;
    setRange({
      END_DATE: formatDate(endDate && formatDate(endDate)),
      START_DATE: formatDate(startDate && formatDate(startDate)),
    });
    setCalendarVisible(false);
    if (userData.role === "Admin") {
      response = await apiCall({
        body: { END_DATE: endDate, START_DATE: startDate },
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
    navigation.navigate(navigationStrings.ASSIGNORDER, selectedItems);
  };

  const onConfirm = React.useCallback(
    ({ startDate, endDate }) => {
      setCalendarVisible(false);
      setRange({ startDate, endDate });
    },
    [calendarVisible, setRange]
  );
  return (
    <View className="flex-1 bg-[#F8F8FE] ">
      {userData.role === "Admin" && (
        <View className="flex-row justify-between p-4">
          <TouchableOpacity className="shadow-2xl bg-red-300 shadow-red-900 rounded-xl overflow-hidden border border-white">
            <LinearGradient
              colors={["#fff", "#E50815"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.linearGradient}
            >
              <FontAwesome name="user-plus" size={40} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity className="bg-green-200 shadow-2xl  shadow-green-900 rounded-xl overflow-hidden border border-white">
            <LinearGradient
              colors={["#fff", "#00755E"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.linearGradient}
            >
              <FontAwesome name="line-chart" size={40} color="#fff" />
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
              {range.START_DATE ? range.START_DATE : "start date "}{" "}
            </Text>
            <Text className="font-bold text-xl text-[#444262]"> - </Text>
            <Text className="text-slate-400 ">
              {range.END_DATE ? range.END_DATE : "- End date"}
            </Text>
          </View>
          <Entypo name="calendar" size={25} color="#444262" />
        </TouchableOpacity>
        <TouchableOpacity className=" shadow-lg shadow-black bg-white rounded-full w-10 h-10 items-center justify-center  ">
          <AntDesign name="reload1" size={25} color="#444262" />
        </TouchableOpacity>
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
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
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
      {modalVisible && (
        <EditOrder
          setModalVisible={setModalVisible}
          modalVisible={modalVisible}
          edit={edit}
          setLoading={setLoading}
          getOrders={getOrders}
        />
      )}

      {loading && <LoadingModal loading={loading} />}
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
