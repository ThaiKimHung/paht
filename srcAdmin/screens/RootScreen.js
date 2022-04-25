// -- ROOT APP ---
// File quan trọng, thay thế App.js. Khỏi tạo notifi, đa ngôn ngữ.
// Bắt buộc dữ lại. Có thể làm Flash Screen nếu ko dùng màn hình này gì

import React, { Component } from 'react';
import {
    StatusBar, Platform, ActivityIndicator, Image, Linking, Animated, Alert
} from 'react-native';
import OneSignal from 'react-native-onesignal';
import Utils from '../../app/Utils';
import { nkey } from '../../app/keys/keyStore'
import { appConfig, appConfigCus } from '../../app/Config';
import { colors } from '../../styles/color';
import { changeLangue } from '../../app/data/locales';
import LinearGradient from 'react-native-linear-gradient';
import { Images } from '../images';
import { nGlobalKeys } from '../../app/keys/globalKey';
import apis from '../apis';
import { ROOTGlobal } from '../../app/data/dataGlobal';
import { store } from '../../srcRedux/store'
import { ChangeCurentGroup, ApiGetInfoChat } from '../../srcRedux/actions';
import AppCodeConfig from '../../app/AppCodeConfig';
import { NameConfig } from '../../srcRedux/reducers/Common';
import * as Progress from 'react-native-progress';
import { Width } from '../../styles/styles';
import { GetSetMaScreen } from '../../srcRedux/actions/auth/Auth';

// --Màn hình Welcome
class RootScreen extends Component {
    constructor(props) {
        super(props);
        this.IdDomainSelect = Utils.ngetParam(this, 'IdDomainSelect', '');
        this.callback = Utils.ngetParam(this, 'callback', '');
        this.animatedLogo = new Animated.Value(0)
        this.isGoHome = false;
        this.state = {
            background: ''
            //----
        };
        ROOTGlobal.dataGlobal._GoDeepLink = (deeplink = '') => {
            this._GoDeepLink(deeplink);
        }
    }

    _AnimatedLogo = () => {
        this.animatedLogo.setValue(0)
        Animated.loop(
            Animated.sequence([
                Animated.timing(this.animatedLogo,
                    {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: false
                    }),
            ]),
            { iterations: 200 }).start();
    }

    setConfig = (dataConfig) => {
        if (dataConfig.domain)
            appConfig.domain = dataConfig.domain;
        if (dataConfig.onesignalID)
            appConfig.onesignalID = dataConfig.onesignalID;
        if (dataConfig.linkWeb)
            appConfig.linkWeb = dataConfig.linkWeb;
        if (dataConfig.defaultRegion)
            appConfig.defaultRegion = { ...appConfig.defaultRegion, ...dataConfig.defaultRegion };
        if (dataConfig.IdSource)
            appConfig.IdSource = dataConfig.IdSource;
    }

