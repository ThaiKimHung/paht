import { View, Text, StyleSheet, Image, TouchableOpacity, PermissionsAndroid, Platform, Linking } from 'react-native'
import React, { useState, useRef, useEffect, useMemo } from 'react'
import { AddressWidget, ButtonWidget, DropWidget, HeaderWidget, InputWidget, PickerWidget } from '../../../CompWidgets'
import { ImgWidget } from '../../../Assets'
import Utils, { icon_typeToast } from '../../../../../app/Utils'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { colorsWidget, colors } from '../../../../../styles/color'
import TextApp from '../../../../../components/TextApp'
import { reText } from '../../../../../styles/size'
import { nstyles, nwidth, Width } from '../../../../../styles/styles'
import { useDispatch, useSelector } from 'react-redux'
import { onChangeDropdown, getListDanhMuc, formatFirstLastName, regexPhoneNumber, isValidPhone, handlerListInput } from '../../RaoVat/DangTin/HandlerDangTin'
import { setDataTaoSuaTinThueNha } from '../../../../../srcRedux/actions/widgets'
import Geolocation from 'react-native-geolocation-service';
import apis from '../../../../apis'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { isLandscape } from 'react-native-device-info'

const MoTaThueNha = (props) => {
    const { dataTaoSuaTinThueNha } = useSelector(state => state.Widgets)
    const dispatch = useDispatch()
    const [MoTa, setMoTa] = useState(dataTaoSuaTinThueNha?.isEdit ? dataTaoSuaTinThueNha?.MoTaSanPham || '• ' : '• ')
    const [Lat, setLat] = useState(dataTaoSuaTinThueNha?.Lat ? dataTaoSuaTinThueNha?.Lat : '');
    const [Lng, setLng] = useState(dataTaoSuaTinThueNha?.Lng ? dataTaoSuaTinThueNha?.Lng : '');
    const [DiaDiemMap, setDiaDiemMap] = useState(dataTaoSuaTinThueNha?.DiaDiemMap ? dataTaoSuaTinThueNha?.DiaDiemMap : 'Đang lấy dữ liệu vị trí hiện tại');
    const refFile = useRef()
    const [trackingFile, setTrackingFile] = useState('')
    const [trackingNext, setTrackingNext] = useState(false)

    let isgetFirstLocationOK = true;
    let granted;
    let isRead = false;

    useEffect(() => {
        if (trackingFile.length > 0 && MoTa.length > 5 && Lat && Lng && DiaDiemMap)
            setTrackingNext(true)
        else
            setTrackingNext(false)

    }, [trackingFile, MoTa, Lat, Lng, DiaDiemMap])

    const onCancel = () => {
        Utils.showMsgBoxYesNoTop('Thông báo', 'Bạn có chắc muốn huỷ tạo tin thuê nhà?', 'Huỷ', 'Xem lại', () => {
            dispatch(setDataTaoSuaTinThueNha({}))
            Utils.navigate('scHomeThueNha')
        })
    }

    const onBack = () => {
        Utils.goback({ props })
    }

    const onNext = () => {
        let objectData = {
            ...dataTaoSuaTinThueNha,
            MoTaSanPham: MoTa,
            ListFileDinhKem: trackingFile,
            Lat: Lat,
            Lng: Lng,
            DiaDiemMap: DiaDiemMap,
        }
        console.log('[LOG] data object', objectData);
        dispatch(setDataTaoSuaTinThueNha(objectData))
        Utils.navigate('scXemTruocTinThueNha')
    }

    useEffect(() => {
        if (!Lat && !Lng)
            getCurrentPosition()
    }, [])


    useEffect(() => {
        FindLocation()
    }, [Lat, Lng])

    const callbackChooseMap = (diaDiem, latlng) => {
        setDiaDiemMap(diaDiem)
        setLat(latlng.latitude)
        setLng(latlng.longitude)
    }

    const onPressMaps = async () => {
        Utils.goscreen({ props }, 'Modal_BanDo_Root', {
            latitude: Lat,
            longitude: Lng,
            callbackDataMaps: callbackChooseMap
        })
    }

    const getCurrentPosition = async (enableThemDiaDiem, tuDongViTri = true, isEndFirstRequest = 0) => {
        Geolocation.setRNConfiguration({ skipPermissionRequests: true, authorizationLevel: 'whenInUse' });
        Geolocation.requestAuthorization();

        if (Platform.OS == 'android') {
            granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
                title: 'Tự động lấy vị trí',
                message: 'Cho phép sử dụng vị trí hiện tại của bạn khi sử dụng.',
                buttonNegative: 'Để sau',
                buttonPositive: 'Cấp quyền'
            })
            if (granted == PermissionsAndroid.RESULTS.GRANTED) {
                Geolocation.getCurrentPosition(
                    (position) => {
                        Utils.nlog('geolocation-android', JSON.stringify(position));
                        var { coords = {} } = position;
                        var { latitude, longitude } = coords;
                        setLat(latitude)
                        setLng(longitude);
                    },
                    error => Utils.nlog('getCurrentPosition error: ', JSON.stringify(error)),
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
                );
            }
        } else {
            Geolocation.getCurrentPosition(
                (position) => {
                    isgetFirstLocationOK = true;
                    Utils.nlog('geolocation-ios', JSON.stringify(position));
                    var { coords = {} } = position;
                    var { latitude, longitude } = coords;
                    if (Platform.OS == 'ios' && (!latitude || !longitude)) {
                        Utils.showMsgBoxYesNo({ props }, 'Dịch vụ vị trí bị tắt', 'Hãy bật dịch vụ vị trí trong phần cài đặt điện thoại của bạn.',
                            'Đến cài đặt', 'Không, cảm ơn',
                            () => {
                                Linking.openURL('app-settings:').catch((err) => {
                                    Utils.nlog('app-settings:', err);
                                });
                            });
                    } else {
                        console.log(latitude, longitude)
                        granted = 'granted';
                        setLat(latitude)
                        setLng(longitude);
                    }
                },
                (error) => {
                    let {
                        code
                    } = error;
                    if (AppState.currentState == 'active')
                        isgetFirstLocationOK = true;
                    setTimeout(() => {
                        if (code == 1 && AppState.currentState == 'active') {
                            Utils.showMsgBoxYesNo({ props }, 'Dịch vụ vị trí bị tắt',
                                'Ứng dụng cần truy cập vị trí của bạn. Hãy bật dịch vụ vị trí trong phần cài đặt điện thoại của bạn.',
                                'Đến cài đặt', 'Không, cảm ơn',
                                () => {
                                    Linking.openURL('app-settings:').catch((err) => {
                                        nlog('app-settings:', err);
                                    });
                                });
                        }
                    }, 200);
                    Utils.nlog('getCurrentPosition error: ', JSON.stringify(error))
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
            );

            //--Tự động lấy vi trí lần đầu hỏi IOS, Android check làm sau
            if (isEndFirstRequest == 1 && tuDongViTri) {
                setTimeout(() => {
                    if (!isgetFirstLocationOK) {
                        getCurrentPosition(true, tuDongViTri, 1);
                    }
                }, 2000);
            }
            //--End auto check first--
        }
    }

    const FindLocation = async () => {
        if (Lat && Lng) {
            let res = await apis.ApiApp.getAddressGG(Lat, Lng);
            if (res && res.full_address) {
                setDiaDiemMap(res.full_address)
            } else {
                setDiaDiemMap(res.latitude + ', ' + res.longitude)
            }
        }
    }

    return (
        <View style={stMoTaThueNha.container}>
            <HeaderWidget
                title={'Chi tiết sản phẩm'}
                iconLeft={ImgWidget.icBack}
                onPressLeft={onBack}
                titleRight={'Huỷ'}
                Sright={{ color: colorsWidget.labelInput }}
                onPressRight={onCancel}
            />
            <View style={stMoTaThueNha.body}>
                <KeyboardAwareScrollView contentContainerStyle={{ paddingBottom: 50 }} showsVerticalScrollIndicator={false}>
                    <PickerWidget
                        ref={refFile}
                        trackingFile={val => setTrackingFile(val)}
                        dataFile={dataTaoSuaTinThueNha?.ListFileDinhKem || []}
                    />
                    {useMemo(() => <InputWidget
                        label={'Mô tả sản phẩm'}
                        required
                        placeholder={'Nội dung mô tả sản phẩm'}
                        value={MoTa}
                        onChangeText={val => setMoTa(handlerListInput(val, '•'))}
                        multiline
                        styleInput={{ maxHeight: 350, minHeight: 100, lineHeight: 25, textAlignVertical: 'top' }}
                        styleLabel={{ color: colorsWidget.main }}
                        styleValueRequired={{ color: colorsWidget.main }}
                    />, [MoTa])}
                    <TextApp style={{ marginTop: 10, color: colorsWidget.main }}>{'Vị trí (tự động lấy vi trí hiện tại) *'}</TextApp>
                    <View style={stMoTaThueNha.containerLocation}>
                        <TextApp style={{ margin: 8, flex: 1, textAlign: 'justify' }}>{DiaDiemMap}</TextApp>
                        <TouchableOpacity onPress={onPressMaps} activeOpacity={0.5} style={stMoTaThueNha.btnBanDo}>
                            <TextApp style={{ color: colors.white }}>{'Bản đồ'}</TextApp>
                        </TouchableOpacity>
                    </View>
                    {useMemo(() => <View pointerEvents={'none'} style={{ width: nwidth() - 20, height: Width(isLandscape ? 40 : 90), alignSelf: 'center', marginTop: 10, borderWidth: 0.5, borderColor: colors.grayLight }}>
                        <MapView style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                            // provider={PROVIDER_GOOGLE}
                            showsUserLocation={true}
                            region={{
                                latitude: Lat,
                                longitude: Lng,
                                latitudeDelta: 0.001,
                                longitudeDelta: 0.001
                            }}
                        >
                            <Marker
                                coordinate={{
                                    latitude: Lat,
                                    longitude: Lng
                                }}
                                title={'Vị trí đang chọn' || ''}
                            />
                        </MapView>
                    </View>, [Lat, Lng])}
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
const stMoTaThueNha = StyleSheet.create({
    container: {
        flex: 1
    },
    body: {
        flex: 1,
        padding: 10
    },
    btnBanDo: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 5,
        backgroundColor: colors.greenButton
    },
    containerLocation: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        backgroundColor: colorsWidget.grayDropdown,
        marginVertical: 10,
        borderRadius: 5,
        padding: 5
    }
})
export default MoTaThueNha