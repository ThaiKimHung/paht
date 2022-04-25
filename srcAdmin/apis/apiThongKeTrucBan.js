import Utils from "../../app/Utils";
const Api_BieuDo = 'api/bieudo/';
import moment from 'moment'
import AppCodeConfig from "../../app/AppCodeConfig";
// /api/chuyenmuc/GetList_ChuyenMuc?query.more=true&sortOrder=asc&sortField=&page=1&record=10&OrderBy=
async function GetList_ChuyenMuc(objectFilter = {
    "query.more": true,
    "sortOrder": "asc",
    "sortField": '',
    "page": 1,
    "record": 10,
    "OrderBy": ''
}) {
    let filter = ''
    for (const property in objectFilter) {
        filter = filter + `&${property}=${objectFilter[property]}`
    }
    let url = `api/chuyenmuc/GetList_ChuyenMuc?${filter}`
    Utils.nlog("giá trị url-----------thông ke", url)
    let res = await Utils.get_api(url, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;

};
// https://localhost:44345/api/donvi/GetList_DonVi?sortOrder=asc&sortField=&page=1&record=10&OrderBy=&more=true&filter.keys=IdNhomDonVi&filter.vals=1
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
// api/thongkebaocao/GetList_ThongKePA_TheoDonVi?sortOrder=asc&sortField=&page=1&record=10&OrderBy=&filter.keys=tungay|denngay|idnhomdonvi|idchuyenmuc|iddonvi&filter.vals=01-07-2020|15-12-2020|0|0|0
async function GetList_ThongKePA_TheoDonVi(objectFilter = {
    "sortOrder": "asc",
    "sortField": "",
    " page": 1,
    "record": 10,
    "OrderBy": "",
    "filter.keys": "tungay|denngay|idnhomdonvi|idchuyenmuc|iddonvi",
    "filter.vals": "01-07-2020|15-12-2020|0|0|0",
}) {
    let filter = ''
    for (const property in objectFilter) {
        filter = filter + `&${property}=${objectFilter[property]}`
    }
    // Utils.nlog("urk---------aaaaaaaaaaaaaaaa", filter)
    let res = await Utils.get_api(`api/thongkebaocao/GetList_ThongKePA_TheoDonVi?${filter}`, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
};
// https://localhost:44345/api/donvi/GetAllCapDonVi_NhomDonVi?type=0&sortOrder=asc&sortField=&page=1&record=10&OrderBy=
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
// https://localhost:44345/api/thongkebaocao/GetList_ThongKePA_TheoDonVi_ChiTiet?sortOrder=asc&sortField=&page=1&record=10&OrderBy=&filter.keys=idaccount|tungay|denngay|idchuyenmuc|idnhomdonvi|iddonvi|loaidanhgia&filter.vals=|01-07-2020|15-12-2020|0|0|30295|3
// 
async function GetList_ThongKePA_TheoDonVi_ChiTiet(objectFilter = {
    // type: 0,
    // sortOrder: "asc",
    // sortField: "",
    // page: 1,
    // record: 10,
    // OrderBy: ""
}) {
    let filter = ''
    for (const property in objectFilter) {
        filter = filter + `&${property}=${objectFilter[property]}`
    }
    Utils.nlog("url--------", filter)

    let res = await Utils.get_api(`api/thongkebaocao/GetList_ThongKePA_TheoDonVi_ChiTiet?${filter}`, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;

};
async function BieuDo_PhanAnhTheoTinhTrangXuLy(objectFilter = {
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
    let res = await Utils.get_api(`api/bieudo/BieuDo_PhanAnhTheoTinhTrangXuLy?${filter}`, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
};

async function BieuDo_PhanAnhTheoTinhTrangXuLy_ChiTiet(objectFilter = {
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
    Utils.nlog(",........Filter", filter)
    let res = await Utils.get_api(`api/bieudo/BieuDo_PhanAnhTheoTinhTrangXuLy_ChiTiet?${filter}`, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
};

async function BieuDo_PhanAnhTheoThang(Year = moment(new Date()).format('YYYY')) {
    let vals = `${Api_BieuDo}BieuDo_PhanAnhTheoThang?Year=${Year}`
    let res = await Utils.get_api(vals, false, true, true, AppCodeConfig.APP_ADMIN)
    return res;
}
//api/bieudo/GetList_DanhSachDonViPhanAnhQuaHan?sortOrder=asc&sortField=id&OrderBy=id&page=1&record=10&trangthai=0&more=false&filter.keys=tungay|denngay&filter.vals=2020-08-01|2020-12-15
async function GetList_DanhSachDonViPhanAnhQuaHan(objectFilter = {
    sortOrder: "asc",
    sortField: "id",
    page: 1,
    record: 10,
    OrderBy: "id",
    more: false,
}) {
    let filter = ''
    for (const property in objectFilter) {
        filter = filter + `&${property}=${objectFilter[property]}`
    }
    let vals = `${Api_BieuDo}GetList_DanhSachDonViPhanAnhQuaHan?${filter}`
    let res = await Utils.get_api(vals, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;

};
//api/bieudo/GetList_DanhSachDonViPhanAnhQuaHan_ChiTiet?tungay=2020-08-01&denngay=2020-12-15&IdDonVi=30730&page=1&record=10
async function GetList_DanhSachDonViPhanAnhQuaHan_ChiTiet(objectFilter = {
    page: 1,
    record: 10,
}) {
    let filter = ''
    let dem = 0;

    for (const property in objectFilter) {
        if (dem == 0) {
            filter = filter + `${property}=${objectFilter[property]}`
            dem++;
        } else {
            filter = filter + `&${property}=${objectFilter[property]}`
        }
    }
    let vals = `${Api_BieuDo}GetList_DanhSachDonViPhanAnhQuaHan_ChiTiet?${filter} `
    let res = await Utils.get_api(vals, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;

};
export {
    GetList_DonVi, GetAllCapDonVi_NhomDonVi, GetList_ChuyenMuc, GetList_ThongKePA_TheoDonVi, GetList_ThongKePA_TheoDonVi_ChiTiet, BieuDo_PhanAnhTheoTinhTrangXuLy, BieuDo_PhanAnhTheoTinhTrangXuLy_ChiTiet,
    BieuDo_PhanAnhTheoThang, GetList_DanhSachDonViPhanAnhQuaHan, GetList_DanhSachDonViPhanAnhQuaHan_ChiTiet
}