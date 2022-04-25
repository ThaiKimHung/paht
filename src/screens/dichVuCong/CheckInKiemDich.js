import React, { Component, Fragment } from 'react';
import { View, Text, Animated, StyleSheet, Image, TouchableOpacity, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import Utils from '../../../app/Utils';
import { colors } from '../../../styles';
import { reText } from '../../../styles/size';
import { Height, nstyles, paddingBotX, Width } from '../../../styles/styles';
import { Images } from '../../images';
import { ButtonCom } from '../../../components';
import QRCode from 'react-native-qrcode-svg';
import moment from 'moment';
import apis from '../../apis';

class CheckInKiemDich extends Component {
    constructor(props) {
        super(props);
        this.IdKiemDich = Utils.ngetParam(this, 'IdKiemDich', '')
        this.state = {
            opacity: new Animated.Value(0),
            loading: true,
            textloading: 'Đang check in địa điểm. Chờ xác nhận !',
            data: ''
        };
    }

    componentDidMount() {
        this._startAnimation(0.4)
        this.CheckIn()
    }

    CheckIn = async () => {
        const { userCD } = this.props.auth
        if (userCD.PhoneNumber && userCD.FullName && userCD?.CachLy.CMND && userCD.UserID && userCD?.CachLy.IDXaPhuong && this.IdKiemDich) {
            let bodyCheckIn = {
                "IDDiemKiemDich": this.IdKiemDich,
                "SoDienThoai": userCD.PhoneNumber,
                "ThoiGianCheck": moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                "CheckThay": 0,
                "HoTen": userCD.FullName,
                "CMND": userCD?.CachLy ? userCD.CachLy.CMND : '',
                "IDXa": userCD.CachLy && userCD.CachLy?.IDXaPhuong ? userCD.CachLy.IDXaPhuong : '',
                "IDUser1022": userCD.UserID
            }
            console.log('[LOG] data body check in', bodyCheckIn)
            let res = await apis.ApiDVC.CheckInKiemDich(bodyCheckIn)
            console.log('[LOG] res check in', res)
            if (res.error == 200 && res.data.length > 0) {
                let noti = ``
                this.setState({ loading: false, data: res.data[0] })
            } else {
                this.setState({ loading: false, data: '', textloading: 'Check in không thành công !' })
            }
        } else {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Vui lòng đăng nhập hoặc cập nhật thông tin đầy đủ trước khi check in.', 'Xác nhận')
        }
    }

    _startAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: value,
                duration: 250
            }).start();
        }, 200);
    };

    _goback = () => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: 0,
                duration: 250
            }).start(() => {
                Utils.goback(this)
            });
        }, 100);
    }

    render() {
        const { opacity, loading, textloading, data } = this.state
        const { colorLinear } = this.props.theme
        return (
            <View style={{ flex: 1, backgroundColor: colors.nocolor, justifyContent: 'flex-end' }}>
                <Animated.View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgb(17,17,17)', opacity }} />
                <View style={{ flexGrow: 1 }}>
                    <View style={{ flex: 1, backgroundColor: 'tranparent' }} />
                    <View style={styles.container}>
                        {/* <View style={styles.topBar} /> */}
                        <TouchableOpacity onPress={() => this._goback()} style={{ padding: 10, alignSelf: 'flex-start' }}>
                            <Image source={Images.icBack} style={[nstyles.nIcon24, { tintColor: colorLinear.color[0] }]} resizeMode='contain' />
                        </TouchableOpacity>
                        <ScrollView style={{}}>

                            <Text style={{ fontSize: reText(16), fontWeight: 'bold', alignSelf: 'center' }}>
                                {'Check in/out địa điểm'.toLocaleUpperCase()}
                            </Text>
                            {loading ?
                                <View style={{ paddingVertical: 20 }}>
                                    <ActivityIndicator size='large' color={colors.grayLight} />
                                    <Text style={{ fontSize: reText(14), textAlign: 'center', fontWeight: 'bold', paddingVertical: 10 }}>{textloading}</Text>
                                </View>
                                :

                                <View style={{ paddingVertical: 20 }}>
                                    {data ?
                                        <Fragment>
                                            <Image source={Images.icFaceMask} style={[nstyles.nIcon50, { alignSelf: 'center' }]} resizeMode='contain' />
                                            <Text style={{ fontSize: reText(14), textAlign: 'center', paddingVertical: 10 }}>{data.TrangThai == 'In' ? `Chào mừng bạn đã đến!` : `Tạm biệt!`}</Text>
                                            <Text style={{ fontSize: reText(14), textAlign: 'center', fontWeight: 'bold' }}>{data ? data.TenDiemKiemDich : ''}</Text>
                                            <Text style={{ fontSize: reText(18), textAlign: 'center', fontWeight: 'bold', paddingVertical: 10, color: colors.greenyBlue }}>CHECK {data ? data.TrangThai.toUpperCase() : ''} THÀNH CÔNG !</Text>
                                            {/* <Text style={{ fontSize: reText(14), textAlign: 'center', fontWeight: 'bold' }}>{data ? data.TenXaPhuong : ''},{data ? data.TenQuanHuyen : ''},{data ? data.TenTinhThanh : ''}</Text> */}
                                            <Text style={{ fontSize: reText(14), textAlign: 'center', fontWeight: 'bold', color: colors.greenyBlue }}>Thời gian: {data ? moment(data.ThoiGianCheck).format('DD-MM-YYYY HH:mm:ss') : ''}</Text>
                                        </Fragment>
                                        :
                                        <Fragment>
                                            <Image source={Images.icClose} style={[nstyles.nIcon50, { alignSelf: 'center', tintColor: 'red' }]} resizeMode='contain' />
                                            <Text style={{ fontSize: reText(14), textAlign: 'center', fontWeight: 'bold', paddingVertical: 10, color: colors.redStar }}>{textloading}</Text>
                                        </Fragment>
                                    }

                                </View>
                            }

                            <ButtonCom
                                onPress={() => {
                                    this._goback()
                                }}
                                shadow={false}
                                txtStyle={{ color: colors.white }}
                                style={
                                    {
                                        marginTop: Height(2), borderRadius: 5,
                                        alignSelf: 'center', paddingHorizontal: 20,
                                        width: Width(35),
                                    }}
                                text={'Đóng'}
                            />
                        </ScrollView>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 10,
        paddingBottom: paddingBotX,
        minHeight: Height(50),
        maxHeight: Height(95)
    },
    topBar: {
        height: 5,
        width: 80,
        alignSelf: 'center',
        backgroundColor: colors.grayLight,
        borderRadius: 10,
        marginTop: 10
    }
})

const mapStateToProps = state => ({
    auth: state.auth,
    theme: state.theme,

});
export default Utils.connectRedux(CheckInKiemDich, mapStateToProps, true);
