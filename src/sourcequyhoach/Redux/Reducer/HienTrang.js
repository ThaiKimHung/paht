const initState = {
    dataPolygonPicked: '',
    makerCoordinate: '',
    shapePolygon: [],
    lastCoordinate: '',
    showThuaDat: true,
    showByZoom:false,
    strokeColor: '',
    isLoadedOnStart:false
}

export const Type = {
    "DATA_POLYGON_PICKER":"DATA_POLYGON_PICKER",
    "MAKER_COORDINATE":"MAKER_COORDINATE",
    "SHAPE_POLYGON":"SHAPE_POLYGON",
    "LAST_COORDINATE":"LAST_COORDINATE",
    "SHOW_THUA_DAT":"SHOW_THUA_DAT",
    "STROKE_COLOR":"STROKE_COLOR",
    "SHOW_BY_ZOOM":"SHOW_BY_ZOOM",
    "SET_LOAD_ON_START":"SET_LOAD_ON_START"
}

const HienTrangReducer = (state = initState, {type,value}) => {
    switch (type)
    {
        case Type.DATA_POLYGON_PICKER:
            return {
                ...state,
                dataPolygonPicked:value
            }
        case Type.MAKER_COORDINATE:
            return  {
                ...state,
                makerCoordinate: value
            }
        case Type.SHAPE_POLYGON:
            return  {
                ...state,
                shapePolygon: value
            }
        case Type.LAST_COORDINATE:
            return {
                ...state,
                lastCoordinate: value
            }
        case Type.SHOW_THUA_DAT:
            return {
                ...state,
                showThuaDat: value
            }
        case Type.STROKE_COLOR:
            return {
                ...state,
                strokeColor: value
            }
        case Type.SHOW_BY_ZOOM:
            return  {
                ...state,
                showByZoom: value
            }
        case Type.SET_LOAD_ON_START:
            return {
                ...state,
                isLoadedOnStart: value
            }
        default:
            return state
    }

};

export default HienTrangReducer
