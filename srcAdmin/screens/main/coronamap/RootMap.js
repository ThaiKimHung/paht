import React, { Component } from 'react'
import { Text, View, TouchableOpacity, Image, FlatList } from 'react-native'

import MapView, { Marker, Callout, CalloutSubview } from 'react-native-maps'
import ClusteredMapView from './ClusteredMapView'
import Utils from '../../../../app/Utils'
import { colors } from '../../../../styles'
import { Width, nstyles, paddingTopMul, paddingBotX } from '../../../../styles/styles'
import apis from '../../../apis'
import { IsLoading } from '../../../../components'
import { sizes } from '../../../../styles/size'
import { nGlobalKeys } from '../../../../app/keys/globalKey'
import { Images } from '../../../images'
import moment from 'moment'
import MapPolyline from './MapPolyline'
import AppCodeConfig from '../../../../app/AppCodeConfig'

const INIT_REGION = {
    latitude: 11.387062,
    longitude: 106.996831,
    latitudeDelta: 2,
    longitudeDelta: 2,
}
const datatype = [
    {
        Color: "#008000",
        name: "Ca Mới",
        DoiLayNhiem: 1,
    },
    {
        Color: "#FF0000",
        name: "Ca F0",
        DoiLayNhiem: 2,
    },
    {
        Color: "#9933CC",
        name: "Ca F1",
        DoiLayNhiem: 3,
    },
    {
        Color: "#FF9933",
        name: "Ca F2",
        DoiLayNhiem: 4,
    },
    {
        Color: "#00CCFF",
        name: "Ca F3",
        DoiLayNhiem: 5,
    },
    {
        Color: "#00FFFF",
        name: "Ca F4,F5",
        DoiLayNhiem: 6,
    },
    {
        Color: "#FFFF00",
        name: "Điểm đến của F0",
        DoiLayNhiem: 7,
    }

]
class RootMap extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            _Width: Width(80),
            dataItem: '',
            isShow: true
        }

    }
    _getdata = async () => {
        Utils.setGlobal(nGlobalKeys.TimeDateMap, moment(new Date(), AppCodeConfig.APP_ADMIN))
        nthisIsLoading.show();
        const res = await apis.ApiTracking.DanhSachAccMap();
        Utils.nlog("vao on get ds  res", res)
        if (res.status == 1 && res.data) {
            // Utils.nlog("gia tri res data marrker map", res)
            var data = res.data.map(item => {
                return {
                    ...item,
                    location: {
                        latitude: item.ToaDoX,
                        longitude: item.ToaDoY
                    },
                }
            })
            nthisIsLoading.hide();
            this.setState({ data: data })
        } else {
            nthisIsLoading.hide();
            Utils.showMsgBoxOK(this, "Thông báo", "Lấy dữ liệu thất bại", "Xác nhận");
        }
    }
    componentDidMount() {
        this._getdata();
        this._getDsMapCorona();
    }
    _getDsMapCorona = async () => {
        var timeMaps = Utils.getGlobal(nGlobalKeys.timeMaps, 90000, AppCodeConfig.APP_ADMIN);
        // Utils.nlog("timeMaps", timeMaps)
        // Utils.nlog("vao on get ds ")
        setInterval(async () => {
            var timenow = moment(new Date());
            var timeold = Utils.getGlobal(nGlobalKeys.TimeDateMap, moment(new Date(), AppCodeConfig.APP_ADMIN))
            var number = timenow.diff(timeold, "milliseconds");
            Utils.nlog("gia tri number va time map", number, timeMaps)
            if (number >= timeMaps) {
                Utils.setGlobal(nGlobalKeys.TimeDateMap, moment(new Date(), AppCodeConfig.APP_ADMIN))
                const res = await apis.ApiTracking.DanhSachAccMap();
                Utils.nlog("vao on get ds  res", res)
                if (res.status == 1 && res.data) {
                    Utils.nlog("gia tri res data marrker map", res)
                    var data = res.data.map(item => {
                        return {
                            ...item,
                            location: {
                                latitude: item.ToaDoX,
                                longitude: item.ToaDoY
                            },
                        }
                    })
                    this.setState({ data: data })
                }
            }
        }, 60000);
    }
    renderCluster = (cluster, onPress, index = 0) => {
        // Utils.nlog("vao render clusster", cluster)
        const pointCount = cluster.pointCount,
            coordinate = cluster.coordinate,
            clusterId = cluster.clusterId
        const clusteringEngine = this.map.getClusteringEngineM(index);
        var clusteredPoints = clusteringEngine.getLeaves(clusterId, 100);
        // Utils.nlog("gia tri clusteredPoints ", clusteredPoints)
        return (
            <Marker
                coordinate={coordinate}
                onPress={onPress}
            >
                <View style={{
                    paddingHorizontal: 5, width: Width(7), height: Width(7),
                    backgroundColor: datatype[index].Color, borderWidth: 1, alignItems: 'center',
                    justifyContent: 'center',
                    borderColor: 'white', borderRadius: Width(7)
                }} >
                    <Text style={{ color: 'white' }} >
                        {pointCount > 1 ? pointCount : ''}
                    </Text>
                </View>
            </Marker>
        )
    }
    onPress() {
        // if (true) {
        this.marker.showCallout();
        // } else {
        //     this.marker.hideCallout();
        // }
    }
    renderMarker = (data) =>
        <Marker
            ref={ref => { this.marker = ref; }}
            onPress={() => {
                // this.marker.showCallout();
                this.setState({ dataItem: data })

                // setTimeout(() => {
                // }, 3000)

            }}
            onCalloutPress={() => {
                this.marker.hideCallout();
            }}
            title={` Tên:${data.HoTen}`}
            description={`Thứ tự:${data.SttLayNhiem} - Đời nhiễm:${data.DoiLayNhiem}`}
            key={data.id || Math.random()} coordinate={data.location} >

            <View style={{
                backgroundColor: datatype[data.DoiLayNhiem - 1].Color, borderRadius: Width(6), borderWidth: 1,
                paddingHorizontal: 5, width: Width(6), height: Width(6), borderColor: 'white'
            }}>


            </View>

        </Marker>

    _keyExtrac = (item, index) => index.toString();
    render() {
        var { dataItem, isShow } = this.state
        return (
            <View style={{ flex: 1 }}>
                {/* <Text> textInComponent </Text> */}
                <View style={{
                    backgroundColor: colors.peacockBlue,
                    flexDirection: 'row', justifyContent: 'space-between',
                    alignItems: 'center', paddingHorizontal: 10, paddingTop: paddingTopMul()
                }}>
                    <TouchableOpacity
                        onPress={() => this.setState({ isShow: !this.state.isShow })}
                        style={{ flexDirection: 'row', padding: 10, }}>

                        {
                            isShow == true ? <Text style={{ color: colors.white, fontSize: sizes.sText18 }}>Ẩn</Text> : <Text style={{ color: colors.white }}>Hiện</Text>
                        }
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => Utils.goscreen(this, "sc_Filtertracking")}
                        style={{ flexDirection: 'row', padding: 10, }}>
                        <Image style={[nstyles.nIcon20, { tintColor: colors.white }]} resizeMode='cover'
                            source={Images.icSearch} />
                        <Text style={{ color: colors.white, fontSize: sizes.sText18 }}> Tra cứu chi tiết</Text>
                    </TouchableOpacity>

                </View>
                <View style={{ flex: 1 }}>
                    <ClusteredMapView
                        isMultiTyle={true}
                        dataType={datatype}
                        style={{ flex: 1, }}
                        data={this.state.data}
                        // region={this.state.region}
                        initialRegion={INIT_REGION}
                        ref={(r) => { this.map = r }}
                        renderMarker={this.renderMarker}
                        renderCluster={this.renderCluster} />
                    {/* <MapPolyline initialRegion={INIT_REGION} /> */}

                    <View style={{ position: 'absolute', top: 0, left: 0, }}>
                        {this.state.isShow == true ?
                            <FlatList
                                contentContainerStyle={{ paddingTop: 0 }}
                                data={datatype}
                                renderItem={({ item, index }) => {
                                    return (<View key={index} style={{ flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 5, backgroundColor: colors.backgroundModal, }}>
                                        <View style={{
                                            backgroundColor: item.Color, borderRadius: Width(5), borderWidth: 1, marginHorizontal: 5,
                                            paddingHorizontal: 5, width: Width(5), height: Width(5), borderColor: 'white'
                                        }}></View>
                                        <Text style={{ color: colors.black_80 }}>{`${item.name}`}</Text>
                                    </View>)
                                }}
                                keyExtractor={this._keyExtrac}
                            // refreshing={this.state.refreshing}
                            // onRefresh={this._onRefresh}
                            /> : null
                        }
                    </View>
                </View>

                <View style={{
                    alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white,
                    paddingHorizontal: 10, paddingVertical: 10, width: '100%', flexDirection: 'row', paddingBottom: 20 + paddingBotX
                }}>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.openDrawer()}
                        style={{
                            borderRadius: 5, backgroundColor: colors.colorGrayBgr,
                            paddingHorizontal: 10,
                            alignItems: 'center', justifyContent: 'center', paddingVertical: 10
                        }}>
                        <Image source={Images.icSlideMenu} style={nstyles.nIcon20} resizeMode='contain' />
                    </TouchableOpacity>
                    <View style={{ flex: 1 }}>
                        {
                            dataItem ?
                                <TouchableOpacity style={{ flex: 1, marginHorizontal: 5 }}>
                                    <View style={{ flexDirection: 'row', }}>
                                        <Text style={{ color: colors.grayLight, fontWeight: 'bold', }}>{`Tên:`}</Text>
                                        <Text style={{ flex: 1 }}>{`${dataItem.HoTen}`}</Text>
                                        <Text >{`stt:${dataItem.SttLayNhiem}`}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', }}>
                                        <Text style={{ color: colors.grayLight, fontWeight: 'bold', }}>{`Trạng thái:`}</Text>
                                        <Text style={{ flex: 1 }}>{`${dataItem.TrangThai}`}</Text>
                                        <View style={{ backgroundColor: dataItem.Color, padding: 10, borderRadius: 10 }}></View>
                                    </View>
                                    <View style={{ flexDirection: 'row', }}>
                                        <Text style={{ color: colors.grayLight, fontWeight: 'bold', }}>{`Đời nhiễm:`}</Text>
                                        <Text style={{ flex: 1 }}>{`${dataItem.DoiLayNhiem}`}</Text>
                                    </View>
                                </TouchableOpacity> : <Text>  - N/A -</Text>
                        }
                    </View>
                </View>
                <IsLoading></IsLoading>
            </View>

        )
    }
}

export default RootMap