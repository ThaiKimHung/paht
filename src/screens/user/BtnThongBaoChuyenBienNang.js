import React, { useState } from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux'
import Utils, { icon_typeToast } from '../../../app/Utils'
import { colors } from '../../../styles'
import FontSize from '../../../styles/FontSize'
import { reText } from '../../../styles/size'
import { nstyles, Width } from '../../../styles/styles'
import apis from '../../apis'
import { Images } from '../../images'

const BtnThongBaoChuyenBienNang = () => {
    const { userCD, tokenCD } = useSelector(state => state.auth)
    const thongBaoChuyenNang = () => {
        Utils.showMsgBoxYesNoTop("Gửi thông báo chuyển bệnh nặng", "Bạn có chắc muốn gửi thông báo này?", "Xác nhận", "Xem lại", async () => {
            let body = {
                "HoTen": userCD?.CachLy?.HoTen || '',
                "PhoneNumber": userCD?.CachLy?.PhoneNumber || '',
                "DiaChi": userCD?.CachLy?.DiaChiCachLy || ''
            }
            Utils.setToggleLoading(true)
            let res = await apis.apiQuanLyCachLy.NhacNhoBenhNhanChuyenBienNang(body)
            Utils.setToggleLoading(false)
            Utils.nlog('[LOG] thong bao chuyen nang', res, body)
            if (res?.status == 1) {
                Utils.showToastMsg("Thông báo", "Gửi thông báo thành công.", icon_typeToast.success);
            } else {
                Utils.showToastMsg("Thông báo", "Gửi thông báo thất bại", icon_typeToast.warning);
            }
        });
    }
    if (tokenCD.length > 0 && userCD?.CachLy && userCD?.CachLy?.IdRow) {
        return (
            <TouchableOpacity onPress={() => { thongBaoChuyenNang() }} style={{ backgroundColor: 'white' }}>
                <View style={{ flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 15 }}>
                    <Image source={Images.icMenuThongBao} style={[nstyles.nIcon24, {}]} />
                    <Text style={{
                        alignSelf: 'center', flex: 1, marginLeft: 10, fontSize: reText(16), fontWeight: '600', color: colors.redStar
                    }}>{`Thông báo chuyển biến nặng`}</Text>
                    <Image source={Images.icOpenDetail} style={{ alignSelf: 'center' }} />
                </View>
                <View style={{ backgroundColor: colors.black_10, height: 0.5, marginHorizontal: 10 }} />
            </TouchableOpacity>
        )
    } else {
        return null
    }

}

export default BtnThongBaoChuyenBienNang
