import React, { Component, useState, useEffect, useMemo } from 'react';
import {
  Text,
  View,
  SafeAreaView,
  Image,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
  Animated,
  FlatList,
  ScrollView,
  TextInput
} from 'react-native';
import Utils from '../../app/Utils';
import { colors } from '../styles';
import { ImagesChat } from '../Images';

import { IsLoading } from '../../components';
const enums = {
  editHide: 0,
  delete: 1,
  deleteAll: 2
};
const ModalinPut = props => {
  const [itemEdit, setItemEdit] = useState(
    Utils.ngetParam({ props }, 'item', {})
  );
  const [titleInput, settitleInput] = useState(
    Utils.ngetParam({ props }, 'title', 'Nhập text')
  );
  const [defaultValue, setdefaultValue] = useState(
    Utils.ngetParam({ props }, 'defaultValue', 'Nhập text')
  );
  const Action = Utils.ngetParam({ props }, 'Action', () => { });
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'flex-end'
      }}
    >
      <View
        onTouchEnd={() => {
          Utils.goback({ props });
        }}
        style={{
          backgroundColor: colors.backgroundModal,
          flex: 1,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
      >
        <View
          style={{
            padding: 10,
            backgroundColor: 'white',
            width: '100%',
            borderRadius: 20,
            paddingBottom: 40
          }}
        >
          <View style={{ paddingVertical: 20 }}>
            <Text style={{ fontSize: 14, color: colors.black_60 }}>
              {titleInput}
            </Text>
          </View>
          <TextInput
            autoFocus={true}
            style={{
              width: '100%',
              backgroundColor: 'white',
              padding: 20,
              borderWidth: 0.5,
              borderRadius: 10
            }}
            value={defaultValue}
            onChangeText={val => setdefaultValue(val)}
          ></TextInput>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
              paddingVertical: 10
            }}
          >
            <TouchableOpacity
              onPress={() => Utils.goback({ props })}
              style={{
                padding: 10,
                backgroundColor: colors.colorGrayBgr,
                borderRadius: 5
              }}
            >
              <Text>{'Thoát'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Utils.goback({ props });
                Action(defaultValue);
              }}
              style={{
                padding: 10,
                backgroundColor: colors.colorBlue,
                borderRadius: 5
              }}
            >
              <Text style={{ color: colors.white }}>{'Thực hiện'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
      <IsLoading />
    </View>
  );
};

export default ModalinPut;
