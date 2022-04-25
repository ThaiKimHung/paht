import React, { Component, Fragment } from 'react'
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View, Button, Image } from 'react-native'
import { TabView } from 'react-native-tab-view'
import { ButtonCom, HeaderCus } from '../../../components'
import { colors } from '../../../styles'
import { Height, nheight, nstyles, nwidth, Width } from '../../../styles/styles'
import * as Animatable from 'react-native-animatable'
import { reText } from '../../../styles/size'
import Utils from '../../../app/Utils'
import InfoCongDong from './InfoAccount/InfoCongDong'
import InfoCanBo from './InfoAccount/InfoCanBo'
import { Images } from '../../images'
import { AppgetGlobal, ROOTGlobal } from '../../../app/data/dataGlobal'
import { nGlobalKeys } from '../../../app/keys/globalKey'
import { nkey } from '../../../app/keys/keyStore'
import apis from '../../apis'
import AppCodeConfig from '../../../app/AppCodeConfig'
import { NavigationEvents } from 'react-navigation'
import LottieView from 'lottie-react-native';
import InfoDVC from './InfoAccount/InfoDVC'
import { appConfig } from '../../../app/Config'
import apisAdmin from '../../../srcAdmin/apis'
import { store } from '../../../srcRedux/store'
import { OnSignIn, OnSignOut } from '../../sourcequyhoach/Containers/Login'
import { LoginManager, AccessToken, LoginButton, AppEventsLogger } from 'react-native-fbsdk';
import authFB from '@react-native-firebase/auth';
import { LogiFB } from '../../apis/apiUser';
import { IsLoading } from '../../../components';
import { GetDataPageFacebook, getInformationFB } from '../../apis/apiFaceBook'
import { PulseIndicator } from 'react-native-indicators';
import UtilsApp from '../../../app/UtilsApp'

class HomePersonal extends Component {
    constructor(props) {
        super(props)
        this._CapNhatAvatar = Utils.ngetParam(this, "_CapNhatAvatar", () => { })
        this.isSendPA = Utils.ngetParam(this, 'isSendPA', false);
        // this.isShowFB = Utils.getGlobal(nGlobalKeys.ShowFB);
        this.state = {
            index: 0,
            routes: [],
            test: '',
        };

    }
    onAuthStateChanged(user) {
        Utils.nlog("usr----------", user)
    }

    // RENDER MÀN HÌNH
    renderScene = ({ route }) => {
        Utils.nlog('router tab', route)
        switch (route.config) {
            case AppCodeConfig.APP_ADMIN:
                return <InfoCanBo nthis={this} />
            case AppCodeConfig.APP_CONGDAN:
                if (this.props.auth.tokenCD) {
                    return <InfoCongDong nthis={this} />
                } else {
                    return this.renderSreenPortLogin()
                }
            case AppCodeConfig.APP_DVC:
                return <InfoDVC nthis={this} />
            default:
                break;
        }

    }

    // XỬ LÝ SCROLLHEADER TAB
    goIndex = (index) => {
        this.ScrollTab.scrollTo({ x: 150 * index, y: 0, animated: true })
    }
    // ĐẰNG XUẤT
    _LogOut = () => {
        Utils.goscreen(this, 'Modal_LogOut', { callback: (index) => { this.setState({ index: index > 0 ? index - 1 : 0 }) } })
        LoginManager.logOut()
    }

