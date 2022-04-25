import React, { Component, createRef } from 'react';
import { View, Text, StyleSheet, BackHandler, TouchableOpacity, Image } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Utils, { icon_typeToast } from '../../../app/Utils';
import { ButtonCom, HeaderCus, IsLoading } from '../../../components';
import { colors } from '../../../styles';
import FontSize from '../../../styles/FontSize';
import { reText } from '../../../styles/size';
import { Height, nstyles, Width } from '../../../styles/styles';
import apis from '../../apis';
import { Images } from '../../images';
import { ComponentUI, DropDownUI, InputUI, ListCheck } from './CompGeneral';
import { KeyComp, KeyTiem, KeyUIDetailsHistory, KeyUIResultQR } from './KeyTiem';

class KetQuaQuetMaTiem extends React.PureComponent {
    constructor(props) {
        super(props);
        this.item = Utils.ngetParam(this, 'item', '')
        this.qrcode = Utils.ngetParam(this, 'qrcode', '')
        this.callbackQR = Utils.ngetParam(this, 'callbackQR', () => { })
        this.state = {
            item: this.item ? this.item : '',
            qrcode: this.qrcode ? this.qrcode : '',
            template: this.item ? KeyUIResultQR[this.item.KeyTiem] : [],

            //Value UI
            listvaccine: [],
            selectedvaccine: {},
            listlovaccine: [],
            selectedlovaccine: {},
            ghichu: '',
            trieuchung: '',
            infoNguoiTiem: '',
            saiDiaDiem: true, // xem nguoi đó có đúng địa điểm hay không
        };
        this.refLoading = createRef()
        this.refListCheck = createRef()
    }

    componentDidMount() {
        this.getData()
        BackHandler.addEventListener('hardwareBackPress', this.backAction)
    }

    getData = async () => {
        this.refLoading.current.show()
        await this.getList_Vaccine()
        await this.getInfoUser()
        this.refLoading.current.hide()
    }

    getList_Vaccine = async () => {
        if (this.item.KeyTiem == KeyTiem.XACNHANTIEMCHUNG) {
            let res = await apis.ApiQLTaiDiemTiem.List_Vaccine()
            Utils.nlog('[LOG res list vaccine: ', res)
            if (res.status == 1 && res.data) {
                this.setState({ listvaccine: res.data })
            } else {
                this.setState({ listvaccine: [] })
            }
        }
    }

    getInfoUser = async () => {
        Utils.nlog('[LOG body: ', this.qrcode)
        let res = await apis.ApiQLTaiDiemTiem.GetInfoNguoiTiemChung(this.qrcode)
        Utils.nlog('[LOG] data user', res)
        if (res.status == 1) {
            this.setState({ infoNguoiTiem: res.data, saiDiaDiem: false })
        } else if (res.status == 2) {
            this.setState({ infoNguoiTiem: res.data, saiDiaDiem: true }, () => {
                let diadiemdung = `${res.data?.DiaChi_DiemDung ? res.data?.DiaChi_DiemDung + ', ' : ''}${res.data?.PhuongXa_DiemDung ? res.data?.PhuongXa_DiemDung + ', ' : ''}${res.data?.QuanHuyen_DiemDung ? res.data?.QuanHuyen_DiemDung + ', ' : ''}${res.data?.TinhThanh_DiemDung ? res.data?.TinhThanh_DiemDung : ''}`
                Utils.showMsgBoxOK(this, 'Thông báo', `${diadiemdung ? 'Địa điểm tiêm của bạn là: ' + diadiemdung : ''}\nVui lòng đến đúng địa điểm để tiêm vaccine.`, 'Xác nhận', () => {
                    this.callbackQR()
                    Utils.goback(this)
                })
            })
        } else {
            this.setState({ infoNguoiTiem: '', saiDiaDiem: true }, () => {
                Utils.showMsgBoxOK(this, 'Thông báo', `Không tìm thấy thông tin người dùng có số điện thoại: ${this.qrcode.SDT}`, 'Xác nhận', () => {
                    this.callbackQR()
                    Utils.goback(this)
                })
            })
            return;
        }
    }

    backAction = () => {
        this.goBack()
        return true
    }

    componentWillUnmount() {
        try {
            BackHandler.removeEventListener('hardwareBackPress', this.backAction)
        } catch (error) {

        }
    }

    goBack = () => {
        this.callbackQR()
        Utils.goback(this)
    }

