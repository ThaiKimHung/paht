import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
import Utils from '../../../app/Utils';
import { HeaderCus, ListEmpty } from '../../../components';
import { colors } from '../../../styles';
import { Images } from '../../images';
import ApisAdmin from '../../../srcAdmin/apis'
import apis from '../../apis';
import { nGlobalKeys } from '../../../app/keys/globalKey';
import ItemSOS from '../../../srcAdmin/screens/SOS/ItemSOS';
import { reText } from '../../../styles/size';
import { nstyles, Width } from '../../../styles/styles';
import moment from 'moment';
import HtmlViewCom from '../../../components/HtmlView';

// let DevicesToken = await Utils.ngetStore(nGlobalKeys.userId_OneSignal, '');
const objFilter = {
    "sortOrder": "asc",
    "sortField": "HoTen",
    "pageNumber": "1",
    "pageSize": "10",
    "OrderBy": "HoTen",
    "page": "1",
    "keyword": "",
    "record": "10",
    "more": false,
    "filter.keys": "tungay|denngay|DevicesToken|keyword",
    // "filter.vals": `||${DevicesToken}`,
}

class LichSuIOC extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dateTo: '',
            dateFrom: '',
            keyword: '',
            textempty: 'Đang tải...',
            refreshing: true,
            ListIOC: [],
            page: {
                Page: 1,
                AllPage: 1,
                Size: 10,
                Total: 0
            },
            isUseFilter: false,
        };
    }

    componentDidMount() {
        this._GetListIOC()
    }

    _GetListIOC = async () => {
        let DevicesToken = await Utils.ngetStore(nGlobalKeys.userId_OneSignal, '');
        let { dateTo, dateFrom, keyword, page } = this.state
        let obj = {
            ...objFilter,
            // "keyword": keyword,
            "filter.vals": `${dateFrom ? moment(dateTo, 'YYYY-MM-DD').format('DD-MM-YYYY') : ''}|${dateFrom ? moment(dateFrom, 'YYYY-MM-DD').format('DD-MM-YYYY') : ''}|${DevicesToken}|${keyword}`,
            "page": page.Page,
            // "DevicesToken": DevicesToken
        }
        let res = await apis.ApiUser.GetListIOCApp(obj)
        Utils.nlog('res list lich su sos', obj)
        Utils.nlog('res list lich su sos', res)
        if (res.status == 1 && res.data) {
            this.setState({
                refreshing: false,
                ListIOC: this.state.ListIOC.concat(res.data),
                page: res.page
            })
        } else {
            this.setState({
                refreshing: false,
                ListIOC: [],
                page: {
                    Page: 1,
                    AllPage: 1,
                    Size: 10,
                    Total: 0
                },
                textempty: 'Không có dữ liệu'
            })
        }
    }

    _goDetail = (item) => {
        Utils.goscreen(this, 'scChiTietIOC', { ID: item.Id, callback: () => Utils.goscreen(this, 'ManHinh_GopYIOC') })
    }

    _openSetting = () => {
        // Mở bộ lọc xử lý tại đây
        Utils.goscreen(this, 'ModalFilterSOSDH', { dataSetting: { ...this.state }, callbacSetting: this.callbacSetting, isManHinhIOC: true })
    }

    callbacSetting = (objSetting) => {
        Utils.nlog("---------------------------objSetting:", objSetting)
        this.setState({
            ...objSetting, ListIOC: [], refreshing: true, page: { Page: 1, AllPage: 1, Size: 10, Total: 0 }
        }, this._GetListIOC)
        if (objSetting.dateTo || objSetting.dateFrom || objSetting.keyword) {
            this.setState({ isUseFilter: true })
        }
    }


    _callback = (val) => {
        this.setState({ refreshing: true, ListIOC: [], textempty: 'Đang tải...' }, this._GetListIOC)
    }

    _renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity key={index} style={{ backgroundColor: colors.white, padding: 10, borderRadius: 5, marginBottom: 5 }}
                onPress={() => this._goDetail(item)}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: reText(14) }}>{item.HoTen}</Text>
                    <Text style={{ color: colors.colorHeaderApp, fontSize: reText(14), fontWeight: 'bold' }}>{item?.SDT}</Text>
                </View>
                <View style={{ minHeight: 60 }}>
                    <HtmlViewCom
                        html={item?.NoiDung}
                        style={{ height: '100%' }}
                    />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: reText(12), textAlign: 'justify', fontStyle: 'italic' }} numberOfLines={1}>
                        {item?.CreatedDate}
                    </Text>
                    {/* {Tỉnh nào cần thì mở ra} */}
                    {/* <Text style={{ fontSize: reText(12), textAlign: 'justify', fontStyle: 'italic', flex: 1, marginLeft: 10, textAlign: 'right', color: colors.colorHeaderApp }} numberOfLines={1}>
                        {item?.TenLoaiFeedBack}
                    </Text> */}
                </View>

            </TouchableOpacity>
        )
    }

    _keyExtractor = (item, index) => {
        return index.toString()
    }

    _onRefresh = () => {
        this.setState({
            refreshing: true,
            textempty: 'Đang tải...',
            page: {
                Page: 1,
                AllPage: 1,
                Size: 10,
                Total: 0
            },
            ListIOC: []
        }, this._GetListIOC)
    }

    _loadMore = () => {
        let { page } = this.state
        if (page.Page < page.AllPage) {
            this.setState({ page: { ...page, Page: page.Page + 1 } }, this._GetListIOC)
        }
    }

    _ListFooterComponent = () => {
        let { page } = this.state
        if (page.Page < page.AllPage) {
            return <ActivityIndicator size={'small'} style={{ marginTop: 10 }} />
        } else {
            return null
        }
    }

    _clearFilter = () => {
        this.setState({
            dateTo: '',
            dateFrom: '',
            keyword: '',
            textempty: 'Đang tải...',
            refreshing: true,
            ListIOC: [],
            page: {
                Page: 1,
                AllPage: 1,
                Size: 10,
                Total: 0
            },
            isUseFilter: false,
        }, this._GetListIOC)
    }

    render() {
        const { ListIOC, textempty, refreshing, page, isUseFilter } = this.state;
        return (
            <View style={{ flex: 1, backgroundColor: colors.BackgroundHome }}>
                <HeaderCus
                    title={"Lịch sử"}
                    styleTitle={{ color: colors.white }}
                    iconLeft={Images.icBack}
                    onPressLeft={() => { Utils.goback(this) }}
                    iconRight={Images.icFilter}
                    Sright={{ tintColor: 'white' }}
                    onPressRight={this._openSetting}
                />
                <View style={{ flex: 1 }}>
                    <View style={{ paddingHorizontal: 15 }}>
                        {
                            isUseFilter ? <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.white, marginTop: 10, borderRadius: 20 }} >
                                <View style={{ paddingVertical: 5, flex: 1 }}>
                                    <Text style={{ fontSize: reText(12), color: colors.yellowishOrange, paddingLeft: 10 }}>{'Đang sử dụng bộ lọc'}</Text>
                                </View>
                                <View style={{}}>
                                    <TouchableOpacity onPress={this._clearFilter} style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}>
                                        <Text style={{ fontSize: reText(12), color: colors.yellowishOrange }} >{'Xóa bộ lọc'}</Text>
                                        <Image source={Images.icCloseBlack} style={[nstyles.nIcon20, { tintColor: colors.yellowishOrange }]} />
                                    </TouchableOpacity>
                                </View>
                            </View> : null
                        }
                    </View>
                    <FlatList
                        style={{ flex: 1 }}
                        contentContainerStyle={{ paddingBottom: 20, padding: 10 }}
                        extraData={this.state}
                        data={ListIOC}
                        renderItem={this._renderItem}
                        keyExtractor={this._keyExtractor}
                        refreshing={refreshing}
                        onRefresh={this._onRefresh}
                        ListEmptyComponent={<ListEmpty textempty={textempty} isImage={!refreshing} />}
                        onEndReached={this._loadMore}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={this._ListFooterComponent}
                    />
                </View>
            </View>
        );
    }
}

export default LichSuIOC;
