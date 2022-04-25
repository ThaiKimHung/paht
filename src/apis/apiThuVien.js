import Utils from '../../app/Utils';

const getListTV = 'api/tuyentruyen/TuyenTruyenFrontendPage?'
//https://thanh-hoa-admin-api.vts-paht.com/api/tuyentruyen/TuyenTruyenFrontendPage?sortOrder=desc&sortField=Prior&page=1&keyword=&record=10&more=false&filter.keys=Type&filter.vals=3
async function getListThuVien(keys, vals, page, record, sortOrder = 'desc', sortField = 'CreateDate', keyword = '', more = 'false') {
    const parames = `sortOrder=${sortOrder}&sortField=${sortField}&page=${page}&keyword=&record=${record}&more=${more}&filter.keys=${keys}&filter.vals=${vals}`
    const res = await Utils.get_api(getListTV + parames);
    return res;
}

export {
    getListThuVien
};