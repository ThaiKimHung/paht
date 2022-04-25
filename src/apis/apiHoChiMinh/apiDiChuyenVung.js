
import AppCodeConfig from '../../../app/AppCodeConfig';
import Utils from '../../../app/Utils';

// https://hcm-mini-app-admin-api.vts-paht.com/api/HcmMiniApp/tramkiemsoat/List_DiemDen_CongDan

export async function List_DiemDen_CongDan(id) {
    let res = await Utils.get_api(`api/HcmMiniApp/tramkiemsoat/List_DiemDen_CongDan`, false, false, false, AppCodeConfig.APP_CONGDAN);
    Utils.nlog("GIA TRI res:", res)
    return res;
}