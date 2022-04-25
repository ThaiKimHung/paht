import { Alert } from "react-native";
import { appConfig } from "../../app/Config";
import { ConfigOnline } from "../../app/ConfigOnline";
import { nGlobalKeys } from "../../app/keys/globalKey";
import Utils from "../../app/Utils";

// https://beta.mytrafficid.com/apinew/api/authenticate
// GetToken
async function GetToken_GSGT() {
    // alert(ConfigOnline.Domain_GSGT)
    let Domain = ConfigOnline.Domain_GSGT
    let url = '/api/authenticate'
    let strBody = JSON.stringify({
        "password": "Viettel@2021",
        "rememberMe": true,
        "username": "sla_poc"
    })
    let res = await Utils.post_api_domain(Domain, '', url, strBody)
    // Utils.nlog('[ResToken] : ', res)
    return res
}

// https://beta.mytrafficid.com/apinew/api/v-violations-search-processtime?endTime=2022-01-29 00:00:00&page=0&size=5&startTime=2022-01-10 00:00:00&status=1
// danh sách vi phạm theo thời gian xử lý
async function GetListViPhamTheoThoiGianXuLy(token, dateFrom, dateTo, page = 0, plate = '') {
    Utils.nlog('tokennnn ', token)
    Utils.nlog('GetListViPhamTheoThoiGianXuLy========>PAGE:', page)
    let Domain = ConfigOnline.Domain_GSGT
    // api/v-violations-search-processtime
    let url = `/api/v-violations-search-processtime?endTime=${dateTo}&page=${page}&size=10&startTime=${dateFrom}&status=1&plate=${plate}`
    if (token) {
        Utils.nlog('url_X:', Domain + url)
        let page = ''
        try {
            const response = await fetch(Domain + url, {
                method: 'GET',
                headers: new Headers({
                    'accept': '*/*',
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }),
                body: ''
            })
            page = response.headers.get('X-Total-Count')
            Utils.nlog('TotalPage : ', page)
            const res = await response.json();
            return { res, totalPage: page }
        } catch (error) {
            Utils.nlog('[API]Lỗi error:', error);
            return -1;
        }
    } else {
        return [];
    }

}

// https://beta.mytrafficid.com/apinew/api/v-violations-search-viotime?endTime=2022-01-18 19:53:52&page=0&size=5&startTime=2021-01-18 00:00:00&status=1
// danh sách vi phạm theo thời gian vi phạm 
async function GetListViPhamTheoThoiGianViPham(token, dateFrom, dateTo, page = 0, plate = '') {
    Utils.nlog('tokennnn ', token)
    Utils.nlog('GetListViPhamTheoThoiGianViPham========>PAGE:', page)
    let Domain = ConfigOnline.Domain_GSGT
    // api/v-violations-search-viotime
    let url = `/api/v-violations-search-viotime?endTime=${dateTo}&page=${page}&size=10&startTime=${dateFrom}&status=1&plate=${plate}`
    Utils.nlog('GetListViPhamTheoThoiGianViPham========>URL:', url)
    if (token) {
        let page = ''
        try {
            const response = await fetch(Domain + url, {
                method: 'GET',
                headers: new Headers({
                    'accept': '*/*',
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }),
                body: ''
            })
            page = response.headers.get('X-Total-Count')
            Utils.nlog('TotalPage : ', page)
            const res = await response.json();
            return { res, totalPage: page }
        } catch (error) {
            Utils.nlog('[API]Lỗi error:', error);
            return -1;
        }
    } else {
        return [];
    }
}


// https://beta.mytrafficid.com/apinew/api/v-violation-types/100
// lấy thông tin loại lỗi vi phạm
async function getThongTinLoiViPham(token) {
    Utils.nlog('tokennnn ', token)
    Utils.nlog('getThongTinLoiViPham========>')
    let Domain = ConfigOnline.Domain_GSGT
    // api/v-violations-search-viotime
    let url = '/api/v-violation-types/100'

    if (token) {
        Utils.nlog('url_X:', Domain + url)
        try {
            const response = await fetch(Domain + url, {
                method: 'GET',
                headers: new Headers({
                    'accept': '*/*',
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }),
                body: ''
            });
            const res = await response.json();
            return res;
        } catch (error) {
            Utils.nlog('[API]Lỗi error:', error);
            return -1;
        }
    } else {
        return [];
    }
}

//https://beta.mytrafficid.com/apinew/api/v-violations/3939783?Id=3979943
//3. Lấy thông tin chi tiết lỗi vi phạm (bằng id
async function GetDetail_violate(Id, token) {
    let Domain = ConfigOnline.Domain_GSGT
    var url = `/api/v-violations/${Id}`
    // Utils.nlog('link tt', nGlobalKeys.Authen)

    if (token) {
        Utils.nlog('url_X:', Domain + url)
        try {
            const response = await fetch(Domain + url, {
                method: 'GET',
                headers: new Headers({
                    'accept': '*/*',
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }),
                body: ''
            });
            const res = await response.json();
            return res;
        } catch (error) {
            Utils.nlog('[API]Lỗi error:', error);
            return -1;
        }
    } else {
        return [];
    }
}

export {
    GetToken_GSGT, GetListViPhamTheoThoiGianXuLy, GetListViPhamTheoThoiGianViPham, getThongTinLoiViPham, GetDetail_violate
}


