import React, { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";
import { View, TextInput, Animated, Text, StyleSheet, Platform, TouchableOpacity } from "react-native";
import { colors, } from "../../styles";

import PropTypes from 'prop-types';

const InputRNCom = forwardRef((props, ref) => {
    const [isFoCus, setisFoCus] = useState(false)
    const {
        styleContainer,
        styleBodyInput,
        styleLabel,
        styleInput,
        styleError,
        styleHelp,
        placeholderTextColor,
        labelText,
        errorText,
        helpText,
        valid,
        prefix,
        sufix,
        prefixlabel,
        sufixlabel,
        borderStyle,
        // onChangeText,
        ...orther
    } = props;
    const onFocus = () => {
        props.onFocus()
        setisFoCus(true)
    }
    const onBlur = () => {
        props.onBlur()
        setisFoCus(false)
    }
    return (
        <View style={[{
            flexDirection: 'column', width: '100%', alignSelf: 'center',backgroundColor: colors.white,
        }, styleContainer]}>
            <View style={{ flexDirection: 'row' }}>
                <>{prefixlabel}</>
                <Text style={[{ paddingVertical: 5 }, styleLabel]}>
                    {labelText}
                </Text>
                <>{sufixlabel}</>
            </View>

            <View style={[{
                flexDirection: 'row',
                justifyContent: 'center', paddingVertical: 5,
                borderWidth: isFoCus ? 1 : 0.5
            }, styleBodyInput]}>
                <>{prefix}</>
                <TextInput
                    ref={ref}
                    {...orther}
                    style={[{ paddingVertical: 0, flex: 1, paddingHorizontal: 5 }, styleInput]}
                    placeholderTextColor={placeholderTextColor}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    // onChangeText=
                    onEndEditing={() => { }}
                />
                <>{sufix}</>
            </View>
            {valid == false && errorText ?
                <View style={{
                    flex: 1, flexDirection: 'column',
                    paddingVertical: 5,
                }}>
                    <Text style={[{ color: colors.redStar }, styleError]}>{errorText}</Text>
                </View> : helpText ? <View style={{
                    flex: 1, flexDirection: 'column',
                    paddingVertical: 5,
                }}>
                    <Text style={[{ color: colors.black_50 }, styleHelp]}>{helpText}</Text>
                </View> : null
            }

        </View>

    )

})
InputRNCom.propTypes = {
    styleContainer: PropTypes.object,
    styleBodyInput: PropTypes.object,
    styleLabel: PropTypes.object,
    styleInput: PropTypes.object,
    styleError: PropTypes.object,
    styleHelp: PropTypes.object,
    placeholderTextColor: PropTypes.string,
    labelText: PropTypes.string,
    errorText: PropTypes.string,
    helpText: PropTypes.string,
    valid: PropTypes.bool,
    prefix: PropTypes.node,
    sufix: PropTypes.node,
    prefixlabel: PropTypes.node,
    sufixlabel: PropTypes.node,
    onChangeText: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func
};
InputRNCom.defaultProps = {
    styleContainer: {},
    styleBodyInput: {},
    styleLabel: {},
    styleInput: {},
    styleError: {},
    styleHelp: {},
    placeholderTextColor: 'Placehoder',
    labelText: '',
    errorText: '',
    helpText: '',
    valid: true,
    prefix: null,
    sufix: null,
    prefixlabel: null,
    sufixlabel: null,
    // onChangeText: (val) => { }
    onFocus: () => { },
    onBlur: () => { }
};

export default InputRNCom;


