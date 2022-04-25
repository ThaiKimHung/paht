import React, { Component, useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { Platform, TextInput, View, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Utils, { icon_typeToast } from '../../../../app/Utils';
import ImageCus from '../../../../components/ImageCus';
import TextApp from '../../../../components/TextApp';
import { LoadListMailBoxEnterprise, SeenMailBoxEnterprise, SetDataMailBoxEnterprise, SetPageMailBoxEnterprise, SetRefreshingMailBoxEnterprise } from '../../../../srcRedux/actions/sanvieclam/DataSVL';
import { colors } from '../../../../styles';
import { colorsSVL } from '../../../../styles/color';
import { reText } from '../../../../styles/size';
import { nstyles } from '../../../../styles/styles';
import { DEFINE_SCREEN_DETAILS } from '../../common';
import EmptySVL from '../../components/EmptySVL';
import HeaderSVL from '../../components/HeaderSVL';
import { ImagesSVL } from '../../images';

const index = (props) => {
    const dispatch = useDispatch()
    const {
        LstMailBoxEnterprise = [],
        RefreshingMailBoxEnterprise = true,
        PageMailBoxEnterprise = { Page: 1, AllPage: 1 },
        CountMailBoxEnterprise = 0
    } = useSelector(state => state.dataSVL)

    useEffect(() => {
        dispatch(LoadListMailBoxEnterprise())
    }, [])

    const onRefresh = () => {
        dispatch(SetPageMailBoxEnterprise({ Page: 1, AllPage: 1 }))
        dispatch(SetRefreshingMailBoxEnterprise(true))
        dispatch(SetDataMailBoxEnterprise([]))
        dispatch(LoadListMailBoxEnterprise())
    }

    const onPressDetail = (item) => {
        if (item?.IsSeen == false) {
            dispatch(SeenMailBoxEnterprise(item))
        }
        let bodyData = JSON.parse(item?.Data)
        if (bodyData?.Id && bodyData?.KeyScreen == DEFINE_SCREEN_DETAILS.TuyenDung_DoanhNghiep.KeyScreen) {
            Utils.goscreen({ props }, 'Modal_DetalisUngVien', {
                Id: `${bodyData.Id}|${DEFINE_SCREEN_DETAILS.TuyenDung_DoanhNghiep.KeyScreen}`
            })
        } else {
            Utils.showToastMsg('Thông báo', 'Không tìm thấy thông tin tuyển dụng!', icon_typeToast.info, 2000)
        }
    }


    const _ListFooterComponent = () => {
        return PageMailBoxEnterprise.Page < PageMailBoxEnterprise.AllPage ? <ActivityIndicator size='small' style={{ marginVertical: 10 }} /> : null;
    }

    const loadMore = async () => {
        if (PageMailBoxEnterprise.Page < PageMailBoxEnterprise.AllPage) {
            dispatch(LoadListMailBoxEnterprise(true))
        }
    }

    const renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity activeOpacity={0.5} onPress={() => onPressDetail(item)} style={[stHomThuTD.container, { backgroundColor: item?.IsSeen ? colors.nocolor : colors.white }]}>
                <View style={stHomThuTD.contRight}>
                    <View style={stHomThuTD.contRow}>
                        <TextApp style={stHomThuTD.txtTitle}>
                            {item?.TieuDe}
                        </TextApp>
                        <TextApp numberOfLines={1} style={stHomThuTD.txtTime}>
                            {item?.NgayTao}
                        </TextApp>
                    </View>
                    <TextApp style={stHomThuTD.txtNote}>
                        {item?.NoiDung || 'Không có nội dung'}
                    </TextApp>
                </View>
            </TouchableOpacity>
        )
    }

    const onReadAll = () => {
        Utils.showMsgBoxYesNo({ props }, 'Thông báo', 'Bạn có chắc muốn đánh dấu đã đọc tất cả các thông báo ?', 'Đã đọc', 'Xem lại', () => {
            dispatch(SeenMailBoxEnterprise({}, true))
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
                titleRight={LstMailBoxEnterprise.length > 0 && LstMailBoxEnterprise.find(e => e.IsSeen == false) ? "Đã đọc" : null}
                iconRight={LstMailBoxEnterprise.length > 0 && LstMailBoxEnterprise.find(e => e.IsSeen == false) ? ImagesSVL.icCheckBlack : undefined}
                styleTitleRight={{ width: 75 }}
                onPressRight={onReadAll}
                Sright={{ fontSize: reText(14), color: colorsSVL.black, width: 75 }}
                SrightIcon={[nstyles.nIcon18, { marginRight: 5 }]}
            />

            {/* Body */}
            <View style={nstyles.nbody}>
                <FlatList
                    extraData={LstMailBoxEnterprise}
                    contentContainerStyle={{ paddingBottom: 80 }}
                    data={LstMailBoxEnterprise}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                    refreshing={RefreshingMailBoxEnterprise}
                    onRefresh={onRefresh}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={_ListFooterComponent}
                    ItemSeparatorComponent={() => {
                        return <View style={{ height: 2, backgroundColor: '#D6D6D6' }} />
                    }}
                    ListEmptyComponent={<EmptySVL style={{ flex: 1 }} textEmpty={RefreshingMailBoxEnterprise ? 'Đang tải...' : 'Không có dữ liệu'} />}
                />
            </View>
        </View>
    )
}

const stHomThuTD = StyleSheet.create({
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
        fontSize: reText(13), color: colorsSVL.grayText
    },
    txtNote: {
        fontSize: reText(14), color: colorsSVL.grayText, textAlign: 'justify', marginTop: 5
    },
    txtDateInterview: {
        fontSize: reText(11), color: colorsSVL.blueMainSVL,
    },
    txtTime: {
        fontSize: reText(11), color: colorsSVL.grayText,
    },
    contRow: { flexDirection: 'row', justifyContent: 'space-between' },
    contTypeWork: {
        paddingHorizontal: 10, paddingVertical: 3, backgroundColor: '#cce6f0',
        borderRadius: 10, marginVertical: 10, alignItems: 'center', justifyContent: 'center'
    }
})

export default index
