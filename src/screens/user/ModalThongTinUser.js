import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Utils from '../../../app/Utils';
import { nstyles, colors, sizes } from '../../../styles';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { AppgetGlobal, ROOTGlobal } from '../../../app/data/dataGlobal';
import { nGlobalKeys } from '../../../app/keys/globalKey';
import { nkey } from '../../../app/keys/keyStore';
import Api from '../../apis';
import InputT from '../../../components/ComponentApps/InputT';
import { Images } from '../../images';
import { AvatarUser, HeaderCom, HeaderCus, IsLoading } from '../../../components';
import Avatar from '../Home/components/Avatar';
import DangKyTaiKhoan from './DangKyTaiKhoan';
import AppCodeConfig from '../../../app/AppCodeConfig';
import { CongDong } from '../Home';

const stLogin = StyleSheet.create({
    contentInput: {
        marginHorizontal: '10%',
        backgroundColor: 'transparent'
    },
    textThongbao: {
        color: colors.black_80,
        fontSize: sizes.sizes.sText20,
        fontWeight: 'bold',

    },
    viewcontainer: {
        paddingVertical: 30,
        flex: 1,
        flexDirection: 'column',

    },
    textTitleItem: {
        paddingHorizontal: 30,
        padding: 10,
        color: colors.black_20,
        fontSize: sizes.sizes.sText16,
        fontWeight: '600',

    },
    styButton: {
        color: colors.black_20,
        fontSize: sizes.sizes.sText16,
        fontWeight: '600'
    },
    text: {

        fontSize: sizes.sizes.sText16,
        fontWeight: '600',
    },
    textValueItem: {
        paddingHorizontal: 30,
        color: colors.black_80,
        fontSize: sizes.sizes.sText16,
        fontWeight: '500',

    }
});
class ModalThongTinUser extends Component {
    constructor(props) {
        super(props);
        this._CapNhatAvatar = Utils.ngetParam(this, "_CapNhatAvatar", () => { })
        this.state = {
            data: {},
            OnEdit: false,
            refreshing: false
        };
    }
    componentDidMount() {
        this.getThongTin()
    }
    getThongTin = async () => {
        const { auth = {} } = this.props
        nthisIsLoading.show();
        let res = await Api.ApiUser.GetInFoUser(auth.userCD.Id || auth.userCD.UserID)
        Utils.nlog("gia trị get info user_2", auth.userCD.Id || auth.userCD.UserID, res)
        if (res.status == 1) {
            nthisIsLoading.hide();
            let { data } = res
            this.setState({ data: { ...data }, refreshing: false })
        } else {
            nthisIsLoading.hide();
            // Utils.showMsgBoxOK(this, "Thông báo", "Lấy thông tin tài khoản thất bại")
        }
    }
    goback = () => {
        Utils.goback(this)
    }
    dangxuat = async () => {
        let deviceToken = await Utils.ngetStore(nGlobalKeys.userId_OneSignal, '');
        Utils.showMsgBoxYesNo(this, "Thông báo", "Bạn có muốn đăng xuất không", "Xác nhận", "Không", async () => {
            let res = await Api.ApiUser.LogoutGYPA(deviceToken);
            Utils.nlog("gia tri đăng xuất", res, deviceToken)
            this.props.LogoutApp(AppCodeConfig.APP_CONGDAN)
            Utils.setGlobal(nGlobalKeys.loginToken, '');
            Utils.setGlobal(nGlobalKeys.Id_user, '');
            Utils.setGlobal(nGlobalKeys.Email, '');
            Utils.setGlobal(nGlobalKeys.NumberPhone, '');
            Utils.setGlobal(nGlobalKeys.TokenSSO, '');
            Utils.setGlobal(nGlobalKeys.InfoUserSSO, '');
            Utils.setGlobal(nGlobalKeys.UseCookieSSO, true)
            await Utils.nsetStore(nkey.UseCookieSSO, true)
            await Utils.nsetStore(nkey.InfoUserSSO, '')
            await Utils.nsetStore(nkey.loginToken, '');
            Utils.nsetStore(nkey.token, '');
            Utils.nsetStore(nkey.Id_user, '');
            Utils.nsetStore(nkey.NumberPhone, '');
            await Utils.nsetStore(nkey.TimeTuNgay, '');
            Utils.goback(this)
            ROOTGlobal.dataGlobal._tabbarChange(true);
            ROOTGlobal.dataGlobal._onRefreshDaGui();
            ROOTGlobal.dataGlobal._onPressAvatar();
            this._CapNhatAvatar(false)
            Utils.goscreen(this, "login");
            // } else {
            // Utils.showMsgBoxOK(this, 'Thông báo', "Đăng xuất thất bại")
            // }
        }, () => { })
    }

