import React, { Component, useState, useEffect, useMemo } from 'react';
import {
    Text,
    View,
    Image,
    Platform,
    KeyboardAvoidingView,
    ScrollView, TouchableOpacity,
    TextInput
} from 'react-native';
import Utils from '../../app/Utils';
import { colors } from '../styles';
import { nstyles, Height } from '../../styles/styles';
import { IsLoading } from '../../components';
import { reText } from '../../styles/size';
import { ImagesChat } from '../Images';
import moment from 'moment'
import { ConfigScreenDH } from '../../srcAdmin/routers/screen';
const ThongTinNhom = (props) => {
    const GetData = async () => {
        await props.ApiGetInfoChat(props.dataInFo.IdGroup);
    }
    useEffect(() => {
        GetData();
    }, [])
    const _renderItem = (item, index) => {
        // Utils.nlog("Log ra item thành viên<>", props.dataInFo)
        return (
            <View
                key={index.toString()} style={{
                    padding: 10,
                    borderRadius: 5, paddingVertical: 5, marginBottom: 5,
                    marginRight: 5,
                }}>
                <View style={{ flexDirection: 'row' }}>
                    <Image source={{ uri: `${item.Avata}` }}
                        style={[nstyles.nIcon30, { borderRadius: 15, alignSelf: 'center' }]}>
                    </Image>
                    <View style={{ flex: 1, alignSelf: 'center', marginLeft: 15, flexDirection: 'row' }} >
                        <View>
                            <Text numberOfLines={2} style={{ fontSize: reText(16), color: colors.black_80, fontWeight: '500' }}>
                                {item.AliasNameUser}
                            </Text>
                            <Text style={{ fontSize: reText(12), color: colors.black_50, fontStyle: 'italic', marginTop: 5 }}>Ngày vào: {moment(item.DateJoin).format("DD/MM/YYYY, HH:mm")}</Text>

                        </View>

                        {item.IsAdmin ?
                            <View style={{ backgroundColor: colors.greenFE, width: 20, height: 20, justifyContent: 'center', alignItems: 'center', marginHorizontal: 15, borderRadius: 3 }}>
                                <Image source={ImagesChat.icstar} style={{ tintColor: colors.white, width: 10, height: 10, alignSelf: 'center' }} />
                            </View> : null}

                    </View>
                </View>
            </View >)
    }
    const addMember = () => {
        Utils.goscreen({ props: props }, ConfigScreenDH.Modal_AddGroupChat, { isScreenAddMember: true, infoGroup: props.dataInFo })
    }
    return (

        <View
            style={{
                flex: 1,
                backgroundColor: 'transparent',
                justifyContent: 'flex-end'
            }}>
            <View
                // onTouchEnd={() => {
                //     Utils.goback({ props })
                // }}
                style={{
                    backgroundColor: colors.backgroundModal,
                    flex: 1, position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                }} />
            <View
                behavior={Platform.OS == "ios" ? "padding" : "height"}>
                <View
                    style={{
                        padding: 10, backgroundColor: colors.white,
                        width: '100%', alignSelf: 'flex-end',
                        paddingBottom: 40,
                        borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: Height(80),
                    }}>

                    <View style={{ marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => Utils.goback({ props })} style={{ padding: 10 }}>
                            <Image source={ImagesChat.icBack} style={{ tintColor: colors.peacockBlue }} />
                        </TouchableOpacity>
                        <Text style={{ fontSize: reText(18), fontWeight: 'bold', color: colors.peacockBlue, textAlign: 'center' }}>{"Thông tin nhóm"}</Text>
                        <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => addMember()}>
                            <Image source={ImagesChat.plus} style={{ width: 25, height: 25 }} />
                            {/* <Text style={{ fontSize: reText(15), fontWeight: 'bold', color: colors.peacockBlue, marginTop: 3 }}>Thêm</Text> */}
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', marginHorizontal: 10 }}>
                        <Image source={ImagesChat.icGr} style={{ width: 16, height: 16, tintColor: colors.peacockBlue }} />
                        <Text style={{ fontSize: reText(14), fontWeight: 'bold', marginLeft: 5, color: colors.peacockBlue }}>Thành viên: {props.dataInFo.NumMember}</Text>
                        <Text style={{ fontSize: reText(12), fontWeight: 'bold', marginLeft: 5, color: colors.black_50, alignSelf: 'center' }}>- Ngày tạo nhóm: {moment(props.dataInFo.CreatedDate).format("DD/MM/YYYY, HH:mm")}</Text>
                    </View>

                    <ScrollView showsHorizontalScrollIndicator={false} style={{ paddingVertical: 10, backgroundColor: 'white', }}>
                        {
                            props.dataInFo.Members.map(_renderItem)
                        }
                    </ScrollView>

                </View>
            </View>
            <IsLoading></IsLoading>
        </View>
    )
};

const mapStateToProps = state => ({
    dataInFo: state.ReducerGroupChat.InFoGroup,
});

export default Utils.connectRedux(ThongTinNhom, mapStateToProps, true);
