import Utils from "../../app/Utils";
import moment from "moment";
import AppCodeConfig from "../../app/AppCodeConfig";
import { nGlobalKeys } from "../../app/keys/globalKey";
const PREFIX = 'api/thongkebaocao/';


// api / thongkebaocao / GetList_ThongKePA_TheoDonVi ? sortOrder = asc & sortField & page=1 & record=10 & OrderBy & filter.keys=tungay | denngay | idnhomdonvi | idchuyenmuc & filter.vals=01 - 12 - 2019 | 21 - 03 - 2020 | 0 | 0
//"UB"
async function GetList_ThongKePA_TheoDonVi(tungay = '', denngay = '') {
    let val;
    if (tungay == '' && denngay == '') {
        val = `GetList_ThongKePA_TheoDonVi?more=true&sortOrder=asc&sortField&page=1&record=100&OrderBy&filter.keys=tungay|denngay|idnhomdonvi|idchuyenmuc&filter.vals=${moment(new Date()).add(-30, 'days').format('DD-MM-YYYY')}|${moment(new Date()).format('DD-MM-YYYY')}|0|0`
    }
    else {
        val = `GetList_ThongKePA_TheoDonVi?more=true&sortOrder=asc&sortField&page=1&record=100&OrderBy&filter.keys=tungay|denngay|idnhomdonvi|idchuyenmuc&filter.vals=${tungay}|${denngay}|0|0`
    }

    let res = await Utils.get_api(PREFIX + val, false, true, true, AppCodeConfig.APP_ADMIN)
    return res;
}

// "CA"
async function GetListGroup_ThongKePA_TheoDonVi(tungay = '', denngay = '') {
    let val = `GetListGroup_ThongKePA_TheoDonVi?more=true&sortOrder=asc&sortField&page=1&record=100&OrderBy&filter.keys=tungay|denngay|idnhomdonvi|idchuyenmuc&filter.vals=${tungay}|${denngay}|0|0`
    Utils.nlog('Url API: ', PREFIX + val)
    let res = await Utils.get_api(PREFIX + val, false, true, true, AppCodeConfig.APP_ADMIN)
    return res;
}

//api/thongkebaocao/GetList_ThongKePA_TheoDonViDanhGia?sortOrder=asc&sortField=&page=1&record=10&OrderBy=&filter.keys=tungay%7Cdenngay%7Cnhomdv&filter.vals=17-08-2020%7C14-09-2020%7C0
async function GetList_ThongKePA_TheoDonViDanhGia(tungay = '', denngay = '') {
    let val
    if (tungay && denngay) {
        val = `${PREFIX}GetList_ThongKePA_TheoDonViDanhGia?sortOrder=asc&sortField=&page=1&record=10&OrderBy=&filter.keys=tungay|denngay|nhomdv&filter.vals=${tungay}|${denngay}|0`
    } else {
        val = `${PREFIX}GetList_ThongKePA_TheoDonViDanhGia?sortOrder=asc&sortField=&page=1&record=10&OrderBy=&filter.keys=tungay|denngay|nhomdv&filter.vals=${moment(new Date()).add(-30, 'days').format('DD-MM-YYYY')}|${moment(new Date()).format('DD-MM-YYYY')}|0`
    }
    let res = await Utils.get_api(val, false, true, true, AppCodeConfig.APP_ADMIN)
    return res;
}

