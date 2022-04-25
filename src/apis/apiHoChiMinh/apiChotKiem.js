// let res = await Utils.post_api(`api${Utils.getGlobal(nGlobalKeys.formRegister, appConfig.rootIOC)}/account/` + 'CapNhatTTCongDan', strBody, false, true, false);
import Utils from '../../../app/Utils';
import moment from 'moment';
import { appConfig } from '../../../app/Config';
import { Platform } from 'react-native';
import { nGlobalKeys } from '../../../app/keys/globalKey';
import AppCodeConfig from '../../../app/AppCodeConfig';

const PREFIX = `api/HcmMiniApp/`

///api/HcmMiniApp/tramkiemsoat/List_TramKiemSoat?query.more=false&query.page=1&query.record=10
export async function GetListDSChotKiem(page = 1, record = 10, IdThanhPho = '', IdQuan = '', IdPhuong = '', LoaiTram = 0, more = false) {
    //Loai tram 0  là chốt kiểm dịch, 1 là chốt kiểm đi chợ
    let requestURL = `${PREFIX}tramkiemsoat/List_TramKiemSoat?query.more=${more}&query.page=${page}&query.record=${record}&query.filter.keys=IdThanhPho|IdQuan|IdPhuong|LoaiTram&query.filter.vals=${IdThanhPho}|${IdQuan}|${IdPhuong}|${LoaiTram}`
    Utils.nlog('[LOG] API: ', requestURL)
    let res = await Utils.get_api(requestURL, false, false, true, AppCodeConfig.APP_ADMIN);
    return res;
}

// LỊCH SỬ QUÉT QR CỦA ADMIN
///api/HcmMiniApp/tramkiemsoat/List_LichSu_QuetQRCode cũ của HCCM mới là List_LichSu_QuetQRCode_BinhChanh
export async function GetListHistoryScan(textSearch = '', page = 1, record = 10, loai = 1, more = false) {
    let requestURL = `${PREFIX}tramkiemsoat/List_LichSu_QuetQRCode_BinhChanh?query.more=${more}&query.page=${page}&query.record=${record}&query.filter.keys=Loai&query.filter.vals=${loai}`
    if (textSearch) {
        requestURL = `${PREFIX}tramkiemsoat/List_LichSu_QuetQRCode_BinhChanh?query.more=${more}&query.page=${page}&query.record=${record}&query.filter.keys=keyword|Loai&query.filter.vals=${textSearch}|${loai}`
    }
    Utils.nlog('[LOG] API: ', requestURL)
    let res = await Utils.get_api(requestURL, false, false, true, loai == 2 ? AppCodeConfig.APP_CONGDAN : AppCodeConfig.APP_ADMIN);
    return res;
}

// LỊCH SỬ QUÉT QR ĐI CHỢ
//api/HcmMiniApp/tramkiemsoat/List_LichSu_QuetQRCode_DiCho
export async function GetListHistoryScanMarket(textSearch = '', page = 1, record = 10, loai = 1, more = false) {
    // loai 1 lấy theo Id công dân, 2 lấy theo Id nhân viên địa điểm chợ
    let requestURL = `${PREFIX}tramkiemsoat/List_LichSu_QuetQRCode_DiCho?query.more=${more}&query.page=${page}&query.record=${record}&query.filter.keys=Loai&query.filter.vals=${loai}`
    if (textSearch) {
        requestURL = `${PREFIX}tramkiemsoat/List_LichSu_QuetQRCode_DiCho?query.more=${more}&query.page=${page}&query.record=${record}&query.filter.keys=keyword|Loai&query.filter.vals=${textSearch}|${loai}`
    }
    Utils.nlog('[LOG] API: ', requestURL)
    let res = await Utils.get_api(requestURL, false, false, true, loai == 1 ? AppCodeConfig.APP_CONGDAN : AppCodeConfig.APP_ADMIN);
    return res;
}


// Lịch sử quét QR check in cho các bước check in tại điểm tiêm
//https://hcm-mini-app-admin-api-test.vts-paht.com/api/HcmMiniApp/tiem-chung/List_LichSu_CheckInQRCode
export async function List_LichSu_CheckInQRCode(
    objectGet = {
        "query.more": false,
        "query.page": 1,
        "query.record": 10,
        "query.filter.keys": 'Action|keyword|DiemTiem',
        "query.filter.vals": `|`,
    }) {
    let query = "";
    Object.keys(objectGet).map(function (key, index) {
        query += key + "=" + objectGet[key] + `${Object.keys(objectGet).length - 1 == index ? '' : '&'}`
    })
    let requestURL = `${PREFIX}tiem-chung/List_LichSu_CheckInQRCode?${query}`
    let res = await Utils.get_api(requestURL, false, false, true, AppCodeConfig.APP_ADMIN);
    Utils.nlog("QUERY:", query)
    Utils.nlog("RES:", res)
    return res;
}
// https://localhost:44347/api/HcmMiniApp/tramkiemsoat/List_CauHoi_KhaiBaoYTe?Loai=2

export async function List_CauHoi_KhaiBaoYTe(loai = 1) {
    let requestURL = `${PREFIX}tramkiemsoat/List_CauHoi_KhaiBaoYTe?Loai=${loai}`
    Utils.nlog('[LOG] API: ', requestURL)
    let res = await Utils.get_api(requestURL, false, false, true, AppCodeConfig.APP_CONGDAN);
    return res;
}
// {domain}/api/HcmMiniApp/tramkiemsoat/List_TramKiemSoat?query.more=false&query.page=1&query.record=10
