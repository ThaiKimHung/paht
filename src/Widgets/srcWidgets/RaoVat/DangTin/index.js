import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React, { useState, useRef, useEffect, useMemo } from 'react'
import { AddressWidget, ButtonWidget, DropWidget, HeaderWidget, InputWidget } from '../../../CompWidgets'
import { ImgWidget } from '../../../Assets'
import Utils from '../../../../../app/Utils'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { colorsWidget } from '../../../../../styles/color'
import TextApp from '../../../../../components/TextApp'
import { reText } from '../../../../../styles/size'
import { nstyles } from '../../../../../styles/styles'
import { useDispatch, useSelector } from 'react-redux'
import { onChangeDropdown, getListDanhMuc, toFixedNumber, formatNumber } from './HandlerDangTin'
import { setDataTaoSuaTinRaoVat } from '../../../../../srcRedux/actions/widgets'


const DangTin = (props) => {
    const { dataTaoSuaTinRaoVat } = useSelector(state => state.Widgets)
    const dispatch = useDispatch()
    const [thoathuan, setThoathuan] = useState(dataTaoSuaTinRaoVat?.isEdit ? dataTaoSuaTinRaoVat?.GiaThoaThuan == true : false)
    const [TieuDe, setTieuDe] = useState(dataTaoSuaTinRaoVat?.isEdit ? dataTaoSuaTinRaoVat?.TieuDe || '' : '')
    const [SoLuong, setSoLuong] = useState(dataTaoSuaTinRaoVat?.isEdit ? dataTaoSuaTinRaoVat?.SoLuong?.toString() || '' : '')
    const [DonGia, setDonGia] = useState(dataTaoSuaTinRaoVat?.isEdit ? dataTaoSuaTinRaoVat?.DonGia?.toString() || '' : '')
    const [DonViTinh, setDonViTinh] = useState(dataTaoSuaTinRaoVat?.isEdit ? dataTaoSuaTinRaoVat?.DonViTinh || '' : '')

    const [dataDanhMuc, setDataDanhMuc] = useState([])
    const [selectedDanhMuc, setSelectedDanhMuc] = useState(
        dataTaoSuaTinRaoVat?.isEdit ? {
            IdDanhMuc: dataTaoSuaTinRaoVat?.IdDanhMuc,
            DanhMuc: dataTaoSuaTinRaoVat?.DanhMuc
        } : '')
    const [dataTinhTrang, setDataTinhTrang] = useState([
        {
            IdTinhTrang: 1,
            TinhTrang: 'Mới'
        },
        {
            IdTinhTrang: 2,
            TinhTrang: 'Đã qua sử dụng'
        }
    ])
    const [selectedTinhTrang, setSelectedTinhTrang] = useState(
        dataTaoSuaTinRaoVat?.isEdit ? {
            IdTinhTrang: dataTaoSuaTinRaoVat?.TinhTrang,
            TinhTrang: dataTaoSuaTinRaoVat?.TinhTrangText
        } : ''
    )
    const [trackingNext, setTrackingNext] = useState(false)
    const [trackingAddress, setTrackingAddress] = useState('')

    const refAddress = useRef()

    useEffect(() => {
        getInit()
    }, [])

    useEffect(() => {
        trackingButtonNext()
    }, [TieuDe, SoLuong, DonGia, DonViTinh, selectedDanhMuc, selectedTinhTrang, trackingAddress, thoathuan])

    const trackingButtonNext = () => {
        const { Tinh, Quan, Phuong, DiaChi } = trackingAddress
        let flag = false
        if (thoathuan) {
            if (TieuDe && SoLuong && DonViTinh && selectedDanhMuc && selectedTinhTrang && Tinh && Quan && Phuong && DiaChi) {
                flag = true
            } else
                flag = false
        } else {
            if (TieuDe && SoLuong && SoLuong != 0 && DonGia && DonGia != 0 && DonViTinh && selectedDanhMuc && selectedTinhTrang && Tinh && Quan && Phuong && DiaChi) {
                flag = true
            } else
                flag = false
        }
        setTrackingNext(flag)
    }

    const getInit = async () => {
        await getListDanhMuc(data => {
            setDataDanhMuc(data)
        })
    }

    const onBack = () => {
        if (trackingNext) {
            Utils.showMsgBoxYesNo({ props }, 'Thông báo', 'Quay lại sẽ huỷ thao tác tạo/sửa tin rao vặt.', 'Vẫn thoát', 'Xem lại', () => {
                dispatch(setDataTaoSuaTinRaoVat({}))
                Utils.goback({ props })
            })
        } else
            Utils.goback({ props })
    }

    const checkBox = () => {
        return (
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => { setThoathuan(!thoathuan) }}
                style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
                <Image source={thoathuan ? ImgWidget.icCheckActive : ImgWidget.icCheckUnActive} resizeMode='contain' style={nstyles.nIcon18} />
                <TextApp style={{ paddingLeft: 10 }}>{'Giá thoả thuận'}</TextApp>
            </TouchableOpacity>
        )
    }

    const onDropdownDanhMuc = () => {
        onChangeDropdown({
            title_drop: 'Danh mục',
            keyView: 'DanhMuc',
            currentSelected: selectedDanhMuc,
            data: dataDanhMuc,
            keyID: 'IdDanhMuc',
            isWhiteHeader: true
        }, itemSelected => {
            setSelectedDanhMuc(itemSelected)
        })
    }

    const onDropdownTinhTrang = () => {
        onChangeDropdown({
            title_drop: 'Tình trạng',
            keyView: 'TinhTrang',
            currentSelected: selectedTinhTrang,
            data: dataTinhTrang,
            keyID: 'IdTinhTrang',
            isWhiteHeader: true
        }, itemSelected => {
            setSelectedTinhTrang(itemSelected)
        })
    }

    const onNext = () => {
        //Định dạng lưu obj trong redux giống với API cho dễ xử lý
        const { Tinh, Quan, Phuong, DiaChi } = trackingAddress
        let objectData = {
            ...dataTaoSuaTinRaoVat,
            IdTinhThanh: Tinh?.IDTinhThanh,
            IdPhuongXa: Phuong?.IdXaPhuong,
            IdQuanHuyen: Quan?.IDQuanHuyen,
            IdDanhMuc: selectedDanhMuc?.IdDanhMuc,
            TieuDe: TieuDe,
            DanhMuc: selectedDanhMuc?.DanhMuc,
            TinhTrang: selectedTinhTrang?.IdTinhTrang,
            TinhTrangText: selectedTinhTrang?.TinhTrang,
            SoLuong: SoLuong.replace(/,/g, ''),
            DonGia: DonGia.replace(/,/g, ''),
            DonViTinh: DonViTinh,
            GiaThoaThuan: thoathuan,
            DiaChi: DiaChi,
            selectedTinhTrang,
            selectedDanhMuc,
            ...trackingAddress,
        }
        console.log('[LOG] data object', objectData);
        dispatch(setDataTaoSuaTinRaoVat(objectData))
        Utils.navigate('scLienHe')
    }

    return (
        <View style={stDangTin.container}>
            <HeaderWidget
                title={'Tạo tin rao vặt'}
                iconLeft={ImgWidget.icBack}
                onPressLeft={onBack}
            />
            <View style={stDangTin.body}>
                <KeyboardAwareScrollView contentContainerStyle={{ paddingBottom: 50 }} showsVerticalScrollIndicator={false}>
                    {useMemo(() => <InputWidget
                        label={'Tiêu đề tin'}
                        required
                        placeholder={'Nhập tiêu đề tin'}
                        value={TieuDe}
                        onChangeText={val => setTieuDe(val)}
                    />, [TieuDe])}
                    {useMemo(() => <DropWidget
                        placeholder={'Chọn danh mục'}
                        value={selectedDanhMuc?.DanhMuc || ''}
                        style={{
                            backgroundColor: colorsWidget.grayDropdown,
                            borderRadius: 6,
                            borderWidth: 0
                        }}
                        label={'Danh mục'}
                        styleLabel={{ marginTop: 15 }}
                        required
                        onPress={onDropdownDanhMuc}
                    />, [selectedDanhMuc, dataDanhMuc])}
                    {useMemo(() => <DropWidget
                        placeholder={'Chọn tình trạng'}
                        value={selectedTinhTrang?.TinhTrang || ''}
                        style={{
                            backgroundColor: colorsWidget.grayDropdown,
                            borderRadius: 6,
                            borderWidth: 0
                        }}
                        label={'Tình trạng'}
                        styleLabel={{ marginTop: 15 }}
                        required
                        onPress={onDropdownTinhTrang}
                    />, [selectedTinhTrang, dataTinhTrang])}
                    {useMemo(() => <InputWidget
                        label={'Số lượng'}
                        required
                        placeholder={'Nhập số lượng'}
                        keyboardType='numeric'
                        styleLabel={{ marginTop: 15 }}
                        value={formatNumber(SoLuong)}
                        onChangeText={val => setSoLuong(val)}
                    />, [SoLuong])}
                    {useMemo(() => <InputWidget
                        label={'Đơn giá'}
                        required
                        valueRequired='(vnđ)*'
                        placeholder={'Nhập đơn giá'}
                        keyboardType='numeric'
                        styleLabel={{ marginTop: 15, opacity: thoathuan ? 0.4 : 1 }}
                        value={formatNumber(DonGia)}
                        onChangeText={val => setDonGia(val)}
                        maxLength={20}
                        editable={!thoathuan}
                        styleInput={{ opacity: thoathuan ? 0.4 : 1 }}
                    />
                        , [DonGia, thoathuan])}
                    {checkBox()}
                    {useMemo(() => <InputWidget
                        label={'Đơn vị tính'}
                        required
                        placeholder={'Nhập đơn vị tính (Cái,Kg,Gói,Họp...)'}
                        styleLabel={{ marginTop: 15 }}
                        value={DonViTinh}
                        onChangeText={val => setDonViTinh(val)}
                    />, [DonViTinh])}
                    {useMemo(() => <AddressWidget
                        ref={refAddress}
                        trackingChange={data => setTrackingAddress(data)}
                        IDTinhThanh={dataTaoSuaTinRaoVat?.isEdit ? dataTaoSuaTinRaoVat?.IdTinhThanh : ''}
                        IDQuanHuyen={dataTaoSuaTinRaoVat?.isEdit ? dataTaoSuaTinRaoVat?.IdQuanHuyen : ''}
                        IdXaPhuong={dataTaoSuaTinRaoVat?.isEdit ? dataTaoSuaTinRaoVat?.IdPhuongXa : ''}
                        DiaChi={dataTaoSuaTinRaoVat?.isEdit ? dataTaoSuaTinRaoVat?.DiaChi : ''}
                    />, [])}


                </KeyboardAwareScrollView>
                <View style={{ paddingBottom: 24 }}>
                    <TextApp style={{ color: colorsWidget.main, marginVertical: 10, fontSize: reText(12) }}>
                        {'Lưu ý: Những mục có dấu (*) là bắt buộc nhập'}
                    </TextApp>
                    <ButtonWidget
                        text='Tiếp theo'
                        style={{ backgroundColor: trackingNext ? colorsWidget.mainOpacity : colorsWidget.grayDropdown }}
                        styleText={{ color: trackingNext ? colorsWidget.main : colorsWidget.placeholderInput }}
                        disabled={!trackingNext}
                        onPress={onNext}
                    />
                </View>
            </View>
        </View>
    )
}

const stDangTin = StyleSheet.create({
    container: {
        flex: 1
    },
    body: {
        flex: 1,
        padding: 10
    }
})

export default DangTin