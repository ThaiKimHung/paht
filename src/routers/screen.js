import {
    createStackNavigator, createBottomTabNavigator,
    createSwitchNavigator, createDrawerNavigator, getActiveChildNavigationOptions
} from 'react-navigation';
import {
    Easing, Animated, Image, Text, View
} from 'react-native';

// -- Root Screen + Component native custom  *
// import MsgBox from '../components/MsgBox';
import RootScreen from '../screens/RootScreen';
import {
    MsgBox,
    BrowserInApp,
    DatePickList,
    MediaPicker,
    TakeCamera,
    RecordVideo,
    PlayMedia,
    ViewImageListShow
} from '../../components';

import TabBarHome from './TabBarHome'

// -- Các màn hình App
import {
    CongDong,
    ChiTietPhanAnh,
    DanhSachFileDK,
    Search
} from '../screens/Home';

import {
    CaNhan,
    DaGui,
    BanNhap
} from '../screens/TabCaNhan';
import {
    MapHome,
    MapChiTietPA
} from '../screens/Maps';

import Language from '../screens/Language';
import Login from '../screens/user/Login';
import GuiPhanAnhRoot from '../screens/Gui_PhanAnh/GuiPhanAnh_Root';
import QuenMatKhau from '../screens/user/QuenMatKhau';
import DangKyTaiKhoan from '../screens/user/DangKyTaiKhoan';
import ModalThongTinUser from '../screens/user/ModalThongTinUser';
import ModalXacNhanOPT from '../screens/user/ModalXacNhanOPT';
import ModalThongBao from '../screens/user/ModalThongBao';
import BanDo_Root from '../screens/Gui_PhanAnh/BanDo_Root';
import AutocompleteMap from '../screens/Gui_PhanAnh/popUpComponent/AutocompleteMap';
import DoiMatKhau from '../screens/user/DoiMatKhau';
import Notification from '../screens/Home/Thongbao/Notification';
import Drawer from '../screens/DrawerHome/Drawer';
import { nstyles, Width } from '../../styles/styles';
import QuanTam from '../screens/Warning/QuanTam';
import ChuyenMuc from '../screens/Warning/ChuyenMuc';
import { Images } from '../images';
import { colors } from '../../styles';
import HomeDrawer from '../screens/Home/HomeDrawer';

import ModalChitietCanhBao from '../screens/Warning/ModalChitietCanhBao';
import ModalChitietChuyenMuc from '../screens/Warning/ModalChitietChuyenMuc';
import TabBarCanhBao from './TabBarCanhBao';
import RootMap from '../screens/Home/coronamap/RootMap';
import ThongTinNguoiNhiem from '../screens/Home/coronamap/ThongTinNguoiNhiem';
import DangKyHome from '../screens/Home/coronamap/DangKyHome';
import HomeTuyenTruyen from '../screens/Home/tuyentruyen/HomeTuyenTruyen';
import ListViewVideoPlay from '../screens/Home/tuyentruyen/ListViewVideoPlay';
import ModalChuyenMuc from '../screens/Home/ModalChuyenMuc';
import KhanCap from '../screens/Home/components/KhanCap';
import StartedScreen from '../screens/StartedScreen';
import ModalHuongDanVT from '../screens/Home/components/ModalHuongDanVT';
import ComponentSelectProps from '../../components/ComponentApps/ComponentSelectProps';
import XuPhatHanhChinh from '../screens/TraCuuXuPhatHC/XuPhatHanhChinh'
import ModalSearchFilter from '../screens/TraCuuXuPhatHC/ModalSearchFilter'
import ChiTietXPHC from '../screens/TraCuuXuPhatHC/ChiTietXPHC';

import DanhSachDonVi from '../screens/dichVuCong/DanhSachDonVi'
import DanhSachLinhVuc_DV from '../screens/dichVuCong/DanhSachLinhVuc_DV'
import DanhSachThuTuc from '../screens/dichVuCong/DanhSachThuTuc'
import HomeDVC from '../screens/dichVuCong/HomeDVC';
import TraCuuDVC from '../screens/dichVuCong/TraCuuDVC';
import QRHome from '../screens/dichVuCong/QRHome';
import ChiTietThuTuc from '../screens/dichVuCong/ChiTietThuTuc'
import HoSoDaGui from '../screens/dichVuCong/HoSoDaGui'
import ModalSearchFilterDVC from '../screens/dichVuCong/ModalSearchFilterDVC'
import ModalSearchHoSo from '../screens/dichVuCong/ModalSearchHoSo'
import ChiTietTB from '../screens/dichVuCong/ChiTietTB'
import ModalGiaCuoc from '../screens/dichVuCong/ModalGiaCuoc';
import ModalDangNhap from '../screens/dichVuCong/ModalDangNhap';
import HoiDapTT from '../screens/dichVuCong/HoiDapTT';
import DatCauHoi from '../screens/dichVuCong/DatCauHoi';
import ChiTietCauHoi from '../screens/dichVuCong/ChiTietCauHoi';
import ModalEditHTML from '../../components/rich-editor/ModalEditHTML'
import HomeTinTuc from '../screens/dichVuCong/TinTuc/HomeTinTuc';
import ChiTietTinTuc from '../screens/dichVuCong/TinTuc/ChiTietTinTuc';
import SettingTinTuc from '../screens/dichVuCong/TinTuc/SettingTinTuc';
import ModalFilterSetup from '../screens/TabCaNhan/ModalFilterSetup';
import ConponentSelectPropsRight from '../../components/ComponentApps/ConponentSelectPropsRight';
import RootStackScreenQuyhoach from '../sourcequyhoach/Navigations';
import SwitchIOC from '../sourceIOC/AppIOC';
import HomeThanhToan from '../screens/dichVuCong/thanhtoan/HomeThanhToan';
import BienLaiThanhToan from '../screens/dichVuCong/thanhtoan/BienLaiThanhToan';
import { ModalAdmin, RootStackDH } from '../../srcAdmin/routers/screen';
import Tabbar from './Tabbar';
import Utils from '../../app/Utils';
import CaiDat from '../screens/CaiDat'
import ChangeBackground from '../screens/CaiDat/ChangeBackground';
import ChangeHeaderHome from '../screens/CaiDat/ChangeHeaderHome';
import HomePersonal from '../screens/Personal/HomePersonal'
import stackHKG from '../../srcHKG/navigation';
import ChatMain from '../../chat/Router';
import ModalTimKiemChung from '../screens/TimKiem/ModalTimKiemChung';
import Modal_LogOut from '../screens/Personal/Modal_LogOut';
import HomeNotification from '../screens/Notifications/HomeNotification';
import Modal_TaiKhoan from '../screens/Personal/Modal_TaiKhoan';
import ThongBaoTH from '../screens/Home/Thongbao/ThongBaoTH';
import ChiTietTB_Chung from '../screens/Home/Thongbao/ChiTietTB'
import HomeCamera from '../CameraAnNinh/HomeCamera';
import SeenCamera from '../CameraAnNinh/SeenCamera';
import ListCamera from '../CameraAnNinh/ListCamera';
import UngCuuKhanCap from '../screens/SOS/UngCuuKhanCap';
import NetworkLoggerScreen from '../screens/NetworkLoggerScreen';
import LichSuSOS from '../screens/SOS/LichSuSOS';
import ChiTietSOS from '../screens/SOS/ChiTietSOS';
import GopY from '../screens/GopY_IOC/GopY'
import LichSuIOC from '../screens/GopY_IOC/LichSuIOC'
import ChiTietIOC from '../screens/GopY_IOC/ChiTietIOC'
import PhoneTaxi from '../screens/Home/components/PhoneTaxi'
import TrangChuDashBoard from '../screens/dashboardIOC/index'
import Modal_MonthYear from '../screens/dashboardIOC/Modal_MonthYear'
import GuiCanhBaoCovid from '../screens/CanhBaoCovid/GuiCanhBaoCovid';
import LichSuCanhBaoCovid from '../screens/CanhBaoCovid/LichSuCanhBaoCovid';
import ChiTietCanhBaoCovid from '../screens/CanhBaoCovid/ChiTietCanhBaoCovid';
import DashBoardIOC from '../screens/dashboardIOC/DashBoardIOC'
import HoSoSucKhoe from '../screens/dashboardIOC/HoSoSucKhoe'
import Tableau from '../screens/dashboardIOC/Tableau'
import DetailsTableau from '../screens/dashboardIOC/DetailsTableau';
import ModalScanQR from '../screens/user/ModalScanQR';
import ModalOTP from '../screens/user/ModalOTP';
import ModalScanQR_Info from '../screens/user/ModalScanQR_Info';
import XacThucQR from '../screens/dichVuCong/XacThucQR';
import MenuChongDich from '../screens/Home/components/MenuChongDich';
import Modal_ToKhaiYTe from '../screens/Home/components/ModalToKhaiYTe'
import CreateQR_TN from '../screens/user/CreateQR_TN';
import CheckInKiemDich from '../screens/dichVuCong/CheckInKiemDich';
import HomeThuVien from '../screens/Home/ThuVien/HomeThuVien';
import ListVieoImage from '../screens/Home/ThuVien/ListVideoImage';
import ListSound from '../screens/Home/ThuVien/ListSound';
import SoundPlay from '../screens/Home/ThuVien/SoundPlay';
import DangKyNhanh from '../screens/user/dangky/DangKyNhanh';
import ComponentSelectBottom from '../../components/ComponentApps/ComponentSelectBottom';
import ModalComfirm from '../screens/user/dangky/ModalComfirm';
import ModalMenuChild from '../screens/Home/ModalMenuChild';
import Introduction from '../screens/Introduction';
import DetailsUnit from '../screens/Introduction/DetailsUnit';
import ModalDropChuyenMuc from '../screens/Home/ModalDropChuyenMuc'
import CameraDiemDanhPAHT from '../screens/Camera/CameraDiemDanhPAHT';


