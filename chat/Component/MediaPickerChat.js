import React, { Component, PureComponent } from 'react';
import {
  Image,
  View,
  StyleSheet,
  Text,
  Platform,
  Alert,
  TouchableOpacity,
  Dimensions,
  PermissionsAndroid,
  FlatList,
  RefreshControl,
  ScrollView,
  Linking
} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import { nstyles, nwidth, Width } from '../../styles/styles';
import * as nstylen from '../../styles';

import Utils from '../../app/Utils';
import { ImagesChat } from '../Images';
import { reText } from '../../styles/size';
import { colors } from '../styles';
import { ConfigScreenDH } from '../../srcAdmin/routers/screen';

const stMediaPicker = StyleSheet.create({});
const COLOR_ICON = colors.peacockBlue;

let isend = true;
let isLoadImg = false;
let sindeximg = '';
export default class MediaPickerChat extends Component {
  constructor(props) {
    super(props);
    options = {
      //DEFAULT OPTIONS
      assetType: 'All', //All,Videos,Photos - default
      multi: true, // chọn 1 or nhiều item
      response: () => { }, // callback giá trị trả về khi có chọn item
      limitCheck: 10, //gioi han sl media chon: -1 la khong co gioi han, >-1 la gioi han sl =  limitCheck
      groupTypes: 'All',
      showTakeCamera: true
    };
    options = {
      ...options,
      ...this.props.navigation.state.params //--options media
    };
    nthisMediaPicker = this;
    this.state = {
      //data globle
      isLoading: false,
      //data local
      missingPermission: false,
      photos: [],
      countChoose: 0,
      permissionIOS: true,
      indexNow: -1,
      sl: 51,
      opacityMain: 1
    };
    if (Platform.OS == 'android') {
      this.androidRequestPermissionAndLoadMedia();
    }
  }

