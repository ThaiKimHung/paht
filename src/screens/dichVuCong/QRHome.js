import React, { Component, createRef } from 'react'
import { Linking, Text, View, StyleSheet, TouchableOpacity, Image, BackHandler, Alert } from 'react-native'
import { nstyles, Width, paddingTopMul, isLandscape, Height } from '../../../styles/styles'
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import Utils from '../../../app/Utils';
import { HeaderCom, HeaderCus, IsLoading } from '../../../components';
import { reText } from '../../../styles/size';
import * as Animatable from 'react-native-animatable';
import { colors } from '../../../styles';
import { Images } from '../../images';
import ImageEditor from '@react-native-community/image-editor';
import { withNavigationFocus } from 'react-navigation';
import { appConfig } from '../../../app/Config';
import apis from '../../apis';
import moment from 'moment';
class QRHome extends Component {
    constructor(props) {
        super(props)
        this.callback = Utils.ngetParam(this, 'callback', () => { })
        this.fromDSTraCuu = Utils.ngetParam(this, 'fromDSTraCuu', false)
        this.ref = null;
        this.state = {
            data: '',
            uri: '',
            typeQR: 1, //1 mặc định tra cứu hồ sơ, 2 là đăng nhập qr
            isHandleQR: false
        }
        this.refLoading = createRef()
    }
    onSuccess = e => {
        Linking.openURL(e.data).catch(err =>
            console.error('An error occured', err)
        );
    };
    _goback = () => {
        this.setState({ show: false }, () => Utils.goback(this));
    }

    getWidth = (percen = 100) => {
        return isLandscape() ? Height(percen) * 0.5 : Width(percen);
    }

    _topView = () => {
        return <View style={{ flex: 1, width: '100%' }}>
            <HeaderCom
                onPressLeft={this._goback}
                titleText={`Quét mã phiếu `}
                nthis={this}
            />

        </View>
    }
    makeSlideOutTranslation(translationType, fromValue) {
        return {
            from: {
                [translationType]: this.getWidth(10),
            },
            to: {
                [translationType]: fromValue
            }
        };
    }
    barcodeRecognized = async props => {
        this.setState({ data: props.data }, async () => {
            Utils.nlog('giá trị barcode------', props.data);
            if (this.state.typeQR == 1) {
                if (this.fromDSTraCuu) {
                    this.callback(props.data)
                    Utils.goback(this)
                } else {
                    if (appConfig.IsQR == 1) {
                        const dataQR = props.data
                        if (dataQR.includes(`id`) && dataQR.includes(`tendiadiem`)) {
                            let KeyKiemDich = dataQR.includes('&tendiadiem') && dataQR.includes('id=') ? dataQR.split('&')[0].split('=')[1] : null;
                            if (KeyKiemDich == null) {
                                Utils.showMsgBoxOK(this, 'Thông báo', 'Mã QR không hợp lệ. Vui lòng thử lại sau !', 'Xác nhận')
                                return
                            }
                            const { userCD } = this.props.auth
                            if (userCD.PhoneNumber && userCD.FullName && userCD?.CachLy.CMND && userCD.UserID && userCD?.CachLy.IDXaPhuong)
                                Utils.goscreen(this, 'Modal_CheckInKiemDich', { IdKiemDich: KeyKiemDich })
                            else
                                Utils.showMsgBoxOK(this, 'Thông báo', 'Vui lòng đăng nhập hoặc cập nhật thông tin đầy đủ trước khi check in.','Xác nhận')
                        } else {
                            Utils.goscreen(this, 'Modal_SearchFromQR', { dataQR: props.data })
                        }
                    } else {
                        this.handlerQROther(props)
                    }
                    // appConfig.IsQR == 1 ? Utils.goscreen(this, 'Modal_SearchFromQR', { dataQR: props.data }) : Utils.isUrlCus(props.data) ? Utils.openUrl(props.data) : Utils.openUrl(`https://www.google.com/search?q=${props.data}`)
                }
            } else {
                // Xác thực đăng nhập bằng QR
                Utils.goscreen(this, 'Modal_XacThucQR', { Code: props.data })
            }
        });
    };

