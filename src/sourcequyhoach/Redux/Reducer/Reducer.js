import { combineReducers } from 'redux';
import setup from '../../Containers/setup';
import Type from '../Type';
import MapViewReducer from './MapView';
import PanelInfoReducer from './PanelInfo';
import HienTrangReducer from './HienTrang';
import QuyHoachReducer from './QuyHoach';
import PanelQuyHoachReducer from './PanelQuyHoach';

const initLocalPickupState = {
    isShowing: true,
    listHuyen: [],
    listXa: [],
    xaSelected: '',
    huyenSelected: setup.huyenSelected,
    statusCode: 200,
    mode: 'huyen',
};

const initSearchState = {
    searchText: '',
    placeholder: 'Nhập tên chủ sở hữu',
    isSearchByName: true,
    areaSelected: 'Chưa chọn xã/phường',
    isResultShowOn: false,
};

const TokenSignIn = (state = '', action) => {
    if (action.type === 'SET_TOKEN') {
        return action.token;
    }
    return state;
};

const Userinfo = (state = '', action) => {
    if (action.type === 'SET_USER_INFO') {
        return action.userInfo;
    }
    return state;
};

const LocalPickup = (state = initLocalPickupState, action) => {
    if (action.type === 'SET_LOCAL_PICKUP') {
        return action.state;
    }
    return state;
};

const Search = (state = initSearchState, action) => {
    if (action.type === 'SET_SEARCH') {
        return action.state;
    }
    return state;
};

const SearchResult = (state = [], action) => {
    if (action.type === 'SET_SEARCH_RESULT') {
        return action.state;
    }
    return state;
};

const ShowThuaDat = (state = true, { type }) => {
    if (type === Type.SHOW_THUA_DAT) {
        return !state;
    }
    return state;
};


const ReducerQuyhoach = {
    userInfo: Userinfo,
    localPickup: LocalPickup,
    search: Search,
    result: SearchResult,
    token: TokenSignIn,
    showThuaDat: ShowThuaDat,
    mapView: MapViewReducer,
    panelInfo: PanelInfoReducer,
    hienTrang: HienTrangReducer,
    quyHoach: QuyHoachReducer,
    panelQuyHoach: PanelQuyHoachReducer
}
export default ReducerQuyhoach
