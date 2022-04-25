import { Text, View, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import React, { Component, useRef } from 'react'
import { ButtonWidget, HeaderWidget, PickerWidget } from '../../../CompWidgets';
import { ImgWidget } from '../../../Assets';
import Utils, { icon_typeToast } from '../../../../../app/Utils';
import { Height, nstyles, Width } from '../../../../../styles/styles';
import { reText } from '../../../../../styles/size';
import { colorsWidget } from '../../../../../styles/color';
import { useDispatch, useSelector } from 'react-redux';
import TextLine from '../../../../../components/TextLine';
import { formatNumber, formatPhone, getUniqueNameMoment, replaceAllSpace } from './HandlerDangTin'
import { ApiRaoVat } from '../../../apis';
import { nGlobalKeys } from '../../../../../app/keys/globalKey';
import { IsLoading } from '../../../../../components';
import { loadListRaoVatCaNhan, setDataRaoVatCaNhan, setDataTaoSuaTinRaoVat, setPageRaoVatCaNhan, setRefreshingRaoVatCaNhan } from '../../../../../srcRedux/actions/widgets';
import { ACTION_TAOTIN, KEY_ACTION_TAOTIN, ACTION_CHINHSUA } from '../../../CommonWidgets';

const ModalXemTruoc = (props) => {
    const { dataTaoSuaTinRaoVat } = useSelector(state => state.Widgets)
    const dispatch = useDispatch()
    const refLoading = useRef()

    const onBack = () => {
        Utils.goback({ props })
    }

    const onCreate = async (themVaDangTin = false) => {
        refLoading.current.show()
        const DevicesToken = await Utils.ngetStore(nGlobalKeys.userId_OneSignal, '');
        let formdata = new FormData();

        const findImgAvata = dataTaoSuaTinRaoVat?.ListFileDinhKem.find(e => e.typeFile == 'image')
        formdata.append("Avata", {
            name: `avata_${getUniqueNameMoment()}.png`,
            type: "image/png",
            uri: findImgAvata?.uri,
        });
        for (let i = 0; i < dataTaoSuaTinRaoVat?.ListFileDinhKem.length; i++) {
            const file = dataTaoSuaTinRaoVat?.ListFileDinhKem[i];
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
        formdata.append("DiaChi", dataTaoSuaTinRaoVat?.DiaChi || '');
        formdata.append("IdTinhThanh", dataTaoSuaTinRaoVat?.IdTinhThanh || '');
        formdata.append("IdHuyenQuan", dataTaoSuaTinRaoVat?.IdQuanHuyen || '');
        formdata.append("IdXaPhuong", dataTaoSuaTinRaoVat?.IdPhuongXa || '');
        formdata.append("TieuDe", dataTaoSuaTinRaoVat?.TieuDe || '');
        formdata.append("TinhTrang", dataTaoSuaTinRaoVat?.TinhTrang || '1');
        formdata.append("MoTaSanPham", dataTaoSuaTinRaoVat?.MoTaSanPham || '');
        formdata.append("IdDanhMuc", dataTaoSuaTinRaoVat?.IdDanhMuc || '');
        formdata.append("GiaThoaThuan", dataTaoSuaTinRaoVat?.GiaThoaThuan || false);
        formdata.append("DonGia", dataTaoSuaTinRaoVat?.DonGia || 0);
        formdata.append("DonViTinh", dataTaoSuaTinRaoVat?.DonViTinh || '');
        formdata.append("SoLuong", dataTaoSuaTinRaoVat?.SoLuong || '0');
        formdata.append("DevicesToken", DevicesToken || '');
        formdata.append("DangTin", themVaDangTin == true);
        formdata.append("NguoiLienHe", dataTaoSuaTinRaoVat?.FullName || '');
        formdata.append("SDTLienHe", dataTaoSuaTinRaoVat?.PhoneNumber || '');
        Utils.nlog('[LOG] form data dang tin', formdata)
        let res = {}
        if (dataTaoSuaTinRaoVat?.isEdit) {
            formdata.append("IdTinRaoVat", dataTaoSuaTinRaoVat?.IdTinRaoVat);
            res = await ApiRaoVat.Update_TinRaoVat(formdata)
            Utils.nlog('[LOG] res update', res)
        } else {
            res = await ApiRaoVat.AddTinRaoVat(formdata)
            Utils.nlog('[LOG] res dang tin', res)
        }
        refLoading.current.hide()
        if (res.status == 1) {
            Utils.showToastMsg('Thông báo', `${dataTaoSuaTinRaoVat?.isEdit ? 'Chỉnh sửa' : 'Tạo'} tin rao vặt thành công`, icon_typeToast.success, 2000, icon_typeToast.success)
            Utils.navigate('scTaoTinThanhCong', {
                callback: () => {
                    dispatch(setDataTaoSuaTinRaoVat({})) // tạo / sửa thành công clear redux
                    dispatch(setPageRaoVatCaNhan({ Page: 1, AllPage: 1 }))
                    dispatch(setRefreshingRaoVatCaNhan(true))
                    dispatch(setDataRaoVatCaNhan([]))
                    dispatch(loadListRaoVatCaNhan())
                    Utils.navigate('scHomeRaoVat')
                },
                title: `${dataTaoSuaTinRaoVat?.isEdit ? 'Chỉnh sửa' : 'Tạo'} tin rao vặt thành công`,
                titleHeader: `${dataTaoSuaTinRaoVat?.isEdit ? 'Chỉnh sửa' : 'Tạo'} tin rao vặt`
            })
        } else {
            Utils.showToastMsg('Thông báo', `${dataTaoSuaTinRaoVat?.isEdit ? 'Chỉnh sửa' : 'Tạo'} tin rao vặt thất bại. Vui lòng thử lại sau!`, icon_typeToast.danger, 2000, icon_typeToast.danger)
        }

    }

    const callBackAction = (action) => {
        switch (action.key) {
            case KEY_ACTION_TAOTIN.TAOVADANGNGAY:
                onCreate(true);
                break;
            case KEY_ACTION_TAOTIN.CHITAO:
                onCreate(false);
                break;
            case KEY_ACTION_TAOTIN.XEMLAI:

                break;
            default:
                break;
        }
    }

    const askBeforeCreate = () => {
        Utils.navigate('Modal_TuyChon', {
            DataMenu: dataTaoSuaTinRaoVat?.isEdit && dataTaoSuaTinRaoVat?.IdTinRaoVat ? ACTION_CHINHSUA : ACTION_TAOTIN,
            callback: (val) => callBackAction(val)
        })
    }

    const onCancel = () => {
        Utils.showMsgBoxYesNoTop('Thông báo', 'Bạn có chắc muốn huỷ tạo tin rao vặt?', 'Huỷ', 'Xem lại', () => {
            dispatch(setDataTaoSuaTinRaoVat({}))
            Utils.navigate('scHomeRaoVat')
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
                        dataFile={dataTaoSuaTinRaoVat?.ListFileDinhKem}
                        isSeen={true}
                        widthSize={Width(90)}
                        heightSize={Width(80)}
                    />
                    <View style={{ marginTop: 15, flex: 1, paddingHorizontal: 10 }}>
                        <Text style={[{ fontSize: reText(16), fontWeight: 'bold' }]}>{dataTaoSuaTinRaoVat?.TieuDe || 'Đang cập nhật'}</Text>
                         <TextLine
                            title={'• Giá:'}
                            value={dataTaoSuaTinRaoVat?.GiaThoaThuan ? 'Thoả thuận' : formatNumber(dataTaoSuaTinRaoVat?.DonGia?.toString()) || 'Đang cập nhật'}
                            showTitle
                            styleTitle={{ color: colorsWidget.main, fontSize: reText(16) }}
                            style={{ marginTop: 10 }}
                            styleValue={{ color: colorsWidget.main, fontWeight: 'bold', fontSize: reText(16) }}
                        />
                        <TextLine
                            title={'• Danh Mục:'}
                            value={dataTaoSuaTinRaoVat?.DanhMuc || 'Đang cập nhật'}
                            showTitle
                            styleTitle={{ fontWeight: 'normal' }}
                            style={{ marginTop: 10 }}
                        />
                        <TextLine
                            title={'• Tình trạng:'}
                            value={dataTaoSuaTinRaoVat?.TinhTrangText || 'Đang cập nhật'}
                            showTitle
                            styleTitle={{ fontWeight: 'normal' }}
                            style={{ marginTop: 10 }}
                        />
                        <TextLine
                            title={'• Số lượng:'}
                            value={dataTaoSuaTinRaoVat?.SoLuong || 'Đang cập nhật'}
                            showTitle
                            styleTitle={{ fontWeight: 'normal' }}
                            style={{ marginTop: 10 }}
                        />
                        <TextLine
                            title={'• Đơn vị tính:'}
                            value={dataTaoSuaTinRaoVat?.DonViTinh || 'Đang cập nhật'}
                            showTitle
                            styleTitle={{ fontWeight: 'normal' }}
                            style={{ marginTop: 10 }}
                        />

                        <TextLine
                            title={'• Địa chỉ:'}
                            value={dataTaoSuaTinRaoVat?.DiaChi || 'Đang cập nhật'}
                            showTitle
                            styleTitle={{ fontWeight: 'normal' }}
                            style={{ marginTop: 10 }}
                        />
                        <TextLine
                            title={'Mô tả sản phẩm'}
                            value={dataTaoSuaTinRaoVat?.MoTaSanPham || 'Đang cập nhật'}
                            showTitle
                            styleTitle={{ fontWeight: 'normal', color: colorsWidget.main, fontWeight: 'bold', fontSize: reText(16) }}
                            style={{ marginTop: 10, flexDirection: 'column' }}
                            styleValue={{ lineHeight: 25, paddingLeft: 0 }}
                        />
                        <View>
                            <Text style={[stModalXemTruoc.stText]}>{'Liên hệ'}</Text>
                            <TextLine
                                icon={ImgWidget.icUser}
                                value={dataTaoSuaTinRaoVat?.FullName || 'Đang cập nhật'}
                                style={{ marginTop: 10 }}
                                styleIcon={nstyles.nIcon15}
                            />
                            <TextLine
                                icon={ImgWidget.icPhone}
                                value={formatPhone(dataTaoSuaTinRaoVat?.PhoneNumber) || 'Đang cập nhật'}
                                style={{ marginTop: 10 }}
                                styleIcon={nstyles.nIcon15}
                            />
                        </View>
                    </View>
                </ScrollView>
                <View style={{ paddingBottom: 24 }}>
                    <ButtonWidget
                        onPress={askBeforeCreate}
                        style={[stModalXemTruoc.stButton]}
                        styleText={[stModalXemTruoc.stTextButton]}
                        text={dataTaoSuaTinRaoVat?.isEdit && dataTaoSuaTinRaoVat?.IdTinRaoVat ? 'Cập nhật' : 'Tạo tin rao vặt'}
                    />
                </View>
            </View>
            <IsLoading ref={refLoading} />
        </View>
    )
}

const stModalXemTruoc = StyleSheet.create({
    stItemImage: { height: Height(40), width: Height(44), borderRadius: 6, marginVertical: 10, },
    stText: { marginVertical: 5, marginTop: 10, color: colorsWidget.main, fontWeight: 'bold', fontSize: reText(16) },
    stButton: { backgroundColor: colorsWidget.main, borderWidth: 1, borderColor: colorsWidget.main, borderRadius: 10, paddingVertical: 10, marginVertical: 10 },
    stTextButton: { color: colorsWidget.white, }

})

export default ModalXemTruoc