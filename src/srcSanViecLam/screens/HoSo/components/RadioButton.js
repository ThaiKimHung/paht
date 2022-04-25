
import React, { useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import TextApp from '../../../../../components/TextApp'
import { colorsSVL, colors } from '../../../../../styles/color'
import { reText } from '../../../../../styles/size'

const RadioButton = (props) => {
    const { data, keyValue = '', style, CallBack, defaultvalue = '' } = props
    const [check, setCheck] = useState(defaultvalue)

    const Get_Item = (item, index) => {
        CallBack(item[keyValue])
        setCheck(item[keyValue])
    }
    return (
        <View style={{ flexDirection: 'row' }}>
            {data?.map((item, index) => {
                return (
                    <TouchableOpacity
                        key={index}
                        onPress={() => Get_Item(item, index)}
                        style={{ alignItems: 'center', flexDirection: 'row', marginRight: 10 }}
                    >
                        <View style={{
                            width: 20, height: 20, borderWidth: 1, borderColor: colors.grayLight,
                            borderRadius: 30,
                            alignItems: 'center', justifyContent: 'center'
                        }}>
                            {check === item[keyValue] &&
                                <View style={{
                                    width: 12, height: 12, backgroundColor: colorsSVL.blueMainSVL,
                                    borderRadius: 12
                                }} />
                            }
                        </View>
                        <TextApp style={{ marginLeft: 10, fontSize: reText(14) }}>{item[keyValue]}</TextApp>
                    </TouchableOpacity>
                )
            })}

        </View>
    )
}

export default RadioButton

const styles = StyleSheet.create({})
