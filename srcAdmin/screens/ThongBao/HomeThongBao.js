import React, { Component } from 'react'
import { Text, View } from 'react-native'
import Utils from '../../../app/Utils'
import { HeaderCom } from '../../../components'
import { Images } from '../../../src/images'
import { ThongBaoCD } from '../../../src/screens/Home/Thongbao/ThongBaoCD'
import { colors } from '../../../styles'

export class HomeThongBao extends Component {
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: colors.BackgroundHome, }}>
                <HeaderCom
                    styleContent={{ backgroundColor: colors.colorHeaderApp }}
                    titleText={'Thông báo'}
                    iconLeft={Images.icBack}
                    onPressLeft={() => Utils.goscreen(this, 'scHome')}
                    hiddenIconRight={true}
                    nthis={this} />
                <ThongBaoCD nthis={this} isCD={1} />
            </View>
        )
    }
}

export default HomeThongBao
