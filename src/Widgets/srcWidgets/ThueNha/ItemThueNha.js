import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import TextApp from '../../../../components/TextApp'
import { colors } from '../../../../styles'
import { colorsWidget } from '../../../../styles/color'
import { nstyles } from '../../../../styles/styles'
import ImageCus from '../../../../components/ImageCus'
import { reText, sizes } from '../../../../styles/size'
import { appConfig } from '../../../../app/Config'
import { ImgWidget } from '../../Assets'
import Utils from '../../../../app/Utils'
import Video from 'react-native-video'
import { formatNumber } from '../RaoVat/DangTin/HandlerDangTin'
const ItemThueNha = (props) => {
    const { dataItem, onPress = () => { }, onPressLike = () => { }, isPersonal = false, onPressOption = () => { } } = props
    let uriAvata = '', uriVideoAvata = ''

    for (let i = 0; i < dataItem?.ListFile?.length; i++) {
        const file = dataItem?.ListFile[i];
        const checkImage = Utils.checkIsImage(file?.FileDinhKem)
        const checkVideo = Utils.checkIsVideo(file.FileDinhKem);
        if (checkImage) {
            uriAvata = appConfig.domain + `${encodeURI(file?.FileDinhKem)}`
            break;
        }
        if (uriAvata == '' && checkVideo) {
            uriVideoAvata = appConfig.domain + `${encodeURI(file?.FileDinhKem)}`
        }
    }

    const cost = dataItem?.Gia ? `${formatNumber(dataItem?.Gia?.toString())} VND` : 'Giá đang cập nhật'
    const arrDiaChi = dataItem?.DiaChi ? dataItem?.DiaChi?.split('_') : ['Đang cập nhật']
    const DiaChi = arrDiaChi[0]
    const DiaDiemMap = arrDiaChi?.length == 2 ? arrDiaChi[1] : 'Đang cập nhật vị trí'

    const colorStatus_TrangThaiTin = () => {
        const { IsHienThi } = dataItem
        if (IsHienThi) {
            return {
                color: colorsWidget.HienThi,
                backgroundColor: colorsWidget.bkgHienThi,
                text: 'Hiển thị'
            }
        } else {
            return {
                color: colorsWidget.main,
                backgroundColor: colorsWidget.mainOpacity,
                text: 'Ẩn'
            }
        }
    }

    const colorStatus_TrangThaiDuyet = () => {
        const { IsDuyet } = dataItem
        if (IsDuyet == 0) {
            return {
                color: colorsWidget.labelInput,
                backgroundColor: colorsWidget.grayDropdown,
                text: 'Chưa duyệt'
            }
        } else if (IsDuyet == 1) {
            return {
                color: colorsWidget.DaDuyet,
                backgroundColor: colorsWidget.bgkDaDuyet,
                text: 'Đã duyệt'
            }
        } else {
            return {
                color: colorsWidget.main,
                backgroundColor: colorsWidget.mainOpacity,
                text: 'Không duyệt'
            }
        }
    }
    return (
        <TouchableOpacity activeOpacity={0.5} onPress={onPress} style={[stItemRaoVat.container, props?.styleItem]}>
            <View style={{ flexDirection: 'row', flex: 1 }}>
                <View style={{ flex: 0.5, borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }}>
                    {
                        uriAvata ? <ImageCus
                            defaultSourceCus={ImgWidget.imgRectangle6470}
                            source={{ uri: uriAvata }}
                            style={{ width: '100%', height: '100%', borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }}
                            resizeMode='cover'
                        /> : uriAvata == '' && uriVideoAvata ?
                            <Video source={{ uri: uriVideoAvata }}   // Can be a URL or a local file.
                                style={{
                                    width: '100%', height: '100%', backgroundColor: colorsWidget.grayDropdown,
                                }}
                                resizeMode='cover'
                                paused={true} /> : null
                    }
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
                        <TextApp style={{ color: colorsWidget.main, marginTop: 5 }}>{cost || 'Đang cập nhật'}</TextApp>
                        <TextApp
                            style={{ marginTop: 5, color: colorsWidget.gray4F, fontSize: reText(12), textAlign: 'justify' }}
                            numberOfLines={2}>
                            {DiaDiemMap}
                        </TextApp>
                        <TextApp style={{ marginTop: 5, color: colorsWidget.gray4F, fontSize: reText(12) }}>
                            {`Hình thức thuê: ${dataItem?.TenThoiGianThue || 'Đang cập nhật'}`}
                        </TextApp>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            {isPersonal && <View style={{
                                backgroundColor: colorStatus_TrangThaiTin().backgroundColor,
                                padding: 3, paddingHorizontal: 8, borderRadius: 10, marginTop: 5,
                            }}>
                                <TextApp style={{
                                    color: colorStatus_TrangThaiTin().color,
                                    fontSize: reText(12)
                                }}>{colorStatus_TrangThaiTin()?.text}</TextApp>
                            </View>}
                            {isPersonal && <View style={{
                                backgroundColor: colorStatus_TrangThaiDuyet().backgroundColor,
                                padding: 3, paddingHorizontal: 8, borderRadius: 10, marginTop: 5,
                                marginLeft: 5
                            }}>
                                <TextApp style={{
                                    color: colorStatus_TrangThaiDuyet().color,
                                    fontSize: reText(12)
                                }}>{colorStatus_TrangThaiDuyet()?.text}</TextApp>
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
        paddingVertical: 8,
        flex: 1,
    },
    imageProduct: {
        ...nstyles.nIcon18,
    }
})

export default ItemThueNha