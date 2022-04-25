import React, { Component, useState } from 'react';
import {
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  FlatList,
  Platform
} from 'react-native';
import Utils from '../../app/Utils';
import { colors } from '../styles';
import { ImagesChat } from '../Images';
import apiChat from '../api/apis';
import { Height } from '../../styles/styles';
import DocumentPicker from 'react-native-document-picker';
import { nstyles } from '../styles/styles';

const enums = {
  editHide: 0,
  delete: 1,
  deleteAll: 2
};
const data = [
  {
    id: 1,
    name: 'Hình ảnh',
    isAll: false,
    isIOS: true,
    key: [DocumentPicker.types.images],
    // subtitle: 'Chọn "Hình ảnh" bạn muốn chia sẻ.',
    icon: ImagesChat.icChooseImage2
  },
  {
    id: 2,
    name: 'Video',
    isAll: true,
    isIOS: true,
    key: [DocumentPicker.types.video],
    // subtitle: 'Chọn "Video" bạn muốn chia sẻ.',
    icon: ImagesChat.icVideoCm
  },
  // {
  //   id: 3,
  //   name: 'Tệp PDF',
  //   isAll: true,
  //   isIOS: false,
  //   key: [DocumentPicker.types.pdf],
  //   subtitle: 'Chia sẻ tệp PDF',
  //   icon: ImagesChat.icPdf
  // },
  {
    id: 4,
    key: [DocumentPicker.types.audio],
    name: 'Audio',
    isAll: true,
    isIOS: false,
    subtitle: 'Chia sẻ Audio',
    icon: ImagesChat.icAudio
  },
  {
    id: 5,
    isAll: true,
    key: [DocumentPicker.types.allFiles],
    name: 'Tệp hoặc tập tin',
    isIOS: true,
    // subtitle: 'Chọn "Tệp, tập tin" bạn muốn chia sẻ.',
    icon: ImagesChat.icFile
  }
];

