import React, { Component } from 'react'
import { Platform, Text, View, TouchableOpacity, Image, TextInput, Alert, BackHandler } from 'react-native'
import { isIphoneX } from 'react-native-iphone-x-helper'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Utils from '../../../app/Utils'
import { Images } from '../../images'
import { colors } from '../../../styles'
import { reText } from '../../../styles/size'
import { Height, nstyles, paddingTopMul } from '../../../styles/styles'
import * as Animatable from 'react-native-animatable'
import HtmlViewCom from '../../../components/HtmlView'
import ImagePickerNew from '../../../components/ComponentApps/ImagePicker/ImagePickerNew'
import RNFS from 'react-native-fs';
import ImageResizer from 'react-native-image-resizer';
import RNCompress from '../../RNcompress'
import apis from '../../apis'
import { ButtonCom, HeaderCus, IsLoading } from '../../../components'
import Voice from '@react-native-community/voice';
import LottieView from 'lottie-react-native';

import UtilsApp from '../../../app/UtilsApp'
import { check, request, PERMISSIONS } from 'react-native-permissions';
import { nkey } from '../../../app/keys/keyStore'
import { ROOTGlobal } from '../../../app/data/dataGlobal'
import TextInputForm from '../../../components/TextInputForm'


const khuyennghi = `Câu hỏi phải được soạn thảo dưới dạng chữ tiếng Việt có dấu, không sử dụng các từ viết tắt, vi phạm thuần phong mỹ tục, các từ ngữ gây kích động bạo lực, chia rẽ gây mất đoàn kết giữa các dân tộc, nội bộ...`

export class GuiCauHoi_VTS extends Component {
    constructor(props) {
        super(props)
        this.callback = Utils.ngetParam(this, 'callback', () => { })
        this.isHandleAdmin = Utils.ngetParam(this, 'isHandleAdmin', false)
        //----Code nhập nội dụng Voices
        Voice.onSpeechEnd = this.onSpeechEndHandler.bind(this);
        Voice.onSpeechResults = this.onSpeechResultsHandler.bind(this);
        Voice.onSpeechError = this.onSpeechError.bind(this);
        this.newContent = '';
        this.oldContent = '';
        this.itemEdit = Utils.ngetParam(this, 'itemEdit', null)
        //-------
        this.state = {
            HoTen: '',
            DiaChi: '',
            SDT: '',
            Email: '',
            TieuDe: '',
            NoiDung: '',
            ListFileDinhKemNew: [],
            ListHinhAnh: this.itemEdit?.lstDinhKem || [],
            ListHinhAnhDelete: [],
            isLoading: false,
            Id: null,
            ...this.itemEdit
        }
        console.log(this.itemEdit?.lstDinhKem)
    }


    onCheckErrorInput = (text, type) => {
        switch (type) {
            case 1:
                if (text?.trim()?.length <= 0) {
                    return 'Cá nhân/Tổ chức bắt buộc nhập'
                }
                break;
            case 2:
                if (text?.trim()?.length <= 0) {
                    return 'Số điện thoại bắt buộc nhập'
                }
            case 3:
                if (text?.trim()?.length <= 0) {
                    return 'Tiêu đề bắt buộc nhập'
                }
                break;
            default:
                break;
        }
    }

