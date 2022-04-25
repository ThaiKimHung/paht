import React, { Component } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Image, PermissionsAndroid, Platform, AppState, Alert } from 'react-native';
import { nstyles } from '../../styles/styles';
import Permissions from 'react-native-permissions';
import { ImgComp } from './ImagesComponent';

var description = '';
var image = '';
var text = '';
var mangQuyen = [];

export default class ModalCheckPermission extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowModal: true,
      arr: [],
      types: [],
    };
  }


  async UNSAFE_componentWillMount() {
    if (Platform.OS === "ios") {
      let canOpenSettings = Permissions.canOpenSettings()
      // Utils.nlog('canOpenSettings', canOpenSettings)
      this.setState({ canOpenSettings })
      AppState.addEventListener('change', this._handleAppStateChange)
    }
    await this.checkYeuCau();
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange)
  }

  //update permissions when app comes back from settings
  _handleAppStateChange = appState => {
    if (appState == 'active') {
      this._updatePermissions(this.state.arr)
    }
  }

  _openSettings = () =>
    Permissions.openSettings().then(() => Utils.nlog('back'))

  _updatePermissions = types => {
    Permissions.checkMultiple(types)
      .then(status => {
        if (this.state.isAlways) {
          return Permissions.check('location', 'always').then(location => ({
            ...status,
            location,
          }))
        }
        return status
      })
      .then(status => this.setState({ status }))
  }

  _onLocationSwitchChange = () => {
    this.setState({ isAlways: !this.state.isAlways })
    this._updatePermissions(this.state.types)
  }



  checkQuyen = (number) => {
    arrCheck = this.state.arr.slice();
    switch (number) {
      case 1:
        Permissions.check('photo').then(response => {
          if (response != "authorized") {
            // check TH Android User nhấn vào restricted
            if (Platform.OS == "android") {
              if (response != "restricted") {
                arrCheck.push(1);
                mangQuyen.push('photo');
              }
            }
            else {
              arrCheck.push(1);
              mangQuyen.push('photo');
            }
            this.setState({ arr: arrCheck });
          }
        })
        break;
      case 2:
        Permissions.check('location').then(response => {
          if (response != "authorized") {
            // check TH Android User nhấn vào restricted
            if (Platform.OS == "android") {
              if (response != "restricted") {
                arrCheck.push(2);
                mangQuyen.push('location');
              }
            }
            else {
              arrCheck.push(2);
              mangQuyen.push('location');
            }
            this.setState({ arr: arrCheck });
          }
        })
        break;
      case 3:
        Permissions.check('camera').then(response => {
          if (response != "authorized") {
            // check TH Android User nhấn vào restricted
            if (Platform.OS == "android") {
              if (response != "restricted") {
                arrCheck.push(3);
                mangQuyen.push('camera');
              }
            }
            else {
              arrCheck.push(3);
              mangQuyen.push('camera');
            }
            this.setState({ arr: arrCheck });
          }
        })
        break;
      case 4:
        Permissions.check('microphone').then(response => {
          if (response != "authorized") {
            // check TH Android User nhấn vào restricted
            if (Platform.OS == "android") {
              if (response != "restricted") {
                arrCheck.push(4);
                mangQuyen.push('microphone');
              }
            }
            else {
              arrCheck.push(4);
              mangQuyen.push('microphone');
            }
            this.setState({ arr: arrCheck });
          }
        })
        break;
    }
  }

  checkYeuCau = () => {
    for (i = 0; i < this.props.arrRules.length; ++i) {
      this.checkQuyen(this.props.arrRules[i]);
    }
  }

  checkPermission(number) {
    switch (number) {
      case 1:
        text = 'Thư viện';
        description = 'Truy cập vào Thư viện của bạn';
        comment = 'Cho phép quyền truy cập Thư viện.';
        image = ImgComp.icPhotoBlack;
        break;
      case 2:
        text = 'Vị trí';
        description = 'Truy cập và sử dụng Vị trí hiện tại của bạn.';
        comment = 'Cho phép quyền truy cập Vị trí hiện tại';
        image = ImgComp.icLocationBlack;
        break;
      case 3:
        text = 'Máy ảnh';
        description = 'Truy cập vào Máy ảnh của bạn để chụp ảnh.';
        comment = 'Cho phép quyền truy cập Máy ảnh';
        image = ImgComp.icCameraBlack;
        break;
      case 4:
        text = 'Quay video';
        description = 'Truy cập vào Micro của bạn khi quay video.';
        comment = 'Cho phép quyền truy cập Micro';
        image = ImgComp.icVideoBlack;
        break;
    }
  }

  renderText = () => {
    views = [];
    var data = arrCheck;
    let dem = 0;
    for (let i = 0; i < data.length; i++) {
      this.checkPermission(data[i]);
      views.push(
        <View key={dem++} style={[nstyles.nrow, { padding: 8, width: '100%' }]}>
          <View style={{ marginRight: 10 }}>
            <Image resizeMode="contain" source={image} style={nstyles.nIcon28} />
          </View>
          <View style={[nstyles.ncol, { flex: 1 }]}>
            <Text style={{ fontSize: 16, color: 'black' }}>{comment}</Text>
            <Text style={{ fontSize: 14 }}>{description}</Text>
          </View>
        </View>
      )
    }
    return views;
  }

  accessPermission = (number) => {
    if (number.length == 0)
      return;
    inum = number[0];
    number = number.slice(1, number.length);
    switch (inum) {
      case 1:
        Permissions.request('photo').then((r) => this.accessPermission(number));
        break;
      case 2:
        Permissions.request('location').then((r) => this.accessPermission(number));
        break;
      case 3:
        Permissions.request('camera').then((r) => this.accessPermission(number));
        break;
      case 4:
        Permissions.request('microphone').then((r) => this.accessPermission(number));
        break;
    }
  }


  permission = () => {
    this.setState({ isShowModal: false });
    arr = this.state.arr.slice();
    check = false;
    if (Platform.OS == "ios") {
      for (let i = 0; i < mangQuyen.length; ++i) {
        Permissions.check(mangQuyen[i]).then(response => {
          if (response != "authorized") {
            if (response == "undetermined") {
              Permissions.request(mangQuyen[i]);
            }
            else {
              this._openSettings();
            }
          }
        })
      }
    }
    else {
      this.accessPermission(arr);
    }
  }

  render() {
    return (
      this.state.arr.length == 0 ? null :
        <View>
          <Modal animationType="slide"
            transparent={true}
            visible={this.state.isShowModal}
            onRequestClose={() => {
              // alert('Modal has been closed.');
            }}
          >
            <View style={_styles.nbgrmodal} onTouchEnd={() => this.setState({ isShowModal: false })} />
            <View style={[_styles.nmodal]}>
              <View style={[_styles.ncontentcenter, { alignItems: 'center', backgroundColor: 'white', justifyContent: 'center', borderRadius: 15 }]}>
                <View style={_styles.ncontentmodal}>
                  <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={() => this.setState({ isShowModal: false })}>
                    <Image source={ImgComp.icCloseGrey} style={nstyles.nIcon30} />
                  </TouchableOpacity>
                  <View style={{ alignSelf: 'center' }}>
                    <Text style={{ fontSize: 22, color: 'black', marginBottom: 15 }}>Cho phép truy cập quyền</Text>
                  </View>
                  <View style={{ flexDirection: 'column', width: '94%' }}>
                    {
                      this.props.arrRules != null ?
                        this.renderText()
                        : undefined
                    }
                  </View>
                  <TouchableOpacity style={[_styles.nbuttonm, { backgroundColor: '#ecf0f1' }]}
                    onPress={() => this.permission()}>
                    <Text style={{ color: '#C61562', fontSize: 20.0 }}>Cho phép truy cập</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
    );
  }
}

const _styles = StyleSheet.create({
  nbgrmodal: {
    flex: 1,
    backgroundColor: 'black',
    opacity: 0.5
  },
  nmodal: {
    position: 'absolute',
    left: 10,
    right: 10,
    top: 0,
    bottom: 0,
    flexDirection: 'column',
    //flex:1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  ncontentcenter: {
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: {
      height: 2,
      width: 0
    },
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    //width: '100%'
  },
  ncontentmodal: {
    padding: 8,
    //backgroundColor: 'blue'
  },
  nbuttonm: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
    padding: 10,
    borderRadius: 15,
    marginHorizontal: 20
  },
})
