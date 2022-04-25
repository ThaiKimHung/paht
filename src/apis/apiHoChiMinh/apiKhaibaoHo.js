import Utils from '../../../app/Utils';
import AppCodeConfig from '../../../app/AppCodeConfig';

//https://hcm-mini-app-admin-api.vts-paht.com/api/HcmMiniApp/account/DanhSachNguoiKhaiBaoHo?Id=20053
export async function DanhSachNguoiKhaiBaoHo(Id = null) {
    const requestURL = await `api/HcmMiniApp/account/DanhSachNguoiKhaiBaoHo?Id=${Id}`
    let res = await Utils.get_api(requestURL, false, false, false, AppCodeConfig.APP_CONGDAN);
    Utils.nlog('[LOG] API: ', res)
    return res;
}

//https://hcm-mini-app-admin-api.vts-paht.com/api/HcmMiniApp/account/TaoTaiKhoanHo
export async function TaoTaiKhoanHo(body) {
    let strBody = JSON.stringify({
        ...body
    })
    let res = await Utils.post_api('api/HcmMiniApp/account/TaoTaiKhoanHo', strBody, false, false, false, AppCodeConfig.APP_CONGDAN);
    return res;
}

export async function XoaNguoiKhaiBaoHo(id) {
    let res = await Utils.get_api(`api/HcmMiniApp/account/XoaNguoiKhaiBaoHo?Id=${id}`, false, false, false, AppCodeConfig.APP_CONGDAN);
    return res;
}