import React, { Component } from 'react';
import { View, Text, Platform, TouchableOpacity, Image, BackHandler } from 'react-native';
import Utils from '../../app/Utils';
import { HeaderCus } from '../../components';
import { colors } from '../../styles';
import { Width, Height, nstyles, paddingTopMul, isLandscape } from '../../styles/styles';
import { Images } from '../images';


import PlayerWSSAndroid from '../../android-native-component/PlayerWSSAndroid';
import PlayerWSS from '../../ios-native-component/PlayerWSS';
import { nGlobalKeys } from '../../app/keys/globalKey';
import { isPad } from '../../styles/size';

class SeenCamera extends Component {
    constructor(props) {
        super(props);
        this.itemCamera = Utils.ngetParam(this, 'itemCamera', '');
        this.callback = Utils.ngetParam(this, 'callback', () => { });

        let data = this.itemCamera;
        let is_topWSS = Utils.getGlobal(nGlobalKeys.topWSS, true);
        let isRtstLink = data.Rtsp && !data.LinkWSS && !data.Rtsp.includes("wss://"); // đang ưu tiên wss 
        isRtstLink = !is_topWSS && !isRtstLink && data.Rtsp && !data.Rtsp?.includes("wss://") ? true : isRtstLink

        this.TempIsRtsp = isRtstLink;
    }

    componentDidMount() {
        BackHandler.addEventListener("hardwareBackPress", this.onBack);
    }

    onBack = () => {
        Utils.goback(this);
        if (!this.TempIsRtsp)
            this.callback();
        return true;
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.onBack);
    }

    render() {
        let tyleCamera = [16, 9]; // Tỷ lê WSS, và VLC chỉnh chung ở đây.

        this.tempHeight = Height(100);
        this.tempWidth = isPad ? this.tempHeight * (tyleCamera[1] / tyleCamera[0]) : Width(100);
        if (isLandscape()) {
            this.tempHeight = Width(100);
            this.tempWidth = Width(100) * (tyleCamera[1] / tyleCamera[0]);
        }

        let data = this.itemCamera;
        let isRtstLink = this.TempIsRtsp;

        return (
            <View style={{ flex: 1, backgroundColor: colors.black, justifyContent: 'center', alignItems: 'center', paddingTop: isRtstLink ? paddingTopMul() : 0 }}>
                {
                    data == '' ? null :
                        (
                            Platform.OS == 'android' ?
                                <PlayerWSSAndroid isFullScreen={true} tyleScreen={tyleCamera[0] / tyleCamera[1]}
                                    style={{
                                        width: this.tempWidth,
                                        height: this.tempHeight
                                    }} url={data.LinkWSS || data.Rtsp || ''} /> :
                                <PlayerWSS isFullScreen={true} tyleScreen={tyleCamera[0] / tyleCamera[1]}
                                    style={{ width: this.tempWidth, height: this.tempHeight }} url={data.LinkWSS || data.Rtsp || ''} />)
                }
                <TouchableOpacity style={{
                    padding: 5, position: 'absolute', top: paddingTopMul() + (Platform.OS == 'ios' ? 5 : 20), right: 10
                }} onPress={this.onBack}>
                    <Image source={Images.icClose} style={[nstyles.nIcon30, { tintColor: colors.white }]} />
                </TouchableOpacity>
            </View>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    theme: state.theme
});
export default Utils.connectRedux(SeenCamera, mapStateToProps, true);