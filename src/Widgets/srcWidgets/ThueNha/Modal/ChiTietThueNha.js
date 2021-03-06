import { Text, View, Image, TouchableOpacity, StyleSheet, ScrollView, RefreshControl, Platform } from 'react-native'
import React, { Component, useRef, useState, useEffect } from 'react'
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
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { isLandscape } from 'react-native-device-info';
import { appConfig } from '../../../../../app/Config';
import openMap from 'react-native-open-maps';

const ChiTietThueNha = (props) => {
    const IdThueNha = Utils.ngetParam({ props }, 'IdThueNha', '')
    const userCD = useSelector(state => state.auth?.userCD)
    const [data, setData] = useState('')
    const dispatch = useDispatch()
    const [refreshing, setRefreshing] = useState(true)
    const refLoading = useRef()
    const refFile = useRef()

    useEffect(() => {
        getData()
    }, [IdThueNha])

    const getData = async () => {
        setRefreshing(true)
        let res = await ApiThueNha.GetTinThueNhaById(IdThueNha)
        console.log('[LOG] res info', res)
        setRefreshing(false)
        if (res.status == 1 && res?.data) {
            let arrFile = []
            res.data?.ListFile?.forEach(item => {
                const isCheckImage = Utils.checkIsImage(item?.FileDinhKem)
                const checkVideo = Utils.checkIsVideo(item?.FileDinhKem)
                if (isCheckImage || !checkVideo) {
                    arrFile.push({
                        ...item,
                        typeFile: 'image',
                        uri: appConfig.domain + item?.FileDinhKem

                    })
                } else {
                    arrFile.push({
                        ...item,
                        typeFile: 'video',
                        uri: appConfig.domain + item?.FileDinhKem
                    })
                }
            });
            refFile?.current?.setData(arrFile)
            const arrDiaChi = res.data?.DiaChi ? res.data?.DiaChi?.split('_') : ['??ang c???p nh???t']
            const DiaChi = arrDiaChi[0]
            const DiaDiemMap = arrDiaChi?.length == 2 ? arrDiaChi[1] : '??ang c???p nh???t v??? tr??'
            setData({ ...res.data, ListFileDinhKem: arrFile, DiaChi: DiaChi, DiaDiemMap: DiaDiemMap })
        } else {
            setData('')
        }
    }

    const onBack = () => {
        Utils.goback({ props })
    }

    const onSaved = async () => {

    }

    const openMapDirection = () => {
        Utils.getCurrentPosition({ props }, (latlng) => {
            console.log('[LOG] lat long callback', latlng)
            openMap({
                start: `${latlng?.latitude},${latlng?.longitude}`,
                zoom: 16,
                travelType: 'drive',
                end: `${data?.Lat},${data?.Long}`,//`${data?.DiaDiem}`,
                provider: Platform.OS == 'android' ? 'google' : 'apple',
            })
        })
    }

    const callPhoneNumber = () => {
        if (data?.SDTLienHe)
            Utils.dialCall(data?.SDTLienHe ? Number(data?.SDTLienHe) : '')
        else
            Utils.showToastMsg('Th??ng b??o', 'S??? ??i???n tho???i ??ang c???p nh???t.', icon_typeToast.info, 2000, icon_typeToast.info)
    }

    return (
        <View style={[{ flex: 1, backgroundColor: 'white' }]}>
            <HeaderWidget
                title={'Chi ti???t th??ng tin'}
                iconLeft={ImgWidget.icBack}
                onPressLeft={onBack}
                iconRight={ImgWidget.icStarYellow}
                Sright={{ color: colorsWidget.labelInput }}
                onPressRight={onSaved}
            />
            <View style={{ marginHorizontal: 10, flex: 1 }}>
                <ScrollView
                    contentContainerStyle={{ paddingBottom: 50 }}
                    showsVerticalScrollIndicator={false}
                    pointerEvents={refreshing}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={getData}
                        // title={!refresh ? 'Vu???t xu???ng th??? ra ????? c???p nh???t' : `??ang t???i th??ng tin...`}
                        />
                    }>
                    <PickerWidget
                        ref={refFile}
                        // trackingFile={val => setTrackingFile(val)}
                        dataFile={data?.ListFileDinhKem}
                        isSeen={true}
                        widthSize={Width(90)}
                        heightSize={Width(80)}
                        autoLoop
                    />
                    <View style={{ marginTop: 15, flex: 1, paddingHorizontal: 10 }}>
                        <Text style={[{ fontSize: reText(16), fontWeight: 'bold' }]}>{data?.TieuDe || '??ang c???p nh???t'}</Text>
                        <TextLine
                            title={'??? Gi??:'}
                            value={formatNumber(data?.Gia?.toString()) + ' VND' || '??ang c???p nh???t'}
                            showTitle
                            styleTitle={{ color: colorsWidget.main, fontSize: reText(16) }}
                            style={{ marginTop: 10 }}
                            styleValue={{ color: colorsWidget.main, fontWeight: 'bold', fontSize: reText(16) }}
                        />
                        <TextLine
                            title={'??? Lo???i nh??:'}
                            value={data?.TenLoai || '??ang c???p nh???t'}
                            showTitle
                            styleTitle={{ fontWeight: 'normal' }}
                            style={{ marginTop: 10 }}
                        />
                        <TextLine
                            title={'??? Di???n t??ch:'}
                            value={data?.DienTich + `m2` || '??ang c???p nh???t'}
                            showTitle
                            styleTitle={{ fontWeight: 'normal' }}
                            style={{ marginTop: 10 }}
                        />
                        <TextLine
                            title={'??? Th???i gian thu??:'}
                            value={data?.TenThoiGianThue || '??ang c???p nh???t'}
                            showTitle
                            styleTitle={{ fontWeight: 'normal' }}
                            style={{ marginTop: 10 }}
                        />
                        <TextLine
                            title={'??? ?????a ch???:'}
                            value={`${data?.DiaChi}` || '??ang c???p nh???t'}
                            showTitle
                            styleTitle={{ fontWeight: 'normal' }}
                            style={{ marginTop: 10 }}
                        />
                        <TextLine
                            title={'??? V??? tr?? b???n ?????:'}
                            value={`${data?.DiaDiemMap}` || '??ang c???p nh???t'}
                            showTitle
                            styleTitle={{ fontWeight: 'normal' }}
                            style={{ marginTop: 10 }}
                        />
                        <TextLine
                            title={'M?? t???'}
                            value={data?.MoTa || '??ang c???p nh???t'}
                            showTitle
                            styleTitle={{ fontWeight: 'normal', color: colorsWidget.main, fontWeight: 'bold', fontSize: reText(16) }}
                            style={{ marginTop: 10, flexDirection: 'column' }}
                            styleValue={{ lineHeight: 25, paddingLeft: 0 }}
                        />
                        <View>
                            <Text style={[stChiTietThueNha.stText]}>{'Li??n h???'}</Text>
                            <TextLine
                                icon={ImgWidget.icUser}
                                value={data?.NguoiLienHe || '??ang c???p nh???t'}
                                style={{ marginTop: 10 }}
                                styleIcon={nstyles.nIcon15}
                            />
                            <TextLine
                                icon={ImgWidget.icPhone}
                                value={formatPhone(data?.SDTLienHe) || '??ang c???p nh???t'}
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
                                    latitude: data?.Lat,
                                    longitude: data?.Long,
                                    latitudeDelta: 0.001,
                                    longitudeDelta: 0.001
                                }}
                            >
                                <Marker
                                    coordinate={{
                                        latitude: data?.Lat,
                                        longitude: data?.Long
                                    }}
                                    title={'V??? tr?? ??ang ch???n' || ''}
                                />
                            </MapView>
                        </View>
                    </View>
                </ScrollView>
                <View style={{ paddingBottom: 24, flexDirection: 'row' }}>
                    <ButtonWidget
                        onPress={callPhoneNumber}
                        style={[stChiTietThueNha.stButton, { backgroundColor: colorsWidget.mainOpacity, marginHorizontal: 5 }]}
                        styleText={[stChiTietThueNha.stTextButton, { color: colorsWidget.main }]}
                        text={'Li??n h???'}
                    />
                    <ButtonWidget
                        onPress={openMapDirection}
                        style={[stChiTietThueNha.stButton, { backgroundColor: colorsWidget.bgkDaDuyet, marginRight: 5 }]}
                        styleText={[stChiTietThueNha.stTextButton, { color: colorsWidget.DaDuyet }]}
                        text={'Ch??? ???????ng'}
                    />
                </View>
            </View>
            <IsLoading ref={refLoading} />
        </View>
    )
}

const stChiTietThueNha = StyleSheet.create({
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

export default ChiTietThueNha