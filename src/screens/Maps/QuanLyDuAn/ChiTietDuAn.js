import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Platform, Linking } from 'react-native'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { useSelector } from 'react-redux'
import Utils, { icon_typeToast } from '../../../../app/Utils'
import { HeaderCus } from '../../../../components'
import ImageCus from '../../../../components/ImageCus'
import TextLine from '../../../../components/TextLine'
import { colors } from '../../../../styles'
import { reText } from '../../../../styles/size'
import { isLandscape, nheight, nstyles, nwidth, Width } from '../../../../styles/styles'
import { Images } from '../../../images'
import openMap from 'react-native-open-maps';
import { getCurrentPosition } from '../BanDoTienIch/FuntionHandler'
import apis from '../../../apis'

let LATITUDE_DELTA = () => 10 / nheight();
let LONGITUDE_DELTA = () => LATITUDE_DELTA() * nwidth() / nheight();

const ChiTietDuAn = (props) => {
    const { isLandscape } = useSelector(state => state.theme)
    const Id = Utils.ngetParam({ props }, 'Id', {})
    const [data, setData] = useState('')

    useEffect(() => {
        GetDetails()
    }, [Id])


    const GetDetails = async () => {
        Utils.setToggleLoading(true)
        const res = await apis.ApiQLDuAn.Info_DMDuAn_App(Id)
        Utils.nlog('res details', res)
        Utils.setToggleLoading(false)
        if (res.status == 1 && res.data) {
            setData(res.data)
        } else {
            setData('')
        }
    }

    const dialCall = (number) => {
        if (number.match(/^[0-9]+$/) != null) {
            let phoneNumber = '';
            if (number == undefined) {
                Utils.showMsgBoxOK(this, "Thông báo", "Chưa có số điện thoại", 'Xác nhận')
                return;
            }
            if (Utils.validateEmail(number)) {
                phoneNumber = `mailto:${number}`;
            } else if (Platform.OS === 'android') {
                phoneNumber = `tel:${number}`;
            }
            else {
                phoneNumber = `telprompt:${number}`;
            }
            Linking.openURL(phoneNumber)
        } else {
            return Utils.showToastMsg('Thông báo', 'Số điện thoại đang cập nhật.', icon_typeToast.info, 2000)
        }


    };
    const TouchExtention = (props) => {
        const { icon = undefined, onPress = () => { }, title = '', style, styleTitle, styleIcon } = props
        return (
            <TouchableOpacity onPress={onPress} style={[{}, style]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={icon} resizeMode='contain' style={[nstyles.nIcon24, styleIcon]} />
                    <Text style={[{ marginLeft: 5, fontSize: reText(12) }, styleTitle]}>
                        {title}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }

    const onLinkWeb = () => {
        if (data?.Website) {
            Linking.openURL(data?.ebsite)
        } else {
            Utils.showToastMsg('Thông báo', 'Trang web đang cập nhật !', icon_typeToast.info, 1000)
        }
    }

    const openMapDirection = () => {
        getCurrentPosition({ props }, (latlng) => {
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

    return (
        <View style={stChiTietDuAn.container}>
            <HeaderCus
                Sleft={{ tintColor: 'white' }}
                onPressLeft={() => Utils.goback(this)}
                iconLeft={Images.icBack}
                title={data?.TenDuAn || 'Chi tiết'}
                styleTitle={{ color: colors.white }}
            />
            <View style={stChiTietDuAn.body}>
                <ScrollView contentContainerStyle={{ backgroundColor: colors.white, paddingBottom: 50 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: reText(18), margin: 10, textAlign: 'justify' }}>{data?.TenDuAn || ''}</Text>
                    <Text style={{ fontWeight: 'bold', fontSize: reText(18), margin: 10, textAlign: 'justify' }}>{'Tổng quan'}</Text>
                    <TextLine
                        showTitle
                        styleTitle={{ color: '#0089FF' }}
                        title={"Mã dự án:"}
                        style={{ padding: 10 }}
                        value={data?.MaDA ? data?.MaDA : 'Đang cập nhật'}
                        styleValue={{ paddingLeft: 15 }}
                    />
                    <TextLine
                        showTitle
                        styleTitle={{ color: '#0089FF' }}
                        title={"Địa điểm:"}
                        style={{ padding: 10 }}
                        value={data?.DiaDiem ? data?.DiaDiem : 'Đang cập nhật'}
                        styleValue={{ paddingLeft: 15 }}
                    />
                    <TextLine
                        showTitle
                        styleTitle={{ color: '#0089FF' }}
                        title={"Chủ đầu tư:"}
                        style={{ padding: 10 }}
                        value={data?.TenChuDauTu ? data?.TenChuDauTu : 'Đang cập nhật'}
                        styleValue={{ paddingLeft: 15 }}
                    />
                    <TextLine
                        showTitle
                        styleTitle={{ color: '#0089FF' }}
                        title={"Nguồn vốn:"}
                        style={{ padding: 10 }}
                        value={data?.TenNguonVon ? data?.TenNguonVon : 'Đang cập nhật'}
                        styleValue={{ paddingLeft: 15 }}
                    />
                    <TextLine
                        showTitle
                        styleTitle={{ color: '#0089FF' }}
                        title={"Tình trạng:"}
                        style={{ padding: 10 }}
                        value={data?.TenTinhTrang ? data?.TenTinhTrang : 'Đang cập nhật'}
                        styleValue={{ paddingLeft: 15, color: data?.MaMauTinhTrang || colors.grayLight }}
                    />
                    <TextLine
                        showTitle
                        styleTitle={{ color: '#0089FF' }}
                        title={"Ngày tạo:"}
                        style={{ padding: 10 }}
                        value={data?.CreatedDate ? data?.CreatedDate : 'Đang cập nhật'}
                        styleValue={{ paddingLeft: 15 }}
                    />
                    <TextLine
                        showTitle
                        styleTitle={{ color: '#0089FF' }}
                        title={"Vốn đầu tư:"}
                        style={{ padding: 10 }}
                        value={data?.VonDauTu ? Utils.formatMoney(data?.VonDauTu) + ' (triệu đồng)' : 'Đang cập nhật'}
                        styleValue={{ paddingLeft: 15 }}
                    />
                    {
                        data ? <>
                            <Text style={{ fontWeight: 'bold', fontSize: reText(18), margin: 10, textAlign: 'justify' }}>{'Bản đồ'}</Text>
                            <View style={{ width: nwidth() - 20, height: Width(isLandscape ? 30 : 60), alignSelf: 'center', marginTop: 10, borderWidth: 0.5, borderColor: colors.grayLight }}>
                                <MapView style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                                    provider={PROVIDER_GOOGLE}
                                    showsUserLocation={true}
                                    initialRegion={{
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
                                        title={data?.TenDuAn || ''}
                                    />
                                </MapView>
                            </View>
                        </> : null
                    }

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', marginTop: 10 }}>
                        <TouchExtention
                            icon={Images.icRowMapWhite}
                            title={'Chỉ đường'}
                            style={{ backgroundColor: '#0089FF', padding: 8, borderRadius: 10, marginHorizontal: 10, flex: 1, alignItems: 'center' }}
                            styleTitle={{ color: colors.white, fontWeight: 'bold' }}
                            onPress={() => openMapDirection()}
                        />
                        <TouchExtention
                            icon={Images.icCameraNew}
                            title={'Camera'}
                            styleIcon={{ tintColor: 'white' }}
                            style={{ backgroundColor: '#0089FF', padding: 8, borderRadius: 10, marginRight: 10, flex: 1, alignItems: 'center' }}
                            styleTitle={{ color: colors.white, fontWeight: 'bold' }}
                            onPress={() => Utils.goscreen({ props }, 'Modal_DSCameraDuAn')}
                        />
                    </View>
                </ScrollView>
            </View>
        </View>
    )
}

const stChiTietDuAn = StyleSheet.create(
    {
        container: {
            flex: 1, backgroundColor: colors.white
        },
        body: { flex: 1, backgroundColor: colors.white }
    }
)

export default ChiTietDuAn
