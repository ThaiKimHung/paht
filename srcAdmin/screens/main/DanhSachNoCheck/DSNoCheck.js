import apis from "../../../apis";
import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, Platform } from 'react-native';
import { sizes } from "../../../../styles/size";
import { nstyles, colors } from "../../../../styles";
import { Images } from "../../../images";
import { ListEmpty, HeaderCom, TextInputCom } from "../../../../components";
import Utils from "../../../../app/Utils";
import { ItemDanhSach } from "../../PhanAnhHienTruong";
import ButtonCus from "../../../../components/ComponentApps/ButtonCus";
import { ROOTGlobal } from "../../../../app/data/dataGlobal";
import { nGlobalKeys } from "../../../../app/keys/globalKey";
import { ConfigScreenDH } from "../../../routers/screen";

class DSNoCheck extends Component {
    constructor(props) {
        super(props);
        this.pageAll = 0;
        this.state = {
            data: [],
            textempty: 'Đang tải...',
            refreshing: true,
            page: 0,
            size: 10,
        };
        ROOTGlobal[nGlobalKeys.loadDSPAMoRongDH] = this._getListNoCheck
    }

    componentDidMount() {
        this._getListNoCheck();
    }

    goback = () => {
        Utils.goback(this)
    }
    _getListNoCheck = async () => {
        const res = await apis.Auto.DanhSachPANoChecker();
        Utils.nlog("gia tri ds nocheck XXXXXX:", res);
        if (res.status == 1 && res.data) {
            if (res.page) {
                this.pageAll = res.page.AllPage;
            }
            this.setState({ data: res.data, refreshing: false, page: res.page ? res.page.Page : 0, textempty: 'Không có dữ liệu' })
        } else {
            this.pageAll = 0
            this.setState({ refreshing: false, data: [], textempty: 'Không có dữ liệu', page: 0 })
        }
    }

