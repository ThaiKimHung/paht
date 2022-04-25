import AppCodeConfig from "../../app/AppCodeConfig"
import Utils from "../../app/Utils"

//api/hoi-dap-tt/GetList_HoiTT_App?sortOrder=asc&sortField=&pageNumber=1&pageSize=10&OrderBy=&page=1&record=10&more=false
async function GetList_HoiTT_App(page = 1, record = 10, keyword = '', more = false) {
    let url = `api/hoi-dap-tt/GetList_HoiTT_App?sortOrder=asc&sortField=&pageNumber=${page}&pageSize=${record}&OrderBy=&page=${page}&record=${record}&more=${more}`
    if (keyword.length > 0) {
        url += `&query.filter.keys=keyword&query.filter.vals=${keyword}`
    }
    let res = await Utils.get_api(url, false, false)
    return res
}

//api/hoi-dap-tt/GetList_LichSuHoiTT?sortOrder=asc&sortField=&pageNumber=1&pageSize=10&OrderBy=&page=1&record=10&more=false
async function GetList_LichSuHoiTT(page = 1, record = 10, more = false) {
    let url = `api/hoi-dap-tt/GetList_LichSuHoiTT?sortOrder=asc&sortField=&pageNumber=${page}&pageSize=${record}&OrderBy=&page=${page}&record=${record}&more=${more}`
    let res = await Utils.get_api(url, false, true, AppCodeConfig.APP_CONGDAN)
    return res
}

//api/hoi-dap-tt/Add_HoiTT
async function Add_HoiTT(bodyCauHoi) {
    let url = `api/hoi-dap-tt/Add_HoiTT`
    let res = await Utils.post_api_formdata(url, bodyCauHoi, false, true, AppCodeConfig.APP_CONGDAN)
    return res
}

//api/hoi-dap-tt/Info_HoiTT_App?Id=1
async function Info_HoiTT_App(Id) {
    let url = `api/hoi-dap-tt/Info_HoiTT_App?Id=${Id}`
    let res = await Utils.get_api(url, false, false)
    return res
}

//api/hoi-dap-tt/DanhGia_DapTT
async function DanhGia_DapTT(bodyDanhGia) {
    let url = `api/hoi-dap-tt/DanhGia_DapTT`
    let res = await Utils.post_api_formdata(url, bodyDanhGia, false, true, AppCodeConfig.APP_CONGDAN)
    return res
}

//api/hoi-dap-tt/Edit_HoiTT_App
async function Edit_HoiTT_App(bodyCauHoi) {
    let url = `api/hoi-dap-tt/Edit_HoiTT_App`
    let res = await Utils.post_api_formdata(url, bodyCauHoi, false, true, AppCodeConfig.APP_CONGDAN)
    return res
}

//api/hoi-dap-tt/GetAllTrangThai
async function GetAllTrangThai() {
    const res = await Utils.get_api('api/hoi-dap-tt/GetAllTrangThai', false, false)
    return res;
};

//
async function GetList_HoiTT(obj = {
    "sortOrder": "asc",
    "sortField": "CreatedDate",
    "pageNumber": "1",
    "pageSize": "10",
    "OrderBy": "CreatedDate",
    "page": "1",
    "record": "10",
    "more": false,
    "filter.keys": "tungay|denngay|status|keyword",
    "filter.vals": "||1|"
}) {
    let filter = ''
    for (const property in obj) {
        filter = filter + `&${property}=${obj[property]}`
    }
    Utils.nlog(`api/hoi-dap-tt/GetList_HoiTT?${filter}`)
    const res = await Utils.get_api(`api/hoi-dap-tt/GetList_HoiTT?${filter}`, false, true, false, AppCodeConfig.APP_ADMIN)
    return res;
};

//api/hoi-dap-tt/Info_HoiTT?Id=9
async function Info_HoiTT(Id) {
    let url = `api/hoi-dap-tt/Info_HoiTT?Id=${Id}`
    let res = await Utils.get_api(url, false, true, false, AppCodeConfig.APP_ADMIN)
    return res
}

//api/hoi-dap-tt/GetList_NhatKyThaoTac_DapTT?Id=9
async function GetList_NhatKyThaoTac_DapTT(Id = '') {
    let url = `api/hoi-dap-tt/GetList_NhatKyThaoTac_DapTT?Id=${Id}`
    let res = await Utils.get_api(url, false, true, false, AppCodeConfig.APP_ADMIN)
    return res
}

