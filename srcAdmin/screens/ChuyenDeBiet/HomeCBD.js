import React, { Component } from 'react';
import {
    ActivityIndicator,
    FlatList,
    View,
    Text
} from 'react-native';
import Utils from '../../../app/Utils';
import { ListEmpty } from '../../../components';
import HeaderCom from '../../../components/HeaderCom';
import { nstyles } from '../../../styles/styles';
import apis from '../../apis';
import { ItemDanhSach } from '../PhanAnhHienTruong';
import moment from 'moment'
import { colors } from '../../../styles';
import { Images } from '../../images';

const objectFilter = {
    sortOrder: "asc",
    sortField: "id",
    page: 1,
    record: 10,
    OrderBy: "id"
}

class HomeCDB extends Component {
    constructor(props) {
        super(props);
        this.dataSetting = {
            selectNguon: { IdNguon: 100, TenNguon: 'Tất cả' },
            selectChuyenMuc: { IdChuyenMuc: 100, TenChuyenMuc: 'Tất cả' },
            keyword: '',
            dateTo: '',
            dateFrom: '',
        };
        this.PANB = Utils.ngetParam(this, 'PANB', false);
        this.isMenuMore = Utils.ngetParam(this, 'isMenuMore', 0)
        this.state = {
            data: [],
            refreshing: true,
            objectPage: { "Page": 0 },
            soluong: 0
        };
    };

    componentDidMount() {
        //Lưu dữ liệu global
        // Utils.setGlobal(nGlobalKeys.dataSetting, this.dataSetting, AppCodeConfig.APP_ADMIN);
        this.GetList_PhanAnhCoTheoDoiCuaDonVi();
        // this._checkRule();
    }

    _openMenu = () => {
        this.props.navigation.openDrawer();
    }

    _openSetting = () => {
        Utils.goscreen(this, 'Modal_HomeSettingDH', { callbacSetting: this._callbackSetting, dataSetting: this.dataSetting, isChuyenDeBiet: true });
    }

    GetList_PhanAnhCoTheoDoiCuaDonVi = async () => {
        let body = {
            ...objectFilter,
            "filter.keys": "chuyenmuc|nguonpa|keyword|tungay|denngay",
            "filter.vals": `${this.dataSetting.selectChuyenMuc && this.dataSetting.selectChuyenMuc.IdChuyenMuc != 100 ? this.dataSetting.selectChuyenMuc.IdChuyenMuc : ''}|${this.dataSetting.selectNguon && this.dataSetting.selectNguon.IdNguon != 100 ? this.dataSetting.selectNguon.IdNguon : ''}|${this.dataSetting.keyword && this.dataSetting.keyword != '' ? this.dataSetting.keyword : ''}|${this.dataSetting.dateTo ? moment(this.dataSetting.dateTo).format('DD-MM-YYYY') : ''}|${this.dataSetting.dateFrom ? moment(this.dataSetting.dateFrom).format('DD-MM-YYYY') : ''}`,
        }
        let res = await apis.Auto.GetList_PhanAnhCoTheoDoiCuaDonVi(body);
        console.log("------------RESS:", res)
        if (res.status == 1) {
            this.setState({ data: res.data, refreshing: false, objectPage: res.page ? res.page : {}, soluong: res.sltong ? res.sltong : 0 })
        }
        else {
            this.setState({ data: [], refreshing: false, objectPage: { "Page": 0 }, soluong: 0 })
        }
    }

    _callbackSetting = (obj) => {
        this.dataSetting = obj;
        // Utils.setGlobal(nGlobalKeys.dataSetting, this.dataSetting, AppCodeConfig.APP_ADMIN);
        this.GetList_PhanAnhCoTheoDoiCuaDonVi()
    }

    //clear bo loc
    // _clearFilter = async () => {
    //     const filter = {
    //         selectNguon: { IdNguon: 100, TenNguon: 'Tất cả' },
    //         selectChuyenMuc: { IdChuyenMuc: 100, TenChuyenMuc: 'Tất cả' },
    //         dateTo: '',
    //         dateFrom: '',
    //         keyword: '',
    //     };
    //     this.dataSetting = filter
    //     Utils.setGlobal(nGlobalKeys.dataSetting, filter, AppCodeConfig.APP_ADMIN);
    // }

