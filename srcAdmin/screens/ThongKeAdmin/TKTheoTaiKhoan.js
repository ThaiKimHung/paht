import React, { Component, useRef } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Image, FlatList, ScrollView } from 'react-native'
import moment from 'moment'
import DatePicker from 'react-native-datepicker'
import apis from '../../apis'
import { GetList_ThongKePA_TaiKhoan } from '../../apis/ThongKeBaoCao'
import Utils from '../../../app/Utils';
import { reText } from '../../../styles/size';
import HtmlViewCom from '../../../components/HtmlView';
import { nstyles, nwidth } from '../../../styles/styles';
import InputRNCom from '../../../components/ComponentApps/InputRNCom';
import { colors } from '../../../styles';
import { IsLoading } from '../../../components'
import { Images } from '../../images'
import ChartTKDonVi from './ChartTKDonVi'
import { ComponentChonNgay, ComponentLinhVuc } from './component'
import Icon from 'react-native-vector-icons/FontAwesome';
import { getBottomSpace } from 'react-native-iphone-x-helper'
import { nGlobalKeys } from '../../../app/keys/globalKey'
import AppCodeConfig from '../../../app/AppCodeConfig'
const widthColumn = () => (nwidth() - 10) / 3
const KeyTK = {
    SoLuong: 100,
    HaiLong: 1,
    KhongHaiLong: 0,
    ChapNhan: 2,
    ChuaDanhGia: 4

}
const DataChart = [
    { name: 'Phản ánh giải quyết', fill: '#FEA2B6', key: "SoLuong" },
    { name: `Hài lòng`, fill: '#8AC8F1', key: "HaiLong" },
    { name: 'Không hài lòng', fill: '#FEE1A9', key: "KhongHaiLong" },
    { name: 'Chấp nhận', fill: '#ECEDEF', key: "ChapNhan" },
    { name: 'Chưa đánh giá', fill: '#97D9D9', key: "ChuaDanhGia" }
]
export class TKTheoTaiKhoan extends Component {
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
            TongSoPA: 0
        }
    }
    componentDidMount() {
        this.getData()
        this.getLinhVuc()
    }
    getData = async () => {
        const { FromDate, ToDate, selectChuyenMuc } = this.state
        nthisIsLoading.show();
        let filterkeys = `tungay|denngay|chuyenmuc${this.checkTK == 'false' ? '' : '|ChuyenMucQL'}`;
        let filtervals = `${moment(FromDate, "DD/MM/YYYY").format("DD-MM-YYYY")}|${moment(ToDate, "DD/MM/YYYY").format("DD-MM-YYYY")}|${selectChuyenMuc && selectChuyenMuc.IdChuyenMuc != -1 ? selectChuyenMuc.IdChuyenMuc : ''}${this.checkTK == 'false' ? '' : '|1'}`;
        let res = await GetList_ThongKePA_TaiKhoan(filterkeys, filtervals);
        nthisIsLoading.hide();
        let rowTong = {
            SoLuong: 0,
            TenTaiKhoan: "Tổng Cộng",
            HaiLong: 0,
            KhongHaiLong: 0,
            ChuaDanhGia: 0,
            ChapNhan: 0,

        }
        for (let index = 0; index < res.data.length; index++) {
            const element = res.data[index];
            rowTong = {
                TenTaiKhoan: "Tổng cộng",
                SoLuong: rowTong.SoLuong + element.SoLuong,
                HaiLong: rowTong.HaiLong + element.HaiLong,
                KhongHaiLong: rowTong.KhongHaiLong + element.KhongHaiLong,
                ChuaDanhGia: rowTong.ChuaDanhGia + element.ChuaDanhGia,
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
                Utils.goscreen(this.props.nthis, 'scChiTietTKAdmin', {
                    IdDonVi: IdDV, TuNgay: FromDate, DenNgay: ToDate, loaidanhgia: '100', Type: 3, IdAccount: IdAccount
                })
                break;
            case KeyTK.HaiLong:
                Utils.goscreen(this.props.nthis, 'scChiTietTKAdmin', {
                    IdDonVi: IdDV, TuNgay: FromDate, DenNgay: ToDate, loaidanhgia: '101', Type: 3, IdAccount: IdAccount
                })
                break;
            case KeyTK.KhongHaiLong:
                Utils.goscreen(this.props.nthis, 'scChiTietTKAdmin', {
                    IdDonVi: IdDV, TuNgay: FromDate, DenNgay: ToDate, loaidanhgia: '1', Type: 3, IdAccount: IdAccount
                })
                break;
            case KeyTK.ChapNhan:
                Utils.goscreen(this.props.nthis, 'scChiTietTKAdmin', {
                    IdDonVi: IdDV, TuNgay: FromDate, DenNgay: ToDate, loaidanhgia: '2', Type: 3, IdAccount: IdAccount
                })
                break;
            case KeyTK.ChuaDanhGia:
                Utils.goscreen(this.props.nthis, 'scChiTietTKAdmin', {
                    IdDonVi: IdDV, TuNgay: FromDate, DenNgay: ToDate, loaidanhgia: '0', Type: 3, IdAccount: IdAccount
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
                <TouchableOpacity style={{ width: widthColumn(), borderWidth: 0.5, borderBottomWidth: 0.5, borderRightWidth: 0, borderLeftWidth: 0 }}>
                    <Text style={[styles.text, { fontWeight: 'bold' }]}>{item.TenTaiKhoan}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ width: widthColumn() - widthColumn() / 2, borderWidth: 0.5, borderBottomWidth: 0.5 }}>
                    <Text style={[styles.text, { fontWeight: 'bold' }]}>{item.SoLuong}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ width: widthColumn() - widthColumn() / 2, borderWidth: 0.5, borderBottomWidth: 0.5 }}>
                    <Text style={[styles.text, { fontWeight: 'bold' }]}>{item.HaiLong}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ width: widthColumn() - widthColumn() / 2, borderWidth: 0.5, borderBottomWidth: 0.5 }}>
                    <Text style={[styles.text, { fontWeight: 'bold' }]}>{item.KhongHaiLong}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ width: widthColumn() - widthColumn() / 2, borderWidth: 0.5, borderBottomWidth: 0.5 }}>
                    <Text style={[styles.text, { fontWeight: 'bold' }]}>{item.ChapNhan}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ width: widthColumn() - widthColumn() / 2, borderWidth: 0.5, borderBottomWidth: 0.5 }}>
                    <Text style={[styles.text, { fontWeight: 'bold' }]}>{item.ChuaDanhGia}</Text>
                </TouchableOpacity>
            </View>
        )
    }
    RenderFilter = () => {
        const { FromDate, ToDate, selectChuyenMuc, dataThongKe, isChart, ishowFilter } = this.state
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
                title={"Chọn chuyên mục"}
                placeholder={"Chọn chuyê mục"}
                value={selectChuyenMuc.TenChuyenMuc}
                onPress={() => this._dropDown(1)}
                isEdit={true}
            />
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
                            <Text style={[styles.text, { fontWeight: 'bold', color: colors.black }]}>{`Tên tài khoản`}</Text>
                        </View>
                        <View style={{ justifyContent: 'center' }}>
                            <View style={{ borderWidth: 0.5, borderBottomWidth: 0 }}>
                                <Text style={[styles.text, { fontWeight: 'bold', paddingVertical: 20, color: colors.black }]}>{`Đánh giá`}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ width: widthColumn() - widthColumn() / 2, borderWidth: 0.5, borderBottomWidth: 0 }}>
                                    <Text style={[styles.text, { fontWeight: 'bold', color: colors.black }]}>{`Số lượng`}</Text>
                                </View>
                                <View style={{ width: widthColumn() - widthColumn() / 2, borderWidth: 0.5, borderBottomWidth: 0 }}>
                                    <Text style={[styles.text, { fontWeight: 'bold', color: colors.black }]}>{`Hài lòng`}</Text>
                                </View>
                                <View style={{ width: widthColumn() - widthColumn() / 2, borderWidth: 0.5, borderBottomWidth: 0 }}>
                                    <Text style={[styles.text, { fontWeight: 'bold', color: colors.black }]}>{`Không hài lòng`}</Text>
                                </View>
                                <View style={{ width: widthColumn() - widthColumn() / 2, borderWidth: 0.5, borderBottomWidth: 0 }}>
                                    <Text style={[styles.text, { fontWeight: 'bold', color: colors.black }]}>{`Chấp nhận`}</Text>
                                </View><View style={{ width: widthColumn() - widthColumn() / 2, borderWidth: 0.5, borderBottomWidth: 0 }}>
                                    <Text style={[styles.text, { fontWeight: 'bold', color: colors.black }]}>{`Chưa đánh giá`}</Text>
                                </View>
                            </View>

                        </View>
                    </View>
                    {dataThongKe.length > 0 && dataThongKe ?
                        dataThongKe.map((item, index) => {
                            return (
                                <View key={index} style={{ flexDirection: 'row', flex: 1 }}>
                                    <View style={{ width: widthColumn() / 3, borderWidth: 0.5, borderBottomWidth: index == dataThongKe.length - 1 ? 0.5 : 0 }}>
                                        <Text style={[styles.text, { color: colors.black }]}>{index}</Text>
                                    </View>
                                    <View style={{ width: widthColumn(), borderWidth: 0.5, borderBottomWidth: dataThongKe.length == index - 1 ? 0 : 0.5, borderRightWidth: 0, borderLeftWidth: 0 }}>
                                        <Text style={[styles.text, { color: colors.black }]}>{item.TenTaiKhoan}</Text>
                                    </View>
                                    <TouchableOpacity disabled={index == 0 ? true : false} onPress={() => this.XemDanhSach(KeyTK.SoLuong, item.IdDonVi, item.IdAccount)} style={{ width: widthColumn() - widthColumn() / 2, borderWidth: 0.5, borderBottomWidth: dataThongKe.length == index - 1 ? 0 : 0.5 }}>
                                        <Text style={[styles.text, { color: index == 0 ? colors.black : colors.softBlue, fontWeight: index == 0 ? 'bold' : 'normal' }]}>{item.SoLuong}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity disabled={index == 0 ? true : false} onPress={() => this.XemDanhSach(KeyTK.HaiLong, item.IdDonVi, item.IdAccount)} style={{ width: widthColumn() - widthColumn() / 2, borderWidth: 0.5, borderBottomWidth: dataThongKe.length == index - 1 ? 0 : 0.5 }}>
                                        <Text style={[styles.text, { color: index == 0 ? colors.black : colors.softBlue, fontWeight: index == 0 ? 'bold' : 'normal' }]}>{item.HaiLong}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity disabled={index == 0 ? true : false} onPress={() => this.XemDanhSach(KeyTK.KhongHaiLong, item.IdDonVi, item.IdAccount)} style={{ width: widthColumn() - widthColumn() / 2, borderWidth: 0.5, borderBottomWidth: dataThongKe.length == index - 1 ? 0 : 0.5 }}>
                                        <Text style={[styles.text, { color: index == 0 ? colors.black : colors.softBlue, fontWeight: index == 0 ? 'bold' : 'normal' }]}>{item.KhongHaiLong}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity disabled={index == 0 ? true : false} onPress={() => this.XemDanhSach(KeyTK.ChapNhan, item.IdDonVi, item.IdAccount)} style={{ width: widthColumn() - widthColumn() / 2, borderWidth: 0.5, borderBottomWidth: dataThongKe.length == index - 1 ? 0 : 0.5 }}>
                                        <Text style={[styles.text, { color: index == 0 ? colors.black : colors.softBlue, fontWeight: index == 0 ? 'bold' : 'normal' }]}>{item.ChapNhan}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity disabled={index == 0 ? true : false} onPress={() => this.XemDanhSach(KeyTK.ChuaDanhGia, item.IdDonVi, item.IdAccount)} style={{ width: widthColumn() - widthColumn() / 2, borderWidth: 0.5, borderBottomWidth: dataThongKe.length == index - 1 ? 0 : 0.5 }}>
                                        <Text style={[styles.text, { color: index == 0 ? colors.black : colors.softBlue, fontWeight: index == 0 ? 'bold' : 'normal' }]}>{item.ChuaDanhGia}</Text>
                                    </TouchableOpacity>
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
        } else return <ChartTKDonVi data={dataThongKe} dataChart={DataChart} keyName={`TenTaiKhoan`} />
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
                    <ScrollView style={[nstyles.ncontainer, { backgroundColor: colors.white }]}>
                        <View style={{ flex: 1 }}>
                            {/* Phan chon ngay */}
                            {
                                this.RenderFilter()
                            }
                        </View>
                        {this.RenderBody()}
                    </ScrollView>
                </View>

                <IsLoading />
            </View>

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
export default TKTheoTaiKhoan
