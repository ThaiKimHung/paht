import React, { useState } from "react";
import {
    TextInput,
    StyleSheet,
    Platform,
    Text,
    View,
    Image,
    TouchableOpacity
} from "react-native";
import { colors, sizes, nstyles } from "../../styles";
import { Colors } from "react-native/Libraries/NewAppScreen";
const InputL = props => {
    const [isOnFocus, setIsOnFocus] = useState(
        false
    );
    const {
        // onChange = () => {},

        customStyle,
        colorUnline = '#fff',
        colorUnlineFoCus = '#fff',
        placeholderTextColor = "#fff",
        icon = undefined,
        showIcon = false,
        iconShowPass = undefined,
        icShowPass = false,
        colorPassOn = '#fff',
        isShowPassOn = false,
        showUnline = false,
        Fcref = () => { },
        iconStyle = {
            backgroundColor: 'transparent',
        }
    } = props;

    if (showIcon) {
        return (
            <View style={[{
                flexDirection: 'column', width: '100%', alignSelf: 'center'
            }, styles.viewBorderRadius]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5 }}>
                    <Image
                        source={icon}
                        style={[nstyles.nstyles.nIcon20, iconStyle,]}
                        resizeMode={"contain"}
                    />
                    <TextInput
                        {...props}
                        ref={Fcref}
                        underlineColorAndroid={"transparent"}
                        style={{ paddingVertical: 5, flex: 1, color: '#fff', paddingLeft: 5, fontWeight: "700", fontSize: 16 }}
                        placeholderTextColor={placeholderTextColor}
                        onFocus={() => setIsOnFocus(true)}
                        onEndEditing={() => setIsOnFocus(false)}
                    />
                    {
                        icShowPass == true ?
                            <TouchableOpacity onPress={props.setShowPass}><Image
                                source={iconShowPass}
                                style={[nstyles.nstyles.nIcon20, iconStyle, isShowPassOn == false ? { tintColor: colorPassOn } : {}]}
                                resizeMode={"contain"}
                            /></TouchableOpacity> : null
                    }
                </View>
                {
                    showUnline == true ? <View style={{ height: isOnFocus == true ? 1.5 : 0.5, width: '100%', backgroundColor: isOnFocus == true ? colorUnlineFoCus : colorUnline, justifyContent: 'flex-end' }}></View> : null

                }



            </View>

        );
    } else
        return (
            <View style={{ flexDirection: 'column', justifyContent: 'center', }}>
                <TextInput
                    {...props}
                    ref={Fcref}
                    underlineColorAndroid={"transparent"}
                    style={[styles.viewBorderRadius, customStyle]}
                    placeholderTextColor={placeholderTextColor}
                />
                <View style={{ height: 1, width: '100%', backgroundColor: colorUnline, justifyContent: 'flex-end' }}></View>
            </View>

        );
};
const styles = StyleSheet.create({
    viewBorderRadius: {
        paddingVertical: 10,
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
export default InputLogin;
