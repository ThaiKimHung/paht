import { combineReducers } from 'redux';
import { IDvcReducer, IState } from '../../Interface/DichVuCong';

const KEY = {
    'TONGSOLIEU': '@DVC_TONGSOLIEU',
    "HOSOTON": "@DVC_HOSOTON",
    "HOSOQUAHAN": "@DVC_HOSOQUAHAN",
    "CHUAGIAIQUYET": "@DVC_CHUAGIAIQUYET",
    "DAGIAIQUYET": "@DVC_DAGIAIQUYET",
    "DATRA": "@DVC_DATRA",
    "TUONGQUANDAGQCHUAGQ": "@DVC_TUONGQUANDAGQCHUAGQ",
    "TONGHOSOTIEPNHAN": "@DVC_TONGHOSOTIEPNHAN",
    "TIEPNHANTHEOMUCDO": "@DVC_TIEPNHANTHEOMUCDO",
    "MUCDO34TRUCTUYEN": "@DVC_MUCDO34TRUCTUYEN"
};

export const Type = {
    TONGSOLIEU: {
        'LOADING': `${KEY.TONGSOLIEU}_LOADING`,
        'IS_ERROR': `${KEY.TONGSOLIEU}_ERROR`,
        'DATA': `${KEY.TONGSOLIEU}_DATA`,
        'IS_EMPTY': `${KEY.TONGSOLIEU}_IS_EMPTY`,
    },
    HOSOTON: {
        "LOADING": `${KEY.HOSOTON}_LOADING`,
        "IS_ERROR": `${KEY.HOSOTON}_ERROR`,
        "DATA": `${KEY.HOSOTON}_DATA`,
        "IS_EMPTY": `${KEY.HOSOTON}_IS_EMPTY`,
        "DATA_DETAIL": `${KEY.HOSOTON}_DATA_DETAIL`,
    },
    HOSOQUAHAN: {
        "LOADING": `${KEY.HOSOQUAHAN}_LOADING`,
        "IS_ERROR": `${KEY.HOSOQUAHAN}_ERROR`,
        "DATA": `${KEY.HOSOQUAHAN}_DATA`,
        "IS_EMPTY": `${KEY.HOSOQUAHAN}_IS_EMPTY`,
        "DATA_DETAIL": `${KEY.HOSOQUAHAN}_DATA_DETAIL`,
    },
    CHUAGIAIQUYET: {
        "LOADING": `${KEY.CHUAGIAIQUYET}_LOADING`,
        "IS_ERROR": `${KEY.CHUAGIAIQUYET}_ERROR`,
        "DATA": `${KEY.CHUAGIAIQUYET}_DATA`,
        "IS_EMPTY": `${KEY.CHUAGIAIQUYET}_IS_EMPTY`,
        "DATA_DETAIL": `${KEY.CHUAGIAIQUYET}_DATA_DETAIL`,
    },
    DAGIAIQUYET: {
        "LOADING": `${KEY.DAGIAIQUYET}_LOADING`,
        "IS_ERROR": `${KEY.DAGIAIQUYET}_ERROR`,
        "DATA": `${KEY.DAGIAIQUYET}_DATA`,
        "IS_EMPTY": `${KEY.DAGIAIQUYET}_IS_EMPTY`,
        "DATA_DETAIL": `${KEY.DAGIAIQUYET}_DATA_DETAIL`,
    },
    DATRA: {
        "LOADING": `${KEY.DATRA}_LOADING`,
        "IS_ERROR": `${KEY.DATRA}_ERROR`,
        "DATA": `${KEY.DATRA}_DATA`,
        "IS_EMPTY": `${KEY.DATRA}_IS_EMPTY`,
        "DATA_DETAIL": `${KEY.DATRA}_DATA_DETAIL`
    },
    TUONGQUANDAGQCHUAGQ: {
        "LOADING": `${KEY.TUONGQUANDAGQCHUAGQ}_LOADING`,
        "IS_ERROR": `${KEY.TUONGQUANDAGQCHUAGQ}_ERROR`,
        "DATA": `${KEY.TUONGQUANDAGQCHUAGQ}_DATA`,
        "IS_EMPTY": `${KEY.TUONGQUANDAGQCHUAGQ}_IS_EMPTY`,
        "DATA_DETAIL": `${KEY.TUONGQUANDAGQCHUAGQ}_DATA_DETAIL`
    },
    TONGHOSOTIEPNHAN: {
        "LOADING": `${KEY.TONGHOSOTIEPNHAN}_LOADING`,
        "IS_ERROR": `${KEY.TONGHOSOTIEPNHAN}_ERROR`,
        "DATA": `${KEY.TONGHOSOTIEPNHAN}_DATA`,
        "IS_EMPTY": `${KEY.TONGHOSOTIEPNHAN}_IS_EMPTY`,
        "DATA_DETAIL": `${KEY.TONGHOSOTIEPNHAN}_DATA_DETAIL`
    },
    TIEPNHANTHEOMUCDO: {
        "LOADING": `${KEY.TIEPNHANTHEOMUCDO}_LOADING`,
        "IS_ERROR": `${KEY.TIEPNHANTHEOMUCDO}_ERROR`,
        "DATA": `${KEY.TIEPNHANTHEOMUCDO}_DATA`,
        "IS_EMPTY": `${KEY.TIEPNHANTHEOMUCDO}_IS_EMPTY`,
        "DATA_DETAIL": `${KEY.TIEPNHANTHEOMUCDO}_DATA_DETAIL`
    },
    MUCDO34TRUCTUYEN: {
        "LOADING": `${KEY.MUCDO34TRUCTUYEN}_LOADING`,
        "IS_ERROR": `${KEY.MUCDO34TRUCTUYEN}_ERROR`,
        "DATA": `${KEY.MUCDO34TRUCTUYEN}_DATA`,
        "IS_EMPTY": `${KEY.MUCDO34TRUCTUYEN}_IS_EMPTY`,
        "DATA_DETAIL": `${KEY.MUCDO34TRUCTUYEN}_DATA_DETAIL`
    },
};

