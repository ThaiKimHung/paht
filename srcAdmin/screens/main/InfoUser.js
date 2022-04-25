import React, { Component, Fragment } from 'react'
import { Text, View, Image, TouchableOpacity, ScrollView, StyleSheet, Platform, TextInput, Alert } from 'react-native'
import { nstyles, paddingTopMul, Width } from '../../../styles/styles'
import HeaderCom from '../../../components/HeaderCom'
import { Images } from '../../images'
import Utils from '../../../app/Utils'
import { colors } from '../../../styles'
import { isPad, sizes, reText } from '../../../styles/size'
import ButtonCus from '../../../components/ComponentApps/ButtonCus'
import Apis from '../../apis';
import { appConfig } from '../../../app/Config'
import ModalLoading from '../../../components/ComponentApps/ModalLoading'
import apis from '../../apis'
import { ROOTGlobal } from '../../../app/data/dataGlobal'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { nGlobalKeys } from '../../../app/keys/globalKey'
import { ConfigScreenDH } from '../../routers/screen'
import { AvatarUser, IsLoading } from '../../../components'
import AppCodeConfig from '../../../app/AppCodeConfig'

// TEXTLINE HIỂN THỊ THÔNG TIN
const TextLine = (props) => {
    let { title = 'label', value = 'value', onChangeText = () => { }, isEdit = true, onPress = () => { }, icon = undefined, styleIcon } = props
    return (
        <>
            <View {...props} style={{ flexDirection: 'row', backgroundColor: colors.white, alignItems: 'center', padding: 3, paddingHorizontal: 10, borderRadius: 15 }}>
                <Text style={{ fontWeight: 'bold', minWidth: Width(25), fontSize: reText(14) }}>{title}: </Text>
                {
                    onPress && icon ?
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <TouchableOpacity onPress={onPress} style={{ padding: 5 }}>
                                <Image source={icon} style={[nstyles.nIcon20, styleIcon]} resizeMode='contain' />
                            </TouchableOpacity>
                        </View>
                        :
                        !isEdit ? <TextInput
                            {...props}
                            placeholder={'Nhập ' + title.toLowerCase()}
                            value={value}
                            onChangeText={onChangeText}
                            style={{ backgroundColor: colors.BackgroundHome, padding: 10, flex: 1, borderRadius: 3 }}
                        /> :
                            <Text style={{ flex: 1, textAlign: 'right', paddingVertical: 8 }}>{value}</Text>
                }
            </View>
            <View style={{ backgroundColor: colors.black_10, height: 0.5, marginHorizontal: 10 }} />
        </>

    )
}

