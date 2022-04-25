import moment from 'moment';
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, ActivityIndicator } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import { nGlobalKeys } from '../../../app/keys/globalKey';
import Utils from '../../../app/Utils';
import { HeaderCom, ListEmpty } from '../../../components';
import { colors } from '../../../styles';
import { reText } from '../../../styles/size';
import { nstyles } from '../../../styles/styles';
import apis from '../../apis';
import { Images } from '../../images';
import { ConfigScreenDH } from '../../routers/screen';
import ItemSOS from './ItemSOS';

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
    "filter.keys": "tungay|denngay|status",
    "filter.vals": "||1"
}

class HomeSOS extends Component {
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
        ROOTGlobal.dataGlobal._reloadSOS = (isAction = -1, IdSOS = '') => {
            this._onRefresh(isAction, IdSOS);
        }

    }

    componentDidMount() {
        this._getListNameStatus()
    }

    _GetListSOS = async () => {
        let { tinhtrang, dateTo, dateFrom, keyword, page } = this.state
        let obj = {
            ...objFilter,
            "keyword": keyword,
            "filter.vals": `${dateFrom ? moment(dateTo, 'YYYY-MM-DD').format('DD-MM-YYYY') : ''}|${dateFrom ? moment(dateFrom, 'YYYY-MM-DD').format('DD-MM-YYYY') : ''}|${tinhtrang.Id}`,
            "page": page.Page,
        }
        let res = await apis.ApiSOS.GetListSOS(obj)
        Utils.nlog('res list sos', res)
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

    _getListNameStatus = async () => {
        let res = await apis.ApiSOS.GetList_TinhTrangAll()
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

    _openMenu = () => {
        this.props.navigation.openDrawer();
    }

    _openSetting = () => {
        // Mở bộ lọc xử lý tại đây
        Utils.goscreen(this, 'ModalFilterSOSDH', { dataSetting: { ...this.state }, callbacSetting: this.callbacSetting })
    }

    callbacSetting = (objSetting) => {
        this.setState({ ...objSetting, ListSOS: [], refreshing: true, page: { Page: 1, AllPage: 1, Size: 10, Total: 0 } }, this._GetListSOS)
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
        Utils.goscreen(this, 'scDetailsSOS', { ID: item.Id, callback: () => Utils.goscreen(this, 'scHomeSOS') })
    }

    _keyExtractor = (item, index) => {
        return index.toString()
    }

    _onRefresh = (isAction = -1, IdSOS = '') => {
        if (isAction != -1 && IdSOS) {
            switch (isAction) {
                case 1: //chuyển xử lý,tiep nhan, xóa, thu hồi sos callback quay lại,chóng reload
                    let list = this.state.ListSOS.filter(e => e.Id != IdSOS)
                    this.setState({ ListSOS: list, textempty: list.length > 0 ? 'Đang tải...' : 'Không có dữ liệu' })
                    break;
                default:
                    break;
            }

        } else {
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
                {/* Header */}
                <HeaderCom
                    titleText={'Trung tâm tiếp nhận S.O.S'}
                    iconLeft={Images.icSlideMenu}
                    onPressLeft={this._openMenu}
                    onPressRight={this._openSetting}
                />
                {/* Body */}
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
                        onEndReachedThreshold={0.3}
                        ListFooterComponent={this._ListFooterComponent}
                    />
                </View>
            </View>
        );
    }
}

export default HomeSOS;
