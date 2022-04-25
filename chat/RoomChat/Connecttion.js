import { nGlobalKeys } from '../../app/keys/globalKey';
import Utils from '../../app/Utils';
import {

  DeleteAllMessege,

  SetStatusConnect,
  AsyncDataChat,
  SetStatusConnectRun,
  ChangeIdMessageGroup,
  ChangeIDMessageOfGroup,
  Get_Api_ListIcon
} from '../../srcRedux/actions';
import { store } from '../../srcRedux/store';
import dataSocket from './dataSocket';
import apiChat from '../api/apis';
import ActionChat from '../redux/action';

const { connection, proxy, CreateNewConect } = dataSocket;

var tryingToReconnect = false;

let tempState = 0;
let iLogin = 0;
var MessageCurent = {};
var PropAction = null
//----------EVENT LISTEN----------

// LogInToGroups -> LogInToGroups_CuDan
// LogoutToGroups-> LogoutToGroups_CuDan
// AddToGroup-> AddToGroup_CuDan
// SendMessage-> SendMessage_CuDan
// Đợi Dung publish xong em, App cư dân em đổi sang sử dung các hàm tương ứng này nha
//end
const initConnection = () => {
  proxy().on('addNewMessageToPage', (resData: any) => { }); // Phải có ít nhất 1 hàm proxy().on() nếu không không nhận được connection().recieved() thành công
  // proxy().on('changeStatusJoinGroups', (resData: any) => { });
  // proxy().on('notifily', resData => { });
  // store.dispatch(SetStatusConnectRun(`${tryingToReconnect}-${tempState}-${iLogin}`));
  connection().reconnecting(function () {
    tryingToReconnect = true;
    tempState = 0;
    store.dispatch(SetStatusConnectRun(`${tryingToReconnect}`));
    // Utils.nlog('connecting......');
  });

  connection().reconnected(function () {
    tempState = 1;
    store.dispatch(SetStatusConnectRun(`${tryingToReconnect}`));
    // Utils.nlog('.......connected');
  });

  connection().received(async (e) => {
    const { status, statusrun } = store.getState().DataChat;
    if (status != 1) {
      store.dispatch(SetStatusConnect(1));
    }
    Utils.nlog('received........aaaaaa', e);
    const { H, M, A } = e;
    switch (e.M) {
      case 'messageSendStatus':
        {
          let res = A[0];
          if (res.status == 1) {
            MessageCurent = res.data;
            let IdCurrentGroup = store.getState().ReducerGroupChat.IdGroup
            Utils.nlog("id_group---", IdCurrentGroup)
            if (A[0].data.IdGroup == IdCurrentGroup) {
              // new 
              store.dispatch(ActionChat.ChangeIDMessageOfGroup({ ...A[0].data }));
            } else {
            }
          } else {
            Senkey = res.data;
            let DataMessage = store.getState().ReducerGroupChat.DataMessage
            if (DataMessage && DataMessage.length > 0) {
              let messageCheck = DataMessage.find(item => item.SendKey == Senkey);
              if (messageCheck) {
                onPressCheckSendMessage(messageCheck)
              }
            }
          }

        }
        break;
      case 'messageReceived': {
        // Utils.nlog("vao ---------01010101010101")
        const idUser = await store.getState().auth.userCHAT.Id;
        const loginToken = await store.getState().auth.tokenCHAT;
        const IdCurrentGroup = await store.getState().ReducerGroupChat.IdGroup
        let dataREs = JSON.parse(A[0]);
        if (dataREs.data.IdGroup == IdCurrentGroup) {
          let { SendKey = '' } = dataREs.data;
          let checktoken = false;
          if (SendKey.length > 0) {
            checktoken = SendKey.split('.')[0].toString() == loginToken;
          }

          if (dataREs.data.UserID != idUser || !checktoken == true) {
            if (dataREs.data.AlowIsDelAll == true) {
              //new
              store.dispatch(ActionChat.DeleteAllMessageOfGroup(IdCurrentGroup))
            } else if (
              dataREs.data.IsDelAll == true ||
              dataREs.data.IsHidenAll == true
            ) {
              //new 
              store.dispatch(ActionChat.RemoveMessageByIDOfGroup(dataREs.data))
            } else {
              MessageCurent = dataREs.data;
              store.dispatch(ActionChat.AddMessageOfGroup(dataREs.data));
              store.dispatch(ActionChat.ChangeNewMessageOfGroup(dataREs.data));

            }
          } else {

            if (dataREs.data.AlowIsDelAll == true) {
              store.dispatch(ActionChat.DeleteAllMessageOfGroup(IdCurrentGroup))
            } else if (
              dataREs.data.IsDelAll == true ||
              dataREs.data.IsHidenAll == true
            ) {
              store.dispatch(ActionChat.RemoveMessageByIDOfGroup(dataREs.data))
            } else {

              // store.dispatch(ActionChat.ChangeIDMessageOfGroup(dataREs.data));
            }
          }
        } else {
          store.dispatch(ActionChat.ChangeNewMessageOfGroup(dataREs.data));
        }

        break;
      }
      case "messageGroupReceived": {
        Utils.nlog("vao chỗ này ------------------(", A[0] + ')')
        let dataREs = JSON.parse(A[0]);
        const { userCHAT = {}, TypeUserChat, multiTypeUserChat = false } = store.getState().auth.userCHAT;
        const { idUser, Id } = userCHAT;
        if (multiTypeUserChat) {
          if (dataREs.data && dataREs.data.UserID != idUser && dataREs.data.Type != TypeUserChat) {
            store.dispatch(ActionChat.AddMessageOfGroup(dataREs.data));
          }
        } else {
          if (dataREs.data && dataREs.data.UserID != idUser) {
            store.dispatch(ActionChat.AddMessageOfGroup(dataREs.data));
          }
        }


        break;
      }
      default:
        break;
    }
  });
  connection().stateChanged(state => {
    Utils.nlog('stateChanged......', state);
    const { oldState, newState } = state;
    store.dispatch(SetStatusConnect(newState));
    if (newState == 4) {
      KetNoi()
    }
  });

  connection().disconnected(e => {
    store.dispatch(SetStatusConnect(0))
    iLogin = 1;
    tempState = -1;
    if (tryingToReconnect) {
      setTimeout(() => {
        tempState = '00';
        store.dispatch(
          SetStatusConnectRun(`${tryingToReconnect}`)
        );
        KetNoi('ConnectToken');
      }, 5000);
    }
  });

  connection().error((error) => {
    // store.dispatch(SetStatusConnect(4));
    const errorMessage = error.message;
    let detailedError = '';
    if (error.source && error.source._response) {
      detailedError = error.source._response;
    }
    if (detailedError === 'An SSL error has occurred and a secure connection() to the server cannot be made.') {
      console.log('When using react-native-signalr on ios with http remember to enable http in App Transport Security https://github.com/olofd/react-native-signalr/issues/14')
    }
    console.debug('SignalR error:1 ' + errorMessage, detailedError)
  });
  //------------------------------
}
const KetNoi = async (method = 'ConnectToken', tryHard = false) => {

  Utils.nlog("[[ketnoi]", connection())
  const { status, statusrun } = await store.getState().DataChat;
  // Utils.nlog("==================connect---------------", connection(), statusrun, status)
  if (((status != 1 && (statusrun == false || statusrun == 'false')) || tryHard)) {
    connection()
      .start()
      .done(() => {
        tempState = 2;
        tryingToReconnect = false;
        store.dispatch(
          SetStatusConnectRun(`${tryingToReconnect}`)
        );
        KetNoiProxy('ConnectToken');
        store.dispatch(Get_Api_ListIcon());
      })
      .fail(() => {
        tempState = -2;
        store.dispatch(
          SetStatusConnectRun(`${tryingToReconnect}`)
        );
        console.log('----------------------Faileconect----------------');
      }, 3000);
  } else {
    KetNoiProxy('ConnectToken');
  }

  //get list icon ban đầu khi khởi tạo kết nối
  // store.dispatch(Get_Api_ListIcon());

}

