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
import { onChangeDropdown, getListDanhMuc, toFixedNumber, formatNumber } from '../../RaoVat/DangTin/HandlerDangTin'
import { setDataTaoSuaTinThueNha } from '../../../../../srcRedux/actions/widgets'
import { getListMucGia, getListLoaiNha } from './HandlerDangTinThueNha'
import { THOIGIAN_THUENHA } from '../../../CommonWidgets'


const DangTinThueNha = (props) => {
    const { dataTaoSuaTinThueNha } = useSelector(state => state.Widgets)
    const dispatch = useDispatch()
    const [TieuDe, setTieuDe] = useState(dataTaoSuaTinThueNha?.isEdit ? dataTaoSuaTinThueNha?.TieuDe || '' : '')
    const [dataLoaiNha, setDataLoaiNha] = useState([])
    const [selectedLoaiNha, setSelectedLoaiNha] = useState(
        dataTaoSuaTinThueNha?.isEdit ? {
            Id: dataTaoSuaTinThueNha?.IdLoaiNha,
            TenLoai: dataTaoSuaTinThueNha?.LoaiNha
        } : '')
    const [Gia, setGia] = useState(dataTaoSuaTinThueNha?.isEdit ? dataTaoSuaTinThueNha?.Gia?.toString() || '' : '')
    const [dataThoiGianThueNha, setDataThoiGianThueNha] = useState(THOIGIAN_THUENHA)
    const [selectedThoiGianThueNha, setSelectedThoiGianThueNha] = useState(dataTaoSuaTinThueNha?.isEdit ? {
        IdThoiGianThue: dataTaoSuaTinThueNha?.IdThoiGianThue,
        ThoiGianThueNha: dataTaoSuaTinThueNha?.ThoiGianThueNha
    } : '')
    const [DienTich, setDienTich] = useState(dataTaoSuaTinThueNha?.DienTich ? dataTaoSuaTinThueNha?.DienTich.toString() || '' : '')
    const [trackingNext, setTrackingNext] = useState(false)
    const [trackingAddress, setTrackingAddress] = useState('')

    const refAddress = useRef()

    useEffect(() => {
        getInit()
    }, [])

    useEffect(() => {
        trackingButtonNext()
    }, [TieuDe, selectedLoaiNha, Gia, selectedThoiGianThueNha, DienTich, trackingAddress])

    const trackingButtonNext = () => {
        const { Tinh, Quan, Phuong, DiaChi } = trackingAddress
        let flag = false
        if (TieuDe && selectedLoaiNha && Gia != 0 && Gia && selectedThoiGianThueNha && DienTich && Tinh && Quan && Phuong && DiaChi) {
            flag = true
        } else
            flag = false
        setTrackingNext(flag)
    }

    const getInit = async () => {
        await getListLoaiNha(data => {
            setDataLoaiNha(data)
        })
    }

    const onBack = () => {
        if (trackingNext) {
            Utils.showMsgBoxYesNo({ props }, 'Th??ng b??o', 'Quay l???i s??? hu??? thao t??c t???o/s???a tin thu?? nh??.', 'V???n tho??t', 'Xem l???i', () => {
                dispatch(setDataTaoSuaTinThueNha({}))
                Utils.goback({ props })
            })
        } else
            Utils.goback({ props })
    }

    const onNext = () => {
        //?????nh d???ng l??u obj trong redux gi???ng v???i API cho d??? x??? l??
        const { Tinh, Quan, Phuong, DiaChi } = trackingAddress
        let objectData = {
            ...dataTaoSuaTinThueNha,
            IdTinhThanh: Tinh?.IDTinhThanh,
            IdPhuongXa: Phuong?.IdXaPhuong,
            IdQuanHuyen: Quan?.IDQuanHuyen,
            TieuDe: TieuDe,
            IdLoaiNha: selectedLoaiNha?.Id,
            LoaiNha: selectedLoaiNha?.TenLoai,
            Gia: Gia.replace(/,/g, '') || 0,
            IdThoiGianThue: selectedThoiGianThueNha?.IdThoiGianThue,
            ThoiGianThueNha: selectedThoiGianThueNha?.ThoiGianThueNha,
            DienTich: DienTich.replace(/,/g, ''),
            DiaChi: DiaChi,
            ...trackingAddress,

        }
        console.log('[LOG] data object', objectData);
        dispatch(setDataTaoSuaTinThueNha(objectData))
        Utils.navigate('scLienHeThueNha')
    }

    const onDropdownLoaiNha = () => {
        onChangeDropdown({
            title_drop: 'Lo???i nh??',
            keyView: 'TenLoai',
            currentSelected: selectedLoaiNha,
            data: dataLoaiNha || [],
            keyID: 'Id',
            isWhiteHeader: true
        }, (val) => setSelectedLoaiNha(val))
    }

    // const onDropdownMucGia = () => {
    //     onChangeDropdown({
    //         title_drop: 'M???c gi??',
    //         keyView: 'MucGia',
    //         currentSelected: selectedMucGia,
    //         data: dataMucGia,
    //         keyID: 'IdMucGia',
    //         isWhiteHeader: true
    //     }, (val) => setSelectedMucGia(val))
    // }

    const onDropdownThoiGianThue = () => {
        onChangeDropdown({
            title_drop: 'Th???i gian thu??',
            keyView: 'ThoiGianThueNha',
            currentSelected: selectedThoiGianThueNha,
            data: dataThoiGianThueNha,
            keyID: 'IdThoiGianThue',
            isWhiteHeader: true
        }, (val) => setSelectedThoiGianThueNha(val))
    }

    return (
        <View style={stDangTinThueNha.container}>
            <HeaderWidget
                title={'T???o tin thu?? nh??'}
                iconLeft={ImgWidget.icBack}
                onPressLeft={onBack}
            />
            <View style={stDangTinThueNha.body}>
                <KeyboardAwareScrollView contentContainerStyle={{ paddingBottom: 50 }} showsVerticalScrollIndicator={false}>
                    {useMemo(() => <InputWidget
                        label={'Ti??u ????? tin'}
                        required
                        placeholder={'Nh???p ti??u ????? tin'}
                        value={TieuDe}
                        onChangeText={val => setTieuDe(val)}
                    />, [TieuDe])}
                    {
                        useMemo(() => <DropWidget
                            placeholder={'Ch???n lo???i nh??'}
                            value={selectedLoaiNha?.TenLoai || ''}
                            style={{
                                backgroundColor: colorsWidget.grayDropdown,
                                borderRadius: 6,
                                borderWidth: 0
                            }}
                            label={'Lo???i nh??'}
                            styleLabel={{ marginTop: 15 }}
                            required
                            onPress={onDropdownLoaiNha}
                        />, [selectedLoaiNha, dataLoaiNha])
                    }
                    {
                        useMemo(() => <InputWidget
                            label={'M???c gi?? (VND)'}
                            required
                            placeholder={'Nh???p gi??'}
                            keyboardType='numeric'
                            value={formatNumber(Gia)}
                            onChangeText={val => setGia(val)}
                        />, [Gia])
                    }
                    {
                        useMemo(() => <DropWidget
                            placeholder={'Ch???n th???i gian thu??'}
                            value={selectedThoiGianThueNha?.ThoiGianThueNha || ''}
                            style={{
                                backgroundColor: colorsWidget.grayDropdown,
                                borderRadius: 6,
                                borderWidth: 0
                            }}
                            label={'Th???i gian thu??'}
                            styleLabel={{ marginTop: 15 }}
                            required
                            onPress={onDropdownThoiGianThue}
                        />, [selectedThoiGianThueNha, dataThoiGianThueNha])
                    }
                    {
                        useMemo(() => <InputWidget
                            label={'Di???n t??ch (m2)'}
                            required
                            placeholder={'Nh???p di???n t??ch'}
                            keyboardType='numeric'
                            value={formatNumber(DienTich)}
                            onChangeText={val => setDienTich(val)}
                        />, [DienTich])
                    }
                    {useMemo(() => <AddressWidget
                        ref={refAddress}
                        trackingChange={data => setTrackingAddress(data)}
                        IDTinhThanh={dataTaoSuaTinThueNha?.isEdit ? dataTaoSuaTinThueNha?.IdTinhThanh : ''}
                        IDQuanHuyen={dataTaoSuaTinThueNha?.isEdit ? dataTaoSuaTinThueNha?.IdQuanHuyen : ''}
                        IdXaPhuong={dataTaoSuaTinThueNha?.isEdit ? dataTaoSuaTinThueNha?.IdPhuongXa : ''}
                        DiaChi={dataTaoSuaTinThueNha?.isEdit ? dataTaoSuaTinThueNha?.DiaChi : ''}
                    />, [])}


                </KeyboardAwareScrollView>
                <View style={{ paddingBottom: 24 }}>
                    <TextApp style={{ color: colorsWidget.main, marginVertical: 10, fontSize: reText(12) }}>
                        {'L??u ??: Nh???ng m???c c?? d???u (*) l?? b???t bu???c nh???p'}
                    </TextApp>
                    <ButtonWidget
                        text='Ti???p theo'
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

const stDangTinThueNha = StyleSheet.create({
    container: {
        flex: 1
    },
    body: {
        flex: 1,
        padding: 10
    }
})

export default DangTinThueNha