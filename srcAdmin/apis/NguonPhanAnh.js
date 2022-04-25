import Utils from "../../app/Utils";
import AppCodeConfig from "../../app/AppCodeConfig";
const PREFIX = 'api/nguonphananh/';
const apiHuy = 'api/phananh/';


async function GetList_NguonPhanAnh() {
    let res = await Utils.get_api(PREFIX + `GetList_NguonPhanAnh?more=true`, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
};

async function GetList_DanhSachPhanAnhHuy(page = 1, more = false, record = 10, valSearch = '') {
    let val = ''
    if (valSearch == '') {
        val = `GetList_DanhSachPhanAnhHuy?sortOrder=desc&sortField=CreatedDate&page=${page}&record=${record}&more=${more}`
    } else {
        val = `GetList_DanhSachPhanAnhHuy?sortOrder=desc&sortField=CreatedDate&page=${page}&record=${record}&more=${more}&filter.keys=keyword&filter.vals=${valSearch}`
    }
    let res = await Utils.get_api(apiHuy + val, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
}
async function GetList_NhatKyPhanAnh(page = 1, more = false, record = 10, IdPA) {
    let val = `GetList_NhatKyPhanAnh?sortOrder=desc&sortField=ThoiGian_Cast&page=${page}&record=${record}&more=${more}&filter.keys=IdPA&filter.vals=${IdPA}`;
    let res = await Utils.get_api(apiHuy + val, false, true, true, AppCodeConfig.APP_ADMIN)
    // const res = await Utils.get_api('api/phananh/GetList_NhatKyPhanAnh?sortOrder=desc&sortField=ThoiGian_Cast&page=1&record=10&more=true&filter.keys=IdPA&filter.vals=392', false, true);
    return res;
}

export {
    GetList_NguonPhanAnh, GetList_DanhSachPhanAnhHuy, GetList_NhatKyPhanAnh
}