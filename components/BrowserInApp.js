import React, { Component } from 'react';
import {
    Image, View, StyleSheet, Text, Platform, StatusBar,
    Alert, TouchableOpacity, Dimensions,
    TextInput,
    BackHandler
} from 'react-native';

import { WebView } from 'react-native-webview'
import {
    nstyles, ActivityIndicator, nColors, paddingBotX, heightStatusBar, paddingTopMul
} from '../styles/styles';
import Utils from '../app/Utils';
import { ImgComp } from './ImagesComponent';
import { HeaderCus } from '.';
import { Images } from '../src/images';
import { colors } from '../styles';
import FontSize from '../styles/FontSize';
import LinearGradient from 'react-native-linear-gradient';
import { nGlobalKeys } from '../app/keys/globalKey';

//Deep link Test
htmlTest = `
<html>
    <body>
        <a style="font-size: 50px;" href="tripu123123://app/root/drawer/hotels/confirm/2">Open Appp</a>
    </body>
</html>`;

class BrowserInApp extends Component {
    constructor(props) {
        super(props);
        this.link = Utils.ngetParam(this, 'link', '');
        this.linearWebviewLeft = Utils.ngetParam(this, 'linearWebviewLeft', '');
        this.linearWebviewRight = Utils.ngetParam(this, 'linearWebviewRight', '');
        this.isEditUrl = Utils.ngetParam(this, 'isEditUrl', true); // Hiện tại ko dùng tới
        this.title = Utils.ngetParam(this, 'title', '');
        this.istitle = this.title != "";
        this.isShowUrl = this.istitle ? false : Utils.ngetParam(this, 'isShowUrl', false);
        this.isShowMenuWeb = Utils.ngetParam(this, 'isShowMenuWeb', true); //An/hien menu bottom.
        this.isShowMenuWeb = this.isShowMenuWeb == undefined ? true : this.isShowMenuWeb;
        this.isHtml = Utils.ngetParam(this, 'isHtml', false);
        this.callback = Utils.ngetParam(this, 'callback', () => { });
        this.IconBackOpenWeb = Utils.getGlobal(nGlobalKeys.IconBackOpenWeb, 'false')
        if (!this.isHtml)
            this.link = Utils.isUrlCus(this.link);
        if (this.isHtml) {
            this.isEditUrl = false;
            this.istitle = true;
        }
        this.state = {
            //data globle
            isLoading: false,
            editlink: this.link,
            canGoBack: false,
            canGoForward: false
        };
        StatusBar.setHidden(false);
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.backAction)
        Utils.nlog('Gia tri s ', this.linearWebviewLeft, this.linearWebviewRight)
    }

    componentWillUnmount() {
        try {
            BackHandler.removeEventListener('hardwareBackPress', this.backAction)
        } catch (error) {

        }
    }

    backAction = () => {
        this.callback()
        Utils.goback(this)
        return true
    }

    onBack = () => {
        this.callback()
        Utils.goback(this);
        //callback gọi lại để set status bar bên welcome
        let oncallBack = Utils.ngetParam(this, 'callback', null);
        if (oncallBack != null)
            oncallBack();
    }
    onNavigationStateChange = (navState) => {
        Utils.nlog("resXXX", navState);
        this.setState({ canGoBack: navState.canGoBack, canGoForward: navState.canGoForward, editlink: navState.url });
    }

    render() {
        let linkShow = this.state.editlink;
        let statusSecure = 0; //0: ko xác định, 1: bảo mật, -1: ko bảo mật
        try {
            linkShow = linkShow.split("://");
            if (linkShow[0] == 'https')
                statusSecure = 1;
            if (linkShow[0] == 'http')
                statusSecure = -1;
            linkShow = linkShow[1];
            linkShow = linkShow.split("/")[0];
            linkShow = linkShow;
        } catch (error) {

        }

        return (
            <View style={nstyles.ncontainer}>
                <StatusBar barStyle={'dark-content'} />
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    colors={
                        (this.linearWebviewLeft || this.linearWebviewRight)
                            ? [this.linearWebviewLeft ? this.linearWebviewLeft : this.linearWebviewRight, this.linearWebviewRight ? this.linearWebviewRight : this.linearWebviewLeft]
                            : this.props.theme.colorLinear.color
                    }
                    // colors={this.props.theme.colorLinear.color}
                    style={{ paddingTop: Platform.OS == 'android' ? paddingTopMul() + heightStatusBar() : paddingTopMul(), backgroundColor: colors.BackgroundHome, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: colors.grayLight }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: colors.grayLight }}>
                        <TouchableOpacity onPress={this.onBack} style={{ padding: 10 }}>
                            <Image source={this.IconBackOpenWeb ? ImgComp.icBack : Images.icCloseBlack} resizeMode='contain' style={[nstyles.nIcon24, { tintColor: colors.white }]} />
                        </TouchableOpacity>
                        {!this.isShowUrl ? null : <Image source={statusSecure == 1 ? Images.icWebSecure : Images.icWebNotSecure} resizeMode='contain'
                            style={[nstyles.nIcon13, { tintColor: colors.white, marginRight: 4 }]} />}
                        <Text style={{ flex: 1, fontSize: FontSize.scale(13), fontWeight: 'bold', color: colors.white }} numberOfLines={2}>{this.istitle ? this.title : this.isShowUrl ? linkShow : ""}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {
                                !this.isShowMenuWeb ? null : <>
                                    <TouchableOpacity disabled={!this.state.canGoBack} onPress={() => { this.refWeb.goBack() }} style={{ padding: 8 }}>
                                        <Image source={Images.icBack} resizeMode='contain' style={[nstyles.nIcon20, { tintColor: this.state.canGoBack ? colors.white : colors.black_10 }]} />
                                    </TouchableOpacity>
                                    <TouchableOpacity disabled={!this.state.canGoForward} onPress={() => { this.refWeb.goForward() }} style={{ padding: 8, marginHorizontal: 5 }}>
                                        <Image source={Images.icBack} resizeMode='contain' style={[nstyles.nIcon20, { tintColor: this.state.canGoForward ? colors.white : colors.black_10, transform: [{ rotate: '180deg' }] }]} />
                                    </TouchableOpacity>
                                </>
                            }
                            <TouchableOpacity onPress={() => {
                                if (this.refWeb) {
                                    this.refWeb.reload();
                                }
                            }} style={{ padding: 10 }}>
                                <Image source={Images.icReLoad} resizeMode='contain' style={[nstyles.nIcon20, { tintColor: colors.white, transform: [{ rotate: '180deg' }] }]} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </LinearGradient>

                <View style={nstyles.nbody}>
                    {
                        this.isHtml ?
                            <WebView
                                onNavigationStateChange={this.onNavigationStateChange}
                                ref={refs => this.refWeb = refs}
                                originWhitelist={['*']}
                                source={{ html: this.link }}
                                mixedContentMode="compatibility"
                            /> :
                            <WebView
                                onNavigationStateChange={this.onNavigationStateChange}
                                ref={refs => this.refWeb = refs}
                                source={{ uri: this.link }}
                                startInLoadingState={true}
                                mixedContentMode="compatibility"
                            />
                    }
                </View>
                {/* {
                    !this.isShowMenuWeb ? null :
                        <View style={{
                            flexDirection: 'row', justifyContent: 'space-between', backgroundColor: colors.white,
                            paddingHorizontal: 20, paddingVertical: 15, paddingBottom: 15 + paddingBotX, borderTopWidth: 0.6,
                            borderColor: colors.grayLight, opacity: 0.9
                        }}>
                            <TouchableOpacity disabled={!this.state.canGoBack} onPress={() => { this.refWeb.goBack() }}>
                                <Image style={[nstyles.nIcon26, { tintColor: this.state.canGoBack ? colors.blueZalo : colors.colorGrayIcon }]}
                                    source={Images.icWebBack} />
                            </TouchableOpacity>
                            <TouchableOpacity disabled={!this.state.canGoForward} onPress={() => { this.refWeb.goForward() }}>
                                <Image style={[nstyles.nIcon26, { tintColor: this.state.canGoForward ? colors.blueZalo : colors.colorGrayIcon }]}
                                    source={Images.icWebNext} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => Utils.onShare('Website', this.state.editlink)}>
                                <Image style={[nstyles.nIcon26, { tintColor: colors.blueZalo }]} source={Images.icWebShare} />
                            </TouchableOpacity>
                            <TouchableOpacity disabled={this.isHtml} onPress={() => Utils.openUrl(this.state.editlink)}>
                                <Image style={[nstyles.nIcon26, { tintColor: colors.blueZalo }]} source={Images.icWebOpen} />
                            </TouchableOpacity>
                        </View>
                } */}
            </View>
        );
    }
}

const mapStateToProps = state => ({
    theme: state.theme
});

export default Utils.connectRedux(BrowserInApp, mapStateToProps, true)

