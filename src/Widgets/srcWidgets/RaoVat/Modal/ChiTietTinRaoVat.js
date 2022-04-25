import { Text, View, Image, TouchableOpacity, StyleSheet, ScrollView, RefreshControl } from 'react-native'
import React, { Component, useEffect, useRef, useState } from 'react'
import { ButtonWidget, HeaderWidget, PickerWidget } from '../../../CompWidgets';
import { ImgWidget } from '../../../Assets';
import Utils, { icon_typeToast } from '../../../../../app/Utils';
import { Height, nstyles, Width } from '../../../../../styles/styles';
import { reText } from '../../../../../styles/size';
import { colorsWidget } from '../../../../../styles/color';
import { useDispatch, useSelector } from 'react-redux';
import TextLine from '../../../../../components/TextLine';
import { formatNumber, formatPhone, getUniqueNameMoment, replaceAllSpace } from '../DangTin/HandlerDangTin'
import { ApiRaoVat } from '../../../apis';
import { nGlobalKeys } from '../../../../../app/keys/globalKey';
import { IsLoading } from '../../../../../components';
import { saveTinRaoVat, setTrangThaiHienThiItem } from '../../../../../srcRedux/actions/widgets';
import { appConfig } from '../../../../../app/Config';
import { KEY_ACTION_DANGTIN, ACTION_DANGTIN } from '../../../CommonWidgets';

