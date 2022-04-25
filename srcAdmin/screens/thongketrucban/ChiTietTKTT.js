import React, { Component } from 'react'
import { Text, View, FlatList, Image, ActivityIndicator, TouchableOpacity } from 'react-native'
import { HeaderCom, IsLoading, ListEmpty } from '../../../components'
import { colors } from '../../../styles'
import Utils from '../../../app/Utils'
import { Images } from '../../images'
import apis from '../../apis'
import moment from 'moment'
import { reSize, reText } from '../../../styles/size'
import HtmlViewCom from '../../../components/HtmlView'
import { Width } from '../../../styles/styles'

export class ChiTietTKTT extends Component {
    constructor(props) {
        super(props);
        this.TypeFilter = Utils.ngetParam(this, 'TypeFilter', 0);
        this.tungay = Utils.ngetParam(this, 'tungay');
        this.denngay = Utils.ngetParam(this, 'denngay');
        this.state = {
            dataCT: [],
            refreshing: true,
            objectPage: { "Page": 0 },
            soluong: 0,
        }
    }
    componentDidMount() {
        Utils.nlog("TypeFilter", this.TypeFilter)
        Utils.nlog(" this.tungay", this.tungay)
        Utils.nlog(" this.denngay", this.denngay)
        this.get_BieuDo_PhanAnhTheoTinhTrangXuLy_ChiTiet()
    }

    get_BieuDo_PhanAnhTheoTinhTrangXuLy_ChiTiet = async () => {
        nthisIsLoading.show();
        let body = {
            // ...objectFilter,
            tungay: this.tungay ? moment(this.tungay, 'DD/MM/YYYY').format('YYYY-MM-DD') : "",
            denngay: this.denngay ? moment(this.denngay, 'DD/MM/YYYY').format('YYYY-MM-DD') : "",
            TypeFilter: this.TypeFilter,
            page: 1,
            record: 10
        }
        let res = await apis.ApiTKTrucBan.BieuDo_PhanAnhTheoTinhTrangXuLy_ChiTiet(body);
        Utils.nlog('Gia tri IdDonvi - res.data <>>>>>>> CT Quá hạn', body, res)
        if (res.status == 1) {
            this.setState({ dataCT: res.data, soluong: res.page != null ? res.page.Total : 0, refreshing: false, objectPage: res.page != null ? res.page : { "Page": 0 } })
            nthisIsLoading.hide();
        } else {
            this.setState({ dataCT: [], soluong: 0, refreshing: false, objectPage: { "Page": 0 } })
            nthisIsLoading.hide();
        }

    }
    _renderItem = ({ item, index }) => {
        Utils.nlog("Chi tiết nè:", item)
        return (
            <TouchableOpacity
                onPress={() => Utils.goscreen(this, "sc_ChiTietPhanAnhTrucBan",
                    {
                        IdPA: item.IdPA,
                        // callback: () => { Utils.goscreen(this, "Modal_ChiTietTKTT") }
                        isMenuMore: -1
                    })}
                style={{ backgroundColor: colors.white, paddingVertical: 10, paddingHorizontal: 10, marginBottom: 7, borderRadius: 5 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ flex: 1, fontSize: reText(14), fontWeight: 'bold' }}>{item.TenNguoiGopY}</Text>
                    {/* <Text>{item.PhoneNumber}</Text> */}
                    <Text style={{ fontSize: reText(13), fontStyle: 'italic', color: colors.black_50, alignSelf: 'center' }}>{item.CreatedDate}</Text>
                </View>
                <Text>{item.PhoneNumber ? item.PhoneNumber : '---'}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 3, }}>
                    <View style={{ borderWidth: 0.5, paddingHorizontal: 5, paddingVertical: 3, borderRadius: 4, borderColor: colors.black_80 }}>
                        <Text style={{ fontSize: reText(14), color: colors.black_80 }}>{item.MaPhanAnh}</Text>
                    </View>
                    <View style={{ borderWidth: 0.5, paddingHorizontal: 5, paddingVertical: 3, borderRadius: 4, borderColor: colors.orangeFive }}>
                        <Text style={{ fontSize: reText(14), color: colors.orangeFive }}>{item.TenTrangThai}</Text>
                    </View>
                </View>
                <View style={{ marginTop: 3 }}>
                    <Text numberOfLines={2} style={{ fontSize: reText(13), fontWeight: 'bold', color: colors.peacockBlue }}>{item.TieuDe ? item.TieuDe : '---'}</Text>
                </View>
                <View style={{ height: Platform.OS == 'ios' ? 55 : 62, paddingHorizontal: 5 }}>
                    <HtmlViewCom
                        html={item.NoiDung}
                        style={{ height: '100%' }}
                    />
                </View>

