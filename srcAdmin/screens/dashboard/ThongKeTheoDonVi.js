import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native'
import apis from '../../apis'
import Utils from '../../../app/Utils'
import { nstyles, nwidth } from '../../../styles/styles'
import { reText } from '../../../styles/size'
import { colors } from '../../../styles'
import { Images } from '../../images'
import Moment from 'moment'
import { appConfig } from '../../../app/Config'
import { ConfigScreenDH } from '../../routers/screen'

const widthColumn = () => (nwidth() - 10) / 5

export class ThongKeTheoDonVi extends Component {
    constructor(props) {
        super(props)

        this.state = {
            dataDonVi: [],
            dateForm: Moment(new Date()).add(-30, 'days').format('DD/MM/YYYY'),
            dateTo: Moment(new Date()).format('DD/MM/YYYY'),
            tongcong: {
                TongPA: 0,
                TongTrongHanDangXL: 0,
                TongQuaHanDangXL: 0,
                TongTrongHanDaXL: 0,
                TongQuaHanDaXL: 0
            }
        }
    }

    _GetXuLyDonVi = async (tungay = '', denngay = '') => {
        if (appConfig.IdSource == 'CA')
            var res = await apis.ThongKeBaoCao.GetListGroup_ThongKePA_TheoDonVi(tungay, denngay);
        else {
            var res = await apis.ThongKeBaoCao.GetList_ThongKePA_TheoDonVi(tungay, denngay);
        }
        Utils.nlog("Danh sách tất cả các đơn vị:", res)
        if (res.status == 1) {
            const { data } = res

            let TongPA = 0, TongTrongHanDangXL = 0, TongQuaHanDangXL = 0, TongTrongHanDaXL = 0, TongQuaHanDaXL = 0

            data.map((item) => {
                TongPA += item.SoLuong
                TongTrongHanDangXL += item.SLTrongHanDangXL
                TongQuaHanDangXL += item.SLQuaHanDangXL
                TongTrongHanDaXL += item.SLTrongHanDaXL
                TongQuaHanDaXL += item.SLQuaHanDaXL
            })

            this.setState({ dataDonVi: data, tongcong: { TongPA, TongTrongHanDangXL, TongQuaHanDangXL, TongTrongHanDaXL, TongQuaHanDaXL } })
        }
    }

    componentDidMount() {
        this._GetXuLyDonVi()
    }

    handleFilter = () => {
        Utils.goscreen(this.props.nthis, ConfigScreenDH.Modal_Options, {
            isUseDate: true, callBack: this.callbackFilter,
            dateForm: this.state.dateForm,
            dateTo: this.state.dateTo
        })
    }