import DanhSachChot from '../srcKiemDich/ChotKiemDich/DanhSachChot';
import QuetMa from '../srcKiemDich/ChotKiemDich/QuetMa';
import KetQuaQuet from '../srcKiemDich/ChotKiemDich/KetQuaQuet';
import LichSuQuet from '../srcKiemDich/ChotKiemDich/LichSuQuet';
import ChiTietLichSu from '../srcKiemDich/ChotKiemDich/ChiTietLichSu';
import CreateQR from '../srcKiemDich/TiemVaccine/CreateQR';
import ToKhaiYTe from '../srcKiemDich/ToKhaiYTe/ToKhaiYTe';
import MessCheckIn from '../screens/dichVuCong/MessCheckIn';
import LichSuCheckIn from '../srcKiemDich/CheckInCoQuan/LichSuCheckIn';
import ToKhaiYTeTaiNha from '../srcKiemDich/ToKhaiYTe/ToKhaiYteTaiNha';
import CamVideoCus from '../../components/CamVideo/CamVideoCus';
import ToKhaiDiChuyen from '../srcKiemDich/ToKhaiYTe/ToKhaiDiChuyen';
import BieuDoQuanTrac from '../screens/IOCQuanTrac/BieuDoQuanTrac';
import DSTramQuanTrac from '../screens/IOCQuanTrac/DSTramQuanTrac';
import DetailsChartsNuoc from '../screens/IOCQuanTrac/DetailsChartsNuoc';
import DetailsChartsKhongKhi from '../screens/IOCQuanTrac/DetailsChartsKhongKhi';
import HomeReputa from '../screens/IOCReputa/index'
import QuetMaChotCho from '../srcKiemDich/ChotDiCho/QuetMaChotCho';
import KetQuaQuetChotCho from '../srcKiemDich/ChotDiCho/KetQuaQuetChotCho';
import LichSuQuetChotCho from '../srcKiemDich/ChotDiCho/LichSuQuetChotCho';
import ChiTietLichSuChotCho from '../srcKiemDich/ChotDiCho/ChiTietLichSuChotCho';
import DanhSachChotCho from '../srcKiemDich/ChotDiCho/DanhSachChotCho';
import PhieuDiCho from '../srcKiemDich/ChotDiCho/PhieuDiCho';
import LichSuCheckInCho from '../srcKiemDich/ChotDiCho/LichSuCheckInCho';
import LichSuHoiDap from '../screens/dichVuCong/LichSuHoiDap';
import ChonDiemTiem from '../srcKiemDich/QLTaiDiemTiem/ChonDiemTiem';
import SubMenuTiem from '../srcKiemDich/QLTaiDiemTiem/SubMenuTiem';
import QuetMaTiem from '../srcKiemDich/QLTaiDiemTiem/QuetMaTiem';
import NhapMaCode from '../srcKiemDich/QLTaiDiemTiem/NhapMaCode';
import LichSuTiem from '../srcKiemDich/QLTaiDiemTiem/LichSuTiem';
import ChiTietLichSuTiem from '../srcKiemDich/QLTaiDiemTiem/ChiTietLichSuTiem';
import KetQuaQuetMaTiem from '../srcKiemDich/QLTaiDiemTiem/KetQuaQuetMaTiem';

// Hùng stask Quản lý cách ly
import QuanLyCachLy from '../screens/QLCachLy/QuanLyCachLy';
import ThongKeCachLyTaiNha from '../screens/QLCachLy/ThongKeCachLyTaiNha';
import ChiTietThongKeCachLy from '../screens/QLCachLy/ChiTietThongKeCachLy';
import ChiTietQuanLyCachLy from '../screens/QLCachLy/ChiTietQuanLyCachLy';


import UploadCMND from '../screens/user/UploadCMND';
import GiayThongHanh from '../screens/user/GiayThongHanh';
import GiayToKhac from '../screens/user/GiayToKhac';
import DangKyNhanHoTro from '../screens/DangKyNhanHoTro/DangKyNhanHoTro';
import QuetQRXacNhan from '../srcKiemDich/XacNhanHoTro/QuetQRXacNhan';
import GiaoThong from '../screens/GiaoThong_IOC/GiaoThong';
import ChiTietGiaoThong from '../screens/GiaoThong_IOC/ChiTietGiaoThong';
import DangKyGDD from '../screens/GiayDiDuong/DangKyGDD';
import LichSuDangKy from '../screens/GiayDiDuong/LichSuDangKy';
import ChiTietGDD from '../screens/GiayDiDuong/ChiTietGDD';
import ThongKeDangKyHome from '../screens/ThongKeDangKy/ThongKeDangKyHome';
import DSDuyetGDD from '../screens/GiayDiDuong/DSDuyetGDD';

