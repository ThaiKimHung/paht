import React, { Component } from 'react';
import { View, Text, Animated, StyleSheet, Image, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import Utils from '../../../app/Utils';
import { colors } from '../../../styles';
import { reText } from '../../../styles/size';
import { Height, nstyles, paddingBotX, Width } from '../../../styles/styles';
import { Images } from '../../images';
import { ButtonCom } from '../../../components';
import QRCode from 'react-native-qrcode-svg';

class CreateQR_TN extends Component {
    constructor(props) {
        super(props);
        this.CachLy = Utils.ngetParam(this, 'CachLy', '')
        this.state = {
            opacity: new Animated.Value(0)
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
                Utils.goback(this)
            });
        }, 100);
    }

    render() {
        const { opacity } = this.state
        const { colorLinear } = this.props.theme
        return (
            <View style={{ flex: 1, backgroundColor: colors.nocolor, justifyContent: 'flex-end' }}>
                <Animated.View onTouchEnd={() => this._goback()} style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgb(17,17,17)', opacity }} />
                <View style={{ flexGrow: 1 }}>
                    <View style={{ flex: 1, backgroundColor: 'tranparent' }} />
                    <View style={styles.container}>
                        {/* <View style={styles.topBar} /> */}
                        <TouchableOpacity onPress={() => this._goback()} style={{ padding: 10, alignSelf: 'flex-start' }}>
                            <Image source={Images.icBack} style={[nstyles.nIcon24, { tintColor: colorLinear.color[0] }]} resizeMode='contain' />
                        </TouchableOpacity>
                        <ScrollView style={{}}>
                            <Text style={{ fontSize: reText(16), fontWeight: 'bold', alignSelf: 'center' }}>
                                {'QR CODE tài khoản của bạn'.toLocaleUpperCase()}
                            </Text>
                            <View style={{ paddingVertical: 30, alignItems: 'center' }}>
                                <QRCode
                                    value={this.CachLy}
                                    size={200}
                                    backgroundColor={colors.white}
                                />
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
                                text={'Quay lại'}
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
export default Utils.connectRedux(CreateQR_TN, mapStateToProps, true);
