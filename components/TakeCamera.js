import React, { Component } from 'react';
import { nstyles, nwidth, nheight, paddingBotX } from '../styles/styles'

import {
  Text, StyleSheet, View, StatusBar, Keyboard,
  TouchableOpacity, Image, Platform, Dimensions, PermissionsAndroid, ImageBackground
} from 'react-native';

import CameraRoll from "@react-native-community/cameraroll";
import Utils from '../app/Utils';
import { RNCamera } from 'react-native-camera';
import { colors } from '../styles/color';
import { ImgComp } from './ImagesComponent';

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
  }
});

var check = 1;
export default class TakeCamera extends Component {
  constructor(props) {
    super(props);
    //--Options default
    this.option = {
      typeDefault: 'back',
      showLeft: true,
      showRight: true
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

  componentWillUnmount() {
    StatusBar.setHidden(false);
    Keyboard.dismiss();
  }


  loadMedia = () => {
    let paramsCamera = {
      first: 1,
      assetType: 'Photos' //--set type - all, photos, videos
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

  androidRequestReadStoragePermission() {
    return new Promise((resolve, reject) => {
      if (
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE) ===
        PermissionsAndroid.RESULTS.GRANTED
      ) {
        return resolve();
      }

      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)
        .then(result => {
          if (result === PermissionsAndroid.RESULTS.GRANTED) {
            resolve();
          } else {
            reject();
          }
        })
        .catch(err => {
          reject();
          // alert(err);
        });
    });
  }

  androidRequestPermissionAndLoadMedia = () =>
    this.androidRequestReadStoragePermission()
      .then(() => {
        this.setState({ missingPermission: false });
        this.loadMedia();
      })
      .catch(() => this.setState({ missingPermission: true }));

  postFeeds = (optionsCus) => {
    // Keyboard.dismiss();
    // if (optionsCus == undefined || optionsCus == null)
    //   optionsCus = {};
    // //--Open dialog choose media - ncustom
    // response = (res) => {
    //   if (res.iscancel) {
    //     //--ko chon item or back
    //       Utils.goback(this);
    //   }
    //   else if (res.error) {
    //     //--lỗi khi chon media
    //   }
    //   else {
    //     //--dữ liệu media trả về là 1 item or 1 mảng item
    //     //--Xử lý dữ liệu trong đây-----
    //     Utils.nlog('img', res);
    //     this.setState({ dataMedia: res });
    //     //-----
    //   }
    // };
    // options = {
    //   assetType: 'Photos', //All,Videos,Photos - default
    //   multi: false,// chọn 1 or nhiều item
    //   response: response, // callback giá trị trả về khi có chọn item
    //   limitCheck: -1, //gioi han sl media chon: -1 la khong co gioi han, >-1 la gioi han sl =  limitCheck
    //   ...optionsCus
    // };
    // Utils.goscreen(this, 'Modal_MediaPickerDH', options);
    //--End dialog media
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
    this.onResponse(this.takePictureData, true);
    Utils.goback(this);
  }

  render() {
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
            justifyContent: 'space-around', width: '100%',
            alignItems: 'flex-end', marginBottom: 30
          }]}>
            <TouchableOpacity onPress={() => this.postFeeds()} style={{ opacity: this.option.showLeft ? 1 : 0 }}
              disabled={!this.option.showLeft}>
              <Image style={[nstyles.nAva50, stTakeCamera.imgPreview]} source={{ uri: this.state.defaultPhoto }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={this.takePicture}>
              <Image style={nstyles.nAva80} source={ImgComp.icCaptureImage} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.changeType()} style={{ opacity: this.option.showRight ? 1 : 0 }}
              disabled={!this.option.showRight}>
              <Image style={nstyles.nIcon40} source={ImgComp.icCameraSwitchWhite} />
            </TouchableOpacity>
          </View>
        </RNCamera>
        {
          this.state.cancel == 2 ?
            <ImageBackground resizeMode="contain" style={{
              position: 'absolute', top: 0, left: 0,
              right: 0, bottom: 0, backgroundColor: colors.black
            }} source={{ uri: this.state.defaultPhoto }}>
              <TouchableOpacity style={{ position: 'absolute', right: 20, bottom: 20 + paddingBotX }}
                onPress={this.onSubmit}>
                <Image source={ImgComp.icSendMsg} resizeMode='contain' style={nstyles.nAva60} />
              </TouchableOpacity>
            </ImageBackground>
            : null
        }
        <TouchableOpacity style={{ position: 'absolute', top: 20, left: 20, right: 0, bottom: 0, width: 30, height: 30 }}
          onPress={this.checkCancel(false)}>
          <Image source={ImgComp.icCloseWhite} style={nstyles.nIcon28} />
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
      </View>
    );
  }

  saveImage = async (data) => {
    CameraRoll.saveToCameraRoll(data, 'photo');
  }

  takePicture = async () => {
    if (this.camera) {
      try {
        const options = { quality: 0.5, forceUpOrientation: true, fixOrientation: true };
        const data = await this.camera.takePictureAsync(options);
        this.takePictureData = data;
        this.setState({ defaultPhoto: data.uri, cancel: 2 });
        this.saveImage(data.uri);
      } catch (error) {
        console.log('error takePicture', error)
      };
    }
  }

}


