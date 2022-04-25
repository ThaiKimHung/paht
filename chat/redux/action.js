
import * as Types from './type';
import Utils from '../../app/Utils';
import apiChat from '../api/apis';
import ConnectSocket from '../RoomChat/Connecttion';
import { store } from '../../srcRedux/store';
// import apiChat from '../api/apis';
//action
const SetList_GroupOfChat = val => ({
    type: Types.SETLIST_GROUPCHAT,
    data: val
});
const ChangeIdMessageGroup = val => ({
    type: Types.CHANGID_ITEM,
    data: val
});
const ChangeCurentGroup = val => ({
    type: Types.CHANGE_CURRENT_GROUP,
    data: val
});
const ChangeInFoCurentGroup = val => ({
    type: Types.SETINFO_CURRENTGROUP,
    data: val
});
const SetListMessageOfGroup = (val) => ({
    type: Types.SETLIST_MESSAGE_OFGROUP,
    data: val
})
const AddMessageOfGroup = val => ({
    type: Types.SETITEM_MESSAGE_OFGROUP,
    data: val
})
const ChangeIDMessageOfGroup = val => ({
    type: Types.CHANGE_ITEM_ID,
    data: val
})
const ChangeTypeMessageOfGroup = val => ({
    type: Types.CHANGETYPE_ITEM_MESSAGE_OFGROUP,
    data: val
})
const RemoveMessageByIDOfGroup = val => ({
    type: Types.DELETE_ITEM_MESSAGE_OFGROUP_BYIDCHAT,
    data: val
})
const RemoveMessageBySenKeyOfGroup = val => ({
    type: Types.DELETE_ITEM_MESSAGE_OFGROUP_BYSENDKEY,
    data: val
})
const DeleteAllMessageOfGroup = val => ({
    type: Types.DELETE_ALL_MESSAGE_OFGROUP,
    data: val
})
const DataSynchonization = val => ({
    type: Types.DATA_SYNCHRONIZATION,
    data: val
})
// CHANGE_NEW_MESSAGE_OF_GROUP

const ChangeNewMessageOfGroup = val => ({
    type: Types.CHANGE_NEW_MESSAGE_OF_GROUP,
    data: val
})

const ApiGetCheckData = (IdGroup, DataMessage, NewDataMessage) => {
    return async (dispatch, getState) => {
        DataMessage = DataMessage ? DataMessage : []
        if (NewDataMessage && NewDataMessage.length > 0) {
            //lượm ra những message bị lỗi ở local store đồng bộ vào list message new 
            let DataMessageError = DataMessage.filter(item => item.IdChat == 0 || item.SendKey == item.IdChat || item.isError == true);
            let DataMessageNew = [...NewDataMessage, ...DataMessageError];
            DataMessageNew.sort(function (a, b) {
                let keyA = new Date(a.CreatedDate).getTime()
                let keyB = new Date(b.CreatedDate).getTime()
                if (keyA < keyB) return -1;
                if (keyA > keyB) return 1;
                return 0;
            });

            dispatch(ActionChat.SetListMessageOfGroup(DataMessageNew.reverse()))
        } else {

        }
    };
};
const ApiCheckData = (itemView) => {
    // alert(1);
    return async (dispatch, getState) => {
        const stateBefore = getState().ReducerGroupChat;
        if (itemView.IdGroup == stateBefore.IdGroup && stateBefore && stateBefore.DataMessage && stateBefore.DataMessage.length > 0) {
            let ITEMMESS = stateBefore.DataMessage.find(item => item.SendKey == itemView.SendKey);
            if (ITEMMESS) {
                if (ITEMMESS.IdChat != 0) {
                } else {
                    ConnectSocket.onPressCheckSendMessage(ITEMMESS)
                }
            }
        }
    };
};
const CheckData = val => ({
    type: Types.CHECK_DATA,
    data: val
})
//xử lý file gửi
const SetData_SendFile = val => ({
    type: Types.SETDATA_SENDFILE,
    data: val
});

const UpdateDataSendFile = val => ({
    type: Types.UPDATEDATA_SENDFILE,
    data: val
});
//
const SendFileOfGroup = (dataFile = []) => {

    return async (dispatch, getState) => {
        const stateBefore = getState().ReducerGroupChat;

        let dataFileCopy = dataFile.map((item, index) => {
            return { ...item, SendKey: `T${index}-${new Date().getTime()}` }
        })
        // Utils.nlog("item chat-------------file:", dataFileCopy)
        dispatch(SetData_SendFile(dataFileCopy));
        for (let index = 0; index < dataFile.length; index++) {
            let element = dataFile[index];
            let res = await apiChat.UploadFileData(element, stateBefore.IdGroup,
                stateBefore ?.InFoGroup ?.IsGroup ? true : false);
            // Utils.nlog('gia tri res ponse gửi file', res);
            if (res.status == 1) {
                if (stateBefore.IdGroup == res.data.IdGroup) {
                    dispatch(AddMessageOfGroup({ ...res.data }));
                    ConnectSocket.onPressSendSocket(res.data);
                    dispatch(UpdateDataSendFile({
                        file: dataFileCopy[index],
                        value: 1
                    }))
                }
            } else {
                dispatch(AddMessageOfGroup({ ...dataFileCopy[index], isError: true, CreatedDate: new Date() }));
                dispatch(UpdateDataSendFile({
                    file: dataFileCopy[index],
                    value: 0
                }))

            }
        }

    };
};
const SetItemFileLoad = val => ({
    type: Types.SET_ITEM_FILE_LOAD,
    data: val
});
// SET_ITEM_FILE_LOAD

