import React, { Component } from 'react'
import { Linking, View, StyleSheet, Image, BackHandler, Platform } from 'react-native'
import { RNCamera } from 'react-native-camera';
import * as Animatable from 'react-native-animatable';
import { withNavigationFocus } from 'react-navigation';
import { colors } from '../../../styles';
import { Height, isLandscape, nstyles, Width } from '../../../styles/styles';
import apis from '../../apis';
import Utils from '../../../app/Utils';
import { nkey } from '../../../app/keys/keyStore';
import { Images } from '../../images';
import { HeaderCus } from '../../../components';

class ModalScanQR_Info extends Component {
    constructor(props) {
        super(props)
        this.ref = null;
        this.callback = Utils.ngetParam(this, 'callback')
        this.state = {
            check: false
        }
    }
    onSuccess = e => {
        Linking.openURL(e.data).catch(err =>
            console.error('An error occured', err)
        );
    };
    _goback = () => {
        this.setState({ show: false }, () => Utils.goback(this));
    }

    makeSlideOutTranslation(translationType, fromValue) {
        return {
            from: {
                [translationType]: this.getWidth(10),
            },
            to: {
                [translationType]: fromValue
            }
        };
    }

    barcodeRecognized = async props => {
        // Utils.nlog("-----------QC CODE:", props.data)
        this.callback(props.data)
        Utils.goback(this)
    };

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.backAction)
    }

    backAction = () => {
        Utils.goback(this)
        return true
    }

    getWidth = (percen = 100) => {
        return isLandscape() ? Height(percen) * 0.5 : Width(percen);
    }

    componentWillUnmount() {
        try {
            BackHandler.removeEventListener('hardwareBackPress', this.backAction)
        } catch (error) {

        }
    }
    render() {
        return this.props.isFocused ? (
            <View style={nstyles.ncontainer}>
                <HeaderCus
                    title={'Đang quét QR code'}
                    styleTitle={{ color: colors.white }}
                    iconLeft={Images.icBack}
                    onPressLeft={() => Utils.goback(this)}
                />
                <View style={[nstyles.nbody, { alignItems: 'center', justifyContent: 'center', backgroundColor: colors.blackTwo }]}>
                    <View style={{
                        width: this.getWidth(95),
                        height: this.getWidth(95),
                        overflow: 'hidden',
                        borderRadius: 4,
                        borderWidth: 1, borderColor: colors.colorTrueGreen
                    }}>
                        <RNCamera
                            ref={ref => this.ref = ref}
                            style={{
                                flex: 1
                            }}
                            captureAudio={false}
                            cameraViewDimensions={{
                                width: this.getWidth(100),
                                height: this.getWidth(100),
                            }}
                            onBarCodeRead={this.barcodeRecognized}>
                            {/* {/ {this.renderBarcodes()} /} */}
                        </RNCamera>
                        <Animatable.View
                            style={{
                                backgroundColor: colors.colorTrueGreen, height: 2,
                                width: this.getWidth(75),
                                position: 'absolute',
                                left: this.getWidth(10),
                                borderRadius: 20
                            }}
                            direction="alternate-reverse"
                            iterationCount="infinite"
                            duration={2000}
                            easing="linear"
                            animation={this.makeSlideOutTranslation(
                                "translateY",
                                this.getWidth(85),
                            )}
                        />
                        <View style={{
                            position: 'absolute',
                            alignSelf: 'center',
                            top: this.getWidth(10), left: this.getWidth(10),
                            right: this.getWidth(10), bottom: this.getWidth(10),

                        }}>
                            <Image source={Images.icFocusQR}
                                style={{ width: this.getWidth(75), height: this.getWidth(75), tintColor: colors.white }}></Image>
                        </View>

                    </View>
                </View>
            </View >
        ) : <View></View>
    }
}
// export default withNavigationFocus(QRHome)

const mapStateToProps = state => ({
    isLogin: state.setlogin.isLogin,

});
export default Utils.connectRedux(withNavigationFocus(ModalScanQR_Info), mapStateToProps, true);