import React, { Component } from 'react'
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView, RefreshControl
} from 'react-native'
import { nstyles, colors, sizes } from '../../../../styles'
import { Width, Height } from '../../../../styles/styles';
import { HeaderCom } from '../../../../components';
import { Images } from '../../../images';
import ButtonCus from '../../../../components/ComponentApps/ButtonCus';
import Utils from '../../../../app/Utils';
import apis from '../../../apis';
import DatePicker from 'react-native-datepicker';
import Moment from 'moment';
import { ROOTGlobal } from '../../../../app/data/dataGlobal';
import { reText } from '../../../../styles/size';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { appConfig } from '../../../../app/Config';
import { KeyAPIThongKe } from './KeyAPI';
import { nGlobalKeys } from '../../../../app/keys/globalKey';

export class ThongKeHome extends Component {
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
        }
        ROOTGlobal[nGlobalKeys.ThongKeDH].refesh = this._onRefesh;
    }

    componentDidMount() {
        this._GetBieuDo();
        this._GetXuLyQuaHen();
        this._GetXuLyDonVi();
        this.TongHop30NgayTruoc();
        // this.TongHopHomNay()
    }
    _GetBieuDo = async () => {
        let res = await apis.BieuDo.BieuDo_PhanAnhTheoTinhTrangXuLy();
        Utils.nlog("Danh sách biểu đồ tổng", res)
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
            let PhanTramDaXuLy = 0.00, PhanTramDangXuLy = 0.00, PhanTramTreDangXuLy = 0.00, PhanTramTreDaXuLy = 0.00;
            if (Tong > 0) {
                PhanTramDaXuLy = (DaXuLy / Tong) > 0 ? ((DaXuLy / Tong) * 100).toFixed(2) : 0.00
                PhanTramDangXuLy = DangXuLy != 0 && Tong != 0 && (DangXuLy / Tong) > 0 ? ((DangXuLy / Tong) * 100).toFixed(2) : 0.00
                PhanTramTreDangXuLy = QuaHanXuLy != 0 && Tong != 0 && (QuaHanXuLy / Tong) > 0 ? ((QuaHanXuLy / Tong) * 100).toFixed(2) : 0.00
                PhanTramTreDaXuLy = QuahanDaXuLy != 0 && Tong != 0 && (QuahanDaXuLy / Tong) > 0 ? ((QuahanDaXuLy / Tong) * 100).toFixed(2) : 0.00
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
                PhanTramTreDaXuLy,
                PhanTramTreDangXuLy,
            }
            this.setState({ dataBD: _dataBD })
        }
    }
    _GetXuLyQuaHen = async () => {
        let res = await apis.BieuDo.GetList_DanhSachDonViPhanAnhQuaHan();
        // Utils.nlog("Danh sách các đơn vị đã quá hạn xử lý:", res)
        if (res.status == 1) {
            this.setState({ dataHetHan: res.data })
        }
    }
    _GetXuLyDonVi = async () => {
        if (appConfig.IdSource == 'CA') {
            var res = await apis.ThongKeBaoCao.GetListGroup_ThongKePA_TheoDonVi();
        }
        else {
            var res = await apis.ThongKeBaoCao.GetList_ThongKePA_TheoDonVi();
        }
        // Utils.nlog("Danh sách tất cả các đơn vị:--------------->", res)
        if (res.status == 1) {
            this.setState({ dataDonVi: res.data })

        }
    }
    _renderXuLy = ({ item, index }) => {
        Utils.nlog(item)
        return (
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10,
                    marginLeft: 15
                }}>
                <Text style={{ color: 'gray' }}>{item.text}</Text>
                <Text style={{ paddingRight: 25, color: 'gray' }}>{item.Con}</Text>
            </View>
        )
    }

    _onPressHetHanDonVi = (item) => {
        if (appConfig.IdSource == 'UB') {
            return;
        } else {
            Utils.goscreen(this, 'scSoLieuThongKe', { LoaiApi: 1, TitleDetail: 'Xử lý quá hạn \n' + item.TenPhuongXa, ParamAPI: item.IdDVXL })
        }
    }

    _renderXuLyHetHan = (item, index) => {
        return (
            <TouchableOpacity
                key={item.IdDVXL}
                disabled={appConfig.IdSource == 'UB' ? true : false}
                onPress={() => this._onPressHetHanDonVi(item)}
                style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, marginLeft: 15 }}>
                <Text style={{ color: 'gray', flex: 1, }}>{item.TenPhuongXa}</Text>
                <Text style={{ paddingRight: 25, color: 'gray' }}>{item.SoLuong}</Text>
            </TouchableOpacity>
        )
    }

    _onPressThongKeDonVi = (item) => {
        if (appConfig.IdSource == 'UB') {
            return;
        } else {
            Utils.goscreen(this, 'scSoLieuThongKe', { LoaiApi: 2, TitleDetail: 'Thống kê ' + item.TenMuc, ParamAPI: item.IdMuc })
        }
    }

    _renderXuLyDonVi = (item, index) => {
        return (
            <TouchableOpacity
                disabled={appConfig.IdSource == 'UB' ? true : false}
                onPress={() => this._onPressThongKeDonVi(item)}
                key={item.IdMuc}
                style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 10 }}
            >
                <Text style={{ color: 'gray', flex: 1, textAlign: 'justify', paddingRight: 20 }}>{item.TenMuc}</Text>
                <Text style={{ color: 'gray' }}>{item.SoLuong}</Text>
            </TouchableOpacity>
        )
    }

    ChooseDate = () => {
        this.setState({
            isChooseDate: true, titleTongHop: '',
            dataDATE: {
                Tong: 0,
                DaXuLy: 0,
                TrongDaXuLy: 0,
                QuahanDaXuLy: 0,
                DangXuLy: 0,
                TrongHanXuLy: 0,
                QuaHanXuLy: 0,
            },
            FromDate: '',
            ToDate: '',
        })

    }

    TongHopHomNay = async () => {
        let nowday = Moment().format('YYYY-MM-DD');
        this.setState({ titleTongHop: 'Hôm nay', isChooseDate: false, FromDate: Moment(nowday).format('DD/MM/YYYY'), ToDate: Moment(nowday).format('DD/MM/YYYY') })
        let res = await apis.BieuDo.BieuDo_PhanAnhTheoTinhTrangXuLy(nowday, nowday);
        Utils.nlog('Gia tri data home nay <>>>>>>>>>', res.data)
        if (res.status == 1 && res.data) {
            this.setState({ dataDATE: res.data })
        }
        else { this.setState({ dataDATE: [] }) }
    }

    TongHop30NgayTruoc = async () => {
        let _30datebefore = Moment().subtract(30, 'days').format('YYYY-MM-DD');
        let nowday = Moment().format('YYYY-MM-DD');
        this.setState({ titleTongHop: '30 ngày trước', isChooseDate: false, FromDate: Moment(_30datebefore).format('DD/MM/YYYY'), ToDate: Moment(nowday).format('DD/MM/YYYY') })

        let res = await apis.BieuDo.BieuDo_PhanAnhTheoTinhTrangXuLy(_30datebefore, nowday);
        Utils.nlog('30 ngay truoc', res)
        if (res.status == 1 && res.data) {
            this.setState({ dataDATE: res.data })
        } else { this.setState({ dataDATE: [] }) }
    }

    TuNgay = (date) => {
        let { ToDate } = this.state;
        let FromDate = date;
        if (Moment(FromDate, "DD/MM/YYYY").isAfter(Moment(ToDate, "DD/MM/YYYY"))) {
            FromDate = ToDate
        }
        this.setState({
            FromDate: FromDate,
            titleTongHop: ''
        })
        this._thongKeChuoiNgay(FromDate, ToDate)
    }

    DenNgay = (date) => {
        let { FromDate } = this.state;
        let ToDate = date;
        if (Moment(ToDate, "DD/MM/YYYY").isBefore(Moment(FromDate, "DD/MM/YYYY"))) {
            ToDate = FromDate
        }
        this.setState({
            ToDate: ToDate,
            titleTongHop: ''
        })
        this._thongKeChuoiNgay(FromDate, ToDate)
    }

    _thongKeChuoiNgay = async (FromDate, ToDate) => {
        let tungay = Moment(FromDate, 'DD-MM-YYYY').format('YYYY-MM-DD');
        let denngay = Moment(ToDate, 'DD-MM-YYYY').format('YYYY-MM-DD');
        if (tungay && denngay) {
            let res = await apis.BieuDo.BieuDo_PhanAnhTheoTinhTrangXuLy(tungay, denngay)
            if (res.status == 1 && res.data) {
                this.setState({ dataDATE: res.data })
            } else { this.setState({ dataDATE: [] }) }
        }
    }
    _onRefesh = async () => {
        this.setState({ refesh: true })
        await this._GetBieuDo();
        await this._GetXuLyQuaHen();
        await this._GetXuLyDonVi();
        await this.TongHopHomNay();
        this.setState({ refesh: false })
    }

    _openDrawer = () => {
        this.props.navigation.openDrawer()
    }
    //
    _onPressThongKe = (key, ToDate = this.state.ToDate, FromDate = this.state.FromDate) => {
        if (appConfig.IdSource == 'UB') {
            return;
        } else {
            switch (key) {
                case KeyAPIThongKe.TongSoPhanAnh:
                    Utils.goscreen(this, 'scSoLieuThongKe', { LoaiApi: 0, TitleDetail: 'Tổng số phản ánh', ParamAPI: KeyAPIThongKe.TongSoPhanAnh, ToDate, FromDate })
                    break;
                case KeyAPIThongKe.TongDaXuLy:
                    Utils.goscreen(this, 'scSoLieuThongKe', { LoaiApi: 0, TitleDetail: 'Tổng đã xử lý', ParamAPI: KeyAPIThongKe.TongDaXuLy, ToDate, FromDate })
                    break;
                case KeyAPIThongKe.TrongHanDaXuLy:
                    Utils.goscreen(this, 'scSoLieuThongKe', { LoaiApi: 0, TitleDetail: 'Trong hạn đã xử lý', ParamAPI: KeyAPIThongKe.TrongHanDaXuLy, ToDate, FromDate })
                    break;
                case KeyAPIThongKe.QuaHanDaXuLy:
                    Utils.goscreen(this, 'scSoLieuThongKe', { LoaiApi: 0, TitleDetail: 'Quá hạn đã xử lý', ParamAPI: KeyAPIThongKe.QuaHanDaXuLy, ToDate, FromDate })
                    break;
                case KeyAPIThongKe.TongDangXuLy:
                    Utils.goscreen(this, 'scSoLieuThongKe', { LoaiApi: 0, TitleDetail: 'Tổng đang xử lý', ParamAPI: KeyAPIThongKe.TongDangXuLy, ToDate, FromDate })
                    break;
                case KeyAPIThongKe.TrongHanDangXuLy:
                    Utils.goscreen(this, 'scSoLieuThongKe', { LoaiApi: 0, TitleDetail: 'Trong hạn đang xử lý', ParamAPI: KeyAPIThongKe.TrongHanDangXuLy, ToDate, FromDate })
                    break;
                case KeyAPIThongKe.QuaHanDangXuLy:
                    Utils.goscreen(this, 'scSoLieuThongKe', { LoaiApi: 0, TitleDetail: 'Quá hạn đang xử lý', ParamAPI: KeyAPIThongKe.QuaHanDangXuLy, ToDate, FromDate })
                    break;
                default:
                    break;
            }
        }
    }
    render() {
        const { ncol, ncontainer } = nstyles.nstyles
        const { dataBD, dataDATE } = this.state
        // Utils.nlog("Dữ liệu sau khi:", dataBD.TrongHanXuLy, dataBD.TrongDaXuLy)
        return (
            <View style={ncontainer}>
                <HeaderCom
                    titleText='Tổng hợp - thống kê'
                    iconLeft={Images.icSlideMenu}
                    onPressLeft={this._openDrawer}
                    hiddenIconRight={true}
                    nthis={this} />
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            tintColor={colors.black}
                            onRefresh={this._onRefesh}
                            refreshing={this.state.refesh}
                        />
                    }
                    ref={ref => this.scrollViewRef = ref}
                    showsVerticalScrollIndicator={false}
                    style={{ marginBottom: isIphoneX() ? 20 : 10 }}

                >
                    <View style={[ncol, { marginHorizontal: 10, marginTop: 10 }]}>
                        <View style={{ flexDirection: 'row' }}>
                            <View
                                style={[nstyles.nstyles.shadow, {
                                    backgroundColor: '#FF6633',
                                    borderRadius: 10, width: '100%', marginBottom: 10,
                                    alignSelf: 'center', marginRight: 5,
                                    justifyContent: 'center', alignItems: 'center', paddingVertical: 20
                                }]}>
                                <Text style={styles.title_menu9}>{`Tổng số phản ánh`}</Text>
                                <TouchableOpacity
                                    disabled={appConfig.IdSource == 'UB' ? true : false}
                                    onPress={() => this._onPressThongKe(KeyAPIThongKe.TongSoPhanAnh, '', '')}
                                >
                                    <Text style={styles.textTong9}>{dataBD.Tong}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            {/* Đang xử lý */}
                            <View
                                style={[nstyles.nstyles.shadow, {
                                    flexDirection: 'column', backgroundColor: '#3366FF',
                                    borderRadius: 10, flex: 1, marginRight: 5,
                                    justifyContent: 'center', alignItems: 'center', paddingVertical: 20
                                }]}>
                                <Text style={styles.title_menu}>{`Đang xử lý`}</Text>
                                <TouchableOpacity
                                    disabled={appConfig.IdSource == 'UB' ? true : false}
                                    onPress={() => this._onPressThongKe(KeyAPIThongKe.TongDangXuLy, '', '')}
                                >
                                    <Text style={styles.textTong}>{dataBD.DangXuLy}</Text>
                                </TouchableOpacity>
                                <Text style={styles.textPhanTram}>{dataBD.PhanTramDangXuLy ? dataBD.PhanTramDangXuLy + "%" : ''}</Text>
                                <TouchableOpacity
                                    activeOpacity={0.5}
                                    disabled={appConfig.IdSource == 'UB' ? true : false}
                                    onPress={() => this._onPressThongKe(KeyAPIThongKe.TrongHanDangXuLy, '', '')}
                                >
                                    <Text style={[styles.text, { marginBottom: 2 }]}>Trong hạn : {dataBD.TrongHanXuLy}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    disabled={appConfig.IdSource == 'UB' ? true : false}
                                    onPress={() => this._onPressThongKe(KeyAPIThongKe.QuaHanDangXuLy, '', '')}
                                >
                                    <Text style={[styles.text, { color: '#DA3B21', fontWeight: "500" }]}>Trễ hạn: {dataBD.QuaHanXuLy}</Text>
                                </TouchableOpacity>
                                <Text style={[styles.textPhanTram, { color: colors.redStar }]}>{dataBD.PhanTramDaXuLy ? dataBD.PhanTramTreDangXuLy + "%" : ''}</Text>
                            </View>
                            {/* Đã xử lý */}
                            <View
                                style={[nstyles.nstyles.shadow, {
                                    backgroundColor: "#008800",
                                    borderRadius: 10, flex: 1,
                                    justifyContent: 'center', alignItems: 'center', paddingVertical: 20
                                }]}>
                                <Text style={styles.title_menu}>{`Đã xử lý`}</Text>
                                <TouchableOpacity
                                    disabled={appConfig.IdSource == 'UB' ? true : false}
                                    onPress={() => this._onPressThongKe(KeyAPIThongKe.TongDaXuLy, '', '')}
                                >
                                    <Text style={styles.textTong}>{dataBD.DaXuLy}</Text>
                                </TouchableOpacity>
                                <Text style={styles.textPhanTram}>{dataBD.PhanTramDaXuLy ? dataBD.PhanTramDaXuLy + "%" : ''}</Text>
                                <TouchableOpacity
                                    disabled={appConfig.IdSource == 'UB' ? true : false}
                                    onPress={() => this._onPressThongKe(KeyAPIThongKe.TrongHanDaXuLy, '', '')}
                                >
                                    <Text style={[styles.text, { marginBottom: 2 }]}>Trong hạn: {dataBD.TrongDaXuLy}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    disabled={appConfig.IdSource == 'UB' ? true : false}
                                    onPress={() => this._onPressThongKe(KeyAPIThongKe.QuaHanDaXuLy, '', '')}
                                >
                                    <Text style={[styles.text, { color: "#DA3B21", fontWeight: "500" }]}>Trễ hạn: {dataBD.QuahanDaXuLy}</Text>
                                </TouchableOpacity>
                                <Text style={[styles.textPhanTram, { color: colors.redStar }]}>{dataBD.PhanTramDaXuLy ? dataBD.PhanTramTreDaXuLy + "%" : ''}</Text>
                            </View>
                        </View>
                    </View>
                    {/* {Thống kê theo ngày} */}
                    <View
                        style={[nstyles.nstyles.shadow,
                        {
                            margin: 10,
                            marginHorizontal: 10,
                            borderWidth: 1, backgroundColor: 'white',
                            borderStyle: 'dashed', borderColor: 'white',
                            paddingBottom: 10
                        }]}
                    >
                        <View style={[nstyles.nstyles.nrow, { padding: 10 }]}>
                            <ButtonCus
                                stContainerR={{ flex: 1, backgroundColor: '#05ACD3', marginTop: 0, alignSelf: 'flex-start', minWidth: Width(25) }}
                                textTitle='Hôm nay'
                                stText={{ fontSize: 12 }}
                                onPressB={this.TongHopHomNay}
                            />
                            <ButtonCus
                                stContainerR={{ flex: 1, backgroundColor: '#76AF02', marginTop: 0, alignSelf: 'flex-start', minWidth: Width(25) }}
                                textTitle='30 ngày trước'
                                onPressB={this.TongHop30NgayTruoc}
                                stText={{ fontSize: 12 }}
                            />
                            <ButtonCus
                                stContainerR={{ flex: 1, backgroundColor: '#D9AC2A', marginTop: 0, alignSelf: 'flex-start', minWidth: Width(25) }}
                                textTitle='Chọn thời gian'
                                onPressB={this.ChooseDate}
                                stText={{ fontSize: 12 }}
                            />
                        </View>
                        {
                            this.state.isChooseDate ?
                                <View style={[nstyles.nstyles.nrow, { paddingHorizontal: 10 }]}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ paddingVertical: 5 }}>Từ ngày</Text>
                                        <DatePicker
                                            customStyles={{
                                                datePicker: {
                                                    backgroundColor: '#d1d3d8',
                                                    justifyContent: 'center'
                                                }
                                            }}
                                            locale={'vi'}
                                            date={this.state.FromDate}
                                            confirmBtnText={'Xác nhận'}
                                            cancelBtnText={'Hủy'}
                                            mode="date"
                                            placeholder="Chọn ngày"
                                            showIcon={false}
                                            format={'DD/MM/YYYY'}
                                            style={{ flex: 1, width: '100%' }}
                                            onDateChange={(date) => this.TuNgay(date)}

                                        />
                                    </View>
                                    <View style={{ flex: 1, marginLeft: 5 }}>
                                        <Text style={{ paddingVertical: 5 }}>Đến ngày</Text>
                                        <DatePicker
                                            customStyles={{
                                                datePicker: {
                                                    backgroundColor: '#d1d3d8',
                                                    justifyContent: 'center'
                                                }
                                            }}
                                            locale={'vi'}
                                            date={this.state.ToDate}
                                            confirmBtnText={'Xác nhận'}
                                            cancelBtnText={'Hủy'}
                                            mode="date"
                                            placeholder="Chọn ngày"
                                            showIcon={false}
                                            format={'DD/MM/YYYY'}
                                            style={{ flex: 1, width: '100%' }}
                                            onDateChange={(date) => this.DenNgay(date)}
                                        />
                                    </View>
                                </View> : null
                        }
                        <View
                            style={{
                                borderBottomWidth: 0.5,
                                borderColor: 'gray',
                                paddingHorizontal: 10,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                            <Text
                                style={{
                                    paddingVertical: 10,
                                    alignSelf: 'center',
                                    fontWeight: 'bold',
                                    fontSize: sizes.sizes.sText16,
                                    color: '#1364DC',
                                    textAlign: 'center'
                                }} > Tổng hợp thống kê phản ánh
                                {this.state.titleTongHop ? ' - ' + this.state.titleTongHop : this.state.FromDate || this.state.ToDate ? '\nTừ ' + this.state.FromDate + ' đến ' + this.state.ToDate : null}
                            </Text>
                        </View>
                        <TextLine
                            title={'❖ Tổng số phản ánh'} value={dataDATE.Tong ? dataDATE.Tong : "0"}
                            onPress={() => this._onPressThongKe(KeyAPIThongKe.TongSoPhanAnh)}
                            disabled={appConfig.IdSource == 'UB' ? true : false}
                        />
                        <TextLine
                            title={'❖ Đã xử lý'} value={dataDATE.DaXuLy ? dataDATE.DaXuLy : "0"}
                            onPress={() => this._onPressThongKe(KeyAPIThongKe.TongDaXuLy)}
                            disabled={appConfig.IdSource == 'UB' ? true : false}
                        />
                        <TextLine
                            title={'❖ Trong hạn đã xử lý'} value={dataDATE.TrongDaXuLy ? dataDATE.TrongDaXuLy : "0"}
                            onPress={() => this._onPressThongKe(KeyAPIThongKe.TrongHanDaXuLy)}
                            disabled={appConfig.IdSource == 'UB' ? true : false}
                        />
                        <TextLine
                            title={'❖ Quá hạn đã xử lý'} value={dataDATE.QuahanDaXuLy ? dataDATE.QuahanDaXuLy : "0"}
                            onPress={() => this._onPressThongKe(KeyAPIThongKe.QuaHanDaXuLy)}
                            disabled={appConfig.IdSource == 'UB' ? true : false}
                        />
                        <TextLine
                            title={'❖ Đang xử lý'} value={dataDATE.DangXuLy ? dataDATE.DangXuLy : "0"}
                            onPress={() => this._onPressThongKe(KeyAPIThongKe.TongDangXuLy)}
                            disabled={appConfig.IdSource == 'UB' ? true : false}
                        />
                        <TextLine
                            title={'❖ Trong hạn đang xử lý'} value={dataDATE.TrongHanXuLy ? dataDATE.TrongHanXuLy : "0"}
                            onPress={() => this._onPressThongKe(KeyAPIThongKe.TrongHanDangXuLy)}
                            disabled={appConfig.IdSource == 'UB' ? true : false}
                        />
                        <TextLine
                            title={'❖ Quá hạn đang xử lý'} value={dataDATE.QuaHanXuLy ? dataDATE.QuaHanXuLy : "0"}
                            onPress={() => this._onPressThongKe(KeyAPIThongKe.QuaHanDangXuLy)}
                            disabled={appConfig.IdSource == 'UB' ? true : false}
                        />
                    </View>
                    <TouchableOpacity
                        style={[nstyles.nstyles.shadow,
                        {
                            marginHorizontal: 10,
                            marginBottom: 5,
                            justifyContent: 'center',
                            borderWidth: 1, backgroundColor: 'white',
                            borderStyle: 'dashed', borderColor: 'white',
                            paddingVertical: 15
                        }]}
                        onPress={() => this.setState({ isShow: !this.state.isShow })}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ color: 'red', fontSize: sizes.sizes.sText15, fontWeight: 'bold', paddingLeft: 10 }}>DANH SÁCH CÁC ĐƠN VỊ QUÁ HẠN XỬ LÝ</Text>
                            <Image
                                source={Images.icDropDown}
                                style={{ tintColor: '#A6A3A3', marginRight: 10, marginTop: 5 }}
                            />
                        </View>
                    </TouchableOpacity>
                    {
                        this.state.isShow == true ?
                            <View
                                style={[nstyles.nstyles.shadow,
                                {
                                    marginHorizontal: 10,
                                    justifyContent: 'center',
                                    borderWidth: 1, backgroundColor: 'white',
                                    borderStyle: 'dashed', borderColor: 'white',
                                }]}>
                                {
                                    this.state.dataHetHan ? this.state.dataHetHan.map(this._renderXuLyHetHan) : null
                                }
                            </View>
                            : null
                    }
                    <TouchableOpacity
                        style={[nstyles.nstyles.shadow,
                        {
                            marginHorizontal: 10, marginTop: 10,
                            justifyContent: 'center',
                            borderWidth: 1, backgroundColor: 'white',
                            borderStyle: 'dashed', borderColor: 'white', paddingVertical: 15
                        }]}
                        onPress={() => {
                            this.setState({ isShow1: !this.state.isShow1 }, () =>
                                setTimeout(() => {
                                    this.scrollViewRef.scrollToEnd()
                                }, 300))
                        }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{
                                color: 'red', fontSize: sizes.sizes.sText15,
                                fontWeight: 'bold', paddingLeft: 10, textAlign: 'center'
                            }}>
                                DACH SÁCH TẤT CẢ ĐƠN VỊ
                            </Text>
                            <Image
                                source={Images.icDropDown}
                                style={{ tintColor: '#A6A3A3', marginRight: 10, marginTop: 5, }}
                            />
                        </View>
                    </TouchableOpacity>
                    {
                        this.state.isShow1 == true ?
                            <View
                                style={[nstyles.nstyles.shadow, nstyles.paddingBotX,
                                {
                                    marginHorizontal: 10, marginBottom: isIphoneX() ? 30 : 10,
                                    justifyContent: 'center', marginTop: 5,
                                    borderWidth: 1, backgroundColor: 'white',
                                    borderStyle: 'dashed', borderColor: 'white',
                                }]}
                            >
                                {
                                    this.state.dataDonVi ? this.state.dataDonVi.map(this._renderXuLyDonVi) : null
                                }
                            </View>
                            : null
                    }
                </ScrollView>
            </View>
        )
    }
}

export default ThongKeHome

const styles = StyleSheet.create({
    noidung: {
        fontSize: sizes.sizes.sText16,
        color: 'gray',
        // fontWeight: 'bold'
    },
    menu: {
        padding: Platform.OS == 'ios' ? 14 : 12
    },
    title_menu9: {
        color: 'white',
        fontSize: reText(30),
        paddingBottom: 10

    },
    textTong9: {
        fontSize: reText(40),
        color: 'white',
        fontWeight: '800'
    },
    title_menu: {
        color: 'white',
        fontSize: reText(20),
        paddingBottom: 5

    },
    textTong: {
        fontSize: 30,
        color: 'white',
        fontWeight: '800'
    },
    text: {
        fontSize: 18,
        color: 'white',
    },
    textPhanTram: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center'
    }
})

const TextLine = (props) => {
    const { title, value, onPress } = props;
    return (
        <TouchableOpacity {...props} onPress={onPress} style={{ paddingHorizontal: 10, paddingTop: 15 }}>
            <View style={[nstyles.nstyles.nrow, { justifyContent: 'space-between' }]}>
                <Text style={styles.noidung}>{title}</Text>
                <Text style={styles.noidung}>{value}</Text>
            </View>
        </TouchableOpacity>
    )
}
