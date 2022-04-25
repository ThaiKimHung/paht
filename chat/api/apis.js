


import Utils from '../../app/Utils';
import { nGlobalKeys } from '../../app/keys/globalKey';
import { appConfig } from '../../app/Config';
import ImageResizer from 'react-native-image-resizer';
import { Platform } from 'react-native'
import AppCodeConfig from '../../app/AppCodeConfig';
import { store } from '../../srcRedux/store';
import ActionChat from '../redux/action';
import { nkey } from '../../app/keys/keyStore';
const PREFIX = 'api/chatserver/';
async function GetList_Chat_DanhSachChat(keyword = '', numrow = 10, pageindex = 1) {
    let val = `${PREFIX}GetList_Chat_DanhSachChat?keyword=${keyword}&numrow=${numrow}&pageindex=${pageindex}`;
    // let type = await store.getState().auth.TypeUserChat
    let type = await store.getState().auth.TypeUserChat;
    let res = await Utils.get_api(val, false, true, true, AppCodeConfig.APP_CHAT, type)
    Utils.nlog(`res-------------res${val}`, res)
    return res;
}
// https://tay-ninh-admin-api.jeecrms.com/api/chatserver/GetList_Chat_DanhSachChatUser
async function GetList_Chat_DanhSachChatUser(keyword = '', numrow = 10, pageindex = 1) {
    let type = await store.getState().auth.TypeUserChat
    let val = `${PREFIX}GetList_Chat_DanhSachChatUser?keyword=${keyword}&numrow=${numrow}&pageindex=${pageindex}&Type=${type}`;

    let res = await Utils.get_api(val, false, true, true, AppCodeConfig.APP_CHAT, type)
    Utils.nlog(`res-------------res${val}`, res)
    return res;
}
//https://tay-ninh-admin-api.jeecrms.com/api/chatserver/GetList_Chat_DanhBaChatGroupUser
async function GetList_Chat_DanhBaChatGroupUser(keysearch = '') {
    let type = await store.getState().auth.TypeUserChat
    let val = `${PREFIX}GetList_Chat_DanhBaChatGroupUser?keysearch=${keysearch}&Type=${type}`;

    let res = await Utils.get_api(val, false, false, true, AppCodeConfig.APP_CHAT, type)
    Utils.nlog(`res-------------res${val}`, res)
    return res;
}
//https://tay-ninh-admin-api.jeecrms.com/api/chatserver/Chat_GetCommentsChatOfGroup
async function Chat_GetCommentsChatOfGroup(IdGroup = 0, IdChatFrom = 0, numrow = 20) {
    let type = await store.getState().auth.TypeUserChat
    let val = `${PREFIX}Chat_GetCommentsChatOfGroup`;
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
        _userId: 0,
        Type: type
    });
    let res = await Utils.post_api(val, strBody, false, true, true, AppCodeConfig.APP_CHAT, type)
    Utils.nlog(`res-------------res${val}`, IdGroup + "", res)
    return res;
}
//https://tay-ninh-admin-api.jeecrms.com/api/chatserver/GetList_Chat_DanhBaChatUser?keysearch=xuly
async function GetList_Chat_DanhBaChatUser(keysearch = '') {
    let type = await store.getState().auth.TypeUserChat
    let val = `${PREFIX}GetList_Chat_DanhBaChatUser?keysearch=${keysearch}`;
    let res = await Utils.get_api(val, false, false, true, AppCodeConfig.APP_CHAT, type)
    Utils.nlog(`res-------------res${val}`, res)
    return res;
}
//https://tay-ninh-admin-api.jeecrms.com/api/chatserver/Chat_TaoNhomChat
async function Chat_TaoNhomChat(item = {}) {
    let type = await store.getState().auth.TypeUserChat
    let val = `${PREFIX}Chat_TaoNhomChat`;
    let strBody = JSON.stringify({
        IsGroup: false,
        GroupName: '',
        FriendId: item.UserID,
        IdGroup: 0,
        Token: '',
        Type_FriendId: item.Type,
        Type_UserId: type,
        Type: type
    });
    let res = await Utils.post_api(val, strBody, false, true, true, AppCodeConfig.APP_CHAT, type)
    Utils.nlog(`res-------------res${val}`, res)
    return res;
}
//https://tay-ninh-admin-api.jeecrms.com/api/chatserver/Chat_TaoNhomChat
async function Chat_TaoNhomChatGroup(arrIDFriend, name) {
    let type = await store.getState().auth.TypeUserChat
    // let arrCB = arrIDFriend.filter(item => item.Type == 0)
    // let arrCD = arrIDFriend.filter(item => item.Type == 1)
    let val = `${PREFIX}Chat_TaoNhomChat`;
    let strBody = JSON.stringify({
        FriendIds: arrIDFriend ? arrIDFriend.map(item => item.UserID) : [],
        TypeFriendIds: arrIDFriend ? arrIDFriend.map(item => item.Type) : [],
        GroupName: name,
        IsGroup: true,
        PrivateGroup: true,
        Type_UserId: type
    });
    let res = await Utils.post_api(val, strBody, false, true, true, AppCodeConfig.APP_CHAT, type)
    Utils.nlog(`res-------------res--strBody`, strBody, res)
    return res;
}

