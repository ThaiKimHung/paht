import {
  createStackNavigator,
  createBottomTabNavigator,
  createSwitchNavigator,
  createDrawerNavigator
} from 'react-navigation';
import { Easing, Animated } from 'react-native';

// -- Root Screen + Component native custom  *
import MsgBox from '../../components/MsgBox';
import RootScreen from '../screens/RootScreen';
import SideMenu from '../../components/SideMenu';
import BrowserInApp from '../../components/BrowserInApp';
import DatePickList from '../../components/DatePickList';
import MediaPicker from '../../components/MediaPicker';
import TakeCamera from '../../components/TakeCamera';
import RecordVideo from '../../components/RecordVideo';
import PlayMedia from '../../components/PlayMedia';
import SideMenuApp from './SideMenuApp';

import { HomePAHT, ListTrangThai } from '../screens/PhanAnhHienTruong';

import { HomeSetting } from '../screens/setting';

// -- Các màn hình App
import Home from '../screens/main/Home';
import Language from '../screens/Language';
import Login from '../screens/main/Login';
import CardUpload from '../screens/main/CardUpload';
import InfoUser from '../screens/main/InfoUser';
import Modal_ChangePassword from '../screens/main/Modal_ChangePassword';
import QuenMK from '../screens/main/User/QuenMK';
import XacNhanOTP from '../screens/main/User/XacNhanOTP';
import DropDownCus from '../../components/ComponentApps/DropDownCus';
import ModalXacMinhPA from '../screens/PhanAnhHienTruong/ModalXacMinhPA';
import ModalHuyPA from '../screens/PhanAnhHienTruong/ModalHuyPA';
import ModalNoiDungTraoDoi from '../screens/PhanAnhHienTruong/ModalNoiDungTraoDoi';
import ModalPhanPhoi from '../screens/PhanAnhHienTruong/ModalPhanPhoi';
import ModalXemVideo from '../screens/PhanAnhHienTruong/ModalXemVideo';
import AutocompleteMap from '../screens/PhanAnhHienTruong/components/AutocompleteMap';
import BanDo_Root from '../screens/PhanAnhHienTruong/BanDo_Root';
import ModalXuLyChung from '../screens/PhanAnhHienTruong/ModalXuLyChung';
import MapChiTietPA from '../screens/PhanAnhHienTruong/components/MapChiTietPA';
import ThongKeHome from '../screens/main/ThongKe/ThongKeHome';
import DSHuy from '../screens/main/DanhSachHuy/DSHuy';
import ModalXoaSuaPhanAnh from '../screens/PhanAnhHienTruong/ModalXoaSuaPhanAnh';
import ThongBao from '../screens/main/ThongBao/ThongBao';
import DSNoCheck from '../screens/main/DanhSachNoCheck/DSNoCheck';
import Modal_DonVi from '../screens/PhanAnhHienTruong/popup_modal/Modal_DonVi';
import ModalFile from '../screens/PhanAnhHienTruong/components/ModalFile';
import ModalTraBuocTruoc from '../screens/PhanAnhHienTruong/ModalTraBuocTruoc';
import homePhanAnhTT from '../screens/main/PhanAnhTuongTac/homePhanAnhTT';
import HomeCanhBao from '../screens/main/CanhBao/HomeCanhBao';
import ChiTietCanhBao from '../screens/main/CanhBao/ChiTietCanhBao';
import DanhSachFileDK from '../screens/PhanAnhHienTruong/popup_modal/DanhSachFileDK';
import ModalThemNPDuyet from '../screens/main/DanhSachNoCheck/ModalThemNPDuyet';
import DangKyTaiKhoan from '../screens/main/User/DangKyTaikhoan';
import CTCanhBaoTracking from '../screens/main/CanhBao/CTCanhBaoTracking';
import RootMap from '../screens/main/coronamap/RootMap';
import Modal_XemSuaNhatKy from '../screens/PhanAnhHienTruong/Modal_XemSuaNhatKy';
import Filtertracking from '../screens/main/coronamap/Filtertracking';
import MapPolyline from '../screens/main/coronamap/MapPolyline';
import ModalCapNhatHanXuLy from '../screens/PhanAnhHienTruong/ModalCapNhatHanXuLy';

import FormTaoTaiKhoan from '../screens/TaoTaiKhoanCD/FormTaoTaiKhoan';

//--chat

