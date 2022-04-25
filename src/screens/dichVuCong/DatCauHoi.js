import React, { Component } from 'react'
import { Platform, Text, View, TouchableOpacity, Image, TextInput, Alert, BackHandler } from 'react-native'
import { isIphoneX } from 'react-native-iphone-x-helper'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Utils from '../../../app/Utils'
import { Images } from '../../images'
import { colors } from '../../../styles'
import { reText } from '../../../styles/size'
import { nstyles, paddingTopMul } from '../../../styles/styles'
import * as Animatable from 'react-native-animatable'
import HtmlViewCom from '../../../components/HtmlView'
import ImagePickerNew from '../../../components/ComponentApps/ImagePicker/ImagePickerNew'
import RNFS from 'react-native-fs';
import ImageResizer from 'react-native-image-resizer';
import RNCompress from '../../RNcompress'
import apis from '../../apis'
import { ButtonCom, HeaderCus, IsLoading } from '../../../components'

export class DatCauHoi extends Component {
    constructor(props) {
        super(props)
        this.callback = Utils.ngetParam(this, 'callback')
        this.state = {
            HoTen: '',
            DiaChi: '',
            SoDT: '',
            Email: '',
            TieuDe: '',
            NoiDung: '',
            ListFileDinhKemNew: [],
            ListHinhAnh: [],
            ListHinhAnhDelete: []
        }
    }

