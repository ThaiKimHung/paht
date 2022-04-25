import React, { useState, useEffect, Component } from 'react'
import { Text, View, SafeAreaView, FlatList, TouchableOpacity, Modal, Image } from 'react-native'
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
import { appConfig } from '../../../app/Config'
import { nGlobalKeys } from '../../../app/keys/globalKey'
import { ConfigScreenDH } from '../../routers/screen'
import AppCodeConfig from '../../../app/AppCodeConfig'

const widthColumn = () => (nwidth() - 10) / 5
const TinhHinhAnNinhTratTu = (props) => {
    const [Data, setData] = useState([]);

    const [dateFR, setdateFR] = useState(momment(new Date()).add(-30, 'days').format('DD/MM/YYYY'))
    const [dateTO, setdateTO] = useState(momment(new Date()).format('DD/MM/YYYY'))
    const [TenTinh, setTenTinh] = useState(Utils.getGlobal(nGlobalKeys.TenTinh, '', AppCodeConfig.APP_ADMIN))
    const [VisibalModal, setVisibalModal] = useState(false)
    const getData = async (tungay = '', denngay = '') => {
        if (tungay != '' && denngay != '') {
            let res = await apis.BieuDo.BieuDo_PhanAnhTinhTrang(tungay, denngay);
            if (res.status == 1) {
                setData(res.data)
            }
        } else {
            let res = await apis.BieuDo.BieuDo_PhanAnhTinhTrang();
            if (res.status == 1) {
                setData(res.data)
            }
        }
    }
    useEffect(() => {
        getData();

    }, [])
    const randomColor = () => ('#' + ((Math.random() * 0xffffff) << 0).toString(16) + '000000').slice(0, 7)
    const pieData = Data ?
        Data.map((value, index) => ({
            svg: {
                fill: randomColor(),
                onPress: () => Utils.getGlobal(nGlobalKeys.isChart, false, AppCodeConfig.APP_ADMIN) ? Utils.goscreen(props.nthis, ConfigScreenDH.DanhSachPhanAnhBD, { Value: value, Key: 1, tungay: dateFR, denngay: dateTO }) : null,
            },
            key: `pie-${index}`, ...value
        })) : []
    Utils.nlog("data ----------------pidata", pieData);



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


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{}}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                    {/* <Text style={{ fontWeight: 'bold', color: colors.redStar, paddingVertical: 10, fontSize: reText(18), width: widthColumn() * 4 + widthColumn() / 2, paddingLeft: 5 }} numberOfLines={2}>{'Tình hình An ninh - trật tự tỉnh ' + TenTinh}</Text> */}
                    <Text style={{ fontWeight: 'bold', color: colors.redStar, paddingVertical: 10, fontSize: reText(18), width: widthColumn() * 4 + widthColumn() / 2, paddingLeft: 5 }} numberOfLines={2}>{'Phản ánh theo ' + appConfig.IdSource == 'CA' ? "lĩnh vực" : "chuyên mục"}</Text>
                    <View style={{ width: widthColumn() - widthColumn() / 2, alignItems: 'center' }}>
                        <TouchableOpacity onPress={handleFilter} style={{ padding: 5, borderWidth: 1, borderColor: colors.colorHeaderApp }}>
                            <Image source={Images.icFilter} style={[nstyles.nIcon16, { tintColor: colors.black }]} resizeMode='cover' />
                        </TouchableOpacity>
                    </View>
                </View>
                {
                    Data ?
                        <>
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
                                <BarChart style={{ flex: 1, height: '100%', }} data={pieData}
                                    formatLabel={"Biểu đồ nhé"}
                                    yAccessor={({ item }) => item.SoLuong}
                                    // svg={{ fill }}
                                    contentInset={{ top: 30, bottom: 10 }}
                                    gridMin={0}
                                >

                                    <Grid direction={Grid.Direction.HORIZONTAL} />
                                    <Labels />
                                </BarChart>

                            </View>

                            {/* <XAxis
                                style={{ paddingVertical: 10, }}
                                data={Data}
                                formatLabel={(value, index) => `${index}`}
                                contentInset={{ left: 20, right: 10 }}
                                svg={{ fontSize: 10, fill: 'black' }}
                            /> */}
                            <FlatList
                                data={pieData}
                                style={{ marginTop: 20 }}
                                numColumns={3}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => {
                                    return (<View style={{ flex: 1, marginHorizontal: 5, minHeight: 40, paddingVertical: 2 }}>
                                        <View style={{ height: 10, width: 40, backgroundColor: item.svg.fill, }}></View>
                                        <Text style={{ color: 'black', fontSize: reText(12), paddingVertical: 2 }}>{item.TenChuyenMuc}</Text></View>)
                                }}>

                            </FlatList>
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

export default TinhHinhAnNinhTratTu
