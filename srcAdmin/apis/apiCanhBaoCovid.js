
import AppCodeConfig from "../../app/AppCodeConfig";
import { nGlobalKeys } from "../../app/keys/globalKey";
import Utils from "../../app/Utils";

//api/map-sos/GetList_TinhTrangAll
async function GetList_TinhTrangAll() {
    const res = await Utils.get_api('api/map-sos/GetList_TinhTrangAll', false, false, false, AppCodeConfig.APP_ADMIN, 1)
    return res;
};

//api/sos/GetListSOS?sortOrder=asc&sortField=HoTen&pageNumber=1&pageSize=10&OrderBy=HoTen&page=1&keyword=&record=10&trangthai=1&more=false&filter.keys=tungay|denngay&filter.vals=|
async function GetListSOS(obj = {
    "sortOrder": "asc",
    "sortField": "CreatedDate",
    "pageNumber": "1",
    "pageSize": "10",
    "OrderBy": "CreatedDate",
    "page": "1",
    "keyword": "",
    "record": "10",
    "more": false,
    "filter.keys": "tungay|denngay|status|Type",
    "filter.vals": "||1|1"
}) {
    let filter = ''
    for (const property in obj) {
        filter = filter + `&${property}=${obj[property]}`
    }
    Utils.nlog(`api/sos/GetListSOS?${filter}`)
    const res = await Utils.get_api(`api/sos/GetListSOS?${filter}`, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
};

//api/sos/Info_SOS?Id=8
async function Info_SOS(Id = '') {
    const res = await Utils.get_api(`api/sos/Info_SOS?Id=${Id}`, false, false, true, AppCodeConfig.APP_ADMIN, 1)
    return res;
};

//api/sos/Info_SOS_APP?Id=6&DevicesToken=9006b108-bbe8-4e47-ad8e-f46bc6c3d9d4
async function Info_SOS_APP(Id = '') {
    let DevicesToken = await Utils.ngetStore(nGlobalKeys.userId_OneSignal, '');
    const res = await Utils.get_api(`api/sos/Info_SOS_APP?Id=${Id}&DevicesToken=${DevicesToken}`, false, false, true, AppCodeConfig.APP_ADMIN, 1)
    return res;
};

//api/nguoidung/DanhSachNguoiDung?query.filter.keys=DonVi|IdRole&query.filter.vals=382|1038
async function DanhSachNguoiDung(IdDonVi = '', IdRole = '') {
    const res = await Utils.get_api(`api/nguoidung/DanhSachNguoiDung?query.filter.keys=DonVi|IdRole&query.filter.vals=${IdDonVi}|${IdRole}`, false, false, true, AppCodeConfig.APP_ADMIN, 1)
    return res;
};

//api/sos/GetList_NhatKyThaoTac?Id=4
async function GetList_NhatKyThaoTac(Id = '') {
    const res = await Utils.get_api(`api/sos/GetList_NhatKyThaoTac?Id=${Id}`, false, false, true, AppCodeConfig.APP_ADMIN, 1)
    return res;
};

//api/sos/Info_SOSDetail?Id=4
async function Info_SOSDetail(Id = '') {
    const res = await Utils.get_api(`api/sos/Info_SOSDetail?Id=${Id}`, false, false, true, AppCodeConfig.APP_ADMIN, 1)
    return res;
};

//Tiep nhận SOS api/sos/TiepNhanSOS
async function TiepNhanSOS(body) {
    let strBody = JSON.stringify(body)
    const res = await Utils.post_api(`api/sos/TiepNhanSOS`, strBody, false, false, true, AppCodeConfig.APP_ADMIN, 1)
    return res;
};

//Hoan Thanh SOS api/sos/HoanThanhSOS
async function HoanThanhSOS(body) {
    let strBody = JSON.stringify(body)
    const res = await Utils.post_api(`api/sos/HoanThanhSOS`, strBody, false, false, true, AppCodeConfig.APP_ADMIN, 1)
    return res;
};

//thu hoi sos api/sos/ThuHoiSOS
async function ThuHoiSOS(body) {
    let strBody = JSON.stringify(body)
    const res = await Utils.post_api(`api/sos/ThuHoiSOS`, strBody, false, false, true, AppCodeConfig.APP_ADMIN, 1)
    return res;
};

//Xoa SOS api/sos/DeleteSOS/25
async function DeleteSOS(Id = '') {
    const res = await Utils.get_api(`api/sos/DeleteSOS/${Id}`, false, false, true, AppCodeConfig.APP_ADMIN, 1)
    return res;
};
async function ChuyenXuLySOS(body) {
    let strBody = JSON.stringify(body)
    const res = await Utils.post_api(`api/sos/AddEditSOS`, strBody, false, false, true, AppCodeConfig.APP_ADMIN, 1)
    return res;
};
export {
    GetList_TinhTrangAll, GetListSOS, Info_SOS, DanhSachNguoiDung, GetList_NhatKyThaoTac, Info_SOSDetail, TiepNhanSOS, HoanThanhSOS, ThuHoiSOS, DeleteSOS,
    ChuyenXuLySOS, Info_SOS_APP
}