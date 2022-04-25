import React, { Component } from 'react';
import { View, Text, FlatList, Platform, ActivityIndicator, BackHandler } from 'react-native';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import Utils from '../../../../app/Utils';
import { ListEmpty } from '../../../../components';
import { colors } from '../../../../styles';
import { nstyles, paddingBotX, Width } from '../../../../styles/styles';
import { Images } from '../../../images';
import HeaderCongDong from '../Component/HeaderCongDong'
import apis from '../../../apis'
import { appConfig } from '../../../../app/Config';
import { ROOTGlobal } from '../../../../app/data/dataGlobal';
import * as Animatable from 'react-native-animatable';
import ItemTinTuyenDung from '../Component/ItemTinTuyenDung';

class DanhSachTuyenDung extends Component {
    constructor(props) {
        super(props);
        this.yNext = 0
        this.animaDelta = 0
        this.isTabStatus = 1
        this.state = {
            refreshing: true,
            page: { Page: 1, AllPage: 1, Size: 10, Total: 0 },
            dataList: [],
            textempty: 'Đang tải...',
        };
        ROOTGlobal.dataGlobal._onRefreshCongDongTuyenDung = this._onRefresh
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

    GetTinTuyenDung = async () => {
        const { page, dataList } = this.state
        let res = await apis.ApiSanLamViec.GetDanhSachTinTuyenDung(page.Page, page.Size)
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

    // XỬ LÝ ẨN HIỆN TABBOTTOM
    handleScroll = (event) => {
        let ytemp = event.nativeEvent.contentOffset.y;

        let deltaY = ytemp - this.yNext;
        this.yNext = ytemp;
        //----
        this.animaDelta += deltaY;
        if (this.animaDelta > 160) {
            this.animaDelta = 160;
            if (this.isTabStatus != -1 && ytemp > 50) {
                this.isTabStatus = -1;
                //run animation 1
                nthisTabbarTuyenDung._startAnimation(-150);

            };
        };
        if (this.animaDelta < 0 || ytemp <= 0) {
            this.animaDelta = 0;
            if (this.isTabStatus != 1) {
                this.isTabStatus = 1;
                nthisTabbarTuyenDung._startAnimation(0);
            };
        };
    };

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
                goscreen={() => Utils.goscreen(this, 'Modal_ChiTietTuyenDung', { Id: Id })}
                showImages={() => this._showAllImages(arrImg, 0)} />
        )
    }

    // HIỂN THỊ DANH SÁCH HÌNH ẢNH CỦA MỘT ITEM
    _showAllImages = (arrImage = [], index = 0) => {
        Utils.goscreen(this, 'Modal_ShowListImage', { ListImages: arrImage, index });
    }

    render() {
        const { refreshing, dataList } = this.state
        return (
            <View style={{ flex: 1, backgroundColor: colors.BackgroundHome }}>
                <HeaderCongDong
                    onPressBack={() => { Utils.goscreen(this, 'ManHinh_Home') }}
                    onPressSearch={this.goSearch}
                />
                <View style={{ width: Width(100), flex: 1 }}>
                    <FlatList
                        // getItemLayout={(data, index) => (
                        //     { length: 0, offset: 0, index }
                        // )}
                        // ListHeaderComponentStyle={{ marginBottom: 10 }}
                        style={{ marginTop: 10 }}
                        extraData={this.state}
                        scrollEventThrottle={10}
                        onScroll={this.handleScroll}
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
export default Utils.connectRedux(DanhSachTuyenDung, mapStateToProps, true)
