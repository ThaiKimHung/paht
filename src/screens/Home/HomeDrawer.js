import React, { Component } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet, Image, Platform, Linking, ScrollView, Animated, StatusBar } from 'react-native';
import { nstyles, paddingTopMul, Height, nwidth, Width, heightStatusBar, isLandscape } from '../../../styles/styles';
import { colors, sizes } from '../../../styles';
import LinearGradient from 'react-native-linear-gradient'
import Utils, { icon_typeToast } from '../../../app/Utils';
import { Images } from '../../images';
import Avatar from './components/Avatar';
import apis from '../../apis';
import moment from 'moment';
import { appConfig } from '../../../app/Config';
import { IsLoading } from '../../../components';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import { isPad, reSize, reText } from '../../../styles/size';
import { nGlobalKeys } from '../../../app/keys/globalKey';
import { FlatList } from 'react-native-gesture-handler';
import { GetDeailTrangTinh } from '../../apis/apiapp';
import { nkey } from '../../../app/keys/keyStore';
import { NavigationEvents } from 'react-navigation';
import { BlurView } from "@react-native-community/blur";
import { SaveTokenHKG } from '../../../srcHKG/api/saveToken';
import AppCodeConfig from '../../../app/AppCodeConfig';
import ImageCus from '../../../components/ImageCus';
import TextCus from '../../../components/TextCus';
import { ChangeCurentGroup, ApiGetInfoChat } from '../../../srcRedux/actions';
import { checkAppAdmin } from '../../../srcRedux/actions/auth/Auth';
import OneSignal from 'react-native-onesignal';
import { store } from '../../../srcRedux/store';
import { nkeyCache } from '../../../app/keys/nkeyCache';
import analytics from '@react-native-firebase/analytics';
import KeyAnalytics from '../../../app/KeyAnalytics';
import ItemMenu from './components/ItemMenu';
import Slogan from './Slogan';
import * as Animatable from 'react-native-animatable';
import { PulseIndicator } from 'react-native-indicators';
import LottieView from 'lottie-react-native';
import KeepAwake from 'react-native-keep-awake';
import Carousel from './components/Carousel';
import NetInfo from "@react-native-community/netinfo";
import { ImagesSVL } from '../../srcSanViecLam/images';
import { DEFINE_SCREEN_DETAILS } from '../../srcSanViecLam/common';

// CHUỖI CONFIG MENU BẢN CŨ
const titleMenuDefault = 'Phản ánh tố giác,Thông tin cảnh báo,Thông tin tuyên truyền,Thông báo,Hỗ trợ khẩn cấp,Cài đặt'
// MÀN HÌNH MENU APP
class HomeDrawer extends Component {
    //STATE
    constructor(props) {
        super(props);
        this.icMenuConfig = Utils.getGlobal(nGlobalKeys.LinkIcons, '').split(',');
        this.colorBackgroundMenu = Utils.getGlobal(nGlobalKeys.colorBackgroundMenu, 'rgba(255,255,255,0.6)');
        this.listTitleMenu = Utils.getGlobal(nGlobalKeys.listTitleMenu, titleMenuDefault).split('|');
        this.colorTextMenu = Utils.getGlobal(nGlobalKeys.colorTextMenu, colors.white)
        this.TinTucHome = Utils.getGlobal(nGlobalKeys.TinTucHome, 'false')
        this.state = {
            dataThoiTiet: [], // data test: { Temperature: { Value: 86, Min: 77, Max: 97 }, Icon: 0, EpochDateTime: 1625058000 }
            dataHuongDan: null,
            menuDrawer: [],
            banner: [],
            colorHeader: colors.colorLinearButton,
            isThoiTietFull: false,
            isConnect: false,
        };
        this.scrollYAnimatedValue = new Animated.Value(0)

        ROOTGlobal.onOpenNotiCD = (notification) => {
            this.onOpened(notification, this);
        }

        nthisApp = this;

    }

