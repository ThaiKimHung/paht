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
import { Height } from '../../../chat/styles/styles';

class GiayThongHanh extends Component {
    constructor(props) {
        super(props);
        this.callback = Utils.ngetParam(this, 'callback', () => { })
        this.state = {
            imgGiayThongHanh: '',
            isChange: true
        };
        this.refLoading = createRef()
    }

    componentDidMount() {
        const { userCD } = this.props.auth
        if (userCD?.GiayThongHanh) {
            this.setState({ isChange: false })
        }
    }

    close = () => {
        Utils.goback(this)
    }

    confirm = async () => {
        const { imgAfter, imgGiayThongHanh } = this.state
        if (!imgGiayThongHanh) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Vui lòng chọn/chụp ảnh giấy thông hành.', 'Xác nhận')
            return
        }

        this.refLoading.current.show();
        let downSize = Platform.OS != 'ios' || versionIOS_12 ? 0.8 : 0.7;
        let strBase64_ThongHanh = await Utils.parseBase64(imgGiayThongHanh.uri, imgGiayThongHanh.height ? imgGiayThongHanh.height : 2000, imgGiayThongHanh.width ? imgGiayThongHanh.width : 2000, downSize, false, false);

        let giayThongHanh = {
            strBase64: strBase64_ThongHanh,
            filename: imgGiayThongHanh.filename
        }
        let body = {
            ...this.props.auth.userCD,
            GiayThongHanh: giayThongHanh
        }
        Utils.nlog('[body]', body)
        let res = await apis.ApiUser.CapNhatTTCongDan(body)
        this.refLoading.current.hide()
        Utils.nlog('[res]', res)
        if (res.status == 1 && res.data) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Tải lên giấy thông hành thành công!', 'Xác nhận', () => {
                this.callback()
                Utils.goback(this)
            })
        } else {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Tải lên giấy thông hành thất bại !', 'Xác nhận')
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
                imgGiayThongHanh: {
                    ...data[0],
                    filename: 'Giay_Thong_Hanh.png'
                }
            })
            this.refLoading.current.hide()
        }
    }

    changeCMND = () => {
        this.setState({ isChange: true })
    }

    showGiayThongHanh = (index = 0) => {
        const { userCD } = this.props.auth
        if (userCD?.GiayThongHanh) {
            Utils.goscreen(this, 'Modal_ShowListImage', { ListImages: [{ url: appConfig.domain + userCD?.GiayThongHanh }], index });
        }
    }

    render() {
        const { imgGiayThongHanh, isChange } = this.state
        const { userCD } = this.props.auth
        return (
            <View style={stGiayThongHanh.container}>
                <HeaderCus
                    Sleft={{ tintColor: 'white' }}
                    onPressLeft={() => { Utils.goback(this) }}
                    iconLeft={Images.icBack}
                    title={`Giấy thông hành`}
                    styleTitle={{ color: colors.white }}
                />
                <View style={stGiayThongHanh.body}>
                    <ScrollView>
                        <Text style={stGiayThongHanh.title}>{userCD?.GiayThongHanh && !isChange ? '(*) Giấy thông hành' : '(*) Vui lòng chụp rõ giấy thông hành.'}</Text>
                        <TouchableOpacity onPress={!isChange ? () => this.showGiayThongHanh() : () => this.chooseImage_FaceFront()} activeOpacity={0.5} style={stGiayThongHanh.card}>
                            {
                                imgGiayThongHanh || (userCD?.GiayThongHanh && !isChange) ?
                                    <ImageCus
                                        source={userCD?.GiayThongHanh && !isChange ? { uri: appConfig.domain + userCD?.GiayThongHanh } : { uri: imgGiayThongHanh.uri }}
                                        style={stGiayThongHanh.imageCard} resizeMode={'contain'}
                                    /> :
                                    <View style={stGiayThongHanh.titleCard}>
                                        <Text style={stGiayThongHanh.txtCard}>{'Tải lên giấy thông hành.'}</Text>
                                    </View>
                            }
                        </TouchableOpacity>
                    </ScrollView>
                    <View style={stGiayThongHanh.footer}>
                        <ButtonCom
                            Linear={true}
                            colorChange={[colors.grayLight, colors.grayLight]}
                            text={"Đóng"}
                            onPress={this.close}
                            styleTouchable={{ flex: 1 }}
                            style={stGiayThongHanh.button}
                            txtStyle={{ fontSize: reText(14) }}
                        />
                        {
                            isChange ? <ButtonCom
                                text={"Xác thực"}
                                onPress={this.confirm}
                                style={stGiayThongHanh.button}
                                styleTouchable={{ flex: 1 }}
                                txtStyle={{ fontSize: reText(14) }}
                            /> : <ButtonCom
                                text={"Thay đổi"}
                                onPress={this.changeCMND}
                                style={stGiayThongHanh.button}
                                styleTouchable={{ flex: 1 }}
                                txtStyle={{ fontSize: reText(14) }}
                            />
                        }
                    </View>
                    <IsLoading ref={this.refLoading} />
                </View>
            </View >
        );
    }
}

const stGiayThongHanh = StyleSheet.create({
    container: { flex: 1 },
    body: { flex: 1, backgroundColor: colors.white, padding: 10, paddingBottom: 20 },
    title: { color: colors.redStar, paddingVertical: 10 },
    card: {
        ...nstyles.shadow, backgroundColor: colors.black_10, borderRadius: 10, borderWidth: 0.5, borderColor: colors.greenFE, height: Height(50)
    },
    titleCard: { height: '100%', alignItems: 'center', justifyContent: 'center' },
    txtCard: { color: colors.greenFE, fontWeight: 'bold' },
    footer: { flexDirection: 'row', justifyContent: 'space-between' },
    button: { borderRadius: 5, marginHorizontal: 10, marginTop: 8 },
    imageCard: { width: '100%', height: '100%', borderRadius: 10 }

})
const mapStateToProps = state => ({
    auth: state.auth
});
export default Utils.connectRedux(GiayThongHanh, mapStateToProps, true);
