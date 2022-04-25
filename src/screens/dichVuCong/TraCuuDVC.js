import React, { Component } from 'react'
import { ImageStore, ScrollView, TextInput, FlatList, Platform, Keyboard, BackHandler } from 'react-native'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { GetDataDonVi_TraCuu, TraCuuTTHSClick } from '../../apis/apiDVC'
import Utils from '../../../app/Utils'
import { Images } from '../../images'
import { colors } from '../../../styles'
import { reText, sizes } from '../../../styles/size'
import { Height, nstyles, paddingTopMul, Width } from '../../../styles/styles'
import moment from 'moment'
import { ListEmpty, IsLoadingNew, HeaderCus, ButtonCom, IsLoading } from '../../../components'
import ModalDrop from '../../../srcAdmin/screens/PhanAnhHienTruong/components/ModalDrop'
// import ModalDrop from '../../../components/ModalDrop'

const dataLocTheo = [
    {
        Key: 1,
        Value: 'Số giấy tờ tùy thân',
    },
    {
        Key: 2,
        Value: 'Số điện thoại',
    },
    {
        Key: 3,
        Value: 'Số biên nhận',
    }
]
export class TraCuuDVC extends Component {
    constructor(props) {
        super(props)
        this.dataQR = Utils.ngetParam(this, 'dataQR')
        this.state = {
            giayto: '',
            sdt: '',
            Search: '',
            dataTraCuu: [],
            // dataCapHuyen: [],
            // dataCapTinh: [],
            // dataCapXa: [],
            IsCheck: false,
            selectFilter: dataLocTheo[0]

        }
    }
    componentDidMount() {
        if (this.dataQR) {
            this.setState({
                selectFilter: dataLocTheo[2]
            }, () => {
                this._callBack(this.dataQR)
            })
        }
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
    // GetDataDonVi_TraCuu = async () => {
    //     const res = await GetDataDonVi_TraCuu();
    //     if (res.status == 1) {
    //         this.setState({
    //             dataCapTinh: res.data.CT.V_DICHVUCONG_DONVI_LstStringResult,
    //             dataCapHuyen: res.data.CH.V_DICHVUCONG_DONVI_LstStringResult,
    //             dataCapXa: res.data.CX.V_DICHVUCONG_DONVI_LstStringResult,
    //         })
    //     }
    //     // Utils.nlog('Gia tri item <>======', this.state.dataCapHuyen)
    // }
    getTraCuuHoSo = async () => {
        Keyboard.dismiss()
        let { selectFilter, Search } = this.state

        if (this.state.Search == '') {
            Utils.showMsgBoxOK(this, "Thông báo", "Vui lòng nhập " + selectFilter.Value.toLowerCase(), 'Xác nhận')
            return;
        }
        this.setState({ dataTraCuu: [] })
        nthisIsLoading.show();
        let dataBoDy = new FormData();
        let obj = {
            "SoBienNhan": '',
            "SoGiayTo": '',
            "SoDienThoai": ''
        }
        switch (selectFilter.Key) {
            case 1:
                obj = { ...obj, "SoGiayTo": Search }
                break;
            case 2:
                obj = { ...obj, "SoDienThoai": Search }
                break;
            case 3:
                obj = { ...obj, "SoBienNhan": Search }
                break;
            default:
                break;
        }
        obj = JSON.stringify(obj)
        dataBoDy.append("data", obj)
        Utils.nlog('body', obj)
        const res = await TraCuuTTHSClick(dataBoDy);
        Utils.nlog('res tra cứu', res)
        if (res.status == 1) {
            nthisIsLoading.hide();
            this.setState({
                dataTraCuu: res.data.data.SelectDanhSachHoSoResult,
                // IsCheck: res.data.data.SelectDanhSachHoSoResult[0] ? true : false
            })
        }
        else {
            nthisIsLoading.hide();
        }
    }
    _callBack = (vals) => {
        this.setState({ Search: vals }, () => this.getTraCuuHoSo())
    }

    _renderItem = ({ item, index }) => {
        Utils.nlog("item", item)
        return (
            <TouchableOpacity onPress={() => Utils.goscreen(this, 'Modal_ChiTietTB', { SoBienNhan: item.SoBienNhan })} key={index}
                style={{ backgroundColor: colors.white, paddingVertical: 10, paddingHorizontal: 10, marginBottom: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: colors.black_80, fontSize: reText(14), fontWeight: 'bold', maxWidth: Width(42) }}>{item.HoTenNguoiNop}</Text>
                    <View style={{ borderRadius: 4, borderWidth: 0.5, paddingHorizontal: 10, paddingVertical: 5, borderColor: colors.orangCB }}>
                        <Text style={{ color: colors.orangCB, fontSize: reText(14), fontWeight: 'bold', maxWidth: Width(42) }}>{item.TenTinhTrang}</Text>
                    </View>
                </View>
                <Text style={{ color: colors.colorTextSelect, fontSize: reText(14), fontWeight: 'bold', marginTop: 3 }}>{item.SoBienNhan}</Text>
                <Text style={{ color: colors.black_80, fontSize: reText(12), fontWeight: 'bold', marginTop: 3 }}>Tên thủ tục: {item.TenThuTuc}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 3 }}>
                    <Text style={{ fontStyle: 'italic', fontWeight: '300', fontSize: reText(12) }}>Ngày nhận: {item.NgayNhan}</Text>
                    <Text style={{ fontStyle: 'italic', fontWeight: '300', fontSize: reText(12) }}>Ngày hẹn trả: {item.NgayHenTra}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    scanQR = () => {
        this.setState({
            selectFilter: dataLocTheo[2]
        }, () => {
            Utils.goscreen(this, 'Modal_QrHome', { callback: this._callBack, fromDSTraCuu: true })
        })
    }

    render() {
        const { dataTraCuu, IsCheck, dataCapTinh, dataCapXa, dataCapHuyen, selectFilter } = this.state;
        // const resultH = dataTraCuu ? dataCapHuyen.filter(dataCapHuyen => dataCapHuyen.DonViID == dataTraCuu.DonViID) : [];
        // const resultT = dataTraCuu ? dataCapTinh.filter(dataCapTinh => dataCapTinh.DonViID == dataTraCuu.DonViID) : [];
        // const resultX = dataTraCuu ? dataCapXa.filter(dataCapXa => dataCapXa.DonViID == dataTraCuu.DonViID) : []
        // const TenCoQuan = resultH[0]?.TenDonVi ? resultH[0]?.TenDonVi : resultT[0]?.TenDonVi ? resultT[0]?.TenDonVi : resultX[0]?.TenDonVi ? resultX[0]?.TenDonVi : '';
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: colors.BackgroundHome, }]}>
                <HeaderCus
                    Sleft={{ tintColor: 'white' }}
                    onPressLeft={this.dataQR ? () => Utils.goback(this) : () => Utils.goscreen(this, 'ManHinh_Home')}
                    iconLeft={Images.icBack}
                    title={'Tra cứu trạng thái hồ sơ'}
                    styleTitle={{ color: colors.white }}
                    iconRight={Images.icQrCode}
                    onPressRight={this.scanQR}
                />
                <View style={nstyles.nbody}>
                    <View style={[nstyles.shadow, { paddingHorizontal: 10, paddingTop: 5 }]}>
                        <ScrollView scrollEnabled={false} style={{ paddingVertical: 10 }}>
                            <ModalDrop
                                value={selectFilter}
                                keyItem={'Key'}
                                texttitle={'Tìm kiếm'}
                                styleLabel={{ fontSize: reText(14) }}
                                // styleContent={{ }}
                                dropdownTextStyle={{ paddingHorizontal: 5, width: '100%', fontSize: reText(13) }}
                                options={dataLocTheo}
                                onselectItem={(item) => this.setState({ selectFilter: item })}
                                Name={"Value"} />
                        </ScrollView>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10 }}>
                        <View style={[nstyles.shadow, { width: Width(70), backgroundColor: colors.white, paddingHorizontal: 10, borderRadius: 5, height: 42 }]}>
                            <TextInput
                                placeholder={`Nhập ${selectFilter.Value.toLowerCase()}`}
                                placeholderTextColor={colors.black_16}
                                style={{ textAlign: 'left', flex: 1, fontSize: reText(15), color: colors.black_80 }}
                                value={this.state.Search}
                                onChangeText={(text) => this.setState({ Search: text })}
                            />
                        </View>
                        <ButtonCom
                            text={'Tra cứu'}
                            onPress={this.getTraCuuHoSo}
                            style={{ borderRadius: 5, flex: 1, marginLeft: 5 }}
                            txtStyle={{ fontSize: reText(14) }}
                        />
                    </View>
                    <FlatList
                        style={{ marginHorizontal: 10, marginTop: 10, marginBottom: 15 }}
                        data={dataTraCuu}
                        renderItem={this._renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        ListEmptyComponent={<ListEmpty textempty={'Không có dữ liệu'} />}
                    />
                </View>
                <IsLoading />
            </View >
        )
    }
}
const mapStateToProps = state => ({
    theme: state.theme
});

export default Utils.connectRedux(TraCuuDVC, mapStateToProps, true)