    _callbackThis = (nthis) => {
        Utils.goscreen(nthis, 'scChuyenDeBiet')
    }
    _touchItem = (item) => {
        const { IdPA, IsComeBackProcess = false } = item;
        let Param = {
            IdPA,
            callback: this._callbackThis,
            PANB: this.PANB,
            isMenuMore: this.isMenuMore,
            DesignDefault: "0",
            IsComeBackProcess: IsComeBackProcess
        }
        Utils.goscreen(this, 'sc_ChiTietPhanAnhCDB', Param);
    }

    _onRefresh = () => {
        this.setState({ refreshing: true, },
            () => this.GetList_PhanAnhCoTheoDoiCuaDonVi());
    }

    _renderItem = ({ item, index }) => {
        return (
            <>
                <View style={{ marginTop: 5 }}></View>
                <ItemDanhSach
                    isNoCheck={true}
                    ThoiGian={undefined}
                    type={0}
                    item={item}
                    nthis={this}
                    goscreen={() => this._touchItem(item)}
                    // goTuongTu={() => this._onTuongTu(item.IdPA, item.NoiDung)}
                    // goShare={() => this._onShare()}
                    IsDaXyLy={this.isMenuMore}
                    isCheckTinhTrang={this.isMenuMore == 2 ? 0 : 1}
                // check={this.state.rule}
                />
            </>
        )
    };

    _keyExtrac = (item, index) => `${item.IdPA + '_' + index}`;

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
                "filter.keys": "chuyenmuc|nguonpa|keyword|tungay|denngay",
                "filter.vals": `${this.dataSetting.selectChuyenMuc && this.dataSetting.selectChuyenMuc.IdChuyenMuc != 100 ? this.dataSetting.selectChuyenMuc.IdChuyenMuc : ''}|${this.dataSetting.selectNguon && this.dataSetting.selectNguon.IdNguon != 100 ? this.dataSetting.selectNguon.IdNguon : ''}|${this.dataSetting.keyword && this.dataSetting.keyword != '' ? this.dataSetting.keyword : ''}|${this.dataSetting.dateTo ? moment(this.dataSetting.dateTo).format('DD-MM-YYYY') : ''}|${this.dataSetting.dateFrom ? moment(this.dataSetting.dateFrom).format('DD-MM-YYYY') : ''}`,
                page: objectPage?.Page + 1,
            }
            // Utils.nlog("--------------BODY QUANTRONG:", body)
            let res = await apis.Auto.GetList_PhanAnhCoTheoDoiCuaDonVi(body);
            // Utils.nlog("--------------res QUANTRONG:", res)
            if (res.status == 1) {
                if (objectPage.Page != res.page.Page) {
                    let dataBD = [...this.state.data, ...res.data]
                    this.setState({ data: dataBD, objectPage: res.page ? res.page : {}, soluong: res.sltong ? res.sltong : 0 });
                }
            } else {
                this.setState({ data: [], objectPage: { "Page": 0 }, soluong: 0 });
            }
        };
    }

    render() {
        return (
            <View style={nstyles.ncontainer}>
                <HeaderCom
                    titleText={'Phản ánh chuyển để biết'}
                    iconLeft={Images.icSlideMenu}
                    onPressLeft={this._openMenu}
                    onPressRight={this._openSetting}
                />
                <Text style={{ marginHorizontal: 15, marginTop: 10, color: colors.redStar, fontWeight: 'bold', marginBottom: 5 }}>Số lượng: {this.state.soluong ? this.state.soluong : 0}</Text>
                <FlatList
                    style={{ flex: 1, paddingHorizontal: 10, marginBottom: 15 }}
                    showsVerticalScrollIndicator={false}
                    data={this.state.data}
                    renderItem={this._renderItem}
                    keyExtractor={this._keyExtrac}
                    ListEmptyComponent={<ListEmpty textempty={'Không có dữ liệu'} />}
                    // ItemSeparatorComponent={this._ItemSeparatorComponent}
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh}
                    onEndReached={this.loadMore}
                    onEndReachedThreshold={0.3}
                    ListFooterComponent={this._ListFooterComponent}
                />
            </View>
        );
    }
}

// const mapStateToProps = state => ({
//     auth: state.auth
// });

// export default Utils.connectRedux(HomeCDB, mapStateToProps, true);

export default HomeCDB;
