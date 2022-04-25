import React, { Component } from 'react';
import {
    Image, View, StyleSheet, Text, Platform, Alert,
    TouchableOpacity, BackHandler, Animated, Easing
} from 'react-native';
import { nstyles, nwidth, nColors, isLandscape, nheight } from '../styles/styles'
import Utils from '../app/Utils';
import { colors } from '../styles/color';
import { isPad, sizes } from '../styles/size';
import LinearGradient from 'react-native-linear-gradient';

//styles màn hình popup
export const stMsgBox = StyleSheet.create({
    npopupContain: {
        position: 'absolute',
        left: 0, right: 0, bottom: 0, top: 0,
        flexDirection: 'column'
    },
    npopupBgr: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        // backgroundColor: colors.black,
        // opacity: 0.28
    },
    ntext: {
        textAlign: 'center',
        fontSize: sizes.sText16,
        marginVertical: 5
    },
    btnContain: {
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 8,
        marginHorizontal: 15,
        justifyContent: 'center',
        backgroundColor: colors.colorGrayText
    }
});

class MsgBox extends React.PureComponent {
    constructor(props) {
        super(props);
        this.igoscreen = this.props.igoscreen;
        this.title = Utils.ngetParam(this, 'title', '');
        this.message = Utils.ngetParam(this, 'message', null);
        this.buttons = Utils.ngetParam(this, 'buttons', [{ text: 'OK', onPress: () => { } }]);
        this.goback = Utils.ngetParam(this, 'goback', true);
        this.WithLand = () => isLandscape() ? nheight() * 0.8 : nwidth();
        // --
        this.state = {
            isShowMsg: true,
            opacityView: new Animated.Value(0),
            widthView: new Animated.Value(0.15 * this.WithLand()),
        }
    }

    backAction = () => {
        if (this.goback)
            Utils.goback(this, null);
        return true;
    };

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            this.backAction
        );
        const ani1 = Animated.timing(
            this.state.opacityView,
            {
                toValue: 0.96,
                duration: 300
            }
        );
        const ani2 = Animated.timing(
            this.state.widthView,
            {
                toValue: 0.88 * this.WithLand(),
                duration: 500,
                easing: Easing.bounce
            }
        );
        Animated.parallel([ani1, ani2]).start();
    }

    componentWillUnmount() {
        this.backHandler.remove();
    }


    static show(params) {
        this.setState({ isShowMsg: false });
    }

    onOK = () => {
        if (this.goback)
            Utils.goback(this, null);
        this.buttons[0].onPress();
    }

    onCancel = () => {
        if (this.goback)
            Utils.goback(this, null);
        this.buttons[1].onPress();
    }

    //Menu popup More...
    render() {
        let { opacity } = this.state
        return (
            <View style={[nstyles.ncontainerX, { backgroundColor: colors.nocolor }]}>
                <View style={[stMsgBox.npopupContain, { justifyContent: 'center', bottom: 0, alignItems: 'center' }]}>
                    <View style={stMsgBox.npopupBgr} />
                    <Animated.View style={[nstyles.shadown, {
                        backgroundColor: 'white', minHeight: 100, maxHeight: '70%', opacity: this.state.opacityView,
                        width: this.state.widthView, borderRadius: 10, justifyContent: 'center', alignItems: 'center', padding: 10, paddingVertical: 12
                    }]}>
                        <Text style={[stMsgBox.ntext, { fontWeight: 'bold', fontSize: sizes.sText17, marginHorizontal: 5 }]}>{this.title}</Text>
                        {
                            this.message == null || this.message == '' ? null :
                                <Text style={[stMsgBox.ntext, { marginHorizontal: 5 }]}>{this.message}</Text>
                        }
                        <View style={[nstyles.nrow, { justifyContent: 'center', marginVertical: 8, height: isLandscape() || isPad ? 50 : 42 }]}>
                            {
                                this.buttons.length == 2 ?
                                    <TouchableOpacity activeOpacity={0.8}
                                        onPress={this.onCancel}
                                        style={{ flex: 1 }}
                                    >
                                        <LinearGradient
                                            style={[stMsgBox.btnContain, { marginRight: 10, flex: 1 }]}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            colors={[colors.brownGreyThree, colors.grayLight]}>
                                            <Text style={[stMsgBox.ntext, { color: colors.white, fontWeight: '600', flex: 1 }]} numberOfLines={3}>
                                                {this.buttons[1].text}
                                            </Text>
                                        </LinearGradient>
                                    </TouchableOpacity> : null
                            }

                            <TouchableOpacity activeOpacity={0.8}
                                onPress={this.onOK}
                                style={this.buttons.length != 2 ? { minWidth: 120 } : { flex: 1 }}
                            >
                                <LinearGradient
                                    style={[stMsgBox.btnContain, this.buttons.length != 2 ? { minWidth: 120 } : { flex: 1 }]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    colors={this.props.theme.colorLinear.color}>
                                    <Text style={[stMsgBox.ntext, { color: colors.white, fontWeight: '600' }]} numberOfLines={3}>
                                        {this.buttons[0].text}
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </View>
            </View>
        );
    }
}

const mapStateToProps = state => ({
    theme: state.theme
});
export default Utils.connectRedux(MsgBox, mapStateToProps, true);
