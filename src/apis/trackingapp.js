// XacMinhTTAcc
import Utils from '../../app/Utils';
const PREFIX = 'api/trackingapp/';

async function XacMinhTTAcc(body = {}) {
    const strBody = JSON.stringify(body);
    Utils.nlog("gia tri body", strBody);
    const res = await Utils.post_api(PREFIX + 'XacMinhTTAcc', strBody, false, false);
    return res;
}
//api/trackingapp/GetDetail_TTAcc?token=
async function GetDetail_TTAcc(token = '') {
    const res = await Utils.get_api(PREFIX + `GetDetail_TTAcc?token=${token}`, false);
    return res;
}
//api/trackingapp/TrackingPosition
async function TrackingPosition(body = {}) {
    const strBody = JSON.stringify(body);
    Utils.nlog("gia tri body", strBody);
    const res = await Utils.post_api(PREFIX + 'TrackingPosition', strBody, false, false);
    return res;
}
//https://tay-ninh-admin-api.bookve.com.vn/api/trackingapp/DanhSachAccMap?more=true;
async function DanhSachAccMap() {
    const res = await Utils.get_api(PREFIX + `DanhSachAccMap?more=true`, false);
    return res;
}
export {
    XacMinhTTAcc, GetDetail_TTAcc, TrackingPosition, DanhSachAccMap
};