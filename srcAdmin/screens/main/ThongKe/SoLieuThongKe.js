import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import DatePicker from 'react-native-datepicker';
import apis from '../../../apis';
import Utils from '../../../../app/Utils';
import { HeaderCom, ListEmpty } from '../../../../components';
import { Images } from '../../../images';
import { colors } from '../../../../styles';
import { reText, sizes } from '../../../../styles/size';
import { nstyles } from '../../../../styles/styles';
import Moment from 'moment';
import { ItemDanhSach } from '../../PhanAnhHienTruong';
import * as Animatable from 'react-native-animatable';
import { isIphoneX } from 'react-native-iphone-x-helper';

class SoLieuThongKe extends Component {
    constructor(props) {
        super(props);
        this.LoaiApi = Utils.ngetParam(this, 'LoaiApi', 0) // 0 là tổng hợp theo từng loại tình trạng, 1 là theo quá hạn của từng đơn vị, 2 là dữ liệu tổng hợp của 1 đơn vị
        this.TitleDetail = Utils.ngetParam(this, 'TitleDetail', 'Chi tiết thống kê')
        this.ParamAPI = Utils.ngetParam(this, 'ParamAPI', 0)
        this.ToDate = Utils.ngetParam(this, 'ToDate', '')
        this.FromDate = Utils.ngetParam(this, 'FromDate', '')
        this.pageAll = 0
        this.Total = 0
        this.state = {
            ToDate: this.ToDate ? this.ToDate : '',
            FromDate: this.FromDate ? this.FromDate : '',
            dataThongKe: [],
            refreshing: true,
            page: 1,
        };
    }

    componentDidMount() {
        this.getData()
    }

    //Hàm phân loại get dữ liệu tùy theo loại API thống kê
    getData = async () => {
        this.setState({ refreshing: true })
        let res = ''
        if (this.LoaiApi == 0) {
            res = await apis.BieuDo.BieuDo_PhanAnhTheoTinhTrangXuLy_ChiTiet(this.ParamAPI, 1, this.state.FromDate ? Moment(this.state.FromDate, 'DD/MM/YYYY').format('YYYY-MM-DD') : '', this.state.ToDate ? Moment(this.state.ToDate, 'DD/MM/YYYY').format('YYYY-MM-DD') : '')
        } else if (this.LoaiApi == 1) {
            res = await apis.BieuDo.GetList_DanhSachDonViPhanAnhQuaHan_ChiTiet(this.ParamAPI, 1, this.state.FromDate ? Moment(this.state.FromDate, 'DD/MM/YYYY').format('YYYY-MM-DD') : '', this.state.ToDate ? Moment(this.state.ToDate, 'DD/MM/YYYY').format('YYYY-MM-DD') : '')
        } else {
            res = await apis.BieuDo.GetList_ThongKePA_TheoDonVi_ChiTiet(this.ParamAPI, 1, this.state.FromDate ? Moment(this.state.FromDate, 'DD/MM/YYYY').format('DD-MM-YYYY') : '', this.state.ToDate ? Moment(this.state.ToDate, 'DD/MM/YYYY').format('DD-MM-YYYY') : '')
        }

        Utils.nlog('data chi tiet thong ke loai :<><><>' + this.LoaiApi, res)
        if (res.status == 1 && res.data) {
            this.pageAll = res.page.AllPage
            this.Total = res.page.Total
            this.setState({
                dataThongKe: res.data,
                refreshing: false,
                page: res.page.Page,
            })
        } else {
            this.Total = 0
            this.setState({ dataThongKe: [], refreshing: false })
        }
    }

