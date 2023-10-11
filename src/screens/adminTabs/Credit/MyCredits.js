import React, { useEffect, useState, useCallback } from "react";
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
import {
  useGetMyOrderMutation,
  useGetOrdersMutation,
  useMyCreditOrdersMutation,
} from "../../../redux/api/api";
import { useIsFocused } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { showMessage } from "react-native-flash-message";
import EditOrder from "../../../components/EditOrder";
import LoadingModal from "./../../../components/LoadingModal";
import CalendarModal from "../../../components/CalendarModal";
import { formatDate } from "../../../constant/dateYYYYMMDD";

const MyCredits = (props) => {

  const currentDate = new Date();
  const startOfDay = new Date(currentDate);
  startOfDay.setHours(0, 0, 0, 0); // Set to 12:00:00 AM
  const endOfDay = new Date(currentDate);

  const { navigation } = props;
  const windowWidth = Dimensions.get("window").width;
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [range, setRange] = useState({
    END_DATE: "End Date",
    START_DATE: " Start Date",
  });

  const [skip, setSkip] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [endData, setEndData] = useState(true)

 
  const [apiCall, {data , isSuccess, isError, isLoading, error }] = useMyCreditOrdersMutation();
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
    setSkip(0)
    setItems([])
    getOrders();
    setRefreshing(false);
  }, []);

  const textBoxWidth = 0.3;
  
  const renderItem = useCallback(({ item, index }) => {
    return (
      <>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(navigationStrings.ADMINAPPROVECREDIT, { item });
          }}
          className={` my-2 mx-4 w-fit p-2 rounded-lg h-60 ${item.isSelected ? "  bg-orange-100" : " bg-white"
            }`}
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
              className={`flex-row px-5 py-2 rounded-full items-center ${item.isSelected ? "bg-white" : "bg-slate-200/50"
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
              className={`flex-row px-5 py-2 rounded-full items-center ${item.isSelected ? "bg-white" : "bg-slate-200/50"
                }`}
            >
              <FontAwesome5 name={"phone"} size={20} color="#FF7754" />
              <Text className="pl-3">{item.mobile}</Text>
            </View>
          </View>

          <View className="flex-row  gap-2">
            <View
              style={{ marginBottom: 4 }}
              className={`flex-row px-5 py-2 rounded-full items-center ${item.isSelected ? "bg-white" : "bg-slate-200/50"
                }`}
            >
              <Entypo name={"clipboard"} size={20} color="#FF7754" />
              <Text className="pl-3">{item.billNo}</Text>
            </View>
            <View
              style={{ marginBottom: 4 }}
              className={`flex-row px-5 py-2 rounded-full items-center ${item.isSelected ? "bg-white" : "bg-slate-200/50"
                }`}
            >
              <FontAwesome5 name={"shopping-bag"} size={20} color="#FF7754" />
              <Text className="pl-3">{item.totalBags}</Text>
            </View>
            <View
              style={{ marginBottom: 4 }}
              className={`flex-row px-5 py-2 rounded-full items-center ${item.isSelected ? "bg-white" : "bg-slate-200/50"
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
              className={`flex-row px-5 py-2 rounded-full items-center ${item.isSelected ? "bg-white" : "bg-slate-200/50"
                }`}
            >
              <Octicons name={"home"} size={20} color="#FF7754" />
              <Text className="pl-3  text-[#444262]">{item.address}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </>
    );
  }) 

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
    console.log(skip , "INside gte")
    if (userData.role === "Admin") {
      response = await apiCall({
        body: { END_DATE: endDate, START_DATE: startDate , skip , orderStatus : "all" },
        token,
      });
      setSkip(skip + 20);
    }

  };

  const loadMoreData = async () => {
    if (isLoading || isLoadingMore) return; // Prevent multiple requests
    setIsLoadingMore(true); // Set loading flag/ Increase skip by the desired limit
    await getOrders();
    setSkip(skip + 20)
    setIsLoadingMore(false); // Clear loading flag
  };

  useEffect(() => {
    if (isLoading || isLoadingMore) return;
    getOrders()
  }, [0]);


useEffect(()=>{
  if(isSuccess){

    if (data.data) {
      if (data.data.length === 0) {
        setEndData(false)
      }
      setItems((prevData) => [...prevData, ...data.data]);
    }
  }
},[isSuccess])

useEffect(()=>{
  if(isError){
    if(error.data){
      showMessage({message : error.data.message , type : "danger"})
    }else{
      showMessage({message : error.data.message , type : "danger"}) 
    }
  }
},[isError])












  return (
    <View className="flex-1 bg-[#F8F8FE] ">

    
      {
        <FlatList
          data={isSelectedAdded}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          // refreshControl={
          //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          // }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onEndReached={loadMoreData}
          onEndReachedThreshold={0.5}
        />
      }
      
      

      { isLoading && skip === 0 && <LoadingModal loading={isLoading} />}
      {/* {calendarVisible && (
        <CalendarModal
          setCalendarVisible={setCalendarVisible}
          calendarVisible={calendarVisible}
          range={range}
          setRange={setRange}
          onConfirm={onConfirm}
          getOrders={getOrders}
        />
      )} */}
    </View>
  );
};
//#c5d8e7
//#0081CD
export default MyCredits;
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