import ChiTietTuongTac from '../screens/main/CanhBao/TuongTacCongDan';
import Dashboard from '../screens/dashboard';
import ModalOption from '../screens/dashboard/ModalOption';
import CamVideoCus from '../../components/CamVideo/CamVideoCus';
import ModalTuongTu from '../screens/PhanAnhHienTruong/ModalTuongTu';
import ModalTTDonVi from '../screens/PhanAnhHienTruong/components/ModalTTDonVi';
import StartedScreen from '../screens/StartedScreen';
import XuPhatHanhChinh from '../screens/xuphathanhchinh/XuPhatHanhChinh';
import ModalSearchFilter from '../screens/xuphathanhchinh/ModalSearchFilter';
import FormXuPhatHC from '../screens/xuphathanhchinh/FormXuPhatHC';
import ComponentSelectProps from '../../components/ComponentApps/ComponentSelectProps';
import DanhSachCDViPham from '../screens/xuphathanhchinh/DanhSachCDViPham';
import ThongKeXPHC from '../screens/thongkexuphathanhchinh/ThongKeXPHC';
import BDXPTheoThoiHan from '../screens/thongkexuphathanhchinh/BDXPTheoThoiHan';
import ModalEditHTML from '../../components/rich-editor/ModalEditHTML';
import SoLieuThongKe from '../screens/main/ThongKe/SoLieuThongKe';
import ChiTietThongKeDonVi from '../screens/thongkexuphathanhchinh/ChiTietThongKeDonVi';
import ThongKeTienXPHC_ChiTiet from '../screens/thongkexuphathanhchinh/ThongKeTienXPHC_ChiTiet'

import ChiTietPAHT from '../screens/PhanAnhHienTruong/components/ChiTietPAHT';
import { ViewImageListShow } from '../../components';
import TraCuuXPHC from '../screens/TraCuuXuPhatHC/XuPhatHanhChinh'
import ChiTietXPHC from '../screens/TraCuuXuPhatHC/ChiTietXPHC'
import Modal_SearchFilter_TraCuu from '../screens/TraCuuXuPhatHC/ModalSearchFilter'
import ThongKeTrucBanTH from '../screens/thongketrucban/ThongKeXPHC';
import ChiTietTKTT from '../screens/thongketrucban/ChiTietTKTT'
import ChiTietThongKeDonViTrucBan from '../screens/thongketrucban/ChiTietThongKeDonVi';
import ThongKeQuaHan_ChiTiet from '../screens/thongketrucban/ThongKeQuaHan_ChiTiet';
import ChatMain from '../../chat/Router';
import AddGroupChat from '../../chat/Groupchat/AddGroupChat';
import HomeHotline from '../screens/main/QuanLyHotline/HomeHotline';
import ModalAddHotline from '../screens/main/QuanLyHotline/ModalAddHotline';
import ThongKeCanHoHome from '../screens/main/ThongKeCanHo/ThongKeCanHoHome';
import ComponentSelectPropsTree from '../../components/ComponentApps/ComponentSelectPropsTree';
import ChiTietTKCH from '../screens/main/ThongKeCanHo/ChiTietTKCH';
import DanhSachPhanAnhBD from '../screens/dashboard/DanhSachPhanAnhBD';
import DanhSachCTChung from '../screens/thongkexuphathanhchinh/DanhSachCTChung'
import ThuMoiHome from '../screens/main/QuanLyThuMoi/ThuMoiHome';
import ChiTietThuMoi from '../screens/main/QuanLyThuMoi/ChiTietThuMoi';
import HomeTaoPA from '../screens/main/TaoPhanAnh/HomeTaoPA';
import BanDoRoot_TaoPA from '../screens/main/TaoPhanAnh/BanDo_Root';
import AddUserCongDan from '../screens/main/TaoPhanAnh/AddUserCongDan';
import HomeThongBao from '../screens/ThongBao/HomeThongBao'
import TKCuaDonViHome from '../screens/ThongKeCuaDonVi/TKCuaDonViHome';
import TKCuaDonViCT from '../screens/ThongKeCuaDonVi/TKCuaDonViCT';
import HomeCDB from '../screens/ChuyenDeBiet/HomeCBD'
import HomeSOS from '../screens/SOS/HomeSOS';
import ModalFilterSOS from '../screens/SOS/ModalFilterSOS';
import ModalTinhTrang from '../screens/SOS/ModalTinhTrang';
import DetailsSOS from '../screens/SOS/DetailsSOS';
import ModalXuLySOS from '../screens/SOS/ModalXuLySOS';
import ModalChuyenSuaSOS from '../screens/SOS/ModalChuyenSuaSOS';
import ComponentSelectPropsMulti from '../../components/ComponentApps/ComponentSelectPropsMulti';
import ModalThongBao from '../screens/ModalThongBao/ModalThongBao'
import HomeCBCV from '../screens/CanhBaoCovid/HomeCBCV';
import DetailsCBCV from '../screens/CanhBaoCovid/DetailsCBCV';
import ModalFilterCBCV from '../screens/CanhBaoCovid/ModalFilterCBCV';
import ModalChuyenSuaCBCV from '../screens/CanhBaoCovid/ModalChuyenSuaCBCV';
import ModalXuLyCBCV from '../screens/CanhBaoCovid/ModalXuLySOS';
import ModalFilterTT from '../screens/main/PhanAnhTuongTac/ModalFilterTT';
import ThongKeAdminHome from '../screens/ThongKeAdmin/TKCuaDonViHome';
import TKAdminChiTiet from '../screens/ThongKeAdmin/TKCuaDonViCT';
import TongQuan from '../screens/dashboardNew/ChartTongQuan';
import DonVi from '../screens/dashboardNew/ChartDonVi';
import LinhVuc from '../screens/dashboardNew/ChartLinhVuc';
import TabBarBieuDo from '../screens/dashboardNew/Component/TabBarBieuDo';
import Modal_List_LinhVuc from '../screens/dashboardNew/Component/Modal_List_LinhVuc';
import DetailsChart from '../screens/dashboardNew/Component/DetailsChart';
//end chat
//deepLink app123456://app/root/main
/**
 * Router app thêm vào đây
 */


