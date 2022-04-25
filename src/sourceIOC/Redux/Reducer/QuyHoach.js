const initState = {
    polygon:[],
    polyline: [],
    showQuyHoach:false,
    routeZone:''
}

export const Type = {
    "SET_POLYGON":"QUYHOACH_SET_POLYGON",
    "SET_SHOW":"QUYHOACH_SET_SHOW",
    "SET_POLYLINE":"QUYHOACH_SET_POLYLINE",
    "SET_ROUTE":"QUYHOACH_SET_ROUTE"
}

const QuyHoachReducer = (state = initState,{type,value})=>
{
    switch (type){
        case Type.SET_POLYGON:
            return {
                ...state,
                polygon: value
            }
        case Type.SET_SHOW:
            return {
                ...state,
                showQuyHoach: value
            }
        case Type.SET_POLYLINE:{
            return {
                ...state,
                polyline: value
            }
        }
        case Type.SET_ROUTE:{
            return {
                ...state,
                routeZone: value
            }
        }
        default:
            return state;
    }
}

export default QuyHoachReducer
