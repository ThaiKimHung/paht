import Utils from '../../app/Utils';
import { nGlobalKeys } from '../../app/keys/globalKey';
import { appConfig } from '../../app/Config';
import ImageResizer from 'react-native-image-resizer';
import { Platform } from 'react-native'
import AppCodeConfig from '../../app/AppCodeConfig';

const PREFIX = 'api/chatserver/';
// https://tay-ninh-admin-api.jeecrms.com/api/chatserver/GetList_Chat_DanhSachChatUser
async function GetList_Chat_DanhSachChatUser(
  keyword = '',
  numrow = 10,
  pageindex = 1
) {
  var val = `${PREFIX}GetList_Chat_DanhSachChatUser?keyword=${keyword}&numrow=${numrow}&pageindex=${pageindex}`;
  let res = await Utils.get_api(val, false, true, true, AppCodeConfig.APP_ADMIN)
  return res;
}
//https://tay-ninh-admin-api.jeecrms.com/api/chatserver/GetList_Chat_DanhBaChatGroupUser
async function GetList_Chat_DanhBaChatGroupUser(keysearch = '') {
  var val = `${PREFIX}GetList_Chat_DanhBaChatGroupUser?keysearch=${keysearch}`;
  let res = await Utils.get_api(val, false, false, true, AppCodeConfig.APP_ADMIN)
  return res;
}
//https://tay-ninh-admin-api.jeecrms.com/api/chatserver/Chat_GetCommentsChatOfGroup
async function Chat_GetCommentsChatOfGroup(
  IdGroup = 0,
  IdChatFrom = 0,
  numrow = 20
) {
  var val = `${PREFIX}Chat_GetCommentsChatOfGroup`;
  let strBody = JSON.stringify({
    IdChatFrom: IdChatFrom,
    IdGroup: IdGroup,
    SizeChat: numrow,
    _defaultFieldName: '',
    _isDeleted: false,
    _isEditMode: false,
    _isNew: false,
    _isUpdated: false,
    _prevState: null,
    _userId: 0
  });

  Utils.nlog('body', strBody);
  let res = await Utils.post_api(val, strBody, false, true, true, AppCodeConfig.APP_ADMIN)
  //   Utils.nlog('body res', res);
  return res;
}
//https://tay-ninh-admin-api.jeecrms.com/api/chatserver/GetList_Chat_DanhBaChatUser?keysearch=xuly
async function GetList_Chat_DanhBaChatUser(keysearch = '') {
  var val = `${PREFIX}GetList_Chat_DanhBaChatUser?keysearch=${keysearch}`;
  let res = await Utils.get_api(val, false, false, true, AppCodeConfig.APP_ADMIN)
  return res;
}
//https://tay-ninh-admin-api.jeecrms.com/api/chatserver/Chat_TaoNhomChat
async function Chat_TaoNhomChat(FriendId = 0) {
  var val = `${PREFIX}Chat_TaoNhomChat`;
  let strBody = JSON.stringify({
    IsGroup: false,
    GroupName: '',
    FriendId: FriendId,
    IdGroup: 0,
    Token: ''
  });
  //   Utils.nlog('body', strBody);
  let res = await Utils.post_api(val, strBody, false, true, true, AppCodeConfig.APP_ADMIN)
  return res;
}
//https://tay-ninh-admin-api.jeecrms.com/api/chatserver/Chat_TaoNhomChat
async function Chat_TaoNhomChatGroup(arrIDFriend, name) {
  var val = `${PREFIX}Chat_TaoNhomChat`;
  let strBody = JSON.stringify({
    FriendIds: arrIDFriend,
    GroupName: name,
    IsGroup: true,
    PrivateGroup: true
  });
  //   Utils.nlog('body', strBody);
  let res = await Utils.post_api(val, strBody, false, true, true, AppCodeConfig.APP_ADMIN)
  return res;
}

async function Chat_AddNewMemberToGroupChat(IdGroup, UserId) {
  var val = `${PREFIX}Chat_AddNewMemberToGroupChat`;
  let strBody = JSON.stringify({
    IdGroup: IdGroup,
    UserId: UserId,
    // IsGroup: true,
    // PrivateGroup: true
  });
  //   Utils.nlog('body', strBody);
  let res = await Utils.post_api(val, strBody, false, true, true, AppCodeConfig.APP_ADMIN)
  return res;
}
//danh sách yêu cầu kết bạn
// https://tay-ninh-admin-api.jeecrms.com/api/chatserver/GetList_Chat_RequestList