//end

const MainStack = createStackNavigator(
  {
    scHome: {
      screen: Home,
      path: 'sctrangchu',
      navigationOptions: {
        header: null,
        animationEnabled: true
      }
    },
    scCardCheck: CardUpload,
    scChatStack: ChatMain
  },
  {
    headerMode: 'none'
  }
);
const LoginStack = createStackNavigator(
  {
    st_Login: {
      screen: Login,
      navigationOptions: {
        header: null,
        animationEnabled: true
      }
    },
    st_QuenMk: {
      screen: QuenMK,
      navigationOptions: {
        header: null,
        animationEnabled: true
      }
    },
    st_XacNhanOTP: {
      screen: XacNhanOTP,
      navigationOptions: {
        header: null,
        animationEnabled: true
      }
    },
    //DangKyTaiKhoan
    st_DangKyTaiKhoan: {
      screen: DangKyTaiKhoan,
      navigationOptions: {
        header: null,
        animationEnabled: true
      }
    }
  },
  {
    headerMode: 'none'
  }
);

const HomePAHTStack = createStackNavigator(
  {
    scHomePAHT: {
      screen: HomePAHT,
      path: 'danhsach/:id'
    },
    sc_ChiTietPhanAnh: {
      screen: ChiTietPAHT,
      path: 'ctpa/:IdPA',
      navigationOptions: {
        header: null,
        animationEnabled: true
      }
    }
  },
  {
    headerMode: 'none'
  }
);

const HomeDuLichStack = createStackNavigator(
  {
    scHomeDL: {
      screen: HomePAHT,
      path: 'danhsach',
    },
    sc_ChiTietDuLich: {
      screen: ChiTietPAHT,
      path: 'ctdl/:IdPA',
      navigationOptions: {
        header: null,
        animationEnabled: true
      }
    },
  },
  {
    headerMode: 'none'
  }
);

const HomeKiemSoatPAStack = createStackNavigator(
  {
    scHomeKiemSoat: HomePAHT,
    sc_ChiTietKiemSoatPA: {
      screen: ChiTietPAHT,
      navigationOptions: {
        header: null,
        animationEnabled: true
      }
    }
  },
  {
    headerMode: 'none'
  }
);

const HomeAnSinhXaHoiStack = createStackNavigator(
  {
    scHomeAnSinh: HomePAHT,
    sc_ChiTietAnSinhXaHoi: {
      screen: ChiTietPAHT,
      navigationOptions: {
        header: null,
        animationEnabled: true
      }
    }
  },
  {
    headerMode: 'none',
    initialRouteName: 'scHomeAnSinh'
  }
);
const HomePANBStack = createStackNavigator(
  {
    scHomePANB: HomePAHT,
    sc_ChiTietPhanAnhNB: {
      screen: ChiTietPAHT,
      path: 'ctpanb/:IdPA',
      navigationOptions: {
        header: null,
        animationEnabled: true
      }
    }
  },
  {
    headerMode: 'none'
  }
);

const HomePADXLStack = createStackNavigator(
  {
    scHomePADXL: HomePAHT,
    sc_ChiTietPhanAnhDXL: {
      screen: ChiTietPAHT,
      navigationOptions: {
        header: null,
        animationEnabled: true
      }
    }
  },
  {
    headerMode: 'none'
  }
);


//Chuyển để biết
const HomeChuyenDeBietStack = createStackNavigator(
  {
    scChuyenDeBiet: HomeCDB,
    sc_ChiTietPhanAnhCDB: {
      screen: ChiTietPAHT,
      navigationOptions: {
        header: null,
        animationEnabled: true
      }
    }
  },
  {
    headerMode: 'none'
  }
);
const HomePAChoTN = createStackNavigator(
  {
    scHomePAChoTN: HomePAHT,
    sc_ChiTietPAChoTN: {
      screen: ChiTietPAHT,
      navigationOptions: {
        header: null,
        animationEnabled: true
      }
    }
  },
  {
    headerMode: 'none'
  }
);
const HomePAChoPP = createStackNavigator(
  {
    scHomePAChoPP: HomePAHT,
    sc_ChiTietPAChoPP: {
      screen: ChiTietPAHT,
      navigationOptions: {
        header: null,
        animationEnabled: true
      }
    }
  },
  {
    headerMode: 'none'
  }
);
const HomePAChoXL = createStackNavigator(
  {
    scHomePAChoXL: HomePAHT,
    sc_ChiTietPAChoXL: {
      screen: ChiTietPAHT,
      navigationOptions: {
        header: null,
        animationEnabled: true
      }
    }
  },
  {
    headerMode: 'none'
  }
);
const HomePAChoPD = createStackNavigator(
  {
    scHomePAChoPD: HomePAHT,
    sc_ChiTietPAChoPD: {
      screen: ChiTietPAHT,
      navigationOptions: {
        header: null,
        animationEnabled: true
      }
    }
  },
  {
    headerMode: 'none'
  }
);
const HomePAChoDT = createStackNavigator(
  {
    scHomePAChoDT: HomePAHT,
    sc_ChiTietPAChoDT: {
      screen: ChiTietPAHT,
      navigationOptions: {
        header: null,
        animationEnabled: true
      }
    }
  },
  {
    headerMode: 'none'
  }
);

