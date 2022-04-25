import React, { useState, useEffect, useRef, useCallback, memo, useMemo } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList, ScrollView } from 'react-native'
import apis from '../../apis'
import { BarChart, Grid, PieChart } from 'react-native-svg-charts'
import DatePicker from 'react-native-datepicker';
import moment from 'moment'
import { IsLoading } from '../../../components'
import { GetList_ThongKePA_TheoDonViTK } from '../../apis/ThongKeBaoCao'
import Utils from '../../../app/Utils';
import { reText } from '../../../styles/size';
import HtmlViewCom from '../../../components/HtmlView';
import { nstyles, nwidth } from '../../../styles/styles';
import InputRNCom from '../../../components/ComponentApps/InputRNCom';
import { colors } from '../../../styles';
import { Images } from '../../images';
import { ComponentChonNgay, ComponentLinhVuc } from './component';
import Icon from 'react-native-vector-icons/FontAwesome';

import ChartTKDonVi from './ChartTKDonVi';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { nGlobalKeys } from '../../../app/keys/globalKey';
import AppCodeConfig from '../../../app/AppCodeConfig';
const KeyTK = {
    tong: 0,
    tronghan_dxl: 1,
    quahan_dxl: 2,
    tronghan_dangxl: 3,
    quahan_dangxl: 4
}
const dataLoaiDV = [
    {
        id: 1,
        Name: "Đơn vị thi hành",
    },
    {
        id: 2,
        Name: "Đơn vị quyết định xử phạt",
    },
];
const objectFilter = {
    more: false,
    sortOrder: "asc",
    sortField: "",
    page: 1,
    record: 10,
    OrderBy: "",
};
const TKTheoDonVi = (props) => {
    const [dataThongKe, setdataThongKe] = useState([]);
    const [tungay, setTungay] = useState(
        moment(new Date())
            .add(-20, "days")
            .format("DD/MM/YYYY")
    );
    const [ishowFilter, setishowFilter] = useState(false);
    const [TongSoPA, setTongSoPA] = useState(0)
    const [isChart, setisChart] = useState(false);
    const refLoading = useRef(null);
    const [denngay, setdenngay] = useState(moment(new Date()).format("DD/MM/YYYY"));
    const [dataLinhVuc, setdataLinhVuc] = useState([]);
    const [dataDonVi, setdataDonVi] = useState([{ MaPX: 0, TenPhuongXa: "Tất cả" }]);
    const [dataNhomDV, setdataNhomDV] = useState([{ IdNhom: 0, TenNhom: "Tất cả" }]);
    const [dataCapXP, setdataCapXP] = useState([])
    const [selectLv, setselectLv] = useState({ IdChuyenMuc: 0, TenChuyenMuc: "Tất cả" });
    const [selectLoaiDV, setselectLoaiDV] = useState({ IdNhom: 0, TenNhom: "Tất cả" });
    const [selectDv, setselectDv] = useState({ MaPX: 0, TenPhuongXa: "Tất cả" });
    const checkTK = Utils.getGlobal(nGlobalKeys.filterTKBC, 'false', AppCodeConfig.APP_ADMIN)

    const getLinhVuc = async () => {
        let res = await apis.ApiTKTrucBan.GetList_ChuyenMuc();
        if (res.status == 1) {
            setdataLinhVuc([{ IdChuyenMuc: 0, TenChuyenMuc: "Tất cả" }].concat(res.data));
        }
    };
    const GetListNhomDonVi = async () => {

        let res = await apis.ApiTKTrucBan.GetAllCapDonVi_NhomDonVi();
        // Utils.nlog("res loại đơn vị", res);
        if (res.status == 1) {
            setdataNhomDV([{ IdNhom: 0, TenNhom: "Tất cả" }].concat(res.data));
        } else {
            setdataNhomDV([{ IdNhom: 0, TenNhom: "Tất cả" }]);
        }
    };
    const GetList_DonVi = async () => {
        let body = {
            sortOrder: "asc",
            sortField: "",
            page: 1,
            record: 10,
            OrderBy: "",
            more: true,
            "filter.keys": "IdNhomDonVi",
            "filter.vals": selectLoaiDV.IdNhom,
        };
        let res = await apis.ApiTKTrucBan.GetList_DonVi(body);
        Utils.nlog("gía trị don vị----", res);
        if (res.status == 1 && res.data && res.data.length > 0) {
            setdataDonVi([{ MaPX: 0, TenPhuongXa: "Tất cả" }].concat(res.data));
        } else {
            setdataDonVi([{ MaPX: 0, TenPhuongXa: "Tất cả" }]);
        }
    };

    const GetCapCoThamQuyenXuPhat = async () => {
        let res = await apis.ApiXuLyHanhChinh.GetList_CapThamQuyen()
        Utils.nlog('Cấp có thẩm quyền quyết định xử phạt,Cơ quan thi hành', res)
        if (res.status == 1 && res.data) {
            setdataCapXP(res.data)
        }
    }

    useEffect(() => {
        getData();
    }, [tungay, denngay, selectLv, selectLoaiDV, selectDv]);
    const getData = async () => {
        refLoading.current.show();
        let body = {
            ...objectFilter,
            "filter.keys": `tungay|denngay|idnhomdonvi|idchuyenmuc|iddonvi${checkTK == 'false' ? '' : '|ChuyenMucQL'}`,
            "filter.vals": `${moment(tungay, "DD/MM/YYYY").format("DD-MM-YYYY")}|${moment(denngay, "DD/MM/YYYY").format("DD-MM-YYYY")}|${selectLoaiDV.IdNhom}|${selectLv.IdChuyenMuc}|${selectDv ? selectDv.MaPX : 0}${checkTK == 'false' ? '' : '|1'}`
        }
        let res = await GetList_ThongKePA_TheoDonViTK(body);
        Utils.nlog("data-------------", res)
        refLoading.current.hide();
        if (res.status == 1) {
            // setdataThongKe(res.data);
            if (res.data.length > 0) {
                let {
                    IdMuc = '',
                    IdMucParent = '',
                    SoLuong = 0,
                    SLTrongHanDaXL = 0,
                    SLQuaHanDaXL = 0,
                    SLTrongHanDangXL = 0,
                    SLQuaHanDangXL = 0,
                    TongDaXL = 0,
                    TongDangXL = 0,
                    TyLeTongDaXL = 0,
                    TyLeTrongHanDaXL = 0
                } = {}
                for (let index = 0; index < res.data.length; index++) {
                    const element = res.data[index];
                    SoLuong += element.SoLuong ? element.SoLuong : 0;
                    SLTrongHanDaXL += element.SLTrongHanDaXL ? element.SLTrongHanDaXL : 0;
                    SLQuaHanDaXL += element.SLQuaHanDaXL ? element.SLQuaHanDaXL : 0;
                    SLTrongHanDangXL += element.SLTrongHanDangXL ? element.SLTrongHanDangXL : 0;
                    SLQuaHanDangXL += element.SLQuaHanDangXL ? element.SLQuaHanDangXL : 0;

                }
                Utils.nlog("sl----0000", SLQuaHanDaXL)
                setTongSoPA(SoLuong);
                setdataThongKe([{
                    TenMuc: 'Tổng cộng', SoLuong,
                    SLTrongHanDaXL, SLQuaHanDaXL, SLTrongHanDangXL,
                    SLQuaHanDangXL,
                    IdMuc, IdMucParent,
                }, ...res.data]);
            }
        }
        else {
            setTongSoPA(0);
            setdataThongKe([]);
        }
    };

    useEffect(() => {
        if (selectLoaiDV && selectLoaiDV.IdNhom != 0) {
            GetList_DonVi();
        } else {
            setselectDv('')
        }

    }, [selectLoaiDV]);

    useEffect(() => {
        getData();
        getLinhVuc();
        GetListNhomDonVi();

    }, []);

    const onChangeTextIndex = (val, index) => {
        switch (index) {
            case 1:
                {
                    setselectLv(val);
                }
                break;
            case 2:
                {
                    setselectLoaiDV(val);
                }
                break;
            case 3: {
                setselectDv(val)
            } break;
            case 4:
                {
                    if (denngay != "") {
                        let check = moment(denngay, "DD/MM/YYYY").isAfter(moment(val, "DD/MM/YYYY"));
                        if (check == true) {
                            setTungay(val);
                        } else {
                            Utils.showMsgBoxOK(props.nthis, "Thông báo", "Từ ngày phải nhỏ hơn đến ngày", "Xác nhận");
                            return;
                        }
                    } else {
                        setTungay(val);
                    }
                }
                break;
            case 5:
                {
                    if (tungay != "") {
                        let check = moment(tungay, "DD/MM/YYYY").isBefore(moment(val, "DD/MM/YYYY"));
                        if (check == true) {
                            setdenngay(val);
                        } else {
                            Utils.showMsgBoxOK(props.nthis, "Thông báo", "Đến ngày phải lớn hơn từ ngày", "Xác nhận"
                            );
                            return;
                        }
                    } else {
                        setdenngay(val);
                    }
                }
                break;
            case 6:
                {
                    setselectLoaiDV(val);
                }
                break;

            default:
                break;
        }
    };
    const _viewItem = (item, key) => {
        return (
            <View style={{ flex: 1, paddingHorizontal: 10, margin: 2, }} >
                <Text style={{ textAlign: "center", paddingVertical: 10 }}>
                    {item[key]}
                </Text>
            </View>
        );
    };
    //
    const _dropDown = (index) => {
        switch (index) {
            case 1:
                {
                    Utils.goscreen(props.nthis, "Modal_ComponentSelectProps", {
                        callback: (val) => onChangeTextIndex(val, 1),
                        item: selectLv,
                        title: "Danh sách chuyên mục",
                        AllThaoTac: dataLinhVuc,
                        ViewItem: (item) => _viewItem(item, "TenChuyenMuc"),
                        Search: true,
                        key: "TenChuyenMuc",
                    });
                }
                break;
            case 2:
                {
                    Utils.goscreen(props.nthis, "Modal_ComponentSelectProps", {
                        callback: (val) => onChangeTextIndex(val, 2),
                        item: selectLoaiDV,
                        title: "Danh sách nhóm đơn vị",
                        AllThaoTac: dataNhomDV,
                        ViewItem: (item) => _viewItem(item, "TenNhom"),
                        Search: true,
                        key: "TenNhom",
                    });
                }
                break;
            case 3:
                {
                    Utils.goscreen(props.nthis, "Modal_ComponentSelectProps", {
                        callback: (val) => onChangeTextIndex(val, 3),
                        item: selectDv,
                        title: "Danh sách đơn vị",
                        AllThaoTac: dataDonVi,
                        ViewItem: (item) => _viewItem(item, "TenPhuongXa"),
                        Search: true,
                        key: "TenPhuongXa",
                    });
                }
                break;
            default:
                break;
        }
    };

    const XemDanhSach = (key, IdDV) => {
        switch (key) {
            case KeyTK.tong:
                Utils.goscreen(props.nthis, 'scChiTietTKAdmin', {
                    IdDonVi: IdDV, TuNgay: tungay, DenNgay: denngay, LinhVuc: selectLv.IdChuyenMuc, Values: selectLoaiDV.IdNhom, loaidanhgia: '0', Type: 1
                })
                break;
            case KeyTK.tronghan_dxl:
                Utils.goscreen(props.nthis, 'scChiTietTKAdmin', {
                    IdDonVi: IdDV, TuNgay: tungay, DenNgay: denngay, LinhVuc: selectLv.IdChuyenMuc, Values: selectLoaiDV.IdNhom, loaidanhgia: '2', Type: 1
                })
                break;
            case KeyTK.quahan_dxl:
                Utils.goscreen(props.nthis, 'scChiTietTKAdmin', {
                    IdDonVi: IdDV, TuNgay: tungay, DenNgay: denngay, LinhVuc: selectLv.IdChuyenMuc, Values: selectLoaiDV.IdNhom, loaidanhgia: '3', Type: 1
                })
                break;
            case KeyTK.tronghan_dangxl:
                Utils.goscreen(props.nthis, 'scChiTietTKAdmin', {
                    IdDonVi: IdDV, TuNgay: tungay, DenNgay: denngay, LinhVuc: selectLv.IdChuyenMuc, Values: selectLoaiDV.IdNhom, loaidanhgia: '5', Type: 1
                })
                break;
            case KeyTK.quahan_dangxl:
                Utils.goscreen(props.nthis, 'scChiTietTKAdmin', {
                    IdDonVi: IdDV, TuNgay: tungay, DenNgay: denngay, LinhVuc: selectLv.IdChuyenMuc, Values: selectLoaiDV.IdNhom, loaidanhgia: '6', Type: 1
                })
                break;

            default:
                break;
        }
    }
    const renderItem = ({ item, index }) => {
        const { TenMuc,
            IdMuc,
            IdMucParent,
            SoLuong,
            SLTrongHanDaXL,
            SLQuaHanDaXL,
            SLTrongHanDangXL,
            SLQuaHanDangXL,
            TongDaXL,
            TongDangXL,
            TyLeTongDaXL,
            TyLeTrongHanDaXL,
        } = item

        return (
            <View style={{ minHeight: 40, marginVertical: 1, backgroundColor: 'white', width: '100%', flexDirection: 'row', paddingHorizontal: 10 }}>
                <View style={[styles.row, {}]}><Text >{index}</Text></View>
                <View style={[styles.row, { flex: 3, }]}>
                    <Text style={{ fontSize: reText(10), color: colors.black_80, paddingHorizontal: 5 }}>{TenMuc}</Text>
                </View>
                <TouchableOpacity onPress={() => XemDanhSach(KeyTK.tong, IdMuc)} style={styles.row}>
                    <Text style={{ fontSize: reText(10), color: colors.orangCB, paddingHorizontal: 5, fontWeight: 'bold' }}>{SoLuong + ""}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => XemDanhSach(KeyTK.tronghan_dxl, IdMuc)} style={styles.row}>
                    <Text style={{ fontSize: reText(10), color: colors.peacockBlue, paddingHorizontal: 5, }}>{SLTrongHanDaXL + ""}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => XemDanhSach(KeyTK.quahan_dxl, IdMuc)} style={styles.row}>
                    <Text style={{ fontSize: reText(10), color: colors.peacockBlue, paddingHorizontal: 5, }}>{SLQuaHanDaXL + ""}</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => XemDanhSach(KeyTK.tronghan_dangxl, IdMuc)} style={styles.row} >
                    <Text style={{ fontSize: reText(10), color: colors.peacockBlue, paddingHorizontal: 5, }}>{SLTrongHanDangXL + ""}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => XemDanhSach(KeyTK.quahan_dangxl, IdMuc)} style={styles.row} >
                    <Text style={{ fontSize: reText(10), color: colors.peacockBlue, paddingHorizontal: 5, }}>{SLQuaHanDangXL + ""}</Text>
                </TouchableOpacity>
            </View >
        )
    }
    const DataChart = [
        { name: 'Tổng', fill: '#FEA2B6', key: "SoLuong" },
        { name: 'Đã XL trong hạn', fill: '#8AC8F1', key: "SLTrongHanDaXL" },
        { name: 'Đã XL quá hạn', fill: '#FEE1A9', key: "SLQuaHanDaXL" },
        { name: 'Đang XL trong hạn', fill: '#ECEDEF', key: "SLTrongHanDangXL" },
        { name: 'Đang XL quá hạn', fill: '#97D9D9', key: "SLQuaHanDangXL" }
    ]
    let DonVi = "Đơn vị",
        DungHan_ChuaThiHanh = "Trong hạn",
        DungHan_DaThiHanh = "Trong hạn",
        SapHetHan = "Sắp hết hạn",
        Tong = "Tổng số phản ánh",
        TreHan_ChuaThiHanh = "Quá hạn",
        TreHan_DaThiHanh = "Quá hạn",
        DungHan_ThiHanhMotPhan = "Trong hạn",
        TreHan_ThiHanhMotPhan = "Quá hạn";

    const RenderFilter = useMemo(() => {
        if (!ishowFilter) {
            return null
        } else return <View
            style={{
                paddingBottom: 10, borderWidth: 0.5, marginHorizontal: 10, borderRadius: 10, marginBottom: 5,
                borderColor: colors.colorBlueLight,
            }} >
            <View style={{ flexDirection: "row", paddingHorizontal: 10, width: "100%", }} >
                <ComponentChonNgay
                    value={tungay}
                    title={`Từ ngày`}
                    placeholder={"Chọn từ ngày"}
                    onChangTextIndex={(val) => onChangeTextIndex(val, 4)}
                    isEdit={true}
                />
                <ComponentChonNgay
                    value={denngay}
                    title={`Đến ngày`}
                    placeholder={"Chọn đến ngày"}
                    onChangTextIndex={(val) => onChangeTextIndex(val, 5)}
                    isEdit={true}
                />
            </View>
            <ComponentLinhVuc
                title={"Chọn chuyên mục"}
                placeholder={"Chọn chuyên mục"}
                value={selectLv.TenChuyenMuc || ""}
                onPress={() => _dropDown(1)}
                isEdit={true}
            />
            <ComponentLinhVuc
                title={"Nhóm đơn vị"}
                placeholder={"nhóm đơn vị"}
                value={selectLoaiDV.TenNhom || ''}
                onPress={() => _dropDown(2)}
                isEdit={true}
            />
            {
                selectLoaiDV && selectLoaiDV.IdNhom != 0 ? <ComponentLinhVuc
                    title={"Đơn vị "}
                    placeholder={"Chọn đơn vị"}
                    value={selectDv.TenPhuongXa || ""}
                    onPress={() => _dropDown(3)}
                    isEdit={true}
                /> : null
            }

        </View>
    })
    const RenderBody = useMemo(() => {
        if (!isChart) {
            return <View style={{ flex: 1, }}>
                <View>
                    <View
                        style={{
                            minHeight: 40,
                            marginVertical: 1,
                            backgroundColor: "white",
                            width: "100%",
                            flexDirection: "row",
                            paddingHorizontal: 10,
                        }} >
                        <View style={styles.row}>
                            <Text
                                style={{
                                    fontSize: reText(10),
                                    fontWeight: "bold",
                                    textAlign: "center",
                                }}>
                                {"Stt"}
                            </Text>
                        </View>
                        <View style={[styles.row, { flex: 3 }]}>
                            <Text
                                style={{
                                    fontSize: reText(10),
                                    fontWeight: "bold",
                                    textAlign: "center",
                                }}
                            >
                                {DonVi}
                            </Text>
                        </View>

                        <View style={styles.row}>
                            <Text
                                style={{
                                    fontSize: reText(10),
                                    fontWeight: "bold",
                                    textAlign: "center",
                                }}
                            >
                                {Tong + ""}
                            </Text>
                        </View>

                        <View style={[styles.row, { flex: 2 }]}>
                            <View style={{ height: 30 }}>
                                <Text style={{ fontSize: reText(10), fontWeight: "bold", textAlign: "center", }} >
                                    {"Đã xử lý"}
                                </Text>
                            </View>

                            <View style={{ flexDirection: "row" }}>
                                <View style={{ ...styles.row, borderWidth: 0 }}>
                                    <Text
                                        style={{
                                            fontSize: reText(10),
                                            fontWeight: "bold",
                                            textAlign: "center",
                                            paddingVertical: 5,
                                        }}
                                    >
                                        {DungHan_DaThiHanh + ""}
                                    </Text>
                                </View>
                                <View style={{ ...styles.row, borderWidth: 0 }}>
                                    <Text
                                        style={{
                                            fontSize: reText(10),
                                            fontWeight: "bold",
                                            textAlign: "center",
                                            paddingVertical: 5,
                                        }}
                                    >
                                        {TreHan_DaThiHanh + ""}
                                    </Text>
                                </View>
                            </View>

                        </View>
                        <View style={[styles.row, { flex: 2 }]}>
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

                            <View style={{ flexDirection: "row" }}>
                                <View style={{ ...styles.row, borderWidth: 0 }}>
                                    <Text
                                        style={{
                                            fontSize: reText(10),
                                            fontWeight: "bold",
                                            textAlign: "center",
                                            paddingVertical: 5,
                                        }}
                                    >
                                        {DungHan_ThiHanhMotPhan + ""}
                                    </Text>
                                </View>
                                <View style={{ ...styles.row, borderWidth: 0 }}>
                                    <Text
                                        style={{
                                            fontSize: reText(10),
                                            fontWeight: "bold",
                                            textAlign: "center",
                                            paddingVertical: 5,
                                        }}
                                    >
                                        {TreHan_ThiHanhMotPhan + ""}
                                    </Text>
                                </View>
                            </View>

                        </View>
                    </View>
                </View>
                <View style={{ flex: 1, paddingBottom: getBottomSpace() }}>
                    <FlatList
                        data={dataThongKe}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderItem}
                    />
                </View>
            </View>
        } else return <ChartTKDonVi data={dataThongKe} dataChart={DataChart} keyName={'TenMuc'} />
    })
    return (
        <View style={{ flex: 1, backgroundColor: colors.white }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
                <Text style={{ color: colors.black_80, fontWeight: 'bold' }}>{'Tổng số phản ánh :'}</Text>
                <View style={{ backgroundColor: 'red', padding: 5, borderRadius: 10, paddingHorizontal: 10 }}>
                    <Text style={{ color: colors.white, fontWeight: 'bold' }}>{TongSoPA || 0}</Text>
                </View>
            </View>
            <View style={{ paddingHorizontal: 10, flexDirection: 'row', paddingBottom: 10 }}>
                <TouchableOpacity onPress={() => setishowFilter(!ishowFilter)} style={{
                    flexDirection: 'row',
                    alignItems: 'center', justifyContent: 'center'
                }}>
                    <Image style={[{ tintColor: ishowFilter ? colors.pumpkinOrange : colors.black_50, width: 30, height: 30 }]} resizeMode='contain'
                        source={Images.icFilter} />
                    <Text style={{ fontSize: reText(15), fontWeight: "bold", textAlign: "center", color: ishowFilter ? colors.pumpkinOrange : colors.black_50 }}>{`${ishowFilter ? 'Ẩn' : 'Hiện'} bộ lọc`}</Text>
                </TouchableOpacity>
                <View style={{ width: 10 }} />
                <View style={{ flex: 1, }}>
                    <TouchableOpacity onPress={() => setisChart(!isChart)} style={{ borderWidth: 0.5, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', paddingVertical: 10, borderColor: colors.greyLight }}>
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
            {RenderFilter}

            {RenderBody}

            <IsLoading ref={refLoading}></IsLoading>
        </View>
    );
};

export default TKTheoDonVi;

const styles = StyleSheet.create({
    row: {
        flex: 1,
        borderWidth: 0.5,
        borderColor: colors.peacockBlue,
        alignItems: "center",
        justifyContent: "center",
    },
});
