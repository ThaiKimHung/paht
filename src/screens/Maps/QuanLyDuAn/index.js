import moment from 'moment'
import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform, Image, FlatList, ActivityIndicator } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { useSelector } from 'react-redux'
import Utils from '../../../../app/Utils'
import { ButtonCom, HeaderCus, IsLoading, ListEmpty } from '../../../../components'
import ButtonCus from '../../../../components/ComponentApps/ButtonCus'
import { colors } from '../../../../styles'
import { reSize, reText } from '../../../../styles/size'
import { heightHed, heightStatusBar, nstyles, paddingTopMul, Width } from '../../../../styles/styles'
import apis from '../../../apis'
import { Images } from '../../../images'
import ItemDuAn from './ItemDuAn'
import MapQLDuAn from './MapQLDuAn'
import * as Animatable from 'react-native-animatable'

const index = (props) => {
    const { isLandscape, colorLinear } = useSelector(state => state.theme)
    const { TenLoai = '', Id, AnhDaiDien = '' } = Utils.ngetParam({ props }, 'TypeExtention', {})
    const [isSearch, setIsSearch] = useState(false)
    const refSearch = React.useRef(null)
    const [selectBar, setSelectBar] = useState(true)

    const [dataMap, setDataMap] = useState([])
    const [keyWord, setKeyWord] = useState('')
    const refLoading = React.useRef(null)
    const [focusSearch, setFocusSearch] = useState(false)

    const [dataChuDauTu, setDataChuDauTu] = useState([])
    const [dataNguonVon, setDataNguonVon] = useState([])
    const [dataTinhTrang, setDataTinhTrang] = useState([])

    const [selectChuDauTu, setSelectChuDauTu] = useState({
        "Id": -1,
        "TenChuDauTu": "Tất cả",
    })
    const [selectNguonVon, setSelectNguonVon] = useState({
        "Id": -1,
        "LoaiNguonVon": "Tất cả"
    })
    const [selectTinhTrang, setSelectTinhTrang] = useState({
        "Id": -1,
        "TrangThai": "Tất cả",
        "Color": ""
    })
    const [selectNam, setSelectNam] = useState(moment().format('YYYY'))
    const [showFilter, setShowFilter] = useState(false)
    const [useFilter, setUseFilter] = useState(false)
    const [objectPage, setObjectPage] = useState({ "Page": 0, "AllPage": 0 })
    const [refreshing, setRefreshing] = useState(true)

    const objectFilter = {
        "sortOrder": "asc",
        "sortField": "id",
        "OrderBy": "id",
        "more": false,
        "filter.keys": 'keyword|IdChuDauTu|Nam|IdNguonVon|TinhTrang',
        "filter.vals": `||${moment().format('YYYY')}||`,
        "page": 1,
        "record": 10
    }

    useEffect(() => {
        loadInit()
    }, [])

    useEffect(() => {
        if (!showFilter) {
            setRefreshing(true)
            GetDuAn()
        }
    }, [selectNam, selectChuDauTu, selectNguonVon, selectTinhTrang, showFilter])

    useEffect(() => {
        if (selectChuDauTu?.Id != -1 || selectNguonVon?.Id != -1 || selectTinhTrang?.Id != -1 || selectNam != moment().format('YYYY')) {
            setUseFilter(true)
        } else {
            setUseFilter(false)
        }
    }, [selectNam, selectChuDauTu, selectNguonVon, selectTinhTrang])

    useEffect(() => {
        if (isSearch) {
            refSearch.current.focus()
        }
    }, [isSearch])

    const GetDuAn = async () => {
        let filter = {
            ...objectFilter,
            "filter.vals": `${keyWord}|${selectChuDauTu?.Id != -1 ? selectChuDauTu?.Id : ''}|${selectNam}|${selectNguonVon?.Id != -1 ? selectNguonVon?.Id : ''}|${selectTinhTrang?.Id != -1 ? selectTinhTrang?.Id : ''}`
        }
        // Utils.setToggleLoading(true)
        let res = await apis.ApiQLDuAn.GetList_DMDuAn_App(filter)
        Utils.nlog('[LOG] res list du an', res)
        // Utils.setToggleLoading(false)
        if (res.status == 1 && res?.data) {
            let dataMark = []
            dataMark = res?.data?.map(item => {
                return {
                    ...item,
                    location: {
                        latitude: item.Lat,
                        longitude: item.Long
                    },
                }
            })
            Utils.nlog('dataMark', dataMark)
            setDataMap(dataMark)
            setObjectPage(res.page)
            setRefreshing(false)
        } else {
            setDataMap([])
            setObjectPage({ "Page": 0, "AllPage": 0 })
            setRefreshing(false)
        }
    }

    const loadInit = async () => {
        Utils.setToggleLoading(true)
        GetChuDauTu()
        GetTinhTrang()
        GetNguonVon()
        GetDuAn()
        Utils.setToggleLoading(false)
    }

    const GetChuDauTu = async () => {
        let res = await apis.ApiQLDuAn.GetListChuDauTu()
        Utils.nlog('[LOG] res list chu dau tu', res)
        if (res.status == 1 && res.data) {
            setDataChuDauTu([selectChuDauTu, ...res?.data])
        } else {
            setDataChuDauTu([])
        }
    }

    const GetTinhTrang = async () => {
        let res = await apis.ApiQLDuAn.GetList_TrangThai()
        Utils.nlog('[LOG] res list trang thai', res)
        if (res.status == 1 && res.data) {
            setDataTinhTrang([selectTinhTrang, ...res?.data])
        } else {
            setDataTinhTrang([])
        }
    }

    const GetNguonVon = async () => {
        let res = await apis.ApiQLDuAn.GetList_NguonVon()
        Utils.nlog('[LOG] res list nguon von', res)
        if (res.status == 1 && res.data) {
            setDataNguonVon([selectNguonVon, ...res?.data])
        } else {
            setDataNguonVon([])
        }
    }

    const onChangeSearch = (text) => {
        setKeyWord(text)
    }

    const onSearch = () => {
        setIsSearch(!isSearch)
        setSelectBar(true)
        GetDuAn()
    }

    const _viewItem = (item, value) => {
        return (
            <View key={item.id} style={{
                flex: 1,
                paddingVertical: reText(14),
                borderBottomColor: colors.black_50,
            }}>
                <Text style={{ textAlign: 'center', color: colors.black_60 }} >{item[value]}</Text>
            </View>
        )
    }

    const ChooseChuDauTu = () => {
        Utils.goscreen({ props }, 'Modal_ComponentSelectBottom', {
            callback: (val) => setSelectChuDauTu(val),
            item: selectChuDauTu || '',
            title: 'Danh sách chủ đầu tư',
            AllThaoTac: dataChuDauTu || [],
            ViewItem: (item) => _viewItem(item, 'TenChuDauTu'), Search: true, key: 'TenChuDauTu'
        })
    }

    const ChooseNguonVon = () => {
        Utils.goscreen({ props }, 'Modal_ComponentSelectBottom', {
            callback: (val) => setSelectNguonVon(val),
            item: selectNguonVon || '',
            title: 'Nguồn vốn',
            AllThaoTac: dataNguonVon || [],
            ViewItem: (item) => _viewItem(item, 'LoaiNguonVon'), Search: true, key: 'LoaiNguonVon'
        })
    }

    const ChooseTinhTrang = () => {
        Utils.goscreen({ props }, 'Modal_ComponentSelectBottom', {
            callback: (val) => setSelectTinhTrang(val),
            item: selectTinhTrang || '',
            title: 'Tình trạng',
            AllThaoTac: dataTinhTrang || [],
            ViewItem: (item) => _viewItem(item, 'TrangThai'), Search: true, key: 'TrangThai'
        })
    }

    const TouchDrop = (props) => {
        const { itemSelected = '', placeholder = '', onPress, keySelectedView = '', label = 'label', style } = props
        return (
            <View style={[{ paddingTop: 3 }, style]}>
                <Text style={{ fontSize: reText(14), fontWeight: 'bold' }}>{label}</Text>
                <TouchableOpacity onPress={onPress} activeOpacity={0.5} style={{ padding: 10, backgroundColor: colors.white, borderRadius: 5, marginTop: 2, borderWidth: 0.5 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ flex: 1, paddingRight: 5, fontSize: reText(14) }} numberOfLines={1}>
                            {itemSelected && typeof itemSelected === "object" && keySelectedView ? itemSelected?.[keySelectedView] : itemSelected ? itemSelected : placeholder}</Text>
                        <Image source={Images.icDropDown} resizeMode='contain' style={nstyles.nIcon14} />
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    const GoDetails = (item) => {
        Utils.goscreen({ props }, 'Modal_ChiTietDuAn', { Id: item?.Id })
    }

    const renderItem = ({ item, index }) => {
        return (
            <ItemDuAn data={item} onPress={() => GoDetails(item)} />
        )
    }

    const onFilterDefault = () => {
        setRefreshing(true)
        setKeyWord('')
        setSelectChuDauTu({
            "Id": -1,
            "TenChuDauTu": "Tất cả",
        })
        setSelectNguonVon({
            "Id": -1,
            "LoaiNguonVon": "Tất cả"
        })
        setSelectTinhTrang({
            "Id": -1,
            "TrangThai": "Tất cả",
            "Color": ""
        })
        setSelectNam(moment().format('YYYY'))
        setShowFilter(false)
    }

    const HeaderFillter = () => {
        return (
            <View style={{ width: '100%', backgroundColor: colors.white }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 5 }}>
                    <Text style={{ color: colors.orangCB, fontWeight: 'bold', fontSize: reText(16) }}>Bộ lọc dự án</Text>
                    <TouchableOpacity onPress={() => setShowFilter(false)} activeOpacity={0.5} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Image source={Images.icClose} style={[nstyles.nIcon20, { tintColor: colors.orangCB }]} resizeMode='contain' />
                    </TouchableOpacity>
                </View>
                <TouchDrop
                    label={"Chủ đầu tư"}
                    onPress={ChooseChuDauTu}
                    placeholder={'- Tất cả -'}
                    itemSelected={selectChuDauTu}
                    keySelectedView={'TenChuDauTu'}
                />
                <TouchDrop
                    label={"Nguồn vốn"}
                    onPress={ChooseNguonVon}
                    placeholder={'- Tất cả -'}
                    itemSelected={selectNguonVon}
                    keySelectedView={'LoaiNguonVon'}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchDrop
                        label={"Năm"}
                        onPress={() => Utils.goscreen({ props }, 'Modal_YearPicker', { year: selectNam, callback: year => setSelectNam(year) })}
                        placeholder={selectNam}
                        itemSelected={selectNam}
                        keySelectedView={null}
                        style={{ flex: 1 }}
                    />
                    <View style={{ width: 5 }} />
                    <TouchDrop
                        label={"Tình trạng"}
                        onPress={ChooseTinhTrang}
                        placeholder={'- Tất cả -'}
                        itemSelected={selectTinhTrang}
                        keySelectedView={'TrangThai'}
                        style={{ flex: 1 }}
                    />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingTop: 10 }}>
                    <TouchableOpacity
                        onPress={onFilterDefault}
                        style={{
                            width: Width(25), paddingVertical: Width(3), backgroundColor: colors.black_50, justifyContent: 'center', alignItems: 'center',
                            borderRadius: 5,
                        }}>
                        <Text style={{ color: colors.white, fontSize: reText(13), fontWeight: 'bold' }}>Làm mới</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => { setShowFilter(false) }}
                        style={{
                            width: Width(25), paddingVertical: Width(3), backgroundColor: colors.yellowishOrange, justifyContent: 'center', alignItems: 'center',
                            borderRadius: 5,
                        }}>
                        <Text style={{ color: colors.white, fontSize: reText(13), fontWeight: 'bold' }}>Lọc</Text>
                    </TouchableOpacity>
                </View>

            </View>
        )
    }
    const HeaderUseFilter = () => {
        if ((useFilter || (keyWord.length > 0 && !isSearch))) {
            return (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10, alignItems: 'center' }}>
                    <Text style={{ color: colors.orangCB }}>Đang sử dụng bộ lọc hoặc tìm kiếm</Text>
                    <TouchableOpacity onPress={onFilterDefault} activeOpacity={0.5} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ color: colors.orangCB }}>Làm mới</Text>
                        <Image source={Images.icCloseBlack} style={[nstyles.nIcon20, { tintColor: colors.orangCB }]} resizeMode='contain' />
                    </TouchableOpacity>
                </View>
            )
        } else {
            return (
                <View />
            )
        }
    }

    const ListFooterComponent = () => {
        if (objectPage?.Page < objectPage?.AllPage)
            return <ActivityIndicator size='small' style={{ marginTop: 10 }} />;
        else return null
    }
    const loadMore = async () => {
        if (objectPage.Page < objectPage.AllPage) {
            let filter = {
                ...objectFilter,
                "filter.vals": `${keyWord}|${selectChuDauTu?.Id != -1 ? selectChuDauTu?.Id : ''}|${selectNam}|${selectNguonVon?.Id != -1 ? selectNguonVon?.Id : ''}|${selectTinhTrang?.Id != -1 ? selectTinhTrang?.Id : ''}`,
                "page": objectPage?.Page + 1,
            }
            let res = await apis.ApiQLDuAn.GetList_DMDuAn_App(filter)
            Utils.nlog('[LOG] loadmore', res)
            if (res.status == 1 && res?.data) {
                if (objectPage.Page != res.page.Page) {
                    let dataMark = []
                    dataMark = res?.data?.map(item => {
                        return {
                            ...item,
                            location: {
                                latitude: item.Lat,
                                longitude: item.Long
                            },
                        }
                    })
                    Utils.nlog('dataMark', dataMark)
                    let dataMore = [...dataMap, ...dataMark]
                    setDataMap(dataMore)
                    setObjectPage(res.page)
                }
            } else {
                setDataMap([])
                setObjectPage({ "Page": 0, "AllPage": 0 })
            }
        };
    }

    const onRefresh = () => {
        GetDuAn()
    }

    const renderList = () => {
        return (
            <View style={{ paddingTop: 60, flex: 1 }}>
                {HeaderUseFilter()}
                {
                    keyWord && !isSearch ?
                        <Text style={{ padding: 10 }}>Kết quả tìm kiếm: <Text style={{ fontWeight: 'bold', fontStyle: 'italic' }}>{keyWord}</Text></Text>
                        : null
                }
                <FlatList
                    renderItem={renderItem}
                    style={{ paddingHorizontal: 10 }}
                    contentContainerStyle={{ paddingBottom: 50 }}
                    data={dataMap}
                    ListEmptyComponent={<ListEmpty textempty={'Không có dữ liệu'} styleContainer={{ justifyContent: 'flex-start' }} />}
                    keyExtractor={(item, index) => index.toString()}
                    ListFooterComponent={ListFooterComponent}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.5}
                    // Performance settings
                    // removeClippedSubviews={true} // Unmount components when outside of window 
                    initialNumToRender={5} // Reduce initial render amount
                    maxToRenderPerBatch={1} // Reduce number in each render batch
                    updateCellsBatchingPeriod={100} // Increase time between renders
                    windowSize={7} // Reduce the window size
                />
            </View>
        )
    }

    return (
        <View style={stQuanLyDuAn.container}>
            {
                isSearch ?
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        colors={colorLinear.color}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingTop: Platform.OS == 'android' ? paddingTopMul() + heightStatusBar() : paddingTopMul(),
                            padding: 10
                        }}
                    >
                        <TextInput
                            ref={refSearch}
                            placeholder="Nhập dự án cần tìm..."
                            style={{
                                padding: Platform.OS == 'android' ? 5 : 10,
                                backgroundColor: '#FFFFFF',
                                borderRadius: 8,
                                flex: 1
                            }}
                            onFocus={() => setFocusSearch(true)}
                            onBlur={() => setFocusSearch(false)}
                            onChangeText={onChangeSearch}
                            onSubmitEditing={() => onSearch()}
                        />
                        <TouchableOpacity activeOpacity={0.5} onPress={onSearch} style={{ padding: 5, paddingHorizontal: 10 }}>
                            {/* <Text style={{ padding: 5, color: colors.white, fontWeight: 'bold' }}>Đóng</Text> */}
                            <Image source={Images.icSearch} style={[nstyles.nIcon22, { tintColor: colors.white }]} resizeMode='contain' />
                        </TouchableOpacity>
                    </LinearGradient>
                    :
                    <HeaderCus
                        Sleft={{ tintColor: 'white' }}
                        onPressLeft={() => Utils.goback(this)}
                        iconLeft={Images.icBack}
                        title={'Quản lý dự án'}
                        styleTitle={{ color: colors.white }}
                        iconRight={Images.icSearch}
                        onPressRight={() => setIsSearch(true)}
                        Sright={{ tintColor: 'white' }}
                    />

            }
            <View style={stQuanLyDuAn.body}>
                {
                    selectBar ?
                        renderList() :
                        <MapQLDuAn dataMap={dataMap} />
                }
                <View style={stQuanLyDuAn.topBar}>
                    <TouchableOpacity onPress={() => setSelectBar(true)} style={stQuanLyDuAn.itemTopbar}>
                        <Image source={Images.icListExtention} resizeMode='contain' style={[nstyles.nIcon20, { tintColor: selectBar ? colorLinear.color[0] : null }]} />
                        <Text style={{ fontWeight: selectBar ? 'bold' : 'normal', marginLeft: 5, color: selectBar ? colorLinear.color[0] : null }}>Danh sách</Text>
                    </TouchableOpacity>
                    <View style={stQuanLyDuAn.rowBar} />
                    <TouchableOpacity onPress={() => setSelectBar(false)} style={stQuanLyDuAn.itemTopbar}>
                        <Image source={Images.icLocationExtention} resizeMode='contain' style={[nstyles.nIcon20, { tintColor: !selectBar ? colorLinear.color[0] : null }]} />
                        <Text style={{ fontWeight: !selectBar ? 'bold' : 'normal', marginLeft: 5, color: !selectBar ? colorLinear.color[0] : null }}>Bản đồ</Text>
                    </TouchableOpacity>
                </View>
                {
                    selectBar && <TouchableOpacity onPress={() => { setShowFilter(true) }}
                        style={{
                            position: 'absolute', bottom: 50, right: 10, backgroundColor: colors.blueFaceBook,
                            alignItems: 'center', justifyContent: 'center', padding: 15, borderRadius: 25
                        }}>

                        <Image source={Images.icFilter} resizeMode='contain' style={[nstyles.nIcon20, { tintColor: colors.white }]} />
                    </TouchableOpacity>
                }
            </View>
            <IsLoading ref={refLoading} />
            {
                showFilter && <View style={stQuanLyDuAn.topBarFilter}>
                    <Animatable.View animation={'fadeInDown'} style={{ margin: 10, padding: 10, backgroundColor: colors.white, borderRadius: 10 }}>
                        {HeaderFillter()}
                    </Animatable.View>
                </View>
            }
        </View>
    )
}

