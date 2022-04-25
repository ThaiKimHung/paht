import React, { Component } from 'react'
import { Text, View, TouchableOpacity, Image, ScrollView, FlatList, Platform, BackHandler } from 'react-native'
import { paddingTopMul, nstyles, Width } from '../../../styles/styles'
import Utils from '../../../app/Utils'
import { colors } from '../../../styles'
import { reText } from '../../../styles/size'
import { Images } from '../../images'
import apis from '../../apis'
import { HeaderCus, IsLoading, IsLoadingNew, ListEmpty } from '../../../components'
import { nGlobalKeys } from '../../../app/keys/globalKey'
import { nkey } from '../../../app/keys/keyStore'

export class HoSoDaGui extends Component {
    constructor(props) {
        super(props);
        this.UserID = Utils.getGlobal(nGlobalKeys.InfoUserSSO, '') ? Utils.getGlobal(nGlobalKeys.InfoUserSSO, '').KhachHangID : '' // Hiện tại đang gán default
        this.IdTT = Utils.ngetParam(this, 'IdTT')
        this.state = {
            dataHoSo: [],//data chứ ds hồ sơ
            dataDV: [],
            selectDV:
            {
                "DonViCapChaID": null,
                "DonViID": "-1",
                "TenDonVi": "-- Tất cả đơn vị --",
                "NumTTHC": ""
            },
            dataTT: [],
            selectTT: {
                "MaTinhTrang": "-1",
                "TenTinhTrang": "-- Tất cả tình trạng --",
                "TinhTrangID": "-1"
            },
            dateFrom: '',
            dateTo: '',
            refreshing: true
        }
    }

