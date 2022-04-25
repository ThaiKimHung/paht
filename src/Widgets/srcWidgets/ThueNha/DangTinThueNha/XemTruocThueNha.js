import { Text, View, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import React, { Component, useRef } from 'react'
import { ButtonWidget, HeaderWidget, PickerWidget } from '../../../CompWidgets';
import { ImgWidget } from '../../../Assets';
import Utils, { icon_typeToast } from '../../../../../app/Utils';
import { Height, nstyles, nwidth, Width } from '../../../../../styles/styles';
import { reText } from '../../../../../styles/size';
import { colorsWidget, colors } from '../../../../../styles/color';
import { useDispatch, useSelector } from 'react-redux';
import TextLine from '../../../../../components/TextLine';
import { formatNumber, formatPhone, getUniqueNameMoment, replaceAllSpace } from '../../RaoVat/DangTin/HandlerDangTin'
import { ApiRaoVat, ApiThueNha } from '../../../apis';
import { IsLoading } from '../../../../../components';
import {
    loadListTinThueNhaCaNhan,
    setDataTaoSuaTinThueNha,
    setDataTinThueNhaCaNhan,
    setPageTinThueNhaCaNhan,
    setRefreshingTinThueNhaCaNhan
} from '../../../../../srcRedux/actions/widgets';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { isLandscape } from 'react-native-device-info';

const XemTruocThueNha = (props) => {
    const { dataTaoSuaTinThueNha } = useSelector(state => state.Widgets)
    const dispatch = useDispatch()
    const refLoading = useRef()
    let strAlert = dataTaoSuaTinThueNha?.isEdit && dataTaoSuaTinThueNha?.Id ? 'Cập nhật' : 'Tạo'

    const onBack = () => {
        Utils.goback({ props })
    }

    const onCreateUpdate = async () => {
        refLoading.current.show()
        let formdata = new FormData();
        for (let i = 0; i < dataTaoSuaTinThueNha?.ListFileDinhKem.length; i++) {
            const file = dataTaoSuaTinThueNha?.ListFileDinhKem[i];
            if (file?.typeFile == 'image') {
                formdata.append(`FileDinhKem${i}`, {
                    name: `image${i}_${getUniqueNameMoment()}.png`,
                    type: "image/png",
                    uri: file?.uri,
                    ...file
                });
            } else {
                formdata.append(`FileDinhKem${i}`, {
                    name: `video${i}_${getUniqueNameMoment()}.mp4`,
                    type: "video/mp4",
                    uri: file?.uri,
                    ...file
                });
            }
        }
        formdata.append("TieuDe", dataTaoSuaTinThueNha?.TieuDe || '');
        formdata.append("MoTa", dataTaoSuaTinThueNha?.MoTaSanPham || '');
        formdata.append("LoaiNha", dataTaoSuaTinThueNha?.IdLoaiNha || '');
        formdata.append("TinhThanh", dataTaoSuaTinThueNha?.IdTinhThanh || '');
        formdata.append("QuanHuyen", dataTaoSuaTinThueNha?.IdQuanHuyen || '');
        formdata.append("PhuongXa", dataTaoSuaTinThueNha?.IdPhuongXa || '');
        formdata.append("DiaChi", `${dataTaoSuaTinThueNha?.DiaChi}${dataTaoSuaTinThueNha?.DiaDiemMap ? `_${dataTaoSuaTinThueNha?.DiaDiemMap}` : ''}`);
        formdata.append("Lat", dataTaoSuaTinThueNha?.Lat || '');
        formdata.append("Long", dataTaoSuaTinThueNha?.Lng || '');
        formdata.append("Gia", Number(dataTaoSuaTinThueNha?.Gia) || 0);
        formdata.append("DienTich", Number(dataTaoSuaTinThueNha?.DienTich) || '');
        formdata.append("ThoiGianThue", dataTaoSuaTinThueNha?.IdThoiGianThue || '');
        formdata.append("NguoiLienHe", dataTaoSuaTinThueNha?.FullName || '');
        formdata.append("SDTLienHe", dataTaoSuaTinThueNha?.PhoneNumber || '');
        if (dataTaoSuaTinThueNha?.isEdit && dataTaoSuaTinThueNha?.Id) {
            formdata.append("Id", dataTaoSuaTinThueNha?.Id || '');
        }
        console.log('[LOG] objform data', formdata)
        let res = await ApiThueNha.AddEditTinThueNha(formdata)
        console.log('[LOG] res tao sua tin thue nha', res)
        refLoading.current.hide()
        if (res.status === 1) {
            Utils.showToastMsg('Thông báo', `${strAlert} tin thuê nhà thành công`, icon_typeToast.success, 2000, icon_typeToast.success)
            Utils.navigate('scTaoTinThueNhaThanhCong', {
                callback: () => {
                    dispatch(setDataTaoSuaTinThueNha({})) // tạo / sửa thành công clear redux
                    dispatch(setPageTinThueNhaCaNhan({ Page: 1, AllPage: 1 }))
                    dispatch(setRefreshingTinThueNhaCaNhan(true))
                    dispatch(setDataTinThueNhaCaNhan([]))
                    dispatch(loadListTinThueNhaCaNhan())
                    Utils.navigate('scHomeThueNha')
                },
                title: `${strAlert} tin thuê nhà thành công`,
                titleHeader: `${strAlert} tin thuê nhà`
            })
        } else {
            Utils.showToastMsg('Thông báo', `${strAlert} tin thuê nhà thất bại`, icon_typeToast.danger, 2000, icon_typeToast.danger)
        }

    }

    const askBeforeCreate = () => {
        Utils.showMsgBoxYesNoTop('Thông báo', `Bạn có chắc muốn ${strAlert.toLowerCase()} tin thuê nhà?`, strAlert, 'Xem lại', () => {
            onCreateUpdate()
        })
    }

    const onCancel = () => {
        Utils.showMsgBoxYesNoTop('Thông báo', 'Bạn có chắc muốn huỷ tạo tin thuê nhà?', 'Huỷ', 'Xem lại', () => {
            dispatch(setDataTaoSuaTinThueNha({}))
            Utils.navigate('scHomeThueNha')
        })
    }

    return (
        <View style={[{ flex: 1, backgroundColor: 'white' }]}>
            <HeaderWidget
                title={'Chi tiết thông tin'}
                iconLeft={ImgWidget.icBack}
                onPressLeft={onBack}
                titleRight={'Huỷ'}
                Sright={{ color: colorsWidget.labelInput }}
                onPressRight={onCancel}
            />
            <View style={{ marginHorizontal: 10, flex: 1 }}>
                <ScrollView contentContainerStyle={{ paddingBottom: 50 }} showsVerticalScrollIndicator={false}>
                    <PickerWidget
                        // ref={refFile}
                        // trackingFile={val => setTrackingFile(val)}
                        dataFile={dataTaoSuaTinThueNha?.ListFileDinhKem}
                        isSeen={true}
                        widthSize={Width(90)}
                        heightSize={Width(80)}
                        autoLoop
                    />
                    <View style={{ marginTop: 15, flex: 1, paddingHorizontal: 10 }}>
                        <Text style={[{ fontSize: reText(16), fontWeight: 'bold' }]}>{dataTaoSuaTinThueNha?.TieuDe || 'Đang cập nhật'}</Text>
                        <TextLine
                            title={'• Giá:'}
                            value={formatNumber(dataTaoSuaTinThueNha?.Gia) || 'Đang cập nhật'}
                            showTitle
                            styleTitle={{ color: colorsWidget.main, fontSize: reText(16) }}
                            style={{ marginTop: 10 }}
                            styleValue={{ color: colorsWidget.main, fontWeight: 'bold', fontSize: reText(16) }}
                        />
                        <TextLine
                            title={'• Loại nhà:'}
                            value={dataTaoSuaTinThueNha?.LoaiNha || 'Đang cập nhật'}
                            showTitle
                            styleTitle={{ fontWeight: 'normal' }}
                            style={{ marginTop: 10 }}
                        />
                        <TextLine
                            title={'• Diện tích:'}
                            value={dataTaoSuaTinThueNha?.DienTich + `m2` || 'Đang cập nhật'}
                            showTitle
                            styleTitle={{ fontWeight: 'normal' }}
                            style={{ marginTop: 10 }}
                        />
                        <TextLine
                            title={'• Thời gian thuê:'}
                            value={dataTaoSuaTinThueNha?.ThoiGianThueNha || 'Đang cập nhật'}
                            showTitle
                            styleTitle={{ fontWeight: 'normal' }}
                            style={{ marginTop: 10 }}
                        />
                        <TextLine
                            title={'• Địa chỉ:'}
                            value={`${dataTaoSuaTinThueNha?.DiaChi}` || 'Đang cập nhật'}
                            showTitle
                            styleTitle={{ fontWeight: 'normal' }}
                            style={{ marginTop: 10 }}
                        />
                        <TextLine
                            title={'• Vị trí bản đồ:'}
                            value={`${dataTaoSuaTinThueNha?.DiaDiemMap}` || 'Đang cập nhật'}
                            showTitle
                            styleTitle={{ fontWeight: 'normal' }}
                            style={{ marginTop: 10 }}
                        />
                        <TextLine
                            title={'Mô tả'}
                            value={dataTaoSuaTinThueNha?.MoTaSanPham || 'Đang cập nhật'}
                            showTitle
                            styleTitle={{ fontWeight: 'normal', color: colorsWidget.main, fontWeight: 'bold', fontSize: reText(16) }}
                            style={{ marginTop: 10, flexDirection: 'column' }}
                            styleValue={{ lineHeight: 25, paddingLeft: 0 }}
                        />
                        <View>
                            <Text style={[stXemTruocThueNha.stText]}>{'Liên hệ'}</Text>
                            <TextLine
                                icon={ImgWidget.icUser}
                                value={dataTaoSuaTinThueNha?.FullName || 'Đang cập nhật'}
                                style={{ marginTop: 10 }}
                                styleIcon={nstyles.nIcon15}
                            />
                            <TextLine
                                icon={ImgWidget.icPhone}
                                value={formatPhone(dataTaoSuaTinThueNha?.PhoneNumber) || 'Đang cập nhật'}
                                style={{ marginTop: 10 }}
                                styleIcon={nstyles.nIcon15}
                            />
                        </View>
                        <View pointerEvents={'none'}
                            style={{
                                width: nwidth() - 40,
                                height: Width(isLandscape ? 60 : 110),
                                alignSelf: 'center', marginTop: 10,
                                borderWidth: 0.5, borderColor: colors.grayLight
                            }}>
                            <MapView style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                                // provider={PROVIDER_GOOGLE}
                                showsUserLocation={true}
                                region={{
                                    latitude: dataTaoSuaTinThueNha?.Lat,
                                    longitude: dataTaoSuaTinThueNha?.Lng,
                                    latitudeDelta: 0.001,
                                    longitudeDelta: 0.001
                                }}
                            >
                                <Marker
                                    coordinate={{
                                        latitude: dataTaoSuaTinThueNha?.Lat,
                                        longitude: dataTaoSuaTinThueNha?.Lng
                                    }}
                                    title={'Vị trí đang chọn' || ''}
                                />
                            </MapView>
                        </View>
                    </View>
                </ScrollView>
                <View style={{ paddingBottom: 24 }}>
                    <ButtonWidget
                        onPress={askBeforeCreate}
                        style={[stXemTruocThueNha.stButton]}
                        styleText={[stXemTruocThueNha.stTextButton]}
                        text={strAlert}
                    />
                </View>
            </View>
            <IsLoading ref={refLoading} />
        </View>
    )
}

const stXemTruocThueNha = StyleSheet.create({
    stItemImage: { height: Height(40), width: Height(44), borderRadius: 6, marginVertical: 10, },
    stText: { marginVertical: 5, marginTop: 10, color: colorsWidget.main, fontWeight: 'bold', fontSize: reText(16) },
    stButton: { backgroundColor: colorsWidget.main, borderWidth: 1, borderColor: colorsWidget.main, borderRadius: 10, paddingVertical: 10, marginVertical: 10 },
    stTextButton: { color: colorsWidget.white, }

})

export default XemTruocThueNha