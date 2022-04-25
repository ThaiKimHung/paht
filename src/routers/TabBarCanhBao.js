import React, { Component } from 'react';
import { Keyboard, View, StyleSheet, Image, TouchableOpacity, Text, Platform, Animated } from 'react-native';
import Utils from '../../app/Utils';
import { colors, sizes, nstyles } from '../../styles';
import { Images } from '../images';
import { ROOTGlobal } from '../../app/data/dataGlobal';
import { nkey } from '../../app/keys/keyStore';
import { reText, isPad } from '../../styles/size';
import { ImgComp } from '../../components/ImagesComponent';
import MaskedView from '@react-native-community/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import { isIphoneX } from 'react-native-iphone-x-helper';
import DeviceInfo from 'react-native-device-info'

/**
 * Define all images for this class
 * @type {*|Config|{panHandlers, getInteractionHandle}|{type, property}}
 */
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

class TabBarCanhBao extends Component {
    constructor(props) {
        super(props);
        // nthisTabBarHome = this;
        this.state = {
            marginTop: new Animated.Value(0)
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
            case 'st_QuanTam':
                // ROOTGlobal.dataGlobal._onRefreshCongDong();
                break;
            case 'st_ChuyenMuc':
                // this.onCheckRealtimeDataPA()
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
        Animated.timing(this.state.marginTop, {
            toValue: value,
            duration: 300
        }).start();
    };

    render() {
        const { nrow, nmiddle, shadown } = nstyles.nstyles;
        const { index } = this.props.navigation.state;
        let tempIndex = index;
        if (index == 0 || index > 1)
            tempIndex = 0;
        return (
            <Animated.View style={[nstyles.nstyles.nfooter, nrow, shadown,
            {
                backgroundColor: 'transparent',
                width: '100%',
                height: nstyles.Height(8),
                backgroundColor: colors.white,
                shadowOffset: { width: 0, height: -2 },
                paddingBottom: isIphoneX() ? nstyles.paddingBotX : nstyles.paddingBotX + 10,
                shadowOpacity: 0.2
            }]}>
                <View style={{
                    flex: 1, flexDirection: 'row',
                    borderColor: colors.grey,
                    paddingHorizontal: 20, borderBottomWidth: 0,
                    backgroundColor: colors.white,

                }}>
                    <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={this.tabClick('st_QuanTam')}
                            style={[{ alignItems: 'center', flexDirection: isPad ? 'row' : 'column' }]}>
                            <MaskedView
                                style={{ flexDirection: 'row', height: 24, marginTop: Platform.OS == 'ios' ? 10 : 0 }}
                                maskElement={
                                    <View
                                        style={{
                                            backgroundColor: 'transparent',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}>
                                        <Icon name={'heart'} color='red' size={isPad ? 28 : 24} style={styles.shadow} />
                                    </View>
                                }>
                                <LinearGradient
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    colors={tempIndex === 0 ? this.props.theme.colorLinear.color : [colors.brownGreyTwo, colors.brownGreyTwo]}
                                    style={{ flex: 1 }}
                                />
                            </MaskedView>
                            <Text style={{ fontSize: isPad ? reText(18) : reText(10), color: tempIndex === 0 ? this.props.theme.colorLinear.color[0] : colors.brownGreyTwo }}>{'Quan tâm'}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={this.tabClick('st_ChuyenMuc')}
                            style={[{ alignItems: 'center', flexDirection: isPad ? 'row' : 'column' }]}>
                            <MaskedView
                                style={{ flexDirection: 'row', height: 24, marginTop: Platform.OS == 'ios' ? 10 : 0 }}
                                maskElement={
                                    <View
                                        style={{
                                            backgroundColor: 'transparent',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}>
                                        <Icon name={'th-large'} color='red' size={isPad ? 28 : 24} style={styles.shadow} />
                                    </View>
                                }>
                                <LinearGradient
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    colors={tempIndex === 1 ? this.props.theme.colorLinear.color : [colors.brownGreyTwo, colors.brownGreyTwo]}
                                    style={{ flex: 1 }}
                                />
                            </MaskedView>
                            <Text style={{ fontSize: isPad ? reText(18) : reText(10), color: tempIndex === 1 ? this.props.theme.colorLinear.color[0] : colors.brownGreyTwo }}>{'Chuyên mục'}</Text>
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
export default Utils.connectRedux(TabBarCanhBao, mapStateToProps)