async function GetList_ThongKePA_TheoDonViTK(objectFilter = {
    "sortOrder": "asc",
    "sortField": "",
    " page": 1,
    "record": 10,
    "OrderBy": "",
    "filter.keys": "tungay|denngay|idnhomdonvi|idchuyenmuc|iddonvi|donvicanhan",
    "filter.vals": "01-07-2020|15-12-2020|0|0|0|true",
}) {
    let filter = ''
    for (const property in objectFilter) {
        filter = filter + `&${property}=${objectFilter[property]}`
    }
    Utils.nlog("urk---------aaaaaaaaaaaaaaaa", filter)
    let res = await Utils.get_api(`api/thongkebaocao/GetList_ThongKePA_TheoDonVi?${filter}`, false, false, true, AppCodeConfig.APP_ADMIN);
    return res;
};
async function GetList_ThongKePA_TheoDonViDanhGiaTK(filterkeys = 'tungay|denngay|nhomdv|donvicanhan', filtervals = `${moment(new Date()).add(-30, 'days').format('DD-MM-YYYY')}|${moment(new Date()).format('DD-MM-YYYY')}|0|true`) {
    let val = `${PREFIX}GetList_ThongKePA_TheoDonViDanhGia?sortOrder=asc&sortField=&page=1&record=10&OrderBy=&filter.keys=${filterkeys}&filter.vals=${filtervals}`
    let res = await Utils.get_api(val, false, true, true, AppCodeConfig.APP_ADMIN)
    Utils.nlog('Gia tri res api GetList_ThongKePA_TheoDonViDanhGia =>>>>>>>>>>>', val)
    return res;
}
//api/thongkebaocao/GetList_ThongKePA_TaiKhoan
async function GetList_ThongKePA_TaiKhoan(filterkeys = 'tungay|denngay|donvicanhan|chuyenmuc', filtervals = `${moment(new Date()).add(-30, 'days').format('DD-MM-YYYY')}|${moment(new Date()).format('DD-MM-YYYY')}|true|`) {
    let val = `${PREFIX}GetList_ThongKePA_TaiKhoan?sortOrder=asc&sortField=&page=1&record=10&OrderBy=&filter.keys=${filterkeys}&filter.vals=${filtervals}`

    let res = await Utils.get_api(val, false, true, true, AppCodeConfig.APP_ADMIN)
    Utils.nlog('Gia tri res api GetList_ThongKePA_TaiKhoan =>>>>>>>>>>>', val)
    return res;
}
//api/thongkebaocao/GetList_ThongKePA_TheoLinhVuc
async function GetList_ThongKePA_TheoLinhVuc(tungay = '', denngay = '', idDonVi, type = 0) {
    let checkTK = Utils.getGlobal(nGlobalKeys.filterTKBC, 'false', AppCodeConfig.APP_ADMIN)
    let val
    if (tungay && denngay) {
        val = `${PREFIX}GetList_ThongKePA_TheoLinhVuc?sortOrder=asc&sortField=&page=1&record=10&OrderBy=&filter.keys=tungay|denngay${type == 0 ? '|donvicanhan' : `|iddonvi${checkTK == 'false' ? '' : '|ChuyenMucQL'}`}&filter.vals=${tungay}|${denngay}${type == 0 ? '|true' : '|' + idDonVi}${checkTK == 'false' ? '' : '|1'}`
    } else {
        val = `${PREFIX}GetList_ThongKePA_TheoLinhVuc?sortOrder=asc&sortField=&page=1&record=10&OrderBy=&filter.keys=tungay|denngay${type == 0 ? '|donvicanhan' : `|iddonvi${checkTK == 'false' ? '' : '|ChuyenMucQL'}`}&filter.vals=${moment(new Date()).add(-30, 'days').format('DD-MM-YYYY')}|${moment(new Date()).format('DD-MM-YYYY')}${type == 0 ? '|true' : '|' + idDonVi}${checkTK == 'false' ? '' : '|1'}`
    }
    let res = await Utils.get_api(val, false, true, true, AppCodeConfig.APP_ADMIN)
    Utils.nlog('Gia tri res api GetList_ThongKePA_TheoLinhVuc =>>>>>>>>>>>', val)
    Utils.nlog('Gia tri res api GetList_ThongKePA_TheoLinhVuc =>>>>>>>>>>>', res)
    return res;
}
//api/thongkebaocao/GetList_ThongKePA_TheoChuyenMuc
async function GetList_ThongKePA_TheoChuyenMuc(tungay = '', denngay = '', type = 0) {
    let checkTK = Utils.getGlobal(nGlobalKeys.filterTKBC, 'false', AppCodeConfig.APP_ADMIN)
    let val
    if (tungay && denngay) {
        val = `${PREFIX}GetList_ThongKePA_TheoChuyenMuc?sortOrder=asc&sortField=&page=1&record=10&OrderBy=&filter.keys=tungay|denngay${type == 0 ? '|donvicanhan' : `${checkTK == 'false' ? '' : '|ChuyenMucQL'}`}&filter.vals=${tungay}|${denngay}${type == 0 ? '|true' : `${checkTK == 'false' ? '' : '|1'}`}`
    } else {
        val = `${PREFIX}GetList_ThongKePA_TheoChuyenMuc?sortOrder=asc&sortField=&page=1&record=10&OrderBy=&filter.keys=tungay|denngay${type == 0 ? '|donvicanhan' : `${checkTK == 'false' ? '' : '|ChuyenMucQL'}`}&filter.vals=${moment(new Date()).add(-30, 'days').format('DD-MM-YYYY')}|${moment(new Date()).format('DD-MM-YYYY')}${type == 0 ? '|true' : `${checkTK == 'false' ? '' : '|1'}`}`

    }
    let res = await Utils.get_api(val, false, true, true, AppCodeConfig.APP_ADMIN)
    Utils.nlog('Gia tri res api GetList_ThongKePA_TheoChuyenMuc =>>>>>>>>>>>', val)
    return res;
}

