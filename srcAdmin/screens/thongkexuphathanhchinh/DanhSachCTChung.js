import React, { Component } from 'react'
import { Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import { colors } from '../../../styles'
import Utils from '../../../app/Utils'
import { HeaderCom, IsLoading, ListEmpty } from '../../../components'
import { Images } from '../../images'
import apis from '../../apis'
import { reText } from '../../../styles/size'
import Moment from 'moment'
import { Width } from '../../../styles/styles'
import { ConfigScreenDH } from '../../routers/screen'

const objectFilter = {
    sortOrder: "asc",
    sortField: "",
    page: 1,
    record: 10,
    OrderBy: "",
}
//Key : 1 Biểu đồ xử phạt theo tình trạng
//Key : 2 Biểu đồ xử phạt theo thời hạn
//Key : 3 Biểu đồ xử phạt theo tháng
//Key : 4 Biểu đồ xử phạt theo tình trang tron-cot

export class DanhSachCTChung extends Component {
    constructor(props) {
        super(props);
        this.Key = Utils.ngetParam(this, 'Key', 0)
        this.Type = Utils.ngetParam(this, 'Type', 0)
        this.tungay = Utils.ngetParam(this, 'tungay')
        this.denngay = Utils.ngetParam(this, 'denngay')
        this.linhvuc = Utils.ngetParam(this, 'linhvuc')
        this.donvi = Utils.ngetParam(this, 'donvi')
        this.loaithongke = Utils.ngetParam(this, 'loaithongke')
        this.thang = Utils.ngetParam(this, 'thang')
        this.nam = Utils.ngetParam(this, 'nam')
        this.state = {
            data: [],
            refreshing: false,
            objectPage: { "Page": 0 },
            soluong: 0,
        }
    }

    componentDidMount() {
        Utils.nlog("<><><>Don vi:", this.donvi)
        if (this.Key == 1)
            this.GetList_XuPhatTheoTinhTrang_ChiTiet()
        if (this.Key == 2)
            this.GetList_XuPhatTheoThoiHan_ChiTiet()
        if (this.Key == 3)
            this.GetList_XuPhatTheoThang_ChiTiet()
        if (this.Key == 4)
            this.GetList_XuPhatTheoMucPhatHanhChinh_Tron_ChiTiet()
        if (this.Key == 5)
            this.GetList_XuPhatTheoMucPhatHanhChinh_Cot_ChiTiet()
    }

    _renderItem = ({ item, index }) => {
        let MauMaDon = colors.colorBlue
        Utils.nlog("item^^^^^^^^^^^^^^^", item)
        return (
            <TouchableOpacity onPress={() => this.props.navigation.push(ConfigScreenDH.Modal_ChiTietXPC, { ItemXuPhat: item, isRead: true, isTKXPHC: true })}
                key={index} style={{ backgroundColor: colors.white, marginBottom: 5, paddingHorizontal: 10, paddingVertical: 10, borderRadius: 5 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: reText(15), fontWeight: 'bold' }}>{item.FullName}</Text>
                    <Text style={{ fontSize: reText(14), fontStyle: 'italic', color: colors.black_60 }}>{item.CreatedDate}</Text>
                </View>
                <Text numberOfLines={2} style={{ fontSize: reText(14), marginTop: 3, fontStyle: 'italic' }}>{item.HanhVi}</Text>
                {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 3 }}>
                    <Text style={{ fontSize: reText(14), fontWeight: 'bold', color: colors.yellowishOrange }}>{item.MaDon ? item.MaDon : ""}</Text>
                    <Text style={{ fontSize: reText(14), color: colors.black_50 }}>Mã PA: <Text style={{ fontSize: reText(14), fontWeight: 'bold', color: colors.yellowishOrange }}>{item.MaPhanAnh ? item.MaPhanAnh : "-----"}</Text> </Text>
                </View> */}
                <View style={{ marginTop: 5, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', borderWidth: 0.5, borderColor: MauMaDon, paddingHorizontal: 5, paddingVertical: 3, borderRadius: 5, maxWidth: Width(45) }}>
                        <Text style={{ fontSize: reText(12), color: MauMaDon }}>Mã đơn</Text>
                        <Text style={{ fontSize: reText(14), fontWeight: 'bold', color: MauMaDon }}>{item.MaDon}</Text>
                    </View>
                    {
                        item.MaPhanAnh ? <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', borderWidth: 0.5, borderColor: colors.redStar, paddingHorizontal: 5, maxWidth: Width(45), paddingVertical: 3, borderRadius: 5 }}
                        // onPress={() => Utils.goscreen(this, 'sc_ChiTietXuPhatHC', { IdPA: item.IdPA, isMenuMore: -1 })}
                        >
                            <Text style={{ fontSize: reText(12), color: colors.redStar, flex: 1 }}>Mã phản ánh</Text>
                            <Text style={{ fontSize: reText(14), color: colors.redStar, fontWeight: 'bold', flex: 1 }}>{item.MaPhanAnh}</Text>
                        </TouchableOpacity> : null
                    }
                </View>
                <Text numberOfLines={2} style={{ fontSize: reText(14), marginTop: 3, fontStyle: 'italic' }}>Lĩnh vực: {item.LinhVuc ? item.LinhVuc : "-----"}</Text>
                <Text style={{ marginTop: 3, fontSize: reText(14), }}>
                    Tổng mức phạt:
                    <Text style={{ fontSize: reText(14), fontWeight: '400', color: colors.redStar }}> {item.TongMucPhat}</Text>
                </Text>
            </TouchableOpacity >
        )
    }

    _onRefresh = () => {
        this.setState({ refreshing: true, objectFilter: { Page: 0 } },
            () => this.componentDidMount());
    }

    loadMore = () => {
        if (this.Key == 1)
            this._LoadMoreXuPhatTheoTinhTrang()
        if (this.Key == 2)
            this._LoadMoreXuPhatTheoThoiHan()
        if (this.Key == 3)
            this._LoadMoreXuPhatTheoThang()
        if (this.Key == 4)
            this._LoadMoreMucPhat_Tron()
        if (this.Key == 5)
            this._LoadMoreMucPhat_Cot()

    };

    _ListFooterComponent = () => {
        const { objectPage } = this.state;
        if (objectPage.Page < objectPage.AllPage)
            return <ActivityIndicator size='small' style={{ marginTop: 10 }} />;
        else return null
    }

    GetList_XuPhatTheoTinhTrang_ChiTiet = async () => {
        nthisIsLoading.show();
        let body = {
            ...objectFilter,
            "filter.keys": `tungay|denngay|linhvuc|donvi|loaithongke|type`,
            "filter.vals":
                `${this.tungay ? Moment(this.tungay, 'DD/MM/YYYY').format('YYYY-MM-DD') + "|" : '|'}${this.denngay ? Moment(this.denngay, 'DD/MM/YYYY').format('YYYY-MM-DD') + "|" : '|'}${this.linhvuc ? this.linhvuc + "|" : "|"}${this.donvi ? this.donvi + "|" : "|"}${this.loaithongke ? this.loaithongke + "|" : "|"}${this.Type}`
        }
        let res = await apis.ApiTKXPHC.GetList_XuPhatTheoTinhTrang_ChiTiet(body)
        // Utils.nlog("<><><>Body:", body)
        // Utils.nlog("<><><>res:", res)
        if (res.status == 1) {
            this.setState({ data: res.data, soluong: res.page != null ? res.page.Total : 0, refreshing: false, objectPage: res.page ? res.page : {} })
            nthisIsLoading.hide();
        }
        else {
            this.setState({ data: [], soluong: 0, refreshing: false, objectPage: { "Page": 0 } })
            nthisIsLoading.hide();
        }
    }

    GetList_XuPhatTheoThoiHan_ChiTiet = async () => {
        nthisIsLoading.show();
        let body = {
            ...objectFilter,
            "filter.keys": `linhvuc|donvi|loaithongke|type`,
            "filter.vals": `${this.linhvuc ? this.linhvuc + "|" : "|"}${this.donvi ? this.donvi + "|" : "|"}${this.loaithongke ? this.loaithongke + "|" : "|"}${this.Type}`
        }
        Utils.nlog("<><><><>1111Body", body)
        let res = await apis.ApiTKXPHC.GetList_XuPhatTheoThoiHan_ChiTiet(body)
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

    GetList_XuPhatTheoThang_ChiTiet = async () => {
        nthisIsLoading.show();
        let body = {
            ...objectFilter,
            "filter.keys": `year|month`,
            "filter.vals": this.nam + "|" + this.thang
        }
        Utils.nlog("<><><><>1111Body", body)
        let res = await apis.ApiTKXPHC.GetList_XuPhatTheoThang_ChiTiet(body)
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

    GetList_XuPhatTheoMucPhatHanhChinh_Tron_ChiTiet = async () => {
        nthisIsLoading.show();
        let body = {
            ...objectFilter,
            "filter.keys": `tungay|denngay|donvi|loaithongke|type`,
            "filter.vals": `${this.tungay ? Moment(this.tungay, 'DD/MM/YYYY').format('YYYY-MM-DD') + "|" : '|'}${this.denngay ? Moment(this.denngay, 'DD/MM/YYYY').format('YYYY-MM-DD') + "|" : '|'}${this.donvi ? this.donvi + "|" : "|"}${this.loaithongke ? this.loaithongke + "|" : "|"}${this.Type}`
        }
        Utils.nlog("<><><><>1111Body", body)
        let res = await apis.ApiTKXPHC.GetList_XuPhatTheoMucPhatHanhChinh_Tron_ChiTiet(body)
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


    GetList_XuPhatTheoMucPhatHanhChinh_Cot_ChiTiet = async () => {
        nthisIsLoading.show();
        let body = {
            ...objectFilter,
            "filter.keys": `tungay|denngay|donvi|loaithongke|type`,
            "filter.vals": `${this.tungay ? Moment(this.tungay, 'DD/MM/YYYY').format('YYYY-MM-DD') + "|" : '|'}${this.denngay ? Moment(this.denngay, 'DD/MM/YYYY').format('YYYY-MM-DD') + "|" : '|'}${this.donvi ? this.donvi + "|" : "|"}${this.loaithongke ? this.loaithongke + "|" : "|"}${this.Type}`
        }
        Utils.nlog("<><><><>1111Body", body)
        let res = await apis.ApiTKXPHC.GetList_XuPhatTheoMucPhatHanhChinh_Cot_ChiTiet(body)
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

    //function Loadmore
    _LoadMoreXuPhatTheoTinhTrang = async () => {
        const { objectPage } = this.state;
        if (objectPage.Page < objectPage.AllPage) {
            let body = {
                sortOrder: "asc",
                sortField: "",
                record: 10,
                OrderBy: "",
                "filter.keys": `tungay|denngay|linhvuc|donvi|loaithongke|type`,
                "filter.vals":
                    `${this.tungay ? Moment(this.tungay, 'DD/MM/YYYY').format('YYYY-MM-DD') + "|" : '|'}${this.denngay ? Moment(this.denngay, 'DD/MM/YYYY').format('YYYY-MM-DD') + "|" : '|'}${this.linhvuc ? this.linhvuc + "|" : "|"}${this.donvi ? this.donvi + "|" : "|"}${this.loaithongke ? this.loaithongke + "|" : "|"}${this.Type}`,
                page: objectPage?.Page + 1,
            }
            let res = await apis.ApiTKXPHC.GetList_XuPhatTheoTinhTrang_ChiTiet(body)
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

    _LoadMoreXuPhatTheoThoiHan = async () => {
        const { objectPage } = this.state;
        if (objectPage.Page < objectPage.AllPage) {
            let body = {
                sortOrder: "asc",
                sortField: "",
                record: 10,
                OrderBy: "",
                "filter.keys": `linhvuc|donvi|loaithongke|type`,
                "filter.vals": `${this.linhvuc ? this.linhvuc + "|" : "|"}${this.donvi ? this.donvi + "|" : "|"}${this.loaithongke ? this.loaithongke + "|" : "|"}${this.Type}`,
                page: objectPage?.Page + 1,
            }
            let res = await apis.ApiTKXPHC.GetList_XuPhatTheoThoiHan_ChiTiet(body)
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

    _LoadMoreXuPhatTheoThang = async () => {
        const { objectPage } = this.state;
        if (objectPage.Page < objectPage.AllPage) {
            let body = {
                sortOrder: "asc",
                sortField: "",
                record: 10,
                OrderBy: "",
                "filter.keys": `year|month`,
                "filter.vals": this.nam + "|" + this.thang,
                page: objectPage?.Page + 1,
            }
            let res = await apis.ApiTKXPHC.GetList_XuPhatTheoThang_ChiTiet(body)
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

    _LoadMoreMucPhat_Tron = async () => {
        const { objectPage } = this.state;
        if (objectPage.Page < objectPage.AllPage) {
            let body = {
                sortOrder: "asc",
                sortField: "",
                record: 10,
                OrderBy: "",
                "filter.keys": `tungay|denngay|donvi|loaithongke|type`,
                "filter.vals": `${this.tungay ? Moment(this.tungay, 'DD/MM/YYYY').format('YYYY-MM-DD') + "|" : '|'}${this.denngay ? Moment(this.denngay, 'DD/MM/YYYY').format('YYYY-MM-DD') + "|" : '|'}${this.donvi ? this.donvi + "|" : "|"}${this.loaithongke ? this.loaithongke + "|" : "|"}${this.Type}`,
                page: objectPage?.Page + 1,
            }
            let res = await apis.ApiTKXPHC.GetList_XuPhatTheoMucPhatHanhChinh_Tron_ChiTiet(body)
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

    _LoadMoreMucPhat_Cot = async () => {
        const { objectPage } = this.state;
        if (objectPage.Page < objectPage.AllPage) {
            let body = {
                sortOrder: "asc",
                sortField: "",
                record: 10,
                OrderBy: "",
                "filter.keys": `tungay|denngay|donvi|loaithongke|type`,
                "filter.vals": `${this.tungay ? Moment(this.tungay, 'DD/MM/YYYY').format('YYYY-MM-DD') + "|" : '|'}${this.denngay ? Moment(this.denngay, 'DD/MM/YYYY').format('YYYY-MM-DD') + "|" : '|'}${this.donvi ? this.donvi + "|" : "|"}${this.loaithongke ? this.loaithongke + "|" : "|"}${this.Type}`,
                page: objectPage?.Page + 1,
            }
            let res = await apis.ApiTKXPHC.GetList_XuPhatTheoMucPhatHanhChinh_Cot_ChiTiet(body)
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

export default DanhSachCTChung
