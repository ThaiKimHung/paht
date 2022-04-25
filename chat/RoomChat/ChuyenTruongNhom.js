import React, { Component, useState, useEffect, useMemo } from 'react';
import {
    Text,
    View,
    SafeAreaView,
    Image,
    Platform,
    KeyboardAvoidingView,
    TouchableOpacity,
    Animated,
    FlatList,
    ScrollView,
    TextInput
} from 'react-native';
import Utils from '../../app/Utils';
import { colors } from '../styles';
import { ImagesChat } from '../Images';

import { nstyles, Width } from '../../styles/styles';
import { IsLoading } from '../../components';
import { reText } from '../../styles/size';
import apiChat from '../api/apis';

const ChuyenTruongNhom = (props) => {
    const AcctionChuyenAdmin = async (idAdmin) => {
        nthisIsLoading.show();
        let res = await apiChat.Chat_UpdateRoleAdminInGroup(props.dataInFo.IdGroup, idAdmin);
        if (res.status == 1) {
            Utils.goback({ props });
            await props.ApiGetInfoChat(props.dataInFo.IdGroup);
            nthisIsLoading.hide();
        } else {
            nthisIsLoading.hide();
            Utils.showMsgBoxOK({ props }, "Thông báo", res.error ? res.error.message : "Thực hiện thất bại",
                "Xác nhận", () => Utils.goback({ props }));
        }
    }
    const _renderItem = (item, index) => {
        return (
            <TouchableOpacity
                onPress={() => AcctionChuyenAdmin(item.UserID)}
                key={index.toString()} style={{
                    padding: 10,
                    borderRadius: 5, paddingVertical: 5, marginBottom: 5,
                    marginRight: 5, flexDirection: 'row', backgroundColor: item.IsAdmin ? colors.colorBlueLight : colors.blueGrey_20
                }}>
                <Image source={{ uri: `${item.Avata}` }}
                    style={[nstyles.nIcon30, { borderRadius: 15 }]}>
                </Image>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }} >
                    <Text numberOfLines={2} style={{ fontSize: reText(14), color: colors.royal }}>
                        {item.AliasNameUser}
                    </Text>
                    <Text numberOfLines={2} style={{ fontSize: reText(14), color: colors.royal, marginLeft: 5 }}>
                        {item.PhoneNumber ? item.PhoneNumber : ''}
                    </Text>
                </View>
                {/* {
                    item.IsAdmin ? <View style={{
                        position: 'absolute', top: 0,
                        left: 0, height: 20, borderRadius: 10,
                        alignItems: 'center', justifyContent: 'center',
                        width: 20, backgroundColor: colors.yellowishOrange,
                    }}><Text style={{ color: 'white' }}>{'T'}</Text></View> : null
                } */}
            </TouchableOpacity >)
    }
    return (

        <View
            style={{
                flex: 1,
                backgroundColor: 'transparent',
                justifyContent: 'flex-end'
            }}>
            <View
                onTouchEnd={() => {
                    Utils.goback({ props })
                }}
                style={{
                    backgroundColor: colors.backgroundModal,
                    flex: 1, position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                }} />
            <KeyboardAvoidingView
                behavior={Platform.OS == "ios" ? "padding" : "height"}>
                <View
                    style={{
                        padding: 10, backgroundColor: colors.white,
                        width: '100%', alignSelf: 'flex-end',
                        paddingBottom: 40,
                        borderTopLeftRadius: 20, borderTopRightRadius: 20
                    }}>
                    <View style={{ paddingVertical: 10 }}>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.colorBlueLight, textAlign: 'center' }}>{"Chọn trưởng nhóm"}</Text>
                    </View>
                    <View>
                        <ScrollView showsHorizontalScrollIndicator={false} style={{ paddingVertical: 10, backgroundColor: 'white', }}>
                            {
                                props.dataInFo.Members.map(_renderItem)
                            }
                        </ScrollView>
                    </View>
                </View>
            </KeyboardAvoidingView>
            <IsLoading></IsLoading>
        </View>
    )
};

const mapStateToProps = state => ({
    dataInFo: state.ReducerGroupChat.InFoGroup,
});

export default Utils.connectRedux(ChuyenTruongNhom, mapStateToProps, true);
