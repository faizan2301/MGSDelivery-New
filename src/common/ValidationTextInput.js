import {StyleSheet, View, Text} from 'react-native';
import React, {useState} from 'react';
import {TextInput} from 'react-native-paper';
export default function ValidationTextInput(props) {
  const [text, setText] = useState();

  const [validationMessage, setValidationMessage] = useState();

  const handleTextChange = input => {
    setText(input);

    if (validationMessage) {
      validate(input);
    }
  };

  const validate = input => {
    const isValid = props.regex.test(input);
    if (!isValid) {
      setValidationMessage(props.validationMessage);
      props.hasError(true);
    } else {
      props.hasError(false);
      setValidationMessage();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.msg}>{validationMessage}</Text>
      <TextInput
        mode="outlined"
        onChangeText={handleTextChange}
        onEndEditing={() => validate(text)}
        value={text}
        activeOutlineColor="green"
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    marginVertical: 4,
  },
  msg: {
    color: 'red',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    alignSelf: 'stretch',
    padding: 8,
  },
});
