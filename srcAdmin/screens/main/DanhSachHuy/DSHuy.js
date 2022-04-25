import React, { Component, Fragment } from 'react'
import { Text, View, FlatList, ActivityIndicator } from 'react-native'
import { nstyles, khoangcach } from '../../../../styles/styles'
import { HeaderCom, ListEmpty, TextInputCom } from '../../../../components'
import { Images } from '../../../images'
import apis from '../../../apis'
import Utils from '../../../../app/Utils'
import { colors } from '../../../../styles'
import { ItemDanhSach } from '../../PhanAnhHienTruong/components'
import { sizes } from '../../../../styles/size'
import ModalLoading from '../../../../components/ComponentApps/ModalLoading'
import { ROOTGlobal } from '../../../../app/data/dataGlobal'
import { nGlobalKeys } from '../../../../app/keys/globalKey'

export class DSHuy extends Component {
    constructor(props) {
        super(props)
        this.pageAll = 0;
        this.state = {
            dataHuy: [],
            textempty: 'Danh sách hủy trống',
            refreshing: false,
            page: 1,
            keySearch: '',
            isLoading: true
        }
        ROOTGlobal[nGlobalKeys.loadDSPHuyDH] = this._getListHuy
    }

    _openMenu = () => {
        this.props.navigation.openDrawer();
    }

    componentDidMount() {
        this._getListHuy()
    }

    _getListHuy = async () => {
        let res = await apis.NguonPhanAnh.GetList_DanhSachPhanAnhHuy(1, false, 10, this.state.keySearch);
        ////Utils.nlog('data Huy', res)
        if (res.status == 1 && res.data != null && res.data.length > 0) {
            this.pageAll = res.page.AllPage;
            this.setState({
                dataHuy: res.data,
                refreshing: false,
                page: res.page.Page,
                isLoading: false,
            })
        } else if (res.status == 1) {
            this.setState({
                dataHuy: [],
                refreshing: false,
                page: 0,
                isLoading: false,
            })
        } else {

        }
    }

    _renderItem = ({ item, index }) => {
        var {
            IdPA,
        } = item

        return (
            <ItemDanhSach
                NameNGY='NguoiGY'
                ThoiGian='ThoiGian'
                item={item}
                nthis={this}
                goscreen={() => Utils.goscreen(this, 'sc_ChiTietHuy',
                    { IdPA: IdPA, DesignDefault: "15", callback: () => { ROOTGlobal.loadDSPHuyDH(), Utils.goscreen(this, 'scDanhSachHuy') } })}
            />
        )
    };

    _ItemSeparatorComponent() {
        return <View style={{ height: 0.7, backgroundColor: colors.black_16 }} />
    }

    _onRefresh = () => {
        // ////Utils.nlog("vao on refesh")
        this.setState({ refreshing: true, textempty: 'Đang tải...' }, this._getListHuy)
        // this.setState({ refreshing: true, page: 0, textempty: 'Đang tải...' }, () => this._getData(this.state.hocSinhData.IDKhachHang));
    }

    _ListFooterComponent = () => {
        if (this.state.page < this.pageAll && this.state.dataHuy.length > 0)
            return <ActivityIndicator size='small' style={{ marginTop: 10 }} />;
        else return null
    }

    loadMore = async () => {
        const { page } = this.state;
        const pageNumber = page + 1;
        if (page < this.pageAll) {
            let res = await apis.NguonPhanAnh.GetList_DanhSachPhanAnhHuy(pageNumber, false, 10, this.state.keySearch);
            if (res.status == 1 && res.data != null && res.data.length) {
                const dataPA = [...this.state.dataHuy, ...res.data];
                this.setState({ dataHuy: dataPA, page: pageNumber });
            };
        };
    };

    _keyExtrac = (item, index) => index.toString();

    _oncChangeText = async (text) => {
        let res = await apis.NguonPhanAnh.GetList_DanhSachPhanAnhHuy(1, false, 10, text);
        if (res.status == 1 && res.data) {
            this.pageAll = res.page.AllPage;
            this.setState({ dataHuy: res.data, keySearch: text, page: res.page.Page })
        }
    }

    _enLoading = () => {
        this.setState({ isLoading: !this.state.isLoading })
    }
    render() {
        var { dataHuy, textempty, refreshing, isLoading } = this.state
        return (
            <View style={nstyles.ncontainer}>
                <HeaderCom
                    titleText='Danh sách hủy'
                    iconLeft={Images.icSlideMenu}
                    iconRight={null}
                    onPressLeft={this._openMenu}
                />
                <View style={[nstyles.nbody, { paddingHorizontal: 10 }]}>
                    <TextInputCom
                        cusViewContainer={{ justifyContent: 'center', alignItems: 'center', marginTop: 10 }}
                        iconRight={Images.icSearchGrey}
                        placeholder={'Tìm kiếm'}
                        onChangeText={this._oncChangeText}
                    />
                    {/* {Hiển thị danh sách hủy} */}
                    <FlatList
                        style={{ flex: 1, marginTop: 10 }}
                        data={dataHuy}
                        renderItem={this._renderItem}
                        keyExtractor={this._keyExtrac}
                        ListEmptyComponent={<ListEmpty textempty={textempty} />}
                        ItemSeparatorComponent={this._ItemSeparatorComponent}
                        refreshing={refreshing}
                        onRefresh={this._onRefresh}
                        onEndReachedThreshold={0.3}
                        onEndReached={this.loadMore}
                        ListFooterComponent={this._ListFooterComponent}
                    />
                    {
                        isLoading == true ? <ModalLoading /> : null
                    }
                </View>
            </View>
        )
    }
}

export default DSHuy