const HomePADonViTungPhuTrach = createStackNavigator(
  {
    scHomePADonViTungPhuTrach: HomePAHT,
    sc_ChiTietPADonViTungPhuTrach: {
      screen: ChiTietPAHT,
      navigationOptions: {
        header: null,
        animationEnabled: true
      }
    }
  },
  {
    headerMode: 'none'
  }
);



const ThongKeStack = createStackNavigator(
  {
    scHomeThongKe: ThongKeHome,
    scSoLieuThongKe: SoLieuThongKe
  },
  {
    headerMode: 'none'
  }
);
const ThongKeCanHoStack = createStackNavigator(
  {
    scHomeThongKeCanHo: ThongKeCanHoHome,
  },
  {
    headerMode: 'none'
  }
);

const ThongBaoStack = createStackNavigator(
  {
    scThongBao: ThongBao
  },
  {
    headerMode: 'none'
  }
);
//ThongBao
//ThongKeHome
const PhanAnhMoRongStack = createStackNavigator(
  {
    scHomePAMR: DSNoCheck,
    sc_ChiTietPhanAnh: ChiTietPAHT
  },
  {
    headerMode: 'none'
  }
);
const PhanAnhCoTuongTac = createStackNavigator(
  {
    scPAtuongtac: {
      screen: homePhanAnhTT,
      path: 'dstuongtac/:ID'
    }

  },
  {
    headerMode: 'none'
  }
);
//XuPhatHanhChinh
//homePhanAnhTT

//QuenMK
const DSHuyStack = createStackNavigator(
  {
    scDanhSachHuy: DSHuy,
    sc_ChiTietHuy: ChiTietPAHT
  },
  {
    headerMode: 'none'
  }
);
//RootMap
//home cảnh báo
const CanhBaoStack = createStackNavigator(
  {
    schomeCanhBao: HomeCanhBao,
    sc_ChiTietCB: ChiTietCanhBao,
    sc_ChiTietTuongTac: {
      screen: ChiTietTuongTac,
      path: 'cttt/:id'
    }
  },
  {
    headerMode: 'none'
  }
);
const HotlineStack = createStackNavigator(
  {
    schomeHotline: HomeHotline,
    sc_ChiTietHotlint: ChiTietCanhBao,
    sc_ChiTietTuongTac: {
      screen: ChiTietTuongTac,
    }
  },
  {
    headerMode: 'none'
  }
);
//
const CovidStack = createStackNavigator(
  {
    sc_homecovid: RootMap,
    sc_chiTietTracking: {
      screen: CTCanhBaoTracking,
      path: 'ct_tracking/:id'
    },
    sc_Filtertracking: {
      screen: Filtertracking
    },
    sc_MapPolyline: {
      screen: MapPolyline
    }
    // sc_ChiTietCB: ChiTietCanhBao,
    // sc_chiTietTracking: {
    //     screen: CTCanhBaoTracking,
    //     path: 'ct_tracking/:id'
    // }
  },
  {
    initialRouteName: 'sc_homecovid',
    headerMode: 'none'
  }
);

