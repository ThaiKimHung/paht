import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import FONT from './Font';
import Fit from './Fit';
import Color from './Color';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Utils from '../../../../app/Utils';

const TextField = props => {
    const [isFocus, setFocus] = useState(false);
    const _onFocus = () => setFocus(true);
    const _onBlur = () => setFocus(false);

    const _onChangeText = (text) => {
        if (props.route && !!props.onChangeText) {
            props.onChangeText(props.route, text);
        } else if (!!props.onChangeText) {
            props.onChangeText(text);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.innerView(props, isFocus)}>
                <TextInput
                    style={styles.input(props.disabled)}
                    onChangeText={_onChangeText}
                    value={props.value}
                    keyboardType={props.keyboardType}
                    placeholder={props.placeholder || ''}
                    onSubmitEditing={props.onSubmitEditing}
                    editable={!props.disabled}
                    onFocus={_onFocus}
                    onBlur={_onBlur}
                />
            </View>
            <Text style={styles.headerTitle(props, isFocus)}>{props.title}{props.required ?
                <Text style={{ color: Color.danger }}> *</Text> : null}</Text>
            <Text style={styles.errorTitle}>{props.error ? props.errorTitle : ' '}</Text>
        </View>
    );
};

export const MenuPicker = props => {

    const onMenuPress = () => {
        if (props.onPress) {
            props.onPress();
        } else {
            Utils.navigate('ModalMenuPicker', {
                title: props.title,
                dataList: props.dataList,
                selected: props.selected.key,
                preRouteName: props.currentRouteName,
                routeState: props.routeState,
            });
        }
    };

    return (
        <View style={styles.container}>
            {props.disabled ?
                <View style={styles.innerView(props)}>
                    <Text numberOfLines={1}
                        style={styles.pickerContent(!props.value, true)}
                    >
                        {props.value || props.placeholder}
                    </Text>
                    <Icon name={'menu-down'} size={24} color={Color.gray50} />
                </View>
                :
                <TouchableOpacity onPress={onMenuPress} style={styles.innerView(props)}>
                    <Text numberOfLines={1}
                        style={styles.pickerContent(!props.value)}>{props.value || props.placeholder}</Text>
                    <Icon name={'menu-down'} size={24} color={Color.gray100} />
                </TouchableOpacity>
            }

            <Text style={styles.headerTitle(props)}>{props.title}{props.required ?
                <Text style={{ color: Color.danger }}> *</Text> : null}</Text>
            <Text style={styles.errorTitle}>{props.error ? props.errorTitle : ' '}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 80,
        paddingVertical: 5,
        paddingTop: 7,
    },
    innerView: (props, isFocus) => ({
        flexDirection: 'row',
        alignItems: Fit.center,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: props.error ? Color.red : isFocus ? Color.primary : Color.gray50,
        flex: 1,
        paddingHorizontal: 12,
        paddingTop: 5,
    }),
    headerTitle: (props, isFocus) => ({
        fontFamily: FONT.fontFamily,
        fontSize: FONT.small,
        color: props.error ? Color.red : isFocus ? Color.primary : Color.gray100,
        paddingHorizontal: 5,
        position: Fit.absolute,
        backgroundColor: Color.white,
        left: 16,
        top: 0,
    }),
    input: isDisabled => ({
        padding: 0,
        flex: 1,
        fontFamily: FONT.fontFamily,
        fontSize: FONT.medium,
        height: 32,
        color: isDisabled ? Color.gray70 : Color.black
    }),
    errorTitle: {
        fontFamily: FONT.fontFamily,
        fontSize: FONT.small,
        marginTop: 3,
        color: Color.red,
    },
    pickerContent: (showPlaceHolder, disabled) => ({
        flex: 1,
        fontFamily: FONT.fontFamily,
        fontSize: FONT.medium,
        color: disabled ? Color.gray70 : showPlaceHolder ? Color.gray100 : Color.black
    })
});

export default TextField
