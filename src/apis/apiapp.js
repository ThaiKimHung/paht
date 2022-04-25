import Utils from '../../app/Utils';
import moment from 'moment';
import { appConfig } from '../../app/Config';
import { Platform } from 'react-native';
import { nGlobalKeys } from '../../app/keys/globalKey';
const PREFIX = 'api/user/';


async function getDataAPI() {
    return;
}

async function getAddressViettel(latitude = '', longitude = '') {
    const DomainViettelMap = Utils.getGlobal(nGlobalKeys.domainViettelMap, '');
    let urlVM = `https://${DomainViettelMap}/gateway/searching/v1/place-api/reverse-geocoding?`
    let paramVM = `latlng=${latitude},${longitude}&access_token=${appConfig.apiViettelMap}`
    urlVM = urlVM + paramVM
    Utils.nlog('Gia tri url getAddressViettel', urlVM)
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

async function GetThoiTiet() {

    var time = moment(new Date()).add(-1, 'h').format("DD-MM-YYYY-HH-mm-ss").toString();
    Utils.nlog("gia tri time", time)
    var val = `api/thoitiet/GetList_Weather?tungay=${time}&lat=${appConfig.defaultRegion.latitude}&lon=${appConfig.defaultRegion.longitude}`;
    Utils.nlog("gia tri val", val)
    let res = await Utils.get_api(val, false, false);
    return res;
}
async function getAppCongig(id = 2) {
    var val = 'api/congfigapp/GetConfig?idapp=' + id
    let res = await Utils.get_api(val, false, false);
    return res;
}
//api/trangtinh/GetDeailTrangTinh?id=4

async function GetDeailTrangTinh(id = 4) {
    var val = `api/trangtinh/GetDeailTrangTinh?id=${id}`
    let res = await Utils.get_api(val, false, false);
    return res;
}
///api/dungchung/GetConfigByCode?code=PASSWORD_CHECK_CB
async function GetConfigByCode(code = 'PASSWORD_CHECK_CD') {
    var val = `api/dungchung/GetConfigByCode?code=${code}`;
    let res = await Utils.get_api(val, false, false);
    return res;
}

async function GetList_LienHe(Id = 1, key = '') {
    let val = `api/lien-he-khan/GetList_LienHe?more=true&filter.keys=Loai|keyword&filter.vals=${Id}|${key}`
    let res = await Utils.get_api(val, false, false);
    return res
}

//api/lien-he-khan/GetList_DM_HeThong?more=true
async function GetList_DM_HeThong() {
    let val = `api/lien-he-khan/GetList_DM_HeThong?more=true`
    let res = await Utils.get_api(val, false, false);
    return res
}


async function GetListQuocTich(more = true) {
    var val = `api/extensionFE/GetListQuocTich?more=${more}`;
    let res = await Utils.get_api(val, false, false);
    return res;
}
async function GetListDanToc(more = true) {
    var val = `api/extensionFE/GetListDanToc?more=${more}`;
    let res = await Utils.get_api(val, false, false);
    return res;
}
async function GetListTonGiao(more = true) {
    var val = `api/extensionFE/GetListTonGiao?more=${more}`;
    let res = await Utils.get_api(val, false, false);
    return res;
}

async function ViewMapFE(minlat, maxlat, minlong, maxlong) {
    var val = `api/extensionFE/ViewMapFE?more=true&filter.keys=MinToaDoX|MaxToaDoX|MinToaDoY|MaxToaDoY&filter.vals=${minlat}|${maxlat}|${minlong}|${maxlong}`;
    let res = await Utils.get_api(val, false, false);
    return res;
}

// api/banner/GetList_Banner_App?query.more=true
async function GetList_Banner_App() {
    var val = `api/banner/GetList_Banner_App?query.more=true`;
    let res = await Utils.get_api(val, false, false);
    return res;
}

//api/streamcamera/GetList_Camera?sortField=Id&page=1&record=10&more=true&filter.keys=Loai|keyword&filter.vals=${Id}|${key}
async function GetList_Camera(page = 1, record = 10, keyword = '') {
    var val = ''
    if (keyword) {
        val = `api/streamcamera/GetList_Camera?sortField=Id&page=${page}&record=${record}&filter.keys=keyword&filter.vals=${keyword}`;
    } else {
        val = `api/streamcamera/GetList_Camera?sortField=Id&page=${page}&record=${record}`;
    }
    let res = await Utils.get_api(val, false, false);
    return res;
}


async function GetDetailCamera(id = '') {
    var val = `api/streamcamera/GetDetail_Camera?id=${id}`
    Utils.nlog("res--------url", val)
    let res = await Utils.get_api(val, false, false);
    return res;
}

async function getListAddressViettel(input = '') {
    const DomainViettelMap = Utils.getGlobal(nGlobalKeys.domainViettelMap, '');
    let url = `https://${DomainViettelMap}/gateway/searching/v1/place-api/autocomplete?input=${input}&access_token=${appConfig.apiViettelMap}`
    try {
        const response = await fetch(url,
            {
                method: 'GET',
                redirect: 'follow'
            });
        const res = await response.json();
        if (res.ExceptionMessage != undefined) { // edit tuỳ từng object api
            Utils.nlog('[API]Lỗi API:', res);
            return -3;
        }
        return res
    }
    catch (error) {
        Utils.nlog('[API]Lỗi error:', error);
        return -1;
    }
    //----
}

async function getDetailsAddress(placeId = '') {
    const DomainViettelMap = Utils.getGlobal(nGlobalKeys.domainViettelMap, '');
    let url = `https://${DomainViettelMap}/gateway/searching/v1/place-api/detail?placeId=${placeId}&access_token=${appConfig.apiViettelMap}`
    try {
        const response = await fetch(url,
            {
                method: 'GET',
                redirect: 'follow'
            });
        const res = await response.json();
        if (res.ExceptionMessage != undefined) { // edit tuỳ từng object api
            Utils.nlog('[API]Lỗi API:', res);
            return -3;
        }
        return res
    }
    catch (error) {
        Utils.nlog('[API]Lỗi error:', error);
        return -1;
    }
    //----
}

async function GetTinhThanh() {
    var val = `api/dungchung/GetTinhThanh`
    let res = await Utils.get_api(val, false, false);
    return res;
}
async function GetQuanHuyen(idTinh) {
    var val = `api/dungchung/GetQuanHuyen?id=${idTinh}`
    let res = await Utils.get_api(val, false, false);
    return res;
}
async function GetPhuongXa(idHuyen) {
    var val = `api/dungchung/GetPhuongXa?id=${idHuyen}`
    let res = await Utils.get_api(val, false, false);
    return res;
}
async function GetKhuPho(idPhuong) {
    var val = `api/dang-ky-ve-que/GetKhuPhoTo?Id=${idPhuong}`
    let res = await Utils.get_api(val, false, false);
    return res;
}
async function GetTo(idTo) {
    var val = `api/dang-ky-ve-que/GetKhuPhoTo?Id=${idTo}`
    let res = await Utils.get_api(val, false, false);
    return res;
}

//api/ioc/TaoGiayDiDuong
async function TaoGiayDiDuong(body) {
    let res = await Utils.post_api('api/ioc/TaoGiayDiDuong', JSON.stringify(body), false, true, false);
    return res;
}

// api/ioc/GetList_GiayDiDuongCongDan?query.more=true
async function GetList_GiayDiDuongCongDan(page = 1, record = 10, more = false) {
    var val = `api/ioc/GetList_GiayDiDuongCongDan?query.more=${more}&query.page=${page}&query.record=${record}`
    let res = await Utils.get_api(val, false, true);
    return res;
}

//api/ioc/ChiTietGiayDiDuong?Id=
async function ChiTietGiayDiDuong(Id = '') {
    var val = `api/ioc/ChiTietGiayDiDuong?Id=${Id}`
    let res = await Utils.get_api(val, false, true);
    return res;
}

async function MaHoa(text = '') {
    var val = `api/ioc/MaHoa?plainText=${text}`
    let res = await Utils.get_api(val, false, false);
    return res;
}

async function writeLogError(strError) {
    var val = `api/congfigapp/WriteErrAppLog`;
    let strBody = JSON.stringify({
        "Message": strError,
        "DateTime": new Date()//kiểu datetime
    })
    let res = await Utils.post_api(val, strBody, false, false, false);
    return res;
}

// api/tien-ich/GetNhomDoiTuongLoaiTienIch
async function GetNhomDoiTuongLoaiTienIch() {
    var val = `api/tien-ich/GetNhomDoiTuongLoaiTienIch`
    let res = await Utils.get_api(val, false, false);
    return res;
}

//api/tien-ich/GetTienIchTheoLoaiTienIch?Id=1
async function GetTienIchTheoLoaiTienIch(Id, Keyword) {
    var val = `api/tien-ich/GetTienIchTheoLoaiTienIch?IdLoai=${Id}&Keyword=${Keyword}`;
    let res = await Utils.post_api(val, JSON.stringify({}), false, false);
    return res;
}

//api/map/GetDichVu?search=
async function GetDichVu(text) {
    var val = `api/map/GetDichVu?search=${text}`
    let res = await Utils.get_api(val, false, false);
    return res;
}

//GetTienIchTheoNhomDT?Id=&Keyword=
async function GetTienIchTheoNhomDT(Id = '', Keyword = '') {
    var val = `api/tien-ich/GetTienIchTheoNhomDT?Id=${Id}&Keyword=${Keyword}`;
    let res = await Utils.post_api(val, JSON.stringify({}), false, false);
    return res;
}

async function GetListConfigByCodes(code = 'CONFIG,CODE,ALL') {
    var val = `api/dungchung/GetListConfigByCodes?codes=${code}`;
    let res = await Utils.get_api(val, false, false);
    return res;
}


export {
    getDataAPI, getAddressGG, getAppCongig, GetThoiTiet, GetDeailTrangTinh, GetConfigByCode, GetList_LienHe,
    GetListQuocTich, GetListDanToc, GetListTonGiao, ViewMapFE, GetList_Banner_App, GetList_Camera,
    GetDetailCamera, getListAddressViettel, getDetailsAddress, GetList_DM_HeThong,
    GetTinhThanh, GetQuanHuyen, GetPhuongXa, GetKhuPho, GetTo, TaoGiayDiDuong, GetList_GiayDiDuongCongDan,
    ChiTietGiayDiDuong, MaHoa, writeLogError, GetNhomDoiTuongLoaiTienIch, GetTienIchTheoLoaiTienIch, GetDichVu,
    GetTienIchTheoNhomDT, GetListConfigByCodes
}