import React, { Component } from 'react';
import { View, Text, TextInput, Platform, TouchableOpacity, Image, PermissionsAndroid } from 'react-native';
import { nstyles, colors } from '../../../../styles';
import { sizes } from '../../../../styles/size';
import { Height, Width } from '../../../../styles/styles';
import ButtonCom from '../../../../components/Button/ButtonCom';
import { Images } from '../../../images';
import Utils from '../../../../app/Utils';
import moment from 'moment';
import apis from '../../../apis';
import { nGlobalKeys } from '../../../../app/keys/globalKey';
import { IsLoading } from '../../../../components';
import { ROOTGlobal } from '../../../../app/data/dataGlobal';
import Geolocation from 'react-native-geolocation-service';
import { nkey } from '../../../../app/keys/keyStore';
const Paddingst = Platform.OS == 'ios' ? 10 : 5;
class DangKyHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            txtToken: '',
            latlng: '',
            Tokentracking: ''
        };
    }
    _LayGiaTriToken = async () => {
        var Tokentracking = await Utils.ngetStore(nkey.Tokentracking, '');
        Utils.nlog("gia tri token khi lấy", Tokentracking);
        this.setState({ Tokentracking });
    }
    componentDidMount() {
        this._LayGiaTriToken();
        Utils.nlog("gia tri của location")
        Utils.nlog("gia tri của location", this.props.latlog)
    }
    getCurrentPosition = async () => {
        Geolocation.setRNConfiguration({ skipPermissionRequests: true, authorizationLevel: 'whenInUse' });
        Geolocation.requestAuthorization();

        if (Platform.OS == 'android') {
            this.granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
                title: 'Tự động lấy vị trí',
                message: 'Bạn có muốn lưu động lấy thông tin vị trí hiện tại để gửi kèm thao tác đăng ký mã số?\n' +
                    'Để tự động lấy vị trí thì bạn cần cấp quyền truy cập vị tri cho ứng dụng.',
                buttonNegative: 'Để sau',
                buttonPositive: 'Cấp quyền'
            })
            if (this.granted == PermissionsAndroid.RESULTS.GRANTED) {
                Geolocation.getCurrentPosition(
                    (position) => {
                        Utils.nlog('geolocation-android', JSON.stringify(position));
                        var { coords = {} } = position;
                        var { latitude, longitude } = coords;
                        let latlng = {
                            latitude: latitude,
                            longitude: longitude
                        }
                        // this.props.setLocation(latlng)
                        this.setState({ latlng }, this._DangKy)
                    },
                    error => Utils.nlog('getCurrentPosition error: ', JSON.stringify(error)),
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
                );
            } else {
                Utils.showMsgBoxOK(this, "Thông báo", "Lấy vị trí thất bại", "Xác nhận");
            }
        }
        else {
            Geolocation.getCurrentPosition(
                (position) => {
                    Utils.nlog('geolocation-ios', JSON.stringify(position));
                    var { coords = {} } = position;
                    var { latitude, longitude } = coords;
                    if (Platform.OS == 'ios' && (!latitude || !longitude)) {
                        Utils.showMsgBoxYesNo(this, 'Dịch vụ vị trí bị tắt', configHome.TenAppHome + ' cần truy cập vị trí của bạn. Hãy bật Dịch vụ vị trí trong phần cài đặt điện thoại của bạn.',
                            'Chuyển tới cài đặt', 'Không, cảm ơn',
                            () => {
                                Linking.openURL('app-settings:').catch((err) => {
                                    Utils.nlog('app-settings:', err);
                                });
                            });
                    } else {
                        this.granted = 'granted';
                        let latlng = {
                            latitude: latitude,
                            longitude: longitude
                        }
                        this.setState({ latlng }, this._DangKy)
                        // this.props.setLocation(latlng);

                    }
                },
                (error) => {
                    let {
                        code
                    } = error;
                    if (code == 1) {
                        Utils.showMsgBoxYesNo(this, 'Dịch vụ vị trí bị tắt',
                            'Ứng dụng cần truy cập vị trí của bạn. Hãy bật dịch vụ vị trí trong phần cài đặt điện thoại của bạn.',
                            'Chuyển tới cài đặt', 'Không, cảm ơn',
                            () => {
                                Linking.openURL('app-settings:').catch((err) => {
                                    nlog('app-settings:', err);
                                });
                            });
                    } else {
                        Utils.showMsgBoxOK(this, "Thông báo", "Lấy vị trí thất bại", "Xác nhận");
                    }
                    Utils.nlog('getCurrentPosition error: ', JSON.stringify(error));
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
            );
        }
    }
    _DangKy = async () => {
        // await this.getCurrentPosition();
        if (this.state.txtToken == '') {
            Utils.showMsgBoxOK(this, "Thông báo", "Bạn chưa nhập mã token", "Xác nhận");
            return;
        }
        nthisIsLoading.show();
        let DevicesInfo = Platform.OS == 'ios' ? 'ios' : 'android'
        let DevicesToken = await Utils.ngetStore(nGlobalKeys.userId_OneSignal, '');

        // let DevicesToken = await Utils.ngetStore(nGlobalKeys.loginToken, '');
        var thoigian = moment(new Date()).format("DD/MM/YYYY HH:mm")
        Utils.nlog("gia tri state", this.state.latlng.latitude)
        var body = {
            "Token": this.state.txtToken,
            "DevicesToken": DevicesToken,
            "IdApp": 1,
            "DevicesInfo": DevicesInfo,
            "On_off": true,
            "ToaDoX": this.state.latlng.latitude,
            "ToaDoY": this.state.latlng.longitude,
            "ThoiGian": thoigian,
            "DiaDiem": ""
        }
        Utils.nlog("gia tri bodt", body);
        const res = await apis.ApiTracking.XacMinhTTAcc(body);

        Utils.nlog("gia tri res tracking", res);

        if (res.status == 1) {
            //T
            this.setState({ txtToken: '', })
            nthisIsLoading.hide();
            Utils.goscreen(this, "inFoDangKy", {
                data: res.data,
                setToken: (val) => this.setState({ Tokentracking: val })
            })
        } else {
            nthisIsLoading.hide();
            Utils.showMsgBoxOK(this, "Thông báo", "Mã xác thực không hợp lệ", "Xác nhận")
        }
    }
    _CheckThongTin = async () => {
        // const { Tokentracking } = this.state
        let Tokentracking = await Utils.ngetStore(nkey.Tokentracking, '');
        if (Tokentracking) {
            Utils.nlog("gia tri ishow", Tokentracking)
            Utils.goscreen(this, "inFoDangKy", {
                data: { Token: Tokentracking },
                isShow: true
            })
        } else {
            Utils.showMsgBoxOK(this, "Thông báo",
                "Chưa đăng ký thông tin nào", "Xác nhận");
        }
    }

    render() {
        const { txtToken, Tokentracking } = this.state
        return (
            <View style={[nstyles.nstyles.ncontainer, nstyles.paddingTopMul()]}>
                <View style={{
                    width: '100%', backgroundColor: colors.yellowLight, flexDirection: 'row',
                    paddingVertical: 10, alignItems: 'center',
                    justifyContent: 'center', paddingTop: nstyles.paddingTopMul(),
                }}>
                    <TouchableOpacity
                        onPress={() => Utils.goscreen(this, 'ManHinh_Home')}
                        style={{ padding: 7, alignItems: 'center', justifyContent: 'center' }}>
                        <Image source={Images.icBack} style={[nstyles.nstyles.nIcon18, { tintColor: colors.colorGrayIcon }]} resizeMode='cover' />
                    </TouchableOpacity>
                    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, paddingRight: sizes.sText18 }}>
                        <Text style={{
                            fontWeight: 'bold',
                            fontSize: sizes.sText16,
                        }}>Nhập mã số - Xác nhận thông tin</Text>
                    </View>
                </View>
                <View style={{ paddingHorizontal: 10, paddingVertical: 20, flex: 1 }}>
                    <TextInput
                        style={{
                            paddingVertical: Paddingst, marginVertical: 5, paddingHorizontal: 10,
                            backgroundColor: colors.white, borderWidth: 1, textAlign: 'center'
                        }}
                        placeholder='Vui lòng nhập mã số'
                        value={txtToken}
                        onChangeText={(text) => this.setState({ txtToken: text })}
                    ></TextInput>
                    <View style={{ justifyContent: 'center', alignItems: 'flex-end', paddingHorizontal: 20 }}>
                        <ButtonCom
                            onPress={this.getCurrentPosition}
                            Linear={true}
                            // icon={Images.icFE}
                            sizeIcon={30}
                            style={
                                {
                                    marginTop: Height(2), borderRadius: 0,
                                    width: '50%', alignSelf: 'center', paddingHorizontal: 20,
                                    backgroundColor: colors.colorBlue
                                }}
                            text={'Đăng Ký'}
                        />
                    </View>
                    <View
                        style={{ flex: 1 }}>
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Image source={Images.iconApp}
                                style={{ width: '50%', height: '50%', }} resizeMode='contain' />
                        </View>

                        <TouchableOpacity style={[nstyles.nstyles.shadown, {
                            paddingVertical: 20,
                            alignItems: 'center', marginBottom: 30,
                        }]}
                            onPress={this._CheckThongTin}
                        >
                            <Text style={{ fontSize: sizes.sText16, color: colors.colorBlue }}>Xem thông tin đã đăng ký</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <IsLoading />
            </View>
        );
    }
}
const mapStateToProps = state => ({
    latlog: state.location,
});
export default Utils.connectRedux(DangKyHome, mapStateToProps, true);

