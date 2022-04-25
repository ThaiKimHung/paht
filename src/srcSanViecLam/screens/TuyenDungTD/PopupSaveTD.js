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
import { ImagesSVL } from '../../images'
import { appConfig } from '../../../../app/Config'
import * as ApiSVL from '../../apis/apiSVL'
import moment from 'moment'

const PopupSaveTD = (props) => {

    const opacity = new Animated.Value(0)
    const isSave = Utils.ngetParam({ props }, 'isSave', false)
    const data = Utils.ngetParam({ props }, 'data', null)
    const callback = Utils.ngetParam({ props }, 'callback', () => { })

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
            let resSave = await ApiSVL.LikeHoSoCV(data?.IdCV)
            Utils.nlog('[LOG] luu CV', resSave)
        } else {
            //Huỷ lưu
            let resDeleteSave = await ApiSVL.UnLikeHoSoCV(data?.IdCV)
            Utils.nlog('[LOG] huy luu CV', resDeleteSave)
        }
        setTimeout(() => {
            Animated.timing(opacity, {
                toValue: 0,
                duration: 250
            }).start(() => {
                if (isSave) {
                    Utils.showToastMsg('Thông báo', 'Đã lưu hồ sơ!', icon_typeToast.success, 2000, icon_typeToast.success)
                } else {
                    Utils.showToastMsg('Thông báo', 'Đã xoá hồ sơ ra khỏi danh sách hồ sơ đã lưu!', icon_typeToast.info, 2000, icon_typeToast.info)
                }
                callback(itemcallback)
                Utils.goback({ props })
            });
        }, 100);
    }

    const TypeCV = (key) => {
        switch (key) {
            case 0:
                return 'Sinh viên, học sinh'
            case 1:
                return 'Người lao động'
            default:
                return 'Đang cập nhật'
        }
    }

    const TypeThoiGian = (key) => {
        switch (key) {
            case 0:
                return 'Toàn thời gian'
            case 1:
                return 'Bán thời gian'
            default:
                return 'Đang cập nhật'
        }
    }

    const DiaChi = data?.TenQuanHuyen || data?.TenTinhThanh ? `${data?.TenQuanHuyen ? data?.TenQuanHuyen + ', ' : ''}${data?.TenTinhThanh}` : ''
    const thumbnailUrl = data?.Avata ? appConfig.domain + data?.Avata : ''
    const yearOld = data?.NgaySinh ? moment().diff(moment(data?.NgaySinh, 'DD/MM/YYYY'), 'years') : ''
    return (
        <View style={[nstyles.ncontainer, { backgroundColor: `transparent`, justifyContent: 'flex-end' }]}>
            <Animated.View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgb(17,17,17)', opacity }} />
            <View style={{ flexGrow: 1 }}>
                <View style={{ flex: 1, backgroundColor: 'tranparent' }} />
                <View style={stPopupSaveTD.container}>
                    <View style={{ width: 100, height: 5, backgroundColor: colors.grayLight, borderRadius: 10, alignSelf: 'center', marginTop: 5 }} />
                    <TextApp style={{ fontWeight: 'bold', fontSize: reText(16), textAlign: 'center', marginTop: 10 }}>{`${isSave ? 'Lưu' : 'Huỷ lưu'} hồ sơ`}</TextApp>
                    <TextApp style={{ textAlign: 'center', marginTop: 10 }}>{`Bạn có chắc muốn ${isSave ? 'lưu' : 'huỷ lưu'} hồ sơ này không`}</TextApp>
                    <ImageCus
                        defaultSourceCus={ImagesSVL.icUser1}
                        source={{ uri: thumbnailUrl }}
                        style={[nstyles.nAva60, { marginTop: 10 }]}
                        resizeMode='cover'
                    />
                    <View style={{ ...stPopupSaveTD.stViewInfoItem }}>
                        <TextApp numberOfLines={2} style={[stPopupSaveTD.stTextSP]}>{data?.name}</TextApp>
                        <View style={stPopupSaveTD.rowContent}>
                            <TextApp numberOfLines={2} style={[stPopupSaveTD.stTextBS]}>Giới tính: {data?.GioiTinh == 0 ? 'Nam' : 'Nữ'}</TextApp>
                            <TextApp numberOfLines={2} style={[stPopupSaveTD.stTextBS]}> Tuổi: {yearOld || 'Đang cập nhật'} </TextApp>
                        </View>
                        <TextApp numberOfLines={2} style={[stPopupSaveTD.stTextBS]}>Nghành nghề : {data?.LoaiNganhNghe || 'Đang cập nhật'}</TextApp>
                        {
                            data?.luong != '' ?
                                <><TextApp numberOfLines={2} style={[stPopupSaveTD.stTextSPC]}>Lương: {data?.MucLuong || 'Đang cập nhật'}</TextApp></> : null
                        }
                        <TextApp numberOfLines={2} style={[stPopupSaveTD.stTextBS]}>Khu vực : {DiaChi || 'Đang cập nhật'}</TextApp>
                        <TextApp numberOfLines={2} style={[stPopupSaveTD.stTextBS]}>Loại hồ sơ: {TypeCV(data?.TypePerson)}</TextApp>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flexDirection: 'row', marginTop: 8 }}>
                                <View
                                    style={[stPopupSaveTD.stViewBS1]}>
                                    <TextApp style={[stPopupSaveTD.stTextBS1]}>{TypeThoiGian(data?.TypeCV)}</TextApp>
                                </View>
                            </View>
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

const stPopupSaveTD = StyleSheet.create({
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
        ...nstyles.nIcon65, marginVertical: 10
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
    contTypeWork: { paddingHorizontal: 5, paddingVertical: 3, backgroundColor: colors.BackgroundHome, borderRadius: 10 },

    stViewItem: {
        flexDirection: 'column',
        paddingHorizontal: 10,
        paddingVertical: 20,
        backgroundColor: colorsSVL.white,
        marginBottom: 5
    },
    stViewImageItemCheck: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: 5
    },
    stViewImageItem: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    stViewInfoItem: {
        alignItems: 'center', justifyContent: 'center', marginVertical: 10
    },
    stTextSP: {
        fontSize: reText(16), fontWeight: 'bold', textAlign: 'justify', textAlign: 'justify'
    },
    stTextBS: {
        fontSize: reText(12), marginTop: 5,
    },
    stViewBS1: {
        paddingVertical: 3, paddingHorizontal: 10,
        backgroundColor: colorsSVL.grayBgrInput,
        borderRadius: 17, alignItems: 'center', justifyContent: 'center'
    },
    stTextBS1: {
        fontSize: reText(12), color: colorsSVL.grayTextLight
    },
    stViewBS2: {
        paddingVertical: 3,
        paddingHorizontal: 10,
        borderRadius: 17,
        marginLeft: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: colorsSVL.organeMainSVL, borderWidth: 1

    },
    stTextBS2: {
        fontSize: reText(12), color: colorsSVL.organeMainSVL
    },
    stTextSPC: {
        fontSize: reText(12), marginTop: 5, color: colorsSVL.organeMainSVL, fontWeight: 'bold'
    },
    rowContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }
})

export default PopupSaveTD
