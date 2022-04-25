import React, { Component, createRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet, Platform } from 'react-native';
import Utils from '../../../app/Utils';
import { ButtonCom, HeaderCus, IsLoading } from '../../../components';
import { colors } from '../../../styles';
import { reText } from '../../../styles/size';
import { nstyles, versionIOS_12 } from '../../../styles/styles';
import { Images } from '../../images';
import RNFS from 'react-native-fs';
import apis from '../../apis';
import ImageCus from '../../../components/ImageCus';
import { appConfig } from '../../../app/Config';

class UploadCMND extends Component {
    constructor(props) {
        super(props);
        this.callback = Utils.ngetParam(this, 'callback', () => { })
        this.state = {
            imgFront: '',
            imgAfter: '',
            isChange: true
        };
        this.refLoading = createRef()
    }

    componentDidMount() {
        const { userCD } = this.props.auth
        if (userCD?.AnhCMNDT && userCD.AnhCMNDS) {
            this.setState({ isChange: false })
        }
    }

    close = () => {
        Utils.goback(this)
    }

    confirm = async () => {
        const { imgAfter, imgFront } = this.state
        if (!imgFront) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Vui lòng chọn ảnh CMND/CCCD mặt trước', 'Xác nhận')
            return
        }
        if (!imgAfter) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Vui lòng chọn ảnh CMND/CCCD mặt sau', 'Xác nhận')
            return
        }
        this.refLoading.current.show();
        let downSize = Platform.OS != 'ios' || versionIOS_12 ? 0.8 : 0.7;
        let strBase64_imgFront = await Utils.parseBase64(imgFront.uri, imgFront.height ? imgFront.height : 2000, imgFront.width ? imgFront.width : 2000, downSize, false, false);
        let strBase64_imgAfter = await Utils.parseBase64(imgAfter.uri, imgAfter.height ? imgAfter.height : 2000, imgAfter.width ? imgAfter.width : 2000, downSize, false, false);
        let anhCMND = [
            {
                strBase64: strBase64_imgFront,
                filename: imgFront.filename
            },
            {
                strBase64: strBase64_imgAfter,
                filename: imgAfter.filename
            }
        ]
        let body = {
            ...this.props.auth.userCD,
            AnhCMND: anhCMND
        }
        Utils.nlog('[body]', body)

        let res = await apis.ApiUser.CapNhatTTCongDan(body)
        this.refLoading.current.hide()
        Utils.nlog('[res]', res)
        if (res.status == 1 && res.data) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Xác thực danh tính CMND/CCCD thành công !', 'Xác nhận', () => {
                this.callback()
                Utils.goback(this)
            })
        } else {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Xác thực danh tính CMND/CCCD thất bại !', 'Xác nhận')
        }
    }

    chooseImage_FaceFront = () => {
        let options = {
            assetType: 'Photos',//All,Videos,Photos - default
            multi: false,// chọn 1 or nhiều item
            response: data => this.resChooseImage_FaceFront(data), // callback giá trị trả về khi có chọn item
            limitCheck: 1, //gioi han sl media chon: -1 la khong co gioi han, >-1 la gioi han sl =  limitCheck
            groupTypes: 'All',
        };
        Utils.goscreen(this, 'Modal_MediaPicker', options);
    }

    resChooseImage_FaceFront = async (data) => {
        if (data.length > 0) {
            this.refLoading.current.show()
            this.setState({
                imgFront: {
                    ...data[0],
                    filename: 'CMND_MatTruoc.png'
                }
            })
            this.refLoading.current.hide()
        }
    }

    chooseImage_FaceAfter = () => {
        let options = {
            assetType: 'Photos',//All,Videos,Photos - default
            multi: false,// chọn 1 or nhiều item
            response: data => this.resChooseImage_FaceAfter(data), // callback giá trị trả về khi có chọn item
            limitCheck: 1, //gioi han sl media chon: -1 la khong co gioi han, >-1 la gioi han sl =  limitCheck
            groupTypes: 'All',
        };
        Utils.goscreen(this, 'Modal_MediaPicker', options);
    }

    resChooseImage_FaceAfter = async (data) => {
        if (data.length > 0) {
            this.refLoading.current.show()
            this.setState({
                imgAfter: {
                    ...data[0],
                    filename: 'CMND_MatSau.png'
                }
            })
            this.refLoading.current.hide()
        }
    }

    changeCMND = () => {
        this.setState({ isChange: true })
    }

    showCMND = (isFont = true, index = 0) => {
        const { userCD } = this.props.auth
        if (userCD?.AnhCMNDT && isFont) {
            Utils.goscreen(this, 'Modal_ShowListImage', { ListImages: [{ url: appConfig.domain + userCD?.AnhCMNDT }], index });
            return;
        }
        if (userCD?.AnhCMNDS && !isFont) {
            Utils.goscreen(this, 'Modal_ShowListImage', { ListImages: [{ url: appConfig.domain + userCD?.AnhCMNDS }], index });
            return;
        }
    }

    render() {
        const { imgAfter, imgFront, isChange } = this.state
        const { userCD } = this.props.auth
        return (
            <View style={stUploadCMND.container}>
                <HeaderCus
                    Sleft={{ tintColor: 'white' }}
                    onPressLeft={() => { Utils.goback(this) }}
                    iconLeft={Images.icBack}
                    title={`Xác thực danh tính`}
                    styleTitle={{ color: colors.white }}
                />
                <View style={stUploadCMND.body}>
                    <ScrollView>
                        <Text style={stUploadCMND.title}>{userCD?.AnhCMNDT && !isChange ? '(*) CMND/CCCD mặt trước' : '(*) Vui lòng chụp rõ ảnh CMND/CCCD mặt trước.'}</Text>
                        <TouchableOpacity onPress={!isChange ? () => this.showCMND() : () => this.chooseImage_FaceFront()} activeOpacity={0.5} style={stUploadCMND.card}>
                            {
                                imgFront || (userCD?.AnhCMNDT && !isChange) ?
                                    <ImageCus
                                        source={userCD?.AnhCMNDT && !isChange ? { uri: appConfig.domain + userCD?.AnhCMNDT } : { uri: imgFront.uri }}
                                        style={stUploadCMND.imageCard} resizeMode={'contain'}
                                    /> :
                                    <View style={stUploadCMND.titleCard}>
                                        <Text style={stUploadCMND.txtCard}>{'Ảnh CMND/CCCD mặt trước.'}</Text>
                                    </View>
                            }
                        </TouchableOpacity>

                        <Text style={stUploadCMND.title}>{userCD?.AnhCMNDS && !isChange ? '(*) CMND/CCCD mặt sau' : '(*) Vui lòng chụp rõ ảnh CMND/CCCD mặt sau.'}</Text>
                        <TouchableOpacity onPress={!isChange ? () => this.showCMND(false) : () => this.chooseImage_FaceAfter()} activeOpacity={0.5} style={stUploadCMND.card}>
                            {
                                imgAfter || (userCD?.AnhCMNDS && !isChange) ?
                                    <ImageCus
                                        source={userCD?.AnhCMNDS && !isChange ? { uri: appConfig.domain + userCD?.AnhCMNDS } : { uri: imgAfter.uri }}
                                        style={stUploadCMND.imageCard} resizeMode={'contain'}
                                    /> :
                                    <View style={stUploadCMND.titleCard}>
                                        <Text style={stUploadCMND.txtCard}>{'Ảnh CMND/CCCD mặt sau.'}</Text>
                                    </View>
                            }
                        </TouchableOpacity>
                    </ScrollView>
                    <View style={stUploadCMND.footer}>
                        <ButtonCom
                            Linear={true}
                            colorChange={[colors.grayLight, colors.grayLight]}
                            text={"Quay lại"}
                            onPress={this.close}
                            styleTouchable={{ flex: 1 }}
                            style={stUploadCMND.button}
                            txtStyle={{ fontSize: reText(14) }}
                        />
                        {
                            isChange ? <ButtonCom
                                text={"Xác thực"}
                                onPress={this.confirm}
                                style={stUploadCMND.button}
                                styleTouchable={{ flex: 1 }}
                                txtStyle={{ fontSize: reText(14) }}
                            /> : <ButtonCom
                                text={"Đổi CMND/CCCD"}
                                onPress={this.changeCMND}
                                style={stUploadCMND.button}
                                styleTouchable={{ flex: 1 }}
                                txtStyle={{ fontSize: reText(14) }}
                            />
                        }
                    </View>
                    <IsLoading ref={this.refLoading} />
                </View>
            </View>
        );
    }
}

const stUploadCMND = StyleSheet.create({
    container: { flex: 1 },
    body: { flex: 1, backgroundColor: colors.white, padding: 10, paddingBottom: 20 },
    title: { color: colors.redStar, paddingVertical: 10 },
    card: {
        ...nstyles.shadow, backgroundColor: colors.black_10, borderRadius: 10, borderWidth: 0.5, borderColor: colors.greenFE
    },
    titleCard: { height: 300, alignItems: 'center', justifyContent: 'center' },
    txtCard: { color: colors.greenFE, fontWeight: 'bold' },
    footer: { flexDirection: 'row', justifyContent: 'space-between' },
    button: { borderRadius: 5, marginHorizontal: 10, marginTop: 8 },
    imageCard: { width: '100%', height: 300, borderRadius: 10 }

})
const mapStateToProps = state => ({
    auth: state.auth
});
export default Utils.connectRedux(UploadCMND, mapStateToProps, true);
