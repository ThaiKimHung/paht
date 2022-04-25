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
import Utils, { icon_typeToast } from '../../app/Utils';
import { colors, sizes } from '../styles';
import { ImagesChat } from '../Images';
import apiChat from '../api/apis';
import { IsLoading } from '../../components';


const ModalEditMember = props => {
  const [itemEdit, setItemEdit] = useState(Utils.ngetParam({ props }, 'item', {}));
  Utils.nlog("gias trij item deit-------", itemEdit)
  const [data, setdata] = useState([]);

  useEffect(() => {
    setdata([
      {
        id: 1,
        isGroup: true,
        text: 'Đổi tên nhóm',
        icon: ImagesChat.icEditChat,
        isShowAll: false,
        isAdmin: false
      },
      {
        id: 2,
        isGroup: true,
        text: 'Xoá nhóm',
        icon: ImagesChat.icEditChat,
        isShowAll: false,
        isAdmin: false
      },
      {
        id: 3,
        isGroup: true,
        text: 'Rời khỏi nhóm',
        icon: ImagesChat.icEditChat,
        isShowAll: false,
        isAdmin: false
      },
      {
        id: 4,
        isGroup: false,
        text: 'Đặt biệt danh',
        icon: ImagesChat.icEditChat,
        isShowAll: false, isAdmin: false
      },
      {
        id: 5,
        isGroup: false,
        text: `${props ?.dataInFo.IsNotify ? 'Tắt' : 'Mở'} thông báo`,
        icon: ImagesChat.icEditChat,
        isShowAll: true, isAdmin: false
      },
      {
        id: 6,
        isGroup: false,
        text: 'Huỷ kết bạn',
        icon: ImagesChat.icEditChat,
        isShowAll: false,
        isAdmin: false
      },
      {
        id: 7,
        isGroup: false,
        text: 'Xoá lịch sử trò chuyện',
        icon: ImagesChat.icEditChat,
        isShowAll: true,
        isAdmin: true
      },
      {
        id: 9,
        isGroup: true,
        text: 'Thông tin nhóm',
        icon: ImagesChat.icEditChat,
        isShowAll: false, isAdmin: false
      },
      {
        id: 8,
        isGroup: true,
        text: 'Chuyển quyền trưởng nhóm',
        icon: ImagesChat.icEditChat,
        isShowAll: false, isAdmin: true
      }
    ]);
  }, [props.dataInFo]);

  const opacity = new Animated.Value(-10);
  useEffect(() => {
    Animated.timing(opacity, {
      toValue: itemEdit.ToadoY,
      duration: 300
    }).start();
  }, []);
  // Utils.nlog('giá trị props ìno----', props.dataInFo);
  const _Chat_LeaveGroupChat = (isDelete = true) => {
    nthisIsLoading.show();
    Utils.showMsgBoxYesNo(
      { props },
      'Thông báo',
      `Bạn có muốn ${isDelete == true ? 'xoá' : 'rời khỏi'} nhóm này không?`,
      `${isDelete == true ? 'Xoá' : 'Rời khỏi'}`,
      'Xem lại',
      async () => {
        let res = await apiChat.Chat_LeaveGroupChat(
          itemEdit.IdGroup,
          itemEdit.UserID,
          isDelete
        );
        if (res.status == 1) {
          Utils.showToastMsg("Thông báo chat", "Thực hiện thành công", icon_typeToast.success);
          nthisIsLoading.hide();
          props.ApiGet_ListGroupChat();
          Utils.goscreen({ props }, 'sc_HomeChat');
        } else {
          nthisIsLoading.hide();
          Utils.showMsgBoxOK(
            { props },
            'Thông báo',
            res.error ? res.error.message : 'Thực hiện thất bại',
            'Xác nhận',
            () => {
              Utils.goback({ props });
            }
          );
        }
      }
    );
  };
  const _Chat_UpdateNotify = () => {
    Utils.showMsgBoxYesNo(
      { props },
      'Thông báo',
      `Bạn có muốn ${props ?.dataInFo.IsNotify ? 'tắt' : 'mở'} thông báo không?`,
      `${props ?.dataInFo.IsNotify ? 'Tắt' : 'Mở'}`,
      'Xem lại',
      async () => {
        nthisIsLoading.show();
        let res = await apiChat.Chat_UpdateNotify(
          itemEdit.IdGroup,
          itemEdit.UserID,
          props.dataInFo.IsNotify ? false : true
        );
        if (res.status == 1) {
          Utils.showToastMsg("Thông báo chat", "Thực hiện thành công", icon_typeToast.success);
          nthisIsLoading.hide();
          props.ApiGetInfoChat(itemEdit.IdGroup);
          Utils.goback({ props });
        } else {
          nthisIsLoading.hide();
          Utils.showMsgBoxOK(
            { props },
            'Thông báo',
            res.error ? res.error.message : 'Thực hiện thất bại',
            'Xác nhận',
            () => {
              Utils.goback({ props });
            }
          );
        }
      }
    );
  };
  const _DatBietDanh = async val => {
    Utils.showMsgBoxYesNo(
      { props },
      'Thông báo',
      'Bạn có muốn đặt biệt danh lại không ?',
      'Xác nhận',
      'Thoát',
      async () => {
        nthisIsLoading.show();
        let { Members = [] } = itemEdit;
        let user = Members.find(item => item.UserID != itemEdit.UserID);
        let res = await apiChat.Chat_UpdateName(user.UserID, val, itemEdit.IdGroup, itemEdit.IsGroup);
        if (res.status == 1) {
          Utils.showToastMsg("Thông báo chat", "Thực hiện thành công", icon_typeToast.success);
          nthisIsLoading.hide();
          props.ApiGetInfoChat(itemEdit.IdGroup);
          Utils.goback({ props });
        } else {
          nthisIsLoading.hide();
          Utils.showMsgBoxOK({ props }, 'Thông báo', res.error ? res.error.message : 'Thực hiện thất bại', 'Xác nhận');
        }
      }
    );
  };
  const DatBietDanh = () => {
    Utils.goscreen({ props }, 'modal_InPut', {
      Action: _DatBietDanh,
      title: itemEdit.IdGroup
        ? 'Nhập tên nhóm bạn muốn đổi?'
        : 'Nhập biệt danh muốn thay đổi?',
      defaultValue: itemEdit.GroupName
    });
  };
  const _HuyKetBan = async () => {
    Utils.showMsgBoxYesNo(
      { props },
      'Thông báo',
      'Bạn có muốn huỷ kết bạn hay không ?',
      'Huỷ kết bạn',
      'Xem lại',
      async () => {
        nthisIsLoading.show();
        let { Members = [] } = itemEdit;
        let user = Members.find(item => item.UserID != itemEdit.UserID);
        Utils.nlog("user----------", user, itemEdit, Members)
        let res = await apiChat.Chat_LeaveGroupChat_HKB(itemEdit.IdGroup, user);
        if (res.status == 1) {
          Utils.showToastMsg("Thông báo chat", "Thực hiện thành công", icon_typeToast.success);
          nthisIsLoading.hide();
          props.ApiGetInfoChat(itemEdit.IdGroup);
          Utils.goscreen({ props }, 'sc_HomeChat');
        } else {
          nthisIsLoading.hide();
          Utils.showMsgBoxOK({ props }, 'Thông báo', res.error ? res.error.message : 'Thực hiện thất bại', 'Xác nhận');
        }
      }
    );
  };
  const _XoaLichSuTroTruyen = async () => {
    Utils.showMsgBoxYesNo(
      { props },
      'Thông báo',
      'Bạn có muốn xoá lịch sử trò truyện hay không ?',
      'Xoá',
      'Xem lại',
      async () => {
        nthisIsLoading.show();
        const STATUSXOALICHSU = 3;
        let res = await apiChat.Chat_UpdateStatusMessInGroup(itemEdit.IdGroup, 0, STATUSXOALICHSU);
        if (res.status == 1) {
          nthisIsLoading.hide();
          Utils.showToastMsg("Thông báo chat", "Xoá Cuộc trò chuyện thành công", icon_typeToast.success);
          props.DeleteAllMessageOfGroup(itemEdit.IdGroup || '')
          Utils.BackStack();
          // props.SetEmptyAllMessege();
        } else {
          nthisIsLoading.hide();
          Utils.showMsgBoxOK(
            { props },
            'Thông báo',
            res.error ? res.error.message : 'Thực hiện thất bại',
            'Xác nhận',
            () => {
              Utils.goback({ props });
            }
          );
        }
      }
    );
  };
  const _sc_ChuyenTruongNhom = () => {
    Utils.goscreen({ props }, 'sc_ChuyenTruongNhom');
  };
  const _sc_ThongTinNhom = () => {
    Utils.goscreen({ props }, 'sc_ThongTinNhom');
  };
  const _ActionOnPress = id => {
    Utils.goback({ props });
    switch (id) {
      case 1:
        {
          DatBietDanh();
        }
        break;
      case 2:
        {
          _Chat_LeaveGroupChat();
        }
        break;
      case 3:
        {
          _Chat_LeaveGroupChat(false);
        }
        break;
      case 4:
        {
          DatBietDanh();
        }
        break;
      case 5:
        {
          _Chat_UpdateNotify();
        }
        break;
      case 6:
        {
          _HuyKetBan();
        }
        break;
      case 7:
        {
          _XoaLichSuTroTruyen();
        }
        break;
      case 8:
        {
          _sc_ChuyenTruongNhom();
        }
        break;
      case 9:
        {
          _sc_ThongTinNhom();
        }
        break;
      default: {
      }
    }
  };
  const ViewMenu = useMemo(() => {
    // Utils.nlog('giá trị toa do y', itemEdit.ToadoY);
    return (
      <Animated.View
        style={{
          transform: [
            {
              translateY: opacity
            }
          ],
          position: 'absolute',
          top: itemEdit.ToadoY,
          right: 5,
          backgroundColor: 'white',
          zIndex: 1000,
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
        {data.map((item, index) => {
          if (item.isAdmin == true && itemEdit.UserID != itemEdit.IdAdminGroup) {
            return null;
          } else if (item.isShowAll == true || item.isGroup == itemEdit.isGroup) {
            return (
              <TouchableOpacity
                key={index.toString()}
                onPress={() => {
                  _ActionOnPress(item.id);
                }}
                style={{
                  flexDirection: 'row', paddingVertical: 5,
                  paddingHorizontal: 10
                }}
              >
                <View style={{ padding: 10 }}>
                  <Text style={{ fontSize: 16, color: colors.black_80 }}>
                    {item.text}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }
        })}
      </Animated.View>
    );
  }, [data]);
  return (
    <SafeAreaView
      style={{
        flex: 1, alignItems: 'center', justifyContent: 'center',
        backgroundColor: 'transparent'
      }}
    >
      <View
        onTouchEnd={() => {
          Utils.goback({ props });
        }}
        style={{
          backgroundColor: 'transparent', flex: 1, position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0
        }}
      />
      {ViewMenu}
      <IsLoading />
    </SafeAreaView>
  );
};
const mapStateToProps = state => ({
  dataInFo: state.ReducerGroupChat.InFoGroup,
});
export default Utils.connectRedux(ModalEditMember, mapStateToProps, true);
