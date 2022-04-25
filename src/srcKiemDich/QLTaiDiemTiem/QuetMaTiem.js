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
import { KeyTiem, stQuetMaTiem } from './KeyTiem';
import CryptoJS from 'crypto-js'

const QuetMaTiem = (props) => {
    const { colorLinear } = useSelector(state => state.theme)
    const { ChotKiemDich = '', DiemTiem = '' } = useSelector(state => state.datahcm)
    const { userDH } = useSelector(state => state.auth)
    const [flash, setFlash] = useState(false)
    const [expandList, setExpandList] = useState(false)
    const [dataQR, setDataQR] = useState('')
    const [isSaveChotKiem, setisSaveChotKiem] = useState(Utils.ngetParam({ props: props }, 'isSaveChotKiem', false))
    const [page, setPage] = useState({ Page: 1, AllPage: 1, Size: 10, Total: 0 })
    const [data, setData] = useState([])
    const [isHandleQR, setIsHandleQR] = useState(false)
    const [refreshing, setRefreshing] = useState(true)
    const [item, setItem] = useState(Utils.ngetParam({ props: props }, 'item', ''))

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
        //Xử lý 1 hàm get data chung có switch case chung cho từng chức năng
        GetListHistoryScan()
    }, [])

    const GetListHistoryScan = async () => {
        let res = ``
        let objectGet = {
            "query.more": false,
            "query.page": 1,
            "query.record": 10,
            "query.filter.keys": 'Action|keyword|DiemTiem',
            "query.filter.vals": `${item.KeyTiem}||${DiemTiem?.IdDiem}`,
            // "query.filter.vals": `${item.KeyTiem}||${4}`,
        }
        res = await apis.ApiChotKiem.List_LichSu_CheckInQRCode(objectGet)
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

    const KetQuaQuet = (element) => {
        //Xử lý switch KeyTiem qua các kết quả quét khác nhau
        Utils.navigate('Modal_ChiTietLichSuTiem', { item: item, dataHistory: element })
    }

    const renderItem = ({ item, index }) => {
        //Swith case hoặc đổi UI cho phù hợp với từng chức năng tại đây
        return (
            <TouchableOpacity onPress={() => { KetQuaQuet(item) }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
                    <View style={[nstyles.nAva50, { backgroundColor: colors.BackgroundHome, alignItems: 'center' }]}>
                        <ImageCus
                            defaultSourceCus={Images.imgAvatar}
                            source={item?.Avata ? { uri: appConfig.domain + item.Avata } : Images.imgAvatar}
                            style={[nstyles.nAva50, { alignSelf: 'center' }]}
                            resizeMode={'cover'} />
                    </View>
                    <View style={{ flex: 1, paddingLeft: 10 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: reText(14), color: colors.white, flex: 1 }} numberOfLines={1}>{item?.HoTen ? item.HoTen : ''}</Text>
                        <Text style={{ fontSize: reText(14), color: colors.white, marginTop: 5 }}>Thời gian quét: {item?.NgayQuet ? moment(item.NgayQuet, 'DD/MM/YYYY HH:mm:ss').format('DD/MM/YYYY HH:mm') : ''}</Text>
                        <Text numberOfLines={2} style={{ fontSize: reText(14), marginTop: 5, textAlign: 'justify', lineHeight: 20, color: colors.white }}>
                            Điểm tiêm: {item?.TenDiemTiem ? item?.TenDiemTiem : ''}
                        </Text>
                        {/* {
                            item?.IsNganHan ? <View style={{ backgroundColor: '#FFD35C', alignSelf: 'flex-start', borderRadius: 3, padding: 3, marginTop: 5 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: reText(14), color: colors.white }}>{'Ngắn hạn'}</Text>
                            </View> : null
                        } */}
                    </View>
                </View>
                <View style={{ height: 0.5, backgroundColor: colors.white, marginHorizontal: 10 }} />
            </TouchableOpacity>
        )
    }

    const _keyExtractor = (item, index) => index.toString()

    const _onBarCodeRead = async props => {
        if (expandList) return
        let stringQR = ''
        if (props.inputcode == true) {
            stringQR = props.data
            console.log('user nhap ma code data ', stringQR); // Decrypt qr
        } else {
            const bytes = CryptoJS.AES.decrypt(props.data, appConfig.keySecret);
            stringQR = bytes.toString(CryptoJS.enc.Utf8);
            console.log('QR SAU KHI DECRYPT ', stringQR); // Decrypt qr
        }
        if (stringQR) {
            let bodyQR = null;
            try {
                const qrCaNhan = JSON.parse(stringQR)
                bodyQR = {
                    "SDT": qrCaNhan?.PhoneNumberCD,
                    "HoTen": qrCaNhan?.HoTen
                }
            } catch (error) {
                bodyQR = null
            }
            console.log('body QR', bodyQR); // Decrypt qr
            if (bodyQR?.SDT && bodyQR?.HoTen) {
                setIsHandleQR(true)
                setTimeout(() => {
                    switch (item.KeyTiem) {
                        case KeyTiem.CHECKIN:
                            bodyQR = {
                                ...bodyQR,
                                "DiemTiem": DiemTiem?.IdDiem,
                                "TenDiemTiem": DiemTiem?.TenDiemTiem
                            }
                            break;
                        case KeyTiem.KQLAMSAN:
                            bodyQR = {
                                ...bodyQR,
                                "DiemTiem": DiemTiem?.IdDiem,
                                "KetQuaLamSang": '',
                                "Note": '',
                                "TenDiemTiem": DiemTiem?.TenDiemTiem
                            }
                            break;
                        case KeyTiem.XACNHANTIEMCHUNG:
                            bodyQR = {
                                ...bodyQR,
                                "TenVaccine": "",
                                "Lot": "",
                                "DiemTiem": DiemTiem?.IdDiem,
                                "TenDiemTiem": DiemTiem?.TenDiemTiem
                            }
                            break;
                        case KeyTiem.TRIEUCHUNG:
                            bodyQR = {
                                ...bodyQR,
                                "DiemTiem": DiemTiem?.IdDiem,
                                "Note": "",
                                "TinhHinhSucKhoe": [],
                                "TenDiemTiem": DiemTiem?.TenDiemTiem
                            }
                            break;
                        default:
                            break;
                    }
                    Utils.navigate('Modal_KetQuaQuetMaTiem', { item: item, qrcode: bodyQR, callbackQR: callbackQR })
                }, 500);

            } else {
                Utils.showMsgBoxOKTop('Thông báo', 'QR không đúng hoặc có lỗi trong quá trình xử lý. Thử lại sau !', 'OK', () => {
                    setIsHandleQR(false)
                })
            }
        } else {
            setIsHandleQR(false)
        }
    }

    const callbackQR = () => {
        setIsHandleQR(false)
        //Xử lý switch case callback gọi reload lại list cho phù hợp
        GetListHistoryScan()
    }

    const _onRefresh = () => {
        setRefreshing(true)
        //Xử lý switch case callback gọi reload list cho phù hợp
        GetListHistoryScan()
    }

    const goAll = () => {
        //Qua modal xử lý theo keytiem
        Utils.navigate('Modal_LSChecckIn', { item: item })
    }

    const inputCode = () => {
        //Xử lý swithc case qua các màn hình tương ứng
        Utils.navigate('Modal_NhapMaCode', { item: item, callback: (infoUser) => _onBarCodeRead({ "data": JSON.stringify({ ...infoUser, "PhoneNumberCD": infoUser.SDT }), "inputcode": true }) })
    }

    return (
        <View style={stQuetMaTiem.container}>
            <HeaderCus
                onPressLeft={isSaveChotKiem ? () => Utils.navigate('ManHinh_Home') : () => Utils.goback({ props: props })}
                iconLeft={Images.icBack}
                title={item?.name.replace('\n', ' ').toUpperCase()}
                styleTitle={stQuetMaTiem.titleHeader}
            />
            <View style={stQuetMaTiem.Body}>
                <View style={stQuetMaTiem.Camera}>
                    <RNCamera
                        // ref={ref => this.ref = ref}
                        style={stQuetMaTiem.Camera}
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
                            <View style={stQuetMaTiem.handleCamera}>
                                <View style={stQuetMaTiem.containerHandlerCamera}>
                                    <ActivityIndicator size={'small'} color={'white'} />
                                    <Text style={stQuetMaTiem.textHandleCamera}>{'Đang kiểm tra dữ liệu !'}</Text>
                                </View>
                            </View>
                            : null
                    }
                </View>
                <View style={stQuetMaTiem.FrameFocus}>
                    {
                        expandList ? null : <View style={{ alignItems: 'center' }}>
                            <View style={stQuetMaTiem.titleFrameCamera}>
                                <Text style={stQuetMaTiem.txtFrameCamera_1}>{'Hướng khung Camera vào QR để quét'}</Text>
                                <Text style={stQuetMaTiem.txtFrameCamera_2} numberOfLines={2}>
                                    Điểm tiêm: {`${DiemTiem.DiaChi + ', ' + DiemTiem.PhuongXa + ', ' + DiemTiem.QuanHuyen + ', ' + DiemTiem.TinhThanh}`}
                                </Text>
                            </View>
                            {isHandleQR ? <View style={stQuetMaTiem.handlingCamera} /> : <Image source={Images.icFrameQR} style={stQuetMaTiem.handlingCamera} resizeMode='contain' />}
                            <View style={[stQuetMaTiem.btnFlash]}>
                                <TouchableOpacity onPress={() => { setFlash(!flash) }} activeOpacity={0.5} style={{}}>
                                    <View style={stQuetMaTiem.containFlash}>
                                        <Image source={flash ? Images.icFlashOn : Images.icFlashOff} style={stQuetMaTiem.iconFlash} resizeMode='contain' />
                                        <Text style={stQuetMaTiem.titleFlash} numberOfLines={1}>{flash ? 'Tắt đèn Flash' : 'Bật đèn Flash'}</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { inputCode() }} activeOpacity={0.5} style={[stQuetMaTiem.inputCode]}>
                                    <View style={stQuetMaTiem.containFlash}>
                                        <Text style={stQuetMaTiem.titleFlash} numberOfLines={1}>{`Nhập mã`}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    }

                    <View style={stQuetMaTiem.viewBottom}>
                        <TouchableOpacity onPress={() => { setExpandList(!expandList) }} activeOpacity={0.5} style={stQuetMaTiem.btnExpand}>
                            <Image source={expandList ? Images.icCollapseList : Images.icExpandList} style={stQuetMaTiem.iconExpand} resizeMode='contain' />
                        </TouchableOpacity>
                        <View style={stQuetMaTiem.headerViewBottom}>
                            <TouchableOpacity onPress={() => { Utils.goback({ props: props }) }} activeOpacity={0.5} style={{ padding: 5 }}>
                                <Text style={stQuetMaTiem.txtDoiKhuVuc} numberOfLines={1}>{`Đổi chức năng`}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { goAll() }} activeOpacity={0.5} style={{ padding: 5 }}>
                                <Text style={stQuetMaTiem.txtTatCa} numberOfLines={1}>{`Tất cả`}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1 }}>
                            <FlatList
                                contentContainerStyle={{ paddingBottom: 40 }}
                                data={data}
                                renderItem={renderItem}
                                keyExtractor={_keyExtractor}
                                refreshControl={<RefreshControl
                                    onRefresh={_onRefresh}
                                    refreshing={refreshing}
                                    tintColor="#fff"
                                />}
                                ListHeaderComponent={() => {
                                    return (
                                        <View style={stQuetMaTiem.headerListHistory}>
                                            <Image source={Images.ichistory} style={stQuetMaTiem.iconHistory} resizeMode='contain' />
                                            <Text style={stQuetMaTiem.txtHistory}>{'Quét gần đây nhất'}</Text>
                                        </View>
                                    )
                                }}
                                ListEmptyComponent={<ListEmpty textempty={'Không có dữ liệu'} isImage={true} styleEmpty={{ marginTop: 0 }} />}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}



export default withNavigationFocus(QuetMaTiem)
