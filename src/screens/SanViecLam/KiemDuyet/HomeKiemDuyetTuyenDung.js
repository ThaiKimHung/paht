import React, { Component } from 'react';
import { View, Text, FlatList, Platform, ActivityIndicator, BackHandler, TouchableOpacity, Image } from 'react-native';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import Utils from '../../../../app/Utils';
import { HeaderCus, ListEmpty } from '../../../../components';
import { colors } from '../../../../styles';
import { nstyles, paddingBotX, Width } from '../../../../styles/styles';
import { Images } from '../../../images';
import apis from '../../../apis'
import { appConfig } from '../../../../app/Config';
import { ROOTGlobal } from '../../../../app/data/dataGlobal';
import * as Animatable from 'react-native-animatable';
import ItemTinTuyenDung from '../Component/ItemTinTuyenDung';
import { reText } from '../../../../styles/size';
import moment from 'moment';

const LstTinhTrang = [
    { Id: -1, Status: 'Tất cả' },
    { Id: 0, Status: 'Chưa duyệt' },
    { Id: 1, Status: 'Không duyệt' },
    { Id: 2, Status: 'Đã duyệt' },
]

const objFilter = {
    "page": "1",
    "keyword": "",
    "record": "10",
    "more": false,
    "filter.keys": "keyword|tungay|denngay|IsDuyet",
    "filter.vals": ""
}