  UNSAFE_componentWillMount = async () => {
    if (Platform.OS == 'ios') {
      this.loadMedia();
    } else {
      this.androidRequestPermissionAndLoadMedia();
    }
  };
  componentWillUnmount = async () => {
    isend = true;
    sindeximg = '';
    isLoadImg = false;
  };
  loadMedia = async (ssl = 0) => {
    if (!isend) {
      isLoadImg = false;
      return;
    }
    let mtemp = this.state.photos.slice();
    let sl = this.state.sl;
    sl += ssl;
    let sidold = false;
    let paramsCamera = {
      first: sl,
      assetType: options.assetType, //--set type - all, photos, videos,
      include: ['filename', 'imageSize', 'playableDuration']
    };
    if (Platform.OS == 'ios') paramsCamera.groupTypes = options.groupTypes;
    CameraRoll.getPhotos(paramsCamera)
      .then(
        r => {
          var mlid = [];
          r.edges.map((item, index) => {
            // Utils.nlog('gia tri item chon imagepick', item);
            if (sidold || mtemp.length == 0) {
              mlid.push({
                ...item.node.image,
                idItem: this.state.photos.length.toString() + '_' + index,
                uri: item.node.image.uri,
                timePlay: item.node.image.playableDuration
                  ? item.node.image.playableDuration
                  : 0, // =0: img, >0: videos
                height: item.node.image.height,
                width: item.node.image.width,
                ischoose: false
              });
              sindeximg = r.page_info.end_cursor;
            }
            if (item.node.image.uri == sindeximg) {
              sidold = true;
            }
          });
          let mtempMain = [...mtemp, ...mlid];
          // Utils.nlog('gia tri media pickerchat ----------------- ', mtempMain);
          isend = r.page_info.has_next_page;
          this.setState({ photos: mtempMain, sl: sl });
          isLoadImg = false;
        },
        reason => {
          if (
            reason.toString().includes('User denied access') &&
            Platform.OS == 'ios'
          )
            this.setState({ permissionIOS: false });
          isLoadImg = false;
        }
      )
      .catch(err => {
        // Utils.nlog('no ok');
        isLoadImg = false;
      });
  };
  androidRequestReadStoragePermission() {
    return new Promise((resolve, reject) => {
      if (
        PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        ) === PermissionsAndroid.RESULTS.GRANTED
      ) {
        return resolve();
      }
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      )
        .then(result => {
          if (result === PermissionsAndroid.RESULTS.GRANTED) {
            resolve();
          } else {
            reject();
          }
        })
        .catch(err => {
          reject();
        });
    });
  }

  androidRequestPermissionAndLoadMedia = () => {
    this.androidRequestReadStoragePermission()
      .then(() => {
        this.setState({ missingPermission: false });
        this.loadMedia();
      })
      .catch(() => this.setState({ missingPermission: true }));
  };

  chooseItem = index => {
    let i = this.state.indexNow;
    let mtemp = this.state.photos;
    let icount = this.state.countChoose;
    //--gioi han sl chon
    if (
      options.multi &&
      options.limitCheck > -1 &&
      this.state.countChoose >= options.limitCheck &&
      !mtemp[index].ischoose
    ) {
      return;
    }
    //-----
    if (mtemp[index].ischoose) icount--;
    else icount++;
    if (i != -1) mtemp[i] = { ...mtemp[i], ischoose: false };
    mtemp[index] = { ...mtemp[index], ischoose: !mtemp[index].ischoose };

    this.setState({ photos: mtemp, countChoose: icount });
    this.setState({
      photos: mtemp,
      countChoose: icount,
      indexNow: options.multi ? -1 : index
    });
  };

  prevMedia = () => { };
  onPlayVideo = suri => {
    Utils.goscreen(this, ConfigScreenDH.Modal_PlayMedia, { source: suri });
  };

  done = () => {
    let tdata = this.state.photos.slice();
    tdata = tdata.filter(item => item.ischoose);
    // Utils.nlog('gia tri data', tdata);
    if (options.assetType == 'Photos') {
      let data = tdata.map(item => {
        return {
          ...item,
          type: 'image',
          name: `Image${item.idItem}.png`,
          uri: item.uri,
          url: item.uri
        };
      });

      Utils.goback(this);
      options.response(data);
    } else {
      Utils.goback(this);
      // Utils.nlog('tdata', tdata);
      Utils.goscreen(this, 'modal_playVideo', {
        source: tdata[0],
        key: 2,
        SendFile: Utils.ngetParam(this, 'SendFile', () => { })
      });
    }
  };

  onResponse = (item, isok) => {
    if (isok) {
      Utils.goback(this);
      options.response([item]);
    } else {
      this.setState({ opacityMain: 1 });
    }
  };

  _openCamrera = () => {
    Utils.goscreen(this, ConfigScreenDH.Modal_TakeCamera, {
      onResponse: this.onResponse,
      showLeft: false
    });
    this.setState({ opacityMain: 0 });
  };
  renderItem = ({ item, index }) => {
    return (
      <ItemImage
        item={item}
        index={index}
        onPlayVideo={this.onPlayVideo}
        chooseItem={this.chooseItem}
        prevMedia={this.prevMedia}
        dem={this.state.countChoose}
      />
    );
  };

  render() {
    return (
      <View
        style={[
          nstyles.ncontainerX,
          {
            opacity: this.state.opacityMain,
            paddingTop: nstylen.nstyles.paddingTopMul()
          }
        ]}
      >
        <View style={nstyles.nbody}>
          {this.state.permissionIOS ? (
            <View style={{ flex: 1 }}>
              <View
                style={{
                  width: '100%',
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                  flexDirection: 'row'
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    if (this.state.countChoose != 0) {
                      let { photos } = this.state;
                      photos = photos.map(item => {
                        return { ...item, ischoose: false };
                      });
                      this.setState({ photos, countChoose: 0 });
                    } else {
                      Utils.goback(this);
                    }
                  }}
                  style={{ width: Width(20), paddingTop: 7 }}
                >
                  <Image
                    style={[nstyles.nIcon20, { tintColor: colors.peacockBlue }]}
                    resizeMode="cover"
                    source={ImagesChat.icCloseImg}
                  />
                </TouchableOpacity>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Text
                    style={{
                      color: COLOR_ICON,
                      fontSize: 16,
                      fontWeight: 'bold'
                    }}
                  >{`Đã chọn ${this.state.countChoose}`}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => this.state.countChoose == 0 ? null : this.done()}
                  style={{
                    paddingHorizontal: 20,
                    backgroundColor: COLOR_ICON,
                    borderRadius: 5,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 8
                  }}
                >
                  <Text
                    style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}
                  >
                    {'Chọn'}
                  </Text>
                </TouchableOpacity>
              </View>
              {options.limitCheck > 0 &&
                options.multi &&
                this.state.countChoose == options.limitCheck ? (
                  <View style={{ paddingVertical: 4, alignItems: 'center' }}>
                    <Text
                      style={[nstyles.ntext, { color: 'black', fontSize: 14 }]}
                    >
                      Chọn tối đa {options.limitCheck} hình ảnh
                  </Text>
                  </View>
                ) : null}
              <FlatList
                data={this.state.photos}
                style={{
                  flex: 1,
                  backgroundColor: colors.white,
                  padding: 10,
                  paddingRight: 5,
                  paddingTop: 5,
                  marginBottom: 10
                }}
                contentContainerStyle={{
                  flex: this.state.photos.length == 0 ? 1 : null
                }}
                ref={ref => {
                  this.listCmts = ref;
                }}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="interactive"
                onEndReachedThreshold={0.3}
                onEndReached={() => {
                  if (this.state.photos.length != 0) this.loadMedia(30).done();
                }}
                renderItem={this.renderItem}
                showsVerticalScrollIndicator={false}
                numColumns={3}
                keyExtractor={(item, index) => item.idItem}
                ListEmptyComponent={
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Text>{'Không có dữ liệu...'}</Text>
                  </View>
                }
              />
            </View>
          ) : (
              <TouchableOpacity
                style={[
                  nstyles.nbtn_Bgr,
                  {
                    borderRadius: 5,
                    paddingHorizontal: 18,
                    alignSelf: 'center',
                    paddingVertical: 5,
                    backgroundColor: '#157EFB',
                    marginTop: 20
                  }
                ]}
                onPress={() => {
                  Linking.openURL('app-settings:').catch(err => {
                    Utils.nlog(err);
                  });
                }}
              >
                <Text style={[nstyles.ntextbtn_Bgr, { fontSize: 14 }]}>
                  Đi đến cài đặt
              </Text>
              </TouchableOpacity>
            )}
        </View>
      </View>
    );
  }
}

