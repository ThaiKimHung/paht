import Utils from "../../app/Utils";
import AppCodeConfig from "../../app/AppCodeConfig";

const PREFIX = 'api/chuyenmuc/';

async function GetList_ChuyenMuc() {
    let res = await Utils.get_api(PREFIX + `GetList_ChuyenMuc?more=true`, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
};
//List_ChuyenMucAI
// api/chuyenmuc/ GetList_ChuyenMucAI?
// query.filter["content"], more =true lấy tất cả chuyên mục
async function GetList_ChuyenMucAI(content) {
    let body = {
        content: content
    }
    let strBody = JSON.stringify(body)
    Utils.nlog("gia tri xu li UpdateCanhBao", strBody)
    let res = await Utils.post_api(PREFIX + `List_ChuyenMucAI?more=true`, strBody, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
};
async function GetList_ChuyenMucAITheoLinhVuc(body) {

    let strBody = JSON.stringify(body)
    Utils.nlog("gia tri xu li UpdateCanhBao", strBody)
    let res = await Utils.post_api(PREFIX + `List_ChuyenMucAI`, strBody, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
};


export {
    GetList_ChuyenMuc, GetList_ChuyenMucAI, GetList_ChuyenMucAITheoLinhVuc
}