import React, { useState, useEffect, Component } from 'react'
import { Text, View, SafeAreaView, Image, TouchableOpacity } from 'react-native'
import { BarChart, Grid, XAxis, LineChart, YAxis } from 'react-native-svg-charts'
import Utils from '../../../app/Utils'
import apis from '../../apis'
import { sizes, colors } from '../../../styles'
import { reText } from '../../../styles/size'
import { Images } from '../../images'
import { nstyles } from '../../../styles/styles'
import Moment from 'moment'
import { Text as TextSVG } from 'react-native-svg'
import { nGlobalKeys } from '../../../app/keys/globalKey'
import { ConfigScreenDH } from '../../routers/screen'
import AppCodeConfig from '../../../app/AppCodeConfig'
const BieuDoPATheoNam = (props) => {
    const [Data, setData] = useState([])
    const [Year, setYear] = useState(Moment(new Date()).format('YYYY'))
    const getData = async (Year = '') => {
        if (Year != '') {
            let res = await apis.BieuDo.BieuDo_PhanAnhTheoThang(Year);
            if (res.status == 1) {
                setData(res.data)
            }
        } else {
            let res = await apis.BieuDo.BieuDo_PhanAnhTheoThang();
            if (res.status == 1) {
                setData(res.data)
            }
        }
    }
    useEffect(() => {
        getData(Year);

    }, [])
    const randomColor = () => ('#' + ((Math.random() * 0xffffff) << 0).toString(16) + '000000').slice(0, 7)
    const pieData = Data
        .map((value, index) => ({
            svg: {
                fill: randomColor(),
                onPress: () => Utils.getGlobal(nGlobalKeys.isChart, false, AppCodeConfig.APP_ADMIN) ? Utils.goscreen(props.nthis, ConfigScreenDH.DanhSachPhanAnhBD, { Value: value, Key: 2, Year: Year }) : null,
            },
            key: `pie-${index}`, ...value
        }))
    Utils.nlog("data ----------------pidata theo tháng", pieData);
    const chooseYearCom = () => {
        return (
            <View>
                <Text>Chon nam</Text>
            </View>
        )
    }
    const CUT_OFF = 20
    const Labels = ({ x, y, bandwidth, data }) => (
        Data.map((value, index) => {
            return (<TextSVG
                key={index}
                x={x(index) + (bandwidth / 2)}

                y={value.SoLuong < CUT_OFF ? y(value.SoLuong) - 10 : y(value.SoLuong) - 10}
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
            <View style={{ paddingHorizontal: 5 }}>
                {/* <View style={{ alignSelf: 'center', padding: 10, }}>
                    <Text style={{ fontSize: sizes.sizes.sText16, color: colors.redStar, fontWeight: 'bold' }}>{'Biểu đồ số lượng phản ánh theo tháng'}</Text>
                </View> */}

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                    <Text style={{ fontWeight: 'bold', color: colors.redStar, paddingVertical: 10, fontSize: reText(18) }} numberOfLines={2}>{'Số lượng phản ánh theo tháng'}</Text>
                    {/* <TouchableOpacity onPress={handleFilter} style={{ padding: 5, flexDirection: 'row' }}>
                        <Image source={Images.icFilter} style={[nstyles.nIcon16, { tintColor: colors.brownGreyThree }]} resizeMode='cover' />
                    </TouchableOpacity> */}
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={() => {
                        const YearBack = Moment(Year, 'YYYY').add(-1, 'years').format('YYYY')
                        getData(YearBack)
                        setYear(YearBack)
                    }} activeOpacity={0.5} style={{ padding: 5 }}>
                        <Image source={Images.icUndo} style={[nstyles.nIcon18, { tintColor: colors.colorHeaderApp }]} />
                    </TouchableOpacity>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: colors.colorHeaderApp, fontWeight: 'bold' }}>{'Năm ' + Year}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            const YearNext = Moment(Year, 'YYYY').add(1, 'years').format('YYYY')
                            getData(YearNext)
                            setYear(YearNext)
                        }}
                        activeOpacity={0.5} style={{ padding: 5 }}>
                        <Image source={Images.icNext} style={[nstyles.nIcon18, { tintColor: colors.colorHeaderApp }]} />
                    </TouchableOpacity>
                </View>
                <View style={{
                    height: 200,
                    flexDirection: 'row',

                }}>

                    <YAxis
                        data={Data && Data.map(item => item.SoLuong)}
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
                        gridMin={0}
                        contentInset={{ top: 30, bottom: 10 }}>
                        <Grid />
                        <Labels />
                    </BarChart>

                </View>

                <XAxis
                    data={Data}
                    formatLabel={(value, index) => `${Data[index].thang}`}
                    contentInset={{ left: 20, right: 10 }}
                    svg={{ fontSize: 10, fill: 'black' }}
                />

            </View>

        </SafeAreaView>
    );

}

export default BieuDoPATheoNam
