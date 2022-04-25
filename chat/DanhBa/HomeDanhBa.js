import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback
} from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';

import { nstyles, colors, sizes } from '../styles';
import TextInputChat from '../TextInputChat';
import { ListEmpty, IsLoading } from '../../components';
import Utils from '../../app/Utils';


import apiChat from '../api/apis';
import TextInputSearch from '../Search/TextInputSearch';
import HeaderChat from '../HeaderChat';
import { appConfig } from '../../app/Config';
import { nGlobalKeys } from '../../app/keys/globalKey';
import { NavigationEvents } from 'react-navigation';
import AppCodeConfig from '../../app/AppCodeConfig';
import { useDispatch, useSelector } from 'react-redux';
import ItemKetBan from './ItemKetBan';
const HomeDanhBa = props => {
  const [isMember, setisMember] = useState(true);
  const [textSearch, settextSearch] = useState('');
  const [onfocus, setonfocus] = useState(false);
  const [dataSearch, setdataSearch] = useState([]);
  const [dataGroup, setdataGroup] = useState([]);
  const [Refreshing, setRefreshing] = useState(false);
  const auth = useSelector(state => state.auth)
  const [dataInfo, setdataInfo] = useState(auth.userCHAT);
  const inPutRef = useRef(null);
  const refLoading = useRef(null)
  //flatlist
  const loadMore = async () => {
    //Utils.nlog("vao laod more", "1111")
  };
  const _Chat_TaoNhomChat = async (itemUser) => {
    let res = await apiChat.Chat_TaoNhomChat(itemUser);
    if (res.status == 1) {
      let item = res.data;
      props.ChangeCurentGroup(item.IdGroup);
      props.ApiGetInfoChat(item.IdGroup);
      props.navigation.navigate('sc_RoomChat', { IdGroup: item.IdGroup });
    }
  };
  const _AcctionTouch = (item, IdGroup) => {
    if (IdGroup == 0) {
      _Chat_TaoNhomChat(item);
    } else {
      props.ChangeCurentGroup(IdGroup);
      props.ApiGetInfoChat(IdGroup);
      props.navigation.navigate('sc_RoomChat', { IdGroup: IdGroup });
    }
  };

  const toggleCall = useCallback(() => {
    _loadDataSearch();
    setisMember(!isMember);
  }, [isMember]);
  const _renderItem = ({ item, index }) => {
    const { nrow } = nstyles.nstyles;
    const { Avata, TenPhuongXa = '', ChucVu } = item;
    return (
      <TouchableOpacity
        onPress={() => _AcctionTouch(item, item.IdGroup)}
        key={item.UserID}
        style={[_styles.item_container]}
      >
        <Image
          source={{ uri: `${Avata}` }}
          style={[{ width: 30, height: 30, borderRadius: 15 }]}
        ></Image>
        <View
          style={{
            backgroundColor: colors.white,
            paddingHorizontal: 10
          }}
        >
          <Text
            style={[_styles.iten_name]}
          >
            {item.FullName}
          </Text>
          <Text
            style={[_styles.item_namedonvi]}
          >
            {ChucVu ? `${ChucVu} - ` : ''}{TenPhuongXa}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  const _renderItemGroup = ({ item, index }) => {
    const { nrow } = nstyles.nstyles;
    const { Avata } = item;
    return (
      <TouchableOpacity
        onPress={() => _AcctionTouch(item.UserID, item.IdGroup)}
        key={item.UserID}
        style={{
          flexDirection: 'row',
          backgroundColor: colors.white,
          paddingHorizontal: 5,
          paddingVertical: 10
        }}
      >
        <Image
          source={{ uri: `${Avata}` }}
          style={[{ width: 30, height: 30, borderRadius: 15 }]}
        ></Image>
        <View
          style={{
            backgroundColor: colors.white,
            paddingHorizontal: 10
          }}
        >
          <Text
            style={{
              lineHeight: 20,
              fontSize: 16,
              paddingVertical: 5,
              borderRadius: 5,
              paddingHorizontal: 10
            }}
          >
            {item.GroupName}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  const _loadDataSearch = async (val = false) => {
    // refLoading.current.show()
    setRefreshing(true);
    if (val == true) {
      let res = await apiChat.GetList_Chat_DanhBaChatGroupUser(textSearch);
      // refLoading.current.hide()
      setRefreshing(false);
      if (res.status == 1) {
        setdataGroup(res.data);
      } else {
        setdataGroup([]);
      }
    }
    if (isMember) {
      let res = await apiChat.GetList_Chat_DanhBaChatUser(textSearch);
      // refLoading.current.hide()
      setRefreshing(false);
      if (res.status == 1) {
        setdataSearch(res.data);
      } else {
        setdataSearch([]);
      }
    } else {
      let res = await apiChat.GetList_Chat_DanhBaChatGroupUser(textSearch);
      // refLoading.current.hide()
      setRefreshing(false);
      if (res.status == 1) {
        setdataGroup(res.data);
      } else {
        setdataGroup([]);
      }
    }

  };

  useEffect(() => {
    _loadDataSearch(true);
  }, []);

  useEffect(() => {
    _loadDataSearch();
  }, [textSearch]);
  const _keyExtrac = (item, index) => index.toString();
  const _onRefresh = () => {
    _loadDataSearch(true);
  };
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
  const _onReFresh = () => { };
  const ViewFlatlistMember = useMemo(() => {
    //Utils.nlog("vao render 1")
    return (
      <FlatList
        // ref={refFlastlist}
        style={{ flex: 1, marginHorizontal: 10 }}
        scrollEventThrottle={10}
        // onScroll={.handleScroll}
        showsVerticalScrollIndicator={false}
        renderItem={_renderItem}
        data={dataSearch}
        extraData={dataSearch}
        ListEmptyComponent={<ListEmpty textempty={'....'} />}
        ItemSeparatorComponent={_ItemSeparatorComponent}
        keyboardShouldPersistTaps={'never'}

        keyExtractor={_keyExtrac}
        refreshing={Refreshing}

        onRefresh={_onRefresh}

        onEndReachedThreshold={0.3}
      />
    );
  }, [dataSearch]);
  const ViewFlatlistgroup = useMemo(() => {
    return (
      <FlatList
        // ref={refFlastlist}
        style={{ flex: 1, marginHorizontal: 1 }}
        scrollEventThrottle={10}
        // onScroll={.handleScroll}
        showsVerticalScrollIndicator={false}
        renderItem={_renderItemGroup}
        data={dataGroup}
        extraData={dataGroup}
        ListEmptyComponent={<ListEmpty textempty={'....'} />}
        ItemSeparatorComponent={_ItemSeparatorComponent}
        keyboardShouldPersistTaps={'never'}
        keyExtractor={_keyExtrac}
        refreshing={Refreshing}
        onRefresh={_onRefresh}
        onEndReachedThreshold={0.3}
      />
    );
  }, [dataGroup]);

  const _onPressGoBack = () => {
    props.navigation.navigate('sc_MainChat')
  };

  //end flastlist
  return (
    <View
      style={[
        nstyles.nstyles.ncontainer,
        { flex: 1, backgroundColor: 'white' }
      ]}
    >

      <HeaderChat
        onPressLeft={_onPressGoBack}
        Avata={dataInfo.Avata ? appConfig.domain + '/Upload/Avata/' + dataInfo.Avata : ''}
        onPressNoti={() => props.navigation.navigate('sc_DSKetBan')}
        isAddGroup={false}
        onAddMember={() => props.navigation.navigate('sc_KetBan')}
        textTitle={props.auth.userCHAT.FullName}
        isAddfriend={true}
      />
      <View
        style={{
          backgroundColor: colors.white,
          paddingHorizontal: 15,
          height: 50,
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
            placeholder={'Tìm kiếm'}
            autoFocus={true}
            onChangeText={text => settextSearch(text)}
          />
        </View>

      </View>
      <View
        style={[
          {
            flexDirection: 'row',
            borderRadius: 10,
            marginHorizontal: 15,
            marginVertical: 10
          }
        ]}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            alignItems: 'center',
            paddingVertical: 10,
            borderTopLeftRadius: 50,
            borderBottomLeftRadius: 50,
            // borderWidth: 1,
            justifyContent: 'center',
            borderColor: colors.black_20,
            backgroundColor: isMember ? colors.colorHeaderApp : colors.white,
            borderWidth: 0.5
          }}
          onPress={toggleCall}
        >
          <Text
            style={{
              fontSize: sizes.sizes.sText14,
              fontWeight: 'bold',
              color: isMember ? colors.white : colors.colorHeaderApp
            }}
          >
            {'Cá nhân'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 1,
            alignItems: 'center',
            paddingVertical: 10,
            borderTopRightRadius: 50,
            borderBottomRightRadius: 50,
            justifyContent: 'center',
            borderColor: colors.black_20,
            backgroundColor:
              isMember == false ? colors.colorHeaderApp : colors.white,
            borderWidth: 0.5
          }}
          onPress={toggleCall}
        >
          <Text
            style={{
              fontSize: sizes.sizes.sText14,
              fontWeight: 'bold',
              color: !isMember ? colors.white : colors.colorHeaderApp
            }}
          >
            {'Nhóm'}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1 }}>
        <NavigationEvents onDidFocus={_loadDataSearch} />

        {isMember == true ? (
          <>{ViewFlatlistMember}</>
        ) : (
            <>{ViewFlatlistgroup}</>
          )}
        <IsLoading ref={refLoading} />
      </View>
    </View>
  );
};
const mapStateToProps = state => ({
  auth: state.auth
});
const _styles = StyleSheet.create({
  item_container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingHorizontal: 5,
    paddingVertical: 5,
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
  }
})
export default Utils.connectRedux(HomeDanhBa, mapStateToProps, true)
