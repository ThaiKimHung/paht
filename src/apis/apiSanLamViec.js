import Utils from '../../app/Utils';
import AppCodeConfig from '../../app/AppCodeConfig';

//api/tin-tuc-cong-dan/Create_TinTucCongDan
export async function Create_TinTucCongDan(dataBoDy) {
    let res = await Utils.post_api_formdata(`api/tin-tuc-cong-dan/Create_TinTucCongDan`, dataBoDy, false, true);
    return res
}

export async function List_TinTucCongDan_TheoNguoiDang(nextPage = 1, size = 10) {
    let url = `api/tin-tuc-cong-dan/List_TinTucCongDan_TheoNguoiDang?page=${nextPage}&record=${size}`;
    let res = await Utils.get_api(url, false, true);
    return res;
}

export async function GetDanhSachTinTuyenDung(nextPage = 1, size = 10, keyword = '') {
    let url = ''
    if (keyword)
        url = `api/tin-tuc-cong-dan/List_TinTucCongDan_App?page=${nextPage}&record=${size}&filter.keys=keyword&filter.vals=${keyword}`;
    else
        url = `api/tin-tuc-cong-dan/List_TinTucCongDan_App?page=${nextPage}&record=${size}`;
    let res = await Utils.get_api(url, false, false);
    return res;
}

//api/tin-tuc-cong-dan/GetTinTuyenDungById?Id=1
export async function GetTinTuyenDungById(Id) {
    let res = await Utils.get_api(`api/tin-tuc-cong-dan/GetTinTuyenDungById?Id=${Id}`, false, false)
    return res;
}

//api/tin-tuc-cong-dan/GetList_TinTucCongDan_TuongTac?IdTinTuc=1
export async function GetList_TinTucCongDan_TuongTac(IdTinTuc) {
    let res = await Utils.get_api(`api/tin-tuc-cong-dan/GetList_TinTucCongDan_TuongTac?IdTinTuc=${IdTinTuc}`)
    return res
}

//api/tin-tuc-cong-dan/Create_TinTucCongDan_TuongTac
export async function Create_TinTucCongDan_TuongTac(body) {
    let res = await Utils.post_api(`api/tin-tuc-cong-dan/Create_TinTucCongDan_TuongTac`, JSON.stringify(body), false, true)
    return res
}

//api/tin-tuc-cong-dan/Delete_TinTucCongDan_TuongTac? Id=
export async function Delete_TinTucCongDan_TuongTac(Id) {
    let res = await Utils.post_api(`api/tin-tuc-cong-dan/Delete_TinTucCongDan_TuongTac?Id=${Id}`, JSON.stringify({}), false, true)
    return res
}

//api/tin-tuc-cong-dan/HetHan_TinTucCongDan?Id=2
export async function HetHan_TinTucCongDan(Id) {
    let res = await Utils.post_api(`api/tin-tuc-cong-dan/HetHan_TinTucCongDan?Id=${Id}`, JSON.stringify({}), false, true)
    return res
}

//api/tin-tuc-cong-dan/View_TinTucCongDan?Id=2&TTHienThiHienTai=false
export async function View_TinTucCongDan(Id, TTHienThiHienTai) {
    let res = await Utils.post_api(`api/tin-tuc-cong-dan/View_TinTucCongDan?Id=${Id}&TTHienThiHienTai=${TTHienThiHienTai}`, JSON.stringify({}), false, true)
    return res
}

export async function GetDanhSachTinTuyenDung_KiemDuyet(obj) {
    let filter = ''
    for (const property in obj) {
        filter = filter + `&${property}=${obj[property]}`
    }
    let url = `api/tin-tuc-cong-dan/List_TinTucCongDan?${filter}`;
    let res = await Utils.get_api(url, false, false);
    return res;
}

//api/tin-tuc-cong-dan/Duyet_TinTucCongDan
export async function Duyet_TinTucCongDan(body) {
    let res = await Utils.post_api(`api/tin-tuc-cong-dan/Duyet_TinTucCongDan`, JSON.stringify(body), false, true, false, AppCodeConfig.APP_ADMIN)
    return res
}

//api/tin-tuc-cong-dan/Delete_TinTucCongDan?Id=
export async function Delete_TinTucCongDan(Id) {
    let res = await Utils.post_api(`api/tin-tuc-cong-dan/Delete_TinTucCongDan?Id=${Id}`, JSON.stringify({}), false, true, false, AppCodeConfig.APP_ADMIN)
    return res
}