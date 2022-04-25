import MaskedView from '@react-native-community/masked-view'
import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Platform, Image, Animated } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Utils from '../../../app/Utils'
import { colors } from '../../../styles'
import Icon from 'react-native-vector-icons/Ionicons';
import { isPad, reText } from '../../../styles/size'
import { getBottomSpace } from 'react-native-iphone-x-helper'
import { Height, nstyles } from '../../../styles/styles'
import { Images } from '../../images'
import FontSize from '../../../styles/FontSize'
import { ROOTGlobal } from '../../../app/data/dataGlobal'

export class TabbarHoiDap extends Component {
    constructor(props) {
        super(props)
        this.state = {
            marginBottom: new Animated.Value(0)
        };
    };

    tabClick = (screen, index) => () => {
        let params = {}
        switch (screen) {
            case 'Home_HoiDapTT_VTS':
                ROOTGlobal.dataGlobal._reLoadDSHoiDapVTS()
                break;
            case 'Modal_GuiCauHoi_VTS':
                break;
            case 'LichSu_HoiDapTT_VTS':
                ROOTGlobal.dataGlobal._reLoadLichSuHoiDapVTS()
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
                <View style={stTabbarHoiDap.container}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={this.tabClick('Home_HoiDapTT_VTS')}
                            style={[{ alignItems: 'center', width: '100%' }]}>
                            <Image
                                source={Images.icListHoiDapVTS}
                                style={[nstyles.nIcon26, { tintColor: tempIndex === 0 ? this.props.theme.colorLinear.color[0] : colors.brownGreyTwo }]}
                                resizeMode={'contain'}
                            />
                            <Text style={{ fontSize: isPad ? reText(18) : reText(10), color: tempIndex === 0 ? this.props.theme.colorLinear.color[0] : colors.brownGreyTwo }}>{'Danh sách'}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[nstyles.shadown, { justifyContent: 'flex-end', alignItems: 'center', flex: 1 }]}>
                        <TouchableOpacity
                            onPress={this.tabClick('Modal_GuiCauHoi_VTS')}
                            activeOpacity={0.5}
                            style={[nstyles.nmiddle, nstyles.shadow, {
                                borderRadius: Height(8) / 1.5, position: 'absolute', top: -Height(3), backgroundColor: 'white', padding: 5
                            }]}
                        >
                            <LinearGradient
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                colors={this.props.theme.colorLinear.color}
                                style={[nstyles.nmiddle, {
                                    height: Height(6.5),
                                    width: Height(6.5), borderRadius: Height(8) / 1.5,
                                    justifyContent: 'center', alignItems: 'center'
                                }]}
                            >
                                <Image
                                    source={Images.icSendHoiDapVTS}
                                    style={nstyles.nIcon30}
                                    resizeMode={'contain'}
                                />
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                        <TouchableOpacity
                            onPress={this.tabClick('LichSu_HoiDapTT_VTS')}
                            style={[{ alignItems: 'center', justifyContent: 'center', width: '100%' }]}>
                            <Image
                                source={Images.icPersonHoiDapVTS}
                                style={[nstyles.nIcon26, { tintColor: tempIndex === 1 ? this.props.theme.colorLinear.color[0] : colors.brownGreyTwo }]}
                                resizeMode={'contain'}
                            />
                            <Text style={{ fontSize: isPad ? reText(18) : reText(10), color: tempIndex === 1 ? this.props.theme.colorLinear.color[0] : colors.brownGreyTwo }}>{'Cá nhân'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.View>
        )
    }
}

const stTabbarHoiDap = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: Platform.OS == 'android' ? 5 : 5,
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
export default Utils.connectRedux(TabbarHoiDap, mapStateToProps)
