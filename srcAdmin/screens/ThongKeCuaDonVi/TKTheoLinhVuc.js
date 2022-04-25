import React, { Component, useRef } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native'
import moment from 'moment'
import DatePicker from 'react-native-datepicker'
import apis from '../../apis'
import { GetList_ThongKePA_TheoLinhVuc } from '../../apis/ThongKeBaoCao'
import { IsLoading } from '../../../components'
import Utils from '../../../app/Utils';
import { reText } from '../../../styles/size';
import HtmlViewCom from '../../../components/HtmlView';
import { nstyles, nwidth } from '../../../styles/styles';
import InputRNCom from '../../../components/ComponentApps/InputRNCom';
import { colors } from '../../../styles';
import { Images } from '../../images'
const widthColumn = () => (nwidth() - 10) / 3
const KeyTK = {
    SoLuong: 0,
    DaXL_Tong: 1,
    DaXL_TrongHan: 2,
    DaXL_QuaHan: 3,
    DangXL_Tong: 4,
    DangXL_TrongHan: 5,
    DangXL_QuaHan: 6,
}
class TKTheoLinhVuc extends Component {
    constructor(props) {
        super(props)
        this.state = {
            FromDate: moment(new Date()).add(-20, 'days').format('DD/MM/YYYY'),
            ToDate: moment(new Date()).format('DD/MM/YYYY'),
            dataThongKe: [],
            lstChuyenMuc: [],
            selectChuyenMuc: { IdChuyenMuc: -1, TenChuyenMuc: "Tất cả" },
        }
        this.refLoading = React.createRef(null);
    }
    componentDidMount() {
        this.getData()
        // this.getLinhVuc()
    }
    getData = async () => {
        const { FromDate, ToDate, selectChuyenMuc } = this.state
        this.refLoading.current.show();
        let res = await GetList_ThongKePA_TheoLinhVuc(moment(FromDate, "DD/MM/YYYY").format("DD-MM-YYYY"), moment(ToDate, "DD/MM/YYYY").format("DD-MM-YYYY"));
        Utils.nlog("res--------data-TK", res)
        this.refLoading.current.hide();
        if (res.status == 1 && res && res.data && res.data.length > 0) {
            let rowTong = {
                IdMuc: 16,
                IdMucParent: 0,
                SLQuaHanDaXL: 0,
                SLQuaHanDangXL: 0,
                SLTrongHanDaXL: 0,
                SLTrongHanDangXL: 0,
                SoLuong: 0,
                TenMuc: "An ninh quốc gia",
                TongDaXL: 0,
                TongDangXL: 0,
                TyLeQuaHanDaXL: 0,
                TyLeQuaHanDangXL: 0,
                TyLeTongDaXL: 0,
                TyLeTongDangXL: 0,
                TyLeTrongHanDaXL: 0,
                TyLeTrongHanDangXL: 0
            }
            for (let index = 0; index < res.data.length; index++) {
                const element = res.data[index];
                rowTong = {
                    IdMuc: element.IdMuc,
                    IdMucParent: element.IdMuc,
                    SLQuaHanDaXL: rowTong.SLQuaHanDaXL + element.SLQuaHanDaXL,
                    SLQuaHanDangXL: rowTong.SLQuaHanDangXL + element.SLQuaHanDangXL,
                    SLTrongHanDaXL: rowTong.SLTrongHanDaXL + element.SLTrongHanDaXL,
                    SLTrongHanDangXL: rowTong.SLTrongHanDangXL + element.SLTrongHanDangXL,
                    SoLuong: rowTong.SoLuong + element.SoLuong,
                    TenMuc: "Tổng",
                    TongDaXL: rowTong.TongDaXL + element.TongDaXL,
                    TongDangXL: rowTong.TongDangXL + element.TongDangXL,
                }
                if (index == res.data.length - 1) {
                    rowTong = {
                        ...rowTong,
                        TyLeQuaHanDaXL: Math.round(rowTong.SLQuaHanDaXL / rowTong.TongDaXL * 100 * 100) / 100,
                        TyLeQuaHanDangXL: Math.round(rowTong.SLQuaHanDangXL / rowTong.TongDangXL * 100 * 100) / 100,
                        TyLeTongDaXL: Math.round(rowTong.TongDaXL / rowTong.SoLuong * 100 * 100) / 100,
                        TyLeTongDangXL: Math.round(rowTong.TongDangXL / rowTong.SoLuong * 100 * 100) / 100,
                        TyLeTrongHanDaXL: Math.round(rowTong.SLTrongHanDaXL / rowTong.TongDaXL * 100 * 100) / 100,
                        TyLeTrongHanDangXL: Math.round(rowTong.SLTrongHanDangXL / rowTong.TongDangXL * 100 * 100) / 100,
                    }
                }

            }
            this.setState({ dataThongKe: [rowTong, ...res.data] })
        }

    }
    getLinhVuc = async () => {
        let res = await apis.ApiTKTrucBan.GetList_ChuyenMuc();
        // Utils.nlog("gía trị linh vuc---------nhe", res);
        if (res.status == 1) {
            // this.setState([{ IdChuyenMuc: 0, TenChuyenMuc: "Tất cả" }].concat(res.data));
            this.setState({ lstChuyenMuc: res.data, })
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
        switch (index) {
            case 1:
                {
                    Utils.goscreen(this.props.nthis, "Modal_ComponentSelectProps", {
                        callback: (val) => this.onChangeTextIndex(val, 1),
                        item: this.state.selectChuyenMuc,
                        title: "Danh sách chuyên mục",
                        AllThaoTac: this.state.lstChuyenMuc,
                        ViewItem: (item) => this._viewItem(item, "TenChuyenMuc"),
                        Search: true,
                        key: "TenChuyenMuc",
                    });
                    this.getData
                }
                break;
            default:
                break;
        }
    };
    XemDanhSach = (key, IdDV, IdAccount) => {
        const { FromDate, ToDate } = this.state
        switch (key) {
            case KeyTK.SoLuong:
                Utils.goscreen(this.props.nthis, 'scChiTietTKCuaDonVi', {
                    IdDonVi: IdDV, TuNgay: FromDate, DenNgay: ToDate, loaidanhgia: '0', Type: 4, IdAccount: IdAccount
                })
                break;
            case KeyTK.DaXL_Tong:
                Utils.goscreen(this.props.nthis, 'scChiTietTKCuaDonVi', {
                    IdDonVi: IdDV, TuNgay: FromDate, DenNgay: ToDate, loaidanhgia: '1', Type: 4, IdAccount: IdAccount
                })
                break;
            case KeyTK.DaXL_TrongHan:
                Utils.goscreen(this.props.nthis, 'scChiTietTKCuaDonVi', {
                    IdDonVi: IdDV, TuNgay: FromDate, DenNgay: ToDate, loaidanhgia: '2', Type: 4, IdAccount: IdAccount
                })
                break;
            case KeyTK.DaXL_QuaHan:
                Utils.goscreen(this.props.nthis, 'scChiTietTKCuaDonVi', {
                    IdDonVi: IdDV, TuNgay: FromDate, DenNgay: ToDate, loaidanhgia: '3', Type: 4, IdAccount: IdAccount
                })
                break;
            case KeyTK.DangXL_Tong:
                Utils.goscreen(this.props.nthis, 'scChiTietTKCuaDonVi', {
                    IdDonVi: IdDV, TuNgay: FromDate, DenNgay: ToDate, loaidanhgia: '4', Type: 4, IdAccount: IdAccount
                })
                break;
            case KeyTK.DangXL_TrongHan:
                Utils.goscreen(this.props.nthis, 'scChiTietTKCuaDonVi', {
                    IdDonVi: IdDV, TuNgay: FromDate, DenNgay: ToDate, loaidanhgia: '5', Type: 4, IdAccount: IdAccount
                })
                break;
            case KeyTK.DangXL_QuaHan:
                Utils.goscreen(this.props.nthis, 'scChiTietTKCuaDonVi', {
                    IdDonVi: IdDV, TuNgay: FromDate, DenNgay: ToDate, loaidanhgia: '6', Type: 4, IdAccount: IdAccount
                })
                break;

            default:
                break;
        }
    }
    render() {
        const { FromDate, ToDate, selectChuyenMuc, dataThongKe } = this.state
        return (
            <View style={{ flex: 1 }}>
                <ScrollView style={[nstyles.ncontainer, { backgroundColor: colors.white }]}>
                    <View style={{ flex: 1 }}>
                        {/* Phan chon ngay */}
                        <View
                            style={{
                                paddingBottom: 10,
                                borderWidth: 0.5,
                                marginHorizontal: 10,
                                borderRadius: 10,
                                marginBottom: 5,
                                borderColor: colors.colorBlueLight,
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    paddingHorizontal: 10,
                                    width: "100%",
                                }}
                            >
                                <this.ComponentChonNgay
                                    value={FromDate}
                                    title={`Từ ngày`}
                                    placeholder={"Chọn từ ngày"}
                                    onChangTextIndex={(val) => this.onChangeTextIndex(val, 4)}
                                    isEdit={true}
                                />
                                <this.ComponentChonNgay
                                    value={ToDate}
                                    title={`Đến ngày`}
                                    placeholder={"Chọn đến ngày"}
                                    onChangTextIndex={(val) => this.onChangeTextIndex(val, 5)}
                                    isEdit={true}
                                />
                            </View>
                            {/* <this.ComponentLinhVuc
                                title={"Chọn chuyên mục"}
                                placeholder={"Chọn chuyê mục"}
                                value={selectChuyenMuc.TenChuyenMuc}
                                onPress={() => this._dropDown(1)}
                                isEdit={true}
                            /> */}
                        </View>
                    </View>
                    <ScrollView
                        showsHorizontalScrollIndicator={false}
                        horizontal
                        style={[{ marginHorizontal: 10, backgroundColor: colors.white }]}>
                        <View>


                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ width: widthColumn() / 3, borderWidth: 0.5, borderBottomWidth: 0, }}>
                                    <Text style={[styles.text, { fontWeight: 'bold' }]}>{`STT`}</Text>
                                </View>
                                <View style={{ width: widthColumn(), borderWidth: 0.5, borderBottomWidth: 0, borderRightWidth: 0, borderLeftWidth: 0 }}>
                                    <Text style={[styles.text, { fontWeight: 'bold' }]}>{`Lĩnh vực`}</Text>
                                </View>
                                <View style={{ width: widthColumn() - widthColumn() / 2, borderWidth: 0.5, borderBottomWidth: 0 }}>
                                    <Text style={[styles.text, { fontWeight: 'bold' }]}>{`Tổng số`}</Text>
                                </View>
                                <View style={[
                                    {
                                        borderWidth: 0,
                                        borderTopWidth: 0.5

                                    }]}>
                                    <View style={{ height: 30 }}>
                                        <Text
                                            style={{
                                                fontSize: reText(10),
                                                fontWeight: "bold",
                                                textAlign: "center",
                                            }}
                                        >
                                            {"Đã xử lý"}
                                        </Text>
                                    </View>

                                    <View style={{ flexDirection: "row", ...styles.row }}>
                                        <View style={{
                                            borderWidth: 0,
                                            borderTopWidth: 0.5,
                                            width: widthColumn(),
                                        }}>
                                            <Text
                                                style={{
                                                    fontSize: reText(10),
                                                    fontWeight: "bold",
                                                    textAlign: "center",
                                                    paddingVertical: 5,
                                                    flex: 1,
                                                }}
                                            >
                                                {"Tổng"}
                                            </Text>
                                            <View style={{ flexDirection: "row", ...styles.row }}>
                                                <View style={{
                                                    ...styles.row,
                                                    borderWidth: 0,
                                                    width: widthColumn() / 2,
                                                    borderTopWidth: 0.5
                                                }}>
                                                    <Text
                                                        style={{
                                                            fontSize: reText(10),
                                                            fontWeight: "bold",
                                                            textAlign: "center",
                                                            paddingVertical: 5,
                                                            flex: 1,
                                                        }}
                                                    >
                                                        {"Số lượng"}
                                                    </Text>
                                                </View>
                                                <View style={{
                                                    ...styles.row,
                                                    borderWidth: 0,
                                                    width: widthColumn() / 2,
                                                    borderTopWidth: 0.5,
                                                    borderLeftWidth: 0.5
                                                }}>
                                                    <Text
                                                        style={{
                                                            fontSize: reText(10),
                                                            fontWeight: "bold",
                                                            textAlign: "center",
                                                            paddingVertical: 5,
                                                            flex: 1
                                                        }}
                                                    >
                                                        {"Tỉ lệ"}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{
                                            borderWidth: 0,
                                            borderTopWidth: 0.5,
                                            width: widthColumn(),
                                            borderLeftWidth: 0.5
                                        }}>
                                            <Text
                                                style={{
                                                    fontSize: reText(10),
                                                    fontWeight: "bold",
                                                    textAlign: "center",
                                                    paddingVertical: 5,
                                                    flex: 1
                                                }}
                                            >
                                                {"Trong hạn"}
                                            </Text>
                                            <View style={{ flexDirection: "row", ...styles.row }}>
                                                <View style={{
                                                    ...styles.row,
                                                    borderWidth: 0,
                                                    width: widthColumn() / 2,
                                                    borderTopWidth: 0.5
                                                }}>
                                                    <Text
                                                        style={{
                                                            fontSize: reText(10),
                                                            fontWeight: "bold",
                                                            textAlign: "center",
                                                            paddingVertical: 5,
                                                            flex: 1,
                                                        }}
                                                    >
                                                        {"Số lượng"}
                                                    </Text>
                                                </View>
                                                <View style={{
                                                    ...styles.row,
                                                    borderWidth: 0,
                                                    width: widthColumn() / 2,
                                                    borderTopWidth: 0.5, borderLeftWidth: 0.5
                                                }}>
                                                    <Text
                                                        style={{
                                                            fontSize: reText(10),
                                                            fontWeight: "bold",
                                                            textAlign: "center",
                                                            paddingVertical: 5,
                                                            flex: 1
                                                        }}
                                                    >
                                                        {"Tỉ lệ"}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{
                                            borderWidth: 0,
                                            borderTopWidth: 0.5,
                                            width: widthColumn(),
                                            borderLeftWidth: 0.5
                                        }}>
                                            <Text
                                                style={{
                                                    fontSize: reText(10),
                                                    fontWeight: "bold",
                                                    textAlign: "center",
                                                    paddingVertical: 5,
                                                    flex: 1
                                                }}
                                            >
                                                {"Quá hạn"}
                                            </Text>
                                            <View style={{ ...styles.row }}>
                                                <View style={{
                                                    ...styles.row,
                                                    borderWidth: 0,
                                                    width: widthColumn() / 2,
                                                    borderTopWidth: 0.5
                                                }}>
                                                    <Text
                                                        style={{
                                                            fontSize: reText(10),
                                                            fontWeight: "bold",
                                                            textAlign: "center",
                                                            paddingVertical: 5,
                                                            flex: 1,
                                                        }}
                                                    >
                                                        {"Số lượng"}
                                                    </Text>
                                                </View>
                                                <View style={{
                                                    ...styles.row,
                                                    borderWidth: 0,
                                                    width: widthColumn() / 2,
                                                    borderTopWidth: 0.5, borderLeftWidth: 0.5
                                                }}>
                                                    <Text
                                                        style={{
                                                            fontSize: reText(10),
                                                            fontWeight: "bold",
                                                            textAlign: "center",
                                                            paddingVertical: 5,
                                                            flex: 1
                                                        }}
                                                    >
                                                        {"Tỉ lệ"}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>

                                    </View>

                                </View>
                                <View style={[
                                    {
                                        borderWidth: 0,
                                        borderTopWidth: 0.5,
                                        borderLeftWidth: 0.5,
                                        borderRightWidth: 0.5
                                    }]}>
                                    <View style={{ height: 30 }}>
                                        <Text
                                            style={{
                                                fontSize: reText(10),
                                                fontWeight: "bold",
                                                textAlign: "center",
                                            }}
                                        >
                                            {"Đang xử lý"}
                                        </Text>
                                    </View>

                                    <View style={{ flexDirection: "row", ...styles.row }}>
                                        <View style={{
                                            borderWidth: 0,
                                            borderTopWidth: 0.5,
                                            width: widthColumn(),
                                        }}>
                                            <Text
                                                style={{
                                                    fontSize: reText(10),
                                                    fontWeight: "bold",
                                                    textAlign: "center",
                                                    paddingVertical: 5,
                                                    flex: 1,
                                                }}
                                            >
                                                {"Tổng"}
                                            </Text>
                                            <View style={{ flexDirection: "row", ...styles.row }}>
                                                <View style={{
                                                    ...styles.row,
                                                    borderWidth: 0,
                                                    width: widthColumn() / 2,
                                                    borderTopWidth: 0.5
                                                }}>
                                                    <Text
                                                        style={{
                                                            fontSize: reText(10),
                                                            fontWeight: "bold",
                                                            textAlign: "center",
                                                            paddingVertical: 5,
                                                            flex: 1,
                                                        }}
                                                    >
                                                        {"Số lượng"}
                                                    </Text>
                                                </View>
                                                <View style={{
                                                    ...styles.row,
                                                    borderWidth: 0,
                                                    width: widthColumn() / 2,
                                                    borderTopWidth: 0.5, borderLeftWidth: 0.5
                                                }}>
                                                    <Text
                                                        style={{
                                                            fontSize: reText(10),
                                                            fontWeight: "bold",
                                                            textAlign: "center",
                                                            paddingVertical: 5,
                                                            flex: 1
                                                        }}
                                                    >
                                                        {"Tỉ lệ"}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{
                                            borderWidth: 0,
                                            borderTopWidth: 0.5,
                                            width: widthColumn(),
                                            borderLeftWidth: 0.5
                                        }}>
                                            <Text
                                                style={{
                                                    fontSize: reText(10),
                                                    fontWeight: "bold",
                                                    textAlign: "center",
                                                    paddingVertical: 5,
                                                    flex: 1
                                                }}
                                            >
                                                {"Trong hạn"}
                                            </Text>
                                            <View style={{ flexDirection: "row", ...styles.row }}>
                                                <View style={{
                                                    ...styles.row,
                                                    borderWidth: 0,
                                                    width: widthColumn() / 2,
                                                    borderTopWidth: 0.5,
                                                }}>
                                                    <Text
                                                        style={{
                                                            fontSize: reText(10),
                                                            fontWeight: "bold",
                                                            textAlign: "center",
                                                            paddingVertical: 5,
                                                            flex: 1,
                                                        }}
                                                    >
                                                        {"Số lượng"}
                                                    </Text>
                                                </View>
                                                <View style={{
                                                    ...styles.row,
                                                    borderWidth: 0,
                                                    width: widthColumn() / 2,
                                                    borderTopWidth: 0.5, borderLeftWidth: 0.5
                                                }}>
                                                    <Text
                                                        style={{
                                                            fontSize: reText(10),
                                                            fontWeight: "bold",
                                                            textAlign: "center",
                                                            paddingVertical: 5,
                                                            flex: 1
                                                        }}
                                                    >
                                                        {"Tỉ lệ"}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{
                                            borderWidth: 0,
                                            borderTopWidth: 0.5,
                                            width: widthColumn(),
                                            borderLeftWidth: 0.5
                                        }}>
                                            <Text
                                                style={{
                                                    fontSize: reText(10),
                                                    fontWeight: "bold",
                                                    textAlign: "center",
                                                    paddingVertical: 5,
                                                    flex: 1
                                                }}
                                            >
                                                {"Quá hạn"}
                                            </Text>
                                            <View style={{ ...styles.row }}>
                                                <View style={{
                                                    ...styles.row,
                                                    borderWidth: 0,
                                                    width: widthColumn() / 2,
                                                    borderTopWidth: 0.5
                                                }}>
                                                    <Text
                                                        style={{
                                                            fontSize: reText(10),
                                                            fontWeight: "bold",
                                                            textAlign: "center",
                                                            paddingVertical: 5,
                                                            flex: 1,
                                                        }}
                                                    >
                                                        {"Số lượng"}
                                                    </Text>
                                                </View>
                                                <View style={{
                                                    ...styles.row,
                                                    borderWidth: 0,
                                                    width: widthColumn() / 2,
                                                    borderTopWidth: 0.5,
                                                    borderLeftWidth: 0.5
                                                }}>
                                                    <Text
                                                        style={{
                                                            fontSize: reText(10),
                                                            fontWeight: "bold",
                                                            textAlign: "center",
                                                            paddingVertical: 5,
                                                            flex: 1
                                                        }}
                                                    >
                                                        {"Tỉ lệ"}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>

                                    </View>

                                </View>
                            </View>
                            {dataThongKe && dataThongKe.length > 0 ?
                                dataThongKe.map((item, index) => {
                                    return (
                                        <View key={index} style={{ flexDirection: 'row', }}>
                                            <View style={{ width: widthColumn() / 3, borderWidth: 0.5, }}>
                                                <Text style={[styles.text, { fontWeight: 'bold' }]}>{index}</Text>
                                            </View>
                                            <View style={{ width: widthColumn(), borderWidth: 0.5, borderRightWidth: 0, borderLeftWidth: 0 }}>
                                                <Text style={[styles.text, {}]}>{item.TenMuc}</Text>
                                            </View>
                                            <TouchableOpacity disabled={index == 0 ? true : false} onPress={() => this.XemDanhSach(KeyTK.SoLuong, item.IdMuc, item.IdAccount ? item.IdAccount : '')}
                                                style={{ width: widthColumn() - widthColumn() / 2, borderWidth: 0.5, borderRightWidth: 0, }}>
                                                <Text style={[styles.text, { color: index == 0 ? colors.black : colors.softBlue, fontWeight: index == 0 ? 'bold' : 'normal' }]}>{item.SoLuong}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity disabled={index == 0 ? true : false} onPress={() => this.XemDanhSach(KeyTK.DaXL_Tong, item.IdMuc, item.IdAccount ? item.IdAccount : '')}
                                                style={{
                                                    ...styles.row,
                                                    borderWidth: 0.5, width: widthColumn() / 2, borderRightWidth: 0,
                                                }}
                                            >

                                                <Text
                                                    style={{
                                                        fontSize: reText(10),
                                                        textAlign: "center",
                                                        paddingVertical: 5,
                                                        flex: 1, color: index == 0 ? colors.black : colors.softBlue, fontWeight: index == 0 ? 'bold' : 'normal'
                                                    }}
                                                >
                                                    {item.TongDaXL}
                                                </Text>
                                            </TouchableOpacity>
                                            <View style={{
                                                ...styles.row,
                                                borderWidth: 0.5, width: widthColumn() / 2,
                                                borderRightWidth: 0,
                                            }}>
                                                <Text
                                                    style={{
                                                        fontSize: reText(10),
                                                        fontWeight: "bold",
                                                        textAlign: "center",
                                                        paddingVertical: 5,
                                                        flex: 1, color: colors.pumpkinOrange
                                                    }}
                                                >
                                                    {item.TyLeTongDaXL}%
                                                </Text>
                                            </View>
                                            <TouchableOpacity disabled={index == 0 ? true : false} onPress={() => this.XemDanhSach(KeyTK.DaXL_TrongHan, item.IdMuc, item.IdAccount ? item.IdAccount : '')}
                                                style={{
                                                    ...styles.row,
                                                    borderWidth: 0.5, width: widthColumn() / 2,
                                                    borderRightWidth: 0,
                                                }}>
                                                <Text
                                                    style={{
                                                        fontSize: reText(10),
                                                        textAlign: "center",
                                                        paddingVertical: 5,
                                                        flex: 1, color: index == 0 ? colors.black : colors.softBlue, fontWeight: index == 0 ? 'bold' : 'normal'
                                                    }}
                                                >
                                                    {item.SLTrongHanDaXL}
                                                </Text>
                                            </TouchableOpacity>
                                            <View style={{
                                                ...styles.row,
                                                borderWidth: 0.5, width: widthColumn() / 2,
                                                borderRightWidth: 0,
                                            }}>
                                                <Text
                                                    style={{
                                                        fontSize: reText(10),
                                                        fontWeight: "bold",
                                                        textAlign: "center",
                                                        paddingVertical: 5,
                                                        flex: 1, color: colors.pumpkinOrange
                                                    }}
                                                >
                                                    {item.TyLeTrongHanDaXL}%
                                                </Text>
                                            </View>
                                            <TouchableOpacity disabled={index == 0 ? true : false} onPress={() => this.XemDanhSach(KeyTK.DaXL_QuaHan, item.IdMuc, item.IdAccount ? item.IdAccount : '')}
                                                style={{
                                                    ...styles.row,
                                                    borderWidth: 0.5, width: widthColumn() / 2,
                                                    borderRightWidth: 0,
                                                }}>
                                                <Text
                                                    style={{
                                                        fontSize: reText(10),
                                                        textAlign: "center",
                                                        paddingVertical: 5,
                                                        flex: 1, color: index == 0 ? colors.black : colors.softBlue, fontWeight: index == 0 ? 'bold' : 'normal'
                                                    }}
                                                >
                                                    {item.SLQuaHanDaXL}
                                                </Text>
                                            </TouchableOpacity>
                                            <View style={{
                                                ...styles.row,
                                                borderWidth: 0.5, width: widthColumn() / 2,
                                                borderRightWidth: 0,
                                            }}>
                                                <Text
                                                    style={{
                                                        fontSize: reText(10),
                                                        fontWeight: "bold",
                                                        textAlign: "center",
                                                        paddingVertical: 5,
                                                        flex: 1, color: colors.pumpkinOrange
                                                    }}
                                                >
                                                    {item.TyLeQuaHanDaXL}%
                                                </Text>
                                            </View>
                                            <TouchableOpacity disabled={index == 0 ? true : false} onPress={() => this.XemDanhSach(KeyTK.DangXL_Tong, item.IdMuc, item.IdAccount ? item.IdAccount : '')}
                                                style={{
                                                    ...styles.row,
                                                    borderWidth: 0.5, width: widthColumn() / 2,
                                                    borderRightWidth: 0,
                                                }}>
                                                <Text
                                                    style={{
                                                        fontSize: reText(10),
                                                        textAlign: "center",
                                                        paddingVertical: 5,
                                                        flex: 1, color: index == 0 ? colors.black : colors.softBlue, fontWeight: index == 0 ? 'bold' : 'normal'
                                                    }}
                                                >
                                                    {item.TongDangXL}
                                                </Text>
                                            </TouchableOpacity>
                                            <View style={{
                                                ...styles.row,
                                                borderWidth: 0.5, width: widthColumn() / 2,
                                                borderRightWidth: 0,
                                            }}>
                                                <Text
                                                    style={{
                                                        fontSize: reText(10),
                                                        fontWeight: "bold",
                                                        textAlign: "center",
                                                        paddingVertical: 5,
                                                        flex: 1, color: colors.pumpkinOrange
                                                    }}
                                                >
                                                    {item.TyLeTongDangXL}%
                                                </Text>
                                            </View>
                                            <TouchableOpacity disabled={index == 0 ? true : false} onPress={() => this.XemDanhSach(KeyTK.DangXL_TrongHan, item.IdMuc, item.IdAccount ? item.IdAccount : '')}
                                                style={{
                                                    ...styles.row,
                                                    borderWidth: 0.5, width: widthColumn() / 2,
                                                    borderRightWidth: 0,
                                                }}>
                                                <Text
                                                    style={{
                                                        fontSize: reText(10),
                                                        textAlign: "center",
                                                        paddingVertical: 5,
                                                        flex: 1, color: index == 0 ? colors.black : colors.softBlue, fontWeight: index == 0 ? 'bold' : 'normal'
                                                    }}
                                                >
                                                    {item.SLTrongHanDangXL}
                                                </Text>
                                            </TouchableOpacity>
                                            <View style={{
                                                ...styles.row,
                                                borderWidth: 0.5, width: widthColumn() / 2,
                                                borderRightWidth: 0,
                                            }}>
                                                <Text
                                                    style={{
                                                        fontSize: reText(10),
                                                        fontWeight: "bold",
                                                        textAlign: "center",
                                                        paddingVertical: 5,
                                                        flex: 1, color: colors.pumpkinOrange
                                                    }}
                                                >
                                                    {item.TyLeTrongHanDangXL}%
                                                </Text>
                                            </View>
                                            <TouchableOpacity disabled={index == 0 ? true : false} onPress={() => this.XemDanhSach(KeyTK.DangXL_QuaHan, item.IdMuc, item.IdAccount ? item.IdAccount : '')}
                                                style={{
                                                    ...styles.row,
                                                    borderWidth: 0.5, width: widthColumn() / 2,
                                                    borderRightWidth: 0,
                                                }}>
                                                <Text
                                                    style={{
                                                        fontSize: reText(10),
                                                        textAlign: "center",
                                                        paddingVertical: 5,
                                                        flex: 1, color: index == 0 ? colors.black : colors.softBlue, fontWeight: index == 0 ? 'bold' : 'normal'
                                                    }}
                                                >
                                                    {item.SLQuaHanDangXL}
                                                </Text>
                                            </TouchableOpacity>
                                            <View style={{
                                                ...styles.row,
                                                borderWidth: 0.5, width: widthColumn() / 2,

                                            }}>
                                                <Text
                                                    style={{
                                                        fontSize: reText(10),
                                                        fontWeight: "bold",
                                                        textAlign: "center",
                                                        paddingVertical: 5,
                                                        flex: 1, color: colors.pumpkinOrange
                                                    }}
                                                >
                                                    {item.TyLeQuaHanDangXL}%
                                                </Text>
                                            </View>

                                        </View>
                                    )
                                })
                                :
                                <View style={{ borderTopWidth: 0.5 }}>
                                    <Text style={{ textAlign: 'center', paddingVertical: 5, fontSize: reText(12) }}>{'Không có dữ liệu...'}</Text>
                                </View>
                            }
                        </View>
                    </ScrollView>


                </ScrollView>
                <IsLoading ref={this.refLoading} />
            </View>

        )
    }
}
const styles = StyleSheet.create({
    text: {
        fontSize: reText(12),
        textAlign: 'center',
        padding: 5,
    },
    row: {
        flexDirection: 'row'
    }

})


export default TKTheoLinhVuc