const initState: IState = {
    data: [],
    isLoading: true,
    isError: false,
    isEmpty: false,
    dataDetail: []
}

const TongSoLieuReducer = (state: IState = { ...initState, data: {} }, { type, value }) => {
    switch (type) {
        case Type.TONGSOLIEU.LOADING:
            return { ...state, isLoading: value }
        case Type.TONGSOLIEU.IS_ERROR:
            return { ...state, isError: value }
        case Type.TONGSOLIEU.DATA:
            return { ...state, data: value }
        case Type.TONGSOLIEU.IS_EMPTY:
            return { ...state, isEmpty: value }
        default:
            return state;
    }
};


const HoSoTonReducer = (state: IState = initState, { type, value }) => {
    switch (type) {
        case Type.HOSOTON.LOADING:
            return { ...state, isLoading: value }
        case Type.HOSOTON.IS_ERROR:
            return { ...state, isError: value }
        case Type.HOSOTON.DATA:
            return { ...state, data: value }
        case Type.HOSOTON.IS_EMPTY:
            return { ...state, isEmpty: value }
        case Type.HOSOTON.DATA_DETAIL:
            return { ...state, dataDetail: value }
        default:
            return state;
    }
};

const HoSoQuaHanReducer = (state: IState = initState, { type, value }) => {
    switch (type) {
        case Type.HOSOQUAHAN.LOADING:
            return { ...state, isLoading: value }
        case Type.HOSOQUAHAN.IS_ERROR:
            return { ...state, isError: value }
        case Type.HOSOQUAHAN.DATA:
            return { ...state, data: value }
        case Type.HOSOQUAHAN.IS_EMPTY:
            return { ...state, isEmpty: value }
        case Type.HOSOQUAHAN.DATA_DETAIL:
            return { ...state, dataDetail: value }
        default:
            return state;
    }
};


const HoSoChuaGiaiQuyetReducer = (state: IState = initState, { type, value }) => {
    switch (type) {
        case Type.CHUAGIAIQUYET.LOADING:
            return { ...state, isLoading: value }
        case Type.CHUAGIAIQUYET.IS_ERROR:
            return { ...state, isError: value }
        case Type.CHUAGIAIQUYET.DATA:
            return { ...state, data: value }
        case Type.CHUAGIAIQUYET.IS_EMPTY:
            return { ...state, isEmpty: value }
        case Type.CHUAGIAIQUYET.DATA_DETAIL:
            return { ...state, dataDetail: value }
        default:
            return state;
    }
};


const HoSoDaGiaiQuyetReducer = (state: IState = initState, { type, value }) => {
    switch (type) {
        case Type.DAGIAIQUYET.LOADING:
            return { ...state, isLoading: value }
        case Type.DAGIAIQUYET.IS_ERROR:
            return { ...state, isError: value }
        case Type.DAGIAIQUYET.DATA:
            return { ...state, data: value }
        case Type.DAGIAIQUYET.IS_EMPTY:
            return { ...state, isEmpty: value }
        case Type.DAGIAIQUYET.DATA_DETAIL:
            return { ...state, dataDetail: value }
        default:
            return state;
    }
};


