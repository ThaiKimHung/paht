import React, { Component } from 'react'
import { Text, View, ActivityIndicator, TouchableOpacity } from 'react-native'
import { HeaderCom, ListEmpty, IsLoading } from '../../../components'
import { Images } from '../../images'
import Utils from '../../../app/Utils'
import apis from '../../apis'
import moment from 'moment'
import { FlatList } from 'react-native-gesture-handler'
import { colors } from '../../../styles'
import { reText } from '../../../styles/size'
import { Height, Width } from '../../../styles/styles'

const objectFilter = {
    "sortOrder": "asc",
    "sortField": "",
    "page": 1,
    "record": 10,
    "OrderBy": "",
}

export class ThongKeTienXPHC_ChiTiet extends Component {
    constructor(props) {
        super(props);
        this.tungay = Utils.ngetParam(this, 'tungay');
        this.denngay = Utils.ngetParam(this, 'denngay');
        this.loaithongke = Utils.ngetParam(this, 'loaithongke');
        this.iddonvi = Utils.ngetParam(this, 'iddonvi');
        this.state = {
            dataList: [],
            refreshing: true,
            objectPage: { "Page": 0 },
        }
    }

    componentDidMount() {
        this.getChiTiet()
    }

    _onBack = () => {
        Utils.goback(this)
    }

    getChiTiet = async () => {
        nthisIsLoading.show();
        this.setState({ refreshing: true })
        let body = {
            ...objectFilter,
            "filter.keys": `tungay|denngay|loaithongke|iddonvi`,
            "filter.vals": `${moment(this.tungay, 'DD/MM/YYYY').format('DD-MM-YYYY')}|${moment(this.denngay, 'DD/MM/YYYY').format('DD-MM-YYYY')}|${this.loaithongke}|${this.iddonvi}`,
        }
        Utils.nlog("body", body);
        const res = await apis.ApiTKXPHC.GetList_ThongKeTienXuPhat_TheoDonVi_ChiTiet(body);
        Utils.nlog("<chi tiết thống kê>", res);
        if (res.status == 1) {
            nthisIsLoading.hide();
            this.setState({ dataList: res.data, refreshing: false, objectPage: res.page })
        }
        else {
            nthisIsLoading.hide();
            this.setState({ dataList: [], refreshing: false, objectPage: { "Page": 0 } })
        }
    }

    _renderItem = ({ item, index }) => {
        // Utils.nlog("Item<><>", item)
        return (
            <TouchableOpacity key={index}
                onPress={() => this.props.navigation.push('Modal_ChiTietTKDV', { ItemXuPhat: item, callback: this.getChiTiet, isTKTienXP: true })}
                style={{ backgroundColor: colors.white, paddingVertical: 10, paddingHorizontal: 10, marginBottom: 5, borderRadius: 5, }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                    <Text style={{ fontSize: reText(13), fontWeight: 'bold' }}>{item.FullName ? item.FullName : '---'}</Text>
                    <Text style={{ fontSize: reText(13), color: colors.black_50, fontStyle: 'italic' }}>{item.CreatedDate}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                    <View style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5, borderWidth: 0.5, borderColor: colors.black_50 }}>
                        <Text style={{ fontSize: reText(13), fontWeight: 'bold', color: colors.black_80 }}>{item.MaDon}</Text>
                    </View>
                    {item.LinhVuc ?
                        <View style={{ backgroundColor: colors.orangeFive, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5 }}>
                            <Text numberOfLines={1} style={{ color: colors.white, fontSize: reText(13), fontWeight: 'bold', width: Width(35) }}>{item.LinhVuc}</Text>
                        </View> : null}
                </View>
                <Text style={{ marginBottom: 5, fontSize: reText(13), }}>Hành vi: {item.HanhVi}</Text>
                <Text style={{ fontSize: reText(14), color: colors.black_50 }}>Tổng mức phạt: <Text style={{ color: colors.redStar, fontWeight: 'bold', fontSize: reText(14) }}>{item.TongMucPhat}</Text></Text>
            </TouchableOpacity >
        )
    }
    _onRefresh = () => {
        this.setState({ refreshing: true, objectFilter: { Page: 0 } },
            () => this.getChiTiet());
    }

    _ListFooterComponent = () => {
        const { objectPage } = this.state;
        if (objectPage.Page < objectPage.AllPage)
            return <ActivityIndicator size='small' style={{ marginTop: 10 }} />;
        else return null
    }

    loadMore = async () => {
        const { objectPage } = this.state;


        if (objectPage.Page < objectPage.AllPage) {
            let body = {
                ...objectFilter,
                "page": objectPage?.Page + 1,
                "filter.keys": `tungay|denngay|loaithongke|iddonvi`,
                "filter.vals": `${moment(this.tungay, 'DD/MM/YYYY').format('DD-MM-YYYY')}|${moment(this.denngay, 'DD/MM/YYYY').format('DD-MM-YYYY')}|${this.loaithongke}|${this.iddonvi}`,
            }
            const res = await apis.ApiTKXPHC.GetList_ThongKeTienXuPhat_TheoDonVi_ChiTiet(body);
            if (res.status == 1) {
                if (objectPage.Page != res.page.Page) {
                    let data = [...this.state.dataList, ...res.data]
                    this.setState({ dataList: data, objectPage: res.page });
                }
            } else {
                this.setState({ dataList: [], objectPage: { "Page": 0 } });
            }
        };
    };

    render() {
        const { dataList, objectPage } = this.state;
        // Utils.nlog("dataaa", dataList)
        return (
            <View style={{ backgroundColor: colors.black_11, flex: 1 }}>
                <HeaderCom
                    titleText={'Danh sách chi tiết'}
                    iconLeft={Images.icBack}
                    onPressLeft={this._onBack}
                    hiddenIconRight={true}
                />
                <Text style={{ color: colors.black_50, fontWeight: 'bold', marginHorizontal: 15, marginTop: 10, marginBottom: 5 }}>
                    Số lượng: <Text style={{ color: colors.redStar }}>{objectPage.Total ? objectPage.Total : '-'}</Text> </Text>
                <FlatList
                    style={{ paddingHorizontal: 15, paddingVertical: 5 }}
                    renderItem={this._renderItem}
                    data={dataList}
                    ListEmptyComponent={<ListEmpty textempty={'Không có dữ liệu'} />}
                    keyExtractor={(item, index) => index.toString()}
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh}
                    onEndReached={this.loadMore}
                    onEndReachedThreshold={0.3}
                    ListFooterComponent={this._ListFooterComponent}
                />
                <IsLoading />
            </View>
        )
    }
}

export default ThongKeTienXPHC_ChiTiet
