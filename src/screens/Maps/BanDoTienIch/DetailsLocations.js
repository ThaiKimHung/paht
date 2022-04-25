import React from 'react'
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
import { appConfig } from '../../../../app/Config'
import { getCurrentPosition } from './FuntionHandler'
import index from '../../dashboardIOC'

let LATITUDE_DELTA = () => 10 / nheight();
let LONGITUDE_DELTA = () => LATITUDE_DELTA() * nwidth() / nheight();

const DetailsLocations = (props) => {
    const { isLandscape } = useSelector(state => state.theme)
    const { TenTienIch = '', AnhDaiDienTienIch = '', DiaDiem = '', Lat = '', Long = '', SDT = '', Email, Website } = Utils.ngetParam({ props }, 'data', {})
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
        if (Website) {
            let tempUrl = Website;
            if (!(tempUrl.includes("http://") || tempUrl.includes("https://"))) {
                tempUrl = "http://" + tempUrl;
            }
            Linking.openURL(tempUrl);
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
                end: `${Lat},${Long}`,//`${data?.DiaDiem}`,
                provider: Platform.OS == 'android' ? 'google' : 'apple',
            })
        })
    }

    return (
        <View style={stDetailsLocations.container}>
            <HeaderCus
                Sleft={{ tintColor: 'white' }}
                onPressLeft={() => Utils.goback(this)}
                iconLeft={Images.icBack}
                title={TenTienIch || 'Chi tiết'}
                styleTitle={{ color: colors.white }}
            />
            <View style={stDetailsLocations.body}>
                <ScrollView contentContainerStyle={{ backgroundColor: colors.white, paddingBottom: 50 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: reText(18), margin: 10, textAlign: 'justify' }}>{TenTienIch || ''}</Text>
                    <ImageCus
                        defaultSourceCus={null}
                        source={{ uri: AnhDaiDienTienIch }}
                        resizeMode='contain'
                        style={AnhDaiDienTienIch ? { width: nwidth(), height: Width(isLandscape ? 30 : 70), backgroundColor: 'white', marginBottom: 10 } : {}}
                    />
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
                        <TouchExtention
                            icon={Images.icRowMapWhite}
                            title={'Chỉ đường'}
                            style={{ backgroundColor: '#0089FF', padding: 8, borderRadius: 50, marginLeft: 10 }}
                            styleTitle={{ color: colors.white }}
                            onPress={() => openMapDirection()}
                        />
                        <TouchExtention
                            icon={Images.icPhoneBlue}
                            title={'Liên hệ'}
                            style={{ backgroundColor: 'white', padding: 8, borderRadius: 50, borderWidth: 1, borderColor: '#0089FF', marginHorizontal: 10 }}
                            styleTitle={{ color: '#0089FF' }}
                            styleIcon={nstyles.nIcon20}
                            onPress={() => { dialCall(SDT?.split(' ').join('')) }}
                        />
                        <TouchExtention
                            icon={Images.icLaBan}
                            title={'Trang web'}
                            style={{ backgroundColor: 'white', padding: 8, borderRadius: 50, borderWidth: 1, borderColor: '#0089FF' }}
                            styleTitle={{ color: '#0089FF' }}
                            styleIcon={nstyles.nIcon20}
                            onPress={onLinkWeb}
                        />
                    </View>
                    <Text style={{ fontWeight: 'bold', fontSize: reText(18), margin: 10, textAlign: 'justify' }}>{'Tổng quan'}</Text>
                    <TextLine
                        style={{ padding: 10 }}
                        icon={Images.icPhoneBlue}
                        value={SDT ? SDT : 'Đang cập nhật'}
                        styleValue={{ paddingLeft: 15 }}
                    />
                    <TextLine
                        style={{ padding: 10 }}
                        icon={Images.icPositionBlue}
                        value={DiaDiem ? DiaDiem : 'Đang cập nhật'}
                        styleValue={{ paddingLeft: 15 }}
                    />
                    <TextLine
                        style={{ padding: 10 }}
                        icon={Images.icEmailBlue}
                        value={Email ? Email : 'Đang cập nhật'}
                        styleValue={{ paddingLeft: 15 }}
                    />
                    <TextLine
                        style={{ padding: 10 }}
                        icon={Images.icLaBan}
                        value={Website ? Website : 'Đang cập nhật'}
                        styleValue={{ paddingLeft: 15 }}
                    />
                    <Text style={{ fontWeight: 'bold', fontSize: reText(18), margin: 10, textAlign: 'justify' }}>{'Bản đồ'}</Text>
                    <View style={{ width: nwidth() - 20, height: Width(isLandscape ? 40 : 90), alignSelf: 'center', marginTop: 10, borderWidth: 0.5, borderColor: colors.grayLight }}>
                        <MapView style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                            provider={PROVIDER_GOOGLE}
                            showsUserLocation={true}
                            initialRegion={{
                                latitude: Lat,
                                longitude: Long,
                                latitudeDelta: 0.001,
                                longitudeDelta: 0.001
                            }}
                        // region={{
                        //     ...appConfig.defaultRegion,
                        //     latitude: Lat,
                        //     longitude: Long,
                        // }}
                        >
                            <Marker
                                coordinate={{
                                    latitude: Lat,
                                    longitude: Long
                                }}
                                title={TenTienIch || ''}
                            />
                        </MapView>
                    </View>
                </ScrollView>
            </View>
        </View>
    )
}

const stDetailsLocations = StyleSheet.create(
    {
        container: {
            flex: 1, backgroundColor: colors.white
        },
        body: { flex: 1, backgroundColor: colors.white }
    }
)

export default DetailsLocations
