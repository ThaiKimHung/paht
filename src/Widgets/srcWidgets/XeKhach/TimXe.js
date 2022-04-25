import { StyleSheet, Text, View, FlatList, Image, Linking, ActivityIndicator } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { colorsWidget, colors } from '../../../../styles/color'
import { nstyles } from '../../../../styles/styles'
import ItemVertical from './ItemVertical';
import { DropWidget, HeaderWidget } from '../../CompWidgets';
import { ImgWidget } from '../../Assets';
import Utils from '../../../../app/Utils';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { ApiXeKhanh } from '../../apis';
import { IsLoading } from '../../../../components';




const TimXe = (props) => {
    const dataFilter = Utils.ngetParam({ props }, 'dataFilter', null)
    const onScroll = useRef()
    const [dataXeKhach, setDataXeKhach] = useState({
        data: [],
        page: 1,
        AllPage: 1,
        refreshing: false,
        isLoading: false,
    })
    const [selectedTinhThanhDi, setSelectedTinhThanhDi] = useState('')
    const [selectedTinhThanhDen, setSelectedTinhThanhDen] = useState('')
    useEffect(() => {
        if (dataFilter || selectedTinhThanhDi || selectedTinhThanhDen) {
            Get_Api();
        }
    }, [dataFilter, selectedTinhThanhDi, selectedTinhThanhDen])


    const Get_Api = async (page = 1,) => {
        let res = await ApiXeKhanh.Get_DSFillter(page, 10, selectedTinhThanhDi?.IDTinhThanh || dataFilter?.TinhThanhDi.IDTinhThanh, selectedTinhThanhDen?.IDTinhThanh || dataFilter?.TinhThanhDen.IDTinhThanh)
        if (res?.status === 1 && res?.data) {
            setDataXeKhach({
                AllPage: res?.page?.AllPage,
                refreshing: false,
                isLoading: false,
                page: page,
                data: page === 1 ? res.data : dataXeKhach.data.concat(res.data)
            })
        }
        else {
            setDataXeKhach({
                ...dataXeKhach,
                page: 1,
                AllPage: 1,
                data: [],
                isLoading: false,
                refreshing: false,
            })
        }
    }

    const onRefresh = async () => {
        setDataXeKhach({
            ...dataXeKhach,
            refreshing: true,
        })
        await Get_Api();
    }

    const GoThongTinNhaXe = (item) => {
        Utils.navigate('scThongTinNhaXe', { IdXe: item?.IdNhaXe })
    }

    const Go_CallPhone = (item) => {
        let phoneNumber = '';
        if (Platform.OS !== 'android') {
            phoneNumber = `telprompt:${item?.SDT}`;
        }
        else {
            phoneNumber = `tel:${item?.SDT}`;
        }
        Linking.openURL(phoneNumber);
    };

    const renderItem = useCallback(
        ({ item, index }) => {
            return (
                <ItemVertical item={item} keyItem={['TenNhaXe', 'SDT']} showicRight onPress={() => GoThongTinNhaXe(item)} onPressRight={() => Go_CallPhone(item)} />
            )
        },
        [dataXeKhach.data],
    )

    const Go_Back = () => {
        Utils.goback()
    }

    const onLoad_More = async () => {
        const { page, AllPage, isLoading } = dataXeKhach
        Utils.nlog('vao load more')
        if (isLoading)
            return;
        if (page < AllPage && !isLoading) {
            setDataXeKhach({
                ...dataXeKhach,
                isLoading: true,
            })
            await Get_Api(page + 1)
        }
    }

    const onPressChoose = (keyView = '', keyID, currentSelected, setState) => {
        Utils.navigate('Modal_ComponentSelectBottom', {
            callback: (val) => { setState(val) },
            "item": currentSelected || {},
            "title": '',
            "AllThaoTac": dataFilter.dataTinhThanh || [],
            "ViewItem": (item, currentSelected) => viewItemList(item, keyView, keyID, currentSelected),
            "Search": true,
            "key": keyView,
            "isWhiteHeader": true
        })
    }

    const viewItemList = (item, value, keyId, currentSelected) => {
        return (
            <View key={item.id} style={{
                flex: 1,
                paddingVertical: 12,
                borderBottomColor: colors.black_50,
                backgroundColor: item[keyId] == currentSelected[keyId] ? colorsWidget.mainOpacity : 'white',
                paddingHorizontal: 10
            }}>
                <Text style={{ textAlign: 'left', color: item[keyId] == currentSelected[keyId] ? colorsWidget.main : colorsWidget.textDropdown, }} >{item[value] || ''}</Text>
            </View>
        )
    }
    Utils.nlog('gia tri state', dataXeKhach)
    return (
        <View style={stTimXe.container} >
            <HeaderWidget
                title={'Tìm xe'}
                iconLeft={ImgWidget.icBack}
                onPressLeft={Go_Back}
                // iconRight={ImgWidget.icSearch}
                onPressRight={() => { }}
            />
            <View style={{ flexDirection: 'row', padding: 15, alignItems: 'center' }} >
                <DropWidget
                    hideLabel
                    value={selectedTinhThanhDi?.TenTinhThanh || dataFilter.TinhThanhDi.TenTinhThanh}
                    onPress={() => {
                        onPressChoose('TenTinhThanh', 'IDTinhThanh', selectedTinhThanhDi, setSelectedTinhThanhDi);
                    }}
                    style={stTimXe.vDrop}
                />
                <Image source={ImgWidget.icArrowRight} style={[nstyles.nIcon18, { marginHorizontal: 10 }]} />
                <DropWidget
                    hideLabel
                    value={selectedTinhThanhDen?.xTenTinhThanh || dataFilter.TinhThanhDen.TenTinhThanh}
                    // onPress={onPressPhuong}
                    onPress={() => {
                        onPressChoose('TenTinhThanh', 'IDTinhThanh', selectedTinhThanhDen, setSelectedTinhThanhDen);
                    }}
                    style={stTimXe.vDrop}
                />
            </View>
            <FlatList
                contentContainerStyle={{ paddingBottom: getBottomSpace() + 30 }}
                onRefresh={onRefresh}
                onScroll={() => {
                    onScroll.current = true;
                }}
                onEndReachedThreshold={0}
                refreshing={dataXeKhach.refreshing}
                data={dataXeKhach.data}
                onEndReached={onLoad_More}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                initialNumToRender={5} // Reduce initial render amount
                maxToRenderPerBatch={1} // Reduce number in each render batch
                updateCellsBatchingPeriod={100} // Increase time between renders
                windowSize={7} // Reduce the window size
            // ListFooterComponent={() => isLoading && <ActivityIndicator style={{ marginTop: 10 }} size={'small'} color={colors.redDark} />}
            />
            <IsLoading />
        </View>
    )
}

export default TimXe

const stTimXe = StyleSheet.create({
    container: {
        flex: 1
    },
    vDrop: {
        flex: 1,
        backgroundColor: colors.BackgroundHome,
        borderRadius: 4,
    }
})