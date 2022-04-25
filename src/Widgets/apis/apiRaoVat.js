import Utils from "../../../app/Utils";

const PREFIX_GENERAL = `api/tich-hop-dung-chung/`
const PREFIX_RAOVAT = `api/rao-vat/`

//api/tich-hop-dung-chung/GetAllList_DM_TinhThanh
export async function GetAllListDMTinhThanh() {
    const res = await Utils.get_api(`${PREFIX_GENERAL}GetAllList_DM_TinhThanh`, false, false);
    return res
}

//api/tich-hop-dung-chung/GetListDMXaPhuongById?IDQuanHuyen=271
export async function GetListDMXaPhuongById(idquanhuyen = 0) {
    const res = await Utils.get_api(`${PREFIX_GENERAL}GetListDMXaPhuongById?IDQuanHuyen=${idquanhuyen}`, false, false);
    return res
}

//api/tich-hop-dung-chung/GetListDMQuanHuyenById?IDTinhThanh=1
export async function GetListDMQuanHuyenById(IDTinhThanh = 0) {
    const res = await Utils.get_api(`${PREFIX_GENERAL}GetListDMQuanHuyenById?IDTinhThanh=${IDTinhThanh}`, false, false);
    return res
}

//api/tich-hop-dung-chung/GetList_AllMucGia
export async function GetList_AllMucGia() {
    const res = await Utils.get_api(`${PREFIX_GENERAL}GetList_AllMucGia`, false, false);
    return res
}

//api/tich-hop-dung-chung/GetList_AllDanhMuc
export async function GetList_AllDanhMuc() {
    const res = await Utils.get_api(`${PREFIX_GENERAL}GetList_AllDanhMuc`, false, false);
    return res
}

//api/rao-vat/GetList_TinRaoVat?query.sortOrder=asc&query.sortField&query.page=1&query.record=10
export async function GetList_TinRaoVat(objFilter = {
    "query.more": true,
    "query.page": "",
    "query.record": "",
    "query.sortField": "",
    "query.sortOrder": "",
    "query.filter.keys": "",
    "query.filter.vals": "",
}) {
    let filter = ''
    for (const property in objFilter) {
        filter = filter + `&${property}=${objFilter[property]}`
    }
    const res = await Utils.get_api(`${PREFIX_RAOVAT}GetList_TinRaoVat?${filter}`, false, true)
    return res

}
//api/tich-hop-dung-chung/GetAllList_DM_LoaiNha
export async function GetAllList_DM_LoaiNha() {
    const res = await Utils.get_api(`${PREFIX_GENERAL}GetAllList_DM_LoaiNha`, false, false);
    return res
}

//api/rao-vat/Add_TinRaoVat
export async function AddTinRaoVat(formdata) {
    let res = await Utils.post_api_formdata(`${PREFIX_RAOVAT}Add_TinRaoVat`, formdata, false, true);
    return res
}

//Info_TinRaoVat?IdTinRaoVat=3&IsXem=false
export async function Info_TinRaoVat(IdTinRaoVat, isSeen = true) {
    const res = await Utils.get_api(`${PREFIX_RAOVAT}Info_TinRaoVat?IdTinRaoVat=${IdTinRaoVat}&IsXem=${isSeen}`, false, true);
    return res
}

//Delete_TinRaoVat?IdTinRaoVat=5
export async function Delete_TinRaoVat(IdTinRaoVat) {
    const res = await Utils.get_api(`${PREFIX_RAOVAT}Delete_TinRaoVat?IdTinRaoVat=${IdTinRaoVat}`, false, true);
    return res
}

//Update_TinRaoVat
export async function Update_TinRaoVat(formdata) {
    let res = await Utils.post_api_formdata(`${PREFIX_RAOVAT}Update_TinRaoVat`, formdata, false, true);
    return res
}

//api/rao-vat/LuuTinRaoVat
export async function LuuTinRaoVat(formdata) {
    let res = await Utils.post_api_formdata(`${PREFIX_RAOVAT}LuuTinRaoVat`, formdata, false, true);
    return res
}

//GetList_TinRaoVat_DaLuu
export async function GetList_TinRaoVat_DaLuu(objFilter = {
    "query.more": true,
    "query.page": "",
    "query.record": "",
    "query.sortField": "",
    "query.sortOrder": "",
    "query.filter.keys": "",
    "query.filter.vals": "",
}) {
    let filter = ''
    for (const property in objFilter) {
        filter = filter + `&${property}=${objFilter[property]}`
    }
    const res = await Utils.get_api(`${PREFIX_RAOVAT}GetList_TinRaoVat_DaLuu?${filter}`, false, true)
    return res

}

//CapNhatTrangThaiHienThi
export async function CapNhatTrangThaiHienThi(formdata) {
    let res = await Utils.post_api_formdata(`${PREFIX_RAOVAT}CapNhatTrangThaiHienThi`, formdata, false, true);
    return res
}

//api/rao-vat/DangTinTinRaoVat?IdTinRaoVat=20
export async function DangTinTinRaoVat(IdTinRaoVat) {
    let res = await Utils.get_api(`${PREFIX_RAOVAT}DangTinTinRaoVat?IdTinRaoVat=${IdTinRaoVat}`, false, true);
    return res
}

//GetAllList_DM_LoaiNha
export async function GetAllListDMLoaiNha() {
    const res = await Utils.get_api(`${PREFIX_GENERAL}GetAllList_DM_LoaiNha`, false, false);
    return res
}