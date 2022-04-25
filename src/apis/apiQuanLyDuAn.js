import moment from "moment";
import Utils from "../../app/Utils";

//api/DMDuAn/GetList_DMDuAn_App
export async function GetList_DMDuAn_App(objectFilter = {
    "sortOrder": "asc",
    "sortField": "id",
    "OrderBy": "id",
    "more": false,
    "filter.keys": 'keyword|IdChuDauTu|Nam|IdNguonVon|TinhTrang',
    "filter.vals": `||${moment().format('YYYY')}||`,
    "page": 1,
    "record": 10
}) {
    let filter = ''
    for (const property in objectFilter) {
        filter = filter + `&${property}=${objectFilter[property]}`
    }
    const res = await Utils.get_api(`api/DMDuAn/GetList_DMDuAn_App?${filter}`, false, false)
    return res
}

//api/quan-ly-chu-dau-tu/GetListChuDauTu
export async function GetListChuDauTu() {
    const res = await Utils.get_api('api/quan-ly-chu-dau-tu/GetListChuDauTu', false, false);
    return res
}

//api/DMDuAn/GetList_TrangThai
export async function GetList_TrangThai() {
    const res = await Utils.get_api('api/DMDuAn/GetList_TrangThai', false, false);
    return res
}

//api/DMDuAn/GetList_NguonVon
export async function GetList_NguonVon() {
    const res = await Utils.get_api('api/DMDuAn/GetList_NguonVon', false, false);
    return res
}

//api/DMDuAn/Info_DMDuAn_App?Id=1
export async function Info_DMDuAn_App(Id) {
    const res = await Utils.get_api(`api/DMDuAn/Info_DMDuAn_App?Id=${Id}`, false, false);
    return res
}

//api/da_streamcamera/GetList_Camera?sortField=Id&page=1&record=10&more=true&filter.keys=Loai|keyword&filter.vals=${Id}|${key}
export async function GetList_Camera_DuAn(page = 1, record = 10, keyword = '') {
    var val = ''
    if (keyword) {
        val = `api/da_streamcamera/GetList_Camera?sortField=Id&page=${page}&record=${record}&filter.keys=keyword&filter.vals=${keyword}`;
    } else {
        val = `api/da_streamcamera/GetList_Camera?sortField=Id&page=${page}&record=${record}`;
    }
    let res = await Utils.get_api(val, false, false);
    return res;
}