import React, {
  Component,
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import {
  Text,
  View,
  KeyboardAvoidingView,
  SafeAreaView,
  FlatList,
  Image,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  AppState, Alert, BackHandler
} from 'react-native';
import { nstyles, colors } from '../styles';
import HeaderChat from '../HeaderChat';
import InputChat from '../InPutChat';
import Utils, { icon_typeToast } from '../../app/Utils';
import { nGlobalKeys } from '../../app/keys/globalKey';
import apiChat from '../api/apis';
import { ListEmpty, IsLoading } from '../../components';
import ItemChat from './ItemChat';
import { ImagesChat } from '../Images';
import ItemFW from './ItemFW';
import ConnectSocket from './Connecttion';
import * as Animatable from 'react-native-animatable';
import { reText } from '../../styles/size';
import { Height } from '../../styles/styles';
import { ScrollView } from 'react-native-gesture-handler';
import moment from 'moment';
import AppCodeConfig from '../../app/AppCodeConfig';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { PulseIndicator } from 'react-native-indicators';
let checkdem = 1;
const RoomChat = props => {
  const { status, statusrun } = props.objectData
  const [idUser, setidUser] = useState(Utils.getGlobal(nGlobalKeys.Id_user, '', AppCodeConfig.APP_ADMIN));
  const { TypeUserChat = 0 } = props.auth
  const [appState, setappState] = useState(AppState.currentState);
  const { IdGroup } = props.InFoGroup
  const [MessageForwar, setMessageForwar] = useState('');
  // const [message, setmessage] = useState('');
  const [onEnd, setonEnd] = useState(true);
  const refFlastlist = useRef(null);
  const [refeshing, setrefeshing] = useState(false);
  const [showStatus, setshowStatus] = useState(true)
  const refLoading = useRef(null)
  const [oldId, setoldId] = useState(0);
  const [checkNgay, setcheckNgay] = useState('01/01/1999');
  const [dataChat, setdataChat] = useState([]);
  const isFirstRun = useRef(true);

  const _getDuLieuchat = async (IdChat = 0) => {
    // alert(1)
    setrefeshing(true);
    let res = await apiChat.Chat_GetCommentsChatOfGroup(IdGroup, IdChat);
    Utils.nlog("vao load more", res);
    setrefeshing(false);
    const { status, data = [], error } = res;
    if (status && status == 1) {
      setoldId(IdChat);
      if (!props.DataMessage || (props.DataMessage && props.DataMessage.length == 0)) {
        if (IdChat == 0) {
          // Utils.nlog("IDGroup================1", IdGroup)
          props.SetListMessageOfGroup(data.reverse())
        } else {
          // Utils.nlog("IDGroup================2", IdGroup)
          if (IdChat != oldId) {
            props.SetListMessageOfGroup(props.DataMessage.concat(data.reverse()))
          }
        }
      } else {
        // Utils.nlog("IDGroup================3-3", IdGroup)
        if (IdChat == 0) {
          // Utils.nlog("IDGroup================3", IdGroup)
          props.ApiGetCheckData(IdGroup, props.DataMessage || [], data || [])
        }
        //mega dữ liệu nếu đã có dữ liệu cũ
      }
    } else {
      // Utils.nlog("IDGroup================4-4", IdGroup)
      if (IdChat == 0) {
        // Utils.nlog("IDGroup================4", IdGroup)
        props.SetListMessageOfGroup([])
      }
    }
  };
  const backAction = () => {
    props.navigation.goBack()
    return true;
  };
  //bắt sự kiện loading
  useEffect(() => {
    if (!isFirstRun) {
      if (props.isLoading) {
        refLoading.current.show()
      } else {
        refLoading.current.hide()
      }
    }
  }, [props.isLoading])

  // bắt didmount
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      BackHandler.addEventListener("hardwareBackPress", backAction);
      //set Biến báo chat
      props.SetISCHAT(true);
    }
    //bắt unmount
    return () => {
      props.SetISCHAT(false);
      props.ChangeCurentGroup(-1);
      props.DeleteAllMessege();
      BackHandler.removeEventListener("hardwareBackPress", backAction);
    };

  }, []);
  useEffect(() => {
    // Utils.nlog("vao load =============33333");
    if (IdGroup && IdGroup != -1) {
      _getDuLieuchat();
    }
  }, [props.InFoGroup.IdGroup])
  //load more data chat-===========================================
  const loadMore = async () => {
    // Utils.nlog("vao load more");
    if (props.DataMessage && props.DataMessage.length > 0) {
      let newId = props.DataMessage[props.DataMessage.length - 1].IdChat
      if (oldId != newId) {
        _getDuLieuchat(newId);
      }
    }
  };

  //sự kiện nhấn vào message mở acction edit tin nhắn ==============
  const onLongPress = (e, isTimeOut = false, item) => {
    Utils.goscreen({ props }, 'modal_Edit', {
      item: {
        ...item,
        ToadoY: e.nativeEvent.pageY - 50 - e.nativeEvent.locationY,
        isUserSend: item.UserID == props.auth.userCHAT.Id ? true : false
      },
      ActionForward: ActionForward,
      setMessageForwar: setMessageForwar,
      TimeOut: isTimeOut
    });
  };
  //render item tin nhắn ==========================================
  const _renderItem = ({ item, index }) => {
    var { avata } = item;
    const { nrow } = nstyles.nstyles;
    return (
      <ItemChat
        itemOld={props.DataMessage[index + 1] ? props.DataMessage[index + 1] : ''}
        item={item}
        itemNext={props.DataMessage[index - 1] ? props.DataMessage[index - 1] : ''}
        index={index}
        idUser={props.auth.userCHAT.Id}
        InFoGroup={props.InFoGroup}
        type={props.auth.TypeUserChat}
        onLongPress={(e, isTimeOut) => {
          onLongPress(e, isTimeOut, item);
        }}
        multiTypeUserChat={props.auth.multiTypeUserChat}
        goscreen={(router, param) => Utils.goscreen({ props }, router, param)}
      ></ItemChat>
    );
  };
  //key cho flatlist ===============================================
  const _keyExtrac = (item, index) => {
    if (item.IdChat) {
      return item.IdChat.toString();
    } else {
      return item.SendKey.toString();
    }
  }

  const _ItemSeparatorComponent = e => {
    const { leadingItem } = e;
    let index = props.DataMessage.findIndex(
      item => item.IdChat == leadingItem.IdChat
    );
    if (props.DataMessage && props.DataMessage.length > 0) {
      if (
        index != -1 &&
        index + 1 <= props.DataMessage.length && props.DataMessage[index] && props.DataMessage[index].CreatedDate && props.DataMessage[index + 1].CreatedDate && props.DataMessage[index + 1] &&
        moment(new Date(props.DataMessage[index].CreatedDate)).format('DD/MM/YYYY') !=
        moment(new Date(props.DataMessage[index + 1].CreatedDate)).format(
          'DD/MM/YYYY'
        )
      ) {
        return (
          <View
            style={{

              backgroundColor: colors.white,
              alignSelf: 'center',
              marginVertical: 15,
              backgroundColor: colors.black_20,
              paddingHorizontal: 10, borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Text style={{ fontSize: reText(15), color: colors.white }}>
              {` ${props.DataMessage[index] ? moment(props.DataMessage[index].CreatedDate).format(
                'DD/MM/YYYY'
              ) : ''} `}
            </Text>
          </View>
        );
      } else {
        return (
          <View
            style={{
              height: 2,
              backgroundColor: colors.white,
              alignSelf: 'center'
            }}
          ></View>
        );
      }
    }


    // Utils.nlog("giá tị ---------_ItemSeparatorComponent", e)
  };
  //sự kiện gửi meessage cho web socket =======================================
  const onPressSend = (message = '') => {
    let loginToken = props.auth.tokenCHAT;
    let SendKey = new Date().getTime();
    try {

      let chatinfo = {
        IdChat: 0,
        IdGroup: IdGroup,
        UserID: props.auth.userCHAT.Id,
        Comment: message,
        PathFile: '',
        IsDelAll: false,
        IsHidenAll: false,
        TypeFile: 0,
        TenFile: '',
        IsVideoFile: false,
        CreatedDate: new Date(),
        IdChatReplay: MessageForwar ? MessageForwar.IdChat : 0,
        IconChat: 0,
        FileUpload: null,
        IsGroup: false,
        SendKey: `${loginToken}.${SendKey}`,
        ComentParent: MessageForwar,
        Type: TypeUserChat
      };
      //   Utils.nlog('gias trij message-------', chatinfo, ms);
      props.AddMessageOfGroup({ SendKey: `${loginToken}.${SendKey}`, ...chatinfo, ComentParent: MessageForwar });

      // setmessage('');
      if (MessageForwar) {
        setMessageForwar('');
      }
      ConnectSocket.onPressSendSocket(chatinfo);
    } catch (error) { }
  };
  //sự kiện gửi icon meessage cho web socket =======================================
  const onPressSendIcon = item => {
    let loginToken = props.auth.tokenCHAT;
    let SendKey = new Date().getTime();
    try {
      var chatinfo = {
        IdChat: 0,
        IdGroup: IdGroup,
        UserID: props.auth.userCHAT.Id,
        Comment: '',
        PathFile: '',
        IsDelAll: false,
        IsHidenAll: false,
        TypeFile: 0,
        TenFile: '',
        IsVideoFile: false,
        CreatedDate: new Date(),
        IdChatReplay: MessageForwar ? MessageForwar.IdChat : 0,
        IconChat: item.IdIcon,
        FileUpload: null,
        IsGroup: false,
        SendKey: `${loginToken}.${SendKey}`,
        Type: 1
      };

      props.AddMessageOfGroup({
        ...chatinfo,
        PathIcon: item.PathIcon,
        TypeFile: 0

      });

      if (MessageForwar) {
        setMessageForwar('');
      }
      ConnectSocket.onPressSendSocket(chatinfo);
    } catch (error) { }
  };
  //sự kiện send file
  const SendFile = chatinfo => {
    let SendKey = new Date().getTime();
    try {
      props.AddMessageOfGroup({ SendKey: `${loginToken}.${SendKey}`, ...chatinfo });
      // setmessage('');
      ConnectSocket.onPressSendSocket(chatinfo);
    } catch (error) { }
  };
  //hành động trả lời 1 tin nhắn trong group =================================
  const ActionForward = (IdChat, IsDelAll = false, IsHidenAll = false) => {
    let loginToken = props.auth.tokenCHAT;
    let SendKey = new Date().getTime();
    try {
      let chatinfo = {
        IdChat: IdChat,
        IdGroup: IdGroup,
        UserID: props.auth.userCHAT.Id,
        Comment: '',
        PathFile: '',
        IsDelAll: IsDelAll,
        IsHidenAll: IsHidenAll,
        TypeFile: 0,
        TenFile: '',
        IsVideoFile: false,
        CreatedDate: new Date(),
        IdChatReplay: 0,
        IconChat: 0,
        FileUpload: null,
        IsGroup: false,
        SendKey: `${loginToken}.${SendKey}`,
        Type: 1
      };
      props.AddMessageOfGroup({ SendKey: `${loginToken}.${SendKey}`, ...chatinfo });
      // setmessage('');

      ConnectSocket.onPressSendSocket(chatinfo);
    } catch (error) { }
  };
  //hàm quay lại ===================================================
  const _onPressGoBack = async () => {
    await props.DeleteAllMessege();
    props.navigation.goBack();
  };
  //View flast list để chống render ================================

  const ViewSendfile = useMemo(() => {
    return props.DataFileSend.length > 0 ? (
      <View
        style={{
          height: 50,
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <View style={{ paddingHorizontal: 10 }}>
          <Image
            source={ImagesChat.icDinhkem}
            style={[{ width: 20, height: 20, borderRadius: 15 }]}
          ></Image>
        </View>
        <Text
          style={{ fontSize: 14, color: 'black' }}
        >{`Có ${props.DataFileSend.length} file đang được load để gửi ...`}</Text>
      </View>
    ) : null;
  }, [props.DataFileSend]);
  //hành động edit group chat ====================================================
  const _onPressEdit = e => {
    // Utils.nlog('e--------e.nativeEvent.pageY', e.nativeEvent);
    Utils.goscreen({ props }, 'modal_EditMember', {
      item: {
        ToadoY: e.nativeEvent.pageY,
        ...props.InFoGroup,
        isGroup: props.InFoGroup.IsGroup
      }
    });
  };
  //hành động mở camera =======================================================
  const onPressCamera = () => {
    Utils.goscreen({ props }, 'Modal_TakeCameraChat');
  };
  const _onPressIconChat = () => {
    Utils.goscreen({ props }, 'Modal_IconChat', {
      onPressSendIcon: onPressSendIcon
    });
  };
  const CheckShowStatus = () => {
    checkdem++
    if (checkdem % 5 == 0) {
      setshowStatus(!showStatus)
    }
  }
  return (
    <View style={{ flex: 1, paddingBottom: getBottomSpace() }}>
      <View>
        <HeaderChat
          Avata={props.InFoGroup.Avata || ''}
          onPressAvata={CheckShowStatus}
          isLeft={false}
          isBack={true}
          textTitle={props.InFoGroup.GroupName}
          onPressLeft={_onPressGoBack}
          isEditMember={true}
          isAddGroup={false}
          onPressNoti={() => props.navigation.navigate('sc_DSKetBan')}
          onPressEdit={_onPressEdit}
          viewStatus={
            <View
              style={{
                paddingVertical: 5,
                position: 'absolute', top: -15,
                alignItems: 'center', justifyContent: 'center',
                right: -5
              }}>
              <PulseIndicator
                color={status == 1 ? colors.greenFE : colors.yellowishOrange}
                size={20} count={15} />
            </View>
          }
        />
      </View>
      <SafeAreaView
        style={[
          nstyles.nstyles.ncontainer,
          { flex: 1, backgroundColor: colors.white }
        ]}
      >
        <View style={{ flex: 1, }}>

          {
            props.DataMessage ? <FlatList
              ref={refFlastlist}
              style={{
                flex: 1,
                paddingHorizontal: 10,
                backgroundColor: 'white',
              }}
              scrollEventThrottle={10}
              showsVerticalScrollIndicator={false}
              renderItem={_renderItem}
              data={props.DataMessage}
              extraData={props.DataMessage}
              ListEmptyComponent={
                <ListEmpty isrotate={true} textempty={'....'} />
              }
              ItemSeparatorComponent={_ItemSeparatorComponent}
              inverted={true}
              keyExtractor={_keyExtrac}
              // refreshing={refeshing}
              // onRefresh={_onRefresh}
              onEndReached={(e) => {
                Utils.nlog("load morre", e)
                loadMore();
              }}

              onEndReachedThreshold={0.5}
              ListFooterComponent={
                <>{refeshing == true ? <ActivityIndicator size="small" /> : null}</>
              }
            /> : null
          }

          <IsLoading ref={refLoading} />

        </View>
      </SafeAreaView >
      <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
        <Animatable.View animation={'slideInUp'} >
          <InputChat
            onChooseImgae={() =>
              Utils.goscreen({ props }, 'Modal_FileChat', {
                SendFile: SendFile
              })
            }
            onPressSend={onPressSend}
            onPressCamera={onPressCamera}
            onPressIconChat={_onPressIconChat}
            // autoFocus={true}
            // value={message}
            ViewProps={
              MessageForwar ? (
                <View
                  style={{
                    paddingHorizontal: 10,
                    width: '100%',
                    maxHeight: Height(25),
                    backgroundColor: 'rgba(0,0,0,0.1)'
                  }}
                >
                  <ScrollView>
                    <Text
                      style={{
                        fontSize: reText(10),
                        fontWeight: 'bold',
                        paddingVertical: 5
                      }}
                    >{`Đang trả lời:`}</Text>
                    <View style={{ flexDirection: 'row' }}>
                      <View style={{ flex: 1, paddingVertical: 10 }}>
                        <ItemFW
                          item={MessageForwar}
                          idUser={props.auth.userCHAT.Id}
                          goscreen={(router, param) =>
                            Utils.goscreen({ props }, router, param)
                          }
                        ></ItemFW>
                      </View>
                      <TouchableOpacity
                        onPress={() => setMessageForwar('')}
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          paddingHorizontal: 10,
                          marginLeft: 10
                        }}
                      >
                        <Image
                          source={ImagesChat.icCloseBlack}
                          style={[{ width: 20, height: 20 }]}
                        ></Image>
                      </TouchableOpacity>
                    </View>
                  </ScrollView>
                </View>
              ) : null
            }
          // onChangeText={text => setmessage(text)}
          ></InputChat>
        </Animatable.View >
      </KeyboardAvoidingView >
    </View >
  );
};
const mapStateToProps = state => ({
  DataFileSend: state.ReducerGroupChat.DataFileSend,
  objectData: state.DataChat,
  DataMessage: state.ReducerGroupChat.DataMessage,
  InFoGroup: state.ReducerGroupChat.InFoGroup,
  auth: state.auth,
  isLoading: state.ReducerGroupChat.isLoading
});

export default Utils.connectRedux(RoomChat, mapStateToProps, true);



