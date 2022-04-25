import Utils from '../../../app/Utils';
import moment from 'moment';
import { appConfig } from '../../../app/Config';
import { Platform } from 'react-native';
import AppCodeConfig from '../../../app/AppCodeConfig';

const PREFIX = 'api/HcmMiniApp/';
// /api/HcmMiniApp/account/TaoTaiKhoan
export async function DangKyTK(body) {
    let strBody = JSON.stringify({
        ...body
    })
    Utils.nlog('strBody xoá DangKyTK -----', strBody);
    let res = await Utils.post_api(PREFIX + 'account/TaoTaiKhoan', strBody, false, false);
    return res;

}
// /api/HcmMiniApp/account/CapNhatTTCongDan
export async function CapNhatTTCongDan(body) {
    let strBody = JSON.stringify({
        ...body
    })
    Utils.nlog('strBody CapNhatTTCongDan -----', strBody);
    let res = await Utils.post_api(PREFIX + 'account/CapNhatTTCongDan', strBody, false, false);
    return res;

}

export async function Login(Username = '', Password = '') {
    let strBody = JSON.stringify({
        "UserName": Username,
        "Password": Password
    })

    let res = await Utils.post_api(PREFIX + `account/Login`, strBody, false, false);
    return res;
}
// https://hcm-mini-app-admin-api.vts-paht.com/api/HcmMiniApp/dungchung/GetDanhSachDonVi?IdCapDonVi=1
export async function GetListDonVi(idCap = '', idDV = '') {
    var val = PREFIX + `dungchung/GetDanhSachDonVi?IdCapDonVi=${idCap}&IdDonVi=${idDV}`
    Utils.nlog("res--------url", val)
    let res = await Utils.get_api(val, false, false);
    return res;
}
// api/HcmMiniApp/account/InfoAccountByUserName?UserName=0392921546&Loai=1
export async function GetInfoAccountByUserName(sdt = '', loai = '') {
    var val = PREFIX + `account/InfoAccountByUserName?UserName=${sdt}&Loai=${loai}`
    Utils.nlog("res--------url", val)
    let res = await Utils.get_api(val, false, false);
    return res;
}
// /api/HcmMiniApp/account/ThemNguoiPhuThuoc
// api/HcmMiniApp/account/ThongTinNguoiPhuThuoc?SDT=0967676767&Loai=2
export async function ThongTinNguoiPhuThuoc(sdt = '', loai = '') {
    var val = PREFIX + `account/ThongTinNguoiPhuThuoc?SDT=${sdt}&Loai=${loai}`
    Utils.nlog("res--------url", val)
    let res = await Utils.get_api(val, false, false);
    return res;
}

export async function ThemNguoiPhuThuoc(body) {
    let strBody = JSON.stringify({
        ...body
    })
    Utils.nlog('strBody xoá thông báo -----', strBody);
    let res = await Utils.post_api(PREFIX + 'account/ThemNguoiPhuThuoc', strBody, false, false);
    Utils.nlog('Thêm người phu thuộc -----', res);
    return res;

}
// /api/HcmMiniApp/account/DanhSachNguoiPhuThuoc?Id={Id_Account}
export async function DanhSachNguoiPhuThuoc(Id) {
    let val = PREFIX + `account/DanhSachNguoiPhuThuoc?Id=${Id}`
    Utils.nlog("res--------url", val)
    let res = await Utils.get_api(val, false, false);
    return res;

}
// /api/HcmMiniApp/account/CapNhatLoaiTaiKhoan?Loai=1
export async function CapNhatLoaiTaiKhoan(Loai = '') {
    let val = PREFIX + `account/CapNhatLoaiTaiKhoan?Loai=${Loai}`
    Utils.nlog("res--------url", val)
    let res = await Utils.get_api(val, false, false);
    return res;

}

// api/HcmMiniApp/account/ThemCongTy
export async function ThemCongTy(body, isAdd) {
    let strBody = JSON.stringify({
        ...body
    })
    Utils.nlog('strBody xoá thông báo -----', isAdd);
    let url = isAdd == true ? 'account/ThemCongTy' : "account/ChinhSuaThongTinCongTy";
    let res = await Utils.post_api(PREFIX + url, strBody, false, false);
    return res;

}
// /api/HcmMiniApp/account/XoaNguoiCongTy?Id=10010
export async function XoaNguoiCongTy(Id) {
    var val = PREFIX + `account/XoaNguoiCongTy?Id=${Id}`
    Utils.nlog("res--------url", val)
    let res = await Utils.get_api(val, false, false);
    return res;

}


