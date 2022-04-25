import Utils from "../../app/Utils";
import AppCodeConfig from "../../app/AppCodeConfig";
import { nGlobalKeys } from "../../app/keys/globalKey";
import { appConfig } from "../../app/Config";
const PREFIX = 'api/auto/';
const PREFIX_NB = 'api/autonoibo/';
const PREFIX_XL = 'api/xulyphananh/';
///api/xulyphananh/DanhSachPDonVi

async function DanhSachPA(IdStep = '', page = 1, more = false, record = 10, keyword = '', IdLinhVuc = '',
    IdChuyenMuc = '', MucDo = '', NguonPA = '', TuNgay = '', DenNgay = '', CoQuyen = '1', mucdokhancap = '',
    ngoainhap = -1, isNoiBo = false, check = '') {
    const tmp = `api${Utils.getGlobal(nGlobalKeys.RootThaiNguyen, appConfig.rootIOC, AppCodeConfig.APP_ADMIN)}/auto/`;

    let sort_oderby = 'CreatedDate';

    let API_Name = check == 1 ? 'GetList_PhanAnhKiemSoat' : 'DanhSachPA';
    let IdStep_status = check == 1 ? 'status' : 'IdStep'
    if (IdStep == -1) { //DS PA từng tham gia
        sort_oderby = 'MucDo';
        API_Name = 'DanhSachPAUser';
        IdStep = '';
    }
    if (IdStep == -2) { //DS PA Đơn vị
        sort_oderby = 'MucDo';
        API_Name = 'DanhSachPDonVi';
        IdStep = '';
    }

    // Utils.nlog("gia tri check ", check);
    if (check == 0) {
        var urlDS = isNoiBo ? PREFIX_NB : (IdStep == '' ? PREFIX_XL : tmp) + `${API_Name}?sortOrder=desc&sortField=${sort_oderby}&pageNumber=0
        &pageSize=${record}&OrderBy=${sort_oderby}&page=${page}&record=${record}&more=${more}
        &filter.keys=keyword|${IdStep_status}|IdLinhVuc|IdChuyenMuc|MucDo|NguonPA|tungay|denngay|${ngoainhap != -1 ?
                `ngoainhap|` : ''}CoQuyen|mucdokhancap
        &filter.vals=${keyword}|${IdStep}|${IdLinhVuc}|${IdChuyenMuc}|${MucDo}|${NguonPA}|${TuNgay}|${DenNgay}|${ngoainhap != -1 ? `${ngoainhap}|${CoQuyen}` : `${CoQuyen}`}|${mucdokhancap}`;
    }
    if (check == 1) {
        var urlDS = PREFIX_XL + `${API_Name}?sortOrder=desc&sortField=${sort_oderby}&pageNumber=0
        &pageSize=${record}&OrderBy=${sort_oderby}&page=${page}&record=${record}&more=${more}
        &filter.keys=keyword|${IdStep_status}|linhvuc|chuyenmuc|mucdo|nguonpa|tungay|denngay|${ngoainhap != -1 ?
                `ngoainhap|` : ''}CoQuyen|mucdokhancap
        &filter.vals=${keyword}|${IdStep}|${IdLinhVuc}|${IdChuyenMuc}|${MucDo}|${NguonPA}|${TuNgay}|${DenNgay}|${ngoainhap != -1 ? `${ngoainhap}|${CoQuyen}` : `${CoQuyen}`}|${mucdokhancap}`;
    }




    Utils.nlog('link_DanhSachPA<><><><><><><><><>:', urlDS)

    let res = await Utils.get_api(urlDS, false, false, false, AppCodeConfig.APP_ADMIN)

    return res;
}


