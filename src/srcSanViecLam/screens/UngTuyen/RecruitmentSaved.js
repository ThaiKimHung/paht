import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native'
import Utils from '../../../../app/Utils';
import { colors } from '../../../../styles'
import EmptySVL from '../../components/EmptySVL';
import ItemRecruitment from '../../components/ItemRecruitment';
import { useDispatch, useSelector } from 'react-redux';
import { LikeUnlikeApplied, LoadListRecruitmentSaved, SetDataRecruitmentsaved, SetRefreshingRecruitmentSaved, UnLikeRecruitment, UnLikeRecruitmentSaved } from '../../../../srcRedux/actions/sanvieclam/DataSVL';
import { DEFINE_SCREEN_DETAILS } from '../../common';

const RecruitmentSaved = (props) => {
    const dispatch = useDispatch()
    const { RefreshingRecruitmentSaved = true, PageRecruitmentSaved = { Page: 1, AllPage: 1 }, LstRecruitmentSaved = [] } = useSelector(state => state.dataSVL)

    useEffect(() => {
        dispatch(LoadListRecruitmentSaved())
    }, [])

    const onRefresh = () => {
        dispatch(SetRefreshingRecruitmentSaved(true))
        dispatch(SetDataRecruitmentsaved([]))
        dispatch(LoadListRecruitmentSaved())
    }

    const onPressSaveTin = (item) => {
        Utils.goscreen({ props }, 'PopupSave', { data: item, isSave: false, callback: callbackPopupSave })
    }

    const callbackPopupSave = (itemcallback) => {
        //Item lưu chuyển trạng thái thành chưa lưu với IsLike : 0 -> Map laị danh sách xử lý UI danh sách tin tuyển dụng đã lưu
        dispatch(UnLikeRecruitmentSaved(itemcallback))
        //Item lưu chuyển trạng thái thành chưa lưu với IsLike : 0 -> Map laị danh sách xử lý UI danh sách tin tuyển dụng
        dispatch(UnLikeRecruitment(itemcallback))
        //Item lưu chuyển trạng thái thành chưa lưu với IsLike : 0 -> Map laị danh sách ử lý UI lịch sử ứng tuyển
        dispatch(LikeUnlikeApplied(itemcallback))
    }

    const onPressDetail = (item) => {
        Utils.goscreen({ props }, 'ModalCTTuyenDung', {
            Id: `${item.Id}|${DEFINE_SCREEN_DETAILS.DanhSach_TinTuyenDung.KeyScreen}`
        })
    }

    const renderItem = ({ item, index }) => {
        return (
            <ItemRecruitment
                data={item}
                index={index}
                onPressSave={() => onPressSaveTin(item)}
                onPress={() => onPressDetail(item)}
            />
        )
    }

    const _ListFooterComponent = () => {
        return PageRecruitmentSaved.Page < PageRecruitmentSaved.AllPage ? <ActivityIndicator size='small' style={{ marginVertical: 10 }} /> : null;
    }

    const loadMore = async () => {
        if (PageRecruitmentSaved.Page < PageRecruitmentSaved.AllPage) {
            dispatch(LoadListRecruitmentSaved(true))
        }
    }

    return (
        <View style={stRecruitmentSaved.container}>
            <FlatList
                extraData={LstRecruitmentSaved}
                contentContainerStyle={{ paddingBottom: 80 }}
                data={LstRecruitmentSaved}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                refreshing={RefreshingRecruitmentSaved}
                onRefresh={onRefresh}
                onEndReached={loadMore}
                onEndReachedThreshold={0.1}
                ListFooterComponent={_ListFooterComponent}
                ListEmptyComponent={<EmptySVL style={{ flex: 1, marginTop: 20 }} textEmpty={RefreshingRecruitmentSaved ? 'Đang tải...' : 'Không có dữ liệu'} />}
            />
        </View>
    )
}

const stRecruitmentSaved = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: colors.BackgroundHome,
    }
})

export default RecruitmentSaved
