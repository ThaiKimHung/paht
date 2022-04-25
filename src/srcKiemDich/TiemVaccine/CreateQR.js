import React, { Component, createRef } from 'react';
import { View, Text, Animated, StyleSheet, Image, TouchableOpacity, ScrollView, FlatList, BackHandler, Platform, PermissionsAndroid, ToastAndroid, Alert } from 'react-native';
import Utils from '../../../app/Utils';
import { colors } from '../../../styles';
import { reText, sizes } from '../../../styles/size';
import { Height, nstyles, paddingBotX, Width } from '../../../styles/styles';
import { Images } from '../../images';
import QRCode from 'react-native-qrcode-svg';
import { ButtonCom, IsLoading } from '../../../components';
import ImageCus from '../../../components/ImageCus';
import { appConfig } from '../../../app/Config';
import { captureRef } from "react-native-view-shot";
import RNFetchBlob from 'rn-fetch-blob';
import moment from 'moment';
import RNFS from "react-native-fs"
import CryptoJS from 'crypto-js'
import CameraRoll from '@react-native-community/cameraroll';
import { Linking } from 'react-native';

class CreateQR extends Component {
    constructor(props) {
        super(props);
        this.state = {
            opacity: new Animated.Value(0),
        };
    }

    componentDidMount() {
        this._startAnimation(0.4)
        BackHandler.addEventListener('hardwareBackPress', this.backAction)
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
            });
        }, 100);
    }

    hasAndroidRequestReadStoragePermission = async () => {
        const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
        const hasPermission = await PermissionsAndroid.check(permission);
        if (hasPermission) {
            return true;
        }
        const status = await PermissionsAndroid.request(permission);
        return status === 'granted';
    }

    saveQR = async () => {
        if (Platform.OS == 'android') {
            let granted = await this.hasAndroidRequestReadStoragePermission();
            if (!granted)
                return
        }
        captureRef(this.refViewQR, {
            format: "jpg",
            quality: 1
        }).then(
            async uri => {
                try {
                    await CameraRoll.save(uri, { type: 'photo' }).then(link => {
                        Alert.alert('Thông báo', 'Lưu QR thành công.')
                    })
                } catch (error) {
                    console.log('errrr====', error)
                    Alert.alert('Thông báo', 'Đã xảy ra lỗi! Vui lòng thử lại sau.')
                }
            },
            error => console.error("Oops, snapshot failed", error)
        );
    }


    render() {
        const { opacity } = this.state
        const { colorLinear } = this.props.theme
        const { userCD, tokenCD } = this.props.auth
        const linkAvatar = appConfig.domain + userCD?.Avata
        const qrcode = JSON.stringify({
            "HoTen": userCD?.FullName,
            "PhoneNumberCD": userCD?.PhoneNumber,
            "CMND": userCD?.CachLy?.CMND || ''
        })
        Utils.nlog('BEFORE ENCODE QR', qrcode)
        const qrCodeEncrypt = CryptoJS.AES.encrypt(qrcode, appConfig.keySecret).toString();
        Utils.nlog('ENCODE QR', qrCodeEncrypt)
        return (
            <View style={{ flex: 1, backgroundColor: colors.nocolor, justifyContent: 'flex-end' }}>
                <Animated.View onTouchEnd={() => this._goback()} style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgb(17,17,17)', opacity }} />
                <View style={{ flexGrow: 1 }}>
                    <View style={{ flex: 1, backgroundColor: 'tranparent' }} />
                    <View style={styles.container}>
                        <View style={styles.topBar} />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                            <TouchableOpacity onPress={() => this._goback()} style={{ padding: 10, alignSelf: 'flex-start' }}>
                                <Image source={Images.icBack} style={[nstyles.nIcon24, { tintColor: colorLinear.color[0] }]} resizeMode='contain' />
                            </TouchableOpacity>
                            <Text style={{ color: colorLinear.color[0], fontSize: reText(16), fontWeight: 'bold', alignSelf: 'center', textAlign: 'center' }}>{'QR TÀI KHOẢN CÁ NHÂN'}</Text>
                            <View style={{ width: 45 }} />
                        </View>
                        <View style={{ flex: 1 }}>
                            {
                                tokenCD && tokenCD.length > 3 ?
                                    <ScrollView style={{}}>
                                        <View collapsable={false} ref={ref => this.refViewQR = ref} style={{ backgroundColor: colors.white }}>
                                            <View style={{ paddingVertical: 10, borderRadius: 5 }}>
                                                {/* <Text style={{ fontSize: reText(14), flex: 1, color: colors.redDelete, alignSelf: 'center', paddingVertical: 10 }}>{`(*) Dùng QR để được quét qua các chốt kiểm dịch`}</Text> */}
                                                <Text style={{ fontSize: reText(16), fontWeight: 'bold', alignSelf: 'center' }}>{userCD?.FullName}</Text>
                                                <Text style={{ fontSize: reText(16), fontWeight: 'bold', marginVertical: 10, alignSelf: 'center' }}>{userCD?.PhoneNumber}</Text>
                                                <View style={{ width: Width(70), height: Width(70), alignSelf: 'center', backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}>
                                                    <QRCode
                                                        value={qrCodeEncrypt} //UserID, NoiDen, tình trạng khai báo, mã code xác nhận
                                                        size={Width(65)}
                                                        backgroundColor={colors.BackgroundHome}
                                                        getRef={(ref) => (this.svg = ref)}
                                                    />
                                                </View>
                                                <Text style={{ paddingVertical: 10, fontStyle: 'italic', color: colors.redStar, textAlign: 'center' }}>{'Mã QR để xuất trình khi: đi chợ, ra vào chốt kiểm soát.'}</Text>
                                            </View>
                                        </View>
                                    </ScrollView>
                                    : <Text style={{ fontSize: reText(16), fontWeight: 'bold', alignSelf: 'center' }}>{`Vui lòng đăng nhập tài khoản để xem được QR.`}</Text>
                            }
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                            <ButtonCom
                                onPress={() => this._goback()}
                                Linear={true}
                                colorChange={[colors.grayLight, colors.grayLight]}
                                shadow={false}
                                txtStyle={{ color: colors.white, fontSize: reText(13) }}
                                style={{
                                    margin: Height(1), borderRadius: 5,
                                    alignSelf: 'center',
                                    width: Width(40)
                                }}
                                text={'Quay lại'}
                            />
                            <ButtonCom
                                onPress={() => this.saveQR()}
                                Linear={true}
                                disabled={!(tokenCD && tokenCD.length > 3)}
                                colorChange={this.props.theme.colorLinear.color}
                                shadow={false}
                                txtStyle={{ color: colors.white, fontSize: reText(13) }}
                                style={{
                                    margin: Height(1), borderRadius: 5,
                                    alignSelf: 'center',
                                    width: Width(40)
                                }}
                                text={'Lưu QR vào máy'}
                            />
                        </View>
                    </View>
                </View>
            </View >
        );
    }
}



const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 10,
        paddingBottom: paddingBotX,
        minHeight: Height(80),
        maxHeight: Height(90)
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
export default Utils.connectRedux(CreateQR, mapStateToProps, true);
