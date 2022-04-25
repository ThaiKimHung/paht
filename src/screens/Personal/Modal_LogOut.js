import React, { Component } from 'react'
import { Text, View, Animated, Platform, Image } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import AppCodeConfig from '../../../app/AppCodeConfig'
import { AppgetGlobal, ROOTGlobal } from '../../../app/data/dataGlobal'
import { nGlobalKeys } from '../../../app/keys/globalKey'
import { nkey } from '../../../app/keys/keyStore'
import Utils from '../../../app/Utils'
import { ButtonCom } from '../../../components'
import { colors } from '../../../styles'
import { reText } from '../../../styles/size'
import { Height, nstyles } from '../../../styles/styles'
import apis from '../../apis'
import { Images } from '../../images'
import apisAdmin from '../../../srcAdmin/apis'
import { OnSignIn, OnSignOut } from '../../sourcequyhoach/Containers/Login'
import { appConfig } from '../../../app/Config'
import { GetSetMaScreen } from '../../../srcRedux/actions/auth/Auth'
import { store } from '../../../srcRedux/store'


class Modal_LogOut extends Component {
    constructor(props) {
        super(props)
        this.callback = Utils.ngetParam(this, 'callback', () => { })
        this.state = {
            opacity: new Animated.Value(0),
        }
    }
    componentDidMount() {
        this._startAnimation(0.4)
    }

    _startAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: value,
                duration: 300
            }).start();
        }, 300);
    };

    _goback = () => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: 0,
                duration: 150
            }).start(() => {
                Utils.goback(this);
            });
        }, 100);
    }
    _out_conDan = async () => {
        this.props.logoutAppCheckInterNet(true)
    }
    _out_Admin = async () => {
        this.props.logoutAppCheckInterNet(false)
    }
    _out_DVC = async () => {
        let deviceToken = await Utils.ngetStore(nGlobalKeys.userId_OneSignal, '');
        let res = await apis.ApiUser.LogoutGYPA(deviceToken, true);
        this.props.LogoutApp(AppCodeConfig.APP_DVC)
        this.props.loadMenuApp({
            isLogoutDVC: true
        })
        await Utils.nsetStore(nkey.TokenSSO, '')
        await Utils.nsetStore(nkey.UseCookieSSO, true)
        await Utils.nsetStore(nkey.InfoUserSSO, '')
        Utils.setGlobal(nGlobalKeys.TokenSSO, '');
        Utils.setGlobal(nGlobalKeys.InfoUserSSO, '');
        Utils.setGlobal(nGlobalKeys.UseCookieSSO, true);
    }

    _LogOut = async (item, index) => {
        let keyApp = item.config;
        let deviceToken = await Utils.ngetStore(nGlobalKeys.userId_OneSignal, '');
        switch (keyApp) {
            case AppCodeConfig.APP_ADMIN:
                {
                    Utils.showMsgBoxYesNo(this, "Thông báo", "Bạn có muốn đăng xuất tài khoản Cán bộ không ?", "Đăng xuất", "Không", async () => {
                        
                        this._out_Admin()
                        this.callback(index)
                        this._goback()

                    })
                }
                break;
            case AppCodeConfig.APP_CONGDAN: {
                Utils.showMsgBoxYesNo(this, "Thông báo", "Bạn có muốn đăng xuất tài khoản Cộng đồng không ?", "Đăng xuất", "Không", async () => {

                    this._out_conDan();
                    this.callback(index)
                    this._goback()

                })
            }
                break;
            case AppCodeConfig.APP_DVC: {
                Utils.showMsgBoxYesNo(this, "Thông báo", "Bạn có muốn đăng xuất tài khoản Cộng đồng không ?", "Đăng xuất", "Không", async () => {
                    this._out_DVC();
                    this.callback(index)
                    this._goback()
                })
            }
            default:
                break;
        }
    }

    _LogOutAll = () => {
        Utils.showMsgBoxYesNo(this, "Thông báo", "Bạn có muốn đăng xuất tất cả tài khoản không ?", "Đăng xuất", "Không", async () => {
            //cd
            await GetSetMaScreen(false, '', false, true);
            this._out_conDan(); //Đã có logout DVC bên trong rồi
            //global
            this._out_Admin()

            this._goback()

        })
    }

    render() {
        let { opacity } = this.state
        let { auth, theme } = this.props
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: `transparent`, justifyContent: 'flex-end' }]}>
                <Animated.View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgb(17,17,17)', opacity }} onTouchEnd={this._goback} />
                <View style={{ backgroundColor: colors.white, borderTopLeftRadius: 10, borderTopRightRadius: 10, zIndex: 1000, maxHeight: Height(90) }}>
                    <ScrollView
                        style={{ paddingBottom: Platform.OS == 'android' ? 20 : 30 }}
                    >
                        <Text style={{ padding: 10, fontSize: reText(18), textAlign: 'center', color: theme.colorLinear.color[0], fontWeight: 'bold' }}>{'Đăng xuất'}</Text>

                        {auth.listInfoShow && auth.listInfoShow.map((item, index) => {
                            return <TouchableOpacity key={index.toString()} onPress={() => this._LogOut(item, index)} style={{ padding: 13 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{}}>Tài khoản {item.title}</Text>
                                    <Image source={Images.icLogOut} style={[nstyles.nIcon22, { tintColor: theme.colorLinear.color[0] }]} resizeMode='contain' />
                                </View>
                            </TouchableOpacity>
                        })
                        }
                        {auth.listInfoShow && auth.listInfoShow.length > 0 ?
                            < TouchableOpacity onPress={() => this._LogOutAll()} style={{ padding: 13 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{}}>{'Tất cả tài khoản'}</Text>
                                    <Image source={Images.icLogOut} style={[nstyles.nIcon22, { tintColor: theme.colorLinear.color[0] }]} resizeMode='contain' />
                                </View>
                            </TouchableOpacity> : null
                        }
                        <ButtonCom
                            text={'Quay lại'}
                            style={{ borderRadius: 5, margin: 13, }}
                            onPress={this._goback}
                        />
                    </ScrollView>
                </View>
            </View >
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    theme: state.theme
});
export default Utils.connectRedux(Modal_LogOut, mapStateToProps, true);