async function KetNoiProxy(method = 'ConnectToken') {
  Utils.nlog("[[ketnoi-proxy]", proxy())
  const { userCHAT = {}, tokenCHAT = '' } = await store.getState().auth
  const idUser = userCHAT.Id;
  const loginToken = tokenCHAT;
  if (idUser && loginToken) {
    const bodyUser = { Token: loginToken, idUser: idUser };
    try {
      proxy()
        .invoke(method, JSON.stringify(bodyUser))
        .done(res => {
          console.log('KetNoiProxy----------------------KetNoiProxy----------------', bodyUser);
          tempState = 3;
          store.dispatch(
            SetStatusConnectRun(`${tryingToReconnect}`)
          );
          logIn_LogOutToGroups(false);
        })
        .fail(error => {
          tempState = -3;
          store.dispatch(
            SetStatusConnectRun(`${tryingToReconnect}`)
          );
          console.log('Could not connect ' + error);
          setTimeout(() => {
            KetNoiProxy('ConnectToken');
          }, 3000);
        });

    } catch (error) {
      return false
    }

  }

}

async function logIn_LogOutToGroups(isLogout = false) {

  const { userCHAT = {}, tokenCHAT = '', TypeUserChat = '0', multiTypeUserChat = false } = await store.getState().auth
  const idUser = userCHAT.Id;
  const loginToken = tokenCHAT;
  const objectPakeg = multiTypeUserChat ? { Type: TypeUserChat } : {}
  const bodyUser = { Token: loginToken, idUser: idUser, IsApp: true, ...objectPakeg };
  // console.log('Login---------------------logIn_LogOutToGroups', bodyUser);
  try {
    proxy()
      .invoke(
        !isLogout ? 'LogInToGroups' : 'LogInToGroups',
        JSON.stringify(bodyUser)
      )
      .done(res => {
        tempState = 4;
        if (iLogin == 1)
          iLogin = 2;
        store.dispatch(
          SetStatusConnectRun(`${tryingToReconnect}`)
        );
        store.dispatch(ActionChat.ApiGetCheckData())
        // console.log('Login---------------------done', bodyUser);
      })
      .fail(error => {
        tempState = -4;
        store.dispatch(
          SetStatusConnectRun(`${tryingToReconnect}`)
        );
        setTimeout(() => {
          logIn_LogOutToGroups(false);
        }, 3000);
        console.log('Login_out-error:', error);
      });
  } catch (error) { }
}



