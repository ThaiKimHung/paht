import React, { Component, useState } from 'react';
import {
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Dimensions
} from 'react-native';
import Utils, { icon_typeToast } from '../../app/Utils';
import { colors } from '../../styles';
import { ImagesChat } from '../Images';
import apiChat from '../api/apis';
import { sizes } from '../../styles/size';
import { nstyles, nwidth } from '../../styles/styles';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { nGlobalKeys } from '../../app/keys/globalKey';
import ConnectSocket from './Connecttion';
import AppCodeConfig from '../../app/AppCodeConfig';
const enums = {
  editHide: 0,
  delete: 1,
  deleteAll: 2
};
const ModalAction = props => {
  const [loginToken, setLoginToken] = useState(Utils.getGlobal(nGlobalKeys.loginToken, '', AppCodeConfig.APP_ADMIN));
  const [itemEdit, setItemEdit] = useState(Utils.ngetParam({ props }, 'item', {}));
  const IsTimeOut = Utils.ngetParam({ props }, 'TimeOut', false)
  const ActionForward = Utils.ngetParam({ props }, 'ActionForward', () => { });
  const setMessageForwar = Utils.ngetParam({ props }, 'setMessageForwar', () => { });
  const ChatForward = () => {
    setMessageForwar(itemEdit);
    Utils.goback({ props });
  };

  const _Chat_UpdateStatusMessInGroup = async status => {
    Utils.showMsgBoxYesNo(
      { props },
      'Thông báo',
      `Bạn có muốn ${enums.delete ? 'ẩn' : 'xoá'} tin nhắn này không?`,
      ` ${enums.delete ? 'Ẩn' : 'Xoá'}`,
      'Xem lại',
      async () => {
        let res = await apiChat.Chat_UpdateStatusMessInGroup(
          itemEdit.IdGroup,
          itemEdit.IdChat,
          status
        );
        if (res.status == 1) {
          Utils.showToastMsg("Thông báo chat", "Thực hiện thành công", icon_typeToast.success);
          if (status != enums.delete) {
            ActionForward(
              itemEdit.IdChat,
              status == enums.deleteAll,
              status == enums.editHide
            );
          } else {
            //new
            props.RemoveMessageByIDOfGroup(itemEdit);

          }
          Utils.goback({ props });
        } else {
          Utils.showMsgBoxOK(
            { props },
            'Thông báo',
            res.error ? res.error.message : 'Thực hiện thất bại',
            'Xác nhận'
          );
        }
      }
    );
  };
  const onPressSend = () => {
    let SendKey = new Date().getTime();
    try {

      let chatinfo = {
        ...itemEdit,
        IdChat: 0,
        SendKey: `${loginToken}.${SendKey}`
      };
      //new
      props.RemoveMessageBySenKeyOfGroup(itemEdit);
      //new
      props.AddMessageOfGroup({ SendKey: `${loginToken}.${SendKey}`, ...chatinfo });
      ConnectSocket.onPressSendSocket(chatinfo);
      Utils.goback({ props });
    } catch (error) { }
  };
  const DeleteMessage = () => {
    try {

      props.RemoveMessageBySenKeyOfGroup(itemEdit);
      Utils.goback({ props });
    } catch (error) { }
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <View
        onTouchEnd={() => Utils.goback({ props })}
        style={{
          position: 'absolute',
          backgroundColor: colors.backgroundModal,
          top: nwidth() / 5 - 5,
          right: 0,
          left: 0,
          bottom: 0
        }}
      ></View>
      <SafeAreaView
        style={{
          zIndex: 1000,
          minWidth: '80%',

          alignContent: 'center',
          justifyContent: 'center',
          backgroundColor: colors.backgroundModal,
          elevation: 6,
          shadowOffset: {
            width: 1,
            height: 1
          },
          shadowRadius: 2,
          shadowOpacity: 1,
          borderRadius: 15,
          backgroundColor: colors.white,
          shadowColor: colors.black_50
        }}
      >
        {
          IsTimeOut ? <TouchableOpacity
            onPress={DeleteMessage}
            style={[
              styles.button,
              { borderTopWidth: itemEdit.isUserSend == false ? 1 : 0 }
            ]}
          >
            <Image
              source={ImagesChat.icrm}
              resizeMode={'contain'}
              style={[
                isIphoneX() || Platform.OS == 'android'
                  ? nstyles.nIcon20
                  : nstyles.nIcon18,
                { marginRight: 5, tintColor: colors.peacockBlue }
              ]}
            ></Image>
            <Text style={styles.text}>{'Xoá tin nhắn'}</Text>
          </TouchableOpacity> : <TouchableOpacity
            onPress={() => _Chat_UpdateStatusMessInGroup(enums.delete)}
            style={[
              styles.button,
              { borderTopWidth: itemEdit.isUserSend == false ? 1 : 0 }
            ]}
          >
              <Image
                source={ImagesChat.icrm}
                resizeMode={'contain'}
                style={[
                  isIphoneX() || Platform.OS == 'android'
                    ? nstyles.nIcon20
                    : nstyles.nIcon18,
                  { marginRight: 5, tintColor: colors.peacockBlue }
                ]}
              ></Image>
              <Text style={styles.text}>{'Ẩn tin nhắn ở phía bạn'}</Text>
            </TouchableOpacity>
        }


        {itemEdit.isUserSend == true && !IsTimeOut ? (
          <TouchableOpacity
            onPress={() => _Chat_UpdateStatusMessInGroup(enums.deleteAll)}
            style={styles.button}
          >
            <Image
              source={ImagesChat.icDeleteMember}
              resizeMode={'contain'}
              style={[
                isIphoneX() || Platform.OS == 'android'
                  ? nstyles.nIcon20
                  : nstyles.nIcon18,
                { marginRight: 5, tintColor: colors.peacockBlue }
              ]}
            ></Image>
            <Text style={styles.text}>{'Thu hồi'}</Text>
          </TouchableOpacity>
        ) : null}
        {
          IsTimeOut ? <TouchableOpacity onPress={onPressSend} style={styles.button}>
            <Image
              source={ImagesChat.icForward}
              resizeMode={'contain'}
              style={[
                nstyles.nIcon20,
                { tintColor: colors.peacockBlue, marginRight: 5 }
              ]}
            ></Image>
            <Text style={styles.text}>{'Gửi lại'}</Text>
          </TouchableOpacity> : <TouchableOpacity onPress={ChatForward} style={styles.button}>
              <Image
                source={ImagesChat.icForward}
                resizeMode={'contain'}
                style={[
                  nstyles.nIcon20,
                  { tintColor: colors.peacockBlue, marginRight: 5 }
                ]}
              ></Image>
              <Text style={styles.text}>{'Phản hồi'}</Text>
            </TouchableOpacity>
        }
        {
          !IsTimeOut ? <TouchableOpacity onPress={() => Utils.goscreen({ props }, 'Modal_ChuyenTiepTin', { item: itemEdit })} style={styles.button}>
            <Image
              source={ImagesChat.icChuyenTiep}
              resizeMode={'contain'}
              style={[
                nstyles.nIcon20,
                { tintColor: colors.peacockBlue, marginRight: 5 }
              ]}
            ></Image>
            <Text style={styles.text}>{'Chuyển tiếp'}</Text>
          </TouchableOpacity> : null
        }


        <TouchableOpacity
          onPress={() => Utils.goback({ props })}
          style={styles.button}
        >
          <Image
            source={ImagesChat.icCloseImg}
            resizeMode={'contain'}
            style={[
              nstyles.nIcon13,
              { tintColor: colors.peacockBlue, marginRight: 5 }
            ]}
          ></Image>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: sizes.sText14,
              color: colors.colorHeaderApp
            }}
          >
            {'Đóng'}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};
const mapStateToProps = state => ({
  dataInFo: state.ReducerGroupChat.InFoGroup,
});
const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderColor: colors.black_11
  },
  text: {
    fontSize: sizes.sText14,
    color: colors.colorHeaderApp,
    fontWeight: '400'
  }
});
export default Utils.connectRedux(ModalAction, mapStateToProps, true);
