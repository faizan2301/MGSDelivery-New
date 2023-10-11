import React, { useState } from "react";
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    Image,
} from "react-native";

function SendCreditRequeist({selectAdmin , item, modalVisible, setModalVisible, sendRequeist }) {
    console.log(selectAdmin)

    return (
        <View className="flex-1 items-center justify-center ">
            <Modal
                animationType="slide"
                transparent={true}
                // visible={openList}
                visible={modalVisible}
                // visible={true}
                onRequestClose={() => {
                    //   setModalVisible(false);
                }}
            >
                <View className="flex-1  bg-black/50">

                    <View className={`bg-white w-full absolute bottom-0 justify-between rounded-lg py-4  duration-500 px-3  ${"h-52"}`}>
                        <Text className="text-xl  text-center text-[#444262]">Credit</Text>
                        <Text className=" text-lg font-light text-center text-[#444262]">Sending a credit approval request to <Text className="font-normal">{selectAdmin?.userName}</Text></Text>
                        <View className="flex-row gap-3">
                            <TouchableOpacity onPress={()=> setModalVisible(false)} className="mt-4 flex-1 bg-[#FF7754] mx-auto py-4 px-10  rounded-md">
                                <Text className="text-center text-white font-medium ">
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={sendRequeist} className="mt-4 flex-1 border border-[#444262] mx-auto py-4 px-10  rounded-md">
                                <Text className="text-center text-[#444262] font-medium ">
                                    Request
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    openButton: {
        backgroundColor: "blue",
        padding: 10,
        borderRadius: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    closeButton: {
        marginTop: 10,
        backgroundColor: "red",
        padding: 10,
        borderRadius: 5,
    },
});

export default SendCreditRequeist;
