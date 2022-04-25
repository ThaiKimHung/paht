import React, { Component } from 'react'
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View, TouchableHighlight, Image, Alert } from 'react-native'
import apis from '../../apis'
import { nstyles } from '../../../styles/styles'
import Moment from 'moment'
import { reSize, reText } from '../../../styles/size'
import { colors } from '../../../styles'
import { HeaderCom, IsLoading, ListEmpty } from '../../../components'
import { Images } from '../../images'
import Utils from '../../../app/Utils'
import * as Animatable from 'react-native-animatable'
import { nGlobalKeys } from '../../../app/keys/globalKey'
import AppCodeConfig from '../../../app/AppCodeConfig'
const objectFilter = {
    "sortOrder": "asc",
    "sortField": "",
    "page": "1",
    "record": "10",
    "OrderBy": "",
    "filter.keys": "tungay|denngay",
    "filter.vals": "16 - 09 - 2020|" + Moment(new Date()).format('DD-MM-YYYY')
}

export class DanhSachCDViPham extends Component {
    constructor(props) {
        super(props)
        this.UserID = Utils.ngetParam(this, 'UserID', 0)
        this.isTKXPHC = Utils.ngetParam(this, 'isTKXPHC', false);
        this.isDSThongKeDV = Utils.ngetParam(this, 'isDSThongKeDV', false);
        this.isTKTienXP = Utils.ngetParam(this, 'isTKTienXP', false);
        this.state = {
            listCongDanVP: [],
            objectPage: { "Page": 0 },
            refreshing: true,
            listRule: []
        }
    }
    componentDidMount() {
        this.getDanhSachCDVP()
        this.checkRule()
        Utils.nlog("<><>", this.UserID)
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

    getDanhSachCDVP = async () => {
        let body = {
            ...objectFilter,
            "filter.keys": "tungay|denngay|CongDan",
            "filter.vals": "16 - 09 - 2020|" + Moment(new Date()).format('DD-MM-YYYY') + "|" + this.UserID,
        }

        let res = await apis.ApiXuLyHanhChinh.GetList_HanhChinh(body);
        if (res.status == 1) {
            nthisIsLoading.show();
            if (res.status == 1) {
                this.setState({ listCongDanVP: res.data, refreshing: false, objectPage: res.page })
                nthisIsLoading.hide();
            }
            else {
                this.setState({ listCongDanVP: [], refreshing: false, objectPage: { "Page": 0 } })
                nthisIsLoading.hide();
            }
        }
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
                            Utils.showMsgBoxOK(this, 'Thông báo', 'Xử lý thành công', 'Xác nhận', this.getDanhSachCDVP)
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
                            Utils.showMsgBoxOK(this, 'Thông báo', 'Xử lý thành công', 'Xác nhận', this.getDanhSachCDVP)
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
        //         Utils.showMsgBoxOK(this, 'Thông báo', 'Xử lý thành công', 'OK', this.getDanhSachCDVP)
        //     } else {
        //         Utils.showMsgBoxOK(this, 'Thông báo', 'Xử lý thất bại')
        //     }
        // })
    }
    XoaXuPhat = async (item) => {
        Utils.nlog(">>>>>>>>>", this.state.listRule)
        if (this.state.listRule.includes(204)) {
            Utils.nlog('Gia tri item --------', item.ID)
            Utils.showMsgBoxYesNo(this, 'Thông báo', 'Bạn có chắc muốn xoá đơn này không ?', 'Lưu', 'Huỷ', async () => {

                let res = await apis.ApiXuLyHanhChinh.Delete_HanhChinh(item.ID);
                Utils.nlog('Gia tri resssss=====', res)
                if (res.status == 1) {
                    Utils.nlog('Gia tri resssss=====', res)
                    Utils.showMsgBoxOK(this, 'Thông báo', 'Xử lý thành công', 'Xác nhận', this.getDanhSachCDVP)
                } else {
                    Utils.showMsgBoxOK(this, 'Thông báo', 'Xử lý thất bại', 'Xác nhận')
                }
            })
        } else {
            Utils.showMsgBoxOK(this, "Thông báo", "Bạn không có quyền thực hiện chức năng!", 'Xác nhận')
        }
    }
    _renderItem = ({ item, index }) => {
        return (
            <Animatable.View animation={index % 2 == 0 ? 'slideInRight' : 'slideInLeft'} style={{ paddingHorizontal: 10, marginBottom: 5, borderRadius: 5 }}>
                <TouchableOpacity
                    onPress={() => this.props.navigation.push(this.isTKXPHC || this.isDSThongKeDV || this.isTKTienXP ? 'Modal_ChiTietTKDV' : 'scThemXuPhatHC',
                        { ItemXuPhat: item, callback: this.getDanhSachCDVP, isRead: true, isTKXPHC: this.isTKXPHC, isDSThongKeDV: this.isDSThongKeDV, isTKTienXP: this.isTKTienXP })}
                    style={{ backgroundColor: colors.white, minHeight: 150, borderRadius: 5, padding: 10 }}>
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
                    <Text style={{ fontSize: reText(14), marginTop: 5, fontWeight: 'bold', color: colors.colorBlue }}>Mã đơn: {item.MaDon}</Text>
                    <View style={{ flexDirection: 'row', marginTop: 5 }}>
                        <Text style={{ fontSize: reText(12) }}>NHL - NTT: </Text>
                        <Text style={{ fontSize: reText(12) }}>{item.NgayHieuLuc ? item.NgayHieuLuc : '---'}</Text>
                        <Text> - </Text>
                        <Text style={{ fontSize: reText(12) }}>{item.NgayThucThi ? item.NgayThucThi : '---'}</Text>
                    </View>
                    <Text style={{ marginTop: 5, fontSize: reText(12) }}>Số ngày quá hạn thực thi: <Text style={{ color: colors.redStar, fontWeight: 'bold', fontSize: reText(12) }}>{item.SLNgayQuaHan >= 0 ? item.SLNgayQuaHan : '---'}</Text></Text>
                </TouchableOpacity >
                <View style={{
                    width: '100%', flexDirection: 'row', borderBottomRightRadius: 5, backgroundColor: colors.white,
                    borderBottomLeftRadius: 5, minHeight: 40, borderTopWidth: 0.5, borderColor: colors.colorPink2
                }}>
                    {item.Status == 1 || item.Status == 3 ? <TouchableHighlight underlayColor={colors.backgroundModal} onPress={() => this.ThiHanhXuPhat(item)} style={{ flex: 1, height: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                        <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                            <Image
                                source={Images.icEdited}
                                style={[nstyles.nIcon15, { tintColor: colors.colorGrayText }]}
                            />
                            <Text style={{ fontSize: 14, color: colors.colorGrayText, paddingHorizontal: 5, fontWeight: 'bold' }}>
                                {'Thi hành'}
                            </Text>
                        </View>
                    </TouchableHighlight> : null}

                    <TouchableHighlight
                        underlayColor={colors.backgroundModal}
                        onPress={this.state.listRule.includes(202) ? () => this.props.navigation.push('scThemXuPhatHC', { ItemXuPhat: item, callback: this.getDanhSachCDVP, isRead: false, isSua: true }) : Utils.showMsgBoxOK(this, "Thông báo", "Bạn không có quyền thực hiện chức năng!")}
                        style={{ flex: 1, height: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                        <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                            <Image
                                source={Images.icEditCB}
                                style={[nstyles.nIcon15, { tintColor: colors.colorGrayText }]}
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
                                style={[nstyles.nIcon15, { tintColor: colors.colorGrayText }]}
                            />
                            <Text style={{ fontSize: 14, color: colors.colorGrayText, paddingHorizontal: 5, fontWeight: 'bold' }}>
                                {'Xoá'}
                            </Text>
                        </View>

                    </TouchableHighlight>
                </View >
            </Animatable.View>
        )
    }
    _onRefresh = () => {
        let body = {
            "filter.keys": "tungay|denngay|CongDan",
            "filter.vals": "16 - 09 - 2020|" + Moment(new Date()).format('DD-MM-YYYY') + "|" + this.UserID,
        }
        this.setState({ refreshing: true },
            () => this.getDanhSachCDVP(body));
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
                "filter.keys": "tungay|denngay|CongDan",
                "filter.vals": "16 - 09 - 2020|" + Moment(new Date()).format('DD-MM-YYYY') + "|" + this.UserID,
            }
            let res = await apis.ApiXuLyHanhChinh.GetList_HanhChinh(body);
            if (res.status == 1) {
                if (objectPage.Page != res.page.Page) {
                    let data = [...this.state.listCongDanVP, ...res.data]
                    this.setState({ listCongDanVP: data, objectPage: res.page });
                }
            } else {
                this.setState({ listCongDanVP: [], objectPage: { "Page": 0 } });
            }
        };
    };
    _goback = () => {
        if (this.isTKXPHC) {
            Utils.goscreen(this, 'DanhSachCTChung');
        }
        // if (this.isDSThongKeDV) {
        //     Utils.goscreen(this, 'sc_ChiTietThongKeDonVi')
        //     return;
        // }
        else { Utils.goback(this) }
    }
    render() {
        const { listCongDanVP, refreshing } = this.state;
        return (
            <View style={nstyles.ncontainer}>
                <HeaderCom
                    nthis={this}
                    titleText={'Danh sách vi phạm'}
                    iconLeft={Images.icBack}
                    // styleContent={{ backgroundColor: colors.colorStarYellow }}
                    onPressLeft={this._goback}
                    hiddenIconRight={true}
                // onPressRight={() => Utils.goscreen(this, 'FormTaoTaiKhoanDH')}
                />
                <View style={nstyles.nbody}>
                    <FlatList
                        style={{ marginTop: 10 }}
                        data={listCongDanVP}
                        renderItem={this._renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                        onEndReached={this.loadMore}
                        onEndReachedThreshold={0.3}
                        ListFooterComponent={this._ListFooterComponent}
                        ListEmptyComponent={<ListEmpty />}
                    />
                </View>
                <IsLoading />
            </View>
        )
    }
}

export default DanhSachCDViPham
