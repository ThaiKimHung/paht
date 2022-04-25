import Utils from "../../app/Utils";
import moment from 'moment'
import AppCodeConfig from "../../app/AppCodeConfig";
const PREFIX = 'api/bieudo/'
//api/bieudo/BieuDo_PhanAnhTheoTinhTrangXuLy
async function BieuDo_PhanAnhTheoTinhTrangXuLy(tungay = '', denngay = '') {
    let val = ''
    if (tungay && denngay) {
        val = `BieuDo_PhanAnhTheoTinhTrangXuLy?tungay=${tungay}&denngay=${denngay}`;
    }
    else {
        val = `BieuDo_PhanAnhTheoTinhTrangXuLy`
    }
    Utils.nlog('Gia tri vallllsss  thong ke', PREFIX + val)
    let res = await Utils.get_api(PREFIX + val, false, true, true, AppCodeConfig.APP_ADMIN)
    return res;
};
//{{domain}}api/bieudo/GetList_DanhSachDonViPhanAnhQuaHan?sortOrder=asc&sortField=&pageNumber=1&pageSize=10&OrderBy=&page=1&keyword=&record=10&trangthai=0&more=false
async function GetList_DanhSachDonViPhanAnhQuaHan(tungay = moment(new Date()).add(-30, 'days').format('YYYY-MM-DD'), denngay = moment(new Date()).format('YYYY-MM-DD')) {
    let res = await Utils.get_api(PREFIX + `GetList_DanhSachDonViPhanAnhQuaHan?sortOrder=asc&sortField=&pageNumber=1&pageSize=10&OrderBy=&page=1&keyword=&record=10&trangthai=0&more=true&filter.keys=tungay|denngay&filter.vals=${tungay}|${denngay}`, false, true, true, AppCodeConfig.APP_ADMIN)
    return res;
}
//{{domain}}api/bieudo/BieuDo_PhanAnhTheoThang?Year=2020
async function BieuDo_PhanAnhTheoThang(Year = moment(new Date()).format('YYYY')) {
    let res = await Utils.get_api(PREFIX + `BieuDo_PhanAnhTheoThang?Year=${Year}`, false, true, true, AppCodeConfig.APP_ADMIN)
    return res;
}
//api/bieudo/BieuDo_PhanAnhTheoChuyenMuc?tungay=2020-09-01&denngay=2020-09-20
async function BieuDo_PhanAnhTinhTrang(tungay = moment(new Date()).add(-30, 'days').format('YYYY-MM-DD'), denngay = moment(new Date()).format('YYYY-MM-DD')) {
    let url = PREFIX + `BieuDo_PhanAnhTheoChuyenMuc?tungay=${tungay}&denngay=${denngay}`;
    // Utils.nlog("giá trị log từ ngày đến ngày url -----------------------", url)
    let res = await Utils.get_api(url, false, true, true, AppCodeConfig.APP_ADMIN)

    return res;
}

//api/bieudo/BieuDo_PhanAnhTheoTinhTrangXuLy_ChiTiet
async function BieuDo_PhanAnhTheoTinhTrangXuLy_ChiTiet(TypeFilter = 0, page = 1, tungay = moment(new Date()).add(-15, 'days').format('YYYY-MM-DD'), denngay = moment(new Date()).format('YYYY-MM-DD'), ) {
    let url = PREFIX + `BieuDo_PhanAnhTheoTinhTrangXuLy_ChiTiet?tungay=${tungay}&denngay=${denngay}&TypeFilter=${TypeFilter}&page=${page}&record=10`
    Utils.nlog(url)
    let res = await Utils.get_api(url, false, false, true, AppCodeConfig.APP_ADMIN)
    return res
}

// api/bieudo/GetList_DanhSachDonViPhanAnhQuaHan_ChiTiet
async function GetList_DanhSachDonViPhanAnhQuaHan_ChiTiet(IdDonVi = 0, page = 1, tungay = '', denngay = '', ) {
    let url = PREFIX + `GetList_DanhSachDonViPhanAnhQuaHan_ChiTiet?tungay=${tungay}&denngay=${denngay}&IdDonVi=${IdDonVi}&page=${page}&record=10`
    Utils.nlog(url)
    let res = await Utils.get_api(url, false, false, true, AppCodeConfig.APP_ADMIN)
    return res
}

// api/thongkebaocao/GetList_ThongKePA_TheoDonVi_ChiTiet
async function GetList_ThongKePA_TheoDonVi_ChiTiet(IdDonVi = 0, page = 1, tungay = '', denngay = '') {
    let url = `api/thongkebaocao/GetList_ThongKePA_TheoGroupDonVi_ChiTiet?ortOrder=asc&sortField=&page=${page}&record=10&OrderBy=&filter.keys=idaccount|tungay|denngay|iddonvi&filter.vals=|${tungay}|${denngay}|${IdDonVi}`
    Utils.nlog(url)
    let res = await Utils.get_api(url, false, false, true, AppCodeConfig.APP_ADMIN)
    return res
}

async function GetList_ChuyenMuc_ChiTiet(objectFilter = {
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
    let vals = `api/ChiTietChart/GetList_ChuyenMuc_ChiTiet?${filter}`
    let res = await Utils.get_api(vals, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;

};

async function GetList_TheoThang_ChiTiet(objectFilter = {
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
    let vals = `api/ChiTietChart/GetList_TheoThang_ChiTiet?${filter}`
    let res = await Utils.get_api(vals, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;

};

async function GetList_ThongKePA_TheoDonViQuaHan_ChiTiet_Beta(objectFilter = {
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
    let vals = `api/thongkebaocao/GetList_ThongKePA_TheoDonViQuaHan_ChiTiet_Beta?${filter}`
    let res = await Utils.get_api(vals, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;

};
// api/thongkebaocao/GetList_ThongKePA_TheoDonViDanhGia_ChiTiet
async function GetList_ThongKePA_TheoDonViDanhGia_ChiTiet(objectFilter = {
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
    let vals = `api/thongkebaocao/GetList_ThongKePA_TheoDonViDanhGia_ChiTiet?${filter}`
    let res = await Utils.get_api(vals, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;

};

// api/thongkebaocao/GetList_ThongKePA_TheoDonVi_ChiTiet
async function GetList_ThongKePA_TheoDonVi_ChiTiet_BD(objectFilter = {
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
    let vals = `api/thongkebaocao/GetList_ThongKePA_TheoDonVi_ChiTiet?${filter}`
    let res = await Utils.get_api(vals, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;

};
export {
    BieuDo_PhanAnhTheoTinhTrangXuLy, GetList_DanhSachDonViPhanAnhQuaHan, BieuDo_PhanAnhTheoThang, BieuDo_PhanAnhTinhTrang,
    BieuDo_PhanAnhTheoTinhTrangXuLy_ChiTiet, GetList_DanhSachDonViPhanAnhQuaHan_ChiTiet, GetList_ThongKePA_TheoDonVi_ChiTiet, GetList_ChuyenMuc_ChiTiet, GetList_TheoThang_ChiTiet,
    GetList_ThongKePA_TheoDonViQuaHan_ChiTiet_Beta, GetList_ThongKePA_TheoDonViDanhGia_ChiTiet, GetList_ThongKePA_TheoDonVi_ChiTiet_BD
}