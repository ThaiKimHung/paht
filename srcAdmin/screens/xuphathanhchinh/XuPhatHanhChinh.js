import React, { Component, createRef } from 'react';
import { View, Text, TouchableOpacity, Image, TouchableHighlight, ScrollView, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import { HeaderCom, IsLoading } from '../../../components';
import { colors, nstyles } from '../../../styles';
import { Images } from '../../images';
import apis from '../../apis';
import Utils from '../../../app/Utils';
import InputRNCom from '../../../components/ComponentApps/InputRNCom';
import { reText, reSize } from '../../../styles/size';
import { isIphoneX } from 'react-native-iphone-x-helper';
import * as Animatable from 'react-native-animatable';
import Moment from 'moment'
import { nGlobalKeys } from '../../../app/keys/globalKey';
import { throttle, debounce } from 'lodash';
import ImagePicker from '../../../components/ComponentApps/ImagePicker/ImagePicker';
import { Width } from '../../../styles/styles';
import AppCodeConfig from '../../../app/AppCodeConfig';
const objectFilter = {
    "sortOrder": "desc",
    "sortField": "CreatedDate",
    "page": 1,
    "record": 10,
    "OrderBy": "CreatedDate",
    "filter.keys": "tungay|denngay|keyword|LinhVucs",
    "filter.vals": `${Moment(new Date()).add(-15, 'day').format('DD-MM-YYYY')}|${Moment(new Date()).format('DD-MM-YYYY')}||`
}

class XuPhatHanhChinh extends Component {
    constructor(props) {
        super(props);
        this.MangMauXPHC = Utils.getGlobal(nGlobalKeys.MangMauXPHC, '', AppCodeConfig.APP_ADMIN)
        this.state = {
            keysearch: '',
            dataHanhChinh: [],
            listTrangThai: [],
            idTrangThai: 0,
            listLinhVuc: [],
            refreshing: true,
            objectPage: { "Page": 0 },
            dateFrom: Moment(new Date()).add(-15, 'day').format('DD/MM/YYYY'),
            dateTo: Moment(new Date()).format('DD/MM/YYYY'),
            selectLv: { IdLinhVuc: 0, LinhVuc: 'Tất cả' },

            listRule: []
        };
        this.handleInputThrottled = debounce(this.handleInput, 500)
    }

    async componentDidMount() {
        this.props.SetStatus_Notify(-1)
        this.getData();
        this.getTrangThai();
        this.getLinhVuc();
        this.checkRule();
    }
    componentWillUnmount() {
        this.props.SetStatus_Notify(1)
    }
    handleInput = () => {
        this.getData()
    }
    checkRule = async () => {
        // - Tạo / Cập nhật biên bản hành chính ( Chưa thi hành): 202
        // - Thi hành: 205
        // - Hạn thi hành biên bản (Khi đã thi hành): 203
        // - Xoá thủ tục: 204
        // - Tạo / cập nhật tài khoản công dân: 91
        // - Xoá tài khoản công dân: 92
        const listRule = [202, 203, 204, 205, 91, 92]
        let haveRule = []
        var rules = await Utils.getGlobal(nGlobalKeys.rules, [], AppCodeConfig.APP_ADMIN);

        listRule.forEach(item => {
            const isRule = rules.includes(item)
            if (isRule) {
                haveRule.push(item)
            }
        })
        // alert(haveRule)
        this.setState({ listRule: haveRule })
    }

    getData = async () => {
        const { keysearch, dateFrom, dateTo, selectLv, idTrangThai } = this.state;
        this.setState({ refreshing: true, })
        nthisIsLoading.show();
        let body = {
            ...objectFilter,
            "filter.keys": `tungay|denngay${idTrangThai != 0 ? "|Status" : ''}${keysearch ? "|keyword" : ''}${selectLv.IdLinhVuc != 0 ? "|LinhVucs" : ""}`,
            "filter.vals": `${Moment(dateFrom, 'DD/MM/YYYY').format('DD-MM-YYYY')}|${Moment(dateTo, 'DD/MM/YYYY').format('DD-MM-YYYY')
                }${idTrangThai != 0 ? `|${idTrangThai}` : ''}${keysearch ? `|${keysearch}` : ''}${selectLv.IdLinhVuc != 0 ? `|${selectLv.IdLinhVuc}` : ""}`,
        }
        Utils.nlog("gía trị body", body)
        let res = await apis.ApiXuLyHanhChinh.GetList_HanhChinh(body);
        Utils.nlog("gía trị res xphc", body, res)
        if (res.status == 1) {
            this.setState({ dataHanhChinh: res.data, refreshing: false, objectPage: res.page })
            nthisIsLoading.hide();
        }
        else {
            this.setState({ dataHanhChinh: [], refreshing: false, objectPage: { "Page": 0 } })
            nthisIsLoading.hide();
        }
    }

    getTrangThai = async () => {
        let res = await apis.ApiXuLyHanhChinh.GetList_TrangThai();
        if (res.status == 1) {
            this.setState({ listTrangThai: [{ "Id": 0, "TenTrangThai": "Tất cả" }].concat(res.data) })
        }
    }
    getLinhVuc = async () => {
        // let res = await apis.LinhVuc.GetList_LinhVuc();
        let res = await apis.ApiXuLyHanhChinh.GetList_LinhVuc_New();
        Utils.nlog("gía trị linh vuc", res)
        if (res.status == 1) {
            this.setState({ listLinhVuc: [{ IdLinhVuc: 0, LinhVuc: 'Tất cả' }].concat(res.data) })
        }
    }

    setTrangThai = index => {
        this.setState({ idTrangThai: index, objectFilter: { Page: 0 } }, this.getData)

    }

    ThemXuPhatHC = () => {
        if (this.state.listRule.includes(202))
            Utils.goscreen(this, 'scThemXuPhatHC', { ListRule: this.state.listRule, isAdd: true, callback: this._onRefresh })
        else {
            Utils.showMsgBoxOK(this, "Thông báo", "Bạn không có quyền thực hiện chức năng!", 'Xác nhận')
        }

        // Utils.goscreen(this, 'scThemXuPhatHC', { ListRule: this.state.listRule, isAdd: true, callback: this._onRefresh })
    }
    ThiHanhXuPhat = async (item) => {
        if (!this.state.listRule.includes(205)) {
            Utils.showMsgBoxOK(this, "Thông báo", "Bạn không có quyền thực hiện chức năng!", 'Xác nhận');
            return;
        }
        var body = {
            "CongDan": item.CongDan,
            "Finish": 1,
            "ID": item.ID,
            "MaDon": item.MaDon,
            "Status": 2
        }
        var bodyThiHanh1Phan = {
            "CongDan": item.CongDan,
            "Finish": 1,
            "ID": item.ID,
            "MaDon": item.MaDon,
            "Status": 3
        }
        Alert.alert(
            'Thông báo',
            'Bạn có chắc muốn thi hành đơn này không ?',
            [
                {
                    text: 'Thi hành',
                    onPress: async () => {
                        let res = await apis.ApiXuLyHanhChinh.Update_HanhChinh_ThiHanh(body);
                        if (res.status == 1) {
                            Utils.showMsgBoxOK(this, 'Thông báo', 'Xử lý thành công', 'Xác nhận', this.getData)
                        } else {
                            Utils.showMsgBoxOK(this, 'Thông báo', 'Xử lý thất bại', 'Xác nhận')
                        }
                    },
                },
                {
                    text: 'Thi hành 1 phần',
                    onPress: async () => {
                        let res = await apis.ApiXuLyHanhChinh.Update_HanhChinh_ThiHanh(bodyThiHanh1Phan);
                        if (res.status == 1) {
                            Utils.showMsgBoxOK(this, 'Thông báo', 'Xử lý thành công', 'Xác nhận', this.getData)
                        } else {
                            Utils.showMsgBoxOK(this, 'Thông báo', 'Xử lý thất bại', 'Xác nhận')
                        }
                    },
                },
                {
                    text: 'Thoát',
                    onPress: () => Utils.goback(this),
                },
            ],
        );
        // Utils.showMsgBoxYesNo(this, 'Thông báo', 'Bạn có chắc muốn thi hành đơn này không ?', 'Lưu', 'Huỷ', async () => {
        //     let res = await apis.ApiXuLyHanhChinh.Update_HanhChinh_ThiHanh(body);
        //     if (res.status == 1) {
        //         Utils.showMsgBoxOK(this, 'Thông báo', 'Xử lý thành công', 'OK', this.getData)
        //     } else {
        //         Utils.showMsgBoxOK(this, 'Thông báo', 'Xử lý thất bại')
        //     }
        // },
        //     () => { alert('Ok') }
        // )
    }
    XoaXuPhat = async (item) => {
        if (this.state.listRule.includes(204)) {
            Utils.nlog('Gia tri item --------', item.ID)
            Utils.showMsgBoxYesNo(this, 'Thông báo', 'Bạn có chắc muốn xoá đơn này không ?', 'Lưu', 'Huỷ', async () => {

                let res = await apis.ApiXuLyHanhChinh.Delete_HanhChinh(item.ID);
                Utils.nlog('Gia tri resssss=====', res)
                if (res.status == 1) {
                    Utils.nlog('Gia tri resssss=====', res)
                    Utils.showMsgBoxOK(this, 'Thông báo', 'Xử lý thành công', 'Xác nhận', this.getData)
                } else {
                    Utils.showMsgBoxOK(this, 'Thông báo', 'Xử lý thất bại', 'Xác nhận')
                }
            })
        } else {
            Utils.showMsgBoxOK(this, "Thông báo", "Bạn không có quyền thực hiện chức năng!", 'Xác nhận')
        }
    }
    _openMenu = () => {
        this.props.navigation.openDrawer();
    }
    handleViewRef = ref => this.view = ref;

    _renderItem = ({ item, index }) => {
        Utils.nlog("<><>Item", item)
        let MauMaDon = colors.colorBlue
        if (this.MangMauXPHC && this.MangMauXPHC.hasOwnProperty(item.Class)) {
            MauMaDon = this.MangMauXPHC[`${item.Class}`]
        }
        return (
            <Animatable.View animation={index % 2 == 0 ? 'slideInRight' : 'slideInLeft'} style={{ paddingHorizontal: 10, marginBottom: 5, borderRadius: 5 }}>
                <TouchableOpacity
                    onPress={() => {
                        Utils.goscreen(this, 'scThemXuPhatHC', { ItemXuPhat: item, callback: this._onRefresh, isRead: true });
                    }}
                    style={{
                        backgroundColor: colors.white, minHeight: 150,
                        paddingHorizontal: 10,
                        paddingVertical: 10,
                    }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={item.CaNhan ? Images.icNguoi : Images.icCongTy} style={{ width: 15, height: 15, tintColor: item.CaNhan ? colors.peacockBlue : colors.orangeFive, marginRight: 5 }} />
                            <Text style={{ fontSize: reText(13), fontWeight: 'bold', }}>{item.CaNhan ? item.ToChucViPham : item.TenCongTy}</Text>
                        </View>
                        <Text style={{ fontSize: reText(13), fontStyle: 'italic' }}>{item.CreatedDate}</Text>
                    </View>
                    <View style={{ height: reSize(40) }}>
                        <Text numberOfLines={2} style={{ fontSize: reText(12), marginTop: 5 }}>{item.HanhVi}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                        {item.TenLinhVuc ? <View style={{ paddingVertical: 5, paddingHorizontal: 10, backgroundColor: colors.greenyBlue, borderRadius: 5, flex: 1, marginRight: 20 }}>
                            <Text numberOfLines={1} style={{ fontSize: reText(13), fontWeight: 'bold', color: colors.white }}>{item.TenLinhVuc}</Text>
                        </View> : <View></View>}
                        <View style={{
                            paddingVertical: 5, paddingHorizontal: 10,
                            backgroundColor: item.Status == 2 ? colors.colorPink3 : (item.Status == 1 ? colors.colorBlueLight : colors.peacockBlue), borderRadius: 5
                        }}>
                            <Text style={{ fontSize: reText(13), fontWeight: 'bold', color: colors.white }}>{item.TenTrangThai}</Text>
                        </View>
                    </View>
                    <View style={{ marginTop: 5, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center', borderWidth: 0.5, borderColor: MauMaDon, paddingHorizontal: 5, paddingVertical: 3, borderRadius: 5, maxWidth: Width(45) }}>
                            <Text style={{ fontSize: reText(12), color: MauMaDon }}>Mã đơn</Text>
                            <Text style={{ fontSize: reText(14), fontWeight: 'bold', color: MauMaDon }}>{item.MaDon}</Text>
                        </View>
                        {
                            item.MaPhanAnh ? <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', borderWidth: 0.5, borderColor: colors.redStar, paddingHorizontal: 5, maxWidth: Width(45), paddingVertical: 3, borderRadius: 5 }}
                                onPress={() => Utils.goscreen(this, 'sc_ChiTietXuPhatHC', { IdPA: item.IdPA, isMenuMore: -1 })}>
                                <Text style={{ fontSize: reText(12), color: colors.redStar, flex: 1 }}>Mã phản ánh</Text>
                                <Text style={{ fontSize: reText(14), color: colors.redStar, fontWeight: 'bold', flex: 1 }}>{item.MaPhanAnh}</Text>
                            </TouchableOpacity> : null
                        }
                    </View>

                    <View style={{ flexDirection: 'row', marginTop: 5 }}>
                        <Text style={{ fontSize: reText(12) }}>NHL - NTT: </Text>
                        <Text style={{ fontSize: reText(12) }}>{item.NgayHieuLuc ? item.NgayHieuLuc : '---'}</Text>
                        <Text> - </Text>
                        <Text style={{ fontSize: reText(12) }}>{item.NgayThucThi ? item.NgayThucThi : '---'}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: reText(12) }}>Số ngày quá hạn thực thi: <Text style={{ color: colors.redStar, fontWeight: 'bold', fontSize: reText(12) }}>{item.SLNgayQuaHan >= 0 ? item.SLNgayQuaHan : '---'}</Text></Text>
                        </View>
                        {item.TreHen == 1 ?
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
                                <View style={{ borderRadius: 15, borderColor: colors.redStar, borderWidth: 1, paddingHorizontal: 5, paddingVertical: 2 }}>
                                    <Text style={{ fontSize: reText(12), color: colors.redStar }}>Trễ hạn</Text>
                                </View>
                            </View> : null
                        }
                    </View>


                </TouchableOpacity>
                <View style={{
                    width: '100%', flexDirection: 'row', borderBottomRightRadius: 5, backgroundColor: colors.white,
                    borderBottomLeftRadius: 5, minHeight: 40, borderTopWidth: 0.5, borderColor: colors.colorPink2
                }}>
                    {item.Status == 1 || item.Status == 3 ? <TouchableHighlight underlayColor={colors.backgroundModal} onPress={() => this.ThiHanhXuPhat(item)} style={{ flex: 1, height: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                        <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                            <Image
                                source={Images.icEdited}
                                style={[nstyles.nstyles.nIcon15, { tintColor: colors.colorGrayText }]}
                            />
                            <Text style={{ fontSize: 14, color: colors.colorGrayText, paddingHorizontal: 5, fontWeight: 'bold' }}>
                                {'Thi hành'}
                            </Text>
                        </View>
                    </TouchableHighlight> : null}

                    <TouchableHighlight
                        underlayColor={colors.backgroundModal}
                        onPress={() => { this.state.listRule.includes(202) ? Utils.goscreen(this, 'scThemXuPhatHC', { ItemXuPhat: item, callback: this.getData, isRead: false, isSua: true }) : Utils.showMsgBoxOK(this, "Thông báo", "Bạn không có quyền thực hiện chức năng!", 'Xác nhận') }}
                        style={{ flex: 1, height: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                        <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                            <Image
                                source={Images.icEditCB}
                                style={[nstyles.nstyles.nIcon15, { tintColor: colors.colorGrayText }]}
                            />
                            <Text style={{ fontSize: 14, color: colors.colorGrayText, paddingHorizontal: 5, fontWeight: 'bold' }}>
                                {'Cập nhật'}
                            </Text>
                        </View>

                    </TouchableHighlight>
                    <TouchableHighlight underlayColor={colors.backgroundModal} onPress={() => this.XoaXuPhat(item)} style={{ flex: 1, height: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                        <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                            <Image
                                source={Images.icDeleteCB}
                                style={[nstyles.nstyles.nIcon15, { tintColor: colors.colorGrayText }]}
                            />
                            <Text style={{ fontSize: 14, color: colors.colorGrayText, paddingHorizontal: 5, fontWeight: 'bold' }}>
                                {'Xoá'}
                            </Text>
                        </View>

                    </TouchableHighlight>
                </View >
            </Animatable.View >
        )
    }

    _onRefresh = () => {
        this.setState({ refreshing: true, objectFilter: { Page: 0 } },
            () => this.getData());
    }

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
                "page": objectPage?.Page + 1,
                "filter.keys": "tungay|denngay|Status",
                "filter.vals": "16 - 09 - 2020|" + Moment(new Date()).format('DD-MM-YYYY') + "|" + (this.state.idTrangThai == 0 ? '' : this.state.idTrangThai),
            }
            let res = await apis.ApiXuLyHanhChinh.GetList_HanhChinh(body);
            if (res.status == 1) {
                if (objectPage.Page != res.page.Page) {
                    let data = [...this.state.dataHanhChinh, ...res.data]
                    this.setState({ dataHanhChinh: data, objectPage: res.page });
                }
            } else {
                this.setState({ dataHanhChinh: [], objectPage: { "Page": 0 } });
            }
        };
    };
    callBackFilter = (dateFrom, dateTo, selectLv) => {
        this.setState({
            dateFrom,
            dateTo,
            selectLv,
            objectFilter: { Page: 0 }
        }, this.getData)
    }
    goScreenFilter = (e) => {
        const {
            listLinhVuc,
            dateFrom,
            dateTo,
            selectLv
        } = this.state;
        Utils.nlog("giá trị state", this.state)
        Utils.navigate("Modal_SearchFilterDH", {
            "event": e.nativeEvent,
            dataLinhVuc: listLinhVuc,
            datefrom: dateFrom,
            dateTo: dateTo,
            selectlv: selectLv,
            callback: this.callBackFilter
        })
    }

    render() {
        const { listTrangThai, idTrangThai, dataHanhChinh, keysearch } = this.state;
        return (
            <View style={nstyles.nstyles.ncontainer}>
                <HeaderCom
                    nthis={this}
                    titleText={'Xử phạt hành chính'}
                    iconLeft={Images.icSlideMenu}
                    iconRight={null}
                    onPressLeft={this._openMenu}
                // onPressRight={() => Utils.goscreen(this, 'FormTaoTaiKhoanDH')}
                />
                <View style={{
                    paddingVertical: 5,
                    backgroundColor: 'white',
                }}>


                    {/* <View style={{ backgroundColor: 'red', height: 100 }}></View> */}
                    <View style={{ flexDirection: 'row', marginTop: 5, paddingHorizontal: 10 }}>
                        <View style={{
                            paddingHorizontal: 15, borderWidth: 0.5, borderColor: colors.colorBlueLight,
                            justifyContent: 'center', alignItems: 'center', borderRadius: 5
                        }}>
                            <Text style={{ fontWeight: '700', color: colors.colorBlueLight }}>Trạng thái :</Text>
                        </View>
                        <View style={{ width: 2, backgroundColor: colors.colorBlueLight, marginHorizontal: 5 }}></View>
                        <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} >
                            {listTrangThai.map((item, index) =>
                                <TouchableOpacity key={index} style={{ alignSelf: 'center', marginRight: 5, backgroundColor: item.Id == idTrangThai ? colors.colorBlueLight : colors.black_20, paddingVertical: 10, paddingHorizontal: 15, borderRadius: 5 }}
                                    onPress={() => this.setTrangThai(item.Id)}>
                                    <Text style={{ fontWeight: '500', color: colors.white }}>{item.TenTrangThai}</Text>
                                </TouchableOpacity>
                            )}
                        </ScrollView>
                    </View>
                    <InputRNCom
                        styleContainer={{ paddingHorizontal: 10, paddingVertical: 0, }}
                        styleBodyInput={{
                            borderColor: colors.blueGrey_20, borderRadius: 40,
                            minHeight: 40, alignItems: 'center', paddingLeft: 15,
                        }}
                        // labelText={'Email'}
                        styleLabel={{ fontWeight: 'bold', paddingVertical: 0 }}
                        // sufixlabel={<View>
                        //     <Text style={{ fontSize: 18, color: colors.redStar }}>{'*'}</Text>
                        // </View>}
                        sufix={
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableOpacity
                                    onPress={() => this.setState({ objectPage: { Page: 0 } }, this.getData)}
                                    style={{
                                        // height: 30,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        paddingHorizontal: 5,
                                        // backgroundColor: 'red',
                                    }}>
                                    <Image

                                        source={Images.icSearch}
                                        style={{ width: 20, height: 20 }} resizeMode='contain' />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={this.goScreenFilter}
                                    style={{ paddingHorizontal: 10, paddingVertical: 5, borderLeftWidth: 1, borderLeftColor: colors.paleGreyThree }}>
                                    <Image
                                        source={Images.icEdit}
                                        style={{ width: 25, height: 25 }} resizeMode='contain' />
                                </TouchableOpacity>

                            </View>
                        }
                        editable={true}
                        placeholder={"Tìm kiếm"}
                        styleInput={{}}
                        styleError={{ backgroundColor: 'white', }}
                        styleHelp={{ backgroundColor: 'white', }}
                        placeholderTextColor={colors.black_80}
                        // errorText={'SDT không hợp lệ'}
                        // helpText={'Nhập email chính xác để nhận các thông báo: đổi mật khẩu, thông tin phản ánh'}
                        valid={true}
                        prefix={null}
                        value={keysearch}
                        onChangeText={(val) => {
                            this.setState({ keysearch: val, objectPage: { Page: 0 } })
                            this.handleInputThrottled();
                        }}
                    // onChangeText={(val) => {
                    //     this.setState({ keysearch: val, objectPage: { Page: 0 } }, this.handleInputThrottled)
                    // }}
                    />
                </View>

                <FlatList
                    style={{ marginTop: 5, marginBottom: isIphoneX() ? 20 : 10, }}
                    data={dataHanhChinh}
                    renderItem={this._renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal={false}
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh}
                    onEndReached={this.loadMore}
                    onEndReachedThreshold={0.3}
                    ListFooterComponent={this._ListFooterComponent}
                />
                <Animatable.View ref={this.handleViewRef} delay={300} animation={'lightSpeedIn'} style={styles.ButtonAdd}>
                    <TouchableHighlight underlayColor={colors.colorBlueLight} onPress={this.ThemXuPhatHC} style={{ padding: 15, borderRadius: 50, }} activeOpacity={0.5} >
                        <Image source={Images.icPlus} style={[nstyles.nstyles.nIcon24, { tintColor: colors.white }]} />
                    </TouchableHighlight>
                </Animatable.View>
                <IsLoading />
            </View >
        );
    }
}

const styles = StyleSheet.create({
    ButtonAdd: {
        zIndex: 100,
        position: 'absolute',
        bottom: isIphoneX() ? 36 : 5,
        right: 15,
        backgroundColor: colors.colorStarYellow,
        borderRadius: 50,
        elevation: 6,
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowRadius: 6,
        shadowOpacity: 0.2,
        shadowColor: colors.black_50
    }
})

export default Utils.connectRedux(XuPhatHanhChinh, null, true);