class HomeKiemDuyetTuyenDung extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: true,
            page: { Page: 1, AllPage: 1, Size: 10, Total: 0 },
            dataList: [],
            textempty: 'Đang tải...',
            tinhtrang: LstTinhTrang[0],

            dateTo: '',
            dateFrom: '',
            keyword: '',
            isUseFilter: false,
            dataTinhTrang: LstTinhTrang
        };
        ROOTGlobal.dataGlobal._handleUIKiemDuyet = (item, isdelete) => {
            this._handleUIKiemDuyet(item, isdelete)
        }
    }

    componentDidMount() {
        this.GetTinTuyenDung()
        BackHandler.addEventListener('hardwareBackPress', this.backAction)
    }

    backAction = () => {
        Utils.goscreen(this, 'ManHinh_Home')
        return true
    }

    componentWillUnmount() {
        try {
            BackHandler.removeEventListener('hardwareBackPress', this.backAction)
        } catch (error) {

        }
    }

    _handleUIKiemDuyet = (item, isdelete = false) => {
        const { dataList } = this.state
        if (isdelete) {
            //Remove Item
            this.setState({ dataList: dataList.filter(e => e?.Id != item?.Id) })
        } else {
            //Update UI
            this.setState({
                dataList: dataList.map(e => {
                    if (e?.Id == item?.Id) {
                        return {
                            ...e,
                            IsDuyet: item?.IsDuyet
                        }
                    } else {
                        return { ...e }
                    }
                })
            })
        }
    }

    GetTinTuyenDung = async () => {
        const { page, dataList, keyword, tinhtrang, dateTo, dateFrom } = this.state
        let obj = {
            ...objFilter,
            "filter.vals": `${keyword}|${dateFrom ? moment(dateTo, 'YYYY-MM-DD').format('DD-MM-YYYY') : ''}|${dateFrom ? moment(dateFrom, 'YYYY-MM-DD').format('DD-MM-YYYY') : ''}|${[0, 1, 2].includes(tinhtrang.Id) ? tinhtrang.Id : ''}`,
            "page": page.Page,
        }
        Utils.nlog('[LOG] DS tư vấn f0', obj)
        let res = await apis.ApiSanLamViec.GetDanhSachTinTuyenDung_KiemDuyet(obj)
        Utils.nlog('[LOG] DS tư vấn f0', res)
        if (res.status == 1 && res.data) {
            this.setState({
                dataList: [...dataList, ...res.data],
                refreshing: false,
                textempty: 'Không có dữ liệu',
                page: res.page ? res.page : this.state.page
            })
        } else {
            this.setState({
                dataList: [],
                refreshing: false,
                textempty: 'Không có dữ liệu',
                page: res.page ? res.page : this.state.page
            })
        }
    }

    goSearch = () => {
        Utils.goscreen(this, 'SearchTinTuyenDung')
    }

    _onRefresh = () => {
        this.setState({ page: { Page: 1, AllPage: 1, Size: 10, Total: 0 }, refreshing: true, textempty: 'Đang tải...', dataList: [] }, this.GetTinTuyenDung)
    }

    _ListFooterComponent = () => {
        const { page } = this.state
        return page.Page < page.AllPage ? <ActivityIndicator size='small' style={{ marginVertical: 10 }} /> : null;
    }

    loadMore = async () => {
        const { page } = this.state
        if (page.Page < page.AllPage) {
            this.setState({ page: { ...page, Page: page.Page + 1 } }, this.GetTinTuyenDung)
        }
    }

    _keyExtrac = (item, index) => index.toString()

    renderItem = ({ item, index }) => {
        var {
            ListFile = [],
            Id,
        } = item;
        var arrImg = []; var arrLinkFile = [];
        ListFile.forEach(item => {
            const url = item.Path;
            let checkImage = Utils.checkIsImage(item.Path);
            if (checkImage) {
                arrImg.push({
                    url: appConfig.domain + url
                })
            } else {
                arrLinkFile.push({ url: url, name: item.TenFile })
            }

        });

        return (
            <ItemTinTuyenDung
                styleContent={{ marginBottom: 10 }}
                key={index}
                nthis={this}
                dataItem={item}
                goscreen={() => Utils.goscreen(this, 'scDetailsKiemDuyetTuyenDung', { Id: Id })}
                showImages={() => this._showAllImages(arrImg, 0)} />
        )
    }

    // HIỂN THỊ DANH SÁCH HÌNH ẢNH CỦA MỘT ITEM
    _showAllImages = (arrImage = [], index = 0) => {
        Utils.goscreen(this, 'Modal_ShowListImage', { ListImages: arrImage, index });
    }

    _DropDown = () => {
        //Show modal chọn tình trạng 
        Utils.goscreen(this, 'Modal_TinhTrangDuyet', { callback: this._callback, item: this.state.tinhtrang, AllThaoTac: LstTinhTrang })
    }

    _callback = (val) => {
        this.setState({ refreshing: true, tinhtrang: val, dataList: [], textempty: 'Đang tải...' }, this._onRefresh)
    }

    _openSetting = () => {
        // Mở bộ lọc xử lý tại đây
        Utils.goscreen(this, 'ModalFilterTuyenDung', { dataSetting: { ...this.state }, callbacSetting: this.callbacSetting })
    }

    callbacSetting = (objSetting) => {
        this.setState({ ...objSetting, dataList: [], refreshing: true, page: { Page: 1, AllPage: 1, Size: 10, Total: 0 } }, this._onRefresh)
        if (objSetting.dateTo || objSetting.dateFrom || objSetting.keyword) {
            this.setState({ isUseFilter: true })
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
        }, this._onRefresh)
    }

    render() {
        const { refreshing, dataList, tinhtrang, page, isUseFilter } = this.state
        return (
            <View style={{ flex: 1, backgroundColor: colors.BackgroundHome }}>
                <HeaderCus
                    title={'Quản lý tin tuyển dụng'}
                    styleTitle={{ color: colors.white }}
                    iconLeft={Images.icBack}
                    Sleft={{ tintColor: 'white' }}
                    onPressLeft={this.backAction}
                    iconRight={Images.icFilter}
                    Sright={{ tintColor: 'white' }}
                    onPressRight={this._openSetting}
                />
                <View style={{ width: Width(100), flex: 1 }}>
                    <View style={{ padding: 10 }}>
                        <View style={[nstyles.nrow, nstyles.shadow]}>
                            <TouchableOpacity
                                onPress={this._DropDown}
                                style={{ flex: 1, padding: 10, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', marginRight: 5 }}>
                                <Text style={{ fontSize: reText(14) }}>{tinhtrang.Status}</Text>
                                <Image source={Images.icDropDown} style={[nstyles.nIcon15, { tintColor: 'gray' }]} resizeMode='contain' />
                            </TouchableOpacity>
                            <View
                                style={{ padding: 10, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
                                <Text style={{ fontSize: reText(14) }}>{'Tổng: '}<Text style={{ fontWeight: 'bold', color: colors.orangeFive }}>{page?.Total}</Text></Text>
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
                        extraData={this.state}
                        contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 10 }}
                        renderItem={this.renderItem}
                        data={dataList}
                        ListEmptyComponent={<ListEmpty textempty={refreshing ? 'Đang tải' : 'Không có dữ liệu'} isImage={!refreshing} />}
                        // ListHeaderComponent={this._ListHeaderComponent}
                        keyExtractor={this._keyExtrac}
                        refreshing={refreshing}
                        onRefresh={this._onRefresh}
                        onEndReached={this.loadMore}
                        onEndReachedThreshold={0.4}
                        ListFooterComponent={this._ListFooterComponent}
                    />
                </View>
            </View>
        );
    }
}

const mapStateToProps = state => ({
    theme: state.theme
});
export default Utils.connectRedux(HomeKiemDuyetTuyenDung, mapStateToProps, true)
