import React, { Component } from 'react'
import { Linking, Text, View, TouchableOpacity } from 'react-native'
import Utils from '../../../app/Utils'
import { HeaderCom } from '../../../components'
import { Images } from '../../../src/images'
import { colors } from '../../../styles'
import LottieView from 'lottie-react-native';
import { Width } from '../../../styles/styles'
import { reText } from '../../../styles/size'
import { nGlobalKeys } from '../../../app/keys/globalKey'
import AppCodeConfig from '../../../app/AppCodeConfig'

export class ModalThongBao extends Component {
    constructor(props) {
        super(props);
        this.Link = Utils.getGlobal(nGlobalKeys.LinkWebAdmin, '', AppCodeConfig.APP_ADMIN);
    }
    goWeb = () => {
        Linking.openURL(this.Link);
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: colors.black_30 }}>
                {/* Header */}
                <HeaderCom
                    titleText={'Thông báo'}
                    iconLeft={Images.icBack}
                    onPressLeft={() => Utils.goback(this)}
                    iconRight={null}
                />

                <View style={{ width: Width(100), height: Width(100), marginLeft: -Width(23) }}>
                    <LottieView
                        source={require('../../../src/images/ThongBao.json')}
                        style={{ width: Width(100), height: Width(100) }}
                        loop={true}
                        autoPlay={true}
                    />
                </View>
                <Text style={{
                    marginHorizontal: 15, textAlign: 'center', fontWeight: '500', color: colors.blueG, fontSize: reText(20)
                }}>Vui lòng truy cập website cán bộ để phản hồi góp ý!</Text>
                <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                    <TouchableOpacity onPress={this.Link == '' ? null : () => this.goWeb()}
                        style={{ backgroundColor: colors.blueG, paddingHorizontal: 15, paddingVertical: 10, borderRadius: 5, }}>
                        <Text style={{ color: colors.white, fontSize: reText(14) }}>Truy cập website</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

export default ModalThongBao
