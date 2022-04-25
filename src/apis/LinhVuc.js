// api / linhvuc / GetList_LinhVuc ? more = true
import Utils from '../../app/Utils';
const PREFIX = 'api/linhvuc/';

async function GetList_LinhVuc() {
    const res = await Utils.get_api(PREFIX + 'GetList_LinhVuc?more=true', false);
    return res;
}
export {
    GetList_LinhVuc
};