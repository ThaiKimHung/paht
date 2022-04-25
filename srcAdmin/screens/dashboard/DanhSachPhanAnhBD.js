import React, { Component } from 'react'
import { Text, View, FlatList, TouchableOpacity, Image, Platform, ActivityIndicator } from 'react-native'
import { HeaderCom, IsLoading, ListEmpty } from '../../../components'
import { colors } from '../../../styles'
import Utils from '../../../app/Utils'
import { Images } from '../../images'
import apis from '../../apis'
import { reText } from '../../../styles/size'
import HtmlViewCom from '../../../components/HtmlView'
import { nGlobalKeys } from '../../../app/keys/globalKey'
import Moment from 'moment'
import { ConfigScreenDH } from '../../routers/screen'
import AppCodeConfig from '../../../app/AppCodeConfig'

const objectFilter = {
    sortOrder: "asc",
    sortField: "",
    page: 1,
    record: 10,
    OrderBy: "",
}

export class DanhSachPhanAnhBD extends Component {
    constructor(props) {
        super(props);
        //Key : 1 Biểu đồ thống kê theo chuyên mục
        //Key : 2 Biểu đồ thống kê theo năm tháng
        //Key : 3 Biểu đồ thống kê quá hạn
        //Key : 4 Biểu đồ thống kê mức độ hài lòng
        //Key : 5 Biểu đồ thống kê Các đơn vị xử lý
        this.Key = Utils.ngetParam(this, 'Key', 0)
        this.Value = Utils.ngetParam(this, 'Value', {})
        this.Year = Utils.ngetParam(this, 'Year', 0)
        this.tungay = Utils.ngetParam(this, 'tungay')
        this.denngay = Utils.ngetParam(this, 'denngay')
        this.LoaiMucDo = Utils.ngetParam(this, 'LoaiMucDo')
        //-----------------------------------
        this.MangMau = Utils.getGlobal(nGlobalKeys.MangMau, '', AppCodeConfig.APP_ADMIN)
        this.state = {
            data: [],
            refreshing: false,
            objectPage: { "Page": 0 },
            soluong: 0,
        }
    }

    componentDidMount() {
        Utils.nlog("<><><><>", this.Value)
        if (this.Key == 1)
            this.GetList_ChuyenMuc_ChiTiet()
        if (this.Key == 2)
            this.GetList_TheoThang_ChiTiet()
        if (this.Key == 3)
            this.GetList_ThongKePA_TheoDonViQuaHan_ChiTiet_Beta()
        if (this.Key == 4)
            this.GetList_ThongKePA_TheoDonViDanhGia_ChiTiet()
        if (this.Key == 5)
            this.GetList_ThongKePA_TheoDonVi_ChiTiet_BD()
    }

    //Get biểu đồ theo chuyên mục
    GetList_ChuyenMuc_ChiTiet = async () => {
        nthisIsLoading.show();
        let body = {
            ...objectFilter,
            "filter.keys": "tungay|denngay|IdChuyenMuc",
            "filter.vals": `${Moment(this.tungay, 'DD/MM/YYYY').format('YYYY-MM-DD')}|${Moment(this.denngay, 'DD/MM/YYYY').format('YYYY-MM-DD')}|${this.Value.IdChuyenMuc}`
        }
        Utils.nlog("<><><><>1111Body", body)
        let res = await apis.BieuDo.GetList_ChuyenMuc_ChiTiet(body)
        Utils.nlog("<><><><>res", res)
        if (res.status == 1) {
            this.setState({ data: res.data, soluong: res.page != null ? res.page.Total : 0, refreshing: false, objectPage: res.page ? res.page : {} })
            nthisIsLoading.hide();
        }
        else {
            this.setState({ data: [], soluong: 0, refreshing: false, objectPage: { "Page": 0 } })
            nthisIsLoading.hide();
        }
    }