    //
    _loginSSO = () => {
        Utils.goscreen(this, 'Modal_DangNhapSSO', { callback: this._callbackLoginSSO, isShowMessage: false })
    }
    _loginFB = async () => {
        LoginManager.setLoginBehavior(Platform.OS == 'ios' ? 'browser' : 'web_only')
        nthisIsLoading.show()
        const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
        if (result.isCancelled) {
            nthisIsLoading.hide()
            return;
        }

        // Once signed in, get the users AccesToken
        const data1 = await AccessToken.getCurrentAccessToken();
        await Utils.nsetStore(nkey.accessToken, data1.accessToken);
        // Create a Firebase credential with the AccessToken
        // const facebookCredential = await authFB.FacebookAuthProvider.credential(data1.accessToken);
        // console.log('=========> facebookCredential: ', facebookCredential)
        // let temp = await authFB().signInWithCredential(facebookCredential);
        // console.log('=====>>>>> dữ liệu facebook lấy về: ', temp)
        let val = `first_name, last_name, middle_name, name_format, picture, short_name, link, name, email`
        const GetInfoFB = await getInformationFB(data1.userID, val, data1.accessToken)
        const res = await LogiFB(GetInfoFB.name, GetInfoFB.email, `https://graph.facebook.com/${GetInfoFB.id}/picture`, GetInfoFB.id)
        // Sign-in the user with the credential
        console.log('=====>>>>> dữ liệu đăng nhập facebook res: ', res)
        if (res.status == 1 && res.data) {
            var { data = {} } = res;
            //--Khi login Thành Công thì tất cả đều phải xử lý trong Hàm này. Không dc viết ngoài.
            await UtilsApp.onSetLoginSuccess_Chung(1, data, this, nthisIsLoading);
        } else {
            nthisIsLoading.hide()
            var { error = {} } = res;
            Utils.showMsgBoxOK(this, 'Không thể đăng nhập', error ? error.message : 'Lỗi đăng nhập', 'Xác nhận');
        }
        return authFB().signInWithCredential(facebookCredential);
    }
    _callbackLoginSSO = async (isState, respond) => {
        if (isState) {
            // Utils.showMsgBoxOK(this, 'Thông báo', 'Đăng nhập thành công', 'OK', async () => {
            let { data } = respond
            Utils.nlog("responsse DVC ------------------ dvc", respond);
            await this.props.SetUserApp(AppCodeConfig.APP_DVC, data)
            // ------- code chạy thật ------
            this.props.SetRuleAppCanBo(data.AppCanBo)

            //đồng bộ dữ liệu chat
            let resTTK = {};
            if (Utils.getGlobal(nGlobalKeys.ChucNangNghiemThu, {}).loginDVC) { //--TH Bật ChucNangNghiemThu thì ko cần qtam lk tk Chat DVC
                resTTK = { status: 1 };
            } else
                resTTK = await apis.ApiDVC.Tim_Tai_Khoan(data.SoDienThoai);
            if (resTTK.status == 1) {
                this.props.CheckLienKet({ ...data, "LoginDVC": true })
            }
            // let resDS = await apis.ApiDVC.DS_DonVi(); // Ko thấy dùng, khoá code lại


            this.props.loadMenuApp({
                listObjectMenuDVC: data.AppCanBo
            })

            //đoạn code test
            // let bodyA = {
            //     "AppCanBo": [
            //         {
            //             "Ma": "CHAT",
            //             "Ten": "Trao doi"
            //         },
            //         {
            //             "Ma": "HKG",
            //             "Ten": "Họp Không Giấy"
            //         },
            //         {
            //             "Ma": "ILIS",
            //             "Ten": "Quản lý đất đai"
            //         },
            //         {
            //             "Ma": "IOC",
            //             "Ten": "Điều hành"
            //         },
            //         {
            //             "Ma": "TNG",
            //             "Ten": "Tây Ninh G"
            //         }
            //     ],
            //     "Email": null,
            //     "HoVaTen": "Huỳnh Thị Cẩm Dung",
            //     "KhachHangID": "385961",
            //     "LoginDVC": true,
            //     "NgayThangNamSinh": "19950629",
            //     "SoDienThoai": "0966601459",
            //     "SoDinhDanh": "025290829",
            //     "TechID": "dede452f-e9b6-42a1-9745-4fab481a5c8c",
            //     "Token": null,
            //     "UserPortalID": "25082"
            // }
            // this.props.loadMenuApp({
            //     listObjectMenuDVC: bodyA.AppCanBo
            // })
            // await this.props.SetRuleAppCanBo(bodyA.AppCanBo)
            // this.props.CheckLienKet({...bodyA,"LoginDVC": true})
            // ------- code tesst ------
            Utils.goscreen(this, 'ManHinh_Home')
            // })
        } else {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Đăng nhập thất bại', 'Xác nhận')
        }
    }
    _renderTabBar = propstab => {
        const { auth } = this.props
        let stateScreen = propstab.navigationState.index;
        return (
            <View style={[{ flexDirection: 'row' }]}>
                <ScrollView showsHorizontalScrollIndicator={false} horizontal ref={refs => this.ScrollTab = refs} style={{ backgroundColor: colors.white, }}>
                    {
                        auth.listInfoShow && auth.listInfoShow.map((item, index) => {
                            return (
                                <TouchableOpacity
                                    key={index.toString()}
                                    onPress={() => { this.setState({ index: index }, () => this.goIndex(index)) }}
                                    style={{
                                        backgroundColor: colors.white,
                                        paddingVertical: 5, width: 150, paddingHorizontal: 5
                                    }}>
                                    <View style={{ flexDirection: 'row', backgroundColor: index == stateScreen ? this.props.theme.colorLinear.color[0] : colors.BackgroundHome, paddingVertical: 3, borderRadius: 30 }}>
                                        <Text numberOfLines={1} style={{
                                            color: index == stateScreen ? colors.white : colors.brownGreyThree,
                                            textAlign: 'center', paddingVertical: 6,
                                            flex: 1,
                                            fontSize: reText(12),
                                            fontWeight: index == stateScreen ? 'bold' : 'normal',
                                            paddingHorizontal: 5
                                        }}>{item.title}</Text>
                                        {
                                            item.config == AppCodeConfig.APP_ADMIN ?
                                                this.props.auth.tokenDH ?
                                                    <View style={{ position: 'absolute', top: -5, right: -5 }}>
                                                        <PulseIndicator
                                                            color={this.props.auth.tokenDH ? 'green' : 'gray'}
                                                            size={20} count={7} />
                                                    </View>
                                                    :
                                                    <View style={{ backgroundColor: 'gray', padding: 5, position: 'absolute', top: 0, right: 0, borderRadius: 5 }} />
                                                : item.config == AppCodeConfig.APP_CONGDAN ?
                                                    this.props.auth.tokenCD ?
                                                        <View style={{ position: 'absolute', top: -5, right: -5 }}>
                                                            <PulseIndicator
                                                                color={this.props.auth.tokenCD ? 'green' : 'gray'}
                                                                size={20} count={7} />
                                                        </View>
                                                        :
                                                        <View style={{ backgroundColor: 'gray', padding: 5, position: 'absolute', top: 0, right: 0, borderRadius: 5 }} />
                                                    : this.props.auth.userDVC ?
                                                        <View style={{ position: 'absolute', top: -5, right: -5 }}>
                                                            <PulseIndicator
                                                                color={this.props.auth.userDVC ? 'green' : 'gray'}
                                                                size={20} count={7} />
                                                        </View>
                                                        :
                                                        <View style={{ backgroundColor: 'gray', padding: 5, position: 'absolute', top: 0, right: 0, borderRadius: 5 }} />
                                        }
                                    </View>
                                </TouchableOpacity>)
                        })
                    }
                </ScrollView>
            </View>
        );
    };

