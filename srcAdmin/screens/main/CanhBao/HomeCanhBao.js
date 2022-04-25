import apis from "../../../apis";
import React, { Component, Fragment } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, Platform } from 'react-native';
import { sizes } from "../../../../styles/size";
import { nstyles, colors } from "../../../../styles";
import { Images } from "../../../images";
import { ListEmpty, HeaderCom, TextInputCom, WebViewCus } from "../../../../components";
import Utils from "../../../../app/Utils";
import { ItemDanhSach } from "../../PhanAnhHienTruong";
import ModalDrop from "../../PhanAnhHienTruong/components/ModalDrop";
import moment from "moment";
import ButtonCus from "../../../../components/ComponentApps/ButtonCus";
import { Width } from "../../../../styles/styles";
import HtmlViewCom from "../../../../components/HtmlView";
import { appConfig } from "../../../../app/Config";

const arrThaoTac = [{
    name: 'Chờ duyệt',
    id: false,
}, {
    name: 'Đã duyệt',
    id: true,
}]
class HomeCanhBao extends Component {
    constructor(props) {
        super(props);
        this.pageAll = 0;
        this.state = {
            data: [],
            textempty: 'Đang tải...',
            refreshing: true,
            objThaoTac: arrThaoTac[0],
            page: 0,
            size: 10,
            isHetHan: false,
            val: ''

        };
    }
    goback = () => {
        Utils.goback(this)
    }
    _getListNoCheck = async () => {
        let vals = `${this.state.val}|${this.state.isHetHan}|${this.state.objThaoTac.id}`
        const res = await apis.ApiCanhBao.GetList_CanhBao(1, 10, vals);
        Utils.nlog("gia tri ds  cảnh báo nocheck", res);
        if (res.status == 1 && res.data) {
            if (res.page) {
                this.pageAll = res.page.AllPage;
            }
            this.setState({ data: res.data, refreshing: false, page: res.page ? res.page.Page : 0 })
        } else {
            this.setState({ refreshing: false, data: [], textempty: 'Không có dữ liệu...' })
        }
    }
    _ListFooterComponent = () => {
        if (this.state.page < this.pageAll)
            return <ActivityIndicator size='small' style={{ marginTop: 10 }} />;
        else return null
    }
    loadMore = async () => {

        const { page, size } = this.state;
        Utils.nlog("vao laod more", page, size, this.pageAll)
        let vals = `${this.state.val}|${this.state.isHetHan}|${this.state.objThaoTac.id}`
        Utils.nlog('page', page)
        const pageNumber = page + 1;
        if (page < this.pageAll) {
            let res = await apis.ApiCanhBao.GetList_CanhBao(pageNumber, size, vals);
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
        Utils.goscreen(nthis, "scHomePAMR")
    }

    _EditCanhBao = (item) => {
        Utils.goscreen(this, "sc_ChiTietCB", {
            data: item,
            isNew: true,
            isEdit: true,
            callback: this._onRefresh
        })
    }
    _EditTuongTacCanhBao = (item) => {
        Utils.goscreen(this, "sc_ChiTietTuongTac", {
            id: item.Id
        })
    }
    //sc_ChiTietTuongTac


    _XoaCanhBao = async (item) => {
        Utils.showMsgBoxYesNo(this, "Thông báo", "Bạn có muốn xoá cảnh báo này không", "Xác nhận", "Thoát", async () => {
            const res = await apis.ApiCanhBao.DeleteCanhBao(item.Id);
            Utils.nlog("giá trị Xoá cảnh báo res", res);
            if (res.status == 1) {
                Utils.showMsgBoxOK(this, "Thông báo", "Xoá cảnh báo thành công", "Xác nhận", this._onReFresh);
                return;
            } else {
                Utils.showMsgBoxOK(this, "Thông báo", res.error ? res.error.message : 'Thực hiện xoá bị lỗi', "Xác nhận");
                return;
            }
        }, () => {
            return;
        })


    }
    _renderItem = ({ item, index }) => {
        var {
            IdPA,
        } = item
        const { nrow } = nstyles.nstyles
        return (
            <View style={{ backgroundColor: colors.white, }}>
                <TouchableOpacity
                    key={index}
                    style={{ backgroundColor: colors.white, paddingVertical: 10, paddingHorizontal: 10 }}
                    onPress={() => Utils.goscreen(this, "sc_ChiTietCB", {
                        data: item, callback: this._onRefresh
                    })}>
                    <View style={nrow}>
                        <Text style={{ fontWeight: 'bold', fontSize: sizes.sText16, flex: 1 }}>
                            {item.TieuDe}
                        </Text>
                    </View>

                    {item.DiaDiem ? <View style={[nrow, { alignItems: 'center', paddingLeft: 10, paddingTop: 2, paddingRight: 2 }]}>
                        <Image source={Images.icLocation} style={[nstyles.nstyles.nIcon14, { tintColor: colors.softBlue }]} resizeMode="contain" />
                        <Text style={[sizes.sText12, { color: colors.colorSoftBlue, marginLeft: 3, flex: 1 }]}>{item.DiaDiem}</Text>
                    </View> : null}
                    <View style={{ height: Platform.OS == 'ios' ? 55 : 62 }}>
                        <HtmlViewCom html={item.NoiDung} style={{ height: 60 }} />
                    </View>
                    <View style={[nstyles.nstyles.nrow, { justifyContent: 'space-between', marginTop: 14 }]}>
                        <Text style={[sizes.sText12, { fontWeight: 'bold', color: colors.peacockBlue, flex: 1 }]}> {`Đơn vị :${item.DonVi}`}</Text>
                        <Text numberOfLines={1} style={[sizes.sText13, { color: item.IsDuyet ? colors.peacockBlue : colors.redStar, fontStyle: 'italic' }]}>{item.IsDuyet ? "Đã duyệt" : 'Chờ duyệt'}</Text>

                    </View>
                    <View style={[nstyles.nstyles.nrow, { justifyContent: 'space-between', alignItems: 'center' }]}>
                        <Text style={[sizes.sText12, { fontStyle: 'italic', flex: 1 }]}>{`${item.TuNgay} - ${item.DenNgay}`}</Text>
                    </View>
                    <View style={[nstyles.nstyles.nrow, { justifyContent: 'space-between', alignItems: 'center' }]}>
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={Images.icShowPass} style={[nstyles.nstyles.nIcon24]} resizeMode="contain"></Image>
                            <Text style={[sizes.sText12, { fontStyle: 'italic', color: colors.peacockBlue }]}>{` Lượt xem: ${item.LuotXemCD}`}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <View style={[nstyles.nstyles.nrow, {
                    justifyContent: 'space-between', alignItems: 'center',
                    borderTopWidth: 0.5, borderColor: colors.peacockBlue
                }]}>
                    {
                        appConfig.IdSource != 'CA' ? <View style={{ flex: 1, marginLeft: 10, }}>
                        </View> : null
                    }
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <TouchableOpacity style={{
                            flex: 1,
                            alignItems: 'center', justifyContent: 'center',
                        }} onPress={() => this._EditCanhBao(item)}>
                            <Image source={Images.icEditCB} style={[nstyles.nstyles.nIcon26,
                            { tintColor: colors.peacockBlue }]} resizeMode="contain" />
                            <Text style={{ fontSize: sizes.sText10, fontWeight: 'bold' }}>Sửa</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => this._XoaCanhBao(item)}
                            style={{
                                flex: 1,
                                marginTop: 5, borderRadius: 2,
                                alignItems: 'center', justifyContent: 'center',
                            }}>
                            <Image source={Images.icDeleteCB} style={[nstyles.nstyles.nIcon24,
                            { tintColor: colors.peacockBlue }]} resizeMode="contain" />
                            <Text style={{ fontSize: sizes.sText10, fontWeight: 'bold' }}>Xoá</Text>

                        </TouchableOpacity>

                    </View>
                    {
                        <View style={{ flex: 1, marginLeft: 10, }}>
                            <TouchableOpacity onPress={() => this._EditTuongTacCanhBao(item)} style={{ paddingVertical: 5, flex: 1, alignItems: 'center', }}>

                                <Image source={Images.icComment}
                                    style={[nstyles.nstyles.nIcon24,
                                    { tintColor: colors.peacockBlue }]} resizeMode="contain" />
                                <Text style={{ fontSize: sizes.sText10, fontWeight: 'bold' }}>Tương tác công dân</Text>
                            </TouchableOpacity>
                        </View>
                    }

                </View>
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
        let vals = `${text}|${this.state.isHetHan}|${this.state.objThaoTac.id}`
        let res = await apis.ApiCanhBao.GetList_CanhBao(1, 10, vals);
        Utils.nlog("fixx onhanange test ", res)
        if (res.status == 1 && res.data) {
            if (res.page) {
                this.pageAll = res.page.AllPage;
            }
            this.setState({ data: res.data, page: res.page ? res.page.Page : 0, refreshing: false })
        } else {
            this.setState({ refreshing: false, data: [] })
        }
    }
    _openMenu = () => {
        this.props.navigation.openDrawer();
    }
    _ItemSeparatorComponent() {
        return <View style={{ height: 1.5, backgroundColor: colors.black_16 }} />
    }
    componentDidMount() {
        this._getListNoCheck();
    }
    _onReFresh = () => {
        this.setState({ refreshing: true }, this._getListNoCheck)
    }
    _HeaderFlastlist = () => {
        const { isHetHan } = this.state
        return (
            <View style={[nstyles.nstyles.nrow, { paddingVertical: 5 }]}>
                <ModalDrop
                    value={this.state.objThaoTac}
                    keyItem={'id'}
                    texttitle={'Chọn thao tác'}
                    styleContent={{ marginRight: 5 }}
                    dropdownTextStyle={{
                        paddingHorizontal: 20, width: '100%',
                        fontSize: 16
                    }}
                    options={arrThaoTac}
                    onselectItem={(item) => this.setState({ objThaoTac: item }, this._onReFresh)}
                    Name={"name"} />

                <TouchableOpacity
                    style={{
                        flex: 1, flexDirection: 'row',
                        alignItems: 'center', justifyContent: 'center', flex: 1, paddingTop: 10
                    }}
                    onPress={() => this.setState({ isHetHan: !this.state.isHetHan }, this._onReFresh)}>
                    <Image source={isHetHan == true ? Images.icCheck : Images.icUnCheck} style={[nstyles.nstyles.nIcon20, { tintColor: colors.peacockBlue, marginRight: 5 }]} resizeMode='contain' />
                    <Text style={{ marginRight: 15, fontSize: sizes.sText14 }}>{'Hết hạn'}</Text>
                </TouchableOpacity>
            </View>
        )
    }
    render() {
        return (
            <View style={nstyles.nstyles.ncontainer}>
                <View
                    style={[nstyles.nstyles.nbody,]}>
                    <HeaderCom
                        titleText='Cảnh báo'
                        iconLeft={Images.icSlideMenu}
                        nthis={this}
                        iconRight={Images.icNewCB}
                        onPressLeft={this._openMenu}
                        onPressRight={() => Utils.goscreen(this, "sc_ChiTietCB", { isNew: true, callback: this._onRefresh })}
                    // hiddenIconRight={true}
                    />

                    <TextInputCom
                        cusViewContainer={{ justifyContent: 'center', alignItems: 'center', marginTop: 10, marginHorizontal: 20 }}
                        iconRight={Images.icSearchGrey}
                        placeholder={'Tìm kiếm'}
                        value={this.state.val}
                        onChangeText={(text) => this.setState({ val: text }, () => this._oncChangeText(text))}
                    />
                    <FlatList
                        style={{ flex: 1, marginHorizontal: 20 }}
                        // scrollEventThrottle={10}
                        onScroll={this.handleScroll}
                        showsVerticalScrollIndicator={false}
                        renderItem={this._renderItem}
                        data={this.state.data}
                        ListEmptyComponent={<ListEmpty textempty={this.state.textempty} />}
                        ItemSeparatorComponent={this._ItemSeparatorComponent}
                        ListHeaderComponent={this._HeaderFlastlist}
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

export default HomeCanhBao
