//https://tay-ninh-admin-api.bookve.com.vn/api/thongbao/GetThongBao

import Utils from "../../app/Utils";
import AppCodeConfig from "../../app/AppCodeConfig";
const PREFIX = 'api/thongbao/';

async function GetThongBao() {
    let res = await Utils.get_api(PREFIX + `GetThongBao?`, false, true, true, AppCodeConfig.APP_ADMIN)
    return res;
};

export {
    GetThongBao
}