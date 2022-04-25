import React, { useState, useEffect, useRef, useCallback, memo } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList, ScrollView } from 'react-native'
import apis from '../../apis'
import { BarChart, Grid, XAxis, LineChart, YAxis, } from 'react-native-svg-charts'
import { Text as TextSVG } from 'react-native-svg'
import DatePicker from 'react-native-datepicker';
import moment from 'moment'
import { IsLoading } from '../../../components'
import { GetList_ThongKePA_TheoDonViTK } from '../../apis/ThongKeBaoCao'
import Utils from '../../../app/Utils';
import { reText } from '../../../styles/size';
import HtmlViewCom from '../../../components/HtmlView';
import { nstyles, nwidth } from '../../../styles/styles';
import InputRNCom from '../../../components/ComponentApps/InputRNCom';
import { colors } from '../../../styles';
import { Images } from '../../images';

import { ComponentChonNgay, ComponentLinhVuc } from './component';


const ChartTKDonVi = (props) => {

    const [pieData, setpieData] = useState([]);
    const [numMax, setnumMax] = useState(0);
    const [DataChart, setDataChart] = useState(props.dataChart ? props.dataChart : [])
    // Utils.nlog("data props", props)
    const keyName = props.keyName != '' ? props.keyName : 'DonVi';
    const XuLyData = useCallback(() => {
        let pieDataNew = props.data.map((value, index) => {
            return DataChart.map((item, index) => {
                Utils.nlog("data", keyName, value[keyName])
                return {
                    value: value[item.key] || 0,
                    TenDonVi: value[keyName],
                    svg: {
                        fill: item.fill,
                        onPress: () => { },
                    },
                    key: `pie-${index}-${item.key}`,
                }
            })
        })
        Utils.nlog("pie data------------", pieDataNew)
        setpieData(pieDataNew)
    }, [props.data])
    useEffect(() => {
        if (props.data && props.data.length > 0) {
            XuLyData();
        } else {
            setpieData([]);
        }
    }, [props.data])
    // const NameKhuVuc = Data ?
    //     Data.map((value, index) => (
    //         { TenDonVi: value.TenMuc }
    //     )
    //     ) : []
    useEffect(() => {
        numberMax()
    }, [pieData])

    // Utils.nlog("data ----------------pidataHai Long", Data);
    const numberMax = () => {
        let max = 0;
        for (let index = 0; index < pieData.length; index++) {
            for (let i = 0; i < pieData[index].length; i++) {
                if (pieData[index][i].value > max)
                    max = pieData[index][i].value
            }
        }
        setnumMax(max)
        // console.log("Sô mac lơn nhat", max)
    }
    const CUT_OFF = 20
    const Labels = ({ x, y, bandwidth, data }) => {
        return data.map((value, index) => {
            return (
                <TextSVG
                    key={index}
                    x={x(index) + (bandwidth / 2)}
                    y={value.value < CUT_OFF ? y(value.value) - 10 : y(value.value) + 10}
                    fontSize={10}
                    fill={value >= CUT_OFF ? 'white' : colors.black_60}
                    alignmentBaseline={'middle'}
                    textAnchor={'middle'}
                >
                    {value.value}
                </TextSVG>)
        })
    }
    return (
        <View style={{ backgroundColor: colors.white, paddingVertical: 10 }}>
            <FlatList
                data={DataChart}
                keyExtractor={(item, index) => index.toString()}
                numColumns={3}
                renderItem={({ item, index }) => {
                    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ height: 10, width: 50, backgroundColor: item.fill }}></View>
                        <Text style={{ color: colors.pumpkinOrange, fontSize: reText(12), paddingVertical: 2 }}>{item.name}</Text>
                    </View>
                }}
            />
            <View style={{
                height: 250,
                flexDirection: 'row',
                paddingHorizontal: 10
            }}>
                <YAxis
                    data={[0, numMax ? numMax : 100]}
                    formatLabel={(value, i) => `${value}`}
                    contentInset={{ top: 30, bottom: 10 }}
                    svg={{
                        fill: colors.black_80,
                        fontSize: 10,
                    }}
                    numberOfTicks={5}
                    style={{ paddingRight: 10 }}
                />
                <ScrollView horizontal={true} style={{ flexDirection: 'row', flex: 1, }}>
                    {
                        pieData.map((value, index) => {
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
                                        position: 'absolute', width: 160, left: -10, top: 100, fontSize: 14, color: colors.black_80, transform: [{
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
        </View>
    );
};

export default ChartTKDonVi

const styles = StyleSheet.create({
    row: {
        flex: 1,
        borderWidth: 0.5,
        borderColor: colors.peacockBlue,
        alignItems: "center",
        justifyContent: "center",
    },
});








