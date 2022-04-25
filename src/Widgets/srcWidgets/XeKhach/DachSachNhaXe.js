import { StyleSheet, Text, View, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { DropWidget, HeaderWidget } from '../../CompWidgets';
import { ImgWidget } from '../../Assets';
import ItemVertical from './ItemVertical';
import Utils from '../../../../app/Utils';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { ApiXeKhanh } from '../../apis';
import { ListEmpty } from '../../../../components';

const data = [
    {

    },
    {

    },
    {

    },
    {

    },
    {

    },
    {

    },
    {

    },
    {

    },
    {

    },
    {

    },
    {

    },
    {

    },
]

const DachSachNhaXe = () => {
    const [Data, setData] = useState({
        data: [],
        refreshing: false,
    })
    const renderItem = ({ item, index }) => {
        return (
            <ItemVertical item={item} keyItem={['TenNhaXe', 'SDT']} onPress={() => GoThongTinNhaXe(item?.IdNhaXe)} />
        )
    }
    const Go_Back = () => {
        Utils.goback()
    }

    useEffect(() => {
        getApi();
    }, [])

    const getApi = async () => {
        let res = await ApiXeKhanh.Get_ApiXeKhach({
            "query.more": true,
            "query.sortOrder": "asc",
            "query.sortField": "",
            "query.OrderBy": "",
        });
        Utils.nlog('gia tri res', res)
        setData({
            refreshing: false,
            data: res?.status === 1 && res?.data ? res.data : []
        })
    }
    const GoThongTinNhaXe = (Id = 0) => {
        Utils.nlog('gia tri id truyen  xuyen', Id)
        Utils.navigate('scThongTinNhaXe', { IdXe: Id })
    }

    const onRefresh = async () => {
        setData({
            ...Data,
            refreshing: true,
        })
        await getApi();
    }

    return (
        <View style={stDachSachNhaXe.container} >
            <HeaderWidget
                title={'Thông tin nhà xe'}
                iconLeft={ImgWidget.icBack}
                onPressLeft={Go_Back}
            />
            <FlatList
                refreshing={Data.refreshing}
                contentContainerStyle={{ paddingBottom: getBottomSpace() + 20 }}
                data={Data.data}
                onRefresh={onRefresh}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
                ListEmptyComponent={<ListEmpty textempty={'Không có dữ liệu'} />}
            />
        </View>
    )
}

export default DachSachNhaXe

const stDachSachNhaXe = StyleSheet.create({
    container: {
        flex: 1
    },
})