//KHAI BÁO NGẮN HẠN
///api/HcmMiniApp/account/KhaiBaoNganHan
export async function KhaiBaoNganHan(body) {
    let strBody = JSON.stringify(body)
    let res = await Utils.post_api(`${PREFIX}account/KhaiBaoNganHan`, strBody, false, false, true)
    return res
}

//DANH SÁCH XÁC NHẬN/YÊU CẦU NGẮN HẠN
///api/HcmMiniApp/confirm/List_ConfirmInfo?query.more=false&query.page=1&query.record=10
export async function DSXacNhanNganHan(isXacNhan = false, page = 1, record = 10, textSearch = '', more = false) {
    let requestURL = `${PREFIX}confirm/List_ConfirmInfo?query.more=${more}&query.page=${page}&query.record=${record}` // mặc định là danh sách yêu cầu
    if (isXacNhan) {
        requestURL = requestURL + `&query.filter.keys=IsConfirm|keyword&query.filter.vals=0|${textSearch}`
    }
    Utils.nlog('[LOG] API: ', requestURL)
    let res = await Utils.get_api(requestURL, false, false, true);
    return res;
}

//XÁC NHẬN TỪ CHỐI YÊU CẦU NGẮN HẠN
///api/HcmMiniApp/confirm/ConfirmInfo_CongDan
export async function XacNhanYeuCauNganHan(body) {
    let strBody = JSON.stringify(body)
    let res = await Utils.post_api(`${PREFIX}confirm/ConfirmInfo_CongDan`, strBody, false, false, true)
    return res
}


//QUET QR && LUU LICH SUA
///api/HcmMiniApp/tramkiemsoat/AddLichSuQuetQRCode
export async function AddLichSuQuetQRCode(body) {
    let strBody = JSON.stringify(body)
    let res = await Utils.post_api(`${PREFIX}tramkiemsoat/AddLichSuQuetQRCode`, strBody, false, false, true, body.IsFromCanBo ? AppCodeConfig.APP_ADMIN : AppCodeConfig.APP_CONGDAN)
    return res
}

///api/HcmMiniApp/tramkiemsoat/AddLichSuQuetQRCode_DiCho
export async function AddLichSuQuetQRCode_DiCho(body) {
    let strBody = JSON.stringify(body)
    let res = await Utils.post_api(`${PREFIX}tramkiemsoat/AddLichSuQuetQRCode_DiCho`, strBody, false, false, true, body.IsTramCheck ? AppCodeConfig.APP_ADMIN : AppCodeConfig.APP_CONGDAN)
    return res
}


//Danh sách các tài khoản cần duyệt của chủ hộ, chủ doanh nghiệp - dành cho tài khoản công dân
// https://hcm-mini-app-admin-api.vts-paht.com/api/HcmMiniApp/confirm/List_ConfirmAccount_CongDan?query.more=false&query.page=1&query.record=10
// Loai: 1 chu hộ / 2: doanh nghiệp
export async function List_ConfirmAccount_CongDan(Loai, keysearch = '', page = 1, record = 10, more = false) {
    var val = PREFIX + `confirm/List_ConfirmAccount_CongDan?query.more=${more}&query.page=${page}&query.record=${record}&query.filter.keys=Loai|keyword&query.filter.vals=${Loai}|${keysearch}`
    Utils.nlog("BODY NPT1:", val)
    let res = await Utils.get_api(val, false, false, false, AppCodeConfig.APP_CONGDAN);
    Utils.nlog("RES NPT1:", res)
    return res;
}

//API xác nhận dành cho chủ doanh nghiệp, chủ hộ
///https://hcm-mini-app-admin-api.vts-paht.com/api/HcmMiniApp/confirm/ConfirmInfoAccountFrom_CongDan
export async function ConfirmInfoAccountFrom_CongDan(body) {
    let strBody = JSON.stringify(body)
    let res = await Utils.post_api(`${PREFIX}confirm/ConfirmInfoAccountFrom_CongDan`, strBody, false, false, true, AppCodeConfig.APP_CONGDAN)
    Utils.nlog("NPT res và body:", strBody, res)
    return res
}

