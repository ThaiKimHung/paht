import * as ActionTypes from '../actions/type';
import { produce } from 'immer';
import AppCodeConfig from '../../app/AppCodeConfig';
import { appConfig } from '../../app/Config';
import { objectMenuGlobal, menuDichBenh } from '../../app/data/dataGlobal';
import Utils from '../../app/Utils';

export const initialStateDataHCM = {
    listProvine: [],
    listPhuThuoc: [],

    //Admin
    ChotKiemDich: {},
    DiemTiem: {},
    TinhHinhSucKhoe: [],
    ChotCho: {},
};
function DataHCMReducer(state = initialStateDataHCM, action) {
    return produce(state, draft => {
        switch (action.type) {
            case ActionTypes.TypeDataHCM.SET_LIST_PROVINCE: {
                draft.listProvine = action.data;
                break;
            }
            case ActionTypes.TypeDataHCM.SAVE_CHOTKIEMDICH: {
                draft.ChotKiemDich = action.data;
                break;
            }
            case ActionTypes.TypeDataHCM.SAVE_LISTPHUTHUOC: {
                draft.listPhuThuoc = action.data;
                break;
            }
            case ActionTypes.TypeDataHCM.SAVE_DIEMTIEM: {
                draft.DiemTiem = action.data;
                break;
            }
            case ActionTypes.TypeDataHCM.SAVE_TINHHINHSUCKHOE: {
                draft.TinhHinhSucKhoe = action?.data && action?.data.length > 0 ? action.data : [];
                break;
            }
            case ActionTypes.TypeDataHCM.SAVE_CHOTCHO: {
                draft.ChotCho = action.data;
                break;
            }
            default:
                return state
                break;
        }
    })
}

export default DataHCMReducer;
