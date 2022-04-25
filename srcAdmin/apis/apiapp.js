import { appConfig } from '../../app/Config';
import Utils from '../../app/Utils';
import AppCodeConfig from '../../app/AppCodeConfig';
import { nGlobalKeys } from '../../app/keys/globalKey';
const PREFIX = 'api/user/';
const ApiChuyenMuc = "api/chuyenmuc/"
const ApiLinhVuc = "api/linhvuc/"
const ApiTuongTu = "api/ai-similarity/"
async function getDataAPI() {
    return;
}
///api/chuyenmuc/GetList_ChuyenMuc?more=true
async function GetList_ChuyenMuc() {
    var val = `${ApiChuyenMuc}GetList_ChuyenMuc?more=true`
    let res = await Utils.get_api(val, false, true, true, AppCodeConfig.APP_ADMIN)
    return res;
}
// api / linhvuc / GetList_LinhVuc ? more = true
async function GetList_LinhVuc() {
    const res = await Utils.get_api(ApiLinhVuc + 'GetList_LinhVuc?more=true', false, true, true, AppCodeConfig.APP_ADMIN)
    return res;
}

async function getAddressViettel(latitude = '', longitude = '') {
    const DomainViettelMap = Utils.getGlobal(nGlobalKeys.domainViettelMap, '');
    let urlVM = `https://${DomainViettelMap}/gateway/searching/v1/place-api/reverse-geocoding?`
    let paramVM = `latlng=${latitude},${longitude}&access_token=${appConfig.apiViettelMap}`
    urlVM = urlVM + paramVM
    try {
        const response = await fetch(urlVM,
            {
                method: 'GET',
                redirect: 'follow'
            });
        const res = await response.json();
        Utils.nlog('[LOG] viettel map', res)

        if (res.ExceptionMessage != undefined) { // edit tuỳ từng object api
            Utils.nlog('[API]Lỗi API:', res);
            return -3;
        }

        let result = {
            latitude: latitude,
            longitude: longitude,
            full_address: ''
        }
        if (res.data && res.data.properties) {
            const { full_address, name } = res.data.properties
            return { ...result, full_address: full_address ? full_address : name ? name : `${latitude}, ${longitude}` }
        } else {
            return { ...result }
        }
    }
    catch (error) {
        Utils.nlog('[API]Lỗi error:', error);
        return -1;
    }
}

async function getAddressGG(latitude = '', longitude = '') {
    // true: của Viettel , false: là của Google
    let res = getAddressViettel(latitude, longitude)
    if (res != -1 || res != -3) {
        return res;
    } else {
        // let lat = `lat=${latitude}`; //API cũ Free: 5k request/day
        // let lon = `lon=${longitude}`;
        // let url = `https://us1.locationiq.com/v1/reverse.php?key=0ffe3daba9bd24&${lat}&${lon}&format=json`
        let url = 'https://maps.googleapis.com/maps/api/geocode/json?';
        let param = `latlng=${latitude},${longitude}&key=${appConfig.apiKeyGoogle}`
        url = url + param;
        try {
            const response = await fetch(url,
                {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });
            const res = await response.json();
            Utils.nlog('[LOG] google map', res)
            if (res.ExceptionMessage != undefined) { // edit tuỳ từng object api
                Utils.nlog('[API]Lỗi API:', res);
                return -3;
            }
            let result = {
                latitude: latitude,
                longitude: longitude,
                full_address: ''
            }
            var { results = [] } = res;
            if (res.results && res.results.length != 0) {
                return { ...result, full_address: results[0]?.formatted_address }
            } else {
                return { ...result }
            }
        }
        catch (error) {
            Utils.nlog('[API]Lỗi error:', error);
            return -1;
        }
        //----
    }
}

async function getAppCongig(id = 1) {
    var val = 'api/congfigapp/GetConfig?idapp=' + id
    let res = await Utils.get_api(val, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
}
//api/trackingadmin/GetDetail_TTAcc?id=3
async function GetDetail_TTAcc(id = 0) {
    var val = `api/trackingadmin/GetDetail_TTAcc?id=${id}`
    let res = await Utils.get_api(val, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
}

async function GetConfigByCode() {
    let val = `api/dungchung/GetConfigByCode?code=QuyTrinh_CaiDatCapDonVi_PhanPhoi`
    let res = await Utils.get_api(val, false, false, true, AppCodeConfig.APP_ADMIN)
    return res
}
async function GetConfigByCodeBy(code = '') {
    let val = `api/dungchung/GetConfigByCode?code=${code}`
    let res = await Utils.get_api(val, false, false, true, AppCodeConfig.APP_ADMIN)
    return res
}
async function DanhSachTuongTuPA(IdPA, NoiDung = "") {
    let strBody = JSON.stringify({
        "content": NoiDung,
        "id": IdPA,
        "prov_id": 0
    })
    let res = await Utils.post_api(ApiTuongTu + 'DanhSachTuongTuPA', strBody, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
}
async function GetConfigByCode_NhatKy() {
    let val = `api/dungchung/GetConfigByCode?code=PHANANH_NOIDUNGXULY_THONGTIN`
    let res = await Utils.get_api(val, false, false, true, AppCodeConfig.APP_ADMIN)
    return res
}

async function GetList_QuocTich(Code = "") {
    let val = `api/dungchung/GetList_QuocTich?kw=${Code}`
    let res = await Utils.get_api(val, false, false, true, AppCodeConfig.APP_ADMIN)
    return res
}
async function getConfigNoiDung() {
    var val = `api/dungchung/GetConfig`
    let res = await Utils.get_api(val, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
}

export {
    getDataAPI, GetList_ChuyenMuc, GetList_LinhVuc, getAddressGG, getAppCongig, GetDetail_TTAcc, GetConfigByCode,
    DanhSachTuongTuPA, GetConfigByCode_NhatKy, GetConfigByCodeBy, GetList_QuocTich, getConfigNoiDung
}
