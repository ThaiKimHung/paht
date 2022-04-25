import { nGlobalKeys } from "../../app/keys/globalKey"
import Utils from "../../app/Utils"
const PREFIX = `api/donvi/`

//api/donvi/GetListDonViHanhChinh?sortOrder=asc&sortField=&pageNumber=1&pageSize=10&OrderBy=&page=1&keyword=&record=10&more=false
async function GetListDonViHanhChinh(page = 1, record = 10, more = false) {
    const URL = `${PREFIX}GetListDonViHanhChinh?sortOrder=asc&sortField=&pageNumber=1&pageSize=10&OrderBy=&page=${page}&keyword=&record=${record}&more=${more}`
    let res = await Utils.get_api(URL, false, false)
    return res
}

//api/donvi/GetDetailDonViHanhChinh?MaPX=164
async function GetDetailDonViHanhChinh(MaPX = Utils.getGlobal(nGlobalKeys.IdTinh_GioiThieu, '')) {
    //Mặc định là mã phường xã Tỉnh Thái nguyên
    Utils.nlog('[LOG] MAPX GIOI THIEU', MaPX)
    const URL = `${PREFIX}GetDetailDonViHanhChinh?MaPX=${MaPX}`
    let res = await Utils.get_api(URL, false, false)
    return res
}

//api/donvi/GetAllDonVi?loai=1
async function GetAllDonVi() {
    const URL = `${PREFIX}GetAllDonVi?loai=1`
    let res = await Utils.get_api(URL, false, false)
    return res
}

export {
    GetListDonViHanhChinh, GetDetailDonViHanhChinh, GetAllDonVi
}