import React, { Component } from 'react';
import { View, Text, Animated, StyleSheet, Image, TouchableOpacity, ScrollView, FlatList, BackHandler } from 'react-native';
import Utils, { icon_typeToast } from '../../../app/Utils';
import { colors } from '../../../styles';
import { reText } from '../../../styles/size';
import { Height, nstyles, paddingBotX, Width } from '../../../styles/styles';
import { Images } from '../../images';
import { ButtonCom, IsLoading } from '../../../components';
import { appConfig } from '../../../app/Config';
import ImageCus from '../../../components/ImageCus';
import moment from 'moment';
import apis from '../../apis';
import { nGlobalKeys } from '../../../app/keys/globalKey';
import FontSize from '../../../styles/FontSize';

class KetQuaQuet extends Component {
    constructor(props) {
        super(props);
        this.callbackQR = Utils.ngetParam(this, 'callbackQR', () => { })
        this.QR = Utils.ngetParam(this, 'QR', '')
        this.checkQuayDau_ChotKiemDich = Utils.getGlobal(nGlobalKeys.checkQuayDau_ChotKiemDich, false)
        this.checkGiayThongHanh = Utils.getGlobal(nGlobalKeys.checkGiayThongHanh, false)
        this.state = {
            opacity: new Animated.Value(0),
            dataQR: this.QR,
            dataInfo: ''
        };
    }

    componentDidMount() {
        this._startAnimation(0.4)
        this.getInfo()
        BackHandler.addEventListener('hardwareBackPress', this.backAction)
    }

    getInfo = async () => {
        let res = await apis.ApiHCM.GetThongTinCongDan(this.QR?.PhoneNumberCD)
        Utils.nlog('[LOG] res data info', res)
        if (res.status == 1 && res.data) {
            this.setState({ dataInfo: res.data })
        } else {
            this.setState({ dataInfo: '' })
        }
    }

    backAction = () => {
        this._goback()
        return true
    }

    componentWillUnmount() {
        try {
            BackHandler.removeEventListener('hardwareBackPress', this.backAction)
        } catch (error) {

        }
    }

