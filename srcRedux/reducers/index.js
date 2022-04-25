
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import { View, Text, Platform } from 'react-native'
import AuthReducer, { initialStateAuth } from './Auth';
import DataSVLReducer, { initialStateDataSVL } from './DataSVL';

import AsyncStorage from '@react-native-community/async-storage';
import RootReducerChat from '../../chat/redux/reducer';
import * as ActionTypes from '../actions/type'
import ThemeReducer, { initialStateTheme } from '../reducers/Theme'
import ThongBaoReducer, { initialStateThongBao } from '../reducers/Notification'
// import ReducerQuyhoach from '../../sourcequyhoach/Redux/Reducer/Reducer';
// import ReducerIOC from '../../sourceIOC/Redux/Reducer/Reducer';
import {
  setLanguage,
  GetList_LinhVuc,
  GetList_ChuyenMuc,
  GetList_MucDoAll,
  GetList_NguonPhanAnh,
  GetList_DonVi,
  GetList_MucDoAll_NB,
  GetList_DonVi_NB,
  initialStateLag,
} from './setData';
import ReducerNguoiDan from '../../src/srcRedux/reducers';
import CommonReducer, { initialStateCommon } from './Common';
import ReducerQuyhoach from '../../src/sourcequyhoach/Redux/Reducer/Reducer';
import ReducerIOC from '../../src/sourceIOC/Redux/Reducer/Reducer';
import createMigrate from 'redux-persist/es/createMigrate';
import { appConfig } from '../../app/Config';
import DataHCMReducer from './DataHCM';
import WidgetsReducer from './Widgets';

const VER_REDUX = Platform.OS == 'android' ? appConfig.verAndroid : appConfig.verIOS;
const migrations = {
  [VER_REDUX]: (state) => {
    return {
      auth: { ...initialStateAuth, ...state.auth, default: true },
      token: state.token,
      userInfo: state.userInfo,
      theme: { ...initialStateTheme, ...state.theme, default: true },
      common: { ...initialStateCommon, ...state.common, default: true },
      thongbao: { ...initialStateThongBao, ...state.thongbao, default: true },
      language: { ...initialStateLag, ...state.language, default: true }
      // initialStateLag
    }
  },
}
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  version: VER_REDUX,
  migrate: createMigrate(migrations, { debug: false }),
  whitelist: [ //--Bỏ vào đây để lưu AsynStore data Redux
    "userInfo",
    "token",
    'language',
    "common",
    "auth",
    // "ReducerGroupChat",
    "theme",
    "thongbao",
    "datahcm", // khi nào sài mở ra
    "Widgets"
  ], // reducer want to persist goes here (can be more than one) , if not given it wil persist all reducers
  // blacklist: ['dashboard.selectDate',],
};
const rootReducer = combineReducers({
  ...ReducerNguoiDan,
  ...ReducerQuyhoach,
  ...ReducerIOC,
  common: CommonReducer,
  auth: AuthReducer,
  dataSVL: DataSVLReducer,
  language: setLanguage,
  GetList_LinhVuc,
  GetList_ChuyenMuc,
  GetList_NguonPhanAnh,
  GetList_MucDoAll,
  GetList_DonVi,
  ...RootReducerChat,
  theme: ThemeReducer,
  thongbao: ThongBaoReducer,
  datahcm: DataHCMReducer,
  Widgets: WidgetsReducer
});
const AppReducer = (state, action) => {
  if (action.type === ActionTypes.RESET_STORE) {
    state = undefined;
  }
  return rootReducer(state, action)
}
const RootReducer = persistReducer(persistConfig, AppReducer);
export default RootReducer;


