import React, { Component } from 'react';
import { View, Text, BackHandler, TextInput, Image, Platform, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Utils from '../../../app/Utils';
import { ButtonCom, HeaderCus, IsLoading } from '../../../components';

import { Images } from '../../images';
import { reText } from '../../../styles/size';
import apis from '../../apis';
import { Height, nstyles } from '../../../styles/styles';
import ImagePickerNew from '../../../components/ComponentApps/ImagePicker/ImagePickerNew';
import RNFS from 'react-native-fs';
import RNCompress from '../../RNcompress'
import ImageResizer from 'react-native-image-resizer';
import { nGlobalKeys } from '../../../app/keys/globalKey';
import { colors } from '../../../styles';
import UtilsApp from '../../../app/UtilsApp';
import ComponentItem, { TYPES } from '../user/dangky/Component';
import FontSize from '../../../styles/FontSize';
import TextInputForm from '../../../components/TextInputForm';
import { color } from 'react-native-reanimated';

class GopY extends Component {
    constructor(props) {
        super(props);
        this.state = {
            HoTen: '',
            SoDienThoai: '',
            NoiDung: '',
            ListHinhAnh: [],
            ListHinhAnhDelete: [],
            ListFileDinhKemNew: [],
            selectedType: '',
            dataGopY: []
        };
    }

    async componentDidMount() {
        if (this.props.auth.userCD) {
            this.setState({ HoTen: this.props.auth.userCD.FullName, SoDienThoai: this.props.auth.userCD.PhoneNumber })
        }
        this.GetLoaiFeedBack()
        // if (!this.props.auth.tokenCD) {
        //     Utils.showMsgBoxOK(this, 'Thông báo', 'Vui lòng đăng nhập để sử dụng chức năng này !', 'OK', () => Utils.goscreen(this, 'login'))
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

    GetLoaiFeedBack = async () => {
        nthisIsLoading.show()
        let res = await apis.ApiUser.LoaiFeedBack()
        nthisIsLoading.hide()
        Utils.nlog('LOG res loai gop y', res)
        if (res.status == 1 && res.data) {
            this.setState({ dataGopY: res.data })
        } else {
            this.setState({ dataGopY: [] })
        }
    }

    _sendGopYIOC = () => {
        let { HoTen, SoDienThoai, NoiDung, selectedType } = this.state
        let warning = ''
        if (!HoTen) {
            warning += 'Họ và tên bắt buộc nhập \n'
        }
        if (!SoDienThoai || SoDienThoai.length < 10) {
            warning += 'Số điện thoại chưa hợp lệ \n'
        }
        // if (!selectedType?.Id) {
        //     warning += 'Loại góp ý \n' //  tỉnh nào cần thì mở ra
        // }
        if (!NoiDung) {
            warning += 'Nội dung bắt buộc nhập'
        }
        if (warning.length > 0) {
            Utils.showMsgBoxOK(this, 'Thông báo', warning, 'Xác nhận')
        } else {
            Utils.showMsgBoxYesNo(this, 'Xác nhận yêu cầu', 'Gửi góp ý về IOC'
                , 'Gửi góp ý', 'Xem lại', () => this.guiGopY()
            )
        }

    }
    onCheckErrorInput = (text, type) => {
        switch (type) {
            case 1:
                if (text?.length === 0) {
                    return 'Họ và tên bắt buộc nhập'
                }
                break;
            case 2:
                if (text?.trim()?.length <= 9) {
                    return 'Số điện thoại chưa hợp lệ'
                }
            case 3:
                if (text?.length <= 0) {
                    return 'Nội dung bắt buộc nhập  '
                }
                break;
            default:
                break;
        }
    }
    guiGopY = async () => {
        nthisIsLoading.show()
        let { HoTen, latlng, SoDienThoai, NoiDung, ListHinhAnhDelete, ListHinhAnh, ListFileDinhKemNew, selectedType } = this.state
        let DevicesToken = await Utils.ngetStore(nGlobalKeys.userId_OneSignal, '');
        let dataBoDy = new FormData();
        let dem = 0
        // Utils.nlog("giá trị lish hình ảnh", ListHinhAnh);

        //duyệt hình
        for (let index = 0; index < ListFileDinhKemNew.length; index++) {
            let item = ListFileDinhKemNew[index];
            // Utils.nlog("Log ra item nè!!", item)
            let file = `FileDinhKem${index == 0 ? '' : index} `;
            dem++;
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
                        Utils.nlog("gia tri err-----------------", err)
                    });
            };
        }

        if (dem == 0) {
            dataBoDy.append("Temp", true);
        }

        dataBoDy.append('HoTen', HoTen)
        dataBoDy.append('SDT', SoDienThoai)
        // dataBoDy.append('LoaiFeedBack', selectedType?.Id || '')// Tỉnh nào cần thì mở ra
        dataBoDy.append('NoiDung', NoiDung)
        dataBoDy.append('DevicesToken', DevicesToken)
        Utils.nlog('data body==============', dataBoDy)
        let res = await apis.ApiUpLoad.GuiGopYIOC(dataBoDy)
        nthisIsLoading.hide()
        // Utils.nlog('res gui sos=========', res)
        if (res.status == 1) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Gửi góp ý về IOC thành công!', 'Xác nhận', () => {
                Utils.goscreen(this, 'ManHinh_Home')
            })
        } else {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Gửi góp ý về IOC thất bại!', 'Xác nhận')
        }
    }

    _viewItem = (item, value) => {
        return (
            <View key={item.id} style={{
                flex: 1,
                paddingVertical: FontSize.scale(15),
                borderBottomColor: colors.black_50,
            }}>
                <Text style={{ textAlign: 'center', color: colors.black_60 }} >{item[value]}</Text>
            </View>
        )
    }
    chooseTypeFeedback = () => {
        Utils.goscreen(this, 'Modal_ComponentSelectBottom', {
            callback: (val) => this.callbackType(val),
            item: this.state.selectedType || '',
            title: 'Loại góp ý',
            AllThaoTac: this.state.dataGopY || [],
            ViewItem: (item) => this._viewItem(item, 'TenLoai'), Search: true, key: 'TenLoai'
        })
    }

    callbackType = (val) => {
        this.setState({ selectedType: val })
    }



    render() {
        const { HoTen, SoDienThoai, NoiDung, ListHinhAnh, ListHinhAnhDelete, selectedType } = this.state
        return (
            <View style={{ flex: 1, backgroundColor: colors.BackgroundHome }}>
                <HeaderCus
                    title={UtilsApp.getScreenTitle("ManHinh_GopYIOC", 'Góp ý về TTĐH')}
                    styleTitle={{ color: colors.white }}
                    iconLeft={Images.icBack}
                    onPressLeft={() => { Utils.goscreen(this, 'ManHinh_Home') }}
                // iconRight={Images.ichistory}
                // Sright={{ tintColor: 'white' }}
                // onPressRight={() => { Utils.goscreen(this, 'scLichSuIOC') }}
                />

                <View style={{ flex: 1 }}>
                    <KeyboardAwareScrollView>
                        <Text style={{ padding: 10, color: colors.redStar, fontStyle: 'italic', textAlign: 'justify', lineHeight: 20 }}>
                            {'Chú ý: Chức năng này chỉ để đóng góp ý kiến cải thiện các chức năng, báo lỗi ứng dụng và đề xuất chức năng mới.'}
                        </Text>
                        <View style={{ paddingHorizontal: 10 }}>
                            <Text style={{ paddingVertical: 5, fontWeight: 'bold' }}>{'Họ và tên '}<Text style={{ color: colors.redStar }}>*</Text></Text>
                            <TextInputForm
                                styleViewInput={{ borderWidth: 1 }}
                                placeholder='Họ và tên'
                                styleInput={{
                                    padding: 10, backgroundColor: colors.white, fontSize: reText(14),
                                }}
                                value={HoTen}
                                onChangeText={(text) => this.setState({ HoTen: text })}
                                onCheckError={(text) => this.onCheckErrorInput(text, 1)}
                                colorNormal={colors.white}
                                colorActive={this.props.theme.colorLinear.color[0]}
                            />
                        </View>
                        <View style={{ marginTop: 10, paddingHorizontal: 10 }}>
                            <Text style={{ paddingVertical: 5, fontWeight: 'bold' }}>{'Số điện thoại '}<Text style={{ color: colors.redStar }}>*</Text></Text>
                            <TextInputForm
                                styleViewInput={{ borderWidth: 1 }}
                                placeholder={'Số điện thoại'}
                                styleInput={{
                                    padding: 10, backgroundColor: colors.white, fontSize: reText(14),
                                }}
                                value={SoDienThoai}
                                maxLength={11}
                                keyboardType={'numeric'}
                                onChangeText={(text) => this.setState({ SoDienThoai: text })}
                                onCheckError={(text) => this.onCheckErrorInput(text, 2)}
                                colorNormal={colors.white}
                                colorActive={this.props.theme.colorLinear.color[0]}
                            />
                        </View>
                        {/* {Tỉnh nào cần thì mở ra} */}
                        {/* <Text style={{ marginHorizontal: 10, marginTop: 10, fontWeight: 'bold' }}>{'Loại góp ý'}<Text style={{ color: colors.redStar }}>*</Text></Text>
                        <TouchableOpacity onPress={this.chooseTypeFeedback} activeOpacity={0.5} style={{ margin: 10, padding: 10, backgroundColor: colors.white, borderRadius: 5 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={{ flex: 1, paddingRight: 5, fontSize: reText(14) }} numberOfLines={1}>{selectedType && selectedType?.TenLoai ? selectedType?.TenLoai : '- Chọn loại góp ý -'}</Text>
                                <Image source={Images.icDropDown} resizeMode='contain' style={nstyles.nIcon14} />
                            </View>
                        </TouchableOpacity> */}
                        <Text style={{ marginHorizontal: 10, marginTop: 10, fontWeight: 'bold' }}>{'Nội Dung '}<Text style={{ color: colors.redStar }}>*</Text></Text>
                        <TextInputForm
                            placeholder={'Nội Dung'}
                            styleContainer={{ marginHorizontal: 10, marginTop: 10 }}
                            styleViewInput={{ borderWidth: 1 }}
                            placeholderTextColor={colors.black_20}
                            styleInput={{
                                minHeight: Height(15), maxHeight: Height(20),
                                textAlignVertical: 'top',
                                borderRadius: 3, fontSize: reText(16),
                                backgroundColor: colors.white,
                                justifyContent: 'center',
                            }}
                            multiline={true}
                            value={NoiDung}
                            onChangeText={text => this.setState({ NoiDung: text })}
                            onCheckError={(text) => this.onCheckErrorInput(text, 3)}
                            colorNormal={colors.white}
                            colorActive={this.props.theme.colorLinear.color[0]}
                        />
                        <Text style={{ marginHorizontal: 10, marginTop: 10, fontWeight: 'bold' }}>{'File đính kèm'}</Text>
                        <ImagePickerNew
                            data={ListHinhAnh}
                            dataNew={ListHinhAnh}
                            NumberMax={8}
                            isEdit={true}
                            keyname={"TenFile"} uniqueKey={'uri'} nthis={this}
                            onDeleteFileOld={(data) => {
                                let dataNew = [].concat(ListHinhAnhDelete).concat(data)
                                this.setState({ ListHinhAnhDelete: dataNew })
                            }}
                            onAddFileNew={(data) => {
                                // Utils.nlog("Data list image mớ", data)
                                this.setState({ ListFileDinhKemNew: data })
                            }}
                            onUpdateDataOld={(data) => {
                                this.setState({ ListHinhAnh: data })
                            }}
                            isPickOne={true}
                        >
                        </ImagePickerNew>
                        <ButtonCom
                            text={'Gửi góp ý'}
                            onPress={this._sendGopYIOC}
                            style={{ borderRadius: 5, marginHorizontal: 10, }}
                            txtStyle={{ fontSize: reText(14) }}
                        />
                        <View style={{ marginTop: 15 }}>
                            <Text style={{ marginHorizontal: 10, fontSize: reText(14), fontWeight: 'bold', fontStyle: 'italic', color: colors.black_60 }}>Xem lịch sử góp ý của bạn.</Text>
                            <ButtonCom
                                text={'Lịch sử góp ý'}
                                onPress={() => Utils.goscreen(this, 'scLichSuIOC')}
                                style={{ borderRadius: 5, marginHorizontal: 10, marginTop: 5 }}
                                txtStyle={{ fontSize: reText(14) }}
                            />
                        </View>
                    </KeyboardAwareScrollView>
                    <IsLoading />
                </View>
            </View >
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    theme: state.theme
});
export default Utils.connectRedux(GopY, mapStateToProps, true);