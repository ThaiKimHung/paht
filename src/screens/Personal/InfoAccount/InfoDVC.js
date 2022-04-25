import React, { Component } from 'react'
import { ScrollView, Text, View } from 'react-native'
import AppCodeConfig from '../../../../app/AppCodeConfig';
import { nGlobalKeys } from '../../../../app/keys/globalKey';
import { nkey } from '../../../../app/keys/keyStore';
import Utils from '../../../../app/Utils';
import { ButtonCom } from '../../../../components';
import { colors } from '../../../../styles';
import { reText } from '../../../../styles/size';
import { Width } from '../../../../styles/styles';

const TextLine = (props) => {
    let { title = 'label', value = 'value' } = props
    return (
        <>
            <View {...props} style={{ flexDirection: 'row', backgroundColor: colors.white, alignItems: 'center', padding: 3, paddingHorizontal: 10, borderRadius: 15 }}>
                <Text style={{ fontWeight: 'bold', minWidth: Width(25), fontSize: reText(14) }}>{title}: </Text>
                <Text style={{ flex: 1, textAlign: 'right', paddingVertical: 8 }}>{value}</Text>
            </View>
            <View style={{ backgroundColor: colors.black_10, height: 0.5, marginHorizontal: 10 }} />
        </>

    )
}


export class InfoDVC extends Component {
    _logOut = () => {
        Utils.showMsgBoxYesNo(this.props.nthis, 'Thông báo', 'Bạn có chắc muốn thoát tài khoản dịch vụ công', 'Đăng xuất', 'Hủy', async () => {
            this.props.SetUserApp(AppCodeConfig.APP_DVC, '')
            this.props.Set_Menu_CanBo([], '')
            this.props.Set_Menu_CongDong([])
            Utils.setGlobal(nGlobalKeys.TokenSSO, '');
            Utils.setGlobal(nGlobalKeys.InfoUserSSO, '');
            Utils.setGlobal(nGlobalKeys.UseCookieSSO, true)
            await Utils.nsetStore(nkey.UseCookieSSO, true)
            await Utils.nsetStore(nkey.InfoUserSSO, '')
        })
    }
    render() {
        let { KhachHangID,
            TechID,
            UserPortalID,
            HoVaTen,
            SoDinhDanh,
            NgayThangNamSinh,
            SoDienThoai,
            Email,
            Token,
            AppCanBo } = this.props.auth.userDVC
        return (
            <ScrollView style={{ flex: 1, backgroundColor: colors.BackgroundHome }}>
                <View style={{ backgroundColor: colors.white, marginHorizontal: 13, borderRadius: 15, marginTop: 13 }}>
                    <TextLine title={'Họ và tên'} value={HoVaTen} />
                    <TextLine title={'CMND/CCCD'} value={SoDinhDanh} />
                    <TextLine title={'Ngày sinh'} value={NgayThangNamSinh?.substring(6, 8) + '-' + NgayThangNamSinh?.substring(4, 6) + '-' + NgayThangNamSinh?.substring(0, 4)} />
                    <TextLine title={'Số điện thoại'} value={SoDienThoai} />
                    <TextLine title={'Email'} value={Email} />
                    {
                        this.props.auth.tokenCD && this.props.auth.tokenCD.length > 0 ?
                            null
                            : <Text style={{ paddingHorizontal: 10, lineHeight: 20, color: colors.redStar }}>{`Chú ý: Để sử dụng các tính năng như: \n + Gửi phản ánh \n + Nhận thông báo cảnh báo theo từng chuyên mục \n + ... \n => Vui lòng liên hệ Quản trị để liên kết tài khoản với Dịch vụ công hoặc đăng ký tài khoản.`}</Text>
                    }
                    {/* <ButtonCom
                    onPress={this._logOut}
                    text={'Đăng xuất'}
                    style={{ margin: 10, borderRadius: 5 }}
                /> */}
                </View>
            </ScrollView>
        )
    }
}
const mapStateToProps = state => ({
    auth: state.auth,
    theme: state.theme
});
export default Utils.connectRedux(InfoDVC, mapStateToProps, true);
