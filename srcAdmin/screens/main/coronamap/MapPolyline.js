import React, { Component } from 'react'
import { Text, View, Image, TouchableOpacity, Platform } from 'react-native'
import MapView, { Polyline, Marker } from 'react-native-maps';
import apis from '../../../apis';
import Utils from '../../../../app/Utils';
import moment from 'moment';
import { Width, nstyles, paddingTopMul } from '../../../../styles/styles';
import { Images } from '../../../images';
import { sizes, colors } from '../../../../styles';
import { HeaderCom, IsLoading } from '../../../../components';
import MapViewDirections from 'react-native-maps-directions';
import { nGlobalKeys } from '../../../../app/keys/globalKey';
import { appConfig } from '../../../../app/Config';
import AppCodeConfig from '../../../../app/AppCodeConfig';

const Widthi = Width(100);
const INIT_REGION = {
    latitude: 11.387062,
    longitude: 106.996831,
    latitudeDelta: 1,
    longitudeDelta: 1,
}

export class MapPolyline extends Component {
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
            isShow: true,
            dataItem: {},
            datatracing: {},
            isMarker: false
        }
    }
    _getListLine = async () => {
        nthisIsLoading.show();
        const { dateTo, data, dateFrom } = this.state
        var vals = `${moment(dateFrom, 'YYYY-MM-DD').format('DD/MM/YYYY')}|${moment(dateTo, 'YYYY-MM-DD').format('DD/MM/YYYY')}|${data}`;
        Utils.nlog("gia trị value", vals)
        const res = await apis.ApiTracking.TrackingGPSUser(vals);
        Utils.nlog("gia tri res line user tracking", res);
        if (res.status == 1) {
            this.setState({ dataLine: res.data }, this._XuLyData)
        } else {
            nthisIsLoading.hide();
            Utils.showMsgBoxOK(this, "Thông báo", res.error ? res.error.message : "Lấy dữ liệu thất bại", "Xác nhận");
        }
    }
    componentDidMount() {
        this.setState({ isShow: false })
        this._getListLine();
    }
    _XuLyData = () => {
        var { dataLine = [] } = this.state;
        let trackingPointTemp = Utils.getGlobal(nGlobalKeys.trackingPoint, 23, AppCodeConfig.APP_ADMIN);
        var datamoi = dataLine.map(item => {
            var arrLongLat = item.ListTracking.map((item2) => {
                return { latitude: item2.ToaDoX, longitude: item2.ToaDoY }
            });
            arrLongLat = [{ latitude: item.ToaDoXActive, longitude: item.ToaDoYActive }, ...arrLongLat]
            if (arrLongLat.length > trackingPointTemp) {
                var arrRender = this._XuLyMang(arrLongLat, trackingPointTemp - 1);
                return {
                    ...item,
                    arrline: arrRender,
                    isSigal: false
                }
            } else {
                return {
                    ...item, arrline: arrLongLat ? arrLongLat : [], isSigal: true
                };
            }
        })
        this.setState({ dataLine: datamoi }, () => {
            nthisIsLoading.hide();
        })


    }
    _XuLyMang = (mang = [], num = 23) => {
        var old = 0;
        var arr = []
        while (old + num <= mang.length) {
            arr.push(mang.slice(old, old + num + 1));
            // Utils.nlog("vao giá tri mang ", arr, old, old + num + 1)
            old = old + num;
        }
        if (old < mang.length) {

            arr.push(mang.slice(old, mang.length));
            // Utils.nlog("vao giá tri mang2  ", arr, old, mang.length)
            return arr;
        } else {
            return arr;
        }

    }
    renderLine = (item, index) => {
        // Utils.nlog("gia tri item", item)
        if (item.arrline && item.arrline.length > 0) {
            var { arrline = [], isSigal } = item;
            if (isSigal == false) {
                return <>
                    {
                        arrline.map((item3, index3) => {
                            if (item3 && item3.length > 0) {
                                return (
                                    <MapViewDirections
                                        key={index3.toString()}
                                        origin={{
                                            latitude: item3[0].latitude,
                                            longitude: item3[0].longitude
                                        }}
                                        destination={{
                                            latitude: item3[item3.length - 1].latitude,
                                            longitude: item3[item3.length - 1].longitude
                                        }}
                                        strokeWidth={3}
                                        strokeColor={item.Color}
                                        waypoints={item3}
                                        apikey={appConfig.apiKeyGoogle}
                                        mode='WALKING'
                                    />
                                )
                            }

                        })
                    }
                </>

            } else {
                return (
                    <MapViewDirections
                        key={index.toString()}
                        origin={{
                            latitude: arrline[0].latitude,
                            longitude: arrline[0].longitude
                        }}
                        destination={{
                            latitude: arrline[arrline.length - 1].latitude,
                            longitude: arrline[arrline.length - 1].longitude
                        }}
                        strokeWidth={3}
                        strokeColor={item.Color}
                        waypoints={arrline}
                        apikey={appConfig.apiKeyGoogle}
                        mode='WALKING'
                    />
                )
            }

        } else {
            return null;
        }
    }

    renderMarker = (item, index) => {

        var location = { latitude: item.ToaDoX, longitude: item.ToaDoY };
        // Utils.nlog("gia tri location", location)
        return (<Marker


            // onCalloutPress={() => {
            //     this.marker.hideCallout();
            // }}
            // title={` Tên:${data.HoTen}`}
            // description={`Thứ tự:${data.SttLayNhiem} - Đời nhiễm:${data.DoiLayNhiem}`}
            key={index.toString()}
            coordinate={location}
        >



        </Marker>)

    }
    render() {
        var { dataLine, isShow, dataItem, datatracing, isMarker } = this.state;

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
                <View style={{ flex: 1 }}>

                    <MapView
                        onPress={() => {
                            Utils.nlog("vao onPress Map ")
                            if (isMarker == true) {
                                this.setState({ isMarker: false })
                            } else {
                                this.setState({ isShow: false })
                            }

                        }}
                        {...this.props} style={{ flex: 1 }}

                        initialRegion={INIT_REGION}
                        showsUserLocation={true}
                        followUserLocation={true}
                        zoomEnabled={true}
                        moveOnMarkerPress={false}
                    // provider={'google'}
                    >
                        {/* render marker tracking */}
                        {
                            dataLine.map((item) => {
                                return item.ListTracking.map((item2, index2) => {
                                    var location = { latitude: item2.ToaDoX, longitude: item2.ToaDoY };
                                    // Utils.nlog("gia tri location", location)
                                    if (index2 == item.ListTracking.length - 1) {
                                        return (<Marker
                                            onPress={() => {
                                                Utils.nlog("vao onPress marker")
                                                this.setState({ dataItem: item, isShow: true, datatracing: item2, isMarker: true })
                                            }}
                                            key={index2.toString()}
                                            // image={Images.icTracking}
                                            // icon={Images.icTracking}
                                            coordinate={location}
                                        >
                                            <View style={{
                                                minWidth: Width(5), minHeight: Width(5), alignItems: 'center', justifyContent: 'center',
                                                backgroundColor: colors.redStar, borderRadius: Width(10)
                                            }}>
                                                <Text style={{ color: colors.white }} >{item.SttLayNhiem}</Text>

                                            </View>

                                        </Marker>)
                                    } else {
                                        return (<Marker
                                            onPress={() => {
                                                Utils.nlog("vao onPress marker")
                                                this.setState({ dataItem: item, isShow: true, datatracing: item2, isMarker: true })
                                            }}
                                            key={index2.toString()}
                                            image={Images.icTracking}
                                            icon={Images.icTracking}
                                            coordinate={location}
                                        >

                                        </Marker>)
                                    }



                                })

                            })
                        }
                        {/* render marker cố dinh */}
                        {
                            dataLine.map((item, index) => {
                                var location = { latitude: item.CoDinhX, longitude: item.CoDinhY };
                                // Utils.nlog("gia tri location", location)
                                return (<Marker
                                    onPress={() => {
                                        this.setState({ dataItem: item, isShow: true, datatracing: {}, isMarker: true })
                                    }}
                                    key={index.toString()}
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
                                // Utils.nlog("gia tri location", location)
                                return (<Marker
                                    key={index.toString()}
                                    onPress={() => {
                                        this.setState({ dataItem: item, isShow: true, datatracing: {}, isMarker: true, })
                                    }}
                                    image={Images.icActive}
                                    icon={Images.icActive}
                                    coordinate={location}
                                >
                                </Marker>)

                            })

                        }

                        {
                            dataLine.map(this.renderLine)
                        }

                    </MapView>
                    <View style={{ position: 'absolute', top: 0, left: 0, backgroundColor: colors.backgroundModal, }}>
                        <View style={{ flexDirection: 'row', paddingVertical: 2 }}>
                            <Image style={[nstyles.nIcon30,]} resizeMode='contain'
                                source={Images.icCoDinh} />
                            <Text>Vị trí cách ly</Text>
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
                        <View style={{ flexDirection: 'row', paddingVertical: 2 }}>
                            <View style={{
                                marginHorizontal: 5,
                                minWidth: Width(5), minHeight: Width(5), alignItems: 'center', justifyContent: 'center',
                                backgroundColor: colors.redStar, borderRadius: Width(10)
                            }}>
                                <Text style={{ color: colors.white }} >{'stt'}</Text>
                            </View>
                            <Text >Vị trí di chuyển đầu tiên</Text>
                        </View>
                    </View>
                    <IsLoading>

                    </IsLoading>
                    {/* || Platform.OS == 'ios' */}
                    {isShow == true ? <View style={{
                        position: 'absolute', backgroundColor: colors.white,
                        bottom: 10, right: 10, left: 10, paddingVertical: 10,
                        paddingHorizontal: 10, borderRadius: 5, paddingBottom: 30
                    }}>

                        {/* <Text>{'Thông tin' + dataItem.HoTen}</Text> */}
                        <View style={{ flexDirection: 'row', }}>
                            <Text style={{ color: colors.grayLight, fontWeight: 'bold', }}>{`Tên:`}</Text>
                            <Text style={{ flex: 1 }}>{`${dataItem.HoTen ? dataItem.HoTen : 'Tên người cách ly'}`}</Text>
                            <Text >{`stt:${dataItem.SttLayNhiem ? dataItem.SttLayNhiem : '0'}`}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', }}>
                            <Text style={{ color: colors.grayLight, fontWeight: 'bold', }}>{`Trạng thái:`}</Text>
                            <Text style={{ flex: 1 }}>{`${dataItem.TrangThai ? dataItem.TrangThai : 'Trạng thái'}`}</Text>
                            {/* <View style={{ backgroundColor: dataItem.Color, padding: 10, borderRadius: 10 }}></View> */}
                        </View>
                        <View style={{ flexDirection: 'row', }}>
                            <Text style={{ color: colors.grayLight, fontWeight: 'bold', }}>{`Đời nhiễm:`}</Text>
                            <Text style={{ flex: 1 }}>{`${dataItem.DoiLayNhiem ? dataItem.DoiLayNhiem : "Đời lây nhiễm"}`}</Text>
                        </View>
                        {
                            datatracing.Time ? <View style={{ flexDirection: 'row', }}>
                                <Text style={{ color: colors.grayLight, fontWeight: 'bold', }}>{`Thời gian:`}</Text>
                                <Text style={{ flex: 1 }}>{`${datatracing.Time ? datatracing.Time : ''}`}</Text>
                            </View> : null
                        }
                        {
                            datatracing.Address ? <View style={{ flexDirection: 'row', }}>
                                <Text style={{ color: colors.grayLight, fontWeight: 'bold', }}>{`Địa chỉ:`}</Text>
                                <Text style={{ flex: 1 }}>{`${datatracing.Address ? datatracing.Address : ''}`}</Text>
                            </View> : <View style={{ flexDirection: 'row', }}>
                                    <Text style={{ color: colors.grayLight, fontWeight: 'bold', }}>{`Địa chỉ:`}</Text>
                                    <Text style={{ flex: 1 }}>{`${dataItem.Address ? dataItem.Address : ''}`}</Text>
                                </View>
                        }



                    </View> : null
                    }

                </View>
            </View >
        )
    }
}

