import * as ActionTypes from '../actions/type';
import { produce } from 'immer';
import Utils from '../../app/Utils';

export const initialStateThongBao = {
    //Cong dong
    isRefresh: true,
    dataNotification: [],
    Page: 1,
    AllPage: 1,
    tongSoThongBaoCongDong: 0,
    //Can Bo
    dataNotificationCanBo: [],
    isRefreshCanBo: true,
    tongSoThongBaoCanBo: 0,
    pageChuyenMuc: { Page: 1, AllPage: 1, Size: 10, Total: 0 },
    dataChuyenMuc: [],
    isReshingChuyenMuc: true,
    //Dịch vụ Công
    dataNotiDVC: [],
    pageDVC: { Page: 1, AllPage: 1, Size: 10, Total: 0 },
    isRefreshDVC: true
};

function ThongBaoReducer(state = initialStateThongBao, action) {
    return produce(state, draft => {
        switch (action.type) {
            case ActionTypes.TypeNotification.SET_REFRESHING: {
                draft.isRefresh = action.data
                break;
            }
            case ActionTypes.TypeNotification.GET_THONGBAO_CONGDONG: {
                let { status, data = [], page } = action.data
                if (status == 1 && data) {
                    draft.Page = page.Page
                    draft.AllPage = page.AllPage
                    draft.isRefresh = false
                    draft.dataNotification = data
                } else {
                    draft.Page = 1
                    draft.AllPage = 1
                    draft.isRefresh = false
                    draft.dataNotification = []
                }
                break;
            }
            case ActionTypes.TypeNotification.LOADMORE_THONGBAO_CONGDONG: {
                let { status, data = [], page } = action.data
                if (status == 1 && data) {
                    draft.Page = page.Page
                    draft.AllPage = page.AllPage
                    draft.isRefresh = false
                    draft.dataNotification = state.dataNotification.concat(data)
                }
                break;
            }
            case ActionTypes.TypeNotification.DELETE_THONGBAO_CONGDONG: {
                draft.dataNotification = state.dataNotification.filter(item => item.IdNotify != action.data)
                break;
            }
            case ActionTypes.TypeNotification.SEEN_THONGBAO_CONGDONG: {
                draft.dataNotification = state.dataNotification.map(item => {
                    if (item.IdNotify == action.data) {
                        return {
                            ...item,
                            IsSeen: true
                        }
                    } else {
                        return {
                            ...item
                        }
                    }
                })
                break;
            }
            case ActionTypes.TypeNotification.SET_REFRESHING_CANBO: {
                draft.isRefreshCanBo = action.data
                break;
            }
            case ActionTypes.TypeNotification.GET_THONGBAO_CANBO: {
                let { status, data } = action.data
                if (status == 1 && data) {
                    draft.isRefreshCanBo = false
                    draft.dataNotificationCanBo = data.LstThongBao
                    draft.tongSoThongBaoCanBo = data.TongSoThongBao
                } else {
                    draft.isRefreshCanBo = false
                    draft.dataNotificationCanBo = []
                    draft.tongSoThongBaoCanBo = 0
                }
                break;
            }
            case ActionTypes.TypeNotification.GET_CHUYENMUC: {
                let { status, data = [], page } = action.data
                if (status == 1 && data) {
                    draft.pageChuyenMuc = page
                    draft.isReshingChuyenMuc = false
                    draft.dataChuyenMuc = data
                } else {
                    draft.pageChuyenMuc = { Page: 1, AllPage: 1, Size: 10, Total: 0 }
                    draft.isReshingChuyenMuc = false
                    draft.dataChuyenMuc = []
                }
                break;
            }
            case ActionTypes.TypeNotification.LOADMORE_CHUYENMUC: {
                let { status, data = [], page } = action.data
                if (status == 1 && data) {
                    draft.pageChuyenMuc = page
                    draft.isRefresh = false
                    draft.dataChuyenMuc = state.dataChuyenMuc.concat(data)
                }
                break;
            }
            case ActionTypes.TypeNotification.RECEIVE_NOTIFYCATION: {
                let itemChuyenMuc = action.data
                draft.dataChuyenMuc = state.dataChuyenMuc.map(item => {
                    if (item.IdChuyenMuc == itemChuyenMuc.IdChuyenMuc) {
                        return {
                            ...item,
                            Notify: true
                        }
                    } else {
                        return {
                            ...item
                        }
                    }
                })
                break;
            }
            case ActionTypes.TypeNotification.UNRECEIVE_NOTIFYCATION: {
                let itemChuyenMuc = action.data
                draft.dataChuyenMuc = state.dataChuyenMuc.map(item => {
                    if (item.IdChuyenMuc == itemChuyenMuc.IdChuyenMuc) {
                        return {
                            ...item,
                            Notify: false
                        }
                    } else {
                        return {
                            ...item
                        }
                    }
                })
                break;
            }
            case ActionTypes.TypeNotification.SET_LISTNOTI_DVC: {
                let { status, data = [], page } = action.data
                if (status == 1 && data) {
                    draft.pageDVC = page
                    draft.isRefreshDVC = false
                    draft.dataNotiDVC = data
                } else {
                    draft.pageDVC = { Page: 1, AllPage: 1, Size: 10, Total: 0 }
                    draft.isRefreshDVC = false
                    draft.dataNotiDVC = []
                }
                break;
            }
            case ActionTypes.TypeNotification.LOADMORE_NOTI_DVC: {
                let { status, data = [], page } = action.data
                if (status == 1 && data) {
                    draft.pageDVC = page
                    draft.isRefreshDVC = false
                    draft.dataNotiDVC = state.dataNotiDVC.concat(data)
                }
                break;
            }
            case ActionTypes.TypeNotification.GET_ALL_THONGBAO_CD: {
                let { status, data = [], page } = action.data
                if (status == 1 && data) {
                    let dem = 0
                    data.forEach(element => {
                        if (element.IsSeen == false) {
                            dem++
                        }
                    });
                    draft.tongSoThongBaoCongDong = dem
                } else {
                    draft.tongSoThongBaoCongDong = 0
                }
                break;
            }
        }
    })
}

export default ThongBaoReducer;