const ChiTietTinRaoVat = (props) => {
    const userCD = useSelector(state => state.auth.userCD)
    const dispatch = useDispatch()
    const refLoading = useRef()
    const [data, setData] = useState('')
    const IdTinRaoVat = Utils.ngetParam({ props: props }, 'IdTinRaoVat', '')
    const refFile = useRef()
    const [refresh, setRefresh] = useState(true)

    useEffect(() => {
        getInfoTinRaoVat()
    }, [IdTinRaoVat])

    const getInfoTinRaoVat = async () => {
        setRefresh(true)
        let res = await ApiRaoVat.Info_TinRaoVat(IdTinRaoVat)
        setRefresh(false)
        console.log('[LOG] info tin rao vat', res)
        if (res.status === 1 && res.data) {
            let arrFile = []
            res.data?.ListFile?.forEach(item => {
                const isCheckImage = Utils.checkIsImage(item?.Path)
                const checkVideo = Utils.checkIsVideo(item?.Path)
                if (isCheckImage || !checkVideo) {
                    arrFile.push({
                        ...item,
                        typeFile: 'image',
                        uri: appConfig.domain + item?.Path

                    })
                } else {
                    arrFile.push({
                        ...item,
                        typeFile: 'video',
                        uri: appConfig.domain + item?.Path
                    })
                }
            });
            refFile?.current?.setData(arrFile)
            setData({ ...res.data, ListFileDinhKem: arrFile });
        } else {
            setData('')
        }
    }

    const onBack = () => {
        Utils.goback({ props })
    }

    const onSaved = () => {
        dispatch(saveTinRaoVat(data, !data?.DaLuu))
        setData({ ...data, DaLuu: !data?.DaLuu })
    }

    const onHandlerButton = async (key) => {
        var formdata = new FormData();
        formdata.append("IdTinRaoVat", data?.IdTinRaoVat);
        let findAction = ACTION_DANGTIN.find(e => e.key == key)
        switch (key) {
            case KEY_ACTION_DANGTIN.ANTIN:
                formdata.append("TrangThaiHienThi", findAction.valueAPI);
                break;
            case KEY_ACTION_DANGTIN.HIENTHI:
                formdata.append("TrangThaiHienThi", findAction.valueAPI);
                break;
            case KEY_ACTION_DANGTIN.HETHANG:
                formdata.append("TrangThaiHienThi", findAction.valueAPI);
                break;
        }
        console.log('[LOG] form data action button', formdata)
        let res = await ApiRaoVat.CapNhatTrangThaiHienThi(formdata)
        console.log('[LOG]res form data action button', res)
        if (res.status == 1) {
            setData({ ...data, TrangThaiHienThi: findAction.valueAPI })
            dispatch(setTrangThaiHienThiItem(data, key))
            Utils.showToastMsg('Thông báo',
                `Đã cập nhật trạng thái hiện thị tin thành: ${findAction.name.toLowerCase()} `,
                icon_typeToast.success, 2000, icon_typeToast.success)
        } else {
            Utils.showToastMsg('Thông báo', 'Đã xảy ra lỗi. Thử lại sau!', icon_typeToast.warning, 2000)
        }
    }

    const callPhoneNumber = () => {
        if (data?.SDTLienHe)
            Utils.dialCall(data?.SDTLienHe ? Number(data?.SDTLienHe) : '')
        else
            Utils.showToastMsg('Thông báo', 'Số điện thoại đang cập nhật.', icon_typeToast.info, 2000, icon_typeToast.info)
    }

    return (
        <View style={[{ flex: 1, backgroundColor: 'white' }]}>
            <HeaderWidget
                title={'Chi tiết thông tin'}
                iconLeft={ImgWidget.icBack}
                onPressLeft={onBack}
                iconRight={data?.DaLuu ? ImgWidget.icStarYellow : ImgWidget.icStar}
                onPressRight={onSaved}
            />
            <View style={{ marginHorizontal: 10, flex: 1 }}>
                <ScrollView
                    contentContainerStyle={{ paddingBottom: 50 }}
                    showsVerticalScrollIndicator={false}
                    pointerEvents={refresh}
                    refreshControl={
                        <RefreshControl
                            refreshing={refresh}
                            onRefresh={getInfoTinRaoVat}
                        // title={!refresh ? 'Vuốt xuống thả ra để cập nhật' : `Đang tải thông tin...`}
                        />
                    }
                >
                    {
                        data?.ListFileDinhKem?.length > 0 &&
                        <PickerWidget
                            ref={refFile}
                            // trackingFile={val => setTrackingFile(val)}
                            dataFile={data?.ListFileDinhKem}
                            isSeen={true}
                            widthSize={Width(90)}
                            heightSize={Width(80)}
                            autoLoop
                            timeLoop={4000}
                        />
                    }
                    <View style={{ marginTop: 15, flex: 1, paddingHorizontal: 10 }}>
                        <Text style={[{ fontSize: reText(16), fontWeight: 'bold' }]}>{data?.TieuDe || 'Đang cập nhật'}</Text>
                        <TextLine
                            title={'• Giá:'}
                            value={data?.GiaThoaThuan ? 'Thoả thuận' : formatNumber(data?.DonGia?.toString()) || 'Đang cập nhật'}
                            showTitle
                            styleTitle={{ color: colorsWidget.main, fontSize: reText(16) }}
                            style={{ marginTop: 10 }}
                            styleValue={{ color: colorsWidget.main, fontWeight: 'bold', fontSize: reText(16) }}
                        />
                        <TextLine
                            title={'• Danh Mục:'}
                            value={data?.DanhMuc || 'Đang cập nhật'}
                            showTitle
                            styleTitle={{ fontWeight: 'normal' }}
                            style={{ marginTop: 10 }}
                        />
                        <TextLine
                            title={'• Tình trạng:'}
                            value={data?.TinhTrangText || 'Đang cập nhật'}
                            showTitle
                            styleTitle={{ fontWeight: 'normal' }}
                            style={{ marginTop: 10 }}
                        />
                        <TextLine
                            title={'• Số lượng:'}
                            value={data?.SoLuong || 'Đang cập nhật'}
                            showTitle
                            styleTitle={{ fontWeight: 'normal' }}
                            style={{ marginTop: 10 }}
                        />
                        <TextLine
                            title={'• Đơn vị tính:'}
                            value={data?.DonViTinh || 'Đang cập nhật'}
                            showTitle
                            styleTitle={{ fontWeight: 'normal' }}
                            style={{ marginTop: 10 }}
                        />
                        <TextLine
                            title={'• Địa chỉ:'}
                            value={data?.DiaChi || 'Đang cập nhật'}
                            showTitle
                            styleTitle={{ fontWeight: 'normal' }}
                            style={{ marginTop: 10 }}
                        />
                        <TextLine
                            title={'Mô tả sản phẩm'}
                            value={data?.MoTaSanPham || 'Đang cập nhật'}
                            showTitle
                            styleTitle={{ fontWeight: 'normal', color: colorsWidget.main, fontWeight: 'bold', fontSize: reText(16) }}
                            style={{ marginTop: 10, flexDirection: 'column' }}
                            styleValue={{ lineHeight: 25, paddingLeft: 0 }}
                        />
                        <View>
                            <Text style={[stChiTietTinRaoVat.stText]}>{'Liên hệ'}</Text>
                            <TextLine
                                icon={ImgWidget.icUser}
                                value={data?.NguoiLienHe || data?.InfoUser?.FullName || 'Đang cập nhật'}
                                style={{ marginTop: 10 }}
                                styleIcon={nstyles.nIcon15}
                            />
                            <TextLine
                                icon={ImgWidget.icPhone}
                                value={formatPhone(data?.SDTLienHe) || formatPhone(data?.InfoUser?.PhoneNumber) || 'Đang cập nhật'}
                                style={{ marginTop: 10 }}
                                styleIcon={nstyles.nIcon15}
                            />
                        </View>
                    </View>
                </ScrollView>
                {data?.InfoUser?.UserId == userCD?.UserID && <View style={{ paddingBottom: 24, flexDirection: 'row' }}>
                    {
                        data?.TrangThaiHienThi != 1 &&
                        <ButtonWidget
                            onPress={() => onHandlerButton(KEY_ACTION_DANGTIN.ANTIN)}
                            style={[stChiTietTinRaoVat.stButton, { backgroundColor: colorsWidget.bgkDaDuyet, marginRight: 5 }]}
                            styleText={[stChiTietTinRaoVat.stTextButton, { color: colorsWidget.DaDuyet }]}
                            text={'Ẩn tin'}
                        />
                    }
                    {
                        data?.TrangThaiHienThi != 2 &&
                        <ButtonWidget
                            onPress={() => onHandlerButton(KEY_ACTION_DANGTIN.HIENTHI)}
                            style={[stChiTietTinRaoVat.stButton, { backgroundColor: colorsWidget.mainOpacity, marginHorizontal: 5 }]}
                            styleText={[stChiTietTinRaoVat.stTextButton, { color: colorsWidget.main }]}
                            text={'Hiển thị'}
                        />
                    }
                    {
                        data?.TrangThaiHienThi != 3 &&
                        <ButtonWidget
                            onPress={() => onHandlerButton(KEY_ACTION_DANGTIN.HETHANG)}
                            style={[stChiTietTinRaoVat.stButton, { backgroundColor: colorsWidget.grayDropdown, marginLeft: 5 }]}
                            styleText={[stChiTietTinRaoVat.stTextButton, { color: colorsWidget.labelInput }]}
                            text={'Hết hàng'}
                        />
                    }
                </View>}
                {data?.InfoUser?.UserId != userCD?.UserID && <View style={{ paddingBottom: 24, flexDirection: 'row' }}>
                    <ButtonWidget
                        onPress={callPhoneNumber}
                        style={[stChiTietTinRaoVat.stButton, { backgroundColor: colorsWidget.mainOpacity, marginHorizontal: 5 }]}
                        styleText={[stChiTietTinRaoVat.stTextButton, { color: colorsWidget.main }]}
                        text={'Liên hệ'}
                    />
                </View>}
            </View>
            <IsLoading ref={refLoading} />
        </View>
    )
}

const stChiTietTinRaoVat = StyleSheet.create({
    stItemImage: { height: Height(40), width: Height(44), borderRadius: 6, marginVertical: 10, },
    stText: { marginVertical: 5, marginTop: 10, color: colorsWidget.main, fontWeight: 'bold', fontSize: reText(16) },
    stButton: {
        backgroundColor: colorsWidget.main,
        borderRadius: 10,
        paddingVertical: 10, marginVertical: 10,
        flex: 1
    },
    stTextButton: { color: colorsWidget.white, }

})

export default ChiTietTinRaoVat