    async componentDidMount() {
        //--Chú ý: KHÔNG ĐƯỢC THÊM CODE TRƯỚC KHUNG appConfig này --(DO CHẠY CHUNG SOURCE CÔNG DÂN NÊN KO CẦN KHÚC NÀY, CHẠY RIÊNG SẼ MỞ RA)
        //----Set config: Chỉnh trong Login, RootSceen  
        // let live_test = await Utils.ngetStore('appConfigCus', appConfigCus['live'].mode, AppCodeConfig.APP_ADMIN);
        // let tempConfig = appConfigCus[live_test];
        // appConfig.mode = tempConfig.mode;
        // this.setConfig(tempConfig);
        //------KHÔNG ĐƯỢC THÊM CODE Ở ĐÂY(ĐỌC CMT Ở DƯỚI)------
        //-----------CODE AUTO BAT OPTION CHON DOMAIN-----------
        try {
            this.timeOutEnd = setTimeout(() => {
                if (this.isGoHome)
                    return;
                Alert.alert("Cảnh báo", "Tốc độ mạng không ổn định hoặc đã sự cố xảy ra có thể ảnh hưởng đến trải nghiệm của bạn!.\nVui lòng khởi động lại ứng dụng")
            }, 12000);
            await this._CheckToken(); //Chỉ được thêm code trong hàm loadDidMount
        } catch (error) {
            Utils.setGlobal("ERROR_LOG:", error.toString());
            this.onGoScreenHome();
            apiLogEx("JS_RootScreen", "Lỗi load RootScreen", error.toString())
            Alert.alert('Có sự cố khi load dữ liệu')
        }
        let tempDomain = appConfig.domain;
        // let resconfig = await apis.ApiApp.getAppCongig();

        //---CODE MỚI CHỌN SUB-DOMAIN THEO CONFIG--- (DO CHẠY CHUNG SOURCE CÔNG DÂN NÊN KO CẦN KHÚC NÀY, CHẠY RIÊNG SẼ MỞ RA)
        // let { dataSubDomain = '' } = resconfig;
        // //await get congig xem có lấy domain từ api hay k
        // if (dataSubDomain != '' && dataSubDomain) { //XỬ LÝ chọn sub-domain 
        //     let DS_Sub_Domain = JSON.parse(dataSubDomain);
        //     let isStarted = await Utils.ngetStore(nkey.idDomain, -1, AppCodeConfig.APP_ADMIN);//isStarted != -1 là đã chọn 1 sub-domain.
        //     //Nếu DS có 1 item thì mặc định chọn item đó.
        //     let itemConfig = DS_Sub_Domain.length == 1 ? DS_Sub_Domain[0] : DS_Sub_Domain.find((item) => item.IDQuan == isStarted);
        //     if (itemConfig) {
        //         Utils.nlog("vao set cnfig", itemConfig)
        //         await Utils.ngetStore(nkey.idDomain, itemConfig.IDQuan, AppCodeConfig.APP_ADMIN);
        //         Utils.setGlobal(nGlobalKeys.QuanSelected, itemConfig, AppCodeConfig.APP_ADMIN);
        //         itemConfig.domain = appConfig.domain.replace("all", isStarted);
        //         this.setConfig(itemConfig)
        //         // gán lại data domain từ fonfig
        //     } else {
        //         //chạy vô trang starter đẻ chọn domain
        //         Utils.goscreen(this, "Modal_StartedScreen", { data: DS_Sub_Domain, IdDomainSelect: this.IdDomainSelect });
        //         return;
        //     }
        //      // LẤY LẠI CONFIG RIÊNG NẾU CÓ SUB-DOMAIN
        //      if (tempDomain != appConfig.domain) { 
        //         resconfig = await apis.ApiApp.getAppCongig();
        //     }
        // }
        //----------------------------------------------------------
        //++++++++++++++VUI LÒNG THÊM CODE TỪ ĐÂY++++++++++++++
        //+++++++++++++++++++--VVVVVVVV--++++++++++++++++++++++
        //+++++++++++++++++++--VVVVVVVV--++++++++++++++++++++++
        //+++++++++++++++++++--VVVVVVVV--++++++++++++++++++++++
        //+++++++++++++++++++--VVVVVVVV--++++++++++++++++++++++

        // if (!(resconfig < 0) && resconfig) //-Lưu lại config gần nhất, Nếu API lỗi sẽ lấy config gần nhất
        //     Utils.nsetStore(nkey.resconfig, resconfig, AppCodeConfig.APP_ADMIN);
        // else {
        //     resconfig = await Utils.ngetStore(nkey.resconfig, {}, AppCodeConfig.APP_ADMIN);
        // }
        // Utils.nlog("Res Config:", resconfig);


        //--- ưu tiên check Onsignal
        OneSignal.init(appConfig.onesignalID);
        OneSignal.inFocusDisplaying(0);
        OneSignal.addEventListener('ids', this.onIds);
        ///----end

        this._AnimatedLogo()
        this.props.ChangeCurentGroup(-1);
        //setup
        // await Utils.nsetStore(nkey.idDomain, '');

        // this.props.SetConfig_App({ key: NameConfig.DIEUHANH, value: resconfig })

        // let { LogoAppAdmin = undefined, TenTinh = appConfig.TenTinh, showGhiChu = '1', MangMau = '', MangMauXPHC = '', isChart = false,
        //     RootThaiNguyen = undefined, //-Lấy chung config từ công dân. Có thể dùng biến riêng or chung thì thêm vào DB
        //     TuongTacCoDuyet = '0', // 0 Source chưa có trạng thái Duyệt - 1 Source là đã có trạng thái Duyệt
        //     ChonDonVi_TKDV = 'false',//Bật filter chọn đơn vị ở thống kê đơn vị - task này hiện đang làm cho DakLak
        //     filterTKBC = 'false',//Chổ "Thông kê báo cáo" false: k truyền, true: truyền thêm filter "ChuyenMucQL" ,chỉ có riêng Vinh filter truyền thêm (Vinh-true),
        //     isTiepNhanDonGian = 'false' // Mặc định false là tiêp nhận đầy đủ thông tin - KonTum : true => Tiep nhận thiếu thông tin ...
        // } = resconfig;
        // Utils.setGlobal(nGlobalKeys.MangMauXPHC, MangMauXPHC ? JSON.parse(MangMauXPHC) : '', AppCodeConfig.APP_ADMIN)
        // Utils.setGlobal(nGlobalKeys.MangMau, MangMau ? JSON.parse(MangMau) : '', AppCodeConfig.APP_ADMIN);
        // Utils.setGlobal(nGlobalKeys.LogoAppAdmin, !LogoAppAdmin ? LogoAppAdmin : appConfig.domain + LogoAppAdmin, AppCodeConfig.APP_ADMIN);
        // Utils.setGlobal(nGlobalKeys.TenTinh, TenTinh, AppCodeConfig.APP_ADMIN);
        // Utils.setGlobal(nGlobalKeys.showGhiChu, showGhiChu, AppCodeConfig.APP_ADMIN);
        // Utils.setGlobal(nGlobalKeys.isChart, isChart, AppCodeConfig.APP_ADMIN);//false là như cũ, true là dashboard mới (Mới là được click vào cột xem chi tiết ds)
        // Utils.setGlobal(nGlobalKeys.TuongTacCoDuyet, parseInt(TuongTacCoDuyet) == 1, AppCodeConfig.APP_ADMIN);
        // Utils.setGlobal(nGlobalKeys.ChonDonVi_TKDV, ChonDonVi_TKDV, AppCodeConfig.APP_ADMIN);
        // Utils.setGlobal(nGlobalKeys.filterTKBC, filterTKBC, AppCodeConfig.APP_ADMIN);
        // Utils.setGlobal(nGlobalKeys.isTiepNhanDonGian, isTiepNhanDonGian == 'true', AppCodeConfig.APP_ADMIN);

        // //-RootThaiNguyen: Lấy chung config từ công dân. Có thể dùng biến riêng or chung thì thêm vào DB
        // Utils.setGlobal(nGlobalKeys.RootThaiNguyen,
        //     (RootThaiNguyen == undefined ? Utils.getGlobal(nGlobalKeys.RootThaiNguyen, appConfig.rootIOC) :
        //         (parseInt(RootThaiNguyen) == 0 ? '' : appConfig.rootIOC)), AppCodeConfig.APP_ADMIN);

        //-------------------end
        this.setStatusBar(false);
        this.onLoadFirst();
        // await this._CheckToken();

    };

