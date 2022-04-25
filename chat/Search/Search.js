import React, { useState, useRef, useEffect } from 'react'
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native'

import { nstyles, colors } from '../styles'
import TextInputChat from '../TextInputChat'
import { ListEmpty } from '../../components'
import Utils, { icon_typeToast } from '../../app/Utils'
import TextInputSearch from './TextInputSearch'

import { ImagesChat } from '../Images'
import apiChat from '../api/apis'
import { getStatusBarHeight } from 'react-native-iphone-x-helper'
import { sizes } from '../../styles'

const Search = (props) => {
    const [textSearch, settextSearch] = useState('');
    const [onfocus, setonfocus] = useState(false);
    const [dataSearch, setdataSearch] = useState([]);
    const inPutRef = useRef(null)

    const loadMore = async () => {
    }
    const _Chat_TaoNhomChat = async (itemUser) => {
        let res = await apiChat.Chat_TaoNhomChat(itemUser);
        if (res.status == 1) {
            let item = res.data;
            props.ChangeCurentGroup(item.IdGroup);
            props.ApiGetInfoChat(item.IdGroup);
            props.navigation.navigate("sc_RoomChat", { IdGroup: item.IdGroup })
        } else {
            Utils.showToastMsg("Thông báo", res.error ? res.error.message || "Tạo nhóm chat thất bại" : "Tạo nhóm chat thất bại" , icon_typeToast.danger);
        }
    }
    const _AcctionTouch = (item, IdGroup) => {
        if (IdGroup == 0) {
            _Chat_TaoNhomChat(item)
        } else {
            props.ChangeCurentGroup(IdGroup);
            props.ApiGetInfoChat(IdGroup);
            props.navigation.navigate("sc_RoomChat", { IdGroup: IdGroup })
        }
    }
    const _renderItem = ({ item, index }) => {

        const { nrow } = nstyles.nstyles;
        const { Avata } = item
        return (
            <TouchableOpacity
                onPress={() => _AcctionTouch(item, item.IdGroup)}
                key={item.UserID} style={{
                    flexDirection: 'row',
                    backgroundColor: colors.white,
                    paddingHorizontal: 5,
                    paddingVertical: 10,
                }}>
                <Image source={{ uri: `${Avata}` }}
                    style={[{ width: 30, height: 30, borderRadius: 15 }]}>
                </Image>
                <View style={{
                    backgroundColor: colors.white,
                    paddingHorizontal: 10,
                }}>
                    <Text style={{
                        lineHeight: 20, fontSize: 16,
                        paddingVertical: 5,
                        borderRadius: 5, paddingHorizontal: 10
                    }}>{item.FullName}</Text>
                </View>
            </TouchableOpacity>


        )
    };
    const _loadDataSearch = async () => {
        let res = await apiChat.GetList_Chat_DanhBaChatUser(textSearch);
        if (res.status == 1) {
            setdataSearch(res.data)
        }
    }
    useEffect(() => {
        _loadDataSearch();

    }, [textSearch])
    const _keyExtrac = (item, index) => index.toString();

    const _ItemSeparatorComponent = () => {
        return <View style={{
            height: 5,
            backgroundColor: colors.white,
            alignSelf: 'center'
        }} />
    }
    const _onReFresh = () => {

    }
    //end flastlist
    return (
        <View style={[nstyles.nstyles.ncontainer,
        { flex: 1, paddingTop: getStatusBarHeight() + 10 }]}>
            <View style={{
                backgroundColor: colors.BackgroundHome,
                paddingHorizontal: 10,
                paddingVertical: 5,
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                {
                    <TouchableOpacity
                        onPress={() => props.navigation.goBack()}
                        style={{
                            width: 30,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                        <Image source={ImagesChat.icBack}
                            resizeMode='contain'
                            style={[{ width: 20, height: 20, tintColor: colors.peacockBlue }]}>
                        </Image>
                    </TouchableOpacity>
                }
                <View style={{ flex: 1 }}>
                    <TextInputSearch
                        isFocus={onfocus}
                        onClear={() => settextSearch('')}
                        ref={inPutRef}
                        onBlur={() => setonfocus(false)}
                        onFocus={() => setonfocus(true)}
                        value={textSearch}
                        placeholder={'Search'}
                        // autoFocus={true}
                        onChangeText={(text) => settextSearch(text)} />
                </View>
                {/* {
                    onfocus ? <TouchableOpacity
                        onPress={_loadDataSearch}
                        style={{
                            paddingHorizontal: 10,
                            paddingHorizontal: 5,
                        }}>
                        <Image
                            source={ImagesChat.icSentMes}
                            style={[
                                nstyles.nstyles.nIcon30,
                                { tintColor: colors.peacockBlue, marginBottom: 3 }
                            ]}
                        ></Image>

                    </TouchableOpacity> : null
                } */}
            </View>
            <View style={{ flex: 1, }}>
                <FlatList
                    style={{ flex: 1, marginHorizontal: 5, }}
                    scrollEventThrottle={10}
                    showsVerticalScrollIndicator={false}
                    renderItem={_renderItem}
                    data={dataSearch}
                    extraData={dataSearch}
                    ListEmptyComponent={<ListEmpty textempty={'....'} />}
                    ItemSeparatorComponent={_ItemSeparatorComponent}
                    keyboardShouldPersistTaps={'handled'}
                    keyExtractor={_keyExtrac}
                    onEndReachedThreshold={0.3}
                />
            </View>

        </View >
    )
}


export default Utils.connectRedux(Search, null, true);
