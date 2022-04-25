import React, { Component } from 'react'
import { FlatList, Text, View, Image, TouchableOpacity } from 'react-native'
import { isIphoneX } from 'react-native-iphone-x-helper'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AppCodeConfig from '../../../../app/AppCodeConfig'
import { nGlobalKeys } from '../../../../app/keys/globalKey'
import Utils, { icon_typeToast } from '../../../../app/Utils'
import { HeaderCus, IsLoading } from '../../../../components'
import { colors } from '../../../../styles'
import apis from '../../../apis'
import { Images } from '../../../images'
import ButtonCus from '../../../../components/ComponentApps/ButtonCus'
import { nstyles } from '../../../../styles/styles'
import { reText } from '../../../../styles/size'
import HtmlViewCom from '../../../../components/HtmlView'
import { ROOTGlobal } from '../../../../app/data/dataGlobal'

const KeyButton = {
    TiepNhan: 1,
    KhongTiepNhan: 2,
    ChinhSua: 3,
    ChuyenXuLy: 4,
    ThuHoi: 5,
    Xoa: 6,
    TraLai: 7,
    TraLoi: 8
}

export class DetailsHoiDapTT_Admin extends Component {
    constructor(props) {
        super(props)
        this.callback = Utils.ngetParam(this, "callback", () => {
            ROOTGlobal.dataGlobal._reloadHoiDapAdmin()
            // Linking.openURL(appConfig.deeplinkSOSCB_Home)
        });
        this.IdHoiDapTT = Utils.ngetParam(this, 'IdHoiDapTT', '')
        this.state = {
            details: '',
            lstButton: [],
            DataNhatKy: []
        };
        this.refLoading = React.createRef(null)
    };

    componentDidMount() {
        this.getDetailsQuestion()
        this.getList_NhatKyThaoTac()
    }

    getList_NhatKyThaoTac = async () => {
        this.refLoading.current.show();
        let res = await apis.apiHoiDapVTS.GetList_NhatKyThaoTac_HoiTT(this.IdHoiDapTT)
        this.refLoading.current.hide();
        Utils.nlog('[LOG] res nhat ky thao tac', res)
        if (res.status == 1 && res.data) {
            this.setState({ DataNhatKy: res.data })
        } else {
            this.setState({ DataNhatKy: [] })
        }
    }

    getDetailsQuestion = async () => {
        this.refLoading.current.show()
        Utils.nlog('[LOG] this.IdHoiDapTT', this.IdHoiDapTT)
        let res = await apis.apiHoiDapVTS.Info_HoiTT(this.IdHoiDapTT)
        this.refLoading.current.hide()
        Utils.nlog('[LOG] res details question', res)
        if (res.status == 1 && res.data) {
            this.setState({ details: res.data }, () => this.handleShowButton(res))
        } else {
            this.setState({ details: '' })
        }
    }

