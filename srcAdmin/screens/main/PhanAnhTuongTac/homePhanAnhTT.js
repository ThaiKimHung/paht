import apis from "../../../apis";
import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, Platform } from 'react-native';
import { nstyles, colors } from "../../../../styles";
import { Images } from "../../../images";
import { ListEmpty, HeaderCom, TextInputCom, WebViewCus } from "../../../../components";
import Utils from "../../../../app/Utils";
import { ItemDanhSach } from "../../PhanAnhHienTruong";
import styles from "../../PhanAnhHienTruong/styles";
import { sizes, reText } from "../../../../styles/size";
import { ROOTGlobal } from "../../../../app/data/dataGlobal";
import HtmlViewCom from "../../../../components/HtmlView";
import { nGlobalKeys } from "../../../../app/keys/globalKey";
import AppCodeConfig from "../../../../app/AppCodeConfig";

const dataStatus = [
    { Id: -100, Status: 'Tất cả' },
    { Id: -3, Status: 'Phản ánh chưa phản hồi tương tác' },
    { Id: -4, Status: 'Phản ánh cần duyệt tương tác' }
]

class homePhanAnhTT extends Component {
    constructor(props) {
        super(props);
        this.pageAll = 0;
        this.isTuongTacCoDuyet = Utils.getGlobal(nGlobalKeys.TuongTacCoDuyet, false, AppCodeConfig.APP_ADMIN);
        this.SelectDropdown = Utils.ngetParam(this, 'ID', '')
        this.state = {
            data: [],
            textempty: 'Đang tải...',
            refreshing: true,
            page: 0,
            size: 10,
            tinhtrang: this.SelectDropdown != '' ? dataStatus.find(e => e.Id == this.SelectDropdown) : { Id: -100, Status: 'Tất cả' },
            dataTinhTrang: dataStatus,
            total: 0

        };
        ROOTGlobal[nGlobalKeys.PhanAnhTuongTacDH].refesh = this._onRefresh;
    }
    goback = () => {
        Utils.goback(this)
    }
    _getListNoCheck = async () => {
        const { page, size, val, tinhtrang } = this.state;
        const res = await apis.TuongTac.DanhSachPhanAnhGY_tt(false, 1, size, val, tinhtrang.Id);
        Utils.nlog("gia tri ds phan anh có tương tác", res);
        if (res.status == 1 && res.data) {
            if (res.page) {
                this.pageAll = res.page.AllPage;
            }
            this.setState({ data: res.data, refreshing: false, page: res.page ? res.page.Page : 0, total: res.page ? res.page.Total : 0 })
        } else {
            this.setState({ refreshing: false, data: [], textempty: 'Không có dữ liệu...', total: 0 })
        }
    }

