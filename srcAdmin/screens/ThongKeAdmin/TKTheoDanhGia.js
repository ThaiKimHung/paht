import React, { Component, useRef, useMemo } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Image, FlatList, ScrollView } from 'react-native'
import moment from 'moment'
import DatePicker from 'react-native-datepicker'
import apis from '../../apis'
import { GetList_ThongKePA_TheoDonViDanhGiaTK } from '../../apis/ThongKeBaoCao'
import { IsLoading } from '../../../components'
import Utils from '../../../app/Utils';
import { reText } from '../../../styles/size';
import HtmlViewCom from '../../../components/HtmlView';
import { nstyles, nwidth } from '../../../styles/styles';
import InputRNCom from '../../../components/ComponentApps/InputRNCom';
import { colors } from '../../../styles';
import { Images } from '../../images'
import ChartTKDonVi from './ChartTKDonVi'
import { ComponentChonNgay, ComponentLinhVuc } from './component'
import Icon from 'react-native-vector-icons/FontAwesome';
import { getBottomSpace } from 'react-native-iphone-x-helper'
import { nGlobalKeys } from '../../../app/keys/globalKey'
import AppCodeConfig from '../../../app/AppCodeConfig'
const widthColumn = () => (nwidth() - 10) / 3
const KeyTK = {
    SoLuong: 0,
    CoDanhGia: 1,
    HaiLong: 2,
    ChapNhan: 3,
    KhongHaiLOng: 4

}
const DataChart = [
    { name: 'Phản ánh giải quyết', fill: '#FEA2B6', key: "SoLuong" },
    { name: `Hài lòng`, fill: '#8AC8F1', key: "HaiLong" },
    { name: 'Không hài lòng', fill: '#FEE1A9', key: "KhongHaiLong" },
    { name: 'Chấp nhận', fill: '#ECEDEF', key: "ChapNhan" },
    { name: 'Chưa đánh giá', fill: '#97D9D9', key: "ChuaDanhGia" }
]
export class TKTheoDanhGia extends Component {
    constructor(props) {
        super(props)
        this.checkTK = Utils.getGlobal(nGlobalKeys.filterTKBC, 'false', AppCodeConfig.APP_ADMIN)
        this.state = {
            FromDate: moment(new Date()).add(-20, 'days').format('DD/MM/YYYY'),
            ToDate: moment(new Date()).format('DD/MM/YYYY'),
            dataThongKe: [],
            lstChuyenMuc: [],
            selectChuyenMuc: { IdChuyenMuc: -1, TenChuyenMuc: "Tất cả" },
            ishowFilter: false,
            isChart: false,
            dataNhomDV: [{ IdNhom: 0, TenNhom: "Tất cả" }],
            selectLoaiDV: { IdNhom: 0, TenNhom: "Tất cả" },
            TongSoPA: 0

        }
    }
    componentDidMount() {
        this.getData()
        this.getLinhVuc()
        this.GetListNhomDonVi();
    }
    GetListNhomDonVi = async () => {

        let res = await apis.ApiTKTrucBan.GetAllCapDonVi_NhomDonVi();
        Utils.nlog("res loại đơn vị", res);
        if (res.status == 1 && res.data && res.data.length > 0) {
            this.setState({
                dataNhomDV: [{ IdNhom: 0, TenNhom: "Tất cả" }].concat(res.data)
            })

        } else {
            this.setState({
                dataNhomDV: [{ IdNhom: 0, TenNhom: "Tất cả" }]
            })

        }
    };
    getData = async () => {
        const { FromDate, ToDate, selectChuyenMuc, selectLoaiDV } = this.state
        nthisIsLoading.show();
        let filterkeys = `tungay|denngay|nhomdv${this.checkTK == 'false' ? '' : '|ChuyenMucQL'}`;
        let filtervals = `${moment(FromDate, "DD/MM/YYYY").format("DD-MM-YYYY")}|${moment(ToDate, "DD/MM/YYYY").format("DD-MM-YYYY")}|${selectLoaiDV.IdNhom || 0}${this.checkTK == 'false' ? '' : '|1'}`;
        let res = await GetList_ThongKePA_TheoDonViDanhGiaTK(filterkeys, filtervals);
        nthisIsLoading.hide();

        let rowTong = {
            SoLuong: 0,
            TenDonVi: "Tổng Cộng",
            HaiLong: 0,
            KhongHaiLong: 0,
            CoDanhGia: 0,
            ChapNhan: 0
        }
        for (let index = 0; index < res.data.length; index++) {
            const element = res.data[index];
            rowTong = {
                TenDonVi: "Tổng cộng",
                SoLuong: rowTong.SoLuong + element.SoLuong,
                HaiLong: rowTong.HaiLong + element.HaiLong,
                KhongHaiLong: rowTong.KhongHaiLong + element.KhongHaiLong,
                CoDanhGia: rowTong.CoDanhGia + element.CoDanhGia,
                ChapNhan: rowTong.ChapNhan + element.ChapNhan,
            }
            if (index == res.data.length - 1) {
                rowTong = {
                    ...rowTong,
                }
            }

        }
        if (res.status == 1 && res) {
            this.setState({ dataThongKe: [rowTong, ...res.data], TongSoPA: rowTong.SoLuong })
        } else {
            this.setState({ TongSoPA: 0 })
        }
        Utils.nlog("Gia tri data Thong Ke=>>>>", this.state.dataThongKe)
    }
    getLinhVuc = async () => {
        let res = await apis.ApiTKTrucBan.GetList_ChuyenMuc();
        // Utils.nlog("gía trị linh vuc---------nhe", res);
        if (res.status == 1) {
            // this.setState([{ IdChuyenMuc: 0, TenChuyenMuc: "Tất cả" }].concat(res.data));
            this.setState({ lstChuyenMuc: [{ IdChuyenMuc: -1, TenChuyenMuc: "Tất cả" }, ...res.data], })
        }
    };
    ComponentChonNgay = (props) => {
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
                            borderColor: colors.colorGrayIcon,
                            borderRadius: 3,
                            borderWidth: 0.5,
                            minHeight: 40,
                            alignItems: "center",
                            paddingVertical: 0,
                            width: "100%",
                        }}
                        labelText={props.title}
                        styleLabel={{
                            color: colors.colorGrayText,
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
                                        style={{ width: 15, height: 15 }}
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
    //
    ComponentLinhVuc = (props) => {
        return (
            <TouchableOpacity onPress={props.isEdit ? props.onPress : () => { }}>
                <View pointerEvents={"none"}>
                    <InputRNCom
                        styleContainer={{ paddingHorizontal: 15, marginTop: 5 }}
                        styleBodyInput={{
                            borderColor: colors.colorGrayIcon,
                            borderRadius: 3,
                            borderWidth: 0.5,
                            minHeight: 40,
                            alignItems: "center",
                            paddingVertical: 0,
                        }}
                        labelText={props.title}
                        styleLabel={{
                            color: colors.colorGrayText,
                            fontWeight: "bold",
                            fontSize: reText(14),
                        }}
                        // sufixlabel={<View>
                        //     <Text style={{ fontSize: 18, color: colors.redStar }}>{'*'}</Text>
                        // </View>}
                        placeholder={props.placeholder}
                        styleInput={{}}
                        styleError={{ backgroundColor: "white" }}
                        styleHelp={{ backgroundColor: "white" }}
                        placeholderTextColor={colors.black_20}
                        // errorText={'Tôn giáo không hợp lệ'}
                        // helpText={'Số điện thoại phải tối thiểu 9 chữ số'}
                        editable={false}
                        valid={true}
                        prefix={null}
                        value={props.value}
                        onChangeText={props.onChangTextIndex}
                        sufix={
                            <View
                                style={{
                                    height: 30,
                                    width: 30,
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Image
                                    // defaultSource={Images.icDropDown}
                                    source={Images.icDropDown}
                                    style={{ width: 15, height: 15 }}
                                    resizeMode="contain"
                                />
                            </View>
                        }
                    />
                </View>
            </TouchableOpacity>
        );
    };
    onChangeTextIndex = (val, index) => {
        const { FromDate, ToDate } = this.state;
        switch (index) {
            case 1:
                {
                    this.setState({ selectChuyenMuc: val }, this.getData);
                }
                break;
            case 2:
                {
                    this.setState({
                        selectLoaiDV: val
                    }, this.getData)
                }
                break;
            case 4:
                {
                    if (ToDate != "") {
                        let check = moment(ToDate, "DD/MM/YYYY").isAfter(
                            moment(val, "DD/MM/YYYY")
                        );
                        if (check == true) {
                            this.setState({ FromDate: val }, this.getData);
                        } else {
                            Utils.showMsgBoxOK(
                                this.props.nthis,
                                "Thông báo",
                                "Từ ngày phải nhỏ hơn đến ngày",
                                "Xác nhận"
                            );
                            return;
                        }
                    } else {
                        this.setState({ FromDate: val }, this.getData);
                    }
                }
                break;
            case 5:
                {
                    if (FromDate != "") {
                        let check = moment(FromDate, "DD/MM/YYYY").isBefore(
                            moment(val, "DD/MM/YYYY")
                        );
                        if (check == true) {
                            this.setState({ ToDate: val }, this.getData);
                        } else {
                            Utils.showMsgBoxOK(
                                this.props.nthis,
                                "Thông báo",
                                "Đến ngày phải lớn hơn từ ngày",
                                "Xác nhận"
                            );
                            return;
                        }
                    } else {
                        this.setState({ ToDate: val }, this.getData);
                    }
                }
                break;
            default:
                break;
        }
    };
    _viewItem = (item, key) => {

        return (
            <View
                // key={item}
                style={{
                    flex: 1,
                    paddingHorizontal: 10,
                    margin: 2,
                }}
            >
                <Text style={{ textAlign: "center", paddingVertical: 10 }}>
                    {item[key]}
                </Text>
            </View>
        );
    };
    //
    _dropDown = (index) => {
        const { selectLoaiDV, dataNhomDV } = this.state
        switch (index) {
            case 1:
                {
                    // Utils.goscreen(this.props.nthis, "Modal_ComponentSelectProps", {
                    //     callback: (val) => this.onChangeTextIndex(val, 1),
                    //     item: this.state.selectChuyenMuc,
                    //     title: "Danh sách chuyên mục",
                    //     AllThaoTac: this.state.lstChuyenMuc,
                    //     ViewItem: (item) => this._viewItem(item, "TenChuyenMuc"),
                    //     Search: true,
                    //     key: "TenChuyenMuc",
                    // });
                    // this.getData
                }
                break;

            case 2:
                {
                    Utils.goscreen(this.props.nthis, "Modal_ComponentSelectProps", {
                        callback: (val) => this.onChangeTextIndex(val, 2),
                        item: selectLoaiDV,
                        title: "Danh sách nhóm đơn vị",
                        AllThaoTac: dataNhomDV,
                        ViewItem: (item) => this._viewItem(item, "TenNhom"),
                        Search: true,
                        key: "TenNhom",
                    });
                }
                break;

            default:
                break;
        }
    };
    XemDanhSach = (key, IdDV) => {
        const { FromDate, ToDate } = this.state
        switch (key) {
            case KeyTK.SoLuong:
                Utils.goscreen(this.props.nthis, 'scChiTietTKAdmin', {
                    IdDonVi: IdDV, TuNgay: FromDate, DenNgay: ToDate, loaidanhgia: '100', Type: 2
                })
                break;
            case KeyTK.CoDanhGia:
                Utils.goscreen(this.props.nthis, 'scChiTietTKAdmin', {
                    IdDonVi: IdDV, TuNgay: FromDate, DenNgay: ToDate, loaidanhgia: '101', Type: 2
                })
                break;
            case KeyTK.HaiLong:
                Utils.goscreen(this.props.nthis, 'scChiTietTKAdmin', {
                    IdDonVi: IdDV, TuNgay: FromDate, DenNgay: ToDate, loaidanhgia: '1', Type: 2
                })
                break;
            case KeyTK.ChapNhan:
                Utils.goscreen(this.props.nthis, 'scChiTietTKAdmin', {
                    IdDonVi: IdDV, TuNgay: FromDate, DenNgay: ToDate, loaidanhgia: '2', Type: 2
                })
                break;
            case KeyTK.KhongHaiLOng:
                Utils.goscreen(this.props.nthis, 'scChiTietTKAdmin', {
                    IdDonVi: IdDV, TuNgay: FromDate, DenNgay: ToDate, loaidanhgia: '0', Type: 2
                })
                break;

            default:
                break;
        }
    }
    _KeyExtracter = ({ item, index }) => index.ToString();
    _renderItem = ({ item, index }) => {
        const { dataThongKe } = this.state
        return (
            <View key={index} style={{ flexDirection: 'row', marginHorizontal: 10, flex: 1 }}>
                <View style={{ width: widthColumn() - widthColumn() / 2 - 23, borderWidth: 0.5, borderBottomWidth: index == dataThongKe.length - 1 ? 0.5 : 0 }}>
                    <Text style={styles.text}>{index + 1}</Text>
                </View>
                <View style={{ width: widthColumn(), borderWidth: 0.5, borderBottomWidth: 0.5, borderRightWidth: 0, borderLeftWidth: 0 }}>
                    <Text style={[styles.text, { fontWeight: 'bold' }]}>{item.TenDonVi}</Text>
                </View>
                <View style={{ width: widthColumn() - widthColumn() / 2, borderWidth: 0.5, borderBottomWidth: 0.5 }}>
                    <Text style={[styles.text, { fontWeight: 'bold' }]}>{item.SoLuong}</Text>
                </View>
                <View style={{ width: widthColumn() - widthColumn() / 2, borderWidth: 0.5, borderBottomWidth: 0.5 }}>
                    <Text style={[styles.text, { fontWeight: 'bold' }]}>{item.HaiLong}</Text>
                </View>
                <View style={{ width: widthColumn() - widthColumn() / 2, borderWidth: 0.5, borderBottomWidth: 0.5 }}>
                    <Text style={[styles.text, { fontWeight: 'bold' }]}>{item.KhongHaiLong}</Text>
                </View>
                <View style={{ width: widthColumn() - widthColumn() / 2, borderWidth: 0.5, borderBottomWidth: 0.5 }}>
                    <Text style={[styles.text, { fontWeight: 'bold' }]}>{item.ChapNhan}</Text>
                </View><View style={{ width: widthColumn() - widthColumn() / 2, borderWidth: 0.5, borderBottomWidth: 0.5 }}>
                    <Text style={[styles.text, { fontWeight: 'bold' }]}>{item.ChuaDanhGia}</Text>
                </View>
            </View>
        )
    }
    RenderFilter = () => {
        const { FromDate, ToDate, selectChuyenMuc, dataThongKe, isChart, ishowFilter, selectLoaiDV } = this.state
        if (!ishowFilter) {
            return null
        } else return <View
            style={{
                paddingBottom: 10, borderWidth: 0.5, marginHorizontal: 10, borderRadius: 10, marginBottom: 5,
                borderColor: colors.colorBlueLight,
            }} >

            <View
                style={{
                    flexDirection: "row",
                    paddingHorizontal: 10,
                    width: "100%",
                }}
            >
                <ComponentChonNgay
                    value={FromDate}
                    title={`Từ ngày`}
                    placeholder={"Chọn từ ngày"}
                    onChangTextIndex={(val) => this.onChangeTextIndex(val, 4)}
                    isEdit={true}
                />
                <ComponentChonNgay
                    value={ToDate}
                    title={`Đến ngày`}
                    placeholder={"Chọn đến ngày"}
                    onChangTextIndex={(val) => this.onChangeTextIndex(val, 5)}
                    isEdit={true}
                />

            </View>
            <ComponentLinhVuc
                title={"Nhóm đơn vị"}
                placeholder={"nhóm đơn vị"}
                value={selectLoaiDV.TenNhom || ''}
                onPress={() => this._dropDown(2)}
                isEdit={true}
            />

            {/* <ComponentLinhVuc
                title={"Chọn chuyên mục"}
                placeholder={"Chọn chuyên mục"}
                value={selectLv.TenChuyenMuc}
                onPress={() => _dropDown(1)}
                isEdit={true}
            /> */}
        </View>
    }
    RenderBody = () => {
        const { FromDate, ToDate, selectChuyenMuc, dataThongKe, isChart, ishowFilter } = this.state
        if (!isChart) {
            return <ScrollView
                showsHorizontalScrollIndicator={false}
                horizontal
                style={[{ marginHorizontal: 10, backgroundColor: colors.white }]}>
                <View>
                    <View style={{
                        flexDirection: 'row',
                    }}>
                        <View style={{ width: widthColumn() / 3, borderWidth: 0.5, borderBottomWidth: 0, }}>
                            <Text style={[styles.text, { fontWeight: 'bold', flex: 1, color: colors.black }]}>{`STT`}</Text>
                        </View>
                        <View style={{ width: widthColumn(), borderWidth: 0.5, borderBottomWidth: 0, borderRightWidth: 0, borderLeftWidth: 0 }}>
                            <Text style={[styles.text, { fontWeight: 'bold', color: colors.black }]}>{`Đơn vị`}</Text>
                        </View>
                        <View style={{ justifyContent: 'center' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ width: widthColumn() - widthColumn() / 2, borderWidth: 0.5, borderBottomWidth: 0 }}>
                                    <Text style={[styles.text, { fontWeight: 'bold', color: colors.black }]}>{`Số phản ánh giải quyết`}</Text>
                                </View>
                                <View style={{ width: widthColumn() - widthColumn() / 2, borderWidth: 0.5, borderBottomWidth: 0 }}>
                                    <Text style={[styles.text, { fontWeight: 'bold', color: colors.black }]}>{`Số phản ánh có đánh giá`}</Text>
                                </View>
                                <View style={{ width: widthColumn() - widthColumn() / 2, borderWidth: 0.5, borderBottomWidth: 0 }}>
                                    <Text style={[styles.text, { fontWeight: 'bold', color: colors.black }]}>{`Hài lòng`}</Text>
                                </View>
                                <View style={{ width: widthColumn() - widthColumn() / 2, borderWidth: 0.5, borderBottomWidth: 0 }}>
                                    <Text style={[styles.text, { fontWeight: 'bold', color: colors.black }]}>{`Chấp nhận`}</Text>
                                </View><View style={{ width: widthColumn() - widthColumn() / 2, borderWidth: 0.5, borderBottomWidth: 0 }}>
                                    <Text style={[styles.text, { fontWeight: 'bold', color: colors.black }]}>{`Không hài lòng`}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    {dataThongKe.length > 0 && dataThongKe ?
                        dataThongKe.map((item, index) => {
                            return (
                                <View key={index} style={{ flexDirection: 'row', flex: 1 }}>
                                    <View style={{ width: widthColumn() / 3, borderWidth: 0.5, borderBottomWidth: index == dataThongKe.length - 1 ? 0.5 : 0 }}>
                                        <Text style={[styles.text, { color: colors.black }]}>{index + 1}</Text>
                                    </View>
                                    <View style={{ width: widthColumn(), borderWidth: 0.5, borderBottomWidth: 0.5, borderRightWidth: 0, borderLeftWidth: 0 }}>
                                        <Text style={[styles.text, { fontWeight: 'bold', color: colors.black }]}>{item.TenDonVi}</Text>
                                    </View>
                                    <TouchableOpacity disabled={index == 0 ? true : false} onPress={() => this.XemDanhSach(KeyTK.SoLuong, item.IdDonVi)} style={{ width: widthColumn() - widthColumn() / 2, borderWidth: 0.5, borderBottomWidth: dataThongKe.length == index - 1 ? 0 : 0.5 }}>
                                        <Text style={[styles.text, { color: index == 0 ? colors.black : colors.softBlue, fontWeight: index == 0 ? 'bold' : 'normal' }]}>{item.SoLuong}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity disabled={index == 0 ? true : false} onPress={() => this.XemDanhSach(KeyTK.CoDanhGia, item.IdDonVi)} style={{ width: widthColumn() - widthColumn() / 2, borderWidth: 0.5, borderBottomWidth: dataThongKe.length == index - 1 ? 0 : 0.5 }}>
                                        <Text style={[styles.text, { color: index == 0 ? colors.black : colors.softBlue, fontWeight: index == 0 ? 'bold' : 'normal' }]}>{item.CoDanhGia}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity disabled={index == 0 ? true : false} onPress={() => this.XemDanhSach(KeyTK.HaiLong, item.IdDonVi)} style={{ width: widthColumn() - widthColumn() / 2, borderWidth: 0.5, borderBottomWidth: dataThongKe.length == index - 1 ? 0 : 0.5 }}>
                                        <Text style={[styles.text, { color: index == 0 ? colors.black : colors.softBlue, fontWeight: index == 0 ? 'bold' : 'normal' }]}>{item.HaiLong}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity disabled={index == 0 ? true : false} onPress={() => this.XemDanhSach(KeyTK.ChapNhan, item.IdDonVi)} style={{ width: widthColumn() - widthColumn() / 2, borderWidth: 0.5, borderBottomWidth: dataThongKe.length == index - 1 ? 0 : 0.5 }}>
                                        <Text style={[styles.text, { color: index == 0 ? colors.black : colors.softBlue, fontWeight: index == 0 ? 'bold' : 'normal' }]}>{item.ChapNhan}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity disabled={index == 0 ? true : false} onPress={() => this.XemDanhSach(KeyTK.KhongHaiLOng, item.IdDonVi)} style={{ width: widthColumn() - widthColumn() / 2, borderWidth: 0.5, borderBottomWidth: dataThongKe.length == index - 1 ? 0 : 0.5 }}>
                                        <Text style={[styles.text, { color: index == 0 ? colors.black : colors.softBlue, fontWeight: index == 0 ? 'bold' : 'normal' }]}>{item.KhongHaiLong}</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        })
                        :
                        <View style={{ borderTopWidth: 0.5, }}>
                            <Text style={{ textAlign: 'center', paddingVertical: 5, fontSize: reText(12) }}>{'Không có dữ liệu...'}</Text>
                        </View>
                    }
                </View>
            </ScrollView>


        } else return <ChartTKDonVi data={dataThongKe} dataChart={DataChart} keyName={`TenDonVi`} />
    }

    render() {

        const { FromDate, ToDate, selectChuyenMuc, dataThongKe, isChart, ishowFilter, TongSoPA } = this.state
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
                    <Text style={{ color: colors.black_80, fontWeight: 'bold' }}>{'Tổng số phản ánh :'}</Text>
                    <View style={{ backgroundColor: 'red', padding: 5, borderRadius: 10, paddingHorizontal: 10 }}>
                        <Text style={{ color: colors.white, fontWeight: 'bold' }}>{TongSoPA || 0}</Text>
                    </View>
                </View>
                <View style={{ paddingHorizontal: 10, flexDirection: 'row', paddingBottom: 10 }}>
                    <TouchableOpacity onPress={() => this.setState({ ishowFilter: !ishowFilter })} style={{
                        flexDirection: 'row',
                        alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Image style={[{ tintColor: ishowFilter ? colors.pumpkinOrange : colors.black_50, width: 30, height: 30 }]} resizeMode='contain'
                            source={Images.icFilter} />
                        <Text style={{ fontSize: reText(15), fontWeight: "bold", textAlign: "center", color: ishowFilter ? colors.pumpkinOrange : colors.black_50 }}>{`${ishowFilter ? 'Ẩn' : 'Hiện'} bộ lọc`}</Text>
                    </TouchableOpacity>
                    <View style={{ width: 10 }} />
                    <View style={{ flex: 1, }}>
                        <TouchableOpacity onPress={() => this.setState({ isChart: !isChart })} style={{ borderWidth: 0.5, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', paddingVertical: 10, borderColor: colors.greyLight }}>
                            <Text style={{ flex: 1, paddingHorizontal: 10 }}>
                                Loại hiển thị : <Text style={{
                                    fontSize: reText(15),
                                    fontWeight: "bold",
                                }}>{isChart ? 'Biểu đồ' : 'Bảng'}</Text>
                            </Text>
                            <Icon name={'retweet'} color={colors.black_30} size={24} style={{ paddingHorizontal: 10 }} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flex: 1, paddingBottom: getBottomSpace() }}>
                    <ScrollView style={[nstyles.ncontainer, { backgroundColor: colors.white, flex: 0, }]}>
                        {this.RenderFilter()}
                        {this.RenderBody()}

                    </ScrollView>
                </View>

                <IsLoading />
            </View >

        )
    }
}
const styles = StyleSheet.create({
    text: {
        fontSize: reText(12),
        textAlign: 'center',
        padding: 5,
        color: colors.softBlue
    }
})
export default TKTheoDanhGia