    viewItem = (item, value) => {
        return (
            <View key={item.id} style={{ flex: 1, paddingVertical: FontSize.scale(15), borderBottomColor: colors.black_50 }}>
                <Text style={{ textAlign: 'center', color: colors.black_60 }} >{item[value].toUpperCase() || ''} - {item?.Lot} - SL: {item?.TongSoLuong}</Text>
            </View>
        )
    }
    changeDataSelected = (key, val) => {
        switch (key) {
            case KeyComp.DROPDOWN_TENVACCIN:
                this.setState({ selectedvaccine: val })
                break;
            case KeyComp.DROPDOWN_SOLOVACCIN:

                break;
            default:
                break;
        }
    }

    handleUI = (key, text) => {
        const { selectedvaccine, selectedlovaccine, listvaccine, listlovaccine } = this.state
        switch (key) {
            case KeyComp.DROPDOWN_TENVACCIN:
                Utils.navigate('Modal_ComponentSelectBottom', {
                    callback: (val) => this.changeDataSelected(key, val),
                    "item": selectedvaccine || {},
                    "title": `Danh sách ${KeyComp.DROPDOWN_TENVACCIN.label.toLowerCase()}`,
                    "AllThaoTac": listvaccine || [],
                    "ViewItem": (i) => this.viewItem(i, KeyComp.DROPDOWN_TENVACCIN.keyView),
                    "Search": false,
                    "key": KeyComp.DROPDOWN_TENVACCIN.keyView
                })
                break;
            case KeyComp.DROPDOWN_SOLOVACCIN:
                Utils.navigate('Modal_ComponentSelectBottom', {
                    callback: (val) => this.changeDataSelected(key, val),
                    "item": selectedlovaccine || {},
                    "title": `Danh sách ${KeyComp.DROPDOWN_SOLOVACCIN.label.toLowerCase()}`,
                    "AllThaoTac": listlovaccine || [],
                    "ViewItem": (i) => this.viewItem(i, KeyComp.DROPDOWN_SOLOVACCIN.keyView),
                    "Search": false,
                    "key": KeyComp.DROPDOWN_SOLOVACCIN.keyView
                })
                break;
            case KeyComp.INPUT_GHICHU:
                this.setState({ ghichu: text })
                break;
            case KeyComp.INPUT_TRIEUCHUNG:
                this.setState({ trieuchung: text })
                break;
            default:
                break;
        }
    }

    checkInDiemTiem = async () => {
        let res = ``
        let bodyQR = this.qrcode
        Utils.nlog('[LOG] BODY CHECK IN', bodyQR)
        this.refLoading.current.show()
        res = await apis.ApiQLTaiDiemTiem.CheckInDiemTiem(bodyQR)
        this.refLoading.current.hide()
        Utils.nlog('[LOG] RES BODY CHECK IN', res)
        if (res.status == 1) {
            Utils.showToastMsg("Thông báo", `${this.item.name.replace('\n', ' ')} thành công.`, icon_typeToast.success);
            return this.goBack()
        } else {
            Utils.showToastMsg("Thông báo", `${this.item.name.replace('\n', ' ')} thất bại. ${res.message}`, icon_typeToast.danger);
            return;
        }
    }

    ketQuaLamSang = async (keyButton) => {
        const { ghichu } = this.state
        Utils.showMsgBoxYesNo(this, 'Thông báo', `Bạn có muốn thực hiện hành động: ${keyButton.label.toLowerCase()}?`,
            'Thực hiện',
            'Huỷ bỏ',
            async () => {
                let bodyQR = {
                    ...this.qrcode,
                    "KetQuaLamSang": keyButton.action,
                    "Note": ghichu
                }
                Utils.nlog('[LOG] KQ LAM SAN', bodyQR)
                this.refLoading.current.show()
                let res = res = await apis.ApiQLTaiDiemTiem.CheckQRDiemTiem_KetQuaKhamSangLoc(bodyQR)
                this.refLoading.current.hide()
                Utils.nlog('[LOG] KQ LAM SAN', res)
                if (res.status == 1) {
                    
                    Utils.showToastMsg("Thông báo", `Thực hiện hành động: ${keyButton.label.toLowerCase()} thành công.`, icon_typeToast.success);
                    return this.goBack()
                } else {
                    Utils.showToastMsg("Thông báo", `Thực hiện hành động: ${keyButton.label.toLowerCase()} thất bại. ${res.message}`, icon_typeToast.danger);
                    return;
                }
            })
    }

