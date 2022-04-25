import React, { Component } from 'react'
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native'
import apis from '../../apis'
import Utils from '../../../app/Utils'
import { Images } from '../../images'
import { colors } from '../../../styles'
import { reText } from '../../../styles/size'
import { nstyles, nwidth } from '../../../styles/styles'
import Moment from 'moment'
import { ConfigScreenDH } from '../../routers/screen'

const widthColumn = () => (nwidth() - 10) / 7

export class DanhGiaHaiLong extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataDanhGia: [],
            dateForm: Moment(new Date()).add(-15, 'days').format('DD/MM/YYYY'),
            dateTo: Moment(new Date()).format('DD/MM/YYYY'),
            tongcong: {
                TongPADaGQ: 0,
                TongPACoDG: 0,
                TongHaiLong: 0,
                TongChapNhan: 0,
                TongKhongHaiLong: 0,
                TongChuaDanhGia: 0,
                isLoad: true
            }
        }
    }
    _GetList_ThongKePA_TheoDonViDanhGia = async (tungay = '', denngay = '') => {
        let res = await apis.ThongKeBaoCao.GetList_ThongKePA_TheoDonViDanhGia(tungay, denngay);//Truyền thời gian vào đây
        Utils.nlog('Danh sach danh gia muc do hai long', res)
        if (res.status == 1) {
            const { data } = res
            let TongPADaGQ = 0, TongPACoDG = 0, TongHaiLong = 0, TongChapNhan = 0, TongKhongHaiLong = 0, TongChuaDanhGia = 0
            data.map((item) => {
                TongPADaGQ += item.SoLuong
                TongPACoDG += item.CoDanhGia
                TongHaiLong += item.HaiLong
                TongChapNhan += item.ChapNhan
                TongKhongHaiLong += item.KhongHaiLong
                TongChuaDanhGia += item.ChuaDanhGia
            })
            this.setState({ dataDanhGia: data, isLoad: false, tongcong: { TongPADaGQ, TongPACoDG, TongHaiLong, TongChapNhan, TongKhongHaiLong, TongChuaDanhGia } })
        }
    }

    componentDidMount() {
        this._GetList_ThongKePA_TheoDonViDanhGia()
    }

    handleFilter = () => {
        Utils.goscreen(this.props.nthis, ConfigScreenDH.Modal_Options, {
            isUseDate: true,
            callBack: this.callbackFilter,
            dateForm: this.state.dateForm,
            dateTo: this.state.dateTo
        })
    }

    callbackFilter = (dateForm, dateTo, Options) => {
        Utils.nlog('calback', dateForm + ',' + dateTo + ',' + Options)
        if (dateForm && dateTo) {
            //Nguoi dung chon khoang thoi gian
            this.setState({
                isLoad: true,
                dateForm: dateForm,
                dateTo: dateTo
            })
            this._GetList_ThongKePA_TheoDonViDanhGia(Moment(dateForm, 'DD/MM/YYYY').format('DD-MM-YYYY'), Moment(dateTo, 'DD/MM/YYYY').format('DD-MM-YYYY'))
        } else {
            //Nguoi dung chon cac option: homnay, 30 ngay truoc....
            const now = Moment(new Date()).format('DD-MM-YYYY');
            if (Options) {
                this.setState({
                    isLoad: true,
                    dateForm: Options,
                    dateTo: now
                })
            }
            this._GetList_ThongKePA_TheoDonViDanhGia(Moment(Options, 'DD/MM/YYYY').format('DD-MM-YYYY'), Moment(now, 'DD/MM/YYYY').format('DD-MM-YYYY'))
        }
    }

    render() {
        const { dataDanhGia, page, tongcong, isLoad } = this.state
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: colors.white, paddingHorizontal: 5 }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ fontWeight: 'bold', color: colors.redStar, paddingVertical: 10, fontSize: reText(18), width: '90%' }} numberOfLines={2}>{'Mức độ hài lòng của người dân về kết quả xử lý'}</Text>
                    <TouchableOpacity onPress={this.handleFilter} style={{ padding: 5, flexDirection: 'row', borderWidth: 1, borderColor: colors.colorHeaderApp }}>
                        <Image source={Images.icFilter} style={[nstyles.nIcon16, { tintColor: colors.black }]} resizeMode='cover' />
                    </TouchableOpacity>
                </View>
                <ScrollView horizontal contentContainerStyle={{ paddingVertical: 10 }}>
                    <View>
                        <View style={{ flexDirection: 'row', width: widthColumn() * 8 }}>
                            <View style={{ width: widthColumn() - widthColumn() / 2, borderWidth: 0.5, borderBottomWidth: 0 }}>
                                <Text style={styles.text}>STT</Text>
                            </View>
                            <View style={{ width: widthColumn() + widthColumn() / 2, borderWidth: 0.5, borderBottomWidth: 0 }}>
                                <Text style={styles.text}>Đơn vị</Text>
                            </View>
                            <View style={{ width: widthColumn(), borderWidth: 0.5, borderBottomWidth: 0 }}>
                                <Text style={styles.text}>P/A đã giải quyết</Text>
                            </View>
                            <View style={{ width: widthColumn(), borderWidth: 0.5, borderBottomWidth: 0 }}>
                                <Text style={styles.text}>P/A có đánh giá</Text>
                            </View>
                            <View style={{ width: widthColumn(), borderWidth: 0.5, borderBottomWidth: 0 }}>
                                <Text style={styles.text}>Hài lòng</Text>
                            </View>
                            <View style={{ width: widthColumn(), borderWidth: 0.5, borderBottomWidth: 0 }}>
                                <Text style={styles.text}>Chấp nhận</Text>
                            </View>
                            <View style={{ width: widthColumn(), borderWidth: 0.5, borderBottomWidth: 0 }}>
                                <Text style={styles.text}>Không hài lòng</Text>
                            </View>
                            <View style={{ width: widthColumn(), borderWidth: 0.5, borderBottomWidth: 0 }}>
                                <Text style={styles.text}>Chưa đánh giá</Text>
                            </View>
                        </View>
                        <View style={{ width: widthColumn() * 8 }}>
                            <View style={{ flexDirection: 'row', width: widthColumn() * 8 }}>
                                <View style={{ width: widthColumn() - widthColumn() / 2, borderWidth: 0.5, borderBottomWidth: 0 }}>
                                    <Text style={styles.text}></Text>
                                </View>
                                <View style={{ width: widthColumn() + widthColumn() / 2, borderWidth: 0.5, borderBottomWidth: 0 }}>
                                    <Text style={[styles.text, { fontWeight: 'bold' }]}>Tổng cộng</Text>
                                </View>
                                <View style={{ width: widthColumn(), borderWidth: 0.5, borderBottomWidth: 0 }}>
                                    <Text style={[styles.text, { fontWeight: 'bold' }]}>{tongcong.TongPADaGQ}</Text>
                                </View>
                                <View style={{ width: widthColumn(), borderWidth: 0.5, borderBottomWidth: 0 }}>
                                    <Text style={[styles.text, { fontWeight: 'bold' }]}>{tongcong.TongPACoDG}</Text>
                                </View>
                                <View style={{ width: widthColumn(), borderWidth: 0.5, borderBottomWidth: 0 }}>
                                    <Text style={[styles.text, { fontWeight: 'bold' }]}>{tongcong.TongHaiLong}</Text>
                                </View>
                                <View style={{ width: widthColumn(), borderWidth: 0.5, borderBottomWidth: 0 }}>
                                    <Text style={[styles.text, { fontWeight: 'bold' }]}>{tongcong.TongChapNhan}</Text>
                                </View>
                                <View style={{ width: widthColumn(), borderWidth: 0.5, borderBottomWidth: 0 }}>
                                    <Text style={[styles.text, { fontWeight: 'bold' }]}>{tongcong.TongKhongHaiLong}</Text>
                                </View>
                                <View style={{ width: widthColumn(), borderWidth: 0.5, borderBottomWidth: 0 }}>
                                    <Text style={[styles.text, { fontWeight: 'bold' }]}>{tongcong.TongChuaDanhGia}</Text>
                                </View>
                            </View>
                            {dataDanhGia.length > 0 && dataDanhGia ?
                                dataDanhGia.map((item, index) => {
                                    return (
                                        <View key={index} style={{ flexDirection: 'row', width: widthColumn() * 8 }}>
                                            <View style={{ width: widthColumn() - widthColumn() / 2, borderWidth: 0.5, borderBottomWidth: index == dataDanhGia.length - 1 ? 0.5 : 0 }}>
                                                <Text style={styles.text}>{index + 1}</Text>
                                            </View>
                                            <View style={{ width: widthColumn() + widthColumn() / 2, borderWidth: 0.5, borderBottomWidth: index == dataDanhGia.length - 1 ? 0.5 : 0 }}>
                                                <Text style={styles.text}>{item.TenDonVi}</Text>
                                            </View>
                                            <View style={{ width: widthColumn(), borderWidth: 0.5, borderBottomWidth: index == dataDanhGia.length - 1 ? 0.5 : 0 }}>
                                                <Text style={[styles.text, { fontWeight: 'bold', color: colors.redStar }]}>{item.SoLuong}</Text>
                                            </View>
                                            <View style={{ width: widthColumn(), borderWidth: 0.5, borderBottomWidth: index == dataDanhGia.length - 1 ? 0.5 : 0 }}>
                                                <Text style={[styles.text, { fontWeight: 'bold', color: colors.colorHeaderApp }]}>{item.CoDanhGia}</Text>
                                            </View>
                                            <View style={{ width: widthColumn(), borderWidth: 0.5, borderBottomWidth: index == dataDanhGia.length - 1 ? 0.5 : 0 }}>
                                                <Text style={styles.text}>{item.HaiLong}</Text>
                                            </View>
                                            <View style={{ width: widthColumn(), borderWidth: 0.5, borderBottomWidth: index == dataDanhGia.length - 1 ? 0.5 : 0 }}>
                                                <Text style={styles.text}>{item.ChapNhan}</Text>
                                            </View>
                                            <View style={{ width: widthColumn(), borderWidth: 0.5, borderBottomWidth: index == dataDanhGia.length - 1 ? 0.5 : 0 }}>
                                                <Text style={styles.text}>{item.KhongHaiLong}</Text>
                                            </View>
                                            <View style={{ width: widthColumn(), borderWidth: 0.5, borderBottomWidth: index == dataDanhGia.length - 1 ? 0.5 : 0 }}>
                                                <Text style={styles.text}>{item.ChuaDanhGia}</Text>
                                            </View>
                                        </View>
                                    )
                                }) :
                                <>
                                    <View style={{ flexDirection: 'row', width: widthColumn() * 8, borderBottomWidth: 0.5 }} />
                                    <Text style={{ textAlign: 'center', paddingVertical: 5, fontSize: reText(12) }}>{isLoad ? 'Đang tải...' : 'Không có dữ liệu...'}</Text>
                                </>
                            }
                        </View>
                    </View>
                </ScrollView>
                <Text style={{ fontStyle: 'italic', paddingVertical: 5, fontSize: reText(12) }}>{'P/A: Phản ánh'}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    text: {
        fontSize: reText(12),
        textAlign: 'center',
        padding: 5
    }
})

export default DanhGiaHaiLong