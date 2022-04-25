import React, {
  Component,
  useState,
  useEffect,
  useRef,
  useMemo,
  memo
} from 'react';
import {
  Text,
  View,
  KeyboardAvoidingView,
  SafeAreaView,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  Linking, ActivityIndicator
} from 'react-native';
import Utils from '../../app/Utils';
import { colors } from '../../styles';
import { Images } from '../../srcAdmin/images';
import { Width, nstyles } from '../../styles/styles';
import { ImagesChat } from '../Images';
import Video from 'react-native-video';
import ItemFW from './ItemFW';
import { reText } from '../../styles/size';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import { store } from '../../srcRedux/store';
import { SendFileOfGroup, RemoveMessageBySenKeyOfGroup, ApiCheckData } from '../../srcRedux/actions';
import VideoCus from '../../components/Video/VideoCus';

function propsAreEqual(prev, next) {

  if (next.index < 3) {
    // Utils.nlog("giá trin kkkkk-<><<>>>><<<>", next, prev)
    return false
  } else {
    return prev.item.IdChat == next.item.IdChat
  }
}
const ItemChat = memo(props => {
  const { item, index, idUser, onLongPress, isManHinhChat, itemOld = {}, itemNext = '', InFoGroup = {}, type = 0, multiTypeUserChat = false } = props;
  let IsUser = false;
  let checkPrev = false;
  let checkNext = false;
  //Xử lý logic -------------------------------------
  let isTimeLong = moment(item.CreatedDate).diff(moment(itemOld.CreatedDate), 'seconds');
  let isTimeLongPrev = moment(itemNext.CreatedDate).diff(moment(item.CreatedDate), 'seconds');
  if (multiTypeUserChat) {
    IsUser = item.UserID == idUser && item.Type == Number(`${type}`) ? true : false;
    // multitype
    if (itemOld && item.UserID && item.Type && itemOld.UserID != item.UserID && item.Type != itemOld.Type) {
      checkPrev = true;
    }
    if (itemNext && (itemNext.UserID == item.UserID && item.Type == itemNext.Type) || isTimeLongPrev > 180) {
      checkNext = true;
    }
  } else {
    IsUser = item.UserID == idUser ? true : false;
    //no multitype
    if (itemOld && item.UserID && itemOld.UserID != item.UserID) {
      checkPrev = true;
    }
    if (itemNext && itemNext.UserID == item.UserID || isTimeLongPrev > 180) {
      checkNext = true;
    }
  }

  useEffect(() => {
    let ck = moment(item.CreatedDate).diff(moment(new Date()), 'minute');
    if (item.IdChat == 0 && ck > -5 && item.CreatedDate) {
      setTimeout(() => {
        store.dispatch(ApiCheckData(item))
      }, 5000);
    }
  }, [])
  //Xử lý logic ------------------------------------- end
  if (item.isLoadFile == true) {
    let isImage = Utils.checkIsImage(item.name)
    let isIVideo = Utils.checkIsVideo(item.name)
    return (
      <View
        style={{
          alignItems: 'flex-end',
          minHeight: 100,
          width: '100%',
        }}>
        <TouchableOpacity
          style={{
            borderWidth: 0.5,
            borderColor: 'rgba(18,92,199,0.7)',
            borderRadius: 10,
            marginLeft: 5,
            backgroundColor: `white`,
            width: reText(150),
            height: reText(200),
            borderRadius: 10,
            // borderTopLeftRadius: 10,
            // borderBottomRightRadius: 0,
            alignItems: 'center', justifyContent: 'center'
          }}
        >
          {isImage == true ? (
            <>
              <Image
                resizeMode="cover"
                source={{ uri: `${item.uri}` }}
                style={[
                  {
                    width: reText(150),
                    height: reText(200),
                    borderRadius: 10,

                  }
                ]}
              ></Image>
            </>
          ) : isIVideo ? (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Image
                resizeMode="cover"
                source={{ uri: `${item.uri}` }}
                style={[
                  {
                    width: reText(150),
                    height: reText(200),
                    borderRadius: 10,

                  }
                ]}
              ></Image>

              <View style={{ position: 'absolute' }}>
                <Image
                  source={ImagesChat.icPlayButton}
                  style={[
                    {
                      width: 15,
                      height: 15,
                      borderRadius: 5,
                      borderBottomRightRadius: 0
                    }
                  ]}
                ></Image>
              </View>
            </View>
          ) : null}
          <View style={{
            position: 'absolute',
            top: 0, backgroundColor: `rgba(18,92,199,0.6)`,
            borderRadius: 10,
            left: 0, right: 0, bottom: 0,
            alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10
          }}>
            < ActivityIndicator size="large" color={colors.white} style={{
              marginBottom: 20, marginTop: 20,

            }} />
            <Text style={{
              fontWeight: 'bold', color: colors.white,
              fontSize: reText(10)
            }}>{'Đang gửi file :\n' + item.name}</Text>
          </View>
        </TouchableOpacity>

      </View >
    )

  }
  else if (item.isError == true) {
    let isImage = Utils.checkIsImage(item.name)
    let isIVideo = Utils.checkIsVideo(item.name)
    return (
      <View
        style={{
          alignItems: 'flex-end',
          minHeight: 100,
          width: '100%',

        }}>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={{
              borderWidth: 0.5,
              borderColor: 'rgba(18,92,199,0.7)',
              borderRadius: 10,
              maxWidth: Width(60),
              marginLeft: 5,
            }}
          >

            {isImage == true ? (
              <>
                <Image
                  resizeMode="cover"
                  source={{ uri: `${item.uri}` }}
                  style={[
                    {
                      width: reText(150),
                      height: reText(200),
                      borderRadius: 10,
                    }
                  ]}
                ></Image>
              </>
            ) : isIVideo ? (
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <VideoCus
                  source={{ uri: item.uri }}
                  paused={true}
                  resizeMode={'contain'} // Store reference
                  style={{
                    width: reText(150),
                    height: reText(200),
                  }}
                  repeat={true}
                // onError={this.videoError}
                />
                <View style={{ position: 'absolute' }}>
                  <Image
                    source={ImagesChat.icPlayButton}
                    style={[
                      {
                        width: 15,
                        height: 15,
                      }
                    ]}
                  ></Image>
                </View>
              </View>
            ) : (<View style={{ paddingHorizontal: 5 }}>
              <Text
                style={{
                  color: item.UserID != idUser ? colors.black : colors.white,
                  fontWeight: 'bold',
                  fontSize: reText(16)
                }}
              >
                {item.TenFile}
              </Text>
            </View>)}
          </TouchableOpacity>
        </View>
        <Text
          style={{
            color: colors.redStar,
            fontSize: reText(10),
            fontStyle: 'italic'
          }}
        >
          Lỗi gửi file...
        </Text>
        <View style={{ flexDirection: 'row', marginTop: 5 }}>

          <TouchableOpacity
            onPress={() => {
              store.dispatch(SendFileOfGroup([{ ...item }]))
              store.dispatch(RemoveMessageBySenKeyOfGroup(item))
            }}
            style={{
              padding: 5,
              borderColor: colors.greenyBlue,
              paddingHorizontal: 10, borderWidth: 1, borderRadius: 5, marginHorizontal: 5
            }}>
            <Text style={{
              color: colors.greenyBlue,
              fontSize: reText(10),
              fontStyle: 'italic'
            }}>{'Gửi lại'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              store.dispatch(RemoveMessageBySenKeyOfGroup(item))
            }}
            style={{
              padding: 5,
              borderColor: colors.coral,
              paddingHorizontal: 10,
              borderWidth: 1, borderRadius: 5,
            }}>
            <Text style={{
              color: colors.coral,
              fontSize: reText(10),
              fontStyle: 'italic'
            }}>{'Xoá file'}</Text>
          </TouchableOpacity>
        </View>
      </View >
    )

  } else {
    let isImage = true;
    if (Utils.checkIsImage(item.PathFile)) {
    } else {
      isImage = false;
    }
    if (item.isDelete == true) {
      return null;
    }

    const onPress = (e) => {
      onLongPress(e, item.IdChat == item.SendKey || item.IdChat == 0 ? true : false)
    }
    return <View style={{
      flexDirection: 'row',
      marginTop: isTimeLong > 180 ? 10 : 0,
    }}>
      {
        IsUser ? null : <View style={{
          width: 40,
          justifyContent: 'flex-end',
          paddingVertical: 10
        }}>


          {
            checkNext == false || index == 0 ? < Image
              source={{ uri: `${item.avata}` }}
              style={[{ width: 35, height: 35, borderRadius: 15 }]}
            ></Image> : <View style={{ width: 30 }}></View>
          }
        </View>
      }

      <View style={{
        flex: 1,
        alignItems: IsUser ? 'flex-end' : 'flex-start',
        // backgroundColor: 'red',

      }}>
        <LinearGradient

          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          // colors={['white', 'white']}
          colors={item.TypeFile == 0 ? [
            item.UserID != idUser
              ? 'rgba(177,177,177,0.2)'
              : `rgba(18,92,199,0.7)`,
            item.UserID != idUser
              ? 'rgba(177,177,177,0.2)'
              : 'rgba(18,92,199,0.7)'
          ] : ['white', 'white']}
          style={{
            borderRadius: 10,
            minHeight: 40,
            paddingHorizontal: item.TypeFile == 0 ? 10 : 0,
            paddingVertical: item.TypeFile == 0 ? 5 : 0


          }}
        >
          <View style={{}}>
            <TouchableOpacity
              onLongPress={onPress}
              style={{
                // flexDirection: 'row',

              }}
            >
              {InFoGroup.IsGroup == true ?
                <Text
                  style={{
                    fontSize: reText(10),
                    color: colors.black_60,
                    textAlign: 'left',
                  }}
                >
                  {item.FullName}
                </Text>
                : null}
              {item.ComentParent ? (
                <View style={{ padding: 5, borderWidth: 0.5, borderRadius: 10 }}>
                  <ItemFW
                    item={item.ComentParent}
                    index={index}
                    idUser={idUser}
                    onLongPress={e => { }}
                    goscreen={(router, param) =>
                      Utils.goscreen({ props }, router, param)
                    }
                  ></ItemFW>

                </View>

              ) : null}
              {item.IconChat ? (
                <TouchableOpacity style={{ alignItems: 'center', }}>
                  <Image
                    source={{ uri: item.PathIcon }}
                    style={[{ width: 50, height: 50, borderRadius: 15 }]}
                  ></Image>
                </TouchableOpacity>
              ) : null}
              {
                item.TypeFile == 0 && item.IconChat == false ? <View style={{}}>
                  <Text
                    style={{
                      lineHeight: 20,
                      maxWidth: Width(65),
                      fontSize: reText(15),
                      paddingVertical: 5,
                      borderRadius: 5,
                      color: IsUser ? 'white' : 'black'
                    }}
                  >
                    {item.Comment}
                  </Text>

                </View> : null
              }

              {
                item.TypeFile == 1 ? <View style={{}}>
                  <TouchableOpacity
                    onLongPress={onPress}
                    onPress={() => {
                      if (isImage == true) {
                        let data = [{ url: item.PathFile }];
                        props.goscreen('Modal_ViewImage', { data: data });
                      } else {
                        let data = { uri: item.PathFile };
                        props.goscreen('Modal_ViewVideo', { source: data });
                      }
                    }}
                    style={{
                      borderWidth: 0.5,
                      borderColor: 'rgba(18,92,199,0.7)',
                      borderRadius: 10,
                      maxWidth: Width(60),
                      padding: 1,
                    }}
                  >
                    {isImage == true ? (
                      <>
                        <Image
                          resizeMode="cover"
                          source={{ uri: `${item.PathFile}` }}
                          style={[
                            {
                              width: reText(150),
                              height: reText(200),
                              borderRadius: 10,
                              // borderTopLeftRadius: item.UserID != idUser ? 0 : 10,
                              // borderBottomRightRadius: item.UserID == idUser ? 0 : 10
                            }
                          ]}
                        ></Image>
                      </>
                    ) : (
                      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <VideoCus
                          source={{ uri: item.PathFile }}
                          paused={true}
                          resizeMode={'cover'} // Store reference
                          style={{
                            width: reText(150),
                            height: reText(200),
                            borderRadius: 5,
                            borderBottomRightRadius: IsUser ? 0 : 10
                          }}
                          repeat={true}
                        />
                        <View style={{ position: 'absolute' }}>
                          <Image
                            source={ImagesChat.icPlayButton}
                            style={[
                              {
                                width: 15,
                                height: 15,
                                borderRadius: 5,
                                borderBottomRightRadius: IsUser ? 0 : 10
                              }
                            ]}
                          ></Image>
                        </View>
                      </View>
                    )}
                  </TouchableOpacity>
                </View> : null
              }
              {item.TypeFile == 2 ? (
                <TouchableOpacity
                  onLongPress={onLongPress}
                  style={{
                    // alignItems: 'center',
                    minHeight: 100,
                    backgroundColor:
                      item.UserID != idUser
                        ? 'rgba(177,177,177,0.2)'
                        : `rgba(18,92,199,0.7)`,
                    borderRadius: 10,
                    borderBottomRightRadius: IsUser ? 0 : 10,
                    borderTopLeftRadius: item.UserID != idUser ? 0 : 10,
                    paddingHorizontal: 20,
                    justifyContent: 'space-between',
                    paddingVertical: 10,
                    maxWidth: Width(60)
                  }}
                >
                  <View style={{ paddingHorizontal: 5 }}>
                    <Text
                      style={{
                        color: item.UserID != idUser ? colors.black : colors.white,
                        fontWeight: 'bold',
                        fontSize: reText(16)
                      }}
                    >
                      {item.TenFile}
                    </Text>
                  </View>
                  <View
                    style={{
                      paddingHorizontal: 5,
                      flexDirection: 'row',
                      paddingVertical: 10
                    }}
                  >
                    <Image
                      source={ImagesChat.icFile}
                      style={[
                        {
                          width: 20,
                          height: 20,
                          tintColor:
                            item.UserID != idUser ? colors.black : colors.white
                        }
                      ]}
                    ></Image>
                    <Text
                      style={{
                        color: item.UserID != idUser ? colors.black : colors.white,
                        fontWeight: 'bold',
                        fontSize: reText(14),
                        paddingHorizontal: 10
                      }}
                    >
                      {'File'}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      Linking.openURL(item.PathFile);
                    }}
                    style={{
                      paddingVertical: 10,
                      alignItems: 'center',
                      borderColor: colors.white,
                      borderRadius: 10,
                      borderTopWidth: 1
                    }}
                  >
                    <Text
                      style={{
                        color: item.UserID != idUser ? colors.black : colors.white,
                        fontWeight: 'bold',
                        fontSize: reText(15)
                      }}
                    >
                      {'Xem'}
                    </Text>
                  </TouchableOpacity>
                </TouchableOpacity>

              ) : null}

            </TouchableOpacity>
          </View>


          {
            (index == 0 || checkNext == true) && item.TypeFile == 0 ? <Text
              style={{
                color: IsUser ? 'white' : colors.black_80,
                textAlign: IsUser ? 'right' : 'left', fontSize: reText(10),
                // paddingHorizontal: item.TypeFile != 0 ? 10 : 0,
              }}
            >
              {moment(item.CreatedDate).format('HH:mm')}
            </Text> : null
          }

        </LinearGradient>
        {item.IdChat == item.SendKey ? (
          <Text
            style={{
              color: colors.redStar,
              fontSize: reText(10),
              fontStyle: 'italic'
            }}
          >
            {'Gửi thất bại...Thử lại'}
          </Text>
        ) : null}
        {item.IdChat == 0 ?
          <Text
            style={{
              color: colors.redStar,
              fontSize: reText(10),
              fontStyle: 'italic'
            }}
          >
            {'  Đang gửi...'}
          </Text>
          : null}

      </View>

    </View >

  }


}, propsAreEqual);
// propsAreEqual

export default ItemChat;
