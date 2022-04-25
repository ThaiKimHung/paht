import Utils from "../../app/Utils";
import AppCodeConfig from "../../app/AppCodeConfig";
const PREFIX = 'api/bieudo/';

// https://ca-long-an-admin-api.vts-paht.com/api/bieudo/BieuDo_XuPhatHC_TinhTrang?tungay=2020-06-03&denngay=2020-11-07&linhvuc=30&iddonvi=31000&loaithongke=1

async function BieuDo_XuPhatHC_TinhTrang(objectFilter = {
    // tungay: '2020 - 01 - 03',
    // denngay: '2020 - 11 - 07',
    // linhvuc: '30',
    // iddonvi: '31000',
    // loaithongke: '1'
}) {
    let filter = ''
    for (const property in objectFilter) {
        filter = filter + `&${property}=${objectFilter[property]}`
    }
    let res = await Utils.get_api(PREFIX + `BieuDo_XuPhatHC_TinhTrang?${filter}`, false, false, true, AppCodeConfig.APP_ADMIN)
    Utils.nlog("<><>Quan trọng", res)
    return res;
};
// https://ca-long-an-admin-api.vts-paht.com/api/donvi/GetList_DonVi?sortOrder=asc&sortField=&page=1&record=10&OrderBy=&more=true&filter.keys=IdNhomDonVi&filter.vals=0
async function GetList_DonVi(objectFilter = {
    sortOrder: "asc",
    sortField: "",
    page: 1,
    record: 10,
    OrderBy: "",
    more: true,
    "filter.keys": "IdNhomDonVi",
    "filter.vals": 0
}) {
    let filter = ''
    for (const property in objectFilter) {
        filter = filter + `&${property}=${objectFilter[property]}`
    }
    let res = await Utils.get_api(`api/donvi/GetList_DonVi?${filter}`, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;

};
// https://ca-long-an-admin-api.vts-paht.com/api/bieudo/BieuDo_XuPhatHC_ThoiHan?linhvuc=31&iddonvi=30999&loaithongke=1
async function BieuDo_XuPhatHC_ThoiHan(objectFilter = {
    // linhvuc: 31
    // iddonvi: 30999
    // loaithongke: 1
}) {
    let filter = ''
    for (const property in objectFilter) {
        filter = filter + `&${property}=${objectFilter[property]}`
    }
    let res = await Utils.get_api(PREFIX + `BieuDo_XuPhatHC_ThoiHan?${filter}`, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
};
//https://ca-long-an-admin-api.vts-paht.com/api/bieudo/BieuDo_XuPhatTheoThang?Year=2020
async function BieuDo_XuPhatTheoThang(objectFilter = {
    Year: 2020
}) {
    let filter = ''
    for (const property in objectFilter) {
        filter = filter + `&${property}=${objectFilter[property]}`
    }
    let res = await Utils.get_api(PREFIX + `BieuDo_XuPhatTheoThang?${filter}`, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
};
//https://ca-long-an-admin-api.vts-paht.com/api/bieudo/GetAllYear?type=2
async function GetAllYear(objectFilter = { type: 2 }) {
    let filter = ''
    for (const property in objectFilter) {
        filter = filter + `&${property}=${objectFilter[property]}`
    }
    let res = await Utils.get_api(PREFIX + `GetAllYear?${filter}`, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
};
// https://ca-long-an-admin-api.vts-paht.com/api/thongkexuphathc/GetList_ThongKeXPHC?sortOrder=asc&sortField=&page=1&record=10&OrderBy=&filter.keys=tungay%7Cdenngay%7Clinhvuc%7Ciddonvi%7Cloaithongke&filter.vals=07-10-2020%7C05-11-2020%7C21%7C0%7C2
async function GetList_ThongKeXPHC(objectFilter = {
    "sortOrder": "asc",
    "sortField": "",
    " page": 1,
    "record": 10,
    "OrderBy": "",
    "filter.keys": "tungay|denngay|linhvuc|iddonvi|loaithongke",
    "filter.vals": "07-10-2020|05-11-2020|21|0|2",
}) {
    let filter = ''
    for (const property in objectFilter) {
        filter = filter + `&${property}=${objectFilter[property]}`
    }
    let res = await Utils.get_api(`api/thongkexuphathc/GetList_ThongKeXPHC?${filter}`, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
};
//https://ca-long-an-admin-api.vts-paht.com/api/donvi/GetAllCapDonVi_NhomDonVi?type=0&sortOrder=asc&sortField=&page=1&record=10&OrderBy=

async function GetAllCapDonVi_NhomDonVi(objectFilter = {
    type: 0,
    sortOrder: "asc",
    sortField: "",
    page: 1,
    record: 10,
    OrderBy: ""
}) {
    let filter = ''
    for (const property in objectFilter) {
        filter = filter + `&${property}=${objectFilter[property]}`
    }
    let res = await Utils.get_api(`api/donvi/GetAllCapDonVi_NhomDonVi?${filter}`, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;

};

async function GetList_ThongKeXuPhat_TheoDonVi_ChiTiet(objectFilter = {
    "sortOrder": "asc",
    "sortField": "",
    "page": 1,
    "record": 10,
    "OrderBy": "",
    "filter.keys": "tungay|denngay|linhvuc|iddonvi|loaithongke|IsDungHan|trangthaithihanh|type",
    "filter.vals": "",
}) {
    let filter = ''
    for (const property in objectFilter) {
        filter = filter + `&${property}=${objectFilter[property]}`
    }
    // Utils.nlog('url: ', 'api/thongkexuphathc/GetList_ThongKeXuPhat_TheoDonVi_ChiTiet?' + filter)
    let res = await Utils.get_api(`api/thongkexuphathc/GetList_ThongKeXuPhat_TheoDonVi_ChiTiet?${filter}`, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
}

async function GetList_ThongKeTienXPHC(objectFilter = {
    sortOrder: "desc",
    sortField: "CreatedDate",
    page: 1,
    record: 10,
    OrderBy: "CreatedDate"
}) {
    let filter = ''
    for (const property in objectFilter) {
        filter = filter + `&${property}=${objectFilter[property]}`
    }
    let res = await Utils.get_api(`api/thongkexuphathc/GetList_ThongKeTienXPHC?${filter}`, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
};

async function GetList_ThongKeTienXuPhat_TheoDonVi_ChiTiet(objectFilter = {
    sortOrder: "desc",
    sortField: "CreatedDate",
    page: 1,
    record: 10,
    OrderBy: "CreatedDate"
}) {
    let filter = ''
    for (const property in objectFilter) {
        filter = filter + `&${property}=${objectFilter[property]}`
    }
    let res = await Utils.get_api(`api/thongkexuphathc/GetList_ThongKeTienXuPhat_TheoDonVi_ChiTiet?${filter}`, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;

};
//tungay=2020-10-01&denngay=2020-11-11&iddonvi=31000&loaithongke=1
async function BieuDo_TienXuPhatTheoDonVi_Tron(tungay, denngay, idLoaiTK, idDonVi) {
    let val = `${PREFIX}BieuDo_TienXuPhatTheoDonVi_Tron?tungay=${tungay}&denngay=${denngay}&loaithongke=${idLoaiTK}&iddonvi=${idDonVi}`
    Utils.nlog('Gia tri body tryen vao ======', val)
    let res = await Utils.get_api(val, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
};

async function BieuDo_TienXuPhatTheoDonVi_Cot(tungay, denngay, idLoaiTK, idDonVi) {
    let val = `${PREFIX}BieuDo_TienXuPhatTheoDonVi_Cot?tungay=${tungay}&denngay=${denngay}&loaithongke=${idLoaiTK}&iddonvi=${idDonVi}`
    Utils.nlog('Gia tri body tryen vao ======', val)
    let res = await Utils.get_api(val, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
};

//api/bieudo/GetList_XuPhatTheoTinhTrang_ChiTiet
async function GetList_XuPhatTheoTinhTrang_ChiTiet(objectFilter = {
    sortOrder: "asc",
    sortField: "",
    page: 1,
    record: 10,
    OrderBy: "",
    // more: false,
}) {
    let filter = ''
    for (const property in objectFilter) {
        filter = filter + `&${property}=${objectFilter[property]}`
    }
    let vals = `api/bieudo/GetList_XuPhatTheoTinhTrang_ChiTiet?${filter}`
    let res = await Utils.get_api(vals, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;

};

//api/bieudo/GetList_XuPhatTheoThoiHan_ChiTiet
async function GetList_XuPhatTheoThoiHan_ChiTiet(objectFilter = {
    sortOrder: "asc",
    sortField: "",
    page: 1,
    record: 10,
    OrderBy: "",
    // more: false,
}) {
    let filter = ''
    for (const property in objectFilter) {
        filter = filter + `&${property}=${objectFilter[property]}`
    }
    let vals = `api/bieudo/GetList_XuPhatTheoThoiHan_ChiTiet?${filter}`
    let res = await Utils.get_api(vals, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;

};

//api/bieudo/GetList_XuPhatTheoThang_ChiTiet
async function GetList_XuPhatTheoThang_ChiTiet(objectFilter = {
    sortOrder: "asc",
    sortField: "",
    page: 1,
    record: 10,
    OrderBy: "",
    // more: false,
}) {
    let filter = ''
    for (const property in objectFilter) {
        filter = filter + `&${property}=${objectFilter[property]}`
    }
    let vals = `api/bieudo/GetList_XuPhatTheoThang_ChiTiet?${filter}`
    let res = await Utils.get_api(vals, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;

};
//api/bieudo/GetList_XuPhatTheoMucPhatHanhChinh_Tron_ChiTiet
async function GetList_XuPhatTheoMucPhatHanhChinh_Tron_ChiTiet(objectFilter = {
    sortOrder: "asc",
    sortField: "",
    page: 1,
    record: 10,
    OrderBy: "",
    // more: false,
}) {
    let filter = ''
    for (const property in objectFilter) {
        filter = filter + `&${property}=${objectFilter[property]}`
    }
    let vals = `api/bieudo/GetList_XuPhatTheoMucPhatHanhChinh_Tron_ChiTiet?${filter}`
    let res = await Utils.get_api(vals, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;

};

async function GetList_XuPhatTheoMucPhatHanhChinh_Cot_ChiTiet(objectFilter = {
    sortOrder: "asc",
    sortField: "",
    page: 1,
    record: 10,
    OrderBy: "",
    // more: false,
}) {
    let filter = ''
    for (const property in objectFilter) {
        filter = filter + `&${property}=${objectFilter[property]}`
    }
    let vals = `api/bieudo/GetList_XuPhatTheoMucPhatHanhChinh_Cot_ChiTiet?${filter}`
    let res = await Utils.get_api(vals, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;

};
export {
    BieuDo_XuPhatHC_TinhTrang, GetList_DonVi, BieuDo_XuPhatTheoThang, BieuDo_XuPhatHC_ThoiHan, BieuDo_TienXuPhatTheoDonVi_Cot, GetList_XuPhatTheoMucPhatHanhChinh_Cot_ChiTiet,
    GetAllYear, GetList_ThongKeXPHC, GetAllCapDonVi_NhomDonVi, GetList_ThongKeTienXPHC, GetList_ThongKeXuPhat_TheoDonVi_ChiTiet, GetList_ThongKeTienXuPhat_TheoDonVi_ChiTiet,
    BieuDo_TienXuPhatTheoDonVi_Tron, GetList_XuPhatTheoTinhTrang_ChiTiet, GetList_XuPhatTheoThoiHan_ChiTiet, GetList_XuPhatTheoThang_ChiTiet, GetList_XuPhatTheoMucPhatHanhChinh_Tron_ChiTiet
}