    handleShowButton = async (res) => {
        const { userDH } = this.props.auth
        if (res.status == 1 && res.data) {
            const { TrangThai, lstDap = [] } = res?.data
            let rule = userDH?.Rules ? userDH?.Rules : []
            // Utils.nlog('[LOG] rule ', rule)
            let lstBtn = []
            if (rule.includes(10067) && TrangThai == 1) {
                lstBtn = lstBtn.concat([
                    {
                        Key: KeyButton.TiepNhan,
                        Name: 'Tiếp nhận',
                        color: colors.listColorBtnChan[1],
                    },
                    {
                        Key: KeyButton.KhongTiepNhan,
                        Name: 'Không tiếp nhận',
                        color: colors.listColorBtnChan[2],
                    },
                ])
            }
            if (rule.includes(10066) && (TrangThai == 2 || TrangThai == 5)) {
                lstBtn = lstBtn.concat([
                    {
                        Key: KeyButton.ChinhSua,
                        Name: 'Chỉnh sửa',
                        color: colors.listColorBtnChan[2],
                    }
                ])
            }
            if (rule.includes(10068) && (TrangThai == 2 || TrangThai == 5)) {
                lstBtn = lstBtn.concat([
                    {
                        Key: KeyButton.ChuyenXuLy,
                        Name: 'Chuyển xử lý',
                        color: colors.listColorBtnChan[1],
                    }
                ])
            }
            if (rule.includes(10070) && TrangThai == 3 && lstDap.length == 0) {
                lstBtn = lstBtn.concat([
                    {
                        Key: KeyButton.ThuHoi,
                        Name: 'Thu hồi',
                        color: colors.listColorBtnChan[4],
                    }
                ])
            }
            if (rule.includes(10071) && (TrangThai == -1 || TrangThai == 4)) {
                lstBtn = lstBtn.concat([
                    {
                        Key: KeyButton.Xoa,
                        Name: 'Xoá',
                        color: colors.listColorBtnChan[3],
                    }
                ])
            }
            if (rule.includes(10069) && TrangThai == 3 && lstDap.length == 0) {
                lstBtn = lstBtn.concat([
                    {
                        Key: KeyButton.TraLai,
                        Name: 'Trả lại',
                        color: colors.listColorBtnChan[1],
                    }
                ])
            }
            if (rule.includes(10069) && (TrangThai == 3 || TrangThai == 4)) {
                lstBtn = lstBtn.concat([
                    {
                        Key: KeyButton.TraLoi,
                        Name: 'Trả lời',
                        color: colors.listColorBtnChan[5],
                    }
                ])
            }
            this.setState({ lstButton: lstBtn })
        }
    }

    handleButton = (item) => {
        const { details } = this.state
        switch (item.Key) {
            case KeyButton.TiepNhan:
                Utils.showMsgBoxYesNoTop('Thông báo', 'Bạn có chắc muốn tiếp nhận câu hỏi ?', 'Tiếp nhận', 'Xem lại', async () => {
                    this.refLoading.current.show()
                    let res = await apis.apiHoiDapVTS.TiepNhan_HoiTT(details?.Id)
                    Utils.nlog('[LOG] tiep nhan', res)
                    this.refLoading.current.hide()
                    if (res.status == 1) {
                        Utils.showToastMsg('Thông báo', 'Tiếp nhận thành công', icon_typeToast.success, 2000, icon_typeToast.success)
                        ROOTGlobal.dataGlobal._reloadHoiDapAdmin(1, details?.Id)
                        Utils.goback(this)
                    } else {
                        Utils.showToastMsg('Thông báo', 'Tiếp nhận thất bại', icon_typeToast.danger, 2000, icon_typeToast.danger)
                    }
                })
                break;
            case KeyButton.KhongTiepNhan:
                Utils.goscreen(this, 'Modal_TraLai_KhongTiepNhanHoiTT', { item: details, callback: this.callback, action: item })
                break;
            case KeyButton.ChinhSua:
                Utils.goscreen(this, 'Modal_GuiCauHoi_VTS', { itemEdit: details, callback: this.callback, isHandleAdmin: true })
                break;
            case KeyButton.ChuyenXuLy:
                Utils.goscreen(this, 'Modal_ChuyenXuLyHoiDapTT', { item: details, callback: this.callback })
                break;
            case KeyButton.ThuHoi:
                Utils.showMsgBoxYesNoTop('Thông báo', 'Bạn có chắc muốn thu hồi câu hỏi ?', 'Thu hồi', 'Xem lại', async () => {
                    this.refLoading.current.show()
                    let res = await apis.apiHoiDapVTS.ThuHoi_HoiTT(details?.Id)
                    Utils.nlog('[LOG] thu hoi', res)
                    this.refLoading.current.hide()
                    if (res.status == 1) {
                        Utils.showToastMsg('Thông báo', 'Thu hồi thành công', icon_typeToast.success, 2000, icon_typeToast.success)
                        ROOTGlobal.dataGlobal._reloadHoiDapAdmin(1, details?.Id)
                        Utils.goback(this)
                    } else {
                        Utils.showToastMsg('Thông báo', 'Thu hồi thất bại', icon_typeToast.danger, 2000, icon_typeToast.danger)
                    }
                })
                break;
            case KeyButton.Xoa:
                Utils.showMsgBoxYesNoTop('Thông báo', 'Bạn có chắc muốn xoá câu hỏi ?', 'Xoá', 'Xem lại', async () => {
                    this.refLoading.current.show()
                    let res = await apis.apiHoiDapVTS.Delete_HoiTT(details?.Id)
                    Utils.nlog('[LOG] xoa', res)
                    this.refLoading.current.hide()
                    if (res.status == 1) {
                        Utils.showToastMsg('Thông báo', 'Xoá thành công', icon_typeToast.success, 2000, icon_typeToast.success)
                        ROOTGlobal.dataGlobal._reloadHoiDapAdmin(1, details?.Id)
                        Utils.goback(this)
                    } else {
                        Utils.showToastMsg('Thông báo', 'Xoá thất bại', icon_typeToast.danger, 2000, icon_typeToast.danger)
                    }
                })
                break;
            case KeyButton.TraLai:
                Utils.goscreen(this, 'Modal_TraLai_KhongTiepNhanHoiTT', { item: details, callback: this.callback, action: item })
                break;
            case KeyButton.TraLoi:
                Utils.goscreen(this, 'Modal_TraLoiHoiTT', { item: details, callback: this.callback })
                break;

            default:
                break;
        }
    }