async function ChiTietPhanAnh(IdPA) {
    const vals = `api${Utils.getGlobal(nGlobalKeys.RootThaiNguyen, appConfig.rootIOC, AppCodeConfig.APP_ADMIN)}/auto/`;
    let res = await Utils.get_api(vals + `ChiTietPhanAnh?IdPA=${IdPA}`, false, true, true, AppCodeConfig.APP_ADMIN)
    return res;
}
async function GetList_MucDoAll() {
    const vals = `api${Utils.getGlobal(nGlobalKeys.RootThaiNguyen, appConfig.rootIOC, AppCodeConfig.APP_ADMIN)}/auto/`;
    let res = await Utils.get_api(vals + `GetList_MucDoAll?more=true`, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
};


async function GetList_LinhVuc() {
    const vals = `api${Utils.getGlobal(nGlobalKeys.RootThaiNguyen, appConfig.rootIOC, AppCodeConfig.APP_ADMIN)}/auto/`;
    let res = await Utils.get_api(vals + `GetList_LinhVuc?more=true`, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
};

async function GetList_NhatKyThaoTacPhanAnh(IdPA) {
    const vals = `api${Utils.getGlobal(nGlobalKeys.RootThaiNguyen, appConfig.rootIOC, AppCodeConfig.APP_ADMIN)}/auto/`;
    let res = await Utils.get_api(vals + `GetList_NhatKyThaoTacPhanAnh?IdPA=${IdPA}`, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
};

async function ChiTietGhiChu(IdPA) {
    const vals = `api${Utils.getGlobal(nGlobalKeys.RootThaiNguyen, appConfig.rootIOC, AppCodeConfig.APP_ADMIN)}/auto/`;
    let res = await Utils.get_api(vals + `ChiTietGhiChu?IdPA=${IdPA}`, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
};

async function ChiTietTraoDoi(IdPA) {
    const vals = `api${Utils.getGlobal(nGlobalKeys.RootThaiNguyen, appConfig.rootIOC, AppCodeConfig.APP_ADMIN)}/auto/`;
    let res = await Utils.get_api(vals + `ChiTietTraoDoi?IdPA=${IdPA}`, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
};

async function GhiChu(IdPA, NoiDung = '', IdRow = '', IsDel = false) {
    const body = JSON.stringify({
        IdRow,
        IdPA,
        NoiDung,
        IsDel
    });
    const vals = `api${Utils.getGlobal(nGlobalKeys.RootThaiNguyen, appConfig.rootIOC, AppCodeConfig.APP_ADMIN)}/auto/`;
    let res = await Utils.post_api(vals + `GhiChu`, body, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
};

async function DanhSachPATraoDoi(more = true) {
    const vals = `api${Utils.getGlobal(nGlobalKeys.RootThaiNguyen, appConfig.rootIOC, AppCodeConfig.APP_ADMIN)}/auto/`;
    let res = await Utils.get_api(vals + `DanhSachPATraoDoi?more=${more}`, false, false, AppCodeConfig.APP_ADMIN)
    return res;
};
//api/thainguyen/auto/DanhSachPANoChecker
async function DanhSachPANoChecker(page = 1, record = 10, val = '') {
    const vals = `api${Utils.getGlobal(nGlobalKeys.RootThaiNguyen, appConfig.rootIOC, AppCodeConfig.APP_ADMIN)}/auto/`;
    var url = vals + `DanhSachPANoChecker?sortOrder=asc&sortField=id&pageNumber=0&pageSize=10&page=${page}&record=${record}&trangthai=0&more=false`;
    if (val != '') {
        url = vals + `DanhSachPANoChecker?sortOrder=asc&sortField=id&pageNumber=0&pageSize=10&page=${page}&record=${record}&trangthai=0&more=false&keyword=${val}&filter.keys=keyword&filter.vals=${val}`;
    }
    let res = await Utils.get_api(url, false, true, true, AppCodeConfig.APP_ADMIN)

    return res;
};
async function GetCapDonViAll() {
    const vals = `api${Utils.getGlobal(nGlobalKeys.RootThaiNguyen, appConfig.rootIOC, AppCodeConfig.APP_ADMIN)}/auto/`;
    let res = await Utils.get_api(vals + `GetCapDonViAll`, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
};
//api/thainguyen/auto/XuLyQuyTrinhPhanAnh
async function XuLyQuyTrinhPhanAnh(Body = {}) {
    const vals = `api${Utils.getGlobal(nGlobalKeys.RootThaiNguyen, appConfig.rootIOC, AppCodeConfig.APP_ADMIN)}/auto/`;
    let strBody = JSON.stringify(Body)
    // Utils.nlog("gia tri xu li - XuLyQuyTrinhPhanAnh:",)
    let res = await Utils.post_api(vals + 'XuLyQuyTrinhPhanAnh', strBody, false, true, true, AppCodeConfig.APP_ADMIN)
    return res;
}
////tay-ninh-admin-api.jeecrms.com/api/thainguyen/auto/UpdateBeforPublic
async function UpdateBeforPublic(Body = {}) {
    const vals = `api${Utils.getGlobal(nGlobalKeys.RootThaiNguyen, appConfig.rootIOC, AppCodeConfig.APP_ADMIN)}/auto/`;
    let strBody = JSON.stringify(Body)
    Utils.nlog("gia tri xu li- UpdateBeforPublic", strBody)
    let res = await Utils.post_api(vals + 'UpdateBeforPublic', strBody, false, true, true, AppCodeConfig.APP_ADMIN)
    return res;
}
//api/thainguyen/auto/UpdatePhanAnhBackEnd
async function UpdatePhanAnhBackEnd(Body = {}) {
    const vals = `api${Utils.getGlobal(nGlobalKeys.RootThaiNguyen, appConfig.rootIOC, AppCodeConfig.APP_ADMIN)}/auto/`;
    let strBody = JSON.stringify(Body)
    Utils.nlog("gia tri xu li - UpdateBeforPublic", strBody)
    let res = await Utils.post_api(vals + 'UpdatePhanAnhBackEnd', strBody, false, true, true, AppCodeConfig.APP_ADMIN)
    return res;
}

async function TraoDoi(Body = {}) {
    const vals = `api${Utils.getGlobal(nGlobalKeys.RootThaiNguyen, appConfig.rootIOC, AppCodeConfig.APP_ADMIN)}/auto/`;
    let strBody = JSON.stringify(Body)
    let res = await Utils.post_api(vals + 'TraoDoi', strBody, false, true, true, AppCodeConfig.APP_ADMIN)
    return res;
};

async function GetList_ThaoTacXuLy() {
    const vals = `api${Utils.getGlobal(nGlobalKeys.RootThaiNguyen, appConfig.rootIOC, AppCodeConfig.APP_ADMIN)}/auto/`;
    let res = await Utils.get_api(vals + `GetList_ThaoTacXuLy`, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
};
//https://tay-ninh-admin-api.bookve.com.vn/api/thainguyen/auto/FixProcess
async function FixProcess(Body = {}) {
    const vals = `api${Utils.getGlobal(nGlobalKeys.RootThaiNguyen, appConfig.rootIOC, AppCodeConfig.APP_ADMIN)}/auto/`;
    let strBody = JSON.stringify(Body)
    let res = await Utils.post_api(vals + 'FixProcess', strBody, false, true, true, AppCodeConfig.APP_ADMIN)
    return res;
};
// api / auto / UpdateHanXuLyPA
async function UpdateHanXuLyPA(Body = {}) {
    const vals = `api${Utils.getGlobal(nGlobalKeys.RootThaiNguyen, appConfig.rootIOC, AppCodeConfig.APP_ADMIN)}/auto/`;
    let strBody = JSON.stringify(Body)
    Utils.nlog("gia tri body", strBody)
    let res = await Utils.post_api(vals + 'UpdateHanXuLyPA', strBody, false, true, true, AppCodeConfig.APP_ADMIN)
    return res;
};
// api/thainguyen/auto/DanhSachNguoiDungXuLyStep?

async function DanhSachNguoiDungXuLyStep(vals = '') {
    const url = `api${Utils.getGlobal(nGlobalKeys.RootThaiNguyen, appConfig.rootIOC, AppCodeConfig.APP_ADMIN)}/auto/`;
    let res = await Utils.get_api(url + `DanhSachNguoiDungXuLyStep?more=true&filter.keys=idpa|idstep|idnext|idcapdv|iddv|isComeBack&filter.vals=${vals}`, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
};

async function GetList_PhanAnhCoTheoDoiCuaDonVi(objectFilter = {

}) {
    let filter = ''
    for (const property in objectFilter) {
        filter = filter + `&${property}=${objectFilter[property]}`
    }
    // Utils.nlog(",........Filter", filter)
    let res = await Utils.get_api(`api/xulyphananh/GetList_PhanAnhCoTheoDoiCuaDonVi?${filter}`, false, true, false, AppCodeConfig.APP_ADMIN)
    return res;
};
// api/thainguyen/auto/DanhSachCaNhanXuLyTheoDonViStep
async function DanhSachCaNhanXuLyTheoDonViStep(DSDonVi, IdPA, IdStep, ActionFormChon) {
    const vals = `api${Utils.getGlobal(nGlobalKeys.RootThaiNguyen, appConfig.rootIOC, AppCodeConfig.APP_ADMIN)}/auto/`;
    const strBody = JSON.stringify({
        DSDonVi,
        IdPA,
        IdStep,
        ActionFormChon
    });
    // Utils.nlog("gia tri body DanhSachCaNhanXuLyTheoDonViStep", strBody)
    let res = await Utils.post_api(vals + 'DanhSachCaNhanXuLyTheoDonViStep', strBody, false, true, true, AppCodeConfig.APP_ADMIN)
    return res;
};

//api/thainguyen/xulyphananh/KhongCongKhaiFileDinhKem?IdRows=232,233,235
async function KhongCongKhaiFileDinhKem(listIdRow = []) {
    let strIdRow = listIdRow.length > 0 ? listIdRow.toString() : ``
    let vals = `api${Utils.getGlobal(nGlobalKeys.RootThaiNguyen, appConfig.rootIOC, AppCodeConfig.APP_ADMIN)}/xulyphananh/KhongCongKhaiFileDinhKem?IdRows=${strIdRow}`;
    Utils.nlog('[REST API] URL', vals)
    let res = await Utils.get_api(vals, false, true, false, AppCodeConfig.APP_ADMIN)
    return res;
};
//api/thainguyen/auto/ThuHoiVeIOC
async function ThuHoiVeIOC(IdPA, NoiDungXL = '', Status) {
    const body = JSON.stringify({
        IdPA,
        NoiDungXL,
        Status
    });
    Utils.nlog('GIa tri body Thu Hoi', body)
    const vals = `api${Utils.getGlobal(nGlobalKeys.RootThaiNguyen, appConfig.rootIOC, AppCodeConfig.APP_ADMIN)}/auto/`;
    let res = await Utils.post_api(vals + `ThuHoiVeIOC`, body, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
};
export {
    DanhSachPA, GetList_MucDoAll, GetList_LinhVuc, ChiTietPhanAnh, GetList_NhatKyThaoTacPhanAnh, ChiTietGhiChu, ChiTietTraoDoi, GhiChu, UpdateHanXuLyPA, DanhSachNguoiDungXuLyStep,
    DanhSachPATraoDoi, GetCapDonViAll, XuLyQuyTrinhPhanAnh, TraoDoi, UpdatePhanAnhBackEnd, DanhSachPANoChecker, GetList_ThaoTacXuLy, FixProcess, UpdateBeforPublic, GetList_PhanAnhCoTheoDoiCuaDonVi,
    DanhSachCaNhanXuLyTheoDonViStep, KhongCongKhaiFileDinhKem, ThuHoiVeIOC
}