    capNhatThongTin = async () => {
        const { data } = this.state
        const { OnEdit } = this.state
        console.log('==> data: ', data)
        const res = await Api.ApiUser.CapNhatTTCongDan(data)
        Utils.nlog("gia tri cap nhat thong tin us", res)
        if (res.status == 1 && res.data) {
            var data1 = res.data
            if (data1) {
                Utils.nsetStore(nkey.Id_user, data1.UserID);
                // Utils.nsetStore(nkey.Email, data1.Email);
                Utils.nsetStore(nkey.NumberPhone, data1.PhoneNumber);
            }
            this._CapNhatAvatar(true)
            Utils.showMsgBoxOK(this, "Thông báo", "Cập nhật thông tin thành công", "Xác nhận", this._onRefresh)

        } else {
            Utils.showMsgBoxOK(this, "Thông báo", res.error ? res.error.message : "Lỗi cập nhật thông tin", 'Xác nhận')
        }
    }
    render() {
        const { data, OnEdit = false, FullName, DiaChi, PhoneNumber, Email, refreshing } = this.state
        return (
            <View style={[{ backgroundColor: colors.BackgroundHome, flex: 1 }]} >
                {/* <HeaderCus
                    title={'Thông tin cá nhân'}
                    styleTitle={{ color: colors.white }}
                />
                <ScrollView style={{ flex: 1 }}>
                    <AvatarUser colorIcon={this.props.theme.colorLinear.color[0]} style={{ marginVertical: 13 }} />
                    <View style={{ flexDirection: 'row', backgroundColor: colors.white, padding: 13 }}>
                        <Text style={{ fontWeight: 'bold' }}>{'Họ và tên: '}</Text>
                        <Text style={{ flex: 1, textAlign: 'justify' }}>{'Phạm Hoàng Phúc'}</Text>
                    </View>
                </ScrollView> */}

                <View style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0,
                    right: 0, flex: 1, backgroundColor: colors.backgroundModal,
                    alignItems: 'center'
                }} onTouchEnd={this.goback} />

                <View style={{
                    width: '95%', alignSelf: 'center', flexDirection: 'column',
                    borderRadius: 10, backgroundColor: 'white'
                }}>

                    <DangKyTaiKhoan nthis={this} isDangKy={false} dataDefault={this.state.data} OnEdit={OnEdit} onEnEdit={() => this.setState({ OnEdit: false })} />

                    <View style={{
                        flexDirection: 'row', justifyContent: 'space-between',
                        paddingVertical: 20, paddingHorizontal: 30, borderWidth: 1, borderColor: colors.black_20
                    }}>
                        {OnEdit == false ?
                            <TouchableOpacity onPress={() => this.setState({ OnEdit: !this.state.OnEdit }, this.getThongTin)}>
                                <Text style={[stLogin.styButton, { color: colors.colorBlue, }]}>{`Đổi Thông Tin`.toUpperCase()}</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={() => this.setState({ OnEdit: !this.state.OnEdit })}>
                                <Text style={[stLogin.styButton, { color: colors.colorBlue, }]}>{`Huỷ`.toUpperCase()}</Text>
                            </TouchableOpacity>
                        }
                        {OnEdit === false ?
                            <TouchableOpacity onPress={this.dangxuat} style={{ justifyContent: 'flex-end' }}>
                                <Text style={[stLogin.styButton,
                                { color: colors.redStar, textAlign: 'right' }]}>{`đăng xuất`.toUpperCase()}</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={() => Utils.goscreen(this, 'Modal_DoiMatKhau', {
                                data: data,
                                _CapNhatAvatar: this._CapNhatAvatar
                            })}>
                                <Text style={[stLogin.styButton, { color: colors.colorBlue, }]}>{`Đổi mật khẩu`.toUpperCase()}</Text>
                            </TouchableOpacity>
                        }
                    </View>

                </View>
                <IsLoading />
            </View>

        );
    }
}
const mapStateToProps = state => ({
    auth: state.auth,
    theme: state.theme
});
export default Utils.connectRedux(ModalThongTinUser, mapStateToProps, true);
const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: '#e0dcdc',
    },

    text: {
        marginTop: 30,
        fontSize: 40,
        color: '#0250a3',
        fontWeight: 'bold',
    },
});
