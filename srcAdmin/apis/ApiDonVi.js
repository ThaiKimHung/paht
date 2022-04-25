import Utils from "../../app/Utils";
import AppCodeConfig from "../../app/AppCodeConfig";
const PREFIX = 'api/donvi/';

async function GetAllDonVi() {
    let res = await Utils.get_api(PREFIX + `GetAllDonVi`, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
};
//https://tay-ninh-admin-api.jeecrms.com/api/donvi/GetList_DonVi?more=true&sortOrder=asc&sortField=&pageNumber=0&pageSize=10&OrderBy=&page=0&keyword=&record=10&trangthai=0&more=false
async function GetList_DonViApp() {
    let res = await Utils.get_api(PREFIX + `GetAllDonVi?more=true&sortOrder=asc&sortField=TenPhuongXa&pageNumber=0&pageSize=10&OrderBy=asc&page=0&keyword=&record=10&trangthai=0`, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
};
// api/donvi/GetList_DonVi?more=false&page=2
async function GetList_DonVi(capDV = 0, page = 1, recore = 10, keyword = '') {
    var url = PREFIX + `GetList_DonVi?more=true&page=${page}&recore=${recore}&CapDV=${capDV}&filter.keys=CapDV&filter.vals=${capDV}`;
    if (capDV == 0) {
        var url = PREFIX + `GetList_DonVi?more=true&sortOrder=asc&sortField=TenPhuongXa&OrderBy=TenPhuongXa`
    }
    console.log("gia tri get list-------------------url ", url);
    let res = await Utils.get_api(url, false, true, true, AppCodeConfig.APP_ADMIN)
    return res;
};

async function GetList_DonVi_ID(ArrayID, capDV = 0) {
    var url = PREFIX + `GetList_DonVi?more=true&filter.keys=Parent|CapDV&filter.vals=${ArrayID}|${capDV == 0 ? '' : capDV}`;
    // if (capDV == 0) {
    //     alert("100")
    //     var url = PREFIX + `GetList_DonVi?more=true&sortOrder=asc&sortField=TenPhuongXa&OrderBy=TenPhuongXa`
    // }
    console.log("gia tri get list-------------------url ", url);
    let res = await Utils.get_api(url, false, true, true, AppCodeConfig.APP_ADMIN)
    return res;
    // var url = PREFIX + `GetList_DonVi?more=true&filter.keys=Parent&filter.vals=${ArrayID}`
    // let res = await Utils.get_api(url, false, true, true, AppCodeConfig.APP_ADMIN)
    // return res;
};

async function GetList_DonVi_TheoDV(capDV = 0, page = 1, recore = 10, keyword = '') {
    var url = PREFIX + `?more=true&sortOrder=asc&sortField=TenPhuongXa&pageNumber=1&pageSize=10&OrderBy=TenPhuongXa&page=${page}&record=${recore}&trangthai=0&CapDV=${capDV}&filter.keys=CapDV&filter.vals=${capDV}`
    if (capDV == 0) {
        var url = PREFIX + `GetList_DonVi?more=true&sortOrder=asc&sortField=TenPhuongXa&OrderBy=TenPhuongXa`
    }
    let res = await Utils.get_api(url, false, true, true, AppCodeConfig.APP_ADMIN)
    return res;
};
//https://localhost:44345/api/xulyphananh/GetList_DonViPhanPhoi?more=true&filter.keys=CapDV%7CIdPA&filter.vals=1%7C2
async function GetList_DonViPhanPhoi_CA(CapDV = 0, IdPA = '') {
    let vals = `api/xulyphananh/GetList_DonViPhanPhoi?more=true&filter.keys=CapDV|IdPA&filter.vals=${CapDV}|${IdPA}`
    console.log(vals)
    let res = await Utils.get_api(vals, false, false, true, AppCodeConfig.APP_ADMIN)
    return res
}
export {
    GetAllDonVi, GetList_DonVi, GetList_DonVi_TheoDV, GetList_DonViApp, GetList_DonViPhanPhoi_CA, GetList_DonVi_ID
}
// api/donvi