import React, { Component, createRef } from 'react';
import { View, Text, Animated, StyleSheet, Image, TouchableOpacity, ScrollView, FlatList, BackHandler, Platform, PermissionsAndroid, ToastAndroid, Alert } from 'react-native';
import Utils from '../../../app/Utils';
import { colors } from '../../../styles';
import { reText, sizes } from '../../../styles/size';
import { Height, nstyles, paddingBotX, Width } from '../../../styles/styles';
import { Images } from '../../images';
import { ButtonCom, IsLoading } from '../../../components';
import moment from 'moment';
import apis from '../../apis';

class PhieuDiCho extends Component {
    constructor(props) {
        super(props);
        this.state = {
            opacity: new Animated.Value(0),
            dataPhieu: ''
        };
        this.refLoading = createRef()
    }

    componentDidMount() {
        this._startAnimation(0.4)
        this.GetThongTinPhieuDiChoCongDan()
        BackHandler.addEventListener('hardwareBackPress', this.backAction)
    }

    GetThongTinPhieuDiChoCongDan = async () => {
        this.refLoading.current.show()
        let res = await apis.ApiHCM.GetThongTinPhieuDiChoCongDan()
        Utils.nlog('[LOG] phieu di cho', res)
        this.refLoading.current.hide()
        if (res.status == 1 && res.data) {
            this.setState({ dataPhieu: res.data })
        } else {
            this.setState({ dataPhieu: '' })
        }
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
        const { opacity, dataPhieu = {} } = this.state
        const { colorLinear } = this.props.theme
        return (
            <View style={{ flex: 1, backgroundColor: colors.nocolor, justifyContent: 'flex-end' }}>
                <Animated.View onTouchEnd={() => this._goback()} style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgb(17,17,17)', opacity }} />
                <View style={{ flexGrow: 1 }}>
                    <View style={{ flex: 1, backgroundColor: 'tranparent' }} />
                    <View style={styles.container}>
                        <View style={styles.topBar} />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                            <TouchableOpacity onPress={() => this._goback()} style={{ padding: 10, alignSelf: 'flex-start' }}>
                                <Image source={Images.icBack} style={[nstyles.nIcon24, { tintColor: colorLinear.color[0] }]} resizeMode='contain' />
                            </TouchableOpacity>
                            <Text style={{ color: colorLinear.color[0], fontSize: reText(16), fontWeight: 'bold', alignSelf: 'center', textAlign: 'center' }}>{'THÔNG TIN PHIẾU ĐI CHỢ'}</Text>
                            <View style={{ width: 45 }} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <ScrollView>
                                {
                                    dataPhieu ?
                                        <View collapsable={false} ref={ref => this.refViewQR = ref} style={{ backgroundColor: colors.white }}>
                                            <View style={{ paddingVertical: 10, borderRadius: 5 }}>
                                                {/* <Text style={{ fontSize: reText(14), flex: 1, color: colors.redDelete, alignSelf: 'center', paddingVertical: 10 }}>{`(*) Dùng QR để được ra vào chợ đúng quy định`}</Text> */}
                                                <Text style={{ fontSize: reText(16), fontWeight: 'bold', paddingVertical: 10, }}>{'THÔNG TIN CÁ NHÂN'.toUpperCase()}</Text>
                                                <Text style={{ fontSize: reText(16) }} numberOfLines={1}>Họ tên: {dataPhieu?.FullName ? dataPhieu?.FullName : ''}</Text>
                                                <Text style={{ fontSize: reText(16), paddingVertical: 10 }} numberOfLines={1}>Số điện thoại: {dataPhieu?.PhoneNumber ? dataPhieu?.PhoneNumber : ''}</Text>
                                                <View style={{ backgroundColor: '#F500003a', padding: 10, borderRadius: 5 }}>
                                                    <Text style={{ fontSize: reText(16), fontWeight: 'bold', color: colors.redStar }}>{'Thời gian được phép đi chợ'.toUpperCase()}</Text>
                                                    <Text style={{ fontSize: reText(16), textAlign: 'justify', marginTop: 10, fontWeight: 'bold' }}>Lượt đi chợ còn lại: {dataPhieu?.SoLanConLai ? dataPhieu?.SoLanConLai : 0}</Text>
                                                    <Text style={{ fontSize: reText(16), paddingVertical: 10, fontWeight: 'bold', textAlign: 'justify', lineHeight: 25 }}>Địa chỉ: {dataPhieu?.DiaChi ? dataPhieu?.DiaChi : ''}</Text>
                                                    <Text style={{ fontSize: reText(16), textAlign: 'justify' }}>Từ ngày: {dataPhieu?.TuNgay ? moment(dataPhieu?.TuNgay).format('DD/MM/YYYY') : ''}</Text>
                                                    <Text style={{ fontSize: reText(16), paddingVertical: 10 }}>Đến ngày: {dataPhieu?.DenNgay ? moment(dataPhieu?.DenNgay).format('DD/MM/YYYY') : ''}</Text>
                                                    <Text style={{ fontSize: reText(16) }}>Từ giờ: {dataPhieu?.TuGio ? dataPhieu?.TuGio : ''}</Text>
                                                    <Text style={{ fontSize: reText(16), paddingVertical: 10 }}>Đến giờ: {dataPhieu?.DenGio ? dataPhieu?.DenGio : ''}</Text>
                                                </View>
                                            </View>
                                            <Text style={{ fontSize: reText(14), flex: 1, color: colors.redDelete, alignSelf: 'center', paddingVertical: 10 }}>{`(*) Bạn chỉ được phép đi chợ trong khung thời gian quy định.`}</Text>
                                        </View>
                                        : <Text style={{ fontSize: reText(16), fontWeight: 'bold', alignSelf: 'center' }}>{`Không có thông tin phiếu đi chợ`}</Text>
                                }
                            </ScrollView>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                            <ButtonCom
                                onPress={() => this._goback()}
                                Linear={true}
                                colorChange={[colors.grayLight, colors.grayLight]}
                                shadow={false}
                                txtStyle={{ color: colors.white, fontSize: reText(13) }}
                                style={{
                                    margin: Height(1), borderRadius: 5,
                                    alignSelf: 'center',
                                    width: Width(40)
                                }}
                                text={'QUAY LẠI'}
                            />
                        </View>
                        <IsLoading ref={this.refLoading} />
                    </View>
                </View>
            </View >
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
        minHeight: Height(90),
        maxHeight: Height(90)
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
export default Utils.connectRedux(PhieuDiCho, mapStateToProps, true);
