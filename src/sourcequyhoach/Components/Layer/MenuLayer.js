import React, { useState } from 'react';
import {
    View,
    Text
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux'
import COLOR from '../../Styles/Colors';
import FONT from '../../Styles/Font';
import POSITION from '../../Styles/Position';
import HeaderModalBar from '../UI/HeaderModalBar';
import Dash from '../UI/Dash';
import Type from '../../Redux/Type';
import RadioButton, { CheckButton } from '../UI/RadioButton';
import { onLoadPolygonQuyHoach } from '../../Containers/QuyHoach';
import setup from '../../Containers/setup';
import { nstyles } from '../../../../styles';



const MenuLayer = ({ navigation }) => {
    const dispatch = useDispatch();
    const { isSatellite, currentCoordinate } = useSelector(state => state.mapView);
    const { showThuaDat } = useSelector(state => state.hienTrang);
    const { showQuyHoach, routeZone } = useSelector(state => state.quyHoach);
    const [mapMode, setMapMode] = useState(isSatellite);
    const [isShowThuaDat, setShowThuaDat] = useState(showThuaDat);
    const [isShowQuyHoach, setShowQuyHoach] = useState(showQuyHoach);
    const [routeQuyHoach, setRouteQuyHoach] = useState(routeZone);


    React.useEffect(
        () => {

            if (mapMode !== isSatellite)
                dispatch({ type: Type.MAP_VIEW.SET_SATELLITE_MODE, value: mapMode });

            if (isShowThuaDat !== showThuaDat)
                dispatch({ type: Type.HIEN_TRANG.SHOW_THUA_DAT, value: isShowThuaDat });

            if (isShowQuyHoach !== showQuyHoach)
                dispatch({ type: Type.QUY_HOACH.SET_SHOW, value: isShowQuyHoach });

            if (routeQuyHoach !== routeZone) {
                dispatch({ type: Type.QUY_HOACH.SET_ROUTE, value: routeQuyHoach });
                if (isShowQuyHoach) {
                    if (currentCoordinate.latitude > 5)
                        onLoadPolygonQuyHoach(currentCoordinate, routeQuyHoach)
                    else
                        onLoadPolygonQuyHoach(setup.startCoordinate, routeQuyHoach)
                }
            }
        },
        // navigation.addListener('blur', () => {

        //     if (mapMode !== isSatellite)
        //         dispatch({type:Type.MAP_VIEW.SET_SATELLITE_MODE,value:mapMode});

        //     if (isShowThuaDat !== showThuaDat)
        //         dispatch({type:Type.HIEN_TRANG.SHOW_THUA_DAT,value:isShowThuaDat});

        //     if (isShowQuyHoach !== showQuyHoach)
        //         dispatch({type:Type.QUY_HOACH.SET_SHOW,value:isShowQuyHoach});

        //     if (routeQuyHoach !== routeZone)
        //     {
        //         dispatch({type:Type.QUY_HOACH.SET_ROUTE,value:routeQuyHoach});
        //         if (isShowQuyHoach)
        //         {
        //             if (currentCoordinate.latitude > 5)
        //                 onLoadPolygonQuyHoach(currentCoordinate,routeQuyHoach)
        //             else
        //                 onLoadPolygonQuyHoach(setup.startCoordinate,routeQuyHoach)
        //         }
        //     }
        // }),
        [navigation, dispatch, mapMode,
            isSatellite, isShowQuyHoach, isShowThuaDat,
            showThuaDat, showQuyHoach,
            routeQuyHoach, routeZone]
    );


    const onModeMapChange = () => setMapMode(!mapMode);

    const onChangeShowThuaDate = () => setShowThuaDat(!isShowThuaDat);
    const onChangeShowQuyHoach = () => setShowQuyHoach(!isShowQuyHoach);

    const onChangeRouteZone = (route) => () => setRouteQuyHoach(route)

    return (
        <View style={[styles.container, { marginTop: nstyles.paddingTopMul() + 10, }]}>
            <Dash />
            <HeaderModalBar
                navigation={navigation}
                titleLeft={'Tho??t'}
                title='B???n ?????'
            />
            <View style={styles.body}>
                <Text style={styles.title}>Lo???i b???n ?????</Text>
                <RadioButton
                    checked={mapMode}
                    title={'N???n v??? tinh'}
                    onValueChange={onModeMapChange}
                />
                <RadioButton
                    checked={!mapMode}
                    title={'N???n b???n ?????'}
                    onValueChange={onModeMapChange}
                />
            </View>
            <View style={styles.body}>
                <Text style={styles.title}>L???p hi???n th???</Text>
                <CheckButton
                    checked={isShowThuaDat}
                    title={'L???p n???n th???a ?????t'}
                    onValueChange={onChangeShowThuaDate}
                />
                <CheckButton
                    checked={isShowQuyHoach}
                    title={'L???p n???n quy ho???ch'}
                    onValueChange={onChangeShowQuyHoach}
                />
            </View>
            <View style={styles.body}>
                <Text style={styles.title}>Lo???i quy ho???ch </Text>
                {menu.map(e => (
                    <RadioButton
                        key={e.key}
                        checked={e.key === routeQuyHoach}
                        title={e.name}
                        onValueChange={onChangeRouteZone(e.key)}
                        disabled={!isShowQuyHoach}
                    />
                ))}
            </View>
        </View>
    );
};

export default MenuLayer;

const menu = [
    { key: 'QH_TNH_GIAOTHONG', name: 'Quy ho???ch giao th??ng' },
    { key: 'QH_TCU_SDD', name: 'Quy ho???ch s??? d???ng ?????t' }
]

const styles = {
    container: {
        flex: 1,
        backgroundColor: COLOR.white,
    },
    body: {
        margin: 16,
    },
    title: {
        fontFamily: FONT.FontFamily,
        color: COLOR.darkGray,
        fontSize: 15,
        marginBottom: 10
    },
    row: {
        alignItems: POSITION.center,
        flexDirection: POSITION.row,
        justifyContent: POSITION.spaceBetween
    }
};
