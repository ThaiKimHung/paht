import React, { Component } from 'react'
import { Text, View, Animated, Platform, Image } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import Utils from '../../../app/Utils'
import { ButtonCom } from '../../../components'
import { colors } from '../../../styles'
import { reText } from '../../../styles/size'
import { Height, nstyles } from '../../../styles/styles'
import { Images } from '../../images'
import AppCodeConfig from '../../../app/AppCodeConfig'

import {
    BallIndicator,
    BarIndicator,
    DotIndicator,
    MaterialIndicator,
    PacmanIndicator,
    PulseIndicator,
    SkypeIndicator,
    UIActivityIndicator,
    WaveIndicator,
} from 'react-native-indicators';
import { ListAccount } from '../../../srcRedux/reducers/Auth'

class Modal_TaiKhoan extends Component {

    constructor(props) {
        super(props)
        this.state = {
            opacity: new Animated.Value(0),
        }
    }
    componentDidMount() {
        this._startAnimation(0.4)
    }

    _startAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: value,
                duration: 300
            }).start();
        }, 300);
    };

    _goback = () => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: 0,
                duration: 150
            }).start(() => {
                Utils.goback(this);
            });
        }, 100);
    }

    _login = (item) => {
        switch (item.config) {
            case AppCodeConfig.APP_ADMIN:
                Utils.goscreen(this, 'SlideStackDH')
                break;
            case AppCodeConfig.APP_CONGDAN:
                Utils.goscreen(this, 'login')
                break;
            default:
                break;
        }
    }


    render() {
        let { opacity } = this.state
        let { auth, theme } = this.props
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: `transparent`, justifyContent: 'flex-end' }]}>
                <Animated.View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgb(17,17,17)', opacity }} onTouchEnd={this._goback} />
                <View style={{ backgroundColor: colors.white, borderTopLeftRadius: 10, borderTopRightRadius: 10, zIndex: 1000, maxHeight: Height(90) }}>
                    <ScrollView
                        style={{ paddingBottom: Platform.OS == 'android' ? 20 : 30 }}
                    >
                        <Text style={{ padding: 10, fontSize: reText(18), textAlign: 'center', color: theme.colorLinear.color[0], fontWeight: 'bold' }}>{'Tình trạng tài khoản'}</Text>
                        {
                            ListAccount.map(item => {
                                let find = auth.listInfoShow.find(e => e.config == item.config)
                                if (!find) {
                                    return (
                                        <TouchableOpacity key={item.config} onPress={() => { this._login(item) }} style={{ padding: 13 }}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <Text style={{ fontStyle: 'italic', flex: 1 }}>{`${item.title} chưa đăng nhập`} - {`Đăng nhập ngay`}</Text>
                                                {/* <View style={{}}>
                                                    <PulseIndicator color={'red'} size={20} count={7} />
                                                </View> */}
                                            </View>
                                        </TouchableOpacity>
                                    )
                                } else {
                                    return (
                                        <View key={item.config} style={{ padding: 13 }}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <Text style={{ flex: 1 }}>{`${item.title} đã đăng nhập`}</Text>
                                                <View style={{}}>
                                                    <PulseIndicator color={'green'} size={20} count={7} />
                                                </View>
                                            </View>
                                        </View>)
                                }
                            })
                        }
                        <ButtonCom
                            text={'Quay lại'}
                            style={{ borderRadius: 5, margin: 13, }}
                            onPress={this._goback}
                        />
                    </ScrollView>
                </View>
            </View >
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    theme: state.theme
});
export default Utils.connectRedux(Modal_TaiKhoan, mapStateToProps, true);