///API xóa dành cho chủ doanh nghiệp, chủ hộ
// {domain}/api/HcmMiniApp/confirm/DeleteInfoAccountFrom_CongDan
export async function DeleteInfoAccountFrom_CongDan(body) {
    let strBody = JSON.stringify(body)
    let res = await Utils.post_api(`${PREFIX}confirm/DeleteInfoAccountFrom_CongDan`, strBody, false, false, true, AppCodeConfig.APP_CONGDAN)
    return res
}

///api/HcmMiniApp/account/XoaNguoiPhuThuoc
export async function XoaNguoiPhuThuoc(id) {
    var val = PREFIX + `account/XoaNguoiPhuThuoc?Id=${id}`
    let res = await Utils.get_api(val, false, false, false, AppCodeConfig.APP_CONGDAN);
    return res
}

//TO KHAI Y TE
///api/HcmMiniApp/account/KhaiBaoYTe
export async function GuiToKhaiYTe(body) {
    let strBody = JSON.stringify(body)
    let res = await Utils.post_api(`${PREFIX}account/KhaiBaoYTe`, strBody, false, false, true, AppCodeConfig.APP_CONGDAN)
    return res
}

// DANH SACH TO KHAI
///api/HcmMiniApp/account/DanhSachKhaiBaoYTe?Id=10042
export async function DanhSachToKhai(IdUser) {
    let res = await Utils.get_api(`${PREFIX}account/DanhSachKhaiBaoYTe?Id=${IdUser}`, false, false, true, AppCodeConfig.APP_CONGDAN)
    return res
}

//LICH SU XAC THUC CUA USER
///api/HcmMiniApp/tramkiemsoat/List_LichSu_QuetQRCode_CongDan?query.more=false&query.page=1&query.record=10
export async function List_LichSu_QuetQRCode_CongDan(page = 1, record = 10, more = false) {
    let res = await Utils.get_api(`${PREFIX}tramkiemsoat/List_LichSu_QuetQRCode_CongDan?query.more=${more}&query.page=${page}&query.record=${record}`, false, false, true, AppCodeConfig.APP_CONGDAN)
    return res
}

//LICH SU XAC THUC NV, NPT
//api/HcmMiniApp/tramkiemsoat/List_LichSu_QuetQRCode_NguoiPhuThuoc?query.more=false&query.page=1&query.record=10&query.filter.keys=Loai|keyword&query.filter.vals=1|
export async function List_LichSu_QuetQRCode_NguoiPhuThuoc(loai = 1, keysearch = '', page = 1, record = 10, more = false) {
    let res = await Utils.get_api(`${PREFIX}tramkiemsoat/List_LichSu_QuetQRCode_NguoiPhuThuoc?query.more=${more}&query.page=${page}&query.record=${record}&query.filter.keys=Loai|keyword&query.filter.vals=${loai}|${keysearch}`, false, false, true, AppCodeConfig.APP_CONGDAN)
    return res
}

///api/HcmMiniApp/tramkiemsoat/List_CauHoi_KhaiBaoYTe?Loai=1
export async function List_CauHoi_KhaiBaoYTe(Loai = 1) {
    //Loai 1 là KBYT, 2 la KBSK
    let res = await Utils.get_api(`${PREFIX}tramkiemsoat/List_CauHoi_KhaiBaoYTe?Loai=${Loai}`, false, false, true, AppCodeConfig.APP_CONGDAN)
    return res
}

//api/HcmMiniApp/tramkiemsoat/Confirm_KhaiBaoYTe
export async function Confirm_KhaiBaoYTe(bodyKhaiBao) {
    let res = await Utils.post_api(`${PREFIX}tramkiemsoat/Confirm_KhaiBaoYTe`, JSON.stringify(bodyKhaiBao), false, true, true, AppCodeConfig.APP_CONGDAN)
    return res
}

