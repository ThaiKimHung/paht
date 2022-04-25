import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import TextApp from '../../../../components/TextApp'
import { colors } from '../../../../styles'
import { colorsWidget } from '../../../../styles/color'
import { nstyles } from '../../../../styles/styles'
import { ImgWidget } from '../../Assets'
import ImageCus from '../../../../components/ImageCus'
import { reText, sizes } from '../../../../styles/size'
import moment from 'moment'
import { appConfig } from '../../../../app/Config'
import { formatNumber } from './DangTin/HandlerDangTin'
const ItemRaoVat = (props) => {
    moment.updateLocale('vi', {
        relativeTime: {
            future: "in %s",
            past: "%s trước",
            s: 'Vài giây',
            ss: '%d giấy',
            m: "1 phút",
            mm: "%d phút",
            h: "1 giờ",
            hh: "%d giờ",
            d: "1 ngày",
            dd: "%d ngày",
            w: "1 tuần",
            ww: "%d tuần",
            M: "1 tháng",
            MM: "%d tháng",
            y: "1 năm",
            yy: "%d năm"
        }
    });
    const { dataItem, onPress = () => { }, onPressLike = () => { }, isPersonal = false, onPressOption = () => { },
        showTrangThaiHienThi, showTrangThaiTin, showTrangThaiDuyet } = props
    const sinceTime = dataItem?.NgayTao ? moment(dataItem?.NgayTao, 'DD/MM/YYYY HH:mm').fromNow() : 'Thời gian đang cập nhật'
    const thumbnail = dataItem?.Avata ? appConfig.domain + dataItem.Avata : ''

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const colorStatus_TrangThaiDuyet = () => {
        const { TrangThaiDuyet, TrangThaiHienThi, TrangThaiTin } = dataItem
        if (TrangThaiDuyet == 1) {
            return {
                color: colorsWidget.main,
                backgroundColor: colorsWidget.mainOpacity,
                text: 'Mới'
            }
        } else if (TrangThaiDuyet == 2) {
            return {
                color: colorsWidget.DaDuyet,
                backgroundColor: colorsWidget.bgkDaDuyet,
                text: 'Đã duyệt'
            }
        } else {
            return {
                color: colorsWidget.labelInput,
                backgroundColor: colorsWidget.grayDropdown,
                text: 'Không duyệt'
            }
        }
    }

    const colorStatus_TrangThaiTin = () => {
        const { TrangThaiTin } = dataItem
        if (TrangThaiTin) {
            return {
                color: colorsWidget.main,
                backgroundColor: colorsWidget.mainOpacity,
                text: 'Đã đăng'
            }
        } else {
            return {
                color: colorsWidget.labelInput,
                backgroundColor: colorsWidget.grayDropdown,
                text: 'Chờ đăng'
            }
        }
    }

    const colorStatus_TrangThaiHienThi = () => {
        const { TrangThaiHienThi } = dataItem
        if (TrangThaiHienThi == 1) {
            return {
                color: colorsWidget.HienThi,
                backgroundColor: colorsWidget.bkgHienThi,
                text: 'Ẩn'
            }
        } else if (TrangThaiHienThi == 2) {
            return {
                color: colorsWidget.DaDuyet,
                backgroundColor: colorsWidget.bgkDaDuyet,
                text: isPersonal ? 'Hiển thị' : 'Còn hàng'
            }
        } else {
            return {
                color: colorsWidget.main,
                backgroundColor: colorsWidget.mainOpacity,
                text: 'Hết hàng'
            }
        }
    }

    const cost = `${formatNumber(dataItem?.DonGia?.toString())} / ${dataItem?.DonViTinh}`
    return (
        <TouchableOpacity activeOpacity={0.5} onPress={onPress} style={[stItemRaoVat.container, props?.styleItem]}>
            <View style={{ flexDirection: 'row', flex: 1 }}>
                <View style={{ flex: 0.5, borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }}>
                    <ImageCus
                        defaultSourceCus={ImgWidget.imgRectangle6470}
                        source={{ uri: thumbnail }}
                        style={{ width: '100%', height: '100%', borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }}
                        resizeMode='cover'
                    />
                </View>
                <View style={stItemRaoVat.itemProduct}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <TextApp style={{ flex: 1 }} numberOfLines={1}>{dataItem?.TieuDe || 'Đang cập nhật'}</TextApp>
                        <TouchableOpacity onPress={isPersonal ? onPressOption : onPressLike} activeOpacity={0.5} style={{ paddingHorizontal: 5 }}>
                            <Image style={stItemRaoVat.imageProduct}
                                source={isPersonal ? ImgWidget.icOption : dataItem?.DaLuu ? ImgWidget.icStarYellow : ImgWidget.icStar}
                                resizeMode='contain'
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{ paddingRight: 13 }}>
                        <TextApp style={{ color: colorsWidget.main, marginTop: 5 }}>{!dataItem?.DonGia ? dataItem?.DonGiaFull || 'Giá đang cập nhật' : cost}</TextApp>
                        <TextApp style={{ marginTop: 5, color: colorsWidget.gray4F, fontSize: reText(12), textAlign: 'justify' }} numberOfLines={1}>{dataItem?.DiaChiFull || 'Địa chỉ đang cập nhật'}</TextApp>
                        <TextApp style={{ marginTop: 5, color: colorsWidget.gray4F, fontSize: reText(12) }}>{capitalizeFirstLetter(sinceTime) || ''}</TextApp>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            {showTrangThaiDuyet && <View
                                style={{
                                    backgroundColor: colorStatus_TrangThaiDuyet().backgroundColor,
                                    padding: 3, paddingHorizontal: 8, borderRadius: 10, marginTop: 5,
                                }}>
                                <TextApp style={{
                                    color: colorStatus_TrangThaiDuyet().color,
                                    fontSize: reText(12)
                                }}>{colorStatus_TrangThaiDuyet().text}</TextApp>
                            </View>}
                            {showTrangThaiTin && <View style={{
                                backgroundColor: colorStatus_TrangThaiTin().backgroundColor,
                                padding: 3, paddingHorizontal: 8, borderRadius: 10, marginTop: 5,
                                marginLeft: 5
                            }}>
                                <TextApp style={{
                                    color: colorStatus_TrangThaiTin().color,
                                    fontSize: reText(12)
                                }}>{colorStatus_TrangThaiTin()?.text}</TextApp>
                            </View>}
                            {showTrangThaiHienThi && <View style={{
                                backgroundColor: colorStatus_TrangThaiHienThi().backgroundColor,
                                padding: 3, paddingHorizontal: 8, borderRadius: 10, marginTop: 5,
                                marginLeft: isPersonal ? 5 : 0
                            }}>
                                <TextApp style={{
                                    color: colorStatus_TrangThaiHienThi().color,
                                    fontSize: reText(12)
                                }}>{colorStatus_TrangThaiHienThi().text}</TextApp>
                            </View>}
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const stItemRaoVat = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#F8F8F8',
        borderRadius: 6,
        flex: 1,
    },
    itemProduct: {
        paddingLeft: 10,
        paddingVertical: 10,
        flex: 1,
    },
    imageProduct: {
        ...nstyles.nIcon18,
    }
})

export default ItemRaoVat