    SendQuestion = async () => {
        let { SDT, Email, TieuDe, NoiDung, ListFileDinhKemNew, ListHinhAnhDelete, ListHinhAnh, HoTen, DiaChi, Id } = this.state
        let warning = ''
        if (!HoTen) {
            warning += 'Cá nhân/Tổ chức bắt buộc nhập\n'
        }
        if (!SDT) {
            warning += 'Số điện thoại bắt buộc nhập\n'
        }
        if (!TieuDe) {
            warning += 'Tiêu đề bắt buộc nhập\n'
        }
        if (!NoiDung) {
            warning += 'Nội dung câu hỏi bắt buộc nhập\n'
        }

        const DevicesToken = await Utils.ngetStore(nkey.userId_OneSignal, '');
        let dem = 0;
        if (warning == '') {
            let dataBoDy = new FormData();

            // Utils.nlog("giá trị lish hình ảnh", ListHinhAnh);

            //duyệt hình
            for (let index = 0; index < ListFileDinhKemNew.length; index++) {
                dem++;
                let item = ListFileDinhKemNew[index];
                Utils.nlog("Log ra item nè!!", item)
                let file = `File${index == 0 ? '' : index} `;

                if (item.type == 2) {
                    if (Platform.OS == 'ios') {
                        const dest = `${RNFS.TemporaryDirectoryPath}${Math.random().toString(36).substring(7)}.mp4`;
                        let uriReturn = await RNFS.copyAssetsVideoIOS(item.uri, dest);
                        await RNCompress.compressVideo(uriReturn, 'medium').then(uri => {
                            console.log("uri mới nhe", uri);
                            dataBoDy.append(file,
                                {
                                    name: "filename" + index + '.mp4',
                                    type: "video/mp4",
                                    uri: uri.path

                                });

                        })

                    } else {
                        dataBoDy.append(file,
                            {
                                name: "filename" + index + '.mp4',
                                type: "video/mp4",
                                uri: item.uri
                            });

                    }
                }
                else if (item.type == 3) {
                    dataBoDy.append(file,
                        {
                            name: item.name,
                            type: item.typeAplication || "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                            uri: item.uri
                        });

                }
                else {
                    await ImageResizer.createResizedImage(item.uri, item.width, item.height, 'JPEG', Platform.OS == 'android' ? 60 : 40, 0)
                        .then(async (response) => {
                            dataBoDy.append(file,
                                {
                                    name: "file" + index + '.png',
                                    type: "image/png",
                                    uri: response.uri
                                });
                        })
                        .catch(err => {
                            dem--;
                            Utils.nlog("gia tri err-----------------", err)
                        });
                };
            }
            if (dem == 0) {
                dataBoDy.append("FileDinhKem", true);
            }
            dataBoDy.append('HoTen', HoTen)
            dataBoDy.append('DiaChi', DiaChi)
            dataBoDy.append('SDT', SDT)
            dataBoDy.append('Email', Email)
            dataBoDy.append('TieuDe', TieuDe)
            dataBoDy.append('NoiDung', NoiDung)
            if (Id) {
                dataBoDy.append('Id', Id)
            }
            if (this.isHandleAdmin) {
                dataBoDy.append('TrangThai', this.itemEdit?.TrangThai)
            } else {
                dataBoDy.append('DevicesToken', DevicesToken)
            }
            nthisIsLoading.show()
            Utils.nlog('data body==============', dataBoDy)
            let res = ''
            if (this.isHandleAdmin) {
                res = await apis.apiHoiDapVTS.Edit_HoiTT_CB_App(dataBoDy)
            } else {
                if (Id) {
                    res = await apis.apiHoiDapVTS.Edit_HoiTT_App(dataBoDy)
                } else {
                    res = await apis.apiHoiDapVTS.Add_HoiTT(dataBoDy)
                }
            }

            nthisIsLoading.hide()
            Utils.nlog('res dau cau hoi=========', this.isHandleAdmin + ' - ' + res)
            if (res.status == 1) {
                Utils.showMsgBoxOK(this, 'Thông báo', `${this.itemEdit ? 'Cập nhật/Chỉnh sửa' : 'Gửi'} câu hỏi thành công!`, 'OK', () => {
                    ROOTGlobal.dataGlobal._reLoadDSHoiDapVTS()
                    if (Id) {
                        ROOTGlobal.dataGlobal._reLoadLichSuHoiDapVTS()
                        this.callback();
                    }
                    if (!this.isHandleAdmin) {
                        Utils.goback(this)
                    } else {
                        ROOTGlobal.dataGlobal._reloadHoiDapAdmin()
                    }
                })
            } else {
                Utils.showMsgBoxOK(this, 'Thông báo', `${this.itemEdit ? 'Cập nhật/Chỉnh sửa' : 'Gửi'} câu hỏi thất bại!`, 'Xác nhận',)
            }
        } else {
            Utils.showMsgBoxOK(this, 'Thông báo', warning, 'Xác nhận')
        }

    }