    _ListFooterComponent = () => {
        if (this.state.page < this.pageAll)
            return <ActivityIndicator size='small' style={{ marginTop: 10 }} />;
        else return null
    }
    loadMore = async () => {
        const { page, size, val, tinhtrang } = this.state;
        Utils.nlog('page', page)
        const pageNumber = page + 1;
        if (page < this.pageAll) {
            let res = await apis.TuongTac.DanhSachPhanAnhGY_tt(false, pageNumber, size, val, tinhtrang.Id);
            Utils.nlog('data list DSTuongTac:', res)
            if (res.status == 1 && res.data) {
                if (res.page) {
                    this.pageAll = res.page.AllPage;
                }
                const data = [...this.state.data, ...res.data];
                this.setState({ data, page: pageNumber, total: res.page ? res.page.Total : 0 });
            };
        };
    };
    _callbackThis = (nthis) => {

        Utils.goback(nthis);
        Utils.goscreen(nthis, "scPAtuongtac")

    }
    _renderItem = ({ item, index }) => {
        var {
            IdPA,
        } = item
        const { nrow } = nstyles.nstyles
        let slDaDuyet = item.SoluongTTDaDuyet ? item.SoluongTTDaDuyet : 0;
        let slChuaDuyet = item.SoluongTTChuaDuyet ? item.SoluongTTChuaDuyet : 0;
        let slTongTT = item.SoluongTT ? item.SoluongTT : 0;
        if (this.isTuongTacCoDuyet) {
            slDaDuyet = slDaDuyet + slChuaDuyet;
            slChuaDuyet = slTongTT - slDaDuyet;
        }
        const CheckColor = () => {
            if (slChuaDuyet == 0 && slDaDuyet > 0) {
                return colors.greenFE
            } else if (slChuaDuyet > 0) {
                return colors.redStar
            } else {
                return colors.colorGrayText
            }
        }
        Utils.nlog('Gia tri checkColor', CheckColor())
        return (
            <TouchableOpacity key={index}
                style={{ backgroundColor: colors.white, paddingVertical: 10, paddingHorizontal: 10 }}
                onPress={() => Utils.goscreen(this, 'sc_ChiTietPhanAnh', { IdPA: IdPA, callback: this._callbackThis, isTuongTac: true })}
            >
                <Text style={{ fontWeight: 'bold', fontSize: sizes.sText16 }}>{item.TieuDe}</Text>
                {item.DiaDiem ? <View style={[nrow, { alignItems: 'center', paddingLeft: 10, paddingTop: 2, paddingRight: 2 }]}>
                    <Image source={Images.icLocation} style={[nstyles.nstyles.nIcon14, { tintColor: colors.softBlue }]} resizeMode="contain" />
                    <Text style={[styles.txt12, { color: colors.colorSoftBlue, marginLeft: 3, flex: 1 }]}>{item.DiaDiem}</Text>
                </View> : null}
                {/* <View style={{ height: Platform.OS == 'ios' ? 55 : 62 }}>
                    <WebViewCus
                        style={{ marginLeft: -3 }}
                        scrollEnabled={false}
                        source={{ html: item.NoiDung }}
                        fontSize={sizes.sText28}
                    />
        
                </View> */}
                <View style={{}}>
                    <HtmlViewCom html={item.NoiDung} style={{ height: 60 }} />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flexDirection: "row", alignItems: 'center' }}>
                        <Image source={Images.icChat} style={[nstyles.nstyles.nIcon20, { tintColor: colors.colorGrayIcon }]} />
                        <Text style={{ fontSize: reText(12), color: CheckColor() }} >{` Đã/chưa duyệt: `}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: reText(12), color: CheckColor(), fontWeight: 'bold' }}>{`${slDaDuyet}/${slChuaDuyet}`}</Text>
                    </View>
                </View>
                <View style={[nrow, { justifyContent: 'space-between', marginTop: 14 }]}>
                    <View style={[nrow, { alignItems: 'center', justifyContent: 'center' }]}>
                        <Text style={[styles.txt12, { fontWeight: 'bold', color: colors.peacockBlue }]}>{item.MaPhanAnh}</Text>
                        {
                            item.Is3C == true ? <Text style={[styles.txt12, {
                                fontWeight: 'bold', color: colors.white, borderRadius: 5, borderColor: colors.white,
                                backgroundColor: colors.orange, paddingHorizontal: 5, borderWidth: 1, textAlign: 'center'
                            }]}>3C</Text> : null
                        }
                        {
                            item.IsZalo == true ? <View>
                                <Text style={[styles.txt12, {
                                    fontWeight: 'bold', color: colors.white, borderRadius: 5, borderColor: colors.white,
                                    backgroundColor: colors.blueZalo, paddingHorizontal: 5, borderWidth: 1,
                                }]}>{`zalo`}</Text>
                            </View> : null
                        }
                    </View>
                    <Text style={[styles.txt12, { fontStyle: 'italic' }]}>{item.Cast_CreateDate ? item.Cast_CreateDate : ''}</Text>
                </View>

            </TouchableOpacity>
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
        const { tinhtrang } = this.state;
        let res = await apis.TuongTac.DanhSachPhanAnhGY_tt(false, 1, 10, text, tinhtrang.Id);// DanhSachPANoChecker(1, 10, text);
        Utils.nlog("fixx onhanange test ", res)
        if (res.status == 1 && res.data) {
            if (res.page) {
                this.pageAll = res.page.AllPage;
            }

            this.setState({ data: res.data, page: res.page ? res.page.Page : 0, val: text, total: res.page ? res.page.Total : 0 })
        }
    }
    _openMenu = () => {
        this.props.navigation.openDrawer();
    }
    _ItemSeparatorComponent() {
        return <View style={{ height: 5, backgroundColor: 'transparent' }} />
    }
    componentDidMount() {
        this._getListNoCheck();
    }

    _DropDown = () => {
        //Show modal chọn tình trạng 
        Utils.goscreen(this, 'Modal_FilterTT', { callback: this._callback, item: this.state.tinhtrang, AllThaoTac: this.state.dataTinhTrang })
    }

    _callback = (val) => {
        this.pageAll = 0
        this.setState({ refreshing: true, tinhtrang: val, data: [], textempty: 'Đang tải...', page: 0, size: 10, total: 0 }, this._getListNoCheck)
    }

    render() {
        const { tinhtrang, total } = this.state
        return (
            <View style={nstyles.nstyles.ncontainer}>
                <View
                    style={[nstyles.nstyles.nbody,]}>
                    <HeaderCom
                        titleText='Phản ánh có tương tác'
                        iconLeft={Images.icSlideMenu}
                        nthis={this}
                        onPressLeft={this._openMenu}
                        hiddenIconRight={true}
                    />
                    <View style={{ paddingHorizontal: 10, paddingTop: 10 }}>
                        <View style={[nstyles.nstyles.nrow, nstyles.nstyles.shadow]}>
                            {/* {Phản ánh tung tham gia và của đơn vị} */}
                            <TouchableOpacity
                                onPress={this._DropDown}
                                style={{ flex: 1, padding: 10, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', }}>
                                <Text style={{ fontSize: reText(14) }}>{tinhtrang.Status}</Text>
                                <Image source={Images.icDropDown} style={[nstyles.nIcon15, { tintColor: 'gray' }]} resizeMode='contain' />
                            </TouchableOpacity>
                            <View
                                style={{ padding: 10, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', marginLeft: 5 }}>
                                <Text style={{ fontSize: reText(14) }}>{'Tổng: '}<Text style={{ fontWeight: 'bold', color: colors.orangeFive }}>{total}</Text></Text>
                            </View>
                        </View>
                    </View>
                    <TextInputCom
                        cusViewContainer={[nstyles.nstyles.shadow, { justifyContent: 'center', alignItems: 'center', marginTop: 10, marginHorizontal: 10, backgroundColor: 'white' }]}
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
                        ListEmptyComponent={<ListEmpty textempty={this.state.textempty} isImage={!this.state.refreshing} />}
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

export default homePhanAnhTT
