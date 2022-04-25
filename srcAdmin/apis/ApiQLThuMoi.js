import Utils from "../../app/Utils"
import AppCodeConfig from "../../app/AppCodeConfig"

//api/quanlythumoi/DSThuMoi?sortOrder=asc&sortField=&pageNumber=1&pageSize=10&OrderBy=&page=1&keyword=&record=10&trangthai=0&more=false
//api/quanlythumoi/DSThuMoi?sortOrder=desc&sortField=ThoiGian&OrderBy=&page=1&record=10&trangthai=0&more=false&filter.keys=keyword|tungay|denngay|type1|cqbh&filter.vals=30-10-2020|28-01-2021|1|7
const PREFIX = 'api/quanlythumoi/'
async function getDSThuMoi(tungay, denngay, keyword, type1, cqbh) {
    let vals
    if (keyword)
        vals = `${PREFIX}DSThuMoi?sortOrder=asc&sortField=&pageNumber=1&pageSize=10&OrderBy=&page=1&record=10&trangthai=0&more=false&filter.keys=tungay|denngay|keyword${type1 >= 0 ? '|type1' : ''}${cqbh > 0 ? '|cqbh' : ''}&filter.vals=${tungay}|${denngay}|${keyword}${type1 >= 0 ? `|${type1}` : ''}${cqbh > 0 ? `|${cqbh}` : ''}`
    else
        vals = `${PREFIX}DSThuMoi?sortOrder=asc&sortField=&pageNumber=1&pageSize=10&OrderBy=&page=1&record=10&trangthai=0&more=false&filter.keys=tungay|denngay${type1 >= 0 ? '|type1' : ''}${cqbh > 0 ? '|cqbh' : ''}&filter.vals=${tungay}|${denngay}${type1 >= 0 ? `|${type1}` : ''}${cqbh > 0 ? `|${cqbh}` : ''}`
    let res = await Utils.get_api(vals, false, false, true, AppCodeConfig.APP_ADMIN)
    // Utils.nlog('Gia tri url =>>>>>>>>>>>>>>>>>>>', vals)
    return res;
}
//api/quanlythumoi/Info_ThuMoi?Id=79
async function getCTThuMoi(Id) {
    let vals = `${PREFIX}Info_ThuMoi?Id=${Id}`
    let res = await Utils.get_api(vals, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
}
//api/quanlythumoi/GetListCQBH
async function GetListCQBH() {
    let vals = `${PREFIX}GetListCQBH`
    let res = await Utils.get_api(vals, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
}
//api/quanlythumoi/GetListNK
async function GetListNK() {
    let vals = `${PREFIX}GetListNK`
    let res = await Utils.get_api(vals, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
}
export {
    getDSThuMoi, getCTThuMoi, GetListCQBH, GetListNK
}