    handlerQROther = (props) => {
        let dataQR = null
        try {
            dataQR = JSON.parse(props.data)
        } catch (error) {
            dataQR = null
        }
        if (dataQR != null) {
            switch (dataQR?.LoaiTram) {
                case 0:
                    // Trạm kiểm soát dịch
                    if (dataQR?.IdTram) {
                        this.checkInDiaDiem(props)
                    }
                    break;
                case 1:
                    // Trạm kiểm soát ra vào chợ phòng dịch
                    if (dataQR?.IdTram) {
                        this.checkInDiaDiem_ChotCho(props)
                    } else {
                        Utils.showMsgBoxOK(this, 'Thông báo', 'QR không có thông tin phiếu đi chợ.','Xác nhận')
                    }
                    break;
            }
            return;
        }
        //---NẾU KO RƠI VÀO Trường hợp nào thì khi quét QR sẽ vào đây.
        if (Utils.isUrlCus(props.data)) {
            Utils.openWeb(this, props.data)
        } else {
            Utils.openWeb(this, `https://www.google.com/search?q=${props.data}`)
        }

    }

    checkInDiaDiem_ChotCho = async props => {
        const { userCD } = this.props.auth
        const stringQR = props.data
        if (stringQR) {
            this.refLoading.current.show()
            this.setState({ isHandleQR: true })
            let dataPhieu = null
            let res = await apis.ApiHCM.GetThongTinPhieuDiChoCongDan()
            Utils.nlog('[LOG] phieu di cho', res)
            if (res.status == 1 && res.data) {
                dataPhieu = res.data
            } else {
                Utils.showMsgBoxOKTop('Thông báo', 'Không lấy được thông tin phiếu đi chợ hoặc tài khoản chưa được cấp phiếu !', 'Xác nhận', () => {
                    this.setState({ isHandleQR: false })
                })
                return;
            }
            let bodyQR = null;
            try {
                bodyQR = JSON.parse(stringQR)
            } catch (error) {
                bodyQR = null
            }

            if (bodyQR?.IdTram && dataPhieu) { //cũ là IdCongDan
                const body = {
                    "IsTramCheck": false,// nếu nhân viên tại địa điểm chợ quét thì = true, người dân quét check in tại địa điểm chợ thì = false
                    "IdTram": bodyQR.IdTram,
                    // "PhoneNumberCD": "", // số điện thoại công dân
                    "IdPhieu": dataPhieu.IdPhieu //Id phiếu lấy từ thông tin phiếu đi chợ của công dân khi quét
                }
                Utils.nlog('[LOG] body Post QR 1', body)
                Utils.nlog('[LOG] body Post QR 2', JSON.stringify(body))
                setTimeout(async () => {
                    let res = await apis.ApiHCM.AddLichSuQuetQRCode_DiCho(body)
                    this.refLoading.current.hide()
                    Utils.nlog('[LOG] res check in chốt chợ', res)
                    if (res.status == 1) {
                        Utils.navigate('Modal_CheckInDiaDiemCoQuan', {
                            dataQR: { ...bodyQR, status: 1 },
                            callbackQR: () => {
                                this.setState({ isHandleQR: false })
                            },
                            title: 'Check in đi chợ'
                        })
                    } else {
                        Utils.navigate('Modal_CheckInDiaDiemCoQuan', {
                            dataQR: { ...bodyQR, status: 0 }, callbackQR: () => {
                                this.setState({ isHandleQR: false })
                            },
                            title: 'Check in đi chợ'
                        })
                    }
                }, 1500);
            } else {
                Utils.showMsgBoxOKTop('Thông báo', 'QR không đúng hoặc có lỗi trong quá trình xử lý. Thử lại sau !', 'Xác nhận', () => {
                    this.setState({ isHandleQR: false })
                })
            }
        } else {
            this.refLoading.current.hide()
            this.setState({ isHandleQR: false })
        }
    }