async function Chat_AddNewMemberToGroupChat(IdGroup, item) {
    let type = await store.getState().auth.TypeUserChat
    let val = `${PREFIX}Chat_AddNewMemberToGroupChat`;
    let strBody = JSON.stringify({
        IdGroup: IdGroup,
        UserId: item.UserID,
        Type_IdMember: item.Type,
        Type: type

    });
    let res = await Utils.post_api(val, strBody, false, true, true, AppCodeConfig.APP_CHAT, type)
    Utils.nlog(`res-------------res${val}`, res)
    return res;
}
//danh sách yêu cầu kết bạn
// https://tay-ninh-admin-api.jeecrms.com/api/chatserver/GetList_Chat_RequestList

async function GetList_Chat_RequestList() {
    let type = await store.getState().auth.TypeUserChat
    let val = `${PREFIX}GetList_Chat_RequestList?Type=${type}`;
    let res = await Utils.get_api(val, false, false, true, AppCodeConfig.APP_CHAT, type)
    Utils.nlog(`res-------------res${val}`, res)
    return res;
}
//https://tay-ninh-admin-api.jeecrms.com/api/chatserver/GetList_Chat_FindNewFriends?keyword=thu&numrow=10&pageindex=1
async function GetList_Chat_FindNewFriends(keyword, numrow, pageindex) {
    let type = await store.getState().auth.TypeUserChat
    let val = `${PREFIX}GetList_Chat_FindNewFriends?keysearch=${keyword}&numrow=${numrow}&pageindex=${pageindex}&Type=${type}`;
    let res = await Utils.get_api(val, false, false, true, AppCodeConfig.APP_CHAT, type)
    Utils.nlog(`res-------------res${val}`, res)
    return res;
}
// GetList_Chat_FindNewFriends_TEST (bổ sung thêm IdDV, MaDD)
async function GetList_Chat_FindNewFriends_Test(keyword, numrow, pageindex, IdDV = '', MaDD = '') {
    let type = await store.getState().auth.TypeUserChat
    let val = `${PREFIX}GetList_Chat_FindNewFriends_TEST?keysearch=${keyword}&numrow=${numrow}&pageindex=${pageindex}&Type=${type}&IdDV=${IdDV}&MaDD=${MaDD}`;
    let res = await Utils.get_api(val, false, false, true, AppCodeConfig.APP_CHAT, type)
    Utils.nlog(`res------------- res${val} `, res)
    return res;
}
//https://tay-ninh-admin-api.jeecrms.com/api/chatserver/Chat_SendRequestFriend
async function Chat_SendRequestFriend(item) {
    let type = await store.getState().auth.TypeUserChat
    let val = `${PREFIX}Chat_SendRequestFriend`;
    let strBody = JSON.stringify({
        ToUserId: item.UserID, ContentInfo: 'Hi',
        Type_FriendId: item.Type, Type_UserId: type
    });
    let res = await Utils.post_api(val, strBody, false, true, true, AppCodeConfig.APP_CHAT, type)
    Utils.nlog(`res------------- res${val} `, res)
    return res;
}
//ẩn tin nhắn
// https://tay-ninh-admin-api.jeecrms.com/api/chatserver/Chat_UpdateStatusMessInGroup
//0 ẩn,1 xoá với tôi,2 xoá với tất cả
async function Chat_UpdateStatusMessInGroup(IdGroup, IdChat, status) {
    let type = await store.getState().auth.TypeUserChat
    let val = `${PREFIX}Chat_UpdateStatusMessInGroup`;
    let strBody = JSON.stringify({
        IdGroup: IdGroup,
        IdChat: IdChat,
        Status: status,
        Type: type
    });
    //   Utils.nlog('body', strBody);
    let res = await Utils.post_api(val, strBody, false, true, true, AppCodeConfig.APP_CHAT, type)
    Utils.nlog(`res------------- res${val} `, res)
    return res;
}
//https://tay-ninh-admin-api.jeecrms.com/api/chatserver/get_Chat_InfoGroup?IdGroup=30
async function get_Chat_InfoGroup(IdGroup) {
    let type = await store.getState().auth.TypeUserChat
    let val = `${PREFIX}get_Chat_InfoGroup?IdGroup=${IdGroup}&Type=${type} `;
    let res = await Utils.get_api(val, false, false, true, AppCodeConfig.APP_CHAT, type)
    Utils.nlog(`res------------- res${val} `, res)
    return res;
}
//https://tay-ninh-admin-api.jeecrms.com/api/chatserver/Chat_LeaveGroupChat
//xoá nhóm chat
async function Chat_LeaveGroupChat(IdGroup, UserIdLeave, isDelete = true) {
    let type = await store.getState().auth.TypeUserChat
    let val = `${PREFIX}Chat_LeaveGroupChat`;
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
        _userId: 0,
        Type: type
    });
    let res = await Utils.post_api(val, strBody, false, true, true, AppCodeConfig.APP_CHAT, type)
    Utils.nlog(`res------------- res${val} `, res)
    return res;
}