async function GetList_Chat_RequestList() {
  var val = `${PREFIX}GetList_Chat_RequestList`;
  let res = await Utils.get_api(val, false, false, true, AppCodeConfig.APP_ADMIN)
  return res;
}
//https://tay-ninh-admin-api.jeecrms.com/api/chatserver/GetList_Chat_FindNewFriends?keyword=thu&numrow=10&pageindex=1
async function GetList_Chat_FindNewFriends(keyword, numrow, pageindex) {
  var val = `${PREFIX}GetList_Chat_FindNewFriends?keyword=${keyword}&numrow=${numrow}&pageindex=${pageindex}`;
  let res = await Utils.get_api(val, false, false, true, AppCodeConfig.APP_ADMIN)
  return res;
}
//https://tay-ninh-admin-api.jeecrms.com/api/chatserver/Chat_SendRequestFriend
async function Chat_SendRequestFriend(ToUserId) {
  var val = `${PREFIX}Chat_SendRequestFriend`;
  let strBody = JSON.stringify({ ToUserId: ToUserId, ContentInfo: 'Hi' });
  //   Utils.nlog('body', strBody);
  let res = await Utils.post_api(val, strBody, false, true, true, AppCodeConfig.APP_ADMIN)
  return res;
}
//ẩn tin nhắn
// https://tay-ninh-admin-api.jeecrms.com/api/chatserver/Chat_UpdateStatusMessInGroup
//0 ẩn,1 xoá với tôi,2 xoá với tất cả
async function Chat_UpdateStatusMessInGroup(IdGroup, IdChat, status) {
  var val = `${PREFIX}Chat_UpdateStatusMessInGroup`;
  let strBody = JSON.stringify({
    IdGroup: IdGroup,
    IdChat: IdChat,
    Status: status
  });
  //   Utils.nlog('body', strBody);
  let res = await Utils.post_api(val, strBody, false, true, true, AppCodeConfig.APP_ADMIN)
  return res;
}
//https://tay-ninh-admin-api.jeecrms.com/api/chatserver/get_Chat_InfoGroup?IdGroup=30
async function get_Chat_InfoGroup(IdGroup) {
  var val = `${PREFIX}get_Chat_InfoGroup?IdGroup=${IdGroup}`;
  let res = await Utils.get_api(val, false, false, true, AppCodeConfig.APP_ADMIN)
  return res;
}
//https://tay-ninh-admin-api.jeecrms.com/api/chatserver/Chat_LeaveGroupChat
//xoá nhóm chat
async function Chat_LeaveGroupChat(IdGroup, UserIdLeave, isDelete = true) {
  var val = `${PREFIX}Chat_LeaveGroupChat`;
  let strBody = JSON.stringify({
    IdGroup: IdGroup,
    IsDelGroup: isDelete,
    UserIdLeave: UserIdLeave,
    _defaultFieldName: '',
    _isDeleted: false,
    _isEditMode: false,
    _isNew: false,
    _isUpdated: false,
    _prevState: null,
    _userId: 0
  });
  //   Utils.nlog('body', strBody);
  let res = await Utils.post_api(val, strBody, false, true, true, AppCodeConfig.APP_ADMIN)
  return res;
}

// + IdGroup
// + UserIdLeave: Id của user bị hủy
// + IsDelGroup: false
// + IsHuy: true

//huỷ kết bạn
async function Chat_LeaveGroupChat_HKB(IdGroup, UserIdLeave) {
  var val = `${PREFIX}Chat_LeaveGroupChat`;
  let strBody = JSON.stringify({
    IdGroup: IdGroup,
    IsDelGroup: false,
    UserIdLeave: UserIdLeave,
    _defaultFieldName: '',
    _isDeleted: false,
    _isEditMode: false,
    _isNew: false,
    _isUpdated: false,
    _prevState: null,
    IsHuy: true,
    _userId: 0
  });
  //   Utils.nlog('body', strBody);
  let res = await Utils.post_api(val, strBody, false, true, true, AppCodeConfig.APP_ADMIN)
  return res;
}
//https://tay-ninh-admin-api.jeecrms.com/api/chatserver/Chat_UpdateNotify
//tắt thông báo chat nhóm
async function Chat_UpdateNotify(IdGroup, UserID, IsNotify) {
  var val = `${PREFIX}Chat_UpdateNotify`;
  let strBody = JSON.stringify({
    IdGroup: IdGroup,
    IsGroup: true,
    IsNotify: IsNotify,
    UserID: UserID,
    _defaultFieldName: '',
    _isDeleted: false,
    _isEditMode: false,
    _isNew: false,
    _isUpdated: false,
    _prevState: null,
    _userId: 0
  });

  //   Utils.nlog('body', strBody);
  let res = await Utils.post_api(val, strBody, false, true, true, AppCodeConfig.APP_ADMIN)
  return res;
}
//https://tay-ninh-admin-api.jeecrms.com/api/chatserver/Chat_UpdateStatusMessInGroup
//xoá lịch sử trò truyện

