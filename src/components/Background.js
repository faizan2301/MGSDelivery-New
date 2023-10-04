import {
  ImageBackground,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  Dimensions,
  Platform,
} from 'react-native';
import React, {memo} from 'react';
import imageConstant from '../constant/imageConstant';
const BackGround = ({children}) => {
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0;
  return (
    <ImageBackground
      source={imageConstant.bgLogin}
      resizeMode="repeat"
      style={styles.background}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={keyboardVerticalOffset}>
        <ScrollView keyboardShouldPersistTaps="handled">
          {/* <Image source={imageConstant.loginLogo} className="h-28  w-24 mt-6 " /> */}
          <Text className="text-black text-xl mt-12">Welcome!</Text>
          <Text className="text-black text-3xl mt-6 font-bold">Sign in to</Text>

          <Text className="text-black text-xl  mb-4">MGSDelivery app.</Text>
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default memo(BackGround);
const styles = StyleSheet.create({
  background: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    paddingVertical: 20,
  },
  container: {
    marginVertical: 20,
    marginHorizontal: 20,
  },
});