export class InfoUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            strBase64: '',
            avatarSource: '',
            isLoading: true,
            email: '',
            sdt: '',
            hoten: '',
            strCoQuan: '',
            strChucVu: '',
            strUsername: '',
            isSua: true,
            UserID: '',
            TimeMK: ''
        }
        this.refLoading = React.createRef(null);
    }

    //
    componentDidMount() {
        this._getInfo()
    }
    // CẬP NHẬT THÔNG TIN TÀI KHOẢN
    _CapNhatMySelft = async () => {
        this.refLoading.current.show();
        const { UserID, hoten, email, sdt } = this.state;
        const res = await apis.ApiUser.CapNhatMySelft(UserID, hoten, email, sdt);
        this.refLoading.current.hide();
        if (res.status == 1) {
            Utils.showMsgBoxOK(this.props.nthis ? this.props.nthis : this, "Thông báo", "Cập nhật thông tin thành công", "Xác nhận",
                () => { this.setState({ isSua: true }, () => this._getInfo()) }
            )
        }
        else {
            Utils.showMsgBoxOK(this.props.nthis ? this.props.nthis : this, "Thông báo", "Cập nhật thông tin thất bại", 'Xác nhận')
        }
    }

    // GET THÔNG TIN TK
    _getInfo = async () => {
        // nthisIsLoading.show()
        let res = await Apis.ApiUser.GetInfoUser();
        // nthisIsLoading.hide()
        Utils.nlog("gia tri getinfo usser", res);
        if (res.status == 1 && res.data) {
            this.setState({
                email: res.data.Email,
                sdt: res.data.PhoneNumber,
                strUsername: res.data.Username,
                strCoQuan: res.data.TenCoQuan,
                strChucVu: res.data.ChucVu,
                hoten: res.data.FullName,
                avatarSource: res.data.Avata,
                UserID: res.data.UserID,
                TimeMK: res.data.AlertTime
            })
            this.props.SetUserApp(AppCodeConfig.APP_ADMIN, res.data);
        }

    }

    // GOSCREEN MÀN HÌNH ĐỔI MẬT KHẨU
    _doiMatKhau = () => {
        Utils.goscreen(this.props.nthis ? this.props.nthis : this, ConfigScreenDH.Modal_DoiMatKhau, { UserName: this.state.hoten })
    }

    // MỞ MÀN HÌNH CHỌN AVATAR
    _chooseAvatar = () => {
        let options = {
            assetType: 'Photos',//All,Videos,Photos - default
            multi: false,// chọn 1 or nhiều item
            response: this.response, // callback giá trị trả về khi có chọn item
            limitCheck: 1, //gioi han sl media chon: -1 la khong co gioi han, >-1 la gioi han sl =  limitCheck
            groupTypes: 'All',
            showTakeCamera: true
        }
        Utils.goscreen(this.props.nthis ? this.props.nthis : this, ConfigScreenDH.Modal_MediaPicker, { ...options, isAvatar: true });
    }

    // RESPONSE CHỌN AVATAR - XỬ LÝ API ĐỔI AVATAR
    response = async (res) => {
        if (res.iscancel) {
            Utils.nlog('--ko chon item or back');
        }
        else if (res.error) {
            Utils.nlog('--lỗi khi chon media');
        }
        else {
            nthisIsLoading.show()
            let str64 = await Utils.parseBase64(res[0].uri, res[0].height, res[0].width, 0.3);
            let avatar = {
                strBase64: str64,
                filename: 'capnhatavata',
                extension: '.png',
                Type: 1,
            }
            // Xử lý đổi avatar
            let respondAva = await apis.ApiUser.CapNhatHinh(avatar);
            nthisIsLoading.hide()
            Utils.nlog('post api avatar', respondAva)
            if (respondAva.status == 1 && respondAva.data) {

                this.setState({ avatarSource: respondAva.data })
                ROOTGlobal[nGlobalKeys.LoadInfoDH].GetInfo()
                Utils.showMsgBoxOK(this.props.nthis ? this.props.nthis : this, 'Thông báo', 'Cập nhật ảnh đại diện thành công', 'Xác nhận')
            } else {
            }
        }
    };

    // HỎI TRƯỚC KHI CẬP NHẬT THÔNG TIN
    _LuuUser = () => {
        const { hoten, sdt, email } = this.state;
        Utils.showMsgBoxYesNo(this.props.nthis ? this.props.nthis : this, "Thông báo", "Bạn muốn lưu thông tin này", "Chấp nhận", "Huỷ", () => {
            this._CapNhatMySelft()
        }, () => this.setState({ isSua: true }, () => this._getInfo())
        )

    }

    render() {
        const { isSua, TimeMK } = this.state;
        const { userDH } = this.props.auth
        return (
            <View style={{ backgroundColor: colors.BackgroundHome, flex: 1 }}>
                {/* {HEADER} */}
                {
                    this.props.hideHeader ? null :
                        <HeaderCom
                            styleContent={{ backgroundColor: colors.colorHeaderApp }}
                            titleText='Thông tin tài khoản'
                            tintColorLeft={'white'}
                            onPressLeft={() => {
                                if (ROOTGlobal[nGlobalKeys.HomeDH].getThongBao)
                                    ROOTGlobal[nGlobalKeys.HomeDH].getThongBao()
                                Utils.goback(this)
                            }}
                            iconLeft={Images.icBack}
                            iconRight={null}
                            nthis={this} />
                }
                {/* {BODY} */}
                <View style={[nstyles.nbody]}>
                    <KeyboardAwareScrollView>
                        <AvatarUser
                            onEdit={this._chooseAvatar}
                            uriAvatar={appConfig.domain + '/Upload/Avata/' + this.state.avatarSource}
                            colorIcon={this.props.theme.colorLinear.color[0]}
                            style={{ marginVertical: 13 }}
                        />
                        <View style={{ backgroundColor: colors.white, marginHorizontal: 13, borderRadius: 15 }}>
                            <TextLine title={'Tài khoản'} value={this.state.strUsername || userDH?.Username} />
                            <TextLine title={'Mật khẩu'} onPress={() => this._doiMatKhau()} icon={Images.icLock} styleIcon={{ tintColor: colors.colorHeaderApp }} />
                            {
                                TimeMK != '' ?
                                    <>
                                        <Text style={{
                                            backgroundColor: colors.white, fontStyle: 'italic',
                                            color: colors.redStar, paddingHorizontal: 10,
                                            fontSize: reText(12)
                                        }} >{TimeMK || userDH?.AlertTime}</Text>
                                    </> : null
                            }
                            <TextLine title={'Họ và tên'} value={this.state.hoten || userDH?.FullName} isEdit={isSua} onChangeText={vals => this.setState({ hoten: vals })} />
                            <TextLine title={'Điện thoại'} value={this.state.sdt.trim() || userDH?.PhoneNumber} isEdit={isSua} onChangeText={vals => this.setState({ sdt: vals })} />
                            <TextLine title={'Email'} value={this.state.email || userDH?.Email} isEdit={isSua} onChangeText={vals => this.setState({ email: vals })} />
                            <TextLine title={'Cơ quan'} value={this.state.strCoQuan || userDH?.TenCoQuan} />
                            <TextLine title={'Chức vụ'} value={this.state.strChucVu || userDH?.ChucVu} />
                        </View>
                        {isSua ? <TouchableOpacity onPress={() => { this.setState({ isSua: false }) }} style={{ padding: 13, margin: 13, borderRadius: 15, backgroundColor: 'white' }}>
                            <Text style={{ fontSize: reText(14), color: this.props.theme.colorLinear.color[0], fontWeight: 'bold', textAlign: 'center' }}>{'Chỉnh sửa thông tin'}</Text>
                        </TouchableOpacity> : <TouchableOpacity onPress={() => this._LuuUser()} style={{ padding: 13, margin: 13, borderRadius: 15, backgroundColor: 'white', }}>
                            <Text style={{ fontSize: reText(14), color: this.props.theme.colorLinear.color[0], fontWeight: 'bold', textAlign: 'center' }}>{'Cập nhật'}</Text>
                        </TouchableOpacity>}
                        {/* <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                            {isSua ?
                                <ButtonCus
                                    textTitle='Cập nhật'
                                    onPressB={() => { this.setState({ isSua: false }) }}
                                    stContainerR={{ backgroundColor: colors.peacockBlue, borderRadius: 8, width: Width(40) }}
                                /> :
                                <ButtonCus
                                    textTitle='Lưu lại'
                                    onPressB={() => this._LuuUser()}
                                    stContainerR={{ backgroundColor: colors.greenFE, borderRadius: 8, width: Width(40) }}
                                />}
                            <ButtonCus
                                textTitle='Đăng xuất'
                                onPressB={() => Utils.showMsgBoxYesNo(this, 'Thông báo', 'Bạn có chắc muốn thoát ?', 'Chấp nhập', 'Hủy', () =>
                                    //  ROOTGlobal[nGlobalKeys.LogOutDH].DangXuat()
                                    ROOTGlobal[nGlobalKeys.LogOutDH].DangXuat(true)
                                )}
                                stContainerR={{ backgroundColor: '#B0B2B2', borderRadius: 8, width: Width(40) }}
                            />
                        </View> */}
                    </KeyboardAwareScrollView>
                    <IsLoading ref={this.refLoading} />
                </View>
            </View >
        )
    }
}
const mapStateToProps = state => ({
    auth: state.auth,
    theme: state.theme
});
export default Utils.connectRedux(InfoUser, mapStateToProps, true);