const ModalFileChat = props => {
  const optionIos = (data, item) => {
    Utils.goback({ props });
    Utils.goscreen({ props }, 'StackImageShow', {
      data: data,
      key: item,
      SendFile: Utils.ngetParam({ props }, 'SendFile', () => { })
    });
  };
  const _openFile = async item => {
    if (item.id < 3 && Platform.OS == 'ios') {
      Utils.goback({ props });
      Utils.goscreen({ props }, 'Modal_MediaPickerChat', {
        assetType: item.id == 1 ? 'Photos' : 'Videos',
        response: data => optionIos(data, item)
      });
      return;
    }
    if (item.isAll == true || item.key == [DocumentPicker.types.video]) {
      try {
        const res = await DocumentPicker.pick({
          type: item.key
        });
        switch (item.id) {
          case 2: {
            Utils.goback({ props });
            Utils.goscreen({ props }, 'modal_playVideo', {
              source: res,
              key: item,
              SendFile: Utils.ngetParam({ props }, 'SendFile', () => { })
            });
          }
          case 4:
            {
              Utils.goback({ props });
              Utils.goscreen({ props }, 'modal_playVideo', {
                source: res,
                key: item,
                item: item.key,
                SendFile: Utils.ngetParam({ props }, 'SendFile', () => { })
              });
            }
            break;
          case 3:
            {
              Utils.goback({ props });
              Utils.goscreen({ props }, 'Modal_PDFExample', {
                source: res,
                key: item.key,
                item: item,
                SendFile: Utils.ngetParam({ props }, 'SendFile', () => { })
              });
            }
            break;

          default: {
            let type = res.type.split('/');
            switch (type[0]) {
              case 'video':
                {
                  Utils.goback({ props });
                  Utils.goscreen({ props }, 'modal_playVideo', {
                    source: res,
                    key: item.key,
                    SendFile: Utils.ngetParam({ props }, 'SendFile', () => { })
                  });
                }
                break;
              case 'image':
                {
                  Utils.goback({ props });
                  Utils.goscreen({ props }, 'StackImageShow', {
                    data: [{ ...res, url: res.uri }],
                    key: item,
                    SendFile: Utils.ngetParam({ props }, 'SendFile', () => { })
                  });
                }
                break;
              case 'audio':
                {
                  Utils.goback({ props });
                  Utils.goscreen({ props }, 'modal_playVideo', {
                    source: res,
                    key: item.key,
                    SendFile: Utils.ngetParam({ props }, 'SendFile', () => { })
                  });
                }
                break;
              default: {
                Utils.goback({ props });
                Utils.goscreen({ props }, 'Modal_stackFile', {
                  key: item.key,
                  item: res,
                  SendFile: Utils.ngetParam({ props }, 'SendFile', () => { })
                });
              }
            }
          }
        }
      } catch (err) {
        if (DocumentPicker.isCancel(err)) {
        } else {
          throw err;
        }
      }
    } else {
      var arrImage = [],
        arrApplication = [];
      try {
        let results = await DocumentPicker.pickMultiple({
          type: item.key
        });

        results = results.map(item => {
          return { ...item, url: item.uri };
        });
        switch (item.id) {
          case 1:
            {
              Utils.goback({ props });
              Utils.goscreen({ props }, 'StackImageShow', {
                data: results,
                key: item
              });
            }
            break;
          default: {
          }
        }
      } catch (err) {
        if (DocumentPicker.isCancel(err)) {
        } else {
          throw err;
        }
      }
    }
  };
  const renderItem = ({ item, index }) => {
    if (Platform.OS == 'ios' && item.isIOS == false) {
      return null;
    }
    return (
      <View key={index} style={{ paddingHorizontal: 15, }}>
        <TouchableOpacity
          onPress={() => _openFile(item)}
          style={{
            paddingVertical: 15,
            // paddingHorizontal: 10,
            flexDirection: 'row',
          }}
        >
          <View
            style={{
              // width: 50,
              // height: 50,
              borderRadius: 40,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Image
              source={item.icon}
              resizeMode={'contain'}
              style={[nstyles.nIcon30,
              {
                // width: 26,
                // height: 26,
                // tintColor: colors.white
              }
              ]}
            ></Image>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: 'white',
              justifyContent: 'center',
              paddingHorizontal: 10
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
              {item.name}
            </Text>
            {/* <Text
              style={{
                fontSize: 12,
                color: 'gray',
                fontStyle: 'italic',
                marginTop: 5
              }}
            >
              {item.subtitle}
            </Text> */}
          </View>
        </TouchableOpacity>

        <View
          style={{
            height: 0.5,
            width: '100%',
            backgroundColor: data.length - 1 == index ? colors.white : colors.grayLight,
            alignSelf: 'center'
          }}
        ></View>
      </View>
    );
  };
  const _keyExtrac = (item, index) => index.toString();

  const _ItemSeparatorComponent = () => {
    return (
      <View
        style={{
          height: 1,
          backgroundColor: colors.black_20,
          alignSelf: 'center',
          width: '90%'
        }}
      />
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.backgroundModal,
        justifyContent: 'flex-end'
      }}
    >
      <View
        onTouchEnd={() => Utils.goback({ props })}
        style={{
          position: 'absolute',
          backgroundColor: 'transparent',
          top: 100,
          right: 0,
          left: 0,
          bottom: 0
        }}
      ></View>
      <View
        style={{
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          backgroundColor: 'white',
          paddingBottom: 20,
          elevation: 6,
          shadowOffset: {
            width: 0,
            height: 3
          },
          shadowRadius: 6,
          shadowOpacity: 0.2,
          shadowColor: colors.black_50
        }}
      >
        <FlatList
          style={{ maxHeight: Height(70), }}// borderStyle: 'dashed', borderColor: colors.colorBlueLight, borderWidth: 3 }}
          scrollEventThrottle={10}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          data={data}
          extraData={data}
          keyExtractor={_keyExtrac}
        />
        <TouchableOpacity
          onPress={() => Utils.goback({ props })}
          style={{ position: 'absolute', top: 0, right: 0, width: 50, height: 50, justifyContent: 'center', alignItems: 'center' }}
        >
          <Image
            source={ImagesChat.icCloseBlack}
            resizeMode={'cover'}
            style={[
              {
                width: 20,
                height: 20
              }
            ]}
          ></Image>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default ModalFileChat;
