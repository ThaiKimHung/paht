import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';
import PropTypes from 'prop-types';
import { colors, colorsWidget } from '../../../styles/color';
import { reText } from '../../../styles/size';

export default class ButtonWidget extends Component<TouchableOpacityProps> {

    render() {
        const { colorText, text, style = {}, styleText = {} } = this.props;
        return (
            <TouchableOpacity  {...this.props}
                style={[stButtonWidget.btn, style]}
                activeOpacity={0.5}
            >
                <Text style={[stButtonWidget.text, { color: colorText }, styleText]}>{text}</Text>
            </TouchableOpacity>
        );
    }
}

ButtonWidget.defaultProps = {
    text: undefined,
    colorText: colorsWidget.white
};

ButtonWidget.propTypes = {
    text: PropTypes.string,
    colorText: PropTypes.string
};


const stButtonWidget = StyleSheet.create({
    btn: {
        backgroundColor: colorsWidget.main, paddingVertical: 12, borderRadius: 10
    },
    text: {
        width: '100%', textAlign: 'center', fontWeight: 'bold', fontSize: reText(14)
    }

})