    componentWillUnmount() {
        ROOTGlobal.dataGlobal._GoDeepLink = null;
        if (this.timeOutEnd) {
            try {
                clearTimeout(this.timeOutEnd);
            } catch (error) {
            }
        }
    }
    onGoScreenHome = () => {
        try {
            if (this.isGoHome)
                return;
            Utils.goscreen(this, 'sw_HomePage');
            this.isGoHome = true;
        } catch (error) {
            Utils.setGlobal("ERROR_LOG:", error.toString());
            Alert.alert('Cảnh báo', 'Đã sự cố xảy ra. Vui lòng khởi động lại ứng dụng')
        }

    }

    onLoadFirst = async () => {
        //--Set up config langue toàn app tại đây------
        let tlang = await Utils.ngetStore(nkey.lang, appConfig.defaultLang, AppCodeConfig.APP_ADMIN);
        changeLangue(tlang.code);
        //Config su dung cai dat phan phoi cua Angiang
        let res = await apis.ApiApp.GetConfigByCode()
        // Utils.nlog('Config quy trinh an giang-------------', res)
        // PHANPHOI_NHIEU_DONVI_XULY
        if (res.status == 1 && res.data) {
            Utils.setGlobal(nGlobalKeys.isUsePhanPhoi, res.data.IsUse, AppCodeConfig.APP_ADMIN)
        } else {
            Utils.setGlobal(nGlobalKeys.isUsePhanPhoi, false, AppCodeConfig.APP_ADMIN)
        }
        //------------End set up langue------------
        // this.setStatusBar(true);
    }

