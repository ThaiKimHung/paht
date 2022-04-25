import React, { Component } from 'react';
import { View, Text, StyleSheet, BackHandler, ActivityIndicator, Animated } from 'react-native';
import { nstyles, colors, sizes } from '../../../styles';
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
import Utils from '../../../app/Utils';
import { ImgComp } from '../../../components/ImagesComponent';

class ModalLoading extends Component {
    constructor(props) {
        super(props);
        this.animatedValue2 = new Animated.Value(0)
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            this.backAction
        );
        this.animatedValue2.setValue(0)
        Animated.loop(
            Animated.sequence([
                Animated.timing(this.animatedValue2,
                    {
                        toValue: 1,
                        duration: 850,
                        useNativeDriver: false
                    }),
            ]),
            { iterations: 200 }).start();
    }

    componentWillUnmount() {
        this.backHandler.remove();
    }

    backAction = () => {
        return true;
    };

    render() {
        const scale2 = this.animatedValue2.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, -10, 0],
        })
        return (
            <View
                // onTouchEnd={this.props.enLoading}
                style={
                    [{
                        backgroundColor: colors.backgroundModal, flex: 1,
                        zIndex: 10,
                        left: 0, top: 0, bottom: 0,
                        right: 0,
                        justifyContent: 'center', position: "absolute", alignItems: 'center'
                    }]} >
                <View style={{
                    alignItems: 'center',
                    paddingHorizontal: 30, paddingVertical: 30,
                    //backgroundColor: colors.backgroundModal
                }}>
                    {/* <ActivityIndicator size="large" color={colors.colorBlueLight} /> */}
                    {/* <Text style={{ color: colors.colorBlueLight }}>Đang tải...</Text> */}
                    <Animated.Image
                        source={ImgComp.iconApp} resizeMode='contain'
                        style={[nstyles.nstyles.nIcon65, { transform: [{ translateY: scale2 }] }]} />
                    <View style={{ height: 10, marginTop: 10 }}>
                        <BarIndicator color={this.props.theme.colorLinear.color[0]} size={20} count={7} />
                    </View>
                </View>
            </View >

        );
    }
}
const mapStateToProps = state => ({
    theme: state.theme
});
export default Utils.connectRedux(ModalLoading, mapStateToProps, true);
