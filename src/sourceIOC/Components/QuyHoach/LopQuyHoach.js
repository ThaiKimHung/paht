import React from 'react';
import {Polygon, Polyline} from 'react-native-maps';
import {useDispatch, useSelector} from 'react-redux';
import Type from '../../Redux/Type';
import {onShowMediumPanel} from '../../Containers/PanelInfo';
import WKT from '../../Containers/WKT';


const LopQuyHoach = () => {
    const {polygon, polyline, showQuyHoach} = useSelector(state => state.quyHoach);
    const {showingMode} = useSelector(state => state.panelInfo);
    const {data} = useSelector(state => state.panelQuyHoach);
    const dispatch = useDispatch();

    const onPress = (item) => () => {
        if (item) {
            if (showingMode === 'on') {
                onShowMediumPanel();
            }
            dispatch({type: Type.QUY_HOACH_PANEL.SET_SHOWING_ON, value: item});
        }
    };

    return (
        showQuyHoach ?
            <React.Fragment>
                {polygon.map((item) => (
                    <Polygon
                        key = {item.ID}
                        coordinates={item.coordinates}
                        holes={item.holes}
                        fillColor={item.FillColor}
                        strokeWidth={1}
                        strokeColor={item.StokeColor}
                        tappable={true}
                        onPress={onPress(item)}
                    />
                ))}
                {polyline.map(item => (
                    <Polyline
                        key={item.ID}
                        coordinates={item.polyline}
                        strokeColor={item.StokeColor} // fallback for when `strokeColors` is not supported by the map-provider
                        strokeWidth={item.WeightLine}
                        tappable={true}
                        zIndex={100}
                        onPress = {onPress(item)}
                    />
                ))}
                {
                    data.geoType === WKT.mapGeoType.POLYGON ?
                        <Polygon
                            coordinates={data.coordinates}
                            holes={data.holes}
                            strokeColor={'#76FF03'}
                            fillColor={'rgba(118,255,3,.4)'}
                            strokeWidth={2}
                            zIndex={102}
                        />
                        :
                        data.geoType === WKT.mapGeoType.LINESTRING ?
                            <Polyline
                                coordinates={data.polyline}
                                strokeColor={'#76FF03'}
                                strokeWidth={5}
                                zIndex={100}
                            />
                            : null
                }
            </React.Fragment>
            :
            null

    );
};

export default LopQuyHoach;
