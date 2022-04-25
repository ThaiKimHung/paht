import React, { Component, createRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Utils from '../../../app/Utils';
import { HeaderCus, IsLoading } from '../../../components';
import { colors } from '../../../styles';
import { Images } from '../../images';
import { TabView } from 'react-native-tab-view'
import { Height, nwidth, Width } from '../../../styles/styles';
import * as Animatable from 'react-native-animatable'
import { sizes } from '../../../styles/size';
import Overview from './Overview';
import Units from './Units';
import TabScreenDefault from './TabScreenDefault';
import { isLandscape } from 'react-native-device-info';
import apis from '../../apis';

const KEY_SCREEN = `Key`
const KEY_TITLE = `Title`

const ROUTE_MAIN = [
    { ID: 1, Key: 1, Title: 'Tổng quan', KeyView: 'NoiDungTongQuan' },
    { ID: 2, Key: 2, Title: 'Đơn vị\nhành chính', KeyView: 'DonViCapDuoi' },
    { ID: 3, Key: 3, Title: 'Tự nhiên', KeyView: 'NoiDungTuNhien' },
    { ID: 4, Key: 4, Title: 'Lịch sử', KeyView: 'NoiDungLichSu' },
    { ID: 5, Key: 6, Title: 'Kinh tế', KeyView: 'NoiDungKinhTe' }
]

const ROUTE_DETAILS = [
    { ID: 1, Key: 1, Title: 'Tổng quan', KeyView: 'NoiDungTongQuan' },
    { ID: 2, Key: 2, Title: 'Đơn vị\nhành chính', KeyView: 'DonViCapDuoi' }
]

class index extends Component {
    constructor(props) {
        super(props);
        this.refLoading = createRef()
        this.MaPX = Utils.ngetParam(this, 'MaPX', '')
        this.state = {
            index: 0,
            routes: this.MaPX ? ROUTE_DETAILS : ROUTE_MAIN,
            dataDonVi: null
        };
    }

    componentDidMount() {
        this.getDetailsDonViHanhChinh()
    }

    getDetailsDonViHanhChinh = async () => {
        this.refLoading.current.show()
        let res = ``
        if (this.MaPX != '') {
            // Load Chi Tiet Của Đơn Vị Dạng Modal hiển thị
            res = await apis.ApiIntroduction.GetDetailDonViHanhChinh(this.MaPX) // bên trong API mặc đinh mã 164
            this.refLoading.current.hide()
            Utils.nlog('[LOG] res data cua don vi co MA: ', this.MaPX, res)
            if (res.status == 1 && res.data) {
                this.setState({ dataDonVi: res.data })
            } else {
                this.setState({ dataDonVi: null })
            }
        } else {
            // Load cố định MaPX của 1 tỉnh ở dây là thai nguyen MaPX = 164
            res = await apis.ApiIntroduction.GetDetailDonViHanhChinh() // bên trong API mặc đinh mã 164
            this.refLoading.current.hide()
            Utils.nlog('[LOG] res data Tinh Thai Nguyen: ', res)
            if (res.status == 1 && res.data) {
                this.setState({ dataDonVi: res.data })
            } else {
                this.setState({ dataDonVi: null })
            }
        }
    }

    renderScene = ({ route }) => {
        let { routes, index, dataDonVi } = this.state
        switch (route[KEY_SCREEN]) {
            case 1:
                return (
                    <Overview nthis={this} route={route} data={dataDonVi ? dataDonVi : ''} />
                )

            case 2:
                return (
                    <Units nthis={this} route={route} data={dataDonVi ? dataDonVi : ''} MaPX={this.MaPX} />
                )

            default:
                for (let i = 0; i < routes.length; i++) {
                    const element = routes[i];
                    if (element[KEY_SCREEN] == route[KEY_SCREEN]) {
                        return (
                            // <ScreenTT title={element.title} item={route} nthis={this} />
                            <TabScreenDefault nthis={this} route={route} data={dataDonVi ? dataDonVi : ''} />
                        )
                    }
                }
                break;
        }

    }

    goIndex = (index) => {
        // Utils.nlog(index)
        this.ScrollTab.scrollTo({ x: Width(30) * index, y: 0, animated: true })
    }

    render() {
        let { index, dataDonVi } = this.state
        let stateScreen = index
        let { theme } = this.props
        return (
            <View style={stIntroduction.container}>
                <HeaderCus
                    Sleft={{ tintColor: 'white' }}
                    onPressLeft={this.MaPX ? () => { Utils.goback(this) } : () => Utils.goscreen(this, 'ManHinh_Home')}
                    iconLeft={Images.icBack}
                    title={`${dataDonVi?.TenPhuongXa ? dataDonVi?.TenPhuongXa : ''}`.toUpperCase()}
                    styleTitle={{ color: colors.white }}
                />
                <View style={{ flexDirection: 'row', borderBottomWidth: 0.5, borderColor: colors.brownGreyThree }}>
                    <ScrollView showsHorizontalScrollIndicator={false} horizontal ref={refs => this.ScrollTab = refs} style={{ backgroundColor: colors.white, }}>
                        {
                            this.state.routes.map((item, index) => {
                                // Utils.nlog("gia tri x", x)
                                return (
                                    <View style={{ height: Height(theme.isLandscape ? 15 : 6) }}>
                                        <TouchableOpacity
                                            // activeOpacity={1}
                                            key={index.toString()}
                                            onPress={() => { this.setState({ index: index }, () => this.goIndex(index)) }}
                                            style={{
                                                backgroundColor: colors.white,
                                                width: Width(30), paddingHorizontal: 5, flex: 1, alignItems: 'center', justifyContent: 'center',
                                            }}>
                                            <View style={{ flexDirection: 'row', paddingVertical: 5 }}>
                                                <Text style={{
                                                    color: index == stateScreen ? 'red' : colors.brownGreyThree,
                                                    textAlign: 'center', paddingVertical: 6,
                                                    flex: 1,
                                                    fontSize: sizes.sText12,
                                                    fontWeight: index == stateScreen ? 'bold' : 'normal',
                                                }} numberOfLines={2}>{item[KEY_TITLE].toUpperCase()}</Text>
                                            </View>

                                        </TouchableOpacity>
                                        {
                                            index == stateScreen ?
                                                <Animatable.View animation={'bounceIn'} style={{ height: 2, width: Width(30), alignItems: 'center', }}>
                                                    <View style={{ height: 2, backgroundColor: index == stateScreen ? 'red' : '#fff', width: '80%', borderRadius: 10 }} />
                                                </Animatable.View>
                                                : null
                                        }
                                    </View>
                                )
                            })
                        }
                    </ScrollView>
                </View>
                <View style={stIntroduction.body}>
                    <TabView
                        lazy
                        navigationState={this.state}
                        renderScene={this.renderScene}
                        renderTabBar={() => { return null }}
                        onIndexChange={index => { this.setState({ index }, () => this.goIndex(index)) }}
                        initialLayout={{ width: nwidth() }}
                    />
                    <IsLoading ref={this.refLoading} />
                </View>
            </View>
        );
    }
}

const stIntroduction = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.BackgroundHome
    },
    body: {
        flex: 1
    }
})

const mapStateToProps = state => ({
    theme: state.theme
});

export default Utils.connectRedux(index, mapStateToProps, true)
