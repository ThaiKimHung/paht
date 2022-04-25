import React, { Component, useState, useEffect } from 'react';
import {
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  FlatList,
  Platform,
  Dimensions
} from 'react-native';
import Utils from '../../app/Utils';
import { colors } from '../styles';

import { Height } from '../styles/styles';
import DocumentPicker from 'react-native-document-picker';
import SwiperFlatList from 'react-native-swiper-flatlist';
import { ImagesChat } from '../Images';
import { nheight, nwidth } from '../../styles/styles';

const enums = {
  editHide: 0,
  delete: 1,
  deleteAll: 2
};

const ModalIconChat = props => {
  const onPressSendIcon = Utils.ngetParam(
    { props },
    'onPressSendIcon',
    () => { }
  );
  const numline = Math.floor(nwidth() / 80);
  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          Utils.goback({ props });
          onPressSendIcon(item);
        }}
        style={{
          flex: 1,
          paddingVertical: 5,
          flexDirection: 'row',
          backgroundColor: colors.white,
          alignItems: 'center',
          justifyContent: 'center',
          margin: 10
        }}
      >
        <Image
          source={{ uri: item.PathIcon }}
          resizeMode={'cover'}
          style={[
            {
              width: 40,
              height: 40
            }
          ]}
        ></Image>
      </TouchableOpacity>
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
        backgroundColor: 'transparent',
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
          shadowColor: colors.black_50,
          minHeight: Height(40)
        }}
      >
        <SwiperFlatList
        // onChangeIndex={_onchangeImage}
        // ref={SWIPER}
        // autoplay
        // autoplayDelay={2}
        // autoplayLoop
        // index={2}
        // showPagination
        >
          {props.dataArr.data.map((item, index) => {
            return (
              <View
                key={index}
                style={[
                  { backgroundColor: 'white', width: nwidth(), height: nheight() / 2 }
                ]}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      padding: 5,
                      fontWeight: 'bold',
                      color: colors.colorHeaderApp,
                      marginLeft: 15
                    }}
                  >
                    {item.Name}
                  </Text>
                  <TouchableOpacity
                    onPress={() => Utils.goback({ props })}
                    style={{ padding: 10 }}
                  >
                    <Image
                      source={ImagesChat.icCloseBlack}
                      resizeMode={'cover'}
                      style={[
                        {
                          width: 24,
                          height: 24
                        }
                      ]}
                    ></Image>
                  </TouchableOpacity>
                </View>
                <FlatList
                  numColumns={numline}
                  style={{ flex: 1, backgroundColor: colors.white }}
                  scrollEventThrottle={10}
                  showsVerticalScrollIndicator={false}
                  renderItem={renderItem}
                  data={item.ChatIcons}
                  extraData={item.ChatIcons}
                  keyExtractor={_keyExtrac}
                />
              </View>
            );
          })}
        </SwiperFlatList>
      </View>
    </View>
  );
};
const mapStateToProps = state => ({
  dataArr: state.GetIconChat
});
export default Utils.connectRedux(ModalIconChat, mapStateToProps, true);
