import React, { useState } from "react";
import PropTypes from 'prop-types'
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
import { values } from "lodash";
const InputLogin = props => {
    const [isOnFocus, setIsOnFocus] = useState(
        false
    );
    const [errorText, setErrorText] = useState('')
    const {
        // onChange = () => {},
        customStyle,
        colorUnline = colors.colorBrownLine,
        colorUnlineFoCus = colors.colorBrownLine,
        placeholderTextColor = colors.colorBrownLine,
        icon = undefined,
        showIcon = false,
        iconShowPass = undefined,
        icShowPass = false,
        colorPassOn = colors.colorBrownLine,
        isShowPassOn = false,
        Fcref = () => { },
        iconStyle = {
            backgroundColor: 'transparent',
        },
        styleInput,
        styleFrame,
        styleContainer,
        colorPassOff,
        onCheckError = () => { },
    } = props;

    let color = isOnFocus ? colorUnlineFoCus : colorUnline
    if (errorText && errorText != '' && !isOnFocus) {
        color = '#B00020'
    }
    if (showIcon) {
        return (
            <View>
                <View style={[{
                    flexDirection: 'column', width: '100%', alignSelf: 'center',
                }, styles.viewBorderRadius(color), styleContainer]}>
                    <View style={[{ flexDirection: 'row', alignItems: 'center', padding: 5 }, styleFrame]}>
                        <Image
                            source={icon}
                            style={[nstyles.nstyles.nIcon20,
                            {
                                tintColor: isOnFocus == true || props.value ? colorUnlineFoCus || 'transparent' : colorUnline || 'transparent'
                            }, iconStyle]}
                            resizeMode={"contain"}
                        />
                        <TextInput
                            {...props}
                            ref={Fcref}
                            underlineColorAndroid={"transparent"}
                            style={[{
                                paddingVertical: 5, flex: 1, color: colors.white, paddingLeft: 5,
                                fontWeight: "700", fontSize: 16
                            }, styleInput]}
                            onChangeText={(text) => {
                                props.onChangeText?.(text);
                            }}
                            onBlur={(event) => {
                                if (onCheckError) {
                                    let ErrorText = onCheckError(props.value);
                                    setErrorText(ErrorText)
                                }
                                props.onBlur?.(event)
                            }}
                            placeholderTextColor={placeholderTextColor}
                            onFocus={() => setIsOnFocus(true)}
                            onEndEditing={() => setIsOnFocus(false)}
                        />
                        {
                            icShowPass == true ?
                                <TouchableOpacity onPress={props.setShowPass}><Image
                                    source={iconShowPass}
                                    style={[nstyles.nstyles.nIcon20, iconStyle, isShowPassOn == false ? { tintColor: colorPassOn } : { tintColor: colorPassOff }]}
                                    resizeMode={"contain"}
                                /></TouchableOpacity> : null
                        }
                    </View>
                    {/* <View style={{ height: isOnFocus == true ? 1.5 : 0.5, width: '100%', backgroundColor: isOnFocus == true ? colorUnlineFoCus : colorUnline, justifyContent: 'flex-end' }}>
                </View> */}
                </View>
                {errorText && errorText != '' && !isOnFocus ? <Text style={styles.error}>{errorText}</Text> : null}
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
    viewBorderRadius: (color) => {
        return {
            padding: 3,
            fontSize: sizes.sizes.sText16,
            color: "rgba(0,0,0,0.6)",
            // ...Platform.select({
            //     ios: {
            //         paddingVertical: 13
            //     },
            //     android: {
            //         paddingVertical: 9
            //     }
            // }),
            borderWidth: 1,
            marginVertical: 2.5,
            borderRadius: 5,
            borderColor: color,
        }
    },
    error: {
        fontSize: 12,
        color: '#B00020',
    },
});

InputLogin.propTypes = {
    customStyle: PropTypes.object,
    colorUnline: PropTypes.string,
    colorUnlineFoCus: PropTypes.string,
    placeholderTextColor: PropTypes.string,
    icon: PropTypes.any,
    showIcon: PropTypes.bool,
    iconShowPass: PropTypes.any,
    icShowPass: PropTypes.bool,
    colorPassOn: PropTypes.string,
    isShowPassOn: PropTypes.bool,
    Fcref: PropTypes.func,
    onCheckError: PropTypes.func,
    iconStyle: PropTypes.object,
    styleInput: PropTypes.object,
    styleFrame: PropTypes.object,
    styleContainer: PropTypes.object,
    colorPassOff: PropTypes.string,
}
InputLogin.defaultProps = {
    customStyle: {},
    colorUnline: '',
    colorUnlineFoCus: '',
    placeholderTextColor: '',
    icon: undefined,
    showIcon: false,
    iconShowPass: undefined,
    icShowPass: false,
    colorPassOn: colors.black_50,
    isShowPassOn: false,
    Fcref: () => { },
    iconStyle: {},
    styleInput: {},
    styleFrame: {},
    styleContainer: {},
    onCheckError: () => { },
    colorPassOff: colors.black_50,
};
export default InputLogin;
