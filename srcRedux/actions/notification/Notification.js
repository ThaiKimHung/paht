import { Platform } from 'react-native';
import Utils from '../../../app/Utils';
import apis from '../../../src/apis';
import apisAdmin from '../../../srcAdmin/apis'
import * as ActionTypes from '../type';

export const SetThongBaoCongDong = objectThongbao => ({
    type: ActionTypes.TypeNotification.GET_THONGBAO_CONGDONG,
    data: objectThongbao
});

export const SetLoadMoreThongBaoCongDong = objectThongbao => ({
    type: ActionTypes.TypeNotification.LOADMORE_THONGBAO_CONGDONG,
    data: objectThongbao
});

export const SetRefreshing = val => ({
    type: ActionTypes.TypeNotification.SET_REFRESHING,
    data: val
})

export const SetDeleteThongBaoCongDong = val => ({
    type: ActionTypes.TypeNotification.DELETE_THONGBAO_CONGDONG,
    data: val
})

export const SetSeenThongBaoCongDong = val => ({
    type: ActionTypes.TypeNotification.SEEN_THONGBAO_CONGDONG,
    data: val
})

export const SetThongBaoCanBo = objectThongbao => ({
    type: ActionTypes.TypeNotification.GET_THONGBAO_CANBO,
    data: objectThongbao
})

export const SetRefreshingCanBo = val => ({
    type: ActionTypes.TypeNotification.SET_REFRESHING_CANBO,
    data: val
})

//Chuyen muc
export const SetRefreshingChuyenMuc = val => ({
    type: ActionTypes.TypeNotification.SET_REFRESHING_CM,
    data: val
})

export const SetDataChuyenMuc = objectChuyenMuc => ({
    type: ActionTypes.TypeNotification.GET_CHUYENMUC,
    data: objectChuyenMuc
})

export const SetDataLoadMoreChuyenMuc = objectChuyenMuc => ({
    type: ActionTypes.TypeNotification.LOADMORE_CHUYENMUC,
    data: objectChuyenMuc
})

export const SetReceiveNotification = val => ({
    type: ActionTypes.TypeNotification.RECEIVE_NOTIFYCATION,
    data: val
})

export const SetUnReceiveNotification = val => ({
    type: ActionTypes.TypeNotification.UNRECEIVE_NOTIFYCATION,
    data: val
})


export const SetListNotiDvc = objectChuyenMuc => ({
    type: ActionTypes.TypeNotification.SET_LISTNOTI_DVC,
    data: objectChuyenMuc
})

export const SetLoadMoreNotiDvc = objectChuyenMuc => ({
    type: ActionTypes.TypeNotification.LOADMORE_NOTI_DVC,
    data: objectChuyenMuc
})

export const SetRefreshingNotiDvc = val => ({
    type: ActionTypes.TypeNotification.SET_REFRESHING_DVC,
    data: val
})

export const SetAllThongBaoCongDong = val => ({
    type: ActionTypes.TypeNotification.GET_ALL_THONGBAO_CD,
    data: val
})


export const GetThongBaoCongDong = () => {
    return async (dispatch, getState) => {
        dispatch(SetRefreshing(true))
        const res = await apis.ApiPhanAnh.GetList_ThongBaoApp(Platform.OS == 'ios' ? '1' : '0', 1, 10);
        Utils.nlog('res nhan thong bao CD', res)
        dispatch(SetThongBaoCongDong(res))
    }
}

export const GetAllThongBaoCongDong = () => {
    return async (dispatch, getState) => {
        const res = await apis.ApiPhanAnh.GetList_ThongBaoApp(Platform.OS == 'ios' ? '1' : '0', 1, 10, true);
        Utils.nlog('[LOG] res all thong bao CD', res)
        dispatch(SetAllThongBaoCongDong(res))
    }
}