    _ListFooterComponent = () => {
        if (this.state.page < this.pageAll)
            return <ActivityIndicator size='small' style={{ marginTop: 10 }} />;
        else return null
    }
    loadMore = async () => {
        const { page, size, val } = this.state;
        Utils.nlog('page', page)
        const pageNumber = page + 1;
        if (page < this.pageAll) {
            let res = await apis.Auto.DanhSachPANoChecker(pageNumber, size, val);
            Utils.nlog('data list canh bao 2', res)
            if (res.status == 1 && res.data) {
                if (res.page) {
                    this.pageAll = res.page.AllPage;
                }
                const data = [...this.state.data, ...res.data];
                this.setState({ data, page: pageNumber, });
            };
        };
    };
    _callbackThis = (nthis) => {
        Utils.goscreen(nthis, "scHomePAMR");
    }
    _CheckersByStep = async (item) => {

        //CheckersByStep
        const res = await apis.ApiNoCheck.CheckersByStep(item.IdPA, item.IdStep);
        Utils.nlog("gia tri bystep", res)
        if (res.status == 1 && res.data && res.data[0].AllowAddUser == true) {
            Utils.goscreen(this, ConfigScreenDH.Modal_ThemNguoiDuyet,
                { data: item, callback: this._onRefresh, dataStep: res.data })
        } else {
            Utils.showMsgBoxOK(this, "Thông báo", "Quy trình đã kết thúc", "Xác nhận");
        }
    }
    _goScreenThaoTac = async (item) => {
        this._CheckersByStep(item);
        // let res = await apis.Auto.ChiTietPhanAnh(item.IdPA);
        // Utils.nlog("gia tỉ get api cảnh ábo chi tiết", res);
        // if (res.status == 1 && res.data) {
        //     if (res.data.processError == true) {
        //         // Utils.nlog("dây là erorr");
        //         Utils.showMsgBoxOK(this, "Thông báo", "Quy trình đã kết thúc", "Xác nhận");
        //     } else {
        //         //chon nguoi xu ly
        //         Utils.goscreen(this, 'Modal_ThemNguoiDuyet',
        //             { data: item, callback: this._onRefresh })
        //     }
        // } else {
        //     Utils.showMsgBoxOK(this, "Thông báo", "Có lỗi trong quá trình xử lý", "Xác nhận");
        // }

    }
    _renderItem = ({ item, index }) => {
        var {
            IdPA,
        } = item
        return (
            <View style={{ backgroundColor: colors.white, borderRadius: 5 }}>
                <ItemDanhSach
                    isNoCheck={true}
                    item={item}
                    nthis={this}
                    goscreen={() => Utils.goscreen(this, 'sc_ChiTietPhanAnh', {
                        IdPA: IdPA, callback: this._callbackThis,
                        DesignDefault: "0"
                    })}
                />
                {
                    <TouchableOpacity
                        onPress={() => this._goScreenThaoTac(item)}
                        style={{
                            alignSelf: 'flex-start', paddingHorizontal: 20,
                            paddingBottom: 5, flexDirection: 'row', justifyContent: 'center',
                            alignItems: 'center', marginTop: 10,
                            // borderWidth: 1, borderStyle: 'dashed'
                        }}>
                        <Image source={Images.icEditCB} style={[nstyles.nstyles.nIcon26,
                        { tintColor: colors.softBlue }]} resizeMode="contain" />
                        <Text style={{ paddingHorizontal: 10 }}>{'Thêm người xử lý'}</Text>
                    </TouchableOpacity>
                }
            </View>

        )
    };
    _keyExtrac = (item, index) => index.toString();
    _onRefresh = () => {
        this.setState({ refreshing: true, textempty: 'Đang tải...' }, this._getListNoCheck)
    }
    _ListHeaderComponent = () => {
        return (
            <View>

            </View>)
    }
    _oncChangeText = async (text) => {
        let res = await apis.Auto.DanhSachPANoChecker(1, 10, text);
        Utils.nlog("fixx onhanange test ", res)
        if (res.status == 1 && res.data) {
            if (res.page) {
                this.pageAll = res.page.AllPage;
                this.setState({ data: res.data, page: res.page ? res.page.Page : 0, val: text })
            } else {
                this.pageAll = 0
                this.setState({ data: [], page: 0, val: text })
            }
        } else {
            this.pageAll = 0
            this.setState({ data: [], page: 0, val: text })
        }
    }
    _openMenu = () => {
        this.props.navigation.openDrawer();
    }
    _ItemSeparatorComponent() {
        return <View style={{ height: 5, backgroundColor: 'transparent' }} />
    }

    render() {
        return (
            <View style={nstyles.nstyles.ncontainer}>
                <View
                    style={[nstyles.nstyles.nbody,]}>
                    <HeaderCom
                        titleText='Phản ánh mở rộng'
                        iconLeft={Images.icSlideMenu}
                        nthis={this}
                        onPressLeft={this._openMenu}
                        hiddenIconRight={true}
                    />
                    <TextInputCom
                        cusViewContainer={{ justifyContent: 'center', alignItems: 'center', marginTop: 10, marginHorizontal: 10 }}
                        iconRight={Images.icSearchGrey}
                        placeholder={'Tìm kiếm'}
                        onChangeText={this._oncChangeText}
                    />
                    <FlatList
                        style={{ flex: 1, marginTop: 10, marginHorizontal: 10 }}
                        // scrollEventThrottle={10}
                        onScroll={this.handleScroll}
                        showsVerticalScrollIndicator={false}
                        renderItem={this._renderItem}
                        data={this.state.data}
                        ListEmptyComponent={<ListEmpty textempty={this.state.textempty} />}
                        ItemSeparatorComponent={this._ItemSeparatorComponent}
                        // ListHeaderComponent={this._ListHeaderComponent}
                        keyExtractor={this._keyExtrac}
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                        onEndReached={this.loadMore}
                        onEndReachedThreshold={0.3}
                        ListFooterComponent={this._ListFooterComponent}
                    />
                </View>
            </View>
        );
    }
}

export default DSNoCheck
