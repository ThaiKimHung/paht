import React, { Component } from 'react';

import {
  TextInput,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  Platform,
  ScrollView,
  TouchableHighlight,
  FlatList,
  RefreshControl,
  Linking,
  AppState,
  Dimensions
} from 'react-native';
import { colors, nstyles } from '../../styles';
import { Images } from '../images/index';
import Utils from '../../app/Utils';
import { sizes, isPad, reText } from '../../styles/size';
import { appConfig } from '../../app/Config';
import { ROOTGlobal, dataGlobal } from '../../app/data/dataGlobal';
import { nGlobalKeys } from '../../app/keys/globalKey';
import Apis from '../apis';
import FooterMenuApp from '../../components/FooterMenuApp';
import apis from '../apis';
import { nkey } from '../../app/keys/keyStore';
import OneSignal from 'react-native-onesignal';

import ConnectSocket from '../../chat/RoomChat/Connecttion';
import { store } from '../../srcRedux/store';
import { ChangeCurentGroup, ApiGetInfoChat } from '../../srcRedux/actions';
import AppCodeConfig from '../../app/AppCodeConfig';
import LottieView from 'lottie-react-native';
import { GetSetMaScreen } from '../../srcRedux/actions/auth/Auth';

const _style = StyleSheet.create({
  menu: {
    padding: Platform.OS == 'ios' ? 14 : 12
  },
  img_menu: {
    width: 24,
    height: 24,
    marginRight: 20,
    marginLeft: 10,
    padding: 2,
    tintColor: 'white'
  },
  title_menu: {
    color: 'white',
    fontSize: 16
  }
});
const keyQuyTrinh = {
  "1": 1,
  "2": 2,
  "17": 17,
  "3": 3,
  "4": 4,
  "5": 5,
  All: 1000
}

