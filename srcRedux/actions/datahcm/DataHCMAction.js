import apis from "../../../src/apis";
import { TypeDataHCM } from "../type";
import Utils from "../../../app/Utils";

const SetListProvince = data => ({
    type: TypeDataHCM.SET_LIST_PROVINCE,
    data: data
});

const SaveChotKiemDich = data => ({
    type: TypeDataHCM.SAVE_CHOTKIEMDICH,
    data: data
})

const SaveChotCho = data => ({
    type: TypeDataHCM.SAVE_CHOTCHO,
    data: data
})

const SaveDiemTiem = data => ({
    type: TypeDataHCM.SAVE_DIEMTIEM,
    data: data
})

const SetListPhuThuoc = data => ({
    type: TypeDataHCM.SAVE_LISTPHUTHUOC,
    data: data
});

const SetListTinhHinhSucKhoe = data => ({
    type: TypeDataHCM.SAVE_TINHHINHSUCKHOE,
    data: data
})
const getProvince = (idCap = 1, callback = () => { }) => {
    return async (dispatch, getState) => {
        const res = await apis.ApiHCM.GetListDonVi(idCap);
        Utils.nlog("vao 0[0]", res)
        if (typeof (callback) == 'function') {
            callback();
        }
        if (res.status == 1) {
            dispatch(SetListProvince(res.data))
        } else {

        }
    }
}
const getDanhSachPT = (callback = () => { }) => {
    return async (dispatch, getState) => {
        const { userCD = {} } = getState().auth;
        const { Id, UserID } = userCD;
        const res = await apis.ApiHCM.DanhSachNguoiPhuThuoc(Id || UserID || '');
        Utils.nlog("vao 1[1]", res)
        if (typeof (callback) == 'function') {
            callback();
        }
        if (res.status == 1) {
            dispatch(SetListPhuThuoc(res.data))
        } else {

        }
    }
}

const get_GetList_List_TinhHinhSucKhoe = (callback = () => { }) => {
    return async (dispatch, getState) => {
        const res = await apis.ApiQLTaiDiemTiem.List_TinhHinhSucKhoe();
        Utils.nlog("vao 0[0]", res)
        if (typeof (callback) == 'function') {
            callback();
        }
        if (res.status == 1) {
            dispatch(SetListTinhHinhSucKhoe(res.data))
        } else {

        }
    }
}
const ActionHCM = {
    SetListProvince,
    getProvince,
    SaveChotKiemDich,
    getDanhSachPT,
    SaveDiemTiem,
    get_GetList_List_TinhHinhSucKhoe,
    SaveChotCho
}
export default ActionHCM