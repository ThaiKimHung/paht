import { View, Text, StyleSheet, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ButtonWidget, HeaderWidget, EmptyWidgets } from '../../CompWidgets'
import { ImgWidget } from '../../Assets'
import Utils, { icon_typeToast } from '../../../../app/Utils'
import { useDispatch, useSelector } from 'react-redux'
import {
    loadListTinRaoVatDaLuu,
    setRefreshingTinRaoVatDaLuu,
    setPageTinRaoVatDaLuu,
    setDataTinRaoVatDaLuu,
    saveTinRaoVat,
} from '../../../../srcRedux/actions/widgets'
import ItemRaoVat from './ItemRaoVat'
import { ActivityIndicator } from '../../../sourceIOC/Components/Kit'


const DaLuuRaoVat = (props) => {
    const {
        LstTinRaoVatDaLuu = [],
        RefreshingTinRaoVatDaLuu = true,
        PageTinRaoVatDaLuu = { Page: 1, AllPage: 1 },
    } = useSelector(state => state.Widgets)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(loadListTinRaoVatDaLuu())
    }, [])

    const onGoDetails = (item) => {
        Utils.navigate('scChiTietTinRaoVat', { IdTinRaoVat: item?.IdTinRaoVat })
    }

    const onPressSaved = (item) => {
        dispatch(saveTinRaoVat(item, !item?.DaLuu))
    }

    const renderItem = ({ item, index }) => {
        return (
            <ItemRaoVat
                dataItem={item}
                onPress={() => onGoDetails(item)}
                onPressLike={() => onPressSaved(item)}
                showTrangThaiHienThi
            />
        )
    }

    const onRefresh = () => {
        dispatch(setPageTinRaoVatDaLuu({ Page: 1, AllPage: 1 }))
        dispatch(setRefreshingTinRaoVatDaLuu(true))
        dispatch(setDataTinRaoVatDaLuu([]))
        dispatch(loadListTinRaoVatDaLuu())
    }

    const _ListFooterComponent = () => {
        return PageTinRaoVatDaLuu.Page < PageTinRaoVatDaLuu.AllPage ? <ActivityIndicator size='small' style={{ marginVertical: 10 }} /> : null;
    }

    const loadMore = async () => {
        if (PageTinRaoVatDaLuu.Page < PageTinRaoVatDaLuu.AllPage) {
            dispatch(loadListTinRaoVatDaLuu(true))
        }
    }

    const renderListSaved = () => {
        return (
            <FlatList
                data={LstTinRaoVatDaLuu}
                contentContainerStyle={{ paddingHorizontal: 15, flex: LstTinRaoVatDaLuu.length == 0 ? 1 : null }}
                extraData={index => `tindaluu-${index}`}
                renderItem={renderItem}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                refreshing={RefreshingTinRaoVatDaLuu}
                onRefresh={onRefresh}
                onEndReached={loadMore}
                onEndReachedThreshold={0.1}
                ListFooterComponent={_ListFooterComponent}
                ListEmptyComponent={<EmptyWidgets style={{ flex: 1 }} textEmpty={RefreshingTinRaoVatDaLuu ? 'Đang tải...' : 'Không có dữ liệu'} />}

            />
        )
    }

    return (
        <View style={stDaLuuRaoVat.container}>
            {/* {Danh sách bài đăng} */}
            <View style={{ flex: 1, paddingBottom: 24 }}>
                {renderListSaved()}
            </View>
        </View>
    )
}

const stDaLuuRaoVat = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 10
    },
    body: {
        flex: 1
    },
    footer: {
        paddingBottom: 24, paddingHorizontal: 15, paddingTop: 10
    }
})

export default DaLuuRaoVat