export class SideMenuApp extends Component {
  constructor(props) {
    super(props);

    this.ListRule = [30, 31, 36];
    this.CheckChat = Utils.getGlobal(nGlobalKeys.Chat, '0', AppCodeConfig.APP_ADMIN);
    this.IsLoaiThongBao = Utils.getGlobal(nGlobalKeys.IsLoaiThongBao, 1)
    this.state = {
      fullname: 'Tên tài khoản',
      avatarSource: '',
      dataMenu: [],
      refreshing: true,
      Tentinh: Utils.getGlobal(nGlobalKeys.TenTinh, '', AppCodeConfig.APP_ADMIN),
      listMenuTat: [],
      appState: AppState.currentState,
      listMenu: [
        {
          id: 0,
          text: 'Trang chủ điều hành',
          icon: Images.icHome,
          screen: 'scHome', //
          isRule: -1,
          isShow: true
        },
        {
          id: 11,
          text: 'Dashboard',
          icon: Images.icDashboard,
          screen: 'Dashboard_ThongKe', //
          isRule: 194,
          isShow: false
        },
        {
          id: 110,
          text: 'Tạo phản ánh',
          icon: Images.icadd,
          screen: 'Modal_HomeTaoPA', //
          isRule: 110,
          isShow: false
        },
        {
          id: 12,
          text: 'Danh sách kiểm soát phản ánh',
          icon: Images.icKiemSoatPA,
          screen: 'scHomeKiemSoat', //
          isRule: 152,
          isShow: false
        },
        {
          id: 1,
          text: 'Xử lý phản ánh',
          icon: Images.icPerson,
          screen: 'scHomePAHT', //
          isRule: 46,
          isShow: false,
          SelectDropdown: keyQuyTrinh.All

        },
        {
          id: 10024,
          text: 'Xử lý an sinh xã hội',
          icon: Images.icFood,
          screen: 'scHomeAnSinh', //
          isRule: 10024,
          isShow: false
        },
        {
          id: 1036,
          text: 'Trung tâm tiếp nhận S.O.S',
          icon: Images.icPerson,
          screen: 'scHomeSOS', //
          isRule: 1036,
          isShow: false
        },
        // {
        //   id: 1036,
        //   text: 'Cảnh báo Covid',
        //   icon: Images.icCBCV,
        //   screen: 'stackCBCV', //
        //   isRule: 1036,
        //   isShow: false
        // },
        {
          id: 1028,
          text: 'Tiếp nhận phản ánh',
          icon: Images.icPerson,
          screen: 'scHomePAChoTN', //
          isRule: 1028,
          isShow: false,
          SelectDropdown: keyQuyTrinh[1]
        },
        {
          id: 1029,
          text: 'Chờ phân phối',
          icon: Images.icPerson,
          screen: 'scHomePAChoPP', //
          isRule: 1029,
          isShow: false,
          SelectDropdown: keyQuyTrinh[2]
        },
        {
          id: 1030,
          text: 'Chờ xử lý',
          icon: Images.icPerson,
          screen: 'scHomePAChoXL', //
          isRule: 1030,
          isShow: false,
          SelectDropdown: keyQuyTrinh[3]
        },
        {
          id: 1031,
          text: 'Chờ phê duyệt',
          icon: Images.icPerson,
          screen: 'scHomePAChoPD', //
          isRule: 1031,
          isShow: false,
          SelectDropdown: keyQuyTrinh[4]
        },
        {
          id: 1032,
          text: 'Chờ biên tập',
          icon: Images.icPerson,
          screen: 'scHomePAChoDT', //
          isRule: 1032,
          isShow: false
        },
        // stackXuPhatHanhChinh
        {
          id: 96,
          text: 'Xử phạt hành chính',
          icon: Images.icPunish,
          screen: 'stackXuPhatHanhChinh', //
          isRule: 201,
          isShow: false
        },
        {
          id: 30,
          text: 'Tra cứu XPHC',
          icon: Images.isSeachXP,
          screen: 'stackTraCuuXPHC', //
          isRule: 201,//Lấy cùng rule với XPHC
          isShow: false
        },
        {
          id: 10,
          text: 'Phản ánh từng tham gia',
          icon: Images.icPhanAnhMR,
          screen: 'scHomePADXL', //
          isRule: 46,
          isShow: false
        },
        // {
        //   id: 14,
        //   text: 'Phản ánh đơn vị từng phụ trách',
        //   icon: Images.icPhanAnhMR,
        //   screen: 'scHomePADonViTungPhuTrach', //
        //   isRule: 46,
        //   isShow: false
        // },
        {
          id: 7,
          text: 'Phản ánh mở rộng',
          icon: Images.icPhanAnhMR,
          screen: 'stackHomePAMR', //
          isRule: 58,
          isShow: false
        },
        {
          id: 107,
          text: 'Phản ánh chuyển để biết',
          icon: Images.icChuyenDeBiet,
          screen: 'scChuyenDeBiet', //
          isRule: 107,
          isShow: false,
        },
        {
          id: 2,
          text: 'Danh sách hủy',
          icon: Images.icListCancel,
          screen: 'stackDSHuy', //
          isRule: 105,
          isShow: false
        },
        {
          id: 9,
          text: 'Phản ánh nội bộ',
          icon: Images.icNoiBo,
          screen: 'scHomePANB', //
          isRule: -1,
          isShow:
            Utils.getGlobal(nGlobalKeys.NoiBo, 'false', AppCodeConfig.APP_ADMIN) == 'true' ? true : false
        },

        {
          id: 4,
          text: 'Phản ánh có tương tác',
          icon: Images.icChat,
          screen: 'stackTuongTac', //
          isRule: 129,
          isShow: false
        },
        {
          id: 6,
          text: 'Thống kê',
          icon: Images.icThongKe,
          screen: 'stackThongKe',
          isRule: 112,
          isShow: false
        },
        {
          id: 112,
          text: 'Thống kê báo cáo',
          icon: Images.icThongKe,
          screen: 'stackThongKeAdminHome',
          isRule: 112,
          isShow: false
        },
        // 
        {
          id: 97,
          text: 'Thống kê Xử phạt hành chính',
          icon: Images.icThongKe,
          screen: 'stackThongKeXPHC',
          isRule: 1002,
          isShow: false
        },
        {
          id: 209,
          text: 'Thống kê trực ban',
          icon: Images.icThongKe,
          screen: 'stackThongKeTrucBanTH',
          isRule: appConfig.IdSource == 'CA' ? 209 : -1,
          isShow: false,
        },
        {
          id: 301,
          text: 'Thống kê của đơn vị',
          icon: Images.icThongKe,
          screen: 'stackThongKeCuaDonVi',
          isRule: 301,
          isShow: false,
        },
        {
          id: 8,
          text: 'Cảnh báo',
          icon: Images.icThongBaoCBYes,
          screen: 'schomeCanhBao',
          isRule: 119,
          isShow: false
        },
        // {
        //   id: 99,
        //   text: 'Chat',
        //   icon: Images.icChat,
        //   screen: 'scChatStack',
        //   isRule: -1,
        //   isShow: this.CheckChat == '1' ? true : false
        // },
        {
          id: 303,
          text: 'Thư mời',
          icon: Images.icMail,
          screen: 'stackThuMoi', //
          isRule: 303,
          isShow: false,
        },
        {
          id: -99,
          text: 'Thông báo',
          icon: Images.icNoti,
          screen: 'Modal_HomeThongBao', //
          isRule: -99,
          isShow: this.IsLoaiThongBao == 1 ? false : true,
        },
        {
          id: 5,
          text: 'Đăng xuất điều hành',
          icon: Images.icLogoutMenu,
          screen: 'sw_Login',//
          isRule: -1,
          isShow: true
        },
        {
          id: 5,
          text: 'Quay lại',
          icon: Images.icBack,
          screen: 'ManHinh_Home', //'sw_Login', //
          isRule: -1,
          isShow: true
        },

      ]
    };
    ROOTGlobal[nGlobalKeys.LogOutDH].DangXuat = this._logOut;
    ROOTGlobal[nGlobalKeys.SideMenuAppDH].onRefresh = this._onRefresh;
    ROOTGlobal[nGlobalKeys.LoadInfoDH].GetInfo = this._getInfoUser;
  }

