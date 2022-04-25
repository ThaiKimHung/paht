import React, { Component } from 'react'
import { Text, View, Image, TouchableOpacity, Platform, ScrollView } from 'react-native'
import AutoHeightWebView from 'react-native-autoheight-webview'
import { isIphoneX } from 'react-native-iphone-x-helper'
import Utils from '../../../app/Utils'
import WebViewCus from '../../../components/WebViewCus'
import { Images } from '../../images'
import { colors } from '../../../styles'
import { reText } from '../../../styles/size'
import { nstyles, paddingTopMul } from '../../../styles/styles'
import { HeaderCus } from '../../../components'

export class ModalGiaCuoc extends Component {
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: colors.BackgroundHome }}>
                <HeaderCus
                    title={'Thông tin giá cước'}
                    styleTitle={{ color: 'white' }}
                    iconLeft={Images.icBack}
                    onPressLeft={() => Utils.goback(this)}
                />
                <View style={{ flex: 1 }}>
                    <WebViewCus
                        source={{ uri: `https://hcconline.vnpost.vn/PriceHCC/Muc_Cuoc_HCC.html` }}
                    />
                </View>
            </View>
        )
    }
}

export default ModalGiaCuoc
