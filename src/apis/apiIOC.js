import AppCodeConfig from '../../app/AppCodeConfig';
import Utils from '../../app/Utils';
import { store } from '../../srcRedux/store';
const PREFIX = 'api/ioc/';

///api/ioc/ThongKe_TrangThai_GiayDiDuong?query.more=true&query.filter.keys=tungay|denngay&query.filter.vals=07-09-2021|07-09-2021
async function ThongKe_TrangThai_GiayDiDuong(tungay, denngay) {
    let vals
    if (tungay && denngay) {
        vals = `${PREFIX}ThongKe_TrangThai_GiayDiDuong?query.more=true&query.filter.keys=tungay|denngay&query.filter.vals=${tungay}|${denngay}`
    } else {
        vals = `${PREFIX}ThongKe_TrangThai_GiayDiDuong?query.more=true`
    }
    Utils.nlog('Giá tri api Thong Ke Dang Ky', vals)
    let res = await Utils.get_api(vals, false, true, true, AppCodeConfig.APP_ADMIN)
    return res
}

///api/ioc/GetList_GiayDiDuong?query.more=false&query.record=10&query.page=1&query.filter.keys=keyword|Status|IdDonVi|tungay|denngay&query.filter.vals
async function GetList_GiayDiDuong(page = 1, record = 10, keyword = '', Status = '', tungay = '', denngay = '', more = false) {
    const { userDH } = await store.getState().auth
    Utils.nlog('useDH', userDH)
    let vals = `${PREFIX}GetList_GiayDiDuong?query.more=${more}&query.record=${record}&query.page=${page}`

    vals += `&query.filter.keys=${keyword ? 'keyword|' : ''}${Status != -1 ? 'Status|' : ''}IdDonVi|${tungay ? 'tungay|' : ''}${denngay ? 'denngay' : ''}`
    vals += `&query.filter.vals=${keyword ? keyword + '|' : ''}${Status != -1 ? Status + '|' : ''}${userDH?.IdDonVi}|${tungay ? tungay + '|' : ''}|${denngay ? denngay : ''}`
    Utils.nlog('[LOG] URL: ', vals)
    let res = await Utils.get_api(vals, false, true, true, AppCodeConfig.APP_ADMIN)
    return res
}

///api/ioc/Duyet_GiayDiDuong
async function Duyet_GiayDiDuong(body) {
    let res = await Utils.post_api('api/ioc/Duyet_GiayDiDuong', JSON.stringify(body), false, true, false, AppCodeConfig.APP_ADMIN)
    return res
}
export {
    ThongKe_TrangThai_GiayDiDuong, GetList_GiayDiDuong, Duyet_GiayDiDuong
}

