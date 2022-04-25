import React, { Component } from 'react';
import { nstyles, nwidth, nheight, paddingBotX, Width } from '../../styles/styles'
import {
    Text, StyleSheet, View, StatusBar, Keyboard,
    TouchableOpacity, Image, Platform, Dimensions, PermissionsAndroid, ImageBackground
} from 'react-native';
import CameraRoll from "@react-native-community/cameraroll";
import { RNCamera } from 'react-native-camera';
import Utils from '../../app/Utils';
import { Images } from '../../srcAdmin/images';
import { colors } from '../styles/color';
import { IsLoading } from '../../components';
import { ImagesChat } from '../Images';
import moment from 'moment'
import { PERMISSIONS, checkMultiple } from 'react-native-permissions';

//styles màn hình popupMore
const stTakeCamera = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black'
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20
    },
    imgPreview: {
        borderColor: colors.white,
        borderWidth: 1.5
    },
    timer: {
        color: colors.white,
        fontWeight: '500',
        fontSize: 18
    },
    circle: {
        width: 18,
        height: 18,
        backgroundColor: '#d8541c',
        borderRadius: 9,
        marginRight: 5,
    }
});

function Timer({ interval }) {
    const pad = (n) => n < 10 ? '0' + n : n
    const duration = moment.duration(interval)
    const centiseconds = Math.floor(duration.milliseconds() / 10)
    return (
        <View style={{ flexDirection: 'row' }}>
            <Text style={stTakeCamera.timer}>{pad(duration.minutes())}:</Text>
            <Text style={stTakeCamera.timer}>{pad(duration.seconds())}</Text>
        </View>
    )
}
var check = 1;
class TakeCameraChat extends Component {
    constructor(props) {
        super(props);
        //--Options default
        this.option = {
            typeDefault: 'back',
            showLeft: true,
            showRight: true,
            isAudio: true,
            response: () => { }
        };
        this.option = {
            ...this.option,
            ...this.props.navigation.state.params //--options custom
        }
        //--
        this.lang = Utils.ngetParam(this, 'lang', '');
        this.onResponse = Utils.ngetParam(this, 'onResponse', () => { });
        this.takePictureData = null;
        this.state = {
            type: this.option.typeDefault,
            defaultPhoto: undefined,
            itemTake: {},
            missingPermission: false,
            cancel: 1,   // 1: take picture, 2: preview picture
            isRecording: false,
            iconVid: "play",
            currentTime: 0.0,
            opacityView: 1,
            recordOptions: {
                quality: RNCamera.Constants.VideoQuality["720p"],
            },
            start: 0,
            now: 0,
        };
    }

    UNSAFE_componentWillMount() {
        StatusBar.setHidden(true);
        Keyboard.dismiss();
        if (!this.option.showLeft)
            return;
        if (Platform.OS == 'ios')
            this.loadMedia();
        else
            this.androidRequestPermissionAndLoadMedia();

    }
    // componentDidMount() {
    //     this.androidRequestPermissionAndLoadMedia();
    // }

    componentWillUnmount() {
        StatusBar.setHidden(false);
        Keyboard.dismiss();
        // clearInterval(this.timer)
    }


    loadMedia = () => {
        let paramsCamera = {
            first: 1,
            assetType: 'Videos' //--set type - all, photos, videos
        };
        if (Platform.OS == 'ios')
            paramsCamera.groupTypes = 'All';
        CameraRoll.getPhotos(paramsCamera)
            .then(r => {
                let Temp = r.edges[0].node.image.uri;
                this.setState({ defaultPhoto: Temp });
            },
                (reason) => {
                    if (reason.toString().includes('User denied access') && Platform.OS == 'ios')
                        this.setState({ permissionIOS: false });
                })
            .catch((err) => {
                Utils.nlog('no ok');
                //Error Loading Images
            });
    }


    androidRequestPermissionAndLoadMedia = () => {
        if (Platform.OS == 'android') {
            checkMultiple([PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE, PERMISSIONS.ANDROID.CAMERA, PERMISSIONS.ANDROID.RECORD_AUDIO]).then((statuses) => {
                if (statuses[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE]) {
                    this.setState({ missingPermission: false });
                    this.loadMedia();
                } else {
                    this.setState({ missingPermission: true })
                }
            });
        }

    }



    postFeeds = (optionsCus) => {

    }