    xacNhanTiemChung = async () => {
        const { selectedvaccine } = this.state
        if (!selectedvaccine?.Tenvaccine && !selectedvaccine?.Lot) {
            Utils.showToastMsg("Thông báo", "Vui lòng chọn vaccine.", icon_typeToast.warning);
            return
        } else {
            let bodyQR = {
                ...this.qrcode,
                "TenVaccine": selectedvaccine?.Tenvaccine,
                "Lot": selectedvaccine?.Lot,
            }
            Utils.nlog('[LOG] BODY CHECK IN', bodyQR)
            this.refLoading.current.show()
            let res = await apis.ApiQLTaiDiemTiem.CheckQRDiemTiem_SauKhiTiem(bodyQR)
            this.refLoading.current.hide()
            Utils.nlog('[LOG] RES BODY CHECK IN', res)
            if (res.status == 1) {
                Utils.showToastMsg("Thông báo", `${this.item.name.replace('\n', ' ')} thành công.`, icon_typeToast.success);
                return this.goBack()
            } else {
                Utils.showToastMsg("Thông báo", `${this.item.name.replace('\n', ' ')} thất bại. ${res.message}`, icon_typeToast.danger);
                return;
            }
        }
    }

    trieuChungSauTiem = async () => {
        const { trieuchung, infoNguoiTiem } = this.state
        const listTrieuChung = this.refListCheck.current.getData()
        let bodyQR = {
            ...this.qrcode,
            "Note": trieuchung,
            "TinhHinhSucKhoe": listTrieuChung.map(e => { return e.Id }),
            "TenVaccine": infoNguoiTiem?.TenVaccine,
            "Lot": infoNguoiTiem?.Lot
        }
        Utils.nlog('[LOG] BODY CHECK IN', JSON.stringify(bodyQR))
        this.refLoading.current.show()
        let res = await apis.ApiQLTaiDiemTiem.CheckQRDiemTiem_TrieuChungSauTiem(bodyQR)
        this.refLoading.current.hide()
        Utils.nlog('[LOG] RES BODY CHECK IN', res)
        if (res.status == 1) {
            Utils.showToastMsg("Thông báo", `${this.item.name.replace('\n', ' ')} thành công.`, icon_typeToast.success);
            return this.goBack()
        } else {
            Utils.showToastMsg("Thông báo", `${this.item.name.replace('\n', ' ')} thất bại. ${res.message}`, icon_typeToast.danger);
            return;
        }
    }

    confirm = async (keyButton) => {
        switch (this.item?.KeyTiem) {
            case KeyTiem.CHECKIN:
                //Xử lý nút xác nhận màn hình checkin
                this.checkInDiemTiem()
                break;
            case KeyTiem.KQLAMSAN:
                //Xử lý các button ở màn hình lq lam san
                this.ketQuaLamSang(keyButton)
                break;
            case KeyTiem.XACNHANTIEMCHUNG:
                //Xử lý nút xác nhận màn hình xác nhận tiêm chủng
                this.xacNhanTiemChung()
                break;
            case KeyTiem.TRIEUCHUNG:
                //Xử lý nút xác nhận màn hình triệu chứng
                this.trieuChungSauTiem()
                break;
            default:
                break;
        }
    }

