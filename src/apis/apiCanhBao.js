import Utils from "../../app/Utils";
import { nGlobalKeys } from "../../app/keys/globalKey";

const PREFIX = 'api/canbaoapp/';
// {{domain}}api/canbaoapp/GetList_DefaultChuyenMuc?more=true
async function GetList_ChuyenMuc(more = false, nextPage = 1, size = 10, keys = '', vals = '',) {
    const token = await Utils.getGlobal(nGlobalKeys.loginToken, '')
    let url = ''

    if (token) {
        url = `${PREFIX}GetList_CanhBaoChuyenMuc?query.more=${more}&query.page=${nextPage}&query.record=${size}&query.sortField=ngaytao&query.sortOrder=desc`
        // &query.sortField=SendDate&query.sortOrder=desc`;
        Utils.nlog('url_X:', url)
        let res = await Utils.get_api(url, false, true);
        return res;
    } else {
        url = `${PREFIX}GetList_DefaultChuyenMuc?query.more=${more}&query.page=${nextPage}&query.record=${size}&query.sortField=ngaytao&query.sortOrder=desc`
        // &query.sortField=SendDate&query.sortOrder=desc`;
        Utils.nlog('url_Y:', url)
        let res = await Utils.get_api(url, false, false);
        return res;
    };


}
// api/canbaoapp/GetList_CanhBaoApp?query.more=false&query.page=1&query.record=10&query.sortField=tungay&query.sortOrder=desc&query.filter.keys=ChuyenMuc&query.filter.vals=40
async function GetList_CanhBaoApp(more = false, nextPage = 1, size = 10, vals = '') {
    let url = ''
    if (more == true) {
        url = `${PREFIX}GetList_CanhBaoApp?query.more=${more}`;
    } else {
        url = `${PREFIX}GetList_CanhBaoApp?query.more=${more}&query.page=${nextPage}&query.record=${size}&query.sortField=TuNgay&query.sortOrder=desc${vals > 0 ? `&query.filter.keys=ChuyenMuc&query.filter.vals=${vals}` : ''}`;
    };
    Utils.nlog('url_1:', url)
    let res = await Utils.get_api(url, false);
    return res;
}
//chi tiet
async function GetList_CanhBaoAppCT(more = true, nextPage = 1, size = 10, vals = '', keys = 'ChuyenMuc',) {
    let url = ''
    var fillter = ''
    if (keys && vals) {
        var fillter = `&query.filter.keys=${keys}&query.filter.vals=${vals}`;
    };

    if (more == true) {
        url = `${PREFIX}GetList_CanhBao_ChuyenMucApp?query.more=${more}`;
    } else {
        url = `${PREFIX}GetList_CanhBao_ChuyenMucApp?query.more=${more}&query.page=${nextPage}&query.record=${size}${fillter}&query.sortField=tungay&query.sortOrder=desc`;
    };
    Utils.nlog('url_2:', url)
    let res = await Utils.get_api(url, false);

    return res;
}
//api/canbaoapp/InfoCanhBao?IdRow=19
async function InfoCanhBao(id = '', isLg = false) {
    let url = ''
    if (isLg == true) {
        url = `${PREFIX}InfoCanhBao?IdRow=${id}`;
        Utils.nlog('url', url)
        let res = await Utils.get_api(url, false, true);
        return res;
    } else {
        url = `api/canbaoapp/InfoCanhBaoNone?IdRow=${id}`;
        Utils.nlog('url', url)
        let res = await Utils.get_api(url, false, false);
        return res;
    }

}
//api/canbaoapp/OnOffNotifyCanhBao
async function OnOffNotifyCanhBao(id, isNoti) {
    let strBody = JSON.stringify({
        "IdChuyenMuc": id,
        "NotiFy": isNoti
    });
    Utils.nlog("body", strBody)
    let res = await Utils.post_api(PREFIX + 'OnOffNotifyCanhBao', strBody, false, true)
    return res;

}

async function TuongTacNguoiDan(NoiDung, IdCanhBao, IdParent) {
    let strBody = JSON.stringify({
        NoiDung,
        IdCanhBao,
        IdParent
    });
    Utils.nlog("body", strBody)
    let res = await Utils.post_api(PREFIX + 'InsertCanhBaoTuongtac', strBody, false, true)
    return res;
}

//https://tay-ninh-admin-api.vts-paht.com/api/canhbao/GetListThongBao_CanhBao?query.more=true&query.record=10&query.page=1
async function GetListThongBao_CanhBao(more = 'true', record = 10, page = 1) {
    var url = `api/canhbao/GetListThongBao_CanhBao?query.more=${more}&query.record=${record}&query.page=${page}`;
    let res = await Utils.get_api(url, false, false, false)
    Utils.nlog("DU LIEU:", url)
    return res;
};
//https://tay-ninh-admin-api.vts-paht.com/api/canhbao/UpdateSeen_CanhBao?IdNotify=3
async function UpdateSeen_CanhBao(idNoti) {
    var url = `api/canhbao/UpdateSeen_CanhBao?IdNotify=${idNoti}`;
    let res = await Utils.get_api(url, false, false, false)
    Utils.nlog("DU LIEU:", url)
    return res;
};

export {
    GetList_CanhBaoApp, InfoCanhBao, GetList_ChuyenMuc, GetList_CanhBaoAppCT, OnOffNotifyCanhBao,
    TuongTacNguoiDan, GetListThongBao_CanhBao, UpdateSeen_CanhBao
}