//XuPhatHanhChinh
const XuPhatHanhChinhStack = createStackNavigator(
  {
    scXuPhatHanhChinh: XuPhatHanhChinh,
    scThemXuPhatHC: FormXuPhatHC,
    Modal_DanhSachCDViPham: DanhSachCDViPham
  },
  {
    headerMode: 'none'
  }
);
const ThongKeXPHCStack = createStackNavigator(
  {
    scThongKeXPHC: ThongKeXPHC,
    scBDXPTheoThoiHan: BDXPTheoThoiHan,
    // scThemXuPhatHC: FormXuPhatHC,
    DanhSachCTChung: DanhSachCTChung,
    Modal_DanhSachTKXPHC: DanhSachCDViPham,
    sc_ChiTietThongKeDonVi: ChiTietThongKeDonVi,
    sc_ThongKeTienXPHC_ChiTiet: ThongKeTienXPHC_ChiTiet,
    Modal_ChiTietTKDV: FormXuPhatHC,
    sc_ChiTietXuPhatHC: ChiTietPAHT,
  },
  {
    headerMode: 'none'
  }
);
const ThongKeTrucBanTHstack = createStackNavigator(
  {
    scThongKeTrucBanTH: ThongKeTrucBanTH,
    Modal_ChiTietTKTT: ChiTietTKTT,
    scChiTietThongKeDonViTrucBan: ChiTietThongKeDonViTrucBan,
    sc_ChiTietPhanAnhTrucBan: ChiTietPAHT,
    // scBDXPTheoThoiHan: BDXPTheoThoiHan,
    // // scThemXuPhatHC: FormXuPhatHC,
    // // Modal_DanhSachCDViPham: DanhSachCDViPham,
    // sc_ChiTietThongKeDonVi: ChiTietThongKeDonVi,
    // sc_ThongKeTienXPHC_ChiTiet: ThongKeTienXPHC_ChiTiet,
    // Modal_ChiTietTKDV: FormXuPhatHC,
    scThongKeQuaHan_ChiTiet: ThongKeQuaHan_ChiTiet
  },
  {
    headerMode: 'none'
  }
);
const ThongKeCuaDVstack = createStackNavigator(
  {
    scThongKeCuaDonVi: TKCuaDonViHome,
    scChiTietTKCuaDonVi: TKCuaDonViCT,
    sc_ChiTietPhanAnhCuaDV: ChiTietPAHT,
  },
  {
    headerMode: 'none'
  }
);
const ThongKeAdminHomeStack = createStackNavigator(
  {
    scThongKeAdminHome: ThongKeAdminHome,
    scChiTietTKAdmin: TKAdminChiTiet,
    sc_ChiTietPAAdmin: ChiTietPAHT,
  },
  {
    headerMode: 'none'
  }
);
// ThongKeTrucBanTH
const stackTraCuuXPHC = createStackNavigator(
  {
    homexuphathc: {
      screen: TraCuuXPHC,
      navigationOptions: {
        header: null,
        animationEnabled: true
      },
    },
    ModalChitietXuPhat: {
      screen: ChiTietXPHC,
      path: 'chitietxuphat/:ID',
      navigationOptions: {
        header: null,
        animationEnabled: true
      },
    }
  },
  {
    initialRouteName: 'homexuphathc',
    headerMode: 'none'
  }
);
const ThuMoiStack = createStackNavigator(
  {
    scHomeThuMoi: ThuMoiHome,
    scChiTietThuMoi: ChiTietThuMoi,
  },
  {
    initialRouteName: 'scHomeThuMoi',
    headerMode: 'none'
  }
);

const stackSOS = createStackNavigator(
  {
    scHomeSOS: {
      screen: HomeSOS,
      path: 'homesos'
    },
    scDetailsSOS: {
      screen: DetailsSOS,
      path: 'detailsos/:ID'
    }
  },
  {
    initialRouteName: 'scHomeSOS',
    headerMode: 'none'
  }
)

const stackCBCV = createStackNavigator(
  {
    scHomeCBCV: {
      screen: HomeCBCV,
      path: ''
    },
    scDetailsCBCV: {
      screen: DetailsCBCV,
      path: 'chitietcbcv/:ID'
    }
  }, {
  initialRouteName: 'scHomeCBCV',
  headerMode: 'none'
}
)

