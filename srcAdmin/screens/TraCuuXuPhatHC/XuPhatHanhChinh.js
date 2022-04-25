import React, { Component } from 'react'
import { Text, View, Image, TouchableOpacity, FlatList, ActivityIndicator, ImageBackground } from 'react-native'
import { paddingTopMul, nstyles, Width, Height } from '../../../styles/styles'
import Utils from '../../../app/Utils'
import { Images } from '../../images'
import { reText } from '../../../styles/size'
import { colors } from '../../../styles'
import Moment from 'moment'
import InputRNCom from '../../../components/ComponentApps/InputRNCom'
import apis from '../../apis'
import { isIphoneX } from 'react-native-iphone-x-helper'
import { IsLoading, ListEmpty, HeaderCom } from '../../../components'
import { appConfig } from '../../../app/Config'
import { ConfigScreenDH } from '../../routers/screen'

const objectFilter = {
    "sortOrder": "desc",
    "sortField": "CreatedDate",
    "page": 1,
    "record": 10,
    "OrderBy": "CreatedDate",
    // "filter.keys": "tungay|denngay",
    // // "filter.vals": `${Moment(new Date()).add(-15, 'day').format('DD-MM-YYYY')}|${Moment(new Date()).format('DD-MM-YYYY')}|123454543 - 15`
    // "filter.vals": `19-06-2020|${Moment(new Date()).format('DD-MM-YYYY')}`
}