    TuNgay = (date) => {
        let { ToDate } = this.state;
        let FromDate = date;
        if (Moment(FromDate, "DD/MM/YYYY").isAfter(Moment(ToDate, "DD/MM/YYYY"))) {
            FromDate = ToDate
        }
        this.setState({
            FromDate: FromDate,
            titleTongHop: '',
        }, this._onRefresh)
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
        }, this._onRefresh)
    }

    _renderItem = ({ item, index }) => {
        return (
            // <Animatable.View animation={index % 2 == 0 ? 'slideInLeft' : 'slideInRight'}>
            <ItemDanhSach
                // ThoiGian={this.state.selectBuocXuLy.IdStep == -2 ? 'NgayChuyen' : undefined}
                type={2}
                item={item}
                nthis={this}
                goscreen={() => this._touchItem(item)}
                // goTuongTu={() => this._onTuongTu(item.IdPA, item.NoiDung)}
                IsDaXyLy={0}
                isCheckTinhTrang={0} // check tinh trang có phải kiểm soát phản ánh
            />
            // </Animatable.View>
        )
    };
    _callbackThis = (nthis) => {
        Utils.goscreen(this, 'scSoLieuThongKe', { LoaiApi: this.LoaiApi, TitleDetail: this.TitleDetail, ParamAPI: this.ParamAPI, ToDate: this.state.ToDate, FromDate: this.state.FromDate })
    }
    _touchItem = (item) => {
        // alert(1);
        const { IdPA, IsComeBackProcess = false } = item;
        let Param = {
            IdPA,
            callback: this._callbackThis,
            PANB: this.PANB,
            isMenuMore: 0,
            DesignDefault: "0",
            IsComeBackProcess: IsComeBackProcess
        }
        // Utils.nlog("gia triparam-----------------:-----------------:)", Param);
        //check Project comeback
        Utils.goscreen(this, 'sc_ChiTietPhanAnh', Param);
        this._onRefresh();
    }

    _keyExtrac = (item, index) => `${item.IdPA + '_' + index}`;

    _onRefresh = () => {
        this.setState({ refreshing: true },
            () => this.getData());
    }

    loadMore = async () => {

        const { page } = this.state;
        // alert(page + '-' + this.pageAll)
        const pageNumber = page + 1;
        if (page < this.pageAll) {
            let res = ''
            if (this.LoaiApi == 0) {
                res = await apis.BieuDo.BieuDo_PhanAnhTheoTinhTrangXuLy_ChiTiet(this.ParamAPI, pageNumber, this.state.FromDate ? Moment(this.state.FromDate, 'DD/MM/YYYY').format('YYYY-MM-DD') : '', this.state.ToDate ? Moment(this.state.ToDate, 'DD/MM/YYYY').format('YYYY-MM-DD') : '')
            } else if (this.LoaiApi == 1) {
                res = await apis.BieuDo.GetList_DanhSachDonViPhanAnhQuaHan_ChiTiet(this.ParamAPI, pageNumber, this.state.FromDate ? Moment(this.state.FromDate, 'DD/MM/YYYY').format('YYYY-MM-DD') : '', this.state.ToDate ? Moment(this.state.ToDate, 'DD/MM/YYYY').format('YYYY-MM-DD') : '')
            } else {
                res = await apis.BieuDo.GetList_ThongKePA_TheoDonVi_ChiTiet(this.ParamAPI, pageNumber, this.state.FromDate ? Moment(this.state.FromDate, 'DD/MM/YYYY').format('DD-MM-YYYY') : '', this.state.ToDate ? Moment(this.state.ToDate, 'DD/MM/YYYY').format('DD-MM-YYYY') : '')
            }
            Utils.nlog('data loadmore', res)
            if (res.status == 1 && res.data.length) {
                const dataThongKe = [...this.state.dataThongKe, ...res.data];
                this.setState({ dataThongKe, page: pageNumber });
            };
        };
    }

    _ListFooterComponent = () => {
        if (this.state.page < this.pageAll && this.state.dataThongKe.length > 0)
            return <ActivityIndicator size='small' style={{ marginTop: 10 }} />;
        else return null
    }

    _ItemSeparatorComponent() {
        return <View style={{ height: 5, backgroundColor: 'transparent' }} />
    }

    render() {
        let { selectLoaiDanhGia } = this.state
        return (
            <View style={nstyles.ncontainer}>
                <HeaderCom
                    styleContent={{ backgroundColor: colors.colorHeaderApp }}
                    titleText={this.TitleDetail}
                    iconLeft={Images.icBack}
                    onPressLeft={() => Utils.goback(this)}
                    hiddenIconRight={true}
                    nthis={this} />
                {
                    this.LoaiApi != 0 ?
                        <Text style={{ textAlign: 'center', fontSize: reText(18), paddingVertical: 8, fontWeight: 'bold', color: colors.colorBlueLight }}>{this.TitleDetail}</Text>
                        : null
                }
                {
                    // this.LoaiApi == 0 ?
                    <View style={[nstyles.nrow, { paddingHorizontal: 10, marginBottom: 5 }]}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ paddingVertical: 5 }}>Từ ngày</Text>
                            <DatePicker
                                customStyles={{
                                    datePicker: {
                                        backgroundColor: 'white',
                                        justifyContent: 'center'
                                    },
                                    dateInput: {
                                        backgroundColor: 'white'
                                    },
                                }}
                                locale={'vi'}
                                date={this.state.FromDate}
                                confirmBtnText={'Xác nhận'}
                                cancelBtnText={'Hủy'}
                                mode="date"
                                placeholder="Chọn ngày"
                                showIcon={false}
                                format={'DD/MM/YYYY'}
                                style={{ width: '100%' }}
                                onDateChange={(date) => this.TuNgay(date)}

                            />
                        </View>
                        <View style={{ flex: 1, marginLeft: 5 }}>
                            <Text style={{ paddingVertical: 5 }}>Đến ngày</Text>
                            <DatePicker
                                customStyles={{
                                    datePicker: {
                                        backgroundColor: 'white',
                                        justifyContent: 'center'
                                    },
                                    dateInput: {
                                        backgroundColor: 'white'
                                    },
                                }}
                                locale={'vi'}
                                date={this.state.ToDate}
                                confirmBtnText={'Xác nhận'}
                                cancelBtnText={'Hủy'}
                                mode="date"
                                placeholder="Chọn ngày"
                                showIcon={false}
                                format={'DD/MM/YYYY'}
                                style={{ width: '100%' }}
                                onDateChange={(date) => this.DenNgay(date)}
                            />
                        </View>
                    </View>
                    // : null
                }
                <Text style={{ fontSize: reText(14), fontWeight: 'bold', color: colors.redStar, paddingHorizontal: 10 }}>Số lượng: {this.Total}</Text>
                <View style={[nstyles.nbody, { paddingHorizontal: 10, paddingTop: 5, marginBottom: isIphoneX() ? 20 : 10 }]}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        style={{ flex: 1, }}
                        // contentContainerStyle={{ flex: 1 }}
                        data={this.state.dataThongKe}
                        renderItem={this._renderItem}
                        keyExtractor={this._keyExtrac}
                        ListEmptyComponent={<ListEmpty />}
                        ItemSeparatorComponent={this._ItemSeparatorComponent}
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                        onEndReached={this.loadMore}
                        onEndReachedThreshold={0.3}
                        ListFooterComponent={this._ListFooterComponent}
                    />
                </View>
            </View>
        );
    }
}

export default SoLieuThongKe;