    onIds = async (device) => {
        //------
        Utils.nlog('Init Notification: ', device);
        Utils.setGlobal(nGlobalKeys.pushToken_OneSignal, device.pushToken, AppCodeConfig.APP_ADMIN);
        Utils.setGlobal(nGlobalKeys.userId_OneSignal, device.userId, AppCodeConfig.APP_ADMIN);
        await Utils.nsetStore(nkey.pushToken_OneSignal, device.pushToken, AppCodeConfig.APP_ADMIN);
        await Utils.nsetStore(nkey.userId_OneSignal, device.userId, AppCodeConfig.APP_ADMIN);
        this.props.DangKyOneSignal(false);

    }
    // ẩn thanh status bar khi Loadding
    setStatusBar = (val = true) => {
        StatusBar.setHidden(false);
    };
    // -- NOTIFI BEGIN --
    _CheckToken = async () => {
        // const token = await Utils.ngetStore(nkey.loginToken, '', AppCodeConfig.APP_ADMIN);
        const { tokenDH } = await store.getState().auth;
        Utils.nlog("========>>>>>>>>>>>>>ADmin", tokenDH)
        const res = await apis.ApiUser.CheckSession(tokenDH);
        let resconfig = await apis.ApiApp.getAppCongig();
        Utils.nlog("gia tri get config--------->>>>>>>>>", resconfig)
        if (!(resconfig < 0) && resconfig) //-Lưu lại config gần nhất, Nếu API lỗi sẽ lấy config gần nhất
            Utils.nsetStore(nkey.resconfig, resconfig, AppCodeConfig.APP_ADMIN);
        else {
            resconfig = await Utils.ngetStore(nkey.resconfig, {}, AppCodeConfig.APP_ADMIN);
        }

        this.props.SetConfig_App({ key: NameConfig.DIEUHANH, value: resconfig })
        let { timeMaps = '180000', trackingPoint = '20', TenTinh = appConfig.TenTinh, NoiBo = "false",
            TieuDeApp = appConfig.TieuDeApp, LogoAppAdmin = undefined, IsTinhTrangXL = "false",
            Chat = '0',
            apiKeyGoogle = appConfig.apiKeyGoogle,
            HDSD = '', // link download hdsd
            EnablePublicFile = 'false',// bật tắt render giao diện tick chọn file không công khai lúc đăng tải
            //Key: 'ALL', 'Android | IOS'
            showGhiChu = '1', MangMau = '', MangMauXPHC = '', isChart = false,
            RootThaiNguyen = undefined, //-Lấy chung config từ công dân. Có thể dùng biến riêng or chung thì thêm vào DB
            TuongTacCoDuyet = '0', // 0 Source chưa có trạng thái Duyệt - 1 Source là đã có trạng thái Duyệt
            ChonDonVi_TKDV = 'false',//Bật filter chọn đơn vị ở thống kê đơn vị - task này hiện đang làm cho DakLak
            filterTKBC = 'false',//Chổ "Thông kê báo cáo" false: k truyền, true: truyền thêm filter "ChuyenMucQL" ,chỉ có riêng Vinh filter truyền thêm (Vinh-true),
            isTiepNhanDonGian = 'false' // Mặc định false là tiêp nhận đầy đủ thông tin - KonTum : true => Tiep nhận thiếu thông tin ...
        } = resconfig;

        Utils.setGlobal(nGlobalKeys.MangMauXPHC, MangMauXPHC ? JSON.parse(MangMauXPHC) : '', AppCodeConfig.APP_ADMIN)
        Utils.setGlobal(nGlobalKeys.MangMau, MangMau ? JSON.parse(MangMau) : '', AppCodeConfig.APP_ADMIN);
        Utils.setGlobal(nGlobalKeys.LogoAppAdmin, !LogoAppAdmin ? LogoAppAdmin : appConfig.domain + LogoAppAdmin, AppCodeConfig.APP_ADMIN);
        Utils.setGlobal(nGlobalKeys.TenTinh, TenTinh, AppCodeConfig.APP_ADMIN);
        Utils.setGlobal(nGlobalKeys.showGhiChu, showGhiChu, AppCodeConfig.APP_ADMIN);
        Utils.setGlobal(nGlobalKeys.isChart, isChart, AppCodeConfig.APP_ADMIN);//false là như cũ, true là dashboard mới (Mới là được click vào cột xem chi tiết ds)
        Utils.setGlobal(nGlobalKeys.TuongTacCoDuyet, parseInt(TuongTacCoDuyet) == 1, AppCodeConfig.APP_ADMIN);
        Utils.setGlobal(nGlobalKeys.ChonDonVi_TKDV, ChonDonVi_TKDV, AppCodeConfig.APP_ADMIN);
        Utils.setGlobal(nGlobalKeys.filterTKBC, filterTKBC, AppCodeConfig.APP_ADMIN);
        Utils.setGlobal(nGlobalKeys.isTiepNhanDonGian, isTiepNhanDonGian == 'true', AppCodeConfig.APP_ADMIN);

        //-RootThaiNguyen: Lấy chung config từ công dân. Có thể dùng biến riêng or chung thì thêm vào DB
        Utils.setGlobal(nGlobalKeys.RootThaiNguyen,
            (RootThaiNguyen == undefined ? Utils.getGlobal(nGlobalKeys.RootThaiNguyen, appConfig.rootIOC) :
                (parseInt(RootThaiNguyen) == 0 ? '' : appConfig.rootIOC)), AppCodeConfig.APP_ADMIN);
        Utils.setGlobal(nGlobalKeys.urlHDSD, HDSD, AppCodeConfig.APP_ADMIN)
        Utils.setGlobal(nGlobalKeys.EnablePublicFile, EnablePublicFile == 'true', AppCodeConfig.APP_ADMIN)
        //--SET API KEY GG--
        if (!apiKeyGoogle)
            apiKeyGoogle = '';
        let API_KEY = apiKeyGoogle.split(' | ');
        if (API_KEY.length == 2) {
            API_KEY = Platform.OS == 'ios' ? API_KEY[1] : API_KEY[0];
        } else
            API_KEY = API_KEY[0];
        appConfig.apiKeyGoogle = API_KEY;
        //----
        Utils.setGlobal(nGlobalKeys.timeMaps, parseInt(timeMaps), AppCodeConfig.APP_ADMIN)
        Utils.setGlobal(nGlobalKeys.Chat, Chat, AppCodeConfig.APP_ADMIN)
        Utils.setGlobal(nGlobalKeys.isDangKy, resconfig.isDangKy == "false" ? false : true, AppCodeConfig.APP_ADMIN);
        Utils.setGlobal(nGlobalKeys.TenTinh, TenTinh, AppCodeConfig.APP_ADMIN);
        Utils.setGlobal(nGlobalKeys.trackingPoint, parseInt(trackingPoint), AppCodeConfig.APP_ADMIN);
        Utils.setGlobal(nGlobalKeys.NoiBo, NoiBo, AppCodeConfig.APP_ADMIN);
        Utils.setGlobal(nGlobalKeys.IsTinhTrangXL, IsTinhTrangXL, AppCodeConfig.APP_ADMIN);
        //-----
        appConfig.TieuDeApp = TieuDeApp;
        Utils.setGlobal(nGlobalKeys.LogoAppAdmin, !LogoAppAdmin ? LogoAppAdmin : appConfig.domain + LogoAppAdmin, AppCodeConfig.APP_ADMIN);
        await this._LoadDuLieu();

        if (res.data && res.status == 1 && res.data.kq == true) {

            this.isCheckAuthOK = true;
            var { Roles = [] } = res.data
            if (Roles) {
                Utils.setGlobal(nGlobalKeys.rules, Roles, AppCodeConfig.APP_ADMIN)
                this.props.loadMenuApp({
                    listRuleDH: Roles
                })
            }

            if (this.callback) {
                Utils.nlog("this props", this.callback);
                // this.callback();
                Linking.openURL(this.callback)
                this.props.SetShowModalNoti(true);
            } else {
                const isDashboard = Roles.find(item => item == 194)
                if (isDashboard) {
                    setTimeout(() => {
                        Utils.goscreen(this, 'Dashboard_ThongKe');
                        //Hien thi show modal noti
                        this.props.SetShowModalNoti(true);
                    }, 100);
                } else {
                    setTimeout(() => {
                        Utils.goscreen(this, 'sw_Main');
                        //Hien thi show modal noti
                        this.props.SetShowModalNoti(true);
                    }, 100);
                }
            }
        } else {

            await GetSetMaScreen(false, appConfig.manHinhADmin, false);
            // await this.props.LogoutApp(AppCodeConfig.APP_ADMIN)
            this.props.logoutAppCheckInterNet(false);
            this.props.DangKyOneSignal(false, true);
            setTimeout(() => {
                Utils.goscreen(this, 'sw_Login');
            }, 100);
        }

        //--data check version
        ROOTGlobal['resconfig'] = resconfig;
        //--
    }