    componentDidMount() {
        this.getData();
        // console.log("---------ID:", this.IdTT)
        this.getTinhTrang();
        this.getDonVi();
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


    getData = async () => {
        console.log("idTinhTrang:", this.state.selectTT)
        // nthisIsLoading.show();
        let UserInfo = this.props.auth.userDVC
        Utils.nlog('info sso', UserInfo)
        const { selectDV, selectTT, dateFrom, dateTo } = this.state;
        let dataBoDy = new FormData();
        let obj = JSON.stringify({
            "UserID": UserInfo ? UserInfo.KhachHangID : this.UserID,
            "DonViID": selectDV.DonViID == "-1" ? '' : selectDV.DonViID,
            "TinhTrangID": this.IdTT ? this.IdTT : selectTT.TinhTrangID == "-1" ? '' : selectTT.TinhTrangID,
            "DateFrom": dateFrom,
            "DateTo": dateTo,
        })
        dataBoDy.append("data", obj)
        Utils.nlog('objec sso', obj)
        let res = await apis.ApiDVC.TimKiemHoSoNguoiDung(dataBoDy);
        Utils.nlog("<><>Log1111111", res)
        if (res.status == 1) {
            // nthisIsLoading.hide();
            this.setState({
                dataHoSo: res.data.data.SelectByConditionDanhSachHoSoTTTKResult, refreshing: false
            })
        }
        else {
            // nthisIsLoading.hide();
            this.setState({
                dataHoSo: [], refreshing: false,
            })
        }
    }

    _onRefresh = () => {
        this.setState({ refreshing: true }, this.getData);
    }

    getDonVi = async () => {
        const res = await apis.ApiDVC.GetDataDonVi_TraCuu();
        if (res.status == 1) {
            this.setState({
                dataDV: [{
                    "DonViCapChaID": null,
                    "DonViID": "-1",
                    "TenDonVi": "-- Tất cả đơn vị --",
                    "NumTTHC": ""
                }].concat([...res.data.CT.V_DICHVUCONG_DONVI_LstStringResult, ...res.data.CH.V_DICHVUCONG_DONVI_LstStringResult, ...res.data.CX.V_DICHVUCONG_DONVI_LstStringResult])
            })
        }
        else {
            this.setState({ dataDV: [] })
        }
    }

    getTinhTrang = async () => {
        const res = await apis.ApiDVC.GetAllTinhTrang();
        console.log("id trang thai full:", res)
        if (res.status == 1) {
            this.setState({
                dataTT: [{
                    "MaTinhTrang": "-1",
                    "TenTinhTrang": "-- Tất cả tình trạng --",
                    "TinhTrangID": -1
                }].concat(res.data.data.GetAllTinhTrangResult)
            })
        }
        else {
            this.setState({ dataTT: [] })
        }
    }

    _FilterDVC = (e) => {
        const {
            dataDV,
            selectDV,
            dataTT,
            selectTT,
            dateFrom,
            dateTo,
        } = this.state;
        Utils.goscreen(this, "Modal_SearchFilterDVC", {
            "event": e.nativeEvent,
            dataDV: dataDV,
            selectDV: selectDV,
            dataTT: dataTT,
            selectTT: selectTT,
            datefrom: dateFrom,
            dateTo: dateTo,
            callback: this.callBackFilter
        })
    }

    callBackFilter = (selectDV, selectTT, dateFrom, dateTo) => {
        this.setState({
            selectDV,
            selectTT,
            dateFrom,
            dateTo
        }, this.getData)
    }

    //GỬI HỒ SƠ
    HandleSend = async (item) => {
        if (item.HoSoID != '') {
            Utils.showMsgBoxYesNo(this, 'Thông báo', 'Bạn có chắc muốn gửi hồ sơ này ?', 'Đồng ý', 'Xem lại', async () => {
                //Gọi API sửa , thông báo thành công gửi back ra ngoài
                let dataBodySend = new FormData();
                let obj = JSON.stringify(
                    { "HoSoID": item.HoSoID, "TinhTrang": "THS" }
                )
                // Utils.nlog('body gui', obj)
                dataBodySend.append("data", obj)
                this.setState({ statusLoading: 'Đang gửi...', loadingUpfile: true })
                nthisIsLoading.show()
                let res = await apis.ApiDVC.SendDKTTHC(dataBodySend)
                Utils.nlog('res send ====================', res)
                if (res.status == 1 && res.data) {
                    let { data } = res.data
                    if (data) {
                        Utils.showMsgBoxOK(this, 'Thông báo', 'Gửi thành công!', 'Xác nhận', () => {
                            nthisIsLoading.hide()
                            this._onRefresh()
                        })
                    } else {
                        Utils.showMsgBoxOK(this, 'Thông báo', 'Gửi thất bại!', 'Xác nhận', () => {
                            nthisIsLoading.hide()
                            this._onRefresh()
                        })
                    }
                } else {
                    Utils.showMsgBoxOK(this, 'Thông báo', 'Gửi thất bại!', 'Xác nhận', () => {
                        nthisIsLoading.hide()
                        this._onRefresh()
                    })
                }
            })
        }
    }

    //Bổ sung hồ sơ
    BoSungHoSo = (item) => {
        let params = {
            TenThuTuc: item.TenThuTuc,
            DonViID: item.MaTraCuu,
            ThuTucHanhChinhID: item.VanBanTraLoi,
            ...item
            // DonViID: 0,
            // LinhVucID: 0,
            // MucDo: 0
        }
        Utils.goscreen(this, 'ctthutuc', { itemThuTuc: params, isBoSung: true, callback: this._onRefresh })
    }

    _renderItem = ({ item, index }) => {
        // Utils.nlog('item ', item)
        let { dataTT, selectTT } = this.state
        let TinhTrang = {
            "MaTinhTrang": "-1",
            "TenTinhTrang": "-- Tất cả tình trạng --",
            "TinhTrangID": -1
        }
        let find = dataTT.findIndex(e => e.TenTinhTrang == item.TenTinhTrang)
        if (find != -1) {
            TinhTrang = dataTT[find]
        }
        // Utils.nlog('find tinh trang', TinhTrang)
        return (
            <View key={index} style={{ backgroundColor: colors.white, marginBottom: 5, paddingHorizontal: 10, paddingVertical: 10, borderRadius: 3 }}>
                <View style={{ justifyContent: 'space-between', flexDirection: 'row', flex: 1 }}>
                    <Text numberOfLines={1} style={{ fontSize: reText(15), fontWeight: 'bold', color: colors.colorChuyenMuc, width: Width(40) }}>{item.HoTenNguoiNop}</Text>
                    <View style={{ backgroundColor: colors.colorChuyenMuc, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 3, alignSelf: 'center', maxWidth: Width(50) }}>
                        <Text numberOfLines={1} style={{ color: colors.white, fontWeight: 'bold', fontSize: reText(13) }}>{item.TenTinhTrang}</Text>
                    </View>
                </View>
                <Text style={{ color: colors.black_80, marginTop: -4, fontSize: reText(13) }}>({item.TenDonVi})</Text>
                <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 3 }}>
                    <Text style={{ fontSize: reText(12), color: colors.black_80 }}>Ngày đăng ký: {item.NgayNop}</Text>
                    <Text style={{ fontSize: reText(12), color: colors.black_80 }}>Ngày gửi: {item.NgayGoi}</Text>
                </View>
                <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 3 }}>
                    <Text style={{ fontSize: reText(12), color: colors.black_80 }}>Ngày tiếp nhận: {item.NgayNhan ? item.NgayNhan : '---'}</Text>
                    <Text style={{ fontSize: reText(12), color: colors.black_80 }}>Ngày hẹn trả: {item.NgayHenTra ? item.NgayHenTra : '---'}</Text>
                </View>
                <Text style={{ marginTop: 3, fontWeight: '600', fontSize: reText(14), color: colors.orange }}>{item.TenLoaiHoSo}</Text>
                <Text style={{ marginTop: 3, fontSize: reText(12), fontStyle: 'italic', color: colors.black_80 }}>Nội dung: {item.NoiDung ? item.NoiDung : '---'}</Text>
                {/* <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 3, flex: 1,alignSelf:'end' }}> */}
                {/* <View style={{ borderWidth: 0.5, paddingVertical: 3, paddingHorizontal: 5, borderRadius: 3 }}>
                        <Text style={{ fontSize: reText(12), color: colors.black_80 }}>{item.TenDonVi ? item.TenDonVi : ''} </Text >
                    </View> */}
                <View style={{ borderWidth: 0.5, paddingVertical: 3, paddingHorizontal: 5, borderRadius: 3, alignSelf: 'flex-start', marginTop: 3 }}>
                    <Text style={{ fontSize: reText(12), color: colors.black_80 }}>{item.TenLinhVuc ? item.TenLinhVuc : ''} </Text>
                </View>
                {/* //cổng thanh toán */}


                {/* </View> */}
                {/* {GIAO DIỆN GỬI / BỔ SUNG HỒ SƠ} */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    {item.DaThanhToan == '0' && item.ThanhToan == "1" ?
                        <TouchableOpacity onPress={() => Utils.goscreen(this, "scThanhToan", {
                            IDHS: item.HoSoID,
                            callBack: () => { Utils.goscreen(this, 'hosodagui'), this._onRefresh() }
                        })} style={{
                            padding: 10, backgroundColor: colors.colorKellyGreen, marginVertical: 5,
                            borderRadius: 5, alignItems: 'center', flex: 1
                        }}>
                            <Text style={{ color: colors.white, fontWeight: 'bold' }}>{'Thanh toán'}</Text>
                        </TouchableOpacity>
                        : null}
                    {item.DaThanhToan == '1' ?
                        <TouchableOpacity onPress={() => Utils.goscreen(this, "Modal_BienLaiTT", {
                            IDHS: item.HoSoID
                        })} style={{
                            padding: 10, backgroundColor: colors.colorGrayLight, marginVertical: 5,
                            borderRadius: 5, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', flex: 1
                        }}>
                            <Image source={Images.icBill} style={[nstyles.nIcon20, { tintColor: colors.white }]} />
                            <Text style={{ color: colors.white, fontWeight: 'bold', paddingHorizontal: 5 }}>{'Xem biên lai'}</Text>
                        </TouchableOpacity>
                        : null}
                    <View style={{ paddingHorizontal: 5 }} />
                    {
                        TinhTrang.TinhTrangID == 1 ?
                            <TouchableOpacity onPress={() => this.HandleSend(item)} style={{ padding: 10, backgroundColor: colors.orangCB, marginVertical: 5, borderRadius: 5, alignItems: 'center', flex: 1 }}>
                                <Text style={{ color: colors.white, fontWeight: 'bold' }}>{'Gửi hồ sơ'}</Text>
                            </TouchableOpacity>
                            : null
                    }
                    {TinhTrang.TinhTrangID == 4 ?
                        <TouchableOpacity onPress={() => this.BoSungHoSo(item)} style={{ padding: 10, backgroundColor: colors.colorBlueP, marginVertical: 5, borderRadius: 5, alignItems: 'center', flex: 1 }}>
                            <Text style={{ color: colors.white, fontWeight: 'bold' }}>{'Bổ sung hồ sơ'}</Text>
                        </TouchableOpacity> : null}

                    {/* DaThanhToan */}
                    {/* <TouchableOpacity onPress={() => this.BoSungHoSo(item)} style={{ padding: 10, backgroundColor: colors.colorBlueP, marginVertical: 5, borderRadius: 5, alignItems: 'center', flex: 1 }}>
                        <Text style={{ color: colors.white, fontWeight: 'bold' }}>{'Bổ sung hồ sơ'}</Text>
                    </TouchableOpacity> */}
                </View>

            </View >
        )
    }
    render() {
        const { dataHoSo } = this.state;
        return (
            <View style={{ backgroundColor: colors.BackgroundHome, flex: 1 }}>
                <HeaderCus
                    Sleft={{ tintColor: 'white' }}
                    onPressLeft={() => Utils.goscreen(this, 'ManHinh_Home')}
                    iconLeft={Images.icBack}
                    iconRight={Images.icFilter}
                    Sright={{ tintColor: 'white' }}
                    onPressRight={(e) => this._FilterDVC(e)}
                    title={`Kho dữ liệu cá nhân`}
                    styleTitle={{ color: colors.white }}
                />
                <FlatList
                    style={{ paddingHorizontal: 10, marginVertical: 10 }}
                    data={dataHoSo}
                    renderItem={this._renderItem}
                    ListEmptyComponent={this.state.refreshing ? <ListEmpty textempty={'Đang tải dữ liệu'} isImage={false} /> : <ListEmpty textempty={'Không có dữ liệu'} />}
                    keyExtractor={(item, index) => index.toString()}
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh}
                />
                {/* <IsLoadingNew /> */}
                <IsLoading />
            </View>
        )
    }
}
const mapStateToProps = state => ({
    auth: state.auth,
    theme: state.theme
});
export default Utils.connectRedux(HoSoDaGui, mapStateToProps, true);
