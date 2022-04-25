import React, { Component } from 'react'
import { Text, View, TouchableOpacity, Image, ScrollView, BackHandler } from 'react-native'
import { nstyles, paddingTopMul, Width } from '../../../styles/styles'
import { colors } from '../../../styles'
import Utils from '../../../app/Utils'
import { Images } from '../../images'
import { reText } from '../../../styles/size'
import { HeaderCus, IsLoadingNew } from '../../../components'
import { TraCuuTTHSClick, GetDataDonVi_TraCuu } from '../../apis/apiDVC'
import moment from 'moment'
export class ChiTietTB extends Component {
    constructor(props) {
        super(props)
        this.SoBienNhan = Utils.ngetParam(this, 'SoBienNhan')
        this.state = {
            dataTraCuu: [],
            dataCapHuyen: [],
            dataCapTinh: [],
            dataCapXa: [],
        }
    }

    componentDidMount() {
        this.GetDataDonVi_TraCuu();
        this.getTraCuuHoSo();
        BackHandler.addEventListener('hardwareBackPress', this.backAction)
    }

    backAction = () => {
        Utils.goback(this)
        return true
    }

    componentWillUnmount() {
        try {
            BackHandler.removeEventListener('hardwareBackPress', this.backAction)
        } catch (error) {

        }
    }

    backAction = () => {
        Utils.goback(this);
        return true
    }

    componentWillUnmount = async () => {
        try {
            BackHandler.removeEventListener('hardwareBackPress', this.backAction)
        } catch (error) {

        }
    }


    getTraCuuHoSo = async () => {
        nthisIsLoading.show();
        let dataBoDy = new FormData();
        let obj = JSON.stringify({
            "SoBienNhan": this.SoBienNhan,
            "SoGiayTo": '',
            "SoDienThoai": ''
        })
        dataBoDy.append("data", obj)

        const res = await TraCuuTTHSClick(dataBoDy);
        if (res.status == 1) {
            nthisIsLoading.hide();
            this.setState({
                dataTraCuu: res.data.data.SelectDanhSachHoSoResult[0],
            })
        }
        else {
            nthisIsLoading.hide();
        }
    }

    GetDataDonVi_TraCuu = async () => {
        const res = await GetDataDonVi_TraCuu();
        Utils.nlog("<><><>ressss", res)
        if (res.status == 1) {
            this.setState({
                dataCapTinh: res.data.CT.V_DICHVUCONG_DONVI_LstStringResult,
                dataCapHuyen: res.data.CH.V_DICHVUCONG_DONVI_LstStringResult,
                dataCapXa: res.data.CX.V_DICHVUCONG_DONVI_LstStringResult,
            })
        }
        else {
            this.setState({
                dataCapTinh: [],
                dataCapHuyen: [],
                dataCapXa: [],
            })
        }
        // Utils.nlog('Gia tri item <>======', this.state.dataCapHuyen)
        // }
    }
    renderItem = (Title = '', Value) => {
        return (
            <>
                <View style={{
                    flexDirection: 'row', justifyContent: 'space-between',
                    marginHorizontal: 15, padding: 15, backgroundColor: colors.white,
                }}>
                    <Text style={{ fontSize: reText(14), color: colors.colorChuyenMuc, fontWeight: 'bold' }} >{Title}</Text>
                    <Text style={{ fontSize: reText(14), fontWeight: '400', color: colors.black, maxWidth: Width(70), flex: 1, textAlign: 'left', paddingLeft: 15 }} >{Value}</Text>
                </View>
                <View style={{ height: 0.5, backgroundColor: colors.black_16, marginHorizontal: 15 }} />
            </>

        )
    }

    render() {
        const { dataTraCuu, IsCheck, dataCapTinh, dataCapXa, dataCapHuyen } = this.state;
        const resultH = dataTraCuu ? dataCapHuyen.filter(dataCapHuyen => dataCapHuyen.DonViID == dataTraCuu.DonViID) : [];
        const resultT = dataTraCuu ? dataCapTinh.filter(dataCapTinh => dataCapTinh.DonViID == dataTraCuu.DonViID) : [];
        const resultX = dataTraCuu ? dataCapXa.filter(dataCapXa => dataCapXa.DonViID == dataTraCuu.DonViID) : []
        const TenCoQuan = resultH[0]?.TenDonVi ? resultH[0]?.TenDonVi : resultT[0]?.TenDonVi ? resultT[0]?.TenDonVi : resultX[0]?.TenDonVi ? resultX[0]?.TenDonVi : '';
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: colors.BackgroundHome, }]}>
                <HeaderCus
                    Sleft={{ tintColor: 'white' }}
                    onPressLeft={() => Utils.goback(this, null)}
                    iconLeft={Images.icBack}
                    title={`Thông tin chi tiết hồ sơ`}
                    styleTitle={{ color: colors.white }}
                />
                <ScrollView>
                    <View style={{ marginTop: 10 }}>
                        {this.renderItem(`Người đứng tên hồ sơ:`, `${dataTraCuu?.HoTenNguoiNop ? dataTraCuu?.HoTenNguoiNop : '---'}`)}
                        {this.renderItem(`Tên thủ tục:`, `${dataTraCuu?.TenThuTuc ? dataTraCuu?.TenThuTuc : '---'}`)}
                        {this.renderItem(`Số biên nhận:`, `${dataTraCuu?.SoBienNhan ? dataTraCuu?.SoBienNhan : '---'}`)}
                        {this.renderItem(`Ngày tiếp nhận:`, `${dataTraCuu?.NgayNhan ? moment(dataTraCuu?.NgayNhan, 'DD/MM/YYYY').format('DD/MM/YYYY') : ''}`)}
                        {this.renderItem(`Ngày hẹn trả:`, `${dataTraCuu?.NgayHenTra ? moment(dataTraCuu?.NgayHenTra, 'DD/MM/YYYY').format('DD/MM/YYYY') : ''}`)}
                        {this.renderItem(`Cơ quan tiếp nhận:`, `${TenCoQuan}`)}
                        {this.renderItem(`Tình trạng hồ sơ:`, `${dataTraCuu?.TenTinhTrang ? dataTraCuu?.TenTinhTrang : '---'}`)}
                    </View>
                </ScrollView>
                <IsLoadingNew />
            </View>)
    }
}

export default ChiTietTB