    //Get biểu đồ theo năm tháng
    GetList_TheoThang_ChiTiet = async () => {
        nthisIsLoading.show();
        let body = {
            ...objectFilter,
            "filter.keys": "Nam|Thang",
            "filter.vals": this.Year ? this.Year : 0 | this.Value.thang ? this.Value.thang : 0
        }
        let res = await apis.BieuDo.GetList_TheoThang_ChiTiet(body)
        Utils.nlog("Body.........", body)
        if (res.status == 1) {
            this.setState({ data: res.data, soluong: res.page != null ? res.page.Total : 0, refreshing: false, objectPage: res.page ? res.page : {} })
            nthisIsLoading.hide();
        }
        else {
            this.setState({ data: [], soluong: 0, refreshing: false, objectPage: { "Page": 0 } })
            nthisIsLoading.hide();
        }
    }

    GetList_ThongKePA_TheoDonViQuaHan_ChiTiet_Beta = async () => {
        nthisIsLoading.show();
        let body = {
            ...objectFilter,
            "filter.keys": "tungay|denngay|idchuyenmuc|idnhomdonvi|iddonvi|loaidanhgia",
            "filter.vals": `${this.tungay}|${this.denngay}|0|0|${this.Value.IdDVXL}|0`
        }
        let res = await apis.BieuDo.GetList_ThongKePA_TheoDonViQuaHan_ChiTiet_Beta(body)
        Utils.nlog("Body.........", body)
        Utils.nlog("res.........", res)
        if (res.status == 1) {
            this.setState({ data: res.data, soluong: res.page != null ? res.page.Total : 0, refreshing: false, objectPage: res.page ? res.page : {} })
            nthisIsLoading.hide();
        }
        else {
            this.setState({ data: [], soluong: 0, refreshing: false, objectPage: { "Page": 0 } })
            nthisIsLoading.hide();
        }
    }

    GetList_ThongKePA_TheoDonViDanhGia_ChiTiet = async () => {
        nthisIsLoading.show();
        let body = {
            ...objectFilter,
            "filter.keys": "tungay|denngay|iddonvi|loaidanhgia",
            "filter.vals": `${this.tungay}|${this.denngay}|${this.Value.IdDonVi}|${this.LoaiMucDo}`
        }
        let res = await apis.BieuDo.GetList_ThongKePA_TheoDonViDanhGia_ChiTiet(body)
        // Utils.nlog("Body.........", body)
        // Utils.nlog("res.........", res)
        if (res.status == 1) {
            this.setState({ data: res.data, soluong: res.page != null ? res.page.Total : 0, refreshing: false, objectPage: res.page ? res.page : {} })
            nthisIsLoading.hide();
        }
        else {
            this.setState({ data: [], soluong: 0, refreshing: false, objectPage: { "Page": 0 } })
            nthisIsLoading.hide();
        }
    }

    GetList_ThongKePA_TheoDonVi_ChiTiet_BD = async () => {
        nthisIsLoading.show();
        let body = {
            ...objectFilter,
            "filter.keys": "tungay|denngay|idchuyenmuc|idnhomdonvi|iddonvi|loaidanhgia",
            "filter.vals": `${this.tungay}|${this.denngay}|0|0|${this.Value.IdMuc}|${this.LoaiMucDo}`
        }
        let res = await apis.BieuDo.GetList_ThongKePA_TheoDonVi_ChiTiet_BD(body)
        Utils.nlog("Body.........", body)
        Utils.nlog("res.........", res)
        if (res.status == 1) {
            this.setState({ data: res.data, soluong: res.page != null ? res.page.Total : 0, refreshing: false, objectPage: res.page ? res.page : {} })
            nthisIsLoading.hide();
        }
        else {
            this.setState({ data: [], soluong: 0, refreshing: false, objectPage: { "Page": 0 } })
            nthisIsLoading.hide();
        }
    }

