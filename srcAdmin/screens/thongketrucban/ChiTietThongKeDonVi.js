import React, { Component, useRef } from 'react';
import { View, Text, TouchableHighlight, FlatList, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
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
import HtmlViewCom from '../../../components/HtmlView';
import InputRNCom from '../../../components/ComponentApps/InputRNCom';

class ChiTietThongKeDonViTrucBan extends Component {
    constructor(props) {
        const dayFrom = Moment(new Date(), "DD/MM/YYYY").add(-30, "days")
        const dayTo = Moment(new Date(), "DD/MM/YYYY");
        super(props);
        this.IdDonVi = Utils.ngetParam(this, 'IdDonVi', '')
        this.FromDate = Utils.ngetParam(this, 'TuNgay', '')
        this.ToDate = Utils.ngetParam(this, 'DenNgay', '')
        this.Values = Utils.ngetParam(this, 'Values', '')
        this.LinhVuc = Utils.ngetParam(this, 'LinhVuc', '')
        this.loaidanhgia = Utils.ngetParam(this, 'loaidanhgia', '')
        this.AllPage = 0
        this.ToTal = 0
        this.state = {
            FromDate: this.FromDate ? this.FromDate : dayFrom,
            ToDate: this.ToDate ? this.ToDate : dayTo,
            refreshing: true,
            dataXPHC: [],
            objectPage: { Page: 1, AllPage: 1, Total: 0 },
        };
    }
    componentDidMount() {
        this.LoadData()
    }
    LoadData = async (isNext = false) => {
        let { FromDate, ToDate, objectPage } = this.state
        this.setState({ refreshing: true, })
        let page = 1;
        if (isNext == true) {
            page = objectPage.Page + 1;
        }
        let body = {
            "sortOrder": "asc",
            "sortField": "",
            "page": page,
            "record": 10,
            "OrderBy": "",
            "filter.keys": `idaccount|tungay|denngay|idchuyenmuc|idnhomdonvi|iddonvi|loaidanhgia`,
            "filter.vals": `|${Moment(FromDate, 'DD/MM/YYYY').format('DD-MM-YYYY')}|${Moment(ToDate, 'DD/MM/YYYY').format('DD-MM-YYYY')}|${this.LinhVuc}|${this.Values}|${this.IdDonVi}|${this.loaidanhgia}`,
        }
        let res = await apis.ApiTKTrucBan.GetList_ThongKePA_TheoDonVi_ChiTiet(body)
        if (res.status == 1 && res.data) {
            if (isNext) {
                this.setState({ dataXPHC: [...this.state.dataXPHC, ...res.data], refreshing: false, objectPage: res.page });
            } else {
                this.setState({ dataXPHC: res.data, refreshing: false, objectPage: res.page });
            }
        }
        else {
            if (isNext) {

            } else {
                this.setState({ dataXPHC: [], refreshing: false, objectPage: { Page: 1, AllPage: 1, Total: 0 }, });

            }
        }
    }

    _onRefresh = () => {
        this.setState({ refreshing: true, objectPage: { "Page": 1, AllPage: 1, Total: 0 } },
            () => this.LoadData());
    }

    _renderItem = ({ item, index }) => {
        // Utils.nlog('Gia tri item chi tiet=======', item)
        return (
            <Animatable.View animation={index % 2 == 0 ? 'slideInRight' : 'slideInLeft'} style={{ paddingHorizontal: 10, marginBottom: 5, }}>
                <TouchableOpacity
                    onPress={() => Utils.goscreen(this, "sc_ChiTietPhanAnhTrucBan",
                        {
                            IdPA: item.IdPA,
                            isMenuMore: -1
                        })}
                    activeOpacity={0.5} style={{ backgroundColor: 'white', borderRadius: 5, padding: 5 }}>
                    <View style={{ justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 5 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: reText(14), flex: 1, color: colors.colorBlue }}>{item.TenTrangThai}</Text>
                        <Text style={{ fontSize: reText(14) }}>{item.CreatedDate}</Text>
                    </View>
                    <View style={{ paddingVertical: 10 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: reText(16), color: colors.peacockBlue, flex: 1 }}>{item.TieuDe}</Text>
                    </View>

                    <View style={{ height: Platform.OS == 'ios' ? 55 : 62, paddingHorizontal: 5 }}>
                        <HtmlViewCom
                            html={item.NoiDung}
                            style={{ height: '100%' }}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 }}>
                        <Text style={{ fontSize: reText(14), color: colors.greenyBlue, fontWeight: 'bold', flex: 1 }}>Mã: {item.MaPhanAnh}</Text>
                        <Text style={{ fontSize: reText(14), fontWeight: 'bold', flex: 1, textAlign: 'right', color: colors.black_80 }}>{item.TenNguoiGopY}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.black_20, marginTop: 5 }}>
                        <Text style={{ fontSize: reText(14), fontWeight: 'bold' }}>Hạn xử lý</Text>
                        <Text style={{ color: colors.redStar, fontWeight: 'bold' }}>{item.HanXuLy}</Text>
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
        const { objectPage } = this.state;


        if (objectPage.Page < objectPage.AllPage) {
            this.LoadData(true);

        };
    };

    _ListFooterComponent = () => {
        const { objectPage } = this.state;
        if (objectPage.Page < objectPage.AllPage)
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

                <View
                    style={{
                        flexDirection: "row",
                        paddingHorizontal: 10,
                        width: "100%",
                        backgroundColor: colors.white,
                        paddingBottom: 10
                    }}
                >
                    <ComponentChonNgay
                        value={this.state.FromDate}
                        title={`Từ ngày`}
                        placeholder={"Chọn từ ngày"}
                        onChangTextIndex={(date) => this.TuNgay(date)}
                        isEdit={true}
                    />
                    <ComponentChonNgay
                        value={this.state.ToDate}
                        title={`Đến ngày`}
                        placeholder={"Chọn đến ngày"}
                        onChangTextIndex={(date) => this.DenNgay(date)}
                        isEdit={true}
                    />
                </View>
                <Text style={{ paddingHorizontal: 10, paddingVertical: 10, fontWeight: 'bold', color: 'tomato' }}>Số lượng: {this.state.objectPage.Total}</Text>
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

export default ChiTietThongKeDonViTrucBan;

const ComponentChonNgay = (props) => {
    const ref = useRef();
    const onPress = () => {
        ref.current.onPressDate();
    };
    return (
        <TouchableOpacity
            onPress={props.isEdit ? onPress : () => { }}
            style={{ width: "50%" }}
        >
            <View pointerEvents="none" style={{ width: "100%" }}>
                <InputRNCom
                    styleContainer={{ paddingHorizontal: 5, width: "100%" }}
                    styleBodyInput={{
                        borderColor: colors.pumpkinOrange,
                        borderRadius: 3,
                        borderWidth: 0.5,
                        minHeight: 40,
                        alignItems: "center",
                        paddingVertical: 0,
                        width: "100%",
                        backgroundColor: colors.white,
                    }}
                    labelText={props.title}
                    styleLabel={{
                        color: colors.peacockBlue,
                        fontWeight: "bold",
                        fontSize: reText(14),
                    }}
                    sufix={
                        <View style={{ alignItems: "center", flexDirection: "row" }}>
                            <View
                                style={{
                                    height: 30,
                                    width: 30,
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Image
                                    defaultSource={Images.icCalendar}
                                    source={Images.icCalendar}
                                    style={{ width: 15, height: 15, tintColor: colors.pumpkinOrange }}
                                    resizeMode="contain"
                                />
                            </View>
                            <DatePicker
                                style={{ borderWidth: 0, width: "0%" }}
                                date={props.value}
                                mode="date"
                                disabled={false}
                                placeholder={props.placeholder}
                                format="DD/MM/YYYY"
                                confirmBtnText="Xác nhận"
                                cancelBtnText="Huỷ"
                                showIcon={false}
                                androidMode="spinner"
                                hideText={true}
                                locale="vi"
                                ref={ref}
                                customStyles={{
                                    datePicker: {
                                        backgroundColor: "#d1d3d8",
                                        justifyContent: "center",
                                    },
                                    dateInput: {
                                        paddingHorizontal: 5,
                                        borderWidth: 0,
                                        alignItems: "flex-start",
                                    },
                                }}
                                // hideText={true}

                                onDateChange={props.onChangTextIndex}
                            />
                        </View>
                    }
                    placeholder={props.placeholder}
                    styleInput={{}}
                    styleError={{ backgroundColor: "white" }}
                    styleHelp={{ backgroundColor: "white" }}
                    placeholderTextColor={colors.black_16}
                    // errorText={'Ngày sinh  không hợp lệ'}
                    // helpText={'Số điện thoại phải tối thiểu 9 chữ số'}
                    valid={true}
                    value={props.value}
                    onChangeText={props.onChangTextIndex}
                />
            </View>
        </TouchableOpacity>
    );
};
