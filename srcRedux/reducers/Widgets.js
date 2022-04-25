import * as ActionTypes from '../actions/type';
import { produce } from 'immer';
import { DEFINE_TRANGTHAIHIENTHI, KEY_ACTION_DANGTIN } from '../../src/Widgets/CommonWidgets';


export const initStateWidgets = {
    dataTaoSuaTinRaoVat: {},

    //Tin rao vat ca nhan
    LstRaoVatCaNhan: [],
    RefreshingRaoVatCaNhan: true,
    PageRaoVatCaNhan: { Page: 1, AllPage: 1 },

    //Tin rao vat chung
    LstTinRaoVat: [],
    RefreshingTinRaoVat: true,
    PageTinRaoVat: { Page: 1, AllPage: 1 },

    //Tin rao vat da luu
    LstTinRaoVatDaLuu: [],
    RefreshingTinRaoVatDaLuu: true,
    PageTinRaoVatDaLuu: { Page: 1, AllPage: 1 },

    //key tim kiem gan day
    LstTimKiemGanDay: [],

    //Tin thue nha ca nhan
    dataTaoSuaTinThueNha: {},
    LstTinThueNhaCaNhan: [],
    RefreshingTinThueNhaCaNhan: true,
    PageTinThueNhaCaNhan: { Page: 1, AllPage: 1 },

    //Tin thue nhà
    LstTinThueNha: [],
    RefreshingTinThueNha: true,
    PageTinThueNha: { Page: 1, AllPage: 1 },

     //key tim kiem gan day thue nha
    LstTimKiemGanDayThueNha: [],
}

