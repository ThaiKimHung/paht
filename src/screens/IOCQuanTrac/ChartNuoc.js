import moment from 'moment';
import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { LineChart, Grid, YAxis, XAxis } from 'react-native-svg-charts'
import Utils from '../../../app/Utils';
import { ListEmpty } from '../../../components';
import { Images } from '../../../srcAdmin/images';
import { colors } from '../../../styles';
import { reSize } from '../../../styles/size';
import { Height, isLandscape, nstyles, Width } from '../../../styles/styles';
import apiQuanTrac from './apiQuanTrac';
import TypeQuanTrac from './TypeQuanTrac';

class ChartNuoc extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataChart: this.props.dataChart,
            dataSetting: this.props.dataSetting,
            dataDisplayCharst: [],
            dataAxisY: [],
            dataAxisX: [],
            dataObjectMap: {},
            keyViewAxisX: ''
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.dataChart != prevState.dataChart || nextProps.keyViewAxisX != prevState.keyViewAxisX) {
            return {
                dataChart: nextProps.dataChart,
                keyViewAxisX: nextProps.keyViewAxisX
            }
        } else {
            return null
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.dataChart !== this.props.dataChart) {
            this.handleDataChart_KhongKhi()
        }
    }

    randomColor = () => {
        return '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
    }

    checkObjectData = () => {
        const { dataChart = [], dataSetting = [] } = this.state
        let dataObjectMap = {};
        if (dataSetting.length > 0) {
            dataSetting.forEach(e => {
                if (e.display) {
                    dataObjectMap = {
                        ...dataObjectMap,
                        [e.key]: {
                            data: [],
                            svg: {
                                stroke: this.randomColor(),
                                strokeWidth: "2",
                                // onPress: () => { }, // onPress SVG
                            },
                            label: e.key,
                        }
                    }
                }
            });
            Utils.nlog('[LOG] OBJECT DATA', dataObjectMap)
            return dataObjectMap
        } else {
            return {}
        }
    }

    handleDataChart_KhongKhi = async () => {
        const { dataChart = [], dataSetting = [], keyViewAxisX = '' } = this.state
        Utils.nlog('[LOG] DATA CHART ', dataChart)
        let dataObjectMap = await this.checkObjectData();
        if (Object.keys(dataObjectMap).length > 0 && dataChart.length > 0) {
            Object.keys(dataObjectMap).map(function (key, index) {
                dataChart.forEach(elementB => {
                    dataObjectMap = {
                        ...dataObjectMap,
                        [key]: {
                            ...dataObjectMap[key],
                            data: [...dataObjectMap[key].data, elementB[key]]
                        },
                    }
                })
            })
            let dataDisplayCharst = []

            //Xử lý data giống SVG
            Object.keys(dataObjectMap).map(function (key, index) {
                dataDisplayCharst = [...dataDisplayCharst,
                {
                    ...dataObjectMap[key]
                }]
            })
            Utils.nlog('[LOG] DATA CHART ĐÃ XỬ LÝ XONG', dataDisplayCharst)

            //Tìm MaxY lấy data AsixY
            let MaxY = 0, keyMaxY = ''
            Object.keys(dataObjectMap).map(function (key, index) {
                let maxKey = Math.max(...dataObjectMap[key].data)
                if (maxKey > MaxY) {
                    MaxY = maxKey
                    keyMaxY = key
                }
            })
            Utils.nlog('[LOG] DATA AXIS Y MAX', dataObjectMap[keyMaxY])

            //Lấy data AsixX
            let tempdataAxisX = dataChart.map(e => {
                return moment(e[keyViewAxisX]).format('HH:mm')
            })

            Utils.nlog('[LOG] DATA AXIS X', tempdataAxisX)

            this.setState({
                dataDisplayCharst: dataDisplayCharst,
                dataAxisY: dataObjectMap[keyMaxY]?.data.length > 0 ? dataObjectMap[keyMaxY]?.data : [],
                dataAxisX: tempdataAxisX.length > 0 ? tempdataAxisX : [],
                dataObjectMap: dataObjectMap
            })
        } else {
            this.setState({
                dataDisplayCharst: [],
                dataAxisY: [],
                dataAxisX: [],
                dataObjectMap: {}
            })
        }
    }

    onPressSetting = (item) => {
        const { dataChart = [], dataSetting = [] } = this.state
        let temp = dataSetting.map(e => {
            if (e.id == item.id) {
                return { ...e, display: !e.display }
            } else {
                return { ...e }
            }
        })
        this.props.onLoadProps(temp)
        this.setState({ dataSetting: temp }, () => { this.handleDataChart_KhongKhi() })
    }

    renderItemSetting = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={() => this.onPressSetting(item)} activeOpacity={0.5} style={{ flex: 1, padding: 10, }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={item.display ? Images.icCheck : Images.icUnCheck} style={{ tintColor: 'green' }} resizeMode='contain' />
                    <Text style={{ paddingLeft: 10 }}>{item.title}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    renderItemChuThich = ({ item, index }) => {
        return (
            <View style={{ flex: 1, padding: 10, }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={[nstyles.nIcon10, { backgroundColor: item.svg.stroke }]} />
                    <Text style={{ paddingLeft: 10 }} numberOfLines={1}>{item.label}</Text>
                </View>
            </View>
        )
    }

    keyExtractor = (item, index) => index.toString()

    keyExtractorChuThich = (item, index) => index.toString()

    listHeaderComponent = () => {
        return (
            <Text style={{ fontWeight: 'bold', marginTop: 10 }}>{'Thông số hiển thị'}</Text>
        )
    }

    listHeaderComponentChuThich = () => {
        return (
            <Text style={{ fontWeight: 'bold', marginTop: 10 }}>{'Chú thích'}</Text>
        )
    }

    render() {
        const { dataChart, dataSetting, dataDisplayCharst, dataAxisY, dataAxisX, dataObjectMap, keyViewAxisX } = this.state
        const widthData = dataDisplayCharst.length > 0 ? dataDisplayCharst[0].data.length * 15 : 0
        if (dataChart.length == 0) {
            return null
        }
        return (
            <View style={{}}>
                {
                    dataDisplayCharst.length > 0 ?
                        <ScrollView horizontal contentContainerStyle={{ paddingBottom: 20 }}>
                            <View>
                                <View style={{ flexDirection: 'row', height: isLandscape() ? Height(70) : Height(40), width: Width(widthData) }}>
                                    <LineChart
                                        style={{ flex: 1, marginLeft: 5 }}
                                        data={dataDisplayCharst}
                                        contentInset={{ top: reSize(20), bottom: reSize(20), right: reSize(10) }}
                                        animate={true}
                                    >
                                        <Grid />
                                    </LineChart>
                                </View>
                                <XAxis
                                    style={{ width: Width(widthData), height: 20 }}
                                    data={dataAxisX}
                                    formatLabel={(value, index) => `${moment(dataChart[index][keyViewAxisX]).format('HH:mm')}`}
                                    contentInset={{ left: reSize(20), right: reSize(20) }}
                                    svg={{ fontSize: 8, fill: 'black' }}
                                />
                            </View>
                        </ScrollView>
                        :
                        <View style={{ alignItems: 'center', justifyContent: 'center', height: 300 }}>
                            <Text style={{ textAlign: 'center' }}> {'Không có dữ liệu biểu đồ'}</Text>
                        </View>
                }


                <YAxis
                    data={dataAxisY}
                    formatLabel={(value, i) => `${value}`}
                    contentInset={{ top: reSize(20), bottom: reSize(20) }}
                    svg={{
                        fill: 'grey',
                        fontSize: 10,
                    }}
                    numberOfTicks={5}
                    style={{ position: 'absolute', top: 0, left: 0, height: isLandscape() ? Height(70) : Height(40) }}
                />

                <TouchableOpacity
                    style={stChartNuoc.btnChiTiet}
                    onPress={() => { Utils.navigate('Modal_DetailsChartsNuoc', { dataChart: dataChart, dataSetting: dataSetting, keyViewTime: keyViewAxisX, item: this.props.itemTram }) }}
                >
                    <Text style={stChartNuoc.txtChiTiet}>{`Xem chi tiết thông số`}</Text>
                </TouchableOpacity>

                <FlatList
                    ListHeaderComponent={this.listHeaderComponentChuThich}
                    numColumns={3}
                    data={dataDisplayCharst}
                    keyExtractor={this.keyExtractorChuThich}
                    renderItem={this.renderItemChuThich}
                />
                <FlatList
                    ListHeaderComponent={this.listHeaderComponent}
                    numColumns={2}
                    data={dataSetting}
                    keyExtractor={this.keyExtractor}
                    renderItem={this.renderItemSetting}
                />
            </View>
        );
    }
}

const stChartNuoc = StyleSheet.create({
    btnChiTiet: {
        padding: 10, backgroundColor: '#ff7e00', alignSelf: 'center', borderRadius: 5, paddingHorizontal: 15
    },
    txtChiTiet: {
        color: colors.white, fontWeight: 'bold'
    }
})

const mapStateToProps = state => ({
    theme: state.theme
});
export default Utils.connectRedux(ChartNuoc, mapStateToProps, true);