import DSChiTietThongKe from '../screens/IOCReputa/DSChiTietThongKe';
import ChiTietXacNhanHoTro from '../srcKiemDich/XacNhanHoTro/ChiTietXacNhanHoTro';
import FormHoTroTuiAnSinh from '../screens/TuiAnSinhXH/GuiYCTuiAnSinh/FormHoTroTuiAnSinh';
import DSAnSinh from '../screens/TuiAnSinhXH/CongDong/DSAnSinh';
import DSAnSinhCaNhan from '../screens/TuiAnSinhXH/CaNhan/DSAnSinhCaNhan';
import HomeTabAnSinh from '../screens/TuiAnSinhXH/HomeTabAnSinh';
import ChiTietTuiAnSinh from '../screens/TuiAnSinhXH/ChiTietTuiAnSinh';
import SearchTuiAnSinh from '../screens/TuiAnSinhXH/SearchTuiAnSinh';
import MapHomeTuiAnSinh from '../screens/TuiAnSinhXH/MapHomeTuiAnSinh';
import LichSuGiupDo from '../screens/TuiAnSinhXH/CaNhan/LichSuGiupDo';
import CheckGiayThongHanh from '../srcKiemDich/ChotKiemDich/CheckGiayThongHanh';
import MultiSingleDate from '../../components/MultiSingleDate';
import Modal_YCDoiMatKhau from '../screens/Home/components/Modal_YCDoiMatKhau';
import TimKiemTienIch from '../screens/Maps/BanDoTienIch/TimKiemTienIch';
import DanhSachHoiDap_VTS from '../screens/HoiDapTT_VTS/DanhSachHoiDap_VTS';
import TabbarHoiDap from '../screens/HoiDapTT_VTS/TabbarHoiDap';
import LichSuHoiDap_VTS from '../screens/HoiDapTT_VTS/LichSuHoiDap_VTS'
import GuiCauHoi_VTS from '../screens/HoiDapTT_VTS/GuiCauHoi_VTS';
import ChiTietCauHoi_VTS from '../screens/HoiDapTT_VTS/ChiTietCauHoi_VTS';
import TimKiemCauHoi_VTS from '../screens/HoiDapTT_VTS/TimKiemCauHoi_VTS';
import HomeHoiDapVTS_Admin from '../screens/HoiDapTT_VTS/XuLyHoiDap/HomeHoiDapVTS_Admin';
import ModalFilterHoiDapTT from '../screens/HoiDapTT_VTS/XuLyHoiDap/ModalFilterHoiDapTT';
import ModalTinhTrangHoiDapTT from '../screens/HoiDapTT_VTS/XuLyHoiDap/ModalTinhTrangHoiDapTT';
import DetailsHoiDapTT_Admin from '../screens/HoiDapTT_VTS/XuLyHoiDap/DetailsHoiDapTT_Admin';
import ChuyenXuLyHoiDapTT from '../screens/HoiDapTT_VTS/XuLyHoiDap/ChuyenXuLyHoiDapTT';
import TraLai_KhongTiepNhanHoiTT from '../screens/HoiDapTT_VTS/XuLyHoiDap/TraLai_KhongTiepNhanHoiTT';
import TraLoiHoiTT from '../screens/HoiDapTT_VTS/XuLyHoiDap/TraLoiHoiTT';
import LichSuCauTraLoi from '../screens/HoiDapTT_VTS/XuLyHoiDap/LichSuCauTraLoi';
import HomeMapExtention from '../screens/Maps/BanDoTienIch/HomeMapExtention';
import DetailsTypeExtention from '../screens/Maps/BanDoTienIch/DetailsTypeExtention';
import DetailsExtensionMap from '../screens/Maps/BanDoTienIch/DetailsExtensionMap';
import DetailsLocations from '../screens/Maps/BanDoTienIch/DetailsLocations';
import HomeTabTuVanF0 from '../screens/TuVanF0/HomeTabTuVanF0';
import SearchTuVanF0 from '../screens/TuVanF0/SearchTuVanF0';
import DSTuVanF0 from '../screens/TuVanF0/CongDong/DSTuVanF0';
import FormTuVanF0 from '../screens/TuVanF0/GuiTuVanF0/FormTuVanF0';
import ChiTietTuVanF0 from '../screens/TuVanF0/ChiTietTuVanF0';
import DSTuVanF0CaNhan from '../screens/TuVanF0/CaNhan/DSTuVanF0CaNhan';
import MapHomeTuVanF0 from '../screens/TuVanF0/MapHomeTuVanF0';
import QuanLyDuAn from '../screens/Maps/QuanLyDuAn'
import YearPicker from '../../components/YearPicker';
import ChiTietDuAn from '../screens/Maps/QuanLyDuAn/ChiTietDuAn';
import CameraDuAn from '../screens/Maps/QuanLyDuAn/CameraDuAn';
//TuyenDung
import HomeTabTuyenDung from '../screens/SanViecLam/HomeTabTuyenDung';
import TinCaNhan from '../screens/SanViecLam/TinCaNhan/TinCaNhan';
import DanhSachTuyenDung from '../screens/SanViecLam/DanhSachTin/DanhSachTuyenDung';
import SearchTinTuyenDung from '../screens/SanViecLam/SearchTinTuyenDung';
import ChiTietTuyenDung from '../screens/SanViecLam/ChiTietTuyenDung';
import FormTuyenDung from '../screens/SanViecLam/GuiTuyenDung/FormTuyenDung';
import HomeKiemDuyetTuyenDung from '../screens/SanViecLam/KiemDuyet/HomeKiemDuyetTuyenDung';
import Modal_TinhTrangDuyet from '../screens/SanViecLam/KiemDuyet/Modal_TinhTrangDuyet';
import ModalFilterTuyenDung from '../screens/SanViecLam/KiemDuyet/ModalFilterTuyenDung';
import ChiTietKiemDuyetTuyenDung from '../screens/SanViecLam/KiemDuyet/ChiTietKiemDuyetTuyenDung';

// Sàn việc làm - SVL
import { Modal_ModuleSVL, TabViecTimNguoi, TabNguoiTimViec } from './screenSVL';
import HomeDrawer2 from '../screens/Home/HomeDrawer2';
import DLTM_Home from '../screens/DuLichThongMinh/DLTM_Home';
import DLTM_ChiTiet from '../screens/DuLichThongMinh/DLTM_ChiTiet';
import GiamSatGiaoThong from '../screens/GiaoThong_IOC/GiamSatGiaoThong';
import ChiTietGiamSatGiaoThong from '../screens/GiaoThong_IOC/ChiTietGiamSatGiaoThong';
import Modal_YearPickerNew from '../screens/TraCuuHocTap/Modal/Modal_YearPickerNew';
import TraCuuHocTap from '../screens/TraCuuHocTap/TraCuuHocTap';
import ThongTinLopHoc from '../screens/TraCuuHocTap/ThongTinLopHoc';
import KetQuaHocTap from '../screens/TraCuuHocTap/KetQuaHocTap';
import Policy from '../screens/Home/components/Policy';
import { Modal_Widget, StackThueNha, StackXeKhach } from '../Widgets';
import { StackRaoVat } from '../Widgets';

//deepLink app123456://app/root/main
/**
 * Router app thêm vào đây
*/

const stackCongDong = createStackNavigator(
    {
        CongDong: {
            screen: CongDong,
            navigationOptions: {
                header: null,
                animationEnabled: true
            },
        },
        Search
    },
    {
        headerMode: 'none'
    }
);

stackCongDong.navigationOptions = ({ navigation }) => {
    let tabBarVisible = true;
    if (navigation.state.routes.length > 1)
        if (navigation.state.routes[1].routeName == 'Search')
            tabBarVisible = false;
        else tabBarVisible = true;
    return { tabBarVisible };
};


const stackCaNhan = createStackNavigator(
    {
        CaNhan: {
            screen: CaNhan,
            path: 'canhan_st',
            navigationOptions: {
                header: null,
                animationEnabled: true
            },
        },
        Modal_ChiTietPhanAnhX: {
            screen: ChiTietPhanAnh,
            path: 'chitiet_st/:IdPA',
            navigationOptions: {
                header: null,
                animationEnabled: true
            },
        }
    },
    {
        headerMode: 'none',

    }
);




const TabBottom = createBottomTabNavigator({
    sc_CongDong: {
        screen: stackCongDong,
        path: 'congdongt',
        navigationOptions: {
            header: null,
            animationEnabled: true
        },
    },
    sc_CaNhan: {
        screen: stackCaNhan,
        path: 'canhan_t',
        navigationOptions: {
            header: null,
            animationEnabled: true
        },
    },
    sc_TaoPhanAnh: {
        screen: GuiPhanAnhRoot,
        path: 'guipat',
        navigationOptions: {
            header: null,
            animationEnabled: true
        },
    },
    // sc_CaNhan: stackCaNhan,
},
    {
        initialRouteName: 'sc_CongDong',
        swipeEnabled: false,
        animationEnabled: true,
        lazy: true,
        tabBarComponent: TabBarHome,
    }
);

const stackAnSinhCongDong = createStackNavigator(
    {
        sc_DSAnSinhCongDong: {
            screen: DSAnSinh,
            navigationOptions: {
                header: null,
                animationEnabled: true
            },
        },
        SearchTuiAnSinh
    },
    {
        headerMode: 'none'
    }
);

stackAnSinhCongDong.navigationOptions = ({ navigation }) => {
    let tabBarVisible = true;
    if (navigation.state.routes.length > 1)
        if (navigation.state.routes[1].routeName == 'SearchTuiAnSinh')
            tabBarVisible = false;
        else tabBarVisible = true;
    return { tabBarVisible };
};

const stackAnSinhCaNhan = createStackNavigator(
    {
        sc_DSAnSinhCaNhan: {
            screen: DSAnSinhCaNhan,
            path: 'scansinhcanhan',
            navigationOptions: {
                header: null,
                animationEnabled: true
            },
        },
        Modal_ChiTietTuiAnSinhNoti: {
            screen: ChiTietTuiAnSinh,
            path: 'chitiet_tuiansinh/:IdPA',
            navigationOptions: {
                header: null,
                animationEnabled: true
            },
        }
    },
    {
        headerMode: 'none',

    }
);