  componentWillUnmount() {
  }

  _handleAppStateChange = nextAppState => {

    if (this.state.appState.match(/inactive|background/) && nextAppState === "active") {
      setTimeout(() => {
        if (this.props.objectData.status == 4 && this.props.objectData.statusrun == 'false') {
          ConnectSocket.KetNoi();
        } else {
        }
      }, 1000);

    }
    this.setState({ appState: nextAppState });
  };
  async componentDidMount() {
    //xu ly sau
    AppState.addEventListener('change', this._handleAppStateChange);
    ConnectSocket.setProp(this.props);

    this.props.ApiGet_ListGroupChat();
    this.props.SetStatus_Notify(1);
    ConnectSocket.KetNoi();

    let resconfig = await apis.ApiApp.getAppCongig(2);


    this._capNhatMenu();
    this.getListThaoTac();


    this._getInfoUser();


    if (ROOTGlobal[nGlobalKeys.HomeDH].getThongBao)
      ROOTGlobal[nGlobalKeys.HomeDH].getThongBao();

    //Bổ sung thêm menu huong dan su dung neu link khác ''
    if (Utils.getGlobal(nGlobalKeys.urlHDSD, '', AppCodeConfig.APP_ADMIN) != '') {
      let temp = [...this.state.listMenu,
      {
        id: 5,
        text: 'Hướng dẫn sử dụng',
        icon: Images.icGuide,
        screen: '',//
        isRule: -1,
        isShow: true,
        link: Utils.getGlobal(nGlobalKeys.urlHDSD, '', AppCodeConfig.APP_ADMIN)
      }
      ]
      this.setState({
        listMenu: temp
      })
    }
  }



  _capNhatMenu = () => {
    const { listMenu } = this.state;
    var rules = Utils.getGlobal(nGlobalKeys.rules, [], AppCodeConfig.APP_ADMIN);
    Utils.nlog("list ------------Rulus", rules)
    var dataMenu = listMenu.filter(item => {
      return item.isShow == true || rules.find(item1 => item1 == item.isRule)
        ? true
        : false;
    });
    this.setState({ listMenu: dataMenu, refreshing: false });
  };

  _getInfoUser = async () => {
    let res = await Apis.ApiUser.GetInfoUser();
    if (res.status == 1 && res.data) {
      ROOTGlobal[nGlobalKeys.infoUser] = res.data;
      this.setState({
        fullname: res.data.FullName,
        avatarSource: res.data.Avata,
        refreshing: false
      });
    } else {
      this.setState({ refreshing: false });
      // Utils.showMsgBoxOK(this, "Thông báo", "Lấy thông tin tài khoản thất bại", "Xác nhận")
    }
  };
  _closeSlideMenu = () => {
    this.props.navigation.closeDrawer();
  };

