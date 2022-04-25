import LinkAPI, {onPostRequest} from './Config';
import Type from '../Redux/Type';
import {processResponseGeometry} from './MapView';
import WKT from './WKT';
import { store } from '../../../srcRedux/store';

export const onLoadPolygonQuyHoach = (coordinate,route) => {
    let payload = {
            Latitude: coordinate.latitude,
            Longitude: coordinate.longitude,
            Distance: 500,
            Route:route
        },
        onSuccess = ({statusCode, response}) => {
            if (statusCode === 200 && response.length) {
                let polygons,
                    polylines;
                response = processResponseGeometry(response,false);
                polygons = response.filter(e=>e.geoType === WKT.mapGeoType.POLYGON);
                polylines = response.filter(e=>e.geoType === WKT.mapGeoType.LINESTRING);
                store.dispatch({type: Type.QUY_HOACH.SET_POLYGON, value: polygons});
                store.dispatch({type: Type.QUY_HOACH.SET_POLYLINE, value: polylines});
            }
        };
    // console.log(payload);
    onPostRequest(LinkAPI.getZonePolygonByDistance, onSuccess, payload);
}

export const getQuyHoachByDocument = (payload) => {

    let {zoneList} = store.getState()['panelInfo'];

    zoneList = zoneList.filter(e => e.MaDvhc === payload.MaDvhc && e.SoTo === payload.SoTo && e.SoThua === payload.SoThua)

    if (!zoneList.length) {
        let onProcess = ({statusCode, response}) => {
            if (statusCode === 200) {
                response = response.map(e => ({
                    quyhoach: e.quyhoach,
                    color: e.StokeColor
                }));
                response = {
                    ...payload,
                    data: response
                };
                store.dispatch({type: Type.PANEL_INFO.ZONE_LIST, value: response});
            }
        };
        onPostRequest(LinkAPI.getQuyHoachByDocument, onProcess, payload)
    }
}