const TabBottomAnSinh = createBottomTabNavigator({
    tab_AnSinhCongDong: {
        screen: stackAnSinhCongDong,
        path: 'tabansinhcongdong',
        navigationOptions: {
            header: null,
            animationEnabled: true
        },
    },
    tab_AnhSinhCaNhan: {
        screen: stackAnSinhCaNhan,
        path: 'tabansinhcanhan',
        navigationOptions: {
            header: null,
            animationEnabled: true
        },
    },
    sc_YeuCauHoTroTuiAnSinh: {
        screen: FormHoTroTuiAnSinh,
        path: 'guihtansinh',
        navigationOptions: {
            header: null,
            animationEnabled: true
        },
    },
    // sc_CaNhan: stackCaNhan,
},
    {
        initialRouteName: 'tab_AnSinhCongDong',
        swipeEnabled: false,
        animationEnabled: true,
        lazy: true,
        tabBarComponent: HomeTabAnSinh,
    }
);
//ModalChitietCanhBao

const stackTuVanF0CongDong = createStackNavigator(
    {
        sc_DSTuVanF0CongDong: {
            screen: DSTuVanF0,
            navigationOptions: {
                header: null,
                animationEnabled: true
            },
        },
        SearchTuVanF0
    },
    {
        headerMode: 'none'
    }
);

stackTuVanF0CongDong.navigationOptions = ({ navigation }) => {
    let tabBarVisible = true;
    if (navigation.state.routes.length > 1)
        if (navigation.state.routes[1].routeName == 'SearchTuVanF0')
            tabBarVisible = false;
        else tabBarVisible = true;
    return { tabBarVisible };
};

const stackTuVanF0CaNhan = createStackNavigator(
    {
        sc_DSTuVanF0CaNhan: {
            screen: DSTuVanF0CaNhan,
            path: 'sctuvanf0canhan',
            navigationOptions: {
                header: null,
                animationEnabled: true
            },
        },
        Modal_ChiTietTuVanF0Noti: {
            screen: ChiTietTuVanF0,
            path: 'chitiettuvanf0/:IdPA',
            navigationOptions: {
                header: null,
                animationEnabled: true
            },
        }
    },
    {
        headerMode: 'none',
    }
);

const TabBottomTuVanF0 = createBottomTabNavigator({
    tab_TuVanF0CongDong: {
        screen: stackTuVanF0CongDong,
        path: 'tabansinhcongdong',
        navigationOptions: {
            header: null,
            animationEnabled: true
        },
    },
    tab_TuVanF0CaNhan: {
        screen: stackTuVanF0CaNhan,
        path: 'tabcanhantuvanf0',
        navigationOptions: {
            header: null,
            animationEnabled: true
        },
    },
    sc_YeuCauTuVanF0: {
        screen: FormTuVanF0,
        path: 'guituvanf0',
        navigationOptions: {
            header: null,
            animationEnabled: true
        },
    }
},
    {
        initialRouteName: 'tab_TuVanF0CongDong',
        swipeEnabled: false,
        animationEnabled: true,
        lazy: true,
        tabBarComponent: HomeTabTuVanF0,
    }
);
//ModalChitietCanhBao

//Sàn việc làm================================================================
const StackDanhSachTin = createStackNavigator(
    {
        scDanhSachTin: {
            screen: DanhSachTuyenDung,
            navigationOptions: {
                header: null,
                animationEnabled: true
            },
        },
        SearchTinTuyenDung
    },
    {
        headerMode: 'none'
    }
);

StackDanhSachTin.navigationOptions = ({ navigation }) => {
    let tabBarVisible = true;
    if (navigation.state.routes.length > 1)
        if (navigation.state.routes[1].routeName == 'SearchTinTuyenDung')
            tabBarVisible = false;
        else tabBarVisible = true;
    return { tabBarVisible };
};

const StackTinCaNhan = createStackNavigator(
    {
        scTinCaNhan: {
            screen: TinCaNhan,
            path: '',
            navigationOptions: {
                header: null,
                animationEnabled: true
            },
        },
        scChiTietTuyenDungNoti: {
            screen: ChiTietTuyenDung,
            path: '',
            navigationOptions: {
                header: null,
                animationEnabled: true
            },
        }
    },
    {
        headerMode: 'none',
    }
);

const TabSanLamViec = createBottomTabNavigator({
    tab_DanhSachTin: {
        screen: StackDanhSachTin,
        path: '',
        navigationOptions: {
            header: null,
            animationEnabled: true
        },
    },
    tab_TinCaNhan: {
        screen: StackTinCaNhan,
        path: '',
        navigationOptions: {
            header: null,
            animationEnabled: true
        },
    },
    tab_GuiTinTuyenDung: {
        screen: FormTuyenDung,
        path: '',
        navigationOptions: {
            header: null,
            animationEnabled: true
        },
    },
},
    {
        initialRouteName: 'tab_DanhSachTin',
        swipeEnabled: false,
        animationEnabled: true,
        lazy: true,
        tabBarComponent: HomeTabTuyenDung,
    }
);

//================================================================

const StackQuantam = createStackNavigator({
    sc_QuanTam: {
        screen: QuanTam,
        path: 'sc_qt',
        navigationOptions: {
            header: null,
            animationEnabled: true
        },
    },
    sc_ctCanhBao: {
        path: 'sc_cb/:item',
        screen: ModalChitietCanhBao,
        navigationOptions: {
            header: null,
            animationEnabled: true
        },
    }
})
const StackChuyenMuc = createStackNavigator({
    sc_ChuyenMuc: {
        screen: ChuyenMuc,
        path: 'sc_cm',
        navigationOptions: {
            header: null,
            animationEnabled: true
        },
    },
})

const TabBottomWarning = createBottomTabNavigator({
    st_QuanTam: {
        screen: StackQuantam,
        path: 'st_qt',
        navigationOptions: {
            header: null,
            animationEnabled: true
        },
    },
    st_ChuyenMuc: {
        screen: StackChuyenMuc,
        path: 'st_cm',
        navigationOptions: {
            header: null,
            animationEnabled: true
        },
    },
},
    {
        initialRouteName: 'st_QuanTam',
        swipeEnabled: false,
        animationEnabled: true,
        lazy: true,
        tabBarComponent: TabBarCanhBao,
        // tabBarComponent: TabBarHome,
    }
);

/**
 * Router Gốc không thay đổi.
*/
const StackLogin = createStackNavigator(
    {
        login: {
            screen: Login,
            navigationOptions: {
                header: null,
                animationEnabled: true
            },
        },
        quenmatkhau: {
            screen: QuenMatKhau,
            navigationOptions: {
                header: null,
                animationEnabled: true
            },
        },
        dangkytk: {
            screen: DangKyTaiKhoan,
            navigationOptions: {
                header: null,
                animationEnabled: true
            },
        },

    },
    {
        headerMode: 'none'
    }
);

const stackCorona = createStackNavigator(
    {
        homedangky: {
            screen: DangKyHome,
            navigationOptions: {
                header: null,
                animationEnabled: true
            },
        },
        inFoDangKy: {
            screen: ThongTinNguoiNhiem,
            navigationOptions: {
                header: null,
                animationEnabled: true
            },
        },
    },
    {
        initialRouteName: 'homedangky',
        headerMode: 'none'
    }
);


