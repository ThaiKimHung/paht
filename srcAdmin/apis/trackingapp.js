// XacMinhTTAcc
import Utils from '../../app/Utils';
import AppCodeConfig from '../../app/AppCodeConfig';
const PREFIX = 'api/trackingadmin/';
async function DanhSachAccMap() {
    const res = await Utils.get_api(PREFIX + `DanhSachAccMapBE?more=true`, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
}
async function TrackingGPSUserDetail(vals = '') {
    var url = `TrackingGPSUserDetail?more=false&filter.keys=tungay|denngay|IdUsers&filter.vals=${vals}`
    const res = await Utils.get_api(PREFIX + url, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
}
//api/trackingadmin/TrackingGPSUserDetail
//{{domain}}api/trackingadmin/


///api/trackingadmin/
async function TrackingGPSUser(vals = '') {
    var url = `TrackingGPSUser?more=false&filter.keys=tungay|denngay|IdUsers&filter.vals=${vals}`
    const res = await Utils.get_api(PREFIX + url, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
}

//api/trackingadmin/GetAllDSBN
async function GetAllDSBN(vals = '') {
    var url = `GetAllDSBN?more=true`;
    if (vals != '') {
        url = `GetAllDSBN?more=true&filter.keys=keyword&filter.vals=${vals}`;
    }
    Utils.nlog("gia tri url", url)
    const res = await Utils.get_api(PREFIX + url, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
}
export {
    DanhSachAccMap, TrackingGPSUserDetail, TrackingGPSUser, GetAllDSBN
};