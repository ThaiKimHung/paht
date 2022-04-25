import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';
import PropTypes from 'prop-types';
import { colorsSVL } from '../../../styles/color';
import { reText } from '../../../styles/size';

export default class ButtonSVL extends Component<TouchableOpacityProps> {

    render() {
        const { colorText, text, style = {}, styleText = {} } = this.props;
        return (
            <TouchableOpacity  {...this.props}
                style={[stButtonSVL.btn, style]}
                activeOpacity={0.5}
            >
                <Text style={[stButtonSVL.text, { color: colorText }, styleText]}>{text}</Text>
            </TouchableOpacity>
        );
    }
}

ButtonSVL.defaultProps = {
    text: undefined,
    colorText: colorsSVL.white
};

ButtonSVL.propTypes = {
    text: PropTypes.string,
    colorText: PropTypes.string
};


const stButtonSVL = StyleSheet.create({
    btn: {
        backgroundColor: colorsSVL.blueMainSVL, paddingVertical: 10, borderRadius: 4
    },
    text: {
        width: '100%', textAlign: 'center', fontWeight: 'bold', fontSize: reText(14)
    }

})

