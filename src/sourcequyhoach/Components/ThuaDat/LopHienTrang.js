import React from 'react';
import { useSelector } from 'react-redux';
import { Polygon, Marker } from 'react-native-maps';


const LopHienTrang = () => {
    const { dataPolygonPicked, shapePolygon, showThuaDat, showByZoom, makerCoordinate } = useSelector(state => state.hienTrang);
    const { showQuyHoach } = useSelector(state => state.quyHoach);
    // console.log("giá trị lop thua đat", shapePolygon);
    return (
        showThuaDat && showByZoom ?
            <React.Fragment>
                {
                    shapePolygon.map((item) => (
                        <PolygonThuaDat
                            key={item.ID}
                            coordinates={item.coordinates}
                            holes={item.holes}
                            fillColor={'transparent'}
                            strokeWidth={1}
                            strokeColor={'#FFEA00'}
                            zIndex={1000}
                        />
                    ))
                }
                {dataPolygonPicked ? (
                    <Polygon
                        coordinates={dataPolygonPicked.coordinates}
                        holes={dataPolygonPicked.holes}
                        strokeColor={'#18FFFF'}
                        fillColor={'rgba(24,255,255,0.4)'}
                        strokeWidth={2}
                        zIndex={101}
                    />
                ) : null}
                {makerCoordinate ? (
                    <Marker coordinate={makerCoordinate} />
                ) : null}
            </React.Fragment>
            : null
    );
}

export default LopHienTrang;

const PolygonThuaDat = ({ coordinates, holes, strokeColor, fillColor, strokeWidth, zIndex }) => {
    return (
        <Polygon
            coordinates={coordinates}
            holes={holes}
            strokeColor={strokeColor}
            fillColor={fillColor}
            strokeWidth={strokeWidth}
            zIndex={zIndex}
        />
    )
}