    callbackFilter = (dateForm, dateTo, Options) => {
        Utils.nlog('calback', dateForm + ',' + dateTo + ',' + Options)
        if (dateForm && dateTo) {
            //Nguoi dung chon khoang thoi gian
            this.setState({
                dateForm: dateForm,
                dateTo: dateTo
            })
            this._GetXuLyDonVi(Moment(dateForm, 'DD/MM/YYYY').format('DD-MM-YYYY'), Moment(dateTo, 'DD/MM/YYYY').format('DD-MM-YYYY'))
        } else {
            //Nguoi dung chon cac option: homnay, 30 ngay truoc....
            const now = Moment(new Date()).format('DD/MM/YYYY');
            if (Options) {
                this.setState({
                    dateForm: Options,
                    dateTo: now
                })
            }
            this._GetXuLyDonVi(Moment(Options, 'DD/MM/YYYY').format('DD-MM-YYYY'), Moment(now, 'DD/MM/YYYY').format('DD-MM-YYYY'))
        }
    }
    render() {
        const { dataDonVi, tongcong } = this.state
        const state = this.state;
        const element = (data, index) => (
            <TouchableOpacity onPress={() => this._alertIndex(index)}>
                <View style={styles.btn}>
                    <Text style={styles.btnText}>button</Text>
                </View>
            </TouchableOpacity>
        );
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: colors.white, }]}>
                <View style={{ flexDirection: 'row', width: widthColumn() * 5, alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ fontWeight: 'bold', color: colors.redStar, paddingVertical: 10, fontSize: reText(18) }}>{'Danh sách các đơn vị xử lý'}</Text>
                    <TouchableOpacity onPress={this.handleFilter} style={{ padding: 5, flexDirection: 'row', borderWidth: 1, borderColor: colors.colorHeaderApp }}>
                        <Image source={Images.icFilter} style={[nstyles.nIcon16, { tintColor: colors.black }]} resizeMode='cover' />
                    </TouchableOpacity>
                </View>
                {/* ===========================Header Table====================================== */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: widthColumn() * 5 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', width: widthColumn() * 3 }}>
                        <Text style={[styles.textHeader, { width: widthColumn() - widthColumn() / 2 }]}>STT</Text>
                        <Text style={[styles.textHeader, { width: widthColumn() + widthColumn() / 2 }]}>Đơn vị</Text>
                        <Text style={[styles.textHeader]}>Tổng số phản ánh</Text>
                    </View>
                    <View style={{ flexDirection: 'row', width: widthColumn() * 2 }}>
                        <View style={{ alignItems: 'center', width: widthColumn() }}>
                            <Text style={[styles.textHeader_2, { height: 50 }]}>{'Đang xử lý'}</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={[styles.textHeader_2, { fontSize: reText(10), flex: 1 }]}>{'Trong\nhạn'}</Text>
                                <Text style={[styles.textHeader_2, { fontSize: reText(10), flex: 1 }]}>{'Quá\nhạn'}</Text>
                            </View>
                        </View>
                        <View style={{ alignItems: 'center', width: widthColumn() }}>
                            <Text style={[styles.textHeader_2, { height: 50 }]}>{'Đã xử lý'}</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={[styles.textHeader_2, { fontSize: reText(10), flex: 1 }]}>{'Trong\nhạn'}</Text>
                                <Text style={[styles.textHeader_2, { fontSize: reText(10), flex: 1 }]}>{'Quá\nhạn'}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                {/* ============================================================================== */}
                <View style={{ flexDirection: 'row' }}>
                    <Text style={[styles.textHeader, { width: widthColumn() - widthColumn() / 2, fontWeight: 'bold' }]}></Text>
                    <Text style={[styles.textHeader, { width: widthColumn() + widthColumn() / 2, fontWeight: 'bold' }]}>{'Tổng cộng'}</Text>
                    <Text style={[styles.textHeader, { color: colors.black, fontWeight: 'bold' }]}>{tongcong.TongPA}</Text>
                    <View style={{ width: widthColumn(), flexDirection: 'row' }}>
                        <Text style={[styles.textHeader_2, { flex: 1, fontWeight: 'bold' }]}>{tongcong.TongTrongHanDangXL}</Text>
                        <Text style={[styles.textHeader_2, { flex: 1, fontWeight: 'bold' }]}>{tongcong.TongQuaHanDangXL}</Text>
                    </View>
                    <View style={{ width: widthColumn(), flexDirection: 'row' }}>
                        <Text style={[styles.textHeader_2, { flex: 1, fontWeight: 'bold' }]}>{tongcong.TongTrongHanDaXL}</Text>
                        <Text style={[styles.textHeader_2, { flex: 1, fontWeight: 'bold' }]}>{tongcong.TongQuaHanDaXL}</Text>
                    </View>
                </View>
                {dataDonVi.length > 0 && dataDonVi ? dataDonVi.map((item, index) => {
                    return (
                        <View key={index} style={{ flexDirection: 'row' }}>
                            <Text style={[styles.textHeader, { width: widthColumn() - widthColumn() / 2 }]}>{index + 1}</Text>
                            <Text style={[styles.textHeader, { width: widthColumn() + widthColumn() / 2 }]}>{item.TenMuc}</Text>
                            <Text style={[styles.textHeader, { color: colors.redStar, fontWeight: 'bold' }]}>{item.SoLuong}</Text>
                            <View style={{ width: widthColumn(), flexDirection: 'row' }}>
                                <Text style={[styles.textHeader_2, { flex: 1 }]}>{item.SLTrongHanDangXL}</Text>
                                <Text style={[styles.textHeader_2, { flex: 1 }]}>{item.SLQuaHanDangXL}</Text>
                            </View>
                            <View style={{ width: widthColumn(), flexDirection: 'row' }}>
                                <Text style={[styles.textHeader_2, { flex: 1 }]}>{item.SLTrongHanDaXL}</Text>
                                <Text style={[styles.textHeader_2, { flex: 1 }]}>{item.SLQuaHanDaXL}</Text>
                            </View>
                        </View>
                    )
                }) :
                    <Text style={{ textAlign: 'center', paddingVertical: 5, fontSize: reText(12) }}>{'Không có dữ liệu...'}</Text>
                }

            </View>
        )
    }
}

const styles = StyleSheet.create({
    textHeader: {
        fontSize: 12,
        // flex: 1,
        padding: 5,
        height: '100%',
        width: '100%',
        borderWidth: 0.5,
        // borderBottomWidth: 0,
        textAlign: 'center',
        width: widthColumn(),
    },
    textHeader_2: {
        fontSize: 12,
        // flex: 1,
        padding: 5,
        width: '100%',
        borderWidth: 0.5,
        // borderBottomWidth: 0,
        textAlign: 'center',
    }
})

export default ThongKeTheoDonVi