//api/accapp/GetThongTinCongDan?SDT=0966601459
export async function GetThongTinCongDan(SDT = '') {
    //Loai 1 là KBYT, 2 la KBSK
    let res = await Utils.get_api(`api/accapp/GetThongTinCongDan?SDT=${SDT}`, false, false, false, AppCodeConfig.APP_CONGDAN)
    return res
}
// /api/HcmMiniApp/tramkiemsoat/DangKyNgoaiTinh
export async function Confirm_KhaiBaoDiChuyen(bodyKhaiBao) {
    let res = await Utils.post_api_formdata(`${PREFIX}tramkiemsoat/DangKyNgoaiTinh`, bodyKhaiBao, false, false, AppCodeConfig.APP_CONGDAN)
    return res
}
// api/HcmMiniApp/dungchung/GetDanhSachDonVi?IdCapDonVi=&IdDonVi=
export async function GetDanhSachDonVi(IdCapDonVi = '', IdDonVi = '') {
    var val = `${PREFIX}dungchung/GetDanhSachDonVi?IdCapDonVi=${IdCapDonVi}&IdDonVi=${IdDonVi}`
    let res = await Utils.get_api(val, false, false);
    return res;
}
export async function GetList_TramKiemSoat(
    objectGet = {
        "query.more": true,
        "query.page": 1,
        "query.record": 10,
    }) {
    let query = "";
    Object.keys(objectGet).map(function (key, index) {
        query += `${query != '' ? '&' : ''}` + key + "=" + objectGet[key]
    })
    let requestURL = `${PREFIX}tramkiemsoat/List_TramKiemSoat?${query}`
    let res = await Utils.get_api(requestURL, false, false, true, AppCodeConfig.APP_CONGDAN);
    Utils.nlog("QUERY:", query)
    Utils.nlog("RES:", res)
    return res;
}

// api/accapp/GetThongTinPhieuDiChoCongDan
export async function GetThongTinPhieuDiChoCongDan() {
    var val = `api/accapp/GetThongTinPhieuDiChoCongDan`
    let res = await Utils.get_api(val, false, false);
    return res;
}


//https://hcm-binh-chanh-admin-api.vts-paht.com/api/dang-ky-ve-que/GetDoiTuong
export async function getDoiTuong() {
    var val = `api/dang-ky-ve-que/GetDoiTuong`
    let res = await Utils.get_api(val, false, false);
    return res;
}
// https://hcm-binh-chanh-admin-api.vts-paht.com/api/dang-ky-ve-que/GetKhaoSat
export async function getCauHoi() {
    var val = `api/dang-ky-ve-que/GetKhaoSat`
    let res = await Utils.get_api(val, false, false);
    return res;
}
//  https://hcm-binh-chanh-admin-api.vts-paht.com/api/dang-ky-ve-que/DangKyHoTro
export async function DangKy_HoTroKhoKhan(bodyDK) {
    let res = await Utils.post_api(`api/dang-ky-ve-que/DangKyHoTro`, JSON.stringify(bodyDK), false, false, false)
    return res
}

//https://hcm-binh-chanh-admin-api.vts-paht.com/api/dang-ky-ve-que/GetDoiTuongHoTro
export async function getDoiTuongHoTro() {
    var val = `api/dang-ky-ve-que/GetDoiTuongHoTro`
    let res = await Utils.get_api(val, false, false);
    return res;
}

//api/dang-ky-ve-que/TraCuu_DangKyHoTro?CMND=123567321
export async function TraCuu_DangKyHoTro(cmnd = '') {
    var val = `api/dang-ky-ve-que/TraCuu_DangKyHoTro?CMND=${cmnd}`
    let res = await Utils.get_api(val, false, false);
    return res;
}

//api/dang-ky-ve-que/QuetQRCode_NhanHoTro
export async function QuetQRCode_NhanHoTro(body) {
    var val = `api/dang-ky-ve-que/QuetQRCode_NhanHoTro`
    let res = await Utils.post_api(val, JSON.stringify(body), false, true, false, AppCodeConfig.APP_ADMIN);
    return res;
}

//api/cong-van/GetAllCongVan_DotTroCap
export async function GetAllCongVan_DotTroCap() {
    var val = `api/cong-van/GetAllCongVan_DotTroCap`
    let res = await Utils.get_api(val, false, false);
    return res;
}