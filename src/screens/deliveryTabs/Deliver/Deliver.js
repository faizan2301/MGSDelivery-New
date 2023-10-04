import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  Platform,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as Location from "expo-location";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import Octicons from "react-native-vector-icons/Octicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Entypo from "react-native-vector-icons/Entypo";
import Ionicons from "react-native-vector-icons/Ionicons";
import imageConstant from "../../../constant/imageConstant";
import PaymentOptionModal from "../../../components/PaymentOptionModal";
import VerfyDelivery from "../../../components/VerifyDelivery";
import { useSelector } from "react-redux";
import {
  useCreditOrderMutation,
  useDeliverOrderMutation,
  useGoogledistanceMutation,
  useRefusedToAcceptMutation,
  useCancelMyOrderMutation,
} from "../../../redux/api/api";
import navigationStrings from "../../../constant/navigationStrings";
import { showMessage } from "react-native-flash-message";
import LoadingModal from "../../../components/LoadingModal";
import { useIsFocused } from "@react-navigation/native";
import { getToken } from "../../../common/AsyncStorageFunctions";

const Deliver = ({ navigation, route }) => {
  const { item } = route.params;
  const isFocused = useIsFocused();

  const [openList, setOpenList] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Payment Method");
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refused, setRefused] = useState(false);
  const [creditTo, setCreditTo] = useState("");
  const [amount, setAmount] = useState();
  const [confirmdeliver, setConfirmDeliver] = useState(false);
  const [cancelDelivery, {}] = useCancelMyOrderMutation();
  const [state, setState] = useState({
    pickupCords: {
      // latitude: 19.877493078241613,
      // longitude: 75.38430425942018,
      // latitudeDelta: 0.0922,
      // longitudeDelta: 0.0421,
      // 19.877493078241613, 75.38430425942018
    },
    dropCords: {},
  });

  const { pickupCords, dropCords } = state;

  useEffect(() => {
    const getlocation = async () => {
      if (isFocused) {
        let {
          coords: { longitude, latitude },
        } = await Location.getCurrentPositionAsync({});
        setState({
          pickupCords: {
            latitude: item.pickupCords.latitude,
            longitude: item.pickupCords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          },
          dropCords: {
            longitude,
            latitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          },
        });
      }
    };
    if (item.dispatched && !item.deliverd) {
      getlocation();
    }
  }, [isFocused]);

  //TODO work on refuse to accept the delivery
  const { token } = useSelector((state) => state.token);
  const [
    deliverOrder,
    {
      data: deliverdData,
      error: deliverdError,
      isSuccess: deliverdIsSuccess,
      isError: delivedIsError,
    },
  ] = useDeliverOrderMutation();
  const [
    refusetToAccept,
    {
      data: refuseData,
      error: refuseError,
      isSuccess: refuseIsSuccess,
      isError: refuseIsError,
    },
  ] = useRefusedToAcceptMutation();
  const [credit, { data, isSuccess, isError, error }] =
    useCreditOrderMutation();
  const [
    googledistanceApi,
    { isError: googleIsError, isSuccess: googleIsSucces, error: googleError },
  ] = useGoogledistanceMutation();

  const confirmDelivery = async () => {
    setModalVisible(false);

    const googleData = await googledistanceApi(state);
    console.log(googleData.data.routes[0].distanceMeters, "<><><><>");
    const distance = googleData.data.routes[0].distanceMeters / 1000 || 4;

    if (item.billNo.toLowerCase().startsWith("db")) {
      if (item.credit && item.creditApproved) {
        console.log("inside all db Credit ");
        // approved credit will come here
        deliverOrder({
          body: {
            id: item._id,
            dropCords,
            distance,
            paymentMethod: "Credit",
          },
          token,
        });
      } else {
        console.log("inside all db othes ");
        // other db orders will come here
        deliverOrder({
          body: {
            id: item._id,
            dropCords,
            distance,
            paymentMethod,
            amountRecived: amount,
          },
          token,
        });
      }
    } else {
      console.log("inside all delivery ");
      // cr and all other order will come here
      deliverOrder({
        body: {
          id: item._id,
          dropCords,
          distance,
        },
        token,
      });
    }

    // setModalVisible(false);
    // setLoading(true);
    // let response;
    // const res = await googledistanceApi(state);
    // console.log("res", res.data);
    // const distance = res.data?.routes[0]?.distanceMeters / 1000 || 4
    // console.log(distance);
    // try {
    //   if (distance) {
    //     // check the condition order credit and approved by super admin
    //     if (amount != item.totalAmount) {
    //       showMessage({
    //         message: `Collected amount should be same as bill amount`,
    //         type: "warning",
    //       });
    //     } else {
    //       if (item.credit && item.creditApproved) {
    //         response = await deliverOrder({
    //           body: {
    //             id: item._id,
    //             amountRecived: amount,
    //             dropCords,
    //             distance,
    //             paymentMethod: "Credit",
    //           },
    //           token,
    //         });
    //       }
    //       if (paymentMethod !== "Credit" && !item.credit) {
    //         response = await deliverOrder({
    //           body: {
    //             id: item._id,
    //             amountRecived: amount,
    //             dropCords,
    //             distance,
    //             paymentMethod,
    //           },
    //           token,
    //         });
    //       } else if (paymentMethod === "Credit") {
    //         response = await credit({
    //           body: {
    //             id: item._id,
    //             paymentMethod,
    //           },
    //           token,
    //         });
    //       } else if (refused) {
    //         response = await refusetToAccept({
    //           body: {
    //             id: item._id,
    //           },
    //           token,
    //         });
    //       }
    //     }
    //   } else {
    //     showMessage({
    //       message: ` location dose not found`,
    //       type: "danger",
    //     });
    //   }

    //   if (response?.data) {
    //     navigation.navigate(navigationStrings.DELIVEYBOTTOMTAB);
    //     setLoading(false);
    //     showMessage({
    //       message: ` You have deliverd order succesfully and recived ₹ ${
    //         amount ? amount : 0
    //       }`,
    //       type: "success",
    //     });
    //   } else {
    //     const errorMessage =
    //       response?.error?.data?.message || "Something went wrong";
    //     showMessage({
    //       message: errorMessage,
    //       type: "danger",
    //     });
    //   }

    //   console.log(response);
    // } catch (error) {
    //   console.log(error);
    // }

    // setLoading(false);
  };

  useEffect(() => {
    if (deliverdIsSuccess) {
      navigation.navigate(navigationStrings.DELIVEYBOTTOMTAB);
      showMessage({
        message: ` You have deliverd order succesfully`,
        type: "success",
      });
    }
  }, [deliverdIsSuccess]);

  useEffect(() => {
    if (delivedIsError) {
      if (deliverdError.data) {
        showMessage({
          message: deliverdError.data.message,
          type: "danger",
        });
      } else {
        showMessage({
          message: "Something went wrong in delivery",
          type: "danger",
        });
      }
    }
  }, [delivedIsError]);

  const creditOrderApproval = async () => {
    console.log("inside credit approval");
    //   let response;
    credit({
      body: {
        id: item._id,
      },
      token,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      navigation.navigate(navigationStrings.DELIVEYBOTTOMTAB);
      showMessage({
        message: `You have send credit Approval request`,
        type: "success",
      });
    }
  }, [isSuccess]);
  useEffect(() => {
    if (isError) {
      if (error.data) {
        showMessage({
          message: data?.message,
          type: "danger",
        });
      } else {
        showMessage({
          message: "Credit Approval Internal Error",
          type: "danger",
        });
      }
    }
  }, [isError]);

  const refuseToDeliver = async () => {
    const tokenToUse = token || (await getToken());
    console.log("Inside refuse to accept delivery");

    const body = { id: `${item._id}` };
    const args = { body, token: tokenToUse };

    // console.log(args);

    // const response = await cancelDelivery(args);
    // console.log(response);

    // if (response?.data?.success) {
    //   navigation.goBack();
    // } else {
    //   const errorMessage =
    //     response?.error?.data?.message || "Something went wrong";
    //   showMessage({
    //     message: errorMessage,
    //     type: "danger",
    //   });
    // }
  };

  useEffect(() => {
    if (refuseIsSuccess) {
      navigation.goBack();
      showMessage({
        message: "Order refused",
        type: "success",
      });
    }
  }, [refuseIsSuccess]);

  useEffect(() => {
    if (refuseIsError) {
      if (refuseError?.data) {
        showMessage({
          message: refuseError?.data.message,
          type: "danger",
        });
      } else {
        showMessage({
          message: "Something went wrong while refusing order",
          type: "danger",
        });
      }
    }
  }, [refuseIsError]);

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, paddingBottom: 20 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 bg-white  px-2  py-4">
            <ScrollView
              className="flex-1 bg-[#F4F4FB]   rounded-xl px-4"
              style={{ elevation: 10 }}
              contentContainerStyle={{}}
            >
              {/* <View className="h-1/6 mb-4 -z-20"> */}
              {/* {pickupCords && dropCords && <MapView
                  style={{
                    width: '100%',
                    height: '100%',

                  }}
                  initialRegion={pickupCords}
                >
                  <Marker coordinate={pickupCords} />
                  <Marker coordinate={dropCords} />
                  <MapViewDirections
                    origin={pickupCords}
                    destination={dropCords}
                    strokeWidth={3}
                    strokeColor="green"
                    onReady={(result) => {
                      setDistance(result.distance)
                      console.log(result.distance, "distance between pickup and drop location")
                    }}
                    apikey="AIzaSyDs4xGW-ewXwerL2yz464noy0_p1b7oxFU" />

                </MapView>} */}
              {/* </View> */}

              <View className=" ">
                <Image
                  source={imageConstant.invoice}
                  className="w-20 h-20 self-center mt-4"
                  style={{ tintColor: "#444262" }}
                />
                <Text className="text-center text-2xl font-light border-b my-2 pb-2">
                  * Mahaveer Ghar Sansar *
                </Text>
                <View className="flex-row mt-3 px-4 py-3 rounded-md border items-end">
                  <FontAwesome name={"user"} size={25} color="#444262" />
                  <View className="border border-slate-500 ml-3  h-full" />
                  <Text className=" ml-4 font-medium text-gray-600">
                    {item.name}
                  </Text>
                </View>
                <View className="flex-row mt-3 px-4 py-3 rounded-md border items-end">
                  <FontAwesome5 name={"phone"} size={25} color="#444262" />
                  <View className="border border-slate-500 ml-3  h-full" />
                  <Text className=" ml-4 font-medium text-gray-600">
                    {item.mobile}
                  </Text>
                </View>
                <View className="flex-row mt-3 px-4 py-3 rounded-md border items-end">
                  <Octicons name={"home"} size={25} color="#444262" />
                  <View className="border border-slate-500 ml-3  h-full" />
                  <Text className=" ml-4 font-medium text-gray-600">
                    {item.address}
                  </Text>
                </View>

                <View className="flex-row gap-3 mt-1">
                  <View className="flex-row flex-1 mt-3 px-4 py-3 rounded-md border items-end">
                    <Entypo name={"clipboard"} size={25} color="#444262" />
                    <View className="border border-slate-500 ml-3  h-full" />
                    <Text className=" ml-4 font-medium text-gray-600">
                      {item.billNo}
                    </Text>
                  </View>

                  <View className="flex-row flex-1 mt-3 px-4 py-3 rounded-md border items-end">
                    <FontAwesome5
                      name={"shopping-bag"}
                      size={25}
                      color="#444262"
                    />
                    <View className="border border-slate-500 ml-3  h-full" />
                    <Text className=" ml-4 font-medium text-gray-600">
                      {item.totalBags}
                    </Text>
                  </View>
                </View>
                <View className="flex-row gap-2 mt-2">
                  <View className="flex-row flex-1 mt-3 px-4 py-3 rounded-md border items-center  ">
                    <FontAwesome5
                      name={"rupee-sign"}
                      size={25}
                      color="#FF7754"
                    />
                    <View className="border border-slate-500 ml-3  h-full" />
                    <Text className=" ml-4 font-medium text-gray-600">
                      {item.totalAmount ? item.totalAmount : "-"}
                    </Text>
                  </View>
                </View>

                {item.dispatched ? (
                  <View>
                    {item?.billNo?.toLowerCase().startsWith("db") && (
                      <View className=" gap-3 mt-1">
                        {paymentMethod !== "Credit" && (
                          <View className="flex-row  px-4 py-3 rounded-md border items-end flex-1 ">
                            <FontAwesome5
                              name={"rupee-sign"}
                              size={25}
                              color="#444262"
                            />
                            <View className="border border-slate-500 ml-3 py-2 h-full" />
                            <TextInput
                              placeholder="Amount to collect"
                              className="px-3"
                              keyboardType="numeric"
                              onChangeText={(text) => setAmount(text)}
                            />
                          </View>
                        )}
                        {!item.credit && !item.creditApproved && (
                          <View className="flex-1 border rounded-md py-3">
                            <TouchableOpacity
                              className="flex-row items-center justify-between w-full px-4  my-auto"
                              onPress={() => setOpenList(!openList)}
                            >
                              <Text className={`text-slate-500 font-medium`}>
                                {paymentMethod} {creditTo && ` to ${creditTo}`}
                              </Text>
                              <Entypo
                                name={!openList ? "chevron-up" : "chevron-down"}
                                size={25}
                                color="#444262"
                              />
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    )}
                    <View className="flex-row gap-3 py-3 ">
                      {paymentMethod === "Credit" ||
                        (!item.delivered && !item.credit && (
                          <Pressable
                            onPress={() => {
                              setRefused(true);
                              setModalVisible(true);
                            }}
                            className="bg-[#444262] px-4 py-3 rounded-md flex-1"
                          >
                            <Text className="text-center font-medium text-white">
                              Refuse
                            </Text>
                          </Pressable>
                        ))}
                      {!item.delivered && (
                        <Pressable
                          onPress={() => {
                            if (
                              item?.billNo?.toLowerCase().startsWith("db") &&
                              !item.credit &&
                              paymentMethod === "Payment Method"
                            ) {
                              showMessage({
                                message: ` Please Select the payment method`,
                                type: "danger",
                              });
                              return;
                            }
                            // check the condition order credit and approved by super admin
                            if (
                              item.billNo.toLowerCase().startsWith("db") &&
                              !item.creditApproved &&
                              amount != item.totalAmount
                            ) {
                              showMessage({
                                message: `Collected amount should be same as bill amount`,
                                type: "warning",
                              });
                              return;
                            }
                            setModalVisible(true);
                          }}
                          className={`px-4 py-3 rounded-md flex-1 ${
                            paymentMethod === "Credit" && !item.credit
                              ? "bg-orange-400"
                              : item.credit && !item.creditApproved
                              ? "bg-red-500 "
                              : item.creditApproved
                              ? "bg-green-500"
                              : "bg-[#444262]"
                          }`}
                        >
                          <Text className="text-center font-medium text-white">
                            {/* { !item.credit ? "Deliver" :  "Awaiting for approval" } */}
                            {paymentMethod === "Credit" && !item.credit
                              ? "Request for credit approval"
                              : item.credit && !item.creditApproved
                              ? "Awaiting approval"
                              : "Deliver"}
                          </Text>
                        </Pressable>
                      )}
                    </View>
                    {openList && (
                      <PaymentOptionModal
                        setPaymentMethod={setPaymentMethod}
                        openList={openList}
                        setOpenList={setOpenList}
                        setCreditTo={setCreditTo}
                      />
                    )}
                  </View>
                ) : (
                  <Pressable
                    onPress={refuseToDeliver}
                    className="bg-[#d52626] px-4 py-3 rounded-md flex-1 my-4"
                  >
                    <Text className="text-center font-medium text-white">
                      Refuse for delivery
                    </Text>
                  </Pressable>
                )}
                {modalVisible && (
                  <VerfyDelivery
                    name={item.name}
                    item={item}
                    setModalVisible={setModalVisible}
                    modalVisible={modalVisible}
                    amount={amount}
                    refused={refused}
                    setRefused={setRefused}
                    refuseToDeliver={refuseToDeliver}
                    confirmDelivery={confirmDelivery}
                    creditOrderApproval={creditOrderApproval}
                    paymentMethod={paymentMethod}
                    paid={item.paid}
                  />
                )}
                {loading && <LoadingModal loading={loading} />}
                <Pressable
                  onPress={() => navigation.goBack()}
                  className="bg-[#FF7754] px-4 py-3 rounded-md flex-1"
                >
                  <Text className="text-center font-medium text-white">
                    Back
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
};

export default Deliver;
