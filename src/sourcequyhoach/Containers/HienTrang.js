import { checkInside, getDistance } from './Converter';
import Type from '../Redux/Type';
import { getPolygonByDistance, getPolygonByToThua, onMapMoveTo } from './MapView';
import setup from './setup';
import { Alert } from 'react-native';
import { onLoadInfoByThuaDat } from './Search';
import { onShowOnPanel } from './PanelInfo';
import { onLoadPolygonQuyHoach } from './QuyHoach';
import { store } from '../../../srcRedux/store';



export const onLoadPolygonByDistance = (coordinate) => {
    let { lastCoordinate, isLoadedOnStart } = store.getState()['hienTrang'],
        { showQuyHoach, routeZone } = store.getState()['quyHoach'],
        latitude = coordinate.latitude,
        longitude = coordinate.longitude,
        distance = 0;
    if (!!lastCoordinate) {
        distance = getDistance(lastCoordinate, coordinate);
    }
    if (!distance || distance >= 90 || !isLoadedOnStart) {
        const onSuccess = (statusCode, response) => {
            if (statusCode === 200) {
                store.dispatch({ type: Type.HIEN_TRANG.LAST_COORDINATE, value: { latitude, longitude } });
                if (response.length) {
                    store.dispatch({ type: Type.HIEN_TRANG.SHAPE_POLYGON, value: response });
                }
                if (!isLoadedOnStart)
                    store.dispatch({ type: Type.HIEN_TRANG.SET_LOAD_ON_START, value: true });
            }
        };
        getPolygonByDistance('shape', coordinate, onSuccess);
        if (showQuyHoach)
            onLoadPolygonQuyHoach({ latitude, longitude }, routeZone)
    }
};

export const onGetPolygonByToThua = (payload) => {
    let onSuccess = (statusCode, response) => {


        if (statusCode === 200) {
            let coordinate = {
                ...response,
                longitudeDelta: response.polygon.rootPolygon[0].longitude,
                latitudeDelta: response.polygon.rootPolygon[0].latitude,
            };
            onMapMoveTo({
                longitude: response.polygon.rootPolygon[0].longitude,
                latitude: response.polygon.rootPolygon[0].latitude,
            });

            store.dispatch({
                type: Type.HIEN_TRANG.DATA_POLYGON_PICKER, value: {
                    // ID: 53909,
                    // SOTO: "25",
                    // SOTHUA: "21",
                    // KVHC_ID: 125516,
                    // LOAIDAT: "TMD",
                    // DIENTICH: 627.7,
                    polygon: [],
                    // StokeColor: "#FF5722",
                    // FillColor: "rgba(255,87,34,0.3)",
                    WeightLine: 2,
                    Icon: null,
                    geoType: "POLYGON",
                    ...response,
                    coordinates: response.polygon.rootPolygon
                }
            });
            store.dispatch({
                type: Type.HIEN_TRANG.MAKER_COORDINATE, value: {
                    longitude: response.polygon.rootPolygon[0].longitude,
                    latitude: response.polygon.rootPolygon[0].latitude,
                }
            });
        } else if (statusCode === 201) {
            Alert.alert(
                'Thông báo',
                'Không tìm thấy dữ liệu bản đồ',
                [
                    {
                        text: 'Đồng ý',
                        onPress: () => { },
                        style: 'cancel',
                    },
                ],
                { cancelable: false },
            );
        }
    };
    getPolygonByToThua(payload, onSuccess);
};

export const onShapePress = (coordinate) => {
    if (!!coordinate) {
        let { shapePolygon, showThuaDat } = store.getState()['hienTrang'];

        shapePolygon = shapePolygon.filter((e) => {
            let inBound = checkInside(coordinate, e.coordinates);
            if (!inBound)
                return false;
            let holes = e.holes.filter(hole => checkInside(coordinate, hole)).length;
            return !holes
        });
        store.dispatch({ type: Type.HIEN_TRANG.MAKER_COORDINATE, value: coordinate });
        if (shapePolygon.length && showThuaDat) {
            let item = shapePolygon[0];
            store.dispatch({ type: Type.HIEN_TRANG.DATA_POLYGON_PICKER, value: item });
            let payload = {
                MaDvhc: item.KVHC_ID.toString(),
                SoThua: item.SOTHUA,
                SoTo: item.SOTO,
                TenChu: '',
            };
            onLoadInfoByThuaDat(payload);
            onShowOnPanel()
        }
    }
};
