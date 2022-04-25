import React, { Component } from 'react'
import { Text, TouchableOpacity, View, StyleSheet, Image } from 'react-native'
import HtmlViewCom from '../../../components/HtmlView'
import { colors } from '../../../styles'
import { reText } from '../../../styles/size'
import { nstyles } from '../../../styles/styles'
import { Images } from '../../images'

export class ItemCBCV extends Component {

    render() {
        let { item, onPressItem = () => { }, dataTinhTrang = [] } = this.props
        let trangthai = ''
        if (dataTinhTrang.length > 0) {
            let find = dataTinhTrang.findIndex(e => item.Status_SOS == e.Id)
            if (find != -1) {
                trangthai = dataTinhTrang[find].Status
            }
        }
        return (
            <TouchableOpacity onPress={onPressItem} activeOpacity={0.5} style={[nstyles.shadow, { marginTop: 10, borderRadius: 5 }]}>
                <View style={{ backgroundColor: colors.white, padding: 10, borderRadius: 5 }}>
                    {/* Trạng thái đã xem hay chưa xem if tại view absolute*/}
                    {/* <View style={{
                        position: 'absolute',
                        backgroundColor: 'transparent',
                        borderWidth: 10,
                        borderColor: 'transparent',
                        borderTopColor: 'red',
                        alignSelf: 'flex-end',
                        transform: [{ rotate: '-135deg' }],
                        marginTop: -10,
                        right: -10,
                    }} /> */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: reText(14) }}>{item.HoTen}</Text>
                        <Text style={{ color: colors.redStar, fontSize: reText(14) }}>{item.SDT}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 }}>
                        <Image source={Images.icLocationBlack} style={[nstyles.nIcon20, { tintColor: colors.colorBlueLight }]} resizeMode='contain' />
                        <Text style={{ fontSize: reText(12), color: colors.colorBlueLight, flex: 1 }} numberOfLines={1}>{item.DiaDiem}</Text>
                    </View>
                    <View style={{ minHeight: 60 }}>
                        <HtmlViewCom
                            html={item.MoTa}
                            style={{ height: '100%' }}
                        />
                    </View>
                    {/* <Text style={{ fontSize: reText(12), textAlign: 'justify', minHeight: 60, maxHeight: 60 }} numberOfLines={3}>
                        {item.MoTa}
                    </Text> */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: reText(12), textAlign: 'justify', fontStyle: 'italic' }} numberOfLines={3}>
                            {item.CreatedDate}
                        </Text>
                        <Text style={{ fontSize: reText(12), textAlign: 'justify', color: colors.orangCB, fontWeight: 'bold' }} numberOfLines={3}>
                            {`Trạng thái: ${trangthai}`}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

export default ItemCBCV
