import Utils from '../../app/Utils';
const PREFIX = 'api/congdan_xphc/';
//api/congdan_xphc/GetList_HanhChinh

async function GetList_HanhChinh(objectFilter = {
    "sortOrder": "desc",
    "sortField": "CreatedDate",
    "pageSize": "10",
    "OrderBy": "CreatedDate",
    "page": "1",
    "record": "10",
}) {
    let filter = ''
    for (const property in objectFilter) {
        filter = filter + `&${property}=${objectFilter[property]}`
    }
    let res = await Utils.get_api(`api/congdan_xphc/GetList_HanhChinh?${filter}`, false, false);
    return res;
};

async function GetListAllLV() {
    let val = `api/extensionFE/GetListAllLV?more=true`
    const res = await Utils.get_api(val, false, false);
    return res;
}

async function GetDetail_HanhChinh(IdXuPhat) {
    let val = `${PREFIX}GetDetail_HanhChinh?id=${IdXuPhat}`
    const res = await Utils.get_api(val, false, false);
    return res;
}

async function GetList_DonVi(isGiayDiDuong = false) {
    let val = `api/donvi/GetList_DonVi?query.more=true${isGiayDiDuong ? `&query.filter.keys=HienThiGioiThieu&query.filter.vals=1` : ''}`
    const res = await Utils.get_api(val, false, false);
    return res;
}

async function LayTreeDonViCD() {
    let val = `api/donvi/LayTreeDonViCD`
    const res = await Utils.get_api(val, false, false);
    return res;
}
export {
    GetList_HanhChinh, GetListAllLV, GetList_DonVi, GetDetail_HanhChinh, LayTreeDonViCD
};