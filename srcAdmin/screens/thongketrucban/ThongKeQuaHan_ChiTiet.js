import React, { Component, useRef } from 'react'
import { Text, View, ActivityIndicator, TouchableOpacity, Image } from 'react-native'
import { HeaderCom, ListEmpty, IsLoading, WebViewCus } from '../../../components'
import { Images } from '../../images'
import Utils from '../../../app/Utils'
import apis from '../../apis'
import moment from 'moment'
import { FlatList } from 'react-native-gesture-handler'
import { colors } from '../../../styles'
import { reText } from '../../../styles/size'
import { Height, nstyles, Width } from '../../../styles/styles'
import DatePicker from 'react-native-datepicker'
import InputRNCom from '../../../components/ComponentApps/InputRNCom'

const objectFilter = {
    "page": 1,
    "record": 10,
}

export class ThongKeQuaHan_ChiTiet extends Component {
    constructor(props) {
        super(props);
        this.tungay = Utils.ngetParam(this, 'tungay');
        this.denngay = Utils.ngetParam(this, 'denngay');
        this.iddonvi = Utils.ngetParam(this, 'iddonvi');
        this.state = {
            FromDate: this.tungay ? this.tungay : '',
            ToDate: this.denngay ? this.denngay : '',
            dataList: [],
            refreshing: true,
            objectPage: {
                Page: 1,
                AllPage: 1,
                Total: 0
            },
        }
    }

    componentDidMount() {
        this.getChiTiet()
    }
    _onBack = () => {
        Utils.goback(this)
    }

    getChiTiet = async () => {
        const { FromDate, ToDate } = this.state;
        this.setState({ refreshing: true })
        nthisIsLoading.show();
        let body = {
            ...objectFilter,
            "tungay": FromDate == '' ? '' : moment(FromDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
            "denngay": ToDate == '' ? '' : moment(ToDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
            "IdDonVi": this.iddonvi
        }
        const res = await apis.ApiTKTrucBan.GetList_DanhSachDonViPhanAnhQuaHan_ChiTiet(body);
        if (res.status == 1) {
            this.setState({ dataList: res.data, refreshing: false, objectPage: res.page })
            nthisIsLoading.hide();
        }
        else {
            this.setState({ dataList: [], refreshing: false, objectPage: { Page: 1 } })
            nthisIsLoading.hide();
        }
    }

    _renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={() => Utils.goscreen(this, 'sc_ChiTietPhanAnhTrucBan', { IdPA: item.IdPA, isMenuMore: -1 })}
                key={index}
                style={{ backgroundColor: colors.white, paddingVertical: 10, marginBottom: 5, borderRadius: 5, paddingHorizontal: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                    <Text style={{ fontSize: reText(14), fontWeight: 'bold', color: colors.colorTextBlue }}>{item.TieuDe ? item.TieuDe : '---'}</Text>
                    <Text style={{ fontSize: reText(12), color: colors.black_50, fontStyle: 'italic' }}>{item.CreatedDate}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                    <WebViewCus

                        source={{ html: item.NoiDung ? item.NoiDung : '<div></div>' }}
                        fontSize={reText(28)}
                        showsVerticalScrollIndicator={false}
                        style={{ height: Height(10) }}
                    />
                </View>
                <View style={{
                    borderRadius: 3, marginTop: 5,
                    backgroundColor: colors.colorBlueLight,
                    width: Width(35), alignSelf: 'flex-end'
                }}>
                    <Text numberOfLines={1} style={{ fontSize: reText(12), paddingVertical: 5, color: colors.white, textAlign: 'center', flex: 1 }} >{item.TenTrangThai ? item.TenTrangThai : '---'} </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <Image source={Images.icLocation} style={[nstyles.nIcon14], { tintColor: colors.colorHeaderApp }} />
                    <Text style={{ fontSize: reText(12), marginLeft: 5, width: Width(55) }} >{item.DiaDiem ? item.DiaDiem : '---'} </Text>
                </View>
                <View style={{ height: 1, backgroundColor: colors.black_16, marginVertical: 5 }} />
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: reText(12), fontWeight: 'bold' }} > <Text style={{ color: colors.greenFE, fontSize: reText(14) }} >Mã phản ánh:</Text> {item.MaPhanAnh ? item.MaPhanAnh : '---'} </Text>
                    <Text style={{ fontWeight: 'bold', color: colors.redStar }}>{item.HanXuLy ? moment(item.HanXuLy, 'DD/MM/YYYY').format('DD/MM/YYYY') : '---'}</Text>
                </View>
            </TouchableOpacity >
        )
    }
    _onRefresh = () => {
        this.setState({ refreshing: true, objectPage: { Page: 1 } }, this.getChiTiet);
    }
    TuNgay = (date) => {
        let { ToDate } = this.state;
        let FromDate = date;
        if (moment(FromDate, "DD/MM/YYYY").isAfter(moment(ToDate, "DD/MM/YYYY"))) {
            FromDate = ToDate
        }
        this.setState({
            FromDate: FromDate,
        }, this._onRefresh)
    }