  _goscreen = item => () => {
    //Chuyển menu và đóng drawer xử lý ở đây
    if (item.screen == 'sw_Login') {
      Utils.showMsgBoxYesNo(
        this,
        'Thông báo',
        'Bạn có chắc muốn thoát ?',
        'Chấp nhận',
        'Hủy',
        async () => this._logOut()
      );
    } else {
      switch (item.id) {
        case 0:
          {
            if (ROOTGlobal[nGlobalKeys.HomeDH].getThongBao) {
              ROOTGlobal[nGlobalKeys.HomeDH].getThongBao();
            }
            Utils.goscreen(this, item.screen);
            Utils.toggleDrawer(this, true);
          }
          break;
        case 6:
          {
            if (ROOTGlobal[nGlobalKeys.ThongKeDH].refesh) {
              ROOTGlobal[nGlobalKeys.ThongKeDH].refesh();
            }
            Utils.goscreen(this, item.screen);
            Utils.toggleDrawer(this, true);
          }
          break;
        case 4:
          {
            if (ROOTGlobal[nGlobalKeys.PhanAnhTuongTacDH].refesh) {
              ROOTGlobal[nGlobalKeys.PhanAnhTuongTacDH].refesh();
            }
            Utils.goscreen(this, item.screen);
            Utils.toggleDrawer(this, true);
          }
          break;
        case 10:
          {
            Utils.goscreen(this, item.screen, { isMenuMore: 1 });
            Utils.toggleDrawer(this, true);
          }
          break;
        case 12:
          {
            Utils.goscreen(this, item.screen, { isMenuMore: 2 });
            Utils.toggleDrawer(this, true);
          }
          break;
        case 13:
          {
            Utils.goscreen(this, item.screen, { isMenuMore: -1 }); // -1 là danh sách du lịch, xử lý yêu cầu dịch vụ
            Utils.toggleDrawer(this, true);
          }
          break;
        case 14:
          {
            Utils.goscreen(this, item.screen, { isMenuMore: 1, IdStep: -2 });
            Utils.toggleDrawer(this, true);
          }
          break;
        case 1028:
          {
            Utils.goscreen(this, item.screen, { IdStep: 1 });
            Utils.toggleDrawer(this, true);
          }
          break;
        case 1029:
          {
            Utils.goscreen(this, item.screen, { IdStep: 2 });
            Utils.toggleDrawer(this, true);
          }
          break;
        case 1030:
          {
            Utils.goscreen(this, item.screen, { IdStep: 3 });
            Utils.toggleDrawer(this, true);
          }
          break;
        case 1031:
          {
            Utils.goscreen(this, item.screen, { IdStep: 4 });
            Utils.toggleDrawer(this, true);
          }
          break;
        case 1032:
          {
            Utils.goscreen(this, item.screen, { IdStep: 5 });
            Utils.toggleDrawer(this, true);
          }
          break;
        case 10024:
          {
            Utils.goscreen(this, item.screen, { LocTheo: 102 });
            Utils.toggleDrawer(this, true);
          }
          break;
        //
        default: {
          if (item?.link && item.hasOwnProperty('link')) {
            Utils.toggleDrawer(this, true);
            Utils.openWeb(this, item.link)
          } else {
            Utils.goscreen(this, item.screen);
            Utils.toggleDrawer(this, true);
          }
        }
      }
    }
  };