    renderUI = (key) => {
        const { template, selectedvaccine, ghichu, trieuchung, infoNguoiTiem, saiDiaDiem } = this.state
        const { TinhHinhSucKhoe, DiemTiem } = this.props.datahcm
        const tenLocVacccine = `${selectedvaccine?.Tenvaccine ? selectedvaccine?.Tenvaccine + ' - ' : ''}${selectedvaccine?.Lot ? selectedvaccine?.Lot + ' - ' : ''}${selectedvaccine?.TongSoLuong ? 'SL:' + selectedvaccine?.TongSoLuong : ''}`
        const display = template.findIndex(e => e.id == key.id)
        if (display != -1) {
            switch (key) {
                case KeyComp.HOTEN:
                    return <ComponentUI item={KeyComp.HOTEN} value={infoNguoiTiem?.HoTen ? infoNguoiTiem?.HoTen : ''} />
                case KeyComp.SDT:
                    return <ComponentUI item={KeyComp.SDT} value={infoNguoiTiem?.SDT ? infoNguoiTiem?.SDT : ''} />
                case KeyComp.CMND:
                    return <ComponentUI item={KeyComp.CMND} value={infoNguoiTiem?.CMND ? infoNguoiTiem?.CMND : ''} />
                case KeyComp.NOITIEM:
                    return <ComponentUI item={KeyComp.NOITIEM} value={`${infoNguoiTiem?.DiaChi_DiemDung ? infoNguoiTiem?.DiaChi_DiemDung + ', ' : ''}${infoNguoiTiem?.PhuongXa_DiemDung ? infoNguoiTiem?.PhuongXa_DiemDung + ', ' : ''}${infoNguoiTiem?.QuanHuyen_DiemDung ? infoNguoiTiem?.QuanHuyen_DiemDung + ', ' : ''}${infoNguoiTiem?.TinhThanh_DiemDung ? infoNguoiTiem?.TinhThanh_DiemDung : ''}`} />
                case KeyComp.TENVACCIN:
                    return <ComponentUI item={KeyComp.TENVACCIN} value={infoNguoiTiem?.TenVaccine ? infoNguoiTiem?.TenVaccine : ''} />
                case KeyComp.LOVACCIN:
                    return <ComponentUI item={KeyComp.LOVACCIN} value={infoNguoiTiem?.Lot ? infoNguoiTiem?.Lot : ''} />
                // case KeyComp.GHICHU:
                //     return <ComponentUI item={KeyComp.GHICHU} value={''} />
                // case KeyComp.PHANUNGSAUTIEM:
                //     return <ComponentUI item={KeyComp.PHANUNGSAUTIEM} value={''} />
                case KeyComp.BUTTON_XACNHAN:
                    return <ButtonCom
                        onPress={() => this.confirm(KeyComp.BUTTON_XACNHAN)}
                        Linear={true}
                        disabled={this.item.KeyTiem == KeyTiem.CHECKIN && saiDiaDiem ? true : false}
                        colorChange={KeyComp.BUTTON_XACNHAN.colorchange}
                        shadow={false}
                        txtStyle={{ color: colors.white, fontSize: reText(13) }}
                        style={stKetQuaQuetMaTiem.button}
                        text={KeyComp.BUTTON_XACNHAN.label}
                    />
                case KeyComp.BUTTON_KHONGDONGYTIEM:
                    return <ButtonCom
                        onPress={() => this.confirm(KeyComp.BUTTON_KHONGDONGYTIEM)}
                        Linear={true}
                        colorChange={KeyComp.BUTTON_KHONGDONGYTIEM.colorchange}
                        shadow={false}
                        txtStyle={{ color: colors.white, fontSize: reText(13) }}
                        style={stKetQuaQuetMaTiem.button}
                        text={KeyComp.BUTTON_KHONGDONGYTIEM.label}
                    />
                case KeyComp.BUTTON_CHONGCHIDINH:
                    return <ButtonCom
                        onPress={() => this.confirm(KeyComp.BUTTON_CHONGCHIDINH)}
                        Linear={true}
                        colorChange={KeyComp.BUTTON_CHONGCHIDINH.colorchange}
                        shadow={false}
                        txtStyle={{ color: colors.white, fontSize: reText(13) }}
                        style={stKetQuaQuetMaTiem.button}
                        text={KeyComp.BUTTON_CHONGCHIDINH.label}
                    />
                case KeyComp.BUTTON_HOANTIEM:
                    return <ButtonCom
                        onPress={() => this.confirm(KeyComp.BUTTON_HOANTIEM)}
                        Linear={true}
                        colorChange={KeyComp.BUTTON_HOANTIEM.colorchange}
                        shadow={false}
                        txtStyle={{ color: colors.white, fontSize: reText(13) }}
                        style={stKetQuaQuetMaTiem.button}
                        text={KeyComp.BUTTON_HOANTIEM.label}
                    />
                case KeyComp.BUTTON_DUDIEUKIEN:
                    return <ButtonCom
                        onPress={() => this.confirm(KeyComp.BUTTON_DUDIEUKIEN)}
                        Linear={true}
                        colorChange={KeyComp.BUTTON_DUDIEUKIEN.colorchange}
                        shadow={false}
                        txtStyle={{ color: colors.white, fontSize: reText(13) }}
                        style={stKetQuaQuetMaTiem.button}
                        text={KeyComp.BUTTON_DUDIEUKIEN.label}
                    />

                case KeyComp.DROPDOWN_TENVACCIN:
                    return <DropDownUI item={KeyComp.DROPDOWN_TENVACCIN} placeholder={KeyComp.DROPDOWN_TENVACCIN.placeholder} value={tenLocVacccine} onPressDrop={() => { this.handleUI(key) }} />
                // case KeyComp.DROPDOWN_SOLOVACCIN:
                //     return <DropDownUI item={KeyComp.DROPDOWN_SOLOVACCIN} placeholder={KeyComp.DROPDOWN_SOLOVACCIN.placeholder} value={''} onPressDrop={() => { this.handleUI(key) }} />
                case KeyComp.INPUT_GHICHU:
                    return <InputUI
                        item={KeyComp.INPUT_GHICHU}
                        value={ghichu}
                        placeholder={KeyComp.INPUT_GHICHU.placeholder}
                        onChangeText={(text) => { this.handleUI(key, text) }}
                        onTouchText={(text) => { this.setState({ ghichu: ghichu + text }) }}
                        keyIndexSuggest={KeyComp.INPUT_TRIEUCHUNG.keyIndexSuggest}
                        keyDisplaySuggest={KeyComp.INPUT_TRIEUCHUNG.keyDisplaySuggest}
                        listSuggest={[
                            { id: 1, ten: 'Bình thường' },
                            { id: 2, ten: 'Không bình thường' },
                        ]}
                    />
                case KeyComp.INPUT_TRIEUCHUNG:
                    return <InputUI
                        item={KeyComp.INPUT_TRIEUCHUNG}
                        value={trieuchung}
                        placeholder={KeyComp.INPUT_TRIEUCHUNG.placeholder}
                        onChangeText={(text) => { this.handleUI(key, text) }}
                        onTouchText={(text) => { this.setState({ trieuchung: trieuchung + text }) }}
                        keyIndexSuggest={KeyComp.INPUT_TRIEUCHUNG.keyIndexSuggest}
                        keyDisplaySuggest={KeyComp.INPUT_TRIEUCHUNG.keyDisplaySuggest}
                        listSuggest={[
                            { id: 1, ten: 'Bình thường' },
                            { id: 2, ten: 'Không bình thường' },
                        ]}
                    />
                case KeyComp.LIST_CHECK:
                    return <ListCheck
                        item={KeyComp.LIST_CHECK}
                        ref={this.refListCheck}
                        data={TinhHinhSucKhoe}
                        keyIndex={KeyComp.LIST_CHECK.keyIndex}
                        keyDisplay={KeyComp.LIST_CHECK.KeyDisplay}
                    />
                default:
                    break;
            }
        }
    }