    handleConnectivityChange = state => {
        if (!state.isConnected) {
            Utils.nlog('vao tat ket noi')
            this.setState({ isConnect: true });
        }
        else {
            if (!this.state.isConnect)
                return;
            this.setState({ isConnect: false });
            Utils.nlog('vao tat ket noi')
        }
    };
    // DIDMOUNT MÀN HÌNH
    async componentDidMount() {
        this._getThoiTiet();
        Utils.checkVersion(this, Utils.getGlobal(nGlobalKeys.resconfig, {}));
        this.GetTTHuongDan();
        this.GetList_Banner_App();
        // if (this.TinTucHome == 'true') {
        //     this.GetTinTuc()
        // }
        ROOTGlobal.dataGlobal._ReLoadMenuHome = this._GetMaAppCanBo
        OneSignal.addEventListener('opened', (val) => this.onOpened(val, this));
        try {
            KeepAwake.deactivate();
        } catch (error) {

        }
        NetInfo.addEventListener(this.handleConnectivityChange);
    }
    async componentWillUnmount() {
        NetInfo.removeEventListener(
            this.handleConnectivityChange);
    }
    onOpened(openResult, nthis) {
        Utils.nlog('[LOG] notification', openResult)
        const { additionalData = {} } = openResult.notification.payload;
        const { Data = {} } = additionalData
        // Utils.nlog("onOpened", openResult);
        //----------------------Cấu trúc tạo trước bắt notifi Thông báo Tây Ninh
        if (Data.MaScreen == appConfig.manHinhHKG) { //Họp không giấy
            var url = appConfig.deeplinkchitietHKG + `${Data.data.ID}`
            Linking.openURL(url);
            return;
        }
        if (Data.MaScreen == appConfig.manHinhHoiDap) { //Hỏi đáp
            var url = appConfig.deeplinkHoiDap + `${Data.data.ID}`
            Linking.openURL(url)
            return;
        }
        if (Data.MaScreen == appConfig.manHinhHoSo) { //Gửi hồ sơ
            var url = appConfig.deeplinkGuiHoSo + `${Data.data.ID}`
            Linking.openURL(url)
            return;
        }
        if (Data.MaScreen == appConfig.manHinhThanhToan) { //Thanh Toán DVC
            var url = appConfig.deeplinkThanhToan + `${Data.data.ID}`
            Linking.openURL(url)
            return;
        }
        if (Data.MaScreen == appConfig.manHinhTinTuc) { //Tin Tuc
            var url = appConfig.deeplinkTinTuc + `${Data.data.ID}`
            Linking.openURL(url)
            return;
        }
        if (Data.MaScreen == appConfig.manhinhKBYT) { //Tin Tuc
            var url = appConfig.deeplinkTinKBYT + `${Data.data.ID}`
            Linking.openURL(url)
            return;
        }
        //Deeplink SVL================================================================
        if (additionalData.KeyScreen == DEFINE_SCREEN_DETAILS.TuyenDung_CaNhan.KeyScreen && additionalData?.Id) {
            var url = appConfig.deeplinkSVL_TuyenDungCaNhan + `${additionalData?.Id}|${DEFINE_SCREEN_DETAILS.TuyenDung_CaNhan.KeyScreen}`
            Linking.openURL(url)
            return;
        }
        if (Data.KeyScreen == DEFINE_SCREEN_DETAILS.TuyenDung_DoanhNghiep.KeyScreen && additionalData?.Id) {
            var url = appConfig.deeplinkSVL_TuyenDungDoanhNghiep + `${additionalData?.Id}|${DEFINE_SCREEN_DETAILS.TuyenDung_DoanhNghiep.KeyScreen}`
            Linking.openURL(url)
            return;
        }
        //================================================================
        //CODE MOI 
        let isAdmin = additionalData.hasOwnProperty('Admin') && additionalData.Admin == true ? true : false;
        if (!isAdmin) { //--Khi NOTI là của Công Dân
            Utils.setGlobal(nGlobalKeys.CheckNotiCanhBao, true);
            if (additionalData && additionalData.IdHoiDapTT) {
                var url = appConfig.deeplinkHoiDapVTS + `${additionalData ? additionalData.IdHoiDapTT : 0}`
                // Utils.nlog('url', url);
                return Linking.openURL(url)
            }
            if (additionalData && additionalData.IdPA && additionalData.TypeReference == 103) {
                var url = appConfig.deeplinkTuiVanF0 + `${additionalData ? additionalData.IdPA : 0}`
                // Utils.nlog('url', url);
                if (ROOTGlobal.dataGlobal._loadDataChiTietTuVanF0) {
                    ROOTGlobal.dataGlobal._loadDataChiTietTuVanF0(additionalData.IdPA);
                }
                return Linking.openURL(url)
            }
            if (additionalData && additionalData.IdPA && additionalData.TypeReference == 102) {
                var url = appConfig.deeplinkTuiAnSinh + `${additionalData ? additionalData.IdPA : 0}`
                // Utils.nlog('url', url);
                if (ROOTGlobal.dataGlobal._loadDataChiTietTuiAnSinh) {
                    ROOTGlobal.dataGlobal._loadDataChiTietTuiAnSinh(additionalData.IdPA);
                }
                Linking.openURL(url)
            } else if (additionalData && additionalData.IdPA) {
                var url = appConfig.deeplinkCongDan + `${additionalData ? additionalData.IdPA : 0}`
                // Utils.nlog('url', url);
                if (ROOTGlobal.dataGlobal._loadDataChiTietPa) {
                    ROOTGlobal.dataGlobal._loadDataChiTietPa(additionalData.IdPA);
                }
                Linking.openURL(url)
            } else if (additionalData && additionalData.IdCanhBao) {
                var url = appConfig.deeplinkCB + `${additionalData ? additionalData.IdCanhBao : 0}`
                // Utils.nlog('url', url);
                Linking.openURL(url)
            } else if (additionalData && additionalData.Id_ThongBao) {
                //Thông báo (Hoàng)
                var url = appConfig.deeplinkThongBaoChung + `${additionalData ? additionalData.Id_ThongBao : 0}`
                // Utils.nlog('url', url);
                Linking.openURL(url)
            } else if (additionalData && additionalData.IdSOS && additionalData.Type == 1) {
                var url = appConfig.deeplinkCanhBaoCovid + `${additionalData ? additionalData.IdSOS : 0}`
                Linking.openURL(url)
            }
            else if (additionalData && additionalData.IdSOS) {
                var url = appConfig.deeplinkSOS + `${additionalData ? additionalData.IdSOS : 0}`
                // Utils.nlog('url', url);
                Linking.openURL(url)
            } else if (additionalData && additionalData.IdFeedBack) {
                var url = appConfig.deeplinkGopYIOCCD + `${additionalData ? additionalData.IdFeedBack : 0}`
                // Utils.nlog('url', url);
                Linking.openURL(url)
            } else {
                Linking.openURL(appConfig.deeplinkHome)
            }
        } else { //--Khi NOTI là của Admin
            //admin----------------admin=-------------admin
            if (!additionalData) return;
            let url = '';
            // Utils.nlog("giá trị additionalData oper============", additionalData)
            // let CheckChat = Utils.getGlobal(nGlobalKeys.Chat, '0', AppCodeConfig.APP_ADMIN);
            if (additionalData.IdGroup) {
                store.dispatch(checkAppAdmin())
                store.dispatch(ChangeCurentGroup(additionalData.IdGroup));
                store.dispatch(ApiGetInfoChat(additionalData.IdGroup));
                url = appConfig.deeplinkChatGroup + `${additionalData.IdGroup}`
                Linking.openURL(url);
                return;
            }
            if (additionalData && additionalData.IdHoiDapTT) {
                url = appConfig.deeplinkHoiDapVTS_Admin + `${additionalData ? additionalData.IdHoiDapTT : 0}`
                return Linking.openURL(url)
            }
            if (additionalData && additionalData.IdFeedBack) {
                url = appConfig.deeplinkGopYIOC
                // Utils.nlog('url', url);
                if (ROOTGlobal.dataGlobal._GoDeepLink == null) {
                    if (nthis) {
                        Utils.goscreen(nthis, "sw_RootDH", { callback: url })
                    } else {
                        Utils.navigate("sw_RootDH", { callback: url })
                    }
                } else {
                    ROOTGlobal.dataGlobal._GoDeepLink(url)
                }
                return;
            }
            if (additionalData && additionalData.IdSOS) {
                url = appConfig.deeplinkSOSCB + `${additionalData ? additionalData.IdSOS : 0}`
                // Utils.nlog('url', url);
                if (ROOTGlobal.dataGlobal._GoDeepLink == null) {
                    if (nthis) {
                        Utils.goscreen(nthis, "sw_RootDH", { callback: url })
                    } else {
                        Utils.navigate("sw_RootDH", { callback: url })
                    }
                } else {
                    ROOTGlobal.dataGlobal._GoDeepLink(url)
                }
                return;
            }
            if (additionalData && additionalData.IdSOS && additionalData.Type == 1) {
                url = appConfig.deeplinkCBCV + `${additionalData ? additionalData.IdSOS : 0}`
                // Utils.nlog('url', url);
                if (ROOTGlobal.dataGlobal._GoDeepLink == null) {
                    if (nthis) {
                        Utils.goscreen(nthis, "sw_RootDH", { callback: url })
                    } else {
                        Utils.navigate("sw_RootDH", { callback: url })
                    }
                } else {
                    ROOTGlobal.dataGlobal._GoDeepLink(url)
                }
                return;
            }
            if (additionalData && additionalData.IdCanhBao && additionalData.Comment == true) {
                let id = `${additionalData ? additionalData.IdCanhBao : 0}`;
                url = appConfig.deeplinktuongtac + id;
                if (ROOTGlobal.dataGlobal._GoDeepLink == null) {
                    if (nthis) {
                        Utils.goscreen(nthis, "sw_RootDH", { callback: url })
                    } else {
                        Utils.navigate("sw_RootDH", { callback: url })
                    }
                } else {
                    ROOTGlobal.dataGlobal._GoDeepLink(url)
                }
                return;
            }
            if (additionalData && additionalData.IdPA) {
                const urlTemp = `${additionalData ? additionalData?.IdPA : 0}|` + (additionalData?.TuongTac ? additionalData?.TuongTac : false);
                if (additionalData.NoiBo) {
                    url = appConfig.deeplinknoibo + urlTemp;
                } else {
                    url = appConfig.deeplinkDieuHanh + urlTemp;
                }
                if (ROOTGlobal.dataGlobal._GoDeepLink == null) {
                    if (nthis) {
                        Utils.goscreen(nthis, "sw_RootDH", { callback: url })
                    } else {
                        Utils.navigate("sw_RootDH", { callback: url })
                    }
                } else {
                    if (ROOTGlobal.dataGlobal._ReloadCTPADH)
                        ROOTGlobal.dataGlobal._ReloadCTPADH(additionalData.IdPA)
                    ROOTGlobal.dataGlobal._GoDeepLink(url)
                }
                return;
            }
            if (additionalData && additionalData.isRequest) {
                url = appConfig.deeplinkChatDSKB;
                Linking.openURL(url);
                return;

            }
            if (additionalData && additionalData.Id_ThongBao) {
                url = appConfig.deeplinkThongBaoChung + `${additionalData ? additionalData.Id_ThongBao : 0}`
                if (ROOTGlobal.dataGlobal._GoDeepLink == null) {
                    Utils.goscreen(this, "sw_RootDH", { callback: url })
                } else {
                    ROOTGlobal.dataGlobal._GoDeepLink(url)
                }
                return;
            }

            if (additionalData && (additionalData.list == true || additionalData.list == 'true')) {
                url = appConfig.deeplinklist;
                if (ROOTGlobal.dataGlobal._GoDeepLink == null) {
                    Utils.goscreen(this, "sw_RootDH", { callback: url })
                } else {
                    ROOTGlobal.dataGlobal._GoDeepLink(url)
                }
                return;
            }
            if (nthis) {
                Utils.goscreen(nthis, "sw_RootDH", {})
            } else {
                Utils.navigate("sw_RootDH", {})
            }
        }
    }

