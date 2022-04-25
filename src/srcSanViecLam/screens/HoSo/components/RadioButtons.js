import React, { useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import Utils from '../../../../../app/Utils'
import ImageCus from '../../../../../components/ImageCus'
import TextApp from '../../../../../components/TextApp'
import { colorsSVL, colors } from '../../../../../styles/color'
import { reText } from '../../../../../styles/size'
import { ImagesSVL } from '../../../images'

const RadioButtons = (props) => {
    const { data, keyValue = '', style, CallBack = () => { }, defaultValue = '' } = props
    const [check, setCheck] = useState(defaultValue)

    const Get_Item = (item, index) => {
        setCheck(item[keyValue])
        CallBack(item)
    }
    return (
        <View style={[{ flexDirection: 'row' }, style]}>
            {data.map((item, index) => {
                return (
                    <TouchableOpacity
                        key={index}
                        activeOpacity={0.5}
                        onPress={() => {
                            Get_Item(item, index)
                        }}
                        key={index} style={{ flexDirection: 'row', marginRight: 10, alignItems: 'center' }}>
                        <ImageCus source={item[keyValue] === check ? ImagesSVL.icRadioSucces : ImagesSVL.icRadioNone}
                            resizeMode='contain' style={{
                                height: 25, width: 25
                            }}
                        />
                        <TextApp style={{ marginLeft: 10, fontSize: reText(14) }}>{item[keyValue]}</TextApp>
                    </TouchableOpacity>
                )
            })}

        </View>
    )
}

export default RadioButtons

const styles = StyleSheet.create({

})
