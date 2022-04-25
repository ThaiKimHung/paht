import Utils from '../../app/Utils';
const PREFIX = 'api/viettelid/';

async function loginViettelID(valToken) {
    let strBody = JSON.stringify({
        AccessToken: valToken
    });
    let res = await Utils.post_api(PREFIX + 'ViettelIDLogin', strBody, false, false);
    return res;
}

export {
    loginViettelID
}