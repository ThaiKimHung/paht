import React, { Component } from 'react'
import { Text, View, StyleSheet, Platform, StatusBar, Alert } from 'react-native'
import DatePicker from 'react-native-datepicker'
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler'
import Utils, { icon_typeToast } from '../../../../app/Utils'
import ImageCus from '../../../../components/ImageCus'
import TextApp from '../../../../components/TextApp'
import { colorsSVL } from '../../../../styles/color'
import FontSize from '../../../../styles/FontSize'
import { reText } from '../../../../styles/size'
import { nstyles } from '../../../../styles/styles'
import ButtonSVL from '../../components/ButtonSVL'
import HeaderSVL from '../../components/HeaderSVL'
import { ImagesSVL } from '../../images'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { DatePick, IsLoading } from '../../../../components'
import { ChonCvPhuHop, GetListTinTuyenDung, UpdateStatus } from '../../apis/apiSVL'
import moment from 'moment'
import { colors } from '../../../../styles'
import { DEFINE_SCREEN_DETAILS } from '../../common'

class MoiPhongVan extends Component {
    constructor(props) {
        super(props);
        this.isGoOnHomThu = Utils.ngetParam(this, "isGoOnHomThu", false);
        this.item = Utils.ngetParam(this, "item", {});
        this.KeyScreen = Utils.ngetParam(this, "KeyScreen", '')
        this.state = {
            time: this.item ? this.item?.ThoiGianPhongVan : '',
            date: this.item ? this.item?.NgayPhongVan : '',
            DiaDiemPhongVan: this.item ? this.item?.DiaDiemPhongVan : '',
            GhiChu: this.item ? this.item?.GhiChu : '',
        }
        this.titlePosted = ''
        console.log('item', this.item)
        console.log('KeyScreen', this.KeyScreen)
    }

    componentDidMount() {
        const { SelectRecruitmentPostItem, LstRecruitmentPost } = this.props.dataSVL
        if (LstRecruitmentPost.length == 0) {
            this.props.LoadListRecruitmentPost('IsHienThi', 1)
        }
    }

    onSelectItem = () => {
        Utils.goscreen(this, 'Modal_ListEmployment')
    }

    onSendInterView = async () => {
        const { time, date, GhiChu, DiaDiemPhongVan } = this.state
        const { SelectRecruitmentPostItem } = this.props.dataSVL
        if (!this.titlePosted) {
            return Utils.showToastMsg('Th??ng b??o', 'Ch??a c?? th??ng tin tuy???n d???ng b???n kh??ng th??? m???i ph???ng v???n !', icon_typeToast.warning, 2000)
        }
        if (!time || !date || !DiaDiemPhongVan || DiaDiemPhongVan.length == 0 || !GhiChu || GhiChu.length == 0) {
            Utils.showToastMsg('Th??ng b??o', 'Vui l??ng nh???p ?????y ????? th??ng tin c??c tr?????ng !', icon_typeToast.warning, 2000)
        } else {
            Utils.setToggleLoading(true)
            let res = ''
            switch (this.KeyScreen) {
                case DEFINE_SCREEN_DETAILS.DanhSach_CVDoanhNghiep.KeyScreen:
                    {
                        let strBody = {
                            "IdCV": this.item.IdCV,
                            "IdTinTuyenDung": SelectRecruitmentPostItem?.Id,
                            "ThoiGianPhongVan": moment(time, 'HH:mm').format('HH:mm'),//HH:mm
                            "NgayPhongVan": moment(date).format('yyyy/MM/DD'),//yyyy/MM/dd
                            "DiaDiemPhongVan": DiaDiemPhongVan,
                            "GhiChu": GhiChu
                        }
                        Utils.nlog('BODY CHON CV DOANH NGHIEP', strBody)
                        res = await ChonCvPhuHop(strBody)
                        Utils.nlog('CHON CV TU DS CV DOANH NGHIEP', res)
                        Utils.setToggleLoading(false)
                    }
                    break;
                case DEFINE_SCREEN_DETAILS.TuyenDung_DoanhNghiep.KeyScreen:
                    {
                        let strBody = {
                            "IdRow": this.item?.IdUngTuyen,
                            "Status": 1,
                            "ThoiGianPhongVan": moment(time, 'HH:mm').format('HH:mm'),//HH:mm
                            "NgayPhongVan": moment(date).format('yyyy/MM/DD'),//yyyy/MM/dd
                            "DiaDiemPhongVan": DiaDiemPhongVan,
                            "GhiChu": GhiChu
                        }
                        Utils.nlog('BODY UPDATE STATUS -TUYEN DUNG DOANH NGHIEP', strBody)
                        res = await UpdateStatus(strBody)
                        Utils.nlog('CHON CV TU DS CV DOANH NGHIEP', res)
                        Utils.setToggleLoading(false)
                    }
                    break;
                default:
                    break;
            }
            if (res?.status == 1) {
                this.props.LoadListProfileApplied(SelectRecruitmentPostItem?.Id)
                Utils.goscreen(this, 'Modal_ThongBao',
                    {
                        title: "G???i th??ng b??o ph???ng v???n th??nh c??ng",
                        titleButton: '????ng',
                        onThaoTac: () => {
                            Utils.goscreen(this, this.isGoOnHomThu ? 'scDetailsHomThuTD' : 'scNguoiTimViec')
                        }
                    })
            } else {
                Utils.showToastMsg('Th??ng b??o', res?.error?.message || `M???i ph???ng v???n kh??ng th??nh c??ng!`, icon_typeToast.danger, 2000)
            }
        }


    }