    hanldeUserNotLogin = () => {
        const { userCD, tokenCD } = this.props.auth
        if (tokenCD.length > 0) {
            this.setState({
                HoTen: userCD?.FullName,
                SDT: userCD?.PhoneNumber,
                Email: userCD?.Email,
                DiaChi: userCD?.DiaChi
            })
        } else {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Vui lòng đăng nhập để gửi câu hỏi', 'Đăng nhập', () => {
                Utils.goscreen(this, 'login')
            })
        }
    }

    componentDidMount() {
        this.hanldeUserNotLogin()
        BackHandler.addEventListener('hardwareBackPress', this.backAction)
    }

    backAction = () => {
        Utils.goback(this)
        return true
    }

    componentWillUnmount() {
        try {
            Voice.destroy().then(Voice.removeAllListeners);
            BackHandler.removeEventListener('hardwareBackPress', this.backAction)
        } catch (error) {

        }
    }

    onSpeechError = async (e) => { // sự kiện khi không thu âm được giọng nói
        const result = await check(PERMISSIONS.ANDROID.RECORD_AUDIO);
        if (e.error.message === '9/Insufficient permissions' && result === 'granted') { // Trường hợp quyền mircophone bị tắt dưới app Google
            Utils.showMsgBoxYesNo(this, 'Thông báo', 'Bạn cần cấp quyền nhận dạng giọng nói Google để sử dụng chức năng này.', 'Đến cài đặt', 'Xem lại', () => { OpenSetting.openSetting('com.google.android.googlequicksearchbox') });
        }
    }

    onSpeechEndHandler = (e) => { // sự kiện lắng nghe khi  ngừng nói
        const { isLoading } = this.state
        if (isLoading)
            this.setState({ isLoading: false })
    }

    converStringText = (text = '') => {
        let textTempt = text
        textTempt = textTempt.trimEnd();
        textTempt = Utils.replaceAll(textTempt, '  ', ' ');
        return textTempt;
    }

    onSpeechResultsHandler = (e) => { // sự kiện lắng nghe khi ngừng nói và xuất ra dữ liệu
        let text = e.value[0]
        this.newContent = text;
        if (Platform.OS == 'ios') {
            if (this.oldContent === '') {
                this.setState({ NoiDung: this.oldContent + '' + this.newContent.toLocaleLowerCase() })
            } else {
                this.setState({ NoiDung: this.converStringText(this.oldContent) + ' ' + this.newContent })
            }
        } else {
            if (this.oldContent === '') {
                let txtNew = this.newContent.slice(0, 1).toUpperCase() + this.newContent.slice(1).toLowerCase();
                this.setState({ NoiDung: this.oldContent + '' + txtNew })
            }
            else
                this.setState({ NoiDung: this.converStringText(this.oldContent) + ' ' + this.newContent.toLowerCase() });
        }
    }

    startRecording = async () => {
        this.setState({ isLoading: true });
        await UtilsApp.StartVoice(this, false, 'NoiDung');
    }
    stopRecording = async () => {
        this.setState({ isLoading: false });
        await UtilsApp.StartVoice(this, true, 'NoiDung');
    }


    render() {
        let { HoTen, DiaChi, SDT, Email, TieuDe, NoiDung, ListFileDinhKemNew, ListHinhAnh, ListHinhAnhDelete, isLoading } = this.state
        return (
            <View style={{ flex: 1, backgroundColor: colors.BackgroundHome, paddingBottom: isIphoneX() ? 20 : 5 }}>
                <HeaderCus
                    Sleft={{ tintColor: 'white' }}
                    onPressLeft={() => Utils.goback(this)}
                    iconLeft={Images.icBack}
                    title={this.state.Id ? 'Cập nhật câu hỏi' : `Đặt câu hỏi`}
                    styleTitle={{ color: colors.white }}
                />
                <KeyboardAwareScrollView>
                    <View style={{ marginTop: 10, paddingHorizontal: 10 }}>
                        <Text style={{ paddingVertical: 5 }}>Cá nhân/Tổ chức<Text style={{ color: colors.redStar }}>*</Text></Text>
                        <TextInputForm
                            styleViewInput={{ borderWidth: 1 }}
                            placeholder={'Nhập tên Cá nhân/Tổ chức'}
                            styleInput={{
                                padding: 10, backgroundColor: colors.white, fontSize: reText(14),
                            }}
                            value={HoTen}
                            onChangeText={(text) => this.setState({ HoTen: text })}
                            onCheckError={(text) => this.onCheckErrorInput(text, 1)}
                            colorNormal={colors.white}
                        />
                        {/* <TextInput
                            placeholder={'Nhập tên Cá nhân/Tổ chức'}
                            value={HoTen}
                            style={{ padding: 10, backgroundColor: colors.white, fontSize: reText(14) }}
                            onChangeText={(text) => this.setState({ HoTen: text })}
                        /> */}
                    </View>
                    <View style={{ marginTop: 10, paddingHorizontal: 10 }}>
                        <Text style={{ paddingVertical: 5 }}>Số điện thoại<Text style={{ color: colors.redStar }}>*</Text></Text>
                        <TextInputForm
                            styleViewInput={{ borderWidth: 0.8 }}
                            placeholder={'Nhập số điện thoại'}
                            keyboardType={'phone-pad'}
                            styleInput={{
                                padding: 10, backgroundColor: colors.white, fontSize: reText(14),
                            }}
                            value={SDT}
                            onChangeText={(text) => this.setState({ SDT: text })}
                            onCheckError={(text) => this.onCheckErrorInput(text, 2)}
                            colorNormal={colors.white}
                        />
                        {/* <TextInput
                            placeholder={'Nhập số điện thoại'}
                            keyboardType={'phone-pad'}
                            value={SDT}
                            style={{ padding: 10, backgroundColor: colors.white, fontSize: reText(14) }}
                            onChangeText={(text) => this.setState({ SDT: text })}
                        /> */}
                    </View>
                    <View style={{ marginTop: 10, paddingHorizontal: 10 }}>
                        <Text style={{ paddingVertical: 5 }}>Email</Text>
                        <TextInputForm
                            styleViewInput={{ borderWidth: 0.8 }}
                            placeholder={'Nhập email'}
                            keyboardType='email-address'
                            styleInput={{
                                padding: 10, backgroundColor: colors.white, fontSize: reText(14),
                            }}
                            value={Email}
                            onChangeText={(text) => this.setState({ Email: text })}
                            colorNormal={colors.white}
                        />
                        {/* <TextInput
                            placeholder={'Nhập email'}
                            keyboardType='email-address'
                            value={Email}
                            style={{ padding: 10, backgroundColor: colors.white, fontSize: reText(14) }}
                            onChangeText={(text) => this.setState({ Email: text })}
                        /> */}
                    </View>
                    <View style={{ marginTop: 10, paddingHorizontal: 10 }}>
                        <Text style={{ paddingVertical: 5 }}>Địa chỉ</Text>
                        <TextInputForm
                            styleViewInput={{ borderWidth: 0.8 }}
                            styleInput={{
                                padding: 10, backgroundColor: colors.white, fontSize: reText(14),
                            }}
                            placeholder={'Nhập địa chỉ'}
                            value={DiaChi}
                            onChangeText={(text) => this.setState({ DiaChi: text })}
                            colorNormal={colors.white}
                        />
                        {/* <TextInput
                            placeholder={'Nhập địa chỉ'}
                            value={DiaChi}
                            style={{ padding: 10, backgroundColor: colors.white, fontSize: reText(14) }}
                            onChangeText={(text) => this.setState({ DiaChi: text })}
                        /> */}
                    </View>
                    <View style={{ marginTop: 10, paddingHorizontal: 10 }}>
                        <Text style={{ paddingVertical: 5 }}>Tiêu đề<Text style={{ color: colors.redStar }}>*</Text></Text>
                        <TextInputForm
                            styleViewInput={{ borderWidth: 1 }}
                            styleInput={{
                                padding: 10, backgroundColor: colors.white, fontSize: reText(14),
                            }}
                            placeholder={'Nhập tiêu đề'}
                            value={TieuDe}
                            onChangeText={(text) => this.setState({ TieuDe: text })}
                            onCheckError={(text) => this.onCheckErrorInput(text, 3)}
                            colorNormal={colors.white}
                        />
                        {/* <TextInput
                            placeholder={'Nhập tiêu đề'}
                            value={TieuDe}
                            style={{ padding: 10, backgroundColor: colors.white, fontSize: reText(14) }}
                            onChangeText={(text) => this.setState({ TieuDe: text })}
                        /> */}
                    </View>
                    <View style={{ marginTop: 10, paddingHorizontal: 10 }}>
                        <Text style={{ paddingVertical: 5 }}>Nhập nội dung câu hỏi<Text style={{ color: colors.redStar }}>*</Text></Text>
                        <TouchableOpacity onPress={() => Utils.goscreen(this, "Modal_EditHTML", {
                            content: NoiDung,
                            callback: (val) => this.setState({ NoiDung: val })
                        })}>
                            {NoiDung ?
                                <HtmlViewCom html={NoiDung} style={{ height: '100%', backgroundColor: colors.white, padding: 10, minHeight: 100 }} /> :
                                <View style={{ padding: 10, backgroundColor: colors.white, height: 100 }}>
                                    <Text style={{ color: colors.brownGreyTwo }}>Nhập nội dung</Text>
                                </View>}
                        </TouchableOpacity>
                        <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                            {isLoading ? <LottieView source={Images.icVoice} autoPlay style={{ height: Height(12) / 1.5, alignItems: 'center', justifyContent: 'center' }} /> : null}
                            <TouchableOpacity
                                onPressIn={this.startRecording}
                                onPressOut={() => this.stopRecording()}
                                style={{ paddingVertical: 10, flexDirection: 'row' }}
                            >
                                <Image
                                    source={Images.icMicro}
                                    style={nstyles.nIcon32}
                                />
                            </TouchableOpacity>
                            {isLoading ? <LottieView source={Images.icVoice} autoPlay style={{ height: Height(12) / 1.5, alignItems: 'center', justifyContent: 'center' }} /> : null}
                        </View>

                        <Text style={{ marginTop: 5, fontSize: reText(15), textAlign: 'center' }} >{'Ấn giữ để nhập nội dung bằng giọng nói'}</Text>

                        <Text style={{ color: colors.redStar, textAlign: 'justify', fontSize: reText(14), marginTop: 10, lineHeight: 20 }}>{`(*) Chú ý: ${khuyennghi}`}</Text>
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <Text style={{ paddingVertical: 5, paddingLeft: 10 }}>Đính kèm file (tối đa 1 file):</Text>
                        <ImagePickerNew
                            data={this.itemEdit ? ListHinhAnh.map(e => { return { ...e, uri: e.Link } }) : []}
                            dataNew={!this.itemEdit ? ListHinhAnh.map(e => { return { ...e, uri: e.Link } }) : []}
                            NumberMax={1}
                            isEdit={true}
                            keyname={"TenFile"} uniqueKey={'uri'} nthis={this}
                            onDeleteFileOld={(data) => {
                                let dataNew = [].concat(ListHinhAnhDelete).concat(data)
                                this.setState({ ListHinhAnhDelete: dataNew })
                            }}
                            onAddFileNew={(data) => {
                                Utils.nlog("Data list image mớ", data)
                                this.setState({ ListFileDinhKemNew: data })
                            }}
                            onUpdateDataOld={(data) => {
                                this.setState({ ListHinhAnh: data })
                            }}
                            isPickOne={true}
                            nthis={this}
                        >
                        </ImagePickerNew>
                    </View>
                    <ButtonCom
                        text={this.state.Id ? 'Cập nhật câu hỏi' : "Gửi câu hỏi"}
                        onPress={this.SendQuestion}
                        style={{ borderRadius: 5, marginHorizontal: 10, }}
                        txtStyle={{ fontSize: reText(14) }}
                    />
                </KeyboardAwareScrollView>
                <IsLoading />
            </View>
        )
    }
}

const mapStateToProps = state => ({
    theme: state.theme,
    auth: state.auth,
});
export default Utils.connectRedux(GuiCauHoi_VTS, mapStateToProps)
