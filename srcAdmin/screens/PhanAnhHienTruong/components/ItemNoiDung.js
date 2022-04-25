import React, { Component } from 'react'
import { Text, View, Platform } from 'react-native'
import { sizes, colors } from '../../../../styles'
import { TextInput } from 'react-native-gesture-handler'
import { TextInputCom } from '../../../../components'

const ItemNoiDung = props => {
    const {
        isTitle = true,
        stConainer = {},
        stTitle = {},
        stContaierTT = {},
        stNoiDung = {},
        textTieuDe = '',
        textNoiDung = '',
        refin = () => { },
    } = props
    return (
        <View style={[{ marginVertical: 10 }, stConainer]}>
            {
                isTitle == true ? <Text style={[{ fontSize: sizes.sizes.sText12, lineHeight: sizes.reSize(16) }, stTitle]}>{textTieuDe}</Text> : null

            }
            <View style={[{
                paddingHorizontal: 5, backgroundColor: colors.colorGrayTwo,
                borderWidth: 0.5, borderColor: colors.brownGreyTwo,
                marginTop: 5, paddingVertical: Platform.OS === 'ios' ? 12.5 : 4.5,
                borderRadius: 2,
            }, stContaierTT]}>
                <TextInput
                    ref={refin}
                    {...props}
                    defaultValue={textNoiDung}
                    underlineColorAndroid='transparent'
                    style={[{
                        paddingVertical: 0, marginVertical: 0, flex: 1,
                        fontSize: sizes.sizes.sText14, lineHeight: sizes.sizes.sText17,

                    }, stNoiDung]}>
                </TextInput>
            </View>
        </View>
    )
}

export default ItemNoiDung
