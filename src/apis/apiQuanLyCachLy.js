import Utils from "../../app/Utils";
import { nGlobalKeys } from "../../app/keys/globalKey";
import AppCodeConfig from '../../app/AppCodeConfig';

const PREFIX = 'api/HcmMiniApp/';

//https://hcm-binh-chanh-admin-api.vts-paht.com/api/HcmMiniApp/tramkiemsoat/ThongKe_DanhSachCachLy?query.more=true
async function GetThongKeCachLyTaiNha(record = 10, page = 1, more = false) {
    let url = `${PREFIX}tramkiemsoat/ThongKe_DanhSachCachLy??query.more=${more}&query.record=${record}&query.page=${page}`;
    let res = await Utils.get_api(url, false, false, false, AppCodeConfig.APP_ADMIN)
    Utils.nlog("QUAN LY CACH LY_THONG KE CACH LY TAI NHA:", url)
    return res;
};
//https://hcm-binh-chanh-admin-api.vts-paht.com/api/HcmMiniApp/tramkiemsoat/List_NguoiCachLyTaiNha?query.more=true&query.record=10&query.page=1&query.filter.vals
async function GetListCachLyTaiNha(record = 10, page = 1, dataBoDy, more = false,) {
    let keyFillter = "", valueFilter = ""
    Object.keys(dataBoDy).map(function (key, index) {
        if (dataBoDy[key]) {
            keyFillter += key + "|"
            valueFilter += dataBoDy[key] + "|"
        }
    });
    let url = `${PREFIX}tramkiemsoat/List_NguoiCachLyTaiNha?query.more=${more}&query.record=${record}&query.page=${page}`;
    if (dataBoDy && keyFillter && valueFilter) {
        url = `${PREFIX}tramkiemsoat/List_NguoiCachLyTaiNha?query.more=${more}&query.record=${record}&query.page=${page}&query.filter.keys=${keyFillter}&query.filter.vals=${valueFilter}`;
    }
    Utils.nlog('[URL] QUAN LY CACH LY_DANH SACH CACH LY TAI NHA', url)
    let res = await Utils.get_api(url, false, false, false, AppCodeConfig.APP_ADMIN)
    return res;
};

//https://hcm-binh-chanh-admin-api.vts-paht.com/api/HcmMiniApp/tramkiemsoat/NhacNho_ChuyenCapCuu
async function NhacNhoBenhNhanChuyenBienNang(body) {
    //var url = `${PREFIX}tramkiemsoat/NhacNho_ChuyenCapCuu`;
    let strBody = JSON.stringify({
        ...body
    })
    let res = await Utils.post_api(`${PREFIX}tramkiemsoat/NhacNho_ChuyenCapCuu`, strBody, false, false, false, AppCodeConfig.APP_ADMIN);
    return res;
};


export {
    GetThongKeCachLyTaiNha, GetListCachLyTaiNha, NhacNhoBenhNhanChuyenBienNang,
}

