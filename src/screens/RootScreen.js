// -- ROOT APP ---
// File quan trọng, thay thế App.js. Khỏi tạo notifi, đa ngôn ngữ.
// Bắt buộc dữ lại. Có thể làm Flash Screen nếu ko dùng màn hình này gì

import React, { Component } from 'react';
import { StatusBar, Linking, Platform, AppState, Animated, Alert } from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper'
import Utils from '../../app/Utils';
import { nkey } from '../../app/keys/keyStore'
import { appConfig, appConfigCus } from '../../app/Config';
import { colors } from '../../styles/color';
import OneSignal from 'react-native-onesignal';
import { changeLangue } from '../../app/data/locales';
import LinearGradient from 'react-native-linear-gradient';
import { Images } from '../images';
import { nGlobalKeys } from '../../app/keys/globalKey';
import apis from '../apis';
import { def_objMenu, objectMenu, objectMenuGlobal, ROOTGlobal, dataNoiDungXuLyMau, menuDichBenh, menuThongTinCQ } from '../../app/data/dataGlobal';
import moment from 'moment';
import { NameConfig } from '../../srcRedux/reducers/Common';
import AppCodeConfig from '../../app/AppCodeConfig';
import apisAdmin from '../../srcAdmin/apis'
import * as Progress from 'react-native-progress';
import { Width } from '../../styles/styles';
import { store } from '../../srcRedux/store';
import { ChangeCurentGroup, ApiGetInfoChat, DangKyOneSignal } from '../../srcRedux/actions';
import ConnectSocket from '../../chat/RoomChat/Connecttion';
import { OnSignIn } from '../sourcequyhoach/Containers/Login';
import { nkeyCache } from '../../app/keys/nkeyCache';
import dataSocket from '../../chat/RoomChat/dataSocket';
import CodePush from 'react-native-code-push';
import { ConfigOnline } from '../../app/ConfigOnline';
import { apiLogEx } from '../../App';

// import Heartbeat from '../../Heartbeat';
// --Màn hình Welcome
class RootScreen extends Component {
    constructor(props) {
        super(props);
        this.IdDomainSelect = Utils.ngetParam(this, 'IdDomainSelect', '');
        this.animatedLogo = new Animated.Value(0)
        nthisRootScreen = this;
        this.isGoHome = false;
        this.state = {
            background: ''
        };
        // ROOTGlobal.dataGlobal._onTracking = nthisRootScreen._trackingLocation;
        // ROOTGlobal.dataGlobal.getCurrentPosition = nthisRootScreen.getCurrentPosition
    }

    async componentDidMount() {
        //--KHÔNG ĐƯỢC THÊM BẤT KÌ CODE trong hàm componentDidMount này.
        //--Bắt trường hợp lỗi RootScreen xoay hoài.
        try {
            this.timeOutEnd = setTimeout(() => {
                if (this.isGoHome)
                    return;
                Alert.alert("Cảnh báo", "Tốc độ mạng không ổn định có thể ảnh hưởng đến trải nghiệm của bạn.")
            }, 12000);
            await this.loadDidMount(); //Chỉ được thêm code trong hàm loadDidMount
        } catch (error) {
            Utils.setGlobal("ERROR_LOG:", error.toString());
            this.onGoScreenHome();
            apiLogEx("JS_RootScreen", "Lỗi load RootScreen", error.toString())
            Alert.alert('Có sự cố khi load dữ liệu')
        }
    }

