import {
    createStackNavigator, createBottomTabNavigator,
} from 'react-navigation';
import RaoVat from './srcWidgets/RaoVat';
import ModalThongBaoTaoTin from './srcWidgets/RaoVat/DangTin/ModalThongBaoTaoTin';
import ModalTuyChon from './srcWidgets/RaoVat/Modal/ModalTuyChon';
import ModalXemTruoc from './srcWidgets/RaoVat/DangTin/ModalXemTruoc';
import DangTin from './srcWidgets/RaoVat/DangTin';
import LienHe from './srcWidgets/RaoVat/DangTin/LienHe';
import ThueNha from './srcWidgets/ThueNha';
import XeKhach from './srcWidgets/XeKhach';
import TimXe from './srcWidgets/XeKhach/TimXe';
import DachSachNhaXe from './srcWidgets/XeKhach/DachSachNhaXe';
import ThongTinNhaXe from './srcWidgets/XeKhach/ThongTinNhaXe';
import MoTaRaoVat from './srcWidgets/RaoVat/DangTin/MoTaRaoVat';
import ChiTietTinRaoVat from './srcWidgets/RaoVat/Modal/ChiTietTinRaoVat';
import SearchRaoVat from './srcWidgets/RaoVat/SearchRaoVat';
import DangTinThueNha from './srcWidgets/ThueNha/DangTinThueNha';
import LienHeThueNha from './srcWidgets/ThueNha/DangTinThueNha/LienHeThueNha';
import MoTaThueNha from './srcWidgets/ThueNha/DangTinThueNha/MoTaThueNha';
import XemTruocThueNha from './srcWidgets/ThueNha/DangTinThueNha/XemTruocThueNha';
import ChiTietThueNha from './srcWidgets/ThueNha/Modal/ChiTietThueNha';
import SearchThueNha from './srcWidgets/ThueNha/SearchThueNha';

// Luồng màn hình Rao Vặt==========================================
export const StackRaoVat = createStackNavigator({
    scHomeRaoVat: RaoVat,
    scDangTin: DangTin,
    scLienHe: LienHe,
    scMoTaRaoVat: MoTaRaoVat,
    scXemTruocTinRaoVat: ModalXemTruoc,
    scTaoTinThanhCong: {
        screen: ModalThongBaoTaoTin,
        navigationOptions: {
            gesturesEnabled: false,
        },
    },
    scChiTietTinRaoVat: ChiTietTinRaoVat,
    scSearchRaoVat: SearchRaoVat
}, {
    initialRouteName: 'scHomeRaoVat',
    headerMode: 'none',
})
// ================================================================


// Luồng màn hình Thuê Nhà=========================================
export const StackThueNha = createStackNavigator({
    scHomeThueNha: ThueNha,
    scDangTinThueNha: DangTinThueNha,
    scLienHeThueNha: LienHeThueNha,
    scMoTaThueNha: MoTaThueNha,
    scXemTruocTinThueNha: XemTruocThueNha,
    scTaoTinThueNhaThanhCong: {
        screen: ModalThongBaoTaoTin,
        navigationOptions: {
            gesturesEnabled: false,
        },
    },
    scChiTietTinThueNha: ChiTietThueNha,
    scSearchThueNha: SearchThueNha
}, {
    initialRouteName: 'scHomeThueNha',
    headerMode: 'none',
})
// ================================================================


// Luồng màn hình Xe khách=========================================
export const StackXeKhach = createStackNavigator({
    scHomeXeKhach: XeKhach,
    scTimXe: TimXe,
    scDsNhaXe: DachSachNhaXe,
    scThongTinNhaXe: ThongTinNhaXe,
}, {
    initialRouteName: 'scHomeXeKhach',
    headerMode: 'none',
})
// ================================================================





export const Modal_Widget = {
    // Các modal của Widget đều khai báo ở đây
    Modal_TuyChon: ModalTuyChon,
}