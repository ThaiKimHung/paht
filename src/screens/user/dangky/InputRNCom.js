import React, { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { View, TextInput, Animated, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
// import FontSize from './FontSize';
import { colors } from '../../../../styles';
import FontSize from '../../../../styles/FontSize';
const InputRNCom = forwardRef((props, ref) => {
    const [isFoCus, setisFoCus] = useState(false);
    const {
        styleContainer,
        styleBodyInput,
        styleLabel,
        styleContentLabel,
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
        isDrop,
        onPress,
        colorBorderFocus,
        note,
        isHelpTouchText,
        onPressHelpTouch,
        ...orther

    } = props;
    const onFocus = () => {
        setisFoCus(true);
    };
    const onBlur = () => {
        setisFoCus(false);
    };
    const ViewInput = !isDrop ? <TextInput
        ref={ref}
        {...orther}
        style={[{ paddingVertical: 0, flex: 1, paddingHorizontal: FontSize.scale(5) }, styleInput]}
        placeholderTextColor={placeholderTextColor}
        onFocus={onFocus}
        onBlur={onBlur}
        onEndEditing={() => { }}
    /> : <TouchableOpacity onPress={onPress} style={{ flex: 1, }} >
        <View pointerEvents='none' style={{ flex: 1 }}>
            <TextInput
                ref={ref}
                {...orther}
                style={[{ paddingVertical: 0, flex: 1, paddingHorizontal: FontSize.scale(5) }, styleInput]}
                placeholderTextColor={placeholderTextColor}
                onFocus={onFocus}
                onBlur={onBlur}
                onEndEditing={() => { }}
            />
        </View>
    </TouchableOpacity>


    return (
        <View
            style={[
                {
                    flexDirection: 'column',
                    width: '100%',
                    // alignSelf: 'center',
                },
                styleContainer,
            ]}>
            <View style={[{ flexDirection: 'row', alignItems: 'center' }]}>
                <>{prefixlabel}</>
                <View style={[styleContentLabel, { flexDirection: 'row' }]}>
                    <Text style={[{ paddingVertical: 5 }, styleLabel]}>{labelText}<Text style={{ color: colors.redStar }}>{note ? `${note || `*`}` : ''}</Text></Text>
                </View>
                <>{sufixlabel}</>
            </View>

            <View
                style={[
                    {
                        flexDirection: 'row',
                        justifyContent: 'center',
                        paddingVertical: 0,
                        borderWidth: isFoCus ? 2 : 1,
                    },
                    styleBodyInput,
                    colorBorderFocus && isFoCus ? {
                        borderColor: colorBorderFocus
                    } : {}
                ]}>
                <>{prefix}</>
                {ViewInput}
                <>{sufix}</>
            </View>
            {valid == false && errorText ? (
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'column',
                        paddingVertical: 5,
                    }}>
                    <Text style={[{ color: 'red' }, styleError]}>{errorText}</Text>
                </View>
            ) : helpText ? (
                isHelpTouchText ? <TouchableOpacity
                    onPress={onPressHelpTouch}
                    style={{
                        flexDirection: 'column',
                        paddingVertical: 5,
                    }}>
                    <Text style={[{ color: colors.black_20 }, styleHelp]}>{helpText}</Text>
                </TouchableOpacity> :
                    <View
                        style={{
                            flexDirection: 'column',
                            paddingVertical: 5,
                        }}>
                        <Text style={[{ color: colors.black_20 }, styleHelp]}>{helpText}</Text>
                    </View>
            ) : null}
        </View>
    );
});
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
    styleContentLabel: PropTypes.object,
    colorBorderFocus: PropTypes.string,
    isDrop: PropTypes.bool,
    isHelpTouchText: PropTypes.bool,
};
InputRNCom.defaultProps = {
    styleContainer: {},
    styleContentLabel: {},
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
    colorBorderFocus: null,
    isDrop: false,
    isHelpTouchText: false
    // onChangeText: (val) => { }
};

export default InputRNCom;