export default MapPolyline

// renderLine = (item, index) => {
    //     var arrLongLat = item.ListTracking.map((item2) => {
    //         return { latitude: item2.ToaDoX, longitude: item2.ToaDoY }
    //     })
    //     if (arrLongLat && arrLongLat.length > 0) {
    //         arrLongLat = arrLongLat.reverse();
    //         Utils.nlog("gia tri key thuc", item.ToaDoXActive, item.ToaDoYActive);
    //         arrLongLat.push({ latitude: item.ToaDoXActive, longitude: item.ToaDoYActive });
    //         Utils.nlog("gia tri key thuc", arrLongLat);
    //         if (arrLongLat.length < 25) {
    //             return (
    //                 <MapViewDirections
    //                     key={item.Id}
    //                     origin={{
    //                         latitude: item.ListTracking[0].ToaDoX,
    //                         longitude: item.ListTracking[0].ToaDoY
    //                     }}
    //                     destination={{ latitude: item.ToaDoXActive, longitude: item.ToaDoYActive }}
    //                     strokeWidth={3}
    //                     strokeColor={item.Color}
    //                     waypoints={arrLongLat}
    //                     apikey={appConfig.apiKeyGoogle}
    //                     mode='WALKING'
    //                 />
    //             )
    //         } else {
    //             var arrRender = this._XuLyMang(arrLongLat, 26);
    //             arrview = arrRender.slice(1, 27);
    //             Utils.nlog("gia tri arrrender", arrRender);
    //             return <>
    //                 {
    //                     arrRender.map((item3, index3) => {
    //                         if (item3 && item3.length > 0) {
    //                             return (
    //                                 <MapViewDirections
    //                                     key={index3.toString()}
    //                                     origin={{
    //                                         latitude: item3[0].latitude,
    //                                         longitude: item3[0].longitude
    //                                     }}
    //                                     destination={{
    //                                         latitude: item3[item3.length - 1].latitude,
    //                                         longitude: item3[item3.length - 1].longitude
    //                                     }}
    //                                     strokeWidth={3}
    //                                     strokeColor={item.Color}
    //                                     waypoints={arrview}
    //                                     apikey={appConfig.apiKeyGoogle}
    //                                     mode='WALKING'
    //                                 />
    //                             )
    //                         }

    //                     })


    //                 }
    //             </>
    //         }


    //     } else {
    //         return null;
    //     }


    // }