    _GoDeepLink = (deeplink) => {
        if (deeplink) {
            Linking.openURL(deeplink)
        }
    }

    _LoadDuLieu = async () => {
        const { tokenDH } = await store.getState().auth;

        // var loginTokenDH = await Utils.ngetStore(nkey.loginToken, '', AppCodeConfig.APP_ADMIN)
        var Id_user = await Utils.ngetStore(nkey.Id_user, '', AppCodeConfig.APP_ADMIN)
        var rememberPassword = await Utils.ngetStore(nkey.rememberPassword, '', AppCodeConfig.APP_ADMIN)
        var Username = await Utils.ngetStore(nkey.Username, '', AppCodeConfig.APP_ADMIN)
        var Password = await Utils.ngetStore(nkey.Password, '', AppCodeConfig.APP_ADMIN)
        var rules = await Utils.ngetStore(nkey.rules, [], AppCodeConfig.APP_ADMIN)
        Utils.setGlobal(nGlobalKeys.rules, rules, AppCodeConfig.APP_ADMIN)
        Utils.setGlobal(nGlobalKeys.Username, Username, AppCodeConfig.APP_ADMIN);
        Utils.setGlobal(nGlobalKeys.Password, Password, AppCodeConfig.APP_ADMIN);
        Utils.setGlobal(nGlobalKeys.loginToken, tokenDH, AppCodeConfig.APP_ADMIN)
        Utils.setGlobal(nGlobalKeys.Id_user, Id_user, AppCodeConfig.APP_ADMIN)
        Utils.setGlobal(nGlobalKeys.rememberPassword, rememberPassword, AppCodeConfig.APP_ADMIN)
        this._getGetList_NguonPhanAnh();
        this._GetList_MucDoAll();
        this._getListLinhVuc();
        this._getListChuyenMuc();
        this._getListDonVi();
        this._GetList_MucDoAll_NB();
        this._getListDonVi_NB();
        if (ROOTGlobal[nGlobalKeys.LoadInfoDH].GetInfo) {
            ROOTGlobal[nGlobalKeys.LoadInfoDH].GetInfo()
        }
    }

