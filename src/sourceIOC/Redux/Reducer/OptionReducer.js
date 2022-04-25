import { OptionState } from '../../Interface/Option';
import moment from 'moment';

const KEY = {
    'NAM': '@OPTION_NAM',
    'THANG': '@OPTION_THANG',
    'DONVI': '@OPTION_DONVI',
};

export const Type = {
    "NAM": {
        "LIST": `${KEY.NAM}_LIST`,
        "CHON": `${KEY.NAM}_CHON`
    },
    "THANG": {
        "LIST": `${KEY.THANG}_LIST`,
        "CHON": `${KEY.THANG}_CHON`,
        "CHON_TAT_CA": `${KEY.THANG}_CHON_TAT_CA`,
        "IS_ALL": `${KEY.THANG}_IS_ALL`
    },
    "DONVI": {
        "LIST": `${KEY.DONVI}_LIST`,
        "CHON": `${KEY.DONVI}_CHON`,
        "CHON_TAT_CA": `${KEY.DONVI}_CHON_TAT_CA`,
        "IS_ALL": `${KEY.DONVI}_IS_ALL`
    },
    "TYPE_OPTION": "DVC@TYPE_OPTION",
    "LAST_OPTION": "DVC@OPTION_LAST_OPTION",
    "RESET": "DVC@RESET"
};

const initState: OptionState = {
    DonVi: {
        DanhSach: [],
        Chon: [],
        IsAll: false
    },
    Thang: {
        DanhSach: [],
        Chon: [],
        IsAll: false
    },
    Nam: {
        DanhSach: [],
        Chon: null,
        IsAll: false
    },
    TimeTitle: '',
    DonViTitle: '',
    LastOption: {
        DonVi: [],
        Thang: [],
        Nam: null,
        Option: 0
    },
    TypeOption: 0
}


const OptionReducer = (state = initState, { type, value }) => {
    switch (type) {
        case Type.NAM.LIST: return { ...state, Nam: { ...state.Nam, DanhSach: value } }
        case Type.THANG.LIST: return { ...state, Thang: { ...state.Thang, DanhSach: value } }
        case Type.NAM.CHON: {
            let timeTitle = state.TimeTitle
            timeTitle = timeTitle.split('/')
            timeTitle[1] = value
            timeTitle = timeTitle.join('/')
            return {
                ...state,
                Nam: { ...state.Nam, Chon: value },
                TimeTitle: timeTitle
            }
        }

        case Type.THANG.CHON: {
            let selected = state.Thang.Chon,
                isAll,
                title
            if (selected.includes(value))
                selected = selected.filter(e => e !== value)
            else
                selected = [...selected, value]

            isAll = selected.length === state.Thang.DanhSach.length;

            if (!selected.length)
                title = `Trống/${state.Nam.Chon}`;
            else if (selected.length === state.Thang.DanhSach.length)
                title = `Cả năm/${state.Nam.Chon}`;
            else if (selected.length < 3) {
                let thang = selected.join(',');
                title = `${thang}/${state.Nam.Chon}`;
            }
            else
                title = `Nhiều tháng/${state.Nam.Chon}`;

            return {
                ...state,
                TimeTitle: title,
                Thang: { ...state.Thang, Chon: selected, IsAll: isAll }
            }
        }
        case Type.THANG.CHON_TAT_CA: {
            let isAll = state.Thang.IsAll,
                selected = [],
                title = `Trống/${state.Nam.Chon}`;
            if (!isAll) {
                selected = state.Thang.DanhSach.map(e => e.ID);
                title = `Cả năm/${state.Nam.Chon}`;
            }
            return {
                ...state,
                TimeTitle: title,
                Thang: { ...state.Thang, Chon: selected, IsAll: !isAll }
            }
        }
        case Type.DONVI.LIST: return { ...state, DonVi: { ...state.DonVi, DanhSach: value } }
        case Type.DONVI.CHON: {
            let selected = state.DonVi.Chon,
                isAll,
                title;
            if (selected.includes(value))
                selected = selected.filter(e => e !== value)
            else
                selected = [...selected, value]

            isAll = selected.length === state.DonVi.DanhSach.length;

            if (!selected.length)
                title = 'Không chọn đơn vị';
            else if (isAll)
                title = 'Tất cả đơn vị';
            else if (selected.length === 1) {
                let donvi = state.DonVi.DanhSach.filter(e => selected.includes(e.ID))[0]
                title = donvi.Name;
            }
            else
                title = 'Nhiều đơn vị';

            return {
                ...state,
                DonVi: { ...state.DonVi, Chon: selected, IsAll: isAll },
                DonViTitle: title
            }
        }
        case Type.DONVI.CHON_TAT_CA: {
            let isAll = state.DonVi.IsAll,
                selected = [],
                title = 'Không chọn đơn vị';
            if (!isAll) {
                title = 'Tất cả đơn vị';
                selected = state.DonVi.DanhSach.map(e => e.ID)
            }

            return { ...state, DonVi: { ...state.DonVi, Chon: selected, IsAll: !isAll }, DonViTitle: title }
        }
        case Type.LAST_OPTION: {
            return { ...state, LastOption: value }
        }
        case Type.TYPE_OPTION: {
            const { DonVi } = state
            return {
                ...state, TypeOption: value, DonVi: {
                    DanhSach: [],
                    Chon: [],
                    IsAll: false
                },
            }
        }
        case Type.RESET: {
            let timeSelected = state.Thang.DanhSach.map(e => e.ID),
                title = `Cả năm/${moment().year()}`,
                titleDonVi = 'Tất cả đơn vị',
                donviSelected = state.DonVi.DanhSach.map(e => e.ID)
            return {
                ...state,
                DonVi: { ...state.DonVi, Chon: donviSelected, IsAll: true },
                Thang: { ...state.Thang, Chon: timeSelected, IsAll: true },
                DonViTitle: titleDonVi,
                TimeTitle: title,
                Nam: {
                    ...state.Nam,
                    Chon: moment().year()
                }
            }
        }
        default:
            return state;
    }
};

export default OptionReducer;
