import Utils from "../../app/Utils";
import AppCodeConfig from "../../app/AppCodeConfig";
const PREFIX = 'api/autonoibo/';
const PREFIX1 = 'api/xulyphananhnoibo/';

async function GetList_ThaoTacXuLy() {
    let res = await Utils.get_api(PREFIX + `GetList_ThaoTacXuLy`, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
}

async function GetList_MucDoAll() {
    let res = await Utils.get_api(PREFIX + `GetList_MucDoAll?more=true`, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
};

async function DanhSachPA(IdStep = '', page = 1, more = false, record = 10, keyword = '', IdLinhVuc = '', IdChuyenMuc = '', MucDo = '', NguonPA = '', TuNgay = '', DenNgay = '', CoQuyen = '1', mucdokhancap = '', ngoainhap = -1) {
    Utils.nlog("gia tri ngai nhap ", ngoainhap)
    Utils.nlog('link', PREFIX + `/DanhSachPA?sortOrder=desc&sortField=CreatedDate&pageNumber=0&pageSize=10&OrderBy=CreatedDate&page=${page}&record=${record}&more=${more}&filter.keys=keyword|IdStep|IdLinhVuc|IdChuyenMuc|MucDo|NguonPA|tungay|denngay|${ngoainhap != -1 ? `ngoainhap|` : ''}CoQuyen|mucdokhancap&filter.vals=${keyword}|${IdStep}|${IdLinhVuc}|${IdChuyenMuc}|${MucDo}|${NguonPA}|${TuNgay}|${DenNgay}|${ngoainhap != -1 ? `${ngoainhap}|${CoQuyen}` : `${CoQuyen}`}|${mucdokhancap}`)
    let res = await Utils.get_api(
        // PREFIX + `DanhSachPA?sortOrder=desc&sortField=CreatedDate&pageNumber=0x&pageSize=${pageSize}&OrderBy=CreatedDate&page=${page}&keyword=&record=10&trangthai=0&more=false&IdStep=${IdStep}&CoQuyen=0&mucdokhancap=100&filter.keys=IdStep|CoQuyen|mucdokhancap&filter.vals=${IdStep}|0|100`,
        PREFIX + `/DanhSachPA?sortOrder=desc&sortField=CreatedDate&pageNumber=0&pageSize=10&OrderBy=CreatedDate&page=${page}&record=${record}&more=${more}&filter.keys=keyword|IdStep|IdLinhVuc|IdChuyenMuc|MucDo|NguonPA|tungay|denngay|${ngoainhap != -1 ? `ngoainhap|` : ''}CoQuyen|mucdokhancap&filter.vals=${keyword}|${IdStep}|${IdLinhVuc}|${IdChuyenMuc}|${MucDo}|${NguonPA}|${TuNgay}|${DenNgay}|${ngoainhap != -1 ? `${ngoainhap}|${CoQuyen}` : `${CoQuyen}`}|${mucdokhancap}`,
        false,
        false, true, AppCodeConfig.APP_ADMIN)

    return res;
}

async function ChiTietPhanAnh(IdPA) {
    let res = await Utils.get_api(PREFIX + `ChiTietPhanAnh?IdPA=${IdPA}`, false, true, true, AppCodeConfig.APP_ADMIN)
    return res;
}

async function ChiTietGhiChu(IdPA) {
    let res = await Utils.get_api(PREFIX + `ChiTietGhiChu?IdPA=${IdPA}`, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
};
async function ChiTietTraoDoi(IdPA) {
    let res = await Utils.get_api(PREFIX + `ChiTietTraoDoi?IdPA=${IdPA}`, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
};
async function GetList_NhatKyThaoTacPhanAnh(IdPA) {
    let res = await Utils.get_api(PREFIX + `GetList_NhatKyThaoTacPhanAnh?IdPA=${IdPA}`, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
};
async function XuLyQuyTrinhPhanAnh(Body = {}) {
    let strBody = JSON.stringify(Body)
    // Utils.nlog("gia tri xu li - XuLyQuyTrinhPhanAnh noi bo:", strBody)
    let res = await Utils.post_api(PREFIX + 'XuLyQuyTrinhPhanAnh', strBody, false, true, true, AppCodeConfig.APP_ADMIN)
    return res;
}

async function GetCapDonViAll() {
    let res = await Utils.get_api(PREFIX + `GetCapDonViAll`, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
};

async function TraoDoi(Body = {}) {
    let strBody = JSON.stringify(Body)
    let res = await Utils.post_api(PREFIX + 'TraoDoi', strBody, false, true, true, AppCodeConfig.APP_ADMIN)
    return res;
};
async function GhiChu(IdPA, NoiDung = '', IdRow = '', IsDel = false) {
    const body = JSON.stringify({
        IdRow,
        IdPA,
        NoiDung,
        IsDel,
        Is3C: false
    });
    let res = await Utils.post_api(PREFIX + `GhiChu`, body, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
};


// async function XuLyQuyTrinhPhanAnh(Body = {}) {
//     let strBody = JSON.stringify(Body)
//     Utils.nlog("gia tri xu li - XuLyQuyTrinhPhanAnh:", strBody)
//     let res = await Utils.post_api(PREFIX + 'XuLyQuyTrinhPhanAnh', strBody, false, true);
//     return res;
// }
//api/xulyphananh/GetCapDonVi_PhanPhoi
async function GetCapDonVi_PhanPhoi(IdPA = '', NextStep = '') {
    let strBody = JSON.stringify({
        IdPA: IdPA,
        NextStep: NextStep
    })
    let val = `api/xulyphananh/GetCapDonVi_PhanPhoi`
    let res = await Utils.post_api(val, strBody, false, true, true, AppCodeConfig.APP_ADMIN)
    return res
}
async function GetList_TrangThaiPhanAnh() {
    let res = await Utils.get_api('api/xulyphananh/' + `GetList_TrangThaiPhanAnh`, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
};

export {
    GetList_ThaoTacXuLy, GetList_MucDoAll, DanhSachPA, ChiTietPhanAnh, ChiTietGhiChu, ChiTietTraoDoi,
    GetList_NhatKyThaoTacPhanAnh, GetCapDonViAll, XuLyQuyTrinhPhanAnh, TraoDoi, GhiChu, GetCapDonVi_PhanPhoi, GetList_TrangThaiPhanAnh
}