class ItemImage extends PureComponent {
  render() {
    const { item, index, prevMedia, onPlayVideo, chooseItem } = this.props;
    // Utils.nlog(item.idItem);
    return item.height == -1 ? null : (
      <TouchableOpacity
        onPress={() => {
          chooseItem(index);
        }}
        activeOpacity={0.9}
        style={{
          width: (nwidth() - 30) / 3,
          height: (nwidth() - 30) / 3,
          marginRight: 5,
          marginTop: 5,
          borderColor: item.ischoose ? COLOR_ICON : '#E8E8E9',
          borderWidth: 1
        }}
        //  onPress={() => { prevMedia() }}
        onPress={() => {
          chooseItem(index);
        }}
      >
        <Image
          style={{
            width: (nwidth() - 30) / 3,
            height: (nwidth() - 30) / 3
          }}
          resizeMode="cover"
          source={{ uri: item.uri }}
        />

        {item.ischoose ? (
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              elevation: 2,
              alignItems: 'center',
              justifyContent: 'center',
              shadowOffset: { width: 1, height: 1 },
              shadowColor: 'black'
            }}
            activeOpacity={0.9}
            onPress={() => {
              chooseItem(index);
            }}
          >
            <View style={{ backgroundColor: colors.white, borderRadius: 15 }}>
              <Image
                style={{ width: 30, height: 30, tintColor: colors.peacockBlue }}
                resizeMode="cover"
                source={ImagesChat.icChecked}
              />
            </View>
          </TouchableOpacity>
        ) : null}
      </TouchableOpacity>
    );
  }
}
