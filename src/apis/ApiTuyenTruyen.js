// 
import Utils from '../../app/Utils';
const PREFIX = 'api/tuyentruyen/';



async function TuyenTruyenFrontend() {
    var val = PREFIX + 'TuyenTruyenFrontend'
    let res = await Utils.get_api(val, false, false);
    return res;
}

export {
    TuyenTruyenFrontend
}