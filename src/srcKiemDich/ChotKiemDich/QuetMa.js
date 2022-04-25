import React, { Component, forwardRef, useState, useMemo, useImperativeHandle, useEffect } from 'react'
import { View, Text, TouchableOpacity, Image, FlatList, StyleSheet, BackHandler, ActivityIndicator, RefreshControl } from 'react-native';
import Utils from '../../../app/Utils';
import { HeaderCus, ListEmpty } from '../../../components';
import { colors } from '../../../styles';
import { reSize, reText } from '../../../styles/size';
import { Height, nstyles, Width } from '../../../styles/styles';
import { Images } from '../../images';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { useSelector } from 'react-redux';
import apis from '../../apis';
import moment from 'moment'
import { withNavigationFocus } from 'react-navigation';
import { appConfig } from '../../../app/Config';
import ImageCus from '../../../components/ImageCus';
import CryptoJS from 'crypto-js'
import { nGlobalKeys } from '../../../app/keys/globalKey';

const QuetMa = (props) => {
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

    useEffect(() => {
        GetListHistoryScan()
    }, [])

    const GetListHistoryScan = async () => {
        let res = await apis.ApiChotKiem.GetListHistoryScan('', 1, 10)
        Utils.nlog('[LOG] res history', res)
        if (res.status == 1 && res.data) {
            setData(res.data)
            setRefreshing(false)
        } else {
            setData([])
            setRefreshing(false)
        }
    }

    const backAction = () => {
        if (isSaveChotKiem) {
            Utils.navigate('ManHinh_Home')
            return true
        } else {
            Utils.goback({ props: props })
            return true
        }
    }

    const KetQuaQuet = (item) => {
        // Utils.navigate('Modal_KetQuaQuet', { itemHistory: item })
        Utils.navigate('Modal_ChiTietLichSu', { data: item })
    }

    const renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity key={index} onPress={() => { KetQuaQuet(item) }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
                    <View style={[nstyles.nAva50, { backgroundColor: colors.BackgroundHome, marginTop: 5 }]}>
                        <ImageCus
                            defaultSourceCus={Images.imgAvatar}
                            source={item?.Avata ? { uri: appConfig.domain + item.Avata } : Images.imgAvatar}
                            style={[nstyles.nAva50, { alignSelf: 'center' }]}
                            resizeMode={'cover'} />
                    </View>
                    <View style={{ flex: 1, paddingLeft: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: reText(14), flex: 1, color: colors.white }} numberOfLines={1}>{item?.TenCongDan ? item.TenCongDan : ''}</Text>
                        </View>
                        <Text style={{ fontSize: reText(14), color: colors.white, marginTop: 5 }}>{item?.NgayQuet ? item.NgayQuet : ''}</Text>
                        <Text style={{ fontSize: reText(14), color: colors.white, marginTop: 5 }}>{item?.TenTram ? item.TenTram : ''}</Text>
                        <Text numberOfLines={2} style={{ fontSize: reText(14), marginTop: 5, textAlign: 'justify', lineHeight: 20, color: colors.white }}>
                            Địa chỉ trạm: {item?.DiaChi ? item.DiaChi + ', ' : ''}{item?.Phuong ? item.Phuong + ', ' : ''}{item?.Quan ? item.Quan : ''}{item?.ThanhPho ? ', ' + item.ThanhPho : ''}
                        </Text>
                    </View>
                </View>
                <View style={{ height: 0.5, backgroundColor: colors.grayLight, marginHorizontal: 10 }} />
            </TouchableOpacity>
        )
    }

    const _keyExtractor = (item, index) => index.toString()

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
            if (bodyQR.PhoneNumberCD) { //cũ là IdCongDan
                const body = {
                    "IsFromCanBo": true, // nếu cán bộ tại tram quét thì = true, người dân quét check in tại trạm thì = false
                    "IdTram": ChotKiemDich.IdTram,
                    "PhoneNumberCD": bodyQR.PhoneNumberCD
                }
                Utils.nlog('[LOG] body Post QR 1', body)
                Utils.nlog('[LOG] body Post QR 2', JSON.stringify(body))
                setTimeout(async () => {
                    if (checkQuayDau_ChotKiemDich) {
                        Utils.navigate('Modal_KetQuaQuet', { QR: { ...body, ...bodyQR }, callbackQR: callbackQR })
                    } else {
                        let res = await apis.ApiHCM.AddLichSuQuetQRCode(body)
                        Utils.nlog('[LOG] res quet ma qr', res)
                        if (res.status == 1) {
                            Utils.navigate('Modal_KetQuaQuet', { QR: bodyQR, callbackQR: callbackQR })
                        } else {
                            Utils.showMsgBoxOKTop('Thông báo', res?.error?.message ? res?.error?.message : 'Quét QR không thành công!', 'Xác nhận', () => {
                                setIsHandleQR(false)
                            })
                        }
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
        GetListHistoryScan()
    }

    const _onRefresh = () => {
        setRefreshing(true)
        GetListHistoryScan()
    }

    const stQuetMa = StyleSheet.create({
        container: {
            flex: 1, backgroundColor: colors.white
        },
        titleHeader: {
            color: colors.white, fontSize: reText(20)
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
            backgroundColor: 'rgba(0,0,0,0.7)', marginBottom: Height(4), padding: Height(1)
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
            marginTop: Height(4), marginBottom: Height(1)
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
        <View style={stQuetMa.container}>
            <HeaderCus
                onPressLeft={isSaveChotKiem ? () => Utils.navigate('ManHinh_Home') : () => Utils.goback({ props: props })}
                iconLeft={Images.icBack}
                title={`QUÉT MÃ`}
                styleTitle={stQuetMa.titleHeader}
            />
            <View style={stQuetMa.Body}>
                <View style={stQuetMa.Camera}>
                    <RNCamera
                        // ref={ref => this.ref = ref}
                        style={stQuetMa.Camera}
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
                            <View style={stQuetMa.handleCamera}>
                                <View style={stQuetMa.containerHandlerCamera}>
                                    <ActivityIndicator size={'small'} color={'white'} />
                                    <Text style={stQuetMa.textHandleCamera}>{'Đang kiểm tra dữ liệu !'}</Text>
                                </View>
                            </View>
                            : null
                    }
                </View>
                <View style={stQuetMa.FrameFocus}>
                    {
                        expandList ? null : <View style={{ alignItems: 'center' }}>
                            <View style={stQuetMa.titleFrameCamera}>
                                <Text style={stQuetMa.txtFrameCamera_1}>{'Hướng khung Camera vào QR để quét'}</Text>
                                <Text style={stQuetMa.txtFrameCamera_2} numberOfLines={2}>
                                    Chốt kiểm: {`${ChotKiemDich?.DiaChi ? ChotKiemDich.DiaChi + ', ' : ''}${ChotKiemDich?.Phuong ? ChotKiemDich.Phuong + ', ' : ''}${ChotKiemDich?.Quan ? ChotKiemDich.Quan : ''}${ChotKiemDich?.ThanhPho ? ', ' + ChotKiemDich.ThanhPho : ''}`}
                                </Text>
                            </View>
                            {isHandleQR ? <View style={stQuetMa.handlingCamera} /> : <Image source={Images.icFrameQR} style={stQuetMa.handlingCamera} resizeMode='contain' />}
                            <TouchableOpacity onPress={() => { setFlash(!flash) }} activeOpacity={0.5} style={stQuetMa.btnFlash}>
                                <View style={stQuetMa.containFlash}>
                                    <Image source={flash ? Images.icFlashOn : Images.icFlashOff} style={stQuetMa.iconFlash} resizeMode='contain' />
                                    <Text style={stQuetMa.titleFlash} numberOfLines={1}>{flash ? 'Tắt đèn Flash' : 'Bật đèn Flash'}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    }

                    <View style={stQuetMa.viewBottom}>
                        <TouchableOpacity onPress={() => { setExpandList(!expandList) }} activeOpacity={0.5} style={stQuetMa.btnExpand}>
                            <Image source={expandList ? Images.icCollapseList : Images.icExpandList} style={stQuetMa.iconExpand} resizeMode='contain' />
                        </TouchableOpacity>
                        <View style={stQuetMa.headerViewBottom}>
                            <TouchableOpacity onPress={() => { Utils.goback({ props: props }) }} activeOpacity={0.5} style={{ padding: 5 }}>
                                <Text style={stQuetMa.txtDoiKhuVuc} numberOfLines={1}>{`Đổi khu vực`}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { Utils.navigate('Modal_LichSuQuetAdmin', { isModal: true }) }} activeOpacity={0.5} style={{ padding: 5 }}>
                                <Text style={stQuetMa.txtTatCa} numberOfLines={1}>{`Tất cả`}</Text>
                            </TouchableOpacity>
                        </View>
                        {/* {Danh sách dùng redux} */}
                        <View style={{ flex: 1 }}>
                            <FlatList
                                contentContainerStyle={{ paddingBottom: 40 }}
                                data={data}
                                renderItem={renderItem}
                                keyExtractor={_keyExtractor}
                                refreshControl={<RefreshControl
                                    onRefresh={_onRefresh}
                                    refreshing={refreshing}
                                    // title="Danh sách gần đây"
                                    tintColor="#fff"
                                // titleColor="#fff"
                                />}
                                ListHeaderComponent={() => {
                                    return (
                                        <View style={stQuetMa.headerListHistory}>
                                            <Image source={Images.ichistory} style={stQuetMa.iconHistory} resizeMode='contain' />
                                            <Text style={stQuetMa.txtHistory}>{'Quét gần đây nhất'}</Text>
                                        </View>
                                    )
                                }}
                                // onEndReached={this.loadMore}
                                // onEndReachedThreshold={0.4}
                                // ListFooterComponent={this._ListFooterComponent}
                                ListEmptyComponent={<ListEmpty textempty={'Không có dữ liệu'} isImage={true} styleEmpty={{ marginTop: 0 }} />}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}



export default withNavigationFocus(QuetMa)
