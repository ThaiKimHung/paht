import React, { Component } from 'react'
import { ImageBackground, Platform, Slider, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Utils from '../../../app/Utils'
import { ButtonCom, HeaderCus, IsLoading } from '../../../components'
import { Images } from '../../images'
import { colors } from '../../../styles'
import { Width } from '../../../styles/styles'
import { reText } from '../../../styles/size'

export class ChangeBackground extends Component {
    constructor(props) {
        super(props)
        const { theme } = this.props
        this.state = {
            strBgr: theme.background, // Giá trị base64
            urlBgr: '', // Lưu đường dẫn ảnh mới khi muốn thay đổi
            HeighIMG: '', // Chiều cao ảnh
            WidthIMG: '', //  Chiều rộng ảnh
            valueBlur: theme.blur // Độ mờ của ảnh
        }
    }

    // HÀM GỌI MODAL CHỌN FILE,HÌNH ẢNH
    _chooseBackground = () => {
        let options = {
            assetType: 'Photos',//All,Videos,Photos - default
            multi: false,// chọn 1 or nhiều item
            response: this.response, // callback giá trị trả về khi có chọn item
            limitCheck: 1, //gioi han sl media chon: -1 la khong co gioi han, >-1 la gioi han sl =  limitCheck
            groupTypes: 'All',
            showTakeCamera: true
        }
        Utils.goscreen(this, 'Modal_MediaPicker', options);
    }

    // HÀM CALLBACK XỬ LÝ SAU KHI CHỌN HÌNH ẢNH
    response = async (res) => {
        if (res.iscancel) {
            return;
        }
        else if (res.error) {
            return;
        }
        else {
            //--dữ liệu media trả về là 1 item or 1 mảng item
            //--Xử lý dữ liệu trong đây-----
            Utils.nlog('Hinh da chon', res);
            //element.height ? element.height : 2000, element.width ? element.width : 2000
            this.setState({
                strBgr: '',
                urlBgr: res[0].uri,
                HeighIMG: res[0].height ? res[0].height : 2000,
                WidthIMG: res[0].width ? res[0].width : 2000
            })
        }
    };

    // HÀM ĐỔI GIÁ TRỊ BLUR
    changeValueBlur = (value) => {
        this.setState({ valueBlur: value })
    }

    // THỰC HIỆN HÀNH ĐỘNG THAY ĐỔI ẢNH NỀN LƯU STORE,REDUX
    _SettupBackGround = async () => {
        nthisIsLoading.show()
        let { urlBgr, HeighIMG, WidthIMG, valueBlur, strBgr } = this.state
        let base64 = ''
        if (strBgr != '') {
            base64 = strBgr
        } else {
            base64 = await Utils.parseBase64(urlBgr, HeighIMG, WidthIMG);
        }
        this.props.Set_Background_Home(base64)
        this.props.Set_Blur_Background(valueBlur)
        nthisIsLoading.hide()
        Utils.showMsgBoxOK(this, 'Thông báo', 'Thay đổi ảnh nền thành công.', 'Quay lại', () => {
            Utils.goback(this)
        })
    }

    render() {
        let { urlBgr, valueBlur, strBgr } = this.state
        let base64Icon = ''
        if (strBgr) {
            base64Icon = `data:image/png;base64,${strBgr}`
        }
        const { theme } = this.props
        return (
            <View style={{ flex: 1 }}>
                {/* {HEADER} */}
                <HeaderCus
                    Sleft={{ tintColor: 'white' }}
                    onPressLeft={() => Utils.goback(this)}
                    iconLeft={Images.icBack}
                    title={`Đổi hình nền ứng dụng`}
                    styleTitle={{ color: colors.white }}
                />
                {/* {BODY} */}
                <ImageBackground
                    blurRadius={valueBlur}
                    source={strBgr || urlBgr ? { uri: strBgr ? `data:image/png;base64,${strBgr}` : urlBgr } : Images.imgSmartCity}
                    style={styles.body}
                    resizeMode='cover'>
                    <View style={styles.container(valueBlur)} />
                    {
                        urlBgr || strBgr ?
                            <View style={styles.viewEdit}>
                                <Text style={{ color: colors.white, fontWeight: 'bold', paddingVertical: 5 }}>{'Làm mở ảnh nền'}</Text>
                                <Slider minimumValue={0} maximumValue={10} value={valueBlur} onValueChange={this.changeValueBlur} />
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <ButtonCom
                                        text={"Áp dụng"}
                                        onPress={this._SettupBackGround}
                                        styleTouchable={{ flex: 1 }}
                                        style={{ borderRadius: 5 }}
                                        txtStyle={{ fontSize: reText(14) }}
                                    />
                                    <ButtonCom
                                        Linear={true}
                                        colorChange={[colors.brownGreyThree, colors.brownGreyThree]}
                                        text={"Chọn ảnh khác"}
                                        onPress={this._chooseBackground}
                                        styleTouchable={{ flex: 1 }}
                                        style={{ borderRadius: 5, marginLeft: 5 }}
                                        txtStyle={{ fontSize: reText(14) }}
                                    />
                                </View>

                            </View>
                            :
                            <ButtonCom
                                text={"Chọn ảnh nền từ thiết bị"}
                                onPress={this._chooseBackground}
                                styleTouchable={{ marginBottom: Platform.OS == 'android' ? 95 : 100 }}
                                style={{ borderRadius: 5, paddingHorizontal: 10 }}
                                txtStyle={{ fontSize: reText(14) }}
                            />
                    }
                </ImageBackground>
                <IsLoading />
            </View >
        )
    }
}

// STYLES
const styles = StyleSheet.create({
    body: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    container: (valueBlur) => (
        {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: colors.white,
            opacity: valueBlur / 10 - 0.5
        }
    ),
    viewEdit: {
        justifyContent: 'flex-end',
        width: Width(90),
        marginBottom: Platform.OS == 'android' ? 95 : 100,
        backgroundColor: colors.black_20,
        borderRadius: 10,
        padding: 10
    }
})

const mapStateToProps = state => ({
    theme: state.theme
});

export default Utils.connectRedux(ChangeBackground, mapStateToProps, true)