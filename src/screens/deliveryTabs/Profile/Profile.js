import { View, Text, Pressable, Image, ScrollView } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import imageConstant from "../../../constant/imageConstant";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import navigationStrings from "../../../constant/navigationStrings";

const Profile = ({navigation}) => {
  const { userData } = useSelector(state => state.user);

const logOut = async () =>{
  navigation.navigate(navigationStrings.LOGINSCREEN)
}
  return (
    <View className=" flex-1 rounded-lg shadow-lg relative pt-20 ">
      <View className="w-full h-full absolute  top-0 opacity-50   overflow-hidden ">
        <Image
          source={imageConstant.bgProfile}
          className="w-full h-1/2 rounded-b-3xl "
          resizeMode="cover"
        />
      </View>
      <View className=" flex-1 z-10">
        <Image
          source={{ uri: userData.avatar }}
          className="w-28 h-28 mx-auto"
        />
        <Text className="font-bold text-lg text-center mt-3 ">
          {userData.userName}
        </Text>
        <Text className="font-semibold  text-center mt-1  text-slate-500">
          {userData.role}
        </Text>
        <View className="w-[85%] h-36 shadow-xl mt-2 bg-white mx-auto rounded-2xl flex-row justify-evenly items-center">
          <View className="text-lg">
            <Text className="text-2xl font-extrabold text-green-400">{userData.pendingBalance > 1000 ? userData.pendingBalance/1000 + "K" : userData.pendingBalance}</Text>
          </View>
          {/* <View className="border border-slate-300 h-1/2" /> */}
          {/* <View className="text-lg">
            <Text className="text-2xl font-extrabold text-green-400">{userData.pendingBalance}</Text>
          </View> */}
        </View>
        <View className="px-4 pt-6">
          <View className="flex-row gap-3">
            <MaterialIcons name={"phone"} size={30} color="gray" />
            <Text className="font-semibold text-gray-600 ">
              {" "}
              : {userData.phoneNumber}
            </Text>
          </View>
          <View className="flex-row gap-3 mt-1 ">
            <MaterialIcons name={"location-pin"} size={30} color="gray" />
            <Text className="font-semibold text-gray-600 ">:</Text>
            <View className=" w-[90%]">
              <Text className="font-semibold text-gray-600 leading-6 tracking-wide">
                {" "}
                {userData.address}
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row px-4 absolute bottom-3">
        {/* <Pressable className="border-2 border-[#444262] py-4 rounded-lg  flex-1 mr-2">
            <Text className="text-[#444262] font-semibold text-center">
              Edit profile
            </Text>
          </Pressable> */}
          <Pressable onPress={logOut} className="bg-[#444262] py-4 rounded-lg flex-1 ">
            <Text className="text-white font-semibold text-center ">
              Log out
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default Profile;

{
  /* <View className=" bg-blue-500 w-full h-1/2  rounded-b-3xl overflow-hidden">
<View className=" bg-white w-full flex-1 rounded-b-3xl">
  <Image
    source={{ uri: userData.avatar }}
    className="w-28 h-28 mx-auto"
  />
  <Text className="font-bold text-lg text-center mt-3 ">
    {userData.userName}
  </Text>
</View>
<View className=" flex-row gap-3 px-4 py-3">
  <View className=" bg-green-100 flex-1  py-8 rounded-3xl ">
    <Text>Recived : 3000</Text>
  </View>
  <View className=" bg-green-100 flex-1  py-8 rounded-3xl ">
    <Text>Submitted : 8000</Text>
  </View>
  {/* <View className=" border flex-1 bg-white "></View> */
}
// </View>
// </View>
// <View className="justify-between flex-1 py-4">
// <View className="px-4">
//   <Text>{userData.phoneNumber}</Text>
//   <Text>{userData.address}</Text>
//   <Text>{userData.role}</Text>
// </View>
// <Pressable className="bg-[#0066A2] py-4 rounded-lg mx-20 ">
//   <Text className="text-white font-semibold text-center">Log out</Text>
// </Pressable>
// </View> */}