//SETISCHAT
const SetISCHAT = val => ({
    type: Types.SETISCHAT,
    data: val
});
const ApiGetInfoChat = idGroup => {
    return async dispatch => {
        ConnectSocket.logIn_LogOutToGroups();
        let res = await apiChat.get_Chat_InfoGroup(idGroup);
        // Utils.nlog("+===============aaaaaaaaaaaaaa", res)
        if (res.status == 1) {
            dispatch(ChangeInFoCurentGroup(res.data));
        } else {
            dispatch(ChangeInFoCurentGroup({}));
        }
    };
};
const ApiGet_ListGroupChat = (objectFilter = {}) => {
    const { page = 1, recore = 10, callback = () => { } } = objectFilter
    return async dispatch => {
        let res = await apiChat.GetList_Chat_DanhSachChatUser('', recore, page);
        callback();
        // Utils.nlog("giá trị danh sách chat --------", res)
        if (res.status == 1) {
            dispatch(SetList_GroupOfChat({ data: res.data, page: res.page }));
        } else {
            dispatch(SetList_GroupOfChat({ data: [], page: { Page: 0, AllPage: 0 } }));
        }
    };
};

const Set_ListIconChat = val => ({
    type: Types.SETICONCHAT,
    data: val
});

const Get_Api_ListIcon = () => {
    return async dispatch => {
        let res = await apiChat.GetList_IConChat();
        // Utils.nlog("gia tri res get list icon chat===============", res);
        if (res.status == 1 && res.data && res.data.length > 0) {
            dispatch(Set_ListIconChat(res.data[0].GroupsIcon));
        }
    };
};

const setListFile = val => ({
    type: Types.LIST_SENDFILE,
    data: val
});

const UpdateMessageFile = val => ({
    type: Types.UPDATE_MESSAGEFILE,
    data: val
});

// LIST_SENDFILE
const SendListFile = (dataFile = [], dataInFo, isList = true) => {
    // Utils.nlog('vao send file---------------000000000', dataFile);
    let { IdGroup, IsGroup } = dataInFo;
    return async dispatch => {
        if (isList == true) {
            dispatch(setListFile(dataFile.length));
            for (let index = 0; index < dataFile.length; index++) {
                let element = dataFile[index];
                // Utils.nlog('gia tri res ponse gửi element', element);
                let res = await apiChat.UploadFileData(element, IdGroup, IsGroup);
                // Utils.nlog('gia tri res ponse gửi file', res);
                if (res.status == 1) {
                    dispatch(UpdateMessageFile(res.data));
                }
            }
        } else {
            dispatch(setListFile(1));
            let res = await apiChat.UploadFileData(dataFile, IdGroup, IsGroup);
            // Utils.nlog('gia tri res ponse gửi file', res);
            if (res.status == 1) {
                dispatch(UpdateMessageFile(res.data));
            }
        }
    };
};

const RemoveMessege_Senkey = val => ({
    type: Types.REMOVEMESSAGE_SENKEY,
    data: val
});
const DeleteAllMessege = () => ({
    type: Types.DELETEALLMESSAGE
});
const SetEmptyAllMessege = () => ({
    type: Types.SETEMPTYMESSAGE
});
const SetStatusConnect = (data) => ({
    type: Types.STATUS_CONNECT,
    data: data
});
const SetStatusConnectRun = (data) => ({
    type: Types.STATUS_CONNECT_RUN,
    data: data
});


const SetStatus_Notify = (data) => ({
    type: Types.STATUS_NOTIFY,
    data: data
});
const AsyncDataChat = (data) => ({
    type: Types.ASYNCDDATA,
    data: data
});
const ActionChat = {
    //new
    ChangeIdMessageGroup,
    SetList_GroupOfChat,
    ChangeCurentGroup,
    SetListMessageOfGroup,
    ChangeIDMessageOfGroup,
    ChangeTypeMessageOfGroup,
    RemoveMessageByIDOfGroup,
    RemoveMessageBySenKeyOfGroup,
    DeleteAllMessageOfGroup,
    DataSynchonization,
    ApiGetCheckData,
    SendFileOfGroup,
    ApiCheckData,
    SetItemFileLoad,
    ChangeNewMessageOfGroup,

    // old,

    SetISCHAT,
    ApiGetInfoChat,
    ApiGet_ListGroupChat,
    Set_ListIconChat,
    Get_Api_ListIcon,
    setListFile,
    UpdateMessageFile,
    SendListFile,
    DeleteAllMessege,
    SetEmptyAllMessege,

    SetStatusConnect,
    SetStatusConnectRun,
    SetStatus_Notify,
    AsyncDataChat,
    AddMessageOfGroup



}
export default ActionChat