//huỷ kết bạn
async function Chat_LeaveGroupChat_HKB(IdGroup, UserIdLeave) {
    // Utils.nlog("giá trị item-----------", UserIdLeave);
    let type = await store.getState().auth.TypeUserChat
    let val = `${PREFIX}Chat_LeaveGroupChat`;
    let strBody = JSON.stringify({
        IdGroup: IdGroup,
        IsDelGroup: false,
        UserIdLeave: UserIdLeave.UserID,
        _defaultFieldName: '',
        _isDeleted: false,
        _isEditMode: false,
        _isNew: false,
        _isUpdated: false,
        _prevState: null,
        IsHuy: true,
        _userId: 0,
        Type: type,
        Type_UserIdLeave: UserIdLeave.Type
    });
    //   Utils.nlog('body', strBody);

    let res = await Utils.post_api(val, strBody, false, true, true, AppCodeConfig.APP_CHAT, type)
    Utils.nlog(`res------------- res${val} `, res)
    return res;
}
//https://tay-ninh-admin-api.jeecrms.com/api/chatserver/Chat_UpdateNotify
//tắt thông báo chat nhóm
async function Chat_UpdateNotify(IdGroup, UserID, IsNotify) {
    let type = await store.getState().auth.TypeUserChat
    let val = `${PREFIX}Chat_UpdateNotify`;
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
        _userId: 0,
        Type: type
    });

    let res = await Utils.post_api(val, strBody, false, true, true, AppCodeConfig.APP_CHAT, type)
    Utils.nlog(`res------------- res${val} `, res)
    return res;
}
//https://tay-ninh-admin-api.jeecrms.com/api/chatserver/Chat_UpdateStatusMessInGroup
//xoá lịch sử trò truyện

