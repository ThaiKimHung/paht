import Utils from "../../../app/Utils";

export async function Get_DSFillter(page = 1, record = 10, IdTinhThanhDi = 0, IdTinhThanhDen = 0, Tungay, DeNgay) {
    let res = await Utils.get_api(`api/xe-khach/GetList_NhaXe?query.sortOrder=asc&query.sortField=&query.page=${page}&query.record=${record}&query.OrderBy=&query.filter.keys=keyword|TrangThai|Active|IdTinhThanhDi|IdQuanHuyenDi|IdTinhThanhDen|IdQuanHuyenDen|TuNgay|DenNgay&query.filter.vals=0|0|0|${IdTinhThanhDi}||${IdTinhThanhDen}|||`,
        false, true)
    return res;
}

export async function Get_DetaliXeKhanh(ID = 0) {
    let res = await Utils.get_api(`api/xe-khach/ChiTiet_NhaXe?Id=${ID}&CountView=false`, false, true)
    return res;
}

export async function Get_ApiXeKhach(objFilter = {
    "query.more": false,
    "query.sortOrder": asc,
    "query.sortField": "",
    "query.OrderBy": "",
    "query.page": 1,
    "query.record": 10,
}) {
    let filter = ''
    for (const property in objFilter) {
        filter = filter + `&${property}=${objFilter[property]}`
    }
    let res = await Utils.get_api(`api/xe-khach/GetList_NhaXe?${filter}`, false, true)
    return res;
}






