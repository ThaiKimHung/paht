import MaskedView from '@react-native-community/masked-view'
import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Platform, Image, Animated, Keyboard } from 'react-native'
import Utils from '../../../app/Utils'
import { colors } from '../../../styles'
import { isPad, reSize, reText } from '../../../styles/size'
import { getBottomSpace } from 'react-native-iphone-x-helper'
import { Height, nstyles } from '../../../styles/styles'
import FontSize from '../../../styles/FontSize'
import { ROOTGlobal } from '../../../app/data/dataGlobal'
import { nkey } from '../../../app/keys/keyStore'
import { ImagesSVL } from '../images'
import { colorsSVL } from '../../../styles/color'

const dataTabSVL = [
    {
        name: "Tìm ứng viên",
        keySreen: "tab_NguoiTimViec",
        icon: ImagesSVL.icTabTimUV,
        iconActive: ImagesSVL.icTabTimUVCol
    },
    {
        name: "Tuyển dụng",
        keySreen: "tab_TuyenDung",
        icon: ImagesSVL.icTabTuyenDung,
        iconActive: ImagesSVL.icTabTuyenDungCol
    },
    {
        name: "Hộp thư",
        keySreen: "tab_HomThuTD",
        icon: ImagesSVL.ic_HomThu,
        iconActive: ImagesSVL.ic_HomThuCol
    },
    {
        name: "Đăng tin",
        keySreen: "tab_DangTin",
        icon: ImagesSVL.icTabDangTin,
        iconActive: ImagesSVL.icTabDangTinCol
    },
]

class TabarSVL_TD extends Component {
    constructor(props) {
        super(props)
        this.state = {
            marginBottom: new Animated.Value(0),
            showTab: true
        };
    };

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            this._keyboardDidShow,
        );
        this.keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            this._keyboardDidHide,
        );
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow = () => {
        if (Platform.OS === 'android')
            this.setState({ showTab: false });
    }

    _keyboardDidHide = () => {
        if (Platform.OS === 'android')
            this.setState({ showTab: true });
    }



    tabClick = (screen, index) => () => {
        let params = {}
        Utils.goscreen(this, screen, params);
    }



    tabClick = (screen, index) => () => {
        let params = {}
        Utils.goscreen(this, screen, params);
    }

    // _startAnimation = (value) => {
    //     Animated.timing(this.state.marginBottom, {
    //         toValue: value,
    //         duration: 300
    //     }).start();
    // };

    render() {
        const { index } = this.props.navigation.state;
        const { CountMailBoxEnterprise = 0 } = this.props.dataSVL
        let tempIndex = index;
        if (index == 0 || index > 4)
            tempIndex = 0;
        if (!this.state.showTab) return null
        return (
            <Animated.View style={[nstyles.shadown, {
                backgroundColor: colors.white,
                shadowOffset: { width: 0, height: -2 },
                marginBottom: this.state.marginBottom,
                paddingBottom: isPad ? FontSize.scale(10) : 0,
                paddingTop: isPad ? FontSize.scale(10) : 0
            }]}>
                <View style={stTabarSVL_TD.container}>
                    {
                        dataTabSVL.map((item, index2) => (
                            <TouchableOpacity
                                key={item.keySreen}
                                onPress={this.tabClick(item.keySreen)}
                                style={stTabarSVL_TD.btnContain}>
                                <Image
                                    style={[nstyles.nIcon20, { marginTop: Platform.OS == 'ios' ? 10 : 0 }]}
                                    source={tempIndex === index2 ? item.iconActive : item.icon}
                                />
                                <Text style={{
                                    fontSize: isPad ? reText(18) : reText(11), marginTop: 2,
                                    color: tempIndex === index2 ? colorsSVL.blueMainSVL : colorsSVL.grayTextLight
                                }}>{item.name}</Text>
                                {
                                    index2 != 2 ? null :
                                        CountMailBoxEnterprise > 0 && <View style={{
                                            position: 'absolute', right: 25, top: Platform.OS == 'android' ? -4 : 4, backgroundColor: colorsSVL.red,
                                            borderRadius: 10, justifyContent: 'center', alignItems: 'center',
                                            minWidth: reSize(15), minHeight: reSize(15),
                                        }}>
                                            <Text style={{
                                                padding: 2, paddingHorizontal: 3, fontSize: 10,
                                                color: colorsSVL.white, textAlign: 'center'
                                            }}>{CountMailBoxEnterprise}</Text>
                                        </View>
                                }
                            </TouchableOpacity>
                        ))
                    }
                </View>
            </Animated.View>
        )
    }
}

const stTabarSVL_TD = StyleSheet.create({
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
    btnContain: { flex: 1, justifyContent: 'center', alignItems: 'center' }
})


const mapStateToProps = state => ({
    dataSVL: state.dataSVL,
});

export default Utils.connectRedux(TabarSVL_TD, mapStateToProps, true);
