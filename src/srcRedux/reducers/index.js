import { combineReducers } from 'redux';
import { set_location, setLogin } from './setData';
import CaNhanReducer from './CaNhanReducer';
const ReducerNguoiDan = {
  setlogin: setLogin,
  CaNhanReducer: CaNhanReducer
}
export default ReducerNguoiDan