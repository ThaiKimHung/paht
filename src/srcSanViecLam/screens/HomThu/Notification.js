import React, { Component, useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { Platform, TextInput, View, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Utils, { icon_typeToast } from '../../../../app/Utils';
import ImageCus from '../../../../components/ImageCus';
import TextApp from '../../../../components/TextApp';
import { LoadListMailBox, SeenMailBox, SetDataMailBox, SetPageMailBox, SetRefreshingMailBox } from '../../../../srcRedux/actions/sanvieclam/DataSVL';
import { colors } from '../../../../styles';
import { colorsSVL } from '../../../../styles/color';
import { reText } from '../../../../styles/size';
import { nstyles } from '../../../../styles/styles';
import { DEFINE_SCREEN_DETAILS } from '../../common';
import EmptySVL from '../../components/EmptySVL';
import HeaderSVL from '../../components/HeaderSVL';
import { ImagesSVL } from '../../images';

const Notification = (props) => {
    const dispatch = useDispatch()
    const {
        LstMailBox = [],
        RefreshingMailBox = true,
        PageMailBox = { Page: 1, AllPage: 1 },
        CountMailBox = 0
    } = useSelector(state => state.dataSVL)

    useEffect(() => {
        dispatch(LoadListMailBox())
    }, [])

    const onRefresh = () => {
        dispatch(SetPageMailBox({ Page: 1, AllPage: 1 }))
        dispatch(SetRefreshingMailBox(true))
        dispatch(SetDataMailBox([]))
        dispatch(LoadListMailBox())
    }

    const onPressDetail = (item) => {
        if (item?.IsSeen == false) {
            dispatch(SeenMailBox(item))
        }
        let bodyData = JSON.parse(item?.Data)
        if (bodyData?.Id && bodyData?.KeyScreen == DEFINE_SCREEN_DETAILS.TuyenDung_CaNhan.KeyScreen) {
            Utils.goscreen({ props }, 'ModalCTTuyenDung', {
                Id: `${bodyData.Id}|${DEFINE_SCREEN_DETAILS.TuyenDung_CaNhan.KeyScreen}`
            })
        } else {
            Utils.showToastMsg('Thông báo', 'Không tìm thấy thông tin tuyển dụng!', icon_typeToast.info, 2000)
        }
    }


    const _ListFooterComponent = () => {
        return PageMailBox.Page < PageMailBox.AllPage ? <ActivityIndicator size='small' style={{ marginVertical: 10 }} /> : null;
    }

    const loadMore = async () => {
        if (PageMailBox.Page < PageMailBox.AllPage) {
            dispatch(LoadListMailBox(true))
        }
    }

    const renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity activeOpacity={0.5} onPress={() => onPressDetail(item)} style={[stNotification.container, { backgroundColor: item?.IsSeen ? colors.nocolor : colors.white }]}>
                <View style={stNotification.contRight}>
                    <View style={stNotification.contRow}>
                        <TextApp style={stNotification.txtTitle}>
                            {item?.TieuDe}
                        </TextApp>
                        <TextApp numberOfLines={1} style={stNotification.txtTime}>
                            {item?.NgayTao}
                        </TextApp>
                    </View>
                    <TextApp style={stNotification.txtNote}>
                        {item?.NoiDung || 'Không có nội dung'}
                    </TextApp>
                </View>
            </TouchableOpacity>
        )
    }

    const onReadAll = () => {
        Utils.showMsgBoxYesNo({ props }, 'Thông báo', 'Bạn có chắc muốn đánh dấu đã đọc tất cả các thông báo ?', 'Đã đọc', 'Xem lại', () => {
            dispatch(SeenMailBox({}, true))
        })
    }

    return (
        <View style={[nstyles.ncontainer]}>
            <StatusBar barStyle={'dark-content'} />
            {/* Header */}
            <HeaderSVL
                title={"Hộp thư"}
                iconLeft={ImagesSVL.icHome}
                onPressLeft={() => Utils.goscreen(this, 'ManHinh_Home')}
                titleRight={LstMailBox.length > 0 && LstMailBox.find(e => e.IsSeen == false) ? "Đã đọc" : null}
                iconRight={LstMailBox.length > 0 && LstMailBox.find(e => e.IsSeen == false) ? ImagesSVL.icCheckBlack : undefined}
                styleTitleRight={{ width: 75 }}
                onPressRight={onReadAll}
                Sright={{ fontSize: reText(14), color: colorsSVL.black, width: 75 }}
                SrightIcon={[nstyles.nIcon18, { marginRight: 5 }]}
            />

            {/* Body */}
            <View style={nstyles.nbody}>
                <FlatList
                    extraData={LstMailBox}
                    contentContainerStyle={{ paddingBottom: 80 }}
                    data={LstMailBox}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                    refreshing={RefreshingMailBox}
                    onRefresh={onRefresh}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={_ListFooterComponent}
                    ItemSeparatorComponent={() => {
                        return <View style={{ height: 2, backgroundColor: '#D6D6D6' }} />
                    }}
                    ListEmptyComponent={<EmptySVL style={{ flex: 1, marginTop: 20 }} textEmpty={RefreshingMailBox ? 'Đang tải...' : 'Không có dữ liệu'} />}
                />
            </View>
        </View>
    )
}

const stNotification = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // marginTop: 5,
        paddingVertical: 10,
        paddingHorizontal: 10
    },
    contLeft: {
        ...nstyles.nAva26
    },
    contRight: {
        flex: 1, paddingLeft: 8
    },
    txtTitle: {
        fontSize: reText(15), fontWeight: 'bold', flex: 1
    },
    txtAddress: {
        fontSize: reText(13), color: colorsSVL.grayText, paddingRight: 30
    },
    txtNote: {
        fontSize: reText(14), color: colorsSVL.grayText, textAlign: 'justify', marginTop: 5
    },
    txtDateInterview: {
        fontSize: reText(11), color: colorsSVL.blueMainSVL,
    },
    txtTime: {
        fontSize: reText(11), color: colorsSVL.grayText, paddingLeft: 20,
    },
    contRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    contTypeWork: {
        paddingHorizontal: 10, paddingVertical: 3, backgroundColor: '#cce6f0',
        borderRadius: 10, marginVertical: 10, alignItems: 'center', justifyContent: 'center'
    }
})

export default Notification