    checkCancel = (isok = true) => () => {
        let cancel = this.state.cancel;
        if (cancel == 1) {
            this.onResponse({}, isok);
            Utils.goback(this);
        } else {
            if (isok) {
                //code IMG Select done
                this.onResponse([this.state.itemTake], isok);
                Utils.goback(this);
            }
            else
                this.setState({ cancel: 1 });
        }
    }

    changeType = () => {
        type = this.state.type;
        if (type == "back") {
            this.setState({ type: 'front' })
        }
        else {
            this.setState({ type: 'back' })
        }
    }
    onSubmit = () => {
        // Utils.nlog("gia tri pick data", this.takePictureData);
        let img = {
            type: 'image/png',
            name: `ImagePhoto.png`,
            uri: this.takePictureData.uri,
            url: this.takePictureData.uri
        }
        Utils.goback(this);
        this.props.SendFileOfGroup([{ ...img }]);

    }
    start = () => {
        const now = new Date().getTime()
        this.setState({
            start: now,
            now,
        })
        this.timer = setInterval(() => {
            this.setState({ now: new Date().getTime() })
        }, 100)
    }

    stop = () => {
        clearInterval(this.timer)
        const { now, start } = this.state
        this.setState({
            start: 0,
            now: 0,
        })
    }

    recordVideo = () => {
        if (this.camera) {
            if (this.state.isRecording === false) {
                this.start();
                this.setState({ isRecording: true, iconVid: "stop" });
                this.camera.recordAsync().then(async data => {
                    Utils.nlog(data);
                    this.onPlayVideo(data);
                    //--Save video xuong thiết bị - có thể bỏ nếu ko cần
                    // if (Platform.OS === 'android') {
                    //   await this.checkAndroidPermission();
                    // }
                    // CameraRoll.saveToCameraRoll(data.uri, "video");
                    //-----
                }).catch((err) => {
                    Utils.nlog('Video error', err);
                });
                Utils.nlog("Device is Recording");
            } else {
                this.camera.stopRecording()
                this.stop();
                this.setState({
                    isRecording: false,
                    iconVid: "play"
                });
                Utils.nlog("Stop Recording");
            }
        }
    };

