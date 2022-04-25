import CodePush from 'react-native-code-push';
import React, { Component, Fragment } from 'react';
import { Text, View, TouchableOpacity, Image, ImageBackground, Platform, AppState } from 'react-native';
import LottieView from 'lottie-react-native';
import { colors } from './styles';
import LinearGradient from 'react-native-linear-gradient';
import Utils from './app/Utils';
import { Images } from './src/images';
import { Height, isLandscape, nstyles, paddingTopMul, Width } from './styles/styles';
import apis from './src/apis';
import { appConfig } from './app/Config';
import { reText } from './styles/size';
import * as Progress from 'react-native-progress';
import moment from 'moment';
import RNRestart from 'react-native-restart';
import { nkeyCache } from './app/keys/nkeyCache';
import KeepAwake from 'react-native-keep-awake';
import { store } from './srcRedux/store';
import { SetIMGHome } from './srcRedux/actions';



// import { View } from 'react-native-animatable';

const CODE_PUSH_OPTIONS = {
    checkFrequency: CodePush.CheckFrequency.MANUAL,
    // installMode: CodePush.InstallMode.
};
const KEY_STORE = {
    VER_ERROR: 'VER_ERROR',
    // START: 'start',
    // NEW: '0',
    // OLD: '1'
}
const MIN_BACKGROUND_DURATION_IN_MIN = 1;
const withCodePush = WrappedComponent => {
    class WrappedApp extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                isUpdate: false,
                totalBytes: 0,
                receivedBytes: 1,
                isLoad: false,
                ImageBG: Utils.getCacheURL(nkeyCache.imgBgrHomeCD),
                lastBackgroundedTime: 0,
                appState: AppState.currentState,
                dataUpdate: '',
                update_data: ''
            };
        }
        async componentDidMount() {
            store.dispatch(SetIMGHome(Utils.getCacheURL(nkeyCache.imgBgrHomeCD)));
            this.handleAppStateChange('', isNext = true);
            // AppState.addEventListener("change", this.handleAppStateChange);
            this._GetBackGround();
        }

        componentWillUnmount() {
            try {
                KeepAwake.deactivate();
            } catch (error) {

            }
            // AppState.removeEventListener("change", this.handleAppStateChange);
        }
        handleAppStateChange = async (nextAppState, isNext = false) => {
            const { appState, lastBackgroundedTime } = this.state;

            // Try to run the CodePush sync whenever app comes to foreground
            if ((appState && appState.match(/inactive|background/) && nextAppState === "active") || isNext == true) {
                this.setState({ isLoad: false })
                // Only run the sync if app has been in the background for a certain amount of time
                // if (
                // moment.duration(moment().diff(lastBackgroundedTime)).asMinutes() >
                // MIN_BACKGROUND_DURATION_IN_MIN
                // ) {
                // Please show the user some feedback while running this
                // This might take some time, especially if an update is available

                let checkStart = await Utils.ngetStore("start", '0'); // 0 or 1. 0: là lần đầu cài APP tự động BẮT BUỘC update. Tạm thời bỏ
                CodePush.checkForUpdate().then(async (update) => {
                    // Utils.nlog("giá trị update--------", update)
                    // let update = { //-- Data TEST
                    //     appVersion: 3,
                    //     label: '1.0.1',
                    //     isMandatory: true,
                    //     description: '- Cập nhật tối ưu ứng dụng.\n- Cập nhật một số chức năng khác.'
                    // };
                    if (!update) { // TH tự update riêng cho android 

                    } else { //Xử lý TH code push Android + IOS
                        let oldData = await Utils.ngetStore(KEY_STORE.VER_ERROR, { appVersion: -1, label: "-" });
                        if (!(oldData.appVersion == update.appVersion && oldData.label == update.data)) {
                            // TH code push MỚI.
                            if (checkStart == '0' || update.isMandatory) {
                                if (__DEV__ || checkStart == '0' && !update.isMandatory) {
                                    Utils.nsetStore("start", '1');
                                    return;
                                }
                                this.setState({ isUpdate: true, dataUpdate: update, update_data: update.description });
                                this.update();
                            } else {
                                if (isNext && !__DEV__) {
                                    this.setState({ isUpdate: true, dataUpdate: update, update_data: update.description });
                                }
                            }
                        }
                        //++++++++++++++++++++++++
                    }

                    Utils.nsetStore("start", '1');
                });
            }
            if (!isNext && nextAppState && nextAppState.match(/inactive|background/)) {
                this.setState({
                    lastBackgroundedTime: moment(),
                });
            }
            if (!isNext && appState !== nextAppState)
                this.setState({
                    appState: nextAppState,
                });
            this.setState({ appState: nextAppState });
        };


        update = () => {
            try {
                KeepAwake.activate();
            } catch (error) {

            }
            this.setState({ isLoad: true })
            CodePush.sync(
                { installMode: CodePush.InstallMode.IMMEDIATE, minimumBackgroundDuration: 3000 },
                this.syncWithCodePush,
                this.downloadProgressCallback,
            );
            CodePush.notifyAppReady();
        };

        syncWithCodePush = async (status) => {
            if (status == CodePush.SyncStatus.UNKNOWN_ERROR) {
                await Utils.nsetStore("start", "1");
                await Utils.nsetStore(KEY_STORE.VER_ERROR, this.state.dataUpdate)
                this.setState({ isUpdate: false });
            }
        };
        downloadProgressCallback = ({ totalBytes, receivedBytes }) => {
            this.setState({ totalBytes, receivedBytes });
        };

        _GetBackGround = async () => {
            const res = await apis.ApiUser.Get_AnhNen();
            if (res.status == 1 && res.data) {
                let urlBGRTemp = res.data.Link ? (appConfig.domain + res.data.Link) : '';
                urlBGRTemp = await Utils.setCacheURL(nkeyCache.imgBgrHomeCD, urlBGRTemp);
                this.setState({ ImageBG: urlBGRTemp });
                store.dispatch(SetIMGHome(urlBGRTemp));
            }
        }

        render() {
            const { isUpdate, totalBytes, receivedBytes, isLoad, ImageBG, update_data } = this.state;
            let tyle = 1;
            let tyleH = 1;
            if (isLandscape()) {
                tyle = 0.7;
                tyleH = 1.5;
            }
            let sizeW1 = Width(15) * tyle;
            let sizeW2 = Width(22) * tyle;
            let sizeW3 = Width(65) * tyle;
            let sizeW4 = Width(75) * tyle;
            let sizeW5 = Width(70) * tyle;

            let sizeH1 = Height(12) * tyleH;
            let sizeH2 = Height(13) * tyleH;

            if (isUpdate) {
                return (
                    <ImageBackground
                        source={ImageBG ? { uri: ImageBG } : Images.icBgr}
                        style={{
                            flex: 1
                        }}>
                        <ImageBackground
                            source={Images.imgbackgroundX}
                            style={{
                                flex: 1, alignContent: 'center',
                                justifyContent: 'center', backgroundColor: colors.colorWhite_09
                            }}>
                            <View style={[{ marginBottom: Height(8) }, isLandscape() ? { flexDirection: 'row' } : {}]}>
                                <View style={isLandscape() ? { width: '50%' } : {}}>
                                    <Text style={{
                                        color: colors.redStar, fontWeight: 'bold', textAlign: 'center',
                                        fontSize: reText(20)
                                    }}>{appConfig.TieuDeApp}</Text>

                                    <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 10 }} />

                                    {/* setting */}
                                    <View style={{ justifyContent: "center", alignContent: "center", alignItems: "center", alignSelf: "center", position: "absolute", opacity: 0.2 }}>
                                        <LottieView style={{ height: sizeW3 }} source={require('./src/images/lottie/setting.json')} autoPlay loop />
                                    </View>
                                    <View style={{ justifyContent: "center", alignContent: "center", alignItems: "center", alignSelf: "center", position: "absolute", top: sizeH2 + 15, opacity: 0.1 }}>
                                        <LottieView style={{ height: sizeW4 }} source={require('./src/images/lottie/setting.json')} autoPlay loop />
                                    </View>
                                    {/* phone */}
                                    <View style={{ justifyContent: "center", alignContent: "center", alignItems: "center", alignSelf: "center" }}>
                                        <LottieView style={{ height: sizeW5 }} source={require('./src/images/lottie/phone.json')} autoPlay loop />
                                    </View>
                                    {/* download */}
                                    <View style={{ justifyContent: "center", alignContent: "center", alignItems: "center", alignSelf: "center", position: "absolute", top: sizeH2 + 20 }}>
                                        {/* logo App */}
                                        <Image source={Images.iconApp} style={{ height: sizeH1, width: sizeW2 }} resizeMode='contain' />
                                        <LottieView style={{ height: sizeW1 }} source={require('./src/images/lottie/download.json')} autoPlay loop />
                                    </View>
                                </View>

                                <View style={isLandscape() ? { width: '50%', paddingTop: Height(15) } : {}}>
                                    <Text style={{ fontSize: reText(15), lineHeight: 18, paddingVertical: 10, marginHorizontal: 25, textAlign: 'justify' }}>
                                        {/* {"Có một bản cập nhật " + appConfig.TenAppHome + " mới."} */}
                                        {isLoad ? '* Vui lòng chờ trong giây lát, ứng dụng tải vài cài đặt dữ liệu mới...' :
                                            `* Có một bản cập nhật mới. Vui lòng cập nhật phiên bản mới để trải nghiệm tốt hơn!`}
                                    </Text>
                                    {/* <Text style={{ fontSize: reText(15), lineHeight: 25, paddingVertical: 10, textAlign: 'justify' }}>
                                {isLoad ? 'Đang tải xuống bản cập nhật. Vui lòng chờ trong giây lát, ứng dụng sẽ tự khởi động sau khi bản cập nhật hoàn tất cài đặt.' :
                                    'Bạn đang sử dụng phiên bản cũ. Vui lòng cập nhật phiên bản mới để trải nghiệm tốt hơn!'}
                            </Text> */}
                                    {
                                        !update_data ? null :
                                            <Text style={{ fontSize: reText(14), lineHeight: 18, marginHorizontal: Width(13.5), fontStyle: 'italic' }}>Nội dung bản cập nhật:</Text>
                                    }
                                    <Text style={{ fontSize: reText(14), lineHeight: 18, paddingVertical: 5, marginHorizontal: sizeW1, fontStyle: 'italic' }}>{update_data}</Text>
                                    <View style={[{ backgroundColor: null, justifyContent: "center", marginTop: Height(5) }]}>
                                        {isLoad ?
                                            <Fragment>
                                                <Progress.Bar
                                                    progress={receivedBytes / totalBytes}
                                                    width={Width(90)}
                                                    color={colors.colorButtomright}
                                                    height={2}
                                                    borderColor={"white"}
                                                    unfilledColor={"#DDDDDD"}
                                                    // indeterminate={true}
                                                    style={{ alignSelf: 'center', justifyContent: "center" }} />
                                                <Text style={{ color: 'black', textAlign: "center", fontSize: reText(10), paddingLeft: 20, paddingVertical: 8 }}>Đang tải bản cập nhật: {`${((receivedBytes / 1024) / 1024).toFixed(2)}/${((totalBytes / 1024) / 1024).toFixed(2)} MB`}</Text>
                                                <TouchableOpacity
                                                    style={{
                                                        backgroundColor: colors.brownGreyTwo,
                                                        padding: 10, margin: 10, borderRadius: 3, marginHorizontal: '20%'
                                                    }}
                                                    onPress={() => this.setState({ isUpdate: false })}>
                                                    <Text style={{ textAlign: 'center', fontWeight: 'bold', color: colors.white }}> {'Để sau'}</Text>
                                                </TouchableOpacity>
                                            </Fragment>
                                            : null}

                                    </View>

                                    <View style={{ justifyContent: "center", alignContent: "center", alignItems: "center", alignSelf: "center", marginHorizontal: 25 }}>
                                        {
                                            isLoad ? null : <View pointerEvents={isLoad ? 'none' : 'auto'} style={{
                                                flexDirection: 'row',
                                                justifyContent: 'center'
                                            }}>
                                                <TouchableOpacity
                                                    style={{
                                                        backgroundColor: colors.brownGreyTwo,
                                                        padding: 10,
                                                        margin: 10, flex: 1, borderRadius: 3,
                                                    }}
                                                    onPress={() => this.setState({ isUpdate: false })}>
                                                    <Text style={{ textAlign: 'center', fontWeight: 'bold', color: colors.white }}> {'Để sau'}</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={{
                                                        backgroundColor: colors.blueGrey_20,
                                                        padding: 10,
                                                        margin: 10, flex: 1,
                                                        backgroundColor: colors.pumpkinOrange,
                                                        borderRadius: 3

                                                    }}
                                                    onPress={this.update}>
                                                    <Text style={{ textAlign: 'center', fontWeight: 'bold', color: colors.white, }}> {'Cập nhật'}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        }
                                    </View>
                                </View>
                            </View>
                        </ImageBackground>
                    </ImageBackground >
                );
            } else {
                return <WrappedComponent />;
            }
        }
    }

    return CodePush(CODE_PUSH_OPTIONS)(WrappedApp);
};

export default withCodePush;