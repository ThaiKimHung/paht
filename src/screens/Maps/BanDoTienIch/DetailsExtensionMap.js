import React, { useState, useEffect, useMemo, Fragment } from 'react'
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image, Platform, TextInput } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { useSelector } from 'react-redux'
import { appConfig } from '../../../../app/Config'
import Utils from '../../../../app/Utils'
import { HeaderCus, IsLoading, ListEmpty } from '../../../../components'
import ImageCus from '../../../../components/ImageCus'
import { colors } from '../../../../styles'
import { reSize, reText } from '../../../../styles/size'
import { heightStatusBar, nheight, nstyles, nwidth, paddingTopMul } from '../../../../styles/styles'
import { Images } from '../../../images'
import apis from '../../../apis'
import MapExtentions from './MapExtentions'
import ItemExtentionLocation from './ItemExtentionLocation'

let LATITUDE_DELTA = () => 200 / nheight();
let LONGITUDE_DELTA = () => LATITUDE_DELTA() * nwidth() / nheight();

const DetailsExtensionMap = (props) => {
    const { isLandscape, colorLinear } = useSelector(state => state.theme)
    // const { TenLoai = '', Id, AnhDaiDien = '' } = Utils.ngetParam({ props }, 'TypeExtention', {})
    const [isSearch, setIsSearch] = useState(false)
    const refSearch = React.useRef(null)
    const [selectBar, setSelectBar] = useState(true)

    const [dataMap, setDataMap] = useState([])
    const [keyWord, setKeyWord] = useState('')
    const refLoading = React.useRef(null)
    const [focusSearch, setFocusSearch] = useState(false)
    const { DanhSachLoaiTienIch = [], TenNhom = '' } = Utils.ngetParam({ props }, 'Extention', {})
    const [TypeExtention, setTypeExtention] = useState('')

    // useEffect(() => {
    //     if (focusSearch || isSearch) {
    //         setSelectBar(true)
    //     }
    // }, [focusSearch, isSearch])

    useEffect(() => {
        if (DanhSachLoaiTienIch.length > 0) {
            setTypeExtention(DanhSachLoaiTienIch[0])
        }
    }, [DanhSachLoaiTienIch])

    useEffect(() => {
        GetTienIchTheoLoaiTienIch()
    }, [TypeExtention])

    const GetTienIchTheoLoaiTienIch = async (reLoad = false) => {
        refLoading.current.show()
        setDataMap([])
        let res = await apis.ApiApp.GetTienIchTheoLoaiTienIch(TypeExtention?.Id, reLoad ? '' : keyWord)
        Utils.nlog('[LOG] res data', res)
        if (res.status == 1 && res.data) {
            let dataMark = []
            dataMark = res.data.map(item => {
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
            refLoading.current.hide()
        } else {
            refLoading.current.hide()
            setDataMap([])
        }
    }

    useEffect(() => {
        if (isSearch) {
            refSearch.current.focus()
        }
    }, [isSearch])

    const onChangeSearch = (text) => {
        setKeyWord(text)
    }

    const onDeleteSearch = () => {
        setKeyWord('')
        GetTienIchTheoLoaiTienIch(true)
    }

    const renderList = () => {
        return (
            <View style={{ paddingTop: 60, flex: 1 }}>
                {
                    keyWord && !isSearch ?
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, paddingBottom: 10 }}>
                            <Text style={{ flex: 1 }}>Kết quả tìm kiếm: <Text style={{ fontWeight: 'bold', fontStyle: 'italic' }}>{keyWord}</Text></Text>
                            <TouchableOpacity onPress={onDeleteSearch}>
                                <Text style={{ color: colors.orange }}>{'Xoá tìm kiếm'}</Text>
                            </TouchableOpacity>
                        </View>
                        : null
                }
                {
                    dataMap.length > 0 ? <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }} style={{ paddingHorizontal: 10 }}>
                        {dataMap.map((item, index) => {
                            return (
                                <Fragment key={index}>
                                    <ItemExtentionLocation keyComp={index} onPress={() => { Utils.goscreen({ props }, 'DetailsLocations', { data: item }) }} data={item} />
                                </Fragment>
                            )
                        })}
                    </ScrollView>
                        : <ListEmpty textempty={'Không có dữ liệu'} styleContainer={{ justifyContent: 'flex-start' }} />
                }
            </View>
        )
    }

    const onSearch = () => {
        setIsSearch(!isSearch)
        setSelectBar(true)
        GetTienIchTheoLoaiTienIch()
    }

    const onCancelSearch = () => {
        setIsSearch(!isSearch)
        setSelectBar(true)
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
    const onChangeExtention = () => {
        Utils.goscreen({ props }, 'Modal_ComponentSelectBottom', {
            callback: (val) => setTypeExtention(val), item: TypeExtention,
            AllThaoTac: DanhSachLoaiTienIch, ViewItem: (item) => _viewItem(item, 'TenLoai'), Search: true,
            title: 'Danh sách loại tiện ích', key: 'TenLoai'
        })
    }

    const DropListExtention = () => {
        return (
            <TouchableOpacity onPress={onChangeExtention} activeOpacity={0.5} style={{
                flex: 1, backgroundColor: 'white', flexDirection: 'row',
                alignItems: 'center', height: '85%', marginBottom: 5,
                justifyContent: 'space-between', paddingHorizontal: 10,
                borderRadius: 5
            }}>
                <Text style={{ flex: 1 }} numberOfLines={1}>{TypeExtention?.TenLoai || 'Không có dữ liệu'}</Text>
                <Image source={Images.icDropDown} resizeMode='contain' style={nstyles.nIcon14} />
            </TouchableOpacity>
        )
    }

    return (
        <View style={stDetailsExtensionMap.container}>
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
                            placeholder="Nhập địa điểm cần tìm..."
                            style={{
                                padding: Platform.OS == 'android' ? 4 : 8,
                                backgroundColor: '#FFFFFF',
                                borderRadius: 5,
                                flex: 1
                            }}
                            onFocus={() => setFocusSearch(true)}
                            onBlur={() => setFocusSearch(false)}
                            onChangeText={onChangeSearch}
                            onSubmitEditing={() => onSearch()}
                        />
                        {keyWord.length > 0 ?
                            <TouchableOpacity activeOpacity={0.5} onPress={onSearch} style={{ width: reSize(50), padding: 5, paddingHorizontal: 10 }}>
                                {/* <Text style={{ padding: 5, color: colors.white, fontWeight: 'bold' }}>Đóng</Text> */}
                                <Image source={Images.icSearch} style={[nstyles.nIcon22, { tintColor: colors.white }]} resizeMode='contain' />
                            </TouchableOpacity> : <TouchableOpacity activeOpacity={0.5} onPress={onCancelSearch} style={{ width: reSize(50), padding: 5, paddingHorizontal: 10 }}>
                                <Text style={{ color: colors.white, fontWeight: 'bold' }}>Huỷ</Text>
                            </TouchableOpacity>
                        }

                    </LinearGradient>
                    :
                    <HeaderCus
                        Sleft={{ tintColor: 'white' }}
                        onPressLeft={() => Utils.goback(this)}
                        iconLeft={Images.icBack}
                        iconRight={Images.icSearch}
                        onPressRight={() => setIsSearch(true)}
                        Sright={{ tintColor: 'white' }}
                        componentTitle={DropListExtention()}
                    />

            }
            <View style={stDetailsExtensionMap.body}>
                {
                    selectBar ?
                        renderList() :
                        <MapExtentions dataMap={dataMap} />

                }
                <View style={stDetailsExtensionMap.topBar}>
                    <TouchableOpacity onPress={() => setSelectBar(true)} style={stDetailsExtensionMap.itemTopbar}>
                        <Image source={Images.icListExtention} resizeMode='contain' style={[nstyles.nIcon20, { tintColor: selectBar ? colorLinear.color[0] : null }]} />
                        <Text style={{ fontWeight: selectBar ? 'bold' : 'normal', marginLeft: 5, color: selectBar ? colorLinear.color[0] : null }}>Danh sách</Text>
                    </TouchableOpacity>
                    <View style={stDetailsExtensionMap.rowBar} />
                    <TouchableOpacity onPress={() => setSelectBar(false)} style={stDetailsExtensionMap.itemTopbar}>
                        <Image source={Images.icLocationExtention} resizeMode='contain' style={[nstyles.nIcon20, { tintColor: !selectBar ? colorLinear.color[0] : null }]} />
                        <Text style={{ fontWeight: !selectBar ? 'bold' : 'normal', marginLeft: 5, color: !selectBar ? colorLinear.color[0] : null }}>Bản đồ</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <IsLoading ref={refLoading} />
        </View>
    )
}

export default DetailsExtensionMap

const stDetailsExtensionMap = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: colors.BackgroundHome
    },
    body: { flex: 1 },
    topBar: {
        flexDirection: 'row', alignItems: 'center',
        position: 'absolute', top: 0, left: 0, right: 0,
        margin: 10, backgroundColor: colors.white,
        ...nstyles.shadow, borderRadius: 5
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
    }
})
