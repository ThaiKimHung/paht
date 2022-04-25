import React, { Component } from 'react'
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native'
import HeaderSVL from '../../../components/HeaderSVL'
import { ImagesSVL } from '../../../images'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { colorsSVL } from '../../../../../styles/color';
import Utils from '../../../../../app/Utils';
import ButtonSVL from '../../../components/ButtonSVL';
import DropDownModal from '../../../components/DropDownModal';
import { nstyles, Width } from '../../../../../styles/styles';
import { reText } from '../../../../../styles/size';
import TextApp from '../../../../../components/TextApp'
import ImageCus from '../../../../../components/ImageCus';

export class Modal_Fillter extends Component {
    constructor(props) {
        super(props)
        this.TypeNguoiTimViec = Utils.ngetParam(this, 'TypeNguoiTimViec', false)
        this.CallBackFillter = Utils.ngetParam(this, 'ObjFillter', () => { })
        this.dataFillter = Utils.ngetParam(this, 'dataFillter', [])
        this.state = {
            selectNganhNghe: { Id: -1, LoaiNganhNghe: '-- Tất cả --' },
            selectHinhThucLV: { IdHinhThuc: -1, TenHinhThuc: '-- Tất cả --' },
            selectMucLuong: { Id: -1, MucLuong: '-- Tất cả --' },
            selectCapBac: { Id: -1, ChucVu: '-- Tất cả --' },
            selectDiaDiem: { IDTinhThanh: -1, TenTinhThanh: '-- Tất cả --' },
            selectKinhNghiem: { Id: -1, KinhNghiem: '-- Tất cả --' },
            selectGioiTinh: { IdGioiTinh: -1, TenGioiTinh: '-- Tất cả --' },
            selectTrinhDo: { Id: -1, TrinhDoVanHoa: '-- Tất cả --' },
            //NguoiTimViec
            selectDoTuoi: { Id: -1, DoTuoi: '-- Tất cả --' },
            selectLoaiHoSo: { IdLoaiHoSo: -1, TenLoaiHoSo: '-- Tất cả --' },
            selectKhuVucLamViec: { IdKhuVucLamViec: -1, KhuVucLamViec: '-- Tất cả --', IDQuanHuyen: -1, IdTinh: -1 },
        }
    }
    componentDidMount() {
        this._getDataFillter()
    }

    _getDataFillter = () => {
        if (this.dataFillter)
            this.setState(this.dataFillter)
    }

    _OnChangTextIndex = (val, index) => {
        switch (index) {
            case 1:
                this.setState({ selectNganhNghe: val })
                break;
            case 2:
                this.setState({ selectHinhThucLV: val })
                break;
            case 3:
                this.setState({ selectMucLuong: val })
                break;
            case 4:
                this.setState({ selectCapBac: val })
                break;
            case 5:
                this.setState({ selectDiaDiem: val })
                break;
            case 6:
                this.setState({ selectKinhNghiem: val })
                break;
            case 7:
                this.setState({ selectGioiTinh: val })
                break;
            case 8:
                this.setState({ selectTrinhDo: val })
                break;
            case 9:
                this.setState({ selectDoTuoi: val })
                break;
            case 10:
                this.setState({ selectLoaiHoSo: val })
                break;
            case 11:
                let textKhuVucLamViec = val?.IDQuanHuyen == -1 && val?.IDTinh == -1 ? 'Tất cả' : `${val?.IDQuanHuyen != -1 ? val?.TenQuanHuyen : 'Quận/Huyện: Tất cả'}, ${val?.IDTinh != -1 ? val?.TenTinhThanh : 'Tỉnh / Thành phố: Tất cả'}`
                this.setState({ selectKhuVucLamViec: { ...val, KhuVucLamViec: textKhuVucLamViec } })
                break;
            default:
                break;
        }
    }

    _goBack = () => {
        Utils.goback(this)
    }

    _CallBackFillter = (item) => {
        this.CallBackFillter(item)
    }

    onChangeAreaWork = () => {
        Utils.goscreen(this, 'Modal_Address', {
            CallBack: (item) => this._OnChangTextIndex(item, 11),
            DataSeleted: this.state.selectKhuVucLamViec
        })
    }

    onApplyFilter = () => {
        this.CallBackFillter(this.state);
        this._goBack()
    }

