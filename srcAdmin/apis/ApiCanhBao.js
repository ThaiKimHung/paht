//https://tay-ninh-admin-api.jeecrms.com/api/canhbao/GetList_CanhBao?
//sortOrder=asc&sortField=&page=1&record=10&OrderBy=&filter.keys=IsDuyet&filter.vals=false
import Utils from "../../app/Utils";
import AppCodeConfig from "../../app/AppCodeConfig";
const PREFIX = 'api/canhbao/';

// async function GetAllDonVi() {
//     let res = await Utils.get_api(PREFIX + `GetAllDonVi`, false, false);
//     return res;
// };

// api/donvi/GetList_DonVi?more=false&page=2
async function GetList_CanhBao(page = 1, recore = 10, vals = '|false|false', keys = 'keyword|HeHan|IsDuyet') {
    Utils.nlog("gia tri val ", vals);
    var url = PREFIX + `GetList_CanhBao?sortOrder=asc&sortField=id&page=${page}&record=${recore}&OrderBy=id&filter.keys=${keys}&filter.vals=${vals}`;
    let res = await Utils.get_api(url, false, true, true, AppCodeConfig.APP_ADMIN)
    return res;
};
//https://tay-ninh-admin-api.jeecrms.com/api/canhbao/InfoCanhBao?IdRow=11
async function InfoCanhBao(idRow) {
    Utils.nlog("gia tri val ", idRow);
    var url = PREFIX + `InfoCanhBao?IdRow=${idRow}`;
    let res = await Utils.get_api(url, false, true, true, AppCodeConfig.APP_ADMIN)
    return res;
};
//https://tay-ninh-admin-api.jeecrms.com/api/canhbao/InsertCanhBao
async function InsertCanhBao(Body = {}) {
    let strBody = JSON.stringify(Body)
    Utils.nlog("gia tri xu li InsertCanhBao", strBody)
    let res = await Utils.post_api(PREFIX + 'InsertCanhBao', strBody, false, true, false, AppCodeConfig.APP_ADMIN)
    return res;
}
//https://tay-ninh-admin-api.jeecrms.com/api/canhbao/UpdateCanhBao
async function UpdateCanhBao(Body = {}) {
    let strBody = JSON.stringify(Body)
    Utils.nlog("gia tri xu li UpdateCanhBao", strBody)
    let res = await Utils.post_api(PREFIX + 'UpdateCanhBao', strBody, false, true, false, AppCodeConfig.APP_ADMIN)
    return res;
}
//api/canhbao/CheckCanhBao
async function CheckCanhBao(Body = {}) {
    let strBody = JSON.stringify(Body)
    Utils.nlog("gia tri xu li CheckCanhBao", strBody)
    let res = await Utils.post_api(PREFIX + 'CheckCanhBao', strBody, false, true, false, AppCodeConfig.APP_ADMIN)
    return res;
}
//https://tay-ninh-admin-api.bookve.com.vn/api/canhbao/DeleteCanhBao?IdRow=66
async function DeleteCanhBao(idRow) {
    Utils.nlog("gia tri val ", idRow);
    var url = PREFIX + `DeleteCanhBao?IdRow=${idRow}`;
    let res = await Utils.get_api(url, false, true, true, AppCodeConfig.APP_ADMIN)
    return res;
};
//https://dak-lak-admin-api.jeecrms.com/api/canhbao/InsertCanhBaoTuongtac
async function InsertCanhBaoTuongtac(Body) {
    let strBody = JSON.stringify(Body)
    Utils.nlog("gia tri xu li CheckCanhBao", strBody)
    let res = await Utils.post_api(PREFIX + 'InsertCanhBaoTuongtac', strBody, false, true, false, AppCodeConfig.APP_ADMIN)
    return res;
};
//https://dak-lak-admin-api.jeecrms.com/api/canhbao/DuyetCBTTCongDan
async function DuyetCBTTCongDan(Body) {
    let strBody = JSON.stringify(Body)
    Utils.nlog("gia tri xu li duyet canh bao", strBody)
    let res = await Utils.post_api(PREFIX + 'DuyetCBTTCongDan', strBody, false, true, false, AppCodeConfig.APP_ADMIN)
    return res;
};
//https://dak-lak-admin-api.jeecrms.com/api/canhbao/DeleteCB_TuongTac?Id=36&type=0
async function DeleteCB_TuongTac(Id = 0, type = 0) {
    // let strBody = JSON.stringify({
    //     Id: Id,
    //     type: type
    // });

    // Utils.nlog("gia tri xu li duyet canh bao", strBody)
    let res = await Utils.get_api(PREFIX + `DeleteCB_TuongTac?Id=${Id}&type=${type}`, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
};
//https://dak-lak-admin-api.jeecrms.com/api/canhbao/TuongTacCB_Update;
async function TuongTacCB_Update(Body) {
    let strBody = JSON.stringify(Body)
    Utils.nlog("gia tri xu li duyet canh bao", strBody)
    let res = await Utils.post_api(PREFIX + 'TuongTacCB_Update', strBody, false, true, true, AppCodeConfig.APP_ADMIN)
    return res;
};
export {
    GetList_CanhBao, InfoCanhBao, InsertCanhBao, UpdateCanhBao, DeleteCanhBao, CheckCanhBao, InsertCanhBaoTuongtac, DuyetCBTTCongDan,
    DeleteCB_TuongTac, TuongTacCB_Update
}
// api/donvi
