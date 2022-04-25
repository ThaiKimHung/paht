import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, BackHandler, RefreshControl, TouchableOpacity } from 'react-native';
import { nstyles, colors } from './styles';
import TextInputChat from './TextInputChat';
import HeaderChat from './HeaderChat';
import { ListEmpty, IsLoading } from '../components';
import ItemDSChat from './ItemDSChat';
import Utils from '../app/Utils';
import { nGlobalKeys } from '../app/keys/globalKey';
import { appConfig } from '../app/Config';
import { NavigationEvents } from 'react-navigation';
import * as Animatable from 'react-native-animatable';
import { withNavigationFocus } from "react-navigation";
import AppCodeConfig from '../app/AppCodeConfig';
import { useDispatch, useSelector } from 'react-redux';
const HomeChat = props => {
  const [textSearch, settextSearch] = useState('');
  const [refreshing, setrefreshing] = useState(false);
  const [onEnd, setonEnd] = useState(true);
  const refLoading = useRef(null)
  const [IdGroup, setIdGroup] = useState(
    props.navigation.getParam('IdGroup', 0)
  );
  const auth = useSelector(state => state.auth)
  const [dataInfo, setdataInfo] = useState(auth.userCHAT);
  useEffect(() => {
    if (props.isLoading == false) {
      refLoading.current.hide();
    }
  }, [props.isLoading])

  useEffect(() => {
    //did mount
    BackHandler.addEventListener("hardwareBackPress", backAction);
    if (props.isLoading == true) {
      refLoading.current.show();
    }
    loadData();
    props.SetStatus_Notify(-1)
    //unmount
    return () => {
      props.SetStatus_Notify(1)
      BackHandler.removeEventListener("hardwareBackPress", backAction);
    }
  }, []);

  const backAction = () => {
    props.navigation.navigate('ManHinh_Home')
    return true;
  };
  const loadMore = async () => {
    const { objectdataGroup = {} } = props;
    const { page = {} } = objectdataGroup
    if (page && page.Page && page.AllPage && page.Page < page.AllPage) {
      const objectFilter = {
        page: page.Page + 1,
        recore: 10,
        callback: refLoading.current.hide
      }
      props.ApiGet_ListGroupChat(objectFilter);
    }
  };
  const _renderItem = ({ item, index }) => {
    const { nrow } = nstyles.nstyles;
    // Utils.nlog("render---------11111")
    return (
      <ItemDSChat
        key={index}
        data={item}
        onPress={() => {
          //new
          props.ChangeCurentGroup(item.IdGroup);
          props.ApiGetInfoChat(item.IdGroup);
          //old
          props.navigation.navigate('sc_RoomChat', {
            IdGroup: item.IdGroup,
            item: item
          });
        }}
      />
    );
  };
  const _keyExtrac = (item, index) => index.toString();

  const _onRefresh = async () => {
    // refLoading.current.show();
    setrefreshing(true)
    await loadData();
  };

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

  const loadData = useCallback(() => {
    const objectFilter = {
      page: 1,
      recore: 10,
      callback: () => setrefreshing(false)
    }
    props.ApiGet_ListGroupChat(objectFilter);

  });
  return (
    <View
      style={[
        nstyles.nstyles.ncontainer,
        { flex: 1, backgroundColor: 'white' }
      ]}
    >
      <NavigationEvents onDidFocus={_onRefresh} />
      <HeaderChat
        onPressLeft={() => props.navigation.navigate('ManHinh_Home')}
        Avata={dataInfo.Avata ? appConfig.domain + '/Upload/Avata/' + dataInfo.Avata : ''}
        onPressNoti={() => props.navigation.navigate('sc_DSKetBan')}
        onAddGroup={() => props.navigation.navigate('sc_addGroup')}
        textTitle={props.auth.userCHAT.FullName}
      />
      <View
        style={{
          backgroundColor: colors.white,
          paddingHorizontal: 10,
          paddingVertical: 5
        }}
      >
        {/* <Animatable.View animation={'slideInDown'}> */}
        <TouchableOpacity
          onPress={() => props.navigation.navigate('sc_Search')}
        >
          <View style={{}} pointerEvents="none">
            <TextInputChat
              editable={false}
              value={textSearch}
              placeholder={'Tìm kiếm'}
              placeholderTextColor={'rgba(177,177,177,1)'}
            />
          </View>

        </TouchableOpacity>
        {/* </Animatable.View> */}
      </View>
      <View style={{ flex: 1, paddingVertical: 5 }}>
        <FlatList
          style={{ flex: 1, marginHorizontal: 5 }}
          showsVerticalScrollIndicator={false}
          renderItem={_renderItem}
          data={props.objectdataGroup ? props.objectdataGroup.data : []}
          extraData={props.objectdataGroup.data}
          ListEmptyComponent={<ListEmpty textempty={'....'} />}
          ItemSeparatorComponent={_ItemSeparatorComponent}
          keyExtractor={_keyExtrac}
          refreshControl={<RefreshControl
            title="Đồng bộ "
            enabled={true}
            tintColor={colors.blueZalo}
            refreshing={refreshing}
            size={0}
            onRefresh={_onRefresh} />}
          onEndReached={() => {
            loadMore();
          }}
          onEndReachedThreshold={0.3}
        />
        <IsLoading ref={refLoading} />
      </View>
    </View>
  );
};
const mapStateToProps = state => ({
  objectdataGroup: state.ReducerGroupChat.ObjectListGroup,
  isLoading: state.ReducerGroupChat.isLoading,
  auth: state.auth
});

export default Utils.connectRedux(withNavigationFocus(HomeChat), mapStateToProps, true);



