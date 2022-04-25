import {
    createStackNavigator, createBottomTabNavigator,
} from 'react-navigation';

// Sàn việc làm - SVL
//**Viec Tim Nguoi */
import CTTuyenDung from '../srcSanViecLam/screens/ViecTimNguoi/CTTuyenDung';
import HomeSVL from '../srcSanViecLam/screens/ViecTimNguoi/HomeSVL';
import Modal_Fillter from '../srcSanViecLam/screens/ViecTimNguoi/components/Modal_Fillter';
import Modal_Search from '../srcSanViecLam/screens/ViecTimNguoi/components/Modal_Search';
import ChonHoSo from '../srcSanViecLam/screens/ViecTimNguoi/ChonHoSo';
//**Ung Tuyen */
import UngTuyen from '../srcSanViecLam/screens/UngTuyen';
import PopupSave from '../srcSanViecLam/screens/UngTuyen/PopupSave';

//**Hom Thu */
import Notification from '../srcSanViecLam/screens/HomThu/Notification';
import DetailsNotification from '../srcSanViecLam/screens/HomThu/DetailsNotification';

//**Ho So */
import HoSoCaNhan from '../srcSanViecLam/screens/HoSo/index'
import CreateCv from '../srcSanViecLam/screens/HoSo/CreateCv';
import InfoRecruitment from '../srcSanViecLam/screens/HoSo/CreateCv/InfoRecruitment';
import InfoEducation from '../srcSanViecLam/screens/HoSo/CreateCv/InfoEducation';
import InfoSkillExperience from '../srcSanViecLam/screens/HoSo/CreateCv/InfoSkillExperience';
import BenefitRequest from '../srcSanViecLam/screens/HoSo/CreateCv/BenefitRequest';
import InfoResult from '../srcSanViecLam/screens/HoSo/CreateCv/InfoResult';

//TimUngVienTD
import TimUngVienTD from '../srcSanViecLam/screens/TimUngVienTD';

//HomThuTD
import HomThuTD from '../srcSanViecLam/screens/HomThuTD';
import DetailsHomThuTD from '../srcSanViecLam/screens/HomThuTD/DetailsHomThuTD';
//DangTinTD
import DangTinTD from '../srcSanViecLam/screens/DangTinTD';
import Modal_ConfirmDelTD from '../srcSanViecLam/screens/DangTinTD/Modal_ConfirmDelTD';
import TaoTinTD from '../srcSanViecLam/screens/DangTinTD/TaoTinTD/index';
import ThongTinDaiDien from '../srcSanViecLam/screens/DangTinTD/TaoTinTD/ThongTinDaiDien';
import MoTaCongViec from '../srcSanViecLam/screens/DangTinTD/TaoTinTD/MoTaCongViec';
import XemTruoc from '../srcSanViecLam/screens/DangTinTD/TaoTinTD/XemTruoc';
//TuyenDungTD
import TuyenDungTD from '../srcSanViecLam/screens/TuyenDungTD';
import PopupSaveTD from '../srcSanViecLam/screens/TuyenDungTD/PopupSaveTD';
import ListEmployment from '../srcSanViecLam/screens/TuyenDungTD/ListEmployment';


//**Compoent + Other... */
import ModalButton from '../srcSanViecLam/components/ModalButton';
import ModalThongBao from '../srcSanViecLam/components/ModalThongBao';
import TabarSVL from '../srcSanViecLam/components/TabarSVL';
import Modal_ConfirmDel from '../srcSanViecLam/screens/HoSo/Modal_ConfirmDel';
import GioPhutPicker from '../srcSanViecLam/components/GioPhutPicker';
import Modal_Address from '../srcSanViecLam/screens/HoSo/components/Modal_Address';
import YeuCauTao from '../srcSanViecLam/screens/DangTinTD/YeuCauTao';
import MoiPhongVan from '../srcSanViecLam/screens/DangTinTD/MoiPhongVan';
import TabarSVL_TD from '../srcSanViecLam/components/TabarSVL_TD';
import ThongTinTuyenDung from '../srcSanViecLam/screens/DangTinTD/TaoTinTD/ThongTinTuyenDung';
import DetalisUngVien from '../srcSanViecLam/screens/TimUngVienTD/DetalisUngVien';
import Modal_ConfirmTuChoi from '../srcSanViecLam/screens/HomThu/Modal_ConfirmTuChoi';
import Modal_ShareCv from '../srcSanViecLam/screens/HoSo/components/Modal_ShareCv';
import Modal_Save from '../srcSanViecLam/screens/HoSo/components/Modal_Save';
import Modal_ShareEmployment from '../srcSanViecLam/screens/DangTinTD/components/Modal_ShareEmployment';

