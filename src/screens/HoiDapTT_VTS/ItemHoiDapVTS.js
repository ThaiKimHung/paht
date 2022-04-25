import React, { Component } from 'react'
import { Text, View, TouchableOpacity, Image } from 'react-native'
import { Images } from '../../images'
import { colors } from '../../../styles'
import { reText } from '../../../styles/size'
import { nstyles } from '../../../styles/styles'
import Utils from '../../../app/Utils'
import HtmlViewCom from '../../../components/HtmlView'

export class ItemHoiDapVTS extends Component {

    colorStatus = (item) => {
        if (item?.TrangThai == 1) {
            return "#00C1D2"
        }
        else if (item?.TrangThai == -1) {
            return "#FF3D00"
        }
        else {
            return "#12D91A"
        }
    }
    render() {
        const { item, nthis, onPress, isCaNhan = false, onUpdate } = this.props
        return (
            <TouchableOpacity onPress={onPress} style={{ marginTop: 5, marginHorizontal: 10 }}>
                <View style={[nstyles.shadown, { backgroundColor: colors.white, padding: 8, borderRadius: 5, flexDirection: 'row' }]}>
                    <View style={{ paddingRight: 10 }}>
                        <Image source={Images.icQuestionVTS} style={nstyles.nIcon40} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: reText(14), textAlign: 'justify', flex: 1, paddingRight: 20 }}>{item?.TieuDe ? item.TieuDe : ''}</Text>
                            <View style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, backgroundColor: this.colorStatus(item) + '1A', alignSelf: 'flex-start' }}>
                                <Text style={{ color: this.colorStatus(item), }}>{item?.TrangThai_Text ? item?.TrangThai_Text : ''}</Text>
                            </View>
                        </View>
                        {
                            isCaNhan ? <View style={{ paddingVertical: 5 }}>
                                <HtmlViewCom limitedLine={2} html={item?.NoiDung} style={{ height: 35 }} />
                            </View> :
                                <View style={{ paddingVertical: 5 }}>

                                    <Text style={{ paddingVertical: 2, fontSize: reText(12) }}>Người hỏi: {item?.HoTen ? item.HoTen : ''}</Text>
                                    <Text style={{ paddingVertical: 2, fontSize: reText(12) }}>Điện thoại: {item?.SDT ? Utils.hidePhoneNum(item.SDT, 'x') : ''}</Text>
                                    <Text style={{ paddingVertical: 2, fontSize: reText(12) }}>Email: {item?.Email ? Utils.hideEmail(item.Email, 'x') : ''}</Text>
                                </View>
                        }
                        {isCaNhan && item?.TrangThai == 1 && <TouchableOpacity onPress={onUpdate} style={{ padding: 8, alignSelf: 'flex-end', backgroundColor: '#FFA7001A', borderRadius: 8 }}>
                            <Text style={{ paddingHorizontal: 5, color: '#FFA700', fontWeight: 'bold' }}>{`Cập nhật`}</Text>
                        </TouchableOpacity>}
                    </View>

                </View>
            </TouchableOpacity>
        )
    }
}

export default ItemHoiDapVTS
