import React, { useEffect, useState, useRef } from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types';
import { colors } from '../../../../chat/styles';
import Utils from '../../../../app/Utils';
import Svg, { Text as TextSVG, TextPath, Path, Line } from 'react-native-svg';
import { IsLoading } from '../../../../components';
import moment from 'moment'
import { indexOf } from 'lodash';
const listColor_test = [
    "green",
    "blue",
    "pink"
]
const ChartCotChong = (props) => {
    const [numMax, setnumMax] = useState(0);
    const refLoading = useRef(null)
    const { listKey = [], data = [], height = 500, width, numRow,
        listColor, dvt, keylabel, heightLabel, listGhichu = [],
        nameBD = '', widthLabel = 100, isLoading = true,
        idTopic, LoaiTinTuc = [], Title = '', LoaiBaiViet = []
        // onChitiet = () => { },
    } = props;
    useEffect(() => {
        if (isLoading) {
            refLoading.current.show();
        } else {
            refLoading.current.hide();
        }
    }, [isLoading])
    const tinhMax = () => {
        let max = 0;
        data.forEach(obj => {
            let sum = 0;
            listKey.forEach(el => {
                if (obj.hasOwnProperty(el)) {
                    sum += obj[el];
                }
            })
            // Utils.nlog("sum", sum)
            max = max > sum ? max : sum;
        });
        setnumMax(max)
    }
    useEffect(() => {
        if (listKey && data) {
            tinhMax()
        }
    }, [listKey, data]);
    // Utils.nlog("max------data--------", numMax);


    const OnString = (text) => {
        return text.slice(0, 10) + ' 23:59:59'
    }

    const onChitietS = (dateFrom, sentiments) => {
        console.log('date ngay vao ', dateFrom.date)
        let dateto = OnString(dateFrom.date) // lấy ra cuối ngày
        console.log('trang trai truyen vao', sentiments)
        console.log('gia tri data--------', sentiments)
        Utils.goscreen({ props: props }, 'Modal_DSChiTietThongKe', {
            title: Title,
            IdTopic: idTopic, // topic lấy từ props index xún
            fromdate: dateFrom.date, // ngày được chọn
            todate: dateto,
            SacThai: sentiments === 1 ? [-1] : [-1, 0, 1],  // sắc thái
            LoaiTinTuc: LoaiTinTuc, // loại tin tức
            LoaiBaiViet: LoaiBaiViet,
        })
    }
    const renderShap = (e, i, ob) => {

        Utils.nlog("----ê-----ê", e, i,)
        return <TouchableOpacity onPress={() => onChitietS(ob, i)} style={{
            height: `${(ob[e]) * 100 / numMax}%`,
            backgroundColor: listColor[i],
            width: width,
        }}></TouchableOpacity>
    }

    const renderItemChart = (ee, i, isLabel = false) => {

        if (isLabel) {
            return <View key={i} style={{
                width: width + 20, transform: [{ rotate: "10deg" }]
            }}>
                <Svg
                    style={{
                        height: 60, width: width + 20,
                    }}
                >
                    <Line stroke-linecap="undefined"
                        stroke-linejoin="undefined"
                        id="svg_5"
                        x1={`${12}`}
                        y1={`${40}`}
                        x2={`${width - 10}`}
                        y2={`${0}`}
                        stroke={colors.BackgroundHome}
                        fill="none" />
                    <TextSVG fontSize="10" fontWeight='bold' fill={colors.white}>
                        <TextPath
                            href="#svg_5"
                            startOffset={0}>{moment(ee[keylabel]).format('DD-MM')}</TextPath>
                    </TextSVG>
                </Svg>
            </View>
        } else {
            return <View key={i} style={{
                width: width + 20,
                justifyContent: 'flex-end',
            }}>
                {
                    listKey.map((e, i) => renderShap(e, i, ee))
                }
            </View>
        }
    }
    const renderGhiChu = (itemGC, indexGC) => {
        return <View style={{ flexDirection: 'row', paddingHorizontal: 10, alignItems: 'center' }}>
            <View style={{
                width: 20, height: 20,
                backgroundColor: listColor[indexGC],
            }}>
            </View>
            <Text style={{ paddingHorizontal: 10, color: colors.white }}>{itemGC}</Text>
        </View>
    }
    return (
        <View style={{ marginVertical: 5, marginBottom: -100 }}>
            <View>
                {/* <Text style={{ textAlign: 'center', fontWeight: 'bold', paddingVertical: 10 }}>{`${nameBD}`.toUpperCase()}</Text> */}
                <View style={{ flexDirection: 'row', }}>
                    {
                        listGhichu && listGhichu.map(renderGhiChu)
                    }
                </View>
                {/* <Text style={{ paddingHorizontal: 10, paddingTop: 10 }}>ĐVT 1N={dvt}</Text> */}
            </View>
            {/* //chart */}
            <View style={{
                height: height + heightLabel + 20,
                flexDirection: 'row',
                marginVertical: 10,
                paddingTop: 20
            }} >
                <View style={{
                    minWidth: widthLabel,
                    height: '100%',
                }} >
                    <View style={{
                        flex: 1, borderWidth: 0,
                        borderRightWidth: 1
                    }}>
                        {
                            Array.from(Array(numRow).keys()).map((i, e) => {
                                return <View style={{
                                    backgroundColor: '#323B44',
                                    flex: 1,
                                }}>
                                    <Text style={{ position: 'absolute', top: -10, right: 5, color: colors.white }}>{parseInt((numMax / (1 * numRow) * (numRow - i)).toFixed(1))}</Text>
                                </View>
                            })
                        }
                    </View>
                    <View style={{ height: heightLabel }}>
                    </View>
                </View>
                <View style={{ flex: 1, }}>
                    <View style={{ flex: 1, justifyContent: 'space-between' }}>
                        {
                            Array.from(Array(numRow).keys()).map((i, e) => {
                                return <View style={{ height: 1, backgroundColor: colors.blueGrey_20, }} />
                            })
                        }
                        <View style={{ height: heightLabel }}>
                        </View>
                    </View>
                    <View style={{
                        position: 'absolute', top: 0,
                        left: 0, right: 0, bottom: 0,
                    }}>
                        <ScrollView horizontal style={{ flex: 1, }} >
                            <View style={{ flex: 1 }}>
                                <View style={{
                                    flexDirection: 'row', height: height,
                                    borderWidth: 0,
                                    borderBottomWidth: 1,
                                    paddingLeft: 10
                                }}>
                                    {
                                        data.map((i, e) => renderItemChart(i, e, false))
                                    }
                                    <View style={{ width: 50 }}></View>
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    height: heightLabel,
                                }}>
                                    {
                                        data.map((i, e) => renderItemChart(i, e, true))
                                    }
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </View >
            {/* chú thích */}
            <View>
            </View>
            <IsLoading ref={refLoading} />
        </View>

    )
}
ChartCotChong.propTypes = {
    listKey: PropTypes.array,
    listGhichu: PropTypes.array,
    data: PropTypes.array,
    height: PropTypes.number,
    width: PropTypes.number,
    numRow: PropTypes.number,
    listColor: PropTypes.array,
    dvt: PropTypes.number,
    keylabel: PropTypes.string,
    heightLabel: PropTypes.number,
    nameBD: PropTypes.string,
    widthLabel: PropTypes.number,
    isLoading: PropTypes.bool
};

ChartCotChong.defaultProps = {
    listKey: [],
    listGhichu: [],
    data: [],
    height: 500,
    width: 40,
    numRow: 10,
    listColor: listColor_test,
    dvt: 1000,
    keylabel: "name",
    heightLabel: 150,
    nameBD: '',
    widthLabel: 70,
    isLoading: true

};
export default ChartCotChong

const styles = StyleSheet.create({})
