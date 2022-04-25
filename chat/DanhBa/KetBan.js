import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback
} from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';

import { nstyles, colors } from '../../styles';
import TextInputChat from '../TextInputChat';
import { ListEmpty } from '../../components';
import Utils from '../../app/Utils';
import { Images } from '../../srcAdmin/images';

import apiChat from '../api/apis';
import TextInputSearch from '../Search/TextInputSearch';
import HeaderChat from '../HeaderChat';
import { appConfig } from '../../app/Config';
import { nGlobalKeys } from '../../app/keys/globalKey';
import { reText } from '../../styles/size';
import { ImagesChat } from '../Images';
import AppCodeConfig from '../../app/AppCodeConfig';
import { useDispatch, useSelector } from 'react-redux';
import ListData from './data';
import ItemKetBan from './ItemKetBan';
import { Width } from '../../styles/styles';

const KetBan = props => {
  const [textSearch, settextSearch] = useState('');
  const [onfocus, setonfocus] = useState(false);
  const [dataSearch, setdataSearch] = useState([]);
  const [dataGroup, setdataGroup] = useState([]);
  const [AllPage, setAllPage] = useState(1);
  const [Page, setPage] = useState(1);
  const [Recore, setRecore] = useState(10);
  const [Refreshing, setRefreshing] = useState(false);
  const [onEnd, setonEnd] = useState(true);
  const inPutRef = useRef(null);
  const auth = useSelector(state => state.auth)
  const [dataInfo, setdataInfo] = useState(auth.userCHAT);
  const [listDonVi, setlistDonVi] = useState('')

  const loadMore = async () => {
    //Utils.nlog("vao laod more", "1111")
  };
  const _renderItem = ({ item, index }) => {
    const { nrow } = nstyles.nstyles;
    const { TenPhuongXa, ChucVu } = item
    return (
      <View
        key={item.UserID}
        style={[_styles.item_container]}
      >
        <Image
          source={{ uri: `${item.Avata}` }}
          style={[nstyles.nstyles.nAva80, {}]}
        ></Image>
        <View
          style={{
            backgroundColor: colors.white,
            paddingHorizontal: 10
          }}
        >
          <View style={{}}>
            <Text style={[_styles.iten_name]}>{item.FullName}</Text>
            <Text style={[_styles.item_namedonvi]}>{ChucVu ? `${ChucVu} - ` : ''}{TenPhuongXa}</Text>
          </View>
          {item.IsRequest == false ? (
            <TouchableOpacity
              onPress={() => _Chat_SendRequestFriend(item)}
              style={[_styles.item_button]} >
              <Text style={[_styles.item_textButton]}>
                {'Thêm bạn bè'}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={[_styles.item_button, { backgroundColor: colors.colorGrayBgr, }]}>
              <Text style={[_styles.item_textButton, { color: colors.white, }]} >
                {'Đã gửi kết bạn'}
              </Text>
            </View>
          )}
        </View>
      </View>

    );
  };
  const _loadDataSearch = async (_page = 1) => {
    if (appConfig.isAppTN) {
      let resapi = await apiChat.GetList_DonVi();
      if (resapi.status == 1 && resapi.data) {
        setlistDonVi(resapi.data);
      }
    } else {
      // Utils.nlog("list don vi la --------", resapi)
      setRefreshing(true);
      let res = await apiChat.GetList_Chat_FindNewFriends(
        textSearch,
        Recore,
        _page
      );
      // Utils.nlog("gá trị res------", res)
      if (res.status == 1) {
        let { page = {} } = res;
        if (_page == 1) {
          setPage(page ? page.Page : 1);
          setAllPage(page ? page.AllPage : 1);
          setdataSearch(res.data);
          setRefreshing(false);
        } else {
          if (page) {
            setPage(page.Page);
            setAllPage(page.AllPage);
          }
          setdataSearch(dataSearch.concat(res.data));
          setRefreshing(false);
        }
      } else {
        setRefreshing(false);
        Utils.showMsgBoxOK(
          { props: props },
          'Thông báo',
          res.error ? res.error.message : 'Lấy dữ liệu thất bại',
          'Xác nhận'
        );
      }
    }


  };
  const _loadMoreData = () => {
    if (Page < AllPage) {
      _loadDataSearch(Page + 1);
    }
  };

  useEffect(() => {
    _loadDataSearch(1);
  }, []);
  useEffect(() => {
    _loadDataSearch(1);
  }, [textSearch]);
  const _keyExtrac = (item, index) => index.toString();
  const _onRefresh = () => { };
  const _ItemSeparatorComponent = () => {
    return (
      <View
        style={{
          height: 5,
          backgroundColor: colors.white,
          alignSelf: 'center'
        }}
      />
    );
  };
  const _onReFresh = () => {
    _loadDataSearch(1);
  };
  const _Chat_SendRequestFriend = async item => {
    Utils.showMsgBoxYesNo(
      { props },
      'Thông báo',
      'Bạn có muốn gửi lời mời kết bạn không?',
      'Xác nhận',
      'Thoát',
      async () => {
        let res = await apiChat.Chat_SendRequestFriend(item);
        //Utils.nlog("gia tri res ket bạn--------------", res)
        if (res.status == 1) {
          Utils.showMsgBoxOK(
            { props },
            'Thông báo',
            'Đã gửi lời mời kết bạn !',
            'Xác nhận',
            () => {
              _loadDataSearch(1);
            }
          );
        } else {
          Utils.showMsgBoxOK(
            { props },
            'Thông báo',
            res.error ? res.error.message : 'Gửi kết bạn thất bại',
            'Xác nhận'
          );
        }
      },
      () => { }
    );
  };
  const _onPressGoBack = () => {
    props.navigation.goBack();
  };
  return (
    <View
      style={[
        nstyles.nstyles.ncontainer,
        { flex: 1, backgroundColor: colors.white }
      ]}
    >
      <HeaderChat
        onPressLeft={_onPressGoBack}
        Avata={dataInfo.Avata ? appConfig.domain + '/Upload/Avata/' + dataInfo.Avata : ''}
        isAddGroup={false}
        textTitle={'Danh bạ'}
        isAddfriend={false}
        isLeft={false}
        isBack={true}
        onAddMember={() => props.navigation.navigate('sc_KetBan')}
        onPressNoti={() => props.navigation.navigate('sc_DSKetBan')}
      />
      <View
        style={{
          backgroundColor: colors.white,
          marginBottom: 10,
          paddingHorizontal: 10,
          height: 60,
          paddingVertical: 5,
          flexDirection: 'row'
        }}
      >
        <View style={{ flex: 1 }}>
          <TextInputSearch
            isFocus={onfocus}
            onClear={() => settextSearch('')}
            ref={inPutRef}
            onBlur={() => setonfocus(false)}
            onFocus={() => setonfocus(true)}
            value={textSearch}
            placeholder={'Search'}
            autoFocus={true}
            onChangeText={text => settextSearch(text)}
          />
        </View>
        {onfocus ? (
          <TouchableOpacity
            onPress={() => _loadDataSearch(1)}
            style={{
              width: 50,
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 5
            }}
          >

            <Image
              source={ImagesChat.icpencil}
              style={[
                nstyles.nstyles.nIcon35,
                { tintColor: colors.peacockBlue, marginBottom: 3 }
              ]}
            ></Image>
          </TouchableOpacity>
        ) : null}
      </View>
      {
        appConfig.isAppTN ? <ScrollView style={{ flex: 1, paddingVertical: 0, backgroundColor: colors.BackgroundHome, }}>

          {
            listDonVi ? listDonVi.map((item, index) => {
              return <ItemKetBan key={index} item={item} index={index} nthis={{ props: props }} />
            }) : null
          }
        </ScrollView> : <View style={{ flex: 1, paddingVertical: 0, backgroundColor: colors.BackgroundHome, }}>
          <FlatList
            style={{ flex: 1, marginHorizontal: 10 }}
            scrollEventThrottle={10}
            showsVerticalScrollIndicator={false}
            renderItem={_renderItem}
            data={dataSearch}
            extraData={dataSearch}
            ListEmptyComponent={<ListEmpty textempty={'....'} />}
            ItemSeparatorComponent={_ItemSeparatorComponent}
            keyboardShouldPersistTaps={'handled'}
            keyExtractor={_keyExtrac}
            refreshing={Refreshing}
            onRefresh={_onReFresh}
            onEndReached={() => {
              _loadMoreData();
            }}
            onEndReachedThreshold={0.3}
          />
        </View>
      }



    </View>
  );
};

export default KetBan;
const _styles = StyleSheet.create({
  item_container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 5,
    elevation: 2,
    shadowOffset: {
      width: 1,
      height: 1
    },
    shadowRadius: 2,
    shadowOpacity: 0.3,
    shadowColor: colors.black_50,
    marginTop: 5,
    marginHorizontal: 1,
    borderColor: colors.black_11,
  },
  item_image: {
    width: 30, height: 30, borderRadius: 15
  },
  item_body: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 10, flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  iten_name: {
    flex: 1,
    lineHeight: 20, fontSize: 16,
    borderRadius: 5, paddingHorizontal: 10,
    fontWeight: 'bold'
  },
  item_namedonvi: {
    flex: 1,
    lineHeight: 20, fontSize: 16,
    borderRadius: 5, paddingHorizontal: 10,
    fontStyle: 'italic',
  },
  item_button: {
    backgroundColor: '#3582FD',
    padding: 10,
    borderRadius: 5,
    paddingHorizontal: 25,
    width: Width(40)
  },
  item_textButton: {
    fontSize: reText(14),
    textAlign: 'center',
    color: colors.white,
    fontWeight: 'bold'
  }

})
