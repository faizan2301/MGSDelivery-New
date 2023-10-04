import React from 'react';
import {View, Pressable, Text} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
const Header = ({navigation, title, isBack}) => {
  const onBack = () => {
    navigation.goBack();
  };
  return (
    <View className="flex-row mr-4 w-full justify-between ">
      {isBack ? (
        <Pressable onPress={onBack} className="justify-center items-center">
          <Icon name="angle-left" size={40} color="#1841c7" />
        </Pressable>
      ) : null}

      <View className="self-center">
        <Text className="text-[#444262] text-2xl font-semibold">{title}</Text>
      </View>
      {/* <View className="justify-center items-center p-1">
        <MaterialCommunityIcons name="cart" size={30} color="#1841c7" />
      </View> */}
    </View>
  );
};
export default Header;
