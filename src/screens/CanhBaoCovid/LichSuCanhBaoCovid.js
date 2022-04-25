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
import { nstyles } from '../../../styles/styles';
import moment from 'moment';


const objFilter = {
    "sortOrder": "asc",
    "sortField": "CreatedDate",
    "pageNumber": "1",
    "pageSize": "10",
    "OrderBy": "CreatedDate",
    "page": "1",
    "keyword": "",
    "record": "10",
    "more": false,
    "filter.keys": "tungay|denngay|status|DevicesToken|Type",
    "filter.vals": "||1||1",
}

class LichSuCanhBaoCovid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataTinhTrang: [],
            tinhtrang: { Id: -1, Status: 'Đang tải...' },
            dateTo: '',
            dateFrom: '',
            keyword: '',

            textempty: 'Đang tải...',
            refreshing: true,
            ListSOS: [],
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
        this._getListNameStatus()
    }

    _getListNameStatus = async () => {
        let res = await apis.ApiCBCV.GetList_TinhTrangAll()
        Utils.nlog('data tinht trang', res)
        if (res.status == 1 && res.data) {
            this.setState({
                dataTinhTrang: res.data,
                tinhtrang: res.data[0]
            }, this._GetListSOS)
        } else {
            this.setState({
                dataTinhTrang: [],
                tinhtrang: { Id: -1, Status: 'Không có dữ liệu' }
            }, this._GetListSOS)
        }
    }

    _GetListSOS = async () => {
        let DevicesToken = await Utils.ngetStore(nGlobalKeys.userId_OneSignal, '');
        let { tinhtrang, dateTo, dateFrom, keyword, page } = this.state
        let obj = {
            ...objFilter,
            "keyword": keyword,
            "filter.vals": `${dateFrom ? moment(dateTo, 'YYYY-MM-DD').format('DD-MM-YYYY') : ''}|${dateFrom ? moment(dateFrom, 'YYYY-MM-DD').format('DD-MM-YYYY') : ''}|${tinhtrang.Id}|${DevicesToken}|1`,
            "page": page.Page,
        }
        let res = await apis.ApiCBCV.GetListCanhBaoCovid(obj)
        Utils.nlog('res list lich su sos', res)
        if (res.status == 1 && res.data) {
            this.setState({
                refreshing: false,
                ListSOS: this.state.ListSOS.concat(res.data),
                page: res.page
            })
        } else {
            this.setState({
                refreshing: false,
                ListSOS: [],
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

    _openSetting = () => {
        // Mở bộ lọc xử lý tại đây
        Utils.goscreen(this, 'ModalFilterSOSDH', { dataSetting: { ...this.state }, callbacSetting: this.callbacSetting })
    }

    callbacSetting = (objSetting) => {
        this.setState({
            ...objSetting, ListSOS: [], refreshing: true, page: { Page: 1, AllPage: 1, Size: 10, Total: 0 }
        }, this._GetListSOS)
        if (objSetting.dateTo || objSetting.dateFrom || objSetting.keyword) {
            this.setState({ isUseFilter: true })
        }
    }

    _DropDown = () => {
        //Show modal chọn tình trạng 
        Utils.goscreen(this, 'Modal_TinhTrangSOSDH', { callback: this._callback, item: this.state.tinhtrang, AllThaoTac: this.state.dataTinhTrang })
    }

    _callback = (val) => {
        this.setState({ refreshing: true, tinhtrang: val, ListSOS: [], textempty: 'Đang tải...' }, this._GetListSOS)
    }

    _renderItem = ({ item, index }) => {
        return (
            <ItemSOS
                item={item}
                onPressItem={() => this._goDetail(item)} dataTinhTrang={this.state.dataTinhTrang}
            />
        )
    }

    _goDetail = (item) => {
        Utils.goscreen(this, 'scChiTietCanhBaoCovid', { ID: item.Id, callback: () => Utils.goscreen(this, 'ManHinh_CanhBaoCovid') })
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
            ListSOS: []
        }, this._GetListSOS)
    }

    _loadMore = () => {
        let { page } = this.state
        if (page.Page < page.AllPage) {
            this.setState({ page: { ...page, Page: page.Page + 1 } }, this._GetListSOS)
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
            ListSOS: [],
            page: {
                Page: 1,
                AllPage: 1,
                Size: 10,
                Total: 0
            },
            isUseFilter: false,
        }, this._GetListSOS)
    }

    render() {
        const { tinhtrang, ListSOS, textempty, refreshing, page, isUseFilter } = this.state;
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
                    <View style={{ padding: 10 }}>
                        <View style={[nstyles.nrow, nstyles.shadow]}>
                            {/* {Phản ánh tung tham gia và của đơn vị} */}
                            <TouchableOpacity
                                onPress={this._DropDown}
                                style={{ flex: 1, padding: 10, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', marginRight: 5 }}>
                                <Text style={{ fontSize: reText(14) }}>{tinhtrang.Status}</Text>
                                <Image source={Images.icDropDown} style={[nstyles.nIcon15, { tintColor: 'gray' }]} resizeMode='contain' />
                            </TouchableOpacity>
                            <View
                                style={{ padding: 10, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
                                <Text style={{ fontSize: reText(14) }}>{'Tổng: '}<Text style={{ fontWeight: 'bold', color: colors.orangeFive }}>{page.Total}</Text></Text>
                            </View>
                        </View>
                        {
                            isUseFilter ? <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.white, marginTop: 10, borderRadius: 20 }} >
                                <View style={{ paddingVertical: 10, flex: 1 }}>
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
                        // showsVerticalScrollIndicator={false}
                        style={{ flex: 1 }}
                        contentContainerStyle={{ paddingBottom: 20, padding: 10 }}
                        extraData={this.state}
                        data={ListSOS}
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

export default LichSuCanhBaoCovid;