    DenNgay = (date) => {
        let { FromDate } = this.state;
        let ToDate = date;
        if (moment(ToDate, "DD/MM/YYYY").isBefore(moment(FromDate, "DD/MM/YYYY"))) {
            ToDate = FromDate
        }
        this.setState({
            ToDate: ToDate,
        }, this._onRefresh)
    }

    loadMore = async () => {
        const { objectPage } = this.state;
        if (objectPage?.Page < objectPage?.AllPage) {
            let body = {
                ...objectFilter,
                "page": objectPage?.Page + 1,
                "tungay": this.tungay == '' ? '' : moment(this.tungay, 'DD-MM-YYYY').format('YYYY-MM-DD'),
                "denngay": this.denngay == '' ? '' : moment(this.denngay, 'DD-MM-YYYY').format('YYYY-MM-DD'),
                "IdDonVi": this.iddonvi
            }
            const res = await apis.ApiTKTrucBan.GetList_DanhSachDonViPhanAnhQuaHan_ChiTiet(body);
            if (res.status == 1) {
                if (objectPage?.Page != res.page.Page) {
                    let data = this.state.dataList.concat(...res.data)
                    this.setState({ dataList: data, objectPage: res.page });
                }
            } else {
                this.setState({ dataList: [], objectPage: { Page: 1 } });
            }
        };
    };

    render() {
        const { dataList, objectPage, refreshing } = this.state;
        return (
            <View style={{ backgroundColor: colors.black_11, flex: 1 }}>
                <HeaderCom
                    titleText={'Danh sách chi tiết'}
                    iconLeft={Images.icBack}
                    onPressLeft={this._onBack}
                    hiddenIconRight={true}
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
                <Text style={{ color: colors.black_50, fontWeight: 'bold', marginHorizontal: 15, marginTop: 10, marginBottom: 5 }}>
                    Số lượng: <Text style={{ color: colors.redStar }}>{objectPage?.Total ? objectPage?.Total : '-'}</Text>
                </Text>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    style={{ paddingHorizontal: 15, paddingVertical: 5, marginBottom: 15 }}
                    renderItem={this._renderItem}
                    data={dataList}
                    extraData={dataList}
                    ListEmptyComponent={<ListEmpty textempty={'Không có dữ liệu'} />}
                    keyExtractor={(item, index) => index.toString()}
                    refreshing={refreshing}
                    onRefresh={this._onRefresh}
                    // onEndReached={this.loadMore}
                    onEndReachedThreshold={0.3}
                // ListFooterComponent={this._ListFooterComponent}
                />
                <IsLoading />
            </View>
        )
    }
}

export default ThongKeQuaHan_ChiTiet

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
                        borderColor: colors.black_50,
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
                                    // defaultSource={Images.icCalendar}
                                    source={Images.icCalendar}
                                    style={{ width: 15, height: 15, }}
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
            <IsLoading />
        </TouchableOpacity>
    );
};