async function Chat_UpdateStatusMessInGroupG(IdGroup, IdChat) {
    let type = await store.getState().auth.TypeUserChat
    let val = `${PREFIX}Chat_UpdateStatusMessInGroup`;
    let strBody = JSON.stringify({
        IdGroup: IdGroup,
        IdChat: IdChat,
        Status: 3,
        Type: type
    });
    let res = await Utils.post_api(val, strBody, false, true, true, AppCodeConfig.APP_CHAT, type)
    Utils.nlog(`res------------- res${val} `, res)
    return res;
}
//https://tay-ninh-admin-api.jeecrms.com/api/chatserver/Chat_UpdateName
//cập nhật name chat
async function Chat_UpdateName(FriendId, GroupName, IdGroup, IsGroup = false) {
    let type = await store.getState().auth.TypeUserChat
    let val = `${PREFIX}Chat_UpdateName`;
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
        _userId: 0,
        Type_UserId: type
    });
    //   Utils.nlog('body', strBody);

    let res = await Utils.post_api(val, strBody, false, true, true, AppCodeConfig.APP_CHAT, type)
    Utils.nlog(`res------------- res${val} `, res)
    return res;
}
//https://tay-ninh-admin-api.jeecrms.com/api/chatserver/Chat_UpdateRoleAdminInGroup
//cập nhật trưởng nhóm
async function Chat_UpdateRoleAdminInGroup(IdGroup, IdAdminNew) {
    let type = await store.getState().auth.TypeUserChat
    let val = `${PREFIX}Chat_UpdateRoleAdminInGroup`;
    let strBody = JSON.stringify({
        IdGroup: IdGroup,
        IdAdminNew: IdAdminNew,
        Type: type
    });
    Utils.nlog('body', strBody);
    let res = await Utils.post_api(val, strBody, false, true, true, AppCodeConfig.APP_CHAT, type)
    Utils.nlog(`res------------- res${val} `, res)
    return res;
}
async function UploadFileData(File, IdGroup = 0, IsGroup = false, IdChatReplay = 0, IconChat = 0) {
    const { TypeUserChat, tokenCHAT } = await store.getState().auth
    let type = TypeUserChat;
    let dataBody = new FormData();
    let token = tokenCHAT;
    let SendKey = new Date().getTime();
    if (File.type == 'image' && Platform.OS == 'ios') {
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
                // Utils.nlog("gia tri err-----------------", err)
            });
    } else {
        dataBody.append('filechat', {
            name: File.filename ? File.filename : File.name ? File.name : 'file',
            type: File.type ? File.type : File.timePlay > 0 ? 2 : 3,
            uri: File.uri
        });
    }
    dataBody.append('IdChat', 0);
    dataBody.append('IdGroup', IdGroup + "");
    dataBody.append('Comment', "");
    dataBody.append('IdChatReplay', IdChatReplay + "");
    dataBody.append('IconChat', IconChat + "");
    dataBody.append('IsGroup', IsGroup + "");
    dataBody.append('IsApp', true);
    dataBody.append('SendKey', `${token}.${SendKey} `);
    dataBody.append('Type', type);

    let itemchat = {
        isLoadFile: true,
        UserID: store.getState().auth.userCHAT.Id,
        IdChat: 0,
        IdGroup: IdGroup,
        Comment: '',
        IdChatReplay: IdChatReplay,
        IconChat: IconChat,
        IsGroup: IsGroup,
        IsApp: true,
        SendKey: `${token}.${SendKey} `,
        uri: File.uri,
        name: File.filename ? File.filename : File.name ? File.name : 'file',
        CreatedDate: new Date(),
        Type: type
    }
    store.dispatch(ActionChat.SetItemFileLoad(itemchat));
    var myHeaders = new Headers();
    myHeaders.append("Token", token);
    myHeaders.append("Type", type);
    myHeaders.append("Accept", "application/json");

    try {
        let response = await fetch(
            `${appConfig.domain}api/chatserver/Chat_SendFileChat`,
            {
                method: 'POST',
                headers: myHeaders,
                redirect: 'follow', // manual, *follow, error
                referrerPolicy: 'no-referrer',
                body: dataBody,
                redirect: 'follow'
            }
        );
        // Utils.nlog('gia tri res-------------', res);
        const res = await response.json();
        return res;
    } catch (error) {
        // Utils.nlog('gia tri eror', error);
        return -1;
    }
}
//https://tay-ninh-admin-api.jeecrms.com/api/chatserver/Chat_GetIconChat
async function GetList_IConChat() {
    let type = await store.getState().auth.TypeUserChat
    let val = `${PREFIX}Chat_GetIconChat`;
    let res = await Utils.get_api(val, false, false, true, AppCodeConfig.APP_CHAT, type)
    Utils.nlog(`res------------- res${val} `, res)
    return res;
}
//https://tay-ninh-admin-api.jeecrms.com/api/chatserver/Chat_UpdateStatusRequestFriend
async function Chat_UpdateStatusRequestFriend(body) {
    let type = await store.getState().auth.TypeUserChat
    let val = `${PREFIX}Chat_UpdateStatusRequestFriend`;
    let strBody = JSON.stringify({
        ...body,
        Type_UserId: type
    });
    let res = await Utils.post_api(val, strBody, false, true, true, AppCodeConfig.APP_CHAT, type)
    Utils.nlog(`res------------- res${val} `, res)
    return res;
}
//https://tay-ninh-admin-api.jeecrms.com/api/chatserver/GetList_Donvi
async function GetList_DonVi() {
    let type = await store.getState().auth.TypeUserChat
    let val = `${PREFIX}GetList_Donvi`;
    let res = await Utils.get_api(val, false, false, true, AppCodeConfig.APP_CHAT, type)
    Utils.nlog(`res------------- res${val} `, res)
    return res;
}
// api/chatserver/DemSoTinNhanChuaXem
async function DemSoTinNhanChuaXem() {
    let type = await store.getState().auth.TypeUserChat
    if (!store.getState().auth.tokenDH || store.getState().auth.tokenDH.length < 3)
        return {};
    let val = `${PREFIX}DemSoTinNhanChuaXem`;
    let res = await Utils.get_api(val, false, false, true, AppCodeConfig.APP_CHAT, type)

    Utils.nlog(`res------------- res [DemSoTinNhanChuaXem]${val} `, res)
    return res;
}
const apiChat = {
    GetList_Chat_DanhSachChatUser,
    Chat_GetCommentsChatOfGroup,
    GetList_Chat_DanhBaChatUser,
    GetList_Chat_DanhSachChat,
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
    Chat_AddNewMemberToGroupChat,
    GetList_DonVi,
    GetList_Chat_FindNewFriends_Test,
    DemSoTinNhanChuaXem,
};

export default apiChat