function WidgetsReducer(state = initStateWidgets, action) {
    return produce(state, draft => {
        switch (action.type) {
            case ActionTypes.TypeWidget.SET_DATA_TAO_SUA_TINRAOVAT:
                draft.dataTaoSuaTinRaoVat = action.data
                break;
            //Rao vat ca nhan
            case ActionTypes.TypeWidget.SET_REFRESHING_RAOVATCANHAN: {
                draft.RefreshingRaoVatCaNhan = action.data
                break;
            }
            case ActionTypes.TypeWidget.SET_PAGE_RAOVATCANHAN: {
                draft.PageRaoVatCaNhan = action.data
                break;
            }
            case ActionTypes.TypeWidget.SET_DATA_RAOVATCANHAN: {
                draft.LstRaoVatCaNhan = action.data
                break;
            }
            case ActionTypes.TypeWidget.DELETE_TINRAOVAT_CANHAN: {
                draft.LstRaoVatCaNhan = state.LstRaoVatCaNhan.filter(e => e?.IdTinRaoVat != action.data?.IdTinRaoVat)
                break;
            }
            case ActionTypes.TypeWidget.SET_TRANGTHAIHIENTHI_ITEM: {
                switch (action.data.keyAction) {
                    case KEY_ACTION_DANGTIN.HIENTHI:
                        draft.LstRaoVatCaNhan = state.LstRaoVatCaNhan.map(e => {
                            if (e.IdTinRaoVat == action.data.item.IdTinRaoVat) {
                                return { ...e, TrangThaiHienThi: DEFINE_TRANGTHAIHIENTHI.HIENTHI }
                            } else {
                                return { ...e }
                            }
                        })
                        break;
                    case KEY_ACTION_DANGTIN.ANTIN:
                        draft.LstRaoVatCaNhan = state.LstRaoVatCaNhan.map(e => {
                            if (e.IdTinRaoVat == action.data.item.IdTinRaoVat) {
                                return { ...e, TrangThaiHienThi: DEFINE_TRANGTHAIHIENTHI.AN }
                            } else {
                                return { ...e }
                            }
                        })
                        draft.LstTinRaoVat = state.LstTinRaoVat.filter(e => e.IdTinRaoVat !== action.data.item.IdTinRaoVat)
                        draft.LstTinRaoVatDaLuu = state.LstTinRaoVatDaLuu.filter(e => e.IdTinRaoVat !== action.data.item.IdTinRaoVat)
                        break;
                    case KEY_ACTION_DANGTIN.HETHANG:
                        draft.LstRaoVatCaNhan = state.LstRaoVatCaNhan.map(e => {
                            if (e.IdTinRaoVat == action.data.item.IdTinRaoVat) {
                                return { ...e, TrangThaiHienThi: DEFINE_TRANGTHAIHIENTHI.HETHANG }
                            } else {
                                return { ...e }
                            }
                        })
                        draft.LstTinRaoVat = state.LstTinRaoVat.map(e => {
                            if (e.IdTinRaoVat == action.data.item.IdTinRaoVat) {
                                return { ...e, TrangThaiHienThi: DEFINE_TRANGTHAIHIENTHI.HETHANG }
                            } else {
                                return { ...e }
                            }
                        })
                        draft.LstTinRaoVatDaLuu = state.LstTinRaoVatDaLuu.map(e => {
                            if (e.IdTinRaoVat == action.data.item.IdTinRaoVat) {
                                return { ...e, TrangThaiHienThi: DEFINE_TRANGTHAIHIENTHI.HETHANG }
                            } else {
                                return { ...e }
                            }
                        })
                        break;
                    default:
                        break;
                }

            }
                break;
            case ActionTypes.TypeWidget.SET_TRANGTHAITIN_ITEM:
                {
                    draft.LstRaoVatCaNhan = state.LstRaoVatCaNhan.map(e => {
                        if (e.IdTinRaoVat == action.data.IdTinRaoVat) {
                            return { ...e, TrangThaiTin: !e?.TrangThaiTin }
                        } else {
                            return { ...e }
                        }
                    })
                }
                break;

            //Tin rao vat chung
            case ActionTypes.TypeWidget.SET_REFRESHING_TINRAOVAT: {
                draft.RefreshingTinRaoVat = action.data
                break;
            }
            case ActionTypes.TypeWidget.SET_PAGE_TINRAOVAT: {
                draft.PageTinRaoVat = action.data
                break;
            }
            case ActionTypes.TypeWidget.SET_DATA_TINRAOVAT: {
                draft.LstTinRaoVat = action.data
                break;
            }
            case ActionTypes.TypeWidget.SET_LIKE_UNLIKE_TINRAOVAT: {
                draft.LstTinRaoVat = state.LstTinRaoVat.map(e => {
                    if (e.IdTinRaoVat == action.data?.IdTinRaoVat) {
                        return { ...e, DaLuu: !e?.DaLuu }
                    } else {
                        return { ...e }
                    }
                })
                break;
            }

            //Tin rao vat da luu
            case ActionTypes.TypeWidget.SET_REFRESHING_TINRAOVAT_DALUU: {
                draft.RefreshingTinRaoVatDaLuu = action.data
                break;
            }
            case ActionTypes.TypeWidget.SET_PAGE_TINRAOVAT_DALUU: {
                draft.PageTinRaoVatDaLuu = action.data
                break;
            }
            case ActionTypes.TypeWidget.SET_DATA_TINRAOVAT_DALUU: {
                draft.LstTinRaoVatDaLuu = action.data
                break;
            }
            case ActionTypes.TypeWidget.SET_LIKE_UNLIKE_TINRAOVAT_DALUU: {
                draft.LstTinRaoVatDaLuu = state.LstTinRaoVatDaLuu.filter(e => e?.IdTinRaoVat != action.data?.IdTinRaoVat)
                break;
            }

            //Tim kiem gan day
            case ActionTypes.TypeWidget.SAVE_KEY_TIMKIEM: {
                draft.LstTimKiemGanDay = [...state.LstTimKiemGanDay, action.data]
                break;
            }
            case ActionTypes.TypeWidget.DELETE_KEY_TIMKIEM: {
                draft.LstTimKiemGanDay = state.LstTimKiemGanDay.filter(e => e != action.data)
                break;
            }

            case ActionTypes.TypeWidget.SET_DATA_TAO_SUA_TINTHUENHA:
                draft.dataTaoSuaTinThueNha = action.data
                break;
            //Tin thue nha ca nhan
            case ActionTypes.TypeWidget.SET_REFRESHING_TINTHUENHACANHAN: {
                draft.RefreshingTinThueNhaCaNhan = action.data
                break;
            }
            case ActionTypes.TypeWidget.SET_PAGE_TINTHUENHACANHAN: {
                draft.PageTinThueNhaCaNhan = action.data
                break;
            }
            case ActionTypes.TypeWidget.SET_DATA_TINTHUENHACANHAN: {
                draft.LstTinThueNhaCaNhan = action.data
                break;
            }
            case ActionTypes.TypeWidget.DELETE_TINTHUENHACANHAN: {
                draft.LstTinThueNhaCaNhan = state.LstTinThueNhaCaNhan.filter(e => e?.Id != action.data?.Id)
                break;
            }
            case ActionTypes.TypeWidget.SET_TRANGTHAITINTHUENHA: {
                draft.LstTinThueNhaCaNhan = state.LstTinThueNhaCaNhan.map(e => {
                    if (e?.Id == action.data?.item?.Id) {
                        return { ...e, IsHienThi: action.data.show }
                    } else {
                        return { ...e }
                    }
                })
                break;
            }

            //Tin thuê nhà
            case ActionTypes.TypeWidget.SET_REFRESHING_TINTHUENHA: {
                draft.RefreshingTinThueNha = action.data
                break;
            }
            case ActionTypes.TypeWidget.SET_PAGE_TINTHUENHA: {
                draft.PageTinThueNha = action.data
                break;
            }
            case ActionTypes.TypeWidget.SET_DATA_TINTHUENHA: {
                draft.LstTinThueNha = action.data
                break;
            }
            case ActionTypes.TypeWidget.SET_LIKE_UNLIKE_TINTHUENHA: {
                draft.LstTinThueNha = state.LstTinThueNha.map(e => {
                    if (e.Id == action.data?.Id) {
                        return { ...e, TheoDoi: !e?.TheoDoi }
                    } else {
                        return { ...e }
                    }
                })
                break;
            }

             //Tim kiem gan day thue nha
             case ActionTypes.TypeWidget.SAVE_KEY_TIMKIEM_THUENHA: {
                draft.LstTimKiemGanDayThueNha = [...state.LstTimKiemGanDayThueNha, action.data]
                break;
            }
            case ActionTypes.TypeWidget.DELETE_KEY_TIMKIEM_THUENHA: {
                draft.LstTimKiemGanDayThueNha = state.LstTimKiemGanDayThueNha.filter(e => e != action.data)
                break;
            }
        }
    })
}

export default WidgetsReducer