    DropDownEmployment = () => {
        const { SelectRecruitmentPostItem } = this.props.dataSVL
        this.titlePosted = ''
        if (SelectRecruitmentPostItem?.TieuDe) {
            this.titlePosted += SelectRecruitmentPostItem?.TieuDe ? SelectRecruitmentPostItem?.TieuDe + ' - ' : ''
        }
        if (SelectRecruitmentPostItem?.NganhNghe) {
            this.titlePosted += SelectRecruitmentPostItem?.NganhNghe ? SelectRecruitmentPostItem?.NganhNghe + ' - ' : ''
        }
        if (SelectRecruitmentPostItem?.ChucVu) {
            this.titlePosted += SelectRecruitmentPostItem?.ChucVu ? SelectRecruitmentPostItem?.ChucVu + ' - ' : ''
        }
        if (SelectRecruitmentPostItem?.TenQuanHuyen) {
            this.titlePosted += SelectRecruitmentPostItem?.TenQuanHuyen ? SelectRecruitmentPostItem?.TenQuanHuyen + ' - ' : ''
        }
        if (SelectRecruitmentPostItem?.HanNopHoSo) {
            this.titlePosted += SelectRecruitmentPostItem?.HanNopHoSo ? 'H???n n???p: ' + SelectRecruitmentPostItem?.HanNopHoSo : ''
        }
        return (
            <View style={{ backgroundColor: colorsSVL.white }}>
                <TextApp style={{ fontSize: reText(14) }}>
                    {'Th??ng tin tuy???n d???ng'}
                </TextApp>

                <TouchableOpacity onPress={this.onSelectItem} activeOpacity={0.5} style={stDoanhNghiep.dropEmployment}>

                    <TextApp numberOfLines={2} style={stDoanhNghiep.txtSelectEmployment}>
                        {`${SelectRecruitmentPostItem?.Id ? `[${SelectRecruitmentPostItem?.Id}].` : ''}`}{this.titlePosted || 'Kh??ng c?? d??? li???u'}
                    </TextApp>
                    <ImageCus source={ImagesSVL.icDrop} resizeMode='contain' style={[nstyles.nIcon10]} />
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        return (
            <View style={stDoanhNghiep.stContainer}>
                <StatusBar barStyle={'dark-content'} />
                <HeaderSVL
                    title={"M???i ph???ng v???n"}
                    iconLeft={ImagesSVL.icBackSVL}
                    onPressLeft={() => Utils.goback(this)}
                />
                <KeyboardAwareScrollView style={{ flex: 1, backgroundColor: colors.BackgroundHome, marginTop: 5 }}>
                    <View style={{ paddingVertical: 10, backgroundColor: colorsSVL.white, paddingHorizontal: 10 }}>
                        {
                            this.DropDownEmployment()
                        }
                    </View>
                    <View style={[stDoanhNghiep.stKhoangCach]} />
                    <View style={[stDoanhNghiep.stView]}>
                        <View style={{ marginTop: 15 }}>
                            <TextApp style={[stDoanhNghiep.stText]} >Th???i gian ph???ng v???n</TextApp>
                            <View style={{ backgroundColor: colorsSVL.grayBgrInput, borderRadius: 4 }}>
                                <DatePick
                                    placeholder={'-- Ch???n gi??? ph???ng v???n --'}
                                    style={{
                                        width: "100%", height: 40, alignItems: 'center',
                                        color: this.state.time == '' ? colorsSVL.grayTextLight : colorsSVL.black,
                                        fontSize: reText(15),
                                    }}
                                    ChonGio={true}
                                    value={this.state.time}
                                    Img={ImagesSVL.icTimer}
                                    styleIcon={[nstyles.nIcon20, { resizeMode: 'contain' }]}
                                    onValueChange={time => {
                                        this.setState({ time: time })
                                    }}
                                />
                            </View>
                        </View>
                        <View style={{ marginTop: 10, }}>
                            <TextApp style={[stDoanhNghiep.stText]} >Ng??y ph???ng v???n</TextApp>
                            <View style={{ backgroundColor: colorsSVL.grayBgrInput, borderRadius: 4 }}>
                                <DatePick
                                    placeholder={'-- Ng??y ph???ng v???n --'}
                                    style={{
                                        width: "100%", height: 40, alignItems: 'center',
                                        color: this.state.date == '' ? colorsSVL.grayTextLight : colorsSVL.black,
                                        fontSize: reText(15)
                                    }}
                                    value={this.state.date}
                                    Img={ImagesSVL.icCalendar}
                                    styleIcon={[nstyles.nIcon20, { resizeMode: 'contain' }]}
                                    onValueChange={date => {
                                        this.setState({ date: date })
                                    }}
                                />
                            </View>

                        </View>
                        <View style={{ marginTop: 10 }}>
                            <TextApp style={[{ marginBottom: 8, fontSize: reText(14) }]}>?????a ??i???m ph???ng v???n</TextApp>
                            <TextInput
                                value={this.state.DiaDiemPhongVan}
                                multiline={true}
                                placeholder='-- Nh???p ?????a ??i???m ph???ng v???n --'
                                style={[{ color: colorsSVL.black, fontSize: reText(14), backgroundColor: colorsSVL.grayBgrInput, height: 80, paddingHorizontal: 10, borderRadius: 4 }]}
                                onChangeText={(text) => { this.setState({ DiaDiemPhongVan: text }) }}

                            />
                        </View>
                        <View style={{ marginTop: 10, marginBottom: 10 }}>
                            <TextApp style={[{ marginBottom: 8, fontSize: reText(14) }]}>Ghi ch??</TextApp>
                            <TextInput
                                value={this.state.GhiChu}
                                multiline={true}
                                placeholder='-- Nh???p n???i dung chi ch?? --'
                                style={[{ color: colorsSVL.black, fontSize: reText(14), backgroundColor: colorsSVL.grayBgrInput, height: 80, paddingHorizontal: 10, borderRadius: 4 }]}
                                onChangeText={(text) => { this.setState({ GhiChu: text }) }}
                            />
                        </View>
                        <View style={{ marginVertical: 14 }}>
                            <ButtonSVL
                                onPress={this.onSendInterView}
                                style={[stDoanhNghiep.stButtonMoiPV]}
                                text='M???i ph???ng v???n'
                                styleText={{ fontSize: reText(14) }}
                                colorText={colorsSVL.white}
                            />
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </View>
        )
    }
}

const mapStateToProps = state => ({
    dataSVL: state.dataSVL
});
export default Utils.connectRedux(MoiPhongVan, mapStateToProps, true);

const stDoanhNghiep = StyleSheet.create({
    stContainer: {
        flex: 1,
    },
    stView: {
        backgroundColor: 'white', paddingHorizontal: 10, flex: 1
    },
    stText: {
        marginBottom: 8, fontSize: reText(14)
    },
    stKhoangCach: {
        height: 5, backgroundColor: colorsSVL.grayBgrInput
    },
    container: {
        height: 40,
        backgroundColor: colorsSVL.grayBgrInput,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        borderRadius: 4,
    },
    dropEmployment: {
        borderRadius: 5,
        marginTop: 5,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F5F5F5'
    },
    txtSelectEmployment: {
        fontSize: reText(14),
        flex: 5,
        textAlign: 'justify',
        paddingRight: 20
    },
    stButtonTaoMoi: {
        backgroundColor: colorsSVL.white, borderColor: colorsSVL.blueMainSVL, borderWidth: 1, paddingVertical: 10, borderRadius: 30
    },
    stTextButtonTaoMoi: {
        fontSize: reText(14), paddingHorizontal: 10
    },
    stButtonMoiPV: {
        backgroundColor: colorsSVL.blueMainSVL, paddingVertical: 10, borderRadius: 22
    }

})
