import React, { Component, forwardRef, useState, useMemo, useImperativeHandle, useEffect, useRef } from 'react'
import { View, Text, TouchableOpacity, Image, FlatList, StyleSheet, BackHandler, ActivityIndicator, RefreshControl, ScrollView, TextInput, Keyboard, Platform } from 'react-native';
import Utils from '../../../app/Utils';
import { HeaderCus, IsLoading, ListEmpty } from '../../../components';
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
import { getBottomSpace } from 'react-native-iphone-x-helper';

const QuetQRXacNhan = (props) => {
    const { colorLinear } = useSelector(state => state.theme)
    const { ChotCho = '' } = useSelector(state => state.datahcm)
    const { userDH } = useSelector(state => state.auth)
    const [flash, setFlash] = useState(false)
    const [expandList, setExpandList] = useState(false)
    const [isHandleQR, setIsHandleQR] = useState(false)
    const [search, setSearch] = useState('')
    const [dataTraCuu, setDataTraCuu] = useState('')
    const [isTraCuu, setIsTraCuu] = useState(false)
    const refLoading = useRef(null)
    const refSearch = useRef(null)

    useEffect(() => {
        if (search.length >= 9) {
            setIsTraCuu(true)
            TraCuu_DangKyHoTro()
        }
    }, [search])

    useEffect(() => {
        if (!expandList) {
            Keyboard.dismiss()
        }
    }, [expandList])

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


    const TraCuu_DangKyHoTro = async (cmndScan = '', isAloneData = false) => {
        let res = await apis.ApiHCM.TraCuu_DangKyHoTro(cmndScan ? cmndScan : search)
        setIsTraCuu(false)
        Utils.nlog('[LOG] res tra cuu', res)
        if (res.status == 1 && res.data) {
            setDataTraCuu(res.data)
            if (res?.data?.length == 1 && !isAloneData) {
                Utils.goscreen({ props }, 'Modal_ChiTietXacNhanHoTro', { data: res.data[0], callback: () => TraCuu_DangKyHoTro(search, true) })
            }
        } else {
            setDataTraCuu('')
        }
    }

    const _onBarCodeRead = async props => {
        if (expandList) return
        const bytes = CryptoJS.AES.decrypt(props.data, appConfig.keySecret);
        const stringQR = bytes.toString(CryptoJS.enc.Utf8);
        console.log('QR SAU KHI DECRYPT ', stringQR); // Decrypt qr
        setSearch(null)
        refSearch.current.clear();
        if (stringQR) {
            // setIsHandleQR(true)
            let bodyQR = null;
            try {
                bodyQR = JSON.parse(stringQR)
            } catch (error) {
                bodyQR = null
            }
            if (bodyQR?.CMND) { //c?? l?? IdCongDan
                setExpandList(true)
                setIsTraCuu(true)
                setSearch(bodyQR?.CMND)
                TraCuu_DangKyHoTro(bodyQR?.CMND)
            } else {
                Utils.showMsgBoxOKTop('Th??ng b??o', 'QR kh??ng ????ng ho???c c?? l???i trong qu?? tr??nh x??? l??. Th??? l???i sau!', 'X??c nh???n', () => {
                    setIsHandleQR(false)
                })
            }
        } else {
            setIsHandleQR(false)
        }
    }

    const onSearch = val => {
        setSearch(val)
    }

    const stQuetQRXacNhan = StyleSheet.create({
        container: {
            flex: 1, backgroundColor: colors.white
        },
        titleHeader: {
            color: colors.white, fontSize: reText(16)
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
            backgroundColor: 'rgba(0,0,0,0.7)', marginBottom: Height(4), padding: Height(1), width: '100%'
        },
        txtFrameCamera_1: {
            color: colors.white, fontWeight: 'bold', fontSize: reText(16), textAlign: 'center'
        },
        txtFrameCamera_2: {
            color: colors.white, fontSize: reText(13), textAlign: 'center', lineHeight: 18
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
            borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: colors.BackgroundHome, flex: 1//'rgba(0,0,0,0.7)'
        },
        btnExpand: {
            paddingVertical: 10, alignSelf: 'center', paddingHorizontal: 100
        },
        iconExpand: {
            ...nstyles.nIcon20,
            tintColor: 'red'
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
        <View style={stQuetQRXacNhan.container}>
            <HeaderCus
                onPressLeft={() => Utils.goback({ props: props })}
                iconLeft={Images.icBack}
                title={`X??c nh???n h??? tr??? kh?? kh??n`}
                styleTitle={stQuetQRXacNhan.titleHeader}
            />
            <View style={stQuetQRXacNhan.Body}>
                <View style={stQuetQRXacNhan.Camera}>
                    <RNCamera
                        // ref={ref => this.ref = ref}
                        style={stQuetQRXacNhan.Camera}
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
                            <View style={stQuetQRXacNhan.handleCamera}>
                                <View style={stQuetQRXacNhan.containerHandlerCamera}>
                                    <ActivityIndicator size={'small'} color={'white'} />
                                    <Text style={stQuetQRXacNhan.textHandleCamera}>{'??ang ki???m tra d??? li???u !'}</Text>
                                </View>
                            </View>
                            : null
                    }
                </View>
                <View style={stQuetQRXacNhan.FrameFocus}>
                    {
                        expandList ? null : <View style={{ alignItems: 'center' }}>
                            <View style={stQuetQRXacNhan.titleFrameCamera}>
                                <Text style={stQuetQRXacNhan.txtFrameCamera_1}>{'H?????ng khung Camera v??o QR ????? qu??t'}</Text>
                                <Text style={stQuetQRXacNhan.txtFrameCamera_2} numberOfLines={1}>
                                    {'Qu??t QR c???a ng?????i d??n ????? x??c nh???n h??? tr??? kh?? kh??n'}
                                </Text>
                                {/* <Text style={stQuetQRXacNhan.txtFrameCamera_2} numberOfLines={2}>
                                    ?????a ch???: {`${ChotCho?.DiaChi ? ChotCho.DiaChi + ', ' : ''}${ChotCho?.Phuong ? ChotCho.Phuong + ', ' : ''}${ChotCho?.Quan ? ChotCho.Quan : ''}${ChotCho?.ThanhPho ? ', ' + ChotCho.ThanhPho : ''}`}
                                </Text> */}
                            </View>
                            {isHandleQR ? <View style={stQuetQRXacNhan.handlingCamera} /> : <Image source={Images.icFrameQR} style={stQuetQRXacNhan.handlingCamera} resizeMode='contain' />}
                            <TouchableOpacity onPress={() => { setFlash(!flash) }} activeOpacity={0.5} style={stQuetQRXacNhan.btnFlash}>
                                <View style={stQuetQRXacNhan.containFlash}>
                                    <Image source={flash ? Images.icFlashOn : Images.icFlashOff} style={stQuetQRXacNhan.iconFlash} resizeMode='contain' />
                                    <Text style={stQuetQRXacNhan.titleFlash} numberOfLines={1}>{flash ? 'T???t ????n Flash' : 'B???t ????n Flash'}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    }

                    <View style={stQuetQRXacNhan.viewBottom}>
                        <TouchableOpacity onPress={() => { setExpandList(!expandList) }} activeOpacity={0.5} style={stQuetQRXacNhan.btnExpand}>
                            <Image source={expandList ? Images.icCollapseList : Images.icExpandList} style={stQuetQRXacNhan.iconExpand} resizeMode='contain' />
                        </TouchableOpacity>
                        <View style={{ paddingHorizontal: 10 }}>
                            <Text style={stQuetQRXacNhan.txtDoiKhuVuc} numberOfLines={1}>{`Tra c???u th??ng tin h??? tr???`}</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.white, marginTop: 5, borderRadius: 5 }}>
                                <Image source={Images.icSearch} style={{ marginLeft: 5 }} resizeMode='contain' />
                                <TextInput
                                    ref={refSearch}
                                    value={search}
                                    placeholder="Nh???p s??? CMND/CCCD ????? tra c???u"
                                    style={{ padding: Platform.OS == 'android' ? 5 : 10, backgroundColor: colors.white, marginTop: 5, borderRadius: 5, flex: 1 }}
                                    onFocus={() => setExpandList(true)}
                                    keyboardType={'numeric'}
                                    onChangeText={text => onSearch(text)}
                                />
                            </View>
                        </View>
                        <ScrollView style={{ paddingHorizontal: 10 }} contentContainerStyle={{ paddingBottom: getBottomSpace() }}>
                            {
                                isTraCuu ?
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                        <ActivityIndicator size={'small'} color={colorLinear.color[0]} />
                                        <Text style={[stQuetQRXacNhan.txtDoiKhuVuc, { marginLeft: 5 }]} numberOfLines={1}>{`??ang t??m...`}</Text>
                                    </View>
                                    : dataTraCuu ?
                                        <>
                                            <Text style={[stQuetQRXacNhan.txtDoiKhuVuc, { padding: 10, fontStyle: 'italic' }]} numberOfLines={1}>{`K???t qu??? tra c???u`}</Text>
                                            {
                                                dataTraCuu.map((item, index) => {
                                                    return (
                                                        <View key={index} style={{ marginTop: index > 0 ? 10 : 0, backgroundColor: colors.white, paddingBottom: 10 }}>
                                                            <TextLine title={'S??? c??ng v??n'} value={item?.SoCongVan ? item?.SoCongVan : ''} />
                                                            <TextLine title={'H??? t??n'} value={item?.HoTen ? item?.HoTen.toUpperCase() : ''} />
                                                            {/* <TextLine title={'Gi???i t??nh'} value={item?.GioiTinh ? item?.GioiTinh : ''} />
                                            <TextLine title={'N??m sinh'} value={item?.NamSinh ? item?.NamSinh : ''} /> */}
                                                            <TextLine title={'CMND/CCCD'} value={item?.CMND ? item?.CMND : ''} />
                                                            {/* <TextLine title={'Ng??y c???p'} value={item?.NgayCapCMND ? item?.NgayCapCMND : ''} /> */}
                                                            <TextLine title={'S??? ??i???n tho???i'} value={item?.SDT ? item?.SDT : ''} />
                                                            <TextLine title={'Lo???i ?????a ch???'} value={item?.LoaiDiaChi ? item?.LoaiDiaChi : ''} />
                                                            <TextLine title={'?????a ch???'} value={item?.DiaChi ? item?.DiaChi : ''} />
                                                            {/* <TextLine title={'Thu???c di???n'} value={item?.ThuocDien ? item?.ThuocDien : ''} /> */}
                                                            {/* <TextLine title={'S??? nh??n kh???u'} value={item?.SoNhanKhau ? item?.SoNhanKhau : ''} /> */}
                                                            {/* <TextLine
                                                                title={'S??? ti???n d??? ki???n'}
                                                                value={item?.TienNhanDuKien ? Utils.formatMoney(item?.TienNhanDuKien) + ' VND' : ''}
                                                                styleValue={{ color: colors.redStar, fontWeight: 'bold' }} /> */}
                                                            <TouchableOpacity
                                                                onPress={() => Utils.goscreen({ props }, 'Modal_ChiTietXacNhanHoTro', { data: item, callback: () => TraCuu_DangKyHoTro(search, true) })} activeOpacity={0.5}
                                                                style={{ marginTop: 10, padding: 10, marginRight: 10, backgroundColor: colors.redStar, alignSelf: 'flex-end', borderRadius: 3 }}>
                                                                <Text style={[stQuetQRXacNhan.txtDoiKhuVuc, { color: colors.white }]} numberOfLines={1}>{`XEM CHI TI???T`}</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    )

                                                })
                                            }
                                        </>
                                        : <Text style={{ marginTop: 10, color: colors.grayLight }}>{'Kh??ng c?? d??? li???u'}</Text>
                            }
                        </ScrollView>
                    </View>
                </View>
                <IsLoading ref={refLoading} />
            </View>
        </View>
    )
}

const TextLine = (props) => {
    let { title = '', value = '', styleValue = {}, onPressValue } = props
    return (
        <View {...props} style={{ flexDirection: 'row', backgroundColor: colors.white, alignItems: 'flex-start', padding: 3, paddingHorizontal: 10, paddingVertical: 8 }}>
            <Text style={{ fontWeight: 'bold', minWidth: Width(25), fontSize: reText(13) }}>{title}: </Text>
            <Text style={[{ flex: 1, textAlign: 'justify' }, styleValue]}>{value}</Text>
        </View>
    )
}


export default withNavigationFocus(QuetQRXacNhan)
