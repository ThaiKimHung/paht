import React from 'react';
import { View, ActivityIndicator, BackHandler, Image, Animated } from 'react-native';
import { nColors, nstyles } from '../styles/styles';
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
import { colors } from '../styles';
import { ImgComp } from './ImagesComponent';
import Utils from '../app/Utils';

class IsLoading extends React.PureComponent {
    constructor(props) {
        super(props);
        nthisIsLoading = this;
        this.animatedValue2 = new Animated.Value(0)
        this.isCancelled = false;
        this.state = {
            isLoading: false,
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
        };
    }

    componentDidMount() {
        if (!this.isCancelled) {
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
    }

    componentWillUnmount() {
        this.isCancelled = true;
    }

    backAction = () => {
        return true;
    };

    show = (marginVer = 0, marginHor = 0) => {
        try {
            BackHandler.removeEventListener("hardwareBackPress", this.backAction);
        } catch (error) {
        }
        this.setState({
            isLoading: true,
            top: marginVer,
            bottom: marginVer,
            left: marginHor,
            right: marginHor
        });
    }

    hide = () => {
        BackHandler.removeEventListener("hardwareBackPress", this.backAction);
        this.setState({ isLoading: false });
    }

    render() {
        const scale2 = this.animatedValue2.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, -10, 0],
        })
        return (
            this.state.isLoading ?
                <View style={{
                    justifyContent: 'center', alignItems: 'center',
                    position: 'absolute', left: this.state.left,
                    elevation: 99,
                    right: this.state.right, bottom: this.state.bottom, top: this.state.top,
                    zIndex: 100,
                }}>
                    <View style={{
                        opacity: 0.3, position: 'absolute', left: 0, top: 0, bottom: 0, right: 0,
                        backgroundColor: 'black'
                    }} />
                    <View style={{
                        justifyContent: 'center', alignItems: 'center', width: 100, height: 100,
                        backgroundColor: colors.nocolor, borderRadius: 10,
                        //  shadowColor: "#000000",
                        // shadowOpacity: 0.1, shadowRadius: 2, shadowOffset: {
                        //     height: 2,
                        //     width: 0
                        // }, elevation: 3
                    }}>
                        {/* <ActivityIndicator size="large" color={nColors.main2} /> */}
                        <Animated.Image
                            source={ImgComp.iconApp} resizeMode='contain'
                            style={[nstyles.nIcon65, { transform: [{ translateY: scale2 }] }]} />
                        <View style={{ height: 10, marginTop: 10 }}>
                            <BarIndicator color={this.props.theme.colorLinear.color[0]} size={20} count={7} />
                        </View>
                    </View>
                </View> : null
        );
    }
}

const mapStateToProps = state => ({
    theme: state.theme
});
export default Utils.connectRedux(IsLoading, mapStateToProps, true);