    render() {
        const { selectNganhNghe, selectHinhThucLV, selectMucLuong, selectCapBac, selectDiaDiem, selectKinhNghiem, selectGioiTinh, selectTrinhDo, selectKhuVucLamViec, selectDoTuoi, selectLoaiHoSo, checkFillter } = this.state;
        const { DataFilter } = this.props.dataSVL
        return (
            <View style={{ flex: 1, backgroundColor: colorsSVL.white }}>
                <HeaderSVL title='Bộ lọc' styleTitleRight={{ maxWidth: Width(20) }} titleRight='Bỏ chọn' Sright={{ color: colorsSVL.grayTextLight }} iconLeft={ImagesSVL.icBackSVL} onPressLeft={this._goBack} onPressRight={this._goBack} />
                <View style={{ flex: 1, }}>
                    <KeyboardAwareScrollView viewIsInsideTabBar={true}
                        scrollToOverflowEnabled={true}
                        showsVerticalScrollIndicator={false}
                        style={{ flex: 1, paddingHorizontal: 10 }} >
                        <DropDownModal
                            styleContainer={{ marginTop: 20 }}
                            label='Ngành nghề'
                            valueSeleted={selectNganhNghe}
                            styleTextTitle={{ fontSize: reText(14), color: selectNganhNghe ? colorsSVL.black : colorsSVL.grayTextLight }}
                            styleImg={nstyles.nIcon12}
                            data={DataFilter?.LstNganhNghe}
                            KeySearch={'LoaiNganhNghe'}
                            isSearch={true}
                            KeyTitle={'LoaiNganhNghe'}
                            CallBack={(item) => this._OnChangTextIndex(item, 1)}
                            stylelabel={{ fontWeight: '700' }}
                            KeyId={'Id'}
                        />
                        <DropDownModal
                            styleContainer={{ marginTop: 20 }}
                            label='Hình thức làm việc'
                            valueSeleted={selectHinhThucLV}
                            styleTextTitle={{ fontSize: reText(14), color: selectHinhThucLV ? colorsSVL.black : colorsSVL.grayTextLight, }}
                            styleImg={nstyles.nIcon12}
                            data={DataFilter?.LstHinhThucLV}
                            KeyTitle={'TenHinhThuc'}
                            CallBack={(item) => this._OnChangTextIndex(item, 2)}
                            stylelabel={{ fontWeight: '700' }}
                            KeyId={'IdHinhThuc'}
                        />
                        <DropDownModal
                            styleContainer={{ marginTop: 20 }}
                            label='Mức lương'
                            valueSeleted={selectMucLuong}
                            styleTextTitle={{ fontSize: reText(14), color: selectMucLuong ? colorsSVL.black : colorsSVL.grayTextLight, }}
                            styleImg={nstyles.nIcon12}
                            data={DataFilter?.LstMucLuong}
                            KeyTitle={'MucLuong'}
                            CallBack={(item) => this._OnChangTextIndex(item, 3)}
                            stylelabel={{ fontWeight: '700' }}
                            KeyId={'Id'}
                        />
                        {
                            this.TypeNguoiTimViec == true ? null :
                                <>
                                    <DropDownModal
                                        styleContainer={{ marginTop: 20 }}
                                        label='Cấp bậc'
                                        valueSeleted={selectCapBac}
                                        styleTextTitle={{ fontSize: reText(14), color: selectCapBac ? colorsSVL.black : colorsSVL.grayTextLight, }}
                                        styleImg={nstyles.nIcon12}
                                        data={DataFilter?.LstCapBac}
                                        KeyTitle={'ChucVu'}
                                        CallBack={(item) => this._OnChangTextIndex(item, 4)}
                                        stylelabel={{ fontWeight: '700' }}
                                        KeyId={'Id'}
                                    />
                                    <DropDownModal
                                        styleContainer={{ marginTop: 20 }}
                                        label='Địa điểm'
                                        valueSeleted={selectDiaDiem}
                                        styleTextTitle={{ fontSize: reText(14), color: selectDiaDiem ? colorsSVL.black : colorsSVL.grayTextLight, }}
                                        styleImg={nstyles.nIcon12}
                                        data={DataFilter?.LstDiaDiem}
                                        KeySearch={'TenTinhThanh'}
                                        isSearch={true}
                                        KeyTitle={'TenTinhThanh'}
                                        CallBack={(item) => this._OnChangTextIndex(item, 5)}
                                        stylelabel={{ fontWeight: '700' }}
                                        KeyId={'IDTinhThanh'}
                                    />
                                    <DropDownModal
                                        styleContainer={{ marginTop: 20 }}
                                        label='Kinh nghiệm'
                                        valueSeleted={selectKinhNghiem}
                                        styleTextTitle={{ fontSize: reText(14), color: selectKinhNghiem ? colorsSVL.black : colorsSVL.grayTextLight, }}
                                        styleImg={nstyles.nIcon12}
                                        data={DataFilter?.LstKinhNghiem}
                                        KeyTitle={'KinhNghiem'}
                                        CallBack={(item) => this._OnChangTextIndex(item, 6)}
                                        stylelabel={{ fontWeight: '700' }}
                                        KeyId={'Id'}
                                    />
                                </>
                        }

                        <DropDownModal
                            styleContainer={{ marginTop: 20 }}
                            label='Giới tính'
                            valueSeleted={selectGioiTinh}
                            styleTextTitle={{ fontSize: reText(14), color: selectGioiTinh ? colorsSVL.black : colorsSVL.grayTextLight, }}
                            styleImg={nstyles.nIcon12}
                            data={DataFilter?.LstGioiTinh}
                            stylelabel={{ fontWeight: '700' }}
                            KeyTitle={'TenGioiTinh'}
                            CallBack={(item) => this._OnChangTextIndex(item, 7)}
                            KeyId={'IdGioiTinh'}
                        />

                        {
                            this.TypeNguoiTimViec == true ?
                                <>
                                    <DropDownModal
                                        styleContainer={{ marginTop: 20 }}
                                        label='Độ tuổi'
                                        valueSeleted={selectDoTuoi}
                                        styleTextTitle={{ fontSize: reText(14), color: selectDoTuoi ? colorsSVL.black : colorsSVL.grayTextLight, }}
                                        styleImg={nstyles.nIcon12}
                                        data={DataFilter?.LstDoTuoi}
                                        KeyTitle={'DoTuoi'}
                                        CallBack={(item) => this._OnChangTextIndex(item, 9)}
                                        stylelabel={{ fontWeight: '700' }}
                                        KeyId={'Id'}
                                    />
                                    <DropDownModal
                                        styleContainer={{ marginTop: 20 }}
                                        label='Loại hồ sơ'
                                        valueSeleted={selectLoaiHoSo}
                                        styleTextTitle={{ fontSize: reText(14), color: selectLoaiHoSo ? colorsSVL.black : colorsSVL.grayTextLight, }}
                                        styleImg={nstyles.nIcon12}
                                        data={DataFilter?.LstTenLoaiHoSo}
                                        KeyTitle={'TenLoaiHoSo'}
                                        CallBack={(item) => this._OnChangTextIndex(item, 10)}
                                        stylelabel={{ fontWeight: '700' }}
                                        KeyId={'IdLoaiHoSo'}
                                    />
                                </>
                                :
                                <DropDownModal
                                    styleContainer={{ marginTop: 20 }}
                                    label='Trình độ'
                                    valueSeleted={selectTrinhDo}
                                    styleTextTitle={{ fontSize: reText(14), color: selectTrinhDo ? colorsSVL.black : colorsSVL.grayTextLight, }}
                                    styleImg={nstyles.nIcon12}
                                    data={DataFilter?.LstTrinhDo}
                                    stylelabel={{ fontWeight: '700' }}
                                    KeyTitle={'TrinhDoVanHoa'}
                                    CallBack={(item) => this._OnChangTextIndex(item, 8)}
                                    KeyId={'Id'}
                                />
                        }
                        {
                            this.TypeNguoiTimViec == true ?
                                <View style={{ marginTop: 20 }}>
                                    <TextApp style={stModal_Fillter.label} >{`Khu vực làm việc`}</TextApp>
                                    <TouchableOpacity style={stModal_Fillter.container}
                                        onPress={this.onChangeAreaWork}>
                                        <Text style={{ flex: 1, fontSize: reText(14), color: selectKhuVucLamViec ? colorsSVL.black : colorsSVL.grayTextLight, }} >
                                            {selectKhuVucLamViec?.KhuVucLamViec ? selectKhuVucLamViec.KhuVucLamViec : '-- Tất cả --'}
                                        </Text>
                                        <View>
                                            <ImageCus source={ImagesSVL.icDrop} resizeMode='contain'
                                                style={[nstyles.nIcon10]} />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                : null
                        }

                    </KeyboardAwareScrollView>
                    <ButtonSVL style={{ marginVertical: 20, marginHorizontal: 30, borderRadius: 20 }} text='Áp dụng'
                        onPress={this.onApplyFilter}
                    />
                </View>
            </View>
        )
    }
}
const mapStateToProps = state => ({
    auth: state.auth,
    theme: state.theme,
    dataSVL: state.dataSVL,
});
export default Utils.connectRedux(Modal_Fillter, mapStateToProps, true);
const stModal_Fillter = StyleSheet.create({
    container: { height: 40, backgroundColor: colorsSVL.grayBgrInput, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, borderRadius: 4, },
    label: { marginBottom: 8, fontSize: reText(16), fontWeight: '700' }

})