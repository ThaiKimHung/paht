import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { BarChart, Grid, PieChart } from 'react-native-svg-charts'
import apis from '../../apis'
import { ROOTGlobal } from '../../../app/data/dataGlobal'
import { colors } from '../../../styles'
import { reSize, reText, sizes } from '../../../styles/size'
import Moment from 'moment'
import Utils from '../../../app/Utils'
import { Height, nstyles } from '../../../styles/styles'
import ButtonCus from '../../../components/ComponentApps/ButtonCus'
import DatePicker from 'react-native-datepicker'
import { Images } from '../../images'
import { nGlobalKeys } from '../../../app/keys/globalKey'

export class ThongKeTongHop extends Component {
    constructor(props) {
        super(props)
        this.ChonNgay = ''
        this.state = {
            dataBD: [], // Data biểu đồ
            dataHetHan: [],
            dataDonVi: [],
            isShow: false,
            isShow1: false,
            isChooseDate: false,
            ToDate: '',
            FromDate: '',
            titleTongHop: '',
            dataDATE: [],

            //Du lieu bieu do
            dataChart: []
        }
        ROOTGlobal[nGlobalKeys.ThongKeDH].refesh = this._onRefesh;
    }

    componentDidMount() {
        this._GetBieuDo();
    }
    _GetBieuDo = async (tungay = '', denngay = '') => {
        let res = await apis.BieuDo.BieuDo_PhanAnhTheoTinhTrangXuLy(tungay, denngay);
        // Utils.nlog("Danh sách biểu đồ tổng<><><><>", res)
        if (res.status == 1) {
            let { data = {} } = res;
            let {
                Tong = 0,
                DaXuLy = 0,
                TrongDaXuLy = 0,
                QuahanDaXuLy = 0,
                DangXuLy = 0,
                TrongHanXuLy = 0,
                QuaHanXuLy = 0,
            } = data;
            let PhanTramDaXuLy = 0.00, PhanTramDangXuLy = 0.00;
            if (Tong > 0) {
                PhanTramDaXuLy = (DaXuLy / Tong) > 0 ? ((DaXuLy / Tong) * 100).toFixed(2) : 0.00
                PhanTramDangXuLy = DangXuLy != 0 && Tong != 0 && (DangXuLy / Tong) > 0 ? ((DangXuLy / Tong) * 100).toFixed(2) : 0.00
            }
            let _dataBD = {
                Tong,
                DaXuLy,
                TrongDaXuLy,
                QuahanDaXuLy,
                DangXuLy,
                TrongHanXuLy,
                QuaHanXuLy,
                PhanTramDaXuLy,
                PhanTramDangXuLy,
            }
            let tempChart = [
                {
                    name: 'Đã xử lý',
                    value: TrongDaXuLy,
                    color: this.randomColor()
                },
                {
                    name: 'Đang xử lý',
                    value: TrongHanXuLy,
                    color: this.randomColor()
                },
                {
                    name: 'Trễ hạn',
                    value: QuahanDaXuLy + QuaHanXuLy,
                    color: this.randomColor()
                }
            ]
            this.setState({ dataBD: _dataBD, dataChart: tempChart })
        }
    }

    randomColor = () => {
        return ('#' + ((Math.random() * 0xffffff) << 0).toString(16) + '000000').slice(0, 7)
    }

    // handleFilter = () => {
    //     Utils.goscreen(this.props.nthis, "Modal_Options", {
    //         isUseDate: true, callBack: this.callbackFilter,
    //         dateForm: Moment(new Date()).add(-15).format('DD/MM/YYYY'),
    //         dateTo: Moment(new Date()).format('DD/MM/YYYY')
    //     })
    // }

    // callbackFilter = (dateForm, dateTo, Options) => {
    //     Utils.nlog('calback', dateForm + ',' + dateTo + ',' + Options)
    //     if (dateForm && dateTo) {
    //         //Nguoi dung chon khoang thoi gian
    //         this._GetBieuDo(Moment(dateForm, 'DD/MM/YYYY').format('YYYY-MM-DD'), Moment(dateTo, 'DD/MM/YYYY').format('YYYY-MM-DD'))
    //     } else {
    //         //Nguoi dung chon cac option: homnay, 30 ngay truoc....
    //         const now = Moment(new Date()).format('DD-MM-YYYY');
    //         this._GetBieuDo(Moment(Options, 'DD/MM/YYYY').format('YYYY-MM-DD'), Moment(now, 'DD/MM/YYYY').format('YYYY-MM-DD'))
    //     }
    // }
    render() {
        const { dataChart, dataBD } = this.state
        // Utils.nlog("<><><><>dataChart", dataChart)
        const pieData = dataChart
            .filter((item) => item.value > 0)
            .map((item, index) => ({
                value: item.value,
                svg: {
                    fill: item.color, // màu của biểu đồ 
                    onPress: () => console.log('press', index),
                },
                key: `pie-${index}`,
            }))
        // Utils.nlog("<><><><>pieData", pieData)
        return (
            <View style={{}}>
                <View style={[nstyles.ncontainer, { backgroundColor: colors.white, }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 5 }}>
                        <Text style={{ fontWeight: 'bold', color: colors.redStar, paddingVertical: 10, fontSize: reText(18) }}>{'Biểu đồ tổng hợp'}</Text>
                        {/* <TouchableOpacity onPress={this.handleFilter} style={{ padding: 5, flexDirection: 'row', borderWidth: 1, borderColor: colors.colorHeaderApp }}>
                            <Image source={Images.icFilter} style={[nstyles.nIcon16, { tintColor: colors.black }]} resizeMode='cover' />
                        </TouchableOpacity> */}
                    </View>
                    {dataBD.Tong > 0 ?
                        <View style={{ height: 200, padding: 10 }}>
                            <View style={{ height: Height(20), width: '100%', flexDirection: 'row', justifyContent: 'space-evenly', paddingHorizontal: 10 }}>
                                <View style={{ flex: 1 }}>
                                    <PieChart style={{ height: 200 }} data={pieData} innerRadius={'0%'} outerRadius={'100%'} />
                                </View>
                                <View style={{ paddingHorizontal: 10, flex: 1, justifyContent: 'center', height: 200 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
                                        <View style={{ width: reSize(15), height: reSize(15), borderRadius: 3, borderColor: colors.redStar, borderWidth: 1 }} />
                                        <Text style={{ paddingHorizontal: 5, color: colors.redStar }}>{`${'Tổng phản ánh'} (${dataBD.Tong})`}</Text>
                                    </View>
                                    {dataChart.map((item, index) => {
                                        return (
                                            <View key={`pie-${index}`} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
                                                <View style={{ width: reSize(15), height: reSize(15), borderRadius: 10, backgroundColor: item.color }} />
                                                <Text style={{ paddingHorizontal: 5, color: colors.black }}>{`${item.name} (${item.value})`}</Text>
                                            </View>
                                        )
                                    })}
                                </View>
                            </View>
                        </View>
                        :
                        <Text style={{ textAlign: 'center', paddingVertical: 5, fontSize: reText(12) }}>{'Không có dữ liệu...'}</Text>}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    title: {
        color: colors.redStar,
        fontWeight: 'bold',
        paddingVertical: 10,
        // textAlign: 'center',
        fontSize: reText(20)
    }
})

export default ThongKeTongHop