//** +++VIỆC TÌM NGƯỜI +++ */
const StackViecTimNguoi = createStackNavigator(
    {
        scViecTimNguoi: {
            screen: HomeSVL,
            path: '',
            navigationOptions: {
                header: null,
                animationEnabled: true
            }
        },
        scTimKiem: Modal_Search,
        scCTTuyenDung: CTTuyenDung

    },
    {
        headerMode: 'none',
    }
);

const StackUngTuyen = createStackNavigator(
    {
        scViecTimNguoi: { // Phải trùng key với Tab 1 mới xử lý đúng luồng dc
            screen: UngTuyen,
            path: '',
            navigationOptions: {
                header: null,
                animationEnabled: true
            }
        }
    },
    {
        headerMode: 'none',
    }
);
const StackHomThu = createStackNavigator(
    {
        scHomThu: {
            screen: Notification,
            path: '',
            navigationOptions: {
                header: null,
                animationEnabled: true
            }
        },
        scDetailsNotification: DetailsNotification,
    },
    {
        headerMode: 'none',
    }
);

const StackHoSo = createStackNavigator(
    {
        scHoSoCaNhan: {
            screen: HoSoCaNhan,
            path: '',
            navigationOptions: {
                header: null,
                animationEnabled: true
            }
        },
        Sc_DetalisHoSo: {
            screen: DetalisUngVien,
        },
        Sc_CreateCv: {
            screen: CreateCv,
            path: '',
        },
        Sc_InfoRecruitment: {
            screen: InfoRecruitment,
            path: '',
        },
        Sc_InfoEducation: {
            screen: InfoEducation,
            path: '',
        },
        Sc_InfoSkillExperience: {
            screen: InfoSkillExperience,
            path: '',
        },
        Sc_BenefitRequest: {
            screen: BenefitRequest,
            path: '',
        },
        Sc_InfoResult: {
            screen: InfoResult,
            path: '',
        },
    },
    {
        initialRouteName: 'scHoSoCaNhan',
        headerMode: 'none',
    }
);
//--------Luồng MAIN VIỆC TÌM NGƯỜI-----------
export const TabViecTimNguoi = createBottomTabNavigator({
    tab_ViecTimNguoi: {
        screen: StackViecTimNguoi,
        path: '',
        navigationOptions: {
            header: null,
            animationEnabled: true
        },
    },
    tab_UngTuyen: {
        screen: StackUngTuyen,
        path: '',
        navigationOptions: {
            header: null,
            animationEnabled: true
        },
    },
    tab_HomThu: {
        screen: StackHomThu,
        path: '',
        navigationOptions: {
            header: null,
            animationEnabled: true
        },
    },
    tab_HoSo: {
        screen: StackHoSo,
        path: '',
        navigationOptions: {
            header: null,
            animationEnabled: true
        },
    }
},
    {
        initialRouteName: 'tab_ViecTimNguoi',
        swipeEnabled: false,
        animationEnabled: true,
        lazy: true,
        tabBarComponent: TabarSVL,
    }
);


//** +++NGƯỜI TÌM VIỆC +++ */
const StackNguoiTimViec = createStackNavigator(
    {
        scNguoiTimViec: {
            screen: TimUngVienTD,
            path: '',
            navigationOptions: {
                header: null,
                animationEnabled: true
            }
        },
        sc_DetalisUngVien: DetalisUngVien


    },
    {
        headerMode: 'none',
    }
);

const StackTuyenDung = createStackNavigator(
    {
        scNguoiTimViec: { // Phải trùng key với Tab 1 mới xử lý đúng luồng dc
            screen: TuyenDungTD,
            path: '',
            navigationOptions: {
                header: null,
                animationEnabled: true
            }
        }
    },
    {
        headerMode: 'none',
    }
);

const StackHomThuTD = createStackNavigator(
    {
        scHomThu: {
            screen: HomThuTD,
            path: '',
            navigationOptions: {
                header: null,
                animationEnabled: true
            }
        },
        scDetailsHomThuTD: DetailsHomThuTD,
    },
    {
        headerMode: 'none',
    }
);