    renderSreenPortLogin = () => {
        return (
            <ScrollView style={{ flex: 1 }}>
                <Text style={{ fontWeight: 'bold', textAlign: 'center', padding: 10, fontSize: reText(20), lineHeight: 30 }}>{Utils.getGlobal(nGlobalKeys.TenApp, 'PAHT').toUpperCase()}</Text>
                <LottieView
                    source={require('../../images/welcome.json')}
                    style={{ width: nwidth(), height: nheight() / 4, justifyContent: "center", alignSelf: 'center' }}
                    loop={true}
                    autoPlay={true}
                />
                <Text style={{ textAlign: 'center', padding: 10, fontSize: reText(14) }}>{'Để sử dụng hệ thống vui lòng đăng nhập bằng tài khoản'}</Text>
                <ButtonCom
                    onPress={() => Utils.goscreen(this, 'login')}
                    text={appConfig.TenTinh + ' Smart'}
                    style={{ borderRadius: 5, marginHorizontal: 10 }}
                />
                {
                    this.props.auth.userDVC ? null :
                        <ButtonCom
                            Linear={true}
                            colorChange={['#2E3192', '#1BFFFF']}
                            onPress={this._loginSSO}
                            text={'Dịch vụ công Quốc gia'}
                            style={{ margin: 10, borderRadius: 5 }}
                        />
                }

                {/* <ButtonCom
                    Linear={true}
                    colorChange={['#2E3192', '#1BFFFF']}
                    onPress={() => Utils.navigate("login", {
                        sdt: true
                    })}
                    text={'Login Tay ninh'}
                    style={{ margin: 10, borderRadius: 5 }}
                /> */}

                {/* LoginTNH */}
                {/* {this.isShowFB == 1 ?
                    < ButtonCom
                        Linear={true}
                        colorChange={['#2E3192', '#1BFFFF']}
                        onPress={this._loginFB}
                        text={'Login Facebook'}
                        style={{ marginHorizontal: 10, borderRadius: 5 }}
                    />
                    : null} */}
                {/* <Image source={{ uri: 'https://graph.facebook.com/2851958495045950/picture' }} style={{ width: 318, height: 40 }} /> */}
            </ScrollView>
        )
    }

