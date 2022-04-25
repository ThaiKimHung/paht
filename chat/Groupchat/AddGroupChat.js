import React, { useState, useRef, useEffect } from 'react'
import { View, Text, FlatList, TouchableOpacity, Image, TextInput, Keyboard, StyleSheet } from 'react-native'

import { nstyles, colors } from '../styles'
import TextInputChat from '../TextInputChat'
import { ListEmpty, IsLoading } from '../../components'
import Utils from '../../app/Utils'
import TextInputSearch from './TextInputSearch'
import apis from '../../srcAdmin/apis'
import { ScrollView } from 'react-native-gesture-handler'
import { reSize, reText } from '../../styles/size'
import { ImagesChat } from '../Images'
import { Height } from '../../styles/styles'
import apiChat from '../api/apis'
import { getStatusBarHeight } from 'react-native-iphone-x-helper'
const AddGroupChat = (props) => {
    const [textSearch, settextSearch] = useState('');
    const [onfocus, setonfocus] = useState(false);
    const [dataSearch, setdataSearch] = useState([]);
    const [dataSelect, setdataSelect] = useState([]);
    const [nameGroupChat, setnameGroupChat] = useState('')
    const inPutRef = useRef(null)
    const isScreen = Utils.ngetParam({ props: props }, 'isScreenAddMember', false) //Check màn hình thêm thành viên vào nhóm
    const infoGroup = Utils.ngetParam({ props: props }, 'infoGroup', false)
    //tạo nhóm chat api
    const _Chat_TaoNhomChatGroup = async () => {
        nthisIsLoading.show();
        let arrID = dataSelect.map(item => item);
        Utils.nlog("gai tri arrid", arrID);
        if (arrID?.length >= 2) {
            let res = await apiChat.Chat_TaoNhomChatGroup(arrID, nameGroupChat);
            //Utils.nlog("gia tri res tao nhom chat");
            if (res.status == 1) {
                nthisIsLoading.hide();
                props.ApiGet_ListGroupChat();
                let item = res.data;
                Utils.goback({ props });

                props.ChangeCurentGroup(item.IdGroup);
                props.ApiGetInfoChat(item.IdGroup);
                props.navigation.navigate("sc_RoomChat", { IdGroup: item.IdGroup })
            } else {
                nthisIsLoading.hide();
                Utils.showMsgBoxOK({ props: props }, "Thông báo", res.error ? res.error.message : "Tạo nhóm thất bại", "Xác nhận");
            }
        } else {
            nthisIsLoading.hide();
            Utils.showMsgBoxOK({ props: props }, "Thông báo", "Tạo nhóm yêu cầu phải thêm ít nhất 2 thành viên!", "Xác nhận");
        }

    }
    //Thêm member vào nhóm
    const _addMember = async (user) => {
        const res = await apiChat.Chat_AddNewMemberToGroupChat(infoGroup.IdGroup, user)
        Utils.nlog("<><><>res", res)
        if (res.status == 1) {
            Utils.showMsgBoxOK({ props: props }, "Thông báo", "Thêm thành công", "Xác nhận")
            await props.ApiGetInfoChat(infoGroup.IdGroup);
        }
        else {
            Utils.showMsgBoxOK({ props: props }, "Thông báo", res.error.message, "Xác nhận")
        }

    }
    //flatlist
    const loadMore = async () => {
        //Utils.nlog("vao laod more", "1111")
    }
    const _AcctionTouch = async (item) => {

        //kiem tra trước khi add;
        let isChoose = dataSelect.findIndex(item2 => item.UserID == item2.UserID);
        if (isChoose == -1) {
            setdataSelect([...dataSelect, item])
        } else {
            await dataSelect.splice(isChoose, 1);
            //Utils.nlog("mang dã xoá", dataSelect);
            setdataSelect([].concat(dataSelect));
            //Utils.nlog("mang dã xoá2", dataSelect);
        }

    }

    const _renderItem = ({ item, index }) => {
        let isChoose = dataSelect.find(item2 => item.UserID == item2.UserID);
        const { nrow } = nstyles.nstyles;
        const { Avata, TenPhuongXa = '', ChucVu } = item
        return (
            <TouchableOpacity
                onPress={isScreen == false ? () => _AcctionTouch(item) : null}
                key={item.UserID} style={_styles.item_container}>
                <Image source={{ uri: `${Avata}` }}
                    style={[_styles.item_image]}>
                </Image>
                <View style={[_styles.item_body]}>
                    <View style={{ flex: 1 }}>
                        <Text style={[_styles.iten_name]}>{item.FullName}</Text>
                        <Text style={[_styles.item_namedonvi]}>{ChucVu ? `${ChucVu} - ` : ''}{TenPhuongXa || ''}</Text>
                    </View>
                    {isScreen == false ?
                        <View style={{ alignSelf: 'flex-end' }}>
                            <Image source={isChoose ? ImagesChat.icCheck : ImagesChat.icRadioUncheck}
                                resizeMode={'contain'}
                                style={[{ width: 20, height: 20, borderRadius: 15, tintColor: colors.grey }]}>
                            </Image>
                        </View>
                        :
                        <TouchableOpacity style={{ backgroundColor: colors.peacockBlue, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 4 }}
                            onPress={() => _addMember(item)}
                        >
                            <Text style={{ color: colors.white, fontWeight: 'bold' }}>Thêm</Text>
                        </TouchableOpacity>}
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
    }, [])
    useEffect(() => {
        _loadDataSearch();

    }, [textSearch]);

    const _keyExtrac = (item, index) => index.toString();
    const _onRefresh = () => {

    }
    const _ItemSeparatorComponent = () => {
        return <View style={{
            height: 5,
            backgroundColor: colors.white,
            alignSelf: 'center'
        }} />
    }
    const _onReFresh = () => {
    }
    const renderItemSelect = (item, index) => {

        return (
            <TouchableOpacity
                onPress={() => _AcctionTouch(item)}
                key={index.toString()}
                style={{
                    width: 50, height: 50, borderRadius: 25,
                    backgroundColor: colors.grayLight, marginRight: 5
                }}>
                <Image source={{ uri: item.Avata }}
                    resizeMode='contain'
                    style={[{ width: 50, height: 50, borderRadius: 25, }]}>
                </Image>
                <View style={{
                    position: 'absolute', top: -5, right: -5,
                    width: 20, height: 20, zIndex: 1000,
                    borderRadius: 20,
                    backgroundColor: 'black',
                }}>
                    <Image source={ImagesChat.icClose}
                        resizeMode='contain'
                        style={[{ width: 20, height: 20, borderRadius: 20, tintColor: 'white' }]}>
                    </Image>
                </View>
            </TouchableOpacity>)
    }
    return (
        <View style={[nstyles.nstyles.ncontainer, { flex: 1, paddingTop: getStatusBarHeight() + 10 }]}>
            <View style={{
                backgroundColor: colors.BackgroundHome,
                paddingHorizontal: 10, height: 60,
                paddingVertical: 5, flexDirection: 'row', alignItems: 'center',
            }}>
                {
                    <TouchableOpacity
                        onPress={() => props.navigation.goBack()}
                        style={{
                            width: 40,
                            height: '100%',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                        <Image source={ImagesChat.icBack}
                            resizeMode='contain'
                            style={[{
                                width: reSize(25), height: reSize(25),
                                tintColor: colors.peacockBlue,
                            }]}>
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
                        autoFocus={true}
                        onChangeText={(text) => settextSearch(text)} />
                </View>

                <TouchableOpacity
                    onPress={_loadDataSearch}
                    style={{
                        width: 50,
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingHorizontal: 5

                    }}>
                    {/* <Text>{'hiha'}</Text> */}
                    <Image
                        source={ImagesChat.icpencil}
                        style={[
                            nstyles.nstyles.nIcon30,
                            {
                                tintColor: colors.peacockBlue,
                                marginBottom: 3, alignSelf: 'center', marginTop: 5
                            }
                        ]}
                    ></Image>
                </TouchableOpacity>
            </View>
            {isScreen == false ?
                <View style={{
                    paddingVertical: 10, paddingHorizontal: 10,
                    backgroundColor: colors.white, borderRadius: 5
                }}>

                    <View style={{
                        paddingVertical: 10, flexDirection: 'row',
                        justifyContent: 'center'
                    }}>
                        <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: reText(14), color: colors.black }}>Đặt tên nhóm:</Text>
                        </View>
                        <TouchableOpacity
                            onPress={_Chat_TaoNhomChatGroup}
                            style={{
                                padding: 10, backgroundColor: colors.peacockBlue,
                                borderRadius: 10, flex: 1, alignItems: 'center', justifyContent: 'center'
                            }}>
                            <Text style={{ fontWeight: 'bold', fontSize: reText(12), color: colors.white }}>Tạo</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{
                        height: 60,
                        paddingVertical: 10,
                    }}>
                        <TextInput placeholder={'Tên nhóm'}
                            value={nameGroupChat}
                            onChangeText={val => setnameGroupChat(val)}
                            style={{ borderWidth: 0.5, borderRadius: 5, height: 40, paddingHorizontal: 10 }}>

                        </TextInput>

                    </View>


                    <ScrollView horizontal style={{ paddingVertical: 10, }}>
                        {
                            dataSelect.map(renderItemSelect)
                        }
                    </ScrollView>
                </View>
                :
                null}
            <View style={{ flex: 1, paddingVertical: 10 }}>
                <FlatList
                    style={{ flex: 1, marginHorizontal: 20, }}
                    scrollEventThrottle={10}
                    onScroll={(e) => Keyboard.dismiss()}
                    showsVerticalScrollIndicator={false}
                    renderItem={_renderItem}
                    data={dataSearch}
                    extraData={dataSearch}
                    ListEmptyComponent={<ListEmpty textempty={'....'} />}
                    ItemSeparatorComponent={_ItemSeparatorComponent}
                    keyboardShouldPersistTaps={'always'}
                    keyExtractor={_keyExtrac}

                    onEndReachedThreshold={0.3}
                />
            </View>
            <IsLoading />

        </View >
    )
}
export default Utils.connectRedux(AddGroupChat, null, true)
const _styles = StyleSheet.create({
    item_container: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        paddingHorizontal: 5,
        paddingVertical: 10,
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
