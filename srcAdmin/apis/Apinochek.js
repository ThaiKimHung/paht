//https://tay-ninh-admin-api.bookve.com.vn/api/thongbao/GetThongBao

import Utils from "../../app/Utils";
import AppCodeConfig from "../../app/AppCodeConfig";
import { nGlobalKeys } from "../../app/keys/globalKey";
import { appConfig } from "../../app/Config";
const PREFIX = 'api/thongbao/';
const PREFIXNguoiDung = 'api/nguoidung/'

async function GetThongBao() {
    let res = await Utils.get_api(PREFIX + `GetThongBao?`, false, true, true, AppCodeConfig.APP_ADMIN)
    return res;
};
//api/nguoidung/DanhSachNguoiDung
async function DanhSachNguoiDung() {
    let res = await Utils.get_api(PREFIXNguoiDung + `DanhSachNguoiDung?more=true`, false, true, true, AppCodeConfig.APP_ADMIN)
    return res;
};

async function DanhSachNguoiDung_SOS(IdDV = '') {
    let val = `${PREFIXNguoiDung}DanhSachNguoiDung?query.filter.keys=DonVi|IdRole&query.filter.vals=${IdDV}|1038`
    let res = await Utils.get_api(val, false, true, true, AppCodeConfig.APP_ADMIN)
    Utils.nlog('Gai tri vals NGuoi Dung', val)
    return res;
}
//api/thainguyen/auto/CheckersByStep?IdPA=243&IdStep=3 Dùng cho những tỉnh từ Thái Nguyên trở về sau
//api/auto/CheckersByStep?IdPA=243&IdStep=3
async function CheckersByStep(IdPA = 0, IdStep = 3) {
    let res = await Utils.get_api(`api${Utils.getGlobal(nGlobalKeys.RootThaiNguyen, appConfig.rootIOC, AppCodeConfig.APP_ADMIN)}/auto/` + `CheckersByStep?IdPA=${IdPA}&IdStep=${IdStep}`, false, true, true, AppCodeConfig.APP_ADMIN)
    return res;
};
export {
    GetThongBao, DanhSachNguoiDung, CheckersByStep, DanhSachNguoiDung_SOS
}