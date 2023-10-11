import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
import { formatDate, getTodaysDate } from "../constant/dateYYYYMMDD";
import CalendarPicker from "react-native-calendar-picker";

function CalendarModal({
  calendarVisible,
  setCalendarVisible,
  getOrders,
  setStartDate,
  setEndDate,
}) {
  // const [startDate, setStartDate] = useState()
  // const [endDate, setEndDate] = useState()

  const onDateChange = (date, type) => {
    if (type === "START_DATE") {
      const startOfDay = new Date(date);
      startOfDay.setUTCHours(0, 0, 0, 0);

      setStartDate(JSON.stringify(startOfDay));
    }
    if (type === "END_DATE") {
      setEndDate(JSON.stringify(date));
    }
  };

  const setDate = () => {
    getOrders("", "", "0");
  };
  return (
    <View className="flex-1 items-center justify-center ">
      <Modal
        // animationInTiming={200}

        animationType="slide"
        transparent={true}
        visible={calendarVisible}
        onRequestClose={() => {
          setCalendarVisible(false);
        }}
      >
        <View className="flex-1  bg-black/50">
          <View className="bg-white w-full rounded-lg py-4 absolute bottom-0">
            <CalendarPicker
              startFromMonday={true}
              allowRangeSelection={true}
              // minDate={minDate}
              maxDate={getTodaysDate()}
              todayBackgroundColor="#f2e6ff"
              selectedDayColor="#444262"
              selectedDayTextColor="#FFFFFF"
              onDateChange={onDateChange}
            />

            <View className="flex-row gap-3 justify-center mt-4 px-5">
              <TouchableOpacity
                className="border border-[#444262] flex-1 py-2 rounded-lg"
                onPress={() => setCalendarVisible(false)}
              >
                <Text className="font-semibold text-[#444262] text-center">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-[#444262] flex-1 py-2 rounded-lg"
                onPress={setDate}
                // onPress={onConfirm}
              >
                <Text className="text-white font-semibold text-center">
                  Apply
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

export default React.memo(CalendarModal);