    onPlayVideo = (data) => {
        let nthisTemp = this;
        let onSend = () => {
            let video = {
                type: "video/mp4",
                name: "Video.mp4",
                uri: data.uri,
                url: data.uri
            }
            this.props.SendFileOfGroup([{ ...video }]);
            Utils.goback(nthisTemp);
        }
        Utils.goscreen(this, 'Modal_PlayMedia', { source: data.uri, onSend: onSend });
    }
    render() {
        const { now, start } = this.state
        const timer = now - start
        return (
            <View style={stTakeCamera.container}>
                <RNCamera
                    ref={(cam) => {
                        this.camera = cam
                    }}
                    style={stTakeCamera.preview}
                    type={this.state.type}
                    captureAudio={false}
                    autoFocus='on'
                >
                    {/* Custom component in Camera View */}
                    <View style={[nstyles.nrow, {
                        justifyContent: 'center',
                        width: '100%', paddingHorizontal: 15,
                        alignItems: 'flex-end', marginBottom: 30
                    }]}>
                        <TouchableOpacity onPress={() => this.postFeeds()} style={{ opacity: this.option.showLeft ? 1 : 0 }}
                            disabled={!this.option.showLeft}>
                            <Image style={[nstyles.nAva50, stTakeCamera.imgPreview]} source={{ uri: this.state.defaultPhoto }} />
                        </TouchableOpacity>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end' }}>
                            <TouchableOpacity onPress={this.takePicture}>
                                <Image style={this.state.isRecording ? nstyles.nAva40 : nstyles.nAva80} source={ImagesChat.icCaptureImage} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.recordVideo()}>
                                <Image style={[this.state.isRecording ? nstyles.nAva80 : nstyles.nAva40, { tintColor: 'white' }]} source={Images.icVideo} />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity onPress={() => this.changeType()} style={{ opacity: this.option.showRight ? 1 : 0 }}
                            disabled={!this.option.showRight}>
                            <Image style={nstyles.nIcon40} source={ImagesChat.icCameraSwitchWhite} />
                        </TouchableOpacity>

                    </View>
                </RNCamera>
                {
                    this.state.isRecording ?
                        <View style={{
                            position: 'absolute', top: Width(8), justifyContent: 'center',
                            left: 0, right: 0, flexDirection: 'row'
                        }}>
                            <View style={[nstyles.nrow, {
                                alignItems: 'center', paddingHorizontal: 12,
                                paddingVertical: 9
                            }]}>
                                <View style={{
                                    position: 'absolute', top: 0, bottom: 0, borderRadius: 5,
                                    left: 0, right: 0, backgroundColor: 'black', opacity: 0.3
                                }} />
                                <View style={stTakeCamera.circle} />
                                <Timer interval={timer} />
                            </View>
                        </View>
                        : null
                }
                {
                    this.state.cancel == 2 ?
                        <ImageBackground resizeMode="contain" style={{
                            position: 'absolute', top: 0, left: 0,
                            right: 0, bottom: 0, backgroundColor: colors.black
                        }} source={{ uri: this.state.defaultPhoto }}>
                            <TouchableOpacity
                                onPress={this.onSubmit}
                                activeOpacity={0.5}
                                style={{
                                    position: 'absolute',
                                    bottom: 100, right: 20,
                                    // paddingHorizontal: 20,
                                    backgroundColor: '#276289',
                                    padding: 13,
                                    borderRadius: 50,
                                    alignItems: 'center',
                                    shadowColor: 'black',
                                    shadowOffset: { width: 1, height: 1 },
                                    shadowOpacity: 0.3,
                                    shadowRadius: 3,
                                    elevation: 2,// do itemdanhsach shadow k hiện rõ trên android
                                }}>
                                {/* <Text style={{ textAlign: 'center' }}>Search</Text> */}
                                <Image source={ImagesChat.icSendMsg} style={[{ width: 24, height: 24, tintColor: colors.white }]} resizeMode={'contain'} />
                            </TouchableOpacity>
                            {/* <TouchableOpacity style={{ position: 'absolute', right: 20, bottom: 20 + paddingBotX }}
                                onPress={this.onSubmit}>
                                <Image source={ImagesChat.icSendMsg} resizeMode='contain' style={nstyles.nAva60} />
                            </TouchableOpacity> */}
                        </ImageBackground>
                        : null
                }
                <TouchableOpacity style={{
                    position: 'absolute', top: Width(8),
                    left: 20, right: 0, bottom: 0,
                    width: 40, height: 40, //backgroundColor: 'red',
                    justifyContent: 'center', alignItems: 'center'
                }}
                    onPress={this.checkCancel(false)}>
                    <Image source={ImagesChat.icCloseWhite} style={nstyles.nIcon28} />
                </TouchableOpacity>
                {
                    false ?
                        <View style={{ position: 'absolute', top: '30%', left: 0, right: 0 }}>
                            <TouchableOpacity style={[nstyles.nbtn_Bgr, {
                                borderRadius: 5, paddingHorizontal: 18,
                                alignSelf: 'center', paddingVertical: 5, backgroundColor: colors.colorBlue, marginTop: 20
                            }]}
                                onPress={() => {
                                    Linking.openURL('app-settings:').catch((err) => {
                                        Utils.nlog(err);
                                    });
                                }}>
                                <Text style={[nstyles.ntextbtn_Bgr, { fontSize: sText14 }]}>Go to Settings</Text>
                                <Text style={[nstyles.ntextbtn_Bgr, { fontSize: sText14 }]}>(Allow access Camera)</Text>
                            </TouchableOpacity>
                        </View> : null
                }
                <IsLoading />
            </View>
        );
    }

    saveImage = async (data) => {
        CameraRoll.save(data, 'photo');
    }

    takePicture = async () => {
        if (this.camera) {
            nthisIsLoading.show();
            try {
                const options = { quality: 0.5, forceUpOrientation: true, fixOrientation: true };
                const data = await this.camera.takePictureAsync(options);
                this.takePictureData = data;
                await this.setState({ defaultPhoto: data.uri, cancel: 2 });
                await this.saveImage(data.uri);
                nthisIsLoading.hide();
            } catch (error) {
                console.log('error takePicture', error)
                nthisIsLoading.hide();
            };
        }
    }

}
const mapStateToProps = state => ({
    dataInFo: state.ReducerGroupChat.InFoGroup,
});
export default Utils.connectRedux(TakeCameraChat, mapStateToProps, true)