async function onPressSendSocket(mess) {

  // if (checkKetNoi()) {
  const { userCHAT = {}, tokenCHAT = '', TypeUserChat = '0', multiTypeUserChat = false } = await store.getState().auth
  const idUser = userCHAT.Id;
  const loginToken = tokenCHAT;
  const objectPakeg = multiTypeUserChat ? { Type: TypeUserChat } : {};
  const bodyUser = { Token: loginToken, idUser: idUser, IsApp: true, ...objectPakeg };
  console.log('SendMessage -----------message', mess);
  try {
    proxy()
      .invoke('SendMessage', JSON.stringify(bodyUser), JSON.stringify(mess))
      .done(directResponse => {
        console.log('SendMessage good', mess);
      })
      .fail(e => {
        let data = JSON.parse(mess);
        console.log('SendMSG-error', e);
      });
  } catch (error) { }
  // } else {
  //   KetNoi("ConnectToken", true);
  // }


}
async function onPressCheckSendMessage(mess) {

  if (checkKetNoi()) {
    const { userCHAT = {}, tokenCHAT = '', TypeUserChat = '0', multiTypeUserChat = false } = await store.getState().auth
    const idUser = userCHAT.Id;
    const loginToken = tokenCHAT;
    const objectPakeg = multiTypeUserChat ? { Type: TypeUserChat } : {};
    const bodyUser = { Token: loginToken, idUser: idUser, IsApp: true, ...objectPakeg };
    mess = { ...mess, CreatedDate: new Date() }
    // console.log('CheckSendMessage -----------message', bodyUser, mess);
    try {
      proxy()
        .invoke('CheckSendMessage', JSON.stringify(bodyUser), JSON.stringify(mess))
        .done(directResponse => {

        })
        .fail(e => {
          console.log('CheckSendMessage-error', e);
        });
    } catch (error) {
    }
  } else {
    KetNoi("ConnectToken", true);
  }

}
function SetMessageCurent(val = {}) {
  MessageCurent = val;
}
function setProp(val = {}) {
  PropAction = val;
}
const checkKetNoi = async () => {

  const { userCHAT = {}, tokenCHAT = '', TypeUserChat = '0', multiTypeUserChat = false } = await store.getState().auth
  const idUser = userCHAT.Id;
  const loginToken = tokenCHAT;
  if (idUser && loginToken) {

    const objectPakeg = multiTypeUserChat ? { Type: TypeUserChat } : {};
    const bodyUser = { Token: loginToken, idUser: idUser, IsApp: true, ...objectPakeg };
    // const bodyUser = { Token: loginToken, idUser: idUser };
    proxy()
      .invoke('ConnectToken', JSON.stringify(bodyUser))
      .done(directResponse => {
        return true
      })
      .fail(e => {

        return false
      });
  } else {
    return false
  }


}
//
const ConnectSocket = {
  initConnection,
  logIn_LogOutToGroups,
  onPressSendSocket,
  onPressCheckSendMessage,
  KetNoi,
  SetMessageCurent,
  setProp,
  checkKetNoi
};

export default ConnectSocket;