//api/hoi-dap-tt/GetList_NhatKyThaoTac_HoiTT?Id=9
async function GetList_NhatKyThaoTac_HoiTT(Id = '') {
    let url = `api/hoi-dap-tt/GetList_NhatKyThaoTac_HoiTT?Id=${Id}`
    let res = await Utils.get_api(url, false, true, false, AppCodeConfig.APP_ADMIN)
    return res
}

//api/hoi-dap-tt/TiepNhan_HoiTT
async function TiepNhan_HoiTT(Id = '') {
    const body = JSON.stringify({ "Id": Id })
    let url = `api/hoi-dap-tt/TiepNhan_HoiTT`
    let res = await Utils.post_api(url, body, false, true, false, AppCodeConfig.APP_ADMIN)
    return res
}

//api/hoi-dap-tt/ThuHoi_HoiTT
async function ThuHoi_HoiTT(Id = '') {
    const body = JSON.stringify({ "Id": Id })
    let url = `api/hoi-dap-tt/ThuHoi_HoiTT`
    let res = await Utils.post_api(url, body, false, true, false, AppCodeConfig.APP_ADMIN)
    return res
}

//api/hoi-dap-tt/Delete_HoiTT?Id=19
async function Delete_HoiTT(Id = '') {
    let url = `api/hoi-dap-tt/Delete_HoiTT?Id=${Id}`
    let res = await Utils.get_api(url, false, true, false, AppCodeConfig.APP_ADMIN)
    return res
}

//api/hoi-dap-tt/Edit_HoiTT_CB_App
async function Edit_HoiTT_CB_App(bodyCauHoi) {
    let url = `api/hoi-dap-tt/Edit_HoiTT_CB_App`
    let res = await Utils.post_api_formdata(url, bodyCauHoi, false, true, AppCodeConfig.APP_ADMIN)
    return res
}

//api/hoi-dap-tt/QuyenDonViXuLy_HoiTT?Id=9
async function QuyenDonViXuLy_HoiTT(Id = '') {
    let url = `api/hoi-dap-tt/QuyenDonViXuLy_HoiTT?Id=${Id}`
    let res = await Utils.get_api(url, false, true, false, AppCodeConfig.APP_ADMIN)
    return res
}

//api/hoi-dap-tt/ChuyenXuLy_HoiTT
async function ChuyenXuLy_HoiTT(body) {
    let url = `api/hoi-dap-tt/ChuyenXuLy_HoiTT`
    let res = await Utils.post_api(url, JSON.stringify(body), false, true, false, AppCodeConfig.APP_ADMIN)
    return res
}

//api/hoi-dap-tt/KhongTiepNhan_HoiTT
async function KhongTiepNhan_HoiTT(body) {
    let url = `api/hoi-dap-tt/KhongTiepNhan_HoiTT`
    let res = await Utils.post_api(url, JSON.stringify(body), false, true, false, AppCodeConfig.APP_ADMIN)
    return res
}

//api/hoi-dap-tt/TraLai_HoiTT
async function TraLai_HoiTT(body) {
    let url = `api/hoi-dap-tt/TraLai_HoiTT`
    let res = await Utils.post_api(url, JSON.stringify(body), false, true, false, AppCodeConfig.APP_ADMIN)
    return res
}

//api/hoi-dap-tt/Add_DapTT
async function Add_DapTT(body) {
    let url = `api/hoi-dap-tt/Add_DapTT`
    let res = await Utils.post_api_formdata(url, body, false, true, AppCodeConfig.APP_ADMIN)
    return res
}

//api/hoi-dap-tt/Edit_DapTT
async function Edit_DapTT(body) {
    let url = `api/hoi-dap-tt/Edit_DapTT`
    let res = await Utils.post_api_formdata(url, body, false, true, AppCodeConfig.APP_ADMIN)
    return res
}

//api/hoi-dap-tt/Delete_DapTT
async function Delete_DapTT(body) {
    let url = `api/hoi-dap-tt/Delete_DapTT`
    let res = await Utils.post_api(url, JSON.stringify(body), false, true, false, AppCodeConfig.APP_ADMIN)
    return res
}

export {
    GetList_HoiTT_App, GetList_LichSuHoiTT, Add_HoiTT, Info_HoiTT_App, DanhGia_DapTT, Edit_HoiTT_App, GetAllTrangThai, GetList_HoiTT,
    Info_HoiTT, GetList_NhatKyThaoTac_DapTT, GetList_NhatKyThaoTac_HoiTT, TiepNhan_HoiTT, ThuHoi_HoiTT, Delete_HoiTT, Edit_HoiTT_CB_App,
    QuyenDonViXuLy_HoiTT, ChuyenXuLy_HoiTT, KhongTiepNhan_HoiTT, TraLai_HoiTT, Add_DapTT, Edit_DapTT, Delete_DapTT
}