const stackXuPhatHC = createStackNavigator(
    {
        homexuphathc: {
            screen: XuPhatHanhChinh,
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
// Tra cứu học tập
const stackHocTap = createStackNavigator(
    {
        sc_TraCuuHocTap: {
            screen: TraCuuHocTap,
            navigationOptions: {
                header: null,
                animationEnabled: true
            },
        },
        sc_ThongTinLopHoc: {
            screen: ThongTinLopHoc,
            navigationOptions: {
                header: null,
                animationEnabled: true
            },
        },
        sc_KetQuaHocTap: {
            screen: KetQuaHocTap,
            navigationOptions: {
                header: null,
                animationEnabled: true
            },
        }
    })
//Dịch vụ công (TN)
const stackDVC = createStackNavigator(
    {
        // homeHDV: {
        //     screen: HomeDVC,
        //     navigationOptions: {
        //         header: null,
        //         animationEnabled: true
        //     },
        // },
        dsdonvi: {
            screen: DanhSachDonVi,
            navigationOptions: {
                header: null,
                animationEnabled: true
            },
        },
        dslinhvuc: {
            screen: DanhSachLinhVuc_DV,
            path: '',
            navigationOptions: {
                header: null,
                animationEnabled: true
            },
        },
        dsthutuc: {
            screen: DanhSachThuTuc,
            path: '',
            navigationOptions: {
                header: null,
                animationEnabled: true
            },
        },
        ctthutuc: {
            screen: ChiTietThuTuc,
        }
    },
    {
        initialRouteName: 'dsdonvi',
        headerMode: 'none'
    }
);

const StackHoSoDaGui = createStackNavigator({
    hosodagui: {
        screen: HoSoDaGui,

        path: 'lichsuhoso/:IdTT',
        navigationOptions: {
            header: null,
            animationEnabled: true
        },
    }
}, {
    initialRouteName: 'hosodagui',
    headerMode: 'none'
})

//TraCuu
const stackTraCuuHS = createStackNavigator(
    {
        tracucHoSo: {
            screen: TraCuuDVC,

            path: '',
            navigationOptions: {
                header: null,
                animationEnabled: true
            },
        }
    },
    {
        initialRouteName: 'tracucHoSo',
        headerMode: 'none'
    }
);

const stackHoiDapTT = createStackNavigator(
    {
        scHoiDapTT: {
            screen: HoiDapTT,
            path: '',
            navigationOptions: {
                header: null,
                animationEnabled: true
            },
        },
        scDatCauHoi: {
            screen: DatCauHoi,
            path: '',
            navigationOptions: {
                header: null,
                animationEnabled: true
            },
        },
        scCTCauHoi: {
            screen: ChiTietCauHoi,
            path: 'chitietch/:id',
            navigationOptions: {
                header: null,
                animationEnabled: true
            },
        },


    },
    {
        initialRouteName: 'scHoiDapTT',
        headerMode: 'none'
    }
);
const stackThanhToanDVC = createStackNavigator(
    {
        scThanhToan: {
            screen: HomeThanhToan,
            path: 'ctthanhtoan/:IdHoSo',
            navigationOptions: {
                header: null,
                animationEnabled: true
            },
        },
        scBienLaiTT: {
            screen: BienLaiThanhToan,
            path: '',
            navigationOptions: {
                header: null,
                animationEnabled: true
            },
        }
    },
    {
        initialRouteName: 'scThanhToan',
        headerMode: 'none'
    }
);



const stackTinTucDVC = createStackNavigator(
    {
        scHomeTT: {
            screen: HomeTinTuc,
            path: '',
            navigationOptions: {
                header: null,
                animationEnabled: true
            },
        },
        scChiTietTT: {
            screen: ChiTietTinTuc,
            path: 'cttintuc/:IdTinTuc',
            navigationOptions: {
                header: null,
                animationEnabled: true
            },
        }
    },
    {
        initialRouteName: 'scHomeTT',
        headerMode: 'none'
    }
)

const stackThongBao = createStackNavigator(
    {
        sc_ThongBaoTH: {
            screen: ThongBaoTH,
            navigationOptions: {
                header: null,
                animationEnabled: true
            }
        },
        chitiettb:
        {
            screen: ChiTietTB_Chung,
            path: 'tbchitiet/:IdRow',
            navigationOptions: {
                header: null,
                animationEnabled: true
            }
        },
    },
    {
        initialRouteName: 'sc_ThongBaoTH',
        headerMode: 'none'
    }
);

const stackCameraAnNinh = createStackNavigator(
    {
        scHomeCamera: {
            screen: HomeCamera
        },
        scSeenCamera: {
            screen: SeenCamera
        },
        scListCamera: {
            screen: ListCamera
        }
    },
    {
        initialRouteName: 'scHomeCamera',
        headerMode: 'none'
    }
)

const stackSOS = createStackNavigator(
    {
        scHomeSOS: {
            screen: UngCuuKhanCap,
            path: 'homesos'
        },
        scLichSuSOS: {
            screen: LichSuSOS,
            path: 'lichsusos'
        },
        scChiTietSOS: {
            screen: ChiTietSOS,
            path: 'chitietsos/:ID'
        }
    },
    {
        initialRouteName: 'scHomeSOS',
        headerMode: 'none'
    }
)

const stackCanhBaoCovid = createStackNavigator(
    {
        scHomeCanhBaoCovid: {
            screen: GuiCanhBaoCovid,
            path: 'guicanhbao'
        },
        scLichSuCanhBaoCovid: {
            screen: LichSuCanhBaoCovid,
            path: 'lichsu'
        },
        scChiTietCanhBaoCovid: {
            screen: ChiTietCanhBaoCovid,
            path: 'chitietcbcovid/:ID'
        }
    },
    {
        initialRouteName: 'scHomeCanhBaoCovid',
        headerMode: 'none'
    }
)

const stackGopYIOC = createStackNavigator(
    {
        scHomeIOC: {
            screen: GopY,
        },
        scLichSuIOC: {
            screen: LichSuIOC,
            path: ''
        },
        scChiTietIOC: {
            screen: ChiTietIOC,
            path: 'chitietIOC/:ID'
        }
    },
    {
        initialRouteName: 'scHomeIOC',
        headerMode: 'none'
    }
)

const StackTableau = createStackNavigator(
    {
        HomeTableau: Tableau,
        DetailsTableau: DetailsTableau
    },
    {
        initialRouteName: 'HomeTableau',
        headerMode: 'none'
    }
)
// const stackIOC = createStackNavigator(
//     {
//         scTrangChuDashBoard: {
//             screen: TrangChuDashBoard,
//             path: ''
//         },
//         scDashBoardIOC: {
//             screen: DashBoardIOC,
//             path: ''
//         },
//         scHoSoSucKhoe: {
//             screen: HoSoSucKhoe,
//             path: ''
//         },
//         scTableau: {
//             screen: StackTableau,
//             path: ''
//         }
//     },
//     {
//         initialRouteName: 'scTrangChuDashBoard',
//         headerMode: 'none'
//     }
// )
//end
const ThuVienStack = createStackNavigator({
    sc_HomeThuVien: {
        screen: HomeThuVien
    },
    sc_ListVieoImage: {
        screen: ListVieoImage
    },
    sc_ListSound: {
        screen: ListSound
    },
}, {
    initialRouteName: 'sc_HomeThuVien',
    headerMode: 'none'
})

const IntroductionStack = createStackNavigator(
    {
        scHomeIntro: Introduction,
        scDetailsUnit: DetailsUnit
    }, {
    headerMode: 'none'
}
)

const StackKiemTraChot = createStackNavigator(
    {
        DSChotKiemDich: DanhSachChot,
    },
    {
        initialRouteName: 'DSChotKiemDich',
        headerMode: 'none'
    }
)

const StackReputa = createStackNavigator(
    {
        HomeReputa: HomeReputa,
    },
    {
        initialRouteName: 'HomeReputa',
        headerMode: 'none'
    }
)

const StackKiemTraChotCho = createStackNavigator(
    {
        DSChotCho: DanhSachChotCho,
    },
    {
        initialRouteName: 'DSChotCho',
        headerMode: 'none'
    }
)

const StackQLTaiDiemTiem = createStackNavigator(
    {
        scDanhSachDiemTiem: {
            screen: ChonDiemTiem,
            path: ''
        }

    }, {
    initialRouteName: 'scDanhSachDiemTiem',
    headerMode: 'none'
}
)
// Hùng stask quản lý cách ly
const StackQLCachLy = createStackNavigator(
    {
        QuanLyCachLy: QuanLyCachLy
    },
    {
        initialRouteName: 'QuanLyCachLy',
        headerMode: 'none'
    }
)

const TabbarHoiDapTT_VTS = createBottomTabNavigator(
    {
        Home_HoiDapTT_VTS: {
            screen: DanhSachHoiDap_VTS,
            path: 'tab_home_hoidap_vts'
        },
        LichSu_HoiDapTT_VTS: {
            screen: LichSuHoiDap_VTS,
            path: 'tab_lichsuhoidap_vts'
        }
    },
    {
        initialRouteName: 'Home_HoiDapTT_VTS',
        // swipeEnabled: false,
        // animationEnabled: true,
        // lazy: true,
        tabBarComponent: TabbarHoiDap,
    }
)

const Stack_HoiDapTT_VTS_Admin = createStackNavigator(
    {
        Home_HoiDapTT_Admin: {
            screen: HomeHoiDapVTS_Admin
        },
        // Details_HoiDapTT_Admin: {

        // }
    },
    {
        initialRouteName: 'Home_HoiDapTT_Admin',
        headerMode: 'none'
    }
)

const Stack_TuyenDung = createStackNavigator(
    {
        scHomeKiemDuyetTuyenDung: {
            screen: HomeKiemDuyetTuyenDung,
            paht: 'lstkiemduyet'
        },
        scDetailsKiemDuyetTuyenDung: {
            screen: ChiTietKiemDuyetTuyenDung,
            paht: 'detailskiemduyet'
        }
    },
    {
        headerMode: 'none'
    }
)

const SlideStack = createDrawerNavigator({


    ManHinh_TrangChu: {
        screen: TabBottom,
        path: 'tabbottom',
        navigationOptions: {
            header: null,
            animationEnabled: true,
            tabBarVisible: false,
        }
    },
    ManHinh_AnSinhXaHoi: {
        screen: TabBottomAnSinh,
        path: 'slideansinhxahoi',
        navigationOptions: {
            header: null,
            animationEnabled: true,
            tabBarVisible: false,
        }
    },
    ManHinh_TuVanF0: {
        screen: TabBottomTuVanF0,
        path: 'slidetuvanf0',
        navigationOptions: {
            header: null,
            animationEnabled: true,
            tabBarVisible: false,
        }
    },
    ManHinh_ViecTimNguoi: {
        screen: TabViecTimNguoi,
        path: 'viectimnguoi',
        navigationOptions: {
            header: null,
            animationEnabled: true,
            tabBarVisible: false,
        }
    },
    ManHinh_NguoiTimViec: {
        screen: TabNguoiTimViec,
        path: 'nguoitimviec',
        navigationOptions: {
            header: null,
            animationEnabled: true,
            tabBarVisible: false,
        }
    },
    // ManHinh_SanLamViec: {
    //     screen: TabSanLamViec,
    //     path: 'sanlamviec',
    //     navigationOptions: {
    //         header: null,
    //         animationEnabled: true,
    //         tabBarVisible: false,
    //     }
    // },
    ManHinh_Warning: {
        screen: TabBottomWarning,
        path: 'tabcb'
    }
    ,
    sw_Login: {
        screen: StackLogin,
        path: 'login'
    },
    ManHinh_RootMap: {
        screen: stackCorona,
    },
    ManHinh_TuyenTruyen: {
        screen: HomeTuyenTruyen
    },
    ManHinh_XuPhatHC: {
        screen: stackXuPhatHC,
        path: 'xuphat'
    },
    ManHinh_DVC: {
        screen: stackDVC,
        path: '',
    },
    ManHinh_TraCuuHS: {
        screen: stackTraCuuHS,
        path: '',
    },
    ManHinh_TinTucDVC: {
        screen: stackTinTucDVC,
        path: 'tintuc'
    },
    ManHinh_HoiDapTT: {
        screen: stackHoiDapTT,
        path: 'hoidap',
    },
    ManHinh_ThanhToanDVC: {
        screen: stackThanhToanDVC,
        path: 'stThanhToan',
    },
    ManHinh_HoSoDaGui: {
        screen: StackHoSoDaGui,
        path: 'sthosodagui'
    },
    ManHinh_ThongBao: {
        screen: stackThongBao,
        path: 'thongbao'
    },
    CameraAnNinh: {
        screen: stackCameraAnNinh
    },
    ManHinh_TraCuuHocTap: {
        screen: stackHocTap,
        path: '',
    },
    ManHinh_SOS: {
        screen: stackSOS,
        path: 'stacksos'
    },
    ManHinh_GopYIOC: {
        screen: stackGopYIOC,
        path: 'staskIOC'
    },
    ManHinh_CanhBaoCovid: {
        screen: stackCanhBaoCovid,
        path: 'stcbcovid'
    },
    ManHinh_Tableau: {
        screen: StackTableau,
        path: ''
    },
    ManHinh_DashBoardDVC: {
        screen: DashBoardIOC,
        path: ''
    },
    ManHinh_HoSoSucKhoe: {
        screen: HoSoSucKhoe,
        path: ''
    },
    ManHinh_ThuVien: {
        screen: ThuVienStack,
        path: ''
    },
    ManHinh_GioiThieu: {
        screen: IntroductionStack,
        path: ''
    },
    // ManHinh_DashbroadIOC: {
    //     screen: stackIOC,
    //     path: ''
    // },

    //HO CHI MINH
    ManHinh_KiemTraChot: {
        screen: StackKiemTraChot,
        path: 'stkiemtrachot'
    },
    ManHinh_Reputa: {
        screen: StackReputa,
        path: ''
    },
    ManHinh_KiemTraChotCho: {
        screen: StackKiemTraChotCho,
        path: ''
    },
    ManHinh_QLTaiDiemTiem: {
        screen: StackQLTaiDiemTiem,
        path: 'stqltaidiemtiem'
    },
    // Hùng stask quản lý cách ly
    ManHinh_QLCachLy: {
        screen: StackQLCachLy,
        path: ''
    },
    ManHinh_HoiDapTT_VTS: {
        screen: TabbarHoiDapTT_VTS,
        path: 'hoidaptt_vts'
    },
    ManHinh_HoiDapTT_VTS_Admin: {
        screen: Stack_HoiDapTT_VTS_Admin,
        path: 'hoidaptt_admin'
    },
    ManHinh_KiemDuyetTuyenDung: {
        screen: Stack_TuyenDung,
        path: 'kiemduyethome'
    },

    //Các stack màn hình của Widgets
    ManHinh_RaoVat: {
        screen: StackRaoVat,
        paht: ''
    },
    ManHinh_ThueNha: {
        screen: StackThueNha,
        paht: ''
    },
    ManHinh_XeKhach: {
        screen: StackXeKhach,
        paht: ''
    }
}, {
    drawerWidth: Width(80),//chưa kiểm tra isPad
    drawerPosition: 'left',
    contentComponent: Drawer,
    disableGestures: true,
    drawerLockMode: 'locked-open',
    overlayColor: 'rgba(0,0,0,0.5)',
    drawerBackgroundColor: 'transparent',
    navigationOptions: {
        header: null,
        animationEnabled: true,
        tabBarVisible: false,
    },
})

// AppStack_Admin
// SlideStackDH
const HomeStack = createStackNavigator({
    HomeApp: {
        screen: HomeDrawer
    },
    TimKiemChung: {
        screen: ModalTimKiemChung,
        navigationOptions: {
            header: null,
            animationEnabled: true,
            tabBarVisible: false,
        },
    },
    PhoneTaxi: {
        screen: PhoneTaxi,
        navigationOptions: {
            header: null,
            animationEnabled: true,
            tabBarVisible: false,
        },
    }
}, {
    initialRouteName: 'HomeApp',
    headerMode: 'none'
})
const stackChung = createStackNavigator(
    {
        ManHinh_Home: {
            screen: HomeStack,
            navigationOptions: ({ navigation, screenProps }) => {
                if (getActiveChildNavigationOptions(navigation, screenProps)) {
                    return { ...getActiveChildNavigationOptions(navigation, screenProps) }
                } else {
                    return {}
                }
            }
        },
        SlideStack: {
            screen: SlideStack,
            path: 'stcongdan',
            navigationOptions: ({ navigation, screenProps }) => {
                if (getActiveChildNavigationOptions(navigation, screenProps)) {
                    return { ...getActiveChildNavigationOptions(navigation, screenProps) }
                } else {
                    return {}
                }
            }
        },
        SlideStackDH: {
            screen: RootStackDH,
            path: 'stdieuhanh',
            navigationOptions: ({ navigation, screenProps }) => {
                if (getActiveChildNavigationOptions(navigation, screenProps)) {
                    return { ...getActiveChildNavigationOptions(navigation, screenProps) }
                } else {
                    return {}
                }
            }
        },
        Manhinh_QHMap: {
            screen: RootStackScreenQuyhoach,
            navigationOptions: ({ navigation, screenProps }) => {
                if (getActiveChildNavigationOptions(navigation, screenProps)) {
                    return { ...getActiveChildNavigationOptions(navigation, screenProps) }
                } else {
                    return {}
                }
            }
        },
        ManHinh_IOC: {
            screen: SwitchIOC,
            navigationOptions: ({ navigation, screenProps }) => {
                if (getActiveChildNavigationOptions(navigation, screenProps)) {
                    return { ...getActiveChildNavigationOptions(navigation, screenProps) }
                } else {
                    return {}
                }
            }
        },
        ManHinh_HKG: {
            screen: stackHKG,
            path: 'sthkg',
            navigationOptions: ({ navigation, screenProps }) => {
                if (getActiveChildNavigationOptions(navigation, screenProps)) {
                    return { ...getActiveChildNavigationOptions(navigation, screenProps) }
                } else {
                    return {}
                }
            }
        },
        ManHinh_Chat: {
            screen: ChatMain,
            path: 'chat',
            navigationOptions: ({ navigation, screenProps }) => {
                if (getActiveChildNavigationOptions(navigation, screenProps)) {
                    return { ...getActiveChildNavigationOptions(navigation, screenProps) }
                } else {
                    return {}
                }
            }
        },
    },
    {
        headerMode: 'none'
    }
);

const StackCaiDat = createStackNavigator(
    {
        HomeSetting: {
            screen: CaiDat
        },
        scChangeBgr: ChangeBackground,
        scChangeHeaderHome: ChangeHeaderHome
    },
    {
        headerMode: 'none'
    })
const StackPersonal = createStackNavigator(
    {
        HomePersoncal: {
            screen: HomePersonal
        }
    }
    , {
        initialRouteName: 'HomePersoncal',
        headerMode: 'none'
    })

const StackNotificationAccount = createStackNavigator(
    {
        scHomeNotification: HomeNotification
    }, {
    initialRouteName: 'scHomeNotification',
    headerMode: 'none'
})

const TabMain = createBottomTabNavigator({
    tab_Notificafion: StackNotificationAccount,
    tab_QR_Home: QRHome,
    tab_Home: {
        screen: stackChung,
        path: 'home',
        navigationOptions: ({ navigation, screenProps }) => {
            if (getActiveChildNavigationOptions(navigation, screenProps)) {
                return { ...getActiveChildNavigationOptions(navigation, screenProps) }
            } else {
                return {}
            }
        }
    },
    tab_Person: StackPersonal,
    tab_Setting: StackCaiDat
}, {
    tabBarComponent: Tabbar,
    initialRouteName: "tab_Home",
})
const RootStack = createSwitchNavigator(
    {
        sw_Root: {
            screen: RootScreen,
            navigationOptions: {
                header: null
            }
        },
        Modal_StartedScreen: StartedScreen,
        sw_HomePage: {
            screen: TabMain,
            path: 'main',
            navigationOptions: {
                header: null,
                animationEnabled: true
            }
        },


    },
    {
        headerMode: 'none',
        navigationOptions: {
            gesturesEnabled: false
        }
    }
);

const StackMapExtention = createStackNavigator(
    {
        HomeMapExtention: HomeMapExtention,
        DetailsTypeExtention: DetailsTypeExtention,
        DetailsExtensionMap: DetailsExtensionMap,
        TimKiemTienIch: TimKiemTienIch,
        DetailsLocations: DetailsLocations
    }, {
    initialRouteName: 'HomeMapExtention',
    headerMode: 'none'
}
)

const StackDuLichThongMinh = createStackNavigator(
    {
        scHomeDuLichTM: DLTM_Home,
        scChiTietDuLichTM: DLTM_ChiTiet
    },
    {
        initialRouteName: 'scHomeDuLichTM',
        headerMode: 'none'
    }
)

// - Modal native -- Các screen dạng modal, popup khai báo ở đây
const RootModalStack = createStackNavigator(
    {
        Root: {
            screen: RootStack,
            path: 'root'
        },

        //-- Khai bao modal khong co Animations
        // -- Screen Modal, Popup
        //***** Modal components Chung * ko cần xoá ******
        Modal_TaoPhanAnh: {
            screen: GuiPhanAnhRoot,
            path: 'guipat',
            navigationOptions: {
                header: null,
                animationEnabled: true
            },
        },
        Modal_Notification: Notification,
        Modal_DoiMatKhau: DoiMatKhau,
        Modal_ThongBaoTK: ModalThongBao,
        Modal_XacNhanOPT: ModalXacNhanOPT,
        Modal_ThongTinUser: ModalThongTinUser,
        Modal_ChiTietPhanAnh: ChiTietPhanAnh,
        Modal_MapChiTietPA: MapChiTietPA,
        Modal_Language: Language,
        Modal_BrowserInApp: BrowserInApp,
        Modal_DatePickList: DatePickList,
        Modal_RecordVideo: RecordVideo,
        Modal_TakeCamera: TakeCamera,
        Modal_PlayMedia: PlayMedia,
        Modal_SoundPlay: SoundPlay,
        Modal_MediaPicker: MediaPicker,
        Modal_ShowListImage: ViewImageListShow,
        Modal_ViewImageListShow: ViewImageListShow,
        Modal_BanDo_Root: BanDo_Root,
        Modal_MapHome: MapHome,
        Modal_FileAttached: DanhSachFileDK,
        Modal_AutocompleteMap: AutocompleteMap,
        Modal_ChiTietCanhBao: ModalChitietCanhBao,
        Modal_ChiTietChuyenMuc: ModalChitietChuyenMuc,
        Modal_ListViewVideoPlay: ListViewVideoPlay,
        ModalChuyenMuc: ModalChuyenMuc,
        ModalCamVideoCus: CamVideoCus,
        Modal_KhanCap: KhanCap,
        Modal_HuongDanVT: ModalHuongDanVT,
        Modal_ComponentSelectProps: ComponentSelectProps,
        Modal_SearchFilter: ModalSearchFilter,
        Modal_QrHome: QRHome,
        Modal_SearchFilterDVC: ModalSearchFilterDVC,
        Modal_SearchHoSo: ModalSearchHoSo,
        Modal_ChiTietTB: ChiTietTB,
        Modal_GiaCuoc: ModalGiaCuoc,
        Modal_DangNhapSSO: ModalDangNhap,
        Modal_EditHTML: ModalEditHTML,
        Modal_SettingTinTuc: SettingTinTuc,
        Modal_XuPhatHC: ChiTietXPHC,
        Modal_BienLaiTT: BienLaiThanhToan,
        Modal_SearchFromQR: TraCuuDVC,
        Modal_LogOut: Modal_LogOut,
        Modal_TaiKhoan: Modal_TaiKhoan,
        Modal_ThongBaoChung: ChiTietTB_Chung,
        Modal_NetworkLogger: NetworkLoggerScreen,
        Modal_SearchPA: Search,
        Modal_MonthYear: Modal_MonthYear,
        ModalScanQR: ModalScanQR,
        ModalOTP: ModalOTP,
        ModalScanQR_Info: ModalScanQR_Info,
        Modal_XacThucQR: XacThucQR,
        Modal_ChongDichBenh: MenuChongDich,
        Modal_ToKhaiYTe: Modal_ToKhaiYTe,
        Modal_CreateQR_TN: CreateQR_TN,
        Modal_CheckInKiemDich: CheckInKiemDich,
        Modal_DangKyNhanh: DangKyNhanh,
        Modal_ComponentSelectBottom: ComponentSelectBottom,
        ModalComfirm: ModalComfirm,
        ModalMenuChild: ModalMenuChild,
        Modal_ChiTietGioiThieu: Introduction,
        ModalDropChuyenMuc: ModalDropChuyenMuc,
        Modal_Camera: CameraDiemDanhPAHT,
        Modal_BieuDoQuanTrac: BieuDoQuanTrac,
        Modal_DSTramQuanTrac: DSTramQuanTrac,
        Modal_DetailsChartsNuoc: DetailsChartsNuoc,
        Modal_DetailsChartsKhongKhi: DetailsChartsKhongKhi,

        Modal_UploadCMND: UploadCMND,
        Modal_GiayThongHanh: GiayThongHanh,
        Modal_GiayToKhac: GiayToKhac,

        Modal_ThongKeCachLyTaiNha: ThongKeCachLyTaiNha,
        Modal_ChiTietThongKeCachLy: ChiTietThongKeCachLy,
        Modal_ChiTietQuanLyCachLy: ChiTietQuanLyCachLy,
        Modal_DangKyNhanHoTro: DangKyNhanHoTro,
        Modal_DangKyGDD: DangKyGDD,
        Modal_LichSuDangKyGDD: LichSuDangKy,
        Modal_ChiTietGDD: ChiTietGDD,
        Modal_DSDuyetGDD: DSDuyetGDD,

        Modal_GiaoThong: GiaoThong,
        Modal_ChiTietGiaoThong: ChiTietGiaoThong,
        Modal_GSGT: GiamSatGiaoThong,
        Modal_ChiTietGSGT: ChiTietGiamSatGiaoThong,
        Modal_ThongKeDangKy: ThongKeDangKyHome,
        //HCM
        Modal_QuetMaKiemDich: QuetMa,
        Modal_KetQuaQuet: KetQuaQuet,
        Modal_LichSuQuetAdmin: LichSuQuet,
        Modal_ChiTietLichSu: ChiTietLichSu,
        Modal_CreateQR: CreateQR,
        Modal_ToKhaiYTeHCM: ToKhaiYTe, //Dat ten khac so voi source HCM thêm hậu tố HCM vì đã tôn tại  Modal_ToKhaiYTe(Webview)
        Modal_CheckInDiaDiemCoQuan: MessCheckIn,
        Modal_LichSuCheckIn: LichSuCheckIn,
        Modal_ToKhaiYTeHCMTaiNha: {
            screen: ToKhaiYTeTaiNha,
            path: 'HomeKhaiBaoYteTaiNha/:ID'
        },
        Modal_ToKhaiDiChuyen: ToKhaiDiChuyen,
        Modal_LichSuHoiDap: LichSuHoiDap,
        Modal_ChiTietCauHoiLS: ChiTietCauHoi,
        //Di cho
        Modal_QuetMaChotCho: QuetMaChotCho,
        Modal_KetQuaQuetChotCho: KetQuaQuetChotCho,
        Modal_LichSuQuetChotCho: LichSuQuetChotCho,
        Modal_ChiTietLichSuChotCho: ChiTietLichSuChotCho,
        Modal_PhieuDiCho: PhieuDiCho,
        Modal_LichSuCheckInCho: LichSuCheckInCho,
        //Quan ly diem tiem
        Modal_SubMenuTiem: SubMenuTiem,
        Modal_QuetMaTiem: QuetMaTiem,
        Modal_NhapMaCode: NhapMaCode,
        Modal_LSChecckIn: LichSuTiem,
        Modal_ChiTietLichSuTiem: ChiTietLichSuTiem,
        Modal_KetQuaQuetMaTiem: KetQuaQuetMaTiem,
        Modal_FillterDiemTiem: ChonDiemTiem,
        //Xac nhan ho tro
        Modal_QuetQRXacNhanHoTro: QuetQRXacNhan,
        Modal_DSChiTietThongKe: DSChiTietThongKe,
        Modal_ChiTietXacNhanHoTro: ChiTietXacNhanHoTro,
        Modal_YeuCauHoTroTuiAnSinh: FormHoTroTuiAnSinh,
        Modal_ChiTietTuiAnSinh: ChiTietTuiAnSinh,
        Modal_MapHomeTuiAnSinh: MapHomeTuiAnSinh,
        Modal_LichSuGiupDo: LichSuGiupDo,
        Modal_CheckGiayThongHanh: CheckGiayThongHanh,
        Modal_MultiSingleDate: MultiSingleDate,
        Modal_YCDoiMatKhau: Modal_YCDoiMatKhau,
        Modal_GuiCauHoi_VTS: GuiCauHoi_VTS,
        Modal_ChiTietCauHoi_VTS: {
            screen: ChiTietCauHoi_VTS,
            path: 'chitiethoidapvts/:IdHoiDapTT'
        },
        Modal_TimKiemCauHoi_VTS: TimKiemCauHoi_VTS,
        ModalFilterHoiDapTT: ModalFilterHoiDapTT,
        ModalTinhTrangHoiDapTT: ModalTinhTrangHoiDapTT,
        Modal_DetailsHoiDapTT_Admin: {
            screen: DetailsHoiDapTT_Admin,
            path: 'hoidapadmin_chitiet/:IdHoiDapTT'
        },
        Modal_ChuyenXuLyHoiDapTT: ChuyenXuLyHoiDapTT,
        Modal_TraLai_KhongTiepNhanHoiTT: TraLai_KhongTiepNhanHoiTT,
        Modal_TraLoiHoiTT: TraLoiHoiTT,
        Modal_LichSuCauTraLoi: LichSuCauTraLoi,
        Modal_BanDoTienIch: {
            screen: StackMapExtention,
            navigationOptions: {
                gesturesEnabled: false,
            }
        },
        Modal_YeuCauTuVanF0: FormTuVanF0,
        Modal_ChiTietTuVanF0: ChiTietTuVanF0,
        Modal_MapHomeTuVanF0: MapHomeTuVanF0,
        Modal_QuanLyDuAn: QuanLyDuAn,
        Modal_YearPicker: YearPicker,
        Modal_YearPickerNew: Modal_YearPickerNew,
        Modal_ChiTietDuAn: ChiTietDuAn,
        Modal_DSCameraDuAn: CameraDuAn,
        Modal_SeenCamera: SeenCamera,
        Modal_GuiTinTuyenDung: FormTuyenDung,
        Modal_ChiTietTuyenDung: ChiTietTuyenDung,
        Modal_TinhTrangDuyet: Modal_TinhTrangDuyet,
        ModalFilterTuyenDung: ModalFilterTuyenDung,
        Modal_DuLichThongMinh: StackDuLichThongMinh,
        Modal_Policy: Policy,
        //--Sàn Việc LÀM
        ...Modal_ModuleSVL,
        ...ModalAdmin,
        //--Tiện ích thuê nhà , rao vặt, xe khách,... của folder Widgets
        ...Modal_Widget
        //***** END ******



    },
    {
        mode: 'modal',
        headerMode: 'none',
        transitionConfig: () => ({
            containerStyle: {
                backgroundColor: 'transparent'
            }
        }),
        transparentCard: true,
        cardStyle: {
            backgroundColor: 'transparent',
            opacity: 1
        }
    }
);

export const AppStack = createStackNavigator({
    RootMain: {
        screen: RootModalStack,
        path: 'app'
    },
    Modal_MsgBox: {
        screen: MsgBox,
        navigationOptions: {
            gesturesEnabled: false,
            transitionConfig: () => ({
                containerStyle: {
                    backgroundColor: 'transparent'
                },
                transitionSpec: {
                    duration: 0,
                    timing: Animated.timing,
                    easing: Easing.step0,
                }
            }),
        }
    },
    Modal_FilterSetup: {
        screen: ModalFilterSetup,
    },
    Modal_ComponentSelectPropsFilter: ConponentSelectPropsRight,

    //-- Khai bao modal khong co Animations

},
    {
        mode: 'modal',
        headerMode: 'none',
        transitionConfig: () => ({
            screenInterpolator: sceneProps => {
                const { layout, position, scene } = sceneProps;
                const { index } = scene;
                const width = layout.initWidth;

                return {
                    opacity: position.interpolate({
                        inputRange: [index - 1, index, index + 1],
                        outputRange: [100, 1, 0],
                    }),
                    transform: [{
                        translateX: position.interpolate({
                            inputRange: [index - 1, index, index + 1],
                            outputRange: [width, 0, 0],
                        }),
                    }]
                };
            },

        }),
        transparentCard: true,
        cardStyle: {
            backgroundColor: 'transparent',
            opacity: 1
        },

    });