    checkInDiaDiem = async props => {
        const stringQR = props.data
        if (stringQR) {
            this.refLoading.current.show()
            this.setState({ isHandleQR: true })
            let bodyQR = null;
            try {
                bodyQR = JSON.parse(stringQR)
            } catch (error) {
                bodyQR = null
            }
            if (bodyQR?.IdTram) { //cũ là IdCongDan
                const body = {
                    "IsFromCanBo": false, // nếu cán bộ tại tram quét thì = true, người dân quét check in tại trạm thì = false
                    "IdTram": bodyQR.IdTram,
                }
                Utils.nlog('[LOG] body Post QR 1', body)
                Utils.nlog('[LOG] body Post QR 2', JSON.stringify(body))
                setTimeout(async () => {
                    let res = await apis.ApiHCM.AddLichSuQuetQRCode(body)
                    this.refLoading.current.hide()
                    Utils.nlog('[LOG] res check in dia diem', res)
                    if (res.status == 1) {
                        Utils.navigate('Modal_CheckInDiaDiemCoQuan', {
                            dataQR: { ...bodyQR, status: 1 }, callbackQR: () => {
                                this.setState({ isHandleQR: false })
                            },
                            title: 'Check in địa điểm/cơ quan'
                        })
                    } else {
                        Utils.navigate('Modal_CheckInDiaDiemCoQuan', {
                            dataQR: { ...bodyQR, status: 0 }, callbackQR: () => {
                                this.setState({ isHandleQR: false })
                            },
                            title: 'Check in địa điểm/cơ quan'
                        })
                    }
                }, 1500);
            } else {
                Utils.showMsgBoxOKTop('Thông báo', 'QR không đúng hoặc có lỗi trong quá trình xử lý. Thử lại sau !', 'Xác nhận', () => {
                    this.setState({ isHandleQR: false })
                })
            }
        } else {
            this.refLoading.current.hide()
            this.setState({ isHandleQR: false })
        }
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.backAction)
    }

    backAction = () => {
        Utils.goback(this)
        return true
    }

    componentWillUnmount() {
        try {
            BackHandler.removeEventListener('hardwareBackPress', this.backAction)
        } catch (error) {

        }
    }

    changeTypeQR = (type) => {
        this.setState({ typeQR: type })
        // if (type == 2) {
        //     Utils.goscreen(this, 'Modal_XacThucQR', { Code: 'QR.Fbi60abD93' })
        // }
    }

    render() {
        const { userDVC, userCD } = this.props.auth
        const { isHandleQR } = this.state
        return this.props.isFocused ? (
            <View style={nstyles.ncontainer}>
                <HeaderCus
                    Sleft={{ tintColor: 'white' }}
                    onPressLeft={() => Utils.goback(this)}
                    iconLeft={Images.icBack}
                    title={`Quét QR`}
                    styleTitle={{ color: colors.white }}
                />
                <View style={[nstyles.nbody, { alignItems: 'center', justifyContent: 'center', backgroundColor: colors.blackTwo }]}>
                    <View style={{
                        width: this.getWidth(95),
                        height: this.getWidth(95),
                        overflow: 'hidden',
                        borderRadius: 4,
                        bordergetWidth: 1, borderColor: colors.colorBlueLight
                    }}>
                        <RNCamera
                            ref={ref => this.ref = ref}
                            style={{
                                flex: 1
                            }}
                            // rectOfInterest={{
                            //     x: 0.1,
                            //     y: 0.1,
                            //     width: this.getWidth(75),
                            //     height: this.getWidth(75),

                            // }}
                            captureAudio={false}
                            cameraViewDimensions={{
                                width: this.getWidth(100),
                                height: this.getWidth(100),
                            }}
                            barcodeTypes={false}
                            onBarCodeRead={isHandleQR == false ? this.barcodeRecognized : () => { }}
                        >
                            {/* {this.renderBarcodes()} */}
                        </RNCamera>
                        {/* {
                            !this.state.data ? <Animatable.View
                                style={{
                                    backgroundColor: colors.colorBlueLight, height: 2,
                                    width: this.getWidth(75),
                                    position: 'absolute',
                                    left: this.getWidth(10),
                                    borderRadius: 20
                                }}
                                direction="alternate-reverse"
                                iterationCount="infinite"
                                duration={2000}
                                easing="linear"
                                animation={this.makeSlideOutTranslation(
                                    "translateY",
                                    this.getWidth(85),
                                )}
                            /> : null
                        } */}
                        <Animatable.View
                            style={{
                                backgroundColor: colors.colorBlueLight, height: 2,
                                width: this.getWidth(75),
                                position: 'absolute',
                                left: this.getWidth(10),
                                borderRadius: 20
                            }}
                            direction="alternate-reverse"
                            iterationCount="infinite"
                            duration={2000}
                            easing="linear"
                            animation={this.makeSlideOutTranslation(
                                "translateY",
                                this.getWidth(85),
                            )}
                        />
                        <View style={{
                            position: 'absolute',
                            alignSelf: 'center',
                            top: this.getWidth(10), left: this.getWidth(10),
                            right: this.getWidth(10), bottom: this.getWidth(10),

                        }}>
                            <Image source={Images.icFocusQR}
                                style={{ width: this.getWidth(75), height: this.getWidth(75), tintColor: colors.white }}></Image>
                        </View>
                        {
                            this.state.uri ? <View style={{
                                position: 'absolute',
                                alignSelf: 'center',
                                top: 0, left: 0, right: 0, bottom: 0,
                                justifyContent: 'center', alignItems: 'center'
                            }}>
                                <Image source={{ uri: this.state.uri }}
                                    style={{ width: 100, height: 100 }}></Image>
                            </View> : null
                        }

                    </View>
                    {(userDVC || userCD?.CachLy) && appConfig.IsQR == 1 ?
                        <View style={{ position: 'absolute', top: 10, left: 10, right: 10, backgroundColor: colors.nocolor, flexDirection: 'row', justifyContent: 'space-evenly', borderRadius: 10 }}>
                            <TouchableOpacity onPress={() => this.changeTypeQR(1)}>
                                <View style={[styles.typeQR(this.state.typeQR, 1), { width: this.getWidth(45), }]}>
                                    <Text style={styles.textTypeQR(this.state.typeQR, 1)}>Tra cứu</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.changeTypeQR(2)}>
                                <View style={[styles.typeQR(this.state.typeQR, 2), { width: this.getWidth(45), }]}>
                                    <Text style={styles.textTypeQR(this.state.typeQR, 2)}>Đăng nhập QR</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        : null}
                </View>
                <IsLoading ref={this.refLoading} />
            </View >
        ) : <View style={nstyles.ncontainer}>
            <HeaderCus
                Sleft={{ tintColor: 'white' }}
                onPressLeft={() => Utils.goback(this)}
                iconLeft={Images.icBack}
                title={`Quét QR`}
                styleTitle={{ color: colors.white }}
            />
            <View style={{ flex: 1, backgroundColor: 'black' }}></View>
        </View>
    }
}
const styles = StyleSheet.create({
    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: '#777'
    },
    textBold: {
        fontWeight: '500',
        color: '#000'
    },
    buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)'
    },
    buttonTouchable: {
        padding: 16
    },
    typeQR: (typeQR, focused) => {
        return {
            padding: 10,
            backgroundColor: typeQR == focused ? colors.colorBlueLight : colors.BackgroundHome,
            alignItems: 'center',
            margin: 5,
            borderRadius: 5,
        }
    },
    textTypeQR: (typeQR, focused) => {
        return {
            color: typeQR == focused ? colors.white : 'gray',
            fontWeight: typeQR == focused ? 'bold' : 'normal'
        }
    },
});

const mapStateToProps = state => ({
    auth: state.auth
});
export default Utils.connectRedux(withNavigationFocus(QRHome), mapStateToProps, true);
