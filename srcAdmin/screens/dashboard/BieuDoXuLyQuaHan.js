import React, { useState, useEffect, Component } from 'react'
import { Text, View, SafeAreaView, FlatList, TouchableOpacity, Modal, Image } from 'react-native'
import { BarChart, Grid, XAxis, LineChart, YAxis, PieChart } from 'react-native-svg-charts'
import Utils from '../../../app/Utils'
import apis from '../../apis'
import { sizes, colors } from '../../../styles'
import { Images } from '../../images'
import { reText, reSize } from '../../../styles/size'
import { nstyles, nwidth } from '../../../styles/styles'
import Moment from 'moment'
import { Text as TextSVG } from 'react-native-svg'
import { nGlobalKeys } from '../../../app/keys/globalKey'
import { ConfigScreenDH } from '../../routers/screen'
import AppCodeConfig from '../../../app/AppCodeConfig'

const dataLoaiBD = [
    {
        id: 1,
        Name: "Biểu đồ cột",
    },
    {
        id: 2,
        Name: "Biểu đồ tròn",
    },
];

const widthColumn = () => (nwidth() - 10) / 5
const BieuDoXuLyQuaHan = (props) => {
    const [Data, setData] = useState([]);
    const [dateFR, setdateFR] = useState(Moment(new Date()).add(-30, 'days').format('DD/MM/YYYY'))
    const [dateTO, setdateTO] = useState(Moment(new Date()).format('DD/MM/YYYY'))
    const [selectLoaiBD, setSelectLoaiBD] = useState(dataLoaiBD[0]);

    const getData = async (tungay = '', denngay = '') => {
        if (tungay != '' && denngay != '') {
            let res = await apis.BieuDo.GetList_DanhSachDonViPhanAnhQuaHan(tungay, denngay);
            // Utils.nlog("<><><><>", res)
            if (res.status == 1) {
                setData(res.data)
            }
            else {
                setData([])
            }
        } else {
            let res = await apis.BieuDo.GetList_DanhSachDonViPhanAnhQuaHan();
            if (res.status == 1) {
                setData(res.data)
            }
            else {
                setData([])
            }
        }
    }

    useEffect(() => {
        getData();
    }, [])

    const randomColor = () => ('#' + ((Math.random() * 0xffffff) << 0).toString(16) + '000000').slice(0, 7)
    const pieData = Data ?
        Data.map((value, index) => ({
            value: value.SoLuong,
            name: value.TenPhuongXa,
            svg: {
                fill: randomColor(),
                onPress: () => Utils.getGlobal(nGlobalKeys.isChart, false, AppCodeConfig.APP_ADMIN) ? Utils.goscreen(props.nthis, ConfigScreenDH.DanhSachPhanAnhBD, { Value: value, Key: 3, tungay: dateFR, denngay: dateTO }) : null,
            },
            key: `pie-${index}`, ...value
        })) : []
    // Utils.nlog("data ----------------pidata", pieData);
    const handleFilter = () => {
        // alert(dateFR)
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
            getData(Moment(dateForm, 'DD/MM/YYYY').format('YYYY-MM-DD'), Moment(dateTo, 'DD/MM/YYYY').format('YYYY-MM-DD'))
        } else {
            if (Options) {
                // Utils.nlog('calback----------optione    --------------', Options);
                setdateFR(Options);
                setdateTO(Moment(new Date()).format('DD-MM-YYYY'));
            }
            const now = Moment(new Date()).format('DD-MM-YYYY');
            getData(Moment(Options, 'DD/MM/YYYY').format('YYYY-MM-DD'), Moment(now, 'DD/MM/YYYY').format('YYYY-MM-DD'))
        }
    }

    const CUT_OFF = 20
    const Labels = ({ x, y, bandwidth, data }) => (

        Data.map((value, index) => {
            return (<TextSVG
                key={index}
                x={x(index) + (bandwidth / 2)}

                y={value.SoLuong < CUT_OFF ? y(value.SoLuong) - 10 : y(value.SoLuong) + 10}
                fontSize={14}
                fill={value >= CUT_OFF ? 'white' : 'black'}
                alignmentBaseline={'middle'}
                textAnchor={'middle'}
            >
                {value.SoLuong && value.SoLuong > 0 ? value.SoLuong : ''}
            </TextSVG>)


        }))

    const _viewItem = (item, key) => {
        // Utils.nlog("giá tị item", item)
        return (
            <View
                // key={item}
                style={{
                    flex: 1,
                    paddingHorizontal: 10,
                    margin: 2,

                }}>
                <Text style={{ textAlign: 'center', paddingVertical: 10 }} >{item[key]}</Text>
            </View>
        )
    }

    const _selectBieuDo = () => {
        Utils.goscreen(props.nthis, ConfigScreenDH.Modal_ComponentSelectProps, {
            callback: (val) => setSelectLoaiBD(val),
            item: selectLoaiBD,
            title: "Danh sách loại biểu đồ",
            AllThaoTac: dataLoaiBD,
            ViewItem: (item) => _viewItem(item, "Name"),
            Search: false,
            key: "Name",
        });
    }
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{}}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                    <Text style={{ fontWeight: 'bold', color: colors.redStar, paddingVertical: 10, fontSize: reText(18), width: widthColumn() * 4 + widthColumn() / 2, paddingLeft: 5 }} numberOfLines={2}>{'Các đơn vị xử lý quá hạn'}</Text>
                    <View style={{ width: widthColumn() - widthColumn() / 2, alignItems: 'center' }}>
                        <TouchableOpacity onPress={handleFilter} style={{ padding: 5, borderWidth: 1, borderColor: colors.colorHeaderApp }}>
                            <Image source={Images.icFilter} style={[nstyles.nIcon16, { tintColor: colors.black }]} resizeMode='cover' />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ marginHorizontal: 5, flexDirection: 'row' }}>
                    <TouchableOpacity style={{ marginHorizontal: 5, borderWidth: 0.5, flexDirection: 'row', paddingVertical: 5, paddingHorizontal: 5 }} onPress={_selectBieuDo}>
                        <Text style={{ marginRight: 5 }}>{selectLoaiBD.Name}</Text>
                        <Image source={Images.icDropDown} style={{ width: 12, height: 7, tintColor: colors.black_80, alignSelf: 'center' }} />
                    </TouchableOpacity>
                </View>
                {
                    Data ?
                        <>

                            {selectLoaiBD.id == 1 ?
                                <View>
                                    <View style={{
                                        height: 200,
                                        flexDirection: 'row',
                                        paddingHorizontal: 10
                                    }}>

                                        <YAxis
                                            data={Data.map(item => item.SoLuong).concat([0])}
                                            // key={}
                                            formatLabel={(value, i) => `${value}`}
                                            contentInset={{ top: 30, bottom: 10 }}
                                            svg={{
                                                fill: 'grey',
                                                fontSize: 10,
                                            }}
                                            numberOfTicks={5}
                                        />
                                        <BarChart style={{ flex: 1, height: '100%', }}
                                            data={pieData}
                                            formatLabel={"Biểu đồ nhé"}
                                            yAccessor={({ item }) => item.SoLuong}
                                            gridMin={0}
                                            // svg={{ fill }}
                                            contentInset={{ top: 30, bottom: 10 }}>
                                            <Grid direction={Grid.Direction.HORIZONTAL} />
                                            <Labels />
                                        </BarChart>

                                    </View>
                                    <FlatList
                                        data={pieData}
                                        style={{ marginTop: 20 }}
                                        numColumns={3}
                                        renderItem={({ item, index }) => {
                                            return (<View style={{ flex: 1, marginHorizontal: 5, minHeight: 40, paddingVertical: 2 }}>
                                                <View style={{ height: 10, width: 40, backgroundColor: item.svg.fill, }}></View>
                                                <Text style={{ color: 'black', fontSize: reText(12), paddingVertical: 2 }}>{item.TenPhuongXa}</Text></View>)
                                        }}>

                                    </FlatList>
                                </View>
                                :
                                <View style={{ flexDirection: 'row', marginHorizontal: 10 }}>
                                    <View style={{ flex: 1 }}>
                                        <PieChart style={{ height: 200 }} data={pieData} innerRadius={'0%'} outerRadius={'100%'} />
                                    </View>
                                    <View>
                                        {pieData.map((item, index) => {
                                            return (
                                                <View key={`pie-${index}`} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
                                                    <View style={{ width: reSize(15), height: reSize(15), borderRadius: 10, backgroundColor: item.svg.fill }} />
                                                    <Text style={{ paddingHorizontal: 5, color: colors.black }}>{`${item.name} (${item.value})`}</Text>
                                                </View>
                                            )
                                        })}
                                    </View>
                                </View>}

                        </>
                        :
                        <Text style={{ textAlign: 'center', paddingVertical: 5, fontSize: reText(12) }}>{'Không có dữ liệu...'}</Text>
                }


                {/* <Modal style={{ flex: 1, backgroundColor: 'rgba(52, 52, 52, 0.8)', top: 0, left: 0, right: 0, bottom: 0 }} visible={VisibalModal} >
                    <View style={{ height: 100 }}><Text>taam hihi</Text></View>
                </Modal> */}
            </View>

        </SafeAreaView >
    );

}

export default BieuDoXuLyQuaHan
