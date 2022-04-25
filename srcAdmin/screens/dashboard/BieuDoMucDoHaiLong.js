import React, { useState, useEffect, Component } from 'react'
import { Text, View, SafeAreaView, FlatList, TouchableOpacity, Modal, Image, ScrollView } from 'react-native'
import { BarChart, Grid, XAxis, LineChart, YAxis, } from 'react-native-svg-charts'
import Utils from '../../../app/Utils'
import apis from '../../apis'
import { sizes, colors } from '../../../styles'
import { Images } from '../../images'
import { reText } from '../../../styles/size'
import { nstyles, nwidth } from '../../../styles/styles'
import Moment from 'moment'
import { Text as TextSVG } from 'react-native-svg'
import momment from 'moment'
import { nGlobalKeys } from '../../../app/keys/globalKey'
import { ConfigScreenDH } from '../../routers/screen'
import AppCodeConfig from '../../../app/AppCodeConfig'


const DataChart = [
    { name: 'PA giải quyết', fill: '#FEA2B6' },
    { name: 'PA có đánh giá', fill: '#8AC8F1' },
    { name: 'Hài Lòng', fill: '#FEE1A9' },
    { name: 'Chấp nhận', fill: '#ECEDEF' },
    { name: 'Không hài lòng', fill: '#97D9D9' }
]
const widthColumn = () => (nwidth() - 10) / 5
const BieuDoMucDoHaiLong = (props) => {
    const [Data, setData] = useState([]);

    const [dateFR, setdateFR] = useState(momment(new Date()).add(-30, 'days').format('DD/MM/YYYY'))
    const [dateTO, setdateTO] = useState(momment(new Date()).format('DD/MM/YYYY'))
    const [numMax, setNumMax] = useState(0)

    const getData = async (tungay = '', denngay = '') => {
        if (tungay != '' && denngay != '') {
            let res = await apis.ThongKeBaoCao.GetList_ThongKePA_TheoDonViDanhGia(tungay, denngay);//Truyền thời gian vào đây
            // Utils.nlog("_______________-res,", res)
            if (res.status == 1) {
                setData(res.data)
            }
        } else {
            let res = await apis.ThongKeBaoCao.GetList_ThongKePA_TheoDonViDanhGia();
            if (res.status == 1) {
                setData(res.data)
            }
        }
    }
    useEffect(() => {
        getData();
    }, [])

    const pieData = Data ?
        Data.map((value, index) => (
            [
                {
                    value: value.SoLuong,
                    TenDonVi: value.TenDonVi,
                    svg: {
                        fill: '#FEA2B6',
                        onPress: () => Utils.getGlobal(nGlobalKeys.isChart, false, AppCodeConfig.APP_ADMIN) ? Utils.goscreen(props.nthis, ConfigScreenDH.DanhSachPhanAnhBD, { Value: value, Key: 4, tungay: dateFR, denngay: dateTO, LoaiMucDo: 100 }) : null,
                    },
                    key: `pie-0`,
                    // ...value
                },
                {
                    value: value.CoDanhGia,
                    TenDonVi: value.TenDonVi,
                    svg: {
                        fill: '#8AC8F1',
                        onPress: () => Utils.getGlobal(nGlobalKeys.isChart, false, AppCodeConfig.APP_ADMIN) ? Utils.goscreen(props.nthis, ConfigScreenDH.DanhSachPhanAnhBD, { Value: value, Key: 4, tungay: dateFR, denngay: dateTO, LoaiMucDo: 101 }) : null,
                    },
                    key: `pie-1`,
                    // ...value
                },
                {
                    value: value.HaiLong,
                    TenDonVi: value.TenDonVi,
                    svg: {
                        fill: '#FEE1A9',
                        onPress: () => Utils.getGlobal(nGlobalKeys.isChart, false, AppCodeConfig.APP_ADMIN) ? Utils.goscreen(props.nthis, ConfigScreenDH.DanhSachPhanAnhBD, { Value: value, Key: 4, tungay: dateFR, denngay: dateTO, LoaiMucDo: 1 }) : null,
                    },
                    key: `pie-2`,
                    // ...value
                },
                {
                    value: value.ChapNhan,
                    TenDonVi: value.TenDonVi,
                    svg: {
                        fill: '#ECEDEF',
                        onPress: () => Utils.getGlobal(nGlobalKeys.isChart, false, AppCodeConfig.APP_ADMIN) ? Utils.goscreen(props.nthis, ConfigScreenDH.DanhSachPhanAnhBD, { Value: value, Key: 4, tungay: dateFR, denngay: dateTO, LoaiMucDo: 2 }) : null,
                    },
                    key: `pie-3`,
                    // ...value
                },
                {
                    value: value.KhongHaiLong,
                    TenDonVi: value.TenDonVi,
                    svg: {
                        fill: '#97D9D9',
                        onPress: () => Utils.getGlobal(nGlobalKeys.isChart, false, AppCodeConfig.APP_ADMIN) ? Utils.goscreen(props.nthis, ConfigScreenDH.DanhSachPhanAnhBD, { Value: value, Key: 4, tungay: dateFR, denngay: dateTO, LoaiMucDo: 3 }) : null,
                    },
                    key: `pie-4`,
                    // ...value
                }
            ]
        )) : []

    const NameKhuVuc = Data ?
        Data.map((value, index) => (
            {
                TenDonVi: value.TenDonVi,
            }
        )
        ) : []
    useEffect(() => {
        numberMax()
    }, [pieData])

    Utils.nlog("data ----------------pidataHai Long", Data);
    const numberMax = () => {
        var max = 0;
        for (let index = 0; index < pieData.length; index++) {
            for (let i = 0; i < pieData[index].length; i++) {
                // console.log("----------------------------", pieData[index][i].value)
                if (pieData[index][i].value > max)
                    max = pieData[index][i].value
            }
        }
        setNumMax(max)
        // console.log("Sô mac lơn nhat", max)
    }

    const handleFilter = () => {
        Utils.goscreen(props.nthis, ConfigScreenDH.Modal_Options, {
            isUseDate: true, callBack: callbackFilter,
            dateForm: dateFR,
            dateTo: dateTO
        })
    }

    const callbackFilter = (dateForm, dateTo, Options) => {
        // Utils.nlog('calback', dateForm + ',' + dateTo + ',' + Options)
        if (dateForm && dateTo) {
            setdateFR(dateForm);
            setdateTO(dateTo);
            getData(Moment(dateForm, 'DD/MM/YYYY').format('DD/MM/YYYY'), Moment(dateTo, 'DD/MM/YYYY').format('DD/MM/YYYY'))
        } else {
            if (Options) {
                // Utils.nlog('calback----------optione    --------------', Options);
                setdateFR(Options);
                setdateTO(Moment(new Date()).format('DD-MM-YYYY'));
            }
            const now = Moment(new Date()).format('DD-MM-YYYY');
            getData(Moment(Options, 'DD/MM/YYYY').format('DD/MM/YYYY'), Moment(now, 'DD/MM/YYYY').format('DD/MM/YYYY'))
        }
    }

    const CUT_OFF = 20
    // Utils.nlog("~~~~~~~~~~~~~~Data", Data)
    const Labels = ({ x, y, bandwidth, data }) => {
        return data.map((value, index) => {
            return (
                <TextSVG
                    // fontWeight="bold"
                    key={index}
                    x={x(index) + (bandwidth / 2)}
                    y={value.value < CUT_OFF ? y(value.value) - 10 : y(value.value) + 10}
                    fontSize={10}
                    fill={value >= CUT_OFF ? 'white' : 'black'}
                    alignmentBaseline={'middle'}
                    textAnchor={'middle'}
                >
                    {value.value}
                </TextSVG>)
        })
    }


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{}}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                    {/* <Text style={{ fontWeight: 'bold', color: colors.redStar, paddingVertical: 10, fontSize: reText(18), width: widthColumn() * 4 + widthColumn() / 2, paddingLeft: 5 }} numberOfLines={2}>{'Tình hình An ninh - trật tự tỉnh ' + TenTinh}</Text> */}
                    <Text style={{ fontWeight: 'bold', color: colors.redStar, paddingVertical: 10, fontSize: reText(18), width: widthColumn() * 4 + widthColumn() / 2, paddingLeft: 5 }} numberOfLines={2}>{'Mức độ hài lòng của người dân về kết quả xử lý'}</Text>
                    <View style={{ width: widthColumn() - widthColumn() / 2, alignItems: 'center' }}>
                        <TouchableOpacity onPress={handleFilter} style={{ padding: 5, borderWidth: 1, borderColor: colors.colorHeaderApp }}>
                            <Image source={Images.icFilter} style={[nstyles.nIcon16, { tintColor: colors.black }]} resizeMode='cover' />
                        </TouchableOpacity>
                    </View>
                </View>
                {
                    Data && Data.length ?
                        <>
                            <View style={{
                                height: 250,
                                flexDirection: 'row',
                                paddingHorizontal: 10
                            }}>

                                <YAxis
                                    data={[0, numMax]}
                                    // key={}
                                    formatLabel={(value, i) => `${value}`}
                                    contentInset={{ top: 30, bottom: 10 }}
                                    svg={{
                                        fill: 'grey',
                                        fontSize: 10,
                                    }}
                                    numberOfTicks={5}
                                />
                                <ScrollView horizontal={true} style={{ flexDirection: 'row', flex: 1, }}>
                                    {
                                        pieData.map((value, index) => {
                                            Utils.nlog("<><><>%%%%%%%%%", value)
                                            return (
                                                <View key={index} style={{ flex: 1, flexDirection: 'row' }}>
                                                    <BarChart style={{ height: '100%', width: 120 }}
                                                        yMin={0}

                                                        yMax={numMax}
                                                        data={pieData[index]}
                                                        formatLabel={"Biểu đồ nhé"}
                                                        yAccessor={({ item }) => item.value}
                                                        // svg={{ fill }}
                                                        contentInset={{ top: 30, bottom: 10 }}
                                                        gridMin={0}
                                                    >
                                                        <Grid direction={Grid.Direction.HORIZONTAL} />
                                                        <Labels />
                                                    </BarChart>
                                                    <Text style={{
                                                        position: 'absolute', width: 160, left: -10, top: 100, fontSize: 14, color: colors.colorGrayIcon, transform: [{
                                                            rotate: '310deg',
                                                        }]
                                                    }}>{value[0].TenDonVi}</Text>
                                                    <View style={{ height: '85%', width: 1, backgroundColor: colors.black_20, marginTop: 30 }}></View>

                                                </View>
                                            )
                                        })
                                    }
                                </ScrollView>
                            </View>
                            {/* <View style={{ flexDirection: 'row', marginTop: 5, flex: 1, justifyContent: 'space-evenly' }}>
                                {NameKhuVuc.map((value, index) => {
                                    return (
                                        <Text key={index} style={{
                                            fontSize: 8, transform: [{
                                                rotate: '335deg'
                                            }]
                                        }}>{value.TenDonVi}</Text>
                                    )
                                })}
                            </View> */}
                            <FlatList
                                data={DataChart}
                                style={{ marginTop: 20 }}
                                numColumns={3}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => {
                                    return (<View style={{ flex: 1, marginHorizontal: 5, minHeight: 40, paddingVertical: 2 }}>
                                        <View style={{ height: 10, width: 50, backgroundColor: item.fill }}></View>
                                        <Text style={{ color: 'black', fontSize: reText(12), paddingVertical: 2 }}>{item.name}</Text></View>)
                                }}>

                            </FlatList>
                        </>
                        :
                        <Text style={{ textAlign: 'center', paddingVertical: 5, fontSize: reText(12) }}>{'Không có dữ liệu...'}</Text>
                }
            </View>

        </SafeAreaView >
    );

}

export default BieuDoMucDoHaiLong
