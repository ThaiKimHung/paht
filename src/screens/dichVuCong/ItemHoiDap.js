import React, { Component } from 'react'
import { Text, View, TouchableOpacity, Image } from 'react-native'
import { Images } from '../../images'
import { colors } from '../../../styles'
import { reText } from '../../../styles/size'
import { nstyles } from '../../../styles/styles'

export class ItemHoiDap extends Component {
    render() {
        const { item, nthis, onPress } = this.props
        return (
            <TouchableOpacity onPress={onPress} style={{ marginTop: 10, marginHorizontal: 10 }}>
                <View style={[nstyles.shadown, { backgroundColor: colors.white, padding: 8, borderRadius: 5, flexDirection: 'row' }]}>

                    <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: reText(14), textAlign: 'justify' }}>{item.TieuDeHoi ? item.TieuDeHoi : ''}</Text>
                        <View style={{ paddingVertical: 5 }}>
                            <Text style={{ paddingVertical: 2, fontSize: reText(12) }}>Người hỏi: {item.HoVaTen ? item.HoVaTen : ''}</Text>
                            <Text style={{ paddingVertical: 2, fontSize: reText(12) }}>Điện thoại: {item.DienThoai ? item.DienThoai : ''}</Text>
                            <Text style={{ paddingVertical: 2, fontSize: reText(12) }}>Email: {item.Email ? item.Email : ''}</Text>
                        </View>
                    </View>
                    <View style={{ paddingLeft: 5 }}>
                        <Image source={Images.icDatCauHoi} style={nstyles.nIcon40} />
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

export default ItemHoiDap
