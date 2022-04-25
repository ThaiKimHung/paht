import {
    SETLOGIN, SET_LISTLINGVUC
} from './type';
export const setListLVFilter = (val) => ({ type: SET_LISTLINGVUC, data: val });
const ActionNguoiDan = {
    setListLVFilter: setListLVFilter

}

export default ActionNguoiDan