    _startAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: value,
                duration: 250
            }).start();
        }, 200);
    };

    _goback = () => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: 0,
                duration: 250
            }).start(() => {
                Utils.goback(this)
                this.callbackQR()
            });
        }, 100);
    }

    GiayThongHanh = async () => {
        let strMaHoa = this.QR?.CMND + "$" + this.QR?.PhoneNumberCD + "$" + this.QR?.HoTen // userCD?.CMND + "$" + userCD?.PhoneNumber + "$" + userCD.FullName
        nthisIsLoading.show()
        let res = await apis.ApiApp.MaHoa(strMaHoa)
        nthisIsLoading.hide()
        Utils.nlog('res ma hoa', strMaHoa, res)
        if (res.status == 1 && res.data) {
            Utils.nlog('res ma hoa link', `${appConfig.domainGiayThongHanh}vi/thong-tin-qr-code?encdata=${encodeURIComponent(res.data)}`)
            let urlGTH = `${appConfig.domainGiayThongHanh}vi/thong-tin-qr-code?encdata=${encodeURIComponent(res.data)}`
            Utils.openWeb(this, urlGTH, { isLinking: false, isShowMenuWeb: true, title: 'Giấy thông hành' })
        } else {
            Utils.showMsgBoxOKTop('Thông báo', 'Xảy ra lỗi ! Vui lòng thử lại.', 'Xác nhận',)
        }
    }

    onQuayDauDiQua = async (diqua) => {
        const body = {
            ...this.QR,
            "status": diqua // diqua: 0, quaydau:1
        }
        let res = await apis.ApiHCM.AddLichSuQuetQRCode(body)
        Utils.nlog('[LOG] res quet ma qr', body, res)
        if (res.status == 1) {
            this._goback()
            Utils.showToastMsg('Thông báo', res?.error?.message ? res?.error?.message : `${diqua == 0 ? 'Đi qua' : 'Quay đầu'} thành công.`, icon_typeToast.success)
        } else {
            Utils.showMsgBoxOKTop('Thông báo', res?.error?.message ? res?.error?.message : `${diqua == 0 ? 'Đi qua' : 'Quay đầu'} thất bại.`, 'Xác nhận', () => {
                this._goback()
            })
        }
    }



    render() {
        const { opacity, isCheck = false, dataQR, dataInfo } = this.state
        const { colorLinear } = this.props.theme
        return (
            <View style={{ flex: 1, backgroundColor: colors.nocolor, justifyContent: 'flex-end' }}>
                <Animated.View onTouchEnd={() => this._goback()} style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgb(17,17,17)', opacity }} />
                <View style={{ flexGrow: 1 }}>
                    <View style={{ flex: 1, backgroundColor: 'tranparent' }} />
                    <View style={styles.container}>
                        <View style={styles.topBar} />
                        <ScrollView style={{ marginTop: 10 }} contentContainerStyle={{ paddingBottom: 40 }}>
                            <View style={{ backgroundColor: colors.white, marginTop: 10, alignItems: 'center' }}>
                                <View style={{ width: Width(35), height: Width(40), marginRight: Width(5), borderRadius: 5, backgroundColor: '#F2F2F2' }}>
                                    <ImageCus
                                        defaultSourceCus={Images.imgAvatar}
                                        source={dataInfo?.Avata ? { uri: appConfig.domain + dataInfo.Avata } : Images.imgAvatar}
                                        style={{ width: Width(35), height: Width(40), alignSelf: 'center', borderRadius: 5 }}
                                        resizeMode={'cover'} />
                                </View>
                            </View>
                            <View style={{ paddingHorizontal: 10 }}>
                                <TextLine title={'Họ tên'} value={dataInfo?.FullName ? dataInfo?.FullName.toUpperCase() : ''} />
                                <TextLine title={'Nơi cư trú'} value={dataInfo?.DiaChi ? dataInfo?.DiaChi : ''} />
                                <TextLine title={'CMND'}
                                    value={dataInfo?.CMND ? dataInfo?.CMND : ''}
                                />
                            </View>

                            {
                                this.checkQuayDau_ChotKiemDich &&
                                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                                    <ButtonCom
                                        onPress={() => { this.onQuayDauDiQua(0) }}
                                        Linear={true}
                                        colorChange={[colors.greenishTeal, colors.greenishTeal]}
                                        shadow={false}
                                        txtStyle={{ color: colors.white }}
                                        style={
                                            {
                                                marginTop: Height(2), borderRadius: 5,
                                                alignSelf: 'center', paddingHorizontal: 20,
                                                width: Width(40),
                                            }}
                                        text={'Đi qua'}
                                    />
                                    <ButtonCom
                                        onPress={() => { this.onQuayDauDiQua(1) }}
                                        Linear={true}
                                        colorChange={[colors.redStar, colors.redStar]}
                                        shadow={false}
                                        txtStyle={{ color: colors.white }}
                                        style={
                                            {
                                                marginTop: Height(2), borderRadius: 5,
                                                alignSelf: 'center', paddingHorizontal: 20,
                                                width: Width(40),
                                            }}
                                        text={'Quay đầu'}
                                    />
                                </View>
                            }
                            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                                {
                                    this.checkGiayThongHanh &&
                                    <ButtonCom
                                        onPress={() => { this.GiayThongHanh() }}
                                        Linear={true}
                                        colorChange={[colors.yellowishOrange, colors.yellowishOrange]}
                                        shadow={false}
                                        txtStyle={{ color: colors.white, fontSize: FontSize.reText(13) }}
                                        style={
                                            {
                                                marginTop: Height(2), borderRadius: 5,
                                                alignSelf: 'center', paddingHorizontal: 20,
                                                width: Width(40),
                                            }}
                                        text={'Kiểm giấy thông hành'}
                                    />
                                }
                                {
                                    !this.checkQuayDau_ChotKiemDich &&
                                    <ButtonCom
                                        onPress={() => {
                                            this._goback()
                                        }}
                                        Linear={true}
                                        colorChange={['#F2F2F2', '#F2F2F2']}
                                        shadow={false}
                                        txtStyle={{ color: colors.grayLight }}
                                        style={
                                            {
                                                marginTop: Height(2), borderRadius: 5,
                                                alignSelf: 'center', paddingHorizontal: 20,
                                                width: Width(40),
                                            }}
                                        text={'QUAY LẠI'}
                                    />

                                }
                            </View>
                        </ScrollView>
                        <IsLoading />
                    </View>
                </View>
            </View>
        );
    }
}

const TextLineIcon = (props) => {
    let { title = '', value = '', styleValue, styleTitle, icon = undefined, styleIcon, styleComp, line = true } = props
    return (
        <View style={[{ marginTop: 10, paddingHorizontal: 10 }, styleComp]}>
            <View style={{ flexDirection: 'row', }}>
                <View style={{ width: Width(10), alignItems: 'center' }}>
                    <Image source={icon} style={[nstyles.nIcon16, styleIcon]} resizeMode={'contain'} />
                </View>
                <Text style={[{ fontSize: reText(14), color: colors.black_50 }, styleTitle]}>{title}</Text>
            </View>
            <View style={{ flexDirection: 'row', width: Width(90), }}>
                <View style={{ width: Width(10) }}></View>
                <Text style={[{ fontSize: reText(14), marginTop: 3 }, styleValue]}>{value}</Text>
            </View>
            <View style={{ height: 0.5, backgroundColor: colors.grayLight, width: Width(90), alignSelf: 'flex-end', marginTop: 10 }} />
        </View>
    )
}


const TextLine = (props) => {
    let { title = '', value = '', styleValue, styleTitle } = props
    return (
        <View {...props} style={{ backgroundColor: colors.white, alignItems: 'flex-start', paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: colors.grayLight }}>
            <Text style={[{ fontWeight: '300', fontSize: reText(14), color: '#8F9294' }, styleTitle]}>{title}: </Text>
            <Text style={[{ flex: 1, fontSize: reText(14), fontWeight: '400', textAlign: 'justify' }, styleValue]}>{value}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        // paddingHorizontal: 10,
        paddingBottom: paddingBotX,
        minHeight: Height(80),
        maxHeight: Height(95)
    },
    topBar: {
        height: 5,
        width: 80,
        alignSelf: 'center',
        backgroundColor: colors.grayLight,
        borderRadius: 10,
        marginTop: 10
    }
})

const mapStateToProps = state => ({
    auth: state.auth,
    theme: state.theme,

});
export default Utils.connectRedux(KetQuaQuet, mapStateToProps, true);