    //GET DATA MENU SETTING
    _getGetList_NguonPhanAnh = async () => {
        const res = await apis.NguonPhanAnh.GetList_NguonPhanAnh();
        if (Number.isInteger(res) && res < 0) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Lỗi mạng, vui lòng kiểm tra lại kết nối và thử lại', 'Xác nhận');
            return;
        };
        if (res.status == 1 && res.data) {
            this.props.GetList_NguonPhanAnh(res.data);
        }
        // Utils.nlog('GetList_NguonPhanAnh', res)
    }

    _GetList_MucDoAll = async () => {
        const res = await apis.Auto.GetList_MucDoAll();
        if (Number.isInteger(res) && res < 0) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Lỗi mạng, vui lòng kiểm tra lại kết nối và thử lại', 'Xác nhận');
            return;
        };
        if (res.status == 1 && res.data) {
            this.props.GetList_MucDoAll(res.data);
        }
        // Utils.nlog('GetList_MucDoAll', res)
    }

    _getListLinhVuc = async () => {
        const res = await apis.LinhVuc.GetList_LinhVuc();
        if (Number.isInteger(res) && res < 0) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Lỗi mạng, vui lòng kiểm tra lại kết nối và thử lại', 'Xác nhận');
            return;
        };
        if (res.status == 1 && res.data) {
            this.props.GetList_LinhVuc(res.data);
        }
        Utils.nlog('_getListLinhVuc', res)

    }
    _getListChuyenMuc = async () => {
        const res = await apis.ChuyenMuc.GetList_ChuyenMuc();
        if (Number.isInteger(res) && res < 0) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Lỗi mạng, vui lòng kiểm tra lại kết nối và thử lại', 'Xác nhận');
            return;
        };
        if (res.status == 1 && res.data) {
            this.props.GetList_ChuyenMuc(res.data);

        }
        // Utils.nlog('_getListChuyenMuc', res)

    }
    //GetList_DonVi
    _getListDonVi = async () => {
        // Utils.nlog("vao get list đơn vi")
        const res = await apis.ApiDonVi.GetList_DonViApp();
        // Utils.nlog("gia tri res dơn vi", res)
        if (Number.isInteger(res) && res < 0) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Lỗi mạng, vui lòng kiểm tra lại kết nối và thử lại');
            return;
        };
        if (res.status == 1 && res.data) {
            this.props.GetList_DonVi(res.data);
        }
        // Utils.nlog('_getListĐơn vi', res)
    }

    _GetList_MucDoAll_NB = async () => {
        const res = await apis.Autonoibo.GetList_MucDoAll()
        if (Number.isInteger(res) && res < 0) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Lỗi mạng, vui lòng kiểm tra lại kết nối và thử lại', 'Xác nhận');
            return;
        };
        if (res.status == 1 && res.data) {
            this.props.GetList_MucDoAll_NB(res.data);
        }
        // Utils.nlog('GetList_MucDoAll', res)
    }

    _getListDonVi_NB = async () => {
        // Utils.nlog("vao get list đơn vi")
        const res = await apis.Autonoibo.GetCapDonViAll();
        // Utils.nlog("gia tri res dơn vi", res)
        if (Number.isInteger(res) && res < 0) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Lỗi mạng, vui lòng kiểm tra lại kết nối và thử lại', 'Xác nhận');
            return;
        };
        if (res.status == 1 && res.data) {
            this.props.GetList_DonVi_NB(res.data);
        }
        // Utils.nlog('_getListĐơn vi', res)
    }

    render() {
        const scale = this.animatedLogo.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, -10, 0],
        })
        return (
            <LinearGradient
                start={{ x: 0, y: 1 }} end={{ x: 0, y: 0 }}
                colors={this.props.theme.colorLinear.color}
                style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Animated.Image
                    source={Images.iconApp} resizeMode='contain'
                    style={[{ width: 200, height: 200 }, { transform: [{ translateY: scale }] }]} />
                <Progress.Bar style={{ marginTop: 15 }} progress={0.3} width={Width(50)} indeterminate={true} color={'white'} />
            </LinearGradient>
        );
    }
}
const mapStateToProps = state => ({
    ReducerGroupChat: state.ReducerGroupChat,
    objectData: state.DataChat,
    auth: state.auth,
    theme: state.theme
});
export default Utils.connectRedux(RootScreen, mapStateToProps, true);