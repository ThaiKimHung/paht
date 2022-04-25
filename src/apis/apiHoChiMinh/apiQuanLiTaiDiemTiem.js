import AppCodeConfig from '../../../app/AppCodeConfig';
import Utils from '../../../app/Utils';

const PREFIX = `api/HcmMiniApp/`
const PREFIX_KEHOACHTIEM = `api/kehoachtiemchung/`

// api/HcmMiniApp/tiem-chung/List_Vaccine?query.more=true
export async function List_Vaccine() {
    const url = `${PREFIX}tiem-chung/List_Vaccine?query.more=true`
    const res = await Utils.get_api(url, false, true, false, AppCodeConfig.APP_ADMIN)
    return res
}

///api/HcmMiniApp/tiem-chung/List_TinhHinhSucKhoe
export async function List_TinhHinhSucKhoe() {
    const url = `${PREFIX}tiem-chung/List_TinhHinhSucKhoe`
    const res = await Utils.get_api(url, false, false, false, AppCodeConfig.APP_ADMIN)
    return res
}

///api/kehoachtiemchung/GetList_DiemTiem_App?query.more=false&query.record=1&query.page=10&query.filter.keys=DonVi|keyword&query.filter.vals=0
export async function GetList_DiemTiem_App(
    objectGet = {
        "query.record": 10,
        "query.more": false,
        "query.page": 1,
        "query.filter.keys": 'DonVi|keyword',
        "query.filter.vals": '|',
    }) {
    let query = "";
    Object.keys(objectGet).map(function (key, index) {
        query += key + "=" + objectGet[key] + `${Object.keys(objectGet).length - 1 == index ? '' : '&'}`;
    });
    console.log('[LOG] params ', query)
    const url = `${PREFIX_KEHOACHTIEM}GetList_DiemTiem_App?${query}`;
    const res = await Utils.get_api(url, false, false, false, AppCodeConfig.APP_ADMIN)
    return res
}

//tiem-chung/CheckInDiemTiem
export async function CheckInDiemTiem(body) {
    const url = `${PREFIX}tiem-chung/CheckInDiemTiem`
    const res = await Utils.post_api(url, JSON.stringify(body), false, true, false, AppCodeConfig.APP_ADMIN)
    return res
}

//tiem-chung/CheckQRDiemTiem_KetQuaKhamSangLoc
export async function CheckQRDiemTiem_KetQuaKhamSangLoc(body) {
    const url = `${PREFIX}tiem-chung/CheckQRDiemTiem_KetQuaKhamSangLoc`
    const res = await Utils.post_api(url, JSON.stringify(body), false, true, false, AppCodeConfig.APP_ADMIN)
    return res
}

//tiem-chung/CheckQRDiemTiem_SauKhiTiem
export async function CheckQRDiemTiem_SauKhiTiem(body) {
    const url = `${PREFIX}tiem-chung/CheckQRDiemTiem_SauKhiTiem`
    const res = await Utils.post_api(url, JSON.stringify(body), false, true, false, AppCodeConfig.APP_ADMIN)
    return res
}

//tiem-chung/CheckQRDiemTiem_TrieuChungSauTiem
export async function CheckQRDiemTiem_TrieuChungSauTiem(body) {
    const url = `${PREFIX}tiem-chung/CheckQRDiemTiem_TrieuChungSauTiem`
    const res = await Utils.post_api(url, JSON.stringify(body), false, true, false, AppCodeConfig.APP_ADMIN)
    return res
}

///api/HcmMiniApp/tiem-chung/GetInfoNguoiTiemChung
export async function GetInfoNguoiTiemChung(body) {
    const url = `${PREFIX}tiem-chung/GetInfoNguoiTiemChung`
    const res = await Utils.post_api(url, JSON.stringify(body), false, true, false, AppCodeConfig.APP_ADMIN)
    return res
}

//api/HcmMiniApp/account/GetInFo_TiemChungByCode?code=
export async function GetInFo_TiemChungByCode(code = '') {
    const url = `${PREFIX}account/GetInFo_TiemChungByCode?code=${code}`
    const res = await Utils.get_api(url, false, true, false, AppCodeConfig.APP_ADMIN)
    return res
}