import Utils from '../../app/Utils';
const PREFIX = 'api/phananhapp/';

async function ListChuyenMucPA() {
    const res = await Utils.get_api(PREFIX + 'GetList_ChuyenMucApp?more=true', false);
    return res;
}
export {
    ListChuyenMucPA
};