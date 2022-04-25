import React, { Component } from 'react'
import { Text, View, TouchableOpacity, Image } from 'react-native'

import { Marker, Callout } from 'react-native-maps'
import ClusteredMapView from './ClusteredMapView'
import Utils from '../../../../app/Utils'
import { colors } from '../../../../styles'
import { Width, nstyles } from '../../../../styles/styles'
import apis from '../../../apis'
import { IsLoading } from '../../../../components'
import { sizes } from '../../../../styles/size'
import { nGlobalKeys } from '../../../../app/keys/globalKey'
import { Images } from '../../../images'
import moment from 'moment'
const data = [
    {
        Id: 1,
        HoTen: "Nguyen Van B",
        SttLayNhiem: 4,
        DoiLayNhiem: 1,
        PhoneNumber: "",
        Active: true,
        Color: "#FF33CC",
        Time: "",
        location: {
            latitude: 11.387062,
            longitude: 106.996831
        },
    },
    {
        location: {
            latitude: 11.285649,
            longitude: 107.061954
        },
        Id: 2,
        HoTen: "Nguyen Van A",
        SttLayNhiem: 2,
        DoiLayNhiem: 1,
        PhoneNumber: "",
        Active: true,
        Color: "#FF33CC",
        Time: "",
    },
    {
        location: {
            latitude: 11.252743,
            longitude: 106.788286
        },
        Id: 3,
        HoTen: "Nguyen Van c",
        SttLayNhiem: 4,
        DoiLayNhiem: 2,
        PhoneNumber: "",
        Active: false,
        Color: "#FF0000",
        Time: "",
    },
    {
        location: {
            latitude: 11.159248,
            longitude: 106.526177
        },
        Id: 4,
        HoTen: "Nguyen Van D",
        SttLayNhiem: 4,
        DoiLayNhiem: 3,
        PhoneNumber: "",
        Active: false,
        Color: "#9933CC",
        Time: "",
    },
    {
        location: {
            latitude: 11.056368,
            longitude: 106.464223
        },
        Id: 5,
        HoTen: "Nguyen Van E",
        SttLayNhiem: 4,
        DoiLayNhiem: 2,
        PhoneNumber: "",
        Active: false,
        Color: "#FF0000",
        Time: "",
    },
    {
        location: {
            latitude: 10.621120,
            longitude: 106.667635
        },
        Id: 6,
        HoTen: "Nguyen Van F",
        SttLayNhiem: 4,
        DoiLayNhiem: 1,
        PhoneNumber: "",
        Active: false,
        Color: "#FF33CC",
        Time: "",
    },
    {
        location: {
            latitude: 10.644700,
            longitude: 106.627479
        },
        Id: 7,
        HoTen: "Nguyen Van G",
        SttLayNhiem: 4,
        DoiLayNhiem: 2,
        PhoneNumber: "",
        Active: false,
        Color: "#FF0000",
        Time: "",
    },
    {
        location: {
            latitude: 10.798712,
            longitude: 106.494661
        },
        Id: 8,
        HoTen: "Nguyen Van H",
        SttLayNhiem: 4,
        DoiLayNhiem: 1,
        PhoneNumber: "",
        Active: false,
        Color: "#FF33CC",
        Time: "",
    },
    {
        location: {
            latitude: 10.862175,
            longitude: 106.622692
        },
        Id: 9,
        HoTen: "Nguyen Van I",
        SttLayNhiem: 4,
        DoiLayNhiem: 3,
        PhoneNumber: "",
        Active: false,
        Color: "#9933CC",
        Time: "",
    },
    {
        location: {
            latitude: 10.722130,
            longitude: 106.696558
        },
        Id: 10,
        HoTen: "Nguyen Van K",
        SttLayNhiem: 4,
        DoiLayNhiem: 2,
        PhoneNumber: "",
        Active: false,
        Color: "#00CCFF",
        Time: "",
    },
    {
        Id: 11,
        HoTen: "Nguyen Van L",
        SttLayNhiem: 4,
        DoiLayNhiem: 2,
        PhoneNumber: "",
        Active: false,
        Color: "#FF0000",
        Time: "",
        location: {
            latitude: 11.996831,
            longitude: 106.387062
        },
    },
    {
        location: {
            latitude: 11.061954,
            longitude: 107.285649
        },
        Id: 12,
        HoTen: "Nguyen Van M",
        SttLayNhiem: 2,
        DoiLayNhiem: 2,
        PhoneNumber: "",
        Active: true,
        Color: "#FF0000",
        Time: "",
    },
    {
        location: {
            latitude: 11.788286,
            longitude: 106.252743
        },
        Id: 13,
        HoTen: "Nguyen Van N",
        SttLayNhiem: 4,
        DoiLayNhiem: 1,
        PhoneNumber: "",
        Active: false,
        Color: "#FF33CC",
        Time: "",
    },
    {
        location: {
            latitude: 11.526177,
            longitude: 106.159248
        },
        Id: 20,
        HoTen: "Nguyen Van O",
        SttLayNhiem: 4,
        DoiLayNhiem: 2,
        PhoneNumber: "",
        Active: false,
        Color: "#FF0000",
        Time: "",
    },
    {
        location: {
            latitude: 11.464223,
            longitude: 106.056368
        },
        Id: 14,
        HoTen: "Nguyen Van P",
        SttLayNhiem: 4,
        DoiLayNhiem: 3,
        PhoneNumber: "",
        Active: false,
        Color: "#9933CC",
        Time: "",
    },
    {
        location: {
            latitude: 10.667635,
            longitude: 106.621120
        },
        Id: 15,
        HoTen: "Nguyen Van Q",
        SttLayNhiem: 4,
        DoiLayNhiem: 1,
        PhoneNumber: "",
        Active: false,
        Color: "#FF33CC",
        Time: "",
    },
    {
        location: {
            latitude: 10.627479,
            longitude: 106.644700
        },
        Id: 16,
        HoTen: "Nguyen Van R",
        SttLayNhiem: 4,
        DoiLayNhiem: 2,
        PhoneNumber: "",
        Active: false,
        Color: "#FF0000",
        Time: "",
    },
    {
        location: {
            latitude: 10.494661,
            longitude: 106.798712
        },
        Id: 17,
        HoTen: "Nguyen Van T",
        SttLayNhiem: 4,
        DoiLayNhiem: 1,
        PhoneNumber: "",
        Active: false,
        Color: "#FF33CC",
        Time: "",
    },
    {
        location: {
            latitude: 10.622692,
            longitude: 106.862175
        },
        Id: 18,
        HoTen: "Nguyen Van S",
        SttLayNhiem: 4,
        DoiLayNhiem: 3,
        PhoneNumber: "",
        Active: false,
        Color: "#9933CC",
        Time: "",
    },
    {
        location: {
            latitude: 10.696558,
            longitude: 106.722130
        },
        Id: 19,
        HoTen: "Nguyen Van W",
        SttLayNhiem: 4,
        DoiLayNhiem: 3,
        PhoneNumber: "",
        Active: false,
        Color: "#9933CC",
        Time: "",
    }
]
const INIT_REGION = {
    latitude: 11.387062,
    longitude: 106.996831,
    latitudeDelta: 2,
    longitudeDelta: 2,
}
const datatype = [
    {
        Color: "#FF33CC",
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
        Color: "#FFFFFF",
        name: "Điểm đến của F0",
        DoiLayNhiem: 7,
    }

]
class RootMap extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            _Width: Width(80)
        }

    }
    _getdata = async () => {
        Utils.setGlobal(nGlobalKeys.TimeDateMap, moment(new Date()))
        nthisIsLoading.show();
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
        var timeMaps = Utils.getGlobal(nGlobalKeys.timeMaps, 90000);
        Utils.nlog("timeMaps", timeMaps)
        Utils.nlog("vao on get ds ")
        setInterval(async () => {
            var timenow = moment(new Date());
            var timeold = Utils.getGlobal(nGlobalKeys.TimeDateMap, moment(new Date()))
            var number = timenow.diff(timeold, "milliseconds");
            Utils.nlog("gia tri number va time map", number, timeMaps)
            if (number >= timeMaps) {
                Utils.setGlobal(nGlobalKeys.TimeDateMap, moment(new Date()))
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
        Utils.nlog("vao render clusster", cluster)
        const pointCount = cluster.pointCount,
            coordinate = cluster.coordinate,
            clusterId = cluster.clusterId
        const clusteringEngine = this.map.getClusteringEngineM(index);
        var clusteredPoints = clusteringEngine.getLeaves(clusterId, 100);
        Utils.nlog("gia tri clusteredPoints ", clusteredPoints)
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
    renderMarker = (data) => <Marker
        // title={}
        title={`Thứ tự:${data.SttLayNhiem} - Tên:${data.HoTen} - Đời nhiễm:${data.DoiLayNhiem}`}
        key={data.id || Math.random()} coordinate={data.location} >
        <View style={{
            backgroundColor: datatype[data.DoiLayNhiem - 1].Color, borderRadius: Width(5), borderWidth: 1,
            paddingHorizontal: 5, width: Width(5), height: Width(5), borderColor: 'white'
        }}>
        </View>
    </Marker>
    render() {
        return (
            <View style={{ flex: 1 }}>
                {/* <Text> textInComponent </Text> */}
                <ClusteredMapView
                    isMultiTyle={true}
                    dataType={datatype}
                    style={{ flex: 1, }}
                    data={this.state.data}
                    initialRegion={INIT_REGION}
                    ref={(r) => { this.map = r }}
                    renderMarker={this.renderMarker}
                    renderCluster={this.renderCluster} />
                <View style={{ position: 'absolute', top: 0, left: 0, }}>
                    {
                        datatype.map((item, index) => {
                            return <View key={index} style={{ flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 5, backgroundColor: colors.backgroundModal, }}>
                                <View style={{
                                    backgroundColor: item.Color, borderRadius: Width(5), borderWidth: 1, marginHorizontal: 5,
                                    paddingHorizontal: 5, width: Width(5), height: Width(5), borderColor: 'white'
                                }}></View>
                                <Text style={{ color: colors.black_80 }}>{`${item.name}`}</Text>
                            </View>
                        })
                    }

                </View>
                <View style={{
                    alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white,
                    paddingHorizontal: 10, paddingVertical: 10, width: '100%', flexDirection: 'row', paddingBottom: 20
                }}>
                    <TouchableOpacity
                        onPress={() => Utils.goscreen(this, 'ManHinh_Home')}
                        style={{
                            borderRadius: 5, backgroundColor: colors.colorGrayBgr,
                            marginHorizontal: 5, paddingHorizontal: 10,
                            alignItems: 'center', justifyContent: 'center', paddingVertical: 10
                        }}>
                        <Image source={Images.icBack} style={nstyles.nIcon24} resizeMode='cover' />
                        {/* <Text style={{ fontWeight: 'bold', fontSize: sizes.sText18, color: colors.white }}>{'Thoát'}</Text> */}
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => Utils.goscreen(this, "homedangky")}
                        style={{
                            paddingVertical: 10, backgroundColor: colors.waterBlue, borderRadius: 5,
                            flex: 1, alignItems: 'center', justifyContent: 'center'
                        }}>
                        <Text style={{ fontWeight: 'bold', fontSize: sizes.sText18, color: colors.white }}>{'Đăng ký theo dõi'}</Text>
                    </TouchableOpacity>
                </View>
                <IsLoading />
            </View>

        )
    }
}

export default RootMap