    render() {
        let { index } = this.state
        let { auth } = this.props
        return (
            <View style={{ flex: 1, backgroundColor: colors.BackgroundHome }}>
                <NavigationEvents
                    onDidFocus={this._onReRender}
                    onWillFocus={this._onReRender}
                />
                <HeaderCus
                    title={auth.tokenCD || auth.tokenDH ? 'Thông tin cá nhân' : 'Đăng nhập'}
                    styleTitle={{ color: colors.white }}
                    iconRight={auth.tokenCD || auth.tokenDH || auth.userDVC ? Images.icLogOut : null}
                    onPressRight={this._LogOut}
                // titleLeft={auth.tokenDH || auth.tokenCD ? 'Tài khoản' : null}
                // Sleft={{ fontSize: reText(12) }}
                // onPressLeft={() => Utils.goscreen(this, 'Modal_TaiKhoan')}

                />
                {
                    this.props.auth.tokenCD || this.props.auth.tokenDH || this.props.auth.userDVC ?
                        <Fragment>

                            <View style={[nstyles.nbody, { backgroundColor: colors.BackgroundHome, }]}>
                                <TabView
                                    navigationState={{
                                        index: this.state.index,
                                        routes: auth.listInfoShow || []
                                    }}
                                    renderScene={this.renderScene}
                                    renderTabBar={this._renderTabBar}
                                    onIndexChange={index => { this.setState({ index }, () => this.goIndex(index)) }}
                                    initialLayout={{ width: nwidth() }}
                                />
                            </View>
                        </Fragment> :
                        auth.userDVC ? <InfoDVC nthis={this} /> :
                            // <ScrollView style={{ flex: 1 }}>
                            //     <Text style={{ fontWeight: 'bold', textAlign: 'center', padding: 10, fontSize: reText(20), lineHeight: 30 }}>{'Hệ thống tiếp nhận giải quyết \n góp ý, phản ánh hiện trường'.toUpperCase()}</Text>
                            //     <LottieView
                            //         source={require('../../images/welcome.json')}
                            //         style={{ width: nwidth(), height: nheight() / 4, justifyContent: "center", alignSelf: 'center' }}
                            //         loop={true}
                            //         autoPlay={true}
                            //     />
                            //     <Text style={{ textAlign: 'center', padding: 10, fontSize: reText(14) }}>{'Để sử dụng hệ thống vui lòng đăng nhập bằng tài khoản'}</Text>
                            //     <ButtonCom
                            //         onPress={() => Utils.goscreen(this, 'login')}
                            //         text={appConfig.TenTinh + ' Smart'}
                            //         style={{ borderRadius: 5, marginHorizontal: 10 }}
                            //     />
                            //     <ButtonCom
                            //         Linear={true}
                            //         colorChange={['#2E3192', '#1BFFFF']}
                            //         onPress={this._loginSSO}
                            //         text={'Dịch vụ công Quốc gia'}
                            //         style={{ margin: 10, borderRadius: 5 }}
                            //     />
                            //     <ButtonCom
                            //         Linear={true}
                            //         colorChange={['#2E3192', '#1BFFFF']}
                            //         onPress={this._loginFB}
                            //         text={'Login Facebook'}
                            //         style={{ marginHorizontal: 10, borderRadius: 5 }}
                            //     />
                            // </ScrollView>
                            this.renderSreenPortLogin()
                }
                <IsLoading />
            </View>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    theme: state.theme,
    isLogin: state.setlogin.isLogin,
    menu: state.menu
});
export default Utils.connectRedux(HomePersonal, mapStateToProps, true);
