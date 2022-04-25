import setup from '../../Containers/setup';
const initState = {
    type: 'satellite',
    isSatellite: true,
    refMap: null,
    isMapMoving: false,
    currentCoordinate: { ...setup.startCoordinate },
    userCoordinate: {},
}

export const MapViewType = {
    "SET_SATELLITE_MODE": "SET_SATELLITE_MODE",
    "SET_REF_MAP": "SET_REF_MAP",
    "SET_MOVING_MAP": "SET_MOVING_MAP",
    "SET_CURRENT_COORDINATE": "SET_CURRENT_COORDINATE",
    "SET_USER_COORDINATE": "SET_USER_COORDINATE"
}

const MapViewReducer = (state = initState, { type, value }) => {
    switch (type) {
        case MapViewType.SET_SATELLITE_MODE:
            {
                let nextType = value ? 'satellite' : 'standard';
                return ({
                    ...state,
                    type: nextType,
                    isSatellite: value,
                });
            }
        case MapViewType.SET_REF_MAP: {
            return {
                ...state,
                refMap: null,
            }
        }
        case MapViewType.SET_MOVING_MAP: {
            return {
                ...state,
                isMapMoving: !state.isMapMoving
            }
        }
        case MapViewType.SET_CURRENT_COORDINATE: {
            return {
                ...state,
                currentCoordinate: value
            }
        }
        case MapViewType.SET_USER_COORDINATE: {
            return {
                ...state,
                userCoordinate: value
            }
        }
        default:
            return state
    }

};

export default MapViewReducer