    // XỬ LÝ CHUYỂN MÀN HÌNH BUTTON MENU
    _goScreenTab = async (item, param = {}) => {
        // check login tra cứu đăng nhập
        if (item.goscreen === 'ManHinh_TraCuuHocTap' && !this.props.auth.tokenCD) {
            Utils.showToastMsg('Thông báo', `Bạn cần đăng nhập để sử dụng chức năng ${item.name.toLowerCase()}.`, icon_typeToast.warning, 2000)
            Utils.navigate('login')
            return
        }
        //analytic
        await analytics().logEvent(KeyAnalytics.item_menu_press, {
            "data": item.name || item
        })
        //getdata
        if (item.paramsChild && !this.props.auth.tokenCD) {
            Utils.showMsgBoxOK(this, "Thông báo", "Bạn cần đăng nhập để gửi phản ánh dịch bệnh", "Xác nhận");
            return;
        }
        const { child = [] } = item;
        if (child && child.length > 0) {
            Utils.push("ModalMenuChild", {
                data: item,
                _goScreenTab: this._goScreenTab
            });
        } else {
            Utils.setGlobal(nGlobalKeys.titleForm, param.title);
            if ((item.goscreen == 'ManHinh_ViecTimNguoi' || item.goscreen == 'ManHinh_NguoiTimViec') && !this.props.auth.tokenCD) {
                Utils.showToastMsg('Thông báo', `Bạn cần đăng nhập để sử dụng chức năng ${item.name.toLowerCase()}.`, icon_typeToast.warning, 2000)
                Utils.navigate('login')
                return
            }
            if (item.code == 'HKG') {
                SaveTokenHKG.saveToken('hkg', "0FiDNkSIQiRw94f1UmmZ6P4lwW3XqJ6hce7jY2NUrSMdXYeJs0");
                // 0FiDNkSIQiRw94f1UmmZ6P4lwW3XqJ6hce7jY2NUrSMdXYeJs0
            }
            Utils.nlog('LOG [CLICK CAM]', item, Utils.getGlobal(nGlobalKeys.OnOffCamera, 0))
            if (item.code == "CAM" && Utils.getGlobal(nGlobalKeys.OnOffCamera, 0) != 0) {
                Utils.showMsgBoxOK(this, "Thông báo", "Bạn cần đăng nhập để vào camera", "Xác nhận");
                return;
            }
            if ((item.isLogin == "true" || item.isLogin == true) && !this.props.auth.tokenCD) {
                Utils.showMsgBoxOK(this, "Thông báo", "Bạn cần đăng nhập để vào chức năng này", "Xác nhận");
                return;
            }
            if (item.code == 'CHAT') {
                if (this.props.auth.tokenCHAT) {
                    this.props.CheckConnectChat()
                }
                if (this.props.auth.tokenCHAT != '') {
                    StatusBar.setBarStyle('dark-content')
                    // if (this.props.auth.listObjectRuleDH.find(item => item.code == 'CHAT')) {
                    //     Utils.setGlobal(nGlobalKeys.loginToken, this.props.auth.tokenDH, AppCodeConfig.APP_ADMIN)
                    //     Utils.setGlobal(nGlobalKeys.Id_user, this.props.auth.userDH.UserID || this.props.auth.userDH.Id, AppCodeConfig.APP_ADMIN)
                    //     await Utils.nsetStore(nkey.loginToken, this.props.auth.tokenDH, AppCodeConfig.APP_ADMIN)
                    //     await Utils.nsetStore(nkey.Id_user, this.props.auth.userDH.UserID || this.props.auth.userDH.Id, AppCodeConfig.APP_ADMIN);
                    // }
                    // else
                    // {
                    //     Utils.showMsgBoxOK(this, "Thông báo", "Bạn cần có quyền để vào chức năng này", "Xác nhận");
                    // }
                    Utils.goscreen(this, item.goscreen);
                } else {
                    Utils.showMsgBoxOK(this, "Thông báo", "Bạn cần đăng nhập để vào chat", "Xác nhận");
                }
                return;
            }
            //--Các TH còn lại
            if (item.goscreen) {
                item.paramsChild ? Utils.goscreen(this, item.goscreen, { ...JSON.parse(item.paramsChild), keyMenuChild: item.keyMenuChild, title: item.name }) :
                    Utils.goscreen(this, item.goscreen, { ...item.params, keyMenuChild: item.keyMenuChild, title: item.name });
            } else {
                // Utils.openUrl(item.linkWeb)
                //TH có 2 linkWeb thì linkWeb: là IOS, linkWeb2: Android. Còn 1 link thì chạy chung linkWeb.
                //--isLinking để biết đó có phải là link Cần mở deeplink hay ko?
                if (item.linkWeb2 && item.linkWeb2 != "" && Platform.OS == 'android')
                    Utils.openWeb(this, item.linkWeb2, { isLinking: item.isLinking, isShowMenuWeb: item.isShowMenuWeb, title: item.name });
                else
                    if (item.linkWeb && item.linkWeb != "")
                        Utils.openWeb(this, item.linkWeb, { isLinking: item.isLinking, isShowMenuWeb: item.isShowMenuWeb, title: item.name, linearWebviewLeft: item.linearWebviewLeft, linearWebviewRight: item.linearWebviewRight });
            }

            //--
            if (item.Developer && item.Developer?.length != 0) {
                if (item.Developer.length == 2)
                    Utils.showMsgBoxOK(this, "Thông báo", item.Developer[0], item.Developer[1]);
                else
                    Utils.showMsgBoxYesNo(this, "Thông báo", item.Developer[0], item.Developer[1], item.Developer[2], () => Utils.goscreen(this, 'ManHinh_Home'));

            }
        }
    }

