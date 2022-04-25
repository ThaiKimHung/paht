import React, { Component, createRef } from 'react';
import { View, Text, Animated, StyleSheet, Image, TouchableOpacity, ScrollView, FlatList, BackHandler, TextInput, ActivityIndicator } from 'react-native';
import Utils, { icon_typeToast } from '../../../app/Utils';
import { colors } from '../../../styles';
import { reSize, reText, sizes } from '../../../styles/size';
import { Height, nstyles, paddingBotX, Width } from '../../../styles/styles';
import { Images } from '../../images';
import QRCode from 'react-native-qrcode-svg';
import { ButtonCom, IsLoading } from '../../../components';
import apis from '../../apis';
import { store } from '../../../srcRedux/store';
import { GetDataUserCD } from '../../../srcRedux/actions/auth/Auth';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { KeyTiem } from './KeyTiem';
import FontSize from '../../../styles/FontSize';

class NhapMaCode extends Component {
    constructor(props) {
        super(props);
        this.item = Utils.ngetParam(this, 'item', '')
        this.callback = Utils.ngetParam(this, 'callback', () => { })
        this.state = {
            opacity: new Animated.Value(0),
            item: this.item ? this.item : '',
            code: '',
            infoUser: '',
            isSearh: false,
        };
    }

    componentDidMount() {
        this._startAnimation(0.4)
        BackHandler.addEventListener('hardwareBackPress', this.backAction)
    }

    backAction = () => {
        this._goback()
        return true
    }

    componentWillUnmount() {
        try {
            BackHandler.removeEventListener('hardwareBackPress', this.backAction)
        } catch (error) {

        }
    }

    _startAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: value,
                duration: 350
            }).start();
        }, 300);
    };

    _goback = (objUser) => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: 0,
                duration: 250
            }).start(() => {
                if (objUser) {
                    this.callback(objUser);
                }
                Utils.goback(this)
            });
        }, 100);
    }

    onChangeCode = (code) => this.setState({ code: code })



    confirmCodeKeyTiem = async () => {
        //Xử lý swithc case qua các màn hình tương ứng
        const { item, code } = this.state
        if (!code) {
            Utils.showToastMsg("Thông báo", "Mã không được để trống.", icon_typeToast.warning);
            return;
        }
        this.setState({ isSearh: true })
        let res = await apis.ApiQLTaiDiemTiem.GetInFo_TiemChungByCode(code)
        Utils.nlog('[LOG] code check', res)
        if (res.status == 1 && res.data) {
            this.setState({ infoUser: res.data, isSearh: false })
            let { HoTen, SoDT } = res.data
            Utils.showToastMsg("Thông báo", `Nhập mã thành công thông tin mã xác thực: \nHọ và tên: ${HoTen}\nSố điện thoại: ${SoDT}`, icon_typeToast.success);

            // return this._goback({ "HoTen": HoTen, "SDT": SoDT })
            return this.callback({ "HoTen": HoTen, "SDT": SoDT }), Utils.goback(this);
        } else {
            this.setState({ infoUser: '', isSearh: false })
            Utils.showToastMsg("Thông báo", "Không tìm thấy thông tin mã xác thực.", icon_typeToast.danger);
            return;
        }
    }

    render() {
        const { opacity, item, code, isSearh } = this.state
        const { colorLinear } = this.props.theme
        return (
            <View style={styles.cover}>
                <Animated.View onTouchEnd={() => this._goback()} style={[styles.animatedCode, { opacity }]} />
                <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={styles.headerTranparent} />
                    <View style={styles.container}>
                        <View style={styles.topBar} />
                        <View style={styles.headerCode}>
                            <TouchableOpacity onPress={() => this._goback()} style={styles.btnBack}>
                                <Image source={Images.icBack} style={[nstyles.nIcon24, { tintColor: colorLinear.color[0] }]} resizeMode='contain' />
                            </TouchableOpacity>
                            <Text style={styles.titleCode}>{'NHẬP MÃ ' + item?.name.replace('\n', ' ').toUpperCase()}</Text>
                            <View style={{ width: 45 }} />
                        </View>
                        <KeyboardAwareScrollView style={{ paddingTop: 10 }}>
                            <Text style={styles.labelCode}>{'Mã xác thực'}</Text>
                            <TextInput
                                value={code}
                                placeholder={'Nhập mã tại đây'}
                                style={styles.inputCode}
                                onChangeText={this.onChangeCode}
                            />
                            {
                                isSearh ? <View style={styles.containLoad}>
                                    <ActivityIndicator color={colors.redHCM} />
                                    <Text style={styles.txtLoad}>{`Đang xác thực mã... Vui lòng chờ !`}</Text>
                                </View> : null
                            }
                            <ButtonCom
                                onPress={() => {
                                    this.confirmCodeKeyTiem()
                                }}
                                shadow={false}
                                txtStyle={{ color: colors.white }}
                                style={styles.btnConfirm}
                                text={'Xác nhận'}
                            />
                        </KeyboardAwareScrollView>
                    </View>
                </KeyboardAwareScrollView>
            </View >
        );
    }
}



const styles = StyleSheet.create({
    containLoad: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
    },
    txtLoad: {
        fontWeight: 'bold',
        color: colors.redHCM,
        flex: 1,
        paddingLeft: 10
    },
    cover: {
        flex: 1, backgroundColor: colors.nocolor, justifyContent: 'flex-end'
    },
    container: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 10,
        paddingBottom: paddingBotX,
        minHeight: Height(60),
        maxHeight: Height(90)
    },
    headerTranparent: {
        flex: 1,
        backgroundColor: colors.nocolor
    },
    headerCode: {
        flexDirection: 'row', justifyContent: 'space-between', marginTop: 10
    },
    btnBack: {
        padding: 10, alignSelf: 'flex-start'
    },
    topBar: {
        height: 5,
        width: 80,
        alignSelf: 'center',
        backgroundColor: colors.grayLight,
        borderRadius: 10,
        marginTop: 10
    },
    labelCode: {
        paddingVertical: 5, color: colors.black_50, fontWeight: 'bold'
    },
    inputCode: {
        padding: 10, fontSize: reSize(14), borderWidth: 0.5, borderRadius: 5, borderColor: colors.grayLight
    },
    btnConfirm: {
        marginTop: Height(5), borderRadius: 5,
        alignSelf: 'center', paddingHorizontal: 20,
        width: Width(45),
    },
    titleCode: {
        color: colors.colorHearder, fontSize: reText(16), fontWeight: 'bold', alignSelf: 'center', textAlign: 'center'
    },
    animatedCode: {
        position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgb(17,17,17)'
    }
})

const mapStateToProps = state => ({
    auth: state.auth,
    theme: state.theme,

});
export default Utils.connectRedux(NhapMaCode, mapStateToProps, true);
