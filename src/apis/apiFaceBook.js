import Utils from '../../app/Utils';
import { appConfigCus } from '../../app/Config';
const đomainAPIFB = 'https://graph.facebook.com/';

const getListPage = 'me/accounts?access_token='

const linkbaiviet = `${appConfigCus.live.linkWeb}vi/chi-tiet-phan-anh?id=`

// const linkbaiviet = `https://daklak.vts-paht.com/vi/chi-tiet-phan-anh?id=`


async function GetDataPageFacebook(token) {
    const res = await Utils.get_apiFacebook(đomainAPIFB + getListPage + token, false, true);
    return res;
}

async function PostFacebook(id, token, idPad) {
    const res = await Utils.post_apiFacebook(đomainAPIFB + id + '/feed?link=' + linkbaiviet + idPad + '&access_token=' + token, false, true, "POST");
    return res;
}

async function getInformationFB(userID, val, token) {
    const res = await Utils.get_apiFacebook(đomainAPIFB + userID + `?fields=${val}&access_token=` + token, false, false);
    return res;
}

export {
    GetDataPageFacebook, getInformationFB, PostFacebook
};