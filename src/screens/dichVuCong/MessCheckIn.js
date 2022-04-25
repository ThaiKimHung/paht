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
        this.callbackQR = Utils.ngetParam(this, 'callbackQR', () => { })
        this.title = Utils.ngetParam(this, 'title', '')
        this.state = {
            opacity: new Animated.Value(0),
            data: Utils.ngetParam(this, 'dataQR', '')
        };
    }

    componentDidMount() {
        this._startAnimation(0.4)
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
                this.callbackQR()
                Utils.goback(this)
            });
        }, 100);
    }

    render() {
        const { opacity, data } = this.state
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
                                {this.title.toLocaleUpperCase()}
                            </Text>

                            <View style={{ paddingVertical: 20 }}>
                                {data.status == 1 ?
                                    <Fragment>
                                        <Image source={Images.icFaceMask} style={[nstyles.nIcon50, { alignSelf: 'center' }]} resizeMode='contain' />
                                        {/* <Text style={{ fontSize: reText(14), textAlign: 'center', paddingVertical: 10 }}>{`Check in thành công`}</Text> */}
                                        <Text style={{ fontSize: reText(14), textAlign: 'center', fontWeight: 'bold', paddingVertical: 10 }}>{data?.TenTram ? data.TenTram : ''}</Text>
                                        <Text style={{ fontSize: reText(16), textAlign: 'center', fontWeight: 'bold', color: colors.greenyBlue }}>{`${this.title} thành công.`}</Text>
                                        {/* <Text style={{ fontSize: reText(14), textAlign: 'center', fontWeight: 'bold', color: colors.greenyBlue }}>Thời gian: {data ? moment(data.ThoiGianCheck).format('DD-MM-YYYY HH:mm:ss') : ''}</Text> */}
                                    </Fragment>
                                    :
                                    <Fragment>
                                        <Image source={Images.icClose} style={[nstyles.nIcon50, { alignSelf: 'center', tintColor: 'red' }]} resizeMode='contain' />
                                        <Text style={{ fontSize: reText(14), textAlign: 'center', fontWeight: 'bold', paddingVertical: 10, color: colors.redStar }}>{`${this.title} thất bại vui lòng thử lại !`}</Text>
                                    </Fragment>
                                }
                            </View>
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