const TabBottomBieudo = createBottomTabNavigator({
  tab_TongQuan: {
    screen: TongQuan,
    navigationOptions: {
      header: null,
      animationEnabled: true
    },
  },
  tab_DonVi: {
    screen: DonVi,
    navigationOptions: {
      header: null,
      animationEnabled: true
    },
  },
  tab_LinhVuc: {
    screen: LinhVuc,
    navigationOptions: {
      header: null,
      animationEnabled: true
    },
  },
},
  {
    initialRouteName: 'tab_TongQuan',
    swipeEnabled: false,
    animationEnabled: true,
    lazy: true,
    tabBarComponent: TabBarBieuDo,
  }
);
//SlideMenu
export const SlideStackDH = createDrawerNavigator(
  {
    ManHinh_TrangChu: {
      screen: MainStack,
      path: 'stacktrangchu',
      navigationOptions: {
        header: null,
        animationEnabled: true
      }
    },
    // Dashboard_ThongKe: { // dùng cho thái nguyên
    //   screen: TabBottomBieudo,
    //   navigationOptions: {
    //     header: null,
    //     animationEnabled: true,
    //     tabBarVisible: false,
    //   }
    // },
    Dashboard_ThongKe: Dashboard,
    Home_Chat: {
      screen: ChatMain,
      path: 'stackchat'
    },
    //Thong tin user
    ManHinh_ThongTinTaiKhoan: InfoUser,
    // phản ánh hiện trường
    stackHomePAHT: {
      screen: HomePAHTStack,
      path: 'homestack',
      navigationOptions: {
        header: null,
        animationEnabled: true
      }
    },
    stackAnSinhXaHoi: {
      screen: HomeAnSinhXaHoiStack,
      // path: 'homestack',
      navigationOptions: {
        header: null,
        animationEnabled: true
      }
    },
    stackHomeDL: {
      screen: HomeDuLichStack,
      path: 'homestackdulich',
      navigationOptions: {
        header: null,
        animationEnabled: true
      }
    },
    stackHomePADXL: {
      screen: HomePADXLStack,
      navigationOptions: {
        header: null,
        animationEnabled: true
      }
    },
    stackHomePAChoTN: {
      screen: HomePAChoTN,
      navigationOptions: {
        header: null,
        animationEnabled: true
      }
    },
    stackHomePAChoPP: {
      screen: HomePAChoPP,
      navigationOptions: {
        header: null,
        animationEnabled: true
      }
    },
    stackHomePAChoXL: {
      screen: HomePAChoXL,
      navigationOptions: {
        header: null,
        animationEnabled: true
      }
    },
    stackHomePAChoPD: {
      screen: HomePAChoPD,
      navigationOptions: {
        header: null,
        animationEnabled: true
      }
    },
    stackHomeCBD: {
      screen: HomeChuyenDeBietStack,
      navigationOptions: {
        header: null,
        animationEnabled: true
      }
    },
    stackHomePAChoDT: {
      screen: HomePAChoDT,
      navigationOptions: {
        header: null,
        animationEnabled: true
      }
    },
    stackHomePADonViTungPhuTrach: {
      screen: HomePADonViTungPhuTrach,
      navigationOptions: {
        header: null,
        animationEnabled: true
      }
    },
    stackHomePANB: {
      screen: HomePANBStack,
      path: 'homestackPANB'
    },
    //Kiêm soát phản ánh
    stackHomeKiemSoatPA: {
      screen: HomeKiemSoatPAStack,
      navigationOptions: {
        header: null,
        animationEnabled: true
      }
    },

    stackXuPhatHanhChinh: XuPhatHanhChinhStack,
    stackTraCuuXPHC: stackTraCuuXPHC,
    stackThongKeTrucBanTH: ThongKeTrucBanTHstack,
    //thống kê sử phạt hành chính
    stackThongKeXPHC: ThongKeXPHCStack,
    stackThongKeCuaDonVi: ThongKeCuaDVstack,
    stackThongKeAdminHome: ThongKeAdminHomeStack,
    stackThongKe: ThongKeStack,
    stackThongBao: ThongBaoStack,
    stackDSHuy: {
      screen: DSHuyStack,
      path: 'stackDSHuy'
    },
    stackHomePAMR: {
      screen: PhanAnhMoRongStack,
      path: 'homePAMR'
    },
    stackTuongTac: {
      screen: PhanAnhCoTuongTac,
      path: 'stacktt'
    },
    stackThongKeCanHo: ThongKeCanHoStack,

    stackCanhBao: {
      screen: CanhBaoStack,
      path: 'stackcb'
    },
    stackHotline: {
      screen: HotlineStack
    },
    stackCovid: {
      screen: CovidStack,
      path: 'stackCoVid'
    },
    stackThuMoi: ThuMoiStack,
    stackSOS: {
      screen: stackSOS,
      path: 'stacksos'
    },
    ManHinhGopYIOC: {
      screen: ModalThongBao,
      path: 'thongbaoioc'
    },
    //Thong bao
    //CovidStack
    stackCBCV: {
      screen: stackCBCV,
      path: 'stcbcovid'
    }
  },
  {
    drawerWidth: 320, //chưa kiểm tra isPad
    drawerPosition: 'left',
    contentComponent: SideMenuApp,
    disableGestures: true,
    overlayColor: 'rgba(0,0,0,0.5)',
    drawerBackgroundColor: 'transparent',
    unmountInactiveRoutes: true // Load lại khi click drawer
  }
);

// const AuthStack = createStackNavigator({
//     sw_Login: {
//         screen: Login,
//         navigationOptions: { header: null, animationEnabled: true }
//     }
// });

/**
 * Router Gốc không thay đổi.
 */

export const RootStackDH = createSwitchNavigator(
  {
    sw_RootDH: {
      screen: RootScreen,
      navigationOptions: {
        header: null
      }
    },
    Modal_StartedScreen: StartedScreen,
    sw_Login: {
      screen: LoginStack,
      navigationOptions: {
        header: null,
        animationEnabled: true
      }
    },
    sw_Main: {
      screen: SlideStackDH,
      path: 'main',
      navigationOptions: {
        header: null,
        animationEnabled: true
      }
    }
    // sw_SlideMenu: {
    //     screen: SlideStack,
    //     navigationOptions: {
    //         header: null,
    //         animationEnabled: true
    //     }
    // },
  },
  {
    headerMode: 'none',
    navigationOptions: {
      gesturesEnabled: false,
      tabBarVisible: false,
    }
  }
);