    SendQuestion = async () => {
        let { SoDT, Email, TieuDe, NoiDung, ListFileDinhKemNew, ListHinhAnhDelete, ListHinhAnh, HoTen, DiaChi, } = this.state
        let warning = ''
        if (!SoDT) {
            warning += 'Số điện thoại bắt buộc nhập\n'
        }
        if (!TieuDe) {
            warning += 'Tiêu đề bắt buộc nhập\n'
        }
        if (!NoiDung) {
            warning += 'Nội dung câu hỏi bắt buộc nhập\n'
        }


        if (warning == '') {
            let dataBoDy = new FormData();

            // Utils.nlog("giá trị lish hình ảnh", ListHinhAnh);

            //duyệt hình
            for (let index = 0; index < ListFileDinhKemNew.length; index++) {
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
                            Utils.nlog("gia tri err-----------------", err)
                        });
                };
            }



            dataBoDy.append('hoten', HoTen)
            dataBoDy.append('diachi', DiaChi)
            dataBoDy.append('sdt', SoDT)
            dataBoDy.append('email', Email)
            dataBoDy.append('tieude', TieuDe)
            dataBoDy.append('noidung', NoiDung)
            nthisIsLoading.show()
            Utils.nlog('data body==============', dataBoDy)
            let res = await apis.ApiDVC.DatCauHoi(dataBoDy)
            nthisIsLoading.hide()
            Utils.nlog('res dau cau hoi=========', res)
            if (res.status == 1) {
                if (res.data.trangthai == 'thanhcong') {
                    Utils.showMsgBoxOK(this, 'Thông báo', 'Gửi câu hỏi thành công!', 'Xác nhận', () => {
                        this.callback();
                        Utils.goback(this)
                    })
                }
            } else {
                Utils.showMsgBoxOK(this, 'Thông báo', 'Gửi câu hỏi thất bại!', 'Xác nhận',)
            }
        } else {
            Utils.showMsgBoxOK(this, 'Thông báo', warning, 'Xác nhận')
        }

    }

    componentDidMount() {
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

    render() {
        let { HoTen, DiaChi, SoDT, Email, TieuDe, NoiDung, ListFileDinhKemNew, ListHinhAnh, ListHinhAnhDelete } = this.state
        return (
            <View style={{ flex: 1, backgroundColor: colors.BackgroundHome, paddingBottom: isIphoneX() ? 20 : 5 }}>
                <HeaderCus
                    Sleft={{ tintColor: 'white' }}
                    onPressLeft={() => Utils.goback(this)}
                    iconLeft={Images.icBack}
                    title={`Đặt câu hỏi`}
                    styleTitle={{ color: colors.white }}
                />
                <KeyboardAwareScrollView>
                    <Animatable.View animation={'slideInLeft'} style={{ marginTop: 10, paddingHorizontal: 10 }}>
                        <Text style={{ paddingVertical: 5 }}>Cá nhân/Tổ chức</Text>
                        <TextInput
                            placeholder={'Nhập tên Cá nhân/Tổ chức'}
                            value={HoTen}
                            style={{ padding: 10, backgroundColor: colors.white, fontSize: reText(14) }}
                            onChangeText={(text) => this.setState({ HoTen: text })}
                        />
                    </Animatable.View>
                    <Animatable.View animation={'slideInRight'} style={{ marginTop: 10, paddingHorizontal: 10 }}>
                        <Text style={{ paddingVertical: 5 }}>Địa chỉ</Text>
                        <TextInput
                            placeholder={'Nhập địa chỉ'}
                            value={DiaChi}
                            style={{ padding: 10, backgroundColor: colors.white, fontSize: reText(14) }}
                            onChangeText={(text) => this.setState({ DiaChi: text })}
                        />
                    </Animatable.View>
                    <Animatable.View animation={'slideInLeft'} style={{ marginTop: 10, paddingHorizontal: 10 }}>
                        <Text style={{ paddingVertical: 5 }}>Số điện thoại</Text>
                        <TextInput
                            placeholder={'Nhập số điện thoại'}
                            keyboardType={'phone-pad'}
                            value={SoDT}
                            style={{ padding: 10, backgroundColor: colors.white, fontSize: reText(14) }}
                            onChangeText={(text) => this.setState({ SoDT: text })}
                        />
                    </Animatable.View>
                    <Animatable.View animation={'slideInRight'} style={{ marginTop: 10, paddingHorizontal: 10 }}>
                        <Text style={{ paddingVertical: 5 }}>Email</Text>
                        <TextInput
                            placeholder={'Nhập email'}
                            value={Email}
                            keyboardType='email-address'
                            style={{ padding: 10, backgroundColor: colors.white, fontSize: reText(14) }}
                            onChangeText={(text) => this.setState({ Email: text })}
                        />
                    </Animatable.View>
                    <Animatable.View animation={'slideInLeft'} style={{ marginTop: 10, paddingHorizontal: 10 }}>
                        <Text style={{ paddingVertical: 5 }}>Tiêu đề</Text>
                        <TextInput
                            placeholder={'Nhập tiêu đề'}
                            value={TieuDe}
                            style={{ padding: 10, backgroundColor: colors.white, fontSize: reText(14) }}
                            onChangeText={(text) => this.setState({ TieuDe: text })}
                        />
                    </Animatable.View>
                    <Animatable.View animation={'slideInRight'} style={{ marginTop: 10, paddingHorizontal: 10 }}>
                        <Text style={{ paddingVertical: 5 }}>Nhập nội dung câu hỏi</Text>
                        <TouchableOpacity onPress={() => Utils.goscreen(this, "Modal_EditHTML", {
                            content: NoiDung,
                            callback: (val) => this.setState({ NoiDung: val })
                        })}>
                            {NoiDung ?
                                <HtmlViewCom html={NoiDung} style={{ height: '100%', backgroundColor: colors.white, padding: 10 }} /> :
                                <View style={{ padding: 10, backgroundColor: colors.white, height: 100 }}>
                                    <Text style={{ color: colors.brownGreyTwo }}>Nhập nội dung</Text>
                                </View>}
                        </TouchableOpacity>
                    </Animatable.View>
                    <Animatable.View animation={'slideInLeft'} style={{ marginTop: 10 }}>
                        <Text style={{ paddingVertical: 5, paddingLeft: 10 }}>Đính kèm file (tối đa 1 file):</Text>
                        <ImagePickerNew
                            data={ListHinhAnh}
                            dataNew={ListHinhAnh}
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
                        >
                        </ImagePickerNew>
                    </Animatable.View>
                </KeyboardAwareScrollView>
                <ButtonCom
                    text={"Gửi câu hỏi"}
                    onPress={this.SendQuestion}
                    style={{ borderRadius: 5, marginHorizontal: 10, }}
                    txtStyle={{ fontSize: reText(14) }}
                />
                <IsLoading />
            </View>
        )
    }
}

export default DatCauHoi