    render() {
        const { lstButton, details, DataNhatKy } = this.state
        return (
            <View style={{ flex: 1, backgroundColor: colors.BackgroundHome, paddingBottom: isIphoneX() ? 20 : 5 }}>
                <HeaderCus
                    Sleft={{ tintColor: 'white' }}
                    onPressLeft={() => Utils.goback(this)}
                    iconLeft={Images.icBack}
                    title={`Chi tiết câu hỏi`}
                    styleTitle={{ color: colors.white }}
                />
                <KeyboardAwareScrollView style={{ flex: 1 }}>
                    <View style={{ padding: 10, backgroundColor: colors.white }}>
                        <View style={[{ flexDirection: 'row' }]}>
                            <View style={{ paddingRight: 10 }}>
                                <Image source={Images.icQuestionVTS} style={nstyles.nIcon40} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <View style={{}}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{ paddingRight: 10, fontSize: reText(12), textAlign: 'justify', flex: 1 }}>Người hỏi: {details?.HoTen ? details.HoTen : ''}</Text>
                                        <Text style={{ paddingVertical: 2, fontSize: reText(12), textAlign: 'justify' }}>{details?.CreatedDate ? details.CreatedDate : ''}</Text>
                                    </View>
                                    <Text style={{ paddingVertical: 2, fontSize: reText(12) }}>Điện thoại: {details?.SDT ? Utils.hidePhoneNum(details.SDT, 'x') : ''}</Text>
                                    <Text style={{ paddingVertical: 2, fontSize: reText(12) }}>Email: {details?.Email ? Utils.hideEmail(details.Email, 'x') : ''}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ height: 0.5, backgroundColor: colors.grayLight, marginVertical: 10 }} />
                        <Text style={{ fontWeight: 'bold', fontSize: reText(14), textAlign: 'justify', marginBottom: 10 }}>{details?.TieuDe ? details.TieuDe : ''}</Text>
                        <View style={{ flex: 1 }}>
                            <HtmlViewCom html={details.NoiDung ? details.NoiDung : '<div></div>'} style={{}} />
                        </View>
                        {
                            details?.lstDinhKem?.length > 0 && details?.lstDinhKem ?
                                <TouchableOpacity
                                    onPress={() => { Utils.openWeb(this, details.lstDinhKem[0]?.Link, { title: 'File đính kèm' }) }}
                                    style={{ alignSelf: 'flex-start', marginTop: 10 }}>
                                    <Text style={{ fontSize: reText(14), color: colors.blueFaceBook, fontWeight: 'bold', textAlign: 'justify' }}>{'📂 File đính kèm (nhấn vào đây để xem chi tiết)'}</Text>
                                </TouchableOpacity>
                                : null
                        }
                        {
                            details?.LyDoHuy ?
                                <Text style={{ fontWeight: 'bold', fontSize: reText(14), textAlign: 'justify', marginTop: 10, color: colors.redStar }}>Lý do huỷ: {details?.LyDoHuy ? details.LyDoHuy : ''}</Text>
                                : null
                        }
                        {
                            details?.LyDoTraLai ?
                                <Text style={{ fontWeight: 'bold', fontSize: reText(14), textAlign: 'justify', marginTop: 10, color: colors.redStar }}>Lý do trả lại: {details?.LyDoTraLai ? details.LyDoTraLai : ''}</Text>
                                : null
                        }
                    </View>
                    <FlatList
                        scrollEnabled={false}
                        style={{ backgroundColor: colors.white, padding: 5 }}
                        extraData={this.state}
                        numColumns={2}
                        data={lstButton}
                        renderItem={({ item, index }) => {
                            return (
                                <ButtonCus
                                    textTitle={item.Name}
                                    onPressB={() => this.handleButton(item)}
                                    stContainerR={[{ flex: 1, borderRadius: 2, backgroundColor: item.color, marginTop: 5, margin: 5 }]}
                                />
                            )
                        }}
                        keyExtractor={(item, index) => index.toString()}
                        ListFooterComponent={() => {
                            return (
                                <View style={{ margin: 5, borderWidth: 1, borderColor: colors.listColorBtnChan[0], backgroundColor: colors.white }}>
                                    <Text style={{ backgroundColor: colors.listColorBtnChan[0], color: colors.white, padding: 10, textAlign: 'center' }}>{'Nhật ký thao tác'}</Text>
                                    {DataNhatKy.length > 0 ? DataNhatKy.map((item, index) => {
                                        return (
                                            <View key={index} style={{ marginTop: 10, backgroundColor: '#01638D1A', padding: 10 }}>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    <Text style={{ fontWeight: 'bold' }}>{item?.FullName || '---'}</Text>
                                                    <Text style={{ fontStyle: 'italic' }}>{item?.CreatedDate || '---'}</Text>
                                                </View>
                                                <Text style={{ fontSize: reText(12), lineHeight: 20 }}>{item?.TenPhuongXa || '---'}</Text>
                                                <Text style={{ marginTop: 10 }}>{'Thao tác: '}{item?.NoiDungThaoTac || '---'}</Text>
                                                {
                                                    item?.lstDonViXuLy && item?.lstDonViXuLy.length > 0 && <Text style={{ fontWeight: 'bold', marginTop: 10 }}>{'Đơn vị xử lý:'}</Text>
                                                }
                                                {
                                                    item?.lstDonViXuLy && item?.lstDonViXuLy.length > 0 && item?.lstDonViXuLy?.map((item, index) => {
                                                        return (
                                                            <View key={`xuly${index}`} style={{ padding: 5 }}>
                                                                <Text>{index + 1}/ {item?.TenDonVi}</Text>
                                                            </View>
                                                        )
                                                    })}
                                            </View>
                                        )
                                    }) :
                                        <Text style={{ padding: 10 }}>{'Không có dữ liệu'}</Text>
                                    }
                                </View>
                            )
                        }}
                    />
                </KeyboardAwareScrollView>
                <IsLoading ref={this.refLoading} />
            </View>
        )
    }
}

const mapStateToProps = state => ({
    theme: state.theme,
    auth: state.auth
});
export default Utils.connectRedux(DetailsHoiDapTT_Admin, mapStateToProps)
