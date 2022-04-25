import React, { Component } from 'react';
import { View, Text, TouchableHighlight, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import DatePicker from 'react-native-datepicker';
import Utils from '../../../app/Utils';
import { HeaderCom, ListEmpty } from '../../../components';
import { Images } from '../../images';
import { nstyles } from '../../../styles/styles';
import * as Animatable from 'react-native-animatable';
import apis from '../../apis';
import Moment from 'moment'
import { reText } from '../../../styles/size';
import { colors } from '../../../styles';
import { isIphoneX } from 'react-native-iphone-x-helper';

class ChiTietThongKeDonVi extends Component {
    constructor(props) {
        const dayFrom = Moment(new Date(), "DD/MM/YYYY").add(-30, "days")
        const dayTo = Moment(new Date(), "DD/MM/YYYY");
        super(props);
        this.IdDonVi = Utils.ngetParam(this, 'IdDonVi', '')
        this.FromDate = Utils.ngetParam(this, 'TuNgay', '')
        this.ToDate = Utils.ngetParam(this, 'DenNgay', '')
        this.Values = Utils.ngetParam(this, 'Values', '')
        this.LinhVuc = Utils.ngetParam(this, 'LinhVuc', '')
        this.AllPage = 0
        this.ToTal = 0
        this.state = {
            FromDate: this.FromDate ? this.FromDate : dayFrom,
            ToDate: this.ToDate ? this.ToDate : dayTo,
            refreshing: true,
            dataXPHC: [],
            page: 1
        };
    }

    componentDidMount() {
        this.LoadData()
    }

    LoadData = async () => {
        // alert(this.LinhVuc)
        let { FromDate, ToDate, page } = this.state
        this.setState({ refreshing: true, })
        let body = {
            "sortOrder": "asc",
            "sortField": "",
            "page": page,
            "record": 10,
            "OrderBy": "",
            "filter.keys": "tungay|denngay|linhvuc|iddonvi|loaithongke|IsDungHan|trangthaithihanh|type",
            "filter.vals": `${Moment(FromDate, 'DD/MM/YYYY').format('DD-MM-YYYY')}|${Moment(ToDate, 'DD/MM/YYYY').format('DD-MM-YYYY')}|${this.LinhVuc ? this.LinhVuc : ''}|${this.IdDonVi}|${this.Values}`,
        }
        let res = await apis.ApiTKXPHC.GetList_ThongKeXuPhat_TheoDonVi_ChiTiet(body)
        Utils.nlog('Danh sách chi tiết xử phạt du lieu: ', res)
        if (res.status == 1 && res.data) {
            this.AllPage = res.page.AllPage
            this.ToTal = res.page.Total
            this.setState({ dataXPHC: res.data, refreshing: false, page: res.page.Page });
        }
        else {
            this.AllPage = 0
            this.setState({ dataXPHC: [], refreshing: false, page: 1 });
        }
    }

    _onRefresh = () => {
        this.setState({ refreshing: true, page: 1 },
            () => this.LoadData());
    }

    _renderItem = ({ item, index }) => {
        Utils.nlog('Gia tri item chi tiet=======', item)
        return (
            <Animatable.View animation={index % 2 == 0 ? 'slideInRight' : 'slideInLeft'} style={{ paddingHorizontal: 10, marginBottom: 5, }}>
                <TouchableOpacity
                    onPress={() => this.props.navigation.push('Modal_ChiTietTKDV', { ItemXuPhat: item, callback: this.LoadData, isDSThongKeDV: true, })}
                    activeOpacity={0.5} style={{ backgroundColor: 'white', borderRadius: 5, padding: 5 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: reText(14) }}>{item.CongDan}</Text>
                        <Text style={{ fontSize: reText(14) }}>{item.CreatedDate}</Text>
                    </View>
                    <Text style={{ fontSize: reText(13), paddingVertical: 10 }} numberOfLines={3}>{item.HanhVi}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 }}>
                        <View>
                            <Text style={{ fontSize: reText(14), color: colors.colorBlue, fontWeight: 'bold', flex: 1 }}>Mã đơn: {item.MaDon}</Text>
                            {
                                item.MaPhanAnh ? <TouchableOpacity onPress={() => Utils.goscreen(this, 'sc_ChiTietXuPhatHC', { IdPA: item.IdPA, isMenuMore: -1 })}>
                                    <Text style={{ fontSize: reText(14), color: colors.redStar, fontWeight: 'bold', flex: 1 }}>Mã phản ánh: {item.MaPhanAnh}</Text>
                                </TouchableOpacity> : null
                            }

                        </View>
                        <Text style={{ fontSize: reText(14), fontWeight: 'bold', flex: 1, textAlign: 'right', color: colors.greenyBlue }}>{item.LinhVuc}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.black_20, marginTop: 5 }}>
                        <Text style={{ fontSize: reText(14), fontWeight: 'bold' }}>Tổng mức phạt</Text>
                        <Text style={{ color: colors.redStar, fontWeight: 'bold' }}>{item.TongMucPhat}</Text>
                    </View>
                </TouchableOpacity>
            </Animatable.View >
        )
    }

    TuNgay = (date) => {
        let { ToDate } = this.state;
        let FromDate = date;
        if (Moment(FromDate, "DD/MM/YYYY").isAfter(Moment(ToDate, "DD/MM/YYYY"))) {
            FromDate = ToDate
        }
        this.setState({
            FromDate: FromDate,
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
        }, this._onRefresh)
    }

    loadMore = async () => {
        const { page, dataXPHC, FromDate, ToDate } = this.state;
        let pageNext = page + 1
        if (page < this.AllPage) {
            let body = {
                "sortOrder": "asc",
                "sortField": "",
                "page": pageNext,
                "record": 10,
                "OrderBy": "",
                "filter.keys": "tungay|denngay|linhvuc|iddonvi|loaithongke|IsDungHan|trangthaithihanh|type",
                "filter.vals": `${Moment(FromDate, 'DD/MM/YYYY').format('DD-MM-YYYY')}|${Moment(ToDate, 'DD/MM/YYYY').format('DD-MM-YYYY')}|${this.LinhVuc ? this.LinhVuc : ''}|${this.IdDonVi}|${this.Values}`,
            }
            let res = await apis.ApiTKXPHC.GetList_ThongKeXuPhat_TheoDonVi_ChiTiet(body)
            Utils.nlog('Danh sách chi tiết xử phạt loadmore ', res)
            if (res.status == 1 && res.data) {
                let dataLoadMore = [...dataXPHC, ...res.data]
                this.setState({ dataXPHC: dataLoadMore, page: pageNext });
            }
        }
    }

    _ListFooterComponent = () => {
        const { page } = this.state;
        if (page < this.AllPage)
            return <ActivityIndicator size='small' style={{ marginTop: 10 }} />;
        else return null
    }

    render() {
        let { dataXPHC } = this.state
        return (
            <View style={nstyles.ncontainer}>
                <HeaderCom nthis={this} titleText={'Danh sách chi tiết'}
                    iconLeft={Images.icBack}
                    onPressLeft={() => Utils.goback(this)}
                    iconRight={null}
                />
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
                <Text style={{ paddingHorizontal: 10, paddingVertical: 10, fontWeight: 'bold', color: 'tomato' }}>Số lượng: {this.ToTal}</Text>
                <View style={[nstyles.nbody, { paddingBottom: isIphoneX() ? 20 : 10 }]}>
                    <FlatList
                        // style={{ marginTop: 5, marginBottom: isIphoneX() ? 20 : 10, }}
                        showsVerticalScrollIndicator={false}
                        data={dataXPHC}
                        renderItem={this._renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal={false}
                        ListEmptyComponent={<ListEmpty />}
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                        onEndReached={this.loadMore}
                        onEndReachedThreshold={0.3}
                        ListFooterComponent={this._ListFooterComponent}
                    />
                </View>
            </View >
        );
    }
}

export default ChiTietThongKeDonVi;
