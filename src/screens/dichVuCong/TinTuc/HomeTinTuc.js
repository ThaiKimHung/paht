import React, { Component } from 'react';
import { View, Text, Platform, Image, TouchableOpacity, FlatList, Dimensions, BackHandler } from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper';
import Utils from '../../../../app/Utils';
import { Images } from '../../../images';
import { colors } from '../../../../styles';
import { reSize, reText, sizes } from '../../../../styles/size';
import { nstyles, nwidth, paddingTopMul } from '../../../../styles/styles';
import { TabView } from 'react-native-tab-view'
import { ScrollView } from 'react-native-gesture-handler';
import * as Animatable from 'react-native-animatable'
import ScreenTT from './ScreenTT';
import { nGlobalKeys } from '../../../../app/keys/globalKey';
import { HeaderCus } from '../../../../components';


class HomeTinTuc extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            routes: [
                { ID: '2,3,4', key: '-1', title: 'Tin Tổng Hợp', },
            ],
        };
    }

    componentDidMount() {
        let dataSetting = Utils.getGlobal(nGlobalKeys.DataSettingTinTuc, [])
        let dataTab = [{ ID: '2,3,4', key: '-1', title: 'Tin Tổng Hợp', }]
        for (let i = 0; i < dataSetting.length; i++) {
            const item = dataSetting[i];
            if (item.isCheck == true) {
                dataTab.push(item)
            }
        }
        // Utils.nlog('dataTab', dataTab)
        this.setState({ index: 0, routes: dataTab })
        BackHandler.addEventListener('hardwareBackPress', this.backAction)
    }

    backAction = () => {
        Utils.goscreen(this, 'ManHinh_Home')
        return true
    }

    componentWillUnmount() {
        try {
            BackHandler.removeEventListener('hardwareBackPress', this.backAction)
        } catch (error) {

        }
    }

    settingTab = () => {
        let dataSetting = Utils.getGlobal(nGlobalKeys.DataSettingTinTuc, [])
        // Utils.nlog('data setting', dataSetting)
        let dataTab = [{ ID: '2,3,4', key: '-1', title: 'Tin Tổng Hợp', }]
        for (let i = 0; i < dataSetting.length; i++) {
            const item = dataSetting[i];
            if (item.isCheck == true) {
                dataTab.push(item)
            }
        }
        // Utils.nlog('dataTab', dataTab)
        this.setState({ index: 0, routes: dataTab })
    }

    handleSetting = () => {
        Utils.goscreen(this, 'Modal_SettingTinTuc', { callback: this.settingTab })
    }

    renderScene = ({ route }) => {
        let { routes, index } = this.state
        for (let i = 0; i < routes.length; i++) {
            const element = routes[i];
            if (element.key == route.key) {
                return (
                    <ScreenTT title={element.title} item={route} nthis={this} />
                )
            }
        }
    }

    _keyExtrac = (item, index) => index.toString();

    goIndex = (index) => {
        // Utils.nlog(index)
        this.ScrollTab.scrollTo({ x: 150 * index, y: 0, animated: true })
    }

    render() {
        let { index } = this.state
        let stateScreen = index
        let { theme } = this.props
        return (
            <View style={{ flex: 1, backgroundColor: colors.BackgroundHome, paddingBottom: isIphoneX() ? 20 : 5 }}>
                <HeaderCus
                    Sleft={{ tintColor: 'white' }}
                    onPressLeft={() => Utils.goscreen(this, 'ManHinh_Home')}
                    iconLeft={Images.icBack}
                    title={'Tin tức'}
                    styleTitle={{ color: colors.white }}
                    iconRight={Images.icSetTingBlack}
                    Sright={{ tintColor: 'white' }}
                    onPressRight={this.handleSetting}
                />
                <View style={{ flexDirection: 'row', borderBottomWidth: 0.5, borderColor: colors.brownGreyThree }}>
                    <ScrollView showsHorizontalScrollIndicator={false} horizontal ref={refs => this.ScrollTab = refs} style={{ backgroundColor: colors.white, }}>
                        {
                            this.state.routes.map((item, index) => {
                                // Utils.nlog("gia tri x", x)
                                return (
                                    <TouchableOpacity
                                        // activeOpacity={1}
                                        key={index.toString()}
                                        onPress={() => { this.setState({ index: index }, () => this.goIndex(index)) }}
                                        style={{
                                            backgroundColor: colors.white,
                                            paddingVertical: 5, width: 150, paddingHorizontal: 5
                                        }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{
                                                color: index == stateScreen ? theme.colorLinear.color[0] : colors.brownGreyThree,
                                                textAlign: 'center', paddingVertical: 6,
                                                flex: 1,
                                                fontSize: sizes.sText16,
                                                fontWeight: index == stateScreen ? 'bold' : 'normal'
                                            }}>{item.title}</Text>
                                        </View>
                                        {
                                            index == stateScreen ?
                                                <Animatable.View animation={'bounceIn'} style={{ height: 2, width: '100%' }}>
                                                    <View style={{ height: 2, backgroundColor: index == stateScreen ? theme.colorLinear.color[0] : '#fff', width: '100%', borderRadius: 10 }} />
                                                </Animatable.View>
                                                : null
                                        }
                                    </TouchableOpacity>)
                            })
                        }
                    </ScrollView>
                </View>
                <View style={{ flex: 1 }}>
                    <TabView
                        navigationState={this.state}
                        renderScene={this.renderScene}
                        renderTabBar={() => { return null }}
                        onIndexChange={index => { this.setState({ index }, () => this.goIndex(index)) }}
                        initialLayout={{ width: nwidth() }}
                    />
                </View>
            </View>
        );
    }
}
const mapStateToProps = state => ({
    theme: state.theme
});

export default Utils.connectRedux(HomeTinTuc, mapStateToProps, true) 