const HoSoDaTraReducer = (state: IState = initState, { type, value }) => {
    switch (type) {
        case Type.DATRA.LOADING:
            return { ...state, isLoading: value }
        case Type.DATRA.IS_ERROR:
            return { ...state, isError: value }
        case Type.DATRA.DATA:
            return { ...state, data: value }
        case Type.DATRA.IS_EMPTY:
            return { ...state, isEmpty: value }
        case Type.DATRA.DATA_DETAIL:
            return { ...state, dataDetail: value }
        default:
            return state;
    }
};

const TuongQuanDaGQChuaGQReducer = (state: IState = initState, { type, value }) => {
    switch (type) {
        case Type.TUONGQUANDAGQCHUAGQ.LOADING:
            return { ...state, isLoading: value }
        case Type.TUONGQUANDAGQCHUAGQ.IS_ERROR:
            return { ...state, isError: value }
        case Type.TUONGQUANDAGQCHUAGQ.DATA:
            return { ...state, data: value }
        case Type.TUONGQUANDAGQCHUAGQ.IS_EMPTY:
            return { ...state, isEmpty: value }
        case Type.TUONGQUANDAGQCHUAGQ.DATA_DETAIL:
            return { ...state, dataDetail: value }
        default:
            return state;
    }
};

const TongHoSoTiepNhanReducer = (state: IState = initState, { type, value }) => {
    switch (type) {
        case Type.TONGHOSOTIEPNHAN.LOADING:
            return { ...state, isLoading: value }
        case Type.TONGHOSOTIEPNHAN.IS_ERROR:
            return { ...state, isError: value }
        case Type.TONGHOSOTIEPNHAN.DATA:
            return { ...state, data: value }
        case Type.TONGHOSOTIEPNHAN.IS_EMPTY:
            return { ...state, isEmpty: value }
        case Type.TONGHOSOTIEPNHAN.DATA_DETAIL:
            return { ...state, dataDetail: value }
        default:
            return state;
    }
};

const TiepNhanTheoMucDoReducer = (state: IState = initState, { type, value }) => {
    switch (type) {
        case Type.TIEPNHANTHEOMUCDO.LOADING:
            return { ...state, isLoading: value }
        case Type.TIEPNHANTHEOMUCDO.IS_ERROR:
            return { ...state, isError: value }
        case Type.TIEPNHANTHEOMUCDO.DATA:
            return { ...state, data: value }
        case Type.TIEPNHANTHEOMUCDO.IS_EMPTY:
            return { ...state, isEmpty: value }
        case Type.TIEPNHANTHEOMUCDO.DATA_DETAIL:
            return { ...state, dataDetail: value }
        default:
            return state;
    }
};

const MucDo34TrucTuyenReducer = (state: IState = initState, { type, value }) => {
    switch (type) {
        case Type.MUCDO34TRUCTUYEN.LOADING:
            return { ...state, isLoading: value }
        case Type.MUCDO34TRUCTUYEN.IS_ERROR:
            return { ...state, isError: value }
        case Type.MUCDO34TRUCTUYEN.DATA:
            return { ...state, data: value }
        case Type.MUCDO34TRUCTUYEN.IS_EMPTY:
            return { ...state, isEmpty: value }
        case Type.MUCDO34TRUCTUYEN.DATA_DETAIL:
            return { ...state, dataDetail: value }
        default:
            return state;
    }
};

// const Reducer: IDvcReducer = {
//     TongSoLieu: TongSoLieuReducer,
//     HoSoTon: HoSoTonReducer,
//     HoSoQuaHan: HoSoQuaHanReducer,
//     ChuaGiaiQuyet: HoSoChuaGiaiQuyetReducer,
//     DaGiaiQuyet: HoSoDaGiaiQuyetReducer,
//     DaTra: HoSoDaTraReducer,
//     TuongQuanDaGQChuaGQ: TuongQuanDaGQChuaGQReducer,
//     TongHoSoTiepNhan: TongHoSoTiepNhanReducer,
//     TiepNhanTheoMucDo: TiepNhanTheoMucDoReducer,
//     MucDo34TrucTuyen: MucDo34TrucTuyenReducer
// }
const DichVuCongReducer = {
    TongSoLieu: TongSoLieuReducer,
    HoSoTon: HoSoTonReducer,
    HoSoQuaHan: HoSoQuaHanReducer,
    ChuaGiaiQuyet: HoSoChuaGiaiQuyetReducer,
    DaGiaiQuyet: HoSoDaGiaiQuyetReducer,
    DaTra: HoSoDaTraReducer,
    TuongQuanDaGQChuaGQ: TuongQuanDaGQChuaGQReducer,
    TongHoSoTiepNhan: TongHoSoTiepNhanReducer,
    TiepNhanTheoMucDo: TiepNhanTheoMucDoReducer,
    MucDo34TrucTuyen: MucDo34TrucTuyenReducer
}

export default DichVuCongReducer;