export class XuPhatHanhChinh extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keysearch: '',
            refreshing: true,
            objectPage: { "Page": 0 },
            dataTraCuu: [],

            //--
            listLinhVuc: [],
            selectLinhVuc: { "IdLinhVuc": '', "LinhVuc": "Tất cả" },
            //--
            listToChucThiHanh: [],
            selectToChucThiHanh: { "MaPX": '', "TenPhuongXa": "Tất cả" },
            //--
            selectedTrangThai: -1,
            selectedTreHan: -1,
            // dateFrom: Moment(new Date()).add(-15, 'day').format('DD/MM/YYYY'),
            // dateTo: Moment(new Date()).format('DD/MM/YYYY'),
            dateFrom: '',
            dateTo: '',

        }
        // this.handleInputThrottled = debounce(this.handleInput, 500)
    }
    componentDidMount() {
        this.getLinhVuc();
        // this.getToChucThiHanh()
        this.getData();
    }
    getLinhVuc = async () => {
        //Lĩnh vực
        const res = await apis.ApiXuLyHanhChinh.GetList_LinhVuc_New();
        // Utils.nlog("Gia tri linh vuc<><>", res)
        if (res.status == 1) {
            this.setState({ listLinhVuc: [{ "IdLinhVuc": '', "LinhVuc": "Tất cả" }].concat(...res.data) })
        }
        else {
            this.setState({ listLinhVuc: [] })
        }
    }
    // getToChucThiHanh = async () => {
    //     //Tổ chức thi hành
    //     const res = await apis.ApiXuLyHanhChinh.GetList_DonVi();
    //     Utils.nlog("Gia tri getToChucThiHanh<><>", res)
    //     if (res.status == 1) {
    //         this.setState({ listToChucThiHanh: [{ "MaPX": '', "TenPhuongXa": "Tất cả" }].concat(...res.data) })
    //     }
    //     else {
    //         this.setState({ listToChucThiHanh: [] })
    //     }
    // }

    getData = async () => {
        const { keysearch, selectLinhVuc, selectToChucThiHanh, selectedTrangThai, selectedTreHan, dateFrom, dateTo } = this.state;
        let body = {
            ...objectFilter,
            "filter.keys": "tungay|denngay|keyword|LinhVucs|CQThiHanhs|Status|TreHan",
            "filter.vals": `${dateFrom == '' ? '' : Moment(dateFrom, 'DD-MM-YYYY').format('DD-MM-YYYY')}|${dateTo == '' ? '' : Moment(dateTo, 'DD-MM-YYYY').format('DD-MM-YYYY')}|${keysearch}|${selectLinhVuc.IdLinhVuc}|${selectToChucThiHanh.MaPX}|${selectedTrangThai == -1 ? '' : selectedTrangThai}|${selectedTreHan == -1 ? '' : selectedTreHan}`
        }
        Utils.nlog("Log------body", body)
        // nthisIsLoading.show();
        const res = await apis.ApiXuLyHanhChinh.GetList_HanhChinh_New(body);
        Utils.nlog("Dữ liệu dataa <><>1", res)
        if (res.status == 1) {
            // nthisIsLoading.hide();
            this.setState({ dataTraCuu: res.data, refreshing: false, objectPage: res.page })
        }
        else {
            // nthisIsLoading.hide();
            this.setState({ dataTraCuu: [], refreshing: false, objectPage: { "Page": 0 } })
        }
    }
    callBackFilter = (dateFrom, dateTo, selectLinhVuc, selectToChucThiHanh, selectedTrangThai, selectedTreHan,) => {
        Utils.nlog("Dữ liệu selectedTreHan:", selectedTreHan)
        this.setState({
            dateFrom,
            dateTo,
            selectLinhVuc,
            selectToChucThiHanh,
            selectedTrangThai,
            selectedTreHan
            // objectFilter: { Page: 0 }
        }, this.getData)
    }

    goScreenFilter = (e) => {
        const {
            listLinhVuc,
            selectLinhVuc,
            listToChucThiHanh,
            selectToChucThiHanh,
            dateFrom,
            dateTo,
            keysearch,
        } = this.state;
        if (keysearch == '') {
            Utils.showMsgBoxOK(this, "Thông báo", "Vui lòng nhập từ khóa để tìm kiếm là CMND, Số điện thoại hoặc Mã đơn!", 'Xác nhận');
            return;
        }
        else {
            Utils.goscreen(this, ConfigScreenDH.Modal_SearchFilter_TraCuu, {
                "event": e.nativeEvent,
                dataLinhVuc: listLinhVuc,
                selectLinhVuc: selectLinhVuc,
                dataToChucThiHanh: listToChucThiHanh,
                selectToChucThiHanh: selectToChucThiHanh,
                datefrom: dateFrom,
                dateTo: dateTo,
                callback: this.callBackFilter
            })
        }
        // Utils.goscreen(this, 'Modal_SearchFilterDH')
    }
    _renderItem = ({ item, index }) => {
        Utils.nlog("item<>", item)
        return (
            <TouchableOpacity key={index} style={{ flexDirection: 'row', backgroundColor: colors.white, minHeight: Width(27), marginTop: 5, borderRadius: 5, paddingHorizontal: 5 }}
                onPress={() => Utils.goscreen(this, 'ModalChitietXuPhat', { IdXuPhat: item.ID })}
            >
                {item.ListFileDinhKem.length >= 1 ?
                    <Image source={{ uri: appConfig.domain + item.ListFileDinhKem[0].Link }} style={{ width: Width(25), height: Width(25), marginTop: Width(1), borderRadius: 5 }} /> :
                    <Image source={Images.defaultHoSo} style={{ width: Width(25), height: Width(25), marginTop: Width(1), borderRadius: 5, tintColor: colors.black_20, alignSelf: 'center' }} />}
                <View style={{ marginTop: 5, marginHorizontal: 5, width: Width(68), }}>
                    <Text style={{ fontSize: reText(13), color: colors.black_80 }}>Mã số: {item.MaDon}</Text>
                    <View style={{ flexDirection: 'row', marginTop: 3 }}>
                        <Image source={item.CaNhan ? Images.icNguoi : Images.icCongTy} style={{ width: 15, height: 15, tintColor: item.CaNhan ? colors.peacockBlue : colors.orangeFive, marginRight: 5 }} />
                        <Text style={{ fontSize: reText(14), fontWeight: 'bold', color: colors.peacockBlue }}>{item.CaNhan ? item.ToChucViPham : item.TenCongTy}</Text>
                    </View>
                    <Text style={{ fontSize: reText(12), color: colors.ViewTopArea, fontWeight: 'bold' }} numberOfLines={1}>{item.TenLinhVuc ? item.TenLinhVuc : '---'}</Text>
                    <Text numberOfLines={2} style={{ fontSize: reText(12), color: colors.black_80, }}>Hành vi: {item.HanhVi}
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, marginBottom: 5 }}>
                        <View style={{ backgroundColor: item.Status == 2 ? colors.greenFE : item.Status == 1 ? colors.colorBlueLight : colors.peacockBlue, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 3 }}>
                            <Text style={{ fontSize: reText(12), color: colors.white, fontWeight: 'bold' }}>{item.TenTrangThai}</Text>
                        </View>
                        {item.TreHen == 1 && item.Status == 1 ? <View style={{ backgroundColor: colors.coral, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 3, marginRight: 5 }}>
                            <Text style={{ fontSize: reText(12), color: colors.white, fontWeight: 'bold' }}> Trễ hạn</Text>
                        </View> : <View></View>}
                    </View>
                    {/* {item.NgayHieuLuc != '' ? < Text style={{ fontSize: reText(12), color: colors.black_50, marginTop: 5 }}>Ngày hiệu lực: {item.NgayHieuLuc}</Text> : null} */}
                    {/* {item.NgayThucThi != '' ? < Text style={{ fontSize: reText(12), color: colors.black_50, marginTop: 5 }}>Thời gian thực thi: {item.NgayThucThi}</Text> : null} */}
                </View>
            </TouchableOpacity >
        )
    }
    _onRefresh = () => {
        this.setState({ refreshing: true, objectFilter: { Page: 0 } },
            () => this.getData());
    }

    loadMore = async () => {
        const { objectPage, keysearch, selectLinhVuc, selectToChucThiHanh, selectedTrangThai, selectedTreHan, dateFrom, dateTo } = this.state;
        if (objectPage.Page < objectPage.AllPage) {
            let body = {
                ...objectFilter,
                "page": objectPage?.Page + 1,
                //chưa xong chổ này
                "filter.keys": "tungay|denngay|keyword|LinhVucs|CQThiHanhs|Status|TreHan",
                "filter.vals": `${dateFrom == '' ? '' : Moment(dateFrom, 'DD-MM-YYYY').format('DD-MM-YYYY')}|${dateTo == '' ? '' : Moment(dateTo, 'DD-MM-YYYY').format('DD-MM-YYYY')}|${keysearch}|${selectLinhVuc.IdLinhVuc}|${selectToChucThiHanh.MaPX}|${selectedTrangThai == -1 ? '' : selectedTrangThai}|${selectedTreHan == -1 ? '' : selectedTreHan}`
            }
            let res = await apis.ApiXuLyHanhChinh.GetList_HanhChinh_New(body);
            if (res.status == 1) {
                if (objectPage.Page != res.page.Page) {
                    let data = [...this.state.dataTraCuu, ...res.data]
                    this.setState({ dataTraCuu: data, objectPage: res.page });
                }
            } else {
                this.setState({ dataTraCuu: [], objectPage: { "Page": 0 } });
            }
        };
    };

    _ListFooterComponent = () => {
        const { objectPage } = this.state;
        if (objectPage.Page < objectPage.AllPage)
            return <ActivityIndicator size='small' style={{ marginTop: 10 }} />;
        else return null
    }
    _Search = () => {
        if (this.state.keysearch == '') {
            Utils.showMsgBoxOK(this, "Thông báo", "Vui lòng nhập từ khóa để tìm kiếm là CMND, Số điện thoại hoặc Mã đơn!", 'Xác nhận');
            return;
        }
        else {
            this.setState({ objectPage: { Page: 0 } }, this.getData)
        }
    }

    _openMenu = () => {
        this.props.navigation.openDrawer();
    }

    render() {
        const { dataTraCuu, keysearch } = this.state;
        Utils.nlog("dayform,dayto:", this.state.dateFrom, this.state.dateTo)
        return (
            <View style={nstyles.ncontainer}>
                {/* < View style={[nstyles.nrow, { alignItems: 'center', paddingHorizontal: 10, marginBottom: 8, marginTop: 10, }]} > */}

                <HeaderCom
                    nthis={this}
                    titleText={'Tra Cứu XPHC'}
                    iconLeft={Images.icSlideMenu}
                    iconRight={null}
                    onPressLeft={this._openMenu}
                // onPressRight={() => Utils.goscreen(this, 'FormTaoTaiKhoanDH')}
                />
                {/* // ----------------nội dung */}
                <ImageBackground source={Images.trongdong} style={{ flex: 1 }} opacity={0.10}>
                    <InputRNCom
                        styleContainer={{ paddingHorizontal: 10, paddingVertical: 0, paddingBottom: 10, }}
                        styleBodyInput={{
                            borderColor: colors.black_11, borderRadius: 5,
                            minHeight: 40, alignSelf: 'center', paddingLeft: 10, width: Width(95),
                        }}
                        styleLabel={{ fontWeight: 'bold', paddingVertical: 0 }}
                        sufix={
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                <TouchableOpacity
                                    onPress={() => this._Search()}
                                    style={{
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        paddingHorizontal: 10,
                                        // borderWidth: 0.5,
                                        paddingVertical: 5,
                                        // borderRadius: 5,
                                        // borderColor: colors.peacockBlue,
                                        // backgroundColor: colors.peacockBlue
                                    }}>
                                    <Image
                                        source={Images.icSearch}
                                        style={{ width: 25, height: 25, tintColor: colors.peacockBlue }} resizeMode='contain' />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={this.goScreenFilter}
                                    style={{ paddingHorizontal: 10, paddingVertical: 5, borderLeftWidth: 2, borderLeftColor: colors.BackgroundHome }}>
                                    <Image
                                        source={Images.icEdit}
                                        style={{ width: 30, height: 30 }} resizeMode='contain' />
                                </TouchableOpacity>

                            </View>

                        }
                        editable={true}
                        placeholder={"Nhập để tìm kiếm"}
                        styleInput={{}}
                        styleError={{ backgroundColor: 'white', }}
                        styleHelp={{ backgroundColor: 'white', }}
                        placeholderTextColor={colors.black_80}
                        valid={true}
                        prefix={null}
                        value={keysearch}
                        onChangeText={(val) => {
                            this.setState({ keysearch: val, objectPage: { Page: 0 } }, () => this.getData())
                            // this.handleInputThrottled();
                        }}
                    />

                    <FlatList
                        style={{ marginTop: 0, paddingBottom: isIphoneX() ? 20 : 10, backgroundColor: colors.red, paddingHorizontal: 10 }}
                        data={dataTraCuu}
                        renderItem={this._renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal={false}
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                        onEndReached={this.loadMore}
                        onEndReachedThreshold={0.3}
                        ListFooterComponent={this._ListFooterComponent}
                        ListEmptyComponent={
                            // <ListEmpty textempty={'Danh sách trống'} 
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: Height(25) }}>
                                <Image source={Images.icEmpty} style={{ width: Width(24), height: Width(24), tintColor: colors.peacockBlue }} />
                                <Text style={{ fontSize: reText(14), color: colors.peacockBlue }}>Không có dữ liệu</Text>
                            </View>
                            // />
                        }
                    />
                </ImageBackground>
                {/* <IsLoading /> */}
            </View >
        )
    }
}

export default XuPhatHanhChinh

