import React, { Component } from 'react';
import { Keyboard, View, StyleSheet, Image, TouchableOpacity, Text, Platform, Animated, Dimensions } from 'react-native';
import Utils from '../../app/Utils';
import { colors, sizes, nstyles } from '../../styles';
import { Images } from '../images';
import { ROOTGlobal } from '../../app/data/dataGlobal';
import { nkey } from '../../app/keys/keyStore';
import isPad, { reText } from '../../styles/size'
import { isIphoneX } from 'react-native-iphone-x-helper';
import { Height } from '../../styles/styles';
import { ImgComp } from '../../components/ImagesComponent';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-community/masked-view';
import Icon from 'react-native-vector-icons/FontAwesome';
import LottieView from 'lottie-react-native';
import DeviceInfo from 'react-native-device-info'
import FontSize from '../../styles/FontSize';

/**
 * Define all images for this class
 * @type {*|Config|{panHandlers, getInteractionHandle}|{type, property}}
 */

const stTab = StyleSheet.create({
    btnTab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 26,
        marginBottom: 2
    },
    textTab: {
        fontSize: sizes.reText(13),
        color: colors.colorGrayIcon
    },
    textTabActive: {
        color: colors.colorTextSelect,
        // fontWeight: '600'
        fontSize: sizes.reText(13),
    },
    iconActive: {
        tintColor: colors.colorTextSelect
    },
    iconTab: {
        tintColor: colors.colorGrayIcon
    },
    stStyleText: {
        alignSelf: 'center',
        marginLeft: Platform.isPad ? 15 : 10,
        fontSize: Platform.isPad ? reText(14) : reText(12)
    }
});

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row'
    },
    tab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 64
    },
    activeIcon: {
        // backgroundColor: 'white',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    shadow: {
        shadowColor: 'black',
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset: {
            width: 0,
            height: 1,
        },
    }
});

class TabBarHome extends Component {
    constructor(props) {
        super(props);
        nthisTabBarHome = this;
        this.state = {
            marginBottom: new Animated.Value(0)
        }
    }

    onCheckRealtimeDataPA = async () => {
        let data = await Utils.ngetStore(nkey.realTimeDataPA, {});
        let onListeningDataPA = ROOTGlobal.dataGlobal._onListeningDataPA;
        if (onListeningDataPA) {
            onListeningDataPA(data);
        }
    }

    tabClick = (screen, index) => () => {

        switch (screen) {
            case 'sc_CongDong':
                ROOTGlobal.dataGlobal._onRefreshCongDong();
                break;
            case 'Modal_TaoPhanAnh':
                this.onCheckRealtimeDataPA()
                break;
            case 'sc_CaNhan':
                ROOTGlobal.dataGlobal._onRefreshDaGui();
                break;
            default:
                break;
        }

        Utils.goscreen(this, screen);
    }

    _scrool = (value) => {
        // console.log(value)
    }

    _startAnimation = (value) => {
        Animated.timing(this.state.marginBottom, {
            toValue: value,
            duration: 300
        }).start();
    };

    render() {
        const { nrow, nmiddle, shadown } = nstyles.nstyles;
        const { index } = this.props.navigation.state;
        let tempIndex = index;
        if (index == 0 || index > 4)
            tempIndex = 0;
        return (
            <Animated.View style={[nstyles.nstyles.nfooter, nrow, shadown,
            {
                backgroundColor: 'transparent',
                width: '100%',
                height: Height(8),
                marginBottom: this.state.marginBottom,
                backgroundColor: colors.white,
                shadowOffset: { width: 0, height: -2 },
                paddingBottom: nstyles.paddingBotX,
            }]}>
                <View style={{
                    flex: 1, flexDirection: 'row',
                    borderColor: colors.grey,
                    paddingHorizontal: 20, borderBottomWidth: 0,
                    backgroundColor: colors.white,

                }}>
                    <View style={{
                        flex: 1,
                        justifyContent: 'center', alignItems: 'center',
                    }}>
                        <TouchableOpacity
                            onPress={this.tabClick('sc_CongDong')}
                            style={[{ alignItems: 'center' }]}>
                            <MaskedView
                                style={{ flexDirection: 'row', height: 24, marginTop: Platform.OS == 'ios' ? 10 : 0 }}
                                maskElement={
                                    <View
                                        style={{
                                            backgroundColor: 'transparent',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}>
                                        <Icon name={'group'} color='red' size={isPad ? 28 : 24} style={styles.shadow} />
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
                    <View style={{ justifyContent: 'flex-end', alignItems: 'center', flex: 1 }}>
                        <TouchableOpacity
                            onPress={this.tabClick('Modal_TaoPhanAnh')}
                            style={[nmiddle, {
                                borderRadius: Height(8) / 2, position: 'absolute', top: -Height(3)
                            }]}
                        >
                            <LinearGradient
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                colors={this.props.theme.colorLinear.color}
                                style={[nmiddle, {
                                    height: Height(8),
                                    width: Height(8), borderRadius: Height(8) / 2, backgroundColor: this.props.theme.colorLinear.color[0],
                                    justifyContent: 'center', alignItems: 'center',
                                }]}
                            >
                                <LottieView
                                    source={require('../images/sendPA.json')}
                                    style={{ width: Height(6), height: Height(6), justifyContent: "center", alignSelf: 'center' }}
                                    loop={true}
                                    autoPlay={true}
                                />
                                {/* <Image source={ImgComp.icAddBT} style={[Platform.isPad ? nstyles.nstyles.nIcon30 : nstyles.nstyles.nIcon24, { tintColor: colors.white }]} resizeMode='contain' /> */}
                            </LinearGradient>
                        </TouchableOpacity>
                        {/* <Text style={{ alignItems: 'center', fontSize: reText(12), color: this.props.theme.colorLinear.color[0], fontWeight: 'bold' }}>{'Gửi phản ánh'}</Text> */}
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                        <TouchableOpacity
                            onPress={this.tabClick('sc_CaNhan')}
                            style={[{ alignItems: 'center', justifyContent: 'center' }]}>
                            <MaskedView
                                style={{ flexDirection: 'row', height: 24, marginTop: Platform.OS == 'ios' ? 10 : 0 }}
                                maskElement={
                                    <View
                                        style={{
                                            backgroundColor: 'transparent',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}>
                                        <Icon name={'user'} color='red' size={isPad ? 28 : 24} style={styles.shadow} />
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
        );
    }
}

const mapStateToProps = state => ({
    theme: state.theme
});
export default Utils.connectRedux(TabBarHome, mapStateToProps)