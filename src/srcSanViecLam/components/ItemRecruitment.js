import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { appConfig } from '../../../app/Config'
import ImageCus from '../../../components/ImageCus'
import TextApp from '../../../components/TextApp'
import { colors } from '../../../styles'
import { colorsSVL } from '../../../styles/color'
import { reText } from '../../../styles/size'
import { nstyles } from '../../../styles/styles'
import { Images } from '../../images'
import common from '../common'
import { ImagesSVL } from '../images'

const ItemRecruitment = (props) => {
    const { data, styleItem, onPress, onPressSave } = props
    const thumbnailUrl = data?.Avata ? appConfig.domain + `${data?.Avata}` : ''

    const handleTextStatus = (status) => {
        if (common.STATUS_PERSONAL.DANHANVIEC.includes(status))
            return 'Đã nhận'
        else if (common.DEFINE_STATUS.PHONGVANKHONGDAU == status)
            return 'Trượt'
        else return 'Từ chối'
    }

    return (
        <TouchableOpacity activeOpacity={0.5} onPress={onPress} style={[stItemRecruitment.container, styleItem]}>
            <ImageCus
                defaultSourceCus={Images.imgViettelTuyenDung}
                source={{ uri: thumbnailUrl }}
                resizeMode={"cover"}
                style={stItemRecruitment.contLeft}
                borderRadius={5}
            />
            <View style={stItemRecruitment.contRight}>
                <TextApp style={stItemRecruitment.lblTitle}>
                    {data?.TieuDe || 'Không có tiêu đề'}
                </TextApp>
                <TextApp style={stItemRecruitment.lblAddress}>
                    {data?.DiaChi || 'Đang cập nhật'}
                </TextApp>
                <View style={stItemRecruitment.contRow}>
                    <TextApp style={stItemRecruitment.lblSalary}>
                        {data?.MucLuong || 'Đang cập nhật'}
                    </TextApp>
                    <TouchableOpacity activeOpacity={0.5} onPress={onPressSave} style={{ padding: 8 }}>
                        <Image source={ImagesSVL.icStar} resizeMode='contain' style={{ ...nstyles.nIcon16, tintColor: data?.IsLike ? colorsSVL.organeMainSVL : undefined }} />
                    </TouchableOpacity>
                </View>
                <View style={stItemRecruitment.contRow}>
                    {
                        common.STATUS_PERSONAL.DANHANVIEC.includes(data?.Status) || common.STATUS_PERSONAL.TRUOCDO.includes(data?.Status) ?
                            <View style={[stItemRecruitment.contTypeWork, {
                                backgroundColor: common.STATUS_PERSONAL.DANHANVIEC.includes(data?.Status) ? colorsSVL.blueMainSVL : colors.white,
                                borderWidth: 0.5, borderColor: common.STATUS_PERSONAL.DANHANVIEC.includes(data?.Status) ? colorsSVL.blueMainSVL : colors.redStar
                            }]}>
                                <TextApp style={[stItemRecruitment.lblTypeWork, { color: common.STATUS_PERSONAL.DANHANVIEC.includes(data?.Status) ? colors.white : colors.redStar }]}>
                                    {handleTextStatus(data?.Status)}
                                </TextApp>
                            </View> :
                            data?.TypeTinTuyenDung ?
                                <View style={stItemRecruitment.contTypeWork}>
                                    <TextApp style={stItemRecruitment.lblTypeWork}>
                                        {data?.TypeTinTuyenDung == 0 ? 'Toàn thời gian' : 'Bán thời gian'}
                                    </TextApp>
                                </View>
                                : null
                    }
                    {
                        data?.ThoiGianPhongVan || data?.NgayPhongVan ?
                            <TextApp style={stItemRecruitment.lblDateApply}>
                                Phỏng vấn: {data?.ThoiGianPhongVan ? data?.ThoiGianPhongVan : ''}{data?.NgayPhongVan ? ' - ' + data?.NgayPhongVan : ''}
                                {!data?.ThoiGianPhongVan && !data?.NgayPhongVan && 'Đang cập nhật'}
                            </TextApp> :
                            common.STATUS_PERSONAL.UNGTUYEN.includes(data.Status) ?
                                <TextApp style={stItemRecruitment.lblDateApply}>
                                    Ứng tuyển: {data?.NgayTao || 'Đang cập nhật'}
                                </TextApp> : null

                    }
                </View>
            </View>
        </TouchableOpacity>
    )
}

const stItemRecruitment = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: colors.white,
        marginTop: 5, padding: 10
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
    lblDateApply: {
        fontSize: reText(11), color: '#828282'
    },
    contRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    contTypeWork: { paddingHorizontal: 5, paddingVertical: 3, backgroundColor: colors.BackgroundHome, borderRadius: 10 }
})

export default ItemRecruitment
