import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import Utils from '../../../../app/Utils';
import {
    LikeUnlikeProfileApplied,
    LoadListCvSaved, SetDataCvSaved, SetRefreshingCvSaved,
    UnLikeCvSaved, UnLikeProfileEnterprise
} from '../../../../srcRedux/actions/sanvieclam/DataSVL';
import { colors } from '../../../../styles'
import EmptySVL from '../../components/EmptySVL';
import ItemPersonal from '../HoSo/components/ItemPersonal';
import { DEFINE_SCREEN_DETAILS } from '../../common'

const ProfileSaved = (props) => {
    const dispatch = useDispatch()
    const { RefreshingCvSaved = true, PageCvSaved = { Page: 1, AllPage: 1 }, LstCvSaved = [] } = useSelector(state => state.dataSVL)

    useEffect(() => {
        dispatch(LoadListCvSaved())
    }, [])

    const onRefresh = () => {
        dispatch(SetRefreshingCvSaved(true))
        dispatch(SetDataCvSaved([]))
        dispatch(LoadListCvSaved())
    }


    const onPressSaveProfile = (item) => {
        Utils.goscreen({ props }, 'PopupSaveTD', { data: item, isSave: false, callback: callbackPopupSave })
    }

    const callbackPopupSave = (itemcallback) => {
        //Item lưu chuyển trạng thái thành chưa lưu với IsLike : 0 -> Map laị danh sách xử lý UI danh sách hồ sơ CV đã lưu
        dispatch(UnLikeCvSaved(itemcallback))
        //Item lưu chuyển trạng thái thành chưa lưu với IsLike : 0 -> Map laị danh sách xử lý UI danh sách hồ sơ CV
        dispatch(UnLikeProfileEnterprise(itemcallback))
        //Item lưu chuyển trạng thái thành chưa lưu với IsLike : 0 -> Map laị danh sách ử lý UI lịch sử ứng tuyển
        dispatch(LikeUnlikeProfileApplied(itemcallback))
    }

    const onPressDetail = (item) => {
        Utils.navigate('Modal_DetalisUngVien', {
            Id: `${item?.IdCV}|${DEFINE_SCREEN_DETAILS.DanhSach_CVDoanhNghiep.KeyScreen}`
        })
    }

    const renderItem = ({ item, index }) => {
        return (
            <ItemPersonal onPressSave={() => { onPressSaveProfile(item) }} isNhaTuyenDung item={item} index={index} onChoose={() => onPressDetail(item)} />
        )
    }

    const _ListFooterComponent = () => {
        return PageCvSaved.Page < PageCvSaved.AllPage ? <ActivityIndicator size='small' style={{ marginVertical: 10 }} /> : null;
    }

    const loadMore = async () => {
        if (PageCvSaved.Page < PageCvSaved.AllPage) {
            dispatch(LoadListCvSaved(true))
        }
    }

    return (
        <View style={stProfileSaved.container}>
            <FlatList
                extraData={LstCvSaved}
                contentContainerStyle={{ paddingBottom: 80 }}
                data={LstCvSaved}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                refreshing={RefreshingCvSaved}
                onRefresh={onRefresh}
                onEndReached={loadMore}
                onEndReachedThreshold={0.1}
                ListFooterComponent={_ListFooterComponent}
                ListEmptyComponent={<EmptySVL style={{ flex: 1, marginTop: 20 }} textEmpty={RefreshingCvSaved ? 'Đang tải...' : 'Không có dữ liệu'} />}
            />
        </View>
    )
}

const stProfileSaved = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: colors.BackgroundHome, paddingTop: 5
    }
})

export default ProfileSaved