export const LoadMoreThongBaoCongDong = (pageNumber) => {
    return async (dispatch, getState) => {
        const res = await apis.ApiPhanAnh.GetList_ThongBaoApp(Platform.OS == 'ios' ? '1' : '0', pageNumber, 10);
        dispatch(SetLoadMoreThongBaoCongDong(res))
    }
}

export const DeleteThongBaoCongDong = (IdNotify) => {
    return async (dispatch, getState) => {
        const res = await apis.ApiPhanAnh.XoaThongBao([IdNotify]);
        if (res.status == 1) {
            dispatch(SetDeleteThongBaoCongDong(IdNotify))
        } else {
            Utils.showMsgBoxOKTop("Thông báo", "Xoá thất bại", "Xác nhận");
        }

    }
}

export const SeenThongBaoCongDong = (IdNotify) => {
    return async (dispatch, getState) => {
        const res = await apis.ApiPhanAnh.IsSeen(IdNotify);
        dispatch(SetSeenThongBaoCongDong(IdNotify))
        dispatch(GetCountNotification())
    }
}

export const GetThongBaoCanBo = () => {
    return async (dispatch, getState) => {
        dispatch(SetRefreshingCanBo(true))
        const res = await apisAdmin.ThongBao.GetThongBao();
        Utils.nlog('[LOG] res all thong bao Can Bo', res)
        dispatch(SetThongBaoCanBo(res))
    }
}

//Chuyen muc
export const GetDataChuyenMuc = () => {
    return async (dispatch, getState) => {
        dispatch(SetRefreshingChuyenMuc(true))
        const res = await apis.ApiCanhBao.GetList_ChuyenMuc(false, 1, 10);
        Utils.nlog('res chuyen muc', res)
        dispatch(SetDataChuyenMuc(res))
    }
}

export const LoadMoreChuyenMuc = (pageNumber) => {
    return async (dispatch, getState) => {
        const res = await apis.ApiCanhBao.GetList_ChuyenMuc(false, pageNumber, 10);
        dispatch(SetDataLoadMoreChuyenMuc(res))
    }
}

export const UpdateNotification = (itemChuyenMuc) => {
    return async (dispatch, getState) => {
        const res = await apis.ApiCanhBao.OnOffNotifyCanhBao(itemChuyenMuc.IdChuyenMuc, !itemChuyenMuc.Notify)
        Utils.nlog('res nhan thong bao', itemChuyenMuc, res)
        if (res.status == 1) {
            if (itemChuyenMuc.Notify) {
                //Set không nhận
                dispatch(SetUnReceiveNotification({ ...itemChuyenMuc, Notify: false }))
            } else {
                //Set nhận
                dispatch(SetReceiveNotification({ ...itemChuyenMuc, Notify: true }))
            }
        } else {
            Utils.showMsgBoxOKTop("Thông báo", "Xảy ra lỗi vui lòng thử lại !", "Xác nhận");
        }


    }
}

export const GetThongBaoDichVuCong = () => {
    return async (dispatch, getState) => {
        let { userDVC } = getState().auth
        Utils.nlog("[LOG] state userDVC", userDVC)
        dispatch(SetRefreshingNotiDvc(true))
        const res = await apis.ApiDVC.GetThongBaoDichVuCong(1, userDVC?.SoDinhDanh);
        dispatch(SetListNotiDvc(res))
    }
}

export const LoadMoreThongBaoDichVuCong = (pageNumber) => {
    return async (dispatch, getState) => {
        let { userDVC } = getState().auth
        Utils.nlog("[LOG]load more state userDVC", userDVC)
        const res = await apis.ApiDVC.GetThongBaoDichVuCong(pageNumber, userDVC?.SoDinhDanh);
        dispatch(SetLoadMoreNotiDvc(res))
    }
}

export const GetCountNotification = () => {
    return async (dispatch, getState) => {
        let auth = getState().auth;
        dispatch(GetThongBaoCanBo())
        dispatch(GetAllThongBaoCongDong())
        dispatch(GetThongBaoCongDong())
    }
}