    render() {
        const { item, qrcode } = this.state
        return (
            <View style={stKetQuaQuetMaTiem.cover}>
                <HeaderCus
                    onPressLeft={() => { this.goBack() }}
                    iconLeft={Images.icBack}
                    title={item?.name?.replace('\n', ' ').toUpperCase()}
                    styleTitle={stKetQuaQuetMaTiem.titleHeader}
                />
                <View style={stKetQuaQuetMaTiem.body}>
                    <KeyboardAwareScrollView contentContainerStyle={stKetQuaQuetMaTiem.contain}>
                        {this.renderUI(KeyComp.HOTEN)}
                        {this.renderUI(KeyComp.SDT)}
                        {this.renderUI(KeyComp.CMND)}
                        {this.renderUI(KeyComp.TENVACCIN)}
                        {this.renderUI(KeyComp.LOVACCIN)}
                        {this.renderUI(KeyComp.NOITIEM)}
                        {/* {this.renderUI(KeyComp.GHICHU)} */}
                        {/* {this.renderUI(KeyComp.PHANUNGSAUTIEM)} */}
                        {this.renderUI(KeyComp.DROPDOWN_TENVACCIN)}
                        {/* {this.renderUI(KeyComp.DROPDOWN_SOLOVACCIN)} */}

                        {this.renderUI(KeyComp.LIST_CHECK)}
                        {this.renderUI(KeyComp.INPUT_TRIEUCHUNG)}
                        {this.renderUI(KeyComp.INPUT_GHICHU)}
                        {/* {Button} */}
                        <View style={stKetQuaQuetMaTiem.containButton}>
                            {this.renderUI(KeyComp.BUTTON_XACNHAN)}
                            {this.renderUI(KeyComp.BUTTON_DUDIEUKIEN)}
                            {this.renderUI(KeyComp.BUTTON_KHONGDONGYTIEM)}
                            {this.renderUI(KeyComp.BUTTON_CHONGCHIDINH)}
                            {this.renderUI(KeyComp.BUTTON_HOANTIEM)}
                        </View>
                    </KeyboardAwareScrollView>
                    <IsLoading ref={this.refLoading} />
                </View>
            </View>
        );
    }
}

const stKetQuaQuetMaTiem = StyleSheet.create({
    cover: { flex: 1, backgroundColor: colors.white },
    titleHeader: { color: colors.white, fontSize: reText(20) },
    contain: {
        paddingBottom: 50,
    },
    body: { flex: 1 },
    button: {
        marginTop: Height(1.5), borderRadius: 5,
        alignSelf: 'center', paddingHorizontal: 10,
        width: Width(45),
    },
    containButton: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 20
    }
})


const mapStateToProps = state => ({
    auth: state.auth,
    theme: state.theme,
    datahcm: state.datahcm
});
export default Utils.connectRedux(KetQuaQuetMaTiem, mapStateToProps, true);