  _logOut = async (isNoToken = false) => {
    await GetSetMaScreen(false, appConfig.manHinhADmin, false);
    let res = await apis.ApiUser.LogOut(
      Utils.getGlobal(nGlobalKeys.userId_OneSignal, '', AppCodeConfig.APP_ADMIN)
    );
    this.props.loadMenuApp({
      isLogouDH: true
    })
    // this.props.resetStore();
    if (isNoToken) res = { status: 1 };
    if (res.status == 1) {
      this.props.SetStatus_Notify(-1)
      // await this.props.LogoutApp(AppCodeConfig.APP_ADMIN)
      this.props.logoutAppCheckInterNet(false);
      //Xóa dữ liệu global,Store
      if (Utils.getGlobal(nGlobalKeys.rememberPassword, '', AppCodeConfig.APP_ADMIN)) {
        //Chỉ xóa token,iduser
        //code mới tùy trường hợp mà mở đoạn code này ra: sẽ logout toàn app kể cả khi đang ở bên admin
        // this.props.LogoutApp(AppCodeConfig.APP_CONGDAN)
        // this.props.LogoutApp(AppCodeConfig.APP_ADMIN) // chỉ logout bên admin
        // this.props.LogoutApp(AppCodeConfig.APP_DVC)
        // this.props.Set_Menu_CanBo([], '')
        // Utils.setGlobal(nGlobalKeys.loginToken, '');
        // Utils.setGlobal(nGlobalKeys.Id_user, '');
        // Utils.setGlobal(nGlobalKeys.Email, '');
        // Utils.setGlobal(nGlobalKeys.NumberPhone, '');
        // Utils.setGlobal(nGlobalKeys.TokenSSO, '');
        // Utils.setGlobal(nGlobalKeys.InfoUserSSO, '');
        // Utils.setGlobal(nGlobalKeys.UseCookieSSO, true)
        // await Utils.nsetStore(nkey.UseCookieSSO, true)
        // await Utils.nsetStore(nkey.InfoUserSSO, '')

        // await Utils.nsetStore(nkey.loginToken, '');
        // Utils.nsetStore(nkey.token, '');
        // Utils.nsetStore(nkey.Id_user, '');
        // Utils.nsetStore(nkey.NumberPhone, '');
        // await Utils.nsetStore(nkey.TimeTuNgay, '');


        // Utils.setGlobal(nGlobalKeys.loginToken, '', AppCodeConfig.APP_ADMIN);
        // Utils.setGlobal(nGlobalKeys.rules, '', AppCodeConfig.APP_ADMIN);
        // Utils.setGlobal(nGlobalKeys.Id_user, '', AppCodeConfig.APP_ADMIN);
        // await Utils.nsetStore(nkey.loginToken, '', AppCodeConfig.APP_ADMIN);
        // await Utils.nsetStore(nkey.rules, '', AppCodeConfig.APP_ADMIN);
        // await Utils.nsetStore(nkey.Id_user, '', AppCodeConfig.APP_ADMIN);
        this.props.logoutAppCheckInterNet(false);
        // Utils.goscreen(this, 'sw_Login');
        Utils.goscreen(this, 'ManHinh_Home');
        return 1; //log out thanh cong
      } else {
        //code mới tùy trường hợp mà mở đoạn code này ra: sẽ logout toàn app kể cả khi đang ở bên admin
        // this.props.LogoutApp(AppCodeConfig.APP_CONGDAN)
        // this.props.LogoutApp(AppCodeConfig.APP_ADMIN) // chỉ logout bên admin
        // this.props.LogoutApp(AppCodeConfig.APP_DVC)
        // this.props.Set_Menu_CanBo([], '')
        // Utils.setGlobal(nGlobalKeys.loginToken, '');
        // Utils.setGlobal(nGlobalKeys.Id_user, '');
        // Utils.setGlobal(nGlobalKeys.Email, '');
        // Utils.setGlobal(nGlobalKeys.NumberPhone, '');
        // Utils.setGlobal(nGlobalKeys.TokenSSO, '');
        // Utils.setGlobal(nGlobalKeys.InfoUserSSO, '');
        // Utils.setGlobal(nGlobalKeys.UseCookieSSO, true)
        // await Utils.nsetStore(nkey.UseCookieSSO, true)
        // await Utils.nsetStore(nkey.InfoUserSSO, '')

        // await Utils.nsetStore(nkey.loginToken, '');
        // Utils.nsetStore(nkey.token, '');
        // Utils.nsetStore(nkey.Id_user, '');
        // Utils.nsetStore(nkey.NumberPhone, '');
        // await Utils.nsetStore(nkey.TimeTuNgay, '');

        // Utils.setGlobal(nGlobalKeys.loginToken, '', AppCodeConfig.APP_ADMIN)
        // Utils.setGlobal(nGlobalKeys.Id_user, '', AppCodeConfig.APP_ADMIN)
        // Utils.setGlobal(nGlobalKeys.rules, '', AppCodeConfig.APP_ADMIN);
        // await Utils.nsetStore(nkey.loginToken, '', AppCodeConfig.APP_ADMIN);
        // await Utils.nsetStore(nkey.Id_user, '', AppCodeConfig.APP_ADMIN);
        // await Utils.nsetStore(nkey.rules, '', AppCodeConfig.APP_ADMIN);


        //Đoạn code xóa hết là code cũ
        //Xóa hết 
        // await Utils.setGlobal(nGlobalKeys.loginToken, '', AppCodeConfig.APP_ADMIN);
        // await Utils.setGlobal(nGlobalKeys.rules, '', AppCodeConfig.APP_ADMIN);
        // await Utils.setGlobal(nGlobalKeys.Id_user, '', AppCodeConfig.APP_ADMIN);
        // await Utils.setGlobal(nGlobalKeys.rememberPassword, false, AppCodeConfig.APP_ADMIN);

        // await Utils.nsetStore(nkey.loginToken, '', AppCodeConfig.APP_ADMIN);
        // await Utils.nsetStore(nkey.rules, '', AppCodeConfig.APP_ADMIN);
        // await Utils.nsetStore(nkey.Id_user, '', AppCodeConfig.APP_ADMIN);
        // await Utils.nsetStore(nkey.rememberPassword, false, AppCodeConfig.APP_ADMIN);

        //User ,Pass
        // await Utils.nsetStore(nkey.Username, '', AppCodeConfig.APP_ADMIN);
        // await Utils.nsetStore(nkey.Password, '', AppCodeConfig.APP_ADMIN);
        // await Utils.setGlobal(nGlobalKeys.Username, '', AppCodeConfig.APP_ADMIN);
        // await Utils.setGlobal(nGlobalKeys.Password, '', AppCodeConfig.APP_ADMIN);
        // Utils.goscreen(this, 'sw_Login');
        this.props.logoutAppCheckInterNet(false);
        Utils.goscreen(this, 'ManHinh_Home');
        return 1; //log out thanh cong
      }
    } else {
      return -1; //log out that bai
    }
  };
  _DemThongBao = (item, index) => {
    const { dataNotificationCanBo = [] } = this.props.thongbao || {};
    let soluongTB = 0;
    if (item.SelectDropdown && dataNotificationCanBo && dataNotificationCanBo.length > 0) {
      if (item.SelectDropdown == keyQuyTrinh.All) {
        let dataTK = dataNotificationCanBo.filter(i => keyQuyTrinh[i.SelectDropdown] != undefined ? true : false)
        // Utils.nlog("data ---------kkk-----------kkkk---", dataNotificationCanBo, item.text, dataTK)
        if (dataTK) {
          dataTK.forEach(element => {
            soluongTB += Number(element.Number.split(' ')[0] || 0)
          });
        }
      } else {
        let dataTK = dataNotificationCanBo.find(i => i.SelectDropdown == item.SelectDropdown);
        if (dataTK && dataTK.Number && dataTK.Number.length > 0) {
          soluongTB = dataTK.Number.split(' ')[0]
        }
      }
    }
    return soluongTB
  }
  _renderMenu = (item, index) => {
    // Utils.nlog("list ------------", item)
    const { dataMenu = [], listMenu = [] } = this.state;
    const { dataNotificationCanBo = [] } = this.props.thongbao || {};
    let rules = Utils.getGlobal(nGlobalKeys.rules, [], AppCodeConfig.APP_ADMIN);
    // Utils.nlog("list ------------Rulus", rules)
    let isRule = false;
    for (let index = 0; index < this.ListRule.length; index++) {
      const element = this.ListRule[index];
      let check = rules.includes(element);
      if (check == true) {
        isRule = true;
      }
    }
    let soluongTB = this._DemThongBao(item, index);
    if (item.id == 1 && isRule == true && dataMenu.length <= 3) {
      return (
        <View key={'mn' + index.toString()} style={{}}>
          {dataMenu.map(this._renderMenuTat)}
        </View>
      );
    }
    return (
      <TouchableHighlight
        style={_style.menu}
        key={index.toString()}
        underlayColor={this.props.theme.colorHeaderAdmin ? this.props.theme.colorHeaderAdmin[0] : '#325887'}
        onPress={this._goscreen(item)}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {item.screen == 'scHomePAHT' ?
            <View style={{ width: 28, height: 28, marginLeft: 6, marginRight: 20 }}>
              <LottieView
                source={require('../../src/images/xulyphananh.json')}
                style={{}}
                loop={true}
                autoPlay={true}
              />
            </View>
            : item.screen == 'scHomeSOS' ?
              <View style={{ width: 28, height: 28, marginLeft: 6, marginRight: 20 }}>
                <LottieView
                  source={require('../../src/images/sos.json')}
                  style={{}}
                  loop={true}
                  autoPlay={true}
                />
              </View>
              :
              <Image style={_style.img_menu} source={item.icon} resizeMode='contain' />}
          <Text style={[_style.title_menu, { flex: 1 }]}>
            {item.text}
          </Text>
          <View style={{
            backgroundColor: colors.redpink, padding: item.SelectDropdown && soluongTB ? 5 : 0,
            borderWidth: item.SelectDropdown && soluongTB ? 1 : 0,
            borderColor: colors.white,
            minWidth: item.SelectDropdown && soluongTB ? 30 : 0,
            alignItems: 'center', justifyContent: 'center'
          }}>
            <Text style={{
              color: colors.white,
              fontSize: reText(16),
              fontWeight: 'bold'
            }}>
              {item.SelectDropdown && soluongTB ? soluongTB : ''}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  };
  goScreenTat = item => () => {
    if (ROOTGlobal[nGlobalKeys.setDropDownDH].loadItem) {
      ROOTGlobal[nGlobalKeys.setDropDownDH].loadItem(item);
      Utils.goscreen(this, 'scHomePAHT', { id: item.IdStep });
      Utils.toggleDrawer(this, true);
    } else {
      Utils.goscreen(this, 'scHomePAHT', { id: item.IdStep });
      Utils.toggleDrawer(this, true);
    }

    //
  };
  _renderMenuTat = (item, index) => {

    let soluongTB = this._DemThongBao(item, index);
    //tìm kiếm rulés
    return (
      <TouchableHighlight
        key={index.toString()}
        style={_style.menu}
        underlayColor={this.props.theme.colorHeaderAdmin ? this.props.theme.colorHeaderAdmin[0] : '#325887'}
        onPress={this.goScreenTat(item)}
      >
        {/* <Text style={_style.title_menu}>{item.TitleStep}</Text> */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image style={_style.img_menu} source={Images.icLanhDaoDuyet} />
          <Text style={[_style.title_menu, { flex: 1 }]}>{item.TitleStep}</Text>
          <View style={{
            backgroundColor: colors.redpink, padding: item.SelectDropdown && soluongTB ? 5 : 0,
            borderWidth: item.SelectDropdown && soluongTB ? 1 : 0,
            borderColor: colors.white,
            minWidth: item.SelectDropdown && soluongTB ? 40 : 0,
            alignItems: 'center', justifyContent: 'center'
          }}>
            <Text style={{
              color: colors.white,
              fontSize: reText(16),
              fontWeight: 'bold'
            }}>
              {item.SelectDropdown && soluongTB ? soluongTB : ''}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  };

  _keyExtrac = (item, index) => item.id.toString();
  _onRefresh = () => {
    this.setState({ refreshing: true }, this._capNhatMenu);
  };
  getListThaoTac = async () => {
    let res = await apis.Auto.GetList_ThaoTacXuLy();
    // Utils.nlog('giá trị res thao tác menu', res);
    if (res && res.status == 1) {
      // alert(1);;
      this.setState({ dataMenu: res.data });
    }
  };
  render() {
    const { dataMenu = [], listMenu = [] } = this.state;
    return (
      <View
        style={[nstyles.nstyles.ncontainer, {
          backgroundColor: this.props.theme.colorSliderAdmin ? this.props.theme.colorSliderAdmin : '#25313F'
        }]}
      >
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            // backgroundColor: '#25313F',
            marginTop: 50
          }}
        >
          <Image
            style={nstyles.nstyles.nIcon120}
            resizeMode='contain'
            // defaultSource={Images.iconApp}
            source={{
              uri: Utils.getGlobal(nGlobalKeys.LogoAppAdmin, undefined, AppCodeConfig.APP_ADMIN)
            }}
          />
          <Text
            style={{
              width: '100%',
              textAlign: 'center',
              marginBottom: Platform.OS == 'ios' ? 20 : 14,
              fontWeight: '600',
              fontSize: 20,
              color: '#F3D34A',
              marginTop: isPad ? 4 : 10
            }}
          >
            {this.state.Tentinh}
          </Text>
        </View>
        {/* {List menu} */}
        <ScrollView
          contentContainerStyle={{ paddingBottom: 50 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        >
          {listMenu.map(this._renderMenu)}
        </ScrollView>
        <FooterMenuApp
          dataUser={{
            fullname: this.state.fullname,
            avatarSource: this.state.avatarSource
          }}
          goScreen={this._goscreen({ screen: 'ManHinh_ThongTinTaiKhoan' })}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  ReducerGroupChat: state.ReducerGroupChat,
  objectData: state.DataChat,
  auth: state.auth,
  theme: state.theme,
  thongbao: state.thongbao
});
export default Utils.connectRedux(SideMenuApp, mapStateToProps, true);
