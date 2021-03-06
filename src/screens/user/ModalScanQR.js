import React, { Component } from 'react'
import { Linking, View, StyleSheet, Image, BackHandler, Platform } from 'react-native'
import { RNCamera } from 'react-native-camera';
// import { HeaderCus } from '../../../components';
import * as Animatable from 'react-native-animatable';
import { withNavigationFocus } from 'react-navigation';
import { colors } from '../../../styles';
import { Height, isLandscape, nstyles, Width } from '../../../styles/styles';
// import HeaderCus from '../../components/HeaderCus';
import apis from '../../apis';
import Utils from '../../../app/Utils';
import { nGlobalKeys } from '../../../app/keys/globalKey';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import { nkey } from '../../../app/keys/keyStore';
import { Images } from '../../images';
import { HeaderCus } from '../../../components';
import { store } from '../../../srcRedux/store';
import AppCodeConfig from '../../../app/AppCodeConfig';
import { GetSetMaScreen } from '../../../srcRedux/actions/auth/Auth';
import { appConfig } from '../../../app/Config';
import UtilsApp from '../../../app/UtilsApp';

class ModalScanQR extends Component {
    constructor(props) {
        super(props)
        this.ref = null;
        this._CapNhatAvatar = Utils.ngetParam(this, "_CapNhatAvatar", () => { })
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
        if (!this.state.check) {
            this.setState({ check: true })
            const DevicesToken = await Utils.ngetStore(nGlobalKeys.userId_OneSignal, '');
            // Utils.nlog('gi?? tr??? barcode------', props.data, DevicesToken);
            const res = await apis.ApiUser.ScanQRLogin(props.data, DevicesToken)
            if (res && res?.status == 1) {
                if (res.otp == true) {
                    Utils.goscreen(this, 'ModalOTP', { infoUser: props.data, DevicesToken: DevicesToken, data: res })
                }
                else {
                    Utils.showMsgBoxOK(this, 'Th??ng b??o', "????ng nh???p th??nh c??ng.", 'X??c nh???n', async () => {
                        var { data = {} } = res;
                        //--Khi login Th??nh C??ng th?? t???t c??? ?????u ph???i x??? l?? trong H??m n??y. Kh??ng dc vi???t ngo??i.
                        await UtilsApp.onSetLoginSuccess_Chung(3, data, this, nthisIsLoading);
                    })
                }
            }
            else {
                Utils.showMsgBoxOK(this, 'Th??ng b??o', '????ng nh???p th???t b???i', 'X??c nh???n', () => {
                    Utils.goback(this)
                })
            }
        }
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
                    title={'??ang qu??t QR code tr??n CCCD'}
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
export default Utils.connectRedux(withNavigationFocus(ModalScanQR), mapStateToProps, true);