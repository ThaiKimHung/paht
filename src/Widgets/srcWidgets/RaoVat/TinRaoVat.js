import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from 'react-native'
import React, { useState, useEffect, useImperativeHandle, useMemo } from 'react'
import { ButtonWidget, DropWidget, EmptyWidgets } from '../../CompWidgets'
import { colorsWidget, colors } from '../../../../styles/color'
import { FlatList, ScrollView } from 'react-navigation'
import Utils from "../../../../app/Utils";
import { ApiRaoVat } from '../../apis'
import { onChangeDropdown } from './DangTin/HandlerDangTin'
import ItemRaoVat from './ItemRaoVat'
import { useDispatch, useSelector } from 'react-redux'
import { loadListTinRaoVat, saveTinRaoVat, setDataTinRaoVat, setPageTinRaoVat, setRefreshingTinRaoVat } from '../../../../srcRedux/actions/widgets'
import TextApp from '../../../../components/TextApp'
import { Images } from '../../../images'
import { nstyles } from '../../../../styles/styles'
import { reText } from '../../../../styles/size'

const KEY_COMP = {
    TINH: 'TINH',
    QUAN: 'QUAN',
    PHUONG: 'PHUONG',
    MUCGIA: 'MUCGIA',
    DANHMUC: 'DANHMUC',
    TINHTRANG: 'TINHTRANG',
}
const TinRaoVat = (props) => {
    const {
        LstTinRaoVat = [],
        RefreshingTinRaoVat = true,
        PageTinRaoVat = { Page: 1, AllPage: 1 }
    } = useSelector(state => state.Widgets)
    const dispatch = useDispatch()
    const [selectedTinh, setSelectedTinh] = useState('')
    const [dataTinh, setDataTinh] = useState([])
    const [selectedMucGia, setSelectedMucGia] = useState('')
    const [dataMucGia, setDataMucGia] = useState([])
    const [selectedDanhMuc, setSelectedDanhMuc] = useState('')
    const [dataDanhMuc, setDataDanhMuc] = useState([])
    const [selectedTinhTrang, setSelectedTinhTrang] = useState('')
    // const [dataTinhTrang, setDataTinhTrang] = useState([])
    const [dataTinhTrang, setDataTinhTrang] = useState([
        {
            IdTinhTrang: -1,
            TinhTrang: 'Tất cả'
        },
        {
            IdTinhTrang: 1,
            TinhTrang: 'Mới'
        },
        {
            IdTinhTrang: 2,
            TinhTrang: 'Đã qua sử dụng'
        }
    ])

    useEffect(() => {
        getInit()
    }, [])

    useEffect(() => {
        onRefresh()
    }, [selectedTinh, selectedMucGia, selectedDanhMuc, selectedTinhTrang, props?.textSearch])

    const getData = async (isNext = false) => {
        let objFilter = {
            "IdTinhThanh": selectedTinh?.IDTinhThanh == -1 ? '' : selectedTinh?.IDTinhThanh || '',
            "IdDanhMuc": selectedDanhMuc?.IdDanhMuc == -1 ? '' : selectedDanhMuc?.IdDanhMuc || '',
            "TinhTrang": selectedTinhTrang?.IdTinhTrang == -1 ? '' : selectedTinhTrang?.IdTinhTrang || '',
            "IdMucGia": selectedMucGia?.IdMucGia == -1 ? '' : selectedMucGia?.IdMucGia || '',
            "keyword": props?.textSearch || ''
        }
        let keyFilter = '', valFilter = ''
        for (const property in objFilter) {
            keyFilter += `${property}|`
            valFilter += `${objFilter[property]}|`
        }
        console.log('objfilter', keyFilter, valFilter)
        dispatch(loadListTinRaoVat(isNext, keyFilter, valFilter))
    }


    const onDropdownTinhTrang = () => {
        onChangeDropdown({
            title_drop: 'Tình trạng',
            keyView: 'TinhTrang',
            currentSelected: selectedTinhTrang,
            data: dataTinhTrang,
            keyID: 'IdTinhTrang',
            isWhiteHeader: true
        }, itemSelected => {
            setSelectedTinhTrang(itemSelected)
        })
    }
    const getInit = async () => {
        let resTinh = await ApiRaoVat.GetAllListDMTinhThanh()
        let resMucGia = await ApiRaoVat.GetList_AllMucGia()
        let resDanhMuc = await ApiRaoVat.GetList_AllDanhMuc()
        console.log('[LOG] res tinh', resTinh)
        console.log('[LOG] res muc gia', resMucGia)
        console.log('[LOG] res danh muc', resDanhMuc)
        //Load data tinh
        if (resTinh.status == 1)
            setDataTinh([{ IDTinhThanh: -1, TenTinhThanh: "Tất cả" }, ...resTinh?.data])
        else
            setDataTinh([])

        //Load data muc gia
        if (resMucGia.status == 1)
            setDataMucGia([{ IdMucGia: -1, MucGia: "Tất cả" }, ...resMucGia?.data])
        else
            setDataMucGia([])

        //Load data danh muc
        if (resDanhMuc.status == 1)
            setDataDanhMuc([{ IdDanhMuc: -1, DanhMuc: "Tất cả" }, ...resDanhMuc?.data])
        else
            setDataDanhMuc([])
    }

    function renderFilter() {
        return (
            <>
                <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', paddingVertical: 5, paddingHorizontal: 12, justifyContent: 'flex-start' }}>
                    <DropWidget
                        placeholder={'Dropdown'}
                        value={selectedTinh?.TenTinhThanh || 'Tất cả'}
                        onPress={onPressTinh}
                        style={{
                            borderWidth: 0,
                            paddingVertical: 8,
                            flexDirection: 'row',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            justifyContent: 'flex-start'
                        }}
                        label={'Khu vực:'}
                        styleIcon={{ marginLeft: 10 }}
                        styleValue={{ flex: 0 }}
                    />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 0, paddingHorizontal: 10 }}>
                    <DropWidget
                        placeholder={'Dropdown'}
                        value={selectedMucGia?.IdMucGia == -1 ? 'Mức giá (tất cả)' : selectedMucGia?.MucGia || 'Mức giá'}
                        onPress={onPressMucGia}
                        style={stTinRaoVat.dropdownFilter}
                        hideLabel
                        styleValue={{ fontSize: reText(13) }}
                    />
                    <DropWidget
                        placeholder={'Dropdown'}
                        value={selectedDanhMuc?.IdDanhMuc == -1 ? 'Danh mục (tất cả)' : selectedDanhMuc?.DanhMuc || 'Danh mục'}
                        onPress={onPressDanhMuc}
                        style={stTinRaoVat.dropdownFilter}
                        hideLabel
                        styleValue={{ fontSize: reText(13) }}
                    />
                    {useMemo(() => <DropWidget
                        placeholder={'Chọn tình trạng'}
                        value={selectedTinhTrang?.IdTinhTrang == -1 ? 'Tình trạng (tất cả)': selectedTinhTrang?.TinhTrang || 'Tình Trạng'}
                        style={stTinRaoVat.dropdownFilter}
                        onPress={onDropdownTinhTrang}
                        hideLabel
                        styleValue={{ fontSize: reText(13) }}
                    />, [selectedTinhTrang, dataTinhTrang])}
                </View>
                {props?.textSearch && props?.textSearch?.length > 0 ?
                    <View style={{ paddingHorizontal: 15, paddingTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <TextApp style={{
                            color: colorsWidget.main, fontStyle: 'italic', flex: 1
                        }} numberOfLines={1}>
                            {`Kết quả tìm kiếm: ${props?.textSearch}`}</TextApp>
                        <TouchableOpacity onPress={() => { props?.reloadSearch() }} style={{ paddingLeft: 10 }}>
                            <Image source={Images.icClose} style={[nstyles.nIcon14, { tintColor: colorsWidget.main }]} />
                        </TouchableOpacity>
                    </View>
                    : null
                }
            </>
        )
    }

    const onGoDetails = (item) => {
        Utils.navigate('scChiTietTinRaoVat', { IdTinRaoVat: item?.IdTinRaoVat })
    }

    const onPressSaved = (item) => {
        dispatch(saveTinRaoVat(item, !item?.DaLuu))
    }

    const renderItem = ({ item }) => (
        <ItemRaoVat
            dataItem={item}
            onPress={() => onGoDetails(item)}
            onPressLike={() => onPressSaved(item)}
            showTrangThaiHienThi
        />
    );

    const onRefresh = () => {
        dispatch(setPageTinRaoVat({ Page: 1, AllPage: 1 }))
        dispatch(setRefreshingTinRaoVat(true))
        dispatch(setDataTinRaoVat([]))
        getData()
    }

    const _ListFooterComponent = () => {
        return PageTinRaoVat.Page < PageTinRaoVat.AllPage ? <ActivityIndicator size='small' style={{ marginVertical: 10 }} /> : null;
    }

    const loadMore = async () => {
        if (PageTinRaoVat.Page < PageTinRaoVat.AllPage) {
            getData(true)
        }
    }

    function renderListRaoVat() {
        return <View style={{ flex: 1, paddingTop: 10 }}>
            <FlatList
                contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 15, flex: LstTinRaoVat.length > 0 ? null : 1 }}
                data={LstTinRaoVat}
                renderItem={renderItem}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                keyExtractor={(item, index) => index.toString()}
                refreshing={RefreshingTinRaoVat}
                onRefresh={onRefresh}
                onEndReached={loadMore}
                onEndReachedThreshold={0.1}
                ListFooterComponent={_ListFooterComponent}
                ListEmptyComponent={<EmptyWidgets style={{ flex: 1, justifyContent: 'center' }} textEmpty={RefreshingTinRaoVat ? 'Đang tải...' : 'Không có dữ liệu'} />}
            />
        </View>
    }
    const viewItemList = (item, value, keyId, currentSelected) => {
        // Utils.nlog('Log [item]', item, value, keyId, currentSelected)
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

    const changeData = (key, val) => {
        switch (key) {
            case KEY_COMP.TINH:
                setSelectedTinh(val)
                break;
            case KEY_COMP.DANHMUC:
                setSelectedDanhMuc(val)
                break;
            case KEY_COMP.MUCGIA:
                setSelectedMucGia(val)
                break;
            case KEY_COMP.TINHTRANG:
                setSelectedTinhTrang(val)
                break;
            default:
                break;
        }
    }

    const onPressChoose = (config) => {
        const { title_drop = 'Danh sách', keyView = '', key, currentSelected, data = [], keyID, isWhiteHeader } = config
        Utils.navigate('Modal_ComponentSelectBottom', {
            callback: (val) => changeData(key, val),
            "item": currentSelected || {},
            "title": title_drop,
            "AllThaoTac": data || [],
            "ViewItem": (item, currentSelected) => viewItemList(item, keyView, keyID, currentSelected),
            "Search": true,
            "key": keyView,
            "isWhiteHeader": isWhiteHeader
        })
    }
    const onPressTinh = () => {
        onPressChoose({
            title_drop: 'Khu vực tỉnh thành',
            keyView: 'TenTinhThanh',
            key: KEY_COMP.TINH,
            currentSelected: selectedTinh,
            data: dataTinh,
            keyID: 'IDTinhThanh',
            isWhiteHeader: true,
        })
    }

    const onPressMucGia = () => {
        onPressChoose({
            title_drop: 'Mức giá',
            keyView: 'MucGia',
            key: KEY_COMP.MUCGIA,
            currentSelected: selectedMucGia,
            data: dataMucGia,
            keyID: 'IdMucGia',
            isWhiteHeader: true
        })
    }

    const onPressDanhMuc = () => {
        onPressChoose({
            title_drop: 'Danh mục',
            keyView: 'DanhMuc',
            key: KEY_COMP.DANHMUC,
            currentSelected: selectedDanhMuc,
            data: dataDanhMuc,
            keyID: 'IdDanhMuc',
            isWhiteHeader: true
        })
    }

    return (
        <View style={{ flex: 1 }}>
            {/* {render filter} */}
            {renderFilter()}
            {/* {render danh sách rao vặt} */}
            {renderListRaoVat()}
        </View >

    )
}

const stTinRaoVat = StyleSheet.create({
    dropdownFilter: {
        flex: 1,
        paddingVertical: 8,
        padding: 10,
        marginHorizontal: 2
    }
})


export default TinRaoVat