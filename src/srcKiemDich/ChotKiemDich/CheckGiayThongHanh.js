import React, { Component, forwardRef, useState, useMemo, useImperativeHandle, useEffect } from 'react'
import { View, Text, TouchableOpacity, Image, FlatList, StyleSheet, BackHandler, ActivityIndicator, RefreshControl } from 'react-native';
import Utils from '../../../app/Utils';
import { HeaderCus, ListEmpty } from '../../../components';
import { colors } from '../../../styles';
import { reSize, reText } from '../../../styles/size';
import { Height, nstyles, Width } from '../../../styles/styles';
import { Images } from '../../images';
import { RNCamera } from 'react-native-camera';
import { useSelector } from 'react-redux';
import apis from '../../apis';
import { withNavigationFocus } from 'react-navigation';
import { appConfig } from '../../../app/Config';
import CryptoJS from 'crypto-js'
import { nGlobalKeys } from '../../../app/keys/globalKey';

const CheckGiayThongHanh = (props) => {
    const { colorLinear } = useSelector(state => state.theme)
    const { ChotKiemDich = '' } = useSelector(state => state.datahcm)
    const { userDH } = useSelector(state => state.auth)
    const [flash, setFlash] = useState(false)
    const [expandList, setExpandList] = useState(false)
    const [dataQR, setDataQR] = useState('')
    const [isSaveChotKiem, setisSaveChotKiem] = useState(Utils.ngetParam({ props: props }, 'isSaveChotKiem', false))
    const [page, setPage] = useState({ Page: 1, AllPage: 1, Size: 10, Total: 0 })
    const [data, setData] = useState([])
    const [isHandleQR, setIsHandleQR] = useState(false)
    const [refreshing, setRefreshing] = useState(true)
    const checkQuayDau_ChotKiemDich = Utils.getGlobal(nGlobalKeys.checkQuayDau_ChotKiemDich, false)

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', backAction)
        return () => {
            try {
                BackHandler.removeEventListener('hardwareBackPress', backAction)
            } catch (error) {

            }
        }
    }, [backAction])


    const backAction = () => {
        Utils.goback({ props: props })
        return true
    }

    const KetQuaQuet = (item) => {
        // Utils.navigate('Modal_KetQuaQuet', { itemHistory: item })
    }

    const _onBarCodeRead = async props => {
        if (expandList) return
        const bytes = CryptoJS.AES.decrypt(props.data, appConfig.keySecret);
        const stringQR = bytes.toString(CryptoJS.enc.Utf8);
        console.log('QR SAU KHI DECRYPT ', stringQR); // Decrypt qr
        if (stringQR) {
            setIsHandleQR(true)
            let bodyQR = null;
            try {
                bodyQR = JSON.parse(stringQR)
            } catch (error) {
                bodyQR = null
            }
            if (bodyQR.PhoneNumberCD && bodyQR.CMND && bodyQR.HoTen) {
                setTimeout(async () => {
                    let strMaHoa = bodyQR.CMND + "$" + bodyQR.PhoneNumberCD + "$" + bodyQR.HoTen // userCD?.CMND + "$" + userCD?.PhoneNumber + "$" + userCD.FullName
                    let res = await apis.ApiApp.MaHoa(strMaHoa)
                    Utils.nlog('res ma hoa', strMaHoa, res)
                    if (res.status == 1 && res.data) {
                        Utils.nlog('res ma hoa link', `${appConfig.domainGiayThongHanh}vi/thong-tin-qr-code?encdata=${encodeURIComponent(res.data)}`)
                        let urlGTH = `${appConfig.domainGiayThongHanh}vi/thong-tin-qr-code?encdata=${encodeURIComponent(res.data)}`
                        Utils.openWeb(this, urlGTH, { isLinking: false, isShowMenuWeb: true, title: 'Giấy thông hành', callback: callbackQR })
                    } else {
                        Utils.showMsgBoxOKTop('Thông báo', 'Xảy ra lỗi ! Vui lòng thử lại.', 'Xác nhận', () => {
                            setIsHandleQR(false)
                        })
                    }
                }, 300);
            } else {
                Utils.showMsgBoxOKTop('Thông báo', 'QR không đúng hoặc có lỗi trong quá trình xử lý. Thử lại sau!', 'Xác nhận', () => {
                    setIsHandleQR(false)
                })
            }
        } else {
            setIsHandleQR(false)
        }
    }

    const callbackQR = () => {
        setIsHandleQR(false)
    }

    const _onRefresh = () => {
        setRefreshing(true)
    }

    const stCheckGiayThongHanh = StyleSheet.create({
        container: {
            flex: 1, backgroundColor: colors.white
        },
        titleHeader: {
            color: colors.white, fontSize: reText(18)
        },
        Body: {
            flex: 1, backgroundColor: colors.black
        },
        Camera: {
            flex: 1
        },
        handleCamera: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: colors.nocolor
        },
        containerHandlerCamera: {
            marginTop: Height(20),
            alignSelf: 'center',
            backgroundColor: colorLinear.color[0],
            padding: 10,
            flexDirection: 'row', borderRadius: 3
        },
        textHandleCamera: {
            color: colors.white, fontSize: reText(14), paddingLeft: 5
        },
        FrameFocus: {
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colors.nocolor
        },
        titleFrameCamera: {
            backgroundColor: 'rgba(0,0,0,0.7)', marginBottom: Height(10), padding: Height(1), width: '100%'
        },
        txtFrameCamera_1: {
            color: colors.white, fontWeight: 'bold', fontSize: reText(16), textAlign: 'center'
        },
        txtFrameCamera_2: {
            color: colors.white, fontSize: reText(12), textAlign: 'justify', lineHeight: 18
        },
        handlingCamera: {
            width: reSize(200), height: reSize(200)
        },
        btnFlash: {
            marginTop: Height(10), marginBottom: Height(1)
        },
        containFlash: {
            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
        },
        iconFlash: {
            ...nstyles.nIcon20,
            tintColor: 'white'
        },
        titleFlash: {
            fontSize: reText(16), color: colors.white
        },
        viewBottom: {
            borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: 'rgba(0,0,0,0.7)', flex: 1
        },
        btnExpand: {
            paddingTop: 10, alignSelf: 'center', paddingHorizontal: 50
        },
        iconExpand: {
            ...nstyles.nIcon20,
            tintColor: 'white'
        },
        headerViewBottom: {
            flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10
        },
        txtDoiKhuVuc: {
            fontSize: reText(14), fontWeight: 'bold', color: colorLinear.color[0]
        },
        txtTatCa: {
            fontSize: reText(14), textAlign: 'right', fontWeight: 'bold', color: colorLinear.color[0]
        },
        headerListHistory: {
            flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 10
        },
        iconHistory: {
            ...nstyles.nIcon14,
            tintColor: 'white'
        },
        txtHistory: {
            color: colors.white, textAlign: 'center', fontStyle: 'italic', paddingLeft: 5, fontSize: reText(12)
        }
    })

    return (
        <View style={stCheckGiayThongHanh.container}>
            <HeaderCus
                onPressLeft={isSaveChotKiem ? () => Utils.navigate('ManHinh_Home') : () => Utils.goback({ props: props })}
                iconLeft={Images.icBack}
                title={`Kiểm giấy thông hành`}
                styleTitle={stCheckGiayThongHanh.titleHeader}
            />
            <View style={stCheckGiayThongHanh.Body}>
                <View style={stCheckGiayThongHanh.Camera}>
                    <RNCamera
                        // ref={ref => this.ref = ref}
                        style={stCheckGiayThongHanh.Camera}
                        flashMode={flash ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off}
                        captureAudio={false}
                        cameraViewDimensions={{
                            width: Height(100),
                            height: Width(100),
                        }}
                        barcodeTypes={false}
                        onBarCodeRead={isHandleQR == false ? _onBarCodeRead : () => { }}
                    />
                    {
                        isHandleQR ?
                            <View style={stCheckGiayThongHanh.handleCamera}>
                                <View style={stCheckGiayThongHanh.containerHandlerCamera}>
                                    <ActivityIndicator size={'small'} color={'white'} />
                                    <Text style={stCheckGiayThongHanh.textHandleCamera}>{'Đang kiểm tra dữ liệu !'}</Text>
                                </View>
                            </View>
                            : null
                    }
                </View>
                <View style={stCheckGiayThongHanh.FrameFocus}>
                    {
                        expandList ? null : <View style={{ alignItems: 'center' }}>
                            <View style={stCheckGiayThongHanh.titleFrameCamera}>
                                <Text style={stCheckGiayThongHanh.txtFrameCamera_1}>{'Hướng khung Camera vào QR để quét'}</Text>
                                {/* <Text style={stCheckGiayThongHanh.txtFrameCamera_2} numberOfLines={2}>
                                    Chốt kiểm: {`${ChotKiemDich?.DiaChi ? ChotKiemDich.DiaChi + ', ' : ''}${ChotKiemDich?.Phuong ? ChotKiemDich.Phuong + ', ' : ''}${ChotKiemDich?.Quan ? ChotKiemDich.Quan : ''}${ChotKiemDich?.ThanhPho ? ', ' + ChotKiemDich.ThanhPho : ''}`}
                                </Text> */}
                            </View>
                            {isHandleQR ? <View style={stCheckGiayThongHanh.handlingCamera} /> : <Image source={Images.icFrameQR} style={stCheckGiayThongHanh.handlingCamera} resizeMode='contain' />}
                            <TouchableOpacity onPress={() => { setFlash(!flash) }} activeOpacity={0.5} style={stCheckGiayThongHanh.btnFlash}>
                                <View style={stCheckGiayThongHanh.containFlash}>
                                    <Image source={flash ? Images.icFlashOn : Images.icFlashOff} style={stCheckGiayThongHanh.iconFlash} resizeMode='contain' />
                                    <Text style={stCheckGiayThongHanh.titleFlash} numberOfLines={1}>{flash ? 'Tắt đèn Flash' : 'Bật đèn Flash'}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    }
                </View>
            </View>
        </View>
    )
}



export default withNavigationFocus(CheckGiayThongHanh)
