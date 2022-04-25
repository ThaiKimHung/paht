import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Platform
} from 'react-native';
import HeaderChat from '../HeaderChat';
import { colors, nstyles } from '../styles';
import { ListEmpty } from '../../components';
import apiChat from '../api/apis';
import Utils from '../../app/Utils';
import { nGlobalKeys } from '../../app/keys/globalKey';
import { appConfig } from '../../app/Config';
import { reText } from '../../styles/size';
import { Width } from '../../styles/styles';
import moment from 'moment';
import { isIphoneX } from 'react-native-iphone-x-helper';
import AppCodeConfig from '../../app/AppCodeConfig';
import { useDispatch, useSelector } from 'react-redux';
const DanhSachKB = props => {
  const [dataKetBan, setdataKetBan] = useState([]);
  const [refreshing, setrefreshing] = useState(false);
  const _state = useSelector(state => state.auth)
  const [dataInfo, setdataInfo] = useState(_state.userCHAT);

  const _getDanhSachKetBan = async () => {
    setrefreshing(true);
    let res = await apiChat.GetList_Chat_RequestList();
    Utils.nlog("danh sách kết bạn-----------", res)
    if (res.status == 1) {
      // setrefreshing(false);
      setrefreshing(false);
      setdataKetBan(res.data);
    } else {
      setrefreshing(false);
    }
  };
  useEffect(() => {
    _getDanhSachKetBan();
    //didmount
  }, []);
  const Chat_UpdateStatusRequestFriend = async (type = 1, item) => {
    setrefreshing(true);

    // Type_FriendId: item.Type, Type_UserId: 1
    let body = { ...item, TypeRequest: type };
    Utils.nlog("giá tị item-------", body)
    let res = await apiChat.Chat_UpdateStatusRequestFriend(body);
    Utils.nlog("giá tị res update -------------", res)

    if (res.status == 1) {
      setrefreshing(false);
      _getDanhSachKetBan();
    } else {
      setrefreshing(false);
      Utils.showMsgBoxOK(
        { props },
        'Thông báo',
        res.error ? res.error.message : 'Thực hiện thất bại',
        'Xác nhận'
      );
    }
  };
  const loadMore = async () => {
    //Utils.nlog("vao laod more", "1111")
  };
  const _renderItem = ({ item, index }) => {
    const LenDate = item ?.CreatedDateString.length;
    const days = item ?.CreatedDateString.slice(0, 10);
    const time = item ?.CreatedDateString.slice(11, LenDate);
    const NgayHT = new Date();
    const timeHT = moment(NgayHT, 'HH:mm:ss').format('HH:mm:ss');
    const songay = moment(NgayHT, 'DD/MM/YYYY').diff(
      moment(days, 'DD/MM/YYYY'),
      'days'
    );
    const sophut = moment(timeHT, 'HH:mm:ss').diff(
      moment(time, 'HH:mm:ss'),
      'minutes'
    );
    const sogio = Math.floor(sophut / 60);
    var { IdPA } = item;
    const { nrow } = nstyles.nstyles;
    return (
      <View
        style={[
          {
            backgroundColor: 'white',
            flexDirection: 'row',
            paddingVertical: 10,
            flex: 1,
            borderRadius: 5,
            elevation: 2,
            shadowOffset: {
              width: 1,
              height: 1
            },
            shadowRadius: 2,
            shadowOpacity: 0.5,
            shadowColor: colors.black_50,
            marginHorizontal: 1,
            borderColor: colors.black_11,
            marginTop: 5
          }
        ]}
      >
        <View
          style={[
            {
              marginLeft: isIphoneX() || Platform.OS == 'android' ? 10 : 5,
              marginRight: isIphoneX() || Platform.OS == 'android' ? 15 : 0
            }
          ]}
        >
          <View style={[{}]}>
            <Image
              source={{ uri: `${item.Avata}` }}
              style={[nstyles.nstyles.nAva80, {}]}
            ></Image>
          </View>
        </View>
        <View style={{}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}
          >
            <Text allowFontScaling={false} style={[configstyle.styleTitle]}>
              {' '}
              {item.FullName ? item.FullName : '...'}
            </Text>
            <Text allowFontScaling={false} style={[configstyle.chat]}>
              {`${songay == 0 && sophut < 60
                ? `${sophut} phút trước`
                : sogio >= 1
                  ? `${sogio} giờ trước`
                  : songay >= 30
                    ? +Math.floor(songay / 30) + ' tháng trước'
                    : +songay + ' ngày trước'
                }`}
            </Text>
          </View>
          <View>
            <Text allowFontScaling={false}>
              {' '}
              {item.Email ? item.Email : '...'}
            </Text>
          </View>
          <View
            style={{ flexDirection: 'row', paddingVertical: 10, marginLeft: 5 }}
          >
            <TouchableOpacity
              onPress={() => Chat_UpdateStatusRequestFriend(1, item)}
              style={{
                backgroundColor: '#3582FD',
                padding: 10,
                borderRadius: 5,
                marginRight: 10,
                paddingHorizontal: 25
              }}
            >
              <Text
                style={{
                  fontSize: reText(14),
                  textAlign: 'center',
                  color: colors.white,
                  fontWeight: 'bold'
                }}
              >
                {'Chấp nhận'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Chat_UpdateStatusRequestFriend(2, item)}
              style={{
                backgroundColor: colors.colorGrayBgr,
                padding: 10,
                borderRadius: 5,
                paddingHorizontal: 50
              }}
            >
              <Text
                style={{
                  fontSize: reText(14),
                  textAlign: 'center',
                  color: colors.black,
                  fontWeight: 'bold'
                }}
              >
                {'Xoá'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const _keyExtrac = (item, index) => index.toString();

  const _ItemSeparatorComponent = () => {
    return (
      <View
        style={{
          height: 1.5,
          backgroundColor: colors.white,
          alignSelf: 'center'
        }}
      />
    );
  };

  const _onReFresh = () => {
    setrefreshing(true);
    _getDanhSachKetBan();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <HeaderChat
        Avata={dataInfo.Avata ? appConfig.domain + '/Upload/Avata/' + dataInfo.Avata : ''}
        isLeft={false}
        isBack={true}
        isRight={true}
        onPressLeft={() => Utils.goback({ props: props })}
        isAddGroup={false}
        textTitle={'Danh sách kết bạn'}
      />
      <View style={{ flex: 1, paddingBottom: 5, paddingVertical: 5 }}>
        <FlatList
          style={{ marginHorizontal: 10 }}
          showsVerticalScrollIndicator={false}
          renderItem={_renderItem}
          data={dataKetBan}
          extraData={dataKetBan}
          ListEmptyComponent={<ListEmpty textempty={'....'} />}
          ItemSeparatorComponent={_ItemSeparatorComponent}
          // ListHeaderComponent={_HeaderFlastlist}
          keyExtractor={_keyExtrac}
          refreshing={refreshing}
          onRefresh={_onReFresh}
          onEndReached={() => {
            loadMore();
          }}
          onEndReachedThreshold={0.3}
        />
      </View>
    </View>
  );
};

export default DanhSachKB;

const configstyle = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'white',
    flexDirection: 'row'
  },

  icLeft: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 0.5
    // padding: 5
  },
  icIconLeft: {
    // tintColor: 'black',
    borderRadius: 20,
    width: 40,
    height: 40
  },
  styleTitle: {
    flex: 1,
    fontSize: 14,
    color: 'black',
    fontWeight: 'bold'
  },
  chat: {
    color: 'gray'
  }
});
