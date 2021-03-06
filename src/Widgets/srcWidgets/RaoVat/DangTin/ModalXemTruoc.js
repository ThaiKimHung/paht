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
            Utils.showToastMsg('Th??ng b??o', `${dataTaoSuaTinRaoVat?.isEdit ? 'Ch???nh s???a' : 'T???o'} tin rao v???t th??nh c??ng`, icon_typeToast.success, 2000, icon_typeToast.success)
            Utils.navigate('scTaoTinThanhCong', {
                callback: () => {
                    dispatch(setDataTaoSuaTinRaoVat({})) // t???o / s???a th??nh c??ng clear redux
                    dispatch(setPageRaoVatCaNhan({ Page: 1, AllPage: 1 }))
                    dispatch(setRefreshingRaoVatCaNhan(true))
                    dispatch(setDataRaoVatCaNhan([]))
                    dispatch(loadListRaoVatCaNhan())
                    Utils.navigate('scHomeRaoVat')
                },
                title: `${dataTaoSuaTinRaoVat?.isEdit ? 'Ch???nh s???a' : 'T???o'} tin rao v???t th??nh c??ng`,
                titleHeader: `${dataTaoSuaTinRaoVat?.isEdit ? 'Ch???nh s???a' : 'T???o'} tin rao v???t`
            })
        } else {
            Utils.showToastMsg('Th??ng b??o', `${dataTaoSuaTinRaoVat?.isEdit ? 'Ch???nh s???a' : 'T???o'} tin rao v???t th???t b???i. Vui l??ng th??? l???i sau!`, icon_typeToast.danger, 2000, icon_typeToast.danger)
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
        Utils.showMsgBoxYesNoTop('Th??ng b??o', 'B???n c?? ch???c mu???n hu??? t???o tin rao v???t?', 'Hu???', 'Xem l???i', () => {
            dispatch(setDataTaoSuaTinRaoVat({}))
            Utils.navigate('scHomeRaoVat')
        })
    }

    return (
        <View style={[{ flex: 1, backgroundColor: 'white' }]}>
            <HeaderWidget
                title={'Chi ti???t th??ng tin'}
                iconLeft={ImgWidget.icBack}
                onPressLeft={onBack}
                titleRight={'Hu???'}
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
                        <Text style={[{ fontSize: reText(16), fontWeight: 'bold' }]}>{dataTaoSuaTinRaoVat?.TieuDe || '??ang c???p nh???t'}</Text>
                         <TextLine
                            title={'??? Gi??:'}
                            value={dataTaoSuaTinRaoVat?.GiaThoaThuan ? 'Tho??? thu???n' : formatNumber(dataTaoSuaTinRaoVat?.DonGia?.toString()) || '??ang c???p nh???t'}
                            showTitle
                            styleTitle={{ color: colorsWidget.main, fontSize: reText(16) }}
                            style={{ marginTop: 10 }}
                            styleValue={{ color: colorsWidget.main, fontWeight: 'bold', fontSize: reText(16) }}
                        />
                        <TextLine
                            title={'??? Danh M???c:'}
                            value={dataTaoSuaTinRaoVat?.DanhMuc || '??ang c???p nh???t'}
                            showTitle
                            styleTitle={{ fontWeight: 'normal' }}
                            style={{ marginTop: 10 }}
                        />
                        <TextLine
                            title={'??? T??nh tr???ng:'}
                            value={dataTaoSuaTinRaoVat?.TinhTrangText || '??ang c???p nh???t'}
                            showTitle
                            styleTitle={{ fontWeight: 'normal' }}
                            style={{ marginTop: 10 }}
                        />
                        <TextLine
                            title={'??? S??? l?????ng:'}
                            value={dataTaoSuaTinRaoVat?.SoLuong || '??ang c???p nh???t'}
                            showTitle
                            styleTitle={{ fontWeight: 'normal' }}
                            style={{ marginTop: 10 }}
                        />
                        <TextLine
                            title={'??? ????n v??? t??nh:'}
                            value={dataTaoSuaTinRaoVat?.DonViTinh || '??ang c???p nh???t'}
                            showTitle
                            styleTitle={{ fontWeight: 'normal' }}
                            style={{ marginTop: 10 }}
                        />

                        <TextLine
                            title={'??? ?????a ch???:'}
                            value={dataTaoSuaTinRaoVat?.DiaChi || '??ang c???p nh???t'}
                            showTitle
                            styleTitle={{ fontWeight: 'normal' }}
                            style={{ marginTop: 10 }}
                        />
                        <TextLine
                            title={'M?? t??? s???n ph???m'}
                            value={dataTaoSuaTinRaoVat?.MoTaSanPham || '??ang c???p nh???t'}
                            showTitle
                            styleTitle={{ fontWeight: 'normal', color: colorsWidget.main, fontWeight: 'bold', fontSize: reText(16) }}
                            style={{ marginTop: 10, flexDirection: 'column' }}
                            styleValue={{ lineHeight: 25, paddingLeft: 0 }}
                        />
                        <View>
                            <Text style={[stModalXemTruoc.stText]}>{'Li??n h???'}</Text>
                            <TextLine
                                icon={ImgWidget.icUser}
                                value={dataTaoSuaTinRaoVat?.FullName || '??ang c???p nh???t'}
                                style={{ marginTop: 10 }}
                                styleIcon={nstyles.nIcon15}
                            />
                            <TextLine
                                icon={ImgWidget.icPhone}
                                value={formatPhone(dataTaoSuaTinRaoVat?.PhoneNumber) || '??ang c???p nh???t'}
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
                        text={dataTaoSuaTinRaoVat?.isEdit && dataTaoSuaTinRaoVat?.IdTinRaoVat ? 'C???p nh???t' : 'T???o tin rao v???t'}
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