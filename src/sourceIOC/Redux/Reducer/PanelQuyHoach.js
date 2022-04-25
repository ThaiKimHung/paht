const initState = {
    isActive:false,
    data:{}
};

const ROUTE = 'PANEL_QUYHOACH_';

export const Type = {
    'SET_SHOWING_ON': `${ROUTE}SET_SHOWING_ON`,
    'SET_SHOWING_OFF': `${ROUTE}SET_SHOWING_OFF`
};

const PanelQuyHoachReducer = (state = initState, {type, value}) => {
    switch (type) {
        case Type.SET_SHOWING_ON: {
            return  {
                data: value,
                isActive:true
            }
        }
        case Type.SET_SHOWING_OFF: {
            return {
                ...state,
                data:{...state.data,polygon:[]},
                isActive: false,
            }
        }
        default:
            return state;
    }

};

export default PanelQuyHoachReducer;
