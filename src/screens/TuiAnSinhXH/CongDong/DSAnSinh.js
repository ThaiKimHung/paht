import React, { Component } from 'react';
import { View, Text, FlatList, Platform, ActivityIndicator, BackHandler } from 'react-native';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import Utils from '../../../../app/Utils';
import { ListEmpty } from '../../../../components';
import { colors } from '../../../../styles';
import { nstyles, paddingBotX, Width } from '../../../../styles/styles';
import { Images } from '../../../images';
import HeaderCongDong from '../Component/HeaderCongDong'
import TabTouchHeaderList from '../Component/TabTouchHeaderList';
import HeaderListKhuVuc from '../Component/HeaderListKhuVuc';
import apis from '../../../apis'
import ItemDanhSach from '../../Home/components/ItemDanhSach';
import { appConfig } from '../../../../app/Config';
import { ROOTGlobal } from '../../../../app/data/dataGlobal';
import * as Animatable from 'react-native-animatable';

class DSAnSinh extends Component {
    constructor(props) {
        super(props);
        this.yNext = 0
        this.animaDelta = 0
        this.isTabStatus = 1
        this.state = {
            refreshing: true,
            dataFilter: [{
                key: 'TypeReference',
                value: '102',
                title: 'Mới tạo',
                icon: Images.icCheckBlack
            },
            {
                key: 'TypeReference|TrangThai',
                value: '102|6',
                title: 'Đã hỗ trợ',
                icon: Images.icTieuBieu
            }],
            filterChoose: '0',//Mặc định choose Tiêu Biểu
            fillterKeys: 'TypeReference', // Lọc mặc định theo (Key,Val)=>(MucDo,2)
            fillterVals: '102',
            page: { Page: 1, AllPage: 1, Size: 10, Total: 0 },
            dataList: [],
            textempty: 'Đang tải...',
            dataListArea: [],
            itemSelected: { 'MaPX': -1, 'TenPhuongXa': 'Tổng hopwj' }
        };
        ROOTGlobal.dataGlobal._onRefreshCongDongTuiAnSinh = this._onRefresh
    }

    componentDidMount() {
        this.GetListAnSinh()
        this.GetAllDonVi()
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

    GetAllDonVi = async () => {
        let res = await apis.ApiIntroduction.GetAllDonVi()
        Utils.nlog('[LOG] GetAllDonVi', res)
        if (res.status == 1 && res.data) {
            this.setState({ dataListArea: res.data })
        } else {
            this.setState({ dataListArea: [] })
        }
    }

    GetListAnSinh = async () => {
        const { page, fillterKeys, fillterVals, dataList, itemSelected } = this.state
        let keyFill = fillterKeys + `${itemSelected?.MaPX == -1 ? '' : '|IdBoPhan'}`
        let keyVal = fillterVals + `${itemSelected?.MaPX == -1 ? '' : `|${itemSelected?.MaPX}`}`
        let res = await apis.ApiPhanAnh.GetDanhSachTuiAnSinh(page.Page, page.Size, keyFill, keyVal)
        Utils.nlog('[LOG] DS TUI AN SINH', res)
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
        Utils.goscreen(this, 'SearchTuiAnSinh')
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
                nthisTabbarAnSinh._startAnimation(-150);

            };
        };
        if (this.animaDelta < 0 || ytemp <= 0) {
            this.animaDelta = 0;
            if (this.isTabStatus != 1) {
                this.isTabStatus = 1;
                nthisTabbarAnSinh._startAnimation(0);
            };
        };
    };

    _onRefresh = () => {
        this.setState({ page: { Page: 1, AllPage: 1, Size: 10, Total: 0 }, refreshing: true, textempty: 'Đang tải...', dataList: [] }, this.GetListAnSinh)
    }

    _ListFooterComponent = () => {
        const { page } = this.state
        return page.Page < page.AllPage ? <ActivityIndicator size='small' style={{ marginVertical: 10 }} /> : null;
    }

    loadMore = async () => {
        const { page } = this.state
        if (page.Page < page.AllPage) {
            this.setState({ page: { ...page, Page: page.Page + 1 } }, this.GetListAnSinh)
        }
    }

    _ListHeaderComponent = () => {
        return (
            <View style={{ width: Width(100) }}>
                <TabTouchHeaderList
                    dataFilter={this.state.dataFilter}
                    filterChoose={this.state.filterChoose}
                    chooseFilter={this._chooseFilter}
                />
            </View>
        )
    }

    _chooseFilter = async (id, key, value) => {
        if (this.state.refreshing == true) {
            return;
        } else {
            if (this.state.filterChoose != id) {
                this.setState({
                    filterChoose: id,
                    fillterKeys: key,
                    fillterVals: value,
                }, this._onRefresh);
            };
        }
    }

    _keyExtrac = (item, index) => index.toString()

    renderItem = ({ item, index }) => {
        var {
            ListHinhAnh = [],
            IdPA,
            SoLuongTuongTac = 0,
            ChuyenMuc
        } = item;
        var arrImg = []; var arrLinkFile = [];
        ListHinhAnh.forEach(item => {
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
            <ItemDanhSach
                isAnSinhXaHoi={true}
                styleContent={{ marginBottom: 10 }}
                key={index}
                // colorLinhVuc={this.IdSource == 'CA' ? this.props.item.Color : 'black'}
                colorLinhVuc={'black'}
                nthis={this}
                numberComent={SoLuongTuongTac}
                dataItem={item}
                // type={arrImg.length > 0 ? 1 : 2}
                goscreen={() => Utils.goscreen(this, 'Modal_ChiTietTuiAnSinh', { IdPA: IdPA, TenChuyenMuc: ChuyenMuc, SoLuongTuongTac: SoLuongTuongTac })}
                showImages={() => this._showAllImages(arrImg, 0)} />
        )
    }

    // HIỂN THỊ DANH SÁCH HÌNH ẢNH CỦA MỘT ITEM
    _showAllImages = (arrImage = [], index = 0) => {
        Utils.goscreen(this, 'Modal_ShowListImage', { ListImages: arrImage, index });
    }

    MapView = () => {
        Utils.goscreen(this, 'Modal_MapHomeTuiAnSinh')
    }

    onChangeArea = (item) => {
        console.log('123', item)
        this.setState({ itemSelected: item }, this._onRefresh)
    }

    render() {
        const { refreshing, dataList, dataListArea, itemSelected } = this.state
        return (
            <View style={{ flex: 1, backgroundColor: colors.BackgroundHome }}>
                <HeaderCongDong
                    onPressBack={() => { Utils.goscreen(this, 'ManHinh_Home') }}
                    onPressSearch={this.goSearch}
                    onPressMap={this.MapView}
                />
                <View style={{ width: Width(100), flex: 1 }}>
                    <HeaderListKhuVuc
                        onChange={item => this.onChangeArea(item)}
                        dataList={dataListArea}
                        keyView={'TenPhuongXa'}
                        keyID={'MaPX'}
                        valueIdTongHop={-1} // Giá trị mặc định tự đặt để nhận biết case tổng hợp
                        itemSelected={itemSelected}
                    />
                    <View style={{ width: Width(100) }}>
                        <TabTouchHeaderList
                            dataFilter={this.state.dataFilter}
                            filterChoose={this.state.filterChoose}
                            chooseFilter={this._chooseFilter}
                        />
                    </View>
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
export default Utils.connectRedux(DSAnSinh, mapStateToProps, true)
