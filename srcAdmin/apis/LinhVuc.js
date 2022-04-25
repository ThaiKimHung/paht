import Utils from "../../app/Utils";
import AppCodeConfig from "../../app/AppCodeConfig";
const PREFIX = 'api/linhvuc/';

async function GetList_LinhVuc() {
    let res = await Utils.get_api(PREFIX + `GetList_LinhVuc?more=true`, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
};

export {
    GetList_LinhVuc
}