const stQuanLyDuAn = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: colors.BackgroundHome
    },
    body: { flex: 1 },
    topBar: {
        flexDirection: 'row', alignItems: 'center',
        position: 'absolute', top: 0, left: 0, right: 0,
        margin: 10, backgroundColor: colors.white,
        ...nstyles.shadow, borderRadius: 5, zIndex: 1
    },
    itemTopbar: {
        flex: 1, alignItems: 'flex-end',
        padding: 10, flexDirection: 'row', justifyContent: "center"
    },
    rowBar: {
        width: 0.5, backgroundColor: colors.grayLight,
        height: '70%'
    },
    cluster: {
        backgroundColor: colors.redStar, width: reSize(25), height: reSize(25), borderWidth: 1, borderColor: colors.white,
        padding: 2, borderRadius: reSize(25) / 2, alignItems: 'center', justifyContent: 'center'
    },
    detailsMarker: {
        flexDirection: 'row', backgroundColor: colors.white, padding: 10,
        borderRadius: 10, margin: 5,
    },
    drawLine: { width: 1, backgroundColor: colors.black_20, height: '100%' },
    header: { position: 'absolute', top: 0, left: 0, right: 0 },
    selectedMark: {
        position: 'absolute', top: 60, left: 0, right: 0
    },
    topBarFilter: {
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: colors.backgroundModal,
        ...nstyles.shadow, borderRadius: 5, paddingTop: Platform.OS == 'android' ? heightHed() + heightStatusBar() / 2 : heightHed(),
        zIndex: 2
    },
})

export default index
