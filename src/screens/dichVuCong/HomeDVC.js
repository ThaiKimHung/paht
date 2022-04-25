import React, { Component } from 'react'
import { FlatList, Image, Text, TouchableOpacity, View, Dimensions, Platform } from 'react-native'
import Utils from '../../../app/Utils'
import { Images } from '../../images'
import { colors } from '../../../styles'
import { reText } from '../../../styles/size'
import { nstyles, paddingTopMul } from '../../../styles/styles'

const dataDVC = [
    {
        id: 1,
        name: 'Dịch vụ công',
        icon: Images.icDichVC,
        screen: 'dsdonvi'
    },
    {
        id: 2,
        name: 'Tra cứu hồ sơ',
        icon: Images.icDichVC,
        screen: 'tracucHoSo'
    },
    {
        id: 3,
        name: 'Hỏi đáp trực tuyến',
        icon: Images.icDichVC,
        screen: 'scHoiDapTT'
    },
    {
        id: 4,
        name: 'Tin tức',
        icon: Images.icDichVC,
        screen: 'ManHinh_TinTucDVC'
    },
    {
        id: 5,
        name: 'Thanh toán',
        icon: Images.icDichVC,
        screen: 'scThanhToanDVC'
    }
]
export class HomeDVC extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }
    _renderMenu = ({ item, index }) => {
        return (
            <TouchableOpacity key={index}
                onPress={() => Utils.goscreen(this, item.screen)}
                style={Platform.OS == 'android' ? {
                    padding: 10, justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1, marginTop: 20,
                    backgroundColor: colors.white, borderRadius: 20,
                } : {
                        padding: 10, justifyContent: 'center', alignItems: 'center',
                        flex: 1, marginTop: 20, backgroundColor: colors.white, borderRadius: 20,
                        elevation: 6,
                        shadowOffset: {
                            width: 1,
                            height: 1
                        },
                        shadowRadius: 2,
                        shadowOpacity: 0.5,
                        shadowColor: colors.black_60
                    }}>
                <Image source={item.icon} style={[nstyles.nAva80]} />
                <Text style={{ fontSize: reText(16), marginTop: 5 }}> {item.name} </Text>
            </TouchableOpacity>
        )
    }
    render() {
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: colors.BackgroundHome, }]}>
                <View style={[nstyles.nrow, {
                    alignItems: 'center', backgroundColor: colors.colorTextSelect, paddingTop: paddingTopMul() + 10, paddingBottom: Platform.OS == 'android' ? 10 : 0,
                    justifyContent: 'space-between', paddingHorizontal: 15
                }]} >
                    <View style={[nstyles.nIcon35, nstyles.nmiddle]}>
                        <TouchableOpacity
                            style={{}}
                            onPress={() => Utils.goscreen(this, 'ManHinh_Home')}>
                            <Image
                                source={Images.icBack}
                                resizeMode='contain'
                                style={[nstyles.nIcon20, { tintColor: colors.white, }]} />
                        </TouchableOpacity>
                    </View>
                    <Text numberOfLines={1} style={{ fontSize: reText(16), fontWeight: '600', color: colors.white, }}>{`DỊCH VỤ CÔNG`}</Text>
                    <View style={{ width: 35 }}></View>
                </View >
                <View style={[nstyles.nbody, nstyles.nmiddle]}>
                    <FlatList
                        data={dataDVC}
                        renderItem={this._renderMenu}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
            </View>
        )
    }
}

export default HomeDVC
