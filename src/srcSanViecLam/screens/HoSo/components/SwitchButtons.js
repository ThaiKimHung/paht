import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import Utils from '../../../../../app/Utils'
import ImageCus from '../../../../../components/ImageCus'
import TextApp from '../../../../../components/TextApp'
import { ImagesSVL } from '../../../images'

const SwitchButtons = (props) => {
    const { style = {}, CallBack = () => { }, text, defaultValue = false } = props
    const [on, setOn] = useState(defaultValue)

    useEffect(() => {
        setOn(defaultValue)
        return () => {
            setOn(defaultValue)
        }
    }, [defaultValue])

    const Get_Item = () => {
        CallBack(!on)
        setOn(!on)
    }

    return (
        <TouchableOpacity
            onPress={Get_Item} style={[{ flexDirection: 'row', alignItems: 'center' }, style]} >
            <ImageCus source={on ? ImagesSVL.icSwtichOn : ImagesSVL.icSwitchOff}
                style={{ height: 40, width: 40 }}
                resizeMode='contain'
            />
            <TextApp style={{ marginLeft: 10 }}>{text}</TextApp>
        </TouchableOpacity>
    )
}

export default SwitchButtons

const styles = StyleSheet.create({})