export const ConfigScreenDH = {
  Modal_ListTrangThai: 'Modal_ListTrangThaiDH',
  Modal_XacMinhPA: 'Modal_XacMinhPADH',
  Modal_HomeSetting: 'Modal_HomeSettingDH',
  Modal_ModalTraBuocTruoc: 'Modal_ModalTraBuocTruocDH',
  Modal_ModalXemSuaNhatKy: 'Modal_ModalXemSuaNhatKyDH',
  Modal_ModalCapNhatHanXuLy: 'Modal_ModalCapNhatHanXuLyDH',
  Modal_ShowListImage: 'Modal_ShowListImageDH',
  Modal_HuyPAHT: 'Modal_HuyPAHTDH',
  Modal_XuLy: 'Modal_XuLyDH',
  Modal_XemVideo: 'Modal_XemVideoDH',
  Modal_TraoDoi: 'Modal_TraoDoiDH',
  Modal_PhanPhoi: 'Modal_PhanPhoiDH',
  Modal_AutocompleteMap: 'Modal_AutocompleteMapDH',
  Modal_MapChiTietPA: 'Modal_MapChiTietPADH',
  Modal_XoaSuaPhanAnh: 'Modal_XoaSuaPhanAnhDH',
  Modal_DoiMatKhau: 'Modal_DoiMatKhauDH',
  Modal_DonVi: 'Modal_DonViDH',
  Modal_File: 'Modal_FileDH',
  Modal_ThemNguoiDuyet: 'Modal_ThemNguoiDuyetDH',
  Modal_Language: 'Modal_LanguageDH',
  Modal_BrowserInApp: 'Modal_BrowserInAppDH',
  Modal_DatePickList: 'Modal_DatePickListDH',
  Modal_RecordVideo: 'Modal_RecordVideoDH',
  Modal_TakeCamera: 'Modal_TakeCameraDH',
  Modal_PlayMedia: 'Modal_PlayMediaDH',
  Modal_MediaPicker: 'Modal_MediaPickerDH',
  Modal_DropDown: 'Modal_DropDownDH',
  Modal_FileAttached: 'Modal_FileAttachedDH',
  sc_BanDo_Root: 'sc_BanDo_RootDH',
  Modal_Options: 'Modal_OptionsDH',
  ModalCamVideoCus: 'ModalCamVideoCusDH',
  Modal_TuongTu: 'Modal_TuongTuDH',
  Modal_TTDonViPhuTrach: 'Modal_TTDonViPhuTrachDH',
  Modal_SearchFilter: 'Modal_SearchFilterDH',
  Modal_ComponentSelectProps: 'Modal_ComponentSelectPropsDH',
  Modal_ComponentSelectPropsTree: 'Modal_ComponentSelectPropsTreeDH',
  FormTaoTaiKhoan: 'FormTaoTaiKhoanDH',
  Modal_EditHTML: 'Modal_EditHTMLDH',
  Modal_AddGroupChat: 'Modal_AddGroupChatDH',
  Modal_AddHotline: 'Modal_AddHotlineDH',
  Modal_SearchFilter_TraCuu: 'Modal_SearchFilter_TraCuuDH',
  Modal_ChiTietTKCH: 'Modal_ChiTietTKCHDH',
  DanhSachPhanAnhBD: 'DanhSachPhanAnhBDDH',
  Modal_ChiTietPA: 'Modal_ChiTietPADH',
  Modal_ChiTietXPC: 'Modal_ChiTietXPCDH',
  Modal_HomeTaoPA: "Modal_HomeTaoPA",
  Modal_BanDo_Root2: "Modal_BanDo_Root2",
  Modal_AddUserCongDan: "Modal_AddUserCongDan",
  Modal_HomeThongBao: "Modal_HomeThongBao",
  Modal_FilterSOS: "ModalFilterSOSDH",
  Modal_TinhTrangSOS: 'Modal_TinhTrangSOSDH',
  Modal_XuLySOS: 'Modal_XuLySOSDH',
  Modal_ChuyenSuaSOS: 'Modal_ChuyenSuaSOSDH',
  Modal_ComponentSelectProps_Multi: 'Modal_ComponentSelectProps_MultiDH',
  Modal_FilterCBCV: 'Modal_FilterCBCV',
  Modal_ChuyenSuaCBCV: 'Modal_ChuyenSuaCBCV',
  Modal_XuLyCBCV: 'Modal_XuLyCBCV',
  Modal_FilterTT: 'Modal_FilterTT',
  Modal_List_LinhVuc: 'Modal_List_LinhVuc',
  Modal_DetailsChart: 'Modal_DetailsChart',
  // Modal_ThongBao: 'Modal_ThongBao',
}

