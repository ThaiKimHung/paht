import MaskedView from '@react-native-community/masked-view'
import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Platform, Image, Animated } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Utils from '../../../app/Utils'
import { colors } from '../../../styles'
import Icon from 'react-native-vector-icons/FontAwesome';
import { isPad, reText } from '../../../styles/size'
import { getBottomSpace } from 'react-native-iphone-x-helper'
import { Height, nstyles } from '../../../styles/styles'
import { Images } from '../../images'
import FontSize from '../../../styles/FontSize'
import { ROOTGlobal } from '../../../app/data/dataGlobal'
import { nkey } from '../../../app/keys/keyStore'
import LottieView from 'lottie-react-native';
import DeviceInfo from 'react-native-device-info';

export class HomeTabTuVanF0 extends Component {
    constructor(props) {
        super(props)
        nthisTabbarTuVanF0 = this
        this.state = {
            marginBottom: new Animated.Value(0)
        };
    };


    onCheckRealtimeDataPA = async () => {
        let data = await Utils.ngetStore(nkey.realTimeDataTuVanF0, {});
        let onListeningDataPA = ROOTGlobal.dataGlobal._onListeningDataTuVanF0;
        if (onListeningDataPA) {
            onListeningDataPA(data);
        }
    }

    tabClick = (screen, index) => () => {
        let params = {}
        switch (screen) {
            case 'tab_TuVanF0CongDong':
                ROOTGlobal.dataGlobal._onRefreshCongDongTuVanF0();
                break;
            case 'Modal_YeuCauTuVanF0':
                params = { "isModalGuiPA": 103 }
                this.onCheckRealtimeDataPA()
                break;
            case 'tab_TuVanF0CaNhan':
                ROOTGlobal.dataGlobal._onRefreshDaGuiTuVanF0();
                break;
            default:
                break;
        }

        Utils.goscreen(this, screen, params);
    }

    _startAnimation = (value) => {
        Animated.timing(this.state.marginBottom, {
            toValue: value,
            duration: 300
        }).start();
    };


    render() {
        const { index } = this.props.navigation.state;
        let tempIndex = index;
        if (index == 0 || index > 4)
            tempIndex = 0;
        return (
            <Animated.View style={[nstyles.shadown, {
                backgroundColor: colors.white,
                shadowOffset: { width: 0, height: -2 },
                marginBottom: this.state.marginBottom,
                paddingBottom: isPad ? FontSize.scale(10) : 0,
                paddingTop: isPad ? FontSize.scale(10) : 0
            }]}>
                <View style={stHomeTabTuVanF0.container}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={this.tabClick('tab_TuVanF0CongDong')}
                            style={[{ alignItems: 'center' }]}>
                            <MaskedView
                                style={{ flexDirection: 'row', height: 24, marginTop: Platform.OS == 'ios' ? 10 : 0 }}
                                maskElement={
                                    <View style={stHomeTabTuVanF0.viewIcon}>
                                        <Icon name={'group'} color='red' size={isPad ? 28 : 24} style={stHomeTabTuVanF0.shadow} />
                                    </View>
                                }>
                                <LinearGradient
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    colors={tempIndex === 0 ? this.props.theme.colorLinear.color : [colors.brownGreyTwo, colors.brownGreyTwo]}
                                    style={{ flex: 1 }}
                                />
                            </MaskedView>
                            <Text style={{ fontSize: isPad ? reText(18) : reText(10), color: tempIndex === 0 ? this.props.theme.colorLinear.color[0] : colors.brownGreyTwo }}>{'Cộng đồng'}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[nstyles.shadown, { justifyContent: 'flex-end', alignItems: 'center', flex: 1 }]}>
                        <TouchableOpacity
                            onPress={this.tabClick('Modal_YeuCauTuVanF0')}
                            activeOpacity={0.5}
                            style={[nstyles.nmiddle, {
                                borderRadius: Height(8) / 2, position: 'absolute', top: -Height(3), borderWidth: 0.5, borderColor: this.props.theme.colorLinear.color[0]
                            }]}
                        >
                            <LinearGradient
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                colors={['white', 'white']}
                                style={[nstyles.nmiddle, {
                                    height: Height(8),
                                    width: Height(8), borderRadius: Height(8) / 2, backgroundColor: this.props.theme.colorLinear.color[0],
                                    justifyContent: 'center', alignItems: 'center', borderWidth: 0.5, borderColor: this.props.theme.colorLinear.color[0]
                                }]}
                            >
                                <Image source={Images.icMedicalAssistance} style={{ width: Height(7), height: Height(7) }} resizeMode='contain'/>
                                {/* <LottieView
                                    source={require('../../images/adivice.json')}
                                    style={{ width: Height(5), height: Height(6), justifyContent: "center", alignSelf: 'center' }}
                                    loop={true}
                                    autoPlay={true}
                                /> */}
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                        <TouchableOpacity
                            onPress={this.tabClick('tab_TuVanF0CaNhan')}
                            style={[{ alignItems: 'center', justifyContent: 'center' }]}>
                            <MaskedView
                                style={{ flexDirection: 'row', height: 24, marginTop: Platform.OS == 'ios' ? 10 : 0 }}
                                maskElement={
                                    <View style={stHomeTabTuVanF0.viewIcon}>
                                        <Icon name={'user'} color='red' size={isPad ? 28 : 24} style={stHomeTabTuVanF0.shadow} />
                                    </View>
                                }>
                                <LinearGradient
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    colors={tempIndex === 1 ? this.props.theme.colorLinear.color : [colors.brownGreyTwo, colors.brownGreyTwo]}
                                    style={{ flex: 1 }}
                                />
                            </MaskedView>
                            <Text style={{ fontSize: isPad ? reText(18) : reText(10), color: tempIndex === 1 ? this.props.theme.colorLinear.color[0] : colors.brownGreyTwo }}>{'Cá nhân'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.View>
        )
    }
}

const stHomeTabTuVanF0 = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: Platform.OS == 'android' ? 5 : 0,
        paddingBottom: Platform.OS == 'android' ? Height(1) : getBottomSpace()
    },
    shadow: {
        shadowColor: 'black',
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset: {
            width: 0,
            height: 1,
        },
    },
    viewIcon: { backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center', }
})

const mapStateToProps = state => ({
    theme: state.theme
});
export default Utils.connectRedux(HomeTabTuVanF0, mapStateToProps)
