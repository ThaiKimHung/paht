import React, { useState, useEffect } from 'react'
import { View, Text, Animated, StyleSheet } from 'react-native'
import Utils, { icon_typeToast } from '../../../../app/Utils'
import { colors } from '../../../../styles'
import { reText } from '../../../../styles/size'
import { Height, khoangcach, nstyles, paddingBotX } from '../../../../styles/styles'
import TextApp from '../../../../components/TextApp'
import ButtonSVL from '../../components/ButtonSVL'
import ImageCus from '../../../../components/ImageCus'
import { colorsSVL } from '../../../../styles/color'
import * as ApiSVL from '../../apis/apiSVL';
import { appConfig } from '../../../../app/Config'
import { Images } from '../../../images'
import Toast from 'react-native-simple-toast';

const PopupSave = (props) => {

    const opacity = new Animated.Value(0)
    const isSave = Utils.ngetParam({ props }, 'isSave', false)
    const data = Utils.ngetParam({ props }, 'data', null)
    const callback = Utils.ngetParam({ props }, 'callback', () => { })
    const typeUI = Utils.ngetParam({ props }, 'typeUI', 1) // 1 là save/unsave tin

    useEffect(() => {
        _startAnimation(0.4)
    }, [])

    const _startAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(opacity, {
                toValue: value,
                duration: 200
            }).start();
        }, 320);
    };

    const _goback = () => {
        setTimeout(() => {
            Animated.timing(opacity, {
                toValue: 0,
                duration: 250
            }).start(() => {
                Utils.goback({ props })
            });
        }, 100);
    }

    const handlerSave = async () => {
        const itemcallback = { ...data, IsLike: isSave ? 1 : 0 }
        if (isSave) {
            //Lưu
            let resSave = await ApiSVL.LikeTinTuyenDung(data?.Id)
            Utils.nlog('[LOG] luu tin tuyen dung', resSave)
        } else {
            //Huỷ lưu
            let resDeleteSave = await ApiSVL.UnLikeTinTuyenDung(data?.Id)
            Utils.nlog('[LOG] huy luu tin tuyen dung', resDeleteSave)
        }
        setTimeout(() => {
            Animated.timing(opacity, {
                toValue: 0,
                duration: 250
            }).start(() => {
                if (isSave) {
                    Utils.showToastMsg('Thông báo', 'Đã lưu tin tuyển dụng!', icon_typeToast.success, 2000, icon_typeToast.success)
                    // Toast.show('Lưu tin tuyển dụng thành công!', Toast.SHORT);
                } else {
                    Utils.showToastMsg('Thông báo', 'Đã xoá tin tuyển dụng ra khỏi danh sách đã lưu!', icon_typeToast.info, 2000, icon_typeToast.info)
                    // Toast.show('Huỷ lưu tin tuyển dụng thành công!', Toast.SHORT);
                }
                callback(itemcallback)
                Utils.goback({ props })
            });
        }, 100);
    }

    const thumbnailUrl = data?.Avata ? appConfig.domain + `${data?.Avata}` : ''

    return (
        <View style={[nstyles.ncontainer, { backgroundColor: `transparent`, justifyContent: 'flex-end' }]}>
            <Animated.View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgb(17,17,17)', opacity }} />
            <View style={{ flexGrow: 1 }}>
                <View style={{ flex: 1, backgroundColor: 'tranparent' }} />
                <View style={stPopupSave.container}>
                    <View style={{ width: 100, height: 5, backgroundColor: colors.grayLight, borderRadius: 10, alignSelf: 'center', marginTop: 5 }} />
                    <TextApp style={{ fontWeight: 'bold', fontSize: reText(16), textAlign: 'center', marginTop: 10 }}>{`${isSave ? 'Lưu' : 'Huỷ lưu'} việc làm`}</TextApp>
                    <TextApp style={{ textAlign: 'center', marginTop: 10 }}>{`Bạn có chắc muốn ${isSave ? 'lưu' : 'huỷ lưu'} việc này không`}</TextApp>
                    <ImageCus
                        defaultSourceCus={Images.imgViettelTuyenDung}
                        source={{ uri: thumbnailUrl }}
                        resizeMode="cover"
                        style={stPopupSave.contLeft}
                        borderRadius={5}
                    />
                    <View style={stPopupSave.contRight}>
                        <TextApp style={stPopupSave.lblTitle}>
                            {data?.TieuDe || 'Không có tiêu đề'}
                        </TextApp>
                        <TextApp style={stPopupSave.lblAddress}>
                            {data?.DiaChi || 'Đang cập nhật'}
                        </TextApp>
                        <View style={stPopupSave.contRow}>
                            <TextApp style={stPopupSave.lblSalary}>
                                {data?.MucLuong || 'Đang cập nhật'}
                            </TextApp>
                        </View>
                        <View style={stPopupSave.contRow}>
                            {typeUI == 1 ?
                                <View style={stPopupSave.contTypeWork}>
                                    <TextApp style={stPopupSave.lblTypeWork}>
                                        {data?.TypeTinTuyenDung == 0 ? 'Toàn thời gian' : 'Bán thời gian'}
                                    </TextApp>
                                </View>
                                :
                                [1, 2].includes(data?.status) &&
                                <View style={[stPopupSave.contTypeWork, {
                                    backgroundColor: data?.status == 1 ? colorsSVL.blueMainSVL : colors.white,
                                    borderWidth: 0.5, borderColor: data?.status == 1 ? colorsSVL.blueMainSVL : colors.redStar
                                }]}>
                                    <TextApp style={[stPopupSave.lblTypeWork, { color: data?.status == 1 ? colors.white : colors.redStar }]}>
                                        {data.status == 1 ? 'Đã nhận' : 'Từ chối'}
                                    </TextApp>
                                </View>
                            }
                            {
                                data?.dateInterview && data.status == 1 && data?.isApply ? <TextApp style={stPopupSave.lblDateApply}>
                                    Phỏng vấn: {data?.dateInterview || '18:12 12/12/2021'}
                                </TextApp> : data?.isApply && <TextApp style={stPopupSave.lblDateApply}>
                                    Ứng tuyển: {data?.appliedDate || '18:12 12/12/2021'}
                                </TextApp>
                            }
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <ButtonSVL
                            onPress={_goback}
                            text='Đóng'
                            style={{ flex: 1, backgroundColor: colorsSVL.grayBgrBtn }}
                            colorText={colorsSVL.black}
                            styleText={{ fontSize: reText(16) }}
                        />
                        <View style={{ paddingHorizontal: 5 }} />
                        <ButtonSVL
                            onPress={handlerSave}
                            text={isSave ? 'Lưu' : 'Huỷ lưu'}
                            style={{ flex: 1, backgroundColor: colorsSVL.organeMainSVL }}
                            styleText={{ fontSize: reText(16) }}
                        />
                    </View>
                </View>
            </View>
        </View>
    )
}

const stPopupSave = StyleSheet.create({
    container: {
        // height: nstyles.Height(60),
        backgroundColor: colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: khoangcach,
        paddingBottom: paddingBotX + 20,
        alignItems: 'center',
    },
    contLeft: {
        ...nstyles.nIcon65, marginVertical: 10, borderRadius: 5
    },
    contRight: {
        paddingLeft: 8, alignItems: 'center', marginVertical: 10
    },
    lblTitle: {
        textAlign: 'center', fontWeight: 'bold'
    },
    lblAddress: {
        fontSize: reText(12), color: colors.grayLight, marginTop: 5
    },
    lblSalary: {
        fontSize: reText(14), color: colorsSVL.organeMainSVL, marginTop: 5, fontWeight: 'bold'
    },
    lblTypeWork: {
        fontSize: reText(11), color: '#828282'
    },
    lblDateApply: {
        fontSize: reText(11), color: '#828282'
    },
    contRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
    contTypeWork: { paddingHorizontal: 5, paddingVertical: 3, backgroundColor: colors.BackgroundHome, borderRadius: 10 }
})

export default PopupSave
