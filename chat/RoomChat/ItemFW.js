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
  Linking
} from 'react-native';
import Utils from '../../app/Utils';
import { colors } from '../styles';
import { Images } from '../../srcAdmin/images';
import { Width, nstyles } from '../../styles/styles';
import { ImagesChat } from '../Images';
import Video from 'react-native-video';

import { reText } from '../../styles/size';
import LinearGradient from 'react-native-linear-gradient';

function propsAreEqual(prev, next) {
  // Utils.nlog('eqqual----------', prev, next);
  return prev.item.IdChat == next.item.IdChat && next.item.IdChat > 0;
}

const ItemFW = memo(props => {
  const { item, index, idUser, onLongPress } = props;

  let isImage = true;
  if (Utils.checkIsImage(item.PathFile)) {
  } else {
    isImage = false;
  }
  if (item.isDelete == true) {
    return null;
  }
  switch (item.TypeFile) {
    case '':
      return (
        <View
          style={{
            alignItems: item.UserID == idUser ? 'flex-end' : 'flex-start',
            minHeight: 40,

            backgroundColor: 'red'
          }}
        >
          <TouchableOpacity
            onPress={onLongPress}
            style={{
              backgroundColor:
                item.UserID == idUser
                  ? colors.colorHeaderApp
                  : 'rgba(177,177,177,0.2)',
              borderRadius: 15,
              padding: 5
            }}
          ></TouchableOpacity>
        </View>
      );
      break;

    case 0:
      return (
        <View
          style={{
            alignItems: item.UserID == idUser ? 'flex-end' : 'flex-start',
            minHeight: 40
          }}
        >
          <TouchableOpacity
            onPress={onLongPress}
            style={{
              flexDirection: 'row'
            }}
          >
            {item.UserID == idUser ? null : (
              <Image
                source={{ uri: `${item.avata}` }}
                style={[{ width: 30, height: 30, borderRadius: 15 }]}
              ></Image>
            )}
            <LinearGradient
              onLayout={e => {
                // Utils.nlog('giá tị e------', e);
              }}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              colors={[
                item.UserID != idUser
                  ? 'rgba(177,177,177,0.2)'
                  : `rgba(18,92,199,0.7)`,
                item.UserID != idUser
                  ? 'rgba(177,177,177,0.2)'
                  : 'rgba(18,92,199,0.7)'
              ]}
              style={{
                borderRadius: 10,
                padding: 5,
                marginLeft: 5,
                borderBottomRightRadius: item.UserID == idUser ? 0 : 10,
                borderTopLeftRadius: item.UserID != idUser ? 0 : 10
              }}
            >
              {item.ComentParent ? (
                <ItemFW
                  item={item.ComentParent}
                  index={index}
                  idUser={idUser}
                  onLongPress={e => { }}
                  goscreen={(router, param) =>
                    Utils.goscreen({ props }, router, param)
                  }
                ></ItemFW>
              ) : null}
              {item.TypeFile == 0 && item.IconChat ? (
                <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                >
                  <Image
                    source={{ uri: item.PathIcon }}
                    style={[{ width: 50, height: 50, borderRadius: 15 }]}
                  ></Image>
                  <View style={{ paddingHorizontal: 5 }}>
                    <Text>{item.TenFile}</Text>
                  </View>
                </TouchableOpacity>
              ) : (
                  <Text
                    style={{
                      lineHeight: 20,
                      fontSize: 16,
                      paddingVertical: 5,
                      borderRadius: 5,
                      paddingHorizontal: 10,
                      color: item.UserID == idUser ? 'white' : 'black'
                    }}
                  >
                    {item.Comment}
                  </Text>
                )}
            </LinearGradient>
          </TouchableOpacity>
          {item.IdChat == 0 ? (
            <Image
              source={ImagesChat.icUnCheck}
              style={[
                {
                  width: 10,
                  height: 10,
                  borderRadius: 15,
                  tintColor: colors.redStar
                }
              ]}
            ></Image>
          ) : null}
        </View>
      );
      break;

    case 1:
      return (
        <View
          style={{
            alignItems: item.UserID == idUser ? 'flex-end' : 'flex-start',
            minHeight: 40,
            width: '100%'
          }}
        >
          <TouchableOpacity
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
              borderBottomRightRadius: item.UserID == idUser ? 0 : 10
            }}
          >
            {isImage == true ? (
              <Image
                resizeMode="contain"
                source={{ uri: `${item.PathFile}` }}
                style={[
                  {
                    width: reText(150),
                    height: reText(200),
                    borderRadius: 5,
                    borderBottomRightRadius: item.UserID == idUser ? 0 : 10
                  }
                ]}
              ></Image>
            ) : (
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <Video
                    source={{ uri: item.PathFile }}
                    paused={true}
                    resizeMode={'contain'} // Store reference
                    style={{
                      width: reText(150),
                      height: reText(200),
                      borderRadius: 5,
                      borderBottomRightRadius: item.UserID == idUser ? 0 : 10
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
                          borderRadius: 5,
                          borderBottomRightRadius: item.UserID == idUser ? 0 : 10
                        }
                      ]}
                    ></Image>
                  </View>
                </View>
              )}
          </TouchableOpacity>
        </View>
      );
      break;
    case 2:
      return (
        <View
          style={{
            alignItems: item.UserID == idUser ? 'flex-end' : 'flex-start',
            minHeight: 100
          }}
        >
          {item.TypeFile == 2 ? (
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(item.PathFile);
              }}
              style={{
                // alignItems: 'center',
                minHeight: 100,
                backgroundColor:
                  item.UserID != idUser
                    ? 'rgba(177,177,177,0.2)'
                    : `rgba(18,92,199,0.7)`,
                borderRadius: 10,
                borderBottomRightRadius: item.UserID == idUser ? 0 : 10,
                borderTopLeftRadius: item.UserID != idUser ? 0 : 10,
                paddingHorizontal: 20,
                justifyContent: 'space-between',
                paddingVertical: 10
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
              <View
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
              </View>
            </TouchableOpacity>
          ) : null}
        </View>
      );
      break;

    default:
      break;
  }
  // return (
  //   <View
  //     style={{
  //       alignItems: item.UserID == idUser ? 'flex-end' : 'flex-start'
  //     }}
  //   >
  //     {Utils.nlog('giá trị item----render', index)}
  //     <TouchableOpacity
  //       onPress={onLongPress}
  //       style={{
  //         backgroundColor:
  //           item.UserID == idUser
  //             ? colors.colorHeaderApp
  //             : 'rgba(177,177,177,0.2)',
  //         borderRadius: 15,
  //         padding: 5
  //       }}
  //     >
  //       {item.IdChatReplay == 0 ? null : (
  //         <View
  //           style={{
  //             paddingHorizontal: 10,
  //             borderWidth: 0.5,
  //             borderStyle: 'dashed',
  //             borderRadius: 10
  //             // backgroundColor: 'white'
  //           }}
  //         >
  //           {item.ComentParent ? (
  //             <ItemFW
  //               item={item.ComentParent}
  //               index={index}
  //               idUser={idUser}
  //               onLongPress={e => {}}
  //               goscreen={(router, param) =>
  //                 Utils.goscreen({ props }, router, param)
  //               }
  //             ></ItemFW>
  //           ) : null}
  //         </View>
  //       )}

  //       <View
  //         key={index.toString()}
  //         style={{
  //           flexDirection: item.UserID == idUser ? 'row-reverse' : 'row'
  //         }}
  //       >
  //         {item.UserID == idUser ? null : (
  //           <Image
  //             source={{ uri: `${item.avata}` }}
  //             style={[{ width: 30, height: 30, borderRadius: 15 }]}
  //           ></Image>
  //         )}
  //         <View
  //           style={{
  //             backgroundColor: colors.nocolor,
  //             maxWidth: Width(70),
  //             paddingHorizontal: 5,
  //             alignSelf: item.UserID == idUser ? 'flex-end' : 'flex-start',
  //             justifyContent: item.UserID == idUser ? 'flex-end' : 'flex-start'
  //           }}
  //         >
  //           {item.TypeFile == 0 && item.IconChat ? (
  //             <TouchableOpacity
  //               style={{ flexDirection: 'row', alignItems: 'center' }}
  //             >
  //               <Image
  //                 source={{ uri: item.PathIcon }}
  //                 style={[{ width: 50, height: 50, borderRadius: 15 }]}
  //               ></Image>
  //               <View style={{ paddingHorizontal: 5 }}>
  //                 <Text>{item.TenFile}</Text>
  //               </View>
  //             </TouchableOpacity>
  //           ) : null}
  //           {item.TypeFile == 1 ? (
  //             <TouchableOpacity
  //               onPress={() => {
  //                 if (isImage == true) {
  //                   let data = [{ url: item.PathFile }];
  //                   props.goscreen('Modal_ViewImage', { data: data });
  //                 } else {
  //                   let data = { uri: item.PathFile };
  //                   props.goscreen('Modal_ViewVideo', { source: data });
  //                 }
  //               }}
  //             >
  //               {isImage == true ? (
  //                 <Image
  //                   source={{ uri: `${item.PathFile}` }}
  //                   style={[{ width: 150, height: 150, borderRadius: 5 }]}
  //                 ></Image>
  //               ) : (
  //                 <View
  //                   style={{ alignItems: 'center', justifyContent: 'center' }}
  //                 >
  //                   <Video
  //                     source={{ uri: item.PathFile }}
  //                     paused={true}
  //                     resizeMode={'cover'} // Store reference
  //                     style={{ width: 150, height: 150, borderRadius: 5 }}
  //                     repeat={true}
  //                     // onError={this.videoError}               // Callback when video cannot be loaded
  //                   />
  //                   <View style={{ position: 'absolute' }}>
  //                     <Image
  //                       source={ImagesChat.icPlayButton}
  //                       style={[
  //                         {
  //                           width: 15,
  //                           height: 15,
  //                           borderRadius: 5
  //                         }
  //                       ]}
  //                     ></Image>
  //                   </View>
  //                 </View>
  //               )}
  //             </TouchableOpacity>
  //           ) : null}
  //           {item.TypeFile == 2 ? (
  //             <TouchableOpacity
  //               onPress={() => {
  //                 Linking.openURL(item.PathFile);
  //               }}
  //               style={{ flexDirection: 'row', alignItems: 'center' }}
  //             >
  //               <Image
  //                 source={ImagesChat.icDinhkem}
  //                 style={[{ width: 20, height: 20, borderRadius: 15 }]}
  //               ></Image>
  //               <View style={{ paddingHorizontal: 5 }}>
  //                 <Text>{item.TenFile}</Text>
  //               </View>
  //             </TouchableOpacity>
  //           ) : null}
  //           {item.TypeFile == '' && !item.IconChat ? (
  //             <Text
  //               style={{
  //                 lineHeight: 20,
  //                 fontSize: 16,
  //                 paddingVertical: 5,
  //                 borderRadius: 5,
  //                 paddingHorizontal: 10,
  //                 color: item.UserID == idUser ? 'white' : 'black'
  //               }}
  //             >
  //               {item.Comment}
  //             </Text>
  //           ) : null}
  //         </View>
  //       </View>
  //     </TouchableOpacity>
  //     {item.IdChat == 0 ? (
  //       <Image
  //         source={Images.icUnCheck}
  //         style={[
  //           {
  //             width: 10,
  //             height: 10,
  //             borderRadius: 15,
  //             tintColor: colors.redStar
  //           }
  //         ]}
  //       ></Image>
  //     ) : null}
  //   </View>
  // );
}, propsAreEqual);

export default ItemFW;