async function Chat_UpdateStatusMessInGroupG(IdGroup, IdChat) {
  var val = `${PREFIX}Chat_UpdateStatusMessInGroup`;
  let strBody = JSON.stringify({
    IdGroup: IdGroup,
    IdChat: IdChat,
    Status: 3
  });

  //   Utils.nlog('body', strBody);
  let res = await Utils.post_api(val, strBody, false, true, true, AppCodeConfig.APP_ADMIN)
  return res;
}
//https://tay-ninh-admin-api.jeecrms.com/api/chatserver/Chat_UpdateName
//cập nhật name chat
async function Chat_UpdateName(FriendId, GroupName, IdGroup, IsGroup = false) {
  var val = `${PREFIX}Chat_UpdateName`;
  let strBody = JSON.stringify({
    FriendId: FriendId,
    GroupName: GroupName,
    IdGroup: IdGroup,
    IsGroup: IsGroup,
    _defaultFieldName: '',
    _isDeleted: false,
    _isEditMode: false,
    _isNew: false,
    _isUpdated: false,
    _prevState: null,
    _userId: 0
  });
  //   Utils.nlog('body', strBody);
  let res = await Utils.post_api(val, strBody, false, true, true, AppCodeConfig.APP_ADMIN)
  return res;
}
//https://tay-ninh-admin-api.jeecrms.com/api/chatserver/Chat_UpdateRoleAdminInGroup
//cập nhật trưởng nhóm
async function Chat_UpdateRoleAdminInGroup(IdGroup, IdAdminNew) {
  var val = `${PREFIX}Chat_UpdateRoleAdminInGroup`;
  let strBody = JSON.stringify({
    IdGroup: IdGroup,
    IdAdminNew: IdAdminNew
  });
  Utils.nlog('body', strBody);
  let res = await Utils.post_api(val, strBody, false, true, true, AppCodeConfig.APP_ADMIN)
  return res;
}

//api/chatserver/Chat_SendFileChat
async function UploadFileData(
  File,
  IdGroup = 0,
  IsGroup = false,
  IdChatReplay = 0,
  IconChat = 0
) {
  let dataBody = new FormData();
  var token = Utils.getGlobal(nGlobalKeys.loginToken, '', AppCodeConfig.APP_ADMIN);
  let SendKey = new Date().getTime();
  Utils.nlog('file chat ------', File);

  // dataBody.append('filechat', {
  //   name: File.name ? File.name : File?.filename,
  //   type: File.type ? File.type : File.timePlay > 0 ? 2 : 3,
  //   uri: File.uri
  // });
  //---New---
  if (File.type == 'image') {
    await ImageResizer.createResizedImage(File.uri, File.width, File.height, 'JPEG', Platform.OS == 'android' ? 60 : 40, 0)
      .then(async (response) => {
        dataBody.append('filechat',
          {
            name: File.name ? File.name : "file" + '.png',
            type: "image/png",
            uri: response.uri
          });
      })
      .catch(err => {
        Utils.nlog("gia tri err-----------------", err)
      });
  } else {
    dataBody.append('filechat', {
      name: File.filename ? File.filename : File.name ? File.name : 'file',
      type: File.type ? File.type : File.timePlay > 0 ? 2 : 3,
      uri: File.uri
    });
  }

  //---End New---

  dataBody.append('IdChat', 0);
  dataBody.append('IdGroup', IdGroup + "");
  dataBody.append('Comment', "");
  dataBody.append('IdChatReplay', IdChatReplay + "");
  dataBody.append('IconChat', IconChat + "");
  dataBody.append('IsGroup', IsGroup + "");
  dataBody.append('IsApp', true);
  dataBody.append('SendKey', `${token}.${SendKey}`);

  Utils.nlog('gia tri from body', dataBody);
  try {
    let response = await fetch(
      `${appConfig.domain}api/chatserver/Chat_SendFileChat`,
      {
        method: 'POST',
        headers: {
          // 'Content-Type': 'multipart/form-data;',
          Token: token,
          Accept: 'application/json'
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer',
        body: dataBody
      }
    );
    const res = await response.json();
    return res;
  } catch (error) {
    // Utils.nlog('gia tri eror', error);
    return -1;
  }
}
//https://tay-ninh-admin-api.jeecrms.com/api/chatserver/Chat_GetIconChat
async function GetList_IConChat() {
  var val = `${PREFIX}Chat_GetIconChat`;
  let res = await Utils.get_api(val, false, false, true, AppCodeConfig.APP_ADMIN)
  return res;
}
//https://tay-ninh-admin-api.jeecrms.com/api/chatserver/Chat_UpdateStatusRequestFriend
async function Chat_UpdateStatusRequestFriend(body) {
  var val = `${PREFIX}Chat_UpdateStatusRequestFriend`;
  let strBody = JSON.stringify(body);
  //   Utils.nlog('body', strBody);
  let res = await Utils.post_api(val, strBody, false, true, true, AppCodeConfig.APP_ADMIN)
  return res;
}

export {
  GetList_Chat_DanhSachChatUser,
  Chat_GetCommentsChatOfGroup,
  GetList_Chat_DanhBaChatUser,
  GetList_Chat_FindNewFriends,
  Chat_UpdateStatusMessInGroup,
  Chat_TaoNhomChat,
  Chat_TaoNhomChatGroup,
  GetList_Chat_RequestList,
  GetList_Chat_DanhBaChatGroupUser,
  Chat_SendRequestFriend,
  get_Chat_InfoGroup,
  Chat_UpdateName,
  Chat_LeaveGroupChat_HKB,
  Chat_UpdateRoleAdminInGroup,
  Chat_LeaveGroupChat,
  Chat_UpdateNotify,
  Chat_UpdateStatusMessInGroupG,
  UploadFileData,
  GetList_IConChat,
  Chat_UpdateStatusRequestFriend,
  Chat_AddNewMemberToGroupChat
};
