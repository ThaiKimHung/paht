import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { nColors } from '../styles/styles';
import { colors } from '../styles';

export default class IsLoadingCus extends React.PureComponent {
    constructor(props) {
        super(props);
        nthisIsLoading = this;
        this.state = {
            isLoading: false,
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
        };
    }

    show = (marginVer = 0, marginHor = 0) => {
        this.setState({
            isLoading: true,
            top: marginVer,
            bottom: marginVer,
            left: marginHor,
            right: marginHor
        });
    }

    hide = () => {
        this.setState({ isLoading: false });
    }

    render() {
        return (
            this.state.isLoading ?
                <View style={{
                    justifyContent: 'center', alignItems: 'center',
                    position: 'absolute', left: this.state.left,
                    right: this.state.right, bottom: this.state.bottom, top: this.state.top,
                    zIndex: 100,
                }}>
                    {/* <View style={{
                        opacity: 0.3, position: 'absolute', left: 0, top: 0, bottom: 0, right: 0,
                        backgroundColor: 'black'
                    }} /> */}
                    <View style={{
                        justifyContent: 'center', alignItems: 'center', width: 100, height: 100,
                        // backgroundColor: 'white',
                        borderRadius: 10, shadowColor: "#000000"
                    }}>
                        <ActivityIndicator size="large" color={colors.white} />
                    </View>
                </View> : null
        );
    }
}