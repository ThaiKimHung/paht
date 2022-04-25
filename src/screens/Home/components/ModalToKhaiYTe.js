import React, { Component } from 'react'
import { Text, View } from 'react-native'
import Utils from '../../../../app/Utils';
import { HeaderCus } from '../../../../components';
import AutoHeightWebViewCus from '../../../../components/AutoHeightWebViewCus';
import { colors } from '../../../../styles';
import { nstyles } from '../../../../styles/styles';
import { Images } from '../../../images';
import { isIphoneX } from 'react-native-iphone-x-helper'
import UtilsApp from '../../../../app/UtilsApp';

export default class ModalToKhaiYTe extends Component {
    render() {
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: colors.backgroundModal, }]}>
                <View style={[nstyles.nbody, {}]}>
                    <HeaderCus
                        Sleft={{ width: 18, height: 18, tintColor: colors.white }}
                        iconLeft={Images.icBack}
                        title={UtilsApp.getScreenTitle("Modal_ToKhaiYTe", 'Tờ khai y tế')}
                        styleTitle={{ color: colors.white }}
                        onPressLeft={() => { Utils.goback(this, null); }}
                    />
                    <View style={{ backgroundColor: colors.white, flex: 1, paddingVertical: 10, paddingHorizontal: 15, paddingBottom: isIphoneX() ? 20 : 10 }}>
                        <AutoHeightWebViewCus customStyle={null} customScript={null} source={{ uri: "https://tokhaiyte.vn/" }} scrollEnabled={true} textLoading={'Đang tải nội dung'} />
                    </View>
                </View>
            </View>
        )
    }
}
