import React, { useMemo } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native'
import Svg, { Circle, G, Text as TextSvg, Path, Rect, Defs, Use } from 'react-native-svg'
import { colors } from '../../../../styles'
import { nwidth, Width } from '../../../../styles/styles'
import { reSize, reText } from '../../../../styles/size'
import { sortBy } from 'lodash'
import LinearGradient from 'react-native-linear-gradient'
import { PieChart } from 'react-native-svg-charts'
import LottieView from 'lottie-react-native';
import { Images } from '../../../../src/images'
import Utils from '../../../../app/Utils'

const ChartBieuDo = React.forwardRef((props, ref) => {
    const { data = [],
        styleContainer = {},
        type = '',
        keylabel1 = '',
        keylabel2 = '',
        heightConTainer = 300,
        arayLabel = [],
        arayBackGroud = [],
        keylabel3 = '',
        keylabel4 = '',
        colorsBackGround = colors.black,
        colorsLine1 = colors.redStar,
        colorsLine2 = colors.mediumGreen,
        colorsLine3 = colors.blueColumn,
        arrayTxtTile = [],
        onPress = () => { },
        isLoading = false,
    } = props



    const onChange = (item) => {
        onPress(item)
    }

    const renderBieuDoNgang2 = () => {
        return (
            <View style={{
                backgroundColor: colorsBackGround, paddingVertical: 20, borderRadius: 5,
            }}>
                {data.map((item, index, arr) => {
                    let percent = arr[0][keylabel2] === 0 ? 5 : item[keylabel2] * 100 / arr[0][keylabel2];
                    return (
                        <TouchableOpacity activeOpacity={0.5} key={index} style={{ flexDirection: 'row', paddingVertical: 7 }} onPress={() => onChange(item)}>
                            <View style={{ paddingHorizontal: 10, width: '45%', justifyContent: 'center' }}>
                                <Text numberOfLines={2} style={{ color: colors.white }}>{item[keylabel1]}</Text>
                            </View>
                            <View style={{ width: Width(40) }}>
                                <View style={{ height: 30, width: `${percent + 15}%`, backgroundColor: colorsLine1, borderRadius: 7 }}>
                                    <View style={{ backgroundColor: colors.black, opacity: 0 + (index * 0.7 / data.length), width: '100%', height: '100%' }}>
                                    </View>
                                    <View style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 5, justifyContent: 'center', alignItems: 'flex-end' }}>
                                        <Text style={{ textAlign: 'center', fontSize: reText(16), color: colors.whiteTwo }} >{item[keylabel2]}</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )
                })
                }
            </View >
        )
    }
    const FindMaxKeyLabel = (data, keylabel) => { // tìm giá trị max theo value
        let datanew = sortBy(data, [keylabel])
        datanew.reverse(datanew)
        return datanew[0] ? datanew[0][keylabel] : 0

    }
    const addItemType = (item, type = '') => { // thêm type hài lòng or không hài lòng 
        let data = { ...item, ItemType: type };
        onChange(data);
    }
    const render5Donviphanhoi = () => {
        let paddingcolumn = 20;
        let paddingHorizontal = 30 // padding tổng  view cột
        return (
            <View style={{
                backgroundColor: colors.black_80, paddingVertical: 20, borderRadius: 5, width: '100%'
            }}>
                <View style={{
                    flexDirection: 'row', paddingHorizontal,
                    width: '100%', justifyContent: 'center'
                }}>
                    {data.map((item, index, arr) => {
                        let giatriValue1 = item[keylabel1] === 0 ? 0 : Math.round(item[keylabel3] / item[keylabel1] * 100);
                        let giatriValue2 = 100 - giatriValue1;
                        return (
                            <View key={index} style={{
                                width: (nwidth() - 60) / 5 - paddingcolumn, height: heightConTainer, borderTopRightRadius: 10,
                                borderTopLeftRadius: 10, marginHorizontal: paddingcolumn / 2
                            }}>
                                <TouchableOpacity style={{ height: `${giatriValue1}%`, backgroundColor: colorsLine2, borderRadius: 5 }}
                                    onPress={() => addItemType(item, keylabel3)}
                                >
                                    <Text style={{ textAlign: 'center', color: colors.white, fontSize: reText(12) }}>{giatriValue1 + '%'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ height: `${giatriValue2}%`, backgroundColor: colorsLine1, borderRadius: 5 }}
                                    onPress={() => addItemType(item, keylabel2)}
                                >
                                    <Text style={{ textAlign: 'center', color: colors.white, fontSize: reText(12) }}>{giatriValue2 + '%'}</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    })}
                </View>
                <View style={{ flexDirection: 'row', paddingTop: 15, justifyContent: 'center' }}>
                    {data.map((item, index) => {
                        return (
                            <View key={index} style={{ width: (nwidth() - 60) / 5 - paddingcolumn + 10, marginHorizontal: paddingcolumn / 2 - 5 }}>
                                <Text numberOfLines={5} style={{ fontSize: reText(14), color: colors.white, textAlign: 'center' }}>{item[keylabel4]}</Text>
                            </View>
                        )
                    })}
                </View >
                <View style={{ flexDirection: 'row', paddingTop: 12, width: nwidth(), justifyContent: 'space-evenly' }}>
                    {arrayTxtTile.map((item, index) => {
                        return (
                            <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ backgroundColor: index === 0 ? colorsLine1 : colorsLine2, height: 8, width: 40, borderRadius: 8, marginRight: 15 }} />
                                <Text numberOfLines={4} style={{ fontSize: reText(13), color: colors.white }}>{item}</Text>
                            </View>
                        )
                    })}
                </View>
            </View >
        )
    }

    const TotalPieData = (data = [], dataLabel = []) => { // lấy dữ liệu dataPie từ api
        let dataTemp = [];
        for (let index = 0; index < data.length; index++) {
            for (let index2 = 0; index2 < dataLabel.length; index2++) {
                dataTemp.push(data[index][dataLabel[index2]])
            }
        }
        let dem = 0;
        for (let index = 0; index < dataTemp.length; index++) {// check trường hợp 0  0   
            if (dataTemp[index] !== 0) {
                return dataTemp;
            }
            dem++;
        }
        return [];
    }
    const Tinhtongphantram = (data = [], datapie = [], keyLabelPieShow = '') => { // tính % theo key label hiển thị tâm vòng tròn
        let tong = 0;
        let giatri = 0;
        for (let index = 0; index < datapie.length; index++) {
            tong += datapie[index]
        }
        for (let index = 0; index < data.length; index++) {
            giatri = data[index][keyLabelPieShow]
            return Math.round((giatri / tong) * 100)
        }
    }

    const FilterApiPie = (item, type, keyPie = '') => {
        let itemNew;
        switch (type) {
            case 'DangXuLy':
                itemNew = { ...item, keyPie: type, keyApiChildren: 'PATongQuanTheoTrangThai_ChiTiet' }
                onChange(itemNew)
                return
            case 'DaXuLy':
                itemNew = { ...itemNew, keyPie: type, keyApiChildren: 'PATongQuanTheoTrangThai_ChiTiet' }
                onChange(itemNew)
                return
            case 'TongPA':
                itemNew = { ...itemNew, keyPie: keyPie, keyApiChildren: 'PATongQuanTheoThoiHan_ChiTiet' }
                onChange(itemNew)
                return
            case 'DanhGia':
                itemNew = { ...itemNew, keyPie: keyPie, keyApiChildren: 'PATongQuanTheoDanhGia_ChiTiet' }
                onChange(itemNew)
                return

            default:
                break;
        }
    }

    const renderBieuDoTron = () => {
        const { dataColorPie = [], keyLabelPie = [], keyLabelPieShow } = props
        let dataNew = TotalPieData(data, keyLabelPie);
        let pieData = dataNew.filter((value) => value >= 0)
            .map((value, index) => ({
                value,
                svg: {
                    fill: dataColorPie[index],
                    onPress: () => FilterApiPie(value, 'TongPA', keyLabelPie[index]) // truyền key đúng hạn or  trễ hạn
                },
                key: `pie-${index}`,
            }))
        let giatriphantram = Tinhtongphantram(data, dataNew, keyLabelPieShow)
        let precentHaiLongMonthNow = data[0].TheoDanhGia.HaiLong === 0 || data[0].TheoDanhGia.HaiLong === 0 ? 0 : data[0].TheoDanhGia.HaiLong / data[0].TheoDanhGia.SoLuongDG * 100
        let precentHaiLongMonthAfter = data[0].TongDanhGiaHaiLongThangTruoc.HaiLong === 0 || data[0].TongDanhGiaHaiLongThangTruoc.SoLuongDG === 0 ? 0 : data[0].TongDanhGiaHaiLongThangTruoc.HaiLong / data[0].TongDanhGiaHaiLongThangTruoc.SoLuongDG * 100
        let precentHaiLong = Math.round(precentHaiLongMonthNow - precentHaiLongMonthAfter);
        let tyleHaiLong = data[0].TheoDanhGia['HaiLong'] === 0 || data[0].TheoDanhGia['SoLuongDG'] === 0 ? 0 : data[0].TheoDanhGia['HaiLong'] / data[0].TheoDanhGia['SoLuongDG'];
        let tyleXLiner = (1 - tyleHaiLong) * 2;
        let PAAfterMonth = data[0].TongPAThangTruoc.SoLuongTT === 0 ? 0 : data[0].TongPAThangTruoc.SoLuongTT
        let precentMonthCompareAfter = PAAfterMonth === 0 ? 0 : Math.round(((data[0].SoLuongTQ - data[0].TongPAThangTruoc.SoLuongTT) / PAAfterMonth) * 100);
        return (
            <View style={{ paddingTop: 20, backgroundColor: colorsBackGround, borderRadius: 5 }}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: '50%', paddingLeft: 8 }}>
                        <PieChart style={{ height: Width(45), width: Width(45) }} data={pieData} padAngle={0} >
                        </PieChart>
                        <View style={{ position: 'absolute', top: Width(45) / 2.5, left: 0, right: 0, bottom: 0 }}>
                            <Text style={{ textAlign: 'center', color: colors.whiteTwo }}>{'Đúng hạn'}</Text>
                            <Text style={{ textAlign: 'center', color: colors.whiteTwo }}>{giatriphantram ? `${giatriphantram}%` : 0 + '%'}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: '100%' }}>
                            <View style={{ width: 15, height: 10, backgroundColor: dataColorPie[0] }} />
                            <Text style={styles.txtPieDunghan} >{'Đúng hạn'}</Text>
                            <View style={{ width: 15, height: 10, backgroundColor: dataColorPie[1] }} />
                            <Text style={styles.txtPieDunghan} >{'Quá hạn'}</Text>
                        </View>
                    </View>
                    <View style={{ width: '50%', paddingRight: 4 }}>
                        <TouchableOpacity activeOpacity={0.5} style={{
                            borderWidth: 2, borderColor: colors.grayLight, paddingVertical: 10,
                            alignItems: 'center', width: '100%'
                        }}
                            onPress={() => FilterApiPie(data[0].SoLuongTQ, 'TongPA')}
                        >
                            <Text style={{ color: colors.white, fontSize: reText(16) }}>{'Tổng số phản ánh'}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginTop: 5 }} >
                                <View style={{ flex: 0.2 }} />
                                <View style={{ flex: 0.6, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} >
                                    <View style={{ borderRightWidth: 1, borderRightColor: '#3090F0' }} >
                                        <Text style={{ color: '#3090F0', marginRight: 15, fontSize: reText(16) }} >{data[0].SoLuongTQ}</Text>
                                    </View>
                                    {precentMonthCompareAfter < 0 ? <Text style={styles.txtHaiLong}  >▼ </Text> : null}
                                    {precentMonthCompareAfter >= 0 ? <Text style={styles.txtHaiLong}  >▲ </Text> : null}

                                    <Text style={{ color: precentMonthCompareAfter < 0 ? colors.redStar : colors.greenLine, fontSize: reText(16) }}>
                                        {Math.abs(precentMonthCompareAfter) + '%'}</Text>
                                </View>
                                <View style={{ flex: 0.2 }} />
                            </View>

                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row', marginTop: 10, width: '100%' }}>
                            <TouchableOpacity activeOpacity={0.5} onPress={() => FilterApiPie(data[0]?.TheoTinhTrang.DangXuLy, 'DangXuLy')}
                                style={styles.viewPieRow}>
                                <Text style={{ color: colors.white, fontSize: reText(16) }}>{'Đang xử lý'}</Text>
                                <Text style={{ color: colors.orangeYellow, fontSize: reText(16) }}>
                                    {data[0]?.TheoTinhTrang.DangXuLy} </Text>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.5} onPress={() => FilterApiPie(data[0]?.TheoTinhTrang.DaXuLy, 'DaXuLy')}
                                style={styles.viewPieRow}>
                                <Text style={{ color: colors.white, fontSize: reText(16) }}>{'Đã xử lý'}</Text>
                                <Text style={{ color: colors.colorGreen, fontSize: reText(16) }}>
                                    {data[0]?.TheoTinhTrang.DaXuLy}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 10, width: '100%' }}>
                            <TouchableOpacity
                                style={styles.viewPieRow}
                                activeOpacity={0.5}
                                onPress={() => FilterApiPie('', 'TongPA', 'SLTrongHanDaXLTT')}
                            >
                                <Text style={{ color: colors.white, fontSize: reText(16) }}>{'Đúng Hạn'}</Text>
                                <Text style={{ color: colors.colorBlueLight, fontSize: reText(16) }}>
                                    {data[0]?.TheoTinhTrang.SLTrongHanDaXLTT}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.viewPieRow} activeOpacity={0.5}
                                onPress={() => FilterApiPie('', 'TongPA', 'SLQuaHanDaXLTT')}
                            >
                                <Text style={{ color: colors.white, fontSize: reText(16) }}>{'Quá Hạn'}</Text>
                                <Text style={{ color: colors.redStar, fontSize: reText(16) }}>
                                    {data[0]?.TheoTinhTrang.SLQuaHanDaXLTT}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={{ paddingTop: 20, flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 20 }}>
                    <View style={{ flex: 0.55, justifyContent: 'flex-end' }}>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={{ color: colors.greenLine, marginRight: 10, marginBottom: 2 }}>{tyleHaiLong.toFixed(1)}</Text>
                            <View style={{ width: 20, marginBottom: 5 }}>
                                <View style={{ height: 20, width: 2, backgroundColor: colors.greenPie }}></View>
                            </View>
                        </View>
                        <LinearGradient
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: tyleXLiner, y: 0.5 }}
                            // locations={[0, 0.5, 0.3]} // colors.redPinkPie,
                            colors={[colors.redPie, colors.greenPie]}
                            style={{ borderRadius: 5, width: '100%', height: 30 }}>
                        </LinearGradient>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 5 }}>
                            <TouchableOpacity activeOpacity={0.5} onPress={() =>
                                FilterApiPie('', 'DanhGia', 'KhongHaiLong')}
                            >
                                <Text style={{ color: colors.redpink, fontSize: reText(14) }}>{'Không hài lòng'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity y activeOpacity={0.5} onPress={() =>
                                FilterApiPie('', 'DanhGia', 'HaiLong')}
                            >
                                <Text style={{ color: colors.greenPie, fontSize: reText(14) }}>{'Hài lòng'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ flex: 0.45, paddingLeft: 15, paddingBottom: 15 }}>
                        {precentHaiLong >= 0 ? <Text style={{ color: colors.greenLine, fontSize: reText(16) }}>
                            ▲
                            <Text style={{ color: colors.greenLine, fontSize: reText(15) }}>{Math.abs(precentHaiLong) + '%'}</Text>
                            <Text style={{ color: colors.white, fontSize: reText(13) }}>{' Tỷ lệ hài lòng'}</Text>
                        </Text> : null
                        }
                        {precentHaiLong < 0 ? <Text style={{ color: colors.redStar, fontSize: reText(16) }}>
                            ▼
                            <Text style={{ color: colors.redStar, fontSize: reText(15) }}>{Math.abs(precentHaiLong) + '%'}</Text>
                            <Text style={{ color: colors.white, fontSize: reText(14) }}>{' Tỷ lệ hài lòng'}</Text>
                        </Text> : null
                        }

                        <Text style={{ color: colors.white, fontSize: reText(14), textAlign: 'center', marginTop: 10 }}>
                            {'Người dân đang phản hồi tính cực về kết quả xử lý phản ánh'}
                        </Text>
                    </View>
                </View>
            </View>
        )
    }

    const renderBieuDoPa1 = () => {
        let columwidth = 40;
        let paddingColum = 20;
        let paddingHorizontal = 30;
        let dpath = '';
        let dpath2 = '';
        let pecentMain = 80;
        let pecentMain2 = 90;
        let heightMain = heightConTainer * pecentMain / 100;
        let heightMain2 = heightConTainer * pecentMain2 / 100;
        let max = FindMaxKeyLabel(data, keylabel1);
        let max2 = FindMaxKeyLabel(data, keylabel3)
        let pointx = columwidth / 2; // giá đị bắt đầu đường line do view postion nên k bị ảnh hưởng do paddingHorizontal k cần  + vào
        return (
            <View style={{ backgroundColor: colors.black }}>
                <View style={{ paddingHorizontal, height: heightConTainer }}>
                    <View style={{ flexDirection: 'row', height: '100%', alignItems: 'flex-end' }}>
                        {
                            data.map((item, index, arr) => {
                                let hightdaxuly = max === 0 ? 0 : (item[keylabel2] * heightMain) / max;
                                let highChuaxuly = max2 === 0 ? 0 : (item[keylabel3] * heightMain2) / max2;
                                let point_y = heightMain - hightdaxuly;
                                let point_y2 = heightMain2 - highChuaxuly;
                                let phantramcot = max === 0 ? 5 : item[keylabel1] * 100 / max;
                                if (index === 0) {
                                    dpath = `M${pointx} ${point_y} `
                                    dpath2 = `M${pointx} ${point_y2} `
                                }
                                else {
                                    pointx += columwidth / 2 + paddingColum + columwidth / 2
                                    dpath += `L${pointx} ${point_y}`
                                    dpath2 += `L${pointx} ${point_y2}`
                                }
                                let percentLine = (item[keylabel2] * 100 / item[keylabel1]);
                                return (
                                    <View key={index} style={{ height: `${pecentMain}%`, justifyContent: 'flex-end' }}>
                                        <Text style={{
                                            color: 'white',
                                            marginLeft: 10,
                                        }}  >{item[keylabel1]}</Text>
                                        <View key={index} style={{
                                            height: `${phantramcot}%`, backgroundColor: colors.blueColumn, width: columwidth,
                                            marginRight: paddingColum, borderRadius: 8, justifyContent: 'flex-end'
                                        }}>
                                            <Text style={{
                                                height: `${percentLine}%`,
                                                width: '100%', textAlign: 'center'
                                            }}  >{item[keylabel2]}</Text>

                                        </View>
                                    </View>
                                )
                            })
                        }
                        <View style={{ position: 'absolute', height: `${pecentMain}%`, bottom: 0, left: 0, right: 0, opacity: 0.5 }}>
                            <Svg style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
                                <Path id="path" d={dpath}
                                    x={0}
                                    y={0}
                                    fill="none"
                                    strokeWidth={2}
                                    stroke="green"
                                />
                            </Svg>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', height: '100%', alignItems: 'flex-end', top: 0, left: 20, right: 20, bottom: 0, position: 'absolute', }}>
                        <View style={{ position: 'absolute', height: `${pecentMain2}%`, bottom: 0, left: 0, right: 0, }}>
                            <Svg style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
                                <Path id="path" d={dpath2}
                                    x={0}
                                    y={0}
                                    fill="none"
                                    strokeWidth={2}
                                    stroke="red"
                                />
                            </Svg>
                        </View>
                        <View style={{ flexDirection: 'row', height: '90%' }}>
                            {data.map((item, index) => {
                                let percentLine2 = (item[keylabel3] * 100 / max2);
                                return (
                                    <View key={index} style={{ height: `${100}%`, justifyContent: 'flex-end' }}>
                                        <View key={index} style={{
                                            height: `${percentLine2 + 10}%`, width: columwidth,
                                            marginRight: paddingColum, borderRadius: 8, justifyContent: 'flex-start',
                                        }}>
                                            <Text style={{
                                                color: 'white',
                                                width: '100%', textAlign: 'center'
                                            }}  >
                                                {item[keylabel3]}
                                            </Text>

                                        </View>
                                    </View>
                                )
                            })}
                        </View>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', paddingVertical: 12, paddingHorizontal }}>
                    {data.map((item, index) => {
                        return (
                            <Text key={index} style={{
                                color: 'white',
                                width: columwidth,
                                marginRight: paddingColum,
                                textAlign: 'center',
                                fontSize: 16,
                                fontWeight: 'bold',
                            }}  >
                                {'T' + item?.Thang.split("/")[1].substr(1, 1)}
                            </Text>
                        )
                    })}
                </View>
                <View View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', paddingHorizontal }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 10 }}>
                        <View style={{ height: 5, width: 30, backgroundColor: colors.blueTwo, marginRight: 5 }} />
                        <Text style={{ color: colors.grayLight }}>{'Tổng số phản ánh'}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 10 }}>
                        <View style={{ height: 5, width: 30, backgroundColor: colors.greenFE, marginRight: 5 }} />
                        <Text style={{ color: colors.grayLight }}>{'Đúng hạn'}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ height: 5, width: 30, backgroundColor: colors.blueColumn, marginRight: 5 }} />
                        <Text style={{ color: colors.grayLight }}>{'Trễ hạn'}</Text>
                    </View>

                </View>
            </View >
        )
    }
    const SilceMonth = (month = '') => {
        let monthnew = month.split("/")[0];
        if (monthnew >= 10) {
            return month.split("/")[0];
        }
        else {
            return monthnew.substr(1, 1)
        }
    }
    const renderBieuDoDienBienXuLyPA2 = () => {
        let columnWidth = nwidth() / 10;
        let paddingTop = 50;
        let paddingHorizontal = nwidth() / 16; //14
        let paddingColumn = nwidth() / 20; //20
        let max = FindMaxKeyLabel(data, keylabel1); // số lượng
        let max2 = FindMaxKeyLabel(data, keylabel3) // chưa xử lý
        let dpath = '';
        let pointx = columnWidth / 2 + paddingHorizontal
        let heightMain = heightConTainer * 100 / 100;
        let heightMain2 = heightConTainer * 100 / 100;
        let dpath2 = '';
        return (
            <View style={{ paddingTop, paddingBottom: 15, backgroundColor: '#17151C', paddingHorizontal, borderRadius: 5 }}>
                <View style={{ height: heightConTainer }}>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: '100%' }} >
                        {data.map((item, index) => {
                            let heightDaxuly = max === 0 ? 0 : (item[keylabel2] * heightMain) / max;
                            let heighChuaxuly = max2 === 0 ? (item[keylabel3] * heightMain2) : (item[keylabel3] * heightMain2) / max2;
                            let point_y2 = heightMain2 - heighChuaxuly;
                            let point_y = heightMain - heightDaxuly;
                            let phantramcot = max === 0 ? 5 : item[keylabel1] * 100 / max;
                            let percentLine = item[keylabel1] === 0 ? 1 : (item[keylabel2] * 100 / item[keylabel1]);
                            if (index === 0) {
                                dpath = `M${pointx} ${point_y + paddingTop} `
                                dpath2 = `M${pointx} ${point_y2 + paddingTop}`
                            }
                            else {
                                pointx += columnWidth / 2 + paddingColumn + columnWidth / 2
                                dpath += `L${pointx} ${point_y + paddingTop}`
                                dpath2 += `L${pointx} ${point_y2 + paddingTop}`
                            }
                            return (
                                <View key={index} >

                                    <Text style={{ width: columnWidth, color: 'white', textAlign: 'center', marginBottom: 2, fontSize: reText(15) }}>{item[keylabel1]}</Text>
                                    <View key={index} style={{
                                        backgroundColor: colors.blueColumn, width: columnWidth,
                                        height: `${phantramcot}%`,
                                        marginRight: paddingColumn, borderRadius: 8,
                                        justifyContent: 'flex-end'
                                    }}>
                                        <View style={{
                                            height: `${percentLine}%`,
                                            paddingTop: 5,
                                            width: '100%',
                                        }}>
                                            <Text style={{
                                                color: colorsLine1,
                                                textAlign: 'center'
                                            }}>{item[keylabel2]}</Text>
                                        </View>
                                    </View>
                                </View>
                            )
                        })}
                        <View style={{ flexDirection: 'row', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, height: '100%' }}>
                            <View style={{ height: '100%', flexDirection: 'row' }}>
                                {data.map((item, index) => {
                                    let percentLine2 = max2 === 0 ? 5 : (item[keylabel3] * 100 / max2); // chưa xử lý
                                    return (
                                        <View key={index} style={{ height: '100%', justifyContent: 'flex-end' }}>
                                            <View key={index} style={{
                                                height: `${percentLine2 + 10}%`, width: columnWidth,
                                                marginRight: paddingColumn, borderRadius: 8, justifyContent: 'flex-start',
                                            }}>
                                                <Text style={{
                                                    color: colorsLine2,
                                                    width: '100%', textAlign: 'center'
                                                }}  >
                                                    {item[keylabel3]}
                                                </Text>

                                            </View>
                                        </View>
                                    )
                                })}
                            </View>
                        </View>
                    </View>
                </View>
                <Svg style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }
                }>
                    <Path id="path2"
                        d={dpath2}
                        fill="none"
                        strokeWidth={2}
                        stroke={colorsLine2}
                    />
                    <Path id="path"
                        d={dpath}
                        fill="none"
                        strokeWidth={2}
                        stroke={colorsLine1}
                    />
                </Svg >
                <View style={{
                    paddingHorizontal,
                    position: 'absolute', top: 0, right: 0, left: 0, bottom: '20%',
                    flexDirection: 'row', alignItems: 'flex-end'
                }} >
                    {data.map((item, index) => {
                        let phantramcot = max === 0 ? 5 : item[keylabel1] * 100 / max;
                        return (
                            <TouchableOpacity key={index} onPress={() => addDropDown(item, true, [keylabel2, keylabel3])} >
                                <View key={index} style={{
                                    width: columnWidth,
                                    height: `${phantramcot}%`,
                                    marginRight: paddingColumn,
                                    justifyContent: 'flex-end'
                                }}>
                                </View>
                            </TouchableOpacity>
                        )
                    })}
                </View>
                <View style={{ flexDirection: 'row', paddingVertical: 12 }}>
                    {data.map((item, index) => {
                        return (
                            <Text key={index} style={{
                                color: 'white',
                                width: columnWidth,
                                marginRight: paddingColumn,
                                textAlign: 'center',
                                fontSize: 16,
                                fontWeight: 'bold',
                            }}  >
                                {'T' + SilceMonth(item?.Thang)}
                            </Text>
                        )
                    })}
                </View>
                <View View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ height: 5, width: 20, backgroundColor: colors.blueColumn, marginRight: 5 }} />
                        <Text style={{ color: colors.white, fontSize: reText(13) }}>{'Tổng số phản ánh'}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: reSize(10) }}>
                        <View style={{ height: 5, width: 20, backgroundColor: colorsLine1, marginRight: 5 }} />
                        <Text style={{ color: colors.white, fontSize: reText(13) }}>{'Đúng hạn'}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ height: 5, width: 20, backgroundColor: colorsLine2, marginRight: 5 }} />
                        <Text style={{ color: colors.white, fontSize: reText(13) }}>{'Trễ hạn'}</Text>
                    </View>
                </View>
            </View>
        )
    }
    const Find_Poin_y = (point_1 = 0, point_2 = 0, point_3 = 0, index) => {
        let hieu = 0;
        if (point_1 > point_2) {
            hieu = point_1 - point_2;
            if (hieu <= 21.818181818181813) {
                return point_1 + 15;
            }
        }
        if (point_1 === point_3) { // trường hợp line bằng max cột
            return point_1 + 16;
        }
        else if (point_1 === point_2)// hai line trùng nhau
        {
            return point_1 + 16; // tọa độ đi xuống 16 pixel
        }
        else {
            return point_1 - 10
        }
    }
    const renderBieuDoCotLinhVuc2 = () => {
        let columwidth = nwidth() / 9;
        let paddingColum = nwidth() / 15;
        let paddingHorizontal = nwidth() / 12;
        let dpath = '';
        let dpath2 = '';
        let pecentMain = 80;
        let pecentMain2 = 80;
        let heightMain = heightConTainer * pecentMain / 100;
        let heightMain2 = heightConTainer * pecentMain2 / 100;
        let max = FindMaxKeyLabel(data, keylabel1);
        let pointx = columwidth / 2; // giá đị bắt đầu đường line do view postion nên k bị ảnh hưởng do paddingHorizontal k cần  + vào
        return (
            <View style={{ backgroundColor: colorsBackGround, paddingBottom: 20, borderRadius: 5 }}>
                <View style={{ paddingHorizontal, height: heightConTainer }}>
                    <View style={{ flexDirection: 'row', height: '100%', alignItems: 'flex-end' }}>
                        {
                            data.map((item, index) => {
                                let phantramcot = max === 0 ? 5 : item[keylabel1] * 100 / max;
                                return (
                                    <View key={index} style={{ height: `${pecentMain}%`, justifyContent: 'flex-end' }}>
                                        <Text style={{
                                            color: 'white',
                                            marginLeft: columwidth / 2 - 5,
                                            marginBottom: 5
                                        }}  >{item[keylabel1]}</Text>
                                        <View key={index} style={{
                                            height: `${phantramcot}%`, backgroundColor: colorsLine3,
                                            width: columwidth,
                                            marginRight: paddingColum, borderRadius: 8
                                        }}>
                                        </View>
                                    </View>
                                )
                            })
                        }
                        <View style={{
                            position: 'absolute', height: `${pecentMain}%`, bottom: 0, left: 0, right: 0,
                            // backgroundColor: 'red'
                        }}>
                            <Svg style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
                                {data.map((item, index) => {
                                    let HeightCot = max === 0 ? 0 : item[keylabel1] * heightMain / max
                                    let heightKey2 = max === 0 ? 0 : (item[keylabel2] * heightMain) / max;
                                    let point_y_Key2 = heightMain - heightKey2;  // y chưa xử lý đang key 2
                                    let heightKey3 = max === 0 ? 0 : (item[keylabel3] * heightMain2) / max;
                                    let point_y_Key3 = heightMain2 - heightKey3; // y đã xử lý đang key 3
                                    let poin_y_Cot = heightMain2 - HeightCot;
                                    if (index === 0) {
                                        dpath = `M${pointx} ${point_y_Key2} `
                                        dpath2 = `M${pointx} ${point_y_Key3} `
                                    } else {
                                        pointx += columwidth / 2 + paddingColum + columwidth / 2
                                        dpath += `L${pointx} ${point_y_Key2}`
                                        dpath2 += `L${pointx} ${point_y_Key3}`
                                    }
                                    return (
                                        <G key={index}>
                                            <TextSvg fill={colorsLine1} textAnchor={'middle'} x={pointx}
                                                y={Find_Poin_y(point_y_Key2, point_y_Key3, poin_y_Cot, index)}
                                            >{item[keylabel2]}</TextSvg>
                                            <TextSvg fill={colorsLine2} textAnchor={'middle'} x={pointx}
                                                y={Find_Poin_y(point_y_Key3, point_y_Key2, poin_y_Cot, index)}>
                                                {item[keylabel3]}</TextSvg>
                                            <Circle x={pointx} y={point_y_Key2} r={5} fill={colorsLine1} />
                                            <Circle x={pointx} y={point_y_Key3} r={5} fill={colorsLine2} />
                                        </G>
                                    )
                                })}
                                <Path id="path" d={dpath}
                                    x={0}
                                    y={0}
                                    fill="none"
                                    strokeWidth={2}
                                    stroke={colorsLine1}  // chưa xử lý
                                />
                                <Path id="path" d={dpath2}
                                    x={0}
                                    y={0}
                                    fill="none"
                                    strokeWidth={2}
                                    stroke={colorsLine2} // xử lý
                                />
                            </Svg>
                        </View>
                        <View style={{
                            position: 'absolute', height: `100%`, bottom: 0, left: 0, right: 0,
                            flexDirection: 'row',
                            alignItems: 'flex-end',
                        }}>
                            {
                                data.map((item, index) => {
                                    let phantramcot = max === 0 ? 5 : item[keylabel1] * 100 / max;
                                    return (
                                        <TouchableOpacity key={index} style={{ height: `${pecentMain}%` }}
                                            onPress={() => addDropDown(item, true, [keylabel2, keylabel3])} >
                                            <View key={index} style={{
                                                height: `${phantramcot}%`, width: columwidth,
                                                marginRight: paddingColum, borderRadius: 8
                                            }}>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                })
                            }

                        </View>
                    </View>
                </View>
                <View style={{
                    flexDirection: 'row', paddingHorizontal, marginVertical: 10
                }}>
                    {data.map((item, index) => {
                        return (
                            <Text key={index} style={{
                                color: 'white',
                                width: columwidth,
                                marginRight: paddingColum,
                                textAlign: 'center',
                                fontSize: reText(14),
                            }}
                                numberOfLines={5}>
                                {item.TenLinhVuc}
                            </Text>
                        )
                    })}
                </View>
                <View View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-evenly' }}>
                    <View style={{ width: Width(80) / 3, alignItems: 'center' }}>
                        <View style={{ height: 5, width: 40, backgroundColor: colorsLine3 }} />
                        <Text style={{ marginTop: 5, color: 'white' }}>{'Tổng phản ánh'}</Text>
                    </View>
                    <View style={{ width: Width(80) / 3, alignItems: 'center' }}>
                        <View style={{ height: 5, width: 40, backgroundColor: colorsLine2 }} />
                        <Text style={{ marginTop: 5, color: 'white' }}>{'Đã xử lý'}</Text>
                    </View>
                    <View style={{ width: Width(80) / 3, alignItems: 'center' }}>
                        <View style={{ height: 5, width: 40, backgroundColor: colorsLine1 }} />
                        <Text style={{ marginTop: 5, color: 'white' }}>{'Chưa xử lý'}</Text>
                    </View>

                </View>
            </View >
        )
    }
    const MathRoudValue = (number = 0) => {
        let tam = number * 1.2 / 7;
        if (tam >= 5) {
            if (tam % 5 !== 0) {
                tam = Math.round(tam);
                if (tam % 5 == 0) {
                    tam++;
                }
                while (tam % 5 != 0) {
                    tam++;
                }
                return tam != undefined ? tam : 0;
            }
        }
        else {
            return tam < 0.5 ? tam.toFixed(2) : Math.round(tam);
        }
    }
    const MathRoudPercent = (number = 0) => { // hàm làm tròn lên 1
        let tam = number / 7;
        return number === 100 || number === 99 ? tam : number % 7 === 0 ? tam + 1 : Math.ceil(tam);

    }
    const MaxPercentArray = (data, keylabel, keylabel2) => { // tìm giá trị % max 
        let datanew = [];
        for (let index = 0; index < data.length; index++) {
            let precentItem = data[index][keylabel] * 100 / data[index][keylabel2]
            datanew.push(precentItem);
        }
        datanew?.sort((a, b) => {
            return b - a;
        }
        )
        return datanew[0]
    }
    const addDropDown = (item, typeDrop = false, ArrayItem = []) => { // thêm giá trị cho dropdown
        let itemNew = {
            ...item, typeDrop, dataDrop: ArrayItem // array chứa key dropdown
        }
        onChange(itemNew);
    }
    const renderBieuDoDonViXulyChamNhat = () => {
        let columnWidth = Width(100) / 10;
        let paddingColumn = Width(100) / 21;
        let paddingHorizontal = 0; // padđing view tổng
        let paddingHorizontalCot = 10 // padding view cột
        let max = FindMaxKeyLabel(data, keylabel1);
        let maxValueCot = MathRoudValue(max);
        let donvimax2 = maxValueCot * 8;
        let donVimax = maxValueCot * 8;
        let MaxPercent = MaxPercentArray(data, keylabel2, keylabel1);
        let percent = MathRoudPercent(MaxPercent); // làm tròn số  %7 lên 1 trừ 99 || 100 && hệ số khoảng cánh
        let maxPercent = percent * 8;
        let poinx = columnWidth / 2 + 5;
        let dpath = '';
        return (
            <View style={{
                backgroundColor: '#17151C', paddingVertical: 15, paddingHorizontal,
                borderRadius: 5,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <View style={{ flexDirection: 'row', paddingHorizontal: 4, justifyContent: 'space-between', width: columnWidth * data.length - 1 + paddingHorizontalCot + paddingColumn * data.length - 1 + paddingColumn * 4 }}>
                    <Text style={{ color: 'white' }}>{'Số lượng'}</Text>
                    <Text style={{ color: 'white', fontSize: 16 }}>{'%'}</Text>
                </View>
                <View style={{ flexDirection: 'row' }} >
                    <View style={{
                        flexDirection: 'row', height: heightConTainer, paddingLeft: 10, width: '10%',
                        justifyContent: 'flex-end'
                    }}>
                        <View>
                            {Array.from(Array(8).keys()).map(
                                (item, index) => {
                                    donVimax -= maxValueCot;
                                    return (
                                        <View key={index} style={{
                                            flexDirection: 'row',
                                            alignItems: 'flex-end',
                                            height: heightConTainer / 8,
                                            justifyContent: 'flex-end',
                                        }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'flex-end' }} >
                                                <Text style={{ color: 'white' }}>{index === 7 ? 0 : maxValueCot < 0.5 ?
                                                    donVimax.toFixed(2) : donVimax}</Text>
                                                <View style={{ width: 10, height: 2, backgroundColor: '#605F65' }} />
                                            </View>
                                        </View>
                                    )
                                }
                            )}
                        </View>
                        <View style={{ height: '100%', width: 3, backgroundColor: '#605F65' }}>
                        </View>
                    </View>
                    <View style={{
                        flexDirection: 'row', alignItems: 'flex-end',
                        paddingHorizontal: paddingHorizontalCot, height: heightConTainer,
                        borderBottomColor: '#605F65', borderBottomWidth: 2,
                    }}>
                        {data.map((item, index) => { // render cột
                            let phantramcot = donvimax2 === 0 ? 5 : item[keylabel1] * 100 / donvimax2
                            return (
                                <View key={index}>
                                    <View key={index} style={{
                                        backgroundColor: colorsLine1, width: columnWidth,
                                        height: `${phantramcot}%`,
                                        marginRight: index === data.length - 1 ? 0 : paddingColumn,
                                        borderRadius: 5,
                                        justifyContent: 'flex-end'
                                    }}>
                                    </View>
                                </View>
                            )
                        })}
                        <Svg style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, zIndex: 10 }}>
                            {data.map((item, index, arr) => {
                                let phantramcot = donvimax2 === 0 ? 5 : item[keylabel1] * heightConTainer / donvimax2
                                let percentItem = item[keylabel1] === 0 ? 0 : item[keylabel2] * 100 / item[keylabel1] // % item
                                let heightnew = heightConTainer / 8; // toa do y cua max %
                                let distancePercent = (maxPercent - percent) - percentItem; // khoảng cánh % item so với max
                                let tyLePercent = percent === 0 ? heightnew : heightnew / percent;// tọa độ y trong 1 khoảng cánh dc chia
                                let point_y = heightnew + (distancePercent * tyLePercent);
                                let point_y2 = heightConTainer - phantramcot;
                                if (index === 0) {
                                    dpath = `M${poinx} ${point_y}`;
                                }
                                else {
                                    poinx += columnWidth / 2 * 2 + paddingColumn;
                                    dpath += `L${poinx} ${point_y}`
                                }
                                return (
                                    <G key={index}>
                                        <TextSvg textAnchor={'middle'} fill={'white'} x={poinx} y={point_y === point_y2
                                            || point_y - 10 === point_y2 ? point_y : point_y - 10} >
                                            {Math.round(percentItem) + '%'}
                                        </TextSvg>
                                        <TextSvg fontSize={reText(16)} textAnchor={'middle'} fill={'white'} x={poinx + 4} y={point_y2 - 7} >
                                            {item[keylabel1]}
                                        </TextSvg>
                                    </G>
                                )
                            })}
                        </Svg>
                        <Svg style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, zIndex: 0 }}>
                            <Path id="path" d={dpath}
                                fill="none"
                                strokeWidth={3}
                                stroke={colorsLine2}
                            />
                        </Svg>
                        <View style={{
                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                            flexDirection: 'row',
                            alignItems: 'flex-end', paddingHorizontal: paddingHorizontalCot, zIndex: 12
                        }}>
                            {data.map((item, index) => { // render cột
                                let phantramcot = donvimax2 === 0 ? 5 : item[keylabel1] * 100 / donvimax2
                                console.log('gia tri phan tram cot', phantramcot)
                                return (
                                    <TouchableOpacity key={index} onPress={() => addDropDown(item, true, [keylabel2])} >
                                        <View key={index} style={{
                                            width: columnWidth,
                                            height: `${phantramcot <= 3 ? phantramcot + 5 : phantramcot}%`,
                                            marginRight: index === data.length - 1 ? 0 : paddingColumn,
                                            justifyContent: 'flex-end'
                                        }}>
                                        </View>

                                    </TouchableOpacity>
                                )
                            })}

                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', height: heightConTainer, flexShrink: 1 }}>
                        <View style={{ height: '100%', width: 3, backgroundColor: '#605F65' }} />
                        <View>
                            {Array.from(Array(8).keys()).map(
                                (item, index) => {
                                    maxPercent -= percent;
                                    return (
                                        <View key={index} style={{
                                            flexDirection: 'row',
                                            alignItems: 'flex-end',
                                            height: heightConTainer / 8,
                                            justifyContent: 'flex-start',
                                        }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'flex-end' }} >
                                                <View style={{ width: 10, height: 2, backgroundColor: colors.grayLight }} />
                                                <Text style={{ color: 'white' }}>{Math.round(maxPercent)}</Text>
                                            </View>
                                        </View>
                                    )
                                }
                            )}
                        </View>
                    </View>
                </View>
                <View style={{
                    flexDirection: 'row',
                    // paddingHorizontal: paddingHorizontalCot, 
                    paddingVertical: 15,

                }}>
                    {data.map((item, index) => {
                        return (
                            <View key={index} style={{
                                width: columnWidth + 10,
                                marginRight: index === data.length - 1 ? 0 : paddingColumn - 10,
                                borderRadius: 8
                            }}>
                                <Text numberOfLines={5} style={{ fontSize: reText(13), color: colors.white, textAlign: 'center' }}>
                                    {item[keylabel3]}</Text>
                            </View>
                        )
                    })}
                </View>
                <View style={{
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'space-evenly',
                }}>
                    {arrayTxtTile.map(
                        (item, index) => {
                            return (
                                <View key={index} style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}>
                                    <View style={{
                                        height: 15, width: 15, borderRadius: 15,
                                        backgroundColor: index === 0 ? colorsLine1 : colorsLine2,
                                    }} />
                                    <Text style={{ color: colors.white, marginLeft: 5, fontSize: reText(13) }}>{item}</Text>
                                </View>
                            )
                        }
                    )}
                </View>
            </View>
        )
    }

    const renderBieuDoLinhVuc = () => {
        let point_x = 0; // tọa độ x cho cột
        let widthColum = nwidth() / 9;
        let paddingLeft = nwidth() / 9.5
        let l_x = paddingLeft + (widthColum / 2); // tọa x line ban đầu
        let dpath = ''; // dpath đường kẻ line
        let dpath2 = ''; // dpath đường kẻ line 2
        let paddingColumn = nwidth() / 20; //20
        let heightMain = heightConTainer;
        let max = FindMaxKeyLabel(data, keylabel1);
        let paddingVertical = nwidth() / 10;
        let paddingVerticalCot = nwidth() / 10;
        return (
            <View style={{
                backgroundColor: "#17151C",
                borderRadius: 5,
                paddingVertical: 15,
            }}>
                <Svg style={{
                    height: heightMain + paddingVertical * 1.5,
                }}>
                    {data.map((item, index, arr) => {
                        let height = max === 0 ? 5 : (item[keylabel1] * heightMain) / max// giá trị height theo  max screen
                        let height_Line1 = max === 0 ? 0 : (item[keylabel2] * heightMain) / max //  đúng hạn
                        let height_Line2 = max === 0 ? 0 : (item[keylabel3] * heightMain) / max; // quá hạn
                        let poin_y_Line_1 = heightMain - height_Line1 + paddingVerticalCot //  đúng hạn
                        let poin_y_Line_2 = heightMain - height_Line2 + paddingVerticalCot// quá hạn
                        let point_y = heightMain - height + paddingVerticalCot; // tọa độ y - chiều cao để vẽ từ dưới lên cộng thêm 20 để paddingvecal
                        if (index === 0) {
                            point_x += paddingLeft // index===0 vào paddingleft 30
                            dpath = `M${l_x} ${poin_y_Line_1} `
                            dpath2 = `M${l_x} ${poin_y_Line_2} `
                        }
                        else {
                            point_x += paddingColumn + widthColum; //paddingleft 20 + width cột
                            l_x += widthColum / 2 + paddingColumn + widthColum / 2;
                            dpath += `L${l_x} ${poin_y_Line_1} `
                            dpath2 += `L${l_x} ${poin_y_Line_2} `
                        }
                        return (
                            <G key={index}>
                                <TextSvg x={point_x + widthColum / 2 - 5} y={point_y - 10} fill={'white'} fontSize={14}  >
                                    {item[keylabel1]}
                                </TextSvg>
                                <Rect
                                    x={point_x}
                                    y={point_y}
                                    fill={colors.blueColumn}
                                    width={widthColum}
                                    height={height}
                                    rx={10}
                                />
                                <TextSvg id="Text1" x={index === 0 ? paddingLeft + (widthColum / 2) : l_x - 5} y={poin_y_Line_1 + 20}
                                    fontSize="14"
                                    fontWeight="bold"
                                    fill={colorsLine1}>
                                    {item[keylabel2]}
                                </TextSvg>
                                <TextSvg id="Text1" x={index === 0 ? paddingLeft + (widthColum / 2) : l_x - 5} y={poin_y_Line_2 - 15}
                                    fontSize="14"
                                    fontWeight="bold"
                                    fill={colorsLine2}>
                                    {item[keylabel3]}
                                </TextSvg>
                                <Circle x={l_x} y={poin_y_Line_1} r={3} fill={colorsLine1} />
                                <Circle x={l_x} y={poin_y_Line_2} r={3} fill={colorsLine2} />
                                <Defs>
                                    <Path id="path" d={dpath}
                                        fill="none"
                                        strokeWidth={2}
                                        stroke={colorsLine1}
                                    />

                                    <Path id="path2" d={dpath2}
                                        fill="none"
                                        strokeWidth={2}
                                        stroke={colorsLine2}
                                    />
                                    <Circle id="Circle1" x={l_x} y={poin_y_Line_1} r={5} fill={colorsLine1} />
                                    <Circle id="Circle2" x={l_x} y={poin_y_Line_2} r={5} fill={colorsLine2} />
                                </Defs>
                                <Use href="#path" x="0" y={0} />
                                <Use href="#path2" x="0" y={0} />
                            </G >
                        )
                    })}
                </Svg >
                <View style={{
                    flexDirection: 'row', justifyContent: 'center', paddingHorizontal: paddingLeft, marginVertical: 10
                }}>
                    {data.map((item, index) => {
                        return (
                            <Text key={index} style={{
                                color: 'white',
                                width: widthColum + paddingColumn / 2 + 3,
                                marginHorizontal: paddingColumn / 4 - 2,
                                textAlign: 'center',
                                fontSize: reText(14),
                            }}
                                numberOfLines={5}>
                                {item.TenLinhVuc}
                            </Text>
                        )
                    })}
                </View>
                <View View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-evenly' }}>
                    <View style={{ width: Width(80) / 3, alignItems: 'center' }}>
                        <View style={{ height: 5, width: 40, backgroundColor: colorsLine3 }} />
                        <Text style={{ marginTop: 5, color: 'white' }}>{'Tổng phản ánh'}</Text>
                    </View>
                    <View style={{ width: Width(80) / 3, alignItems: 'center' }}>
                        <View style={{ height: 5, width: 40, backgroundColor: colorsLine2 }} />
                        <Text style={{ marginTop: 5, color: 'white' }}>{'Đã xử lý'}</Text>
                    </View>
                    <View style={{ width: Width(80) / 3, alignItems: 'center' }}>
                        <View style={{ height: 5, width: 40, backgroundColor: colorsLine1 }} />
                        <Text style={{ marginTop: 5, color: 'white' }}>{'Chưa xử lý'}</Text>
                    </View>

                </View>
            </View >
        )
    }

    const renderChung = (item) => {
        switch (item) {
            case "BieuDoNgang": // biểu đồ Ngang
                return useMemo(() => renderBieuDoNgang2(), [data]);
            case "DonViPhanHoi":
                return useMemo(() => render5Donviphanhoi(), [data]);
            case "BieuDoTron":
                return useMemo(() => renderBieuDoTron(), [data]);
            case "BieuDoDienBienPA":
                return useMemo(() => renderBieuDoPa1(), [data]);
            case "BieuDoDienBienPA2":
                return useMemo(() => renderBieuDoDienBienXuLyPA2(), [data]);
            case "BieuDoLinhVuc":
                return useMemo(() => renderBieuDoCotLinhVuc2(), [data]);
            case "BieuDoDonViXulyChamNhat":
                return useMemo(() => renderBieuDoDonViXulyChamNhat(), [data]);
            case "BieuDoDienLinhVuc":
                return useMemo(() => renderBieuDoLinhVuc(), [data]);
            default:
                break;
        }
    }
    return (
        <View>
            {isLoading ?
                <View style={{ alignItems: 'center' }}>
                    <LottieView style={{ height: 100, width: 150 }} source={Images.icLoangdingChart} autoPlay autoSizeloop />
                </View>
                : data?.length > 0 ? renderChung(type) :
                    <View style={{ alignItems: 'center' }}>
                        <LottieView style={{ height: 100, width: 150 }} source={Images.icEmptyChart} autoPlay loop />
                        <Text style={{ fontSize: reText(16) }}>{'Không có dữ liệu'}</Text>
                    </View>
            }
        </View>
    )
})

export default React.memo(ChartBieuDo)

const styles = StyleSheet.create({
    container: {
    },
    vDungHan: {
        height: 10,
        width: 15,
        backgroundColor: colors.softBlue,
        marginRight: 10
    },
    vQuaHan: {
        height: 10,
        width: 15,
        backgroundColor: colors.orange,
        marginHorizontal: 10
    },
    txtPieDunghan: {
        fontSize: reText(14),
        color: colors.white,

    },
    viewPieRow: {
        borderWidth: 2,
        borderColor: colors.grayLight,
        alignItems: 'center',
        width: '50%',
        paddingVertical: 10
    },
    txtHaiLong: {
        color: colors.redStar,
        fontSize: reText(18),
        marginLeft: 10
    }
})
