import Utils from '../../app/Utils';
import AppCodeConfig from '../../app/AppCodeConfig';
const PREFIX = 'api/tuongtac/'

async function TuongTacCanBoCongDan(IdPA, NoiDung, Status, IdParent = '', IsCongDan = true, IdRow = '',) {
    const strBody = JSON.stringify({
        IdPA,
        NoiDung,
        Status,
        IdParent,
        IsCongDan,
        IdRow,
    });
    Utils.nlog('body taon cometn', strBody);
    const res = await Utils.post_api(PREFIX1 + 'TuongTacCanBoCongDan', strBody, false, true, true, AppCodeConfig.APP_ADMIN)
    return res;
}

async function LikeTuongTacCB(IdRow) {
    const res = await Utils.post_api(PREFIX1 + `LikeTuongTacCB?IdRow=${IdRow}`, 1, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
}

async function DanhSachTuongTac(IdPA) {
    Utils.nlog('link tt', `${PREFIX}DanhSachTuongTac?more=true&query.filter.keys=IdPA&query.filter.vals=${IdPA}`)
    let res = await Utils.get_api(`${PREFIX}DanhSachTuongTac?query.more=true&query.filter.keys=IdPA&query.filter.vals=${IdPA}`, false, true, true, AppCodeConfig.APP_ADMIN)
    return res;
}


async function Reply_TuongTac_Insert(IdPA, IdRow, NoiDung, listFileAdd, showTuongTac = false) {
    const strBody = JSON.stringify({
        "IdPA": IdPA,
        "IdRow": IdRow,
        "NoiDung": NoiDung,
        "UploadFile": listFileAdd,
        "IsHienThiNDVoiND": showTuongTac
    });
    let res = await Utils.post_api(`${PREFIX}Reply_TuongTac_Insert`, strBody, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
}
async function Reply_TuongTac_Update(IdPA, IdRow, NoiDung, showTuongTac = false) {
    const strBody = JSON.stringify({
        IdPA,
        NoiDung,
        IdRow,
        "IsHienThiNDVoiND": showTuongTac
    });
    let res = await Utils.post_api(`${PREFIX}Reply_TuongTac_Update`, strBody, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
}

async function Delete_TuongTac(IdRow) {
    const res = await Utils.get_api(`${PREFIX}Delete_TuongTac?Id=${IdRow}`, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
}

async function EnOrDis_TuongTac(IdRow) {
    const res = await Utils.get_api(`${PREFIX}EnOrDis_TuongTac?Id=${IdRow}`, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
}
///api/tuongtac/DanhSachPhanAnhGY?sortOrder=asc&sortField=&pageNumber=1&pageSize=10&OrderBy=&page=1&keyword=&record=10&trangthai=0&more=false

async function DanhSachPhanAnhGY_tt(more = false, page = 1, recore = 10, keyword = '', typeTT = -100) {
    const apiHead = `${PREFIX}DanhSachPhanAnhGY?sortOrder=asc&sortField=&pageNumber=0&pageSize=10&OrderBy=&page=${page}&keyword=${keyword}&record=${recore}&trangthai=0&more=${more}&`
    let url = `${PREFIX}DanhSachPhanAnhGY?sortOrder=asc&sortField=&pageNumber=0&pageSize=10&OrderBy=&page=${page}&record=${recore}&trangthai=0&more=${more}`
    if (typeTT == -3)
        url = `${apiHead}filter.keys=IsTraLoiTT|keyword&filter.vals=0|${keyword}`
    else if (typeTT == -4)
        url = `${apiHead}filter.keys=IsRead|keyword&filter.vals=0|${keyword}`
    else if (keyword)
        url = `${apiHead}filter.keys=keyword&filter.vals=${keyword}`
    Utils.nlog("gia tri url", url)
    const res = await Utils.get_api(url, false, true, true, AppCodeConfig.APP_ADMIN)
    return res;
}


export {
    TuongTacCanBoCongDan, DanhSachTuongTac, LikeTuongTacCB, Reply_TuongTac_Insert, Reply_TuongTac_Update, Delete_TuongTac, EnOrDis_TuongTac, DanhSachPhanAnhGY_tt
};