export const ModalAdmin = {
  [ConfigScreenDH.Modal_ListTrangThai]: ListTrangThai,
  [ConfigScreenDH.Modal_DetailsChart]: DetailsChart,
  [ConfigScreenDH.Modal_List_LinhVuc]: Modal_List_LinhVuc,
  [ConfigScreenDH.Modal_XacMinhPA]: ModalXacMinhPA,
  [ConfigScreenDH.Modal_HomeSetting]: HomeSetting,
  [ConfigScreenDH.Modal_ModalTraBuocTruoc]: ModalTraBuocTruoc,
  [ConfigScreenDH.Modal_ModalXemSuaNhatKy]: Modal_XemSuaNhatKy,
  [ConfigScreenDH.Modal_ModalCapNhatHanXuLy]: ModalCapNhatHanXuLy,
  [ConfigScreenDH.Modal_ShowListImage]: ViewImageListShow,
  [ConfigScreenDH.Modal_HuyPAHT]: ModalHuyPA,
  [ConfigScreenDH.Modal_XuLy]: ModalXuLyChung,
  [ConfigScreenDH.Modal_XemVideo]: ModalXemVideo,
  [ConfigScreenDH.Modal_TraoDoi]: ModalNoiDungTraoDoi,
  [ConfigScreenDH.Modal_PhanPhoi]: ModalPhanPhoi,
  [ConfigScreenDH.Modal_AutocompleteMap]: AutocompleteMap,
  [ConfigScreenDH.Modal_MapChiTietPA]: MapChiTietPA,
  [ConfigScreenDH.Modal_XoaSuaPhanAnh]: ModalXoaSuaPhanAnh,
  [ConfigScreenDH.Modal_DoiMatKhau]: Modal_ChangePassword,
  [ConfigScreenDH.Modal_DonVi]: Modal_DonVi,
  [ConfigScreenDH.Modal_File]: ModalFile,
  [ConfigScreenDH.Modal_ThemNguoiDuyet]: ModalThemNPDuyet,

  [ConfigScreenDH.Modal_HomeTaoPA]: HomeTaoPA,
  [ConfigScreenDH.Modal_BanDo_Root2]: BanDoRoot_TaoPA,
  [ConfigScreenDH.Modal_AddUserCongDan]: AddUserCongDan,
  //***** Modal components Chung * ko cần xoá ******
  [ConfigScreenDH.Modal_Language]: Language,
  [ConfigScreenDH.Modal_BrowserInApp]: BrowserInApp,
  [ConfigScreenDH.Modal_DatePickList]: DatePickList,
  [ConfigScreenDH.Modal_RecordVideo]: RecordVideo,
  [ConfigScreenDH.Modal_TakeCamera]: TakeCamera,
  [ConfigScreenDH.Modal_PlayMedia]: PlayMedia,
  [ConfigScreenDH.Modal_MediaPicker]: MediaPicker,
  [ConfigScreenDH.Modal_DropDown]: DropDownCus,
  [ConfigScreenDH.Modal_FileAttached]: DanhSachFileDK,
  [ConfigScreenDH.sc_BanDo_Root]: BanDo_Root,
  [ConfigScreenDH.Modal_Options]: ModalOption,
  [ConfigScreenDH.ModalCamVideoCus]: CamVideoCus,
  [ConfigScreenDH.Modal_TuongTu]: ModalTuongTu,
  [ConfigScreenDH.Modal_TTDonViPhuTrach]: ModalTTDonVi,
  [ConfigScreenDH.Modal_SearchFilter]: ModalSearchFilter,
  [ConfigScreenDH.Modal_ComponentSelectProps]: ComponentSelectProps,
  [ConfigScreenDH.Modal_ComponentSelectPropsTree]: ComponentSelectPropsTree,
  [ConfigScreenDH.FormTaoTaiKhoan]: FormTaoTaiKhoan,
  [ConfigScreenDH.Modal_EditHTML]: ModalEditHTML,
  [ConfigScreenDH.Modal_AddGroupChat]: AddGroupChat,
  [ConfigScreenDH.Modal_AddHotline]: ModalAddHotline,
  [ConfigScreenDH.Modal_SearchFilter_TraCuu]: Modal_SearchFilter_TraCuu,
  // Modal_ChiTietTKTT: ChiTietTKTT,
  [ConfigScreenDH.Modal_ChiTietTKCH]: ChiTietTKCH,
  [ConfigScreenDH.DanhSachPhanAnhBD]: DanhSachPhanAnhBD,
  [ConfigScreenDH.Modal_ChiTietPA]: ChiTietPAHT,
  // DanhSachCTChung: DanhSachCTChung,
  [ConfigScreenDH.Modal_ChiTietXPC]: FormXuPhatHC,
  [ConfigScreenDH.Modal_HomeThongBao]: HomeThongBao,
  [ConfigScreenDH.Modal_FilterSOS]: ModalFilterSOS,
  [ConfigScreenDH.Modal_TinhTrangSOS]: ModalTinhTrang,
  [ConfigScreenDH.Modal_XuLySOS]: ModalXuLySOS,
  [ConfigScreenDH.Modal_ChuyenSuaSOS]: ModalChuyenSuaSOS,
  [ConfigScreenDH.Modal_ComponentSelectProps_Multi]: ComponentSelectPropsMulti,
  [ConfigScreenDH.Modal_FilterCBCV]: ModalFilterCBCV,
  [ConfigScreenDH.Modal_ChuyenSuaCBCV]: ModalChuyenSuaCBCV,
  [ConfigScreenDH.Modal_XuLyCBCV]: ModalXuLyCBCV,
  // [ConfigScreenDH.Modal_ThongBao]: ModalThongBao,
  [ConfigScreenDH.Modal_FilterTT]: ModalFilterTT

}