    //RENDER BUTTON MENU
    _renderMenu = (item, index, isCD = false) => {
        return <ItemMenu key={index} item={item} index={index} isCD={isCD} _goScreenTab={this._goScreenTab} />
    }

    // RENDER ITEM THỜI TIẾT BẢN CŨ
    _renderTT = (item = { Temperature: { Value: 90, Min: 77, Max: 97 }, Icon: 0, EpochDateTime: 1625058000 }, index = 0) => {
        const { isThoiTietFull } = this.state;

        var do_c = ((item.Temperature.Value - 31) / 1.8).toFixed(0);

        var domin_c = item.Temperature.Min;
        var domax_c = item.Temperature.Max;
        if (domin_c && domin_c) {
            domin_c = ((domin_c - 31) / 1.8).toFixed(0);
            domax_c = ((domax_c - 31) / 1.8).toFixed(0);
        }
        var time = Utils.formatDate(item.DateTime, "hh:mm");
        var image = item.Icon
        const viewFirst = (
            <View key={index.toString()} style={{ paddingHorizontal: 5, paddingVertical: 5, alignItems: 'center', justifyContent: 'center' }}>
                <View style={[{ alignItems: 'center', justifyContent: 'center', flexDirection: isThoiTietFull ? 'column' : 'row' }]}>
                    <View style={[{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }]}>
                        <Image source={image ? { uri: image } : Images.o1} style={[nstyles.nIcon50, { marginVertical: -8, marginLeft: -10 }]} resizeMode='contain' />
                        <View>
                            <Text style={{ color: colors.white, fontSize: sizes.sizes.sText17, fontWeight: 'bold' }}>
                                {`${do_c}°C `}
                            </Text>
                            {
                                !domin_c ? null :
                                    <Text style={{ color: colors.white, fontSize: sizes.sizes.sText9 }}>
                                        {`${domin_c} - ${domax_c}°C`}
                                    </Text>
                            }
                        </View>
                    </View>
                    {
                        isThoiTietFull ?
                            <Text numberOfLines={2} style={{ color: colors.white, fontSize: sizes.sizes.sText15, fontWeight: 'bold', maxWidth: Width(33), textAlign: 'center' }}>
                                {appConfig.TenTinh}
                            </Text> :
                            <Text numberOfLines={1} style={{ color: colors.white, fontSize: sizes.sizes.sText15, fontWeight: 'bold', maxWidth: Width(33) }}>
                                <Text style={{ fontSize: 15 }}>•</Text>{" " + appConfig.TenTinh}
                            </Text>
                    }
                </View>
            </View>
        );
        if (!isThoiTietFull) {
            if (index != 0) return null;
            return viewFirst;
        }
        else {
            return (
                <View style={[nstyles.nrow, { alignItems: 'center' }]}>
                    {
                        index != 0 ? null :
                            <>
                                {viewFirst}
                                <View style={{ height: 50, width: 1, backgroundColor: colors.white, marginHorizontal: Width(5) }} />
                            </>
                    }
                    <View key={index.toString()} style={{ paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center', marginVertical: 3 }}>
                        <Text style={{ color: colors.white, fontSize: sizes.sizes.sText10 }}>
                            {time}
                        </Text>
                        <Image source={image ? { uri: image } : Images.o1} style={[nstyles.nIcon38, { marginVertical: -6 }]} resizeMode='contain' />
                        <Text style={{ color: colors.white, fontWeight: 'bold', fontSize: sizes.sizes.sText14 }}>
                            {`${do_c}°C`}
                        </Text>
                    </View>
                </View>
            )
        }

    }

    onThoiTietFull = () => {
        this.setState({ isThoiTietFull: !this.state.isThoiTietFull });
    }

    renderHeaderMenu = (textVal = 'Cộng đồng') => {
        return (
            <View style={{ flexDirection: 'row' }}>
                <Text style={[styler.txtH1, {
                    marginBottom: 15, marginVertical: 10, paddingHorizontal: 15, flex: 1
                }]}>{textVal}</Text>
            </View>
        );
    }

    // GET DỮ LIỆU THỜI TIẾT
    _getThoiTiet = async () => {
        const res = await apis.ApiApp.GetThoiTiet();
        Utils.nlog("gia tri ress thoi tiets:", res)
        if (res.status == 1 && res.data) {
            this.setState({ dataThoiTiet: res.data });
        } else {
            // Utils.showMsgBoxOK(this, "Thông báo", res.error ? res.error.message : "Lỗi truy xuất dữ liệu", "Xác nhận")
        }
    }


    // GET THÔNG TIN HƯỚNG DẪN
    GetTTHuongDan = async () => {
        let res = await GetDeailTrangTinh(1);
        if (res && res.status == 1 && res.data) {
            this.setState({ dataHuongDan: res.data })
        }
    }

    //GET TIN TỨC 
    // GetTinTuc = async () => {
    //     let res = await apis.ApiCanhBao.GetList_CanhBaoApp(false, 1, 10, -1);
    //     Utils.nlog("TIN TUC", res)
    // }
    // GET BANNER HOME
    GetList_Banner_App = async () => {
        let res = await apis.ApiApp.GetList_Banner_App()
        // Utils.nlog('res banner===', res)
        if (res.status == 1 && res.data) {
            this.setState({ banner: res.data }, () => {
                this.refWiper?.goToLastIndex()
            })
        }
    }

    onFocus = () => {
        StatusBar.setBarStyle('light-content')
        //An modal noti administration
        this.props.SetShowModalNoti(false)

        //Dem lai so thong bao
        this.props.GetCountNotification()

    }

    onBannerClick = (item, index) => {
        const { Link = "", LinkIOS = "", LinkAndroid = "" } = item;
        let linkTemp = Link && Link != "" ? Link : Platform.OS === "ios" ? LinkIOS : LinkAndroid;
        if (linkTemp != "")
            Utils.openWeb(this, linkTemp, { isLinking: (LinkIOS != "" || LinkAndroid != "") && (!Link || Link == "") });
    }

    onMenuCallBot = () => {
        const { userCD } = this.props.auth;
        Utils.openWeb(this, appConfig.linkWeb + "/vi/gui-phan-anh?SDT=" + (userCD?.PhoneNumber || userCD?.Username),
            { title: "Gửi phản ánh Zalo" });
    };

    // RENDER MÀN HÌNH
    render() {
        var { dataHuongDan, isThoiTietFull, isConnect } = this.state
        const { theme, auth } = this.props
        var link = theme.imgBgrHome;
        Utils.nlog('menu props', theme)
        //----FIX CLEAR TOKEN cu neu Clear Redux khi update app
        let tempTokenCD = Utils.getGlobal(nGlobalKeys.loginToken, '');
        if (this.props.auth.tokenCD != tempTokenCD && !this.props.auth.tokenCD) {
            Utils.nsetStore(nkey.loginToken, '');
            Utils.setGlobal(nGlobalKeys.loginToken, '')
        }
        //---------------
        let marginHorMenu = Platform.isPad ? 60 : 0;

        let widthSlidebanner = nwidth() - 10;
        let tyleHeight = 0.365740740740741;

        if (isLandscape()) {
            marginHorMenu = marginHorMenu = 40;
            widthSlidebanner = widthSlidebanner / 2 - 5;
            tyleHeight = 0.6;
        }

        const _renderItem = ({ item, index }) => {
            return <TouchableOpacity style={{ width: widthSlidebanner }}
                activeOpacity={0.9}
                onPress={() => this.onBannerClick(item, index)}
            >
                <ImageCus source={{ uri: appConfig.domain + item.Path }} resizeMode='cover' style={{ width: '100%', height: '100%', borderRadius: 3 }} />
            </TouchableOpacity>
        }

        return (
            <ImageBackground
                style={[nstyles.ncontainer, { backgroundColor: colors.nocolor, }]}
                source={{ uri: link }}
            >
                <NavigationEvents
                    onDidFocus={() => this.onFocus()}
                />
                {/* {CONTAINER AVATAR, SEARCH} */}
                <LinearGradient
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    colors={theme.imgHeaderMenu || theme.backGroundFull ? [colors.nocolor, colors.nocolor] : theme.colorLinear.color}
                    style={{ paddingHorizontal: 15, justifyContent: 'center', paddingTop: Platform.OS == 'android' ? paddingTopMul() + heightStatusBar() : paddingTopMul() }}>
                    <View style={{ flexDirection: 'row' }}>
                        {
                            isThoiTietFull ? null :
                                <>
                                    <View style={[nstyles.nAva40, { backgroundColor: colors.brownGreyThree }]}>
                                        {
                                            this.props.auth?.tokenCD || this.props.auth?.tokenDH ? <Avatar nthis={this} check={true} styImage={nstyles.nAva40} textstyle={{ fontSize: sizes.reSize(16) }} /> :
                                                <TouchableOpacity onPress={() => Utils.goscreen(this, 'tab_Person')}>
                                                    <Image source={Images.icUser} resizeMode={'contain'} style={nstyles.nAva40} />
                                                </TouchableOpacity>
                                        }
                                    </View>
                                    <TouchableOpacity
                                        // onPress={() => Utils.goscreen(this, "TimKiemChung")} // Tìm kiếm các chức năng có trong menu theo tài khoản
                                        onPress={() => Utils.goscreen(this, 'Modal_SearchPA')} // Tìm kiếm phản ánh
                                        activeOpacity={0.5}
                                        style={{ flex: 1, backgroundColor: colors.white, padding: 5, marginLeft: 5, borderRadius: 5, minWidth: 28 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                            <Image source={Images.icSearch} style={[nstyles.nIcon17]} />
                                            {/* Code demo component TextCus */}
                                            <TextCus numberOfLines={1} style={{ color: colors.brownGreyThree, paddingLeft: 5, flex: 1 }}>Tìm kiếm...</TextCus>
                                        </View>
                                    </TouchableOpacity>
                                </>
                        }
                        {/* Render Thời tiết */}
                        {
                            this.state.dataThoiTiet.length == 0 ? null :
                                <TouchableOpacity style={[{ flexDirection: 'row', backgroundColor: colors.black_40, paddingHorizontal: 5, borderRadius: 8, marginLeft: 5 },
                                isThoiTietFull ? { justifyContent: 'space-around', flex: 1 } : {}]}
                                    activeOpacity={0.8}
                                    onPress={this.onThoiTietFull}>
                                    {this.state.dataThoiTiet.map((item, index) => this._renderTT(item, index))}
                                </TouchableOpacity>
                        }
                    </View>
                </LinearGradient>
                <View style={{ flex: 1, flexDirection: isLandscape() ? "row" : "column", paddingTop: 10 }}>
                    <View style={{ width: isLandscape() ? "50%" : "100%" }}>
                        {/* {CONTAINER BANNER} */}
                        {
                            this.TinTucHome == 'true' ?
                                <Slogan navigation={this.props.navigation} />
                                :
                                theme.transparentMenuCongAn ?
                                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                        <Image source={Images.iconApp} resizeMode='contain' style={{ width: '100%', height: Height(19) }} />
                                    </View> : (this.state.banner && this.state.banner.length != 0) ? <LinearGradient
                                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                        colors={theme.imgHeaderMenu || theme.backGroundFull ? [colors.nocolor, colors.nocolor] : theme.colorLinear.color}
                                        style={{ height: widthSlidebanner * tyleHeight, paddingHorizontal: 5, paddingBottom: 10, backgroundColor: colors.nocolor }}>
                                        <Carousel {...this.props} data={this.state.banner}
                                            autoPlay={true}
                                            autotime={8} //đơn vị giây
                                            showPagination={true}
                                            renderItem={_renderItem}
                                            widthBanner={widthSlidebanner}
                                        />
                                    </LinearGradient> : null


                        }
                    </View>
                    {/* {BODY HOME} */}
                    {isConnect && <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: null }}>
                        <LottieView autoPlay source={Images.icNotWifi} style={{ height: 50, width: 50 }} />
                        <Text style={{ fontSize: reText(15), textAlign: 'center', color: colors.redStar }} >{'Không có kết nối'}</Text>
                    </View>}
                    {theme.backGroundFull ?
                        <ScrollView
                            style={[isLandscape() ? { marginRight: 10 } : {}, theme.imgHeaderMenu ? { borderTopLeftRadius: 20, borderTopRightRadius: 20 } : {}]}
                            contentContainerStyle={{ paddingBottom: Platform.OS == 'android' ? 75 : 80 }}
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={{ paddingBottom: 30, flex: 1 }}>
                                <View style={{ backgroundColor: colors.nocolor, borderRadius: 5 }}>
                                    <FlatList
                                        ListHeaderComponent={auth.listObjectRuleCD && auth.listObjectRuleCD.length > 0 ?
                                            this.renderHeaderMenu() : null}
                                        showsVerticalScrollIndicator={false}
                                        extraData={this.props.theme}
                                        style={{ marginHorizontal: marginHorMenu, }}
                                        numColumns={4}
                                        data={auth.listObjectRuleCD}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({ item, index }) => this._renderMenu(item, index, true)}
                                    />
                                </View>
                                <View style={{ backgroundColor: colors.nocolor, borderRadius: 5 }}>
                                    <FlatList
                                        ListHeaderComponent={auth.listObjectRuleDichBenh && auth.listObjectRuleDichBenh.length > 0 ?
                                            this.renderHeaderMenu('Phòng chống dịch bệnh') : null}
                                        showsVerticalScrollIndicator={false}
                                        extraData={this.props.theme}
                                        style={{ marginHorizontal: marginHorMenu, }}
                                        numColumns={4}
                                        data={auth.listObjectRuleDichBenh}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({ item, index }) => this._renderMenu(item, index, true)}
                                    />
                                </View>
                                <View style={{ backgroundColor: colors.nocolor, borderRadius: 5, flexDirection: 'row', flexWrap: 'wrap' }}>
                                    <FlatList
                                        ListHeaderComponent={auth.listMenuShowDH && auth.listMenuShowDH.length > 0 ?
                                            this.renderHeaderMenu('Cán bộ') : null}
                                        showsVerticalScrollIndicator={false}
                                        extraData={this.props.theme}
                                        style={{ marginHorizontal: marginHorMenu, }}
                                        numColumns={4}
                                        data={auth.listMenuShowDH}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({ item, index }) => this._renderMenu(item, index)}
                                    />
                                </View>
                            </View>
                        </ScrollView> :
                        <ImageBackground
                            source={theme.backGroundOnline && theme.imgHeaderMenu == false ? { uri: link } : theme.background && theme.imgHeaderMenu == false ? { uri: `data:image/png;base64,${theme.background}` } : theme.imgHeaderMenu == false ? Images.imgSmartCity : null}
                            resizeMode='cover'
                            style={[nstyles.ncontainer, theme.imgHeaderMenu ? { borderTopLeftRadius: 20, borderTopRightRadius: 20 } : '',
                            theme.transparentMenuCongAn ? { backgroundColor: colors.nocolor } : '',
                            isLandscape() ? { marginRight: 10 } : {}]}
                        >
                            {
                                theme.blur > 0 ?
                                    <BlurView
                                        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, }}
                                        blurType="light"
                                        blurAmount={theme.blur}
                                        reducedTransparencyFallbackColor="white"
                                    />
                                    : null
                            }
                            <ScrollView
                                style={[{}, theme.imgHeaderMenu ? { borderTopLeftRadius: 20, borderTopRightRadius: 20 } : {}]}
                                contentContainerStyle={{ paddingBottom: Platform.OS == 'android' ? 75 : 80 }}
                                showsVerticalScrollIndicator={false}
                            >
                                <View style={{ paddingBottom: 30, flex: 1, }}>
                                    <View style={{ backgroundColor: colors.nocolor, borderRadius: 5 }}>
                                        <FlatList
                                            ListHeaderComponent={auth.listObjectRuleCD && auth.listObjectRuleCD.length > 0 ?
                                                this.renderHeaderMenu() : null}
                                            showsVerticalScrollIndicator={false}
                                            extraData={this.props.theme}
                                            style={{ marginHorizontal: marginHorMenu, }}
                                            numColumns={4}
                                            data={auth.listObjectRuleCD}
                                            keyExtractor={(item, index) => index.toString()}
                                            renderItem={({ item, index }) => this._renderMenu(item, index, true)}
                                        />
                                    </View>
                                    <View style={{ backgroundColor: colors.nocolor, borderRadius: 5 }}>
                                        <FlatList
                                            ListHeaderComponent={auth.listObjectRuleDichBenh && auth.listObjectRuleDichBenh.length > 0 ?
                                                this.renderHeaderMenu('Phòng chống dịch bệnh') : null}
                                            showsVerticalScrollIndicator={false}
                                            extraData={this.props.theme}
                                            style={{ marginHorizontal: marginHorMenu, }}
                                            numColumns={4}
                                            data={auth.listObjectRuleDichBenh}
                                            keyExtractor={(item, index) => index.toString()}
                                            renderItem={({ item, index }) => this._renderMenu(item, index, true)}
                                        />
                                    </View>
                                    <View style={{ backgroundColor: colors.nocolor, borderRadius: 5, flexDirection: 'row', flexWrap: 'wrap' }}>
                                        <FlatList
                                            ListHeaderComponent={auth.listMenuShowDH && auth.listMenuShowDH.length > 0 ?
                                                this.renderHeaderMenu('Cán bộ') : null}
                                            showsVerticalScrollIndicator={false}
                                            extraData={this.props.theme}
                                            style={{ marginHorizontal: marginHorMenu, }}
                                            numColumns={4}
                                            data={auth.listMenuShowDH}
                                            keyExtractor={(item, index) => index.toString()}
                                            renderItem={({ item, index }) => this._renderMenu(item, index)}
                                        />
                                    </View>
                                </View>
                                {
                                    !__DEV__ ? null : //Ko cần khoá code, build Release tự ẩn.
                                        <>
                                            <Text>Code Test - KO CẦN KHOÁ CODE</Text>
                                            <View style={{ flexDirection: 'row' }}>
                                                <TouchableOpacity
                                                    style={{ paddingHorizontal: 5, backgroundColor: colors.grayLight, marginHorizontal: 5 }}  //Code Test Chat Mocha
                                                    onPress={() => Utils.goscreen(this, 'Modal_Camera', { isMode: 1, })}>
                                                    <Image source={Images.icCamera} style={nstyles.nIcon40} />
                                                    <Text>{'Camera AI'}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </>

                                }
                            </ScrollView>
                        </ImageBackground>}
                </View>
                { //Chức năng Bổ sung RIÊNG để nghiệm thu. Khác với chức năng CALLBOT của các tỉnh khác. Nếu merger Đụng thì accept lấy Cả 2
                    !Utils.getGlobal(nGlobalKeys.ChucNangNghiemThu, {}).sendPAZalo ? null :
                        <TouchableOpacity onPress={this.onMenuCallBot} style={{
                            position: 'absolute', bottom: Height(10), right: 10, justifyContent: 'center',
                            alignItems: 'center', borderRadius: 50, padding: 10
                        }}>
                            <Image source={Images.icPAZalo} style={[nstyles.nIcon50]} />
                        </TouchableOpacity>
                }
                <IsLoading />
            </ImageBackground>
        );
    }
}


const mapStateToProps = state => ({
    auth: state.auth,
    theme: state.theme,

});
export default Utils.connectRedux(HomeDrawer, mapStateToProps, true);

const styler = StyleSheet.create({
    txtH2: {
        color: colors.white,
        fontWeight: '400'
    },
    txtH1: {
        fontSize: sizes.reSize(18),
        color: colors.black,
        fontWeight: 'bold'
    }
})