                {/* <View style={{ marginTop: 3, minHeight: 40, maxHeight: 40 }}>
                    <Text numberOfLines={2} style={{ fontSize: reText(13) }}>{item.NoiDung}</Text>
                </View> */}
                <View style={{ flexDirection: 'row', marginTop: 3 }}>
                    <Image source={Images.icLocation} style={{ tintColor: colors.peacockBlue, width: 9, height: 12 }} />
                    <Text numberOfLines={1} style={{ alignSelf: 'center', marginLeft: 5, flex: 1, fontSize: reText(13), fontStyle: 'italic', color: colors.peacockBlue }}>{item.DiaDiem}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontSize: reText(13), fontWeight: 'bold' }}>Đơn vị đang xử lý:</Text>
                    <View style={{ paddingHorizontal: 5, width: Width(60) }}>
                        <HtmlViewCom
                            html={item.NhomDVXL ? item.NhomDVXL : '---'}
                            style={{ height: '100%' }}
                        />
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    _onRefresh = () => {
        this.setState({ refreshing: true, objectFilter: { Page: 0 } },
            () => this.get_BieuDo_PhanAnhTheoTinhTrangXuLy_ChiTiet());
    }

    loadMore = async () => {
        const { objectPage } = this.state;


        if (objectPage.Page < objectPage.AllPage) {
            let body = {
                // ...objectFilter,
                tungay: this.tungay ? moment(this.tungay, 'DD/MM/YYYY').format('YYYY-MM-DD') : "",
                denngay: this.denngay ? moment(this.denngay, 'DD/MM/YYYY').format('YYYY-MM-DD') : "",
                TypeFilter: this.TypeFilter,
                page: objectPage?.Page + 1,
                record: 10
            }
            let res = await apis.ApiTKTrucBan.BieuDo_PhanAnhTheoTinhTrangXuLy_ChiTiet(body);
            if (res.status == 1) {
                if (objectPage.Page != res.page.Page) {
                    let data = [...this.state.dataCT, ...res.data]
                    this.setState({ dataCT: data, soluong: res.page.Total, objectPage: res.page });
                }
            } else {
                this.setState({ dataCT: [], soluong: 0, objectPage: { "Page": 0 } });
            }
        };
    };

    _ListFooterComponent = () => {
        const { objectPage } = this.state;
        if (objectPage.Page < objectPage.AllPage)
            return <ActivityIndicator size='small' style={{ marginTop: 10 }} />;
        else return null
    }

    render() {
        const { dataCT, soluong } = this.state
        return (
            <View style={{ flex: 1, backgroundColor: colors.BackgroundHome }}>
                <HeaderCom
                    styleContent={{ backgroundColor: colors.colorHeaderApp }}
                    titleText={'Danh sách chi tiết'}
                    iconLeft={Images.icBack}
                    onPressLeft={() => Utils.goback(this)}
                    hiddenIconRight={true}
                    nthis={this} />
                <Text style={{ marginHorizontal: 10, marginTop: 5, color: colors.black_50, fontWeight: 'bold', marginBottom: 5 }}>Số lượng:
                <Text style={{ color: colors.redStar, fontWeight: 'bold', }}> {soluong}</Text></Text>
                <FlatList
                    style={{ paddingHorizontal: 10, paddingTop: 5, paddingBottom: 10 }}
                    data={dataCT}
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

export default ChiTietTKTT
