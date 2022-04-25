import React from "react";
import {
  TextInput,
  StyleSheet,
  Platform,
  Text,
  View,
  Image
} from "react-native";
import { colors, sizes, nstyles } from "../../styles";
const InputCus = props => {
  const {
    // onChange = () => {},
    customStyle,
    placeholderTextColor = "rgba(0,0,0,0.3)",
    icon = undefined,
    showIcon = false,
    iconStyle = {}
  } = props;
  // const handleOnChange = (text) => () => {
  // 	onChange(text);
  // };
  if (showIcon) {
    return (
      <View
        style={[
          styles.viewBorderRadius,
          nstyles.nstyles.nrow,
          { alignItems: "center" },
          customStyle
        ]}
      >
        <Image
          source={icon}
          style={[nstyles.nstyles.nIcon16, iconStyle]}
          resizeMode={"contain"}
        />
        <TextInput
          {...props}
          underlineColorAndroid={"transparent"}
          style={{ paddingVertical: 0, flex: 1 }}
          // onChangeText={onChange}
          placeholderTextColor={placeholderTextColor}
        />
      </View>
    );
  } else
    return (
      // <View style={[ styles.viewBorderRadius, nstyles.nstyles.nrow, { alignItems: 'center' }, customStyle ]}>
      // 	<TextInput
      // 		{...props}
      // 		underlineColorAndroid={'transparent'}
      // 		style={[ styles.viewBorderRadius, customStyle ]}
      // 		onChangeText={handleOnChange}
      // 		placeholderTextColor={placeholderTextColor}
      // 	/>
      // </View>
      <TextInput
        {...props}
        underlineColorAndroid={"transparent"}
        style={[styles.viewBorderRadius, customStyle]}
        placeholderTextColor={placeholderTextColor}
      />
    );
};
const styles = StyleSheet.create({
  viewBorderRadius: {
    borderRadius: 24,
    textAlign: "center",
    paddingHorizontal: 20,
    backgroundColor: colors.white,
    marginTop: 10,
    fontSize: sizes.sizes.sText16,
    color: "rgba(0,0,0,0.6)",
    ...Platform.select({
      ios: {
        paddingVertical: 13
      },
      android: {
        paddingVertical: 9
      }
    })
  }
});
export default InputCus;
