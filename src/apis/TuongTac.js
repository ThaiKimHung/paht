import AppCodeConfig from '../../app/AppCodeConfig';
import Utils from '../../app/Utils';
const PREFIX = 'api/phananhweb/';
const PREFIX1 = 'api/tuongtaccb/'

async function DanhGiaHaiLong(DanhGia, IdPA, NoiDung = ' ') {
    const strBody = JSON.stringify({
        IdPA,
        NoiDung,
        DanhGia
    });
    Utils.nlog('Gia tri strBody DanhGia', strBody)
    const res = await Utils.post_api(PREFIX + 'DanhGiaHaiLong', strBody, false, true);
    return res;
}

async function TuongTacCanBoCongDan(IdPA, NoiDung, IsCongDan, Status, IdParent, listFileAdd) {

    const strBody = JSON.stringify({
        "IdPA": IdPA,
        "NoiDung": NoiDung,
        "IsCongDan": IsCongDan,
        "Status": Status,
        "IdParent": IdParent,
        "UploadFile": listFileAdd,
    });
    Utils.nlog('body taon cometn', strBody);
    const res = await Utils.post_api(PREFIX1 + 'TuongTacCanBoCongDan', strBody, false, true);
    return res;
}

async function CapNhatTuongTacCongDan(IdPA, IdRow, NoiDung, listFileAdd) {
    const strBody = JSON.stringify({
        "IdPA": IdPA,
        "NoiDung": NoiDung,
        "IdRow": IdRow,
        "UploadFile": listFileAdd,
    });
    Utils.nlog('body CapNhatTuongTacCongDan:', strBody);
    const res = await Utils.post_api(PREFIX1 + 'CapNhatTuongTacCongDan', strBody, false, true);
    return res;
}

async function XoaTuongTacCongDan(IdRow) {
    const res = await Utils.post_api(PREFIX1 + `XoaTuongTacCongDan?IdRow=${IdRow}`, 1, false, true);
    return res;
}

async function LikeTuongTacCB(IdRow) {
    const res = await Utils.post_api(PREFIX1 + `LikeTuongTacCB?IdRow=${IdRow}`, 1, false, false);
    return res;
}

async function DanhSachTuongTac(IdPA) {
    Utils.nlog('link tt', `${PREFIX1}DanhSachTuongTac?query.filter.keys=IdPA&query.filter.vals=${IdPA}`)
    let res = await Utils.get_api(`${PREFIX1}DanhSachTuongTac?query.more=true&query.filter.keys=IdPA&query.filter.vals=${IdPA}`, false, false);
    return res;
}

async function DanhSachTuongTac_TuiAnSinh(IdPA) {

    const url = `${PREFIX1}DanhSachTuongTac?query.more=true&query.filter.keys=IdPA&query.filter.vals=${IdPA}`
    let objKeyMoreHeader = {
        "TypeReference": 102
    }
    Utils.nlog('link tt', `${PREFIX1}DanhSachTuongTac?query.filter.keys=IdPA&query.filter.vals=${IdPA}`)
    let res = await Utils.get_api(url, false, true, false, AppCodeConfig.APP_CONGDAN, '0', objKeyMoreHeader);
    return res;
}

async function DanhSachTuongTac_TuVanF0(IdPA) {

    const url = `${PREFIX1}DanhSachTuongTac?query.more=true&query.filter.keys=IdPA&query.filter.vals=${IdPA}`
    let objKeyMoreHeader = {
        "TypeReference": 103
    }
    Utils.nlog('link tt', `${PREFIX1}DanhSachTuongTac?query.filter.keys=IdPA&query.filter.vals=${IdPA}`)
    let res = await Utils.get_api(url, false, true, false, AppCodeConfig.APP_CONGDAN, '0', objKeyMoreHeader);
    return res;
}

async function TuongTacCanBoCongDan_TuiAnSinh(IdPA, NoiDung, IsCongDan, Status, IdParent, listFileAdd) {

    const strBody = JSON.stringify({
        "IdPA": IdPA,
        "NoiDung": NoiDung,
        "IsCongDan": IsCongDan,
        "Status": Status,
        "IdParent": IdParent,
        "UploadFile": listFileAdd,
    });
    let objKeyMoreHeader = {
        "TypeReference": 102
    }
    Utils.nlog('body taon cometn', strBody);
    const res = await Utils.post_api(PREFIX1 + 'TuongTacCanBoCongDan', strBody, false, true, false, AppCodeConfig.APP_CONGDAN, '0', objKeyMoreHeader);
    return res;
}

async function TuongTacCanBoCongDan_TuVanF0(IdPA, NoiDung, IsCongDan, Status, IdParent, listFileAdd) {

    const strBody = JSON.stringify({
        "IdPA": IdPA,
        "NoiDung": NoiDung,
        "IsCongDan": IsCongDan,
        "Status": Status,
        "IdParent": IdParent,
        "UploadFile": listFileAdd,
    });
    let objKeyMoreHeader = {
        "TypeReference": 103
    }
    Utils.nlog('body taon cometn', strBody);
    const res = await Utils.post_api(PREFIX1 + 'TuongTacCanBoCongDan', strBody, false, true, false, AppCodeConfig.APP_CONGDAN, '0', objKeyMoreHeader);
    return res;
}


//api/ansinhxh/GiupDoYeuCau
async function GiupDoYeuCau(body) {
    const strBody = JSON.stringify(body);
    Utils.nlog('[LOG] body giup do', strBody);
    const res = await Utils.post_api('api/ansinhxh/GiupDoYeuCau', strBody, false, true, false, AppCodeConfig.APP_CONGDAN);
    return res;
}

//api/ansinhxh/DanhSachAnSinhHoTro?query.page=1&query.record=10&query.more=false&query.filter.keys=IsHoTro&query.filter.vals=1&orderByStr=NgayGui&sortOrder=desc
async function DanhSachAnSinhHoTro(page = 1, size = 10, isHoTro = 0, more = false) {
    const url = `api/ansinhxh/DanhSachAnSinhHoTro?query.page=${page}&query.record=${size}&query.more=${more}&query.filter.keys=IsHoTro&query.filter.vals=${isHoTro}&orderByStr=NgayGui&sortOrder=desc`
    const res = await Utils.get_api(url, false, true, false, AppCodeConfig.APP_CONGDAN);
    return res;
}

export {
    DanhGiaHaiLong, TuongTacCanBoCongDan, DanhSachTuongTac, LikeTuongTacCB, DanhSachTuongTac_TuiAnSinh, TuongTacCanBoCongDan_TuiAnSinh,
    GiupDoYeuCau, DanhSachAnSinhHoTro, DanhSachTuongTac_TuVanF0, TuongTacCanBoCongDan_TuVanF0, CapNhatTuongTacCongDan, XoaTuongTacCongDan
};