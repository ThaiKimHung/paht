import { appConfig } from "../../app/Config";
import Utils from "../../app/Utils";
import AppCodeConfig from "../../app/AppCodeConfig";
const PREFIX = 'api/xulyhanhchinh/';
// https://ca-long-an-admin-api.vts-paht.com/api/xulyhanhchinh/GetList_HanhChinh?sortOrder=asc&sortField=&page=1&record=10&OrderBy=&filter.keys=tungay%7Cdenngay&filter.vals=16-09-2020%7C31-10-2020
async function GetList_HanhChinh(objectFilter = {
    "sortOrder": "asc",
    "sortField": "",
    "page": "1",
    "record": "10",
    "OrderBy": "",
    "filter.keys": "tungay|denngay",
    "filter.vals": "16 - 09 - 2020|31 - 10 - 2020"
}) {
    let filter = ''
    for (const property in objectFilter) {

        filter = filter + `&${property}=${objectFilter[property]}`
    }

    let res = await Utils.get_api(`api/xulyhanhchinh/GetList_HanhChinh?${filter}`, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
};

async function GetList_TrangThai() {
    let res = await Utils.get_api(PREFIX + `GetList_TrangThai`, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
};

//api/donvi/GetList_DonVi?sortOrder=asc&sortField=&pageNumber=0&pageSize=10&OrderBy=&page=0&keyword=&record=10&trangthai=0&more=true
async function GetList_DonVi(objectFilter = {
    "sortOrder": "asc",
    "sortField": "",
    "pageNumber": "0",
    "pageSize": "10",
    "OrderBy": "",
    "page": "0",
    "keyword": "",
    "record": "10",
    "trangthai": "0",
    "more": true,
}) {
    let filter = ''
    for (const property in objectFilter) {
        // console.log(`${property}: ${objectFilter[property]}`);
        filter = filter + `&${property}=${objectFilter[property]}`
    }
    let res = await Utils.get_api(`api/donvi/GetList_DonVi?${filter}`, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
};

//api/xulyhanhchinh/DanhSachCanBo?sortOrder=asc&sortField=&pageNumber=0&pageSize=10&OrderBy=&page=0&keyword=&record=10&trangthai=0&more=true&filter.keys=IdDonVi&filter.vals=0
// async function DanhSachCanBo(IdDonVi = 0) {
//     let objectFilter = {
//         "sortOrder": "asc",
//         "sortField": "",
//         "pageNumber": "0",
//         "pageSize": "10",
//         "OrderBy": "",
//         "page": "0",
//         "keyword": "",
//         "record": "10",
//         "trangthai": "0",
//         "more": true,
//         "filter.keys": "IdDonVi",
//         "filter.vals": IdDonVi,
//     }
//     let filter = ''
//     for (const property in objectFilter) {
//         // console.log(`${property}: ${objectFilter[property]}`);
//         filter = filter + `&${property}=${objectFilter[property]}`
//     }
//     let res = await Utils.get_api(`api/xulyhanhchinh/DanhSachCanBo?${filter}`, false, false);
//     return res;
// };

//api/linhvuc/GetList_LinhVuc?query.more=true

async function GetList_LinhVuc() {
    let res = await Utils.get_api(`api/linhvuc/GetList_LinhVuc?query.more=true`, false, false, true, AppCodeConfig.APP_ADMIN)
    return res
}

//api/xulyhanhchinh/DanhSachCongDan?sortOrder=asc&sortField=&pageNumber=0&pageSize=10&OrderBy=&page=0&keyword=&record=10&trangthai=0&more=true
async function DanhSachCongDan(objectFilter = {
    "sortOrder": "asc",
    "sortField": "",
    "pageNumber": "0",
    "pageSize": "10",
    "OrderBy": "",
    "page": "0",
    "keyword": "",
    "record": "10",
    "trangthai": "0",
    "more": true,
}) {
    let filter = ''
    for (const property in objectFilter) {
        // console.log(`${property}: ${objectFilter[property]}`);
        filter = filter + `&${property}=${objectFilter[property]}`
    }
    let res = await Utils.get_api(`api/xulyhanhchinh/DanhSachCongDan?${filter}`, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
};

/////api/xulyhanhchinh/Update_HanhChinh_ThiHanh
async function Update_HanhChinh_ThiHanh(body) {
    let strbody = JSON.stringify(body);
    let res = await Utils.post_api(PREFIX + `Update_HanhChinh_ThiHanh`, strbody, false, true, true, AppCodeConfig.APP_ADMIN)
    return res;
}

async function TaoTaiKhoanCongDanXPHC(body = {}) {
    Utils.nlog("Data trong api :<>", body)
    let bodyDangKy = JSON.stringify(body)
    var val = `${PREFIX}TaoTaiKhoanCongDanXPHC`
    let res = await Utils.post_api(val, bodyDangKy, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
}


//api/xulyhanhchinh/GetDetail_HanhChinh
async function GetDetail_HanhChinh(id = 0) {
    let res = await Utils.get_api(`api/xulyhanhchinh/GetDetail_HanhChinh?id=${id}`, false, false, true, AppCodeConfig.APP_ADMIN)
    // Utils.nlog('URL Details', appConfig.domain + `api/xulyhanhchinh/GetDetail_HanhChinh?id=${id}`)
    return res
}
//api/xulyhanhchinh/Delete_HanhChinh?id=21
async function Delete_HanhChinh(IdXuPhat) {
    let val = `${PREFIX}Delete_HanhChinh?id=${IdXuPhat}`
    let res = await Utils.get_api(val, null, false, true, true, AppCodeConfig.APP_ADMIN)
    return res;
}

async function InfoAccount(IdUser) {
    let res = await Utils.get_api(val, null, false, true, true, AppCodeConfig.APP_ADMIN)
    return res;
}

async function CapNhatTKCongDan(body = {}) {
    let bodyCapNhat = JSON.stringify(body)
    var val = `api/nguoidan/CapNhatTKCongDan`
    let res = await Utils.post_api(val, bodyCapNhat, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
}

//api/xulyhanhchinh/GetCode_XuPhatHanhChinh
async function GetCode_XuPhatHanhChinh() {
    var val = `api/xulyhanhchinh/GetCode_XuPhatHanhChinh`
    let res = await Utils.get_api(val, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
}

//api/xulyhanhchinh/Save_HanhChinh
async function Save_HanhChinh(body = {}) {
    let bodyXPHC = JSON.stringify(body)
    var val = `api/xulyhanhchinh/Save_HanhChinh`
    let res = await Utils.post_api(val, bodyXPHC, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
}
//api/xulyhanhchinh/GetDetail_ThongTinCaNhanXPHC?cmnd=3214531000
async function GetDetail_ThongTinCaNhanXPHC(CMND, isCheck) {
    var val = `${PREFIX}GetDetail_ThongTinCaNhanXPHC?cmnd=${CMND}&canhan=${isCheck}`;
    let res = await Utils.get_api(val, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
}
//https://ca-long-an-admin-api.vts-paht.com/api/xulyhanhchinh/GetList_CapThamQuyen?query.more=true
async function GetList_CapThamQuyen() {
    var val = `${PREFIX}GetList_CapThamQuyen?query.more=true`;
    let res = await Utils.get_api(val, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
}

//https://ca-long-an-admin-api.vts-paht.com/api/xulyhanhchinh/DanhSachCanBo?query.more=true&query.filter.keys=CapQDXP&query.filter.vals=4
async function DanhSachCanBo(Id) {
    var val = `${PREFIX}DanhSachCanBo?query.more=true&query.filter.keys=CapQDXP&query.filter.vals=${Id}`;
    let res = await Utils.get_api(val, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
}

//https://ca-long-an-admin-api.vts-paht.com/api/xulyhanhchinh/GetList_LinhVuc?query.more=true
async function GetList_LinhVuc_New() {
    var val = `${PREFIX}GetList_LinhVuc?query.more=true`;
    let res = await Utils.get_api(val, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
}

async function GetList_HanhChinh_New(objectFilter = {
    "sortOrder": "desc",
    "sortField": "CreatedDate",
    "pageSize": "10",
    "OrderBy": "CreatedDate",
    "page": "1",
    "record": "10",
}) {
    let filter = ''
    for (const property in objectFilter) {
        filter = filter + `&${property}=${objectFilter[property]}`
    }
    let res = await Utils.get_api(`api/congdan_xphc/GetList_HanhChinh?${filter}`, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
};

async function GetDetail_HanhChinh_CD(IdXuPhat) {
    let val = `api/congdan_xphc/GetDetail_HanhChinh?id=${IdXuPhat}`
    const res = await Utils.get_api(val, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
}
export {
    GetList_HanhChinh, GetList_TrangThai, GetList_DonVi, DanhSachCanBo, GetList_LinhVuc, DanhSachCongDan, Update_HanhChinh_ThiHanh, TaoTaiKhoanCongDanXPHC, GetList_HanhChinh_New, GetDetail_HanhChinh_CD,
    Delete_HanhChinh, GetDetail_HanhChinh, InfoAccount, CapNhatTKCongDan, GetCode_XuPhatHanhChinh, Save_HanhChinh, GetDetail_ThongTinCaNhanXPHC, GetList_CapThamQuyen, GetList_LinhVuc_New
}

