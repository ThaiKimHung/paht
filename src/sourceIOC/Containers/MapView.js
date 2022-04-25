import LinkAPI, { onPostRequest } from './Config';
import { convertXYToLatLon, convertLatLonToXY, getDistance } from './Converter';
import Type from '../Redux/Type';
import WKT from './WKT';
import moment from 'moment';
import { store } from '../../../srcRedux/store';

export function getPolygonByToThua(payload, onSuccess) {
    let onProcess = ({ statusCode, response }) => {
        if (statusCode === 200) {
            response = response[0];
            response = {
                ...response,
                geoType: getGeoTypeFromString(response.polygon),
                polygon: processPolygon(response.polygon, true)
            };
            onSuccess(statusCode, response);
        } else {
            onSuccess(statusCode, response);
        }
    };
    onPostRequest(LinkAPI.getPolygonByToThua, onProcess, payload);
}

export const getGeoTypeFromString = (stringGeo) => {
    if (stringGeo) {
        let to = stringGeo.indexOf(' ');
        return stringGeo.substring(0, to);
    }
    return ''
}

export function processPolygon(strPoly, isConvert) {
    let coordinates = [],
        geoType = getGeoTypeFromString(strPoly);
    strPoly = strPoly.replace(geoType, "")
    strPoly = strPoly.split("(");
    strPoly = strPoly.filter(e => e.trim())
    strPoly = strPoly.map(e => e.trim().replace("),", "").replace("))", "").trim());
    strPoly.forEach((e, i) => {
        let coordinateArray = e.split(","),
            _p = [];
        coordinateArray.forEach(e => {
            let _e = e.trim(),
                _list = _e.split(" ");

            if (_list.length === 2) {
                let x = _list[1].replace(/[()]/g, '').trim(),
                    y = _list[0].replace(/[()]/g, '').trim();
                if (!isNaN(x) && !isNaN(y)) {
                    x = parseFloat(x);
                    y = parseFloat(y);
                    let coordinate = isConvert ?
                        convertXYToLatLon({ x, y })
                        :
                        { latitude: x, longitude: y };
                    _p = [..._p, coordinate]
                }
            }
        });
        if (_p.length) {
            coordinates = [...coordinates, _p]
        }
    });

    return {
        rootPolygon: coordinates[0],
        holes: coordinates.splice(1)
    }
}

export function processPolyline(strPoly) {
    let holes = [],
        geoType = getGeoTypeFromString(strPoly);
    strPoly = strPoly.replace(geoType, "")
        .split("(")
        .filter(e => e.trim())
        .map(e => e.trim()
            .replace("),", "")
            .replace("))", "")
            .trim()
        )
    strPoly.forEach((e, i) => {
        let coordinateArray = e.split(","),
            _p = [];
        coordinateArray.forEach(e => {
            let _e = e.trim(),
                _list = _e.split(" ");

            if (_list.length === 2) {
                let x = _list[1].replace(/[()]/g, '').trim(),
                    y = _list[0].replace(/[()]/g, '').trim();
                if (!isNaN(x) && !isNaN(y)) {
                    x = parseFloat(x);
                    y = parseFloat(y);
                    let coordinate = { latitude: x, longitude: y }
                    _p = [..._p, coordinate]
                }
            }
        });
        if (_p.length) {
            holes = [...holes, _p];
        }
    });

    return holes
}


export const processResponseGeometry = (response, isConvert) => {
    if (Array.isArray(response)) {
        let nextResponse = [],
            listID = [];
        response.forEach((e, i) => {
            let nextGeo = WKT.parse(e.polygon, isConvert);
            nextGeo.geometry.forEach((elem, index) => {
                let item = {
                    ...e,
                    ID: e.ID,
                    geoType: nextGeo.geoType,
                    coordinates: elem[0],
                    holes: elem.slice(1),
                    polygon: []
                };
                if (item.coordinates.length) {
                    if (listID.includes(item.ID))
                        item.ID = moment().valueOf() + index
                    else
                        listID = [...listID, item.ID]
                    nextResponse = [...nextResponse, item];
                }

            })
        })
        return nextResponse
    }
    return []
}


function getCenterPoint(arr) {
    let x = arr.map((e) => e.latitude);
    let y = arr.map((e) => e.longitude);
    let cx = (Math.min(...x) + Math.max(...x)) / 2;
    let cy = (Math.min(...y) + Math.max(...y)) / 2;
    return { latitude: cx, longitude: cy };
}

export function getPolygonByDistance(route, coordinate, onSuccess) {
    let { refMap } = store.getState()['mapView'];
    if (refMap) {
        refMap.getMapBoundaries()
            .then(e => {
                let distance = (getDistance(e.northEast, e.southWest) / 2),
                    zoom = Math.round(Math.log(360 / coordinate.longitudeDelta) / Math.LN2),
                    pointXY = convertLatLonToXY(coordinate),
                    payload = {
                        Latitude: pointXY.x,
                        Longitude: pointXY.y,
                        Distance: distance,
                        Zoom: zoom
                    },
                    onProcess = ({ statusCode, response }) => {
                        if (statusCode === 200) {
                            response = processResponseGeometry(response, true);
                            onSuccess(statusCode, response);
                        }
                    };
                if (payload.Distance > 100)
                    payload.Distance = 120
                onPostRequest(LinkAPI.getPolygonByDistance, onProcess, payload);
            });
    }


}

export const onMapMoveTo = ({ latitude, longitude }) => {
    let { refMap, currentCoordinate } = store.getState()['mapView'];
    if (refMap) {
        store.dispatch({ type: Type.MAP_VIEW.SET_MOVING_MAP });
        refMap.animateToRegion({ ...currentCoordinate, latitude, longitude }, 500);
        setTimeout(() => {
            store.dispatch({ type: Type.MAP_VIEW.SET_MOVING_MAP });
        }, 1000);
    }

};