    componentWillUnmount() {
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
        let tlang = await Utils.ngetStore(nkey.lang, appConfig.defaultLang);
        changeLangue(tlang.code);
        //------------End set up langue------------
        this.setStatusBar(false);
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

    loadDidMount = async () => {
        //--Chú ý: KHÔNG ĐƯỢC THÊM CODE TRƯỚC KHUNG appConfig này
        //----Set config: Chỉnh trong Login, RootSceen  
        let live_test = await Utils.ngetStore('appConfigCus', appConfigCus['live'].mode);
        let tempConfig = appConfigCus[live_test];
        appConfig.mode = tempConfig.mode;
        this.setConfig(tempConfig);
        //------KHÔNG ĐƯỢC THÊM CODE Ở ĐÂY(ĐỌC CMT Ở DƯỚI)------
        //-----------CODE AUTO BAT OPTION CHON DOMAIN-----------
        let tempDomain = appConfig.domain;
        let resconfig = await apis.ApiApp.getAppCongig(); // Theo id = 2 mặc đinh
        //--Lưu để dùng check version - Chỉ cần nâng build ở domain Gốc.
        Utils.setGlobal(nGlobalKeys.resconfig, resconfig);
        //---CODE MỚI CHỌN SUB-DOMAIN THEO CONFIG---
        let { dataSubDomain = '' } = resconfig;
        //await get congig xem có lấy domain từ api hay k
        if (dataSubDomain != '' && dataSubDomain) { //XỬ LÝ chọn sub-domain 
            let DS_Sub_Domain = JSON.parse(dataSubDomain);
            let isStarted = await Utils.ngetStore(nkey.idDomain, -1);//isStarted != -1 là đã chọn 1 sub-domain.
            Utils.nlog("Res_Config_SUB:", DS_Sub_Domain);
            //Nếu DS có 1 item thì mặc định chọn item đó.
            let itemConfig = DS_Sub_Domain.length == 1 ? DS_Sub_Domain[0] : DS_Sub_Domain.find((item) => item.IDQuan == isStarted);
            if (itemConfig) {
                await Utils.ngetStore(nkey.idDomain, itemConfig.IDQuan);
                Utils.setGlobal(nGlobalKeys.QuanSelected, itemConfig);
                itemConfig.domain = itemConfig.domainSub + "/"; //appConfig.domain.replace("all", isStarted);
                this.setConfig(itemConfig)
                // gán lại data domain từ fonfig
            } else {
                //chạy vô trang starter đẻ chọn domain
                Utils.goscreen(this, "Modal_StartedScreen", { data: DS_Sub_Domain, IdDomainSelect: this.IdDomainSelect });
                return;
            }
            // LẤY LẠI CONFIG RIÊNG NẾU CÓ SUB-DOMAIN
            if (tempDomain != appConfig.domain) {
                resconfig = await apis.ApiApp.getAppCongig();
            }
        }
        //----------------------------------------------------------
        //++++++++++++++VUI LÒNG THÊM CODE TỪ ĐÂY++++++++++++++
        //+++++++++++++++++++--VVVVVVVV--++++++++++++++++++++++
        //+++++++++++++++++++--VVVVVVVV--++++++++++++++++++++++
        //+++++++++++++++++++--VVVVVVVV--++++++++++++++++++++++
        //+++++++++++++++++++--VVVVVVVV--++++++++++++++++++++++

        if (!(resconfig < 0) && resconfig) //-Lưu lại config gần nhất, Nếu API lỗi sẽ lấy config gần nhất
            Utils.nsetStore(nkey.resconfig, resconfig);
        else {
            resconfig = await Utils.ngetStore(nkey.resconfig, {});
        }
        Utils.nlog("Res_Config_CD:", resconfig);

        //--FIX LỖI trường hợp loadding xoay hoài.
        setTimeout(() => {
            this.onGoScreenHome();
        }, 6500);

        //tạo connetc socket
        await dataSocket.CreateNewConect();
        ConnectSocket.initConnection();

        // -- NOTIFI BEGIN --
        // Utils.nlog("onsignalD========ID", appConfig.onesignalID)
        OneSignal.init(appConfig.onesignalID);
        OneSignal.inFocusDisplaying(0);
        OneSignal.addEventListener('received', this.onReceived);
        // OneSignal.addEventListener('opened', this.onOpened);
        OneSignal.addEventListener('ids', this.onIds);
        //---

        this._GetDomainIOC()
        this._GetAuThen()
        this._AnimatedLogo()
        //API dich vu cong phụ thuộc chung biến QR của app Tây Ninh
        this.getConfigTayNinh()


        //dang ký appState
        AppState.addEventListener("change", this._handleAppStateChange);
        //end

        //---GET ALL config 1 lần - Goi trước config APP, ko đổi vị trí code
        let resCodeConfigAll = await apis.ApiApp.GetListConfigByCodes('CONFIG,CODE,ALL,XULYPA_THEONHIEU_DV') // truyền vào code cách nhau dấu , là lấy all configcode
        this.hanlerGetConfigAll(resCodeConfigAll);
        Utils.nlog('[LOG] resCodeConfigAll', resCodeConfigAll)

        if (!resconfig) {
            resconfig = {};
        }
        let { timeTracking = '300000', timeMaps = '180000', SMS = 'true', isBlockTracking = 'true',
            textErrorPass = ConfigOnline.PASSWORD_CHECK_CD?.Description, regexPass = ConfigOnline.PASSWORD_CHECK_CD?.Value,
            LogoAppHome = '', TenAPP = 'PA-TG', TieuDe = appConfig.TieuDeApp,
            LinkIcons = '', SideMenu = '', TenHuyen = appConfig.TenTinh, TenAppHome = appConfig.TenAppHome,
            IdSource = appConfig.IdSource,
            colorBackgroundMenu = 'rgba(255,255,255,0.6)',
            listTitleMenu = 'Phản ánh tố giác|Thông tin từ chính quyền|Clip tuyên truyền|Thông báo|Hỗ trợ khẩn cấp|Cài đặt',
            colorTextMenu = colors.black,
            colorTextSelect = '',
            colorbackgroundSelect = '',
            colorLinearButton = '',//['green', 'yellow'],
            titleHoTro = '',
            XoaPA = '1',
            apiKeyGoogle = appConfig.apiKeyGoogle, //Key: 'ALL', 'Android | IOS'
            objMenu = JSON.stringify(objectMenuGlobal),
            //Biến ĐK | Biến Edit | Biến bắt buộc nhập  Tây Ninh thì đỏi lại [-2, -1, 16, 1, 8, 9]|[-2, 16, 1 , 5 ,17, 18, 19, 15]|[16, 1, 8, 9]
            optionRegister = '[-2, -1, 16, 1, 8, 9]|[-2, 16, 1]|[16, 1, 8, 9]', // Mảng 1 là mảng đăng ký, mảng 2 là mảng hiển thị info, mảng 3 là các trường ràng buộc lúc đăng ký
            LinkWebAdmin = '',
            IsLoaiThongBao = 1,//1- Thông báo cũ / 2- thông báo giống vũng tàu
            LinkSSODK = '', LinkSSODN = '', SecretKeySSO = '',
            dataNDXuLyMau = dataNoiDungXuLyMau,
            dataSlogan = `{
                "data": [],
                "colorText": "white",
                "sizeText": 20,
                "colorBgr": "",
                "timer": 3000
            }`,
            formRegister = '0', // 0: root api không có thainguyen, 1 là root api có thainguyen - Dùng cho chức nằng account riêng
            RootThaiNguyen = '1', // 0: root api không có thainguyen, 1 là root api có thainguyen
            MutiDanhGia = '1', //option Đánh Giá & Coment PA: mac dinh la 1 - Nhanh root CA se mac dinh la 0
            timeRequestOTP = '90', //Time giữa mỗi lần nhấn request OTP mặc định là: 60s
            isChonGio = false, // true: ModalPhanPhoi của Quảng Trị được phép chọn giờ, false: ModalPhanPhoi của Quảng Trị không được phép chọn giờ
            ShowFB = 0,// 0:không cho phép đăng nhập FB, 1: cho phép đăng nhập FB
            isDiaChi = '0',// 0: Không cần nhập địa chỉ khi gửi phản ánh, 1: Cập địa chỉ khi gửi phản ánh
            menuIOC = "[1,2,3]", //1: menu DVC, 2: menu HoSoSucKhoe, 3: menu Tableau. Nếu ko có dư liệu thì để "[]"
            isSDTYTe = false, //false: tắt, true: bật . chức năng trong gọi khẩn cấp có gọi thêm sdt bên Y Tế (Hiện tại bật ở Vinh)
            OnOffCamera = '0',// 0: Không cần nhập , 1: Đăng nhập tài khoản công dân để xem camera
            MenuDichBenh = JSON.stringify(menuDichBenh), // Menu chống dịch hiện tại dùng cho Quảng Trị ai cần thì bổ sung sau
            MenuThongTinCQ = JSON.stringify(menuThongTinCQ), // Menu thông tin từ Chính Quyền dùng cho ThaiNguyen ai cần thì bổ sung sau
            apiViettelMap = ConfigOnline?.apiViettelMap ? ConfigOnline.apiViettelMap : appConfig.apiViettelMap, // Token viettel map map
            useKeyMap = appConfig.useKeyMap, // True là autocomplete của viettel False là autocomplete của google
            urlDVCNeedBack = 'https://dichvucong.gov.vn/p/home/dvc-trang-chu.html', // Đường dẫn sau khi đăng ký tài khoản DVC dùng để nhận biết để đá lại trang đăng nhập
            isLoginQR = 'false', //Thêm biến bật tắt tính năng LoginQR: true- bật, false- tắt,
            showHomeNoti = 'true', // bật tắt show/hide modal noti admin
            conffigViettelID = `{
                "isViettelID": false,
                "cient_code": "client-citizen-demo",
                "secret_code": "06918d3b-2a9c-4e48-a259-36cf10b102ff"
            }`, // bật tắt show/hide modal noti admin
            sendOpinionNoLogin = 'false', // gửi phản ánh không cần đăng nhập
            isDropDownChuyenMuc = 'false', //giao diện ở home cộng đồng chổ chuyên mục dạng true là dropdown
            TinTucHome = 'false',//true- hiện tin tức , false: hiện banner hoặc logo
            codeAdminYTe = 'vts@2021',//code Cho phép cán bộ y tế xoá ĐK Khuôn Mặt. Nếu rỗng thì ko cần nhập code
            isDichBenh = 'false',// true đối vs các ứng dụng co triển khai phần chống dich VTS phát triển, false- như bình thường (Thêm tỉnh/ huyện/ xã)
            IdTinh_GioiThieu = '',// Id Tỉnh mặc định của phần giới thiệu
            domainAI = appConfig.domainAIPAHT,// Đưa domainAI lên config để Chỉnh sửa nếu cần.
            showQR_InfoCD = 'false', // Bật tắt show QR Công dân ở màn hình info,
            checkGiayThongHanh = 'false', // Bật tắt config check giấy đi tại modal hiển thị thông tin khi quét chốt kiểm tra của Admin
            checkQuayDau_ChotKiemDich = 'false',// Bật tắt config Cho phép tiếp tục, quay đầu khi quét qr ở chốt kiểm dịch
            isShareTinTuc = 'true', // Bật tắt config cho phép chia sẻ tin tức...
            isDropDownCanhBao = 'false', //giao diện ở home Canh Bao  chổ chuyên mục dạng true là dropdown - Quang Tri : true
            showTuongTac = 'false', //bật chức năng check "Hiển thị nội dung với người dùng" ở tương tác PA - TayNinh : true
            isGuiPADichBenhMDo = 'false', //bật chức năng check "Hiển thị DropDown Muc Do" ở PA Dich Benh- DongThap : true,
            ChonGioPhanPhoi = false, //bật chức năng check chon Gio/Phut cho Hạn Xu Ly chức năng phan phôi,
            showCheckCongKhaiPA = 'false', //bật UI check công khai khi gửi phản ánh, - check lại list đã gửi user nếu chưa có trả về props CongKhai thì nhắn API bổ sung vào,
            lenghtOTP = '6',// độ dài otp 4 số hay 6 số
            isGuiDGKhongHaiLong = 'false', //bật chức năng check "Hiển thị nhap NoiDungPhanAnh Khong Hai Long" ở HongNgu : true,
            ChucNangNghiemThu = `{
                "sendPAZalo": false,
                "hotlineDonVi": false,
                "loginDVC": false,
                "edit_delTuongTac": false
            }`, //Mặc định false. Hiện tại đang dùng cho pleiku. Tỉnh nào cần thì bật - Nhất làm
            ImgBGDuLich = '',
            topWSS = '1', // 1 là ưu tiên run link WSS nếu có cả WSS và Rtsp, 0: là ngược lại - Sử dụng cho Nhánh AddVLC
            chooseBoPhanLinhVucChuyenMuc = 'false', // Gửi phản ánh có dropdown chọn phường xã, lĩnh vực, chuyên mục,
            IconBackOpenWeb = 'false',// Chuyển icon X => ( <- ) Cho Thái Nguyên
            Type_TraCuuKQHT = 'false',// Loại tra cứu KQHT false: tra cứu theo sđt phụ huynh (sđt login), true: tra cứu theo mã học sinh,
            isPolicy = 'false',// Bật quyền và chính sách khi gửi phản ánh không login
            domainViettelMap = 'api-maps.viettel.vn'// Domain viettek map
        } = resconfig;
        //--MỚI - get object từ URL json mới, ko lấy từ config nữa.
        let tempObjMenu = await this.getObjMenu();
        if (tempObjMenu && tempObjMenu != -1 && tempObjMenu.MenuCongDong)
            objMenu = tempObjMenu;
        //--
        if (__DEV__) { //-Code để test DEBUG - build RELEASE thì nhớ KHOÁ LẠI
            // isDichBenh = "true"
            objMenu = JSON.stringify(objectMenuGlobal);
        }
        appConfig.domainAIPAHT = domainAI;
        Utils.setGlobal(nGlobalKeys.Type_TraCuuKQHT, Type_TraCuuKQHT == 'true')
        Utils.setGlobal(nGlobalKeys.chooseBoPhanLinhVucChuyenMuc, chooseBoPhanLinhVucChuyenMuc == 'true')
        Utils.setGlobal(nGlobalKeys.topWSS, topWSS == '1');
        Utils.setGlobal(nGlobalKeys.lenghtOTP, lenghtOTP != '' ? parseInt(lenghtOTP) : '')
        Utils.setGlobal(nGlobalKeys.showCheckCongKhaiPA, showCheckCongKhaiPA == 'true')
        Utils.setGlobal(nGlobalKeys.conffigViettelID, JSON.parse(conffigViettelID))
        Utils.setGlobal(nGlobalKeys.showHomeNoti, showHomeNoti == 'true')
        Utils.setGlobal(nGlobalKeys.urlDVCNeedBack, urlDVCNeedBack)
        Utils.setGlobal(nGlobalKeys.isLoginQR, isLoginQR == 'true')
        Utils.setGlobal(nGlobalKeys.sendOpinionNoLogin, sendOpinionNoLogin == 'true')
        Utils.setGlobal(nGlobalKeys.isDropDownChuyenMuc, isDropDownChuyenMuc)
        Utils.setGlobal(nGlobalKeys.TinTucHome, TinTucHome)
        Utils.setGlobal(nGlobalKeys.codeAdminYTe, codeAdminYTe)
        Utils.setGlobal(nGlobalKeys.isDichBenh, isDichBenh)
        Utils.setGlobal(nGlobalKeys.IdTinh_GioiThieu, IdTinh_GioiThieu != '' ? parseInt(IdTinh_GioiThieu) : '')
        Utils.setGlobal(nGlobalKeys.showQR_InfoCD, showQR_InfoCD == 'true')
        Utils.setGlobal(nGlobalKeys.checkGiayThongHanh, checkGiayThongHanh == 'true')
        Utils.setGlobal(nGlobalKeys.checkQuayDau_ChotKiemDich, checkQuayDau_ChotKiemDich == 'true')
        Utils.setGlobal(nGlobalKeys.isShareTinTuc, isShareTinTuc == 'true')
        Utils.setGlobal(nGlobalKeys.showTuongTac, showTuongTac == 'true', AppCodeConfig.APP_ADMIN)
        Utils.setGlobal(nGlobalKeys.isDropDownCanhBao, isDropDownCanhBao)
        Utils.setGlobal(nGlobalKeys.isGuiPADichBenhMDo, isGuiPADichBenhMDo)
        Utils.setGlobal(nGlobalKeys.ChonGioPhanPhoi, ChonGioPhanPhoi, AppCodeConfig.APP_ADMIN);
        Utils.setGlobal(nGlobalKeys.isGuiDGKhongHaiLong, isGuiDGKhongHaiLong == 'true')
        Utils.setGlobal(nGlobalKeys.ChucNangNghiemThu, JSON.parse(ChucNangNghiemThu));
        Utils.setGlobal(nGlobalKeys.ImgBGDuLich, ImgBGDuLich)
        Utils.setGlobal(nGlobalKeys.IconBackOpenWeb, IconBackOpenWeb == 'true')
        Utils.setGlobal(nGlobalKeys.isPolicy, isPolicy == 'true')
        Utils.setGlobal(nGlobalKeys.domainViettelMap, domainViettelMap)

        this.props.SetMenuChild(JSON.parse(MenuDichBenh), "MenuDichBenh");
        this.props.SetMenuChild(JSON.parse(MenuThongTinCQ), "MenuThongTinCQ");

        // alert(appConfig.IdSource);
        //đánh dấu CA là source của An giang
        //----Thay đổi giao diện HomeNew nếu có data.
        Utils.setGlobal(nGlobalKeys.key_menuHome, 'ManHinh_HomeNew');
        if (!objMenu || objMenu == '') {
            Utils.setGlobal(nGlobalKeys.key_menuHome, 'ManHinh_Home');
        }
        //--SET API KEY GG--
        if (!apiKeyGoogle) {
            apiKeyGoogle = appConfig.apiKeyGoogle
        }
        // apiKeyGoogle = '';
        let API_KEY = apiKeyGoogle.split(' | ');
        if (API_KEY.length == 2) {
            API_KEY = Platform.OS == 'ios' ? API_KEY[1] : API_KEY[0];
        } else
            API_KEY = API_KEY[0];
        appConfig.apiKeyGoogle = API_KEY; // key của api trả về

        // Sử dụng key auto complete của viettel/google
        appConfig.apiViettelMap = apiViettelMap // Set token map của viettel
        appConfig.useKeyMap = useKeyMap // True là autocomplete của viettel False là autocomplete của google
        //DIch vu cong
        Utils.setGlobal(nGlobalKeys.SecretKeySSO, SecretKeySSO);
        Utils.setGlobal(nGlobalKeys.LinkSSODK, LinkSSODK);
        Utils.setGlobal(nGlobalKeys.LinkSSODN, LinkSSODN)
        //===========
        let menuResconfig = typeof (objMenu) == 'string' ? JSON.parse(objMenu) : objMenu;
        this.props.Set_Object_Menu(menuResconfig);
        Utils.setGlobal(nGlobalKeys.objMenu, menuResconfig); // object Menu đã đổi. Nếu dùng menu cũ thì phải kt lại
        this.props.SetConfig_App({ key: NameConfig.NGUOIDAN, value: resconfig })
        Utils.setGlobal(nGlobalKeys.RootThaiNguyen, parseInt(RootThaiNguyen) == 0 ? '' : appConfig.rootIOC);
        Utils.setGlobal(nGlobalKeys.MutiDanhGia, parseInt(MutiDanhGia) == 1);
        Utils.setGlobal(nGlobalKeys.timeRequestOTP, parseInt(timeRequestOTP));
        Utils.setGlobal(nGlobalKeys.isDiaChi, parseInt(isDiaChi) == 0);
        // Utils.nlog('Gia tri resconfig =><><>>>>>>', Utils.getGlobal(nGlobalKeys.isDiaChi, ''))
        Utils.setGlobal(nGlobalKeys.menuIOC, menuIOC == "" ? [] : JSON.parse(menuIOC));
        Utils.setGlobal(nGlobalKeys.isSDTYTe, isSDTYTe);
        Utils.setGlobal(nGlobalKeys.formRegister, parseInt(formRegister) == 0 ? '' : appConfig.rootIOC);
        Utils.setGlobal(nGlobalKeys.IsChonGio, isChonGio, AppCodeConfig.APP_ADMIN);
        Utils.setGlobal(nGlobalKeys.LinkWebAdmin, LinkWebAdmin, AppCodeConfig.APP_ADMIN);
        Utils.setGlobal(nGlobalKeys.IsLoaiThongBao, IsLoaiThongBao);
        Utils.setGlobal(nGlobalKeys.OnOffCamera, parseInt(OnOffCamera) == 0 ? 0 : 1);
        Utils.setGlobal(nGlobalKeys.optionRegister, optionRegister);

        Utils.setGlobal(nGlobalKeys.IdSource, IdSource)
        Utils.setGlobal(nGlobalKeys.dataSlogan, JSON.parse(dataSlogan));

        Utils.setGlobal(nGlobalKeys.XoaPA, XoaPA)
        Utils.setGlobal(nGlobalKeys.timeTracking, parseInt(timeTracking))
        Utils.setGlobal(nGlobalKeys.timeMaps, parseInt(timeMaps))
        Utils.setGlobal(nGlobalKeys.isOTP, SMS == 'true');
        Utils.setGlobal(nGlobalKeys.txtErrPass, textErrorPass);
        Utils.setGlobal(nGlobalKeys.regexPass, regexPass);
        Utils.setGlobal(nGlobalKeys.dataNDXuLyMau, dataNDXuLyMau, AppCodeConfig.APP_ADMIN);


        // dataNDXuLyMau
        //---
        Utils.setGlobal(nGlobalKeys.LogoAppHome, LogoAppHome == '' ? undefined : appConfig.domain + LogoAppHome);
        Utils.setGlobal(nGlobalKeys.TenApp, TenAPP);
        Utils.setGlobal(nGlobalKeys.TenHuyen, TenHuyen);
        appConfig.TenTinh = TenHuyen;
        Utils.setGlobal(nGlobalKeys.TieuDe, TieuDe);
        Utils.setGlobal(nGlobalKeys.LinkIcons, LinkIcons);
        //CD thêm động màu: nền icon, màu text (làm động)
        Utils.setGlobal(nGlobalKeys.colorBackgroundMenu, colorBackgroundMenu);
        Utils.setGlobal(nGlobalKeys.colorTextMenu, colorTextMenu);
        Utils.setGlobal(nGlobalKeys.listTitleMenu, listTitleMenu);
        Utils.setGlobal(nGlobalKeys.titleHoTro, titleHoTro ? titleHoTro : 'AN NINH, TRẬT TỰ');

        colors.colorTextSelect = colorTextSelect ? colorTextSelect : '#114A26';
        colors.colorbackgroundSelect = colorbackgroundSelect ? colorbackgroundSelect : '#D4DAD4';
        colors.colorLinearButton = colorLinearButton ? colorLinearButton.replace(' ', '').split(',') : ['#114A26', '#00AB4F'];

        Utils.setGlobal(nGlobalKeys.SideMenu, SideMenu == '' ? '' : appConfig.domain + SideMenu);
        //--Get All link url files cache
        await this.getAllCacheLink();
        //--
        appConfig.TenAppHome = TenAppHome;
        appConfig.TieuDeApp = Utils.getGlobal(nGlobalKeys.TieuDe, 'PAHT');
        this.onLoadFirst();
        this.setStatusBar(true);
        await this._CheckTokenAutoLogin();
        await this._CheckTokenAutoLoginCanBo();


        if (this.props.auth.tokenCHAT) {
            ConnectSocket.KetNoi();
        }
    };

    hanlerGetConfigAll = (resCodeConfigAll) => {
        //++CODE CŨ bỏ. Làm lại code mới
        //---------------------------
        //--Xử lý lại config all để sau này dễ gọi ra dùng hơn.
        if (resCodeConfigAll && resCodeConfigAll?.data?.length > 0) {
            var tempObjVal = {};
            for (let index = 0; index < resCodeConfigAll?.data.length; index++) {
                const item = resCodeConfigAll?.data[index];
                tempObjVal[item.Code] = item;
            }
            //----------------------
            //+++XỬ LÝ CONFIG CŨ+++
            //-Xử lý giữ lại CODE get cũ để tránh LỖI => sẽ có 2 cách gọi 
            Utils.setGlobal(nGlobalKeys.ShowFB, parseInt(tempObjVal[ConfigOnline.ShowFB]?.Value) ? parseInt(tempObjVal[ConfigOnline.ShowFB].Value) : 0);
            Utils.setGlobal(nGlobalKeys.ChuyenPhanPhoi, parseInt(tempObjVal[ConfigOnline.CHUYENPHANPHOI]?.Value) ? parseInt(tempObjVal[ConfigOnline.CHUYENPHANPHOI].Value) : 0, AppCodeConfig.APP_ADMIN);
            //IOC PLEIKU
            Utils.setGlobal(nGlobalKeys.IOC_TOKEN_PlEIKU, tempObjVal[ConfigOnline.IOC_TOKEN]?.Value);
            Utils.setGlobal(nGlobalKeys.IOC_DOMAIN_PLEIKU, tempObjVal[ConfigOnline.IOC_DOMAIN_DS]?.Value);
            //DOMAIN HOI DAP TN
            Utils.setGlobal(nGlobalKeys.DOMAIN_LSHOIDAP, tempObjVal[ConfigOnline.DOMAIN_LSHOIDAP]?.Value);

            //----------------------
            //+++XỬ LÝ CONFIG MỚI+++
            for (const key in ConfigOnline) {
                //+++XỬ LÝ TH ĐẶC BIỆT - Lấy ALL data+++
                //--Nếu cần lấy các key khác trong object tempObjVal ko phải là Value thì if riêng ở dưới đây
                const keyGetAll = [ConfigOnline.PASSWORD_CHECK_CD];
                if (keyGetAll.includes(key)) {
                    ConfigOnline[key] = tempObjVal[key];
                    continue;
                }

                //+++XỬ LÝ TH CÒN LẠI - Lấy = Value +++
                ConfigOnline[key] = tempObjVal[key]?.Value;
            }
            Utils.nlog('[LOG] ConfigOnline:', ConfigOnline)
        }
        else {
            //---Xử lý get API FAIL thì set Value về Rỗng - False
            for (const key in ConfigOnline) {
                ConfigOnline[key] = "";
            }
        }
        //--end Xử lý config ALL
    }

    getObjMenu = async () => {
        let res = await Utils.get_api('Upload/App/objMenu.json', false, false);
        Utils.nlog('getObjMenu:', res);
        return res;
    }

    getConfigTayNinh = async () => {
        if (appConfig.IsQR == 1) {
            let storeSetting = await Utils.ngetStore(nkey.DataSettingTinTuc, null)
            if (storeSetting && storeSetting.filter(e => e.isCheck == true).length > 0) {
                Utils.setGlobal(nGlobalKeys.DataSettingTinTuc, storeSetting)
            } else {
                let resNguonTinDVC = await apis.ApiDVC.DsNguonBaiViet()
                // Utils.nlog('resNguon tin', resNguonTinDVC)
                if (resNguonTinDVC.status == 1 && resNguonTinDVC.data) {
                    let { data = [] } = resNguonTinDVC
                    let dataMap = data.map((item, index) => {
                        return {
                            ...item,
                            key: item.ID,
                            title: item.TenDonVi,
                            isCheck: [0].includes(index) ? true : false
                        }
                    })
                    await Utils.setGlobal(nGlobalKeys.DataSettingTinTuc, dataMap)
                    Utils.setGlobal(nGlobalKeys.DataSettingTinTuc, dataMap)
                }
            }

            // GetDomain HoiDap Tay Ninh
            let domainHoiDap = await apis.ApiApp.GetConfigByCode('HOIDAP_DOMAIN');
            Utils.nlog('res data domain hoi dap', domainHoiDap)
            Utils.setGlobal(nGlobalKeys.domainHoiDap, domainHoiDap?.data?.Value)
        }
    }

    getAllCacheLink = async () => {
        let arrtemp = [];
        for (const property in nkeyCache) {
            let valItem = nkeyCache[property];
            arrtemp.push(valItem);
            // Utils.nlog("CACHE:", arrtemp);
        }
        let valarr = await Utils.ngetMultiStore(arrtemp, null, "");
        for (let i = 0; i < arrtemp.length; i++) {
            const item = arrtemp[i];
            ROOTGlobal[item] = valarr[item];
            // Utils.nlog("CACHE VAL:", item, ROOTGlobal[item]);
        }
    }

    _GetDomainIOC = async () => {
        let res = await apis.ApiApp.GetConfigByCode('IOC_DOMAIN_DS')
        // Utils.nlog("-------RES:", res)
        if (res.status == 1 && res.data) {
            Utils.setGlobal(nGlobalKeys.DomainIOC, res.data?.Value);
        }
        else {
            Utils.setGlobal(nGlobalKeys.DomainIOC, '');
        }

    }
    _GetAuThen = async () => {
        let res = await apis.ApiApp.GetConfigByCode('IOC_TOKEN')
        Utils.nlog("-------RESresAuresAu:", res)
        if (res.status == 1 && res.data) {
            Utils.setGlobal(nGlobalKeys.Authen, res.data?.Value);
        }
        else {
            Utils.setGlobal(nGlobalKeys.Authen, '');
        }
    }
    _handleAppStateChange = async (nextAppState) => {
        Utils.nlog("gia tri net app state 1111111222", nextAppState);
        if (Platform.OS == 'android') {
            if (nextAppState === "background") {
                Utils.setGlobal("TimeRSAndroid", new Date());
                let giatri = Utils.getGlobal("TimeRSAndroid", new Date())
                console.log(giatri);
            }
            if (nextAppState === "active") {
                let tempTime = Utils.getGlobal("TimeRSAndroid", new Date());
                let date = Utils.datesDiff(tempTime, new Date(), true)
                console.log('số giây ghi nhận được', date);
                if (tempTime && Utils.datesDiff(tempTime, new Date(), true) >= 180) {
                    Utils.setGlobal("TimeRSAndroid", "");
                    CodePush.restartApp();
                }
                // Utils.setGlobal("TimeRSAndroid", "");
            }
            //---
        }
        let _state = store.getState();
        if (nextAppState === "active") {
            ConnectSocket.KetNoi();

        };
    }
    onIds = async (device) => {
        Utils.nlog('Init Notification:------- ', device);
        Utils.setGlobal(nGlobalKeys.pushToken_OneSignal, device.pushToken);
        Utils.setGlobal(nGlobalKeys.userId_OneSignal, device.userId);
        await Utils.nsetStore(nGlobalKeys.pushToken_OneSignal, device.pushToken);
        await Utils.nsetStore(nGlobalKeys.userId_OneSignal, device.userId);
        store.dispatch(DangKyOneSignal(true));
    }

    onReceived(notification) {
        Utils.nlog("[LOG] NOTIFICATION RECEVICE: ", notification);
        const { additionalData = {} } = notification.payload
        const { Data = {} } = additionalData
        let keyPopup = "popUpAll";
        let timeOutPopup = 8000;
        let titleNoti = notification.payload.title ? notification.payload.title : 'Có một thông báo mới';
        //--- NEW CODE - Gôm gọn code lại: ---
        let isAdmin = additionalData.hasOwnProperty('Admin') && additionalData.Admin == true ? true : false;
        if (isAdmin) { //Notifi Admin
            //--Code xử lý riêng trước khi show notifi...
            if (ROOTGlobal[nGlobalKeys.HomeDH].getThongBao) {
                ROOTGlobal[nGlobalKeys.HomeDH].getThongBao();
            }
            if (additionalData && (additionalData.list == true || additionalData.list == 'true' || additionalData.IdPA)) {
                if (ROOTGlobal[nGlobalKeys.LoadDH].reloadDSPAHome) {
                    ROOTGlobal[nGlobalKeys.LoadDH].reloadDSPAHome();
                }
            }
            if (additionalData && additionalData.IdGroup) {
                let oldState = store.getState()
                if (oldState.ReducerGroupChat && oldState.ReducerGroupChat.IdGroup) {
                    if (oldState.ReducerGroupChat.IdGroup == additionalData.IdGroup) {
                        return;
                    }
                    titleNoti = "Tin nhắn mới"
                }
            }

        } else { //Notifi Cong Dan
            if (additionalData && additionalData.IdCanhBao) {
                keyPopup = "popUpTinTuc";
                timeOutPopup = 120000;
            }

            //--Code xử lý riêng trước khi show notifi...
        }
        //-------------

        if (AppState.currentState == 'active' || AppState.currentState == 'inactive')
            nthisPopUp[keyPopup].show({
                onPress: () => ROOTGlobal.onOpenNotiCD({ notification }),
                appIconSource: Images.iconApp,
                appTitle: appConfig.TenAppHome,
                timeText: 'Bây giờ',
                title: titleNoti,
                body: notification.payload.body ? notification.payload.body : '',
                slideOutTime: timeOutPopup
            });
        //---END new code---

    }


    // ẩn thanh status bar khi Loadding
    setStatusBar = (val = false) => {
        if (!isIphoneX()) {
            StatusBar.setHidden(val);
        }
    };
    _CheckTokenAutoLogin = async () => {
        //check login sso
        let UseSSO = await Utils.ngetStore(nkey.UseCookieSSO, true)
        if (UseSSO == false) {
            Utils.setGlobal(nGlobalKeys.UseCookieSSO, UseSSO)
        }
        const { tokenCD } = await store.getState().auth;
        let logintoken = tokenCD;
        //CheckSession
        let Username = await Utils.ngetStore(nkey.Username, '');
        Utils.setGlobal(nGlobalKeys.Username, Username)
        let Id_user = await Utils.ngetStore(nkey.Id_user, '')
        Utils.setGlobal(nGlobalKeys.Id_user, Id_user);
        let NumberPhone = await Utils.ngetStore(nkey.NumberPhone, '')
        Utils.setGlobal(nGlobalKeys.NumberPhone, NumberPhone);
        let res = await apis.ApiUser.CheckSession(logintoken);
        if (res.status == 1) {
            let Email = await Utils.ngetStore(nGlobalKeys.Email, '')
            Utils.setGlobal(nGlobalKeys.loginToken, logintoken);
            Utils.setGlobal(nGlobalKeys.Email, Email);
            //check noti canh bao
            let notiCanhBaoOnOpen = Utils.getGlobal(nGlobalKeys.CheckNotiCanhBao, false)

            if (notiCanhBaoOnOpen)
                return;
            setTimeout(() => {
                this.onGoScreenHome();
            }, 500);
        } else {
            // await Utils.setGlobal(nGlobalKeys.loginToken, '');
            // await Utils.setGlobal(nGlobalKeys.Email, '');
            // await Utils.nsetStore(nkey.loginToken, '');
            // await Utils.nsetStore(nkey.token, '');
            // this.props.SetUserApp(AppCodeConfig.APP_CONGDAN, '');
            // this.props.SetTokenApp(AppCodeConfig.APP_CONGDAN, '');
            let notiCanhBaoOnOpen = Utils.getGlobal(nGlobalKeys.CheckNotiCanhBao, false)
            // store.dispatch(DangKyOneSignal(true, true));
            if (this.props.auth.tokenCD && this.props.auth.tokenCD.length > 0)
                this.props.logoutAppCheckInterNet(true);
            if (notiCanhBaoOnOpen)
                return;
            setTimeout(() => {
                this.onGoScreenHome();
            }, 500);
        }
    }
    _CheckTokenAutoLoginCanBo = async () => {
        //check nếu có tokenDH thì set token và check connect chat.
        let resShowAppG = await apis.ApiApp.GetConfigByCode(appConfig.CodeShowAppG)
        Utils.nlog('gia tri resShowAppG ===========', resShowAppG)
        if (resShowAppG.status == 1) {
            //chạy thật mở đoạn code này ra
            if (resShowAppG.data != null) {
                this.props.loadMenuApp({
                    ShowAppG: Number.parseInt(`${resShowAppG.data.Value || '0'}`)
                })
            } else {
                this.props.loadMenuApp({
                    ShowAppG: 0
                })
            }
        }
        if (this.props.auth.tokenDH) {
            this.props.checkAppAdmin()
            // const res = await apisAdmin.ApiUser.CheckSession(this.props.auth.tokenDH);
            // if (res.data && res.status == 1 && res.data.kq == true) {
            //     Utils.setGlobal(nGlobalKeys.loginToken, this.props.auth.tokenDH, AppCodeConfig.APP_ADMIN)
            //     await Utils.nsetStore(nkey.loginToken, this.props.auth.tokenDH, AppCodeConfig.APP_ADMIN)
            //     await this.props.GetDataUserDH()
            //     if (res.data.Roles) {
            //         this.props.loadMenuApp({
            //             listRuleDH: res.data.Roles
            //         })
            //     }
            // } else {
            //     await this.props.SetUserApp(AppCodeConfig.APP_ADMIN, '');
            //     await this.props.SetTokenApp(AppCodeConfig.APP_ADMIN, '');
            //     await this.props.Set_Menu_CanBo([], '')
            // }

        } else {

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
    latlog: state.location,
    menu: state.menu,
    auth: state.auth,
    theme: state.theme,
    DataChat: state.DataChat

});
export default Utils.connectRedux(RootScreen, mapStateToProps, true);