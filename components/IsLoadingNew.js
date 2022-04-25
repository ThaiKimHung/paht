import React from 'react';
import { View, ActivityIndicator, Text, BackHandler } from 'react-native';
import { reText } from '../styles/size';
import { colors } from '../styles';

export default class IsLoadingNew extends React.PureComponent {
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

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    backAction = () => {
        return true;
    };

    show = (marginVer = 0, marginHor = 0) => {
        this.backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            this.backAction
        );
        this.setState({
            isLoading: true,
            top: marginVer,
            bottom: marginVer,
            left: marginHor,
            right: marginHor
        });
    }

    hide = () => {
        try {
            BackHandler.removeEventListener("hardwareBackPress", this.backAction);
        } catch (error) {
        }
        this.setState({ isLoading: false });
    }

    render() {
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
                    }}>
                        <ActivityIndicator size="large" color={colors.colorChuyenMuc} />
                        <Text style={{ fontSize: reText(14), color: colors.colorChuyenMuc, fontStyle: 'italic', marginTop: 4 }}>Đang tải</Text>
                    </View>
                </View> : null
        );
    }
}