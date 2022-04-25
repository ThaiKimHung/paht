import moment from 'moment'
import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { color } from 'react-native-reanimated'
import { appConfig } from '../../../app/Config'
import Utils from '../../../app/Utils'
import ImageCus from '../../../components/ImageCus'
import TextApp from '../../../components/TextApp'
import { colors } from '../../../styles'
import { colorsSVL } from '../../../styles/color'
import { reText } from '../../../styles/size'
import { nstyles } from '../../../styles/styles'
import { Images } from '../../images'
import { ImagesSVL } from '../images'

const ItemEmployment = (props) => {
    const { data, styleItem, onPress, isList = false } = props
    const thumbnailUrl = data?.Avata ? appConfig.domain + `${data?.Avata}` : ''

    const checkExpires = () => {
        if (data && data?.HanNopHoSo) {
            const check = moment().isBefore(moment(data?.HanNopHoSo, 'DD/MM/YYYY'), 'day')
            if (check) {
                return {}
            } else {
                return { color: colors.redStar }
            }
        }
        return {}
    }

    const Conver_MucLuong = (value = 0) => {
        return parseInt(value).toLocaleString('it-IT') + '';
    }
    Utils.nlog('gia tri data truyen', data)
    return (
        <TouchableOpacity activeOpacity={0.5} onPress={onPress} style={[stItemEmployment.container, styleItem]}>
            {
                !isList && <View style={{ alignItems: 'center', justifyContent: 'center', paddingRight: 10 }}>
                    <ImageCus
                        defaultSourceCus={data?.isChoose ? ImagesSVL.icCheck : ImagesSVL.icUnCheck}
                        style={[nstyles.nIcon20]}
                        resizeMode='contain'
                    />
                </View>
            }
            <ImageCus
                defaultSourceCus={Images.imgViettelTuyenDung}
                source={{ uri: thumbnailUrl }}
                resizeMode={"cover"}
                style={stItemEmployment.contLeft}
                borderRadius={5}
            />
            <View style={stItemEmployment.contRight}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}  >
                    <TextApp style={stItemEmployment.lblTitle}>
                        {data?.TieuDe || 'Không có tiêu đề'}
                    </TextApp>
                    <TextApp style={[stItemEmployment.lblTitle, { color: colorsSVL.blueMainSVL }]}>
                        {data?.StatusKD === 1 ? 'Đã kiểm duyệt' : 'Chưa kiểm duyệt'}
                    </TextApp>
                </View>
                <TextApp style={stItemEmployment.lblAddress}>
                    {data?.DiaChi || 'Đang cập nhật'}
                </TextApp>
                <View style={stItemEmployment.contRow}>
                    <TextApp style={stItemEmployment.lblSalary}>
                        Lương: {data?.MucLuong || (Conver_MucLuong(data?.MucLuongFrom) + '-' + Conver_MucLuong(data?.MucLuongTo)) || 'Đang cập nhật'}
                    </TextApp>
                </View>
                <View style={stItemEmployment.contRow}>
                    <View style={stItemEmployment.contTypeWork}>
                        <TextApp style={stItemEmployment.lblTypeWork}>
                            {data?.TypeTinTuyenDung == 0 ? 'Toàn thời gian' : 'Bán thời gian'}
                        </TextApp>
                    </View>
                    {
                        !data?.IsHienThi && <View style={[stItemEmployment.contTypeWork, { marginLeft: 5 }]}>
                            <TextApp style={stItemEmployment.lblTypeWork}>
                                {'Đã ẩn'}
                            </TextApp>
                        </View>
                    }
                    {
                        data?.HanNopHoSo && <TextApp style={[stItemEmployment.lblDeadLine, checkExpires()]}>
                            Hạn nộp: {data?.HanNopHoSo || 'Đang cập nhật'}
                        </TextApp>
                    }
                </View>
            </View>
        </TouchableOpacity>
    )
}

const stItemEmployment = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: colors.white,
        padding: 10, marginBottom: 2
    },
    contLeft: {
        ...nstyles.nIcon65, borderRadius: 5
    },
    contRight: {
        flex: 1, paddingLeft: 8
    },
    lblTitle: {
        textAlign: 'justify', fontWeight: 'bold'
    },
    lblAddress: {
        fontSize: reText(12), color: colors.grayLight, marginTop: 5
    },
    lblSalary: {
        fontSize: reText(14), color: colorsSVL.organeMainSVL, marginTop: 5, fontWeight: 'bold'
    },
    lblTypeWork: {
        fontSize: reText(11), color: '#828282', paddingHorizontal: 4
    },
    lblDeadLine: {
        fontSize: reText(11), color: '#828282', paddingVertical: 3, marginTop: 5, flex: 1, textAlign: 'right'
    },
    contRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    contTypeWork: { paddingHorizontal: 5, paddingVertical: 3, backgroundColor: colors.BackgroundHome, borderRadius: 10, marginTop: 5 }
})

export default ItemEmployment
