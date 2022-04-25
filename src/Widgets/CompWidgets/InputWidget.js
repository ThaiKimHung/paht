import { View, Text, StyleSheet, Platform } from 'react-native'
import React from 'react'
import TextApp from '../../../components/TextApp'
import TextInputApp from '../../../components/TextInputApp'
import { colorsWidget } from '../../../styles/color'
import PropTypes from 'prop-types'

const InputWidget = (props) => {
    const {
        label = 'Label',
        styleInput,
        styleLabel,
        required,
        valueRequired,
        styleValueRequired
    } = props
    const renderRequired = () => <TextApp style={[stInputWidget.valueRequired, styleValueRequired]} numberOfLines={1}>{required && valueRequired ? valueRequired : required ? '*' : ''}</TextApp>
    return (
        <View style={props.style}>
            {label == '' ? null : <TextApp style={[stInputWidget.label, styleLabel]} numberOfLines={1}>{label} {renderRequired()}</TextApp>}
            <TextInputApp
                refInput={props?.refInput}
                {...props}
                placeholder={props?.placeholder || 'Placehoder'}
                style={[stInputWidget.input, styleInput]}
                placeholderTextColor={colorsWidget.placeholderInput}
            />
        </View>
    )
}

const stInputWidget = StyleSheet.create({
    input: {
        padding: Platform.OS == 'android' ? 5 : 10,
        paddingVertical: Platform.OS == 'android' ? 6 : 12,
        marginTop: 5,
        borderRadius: 6,
        backgroundColor: colorsWidget.grayDropdown,
    },
    label: {
        color: colorsWidget.labelInput, marginTop: 5
    },
    valueRequired: {
        color: colorsWidget.labelInput
    }
})

InputWidget.propTypes = {
    label: PropTypes.string,
    styleInput: PropTypes.object,
    styleLabel: PropTypes.object,
    required: PropTypes.bool,
    valueRequired: PropTypes.string,
    styleValueRequired: PropTypes.object,
    style: PropTypes.object,
    refInput: PropTypes.any,
}
InputWidget.defaultProps = {
    label: 'Label',
    styleInput: {},
    styleLabel: {},
    required: false,
    valueRequired: '',
    styleValueRequired: {},
    style: {},
    refInput: () => { }
};

export default InputWidget