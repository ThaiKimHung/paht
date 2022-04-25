import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import ImageCus from '../../../../../components/ImageCus'
import TextApp from '../../../../../components/TextApp'
import { reText } from '../../../../../styles/size'
import { nstyles } from '../../../../../styles/styles'
import { ImagesSVL } from '../../../images'

const RadioCheck = (props) => {
    const { TitleValue = '', style, CallBack = () => { }, valueDefault = false } = props
    const [check, setCheck] = useState(valueDefault)
    const Get_Item = () => {
        CallBack(!check)
        setCheck(!check)
    }
    return (
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={Get_Item}>
            <ImageCus source={!check ? ImagesSVL.icUnCheck : ImagesSVL.icRadioSucces}
                style={nstyles.nIcon22}
            />
            <TextApp style={{ marginLeft: 10, fontSize: reText(14) }} >{TitleValue}</TextApp>
        </TouchableOpacity>
    )
}

export default RadioCheck

const styles = StyleSheet.create({})
