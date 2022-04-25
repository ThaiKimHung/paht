import React, { Component } from 'react'
import { Text, View, Animated, ActivityIndicator, TouchableOpacity } from 'react-native'
import Utils from '../../../app/Utils';
import { colors } from '../../../styles';
import { reText } from '../../../styles/size';
import { Height } from '../../../styles/styles';
import apis from '../../apis';

export class XacThucQR extends Component {
    constructor(props) {
        super(props)
        this.Code = Utils.ngetParam(this, 'Code', '')
        this.state = {
            opacity: new Animated.Value(0),
            status: 'Đang xác thực vui lòng chờ...',
            showBack: false,
        };
    };

    async componentDidMount() {
        await this._startAnimation(0.4)
        setTimeout(() => {
            this._XacThucQR()
        }, 1000);
    }

    _XacThucQR = async () => {
        const { userDVC, userCD } = this.props.auth
        if (userCD?.CachLy?.CMND || userDVC?.SoDinhDanh) {
            let body = {
                code: this.Code,
                cancuoc: userDVC ? userDVC.SoDinhDanh : userCD?.CachLy?.CMND ? userCD?.CachLy?.CMND : ''
            }
            Utils.nlog('[LOG] BODY', body)
            let res = await apis.ApiDVC.XacThucDangNhapQR(body)
            Utils.nlog('[LOG] res xac thuc', res)
            if (res.status == 1 && res.data) {
                const { error_code, message } = res.data
                if (error_code == 1) {
                    this.setState({
                        status: 'Xác thực đăng nhập thành công.',
                        showBack: true
                    })
                } else {
                    this.setState({
                        status: message,
                        showBack: true
                    })
                }
            } else {
                this.setState({
                    status: 'Có lỗi trong quá trình xác thực, thử lại sau !',
                    showBack: true
                })
            }
        } else {
            this.setState({
                status: 'Không có thông tin CMND/CCCD.',
                showBack: true
            })
        }
    }

    _startAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: value,
                duration: 300
            }).start();
        }, 350);
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
        const { opacity, status, showBack } = this.state
        return (
            <View style={{ flex: 1, justifyContent: 'center', backgroundColor: colors.backgroundModal }}>
                <View style={{ backgroundColor: colors.white, margin: 13, borderRadius: 10 }}>
                    <Text style={{ padding: 10, textAlign: 'center', fontWeight: 'bold', fontSize: reText(18) }}>Đăng nhập QR</Text>
                    <View style={{ height: 0.5, backgroundColor: colors.grayLight }} />
                    {
                        showBack ? null :
                            <ActivityIndicator size="large" color={colors.redStar} style={{ marginTop: 10 }} />
                    }
                    <Text style={{ textAlign: 'center', color: colors.redStar, padding: 10, fontSize: reText(16) }}>{status}</Text>
                    {
                        showBack ?
                            <TouchableOpacity onPress={this._goback} style={{ alignSelf: 'center', padding: 10, margin: 5, backgroundColor: colors.black_30, borderRadius: 5, paddingHorizontal: 50 }}>
                                <Text style={{ color: colors.black }}>{'Quay lại'}</Text>
                            </TouchableOpacity> : null
                    }
                </View>
            </View>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    theme: state.theme
});
export default Utils.connectRedux(XacThucQR, mapStateToProps, true);
