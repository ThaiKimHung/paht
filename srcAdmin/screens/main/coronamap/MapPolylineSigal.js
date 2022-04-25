import React, { Component } from 'react'
import { Text, View, Image, TouchableOpacity } from 'react-native'
import MapView, { Polyline, Marker } from 'react-native-maps';
import apis from '../../../apis';
import Utils from '../../../../app/Utils';
import moment from 'moment';
import { Width, nstyles, paddingTopMul } from '../../../../styles/styles';
import { Images } from '../../../images';
import { sizes, colors } from '../../../../styles';
import { HeaderCom, IsLoading } from '../../../../components';

const Widthi = Width(100);
const INIT_REGION = {
    latitude: 11.387062,
    longitude: 106.996831,
    latitudeDelta: 1,
    longitudeDelta: 1,
}
export class MapPolylineSigal extends Component {
    constructor(props) {
        super(props)
        // this.isShow=false;
        this.state = {
            region: INIT_REGION,
            arrline: [],
            data: Utils.ngetParam(this, "data", []),
            dateFrom: Utils.ngetParam(this, "dateFrom", []),
            dateTo: Utils.ngetParam(this, "dateTo", []),
            dataLine: [],
            isShow: false
        }
    }
    _getListLine = async () => {
        nthisIsLoading.show();
        const { dateTo, data, dateFrom } = this.state
        var vals = `${moment(dateFrom, 'YYYY-MM-DD').format('DD/MM/YYYY')}|${moment(dateTo, 'YYYY-MM-DD').format('DD/MM/YYYY')}|${data}`;
        Utils.nlog("gia trị value", vals)
        const res = await apis.ApiTracking.TrackingGPSUserDetail(vals);
        Utils.nlog("gia tri res line user tracking", res);
        if (res.status == 1) {
            nthisIsLoading.hide();
            this.setState({ dataLine: res.data })
        } else {
            nthisIsLoading.hide();
            Utils.showMsgBoxOK(this, "Thông báo", res.error ? res.error.message : "Lấy dữ liệu thất bại", "Xác nhận");
        }
    }
    componentDidMount() {
        this._getListLine();
    }
    renderLine = (item, index) => {
        const arrLongLat = item.ListTracking.map((item2) => {
            return { latitude: item2.ToaDoX, longitude: item2.ToaDoY }
        })
        var arr = [{ latitude: item.CoDinhX, longitude: item.CoDinhY }, ...arrLongLat, { latitude: item.ToaDoXActive, longitude: item.ToaDoYActive }]
        if (arrLongLat) {
            Utils.nlog("ga tri arloglat", arrLongLat)
            return (<Polyline
                key={item.Id}
                coordinates={arr}
                strokeColor={item.Color}
                strokeWidth={2}
            />)
            // return null
        } else {
            return null
        }

    }
    renderMarker = (item, index) => {

        var location = { latitude: item.ToaDoX, longitude: item.ToaDoY };
        Utils.nlog("gia tri location", location)
        return (<Marker


            // onCalloutPress={() => {
            //     this.marker.hideCallout();
            // }}
            // title={` Tên:${data.HoTen}`}
            // description={`Thứ tự:${data.SttLayNhiem} - Đời nhiễm:${data.DoiLayNhiem}`}
            key={index}
            coordinate={location}
        >



        </Marker>)

    }
    render() {
        const { dataLine, isShow, dataItem } = this.state;

        return (
            <View style={{ flex: 1 }}>
                <View style={{
                    backgroundColor: colors.peacockBlue,
                    flexDirection: 'row', justifyContent: 'flex-end',
                    alignItems: 'center', paddingHorizontal: 10, paddingTop: paddingTopMul()
                }}>

                    <TouchableOpacity
                        onPress={() => Utils.goback(this)}
                        style={{ flexDirection: 'row', padding: 10, }}>
                        <Image style={[{ tintColor: colors.white }]} resizeMode='cover'
                            source={Images.icLogout} />
                    </TouchableOpacity>

                </View>
                <MapView
                    onPress={() => this.setState({ isShow: false })}
                    {...this.props} style={{ flex: 1 }}

                    initialRegion={INIT_REGION}
                    showsUserLocation={true}
                    followUserLocation={true}
                    zoomEnabled={true}
                    moveOnMarkerPress={false}
                >
                    {/* render marker tracking */}
                    {
                        dataLine.map((item) => {
                            return item.ListTracking.map((item2, index2) => {
                                var location = { latitude: item2.ToaDoX, longitude: item2.ToaDoY };
                                Utils.nlog("gia tri location", location)
                                return (<Marker
                                    onPress={() => {
                                        this.setState({ dataItem: item, isShow: true })
                                    }}
                                    key={index2}
                                    image={Images.icTracking}
                                    icon={Images.icTracking}
                                    coordinate={location}
                                >

                                </Marker>)

                            })

                        })
                    }
                    {/* render marker cố dinh */}
                    {
                        dataLine.map((item, index) => {
                            var location = { latitude: item.CoDinhX, longitude: item.CoDinhY };
                            Utils.nlog("gia tri location", location)
                            return (<Marker
                                onPress={() => {
                                    this.setState({ dataItem: item, isShow: true })
                                }}
                                key={index}
                                image={Images.icCoDinh}
                                icon={Images.icCoDinh}
                                coordinate={location}
                            >
                            </Marker>)

                        })

                    }
                    {/* render marker acctive */}
                    {
                        dataLine.map((item, index) => {
                            var location = { latitude: item.ToaDoXActive, longitude: item.ToaDoYActive };
                            Utils.nlog("gia tri location", location)
                            return (<Marker
                                key={index}
                                onPress={() => {
                                    this.setState({ dataItem: item, isShow: true })
                                }}
                                image={Images.icActive}
                                icon={Images.icActive}
                                coordinate={location}
                            >
                            </Marker>)

                        })

                    }
                    {/* render line đường đi */}
                    {
                        dataLine.map(this.renderLine)
                    }

                </MapView>
                {isShow == true ? <View style={{
                    position: 'absolute', backgroundColor: colors.white,
                    bottom: 10, right: 10, left: 10, paddingVertical: 10,
                    paddingHorizontal: 10, height: 100, borderRadius: 5,
                }}>
                    {/* <Text>{'Thông tin' + dataItem.HoTen}</Text> */}
                    <View style={{ flexDirection: 'row', }}>
                        <Text style={{ color: colors.grayLight, fontWeight: 'bold', }}>{`Tên:`}</Text>
                        <Text style={{ flex: 1 }}>{`${dataItem.HoTen}`}</Text>
                        <Text >{`stt:${dataItem.SttLayNhiem}`}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', }}>
                        <Text style={{ color: colors.grayLight, fontWeight: 'bold', }}>{`Trạng thái:`}</Text>
                        <Text style={{ flex: 1 }}>{`${dataItem.TrangThai}`}</Text>
                        {/* <View style={{ backgroundColor: dataItem.Color, padding: 10, borderRadius: 10 }}></View> */}
                    </View>
                    <View style={{ flexDirection: 'row', }}>
                        <Text style={{ color: colors.grayLight, fontWeight: 'bold', }}>{`Đời nhiễm:`}</Text>
                        <Text style={{ flex: 1 }}>{`${dataItem.DoiLayNhiem}`}</Text>
                    </View>

                </View> : null
                }

                <View style={{ position: 'absolute', top: 0, left: 0, backgroundColor: colors.backgroundModal, }}>
                    <View style={{ flexDirection: 'row', paddingVertical: 2 }}>
                        <Image style={[nstyles.nIcon30,]} resizeMode='contain'
                            source={Images.icCoDinh} />
                        <Text>Vị trí cố định</Text>
                    </View>
                    <View style={{ flexDirection: 'row', paddingVertical: 2 }}>
                        <Image style={[nstyles.nIcon30,]} resizeMode='contain'
                            source={Images.icTracking} />
                        <Text>Vị trí di chuyển</Text>
                    </View>
                    <View style={{ flexDirection: 'row', paddingVertical: 2 }}>
                        <Image style={[nstyles.nIcon30,]} resizeMode='contain'
                            source={Images.icActive} />
                        <Text>Vị trí hiện tại</Text>
                    </View>
                </View>
                <IsLoading>

                </IsLoading>
            </View >
        )
    }
}

export default MapPolylineSigal
