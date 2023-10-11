import {
    Image,
    StyleSheet,
    Text,
    View,
    FlatList,
    Pressable,
} from "react-native";
import React, { useState } from "react";
import {
    useFindCreditAuthorizedAdminMutation,
    useSendCreditRequiestMutation,
} from "../../../redux/api/api";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { showMessage } from "react-native-flash-message";
import LoadingModal from '../../../components/LoadingModal';
import SendCreditRequeist from "../../../components/SendCreditRequeist";

const CreditAuthorizedAdmin = ({ route, navigation }) => {
    const {item } = route.params
    const { token } = useSelector(state => state.token);
    const [admin, setAdmin] = useState();
    const [selectAdmin, setSlectAdmin] = useState();
    const [modalVisible, setModalVisible] = useState(false);

    const [getCrediAuthorizedAdmin, { data, isSuccess, error, isError, isLoading }] = useFindCreditAuthorizedAdminMutation();
    const [sendRequiest, { data: sendRequestData, isSuccess: sendRequestIsSuccess, error: sendRequestError, isError: sendRequestIsError, isLoading: sendRequestIsLoading }] = useSendCreditRequiestMutation();

    useEffect(() => {
        getCrediAuthorizedAdmin({ body: {}, token });
    }, []);

    useEffect(() => {
        if (isSuccess) {
            if (data.data) {
                setAdmin(data.data)
            }
        }

    }, [isSuccess]);
    useEffect(() => {
        if (isError) {
            if (error.data) {
                showMessage({ message: error.data.message, type: "danger" })
            } else {
                showMessage({ message: "Somthing went wrong while fetching admin data", type: "danger" })
            }
        }
    }, [isError]);

    const sendCreditRequiest = async () => {
        await sendRequiest({
            body: { orderId : item._id, adminId : selectAdmin._id },
            token,
        });
    };

    useEffect(() => {
        if (sendRequestIsSuccess) {
            showMessage({ message: "Credit Approval requiest send successfullys", type: "success" })
            navigation.goBack()
        }
    }, [sendRequestIsSuccess])
    useEffect(() => {
        if (sendRequestIsError) {
            if (sendRequestError.data) {
                showMessage({ message: sendRequestError.data.message, type: "danger" })
            } else {
                showMessage({ message: "Something went wrong while sending requiest", type: "danger" })
            }

        }
    }, [sendRequestIsError])



    const renderItem = ({ item }) => {
        if (!item) return;
        return (
            <>
                <Pressable
                    onPress={() => {
                        setSlectAdmin(item);
                        setModalVisible(true);
                    }}
                    className="bg-white flex-row  items-center py-2 mt-2 rounded-lg px-3"
                >
                    <Image source={{ uri: item?.avatar }} className="w-20 h-20" />
                    <View className="px-3">
                        <Text className="font-semibold">{item?.userName}</Text>
                        <Text className="text-gray-600">{item?.phoneNumber}</Text>
                    </View>
                </Pressable>
            </>
        );
    };
    return (
        <View className="bg-slate-100 flex-1 px-3">
            <FlatList
                data={admin}
                keyExtractor={item => item?._id}
                showsVerticalScrollIndicator={false}
                renderItem={renderItem}
            />
            {isLoading && <LoadingModal loading={isLoading} />}
            {<SendCreditRequeist selectAdmin={selectAdmin} modalVisible={modalVisible} setModalVisible={setModalVisible} sendRequeist={sendCreditRequiest} />}
        </View>
    );
};

export default CreditAuthorizedAdmin;

const styles = StyleSheet.create({});