    _renderItem = ({ item, index }) => {
        let MauMaPA = colors.peacockBlue
        if (this.MangMau) {
            if (item.TreHen > 0) {
                MauMaPA = this.MangMau.QuaHan
            } else {
                if (item.Status == 6) {
                    MauMaPA = this.MangMau.DangTai
                } else {
                    MauMaPA = this.MangMau.BinhThuong
                }
            }
        }
        return (
            <TouchableOpacity onPress={() => Utils.goscreen(this, ConfigScreenDH.Modal_ChiTietPA, { IdPA: item.IdPA, isMenuMore: -1 })}
                style={{ backgroundColor: colors.white, marginBottom: 5, paddingHorizontal: 10, paddingVertical: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: reText(14), fontWeight: 'bold' }}>{item.FullName}</Text>
                    <Text style={{ fontSize: reText(14) }}>{item.SDT}</Text>

                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 3 }}>
                    <Text style={{ fontSize: reText(14), fontWeight: 'bold', color: MauMaPA }}>{item.MaPhanAnh}</Text>
                    <Text style={{ fontSize: reText(14), fontStyle: 'italic', color: colors.black_50 }}>{item.CreatedDate}</Text>
                </View>
                <Text numberOfLines={2} style={{ fontSize: reText(14) }}>Tiêu đề: {item.TieuDe ? item.TieuDe : '---'}</Text>
                {/* <View style={{ height: Platform.OS == 'ios' ? 55 : 62, paddingHorizontal: 5 }}>
                    <HtmlViewCom
                        html={item.NoiDung}
                        style={{ height: '100%' }}
                    />
                </View> */}
                {item.DiaDiem ?
                    <View style={{ flexDirection: 'row', marginTop: 3 }}>
                        <Image source={Images.icLocation} style={{ tintColor: colors.peacockBlue, width: 8, height: 10, alignSelf: 'center', marginRight: 5 }} />
                        <Text numberOfLines={1} style={{ fontSize: reText(12), fontStyle: 'italic', color: colors.peacockBlue, alignSelf: 'center' }}>{item.DiaDiem}</Text>
                    </View> : null}
            </TouchableOpacity>
        )
    }

    _onRefresh = () => {
        this.setState({ refreshing: true, objectFilter: { Page: 0 } },
            () => this.componentDidMount());
    }

    _LoadMoreChuyenMuc = async () => {
        const { objectPage } = this.state;
        if (objectPage.Page < objectPage.AllPage) {
            let body = {
                sortOrder: "asc",
                sortField: "",
                record: 10,
                OrderBy: "",
                "filter.keys": "tungay|denngay|IdChuyenMuc",
                "filter.vals": `${Moment(this.tungay, 'DD/MM/YYYY').format('YYYY-MM-DD')}|${Moment(this.denngay, 'DD/MM/YYYY').format('YYYY-MM-DD')}|${this.Value.IdChuyenMuc}`,
                page: objectPage?.Page + 1,
            }
            let res = await apis.BieuDo.GetList_ChuyenMuc_ChiTiet(body)
            if (res.status == 1) {
                if (objectPage.Page != res.page.Page) {
                    let dataBD = [...this.state.data, ...res.data]
                    this.setState({ data: dataBD, soluong: res.page.Total, objectPage: res.page ? res.page : {} });
                }
            } else {
                this.setState({ data: [], soluong: 0, objectPage: { "Page": 0 } });
            }
        };
    }
    _LoadMoreNamThang = async () => {
        const { objectPage } = this.state;
        if (objectPage.Page < objectPage.AllPage) {
            let body = {
                sortOrder: "asc",
                sortField: "",
                record: 10,
                OrderBy: "",
                "filter.keys": "Nam|Thang",
                "filter.vals": this.Year ? this.Year : 0 | this.Value.thang ? this.Value.thang : 0,
                page: objectPage?.Page + 1,
            }
            let res = await apis.BieuDo.GetList_TheoThang_ChiTiet(body)
            if (res.status == 1) {
                if (objectPage.Page != res.page.Page) {
                    let dataBD = [...this.state.data, ...res.data]
                    this.setState({ data: dataBD, soluong: res.page.Total, objectPage: res.page ? res.page : {} });
                }
            } else {
                this.setState({ data: [], soluong: 0, objectPage: { "Page": 0 } });
            }
        };
    }

    _LoadMoreQuaHan = async () => {
        const { objectPage } = this.state;
        if (objectPage.Page < objectPage.AllPage) {
            let body = {
                sortOrder: "asc",
                sortField: "",
                record: 10,
                OrderBy: "",
                "filter.keys": "tungay|denngay|iddonvi",
                "filter.vals": `${this.tungay}|${this.denngay}|${this.Value.IdDVXL}`,
                page: objectPage?.Page + 1,
            }
            let res = await apis.BieuDo.GetList_ThongKePA_TheoDonViQuaHan_ChiTiet_Beta(body)
            if (res.status == 1) {
                if (objectPage.Page != res.page.Page) {
                    let dataBD = [...this.state.data, ...res.data]
                    this.setState({ data: dataBD, soluong: res.page.Total, objectPage: res.page ? res.page : {} });
                }
            } else {
                this.setState({ data: [], soluong: 0, objectPage: { "Page": 0 } });
            }
        };
    }

    _LoadMoreMucDoHaiLong = async () => {
        const { objectPage } = this.state;
        if (objectPage.Page < objectPage.AllPage) {
            let body = {
                sortOrder: "asc",
                sortField: "",
                record: 10,
                OrderBy: "",
                "filter.keys": "tungay|denngay|iddonvi|loaidanhgia",
                "filter.vals": `${this.tungay}|${this.denngay}|${this.Value.IdDonVi}|${this.LoaiMucDo}`,
                page: objectPage?.Page + 1,
            }
            let res = await apis.BieuDo.GetList_ThongKePA_TheoDonViDanhGia_ChiTiet(body)
            if (res.status == 1) {
                if (objectPage.Page != res.page.Page) {
                    let dataBD = [...this.state.data, ...res.data]
                    this.setState({ data: dataBD, soluong: res.page.Total, objectPage: res.page ? res.page : {} });
                }
            } else {
                this.setState({ data: [], soluong: 0, objectPage: { "Page": 0 } });
            }
        };
    }

    _LoadMoreCacDonVi = async () => {
        const { objectPage } = this.state;
        if (objectPage.Page < objectPage.AllPage) {
            let body = {
                sortOrder: "asc",
                sortField: "",
                record: 10,
                OrderBy: "",
                "filter.keys": "tungay|denngay|idchuyenmuc|idnhomdonvi|iddonvi|loaidanhgia",
                "filter.vals": `${this.tungay}|${this.denngay}|0|0|${this.Value.IdMuc}|${this.LoaiMucDo}`,
                page: objectPage?.Page + 1,
            }
            let res = await apis.BieuDo.GetList_ThongKePA_TheoDonVi_ChiTiet_BD(body)
            if (res.status == 1) {
                if (objectPage.Page != res.page.Page) {
                    let dataBD = [...this.state.data, ...res.data]
                    this.setState({ data: dataBD, soluong: res.page.Total, objectPage: res.page ? res.page : {} });
                }
            } else {
                this.setState({ data: [], soluong: 0, objectPage: { "Page": 0 } });
            }
        };
    }

    _ListFooterComponent = () => {
        const { objectPage } = this.state;
        if (objectPage.Page < objectPage.AllPage)
            return <ActivityIndicator size='small' style={{ marginTop: 10 }} />;
        else return null
    }

    loadMore = () => {
        if (this.Key == 1)
            this._LoadMoreChuyenMuc()
        if (this.Key == 2)
            this._LoadMoreNamThang()
        if (this.key == 3)
            this._LoadMoreQuaHan()
        if (this.Key == 4)
            this._LoadMoreMucDoHaiLong()
        if (this.Key == 5) {
            this._LoadMoreCacDonVi()
        }
    };

    render() {
        const { data, soluong } = this.state;
        return (
            <View style={{ flex: 1, backgroundColor: colors.BackgroundHome, }}>
                <HeaderCom
                    styleContent={{ backgroundColor: colors.colorHeaderApp }}
                    titleText={'Danh sách phản ánh'}
                    iconLeft={Images.icBack}
                    onPressLeft={() => Utils.goback(this)}
                    hiddenIconRight={true}
                    nthis={this} />
                <Text style={{ color: colors.redStar, fontWeight: 'bold', fontSize: reText(13), marginHorizontal: 10, marginVertical: 5 }}>Số lượng: {soluong}</Text>
                <FlatList
                    style={{ paddingHorizontal: 10, paddingTop: 5, paddingBottom: 10 }}
                    data={data}
                    renderItem={this._renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh}
                    onEndReached={this.loadMore}
                    onEndReachedThreshold={0.3}
                    ListFooterComponent={this._ListFooterComponent}
                    ListEmptyComponent={<ListEmpty textempty={'Không có dữ liệu'} />}
                />
                <IsLoading />
            </View>
        )
    }
}

export default DanhSachPhanAnhBD
