import React, { Component, useState, useRef, useMemo } from 'react';
import {
  View,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions
} from 'react-native';
import { nstyles, sizes, colors } from '../styles';

import { IsLoading } from '../../components';
import Utils from '../../app/Utils';
import { ImagesChat } from '../Images';
import ImageZoom from './ImageZoom';
const COLOR_ICON = '#41ADF0';

const stackFile = props => {
  const [dataFile, setDataFile] = useState(
    Utils.ngetParam({ props }, 'item', {})
  );
  const _sendFile = async () => {
    // Utils.nlog('gia tri data send ', dataFile);
    props.SendFileOfGroup([{ ...dataFile }]);



    Utils.goback({ props: props });
  };
  //   Utils.nlog('gia tri data file', dataFile);
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
            width: 1,
            height: 1
          },
          shadowRadius: 2,
          shadowOpacity: 1,
          shadowColor: colors.black_50
        }}
      >
        <View
          style={{ minHeight: 120, width: '100%', backgroundColor: 'white' }}
        >
          <TouchableOpacity
            // onPress={() => _openFile(item)}
            style={{
              paddingVertical: 15,
              paddingHorizontal: 10,
              flexDirection: 'row'
            }}
          >
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 5,
                backgroundColor: colors.BackgroundHome,
                alignItems: 'center',
                justifyContent: 'center'
                // borderWidth: 0.5,
              }}
            >
              <Image
                source={ImagesChat.icFolder}
                resizeMode={'contain'}
                style={[
                  {
                    width: 40,
                    height: 40
                    // tintColor: colors.black_60
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
              <Text>{dataFile.name}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={_sendFile}
            style={{
              position: 'absolute',
              bottom: 20,
              right: 20,
              width: 50,
              height: 50,
              backgroundColor: colors.colorHeaderApp,
              borderRadius: 30,
              alignItems: 'center',
              justifyContent: 'center',
              elevation: 12,
              shadowOffset: {
                width: 1,
                height: 1
              },
              shadowRadius: 2,
              shadowOpacity: 1,
              shadowColor: colors.black_50
            }}
          >

            <Text style={{ color: colors.white, fontWeight: 'bold' }}>
              {'Gửi'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const mapStateToProps = state => ({
  dataInFo: state.ReducerGroupChat.InFoGroup,
  // SetMessage: state.SetMessage,
});
export default Utils.connectRedux(stackFile, mapStateToProps, true);
