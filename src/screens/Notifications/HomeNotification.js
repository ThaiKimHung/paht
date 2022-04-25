import React, { Component, Fragment } from 'react'
import { Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { TabView } from 'react-native-tab-view'
import { NavigationEvents } from 'react-navigation'
import AppCodeConfig from '../../../app/AppCodeConfig'
import Utils from '../../../app/Utils'
import { HeaderCus } from '../../../components'
import { colors } from '../../../styles'
import { reText } from '../../../styles/size'
import { nstyles, nwidth } from '../../../styles/styles'
import NotiCanBo from './NotificationAccount/NotiCanBo'
import NotiCongDong from './NotificationAccount/NotiCongDong'
import ThongBaoTH from '../Home/Thongbao/ThongBaoTH'
import { PulseIndicator } from 'react-native-indicators';
import { nGlobalKeys } from '../../../app/keys/globalKey'
import NotiDichVuCong from './NotificationAccount/NotiDichVuCong'


class HomeNotification extends Component {
    constructor(props) {
        super(props)
        this.IsLoaiThongBao = Utils.getGlobal(nGlobalKeys.IsLoaiThongBao, 1)
        this.state = {
            index: 0,
            routes: [],
        };
    }

    // RENDER MÀN HÌNH
    renderScene = ({ route }) => {
        Utils.nlog(route)
        switch (route.config) {
            case AppCodeConfig.APP_ADMIN:
                return <NotiCanBo nthis={this} />
            case AppCodeConfig.APP_CONGDAN:
                if (this.props.auth.tokenCD) {
                    return this.IsLoaiThongBao == 1 ? <NotiCongDong nthis={this} /> : <ThongBaoTH nthis={this} />
                } else {
                    return <Fragment>
                        <Text style={{ textAlign: 'center', padding: 10, fontSize: reText(14) }}>{'Vui lòng đăng nhập để nhận thông báo'}</Text>
                        <TouchableOpacity onPress={() => Utils.goscreen(this, 'tab_Person')} style={{ alignSelf: 'center', padding: 10 }}>
                            <Text style={{ color: this.props.theme.colorLinear.color[0], fontWeight: 'bold' }}>{'Đăng nhập ngay'}</Text>
                            <View style={{ height: 1, backgroundColor: this.props.theme.colorLinear.color[0], }} />
                        </TouchableOpacity>
                    </Fragment>
                }
            // return <ThongBaoTH nthis={this} />
            // case AppCodeConfig.APP_DVC:
            //     return <NotiDichVuCong nthis={this} />
            default:
                break;
        }

    }

    // XỬ LÝ SCROLLHEADER TAB
    goIndex = (index) => {
        this.ScrollTab.scrollTo({ x: 150 * index, y: 0, animated: true })
    }

    _renderTabBar = propstab => {
        const { auth } = this.props
        let stateScreen = propstab.navigationState.index;
        return (
            <View style={[{ flexDirection: 'row' }]}>
                <ScrollView showsHorizontalScrollIndicator={false} horizontal ref={refs => this.ScrollTab = refs} style={{ backgroundColor: colors.white, }}>
                    {
                        auth.listInfoShow && auth.listInfoShow.map((item, index) => {
                            if (item.config == AppCodeConfig.APP_DVC) return null;
                            return (
                                <TouchableOpacity

                                    key={index.toString()}
                                    onPress={() => { this.setState({ index: index }, () => this.goIndex(index)) }}
                                    style={{
                                        backgroundColor: colors.white,
                                        paddingVertical: 5, width: 150, paddingHorizontal: 5
                                    }}>
                                    <View style={{ flexDirection: 'row', backgroundColor: index == stateScreen ? this.props.theme.colorLinear.color[0] : colors.BackgroundHome, paddingVertical: 3, borderRadius: 30 }}>
                                        <Text numberOfLines={1} style={{
                                            color: index == stateScreen ? colors.white : colors.brownGreyThree,
                                            textAlign: 'center', paddingVertical: 6,
                                            flex: 1,
                                            fontSize: reText(12),
                                            fontWeight: index == stateScreen ? 'bold' : 'normal',
                                            paddingHorizontal: 5
                                        }}>{item.title}</Text>
                                        {/* {
                                            item.config == AppCodeConfig.APP_ADMIN ?
                                                this.props.auth.tokenDH ?
                                                    <View style={{ position: 'absolute', top: -5, right: -5 }}>
                                                        <PulseIndicator
                                                            color={this.props.auth.tokenDH ? 'green' : 'gray'}
                                                            size={20} count={7} />
                                                    </View>
                                                    :
                                                    <View style={{ backgroundColor: 'gray', padding: 5, position: 'absolute', top: 0, right: 0, borderRadius: 5 }} />
                                                : item.config == AppCodeConfig.APP_CONGDAN ?
                                                    this.props.auth.tokenCD ?
                                                        <View style={{ position: 'absolute', top: -5, right: -5 }}>
                                                            <PulseIndicator
                                                                color={this.props.auth.tokenCD ? 'green' : 'gray'}
                                                                size={20} count={7} />
                                                        </View>
                                                        :
                                                        <View style={{ backgroundColor: 'gray', padding: 5, position: 'absolute', top: 0, right: 0, borderRadius: 5 }} />
                                                    : this.props.auth.userDVC ?
                                                        <View style={{ position: 'absolute', top: -5, right: -5 }}>
                                                            <PulseIndicator
                                                                color={this.props.auth.userDVC ? 'green' : 'gray'}
                                                                size={20} count={7} />
                                                        </View>
                                                        :
                                                        <View style={{ backgroundColor: 'gray', padding: 5, position: 'absolute', top: 0, right: 0, borderRadius: 5 }} />
                                        } */}
                                    </View>
                                </TouchableOpacity>)
                        })
                    }
                </ScrollView>
            </View>
        );
    };

    render() {
        let { auth } = this.props
        return (
            <View style={{ flex: 1, backgroundColor: colors.BackgroundHome }}>
                <HeaderCus
                    title={'Thông báo'}
                    styleTitle={{ color: 'white' }}
                />
                {
                    this.props.auth.tokenCD || this.props.auth.tokenDH || this.props.auth.userDVC ?
                        <Fragment>
                            <View style={[nstyles.nbody, { backgroundColor: colors.BackgroundHome, }]}>
                                <TabView
                                    navigationState={{
                                        index: this.state.index,
                                        routes: auth.listInfoShow.filter(e => e.config != AppCodeConfig.APP_DVC) || []
                                    }}
                                    renderScene={this.renderScene}
                                    renderTabBar={this._renderTabBar}
                                    onIndexChange={index => { this.setState({ index }, () => this.goIndex(index)) }}
                                    initialLayout={{ width: nwidth() }}
                                    lazy
                                />
                            </View>
                        </Fragment> :
                        <Fragment>
                            <Text style={{ textAlign: 'center', padding: 10, fontSize: reText(14) }}>{'Vui lòng đăng nhập để nhận thông báo'}</Text>
                            <TouchableOpacity onPress={() => Utils.goscreen(this, 'tab_Person')} style={{ alignSelf: 'center', padding: 10 }}>
                                <Text style={{ color: this.props.theme.colorLinear.color[0], fontWeight: 'bold' }}>{'Đăng nhập ngay'}</Text>
                                <View style={{ height: 1, backgroundColor: this.props.theme.colorLinear.color[0], }} />
                            </TouchableOpacity>
                        </Fragment>
                }
            </View>
        )
    }
}
const mapStateToProps = state => ({
    auth: state.auth,
    theme: state.theme
});
export default Utils.connectRedux(HomeNotification, mapStateToProps, true);