//api/thongkebaocao/GetList_ThongKePA_TheoNguon
async function GetList_ThongKePA_TheoNguon(tungay = '', denngay = '', type = 0) {
    let checkTK = Utils.getGlobal(nGlobalKeys.filterTKBC, 'false', AppCodeConfig.APP_ADMIN)
    let val
    if (tungay && denngay) {
        val = `${PREFIX}GetList_ThongKePA_TheoNguon?sortOrder=asc&sortField=&page=1&record=10&OrderBy=&filter.keys=tungay|denngay${type == 0 ? '|donvicanhan' : `${checkTK == 'false' ? '' : '|ChuyenMucQL'}`}&filter.vals=${tungay}| ${denngay} ${type == 0 ? '|true' : `${checkTK == 'false' ? '' : '|1'}`} `
    } else {
        val = `${PREFIX}GetList_ThongKePA_TheoNguon?sortOrder=asc&sortField=&page=1&record=10&OrderBy=&filter.keys=tungay|denngay${type == 0 ? '|donvicanhan' : `${checkTK == 'false' ? '' : '|ChuyenMucQL'}`} & filter.vals=${moment(new Date()).add(-30, 'days').format('DD-MM-YYYY')}| ${moment(new Date()).format('DD-MM-YYYY')} ${type == 0 ? '|true' : `${checkTK == 'false' ? '' : '|1'}`} `
    }
    let res = await Utils.get_api(val, false, true, true, AppCodeConfig.APP_ADMIN)
    Utils.nlog('Gia tri res api GetList_ThongKePA_TheoNguon =>>>>>>>>>>>', val)
    return res;
}
//GetList_ThongKePA_TheoDonVi_ChiTiet
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

    let res = await Utils.get_api(`${PREFIX}GetList_ThongKePA_TheoDonVi_ChiTiet?${filter}`, false, false, true, AppCodeConfig.APP_ADMIN);
    return res;

};
//GetList_ThongKePA_TheoDonViDanhGia_ChiTiet
async function GetList_ThongKePA_TheoDonViDanhGia_ChiTiet(objectFilter = {
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

    let res = await Utils.get_api(`${PREFIX}GetList_ThongKePA_TheoDonViDanhGia_ChiTiet?${filter}`, false, false, true, AppCodeConfig.APP_ADMIN);
    return res;

};
//GetList_ChiTietDanhSachPaThongKe
async function GetList_ChiTietDanhSachPaThongKe(objectFilter = {
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

    let res = await Utils.get_api(`${PREFIX}GetList_ChiTietDanhSachPaThongKe?${filter}`, false, false, true, AppCodeConfig.APP_ADMIN);
    return res;

};
//GetList_ThongKePA_TheoLinhVuc_ChiTiet
async function GetList_ThongKePA_TheoLinhVuc_ChiTiet(objectFilter = {
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

    let res = await Utils.get_api(`${PREFIX}GetList_ThongKePA_TheoLinhVuc_ChiTiet?${filter}`, false, false, true, AppCodeConfig.APP_ADMIN);
    return res;

};
// /GetList_ThongKePA_TheoNguon_ChiTiet
async function GetList_ThongKePA_TheoNguon_ChiTiet(objectFilter = {
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

    let res = await Utils.get_api(`${PREFIX}GetList_ThongKePA_TheoNguon_ChiTiet?${filter}`, false, false, true, AppCodeConfig.APP_ADMIN);
    return res;

};
//GetList_ThongKePA_TheoChuyenMuc_ChiTiet
async function GetList_ThongKePA_TheoChuyenMuc_ChiTiet(objectFilter = {
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

    let res = await Utils.get_api(`${PREFIX}GetList_ThongKePA_TheoChuyenMuc_ChiTiet?${filter}`, false, false, true, AppCodeConfig.APP_ADMIN);
    return res;

};
export {
    GetList_ThongKePA_TheoDonVi, GetList_ThongKePA_TheoDonViDanhGia, GetListGroup_ThongKePA_TheoDonVi,
    GetList_ThongKePA_TaiKhoan, GetList_ThongKePA_TheoLinhVuc, GetList_ThongKePA_TheoChuyenMuc, GetList_ThongKePA_TheoNguon,
    GetList_ThongKePA_TheoDonViTK, GetList_ThongKePA_TheoDonViDanhGiaTK, GetList_ThongKePA_TheoDonVi_ChiTiet, GetList_ThongKePA_TheoDonViDanhGia_ChiTiet,
    GetList_ChiTietDanhSachPaThongKe, GetList_ThongKePA_TheoLinhVuc_ChiTiet, GetList_ThongKePA_TheoNguon_ChiTiet, GetList_ThongKePA_TheoChuyenMuc_ChiTiet
}