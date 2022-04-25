import React, { Component } from 'react'
import { Text, View, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import WebView from 'react-native-webview'
import apis from '../../apis'
import { ROOTGlobal } from '../../../app/data/dataGlobal'
import { nGlobalKeys } from '../../../app/keys/globalKey'
import { nkey } from '../../../app/keys/keyStore'
import Utils from '../../../app/Utils'
import { HeaderCus, IsLoading, IsLoadingNew } from '../../../components'
import { Images } from '../../images'
import { colors } from '../../../styles'
import { reText } from '../../../styles/size'
import AppCodeConfig from '../../../app/AppCodeConfig'

export class ModalDangNhap extends Component {
    constructor(props) {
        super(props)
        this.callback = Utils.ngetParam(this, 'callback')
        this.isShowMessage = Utils.ngetParam(this, 'isShowMessage', true)
        this.urlDVCNeedBack = Utils.getGlobal(nGlobalKeys.urlDVCNeedBack, 'https://dichvucong.gov.vn/p/home/dvc-trang-chu.html') // link nhận biết để back về trang đăng nhập
        this.state = {
            LinkSSODN: Utils.getGlobal(nGlobalKeys.LinkSSODN, ''),
            cookie: '',
            UseCookieSSO: Utils.getGlobal(nGlobalKeys.UseCookieSSO, true),
            loading: true,
            textLoading: 'Đang tải',
        }
    }
    _onNavigationStateChange = async (webViewState) => {
        this.setState({ loading: true, LinkSSODN: webViewState.url.toString() })
        let CodeSSO = webViewState.url.toString()
        Utils.nlog(CodeSSO)
        Utils.nlog(this.state)
        if (CodeSSO.includes(this.urlDVCNeedBack)) {
            this.setState({
                ...this.state,
                LinkSSODN: Utils.getGlobal(nGlobalKeys.LinkSSODN, ''),
            })
        }
        if (CodeSSO.includes('https://motcua-service.tayninh.gov.vn/?code=')) {
            //Da dang nhap
            let Token = CodeSSO.split('code=')[1].split('&')[0]
            if (Token) {
                this.setState({ loading: true, textLoading: 'Đang đăng nhập... Vui lòng chờ !' })
                await Utils.nsetStore(nkey.TokenSSO, Token)
                Utils.setGlobal(nGlobalKeys.TokenSSO, Token)
                Utils.setGlobal(nGlobalKeys.UseCookieSSO, false)
                await Utils.nsetStore(nkey.UseCookieSSO, false)
                let res;
                if (Utils.getGlobal(nGlobalKeys.ChucNangNghiemThu, {}).loginDVC) { //--Chức năng làm Tạm ĐỂ Nghiệm THU. Nên API hơi khác TayNinh 1 chuts
                    var keySSO = Utils.getGlobal(nGlobalKeys.SecretKeySSO, "");
                    let strBody = {
                        "key": keySSO,
                        "code": Token
                    };
                    strBody = JSON.stringify(strBody);
                    res = await Utils.post_api("api/dvc/LoginSSO", strBody, false, false, false, AppCodeConfig.APP_CONGDAN, 0, { Token: "rpNuGJebgtBEp0eQL1xKnqQG" });
                } else
                    res = await apis.ApiUser.LoginSSO(Token) //--Luồng login Chính - giống TayNinh Live
                Utils.nlog('Login SSO ====', res)
                //---ChucNangNghiemThu: Sẽ lược bớt 1 số data trả về so với TayNinh nên chỉ cần bật True sẽ coi như pass qua
                if (res.status == 1 && res.data && (res.data.KhachHangID || Utils.getGlobal(nGlobalKeys.ChucNangNghiemThu, {}).loginDVC)) {
                    let { data } = res
                    Utils.setGlobal(nGlobalKeys.InfoUserSSO, data)
                    await Utils.nsetStore(nGlobalKeys.InfoUserSSO, data)
                    ROOTGlobal.dataGlobal._checkLoginSSO()
                    this.setState({ loading: false })
                    if (this.isShowMessage) {
                        Utils.showMsgBoxOK(this, 'Thông báo', 'Đăng nhập thành công !', 'Tiếp tục', () => {
                            this.callback()
                            Utils.goback(this)
                        })
                    } else {
                        Utils.goback(this)
                        this.callback(true, res)

                    }

                } else {
                    this.setState({ loading: false })
                    if (this.isShowMessage) {
                        Utils.showMsgBoxOK(this, 'Thông báo', 'Đăng nhập thành công !', 'Xác nhận', () => {
                            this.callback()
                            Utils.goback(this)
                        })
                    } else {
                        Utils.goback(this)
                        this.callback(false, res)

                    }
                }
            }
        } else {
            this.setState({ loading: false })
        }
    }


    render() {
        let { LinkSSODN, cookie, UseCookieSSO, textLoading, loading } = this.state
        return (
            <View style={{ flex: 1, backgroundColor: colors.white }}>
                <HeaderCus
                    Sleft={{ tintColor: 'white' }}
                    onPressLeft={() => Utils.goback(this)}
                    iconLeft={Images.icBack}
                    title={`Đăng ký, đăng nhập dịch vụ công`}
                    styleTitle={{ color: colors.white }}
                />
                {
                    loading ?
                        <View style={{ margin: 10 }}>
                            <ActivityIndicator size={'large'} color={colors.redStar} />
                            <Text style={{ textAlign: 'center', color: colors.grayLight, paddingVertical: 10, fontSize: reText(14), color: colors.redStar }}>{textLoading}</Text>
                        </View>
                        : null
                }
                <WebView
                    onLoadStart={(syntheticEvent) => {
                        const { nativeEvent } = syntheticEvent;
                        this.setState({ loading: nativeEvent.loading })
                    }}
                    onLoadEnd={(syntheticEvent) => {
                        const { nativeEvent } = syntheticEvent;
                        this.setState({ loading: nativeEvent.loading }, () => this._onNavigationStateChange(nativeEvent))
                    }}
                    ref={ref => this.webview = ref}
                    source={{ uri: LinkSSODN }}
                    // onNavigationStateChange={this._onNavigationStateChange}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    injectedJavaScript={cookie}
                    startInLoadingState={false}
                    sharedCookiesEnabled={true}
                    incognito={UseCookieSSO} // Không sử dụng storge & data trong vòng đời cửa webview
                />
            </View>
        )
    }
}

const mapStateToProps = state => ({
    theme: state.theme

});
export default Utils.connectRedux(ModalDangNhap, mapStateToProps, true);
