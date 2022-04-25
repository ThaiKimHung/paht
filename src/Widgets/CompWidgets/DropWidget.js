import { TouchableOpacity, StyleSheet, Image } from 'react-native'
import React from 'react'
import TextApp from '../../../components/TextApp'
import { ImgWidget } from '../Assets'
import { nstyles } from '../../../styles/styles'
import { colors } from '../../../styles'
import { colorsWidget } from '../../../styles/color'

const DropWidget = ({ onPress,
    style,
    value,
    styleValue,
    placeholder,
    styleIcon,
    disabled,
    label = 'Label',
    styleLabel,
    required,
    valueRequired,
    styleValueRequired,
    hideLabel
}) => {
    const renderRequired = () => <TextApp style={[stDropWidget.valueRequired, styleValueRequired]} numberOfLines={1}>{required && valueRequired ? valueRequired : required ? '*' : ''}</TextApp>
    return (
        <>
            {!hideLabel && <TextApp style={[stDropWidget.label, styleLabel]} numberOfLines={1}>{label} {renderRequired()}</TextApp>}
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={onPress}
                style={[stDropWidget.droprow, style]}
                disabled={disabled}
            >
                <TextApp style={[stDropWidget.valueText, styleValue, { color: value ? colorsWidget.textDropdown : colorsWidget.placeholderInput }]} numberOfLines={1}>{value ? value : placeholder}</TextApp>
                <Image source={ImgWidget.icDropWidget} style={[nstyles.nIcon10, styleIcon]} resizeMode='contain' />
            </TouchableOpacity>
        </>
    )
}

const stDropWidget = StyleSheet.create({
    droprow: {
        flexDirection: 'row',
        // backgroundColor: colorsWidget.grayDropdown,
        padding: 10,
        paddingVertical: 12,
        justifyContent: 'space-between',
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: colorsWidget.borderDropdown,
    },
    valueText: {
        color: colorsWidget.textDropdown,
        flex: 1
    },
    valueRequired: {
        color: colorsWidget.labelInput
    },
    label: {
        color: colorsWidget.labelInput,
        marginBottom: 5
    },
})

export default DropWidget