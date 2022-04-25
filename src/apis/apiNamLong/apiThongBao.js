import AppCodeConfig from '../../../app/AppCodeConfig';
import Utils from '../../../app/Utils';
const PREFIX = `api/f-ban-tin-thong-bao/`

//https://nam-long-admin-api.vts-demo.com/api/f-ban-tin-thong-bao/list-loai?more=true
async function ListLoaiThongBao() {
    let url = PREFIX + `list-loai?more=true`
    let res = await Utils.get_api('api/f-ban-tin-thong-bao/list-loai?more=true', false, false);
    return res
}

//https://nam-long-admin-api.vts-demo.com/api/f-ban-tin-thong-bao/list-cd?more=true&filter.keys=loai&filter.vals=2
async function getListThongBaoCD(IdRow, keyword, isCD) {
    if (IdRow == "-1" && keyword == '')
        var url = PREFIX + `list?more=true&sortField=CreatedDate&sortOrder=desc&filter.keys=IsNotifyAdmin&filter.vals=${isCD}`
    else if (IdRow == "-1" && keyword != '')
        var url = PREFIX + `list?more=true&filter.keys=keyword|IsNotifyAdmin&filter.vals=${keyword}|${isCD}&sortField=CreatedDate&sortOrder=desc`
    else
        var url = PREFIX + `list?more=true&filter.keys=keyword|loai|IsNotifyAdmin&filter.vals=${keyword}|${IdRow}|${isCD}&sortField=CreatedDate&sortOrder=desc`
    let res = await Utils.get_api_headers(url, false, false, false, isCD == 0 ? AppCodeConfig.APP_CONGDAN : AppCodeConfig.APP_ADMIN, isCD);
    return res
}

//https://nam-long-admin-api.vts-demo.com/api/f-ban-tin-thong-bao/cd-read?id=81
async function getChiTietTB(IdRow, isCD) {

    let url = PREFIX + (isCD == 0 ? `cd-read?id=${IdRow}` : `admin-read?id=${IdRow}`)
    let res = await Utils.get_api(url, false, false, false, isCD == 0 ? AppCodeConfig.APP_CONGDAN : AppCodeConfig.APP_ADMIN);
    console.log("----------->Log ra URL:", url)
    console.log("----------->Log ra RES:", res)
    return res
}

//https://nam-long-admin-api.vts-demo.com/api/f-ban-tin-thong-bao/list?more=true&filter.keys=loai&filter.vals=3
//Thông báo Uu đãi được chị Nhi đặt id=4
// async function getListThongBaoUuDai(id = 4) {
//     // var url = PREFIX + `list?more=true&sortField=CreatedDate&sortOrder=desc&filter.keys=loai&filter.vals=${id}`
//     var url = PREFIX + `list?more=true&sortField=CreatedDate&sortOrder=desc`
//     let res = await Utils.get_api(url, false, false);
//     return res
// }
export {
    ListLoaiThongBao, getListThongBaoCD, getChiTietTB
}