const StackDangTin = createStackNavigator(
    {
        scHomeDangTin: {
            screen: DangTinTD,
            path: '',
            navigationOptions: {
                header: null,
                animationEnabled: true
            }
        },
        Sc_TaoTinTD: {
            screen: TaoTinTD,
            path: '',
        },
        Sc_ThongTinDaiDien: {
            screen: ThongTinDaiDien,
            path: '',
        },
        Sc_ThongTinTuyenDung: {
            screen: ThongTinTuyenDung,
            path: '',
        },
        Sc_MoTaCongViec: {
            screen: MoTaCongViec,
            path: '',
        },
        sc_XenTruoc: XemTruoc,

        // scCreateCv: CreateCv
    },
    {
        headerMode: 'none',
    }
);

//--------Luồng MAIN NGƯỜI TÌM VIỆC-----------
export const TabNguoiTimViec = createBottomTabNavigator({
    tab_NguoiTimViec: {
        screen: StackNguoiTimViec,
        path: '',
        navigationOptions: {
            header: null,
            animationEnabled: true
        },
    },
    tab_TuyenDung: {
        screen: StackTuyenDung,
        path: '',
        navigationOptions: {
            header: null,
            animationEnabled: true
        },
    },
    tab_HomThuTD: {
        screen: StackHomThuTD,
        path: '',
        navigationOptions: {
            header: null,
            animationEnabled: true
        },
    },
    tab_DangTin: {
        screen: StackDangTin,
        path: '',
        navigationOptions: {
            header: null,
            animationEnabled: true
        },
    }
},
    {
        initialRouteName: 'tab_NguoiTimViec',
        swipeEnabled: false,
        animationEnabled: true,
        lazy: true,
        tabBarComponent: TabarSVL_TD,
    }
);

//--------Các Modal khai báo ở đây.
export const Modal_ModuleSVL = {
    Modal_Search: Modal_Search,
    ModalCTTuyenDung: {
        screen: CTTuyenDung,
        path: 'cttuyendungcanhan/:Id'
    },
    ScreenHoSoCaNhan: HoSoCaNhan,
    Modal_HomeSVL: HomeSVL,
    Modal_Button: ModalButton,
    Modal_Fillter: Modal_Fillter,
    Modal_ChonHoSo: ChonHoSo,
    Modal_UngTuyen: UngTuyen,
    PopupSave: PopupSave,
    Notification: Notification,
    DetailsNotification: DetailsNotification,
    Modal_ThongBao: {
        screen: ModalThongBao,
        navigationOptions: {
            gesturesEnabled: false,
        }
    },
    Modal_ConfirmDel: Modal_ConfirmDel,
    Modal_ConfirmDelTD: Modal_ConfirmDelTD,
    Modal_ConfirmTuChoi: Modal_ConfirmTuChoi,
    Modal_GioPhutPicker: GioPhutPicker,
    Modal_Address: Modal_Address,
    ScreenRequestCreate: YeuCauTao,
    Modal_MoiPhongVan: MoiPhongVan,
    Modal_TuyenDungTD: TuyenDungTD, // Modal ráp màn hình đơn khi ráp luồng xong nhớ xoá hoặc để theo đúng trường hợp
    Modal_TimUngVienTD: TimUngVienTD, // Modal ráp màn hình đơn khi ráp luồng xong nhớ xoá hoặc để theo đúng trường hợp
    PopupSaveTD: PopupSaveTD,
    Modal_ListEmployment: ListEmployment,
    Modal_HomThuTD: HomThuTD, // Modal ráp màn hình đơn khi ráp luồng xong nhớ xoá hoặc để theo đúng trường hợp
    DetailsHomThuTD: DetailsHomThuTD, // Modal ráp màn hình đơn khi ráp luồng xong nhớ xoá hoặc để theo đúng trường hợp
    Modal_DangTinTD: DangTinTD, // Modal ráp màn hình đơn khi ráp luồng xong nhớ xoá hoặc để theo đúng trường hợp

    Modal_DetalisUngVien: {
        screen: DetalisUngVien,
        path: 'cttuyendungdoanhnghiep/:Id'
    },
    Modal_ShareCv: Modal_ShareCv,
    Modal_Save: Modal_Save,
    Modal_ShareEmployment: Modal_ShareEmployment,
}

//** END - SVL ***/